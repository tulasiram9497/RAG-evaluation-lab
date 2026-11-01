import React, { useState } from 'react';
import { FileCode2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  summary: string;
  requestBody?: string;
  responseExample: string;
  curlExample: string;
}

export const ApiDocsPage: React.FC = () => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const endpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/api/query',
      summary: 'Execute a RAG query through dense vector, BM25, hybrid RRF, or cross-encoder reranking',
      requestBody: JSON.stringify(
        {
          query: 'What is the smoothing constant k in Reciprocal Rank Fusion?',
          strategy: 'hybrid_rerank',
          topK: 5,
          similarityThreshold: 0.15,
          rrfK: 60,
          vectorWeight: 1.0,
          bm25Weight: 1.0,
        },
        null,
        2
      ),
      responseExample: JSON.stringify(
        {
          id: 'query_1730000000_a1b2',
          query: 'What is the smoothing constant k in Reciprocal Rank Fusion?',
          answer: 'The smoothing constant k in Reciprocal Rank Fusion (RRF) is typically set to 60.',
          citations: [
            {
              chunkId: 'doc_rag_arch_chunk_2',
              documentName: 'rag_architecture_and_eval.md',
              chunkIndex: 2,
              snippet: 'Score(d) = sum(w_m / (k + rank_m(d))) where k is a smoothing constant typically set to 60',
              score: 0.9412,
            },
          ],
          hasSufficientEvidence: true,
          strategy: 'hybrid_rerank',
          metrics: {
            retrievalLatencyMs: 42,
            generationLatencyMs: 410,
            totalLatencyMs: 452,
            inputTokens: 1120,
            outputTokens: 48,
            estimatedCostUsd: 0.000098,
          },
        },
        null,
        2
      ),
      curlExample: `curl -X POST http://localhost:3000/api/query \\
  -H "Content-Type: application/json" \\
  -d '{"query": "What is the smoothing constant k in RRF?", "strategy": "hybrid_rerank", "topK": 5}'`,
    },
    {
      method: 'POST',
      path: '/api/documents/upload',
      summary: 'Upload binary or text files (PDF, DOCX, Markdown, TXT) with automatic chunking and Qdrant vector indexing',
      requestBody: 'multipart/form-data: file=<file.pdf>, category="AI Engineering", chunkingStrategy="recursive", chunkSize=250',
      responseExample: JSON.stringify(
        {
          success: true,
          document: {
            id: 'doc_1730000000_x9y8',
            filename: 'distributed_systems_v3.pdf',
            fileType: 'pdf',
            sizeBytes: 1048576,
            hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            uploadedAt: '2026-11-01T07:00:00.000Z',
            totalTokens: 4200,
            totalChunks: 17,
            category: 'AI Engineering',
          },
        },
        null,
        2
      ),
      curlExample: `curl -X POST http://localhost:3000/api/documents/upload \\
  -F "file=@/path/to/paper.pdf" \\
  -F "category=AI Engineering"`,
    },
    {
      method: 'GET',
      path: '/api/documents',
      summary: 'List all documents in the active knowledge base with chunk counts and token statistics',
      responseExample: JSON.stringify(
        {
          total: 5,
          documents: [
            {
              id: 'doc_rag_arch',
              filename: 'rag_architecture_and_eval.md',
              fileType: 'markdown',
              sizeBytes: 3200,
              totalTokens: 850,
              totalChunks: 4,
            },
          ],
        },
        null,
        2
      ),
      curlExample: `curl -X GET http://localhost:3000/api/documents`,
    },
    {
      method: 'POST',
      path: '/api/evaluation/run',
      summary: 'Run automated evaluation suite on the 50-question dataset to calculate Faithfulness, Answer Relevancy, Context Precision/Recall, MRR, and NDCG',
      requestBody: JSON.stringify(
        {
          strategy: 'hybrid_rerank',
          topK: 5,
          category: 'all',
          name: 'Production Baseline Evaluation',
        },
        null,
        2
      ),
      responseExample: JSON.stringify(
        {
          id: 'eval_1730000000',
          name: 'Production Baseline Evaluation',
          strategy: 'hybrid_rerank',
          totalQuestions: 50,
          aggregateScores: {
            faithfulness: 0.94,
            answerRelevancy: 0.91,
            contextPrecision: 0.92,
            contextRecall: 0.9,
            mrr: 0.94,
            ndcgAtK: 0.93,
            passRate: 0.96,
            averageLatencyMs: 490,
          },
        },
        null,
        2
      ),
      curlExample: `curl -X POST http://localhost:3000/api/evaluation/run \\
  -H "Content-Type: application/json" \\
  -d '{"strategy": "hybrid_rerank", "topK": 5}'`,
    },
    {
      method: 'GET',
      path: '/api/monitoring/metrics',
      summary: 'Retrieve real-time observability telemetry: P50, P90, P95 latencies, input/output token counters, estimated cost, and error rate',
      responseExample: JSON.stringify(
        {
          totalQueries: 142,
          latencyP50Ms: 380,
          latencyP90Ms: 720,
          latencyP95Ms: 940,
          totalInputTokens: 148000,
          totalOutputTokens: 18400,
          totalEstimatedCostUsd: 0.01662,
          errorRate: 0.0,
        },
        null,
        2
      ),
      curlExample: `curl -X GET http://localhost:3000/api/monitoring/metrics`,
    },
    {
      method: 'GET',
      path: '/api/health',
      summary: 'System health probe returning uptime, vector collection stats, and embedding engine status',
      responseExample: JSON.stringify(
        {
          status: 'healthy',
          timestamp: '2026-11-01T07:00:00.000Z',
          uptimeSeconds: 1240,
          documentsCount: 5,
          vectorsCount: 22,
          embeddingModel: 'gemini-embedding-2-preview',
          hasGeminiKey: true,
        },
        null,
        2
      ),
      curlExample: `curl -X GET http://localhost:3000/api/health`,
    },
  ];

  const handleCopy = (text: string, path: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">REST API Documentation & Schemas</h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete endpoint definitions, request payload structures, JSON responses, and curl commands for automated CI/CD integration.
        </p>
      </div>

      <div className="space-y-6">
        {endpoints.map((ep) => (
          <div key={ep.path + ep.method} className="bg-white border border-stone-200 rounded p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
                    ep.method === 'POST'
                      ? 'bg-stone-900 text-white'
                      : ep.method === 'GET'
                      ? 'bg-stone-100 text-stone-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-mono font-medium text-xs text-stone-900">{ep.path}</span>
              </div>
              <button
                onClick={() => handleCopy(ep.curlExample, ep.path)}
                className="text-stone-500 hover:text-stone-800 text-[11px] font-medium flex items-center gap-1 self-start sm:self-auto"
              >
                {copiedPath === ep.path ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPath === ep.path ? 'Copied curl' : 'Copy curl'}</span>
              </button>
            </div>

            <p className="text-xs text-stone-600">{ep.summary}</p>

            {/* Request Schema if POST */}
            {ep.requestBody && (
              <div>
                <div className="text-[11px] font-semibold text-stone-700 mb-1">Request Payload</div>
                <pre className="p-3 bg-stone-50 border border-stone-200 rounded text-[11px] font-mono text-stone-800 overflow-x-auto">
                  {ep.requestBody}
                </pre>
              </div>
            )}

            {/* Response Example */}
            <div>
              <div className="text-[11px] font-semibold text-stone-700 mb-1">Response JSON</div>
              <pre className="p-3 bg-stone-900 text-stone-100 rounded text-[11px] font-mono overflow-x-auto max-h-56">
                {ep.responseExample}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
