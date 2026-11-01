import { Chunk } from './types.js';

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves'
]);

/**
 * Tokenize text into lower-cased words with punctuation stripped
 */
export function tokenize(text: string, removeStopwords: boolean = true): string[] {
  if (!text) return [];
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 1);

  if (!removeStopwords) {
    return tokens;
  }
  return tokens.filter(t => !STOPWORDS.has(t));
}

export interface BM25Config {
  k1: number; // Term frequency saturation parameter (default 1.5)
  b: number;  // Length normalization parameter (default 0.75)
}

export class BM25Index {
  private chunks: Chunk[] = [];
  private docLengths: number[] = [];
  private avgDocLength: number = 0;
  // term -> map of chunkIndex -> term frequency
  private invertedIndex: Map<string, Map<number, number>> = new Map();
  // term -> document frequency (how many chunks contain the term)
  private docFrequencies: Map<string, number> = new Map();
  private totalChunks: number = 0;
  private k1: number;
  private b: number;

  constructor(config: Partial<BM25Config> = {}) {
    this.k1 = config.k1 ?? 1.5;
    this.b = config.b ?? 0.75;
  }

  /**
   * Build index from chunks
   */
  public build(chunks: Chunk[]): void {
    this.chunks = [...chunks];
    this.totalChunks = chunks.length;
    this.invertedIndex.clear();
    this.docFrequencies.clear();
    this.docLengths = [];

    if (this.totalChunks === 0) {
      this.avgDocLength = 0;
      return;
    }

    let totalLength = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const tokens = tokenize(chunk.text);
      const length = tokens.length;
      this.docLengths.push(length);
      totalLength += length;

      // Count term frequencies for this document
      const termCounts = new Map<string, number>();
      for (const token of tokens) {
        termCounts.set(token, (termCounts.get(token) || 0) + 1);
      }

      for (const [term, count] of termCounts.entries()) {
        if (!this.invertedIndex.has(term)) {
          this.invertedIndex.set(term, new Map());
        }
        this.invertedIndex.get(term)!.set(i, count);
        this.docFrequencies.set(term, (this.docFrequencies.get(term) || 0) + 1);
      }
    }

    this.avgDocLength = totalLength / this.totalChunks;
  }

  /**
   * Calculate Robertson-Spärck Jones IDF with smoothing
   * IDF(q) = ln( (N - n(q) + 0.5) / (n(q) + 0.5) + 1 )
   */
  public getIDF(term: string): number {
    const n = this.docFrequencies.get(term) || 0;
    const N = this.totalChunks;
    return Math.log((N - n + 0.5) / (n + 0.5) + 1.0);
  }

  /**
   * Search and score all chunks against a query
   */
  public search(query: string, topK: number = 10): { chunk: Chunk; score: number; rank: number }[] {
    if (this.totalChunks === 0) return [];
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const scores = new Float32Array(this.totalChunks);

    for (const term of queryTokens) {
      const posting = this.invertedIndex.get(term);
      if (!posting) continue;

      const idf = this.getIDF(term);
      if (idf <= 0) continue;

      for (const [docIdx, tf] of posting.entries()) {
        const docLen = this.docLengths[docIdx] || 1;
        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / (this.avgDocLength || 1)));
        scores[docIdx] += idf * (numerator / denominator);
      }
    }

    // Collect non-zero or top scores
    const results: { chunkIndex: number; score: number }[] = [];
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > 0) {
        results.push({ chunkIndex: i, score: scores[i] });
      }
    }

    results.sort((a, b) => b.score - a.score);

    const maxScore = results.length > 0 && results[0].score > 0 ? results[0].score : 1;

    return results.slice(0, topK).map((r, rankIdx) => ({
      chunk: this.chunks[r.chunkIndex],
      // Normalize score between 0 and 1 for easier fusion
      score: Number((r.score / maxScore).toFixed(4)),
      rank: rankIdx + 1,
    }));
  }

  public getStats() {
    return {
      indexedChunks: this.totalChunks,
      uniqueTerms: this.invertedIndex.size,
      avgDocLength: Math.round(this.avgDocLength * 10) / 10,
      k1: this.k1,
      b: this.b,
    };
  }
}
