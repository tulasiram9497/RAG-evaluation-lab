/**
 * Core type definitions for RAG Evaluation Lab
 */

export type ChunkingStrategy = 'fixed' | 'overlapping' | 'recursive' | 'semantic';
export type RetrievalStrategy = 'vector' | 'bm25' | 'hybrid' | 'hybrid_rerank';

export interface DocumentMetadata {
  id: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'markdown' | 'txt';
  sizeBytes: number;
  hash: string;
  uploadedAt: string;
  totalTokens: number;
  totalChunks: number;
  category?: string;
  author?: string;
}

export interface Chunk {
  id: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  tokenCount: number;
  pageNumber?: number;
  sectionHeading?: string;
  embedding?: number[];
  metadata: Record<string, string | number | boolean>;
}

export interface SearchResult {
  chunk: Chunk;
  score: number;
  vectorScore?: number;
  bm25Score?: number;
  fusedScore?: number;
  rerankScore?: number;
  rank: number;
}

export interface Citation {
  chunkId: string;
  documentName: string;
  chunkIndex: number;
  snippet: string;
  score: number;
}

export interface QueryRequest {
  query: string;
  strategy?: RetrievalStrategy;
  topK?: number;
  similarityThreshold?: number;
  rrfK?: number;
  vectorWeight?: number;
  bm25Weight?: number;
  rerankCandidateCount?: number;
  systemPrompt?: string;
  temperature?: number;
  model?: string;
}

export interface QueryResponse {
  id: string;
  query: string;
  answer: string;
  citations: Citation[];
  retrievedChunks: SearchResult[];
  hasSufficientEvidence: boolean;
  strategy: RetrievalStrategy;
  metrics: {
    retrievalLatencyMs: number;
    generationLatencyMs: number;
    totalLatencyMs: number;
    inputTokens: number;
    outputTokens: number;
    estimatedCostUsd: number;
  };
  timestamp: string;
}

export interface EvaluationQuestion {
  id: string;
  category: 'factual' | 'conceptual' | 'multi_document' | 'technical' | 'unanswerable';
  question: string;
  referenceAnswer: string;
  referenceEvidence: string;
  relevantDocIds: string[];
  expectedRetrievalTerms: string[];
}

export interface SingleEvaluationScore {
  questionId: string;
  category: string;
  question: string;
  generatedAnswer: string;
  referenceAnswer: string;
  faithfulness: number;
  answerRelevancy: number;
  contextPrecision: number;
  contextRecall: number;
  precisionAtK: number;
  recallAtK: number;
  mrr: number;
  ndcgAtK: number;
  hasSufficientEvidence: boolean;
  retrievedChunkCount: number;
  citationsCount: number;
  latencyMs: number;
  passed: boolean;
  notes?: string;
}

export interface EvaluationRun {
  id: string;
  name: string;
  timestamp: string;
  strategy: RetrievalStrategy;
  topK: number;
  model: string;
  totalQuestions: number;
  aggregateScores: {
    faithfulness: number;
    answerRelevancy: number;
    contextPrecision: number;
    contextRecall: number;
    precisionAtK: number;
    recallAtK: number;
    mrr: number;
    ndcgAtK: number;
    averageLatencyMs: number;
    passRate: number;
  };
  results: SingleEvaluationScore[];
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  strategy: RetrievalStrategy;
  chunkingStrategy: ChunkingStrategy;
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  similarityThreshold: number;
  vectorWeight: number;
  bm25Weight: number;
  model: string;
  evaluationRunId?: string;
  metrics?: {
    faithfulness: number;
    answerRelevancy: number;
    contextPrecision: number;
    contextRecall: number;
    mrr: number;
    ndcg: number;
    avgLatencyMs: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
  notes: string;
}

export interface SystemMetrics {
  totalQueries: number;
  totalDocuments: number;
  totalChunks: number;
  totalVectors: number;
  latencyP50Ms: number;
  latencyP90Ms: number;
  latencyP95Ms: number;
  averageLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalEstimatedCostUsd: number;
  errorRate: number;
  queriesByStrategy: Record<RetrievalStrategy, number>;
  recentLatencies: { timestamp: string; latencyMs: number; strategy: RetrievalStrategy }[];
}
