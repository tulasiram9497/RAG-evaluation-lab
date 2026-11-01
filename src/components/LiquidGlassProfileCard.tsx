import React, { useState } from 'react';
import { 
  Send, 
  Linkedin, 
  Heart, 
  MessageSquare, 
  FolderGit2, 
  X, 
  Sparkles, 
  Check, 
  ExternalLink,
  Share2
} from 'lucide-react';

interface LiquidGlassProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (msg: string) => void;
}

export const LiquidGlassProfileCard: React.FC<LiquidGlassProfileCardProps> = ({
  isOpen,
  onClose,
  onTriggerToast,
}) => {
  const [likes, setLikes] = useState(604);
  const [hasLiked, setHasLiked] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      onTriggerToast('Liked Kasun Dilanka portfolio! (+1)');
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setContactModalOpen(false);
      setContactName('');
      setContactMessage('');
      onTriggerToast('Message delivered to Kasun Dilanka!');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Outer wrapper with the vivid blue/cyan liquid gradient backdrop matching Reference Image 1 */}
      <div className="relative w-full max-w-sm rounded-[36px] p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/30"
        style={{
          background: 'radial-gradient(circle at 50% 20%, #38bdf8 0%, #2563eb 45%, #1d4ed8 75%, #0f172a 100%)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.4)'
        }}
      >
        {/* Abstract Liquid Silk Waves overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)'
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors cursor-pointer"
          aria-label="Close Profile Card"
        >
          <X className="w-4 h-4" />
        </button>

        {/* The Translucent Frosted Glass Card (Exact match of Reference Image 1) */}
        <div className="relative z-10 w-full rounded-[28px] p-6 liquid-glass-card border border-white/50 text-white flex flex-col items-center shadow-2xl">
          
          {/* Avatar with Circular Glass Halo */}
          <div className="relative mb-3 group">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-white/70 via-cyan-200/50 to-white/90 shadow-xl backdrop-blur-xl">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden border border-white/60">
                {/* 3D Stylized Avatar Representation */}
                <div className="text-3xl select-none">
                  🧑‍🎨
                </div>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-md" />
          </div>

          {/* Name & Title */}
          <h3 className="text-xl font-bold tracking-tight text-white font-sans drop-shadow-sm">
            Kasun Dilanka
          </h3>
          <p className="text-xs text-white/85 text-center italic mt-1 font-sans max-w-[240px] leading-relaxed">
            "Designer who creates delightful experiences"
          </p>

          {/* 3 Recessed Glass Stat Boxes in a Row */}
          <div className="grid grid-cols-3 gap-2.5 w-full my-5">
            <div className="p-3 rounded-2xl liquid-glass-recessed flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold text-white tracking-tight font-sans">144</span>
              <span className="text-[10px] text-white/75 font-medium mt-0.5">Projects</span>
            </div>

            <button
              onClick={handleLike}
              className={`p-3 rounded-2xl liquid-glass-recessed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                hasLiked ? 'bg-pink-500/30 border-pink-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-white tracking-tight font-sans">{likes}</span>
                <Heart className={`w-3 h-3 ${hasLiked ? 'text-pink-400 fill-current' : 'text-white/80'}`} />
              </div>
              <span className="text-[10px] text-white/75 font-medium mt-0.5">Likes</span>
            </button>

            <div className="p-3 rounded-2xl liquid-glass-recessed flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold text-white tracking-tight font-sans">44</span>
              <span className="text-[10px] text-white/75 font-medium mt-0.5">Comments</span>
            </div>
          </div>

          {/* Social Glass Buttons (LinkedIn & Behance) with White Edges & Orange Interior */}
          <div className="grid grid-cols-2 gap-2.5 w-full mb-5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl liquid-glass-recessed flex items-center justify-center gap-2 hover:bg-white/25 transition-all text-xs font-semibold text-white cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg border border-white bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                in
              </div>
              <span>LinkedIn</span>
            </a>

            <a
              href="https://behance.net"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl liquid-glass-recessed flex items-center justify-center gap-2 hover:bg-white/25 transition-all text-xs font-semibold text-white cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg border border-white bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                Bē
              </div>
              <span>Behance</span>
            </a>
          </div>

          {/* "Contact me" Solid Bright White Pill Button with Paper Plane icon */}
          <button
            onClick={() => setContactModalOpen(true)}
            className="w-full py-3 px-6 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
          >
            <span className="claude-icon-badge-sm w-5 h-5">
              <Send className="w-3 h-3 text-white fill-current" />
            </span>
            <span>Contact me</span>
          </button>
        </div>

        {/* Contact Form Sub-Drawer */}
        {contactModalOpen && (
          <div className="absolute inset-0 z-30 bg-stone-950/90 backdrop-blur-2xl p-6 flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-sm font-bold text-white">Message Kasun Dilanka</span>
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="text-stone-400 hover:text-white text-xs font-mono"
                >
                  ✕ CANCEL
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1">Your Name / Organization</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Elena Vance, Synthetix Labs"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-hidden focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Project Brief / Collaboration</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={3}
                    placeholder="We love your liquid glass design and want to collaborate..."
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-hidden focus:border-cyan-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSent}
                  className="w-full py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-semibold transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {isSent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4 fill-current" />}
                  <span>{isSent ? 'Dispatched' : 'Send Direct Message'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
