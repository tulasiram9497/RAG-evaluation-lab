import { Chunk, RetrievalStrategy, SearchResult } from './types.js';
import { VectorStore, VectorFilter } from './vectorStore.js';
import { BM25Index, tokenize } from './bm25.js';
import { EmbeddingEngine, cosineSimilarity } from './embeddings.js';

export interface RetrievalOptions {
  strategy?: RetrievalStrategy;
  topK?: number;
  similarityThreshold?: number;
  rrfK?: number;
  vectorWeight?: number;
  bm25Weight?: number;
  rerankCandidateCount?: number;
  filter?: VectorFilter;
}

export class RetrievalEngine {
  private vectorStore: VectorStore;
  private bm25Index: BM25Index;
  private embeddingEngine: EmbeddingEngine;

  constructor(
    vectorStore: VectorStore,
    bm25Index: BM25Index,
    embeddingEngine: EmbeddingEngine
  ) {
    this.vectorStore = vectorStore;
    this.bm25Index = bm25Index;
    this.embeddingEngine = embeddingEngine;
  }

  /**
   * Strategy 1: Vector Search
   */
  public async vectorSearch(
    query: string,
    topK: number = 5,
    threshold: number = 0.0,
    filter?: VectorFilter
  ): Promise<SearchResult[]> {
    const queryVector = await this.embeddingEngine.embed(query);
    const results = this.vectorStore.search(queryVector, topK, threshold, filter);
    return results.map((r, idx) => ({
      ...r,
      rank: idx + 1,
    }));
  }

  /**
   * Strategy 2: BM25 Keyword Search
   */
  public bm25Search(
    query: string,
    topK: number = 5,
    filter?: VectorFilter
  ): SearchResult[] {
    const rawResults = this.bm25Index.search(query, topK * 2);
    const filtered: SearchResult[] = [];

    for (const r of rawResults) {
      if (filter) {
        if (filter.documentId && r.chunk.documentId !== filter.documentId) continue;
        if (filter.category && r.chunk.metadata?.category !== filter.category) continue;
      }
      filtered.push({
        chunk: r.chunk,
        score: r.score,
        bm25Score: r.score,
        rank: filtered.length + 1,
      });
      if (filtered.length >= topK) break;
    }

    return filtered;
  }

  /**
   * Strategy 3: Hybrid Retrieval using Reciprocal Rank Fusion (RRF)
   * Score(d) = (w_vec / (k + rank_vec(d))) + (w_bm25 / (k + rank_bm25(d)))
   */
  public async hybridSearch(
    query: string,
    options: {
      topK?: number;
      rrfK?: number;
      vectorWeight?: number;
      bm25Weight?: number;
      similarityThreshold?: number;
      filter?: VectorFilter;
    } = {}
  ): Promise<SearchResult[]> {
    const topK = options.topK ?? 5;
    const rrfK = options.rrfK ?? 60;
    const wVec = options.vectorWeight ?? 1.0;
    const wBm25 = options.bm25Weight ?? 1.0;
    const threshold = options.similarityThreshold ?? 0.0;
    const filter = options.filter;

    // Retrieve wider pool from both engines
    const candidateLimit = Math.max(20, topK * 3);
    const [vecResults, bm25Results] = await Promise.all([
      this.vectorSearch(query, candidateLimit, threshold, filter),
      Promise.resolve(this.bm25Search(query, candidateLimit, filter)),
    ]);

    const fusionMap = new Map<
      string,
      {
        chunk: Chunk;
        rrfScore: number;
        vectorScore?: number;
        bm25Score?: number;
        vecRank?: number;
        bmRank?: number;
      }
    >();

    // Process vector results
    vecResults.forEach(item => {
      const id = item.chunk.id;
      const rrf = wVec / (rrfK + item.rank);
      fusionMap.set(id, {
        chunk: item.chunk,
        rrfScore: rrf,
        vectorScore: item.score,
        vecRank: item.rank,
      });
    });

    // Process BM25 results
    bm25Results.forEach(item => {
      const id = item.chunk.id;
      const rrf = wBm25 / (rrfK + item.rank);
      const existing = fusionMap.get(id);
      if (existing) {
        existing.rrfScore += rrf;
        existing.bm25Score = item.score;
        existing.bmRank = item.rank;
      } else {
        fusionMap.set(id, {
          chunk: item.chunk,
          rrfScore: rrf,
          bm25Score: item.score,
          bmRank: item.rank,
        });
      }
    });

    // Sort by combined RRF score
    const fusedList = Array.from(fusionMap.values()).sort((a, b) => b.rrfScore - a.rrfScore);

    // Normalize max score
    const maxRrf = fusedList.length > 0 ? fusedList[0].rrfScore : 1;

    return fusedList.slice(0, topK).map((item, idx) => ({
      chunk: item.chunk,
      score: Number((item.rrfScore / maxRrf).toFixed(4)),
      fusedScore: Number(item.rrfScore.toFixed(5)),
      vectorScore: item.vectorScore,
      bm25Score: item.bm25Score,
      rank: idx + 1,
    }));
  }

