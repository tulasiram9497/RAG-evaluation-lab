/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Files, 
  MessageSquare, 
  Compass, 
  FlaskConical, 
  CheckSquare, 
  Activity, 
  Sliders, 
  FileCode2,
  Database,
  SlidersHorizontal,
  User,
  Zap,
  Sparkles,
  Bot,
  Brain,
  AlertTriangle
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'agents'
  | 'documents'
  | 'chat'
  | 'retrieval'
  | 'experiments'
  | 'evaluation'
  | 'monitoring'
  | 'settings'
  | 'api_docs';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  docCount: number;
  chunkCount: number;
  onOpenControls: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  docCount,
  chunkCount,
  onOpenControls,
  onOpenProfile,
}) => {
  // Navigation items with white-bordered, orange-interior icon badges
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <LayoutDashboard className="w-3 h-3 text-white" />
        </span>
      ) 
    },
    { 
      id: 'agents', 
      label: 'Agent Accuracy Lab', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <Brain className="w-3 h-3 text-white" />
        </span>
      ),
      badge: '1 Fix Needed'
    },
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <Files className="w-3 h-3 text-white" />
        </span>
      ) 
    },
    { 
      id: 'chat', 
      label: 'RAG Chat', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <MessageSquare className="w-3 h-3 text-white" />
        </span>
      ) 
    },
    { 
      id: 'retrieval', 
      label: 'Retrieval Explorer', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <Compass className="w-3 h-3 text-white" />
        </span>
      ) 
    },
    { 
      id: 'experiments', 
      label: 'Experiments', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <FlaskConical className="w-3 h-3 text-white" />
        </span>
      ) 
    },
    { 
      id: 'evaluation', 
      label: 'Evaluation', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <CheckSquare className="w-3 h-3 text-white" />
        </span>
      ) 
    },
    { 
      id: 'monitoring', 
      label: 'Monitoring', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <Activity className="w-3 h-3 text-white" />
        </span>
      ) 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <Sliders className="w-3 h-3 text-white" />
        </span>
      ) 
    },
    { 
      id: 'api_docs', 
      label: 'API Docs', 
      icon: (
        <span className="claude-icon-badge-sm w-5 h-5 shrink-0">
          <FileCode2 className="w-3 h-3 text-white" />
        </span>
      ) 
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/90 bg-white/95 backdrop-blur-2xl transition-all shadow-[0_2px_12px_rgba(234,88,12,0.04)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand in Claude Code styling with white edge and orange interior */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              onClick={() => onSelectTab('dashboard')}
              className="claude-icon-badge w-9 h-9 font-bold text-sm tracking-wider cursor-pointer shadow-md shadow-orange-500/25"
              title="RAG Evaluation Lab"
            >
              RL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-sm sm:text-base tracking-tight">RAG Evaluation Lab</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-200 font-semibold">
                  Claude Code
                </span>
              </div>
              <div className="text-[11px] text-stone-500 flex items-center gap-2">
                <span>Production RAG Benchmarking</span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1 text-orange-700 font-mono font-medium">
                  <Database className="w-3 h-3 text-orange-600" />
                  {docCount} docs ({chunkCount} chunks)
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items (Claude Code White & Orange Pills) */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 px-1.5 rounded-2xl bg-stone-100/70 border border-stone-200/80">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap relative ${
                    isActive
                      ? 'bg-white text-stone-950 border border-orange-200 shadow-sm shadow-orange-500/10'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700 border border-orange-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            {/* Reference 2: Liquid Glass Controls Orb */}
            <button
              onClick={onOpenControls}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-orange-50/50 text-stone-700 hover:text-stone-950 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Open Apple VisionOS Liquid Glass Controls"
            >
              <span className="claude-icon-badge-sm w-4 h-4">
                <SlidersHorizontal className="w-2.5 h-2.5 text-white" />
              </span>
              <span className="hidden sm:inline">Glass OS</span>
            </button>

            {/* Reference 1: Profile Card Trigger */}
            <button
              onClick={onOpenProfile}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-orange-50/50 text-stone-700 hover:text-stone-950 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Open Kasun Dilanka Liquid Glass Card"
            >
              <span className="claude-icon-badge-sm w-4 h-4">
                <User className="w-2.5 h-2.5 text-white" />
              </span>
              <span className="hidden sm:inline">Architect</span>
            </button>

            {/* Run Benchmark Action Button */}
            <button
              onClick={() => onSelectTab('evaluation')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            >
              <span className="claude-icon-badge-sm w-4 h-4">
                <Zap className="w-2.5 h-2.5 text-white" />
              </span>
              <span className="hidden md:inline font-mono">Run 50-Q</span>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Subnav */}
        <div className="flex xl:hidden items-center gap-1 overflow-x-auto py-2 border-t border-stone-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-50 text-orange-900 border border-orange-200 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1 rounded-full bg-orange-100 text-orange-700 font-bold">
                    !
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
