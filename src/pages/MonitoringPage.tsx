import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  BarChart2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { SystemMetrics, QueryResponse } from '../../server/types.js';
import { api } from '../services/api.js';

export const MonitoringPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recentQueries, setRecentQueries] = useState<QueryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [m, q] = await Promise.all([
        api.getMonitoringMetrics(),
        api.getQueryHistory(30),
      ]);
      setMetrics(m);
      setRecentQueries(q.history);
    } catch (err) {
      console.error('Failed to load monitoring metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  // Strategy breakdown data for chart
  const strategyData = metrics
    ? [
        { name: 'Hybrid + Rerank', count: metrics.queriesByStrategy.hybrid_rerank || 0, color: '#1c1917' },
        { name: 'Hybrid (RRF)', count: metrics.queriesByStrategy.hybrid || 0, color: '#44403c' },
        { name: 'Dense Vector', count: metrics.queriesByStrategy.vector || 0, color: '#78716c' },
        { name: 'BM25 Sparse', count: metrics.queriesByStrategy.bm25 || 0, color: '#a8a29e' },
      ]
    : [];

  const chartLatencyData = (metrics?.recentLatencies || []).map((item, idx) => ({
    name: `#${idx + 1}`,
    latency: item.latencyMs,
    strategy: item.strategy,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 tracking-tight">System Observability & Monitoring</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time latency percentiles (P50, P90, P95), token consumption accounting, cost estimation, and query audit trail.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="px-3.5 py-1.5 bg-white border border-stone-300 text-stone-700 rounded text-xs font-medium hover:bg-stone-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Latency Percentiles & Cost Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-stone-200 rounded p-4">
          <div className="text-[11px] text-stone-500 font-medium">P50 Latency</div>
          <div className="text-2xl font-semibold text-stone-900 mt-2 font-mono">
            {metrics?.latencyP50Ms ?? 0}<span className="text-xs font-normal text-stone-400">ms</span>
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">Median response time</div>
        </div>

        <div className="bg-white border border-stone-200 rounded p-4">
          <div className="text-[11px] text-stone-500 font-medium">P90 Latency</div>
          <div className="text-2xl font-semibold text-stone-900 mt-2 font-mono">
            {metrics?.latencyP90Ms ?? 0}<span className="text-xs font-normal text-stone-400">ms</span>
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">90th percentile</div>
        </div>

        <div className="bg-white border border-stone-200 rounded p-4">
          <div className="text-[11px] text-stone-500 font-medium">P95 Latency</div>
          <div className="text-2xl font-semibold text-stone-900 mt-2 font-mono">
            {metrics?.latencyP95Ms ?? 0}<span className="text-xs font-normal text-stone-400">ms</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-1">SLO target &le; 1400ms</div>
        </div>

        <div className="bg-white border border-stone-200 rounded p-4">
          <div className="text-[11px] text-stone-500 font-medium">Input Tokens</div>
          <div className="text-2xl font-semibold text-stone-900 mt-2 font-mono">
            {(metrics?.totalInputTokens ?? 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">$0.075 / 1M tokens</div>
        </div>

        <div className="bg-white border border-stone-200 rounded p-4">
          <div className="text-[11px] text-stone-500 font-medium">Output Tokens</div>
          <div className="text-2xl font-semibold text-stone-900 mt-2 font-mono">
            {(metrics?.totalOutputTokens ?? 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">$0.30 / 1M tokens</div>
        </div>

        <div className="bg-white border border-stone-200 rounded p-4">
          <div className="text-[11px] text-stone-500 font-medium">Accumulated Cost</div>
          <div className="text-2xl font-semibold text-stone-900 mt-2 font-mono">
            ${(metrics?.totalEstimatedCostUsd ?? 0).toFixed(4)}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">{metrics?.totalQueries ?? 0} total requests</div>
        </div>
      </div>

      {/* Latency Timeline & Strategy Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency History Chart */}
        <div className="bg-white border border-stone-200 rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-900">Query Latency Profile (ms)</h2>
            <span className="text-xs text-stone-500 font-mono">Target: &lt;1400ms</span>
          </div>
          <div className="h-64">
            {chartLatencyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                No latency history recorded yet. Execute queries to visualize.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartLatencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                  <XAxis dataKey="name" stroke="#a8a29e" fontSize={11} />
                  <YAxis stroke="#a8a29e" fontSize={11} unit="ms" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e7e5e4', fontSize: '11px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="#1c1917"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#1c1917' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Strategy Distribution */}
        <div className="bg-white border border-stone-200 rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-900">Queries by Retrieval Strategy</h2>
            <span className="text-xs text-stone-500">Distribution of executed requests</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="name" stroke="#a8a29e" fontSize={10} />
                <YAxis stroke="#a8a29e" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e7e5e4', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {strategyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Request Audit Trail Table */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">
            Live Request Audit Trail ({recentQueries.length})
          </h2>
          <span className="text-xs text-stone-500">
            Never logs private secrets or raw sensitive contents
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Request ID</th>
                <th className="px-5 py-3">Query</th>
                <th className="px-5 py-3">Strategy</th>
                <th className="px-5 py-3 font-medium">Retrieval ms</th>
                <th className="px-5 py-3 font-medium">Generation ms</th>
                <th className="px-5 py-3 font-medium">Total ms</th>
                <th className="px-5 py-3 font-medium">Tokens</th>
                <th className="px-5 py-3 font-medium">Cost</th>
                <th className="px-5 py-3 text-right">Evidence Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentQueries.map((q) => (
                <tr key={q.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-[10px] text-stone-400">
                    {q.id.replace('query_', '')}
                  </td>
                  <td className="px-5 py-3 font-medium text-stone-900 max-w-xs truncate" title={q.query}>
                    {q.query}
                  </td>
                  <td className="px-5 py-3 capitalize font-mono text-[11px] text-stone-800">
                    {q.strategy.replace('_', ' ')}
                  </td>
                  <td className="px-5 py-3 font-mono text-stone-700">
                    {q.metrics.retrievalLatencyMs}ms
                  </td>
                  <td className="px-5 py-3 font-mono text-stone-700">
                    {q.metrics.generationLatencyMs}ms
                  </td>
                  <td className="px-5 py-3 font-mono text-stone-900 font-semibold">
                    {q.metrics.totalLatencyMs}ms
                  </td>
                  <td className="px-5 py-3 font-mono text-stone-600 text-[11px]">
                    {q.metrics.inputTokens + q.metrics.outputTokens}
                  </td>
                  <td className="px-5 py-3 font-mono text-stone-600 text-[11px]">
                    ${q.metrics.estimatedCostUsd.toFixed(5)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {q.hasSufficientEvidence ? (
                      <span className="text-emerald-700 font-medium text-[11px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Grounded</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium text-[11px] inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Insufficient</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