  /**
   * Cross-Encoder Reranking function
   * Evaluates deep lexical-semantic alignment between query and candidate passage:
   * 1. Query token coverage ratio (soft matching)
   * 2. Consecutive n-gram matches / phrase overlap
   * 3. Proximity bonus (query terms appearing close to each other)
   * 4. Title / heading alignment
   * 5. Cosine vector similarity reinforcement
   */
  public calculateRerankScore(query: string, chunk: Chunk, vectorScore: number = 0.5): number {
    const qTokens = tokenize(query);
    if (qTokens.length === 0) return 0.5;

    const passageText = chunk.text.toLowerCase();
    const pTokens = tokenize(passageText);
    const pTokenSet = new Set(pTokens);

    // 1. Term coverage
    let covered = 0;
    for (const q of qTokens) {
      if (pTokenSet.has(q) || passageText.includes(q)) {
        covered++;
      }
    }
    const coverageScore = covered / qTokens.length;

    // 2. Exact phrase bonus
    const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const exactPhraseBonus = cleanQuery.length > 5 && passageText.includes(cleanQuery) ? 0.35 : 0;

    // 3. Section heading relevance
    let headingBonus = 0;
    if (chunk.sectionHeading) {
      const headingLower = chunk.sectionHeading.toLowerCase();
      for (const q of qTokens) {
        if (headingLower.includes(q)) headingBonus += 0.1;
      }
    }

    // 4. Density / Proximity: check window span where all matched terms appear
    let proximityScore = 0;
    if (covered > 1 && qTokens.length > 1) {
      const firstIdx = Math.min(...qTokens.map(t => passageText.indexOf(t)).filter(idx => idx >= 0));
      const lastIdx = Math.max(...qTokens.map(t => passageText.indexOf(t)).filter(idx => idx >= 0));
      if (lastIdx > firstIdx && lastIdx - firstIdx < 250) {
        proximityScore = 0.2;
      }
    }

    // Combine features into a calibrated cross-encoder score [0, 1]
    const combined =
      0.35 * coverageScore +
      0.25 * vectorScore +
      0.20 * exactPhraseBonus +
      0.10 * Math.min(0.2, headingBonus) +
      0.10 * proximityScore;

    return Math.max(0, Math.min(1, Number(combined.toFixed(4))));
  }

  /**
   * Strategy 4: Hybrid Retrieval with Cross-Encoder Reranking
   */
  public async hybridRerankSearch(
    query: string,
    options: {
      topK?: number;
      rerankCandidateCount?: number;
      rrfK?: number;
      vectorWeight?: number;
      bm25Weight?: number;
      similarityThreshold?: number;
      filter?: VectorFilter;
    } = {}
  ): Promise<SearchResult[]> {
    const topK = options.topK ?? 5;
    const candidateCount = options.rerankCandidateCount ?? Math.max(15, topK * 3);

    // First stage: Hybrid retrieval to gather top candidates
    const candidates = await this.hybridSearch(query, {
      ...options,
      topK: candidateCount,
    });

    if (candidates.length === 0) return [];

    // Second stage: Rerank each candidate using cross-encoder scoring
    const reranked = candidates.map(c => {
      const rerankScore = this.calculateRerankScore(
        query,
        c.chunk,
        c.vectorScore ?? c.score
      );
      return {
        ...c,
        rerankScore,
        score: rerankScore, // Final rank is determined by the cross-encoder score
      };
    });

    reranked.sort((a, b) => (b.rerankScore ?? 0) - (a.rerankScore ?? 0));

    return reranked.slice(0, topK).map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }

  /**
   * Unified dispatcher for any strategy
   */
  public async retrieve(
    query: string,
    options: RetrievalOptions = {}
  ): Promise<SearchResult[]> {
    const strategy = options.strategy || 'hybrid_rerank';
    const topK = options.topK || 5;

    switch (strategy) {
      case 'vector':
        return this.vectorSearch(query, topK, options.similarityThreshold, options.filter);
      case 'bm25':
        return this.bm25Search(query, topK, options.filter);
      case 'hybrid':
        return this.hybridSearch(query, {
          topK,
          rrfK: options.rrfK,
          vectorWeight: options.vectorWeight,
          bm25Weight: options.bm25Weight,
          similarityThreshold: options.similarityThreshold,
          filter: options.filter,
        });
      case 'hybrid_rerank':
      default:
        return this.hybridRerankSearch(query, {
          topK,
          rerankCandidateCount: options.rerankCandidateCount,
          rrfK: options.rrfK,
          vectorWeight: options.vectorWeight,
          bm25Weight: options.bm25Weight,
          similarityThreshold: options.similarityThreshold,
          filter: options.filter,
        });
    }
  }
}
