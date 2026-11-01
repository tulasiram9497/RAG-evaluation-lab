import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface TestimonialsSectionProps {
  onOpenDApp: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onOpenDApp }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 'jeff',
      quote: "Smart contract auditing has always been a bottleneck for our startups, ChainGPT solves this problem in seconds.",
      author: "Jeff Nowak",
      role: "FOUNDER OF MAVERICK CAPITAL",
      avatar: "🧑‍💼",
      stat: "99.8% AUDIT ACCURACY",
      sub: "A vital asset for Web3 investors, simplifying research and preventing multimillion dollar exploit exploits before mainnet launch."
    },
    {
      id: 'sarunas',
      quote: "ChainGPT AI is a vital asset for Web3 investors, simplifying the research process effortlessly.",
      author: "Sarunas Legeckas",
      role: "FOUNDER OF FOUNDERHEADS",
      avatar: "👨‍💻",
      stat: "10X FASTER DEPLOYMENTS",
      sub: "It provides comprehensive on-chain research, real-time monitoring, and intuitive navigation. Highly recommended for crypto founders."
    },
    {
      id: 'elena',
      quote: "ChainGPT has significantly helped me and our engineering team speed up working security workflows and bytecode decompilation.",
      author: "Elena Vance",
      role: "CHIEF SECURITY OFFICER AT CYBERLABS",
      avatar: "👩‍🔬",
      stat: "ZERO EXPLOIT RECORD",
      sub: "The liquid glass dashboard provides instant clarity into smart contract vulnerabilities and gas consumption profiles."
    }
  ];

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="w-full py-16 px-4 sm:px-6 max-w-[1400px] mx-auto border-b border-white/10 tech-grid">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-stone-500 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">[ TESTIMONIALS ]</span>
          <span>// ENTERPRISE VALIDATION</span>
        </div>
        <span>0{currentIndex + 1} / 0{testimonials.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Testimonial Quote & Persona matching reference video */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl">
              {current.avatar}
            </div>
            <div>
              <div className="text-sm font-bold text-white font-sans">{current.author}</div>
              <div className="text-[10px] font-mono text-cyan-400 tracking-wider">{current.role}</div>
            </div>
          </div>

          <div className="relative">
            <Quote className="w-12 h-12 text-white/10 absolute -top-4 -left-4 pointer-events-none" />
            <blockquote className="text-2xl sm:text-3xl xl:text-4xl font-medium text-white tracking-tight leading-snug font-sans">
              "{current.quote}"
            </blockquote>
          </div>

          <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-2xl leading-relaxed">
            {current.sub}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={onOpenDApp}
              className="text-xs font-mono text-cyan-300 hover:text-cyan-100 flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
            >
              <span>Try for yourself! Click here!</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tactical Arrow Controls matching video */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-lg border border-white/15 hover:border-cyan-400 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-lg border border-white/15 hover:border-cyan-400 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Mini Robot Avatar with Illuminated Quote Screen */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="w-64 sm:w-72 rounded-3xl bg-gradient-to-b from-stone-800 to-stone-950 p-2 border border-white/20 shadow-2xl relative">
            <div className="w-full h-48 rounded-[20px] bg-stone-950 p-3 flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 25px rgba(56,189,248,0.2)'
              }}
            >
              {/* Iridescent Rainbow Bezel border */}
              <div className="absolute inset-0 rounded-[20px] p-[2px] pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #fb923c, #facc15, #4ade80, #38bdf8, #818cf8, #c084fc)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  opacity: 0.9,
                }}
              />

              {/* Huge quote mark displayed on the robot's illuminated face */}
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-white/30 mb-2">
                <Quote className="w-10 h-10 text-stone-950 fill-current" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold mt-1">VERIFIED TESTIMONIAL</span>
              <span className="text-[9px] font-mono text-stone-500">{current.stat}</span>
            </div>
            
            <div className="p-3 text-center">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">TRUSTED BY 250+ STARTUPS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
