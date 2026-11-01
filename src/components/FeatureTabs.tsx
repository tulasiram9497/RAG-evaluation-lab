import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Terminal, 
  Code2, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check,
  Search,
  Zap,
  Cpu
} from 'lucide-react';

interface FeatureTabsProps {
  onOpenDApp: (mode?: string) => void;
}

export const FeatureTabs: React.FC<FeatureTabsProps> = ({ onOpenDApp }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'auditor' | 'chart' | 'explainer'>('auditor');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(true);

  // Sample contract code for Code Auditor tab
  const sampleContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChainGlassToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    constructor(address initialOwner) 
        ERC20("ChainGlass", "CGLS") 
        Ownable(initialOwner) 
    {
        _mint(initialOwner, 25_000_000 * 10**18);
    }

    // Protected minting logic with hard supply ceiling
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}`;

  const tabs = [
    { id: 'analytics', num: '05', label: 'BLOCKCHAIN & MARKET ANALYTICS' },
    { id: 'auditor', num: '06', label: 'CODE AUDITOR' },
    { id: 'chart', num: '07', label: 'CHART & TECHNICAL ANALYSIS' },
    { id: 'explainer', num: '08', label: 'CODE EXPLAINER' },
  ];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTriggerAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 1200);
  };

  return (
    <section id="features" className="w-full py-16 px-4 sm:px-6 max-w-[1400px] mx-auto border-b border-white/10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>INTERACTIVE AI MODULE SUITE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
            Modular Intelligence on Demand
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            Select an operational module to test live Web3 AI execution. Switch between code auditing, technical analysis, and automated bytecode interpretation.
          </p>
        </div>

        <button
          onClick={() => onOpenDApp(activeTab)}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-medium transition-colors flex items-center gap-2 w-fit cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Launch Full Interactive dApp</span>
        </button>
      </div>

      {/* Numbered Tactical Tab Bar (Exact match from Reference 3 Video) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                isActive
                  ? 'bg-stone-900 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.2)]'
                  : 'bg-stone-950/60 border-white/10 hover:border-white/25 hover:bg-stone-900/40 text-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-mono text-xs font-bold ${isActive ? 'text-cyan-400' : 'text-stone-500'}`}>
                  {tab.num}
                </span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
              </div>
              <div className={`font-mono text-xs sm:text-[13px] font-semibold tracking-wider ${isActive ? 'text-white' : 'text-stone-300'}`}>
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content Box */}
      <div className="rounded-2xl border border-white/15 bg-stone-950/90 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle grid backdrop inside panel */}
        <div className="absolute inset-0 tech-grid-dots opacity-40 pointer-events-none" />

        {/* 06. CODE AUDITOR TAB */}
        {activeTab === 'auditor' && (
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono">Automated Solidity Security Auditor</h3>
                  <p className="text-[11px] text-stone-400">Analyzes AST, reentrancy vulnerabilities, overflow, and gas consumption.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerAudit}
                  disabled={isAuditing}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>{isAuditing ? 'Scanning Bytecode...' : 'Re-Run Security Audit'}</span>
                </button>
                <button
                  onClick={() => handleCopyCode(sampleContract)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-stone-300 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            {/* Code & Audit Output Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: Solidity Code Editor */}
              <div className="lg:col-span-7 bg-stone-900/80 border border-white/10 rounded-xl p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 text-stone-400 text-[11px]">
                  <span>CONTRACT: ChainGlassToken.sol</span>
                  <span>Solidity v0.8.20</span>
                </div>
                <pre className="text-stone-300 overflow-x-auto leading-relaxed max-h-72">
                  <code>{sampleContract}</code>
                </pre>
              </div>

              {/* Right: Security Audit Results */}
              <div className="lg:col-span-5 bg-stone-900/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                    <span className="text-xs font-mono font-semibold text-white">AUDIT DIAGNOSTICS</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      SCORE: 98/100 (A+)
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 rounded bg-white/5 border border-white/10 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-stone-200">Reentrancy Protection: Passed</div>
                        <div className="text-[11px] text-stone-400">No external calls made prior to state variable mutations.</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-white/5 border border-white/10 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-stone-200">Integer Overflow & Underflow: Safe</div>
                        <div className="text-[11px] text-stone-400">Solidity ^0.8.x built-in arithmetic check enabled.</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-white/5 border border-white/10 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-stone-200">Gas Optimization Opportunity</div>
                        <div className="text-[11px] text-stone-400">Consider marking MAX_SUPPLY as constant/immutable to save 2,100 deployment gas.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400 mt-4">
                  <span>AUDITED BY: AETHER-SECURITY-ENGINE</span>
                  <span>EVM COMPATIBLE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 05. BLOCKCHAIN & MARKET ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono">On-Chain Real-Time Market Intelligence</h3>
                  <p className="text-[11px] text-stone-400">Live whale transaction monitoring, DEX liquidity flows, and cross-chain volume tracking.</p>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-400">LIVE FEED // SYNCED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-stone-900/70 border border-white/10">
                <span className="text-stone-400 text-[10px]">ETH GAS TRACKER</span>
                <div className="text-xl font-bold text-white mt-1">12 Gwei</div>
                <span className="text-[10px] text-emerald-400">Low Network Congestion</span>
              </div>
              <div className="p-4 rounded-xl bg-stone-900/70 border border-white/10">
                <span className="text-stone-400 text-[10px]">24H WHALE VOLUME</span>
                <div className="text-xl font-bold text-white mt-1">$412.5M</div>
                <span className="text-[10px] text-cyan-400">+18.4% from Yesterday</span>
              </div>
              <div className="p-4 rounded-xl bg-stone-900/70 border border-white/10">
                <span className="text-stone-400 text-[10px]">AI SENTIMENT INDEX</span>
                <div className="text-xl font-bold text-white mt-1">78 / 100</div>
                <span className="text-[10px] text-emerald-400">Greed / Bullish Flow</span>
              </div>
              <div className="p-4 rounded-xl bg-stone-900/70 border border-white/10">
                <span className="text-stone-400 text-[10px]">TOTAL VALUE AUDITED</span>
                <div className="text-xl font-bold text-white mt-1">$1.42B</div>
                <span className="text-[10px] text-purple-400">Over 32 Blockchains</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/50 border border-white/10 text-xs text-stone-300 font-mono space-y-2">
              <div className="text-stone-400 text-[11px] pb-1 border-b border-white/10 flex justify-between">
                <span>RECENT WHALE ALERTS</span>
                <span>AUTO-REFRESH (3s)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-cyan-400">0x71C...49A transferred 1,200 ETH ($3.96M) to Binance</span>
                <span className="text-stone-500">24s ago</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-emerald-400">0x3b8...912 staked 450,000 $CGPT into Governance Pool</span>
                <span className="text-stone-500">1m ago</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-purple-400">Uniswap V3 Liquidity Added: 250,000 USDC / 75.8 ETH</span>
                <span className="text-stone-500">2m ago</span>
              </div>
            </div>
          </div>
        )}

        {/* 07. CHART & TECHNICAL ANALYSIS */}
        {activeTab === 'chart' && (
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono">Predictive Chart & Technical Analysis</h3>
                  <p className="text-[11px] text-stone-400">Deep neural models analyzing order books, liquidity pockets, and multi-timeframe breakouts.</p>
                </div>
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold">ETH/USDT · 4H CHART</span>
            </div>

            <div className="h-64 bg-stone-900/80 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="text-white font-bold text-sm">$3,428.50 USD (+4.2%)</span>
                <span>RSI (14): 64.2 · MACD: Bullish Crossover</span>
              </div>

              {/* Simulated trading chart SVG */}
              <div className="flex-1 my-3 flex items-end">
                <svg className="w-full h-36" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,90 Q50,70 100,85 T200,60 T300,75 T400,30 T500,20 L500,120 L0,120 Z"
                    fill="url(#chartGrad)"
                  />
                  <path
                    d="M0,90 Q50,70 100,85 T200,60 T300,75 T400,30 T500,20"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-white/10 pt-2">
                <span className="text-emerald-400 font-semibold">AI SIGNAL: STRONG BUY (Confidence: 89%)</span>
                <span>Target: $3,650 · Stop: $3,280</span>
              </div>
            </div>
          </div>
        )}

        {/* 08. CODE EXPLAINER */}
        {activeTab === 'explainer' && (
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono">Bytecode & Assembly Decompiler</h3>
                  <p className="text-[11px] text-stone-400">Translates complex EVM opcodes and obfuscated proxy calls into concise explanations.</p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400">EVM DECOMPILER</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-stone-900 border border-white/10">
                <span className="text-stone-400 text-[11px] block mb-2">RAW EVM BYTECODE (INPUT):</span>
                <p className="text-stone-300 break-all leading-relaxed bg-black/40 p-3 rounded border border-white/5">
                  0x608060405234801561001057600080fd5b50600436106100415760003560e01c8063a9059cbb1461004657...
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-white/10">
                <span className="text-cyan-400 text-[11px] block mb-2 font-semibold">PLAIN ENGLISH DECODING:</span>
                <div className="space-y-2 text-stone-300 font-sans">
                  <p>1. <strong>Function Signature Identified:</strong> <code>transfer(address,uint256)</code> (Selector: <code>0xa9059cbb</code>).</p>
                  <p>2. <strong>Payable Check:</strong> Reverts if native ETH is forwarded during invocation (<code>3480156100...</code>).</p>
                  <p>3. <strong>Execution Summary:</strong> Standard ERC-20 token transfer updating balance mappings for recipient.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
