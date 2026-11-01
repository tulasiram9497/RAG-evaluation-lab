/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { DocumentManagerPage } from './pages/DocumentManagerPage.js';
import { RagChatPage } from './pages/RagChatPage.js';
import { RetrievalExplorerPage } from './pages/RetrievalExplorerPage.js';
import { ExperimentsPage } from './pages/ExperimentsPage.js';
import { EvaluationPage } from './pages/EvaluationPage.js';
import { MonitoringPage } from './pages/MonitoringPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { ApiDocsPage } from './pages/ApiDocsPage.js';
import { DocumentMetadata, QueryResponse, RetrievalStrategy, SystemMetrics } from '../server/types.js';
import { api } from './services/api.js';
import { LiquidGlassControls } from './components/LiquidGlassControls.js';
import { LiquidGlassProfileCard } from './components/LiquidGlassProfileCard.js';
import { FloatingGlassParticles } from './components/FloatingGlassParticles.js';
import { AgentAccuracyLab } from './components/AgentAccuracyLab.js';
import { 
  Sliders, 
  User, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Database,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recentQueries, setRecentQueries] = useState<QueryResponse[]>([]);
  const [quickSearchState, setQuickSearchState] = useState<{ query: string; strategy: RetrievalStrategy }>({
    query: '',
    strategy: 'hybrid_rerank',
  });

  // Modal triggers for Reference 1 & 2
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const refreshState = async () => {
    try {
      const [docsRes, metricsRes, queriesRes] = await Promise.all([
        api.getDocuments(),
        api.getMonitoringMetrics(),
        api.getQueryHistory(10),
      ]);
      setDocuments(docsRes.documents);
      setMetrics(metricsRes);
      setRecentQueries(queriesRes.history);
    } catch (err) {
      console.error('Failed to load application state:', err);
    }
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleRunQuickQuery = (query: string, strategy: RetrievalStrategy) => {
    setQuickSearchState({ query, strategy });
    setActiveTab('chat');
  };

  const totalChunks = documents.reduce((sum, d) => sum + d.totalChunks, 0);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900 font-sans flex flex-col relative selection:bg-orange-500/25 selection:text-orange-950">
      {/* Background Subtle Claude Code Ambient Gradients & Tech Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="tech-grid absolute inset-0 opacity-60" />
        <div className="absolute -top-36 -left-36 w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-36 w-[650px] h-[650px] bg-amber-400/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-28 left-1/4 w-[700px] h-[550px] bg-orange-500/8 rounded-full blur-[160px]" />
      </div>

      {/* 3D Floating Liquid Glass Particles reacting to mouse hover & movement */}
      <FloatingGlassParticles />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Liquid Glass Navigation Bar with Apple VisionOS Quick Orbs */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          docCount={documents.length}
          chunkCount={totalChunks}
          onOpenControls={() => setIsControlsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Main Content Viewport with Universal Liquid Glass Styling */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 rag-glass-theme">
          {activeTab === 'dashboard' && (
            <DashboardPage
              metrics={metrics}
              recentQueries={recentQueries}
              onNavigate={setActiveTab}
              onRunQuickQuery={handleRunQuickQuery}
              onOpenControls={() => setIsControlsOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}

          {activeTab === 'agents' && <AgentAccuracyLab />}

          {activeTab === 'documents' && (
            <DocumentManagerPage
              documents={documents}
              onRefresh={refreshState}
            />
          )}

          {activeTab === 'chat' && (
            <RagChatPage
              initialQuery={quickSearchState.query}
              initialStrategy={quickSearchState.strategy}
            />
          )}

          {activeTab === 'retrieval' && <RetrievalExplorerPage />}

          {activeTab === 'experiments' && <ExperimentsPage />}

          {activeTab === 'evaluation' && <EvaluationPage />}

          {activeTab === 'monitoring' && <MonitoringPage />}

          {activeTab === 'settings' && <SettingsPage />}

          {activeTab === 'api_docs' && <ApiDocsPage />}
        </main>

        {/* Liquid Glass Footer */}
        <footer className="border-t border-white/10 bg-[#060a12]/80 backdrop-blur-xl py-4 mt-12 relative z-10">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white tracking-wide">RAG Evaluation Lab</span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-cyan-300 font-mono">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                Qdrant HNSW Vectors (768-dim)
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                SLO P95 &lt; 1400ms
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsControlsOpen(true)}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px] font-mono cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>OS Controls (Ref 2)</span>
              </button>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="hover:text-purple-300 transition-colors flex items-center gap-1 text-[11px] font-mono cursor-pointer"
              >
                <User className="w-3 h-3" />
                <span>Architect Card (Ref 1)</span>
              </button>
              <span className="text-white/20">•</span>
              <span className="text-white/40">Model: gemini-3.8-flash</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Bottom-Right Quick Action Dock (Reference 2 Styling) */}
      <aside aria-label="RAG Quick Controls" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Glass OS Controls Orb */}
        <button
          onClick={() => setIsControlsOpen(true)}
          className="liquid-glass-circle w-11 h-11 flex items-center justify-center text-cyan-200 hover:text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open Apple VisionOS Liquid Glass Controls (Reference 2)"
        >
          <Sliders className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          <span className="sr-only">Open Apple VisionOS Liquid Glass Controls</span>
        </button>

        {/* Kasun Dilanka Liquid Glass Profile Card Trigger */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="liquid-glass-circle w-11 h-11 flex items-center justify-center text-purple-200 hover:text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open Kasun Dilanka Liquid Glass Profile Card (Reference 1)"
        >
          <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="sr-only">Open Kasun Dilanka Liquid Glass Profile Card</span>
        </button>

        {/* Quick Benchmark Run Pill */}
        <button
          onClick={() => setActiveTab('evaluation')}
          className="liquid-glass-pill px-4 py-2 flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
          <span>[ 50-Q BENCHMARK ]</span>
        </button>
      </aside>

      {/* Reference 2: Apple VisionOS Liquid Glass Controls Modal */}
      <LiquidGlassControls
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
        onTriggerToast={showToast}
      />

      {/* Reference 1: Kasun Dilanka Liquid Glass Card Modal */}
      <LiquidGlassProfileCard
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onTriggerToast={showToast}
      />

      {/* Toast Feedback Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/20 bg-[#0d1424]/90 text-white shadow-2xl backdrop-blur-xl animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-medium tracking-wide font-mono">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
