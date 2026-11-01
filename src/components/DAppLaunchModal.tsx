/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Zap, 
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface DAppLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

const TEMPLATES = [
  {
    id: 'erc20',
    name: 'LiquidToken (ERC-20)',
    type: 'Tokenomics',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidGlassToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    mapping(address => bool) public isAuditedEntity;

    event EntityAudited(address indexed target, uint256 timestamp);

    constructor() ERC20("LiquidGlass AI", "LGAI") Ownable(msg.sender) {
        _mint(msg.sender, 25_000_000 * 10**18);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max cap exceeded");
        _mint(to, amount);
    }
}`
  },
  {
    id: 'staking',
    name: 'Chromatic Yield Pool',
    type: 'DeFi Staking',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ChromaticYieldVault is ReentrancyGuard {
    IERC20 public immutable stakingToken;
    uint256 public rewardRatePerBlock = 100;
    
    mapping(address => uint256) public userStakes;
    mapping(address => uint256) public lastCheckpoint;

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        stakingToken.transferFrom(msg.sender, address(this), amount);
        userStakes[msg.sender] += amount;
        lastCheckpoint[msg.sender] = block.number;
    }
}`
  },
  {
    id: 'oracle',
    name: 'VisionOS AI Oracle Bridge',
    type: 'AI Infra',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GlassOracleBridge {
    address public immutable consensusNode;
    struct InferenceResult {
        bytes32 promptHash;
        uint256 confidenceScore; // 0-10000 (99.8%)
        bytes signature;
    }

    mapping(bytes32 => InferenceResult) public verifiedInferences;

    event InferenceDispatched(bytes32 indexed queryId, uint256 score);

    constructor(address _node) {
        consensusNode = _node;
    }

    function recordInference(bytes32 qId, uint256 score, bytes calldata sig) external {
        require(msg.sender == consensusNode, "Unauthorized node");
        verifiedInferences[qId] = InferenceResult(qId, score, sig);
        emit InferenceDispatched(qId, score);
    }
}`
  }
];

export const DAppLaunchModal: React.FC<DAppLaunchModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'audit' | 'deploy'>('editor');
  const [deploymentNetwork, setDeploymentNetwork] = useState('Ethereum Sepolia');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployHash, setDeployHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTemplate.code);
    setCopied(true);
    onShowToast('Contract code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedTemplate.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate.name.replace(/[^a-zA-Z0-9]/g, '_')}.sol`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast('Downloaded Solidity file!');
  };

  const handleGenerateCode = () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onShowToast(`Generated custom module for: "${promptInput.slice(0, 25)}..."`);
      setSelectedTemplate(prev => ({
        ...prev,
        code: `// Generated via ChainGPT AI Engine\n// Prompt: ${promptInput}\n\n` + prev.code
      }));
      setPromptInput('');
    }, 1200);
  };

  const handleSimulateDeploy = () => {
    setIsDeploying(true);
    setDeployHash(null);
    setTimeout(() => {
      setIsDeploying(false);
      const hash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setDeployHash(hash);
      onShowToast(`Contract successfully simulated on ${deploymentNetwork}!`);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col rounded-3xl border border-white/20 bg-[#0d111c]/90 text-white shadow-2xl backdrop-blur-2xl chromatic-rim"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-sm sm:text-base">CHAINGPT DAPP CONSOLE</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v3.8 Web3 AI Engine
                </span>
              </div>
              <p className="text-xs text-white/40">Liquid Glass Architecture • Autonomous Solidity Synthesizer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onShowToast('Connected to simulated Web3 wallet: 0x71C...39F');
              }}
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-cyan-300 font-mono transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              0x71C...39F
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-black/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'editor'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Contract Studio
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'audit'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              AI Security Audit
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'deploy'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Deployment Sandbox
            </button>
          </div>

          <div className="text-[11px] text-white/40 font-mono hidden md:block">
            LLM: ChainGPT-v4-Turbo (Solidity Specialist)
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left sidebar templates & AI prompt */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Smart Contract Library
                  </div>
                  <div className="space-y-2">
                    {TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                          selectedTemplate.id === tmpl.id
                            ? 'border-cyan-400/50 bg-cyan-500/10 text-white shadow-sm'
                            : 'border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="font-semibold text-white">{tmpl.name}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{tmpl.type}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI prompt box */}
                <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent space-y-3">
                  <div className="text-xs font-semibold text-white flex items-center justify-between">
                    <span>Ask ChainGPT Assistant</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Real-time</span>
                  </div>
                  <textarea
                    rows={3}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="e.g., Add an automated burn on transfer (1.5%) and whitelist governance addresses..."
                    className="w-full text-xs p-3 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400/50 focus:outline-none text-white placeholder-white/30 resize-none font-mono"
                  />
                  <button
                    onClick={handleGenerateCode}
                    disabled={isGenerating || !promptInput.trim()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Synthesizing Logic...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        Generate & Insert Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right code preview */}
              <div className="lg:col-span-8 flex flex-col rounded-2xl border border-white/10 bg-black/60 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                    <span className="text-xs font-mono text-white/50 ml-2">{selectedTemplate.name}.sol</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all font-mono"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all font-mono"
                    >
                      <Download className="w-3 h-3" />
                      Save .sol
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 overflow-x-auto font-mono text-xs text-white/80 leading-relaxed max-h-[380px] select-text">
                  <pre className="text-cyan-200">
                    <code>{selectedTemplate.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                  <div className="text-xs text-emerald-400 font-mono">SECURITY SCORE</div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">98.5 / 100</div>
                  <div className="text-[11px] text-white/50 mt-1">Audit status: Enterprise Grade Ready</div>
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="text-xs text-cyan-400 font-mono">GAS OPTIMIZATION</div>
                  <div className="text-3xl font-extrabold text-white mt-1">~38,420 Gwei</div>
                  <div className="text-[11px] text-white/50 mt-1">Top 5% efficient contract bytecode</div>
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="text-xs text-yellow-400 font-mono">VULNERABILITY SCAN</div>
                  <div className="text-3xl font-extrabold text-white mt-1">0 Critical</div>
                  <div className="text-[11px] text-white/50 mt-1">1 Low notice: reentrancy guard advised</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-white/60">Automated Audit Checklist</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Reentrancy Attack Resistance: PASS (Checks-Effects-Interactions pattern verified)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Arithmetic Overflow / Underflow: PASS (Built-in Solidity 0.8+ checked math)</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-300">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span>Centralized Owner Control: WARNING (Recommend multi-sig or timelock governance)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ERC-20 / ERC-721 Standard Compliance: 100% compliant with OpenZeppelin v5</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                <div className="text-sm font-semibold text-white">Select Simulated Blockchain Testnet</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Ethereum Sepolia', 'Arbitrum One', 'Base Mainnet', 'BNB Smart Chain'].map((net) => (
                    <button
                      key={net}
                      onClick={() => setDeploymentNetwork(net)}
                      className={`p-3 rounded-xl border text-xs text-left transition-all ${
                        deploymentNetwork === net
                          ? 'border-cyan-400 bg-cyan-500/15 text-white font-medium shadow-md shadow-cyan-500/20'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold">{net}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">ChainID: {net.includes('Sepolia') ? 11155111 : 8453}</div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-white/60">
                    Simulate dry-run execution without spending live gas.
                  </div>
                  <button
                    onClick={handleSimulateDeploy}
                    disabled={isDeploying}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    {isDeploying ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Broadcasting Transaction...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Broadcast to {deploymentNetwork}
                      </>
                    )}
                  </button>
                </div>

                {deployHash && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
                    <div>
                      <div className="font-bold">Deployed Contract Address:</div>
                      <div className="text-[11px] text-emerald-400 break-all">{deployHash}</div>
                    </div>
                    <span className="text-[10px] uppercase px-2 py-0.5 bg-emerald-500/20 rounded text-emerald-300">
                      Confirmed Block #184920
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-3">
            <span>Powered by ChainGPT AI SDK</span>
            <span>•</span>
            <span className="text-cyan-400 font-mono">Liquid Glass UX Engine</span>
          </div>
          <button
            onClick={() => onShowToast('Documentation opened in new simulated tab.')}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Read Docs</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
