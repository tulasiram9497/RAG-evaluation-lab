import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onExplore?: () => void;
  onOpenDApp?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onExplore, onOpenDApp }) => {
  const handleClick = onOpenDApp || onExplore || (() => {});
  return (
    <div className="bg-stone-950/90 border-b border-white/10 text-stone-300 text-[11px] sm:text-xs py-2 px-4 relative z-50 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] uppercase tracking-wider font-semibold border border-blue-500/30">
            Beta
          </span>
          <span className="truncate text-stone-300 font-medium">
            ChainGPT × Liquid Glass AI is Here — The Ultimate Web3 & Liquid Interface Experience
          </span>
        </div>
        <button
          onClick={handleClick}
          className="flex items-center gap-1 text-white hover:text-blue-400 font-medium transition-colors cursor-pointer shrink-0 ml-4 group"
        >
          <span>Explore Platform</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
