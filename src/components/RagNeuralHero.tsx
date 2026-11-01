/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Compass, 
  CheckSquare, 
  Zap, 
  Cpu, 
  Database,
  ArrowRight,
  ShieldCheck,
  Activity,
  Play,
  Brain
} from 'lucide-react';
import { RetrievalStrategy } from '../../server/types.js';

interface RagNeuralHeroProps {
  onRunQuickQuery: (query: string, strategy: RetrievalStrategy) => void;
  onOpenBenchmark: () => void;
  onOpenControls: () => void;
}

export const RagNeuralHero: React.FC<RagNeuralHeroProps> = ({
  onRunQuickQuery,
  onOpenBenchmark,
  onOpenControls,
}) => {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const ragPrompts = [
    {
      query: 'What is the smoothing constant k in Reciprocal Rank Fusion?',
      pipeline: 'HYBRID + CROSS-ENCODER RERANKING',
      strategy: 'hybrid_rerank' as RetrievalStrategy,
      phase: 'STAGE 01 // DENSE + BM25 FUSION',
      kValue: 'k = 60 (Empirically optimal for rank normalization)',
      latency: '184ms'
    },
    {
      query: 'How does Qdrant HNSW indexing achieve sub-10ms latency?',
      pipeline: 'VECTOR SIMILARITY SEARCH',
      strategy: 'vector' as RetrievalStrategy,
      phase: 'STAGE 02 // HNSW GRAPH TRAVERSAL',
      kValue: 'm = 16, ef_construct = 100, 768-dim cosine metric',
      latency: '12ms'
    },
    {
      query: 'What are the 3 defenses against indirect prompt injection?',
      pipeline: 'SYNTHESIS & CITATION VERIFICATION',
      strategy: 'hybrid_rerank' as RetrievalStrategy,
      phase: 'STAGE 03 // CONSTRAINED CONTEXT GROUNDING',
      kValue: 'Strict JSON schema, ungrounded-claim penalty, citation anchoring',
      latency: '340ms'
    },
    {
      query: 'What was the stock price of Apple in 1984?',
      pipeline: 'INSUFFICIENT EVIDENCE DETECTOR',
      strategy: 'vector' as RetrievalStrategy,
      phase: 'STAGE 04 // HALLUCINATION GUARDRAIL',
      kValue: 'Refusal triggered: Query not supported by ingested corpus',
      latency: '82ms'
    }
  ];

  const current = ragPrompts[activePromptIndex];

  // Typing effect on the visor screen
  useEffect(() => {
    let currentIdx = 0;
    const fullText = current.query;
    setDisplayText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (currentIdx <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIdx));
        currentIdx++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [activePromptIndex]);

  const handleNextPrompt = () => {
    setActivePromptIndex((prev) => (prev + 1) % ragPrompts.length);
  };

  const handleExecuteCurrent = () => {
    onRunQuickQuery(current.query, current.strategy);
  };

  return (
    <div className="relative rounded-3xl border border-stone-200/90 bg-white/95 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_4px_24px_rgba(234,88,12,0.06)] overflow-hidden mb-8">
      {/* Background warm orange glow lines */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Telemetry Header in Claude Code styling */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-100 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-orange-700 font-bold flex items-center gap-1.5">
            <span className="claude-icon-badge-sm w-4.5 h-4.5">
              <Brain className="w-2.5 h-2.5 text-white" />
            </span>
            [ CLAUDE CODE // RAG NEURAL ENGINE ]
          </span>
          <span className="text-stone-400">// PIPELINE v1.2</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            HNSW & CROSS-ENCODER ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-4 text-stone-500 text-[11px]">
          <span>LATENCY: P95 &lt; 380ms</span>
          <span>•</span>
          <span>EMBEDDINGS: 768-DIM</span>
          <span>•</span>
          <span className="text-orange-700 font-semibold">BENCHMARK: 50-Q SUITE</span>
        </div>
      </div>

      {/* Main Grid: Left Value Pitch, Center 3D Animated Visor, Right Interactive Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
        {/* Left Column: Heading & Description */}
        <div className="lg:col-span-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-mono font-medium">
            <span className="claude-icon-badge-sm w-4 h-4">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </span>
            <span>Claude Code Architecture</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
            RAG Evaluation & <br />
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Telemetry Lab
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Multi-strategy retrieval benchmarking (Vector, BM25, Hybrid RRF, Cross-Encoder), automated 50-question evaluation, faithfulness scoring, and production latency analytics.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExecuteCurrent}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <span className="claude-icon-badge-sm w-4 h-4">
                <Zap className="w-2.5 h-2.5 text-white" />
              </span>
              <span>Query Active Pipeline</span>
            </button>
            <button
              onClick={onOpenBenchmark}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:border-orange-300 bg-white hover:bg-orange-50/50 text-stone-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span className="claude-icon-badge-sm w-4 h-4">
                <CheckSquare className="w-2.5 h-2.5 text-white" />
              </span>
              <span>Run 50-Q Suite</span>
            </button>
          </div>
        </div>

        {/* Center Column: 3D Robot / Visor Neural Element in Claude Code styling */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[340px]">
            {/* Top antenna with glowing orange sensor */}
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/80 animate-ping" />
              <div className="w-1 h-3.5 bg-gradient-to-b from-orange-500 to-transparent" />
            </div>

            {/* Robot Head Frame */}
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-orange-400 via-amber-300 to-orange-500 shadow-xl backdrop-blur-xl border border-white">
              {/* Outer Cyber Casing */}
              <div className="rounded-[22px] bg-[#1c1917] p-4 border border-stone-700 shadow-2xl">
                
                {/* Visor Screen with Amber/Orange glow */}
                <div className="relative rounded-2xl bg-black/95 p-4 border border-orange-500/40 shadow-inner overflow-hidden">
                  {/* Visor Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-[10px] font-mono text-orange-400 font-semibold">
                    <span>{current.pipeline}</span>
                    <span className="text-stone-400">{activePromptIndex + 1} / 4</span>
                  </div>

                  {/* Robot Visor Glowing Eyes */}
                  <div className="flex items-center justify-center gap-6 my-3">
                    <div className="w-3.5 h-4.5 rounded-full bg-orange-400 shadow-[0_0_12px_#fb923c] animate-pulse" />
                    <div className="w-3.5 h-4.5 rounded-full bg-orange-400 shadow-[0_0_12px_#fb923c] animate-pulse" />
                  </div>

                  {/* Visor Animated Typewriter Query */}
                  <div className="min-h-[58px] text-xs font-mono text-stone-100 leading-relaxed text-center font-medium">
                    "{displayText}
                    {isTyping && <span className="text-orange-400 animate-pulse font-bold">_</span>}"
                  </div>

                  {/* Technical Detail on Visor */}
                  <div className="text-[10px] text-stone-400 font-mono text-center truncate pt-1">
                    {current.kValue}
                  </div>

                  {/* Audio / Neural Waveform Spectrum in Claude Orange */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                    <div className="flex items-center gap-1 text-orange-400">
                      {[12, 22, 16, 28, 14, 20, 8, 24, 18].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-orange-500 to-amber-300 rounded-full animate-pulse"
                          style={{
                            height: `${h}px`,
                            animationDuration: `${0.4 + (i % 3) * 0.2}s`
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNextPrompt}
                      className="text-[11px] font-mono text-orange-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>NEXT QUERY</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Sub-Processor Badge */}
                <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-white/[0.05] border border-stone-700 text-[11px] font-mono">
                  <div className="flex items-center gap-2 text-stone-300">
                    <span className="claude-icon-badge-sm w-4 h-4">
                      <Cpu className="w-2.5 h-2.5 text-white" />
                    </span>
                    <span>ENGINE: HNSW-HYBRID // 768-D</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{current.latency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Capabilities & Presets */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-[11px] uppercase tracking-wider font-mono text-stone-500 mb-2 flex items-center justify-between">
            <span>RAG EVALUATION SUITE</span>
            <span className="text-orange-700 font-semibold">[ 04 MODES ]</span>
          </div>

          {ragPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActivePromptIndex(idx);
                onRunQuickQuery(item.query, item.strategy);
              }}
              className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                activePromptIndex === idx
                  ? 'border-orange-400 bg-orange-50 text-stone-900 shadow-sm shadow-orange-500/10'
                  : 'border-stone-200/90 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-orange-700 font-semibold">
                <span>{item.phase}</span>
                <span className="text-stone-400">{item.strategy.toUpperCase()}</span>
              </div>
              <div className="text-xs font-semibold text-stone-900 mt-1 truncate">
                {item.query}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
