import React, { useState } from 'react';
import { Search, Compass, Layers, ArrowUpDown, Info } from 'lucide-react';
import { api, RetrievalCompareResult } from '../services/api.js';

export const RetrievalExplorerPage: React.FC = () => {
  const [query, setQuery] = useState('What is the smoothing constant k in Reciprocal Rank Fusion?');
  const [topK, setTopK] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState<RetrievalCompareResult | null>(null);

  const handleCompare = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await api.compareRetrieval(query.trim(), topK);
      setComparison(res);
    } catch (err: any) {
      console.error('Failed to compare retrieval strategies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'What is the smoothing constant k in Reciprocal Rank Fusion?',
    'How does Qdrant HNSW indexing achieve sub-10ms latency?',
    'What 18 specific identifiers must be removed under HIPAA Safe Harbor?',
    'What was the total FinTech infrastructure expenditure in FY 2026?',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Retrieval Strategy Explorer</h1>
        <p className="text-xs text-stone-500 mt-1">
          Inspect and diagnose how Dense Vector, BM25 Keyword, Hybrid RRF, and Cross-Encoder Reranking score and rank the same passages.
        </p>
      </div>

      {/* Query Bar */}
      <div className="bg-white border border-stone-200 rounded p-4 space-y-3">
        <form onSubmit={handleCompare} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query to run across all 4 strategies..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded focus:outline-hidden focus:border-stone-900 text-stone-900"
            />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-50 border border-stone-300 rounded text-xs">
            <span className="text-stone-500">Top K:</span>
            <input
              type="number"
              min={1}
              max={10}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-12 text-stone-900 bg-transparent text-center font-mono font-medium focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Retrieving...' : 'Compare 4 Strategies'}</span>
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap text-xs text-stone-500">
          <span className="font-medium text-stone-600">Sample Prompts:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(sq);
              }}
              className="text-stone-600 hover:text-stone-900 underline text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Column Side-by-Side Comparison */}
      {comparison && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* 1. Vector Search */}
          <div className="bg-white border border-stone-200 rounded p-4 flex flex-col">
            <div className="border-b border-stone-200 pb-3 mb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-stone-900">1. Dense Vector Search</h3>
                <span className="text-[10px] text-stone-400 font-mono">Cosine Sim</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Cosine similarity over 768-dim embeddings in Qdrant.
              </p>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px]">
              {comparison.strategies.vector.map((item, idx) => (
                <div key={item.chunk.id} className="border border-stone-200 rounded p-2.5 text-xs bg-stone-50/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-stone-900 font-mono">#{idx + 1}</span>
                    <span className="text-stone-700 font-mono text-[11px] font-medium">
                      Sim: {item.score.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate mb-1.5 font-medium">
                    {item.chunk.documentName}
                  </div>
                  <p className="text-stone-600 line-clamp-3 text-[11px] leading-relaxed">
                    {item.chunk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. BM25 Sparse Search */}
          <div className="bg-white border border-stone-200 rounded p-4 flex flex-col">
            <div className="border-b border-stone-200 pb-3 mb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-stone-900">2. BM25 Keyword Search</h3>
                <span className="text-[10px] text-stone-400 font-mono">k1=1.5, b=0.75</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Probabilistic term frequency & inverted document frequency.
              </p>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px]">
              {comparison.strategies.bm25.map((item, idx) => (
                <div key={item.chunk.id} className="border border-stone-200 rounded p-2.5 text-xs bg-stone-50/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-stone-900 font-mono">#{idx + 1}</span>
                    <span className="text-stone-700 font-mono text-[11px] font-medium">
                      BM25: {item.score.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate mb-1.5 font-medium">
                    {item.chunk.documentName}
                  </div>
                  <p className="text-stone-600 line-clamp-3 text-[11px] leading-relaxed">
                    {item.chunk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Hybrid Search (RRF) */}
          <div className="bg-white border border-stone-200 rounded p-4 flex flex-col">
            <div className="border-b border-stone-200 pb-3 mb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-stone-900">3. Hybrid Retrieval</h3>
                <span className="text-[10px] text-stone-400 font-mono">RRF (k=60)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Reciprocal Rank Fusion uniting dense and sparse candidates.
              </p>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px]">
              {comparison.strategies.hybrid.map((item, idx) => (
                <div key={item.chunk.id} className="border border-stone-200 rounded p-2.5 text-xs bg-stone-50/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-stone-900 font-mono">#{idx + 1}</span>
                    <span className="text-stone-700 font-mono text-[11px] font-medium">
                      RRF: {item.score.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate mb-1.5 font-medium">
                    {item.chunk.documentName}
                  </div>
                  <p className="text-stone-600 line-clamp-3 text-[11px] leading-relaxed">
                    {item.chunk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Hybrid + Reranker */}
          <div className="bg-white border border-stone-900/40 rounded p-4 flex flex-col shadow-xs">
            <div className="border-b border-stone-200 pb-3 mb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-stone-900">4. Hybrid + Cross-Encoder</h3>
                <span className="text-[10px] bg-stone-900 text-white px-1.5 py-0.5 rounded font-mono">Top Rank</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Candidate pool expansion followed by cross-attention re-scoring.
              </p>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px]">
              {comparison.strategies.hybrid_rerank.map((item, idx) => (
                <div key={item.chunk.id} className="border border-stone-300 rounded p-2.5 text-xs bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-stone-900 font-mono">#{idx + 1}</span>
                    <span className="text-stone-900 font-mono text-[11px] font-semibold">
                      Score: {item.score.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-700 truncate mb-1.5 font-medium">
                    {item.chunk.documentName}
                  </div>
                  <p className="text-stone-800 line-clamp-3 text-[11px] leading-relaxed">
                    {item.chunk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
