import React, { useState } from 'react';
import { Sliders, Save, Check, RefreshCw, Cpu, Database, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [chunkStrategy, setChunkStrategy] = useState<'recursive' | 'fixed' | 'overlapping' | 'semantic'>('recursive');
  const [chunkSize, setChunkSize] = useState(250);
  const [chunkOverlap, setChunkOverlap] = useState(40);
  const [k1, setK1] = useState(1.5);
  const [b, setB] = useState(0.75);
  const [rrfK, setRrfK] = useState(60);
  const [model, setModel] = useState('gemini-3.8-flash');
  const [temperature, setTemperature] = useState(0.1);
  const [systemPrompt, setSystemPrompt] = useState(
`You are the Generation Engine of a production-grade RAG Evaluation Lab.
Your task is to answer user queries STRICTLY based on the provided retrieved passages.
1. Ground every claim directly in the provided passages. Never invent facts or citations.
2. If the context does not contain sufficient information, state: "I cannot answer this question based on the provided documents as there is insufficient evidence."
3. Every cited claim must reference the exact Source ID.`
  );
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 tracking-tight">RAG Pipeline Hyperparameters & Settings</h1>
          <p className="text-xs text-stone-500 mt-1">
            Tune chunking windows, BM25 saturation, Reciprocal Rank Fusion parameters, and model prompting rules.
          </p>
        </div>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Pipeline settings saved and applied to active session.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Module B: Chunking Engine Settings */}
        <div className="bg-white border border-stone-200 rounded p-5 space-y-4">
          <div className="border-b border-stone-100 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900">Module B: Chunking Engine Defaults</h2>
            <span className="text-stone-400 font-mono text-[11px]">Token Window Tuning</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Default Strategy</label>
              <select
                value={chunkStrategy}
                onChange={(e) => setChunkStrategy(e.target.value as any)}
                className="w-full border border-stone-300 rounded px-3 py-2 bg-white text-stone-900"
              >
                <option value="recursive">Recursive (Paragraphs & Lines)</option>
                <option value="semantic">Semantic (Header-Aware)</option>
                <option value="overlapping">Overlapping Window</option>
                <option value="fixed">Fixed Size Window</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Target Chunk Size (tokens)</label>
              <input
                type="number"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                min={50}
                max={1000}
                className="w-full border border-stone-300 rounded px-3 py-2 text-stone-900"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Stride Overlap (tokens)</label>
              <input
                type="number"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
                min={0}
                max={200}
                className="w-full border border-stone-300 rounded px-3 py-2 text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Module E: BM25 & Fusion Parameters */}
        <div className="bg-white border border-stone-200 rounded p-5 space-y-4">
          <div className="border-b border-stone-100 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900">Module E: BM25 & Rank Fusion Hyperparameters</h2>
            <span className="text-stone-400 font-mono text-[11px]">Robertson-Spärck Jones</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-stone-700 mb-1">BM25 k1 (Term Saturation)</label>
              <input
                type="number"
                step={0.1}
                value={k1}
                onChange={(e) => setK1(Number(e.target.value))}
                min={0.5}
                max={3.0}
                className="w-full border border-stone-300 rounded px-3 py-2 text-stone-900"
              />
              <p className="text-[10px] text-stone-400 mt-1">Calibrates term frequency impact (standard 1.2–2.0).</p>
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">BM25 b (Length Normalization)</label>
              <input
                type="number"
                step={0.05}
                value={b}
                onChange={(e) => setB(Number(e.target.value))}
                min={0.0}
                max={1.0}
                className="w-full border border-stone-300 rounded px-3 py-2 text-stone-900"
              />
              <p className="text-[10px] text-stone-400 mt-1">0 = no length penalty, 1 = full doc length normalization.</p>
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">RRF Constant k (Smoothing)</label>
              <input
                type="number"
                value={rrfK}
                onChange={(e) => setRrfK(Number(e.target.value))}
                min={1}
                max={120}
                className="w-full border border-stone-300 rounded px-3 py-2 text-stone-900"
              />
              <p className="text-[10px] text-stone-400 mt-1">Rank constant in Score = sum(w / (k + rank)). Default 60.</p>
            </div>
          </div>
        </div>

        {/* Module F: Generation Engine & System Prompt */}
        <div className="bg-white border border-stone-200 rounded p-5 space-y-4">
          <div className="border-b border-stone-100 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900">Module F: Generation Engine & Guardrails</h2>
            <span className="text-stone-400 font-mono text-[11px]">Gemini 3.8 Flash</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-stone-700 mb-1">LLM Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full border border-stone-300 rounded px-3 py-2 bg-white text-stone-900"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended, fast & cost-efficient)</option>
                <option value="gemini-flash-latest">gemini-flash-latest</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Temperature ({temperature})</label>
              <input
                type="range"
                min={0.0}
                max={1.0}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-stone-900"
              />
              <p className="text-[10px] text-stone-400 mt-1">Low temperature (&le;0.2) maximizes faithfulness and adherence to retrieved evidence.</p>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Production System Prompt Template</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={5}
              className="w-full border border-stone-300 rounded p-3 font-mono text-[11px] text-stone-900"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
