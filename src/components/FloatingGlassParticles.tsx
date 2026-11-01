import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface GlassParticle {
  id: string;
  type: 'circle' | 'capsule' | 'square' | 'diamond' | 'ring';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  size: number; // px
  width?: number; // for capsule
  height?: number; // for capsule
  depth: number; // 0.15 (far) to 1.0 (near foreground)
  rotation: number; // deg
  blur: number; // px backdrop blur
  opacity: number;
  hue: 'cyan' | 'blue' | 'violet' | 'amber' | 'neutral';
  floatDuration: number;
  floatDelay: number;
  floatDeltaY: number;
  floatDeltaX: number;
}

// 22 precisely placed liquid glass particles for balanced depth and aesthetic distribution
const PARTICLES: GlassParticle[] = [
  // Top-left ambient cluster
  {
    id: 'p1',
    type: 'circle',
    x: 8,
    y: 12,
    size: 64,
    depth: 0.8,
    rotation: 15,
    blur: 16,
    opacity: 0.75,
    hue: 'cyan',
    floatDuration: 8.5,
    floatDelay: 0,
    floatDeltaY: 18,
    floatDeltaX: 8,
  },
  {
    id: 'p2',
    type: 'capsule',
    x: 16,
    y: 22,
    width: 90,
    height: 38,
    size: 40,
    depth: 0.5,
    rotation: -12,
    blur: 14,
    opacity: 0.6,
    hue: 'blue',
    floatDuration: 10,
    floatDelay: 1.2,
    floatDeltaY: -22,
    floatDeltaX: -10,
  },
  {
    id: 'p3',
    type: 'diamond',
    x: 4,
    y: 35,
    size: 32,
    depth: 0.35,
    rotation: 45,
    blur: 10,
    opacity: 0.5,
    hue: 'neutral',
    floatDuration: 7,
    floatDelay: 0.5,
    floatDeltaY: 14,
    floatDeltaX: 6,
  },

  // Top-right cluster
  {
    id: 'p4',
    type: 'circle',
    x: 88,
    y: 10,
    size: 80,
    depth: 0.9,
    rotation: 25,
    blur: 18,
    opacity: 0.8,
    hue: 'cyan',
    floatDuration: 9,
    floatDelay: 0.8,
    floatDeltaY: -24,
    floatDeltaX: 12,
  },
  {
    id: 'p5',
    type: 'ring',
    x: 94,
    y: 24,
    size: 54,
    depth: 0.6,
    rotation: -30,
    blur: 12,
    opacity: 0.65,
    hue: 'violet',
    floatDuration: 11,
    floatDelay: 2,
    floatDeltaY: 16,
    floatDeltaX: -8,
  },
  {
    id: 'p6',
    type: 'capsule',
    x: 78,
    y: 18,
    width: 105,
    height: 44,
    size: 44,
    depth: 0.45,
    rotation: 18,
    blur: 14,
    opacity: 0.55,
    hue: 'blue',
    floatDuration: 8,
    floatDelay: 1.5,
    floatDeltaY: 18,
    floatDeltaX: 10,
  },

  // Mid-left edge
  {
    id: 'p7',
    type: 'square',
    x: 6,
    y: 52,
    size: 52,
    depth: 0.65,
    rotation: 8,
    blur: 14,
    opacity: 0.7,
    hue: 'cyan',
    floatDuration: 9.5,
    floatDelay: 0.4,
    floatDeltaY: -20,
    floatDeltaX: -8,
  },
  {
    id: 'p8',
    type: 'circle',
    x: 12,
    y: 68,
    size: 42,
    depth: 0.4,
    rotation: 0,
    blur: 12,
    opacity: 0.5,
    hue: 'violet',
    floatDuration: 7.5,
    floatDelay: 1.8,
    floatDeltaY: 15,
    floatDeltaX: 7,
  },

  // Mid-right edge
  {
    id: 'p9',
    type: 'diamond',
    x: 91,
    y: 48,
    size: 46,
    depth: 0.7,
    rotation: 45,
    blur: 16,
    opacity: 0.7,
    hue: 'blue',
    floatDuration: 8.8,
    floatDelay: 1.1,
    floatDeltaY: 20,
    floatDeltaX: -12,
  },
  {
    id: 'p10',
    type: 'capsule',
    x: 84,
    y: 64,
    width: 96,
    height: 40,
    size: 40,
    depth: 0.55,
    rotation: -15,
    blur: 14,
    opacity: 0.6,
    hue: 'cyan',
    floatDuration: 10.5,
    floatDelay: 0.7,
    floatDeltaY: -18,
    floatDeltaX: 9,
  },

  // Deep background subtle ambient orbs (low depth, small size, gentle float)
  {
    id: 'p11',
    type: 'circle',
    x: 28,
    y: 15,
    size: 36,
    depth: 0.25,
    rotation: 0,
    blur: 8,
    opacity: 0.4,
    hue: 'neutral',
    floatDuration: 12,
    floatDelay: 2.2,
    floatDeltaY: 12,
    floatDeltaX: -6,
  },
  {
    id: 'p12',
    type: 'circle',
    x: 65,
    y: 14,
    size: 40,
    depth: 0.3,
    rotation: 0,
    blur: 8,
    opacity: 0.45,
    hue: 'cyan',
    floatDuration: 11.5,
    floatDelay: 1.9,
    floatDeltaY: -14,
    floatDeltaX: 8,
  },
  {
    id: 'p13',
    type: 'ring',
    x: 48,
    y: 8,
    size: 48,
    depth: 0.35,
    rotation: 20,
    blur: 10,
    opacity: 0.4,
    hue: 'violet',
    floatDuration: 13,
    floatDelay: 0.3,
    floatDeltaY: 10,
    floatDeltaX: -5,
  },
  {
    id: 'p14',
    type: 'square',
    x: 35,
    y: 42,
    size: 38,
    depth: 0.2,
    rotation: -18,
    blur: 8,
    opacity: 0.3,
    hue: 'neutral',
    floatDuration: 14,
    floatDelay: 2.5,
    floatDeltaY: -12,
    floatDeltaX: 6,
  },
  {
    id: 'p15',
    type: 'diamond',
    x: 62,
    y: 50,
    size: 34,
    depth: 0.25,
    rotation: 45,
    blur: 8,
    opacity: 0.35,
    hue: 'blue',
    floatDuration: 12.5,
    floatDelay: 1.4,
    floatDeltaY: 14,
    floatDeltaX: -7,
  },

  // Bottom clusters
  {
    id: 'p16',
    type: 'capsule',
    x: 18,
    y: 82,
    width: 110,
    height: 44,
    size: 44,
    depth: 0.75,
    rotation: -8,
    blur: 16,
    opacity: 0.7,
    hue: 'cyan',
    floatDuration: 9,
    floatDelay: 0.6,
    floatDeltaY: -22,
    floatDeltaX: 11,
  },
  {
    id: 'p17',
    type: 'circle',
    x: 9,
    y: 88,
    size: 56,
    depth: 0.6,
    rotation: 12,
    blur: 14,
    opacity: 0.65,
    hue: 'violet',
    floatDuration: 8.2,
    floatDelay: 1.7,
    floatDeltaY: 18,
    floatDeltaX: -8,
  },
  {
    id: 'p18',
    type: 'ring',
    x: 42,
    y: 86,
    size: 50,
    depth: 0.45,
    rotation: -15,
    blur: 12,
    opacity: 0.5,
    hue: 'blue',
    floatDuration: 10,
    floatDelay: 2.1,
    floatDeltaY: -15,
    floatDeltaX: 9,
  },
  {
    id: 'p19',
    type: 'square',
    x: 74,
    y: 84,
    size: 60,
    depth: 0.8,
    rotation: 14,
    blur: 18,
    opacity: 0.75,
    hue: 'cyan',
    floatDuration: 8.7,
    floatDelay: 0.9,
    floatDeltaY: 20,
    floatDeltaX: -10,
  },
  {
    id: 'p20',
    type: 'circle',
    x: 87,
    y: 86,
    size: 72,
    depth: 0.85,
    rotation: -20,
    blur: 18,
    opacity: 0.8,
    hue: 'violet',
    floatDuration: 9.3,
    floatDelay: 1.3,
    floatDeltaY: -24,
    floatDeltaX: 12,
  },
  {
    id: 'p21',
    type: 'diamond',
    x: 95,
    y: 76,
    size: 38,
    depth: 0.5,
    rotation: 45,
    blur: 12,
    opacity: 0.55,
    hue: 'neutral',
    floatDuration: 7.8,
    floatDelay: 0.2,
    floatDeltaY: 16,
    floatDeltaX: -6,
  },
  {
    id: 'p22',
    type: 'capsule',
    x: 56,
    y: 90,
    width: 85,
    height: 36,
    size: 36,
    depth: 0.35,
    rotation: 5,
    blur: 10,
    opacity: 0.45,
    hue: 'cyan',
    floatDuration: 11,
    floatDelay: 1.6,
    floatDeltaY: -14,
    floatDeltaX: 7,
  },
];

