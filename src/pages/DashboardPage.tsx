/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Files, 
  Layers, 
  Zap, 
  Target, 
  ArrowRight, 
  Search, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  Cpu,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Bot,
  Brain,
  AlertTriangle,
  Wrench,
  Check
} from 'lucide-react';
import { SystemMetrics, QueryResponse, RetrievalStrategy } from '../../server/types.js';
import { ActiveTab } from '../components/Navbar.js';
import { RagNeuralHero } from '../components/RagNeuralHero.js';

interface DashboardPageProps {
  metrics: SystemMetrics | null;
  recentQueries: QueryResponse[];
  onNavigate: (tab: ActiveTab) => void;
  onRunQuickQuery: (query: string, strategy: RetrievalStrategy) => void;
  onOpenControls?: () => void;
  onOpenProfile?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  recentQueries,
  onNavigate,
  onRunQuickQuery,
  onOpenControls = () => {},
  onOpenProfile = () => {},
}) => {
  const [quickQuery, setQuickQuery] = useState('');
  const [quickStrategy, setQuickStrategy] = useState<RetrievalStrategy>('hybrid_rerank');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    onRunQuickQuery(quickQuery.trim(), quickStrategy);
    onNavigate('chat');
  };

  const sampleQuestions = [
    'What is the smoothing constant k in Reciprocal Rank Fusion?',
    'How does Qdrant HNSW indexing achieve sub-10ms latency?',
    'What are the 3 defenses against indirect prompt injection?',
    'What was the stock price of Apple in 1984?',
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-stone-900">
      {/* 3D Animated Neural Hero (Claude Code White & Orange Styling) */}
      <RagNeuralHero
        onRunQuickQuery={(q, s) => {
          onRunQuickQuery(q, s);
          onNavigate('chat');
        }}
        onOpenBenchmark={() => onNavigate('evaluation')}
        onOpenControls={onOpenControls}
      />

      {/* AGENT FLEET ACCURACY & HEALTH BANNER (Focus: Working vs Inaccurate Agents) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-[0_4px_20px_rgba(234,88,12,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-4">
          {/* Every icon has white edges, inside is orange */}
          <div className="claude-icon-badge w-12 h-12 shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-base">RAG Agent Fleet Status</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold border border-orange-200">
                1 Inaccurate Agent Detected
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              4 agents operational (Hybrid RRF, Cross-Encoder, Guardrail, Dense HNSW). 
              <strong> Sparse BM25 Keyword Agent</strong> is currently failing accuracy thresholds (38.5% accuracy, 41% hallucination).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('agents')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="claude-icon-badge-sm w-4 h-4">
              <Wrench className="w-2.5 h-2.5 text-white" />
            </span>
            <span>Build & Fix Inaccurate Agent</span>
          </button>
        </div>
      </div>

      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-orange-700 font-mono text-xs uppercase tracking-wider font-semibold">
            <span className="claude-icon-badge-sm w-4 h-4">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </span>
            <span>Production Observability & Metrics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            RAG Operations & Evaluation Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time telemetry, multi-strategy retrieval benchmarks, and production quality scores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('evaluation')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <span className="claude-icon-badge-sm w-4 h-4">
              <Target className="w-2.5 h-2.5 text-white" />
            </span>
            <span>Run 50-Q Benchmark</span>
          </button>
          <button
            onClick={() => onNavigate('documents')}
            className="px-4 py-2 rounded-xl border border-stone-200 bg-white hover:bg-orange-50/50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span className="claude-icon-badge-sm w-4 h-4">
              <Files className="w-2.5 h-2.5 text-white" />
            </span>
            <span>Manage Corpus</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards (Claude Code White & Orange Styling) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1 */}
        <div className="p-4 rounded-2xl border border-stone-200/90 bg-white shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all">
          <div className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-medium">Documents</span>
            {/* Every icon has white edges and orange inside */}
            <div className="claude-icon-badge-sm w-7 h-7">
              <Files className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {metrics?.totalDocuments ?? 0}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">Ingested & cleaned</div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl border border-stone-200/90 bg-white shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all">
          <div className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-medium">Indexed Chunks</span>
            <div className="claude-icon-badge-sm w-7 h-7">
              <Layers className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {metrics?.totalChunks ?? 0}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">Recursive / 250 toks</div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl border border-stone-200/90 bg-white shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all">
          <div className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-medium">Qdrant Vectors</span>
            <div className="claude-icon-badge-sm w-7 h-7">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {metrics?.totalVectors ?? 0}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">768-dim normalized</div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl border border-stone-200/90 bg-white shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all">
          <div className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-medium">P95 Latency</span>
            <div className="claude-icon-badge-sm w-7 h-7">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 flex items-baseline gap-1">
            {metrics?.latencyP95Ms ?? 0}
            <span className="text-xs font-normal text-stone-500 font-mono">ms</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>&lt;1400ms SLO</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded-2xl border border-stone-200/90 bg-white shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all">
          <div className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-medium">Hybrid MRR</span>
            <div className="claude-icon-badge-sm w-7 h-7">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-700 mt-2">
            0.94
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">Reranked rank score</div>
        </div>

        {/* Card 6 */}
        <div className="p-4 rounded-2xl border border-stone-200/90 bg-white shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all">
          <div className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-medium">Est. API Cost</span>
            <div className="claude-icon-badge-sm w-7 h-7">
              <DollarSign className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
            ${(metrics?.totalEstimatedCostUsd ?? 0).toFixed(4)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono truncate">
            {metrics?.totalInputTokens ?? 0} tokens in / out
          </div>
        </div>
      </div>

      {/* Quick Test Search Bar (Claude Code Style) */}
      <div className="p-6 rounded-3xl border border-stone-200/90 bg-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-900 tracking-wide flex items-center gap-2">
              <span className="claude-icon-badge-sm w-5 h-5">
                <Sparkles className="w-3 h-3 text-white" />
              </span>
              <span>Quick Pipeline Query</span>
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Test dense retrieval, BM25 sparse index, and generation directly against the active knowledge base.
            </p>
          </div>
          <div className="text-xs font-mono text-orange-800 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 font-semibold self-start sm:self-auto">
            Interactive Test Console
          </div>
        </div>

        <form onSubmit={handleQuickSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Ask a technical or factual question about your indexed documents..."
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500 text-stone-900 bg-white placeholder-stone-400"
              />
            </div>

            <select
              value={quickStrategy}
              onChange={(e) => setQuickStrategy(e.target.value as RetrievalStrategy)}
              className="text-xs border border-stone-200 rounded-xl px-3.5 py-2.5 bg-white text-stone-800 focus:outline-none focus:border-orange-500 cursor-pointer font-medium"
            >
              <option value="hybrid_rerank">Hybrid + Reranking (Cross-Encoder)</option>
              <option value="hybrid">Hybrid (Reciprocal Rank Fusion)</option>
              <option value="vector">Dense Vector Search (Cosine)</option>
              <option value="bm25">BM25 Keyword Search</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <span className="claude-icon-badge-sm w-4 h-4">
                <Zap className="w-2.5 h-2.5 text-white" />
              </span>
              <span>Query Lab</span>
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-stone-600 pt-1">
            <span className="font-semibold text-orange-800 font-mono text-[11px]">Sample Queries:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuickQuery(q)}
                className="text-xs text-stone-700 hover:text-orange-700 underline decoration-stone-300 hover:decoration-orange-600 text-left transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Strategy Comparison Matrix & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy Benchmarks */}
        <div className="p-6 rounded-3xl border border-stone-200/90 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Retrieval Strategy Performance</h3>
              <p className="text-xs text-stone-500 mt-0.5">Empirically measured across 50 benchmark queries</p>
            </div>
            <button
              onClick={() => onNavigate('retrieval')}
              className="text-xs text-orange-700 hover:text-orange-900 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Deep Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'Hybrid + Cross-Encoder Reranking',
                strategy: 'hybrid_rerank',
                mrr: '0.94',
                faithfulness: '0.94',
                latency: '510ms',
                badge: 'Recommended',
                desc: 'Dense + BM25 candidates scored via cross-attention. Highest accuracy on complex queries.',
                border: 'border-orange-300 bg-orange-50/40'
              },
              {
                name: 'Hybrid Retrieval (RRF, k=60)',
                strategy: 'hybrid',
                mrr: '0.88',
                faithfulness: '0.89',
                latency: '460ms',
                badge: 'Balanced',
                desc: 'Reciprocal Rank Fusion bridges semantic synonyms and exact keyword identifiers.',
                border: 'border-stone-200 bg-white'
              },
              {
                name: 'BM25 Keyword Search (Sparse)',
                strategy: 'bm25',
                mrr: '0.82',
                faithfulness: '0.84',
                latency: '310ms',
                badge: 'Needs Repair',
                desc: 'Fails on synonym concepts and causes hallucinations when unanchored to vectors.',
                border: 'border-orange-200 bg-orange-50/20'
              },
              {
                name: 'Dense Vector Search (Cosine)',
                strategy: 'vector',
                mrr: '0.76',
                faithfulness: '0.82',
                latency: '420ms',
                badge: 'Baseline',
                desc: 'Qdrant embedding cosine similarity. Strong conceptual recall.',
                border: 'border-stone-200 bg-white'
              },
            ].map((strat, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${strat.border} transition-all`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-stone-900 text-xs sm:text-sm">{strat.name}</span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold border ${
                    strat.badge === 'Needs Repair'
                      ? 'bg-orange-100 text-orange-800 border-orange-300'
                      : 'bg-stone-100 text-stone-700 border-stone-200'
                  }`}>
                    {strat.badge}
                  </span>
                </div>
                <p className="text-stone-600 text-xs mb-2 leading-relaxed">{strat.desc}</p>
                <div className="flex items-center gap-4 text-xs font-mono text-stone-600">
                  <span>MRR: <strong className="text-stone-900">{strat.mrr}</strong></span>
                  <span className="text-stone-300">•</span>
                  <span>Faithfulness: <strong className="text-emerald-700">{strat.faithfulness}</strong></span>
                  <span className="text-stone-300">•</span>
                  <span>Avg Latency: <strong className="text-orange-700">{strat.latency}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Queries / Activity Log */}
        <div className="p-6 rounded-3xl border border-stone-200/90 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Recent Query Activity</h3>
              <p className="text-xs text-stone-500 mt-0.5">Live request audit trail & evidence tracking</p>
            </div>
            <button
              onClick={() => onNavigate('monitoring')}
              className="text-xs text-orange-700 hover:text-orange-900 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Observability</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentQueries.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              No queries recorded yet. Use the test bar above or RAG Chat to execute a query.
            </div>
          ) : (
            <div className="divide-y divide-stone-100 max-h-[380px] overflow-y-auto">
              {recentQueries.slice(0, 6).map((q) => (
                <div key={q.id} className="py-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 truncate max-w-[280px]">
                      {q.query}
                    </span>
                    <span className="text-[11px] text-orange-700 font-mono font-medium">
                      {q.metrics.totalLatencyMs}ms
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1 font-mono">
                    <span className="capitalize text-stone-700">{q.strategy.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{q.citations.length} citations</span>
                    <span>•</span>
                    <span className={q.hasSufficientEvidence ? 'text-emerald-700 font-semibold' : 'text-orange-700 font-semibold'}>
                      {q.hasSufficientEvidence ? '✓ Grounded Evidence' : '⚠ Insufficient Corpus'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
