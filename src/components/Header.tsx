import React, { useState } from 'react';
import { 
  Layers, 
  ExternalLink, 
  Sparkles, 
  SlidersHorizontal, 
  User, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

interface HeaderProps {
  onOpenDApp: () => void;
  onOpenProfile: () => void;
  onOpenControlCenter: () => void;
  currentTheme: 'dark' | 'liquid';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDApp,
  onOpenProfile,
  onOpenControlCenter,
  currentTheme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Solutions', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Learn', href: '#learn' },
    { label: '$CGPT', href: '#tokenomics', badge: 'Live' },
    { label: 'Community', href: '#community' },
    { label: 'Contact us', href: '#contact' },
    { label: 'ChainGPT Pad', href: '#pad' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-stone-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                <span className="font-mono font-bold text-white text-base tracking-wider">CG</span>
              </div>
            </div>
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-xl blur-md -z-10 group-hover:bg-cyan-500/40 transition-colors" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white tracking-tight text-base font-sans">ChainGPT</span>
              <span className="text-[10px] text-cyan-400 font-mono px-1 py-0.2 rounded border border-cyan-500/30 bg-cyan-500/10">AI</span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono tracking-tight -mt-0.5">Liquid Glass Architecture</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs text-stone-300 font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors relative group py-1"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="ml-1 text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
                  · {link.badge}
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Controls & dApp CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme switcher (Liquid Glass Silk vs Dark Cyber) */}
          <button
            onClick={onToggleTheme}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono border border-white/10 hover:border-white/30 text-stone-300 hover:text-white transition-all bg-white/5 backdrop-blur-md flex items-center gap-1.5"
            title="Toggle Background Theme"
          >
            <span className={`w-2 h-2 rounded-full ${currentTheme === 'liquid' ? 'bg-cyan-400 animate-pulse' : 'bg-stone-500'}`} />
            <span className="hidden sm:inline">{currentTheme === 'liquid' ? 'Liquid Glass' : 'Dark Grid'}</span>
          </button>

          {/* Quick Glass OS Controls Modal Trigger (Reference 2) */}
          <button
            onClick={onOpenControlCenter}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all flex items-center gap-1.5 shadow-xs"
            title="Open Liquid Glass OS Control Center"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Glass OS</span>
          </button>

          {/* Creator Profile Card (Reference 1) */}
          <button
            onClick={onOpenProfile}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-white/20 text-stone-300 hover:text-white transition-all bg-white/5 backdrop-blur-md flex items-center gap-1.5"
            title="View Liquid Glass Profile Card"
          >
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden md:inline">Profile Card</span>
          </button>

          {/* Launch dApp Button (matches video CTA) */}
          <button
            onClick={onOpenDApp}
            className="relative group px-4 py-1.5 rounded-lg bg-stone-900 border border-white/20 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] flex items-center gap-1.5 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>[→ LAUNCH DAPP]</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded text-stone-400 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-stone-950/95 backdrop-blur-2xl px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-xs font-medium text-stone-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-cyan-400 transition-colors"
              >
                {link.label} {link.badge && `(${link.badge})`}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenControlCenter();
              }}
              className="flex-1 py-2 text-xs border border-cyan-500/30 rounded bg-cyan-500/10 text-cyan-300 text-center font-mono"
            >
              Glass OS Controls
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProfile();
              }}
              className="flex-1 py-2 text-xs border border-white/20 rounded bg-white/5 text-white text-center font-mono"
            >
              Creator Card
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
