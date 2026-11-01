import React, { useState } from 'react';
import { 
  RotateCw, 
  Lock, 
  Layers, 
  Moon, 
  Bell, 
  BellOff, 
  LayoutGrid, 
  ChevronsUpDown, 
  Check, 
  X, 
  Sliders, 
  Sparkles,
  Info
} from 'lucide-react';

interface LiquidGlassControlsProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (msg: string) => void;
}

export const LiquidGlassControls: React.FC<LiquidGlassControlsProps> = ({
  isOpen,
  onClose,
  onTriggerToast,
}) => {
  const [rotationLocked, setRotationLocked] = useState(true);
  const [screenMirrored, setScreenMirrored] = useState(false);
  const [focusMode, setFocusMode] = useState<'Crypto Trading' | 'Deep Audit' | 'Do Not Disturb' | 'Personal'>('Deep Audit');
  const [focusMenuOpen, setFocusMenuOpen] = useState(false);
  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [gridActive, setGridActive] = useState(true);
  const [glassGlossOpacity, setGlassGlossOpacity] = useState(90);

  if (!isOpen) return null;

  const handleToggleRotation = () => {
    const newState = !rotationLocked;
    setRotationLocked(newState);
    onTriggerToast(newState ? 'Orientation Lock: ON' : 'Orientation Lock: OFF');
  };

  const handleToggleMirror = () => {
    const newState = !screenMirrored;
    setScreenMirrored(newState);
    onTriggerToast(newState ? 'VisionOS Glass Mirroring: CONNECTED' : 'Screen Mirroring: DISCONNECTED');
  };

  const handleToggleNotifications = () => {
    const newState = !notificationsMuted;
    setNotificationsMuted(newState);
    onTriggerToast(newState ? 'Notifications: SILENCED' : 'Notifications: ACTIVE');
  };

  const handleSelectFocus = (mode: any) => {
    setFocusMode(mode);
    setFocusMenuOpen(false);
    onTriggerToast(`Focus Mode updated: ${mode}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Modal Card with Liquid Glass Backdrop */}
      <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 liquid-glass-card chromatic-rim text-white shadow-2xl border border-white/40 overflow-hidden">
        
        {/* Optical refractive lighting reflections */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/20 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/20 text-white font-semibold">
                iOS 18 // VisionOS
              </span>
              <span className="text-sm font-bold tracking-tight">Liquid Glass OS Controls</span>
            </div>
            <p className="text-[11px] text-white/70 mt-0.5 font-sans">
              Recreated faithfully from the uploaded design reference.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
            aria-label="Close Controls"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls Layout Matching Reference Image 2:
            Top: [Rotation Lock (Circle)]  [Screen Mirroring (Circle)]
            Mid: [Focus Pill (Wide Oval with Moon)]
            Btm: [Notifications Bell (Circle)]  [App Grid (Circle)]
        */}
        <div className="flex flex-col items-center gap-5 my-2 relative z-10">
          
          {/* Top Row: Two Glass Circles */}
          <div className="flex items-center justify-center gap-6 w-full">
            
            {/* 1. Rotation Lock Orb */}
            <button
              onClick={handleToggleRotation}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center relative cursor-pointer group transition-all border-2 border-white shadow-lg ${
                rotationLocked
                  ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-[0_0_25px_rgba(234,88,12,0.5)]'
                  : 'bg-gradient-to-br from-amber-600 to-orange-700 opacity-80'
              }`}
              title="Orientation Lock"
            >
              <div className="relative">
                <RotateCw className="w-8 h-8 text-white transition-transform group-hover:rotate-45" />
                <Lock className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[9px] font-mono mt-1 font-semibold text-white">LOCK</span>
            </button>

            {/* 2. Screen Mirroring / Multi-window Orb */}
            <button
              onClick={handleToggleMirror}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center relative cursor-pointer group transition-all border-2 border-white shadow-lg ${
                screenMirrored
                  ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-[0_0_25px_rgba(234,88,12,0.5)]'
                  : 'bg-gradient-to-br from-amber-600 to-orange-700 opacity-80'
              }`}
              title="Screen Mirroring"
            >
              <div className="relative">
                <Layers className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
              </div>
              <span className="text-[9px] font-mono mt-1 font-semibold text-white">MIRROR</span>
            </button>
          </div>

          {/* Middle Row: Elongated "Focus" Pill with White Edges & Orange Accent */}
          <div className="w-full relative">
            <button
              onClick={() => setFocusMenuOpen(!focusMenuOpen)}
              className="w-full py-3.5 px-5 rounded-full border-2 border-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 flex items-center justify-between cursor-pointer hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all group shadow-md"
            >
              {/* Left: Circle with White Rim and Orange Glow */}
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white flex items-center justify-center shadow-inner">
                <Moon className="w-5 h-5 text-white fill-current drop-shadow-[0_0_8px_white]" />
              </div>

              {/* Center: "Focus" Label */}
              <div className="flex flex-col items-start px-2">
                <span className="font-bold text-base tracking-wide text-white drop-shadow-sm font-sans">
                  {focusMode}
                </span>
                <span className="text-[10px] text-white/90 font-mono tracking-wider -mt-0.5">
                  FOCUS MODE ACTIVE
                </span>
              </div>

              {/* Right: Double Chevrons */}
              <div className="p-1 rounded-full bg-white/20 text-white group-hover:bg-white/40 transition-colors border border-white/50">
                <ChevronsUpDown className="w-4 h-4" />
              </div>
            </button>

            {/* Dropdown Menu for Focus Selection */}
            {focusMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-white border border-stone-200 shadow-2xl z-20 space-y-1 text-stone-900">
                {(['Deep Audit', 'Crypto Trading', 'Do Not Disturb', 'Personal'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleSelectFocus(mode)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      focusMode === mode ? 'bg-orange-100 text-orange-900' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span>{mode}</span>
                    {focusMode === mode && <Check className="w-4 h-4 text-orange-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Row: Notifications Bell & App Grid Circles with White Edges & Orange Interior */}
          <div className="flex items-center justify-center gap-6 w-full">
            
            {/* 4. Notifications Bell Orb */}
            <button
              onClick={handleToggleNotifications}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center relative cursor-pointer group transition-all border-2 border-white shadow-lg ${
                notificationsMuted
                  ? 'bg-gradient-to-br from-stone-600 to-stone-700 opacity-80'
                  : 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-[0_0_25px_rgba(234,88,12,0.5)]'
              }`}
              title="Notifications"
            >
              {notificationsMuted ? (
                <BellOff className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
              ) : (
                <Bell className="w-8 h-8 text-white fill-current transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_white]" />
              )}
              <span className="text-[9px] font-mono mt-1 font-semibold text-white">
                {notificationsMuted ? 'MUTED' : 'ALERTS'}
              </span>
            </button>

            {/* 5. App Grid Orb */}
            <button
              onClick={() => {
                setGridActive(!gridActive);
                onTriggerToast(`App Grid: ${!gridActive ? 'EXPANDED' : 'COLLAPSED'}`);
              }}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center relative cursor-pointer group transition-all border-2 border-white shadow-lg ${
                gridActive
                  ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-[0_0_25px_rgba(234,88,12,0.5)]'
                  : 'bg-gradient-to-br from-amber-600 to-orange-700 opacity-80'
              }`}
              title="App Grid / Ecosystem"
            >
              <LayoutGrid className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
              <span className="text-[9px] font-mono mt-1 font-semibold text-white">APPS</span>
            </button>
          </div>
        </div>

        {/* Live Glass Opacity Tuning Slider */}
        <div className="pt-4 border-t border-white/20 mt-4 relative z-10 flex items-center justify-between text-xs text-white/80">
          <span>Glass Refraction: {glassGlossOpacity}%</span>
          <input
            type="range"
            min={40}
            max={100}
            value={glassGlossOpacity}
            onChange={(e) => setGlassGlossOpacity(Number(e.target.value))}
            className="w-32 accent-white cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
