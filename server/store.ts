import crypto from 'crypto';
import { Chunk, ChunkingStrategy, DocumentMetadata, EvaluationRun, Experiment, QueryRequest, QueryResponse, RetrievalStrategy } from './types.js';
import { chunkDocument, cleanText, estimateTokenCount } from './chunking.js';
import { BM25Index } from './bm25.js';
import { EmbeddingEngine } from './embeddings.js';
import { VectorStore } from './vectorStore.js';
import { RetrievalEngine } from './retrieval.js';
import { GenerationEngine } from './generation.js';
import { EvaluationEngine } from './evaluationEngine.js';
import { MonitoringService } from './monitoring.js';
import { SAMPLE_DOCUMENTS } from './sampleData.js';
import { EVALUATION_DATASET_50 } from './evaluationData.js';

export interface IngestOptions {
  filename: string;
  fileType: 'pdf' | 'docx' | 'markdown' | 'txt';
  content: string;
  category?: string;
  chunkingStrategy?: ChunkingStrategy;
  chunkSize?: number;
  chunkOverlap?: number;
}

export class AppStateStore {
  public documents: Map<string, DocumentMetadata> = new Map();
  public documentContents: Map<string, string> = new Map();
  public chunksByDocId: Map<string, Chunk[]> = new Map();
  
  public vectorStore: VectorStore;
  public bm25Index: BM25Index;
  public embeddingEngine: EmbeddingEngine;
  public retrievalEngine: RetrievalEngine;
  public generationEngine: GenerationEngine;
  public evaluationEngine: EvaluationEngine;
  public monitoringService: MonitoringService;

  public evaluationRuns: Map<string, EvaluationRun> = new Map();
  public experiments: Map<string, Experiment> = new Map();

  constructor() {
    this.vectorStore = new VectorStore('rag_evaluation_collection');
    this.bm25Index = new BM25Index();
    this.embeddingEngine = new EmbeddingEngine();
    this.retrievalEngine = new RetrievalEngine(this.vectorStore, this.bm25Index, this.embeddingEngine);
    this.generationEngine = new GenerationEngine();
    this.evaluationEngine = new EvaluationEngine(this.retrievalEngine, this.generationEngine);
    this.monitoringService = new MonitoringService();

    // Ingest sample documents automatically
    this.initSampleCorpus();
    this.initSampleExperiments();
  }

  /**
   * Initialize standard sample corpus
   */
  public async initSampleCorpus(): Promise<void> {
    for (const doc of SAMPLE_DOCUMENTS) {
      await this.ingestDocument({
        filename: doc.filename,
        fileType: doc.fileType,
        content: doc.content,
        category: doc.category,
        chunkingStrategy: 'recursive',
        chunkSize: 250,
        chunkOverlap: 40,
      }, doc.id);
    }
  }

  /**
   * Seed baseline experiments
   */
  public initSampleExperiments(): void {
    const exp1: Experiment = {
      id: 'exp_01_baseline_vector',
      name: 'Experiment 1: Baseline Vector Search',
      description: 'Standard dense vector retrieval using cosine similarity and 250-token recursive chunks.',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      strategy: 'vector',
      chunkingStrategy: 'recursive',
      chunkSize: 250,
      chunkOverlap: 40,
      topK: 5,
      similarityThreshold: 0.25,
      vectorWeight: 1.0,
      bm25Weight: 0.0,
      model: 'gemini-3.8-flash',
      metrics: {
        faithfulness: 0.82,
        answerRelevancy: 0.79,
        contextPrecision: 0.74,
        contextRecall: 0.78,
        mrr: 0.76,
        ndcg: 0.75,
        avgLatencyMs: 420,
        totalTokens: 12400,
        estimatedCostUsd: 0.0018,
      },
      notes: 'Strong semantic retrieval, but misses exact alphanumeric identifiers and acronyms in technical questions.'
    };

    const exp2: Experiment = {
      id: 'exp_02_bm25_sparse',
      name: 'Experiment 2: BM25 Keyword Search',
      description: 'Sparse lexical search using BM25 probabilistic model (k1=1.5, b=0.75).',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      strategy: 'bm25',
      chunkingStrategy: 'recursive',
      chunkSize: 250,
      chunkOverlap: 40,
      topK: 5,
      similarityThreshold: 0.0,
      vectorWeight: 0.0,
      bm25Weight: 1.0,
      model: 'gemini-3.8-flash',
      metrics: {
        faithfulness: 0.84,
        answerRelevancy: 0.81,
        contextPrecision: 0.78,
        contextRecall: 0.71,
        mrr: 0.82,
        ndcg: 0.79,
        avgLatencyMs: 310,
        totalTokens: 11800,
        estimatedCostUsd: 0.0016,
      },
      notes: 'Exceptional precision on exact acronyms and numbers (e.g. 18 Safe Harbor identifiers, $14.2M), but drops recall on conceptual paraphrasing.'
    };

    const exp3: Experiment = {
      id: 'exp_03_hybrid_rrf',
      name: 'Experiment 3: Hybrid Retrieval (RRF)',
      description: 'Dense vector search fused with BM25 using Reciprocal Rank Fusion (k=60).',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      strategy: 'hybrid',
      chunkingStrategy: 'recursive',
      chunkSize: 250,
      chunkOverlap: 40,
      topK: 5,
      similarityThreshold: 0.15,
      vectorWeight: 1.0,
      bm25Weight: 1.0,
      model: 'gemini-3.8-flash',
      metrics: {
        faithfulness: 0.89,
        answerRelevancy: 0.86,
        contextPrecision: 0.85,
        contextRecall: 0.87,
        mrr: 0.88,
        ndcg: 0.86,
        avgLatencyMs: 460,
        totalTokens: 13200,
        estimatedCostUsd: 0.0021,
      },
      notes: 'Reciprocal Rank Fusion captures both semantic intent and exact token matches, boosting context recall to 0.87.'
    };

    const exp4: Experiment = {
      id: 'exp_04_hybrid_rerank',
      name: 'Experiment 4: Hybrid + Cross-Encoder Reranking',
      description: 'Hybrid candidate generation (15 candidates) followed by cross-encoder re-ranking for top 5 selection.',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      strategy: 'hybrid_rerank',
      chunkingStrategy: 'recursive',
      chunkSize: 250,
      chunkOverlap: 40,
      topK: 5,
      similarityThreshold: 0.15,
      vectorWeight: 1.0,
      bm25Weight: 1.0,
      model: 'gemini-3.8-flash',
      metrics: {
        faithfulness: 0.94,
        answerRelevancy: 0.91,
        contextPrecision: 0.92,
        contextRecall: 0.90,
        mrr: 0.94,
        ndcg: 0.93,
        avgLatencyMs: 510,
        totalTokens: 12900,
        estimatedCostUsd: 0.0022,
      },
      notes: 'Highest overall benchmark scores. Cross-encoder reranker elevates true ground-truth passages to Rank 1 with MRR 0.94.'
    };

    this.experiments.set(exp1.id, exp1);
    this.experiments.set(exp2.id, exp2);
    this.experiments.set(exp3.id, exp3);
    this.experiments.set(exp4.id, exp4);
  }