// Single Particle Item with Spring Parallax + 3D Tilt + Floating Oscillation
interface ParticleItemProps {
  particle: GlassParticle;
  smoothMouseX: ReturnType<typeof useSpring>;
  smoothMouseY: ReturnType<typeof useSpring>;
}

const ParticleItem: React.FC<ParticleItemProps> = ({
  particle,
  smoothMouseX,
  smoothMouseY,
}) => {
  // Max parallax displacement is scaled by depth (near particles move more)
  const maxParallax = 55 * particle.depth;
  const maxTilt = 22 * particle.depth;

  // React to mouse hover coordinates
  const x = useTransform(smoothMouseX, [-1, 1], [-maxParallax, maxParallax]);
  const y = useTransform(smoothMouseY, [-1, 1], [-maxParallax * 0.75, maxParallax * 0.75]);
  const rotateX = useTransform(smoothMouseY, [-1, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-maxTilt, maxTilt]);

  // Color accents matching Claude Code orange and crisp white aesthetic
  const getGradientAndBorder = () => {
    switch (particle.hue) {
      case 'cyan': // Warm Claude orange
      case 'amber':
        return {
          bg: 'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.95) 0%, rgba(254, 215, 170, 0.45) 45%, rgba(249, 115, 22, 0.16) 80%, rgba(255, 255, 255, 0.2) 100%)',
          border: '1.5px solid #ffffff',
          shadow: `
            0 14px 30px -5px rgba(234, 88, 12, 0.15),
            0 2px 8px rgba(234, 88, 12, 0.08),
            inset 0 1.5px 3px rgba(255, 255, 255, 0.95),
            inset 0 -1.5px 3px rgba(249, 115, 22, 0.2)
          `,
          glintColor: 'rgba(255, 255, 255, 0.98)',
        };
      case 'violet': // Claude terracotta ember
        return {
          bg: 'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.92) 0%, rgba(253, 186, 116, 0.4) 45%, rgba(217, 119, 6, 0.14) 85%, rgba(255, 255, 255, 0.15) 100%)',
          border: '1.5px solid #ffffff',
          shadow: `
            0 14px 30px -5px rgba(217, 119, 6, 0.14),
            0 2px 8px rgba(245, 158, 11, 0.08),
            inset 0 1.5px 3px rgba(255, 255, 255, 0.95),
            inset 0 -1.5px 3px rgba(217, 119, 6, 0.18)
          `,
          glintColor: 'rgba(255, 255, 255, 0.98)',
        };
      case 'blue': // Warm peach cloud
        return {
          bg: 'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.94) 0%, rgba(255, 237, 213, 0.5) 45%, rgba(234, 88, 12, 0.12) 85%, rgba(255, 255, 255, 0.2) 100%)',
          border: '1.5px solid #ffffff',
          shadow: `
            0 12px 28px -5px rgba(234, 88, 12, 0.12),
            0 2px 6px rgba(0, 0, 0, 0.04),
            inset 0 1.5px 3px rgba(255, 255, 255, 0.95),
            inset 0 -1.5px 3px rgba(234, 88, 12, 0.15)
          `,
          glintColor: 'rgba(255, 255, 255, 0.95)',
        };
      default: // Pure frosted white glass with orange refraction
        return {
          bg: 'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.96) 0%, rgba(255, 247, 237, 0.6) 50%, rgba(254, 215, 170, 0.15) 100%)',
          border: '1.5px solid #ffffff',
          shadow: `
            0 12px 28px -5px rgba(234, 88, 12, 0.1),
            0 2px 6px rgba(0, 0, 0, 0.03),
            inset 0 1.5px 3px rgba(255, 255, 255, 0.98),
            inset 0 -1.5px 2px rgba(234, 88, 12, 0.12)
          `,
          glintColor: 'rgba(255, 255, 255, 0.98)',
        };
    }
  };

  const styling = getGradientAndBorder();

  // Dimensions based on particle geometry
  const width = particle.type === 'capsule' ? (particle.width || particle.size * 2.2) : particle.size;
  const height = particle.type === 'capsule' ? (particle.height || particle.size) : particle.size;
  const borderRadius =
    particle.type === 'circle'
      ? '9999px'
      : particle.type === 'capsule'
      ? '9999px'
      : particle.type === 'ring'
      ? '9999px'
      : particle.type === 'square'
      ? '16px'
      : '10px';

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width,
        height,
        x,
        y,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        zIndex: Math.round(particle.depth * 10),
      }}
      className="pointer-events-none select-none"
    >
      {/* Ambient sinusoidal floating loop */}
      <motion.div
        animate={{
          y: [0, particle.floatDeltaY, 0],
          x: [0, particle.floatDeltaX, 0],
          rotate: [
            particle.rotation,
            particle.rotation + 4,
            particle.rotation - 4,
            particle.rotation,
          ],
          scale: [1, 1.03, 0.98, 1],
        }}
        transition={{
          duration: particle.floatDuration,
          delay: particle.floatDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius,
          background: styling.bg,
          backdropFilter: `blur(${particle.blur}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${particle.blur}px) saturate(180%)`,
          border: styling.border,
          boxShadow: styling.shadow,
          opacity: particle.opacity,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Specular curved glint (liquid light refraction) */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '12%',
            width: particle.type === 'capsule' ? '45%' : '35%',
            height: '25%',
            background: `radial-gradient(ellipse at center, ${styling.glintColor} 0%, rgba(255,255,255,0) 75%)`,
            borderRadius: '9999px',
            transform: 'rotate(-18deg)',
            filter: 'blur(1px)',
            opacity: 0.9,
          }}
        />

        {/* Delicate chromatic fringe edge highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(56,189,248,0.15) 35%, rgba(192,132,252,0.15) 70%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Hollow center for Ring shape */}
        {particle.type === 'ring' && (
          <div
            style={{
              position: 'absolute',
              inset: '28%',
              borderRadius: '9999px',
              background: 'transparent',
              border: styling.border,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export const FloatingGlassParticles: React.FC = () => {
  // Raw normalized mouse coordinates (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for liquid floating inertia
  const smoothMouseX = useSpring(mouseX, { stiffness: 42, damping: 24, mass: 0.75 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 42, damping: 24, mass: 0.75 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized position relative to window center (-1 to +1)
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      id="floating-glass-particles-canvas"
      data-testid="floating-glass-particles"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-[1]"
      style={{ perspective: 1200 }}
    >
      {PARTICLES.map((particle) => (
        <ParticleItem
          key={particle.id}
          particle={particle}
          smoothMouseX={smoothMouseX}
          smoothMouseY={smoothMouseY}
        />
      ))}
    </div>
  );
};
