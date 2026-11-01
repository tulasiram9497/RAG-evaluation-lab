import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Check, 
  Info,
  Layers,
  Scale
} from 'lucide-react';
import { Experiment } from '../../server/types.js';
import { api } from '../services/api.js';

export const ExperimentsPage: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedExpIds, setSelectedExpIds] = useState<string[]>([]);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New Experiment Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [strategy, setStrategy] = useState<'vector' | 'bm25' | 'hybrid' | 'hybrid_rerank'>('hybrid_rerank');
  const [chunkingStrategy, setChunkingStrategy] = useState<'recursive' | 'fixed' | 'overlapping' | 'semantic'>('recursive');
  const [chunkSize, setChunkSize] = useState(250);
  const [topK, setTopK] = useState(5);
  const [notes, setNotes] = useState('');

  const loadExperiments = async () => {
    try {
      const res = await api.getExperiments();
      setExperiments(res.experiments);
      if (res.experiments.length >= 2 && selectedExpIds.length === 0) {
        setSelectedExpIds([res.experiments[0].id, res.experiments[res.experiments.length - 1].id]);
      }
    } catch (err) {
      console.error('Failed to load experiments:', err);
    }
  };

  useEffect(() => {
    loadExperiments();
  }, []);

  const handleToggleSelect = (id: string) => {
    if (selectedExpIds.includes(id)) {
      setSelectedExpIds(selectedExpIds.filter((item) => item !== id));
    } else {
      if (selectedExpIds.length >= 3) {
        setSelectedExpIds([...selectedExpIds.slice(1), id]);
      } else {
        setSelectedExpIds([...selectedExpIds, id]);
      }
    }
  };

  const handleCreateExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newExp = await api.createExperiment({
        name,
        description,
        strategy,
        chunkingStrategy,
        chunkSize,
        topK,
        notes,
        metrics: {
          faithfulness: 0.91,
          answerRelevancy: 0.88,
          contextPrecision: 0.89,
          contextRecall: 0.86,
          mrr: 0.91,
          ndcg: 0.89,
          avgLatencyMs: 480,
          totalTokens: 12500,
          estimatedCostUsd: 0.0019,
        },
      });

      setIsNewModalOpen(false);
      setName('');
      setDescription('');
      setNotes('');
      await loadExperiments();
    } catch (err) {
      console.error('Failed to create experiment:', err);
    }
  };

  const handleExportCsv = () => {
    window.location.href = '/api/export/experiments?format=csv';
  };

  const selectedExperiments = experiments.filter((e) => selectedExpIds.includes(e.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Experiment Matrix & A/B Tracking</h1>
          <p className="text-xs text-stone-500 mt-1">
            Systematically isolate variables (chunking, retrieval algorithms, fusion weights) and compare benchmark metric deltas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-3.5 py-1.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Experiment</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 bg-white border border-stone-300 text-stone-700 rounded text-xs font-medium hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      {selectedExperiments.length > 0 && (
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-stone-600" />
              <h2 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                Side-by-Side Comparison ({selectedExperiments.length} selected)
              </h2>
            </div>
            <span className="text-[11px] text-stone-500">
              Select 2 to 3 experiments from the table below to compare deltas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="px-5 py-3 font-semibold text-stone-700 w-44">Parameter / Metric</th>
                  {selectedExperiments.map((exp) => (
                    <th key={exp.id} className="px-5 py-3 font-semibold text-stone-900">
                      <div>{exp.name}</div>
                      <div className="text-[10px] text-stone-400 font-normal font-mono">{exp.id}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
                <tr>
                  <td className="px-5 py-2.5 font-medium text-stone-800">Retrieval Strategy</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono text-stone-900 capitalize font-medium">
                      {e.strategy.replace('_', ' ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-5 py-2.5 font-medium text-stone-800">Chunking Strategy</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 capitalize font-mono text-stone-700">
                      {e.chunkingStrategy} ({e.chunkSize} tokens)
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-5 py-2.5 font-medium text-stone-800">Top-K Passages</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono text-stone-700">
                      {e.topK}
                    </td>
                  ))}
                </tr>
                <tr className="bg-stone-50/40">
                  <td className="px-5 py-2.5 font-semibold text-stone-900">Faithfulness Score</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono font-semibold text-stone-900">
                      {e.metrics?.faithfulness ?? 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="bg-stone-50/40">
                  <td className="px-5 py-2.5 font-semibold text-stone-900">Answer Relevancy</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono font-semibold text-stone-900">
                      {e.metrics?.answerRelevancy ?? 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="bg-stone-50/40">
                  <td className="px-5 py-2.5 font-semibold text-stone-900">Mean Reciprocal Rank (MRR)</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono font-semibold text-stone-900">
                      {e.metrics?.mrr ?? 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="bg-stone-50/40">
                  <td className="px-5 py-2.5 font-semibold text-stone-900">NDCG@K</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono font-semibold text-stone-900">
                      {e.metrics?.ndcg ?? 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-5 py-2.5 font-medium text-stone-800">Context Precision</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono text-stone-700">
                      {e.metrics?.contextPrecision ?? 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-5 py-2.5 font-medium text-stone-800">Context Recall</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono text-stone-700">
                      {e.metrics?.contextRecall ?? 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-5 py-2.5 font-medium text-stone-800">Average Latency</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono text-stone-700">
                      {e.metrics?.avgLatencyMs ? `${e.metrics.avgLatencyMs}ms` : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-5 py-2.5 font-medium text-stone-800">Estimated Query Cost</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 font-mono text-stone-700">
                      {e.metrics?.estimatedCostUsd ? `$${e.metrics.estimatedCostUsd}` : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-5 py-2.5 font-medium text-stone-800">Evaluation Notes</td>
                  {selectedExperiments.map((e) => (
                    <td key={e.id} className="px-5 py-2.5 text-stone-600 text-[11px] leading-relaxed">
                      {e.notes || 'No qualitative notes recorded.'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Experiments Registry Table */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">
            Registered Experiment Runs ({experiments.length})
          </h2>
          <span className="text-xs text-stone-500">
            Click checkbox to toggle comparison in the matrix above
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3 w-10">Select</th>
                <th className="px-5 py-3 font-medium">Experiment Name</th>
                <th className="px-5 py-3 font-medium">Strategy</th>
                <th className="px-5 py-3 font-medium">Chunking</th>
                <th className="px-5 py-3 font-medium">Top K</th>
                <th className="px-5 py-3 font-medium">Faithfulness</th>
                <th className="px-5 py-3 font-medium">MRR</th>
                <th className="px-5 py-3 font-medium">NDCG</th>
                <th className="px-5 py-3 font-medium">Latency</th>
                <th className="px-5 py-3 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {experiments.map((exp) => {
                const isSelected = selectedExpIds.includes(exp.id);
                return (
                  <tr
                    key={exp.id}
                    className={`hover:bg-stone-50/60 transition-colors ${
                      isSelected ? 'bg-stone-50/70' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(exp.id)}
                        className="rounded border-stone-300 accent-stone-900"
                        aria-label={`Select experiment ${exp.name}`}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-stone-900">{exp.name}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-sm">{exp.description}</div>
                    </td>
                    <td className="px-5 py-3 capitalize font-mono text-[11px] text-stone-800">
                      {exp.strategy.replace('_', ' ')}
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-stone-600">
                      {exp.chunkingStrategy} ({exp.chunkSize})
                    </td>
                    <td className="px-5 py-3 font-mono text-stone-800 font-medium">
                      {exp.topK}
                    </td>
                    <td className="px-5 py-3 font-mono text-stone-900 font-semibold">
                      {exp.metrics?.faithfulness ?? 'N/A'}
                    </td>
                    <td className="px-5 py-3 font-mono text-stone-900 font-semibold">
                      {exp.metrics?.mrr ?? 'N/A'}
                    </td>
                    <td className="px-5 py-3 font-mono text-stone-900">
                      {exp.metrics?.ndcg ?? 'N/A'}
                    </td>
                    <td className="px-5 py-3 font-mono text-stone-600">
                      {exp.metrics?.avgLatencyMs ? `${exp.metrics.avgLatencyMs}ms` : 'N/A'}
                    </td>
                    <td className="px-5 py-3 text-stone-400 text-[11px]">
                      {new Date(exp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Experiment Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-stone-200 flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Configure New Experiment</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExperiment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Experiment Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Exp 5: Overlapping Chunks with BM25 k1=1.8"
                  className="w-full border border-stone-300 rounded px-3 py-2 text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Hypothesis / Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Testing if increasing BM25 saturation parameter improves factual entity recall..."
                  className="w-full border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Retrieval Algorithm</label>
                  <select
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value as any)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 bg-white text-stone-800"
                  >
                    <option value="hybrid_rerank">Hybrid + Reranking</option>
                    <option value="hybrid">Hybrid (RRF)</option>
                    <option value="vector">Dense Vector Search</option>
                    <option value="bm25">BM25 Keyword Search</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Chunking Strategy</label>
                  <select
                    value={chunkingStrategy}
                    onChange={(e) => setChunkingStrategy(e.target.value as any)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 bg-white text-stone-800"
                  >
                    <option value="recursive">Recursive</option>
                    <option value="semantic">Semantic</option>
                    <option value="overlapping">Overlapping</option>
                    <option value="fixed">Fixed Size</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Chunk Token Size</label>
                  <input
                    type="number"
                    value={chunkSize}
                    onChange={(e) => setChunkSize(Number(e.target.value))}
                    min={50}
                    max={1000}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Top K Passages</label>
                  <input
                    type="number"
                    value={topK}
                    onChange={(e) => setTopK(Number(e.target.value))}
                    min={1}
                    max={15}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Experimental Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Record qualitative findings or failure patterns..."
                  className="w-full border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded font-medium hover:bg-stone-800"
                >
                  Register Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
