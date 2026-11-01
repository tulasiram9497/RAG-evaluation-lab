/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Shield, 
  ExternalLink, 
  Sliders, 
  User, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  Copy 
} from 'lucide-react';

interface FooterProps {
  onOpenControls: () => void;
  onOpenProfile: () => void;
  onOpenDApp: () => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenControls,
  onOpenProfile,
  onOpenDApp,
  onShowToast
}) => {
  const contractAddress = '0x984065586923005613Ef5385455320c02E404070';

  const copyContract = () => {
    navigator.clipboard.writeText(contractAddress);
    onShowToast('Token contract address copied!');
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#07090e] text-white overflow-hidden pt-16 pb-12">
      {/* Background glow lines */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top metrics bar */}
        <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl mb-14 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Ecosystem Token</div>
            <div className="text-2xl font-bold mt-1 text-white flex items-center gap-2">
              $CGPT
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                +14.8%
              </span>
            </div>
            <div className="text-xs text-white/40 mt-1">Live Oracle Feed • CoinMarketCap</div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Verified Smart Contract</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-white/80 truncate max-w-[180px]">
                {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
              </span>
              <button 
                onClick={copyContract}
                className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                title="Copy Address"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Audited by CertiK & Hacken</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Total AI Inferences</div>
            <div className="text-2xl font-bold mt-1 text-white">42,891,048</div>
            <div className="text-xs text-white/40 mt-1">99.98% High Availability Uptime</div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Interactive Reference Demos</div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={onOpenControls}
                className="px-3 py-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Ref 2 Controls</span>
              </button>
              <button
                onClick={onOpenProfile}
                className="px-3 py-1.5 rounded-xl border border-purple-400/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Ref 1 Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="font-bold text-white text-base">C</span>
              </div>
              <span className="font-extrabold tracking-wider text-lg">
                CHAINGPT <span className="font-light text-cyan-400">×</span> LIQUID GLASS
              </span>
            </div>
            <p className="text-xs text-white/50 max-w-sm leading-relaxed">
              Synthesizing hyper-tactical Web3 AI engineering with Apple VisionOS liquid glass aesthetics.
              Empowering next-generation decentralized ecosystems with autonomous smart contract synthesis.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenDApp}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>[→ LAUNCH DAPP]</span>
              </button>
            </div>
          </div>

          {/* Col 1 */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">AI Solutions</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><button onClick={() => onShowToast('Module 05: Analytics active')} className="hover:text-cyan-400 transition-colors">Blockchain Analytics</button></li>
              <li><button onClick={() => onShowToast('Module 06: Auditor active')} className="hover:text-cyan-400 transition-colors">Smart Contract Auditor</button></li>
              <li><button onClick={() => onShowToast('Module 07: Charts active')} className="hover:text-cyan-400 transition-colors">Technical Chart AI</button></li>
              <li><button onClick={() => onShowToast('Module 08: Explainer active')} className="hover:text-cyan-400 transition-colors">Solidity Code Explainer</button></li>
              <li><button onClick={() => onShowToast('SDK Documentation loaded')} className="hover:text-cyan-400 transition-colors">AI Web3 SDK</button></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">Liquid Glass UI</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><button onClick={onOpenControls} className="hover:text-cyan-400 transition-colors">Apple OS Glass Controls</button></li>
              <li><button onClick={onOpenProfile} className="hover:text-cyan-400 transition-colors">Kasun Dilanka Profile Card</button></li>
              <li><button onClick={() => onShowToast('Iridescent Chromatic Rims enabled')} className="hover:text-cyan-400 transition-colors">Chromatic Refraction Engine</button></li>
              <li><button onClick={() => onShowToast('Subtle Fluid Shimmer active')} className="hover:text-cyan-400 transition-colors">Silk Fluid Gradients</button></li>
              <li><button onClick={() => onShowToast('Haptic Frost Feedback active')} className="hover:text-cyan-400 transition-colors">Frost Filter Blurring</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">Security & Audits</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-cyan-400" /> CertiK Verified</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-400" /> Hacken Security Score 98</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> OpenZeppelin Contracts</li>
              <li><button onClick={() => onShowToast('Whitepaper downloaded')} className="hover:text-cyan-400 transition-colors">Whitepaper v2.4 (PDF)</button></li>
              <li><button onClick={() => onShowToast('GitHub repository opened')} className="hover:text-cyan-400 transition-colors">GitHub Source</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <div>
            © 2026 ChainGPT Inc. & Liquid Glass Experience. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onShowToast('Privacy Policy viewed')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => onShowToast('Terms of Service viewed')} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => onShowToast('Security disclosures viewed')} className="hover:text-white transition-colors">Bug Bounty</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