  /**
   * Ingest a document into the system: chunking, embedding, vector store insertion, BM25 indexing
   */
  public async ingestDocument(options: IngestOptions, explicitId?: string): Promise<DocumentMetadata> {
    const cleaned = cleanText(options.content);
    if (!cleaned) {
      throw new Error('Document content cannot be empty');
    }

    // Hash check for duplicate detection
    const hash = crypto.createHash('sha256').update(cleaned).digest('hex');
    for (const doc of this.documents.values()) {
      if (doc.hash === hash && (!explicitId || doc.id !== explicitId)) {
        throw new Error(`Duplicate document detected: "${options.filename}" matches existing document "${doc.filename}"`);
      }
    }

    const docId = explicitId || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const totalTokens = estimateTokenCount(cleaned);

    // 1. Chunk document
    const chunks = chunkDocument(docId, options.filename, cleaned, {
      strategy: options.chunkingStrategy || 'recursive',
      chunkSize: options.chunkSize || 250,
      chunkOverlap: options.chunkOverlap !== undefined ? options.chunkOverlap : 40,
    });

    // 2. Generate embeddings for chunks
    const chunkTexts = chunks.map(c => c.text);
    const vectors = await this.embeddingEngine.embedBatch(chunkTexts);

    // 3. Insert into Vector Store
    this.vectorStore.insertBatch(chunks, vectors);

    // 4. Update state maps
    this.documentContents.set(docId, cleaned);
    this.chunksByDocId.set(docId, chunks);

    // 5. Rebuild BM25 index with all stored chunks
    this.rebuildBM25();

    const metadata: DocumentMetadata = {
      id: docId,
      filename: options.filename,
      fileType: options.fileType,
      sizeBytes: Buffer.byteLength(options.content, 'utf8'),
      hash,
      uploadedAt: new Date().toISOString(),
      totalTokens,
      totalChunks: chunks.length,
      category: options.category || 'General',
    };

    this.documents.set(docId, metadata);
    return metadata;
  }

  /**
   * Delete a document and its chunks from all indexes
   */
  public deleteDocument(documentId: string): boolean {
    if (!this.documents.has(documentId)) {
      return false;
    }

    this.documents.delete(documentId);
    this.documentContents.delete(documentId);
    this.chunksByDocId.delete(documentId);
    this.vectorStore.deleteByDocumentId(documentId);
    this.rebuildBM25();
    return true;
  }

  /**
   * Rebuild BM25 index across all current chunks
   */
  public rebuildBM25(): void {
    const allChunks = this.vectorStore.getAllChunks();
    this.bm25Index.build(allChunks);
  }

  /**
   * Process a RAG query
   */
  public async handleQuery(request: QueryRequest): Promise<QueryResponse> {
    const startTime = Date.now();
    const strategy = request.strategy || 'hybrid_rerank';
    const topK = request.topK || 5;

    try {
      // 1. Retrieve
      const rStart = Date.now();
      const retrieved = await this.retrievalEngine.retrieve(request.query, {
        strategy,
        topK,
        similarityThreshold: request.similarityThreshold,
        rrfK: request.rrfK,
        vectorWeight: request.vectorWeight,
        bm25Weight: request.bm25Weight,
        rerankCandidateCount: request.rerankCandidateCount,
      });
      const rLatency = Date.now() - rStart;

      // 2. Generate
      const response = await this.generationEngine.generateAnswer(
        request.query,
        retrieved,
        rLatency,
        strategy,
        {
          model: request.model,
          temperature: request.temperature,
          systemPrompt: request.systemPrompt,
        }
      );

      // 3. Monitor
      this.monitoringService.recordQuery(response);
      return response;
    } catch (err) {
      this.monitoringService.recordError();
      throw err;
    }
  }

  /**
   * Get all chunks for a document
   */
  public getChunksForDocument(docId: string): Chunk[] {
    return this.chunksByDocId.get(docId) || [];
  }

  /**
   * Reset to default state
   */
  public async resetAll(): Promise<void> {
    this.documents.clear();
    this.documentContents.clear();
    this.chunksByDocId.clear();
    this.vectorStore.clear();
    this.evaluationRuns.clear();
    await this.initSampleCorpus();
  }
}

// Global singleton instance
export const appStore = new AppStateStore();
