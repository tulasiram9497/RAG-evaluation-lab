import { DocumentMetadata, Chunk, SearchResult, QueryResponse, EvaluationRun, Experiment, SystemMetrics, EvaluationQuestion, RetrievalStrategy } from '../../server/types.js';

export interface DocumentWithContent {
  document: DocumentMetadata;
  content: string;
}

export interface RetrievalCompareResult {
  query: string;
  strategies: {
    vector: SearchResult[];
    bm25: SearchResult[];
    hybrid: SearchResult[];
    hybrid_rerank: SearchResult[];
  };
}

export interface EvaluationDatasetResponse {
  total: number;
  categories: Record<string, number>;
  questions: EvaluationQuestion[];
}

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getDocuments(): Promise<{ documents: DocumentMetadata[]; total: number }> {
    const res = await fetch('/api/documents');
    return res.json();
  },

  async getDocument(id: string): Promise<DocumentWithContent> {
    const res = await fetch(`/api/documents/${id}`);
    return res.json();
  },

  async getDocumentChunks(id: string): Promise<{ chunks: Chunk[]; total: number }> {
    const res = await fetch(`/api/documents/${id}/chunks`);
    return res.json();
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async uploadRawDocument(data: {
    filename: string;
    content: string;
    category?: string;
    fileType?: string;
    chunkingStrategy?: string;
    chunkSize?: number;
    chunkOverlap?: number;
  }): Promise<{ success: boolean; document: DocumentMetadata }> {
    const res = await fetch('/api/documents/raw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  async uploadFile(file: File, options?: { category?: string; chunkingStrategy?: string; chunkSize?: number; chunkOverlap?: number }): Promise<{ success: boolean; document: DocumentMetadata }> {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.category) formData.append('category', options.category);
    if (options?.chunkingStrategy) formData.append('chunkingStrategy', options.chunkingStrategy);
    if (options?.chunkSize) formData.append('chunkSize', String(options.chunkSize));
    if (options?.chunkOverlap !== undefined) formData.append('chunkOverlap', String(options.chunkOverlap));

    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'File upload failed');
    }
    return res.json();
  },

  async resetSampleCorpus(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/documents/reset-sample', { method: 'POST' });
    return res.json();
  },

  async sendQuery(payload: {
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
  }): Promise<QueryResponse> {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Query failed');
    }
    return res.json();
  },

  async compareRetrieval(query: string, topK: number = 5): Promise<RetrievalCompareResult> {
    const res = await fetch('/api/retrieval/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, topK }),
    });
    return res.json();
  },

  async getQueryHistory(limit: number = 25): Promise<{ history: QueryResponse[]; count: number }> {
    const res = await fetch(`/api/query/history?limit=${limit}`);
    return res.json();
  },

  async getEvaluationDataset(): Promise<EvaluationDatasetResponse> {
    const res = await fetch('/api/evaluation/dataset');
    return res.json();
  },

  async runEvaluation(payload: {
    strategy?: RetrievalStrategy;
    topK?: number;
    limit?: number;
    name?: string;
    category?: string;
  }): Promise<EvaluationRun> {
    const res = await fetch('/api/evaluation/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Evaluation failed');
    }
    return res.json();
  },

  async getEvaluationRuns(): Promise<{ runs: EvaluationRun[]; total: number }> {
    const res = await fetch('/api/evaluation/results');
    return res.json();
  },

  async getEvaluationRun(id: string): Promise<EvaluationRun> {
    const res = await fetch(`/api/evaluation/results/${id}`);
    return res.json();
  },

  async getExperiments(): Promise<{ experiments: Experiment[]; total: number }> {
    const res = await fetch('/api/experiments');
    return res.json();
  },

  async createExperiment(payload: Partial<Experiment>): Promise<Experiment> {
    const res = await fetch('/api/experiments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async compareExperiments(ids: string[]): Promise<{ experiments: Experiment[] }> {
    const query = ids.length > 0 ? `?ids=${ids.join(',')}` : '';
    const res = await fetch(`/api/experiments/compare${query}`);
    return res.json();
  },

  async getMonitoringMetrics(): Promise<SystemMetrics> {
    const res = await fetch('/api/monitoring/metrics');
    return res.json();
  },
};
