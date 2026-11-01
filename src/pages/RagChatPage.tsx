import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  FileText, 
  Clock, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { QueryResponse, RetrievalStrategy } from '../../server/types.js';
import { api } from '../services/api.js';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  responsePayload?: QueryResponse;
  timestamp: string;
}

interface RagChatPageProps {
  initialQuery?: string;
  initialStrategy?: RetrievalStrategy;
}

export const RagChatPage: React.FC<RagChatPageProps> = ({
  initialQuery = '',
  initialStrategy = 'hybrid_rerank',
}) => {
  const [strategy, setStrategy] = useState<RetrievalStrategy>(initialStrategy);
  const [topK, setTopK] = useState(5);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.15);
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: 'Welcome to RAG Evaluation Lab Chat. Ask questions regarding your indexed corpus (AI architectures, vector indexing, healthcare protocols, security governance, or FinTech cloud costs). Every generated claim is grounded directly in retrieved chunks with exact citations.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [expandedChunkId, setExpandedChunkId] = useState<string | null>(null);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputQuery.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await api.sendQuery({
        query,
        strategy,
        topK,
        similarityThreshold,
      });

      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        responsePayload: response,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `Error processing query: ${err.message}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)]">
      {/* Chat Top Bar / Controls */}
      <div className="bg-white border border-stone-200 rounded-t p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-900">Retrieval Strategy:</span>
          <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded">
            {[
              { id: 'hybrid_rerank', label: 'Hybrid + Rerank' },
              { id: 'hybrid', label: 'Hybrid (RRF)' },
              { id: 'vector', label: 'Vector (Dense)' },
              { id: 'bm25', label: 'BM25 (Sparse)' },
            ].map((strat) => (
              <button
                key={strat.id}
                onClick={() => setStrategy(strat.id as RetrievalStrategy)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  strategy === strat.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white'
                }`}
              >
                {strat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-stone-500 hidden sm:flex items-center gap-2">
            <span>Top-K: <strong className="text-stone-800">{topK}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Min Similarity: <strong className="text-stone-800">{similarityThreshold}</strong></span>
          </div>

          <button
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-orange-50/50 shadow-xs cursor-pointer"
          >
            <span className="claude-icon-badge-sm w-4 h-4">
              <SlidersHorizontal className="w-2.5 h-2.5 text-white" />
            </span>
            <span>Parameters</span>
          </button>
        </div>
      </div>

      {/* Expandable Parameter Slider Drawer */}
      {showConfigDrawer && (
        <div className="bg-stone-50 border-x border-b border-stone-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-medium text-stone-700">Top K Chunks Retrieved</label>
              <span className="font-mono text-stone-900">{topK}</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-stone-900"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Controls number of context passages injected into the LLM prompt.
            </p>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-medium text-stone-700">Similarity Threshold</label>
              <span className="font-mono text-stone-900">{similarityThreshold}</span>
            </div>
            <input
              type="range"
              min={0.0}
              max={0.9}
              step={0.05}
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className="w-full accent-stone-900"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Discards chunks below this cosine similarity threshold.
            </p>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 bg-white border-x border-stone-200 p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="text-[11px] text-stone-400 mb-1 px-1 flex items-center gap-2">
              <span className="font-medium text-stone-600">
                {msg.sender === 'user' ? 'User' : 'RAG Engine'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-3xl rounded p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-50 border border-stone-200 text-stone-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* RAG Metadata & Source Inspection */}
              {msg.responsePayload && (
                <div className="mt-4 pt-3 border-t border-stone-200 space-y-3">
                  {/* Evidence status & latency radar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      {msg.responsePayload.hasSufficientEvidence ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Grounded in Evidence</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Insufficient Evidence in Context</span>
                        </span>
                      )}
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-stone-500 capitalize">
                        {msg.responsePayload.strategy.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-stone-500 font-mono">
                      <span>R: {msg.responsePayload.metrics.retrievalLatencyMs}ms</span>
                      <span>G: {msg.responsePayload.metrics.generationLatencyMs}ms</span>
                      <span>Total: {msg.responsePayload.metrics.totalLatencyMs}ms</span>
                      <span>Est. Cost: ${msg.responsePayload.metrics.estimatedCostUsd.toFixed(5)}</span>
                    </div>
                  </div>

                  {/* Citations Box */}
                  {msg.responsePayload.citations.length > 0 && (
                    <div className="bg-white border border-stone-200 rounded p-3 text-[11px] space-y-1.5">
                      <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-stone-500" />
                        <span>Source Citations ({msg.responsePayload.citations.length})</span>
                      </div>
                      <div className="space-y-1">
                        {msg.responsePayload.citations.map((cite, cIdx) => (
                          <div key={cIdx} className="text-stone-600 flex items-start gap-1.5">
                            <span className="font-mono text-stone-400">[{cIdx + 1}]</span>
                            <div>
                              <span className="font-medium text-stone-800">{cite.documentName}</span>
                              <span className="text-stone-400 ml-1">(Score: {cite.score.toFixed(3)})</span>
                              {cite.snippet && (
                                <p className="italic text-stone-500 mt-0.5">"{cite.snippet}"</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Retrieved Chunks Accordion */}
                  <div className="border border-stone-200 rounded bg-white overflow-hidden text-[11px]">
                    <div className="px-3 py-2 bg-stone-100/60 font-semibold text-stone-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-stone-500" />
                        Retrieved Passages ({msg.responsePayload.retrievedChunks.length})
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        Click passage to inspect
                      </span>
                    </div>
                    <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto">
                      {msg.responsePayload.retrievedChunks.map((res, idx) => {
                        const isExpanded = expandedChunkId === res.chunk.id;
                        return (
                          <div key={res.chunk.id} className="p-2.5">
                            <button
                              onClick={() => setExpandedChunkId(isExpanded ? null : res.chunk.id)}
                              className="w-full text-left flex items-center justify-between gap-2 hover:text-stone-900"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-mono text-stone-400">#{idx + 1}</span>
                                <span className="font-medium text-stone-800 truncate">{res.chunk.documentName}</span>
                                <span className="text-stone-400 font-mono">Score: {res.score.toFixed(3)}</span>
                              </div>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                            {isExpanded && (
                              <div className="mt-2 p-2 bg-stone-50 rounded text-stone-700 whitespace-pre-wrap font-sans border border-stone-200">
                                {res.chunk.text}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-stone-500 italic">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-stone-400" />
            <span>Retrieving relevant chunks and synthesizing response...</span>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <div className="bg-white border border-stone-200 rounded-b p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a technical or factual question about uploaded documents..."
            className="flex-1 px-3.5 py-2 text-xs border border-stone-300 rounded focus:outline-hidden focus:border-stone-900 text-stone-900"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white rounded-xl text-xs font-bold hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <span className="claude-icon-badge-sm w-4 h-4">
              <Send className="w-2.5 h-2.5 text-white" />
            </span>
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
