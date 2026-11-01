import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  TrendingUp, 
  Code2, 
  ArrowRight, 
  Zap, 
  Cpu, 
  ChevronRight,
  Play
} from 'lucide-react';

interface HeroRobotProps {
  onLaunchDApp: () => void;
  onSelectFeatureTab: (featureId: string) => void;
  onOpenControls: () => void;
}

export const HeroRobot: React.FC<HeroRobotProps> = ({
  onLaunchDApp,
  onSelectFeatureTab,
  onOpenControls,
}) => {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [robotMood, setRobotMood] = useState<'normal' | 'happy' | 'computing' | 'security'>('computing');

  const prompts = [
    {
      title: 'CREATE A SMART CONTRACT FOR A TOKEN NAMED CGPT ON ETHEREUM.',
      sub: 'HOW TO DEPLOY A SMART CONTRACT ON THE ETHEREUM BLOCKCHAIN?',
      mode: 'DEVELOPMENT',
      icon: <Code2 className="w-4 h-4 text-cyan-400" />,
      tag: '01 // DEV_FLOW'
    },
    {
      title: 'AUDIT DEFI ROUTER CONTRACT FOR REENTRANCY AND LOGICAL EXPLOITS.',
      sub: 'REPORT GENERATED: 0 CRITICAL, 1 LOW SEVERITY (GAS OPTIMIZATION).',
      mode: 'CODE AUDITOR',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      tag: '02 // SEC_AUDIT'
    },
    {
      title: 'ANALYZE BTC / ETH LIQUIDATION HEATMAP AND RSI MOMENTUM.',
      sub: 'BULLISH DIVERGENCE DETECTED ON 4H TIMEFRAME WITH VOLUME SPIKE.',
      mode: 'MARKET ANALYSIS',
      icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
      tag: '03 // CHART_PREDICT'
    },
    {
      title: 'EXPLAIN WHAT A ZERO-KNOWLEDGE ROLLUP DOES IN SIMPLE TERMS.',
      sub: 'ZK-SNARKS ALLOW BATCH TRANSACTION VALIDATION WITH ZERO DATA EXPOSURE.',
      mode: 'CODE EXPLAINER',
      icon: <Terminal className="w-4 h-4 text-amber-400" />,
      tag: '04 // BYTECODE_EXPLAIN'
    },
  ];

  const currentPrompt = prompts[activePromptIndex];

  // Typewriter effect for robot visor
  useEffect(() => {
    let currentIdx = 0;
    const text = currentPrompt.title;
    setDisplayText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (currentIdx < text.length) {
        setDisplayText(text.slice(0, currentIdx + 1));
        currentIdx++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [activePromptIndex]);

  // Rotate prompts every 7s
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % prompts.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[calc(100vh-100px)] flex flex-col justify-between pt-8 pb-12 overflow-hidden border-b border-white/10 tech-grid">
      {/* Background ambient light orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Top Coordinate Stamp matching video frames */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full flex items-center justify-between text-[11px] font-mono text-stone-500 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold">[ 2026 ]</span>
          <span>// NEURAL ARCHITECTURE v4.2</span>
          <span className="hidden sm:inline text-stone-600">·</span>
          <span className="hidden sm:inline text-emerald-400">MAINNET ACTIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <span>COORDS: 44.20.10.8</span>
          <span className="text-stone-600">·</span>
          <span>LATENCY: 14ms</span>
        </div>
      </div>

      {/* Main Hero Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        
        {/* Left Column: Editorial Headline & Subtitle */}
        <div className="lg:col-span-4 flex flex-col space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-stone-300 text-[11px] font-mono w-fit">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>UNLEASH THE POWER OF</span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white uppercase leading-[1.08] font-sans">
            Blockchain <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
              AI Solutions
            </span>
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-md font-sans">
            Your personal expert in all crypto, Web3 security, & blockchain-related topics. Generate audited contracts, inspect chart signals, and experience liquid glass interfaces.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onLaunchDApp}
              className="px-5 py-2.5 rounded-lg bg-white text-stone-950 text-xs font-semibold hover:bg-stone-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-600 fill-current" />
              <span>Launch dApp Console</span>
            </button>

            <button
              onClick={onOpenControls}
              className="px-4 py-2.5 rounded-lg border border-white/20 text-stone-300 text-xs font-medium hover:border-white/40 hover:text-white transition-all bg-white/5 backdrop-blur-md flex items-center gap-2 cursor-pointer"
            >
              <span>Liquid Glass OS</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>

          {/* Social Proof metrics */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-stone-400 text-xs font-mono">
            <div>
              <div className="text-white text-base font-bold font-sans">14,290+</div>
              <div className="text-[10px] text-stone-500">Audited Contracts</div>
            </div>
            <div>
              <div className="text-white text-base font-bold font-sans">99.98%</div>
              <div className="text-[10px] text-stone-500">Zero Exploit Rate</div>
            </div>
            <div>
              <div className="text-white text-base font-bold font-sans">$42.8M</div>
              <div className="text-[10px] text-stone-500">TVL Protected</div>
            </div>
          </div>
        </div>

        {/* Center Column: 3D Robot with Rainbow Chromatic Visor */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[460px] sm:min-h-[520px]">
          {/* Circular optical refraction aura */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-transparent blur-xl pointer-events-none" />
          
          {/* Main 3D Robot Figure */}
          <div className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] flex flex-col items-center animate-float">
            
            {/* Robot Head Assembly */}
            <div className="relative w-64 sm:w-72 h-60 sm:h-64 rounded-3xl bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 p-1.5 shadow-2xl border border-white/15">
              
              {/* Mechanical Earphones (Left & Right) */}
              <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-6 h-20 rounded-l-xl bg-gradient-to-r from-stone-900 to-stone-700 border-l border-y border-white/20 flex flex-col justify-between py-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />
                <span className="w-1 h-8 rounded-full bg-white/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-20 rounded-r-xl bg-gradient-to-l from-stone-900 to-stone-700 border-r border-y border-white/20 flex flex-col justify-between py-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />
                <span className="w-1 h-8 rounded-full bg-white/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>

              {/* Antenna / Sensor module on top */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1">
                <div className="w-1.5 h-6 bg-stone-700 border border-white/20 rounded-t" />
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_cyan] border border-white/40 -mt-1 animate-pulse" />
              </div>

              {/* Rainbow Chromatic Visor Frame (Exact match from Reference 3 Video) */}
              <div className="w-full h-full rounded-[20px] p-2 relative overflow-hidden bg-stone-950/90 flex flex-col justify-between border-2 border-transparent"
                style={{
                  background: 'linear-gradient(to bottom, #090a0f, #0d1117)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9), 0 0 35px rgba(56,189,248,0.25)'
                }}
              >
                {/* Iridescent Rainbow Bezel border */}
                <div className="absolute inset-0 rounded-[20px] p-[2.5px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e, #fb923c, #facc15, #4ade80, #38bdf8, #818cf8, #c084fc)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: 0.95,
                  }}
                />

                {/* Top Visor HUD Header */}
                <div className="relative z-10 flex items-center justify-between px-2 pt-1 text-[10px] font-mono text-stone-400 border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-cyan-300 font-semibold">{currentPrompt.mode}</span>
                  </div>
                  <span className="text-stone-500">{currentPrompt.tag}</span>
                </div>

                {/* Animated Visor Screen Display: Face eyes or prompt text */}
                <div className="relative z-10 flex-1 flex flex-col justify-center px-3 py-2 text-center">
                  {/* Glowing Digital Eyes or Quote symbol */}
                  <div className="flex items-center justify-center gap-8 mb-2">
                    <div className="w-3.5 h-5 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8] animate-pulse" />
                    <div className="w-3.5 h-5 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8] animate-pulse" />
                  </div>

                  {/* Typing Prompt Content */}
                  <div className="min-h-[58px] flex items-center justify-center">
                    <p className="font-mono text-xs sm:text-[13px] text-white font-medium leading-relaxed tracking-tight">
                      "{displayText}"
                      <span className={`inline-block w-1.5 h-3.5 ml-0.5 bg-cyan-400 ${isTyping ? 'opacity-100' : 'opacity-0'} animate-pulse`} />
                    </p>
                  </div>

                  <p className="text-[10px] font-mono text-stone-400 mt-1 line-clamp-1">
                    {currentPrompt.sub}
                  </p>
                </div>

                {/* Visor Bottom Audio Spectrum / Status */}
                <div className="relative z-10 flex items-center justify-between px-2 pb-1 text-[9px] font-mono text-stone-500 border-t border-white/10 pt-1.5">
                  <div className="flex items-center gap-0.5">
                    {[3, 6, 9, 5, 8, 4, 7, 3, 8, 5, 2].map((height, i) => (
                      <span 
                        key={i} 
                        className="w-1 bg-cyan-400/80 rounded-full transition-all duration-300"
                        style={{ height: `${height * 1.5}px` }} 
                      />
                    ))}
                  </div>
                  <span className="text-stone-400">TAP TO CYCLE PROMPT</span>
                  <button 
                    onClick={() => setActivePromptIndex((prev) => (prev + 1) % prompts.length)}
                    className="text-cyan-400 hover:text-cyan-200 cursor-pointer text-[10px] font-bold"
                  >
                    NEXT →
                  </button>
                </div>
              </div>
            </div>

            {/* Robot Neck & Torso */}
            <div className="w-16 h-5 bg-gradient-to-b from-stone-800 to-stone-900 border-x border-white/20 -mt-1 z-0" />
            <div className="w-44 sm:w-52 h-20 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-950 border border-white/15 p-2 shadow-xl flex items-center justify-around relative">
              <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono text-stone-400">CORE PROCESSOR</span>
                <span className="text-xs font-mono font-semibold text-white">GEN-4 ARGON // 768-DIM</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Service Modules & Features Checklist */}
        <div className="lg:col-span-3 flex flex-col space-y-4 z-10">
          <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between border-b border-white/10 pb-2">
            <span>CORE CAPABILITIES</span>
            <span>[ 04 ]</span>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'dev', label: 'DEVELOPMENT', desc: 'Auto Smart Contract Generator (Solidity/Rust)', active: activePromptIndex === 0 },
              { id: 'audit', label: 'CODE AUDITOR', desc: 'Vulnerability Detection & Gas Optimization', active: activePromptIndex === 1 },
              { id: 'market', label: 'MARKET ANALYSIS', desc: 'On-chain Volume & Predictive AI Indicators', active: activePromptIndex === 2 },
              { id: 'explain', label: 'CODE EXPLAINER', desc: 'Decompile Bytecode into Plain Human English', active: activePromptIndex === 3 },
            ].map((mod, idx) => (
              <button
                key={mod.id}
                onClick={() => {
                  setActivePromptIndex(idx);
                  onSelectFeatureTab(mod.id);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer group ${
                  mod.active
                    ? 'bg-white/10 border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-semibold tracking-wider ${mod.active ? 'text-cyan-300' : 'text-stone-300'}`}>
                    [ {mod.label} ]
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${mod.active ? 'text-cyan-400 translate-x-1' : 'text-stone-500'}`} />
                </div>
                <p className="text-[11px] text-stone-400 mt-1 line-clamp-1 font-sans">
                  {mod.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-stone-900/60 border border-white/10 text-stone-400 text-[11px] font-mono flex items-center justify-between">
            <span>AND MUCH MORE...</span>
            <span className="text-cyan-400 font-bold">100+ WEB3 TOOLS</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Bar matching reference video */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full flex items-center justify-between pt-6 border-t border-white/10 text-[11px] font-mono text-stone-500 mt-6">
        <div className="flex items-center gap-2">
          <span>GPT-4 & ARBITRUM</span>
          <span>·</span>
          <span>EVM COMPATIBLE</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-400 animate-bounce">
          <span>SCROLL</span>
          <span>↓</span>
        </div>
      </div>
    </section>
  );
};
