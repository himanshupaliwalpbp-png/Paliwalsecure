'use client';

import { useSafeTheme } from '@/lib/safe-theme-provider';
import { useMemo, useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   AnimatedBackground — Premium, theme-aware background animations
   
   Variants:
     - mesh:      Floating gradient orbs that slowly drift (soft, ambient)
     - particles: Small gold dots that float upward (dust motes)
     - waves:     Subtle wave pattern at the bottom of sections
     - aurora:    Northern-lights style gradient animation

   Intensity:
     - subtle:  opacity 0.03–0.05 (default, barely visible)
     - medium:  opacity 0.05–0.08 (slightly more visible)
     - strong:  opacity 0.08–0.12 (clearly visible)

   Theme-aware:
     - Dark mode:  Gold/navy glows, more visible
     - Light mode: Soft cream/gold tints (even more subtle, warm)
   
   Respects prefers-reduced-motion
   Mobile: reduces particle count for performance
   ═══════════════════════════════════════════════════════════════════════════ */

interface AnimatedBackgroundProps {
  variant?: 'mesh' | 'particles' | 'waves' | 'aurora';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

/* ── Intensity multiplier map ────────────────────────────────────────────── */
const INTENSITY_MAP = {
  subtle:  { orb: 0.04, particle: 0.06, wave: 0.04, aurora: 0.05 },
  medium:  { orb: 0.06, particle: 0.09, wave: 0.06, aurora: 0.08 },
  strong:  { orb: 0.10, particle: 0.13, wave: 0.09, aurora: 0.12 },
} as const;

/* ── Mobile detection hook ──────────────────────────────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile('matches' in e ? e.matches : (e as MediaQueryListEvent).matches);
    };
    // Initial check via handler to avoid direct setState in effect body
    handler(mql);
    mql.addEventListener('change', handler as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener('change', handler as (e: MediaQueryListEvent) => void);
  }, []);
  return isMobile;
}

/* ── Mesh variant — Floating gradient orbs ───────────────────────────────── */
function MeshVariant({ isDark, opacity }: { isDark: boolean; opacity: number }) {
  /* Dark: gold & navy glows — more visible */
  /* Light: warm cream/gold tints — very subtle, barely perceptible */
  const orbColor = isDark
    ? `rgba(200,146,42,${opacity})`
    : `rgba(200,146,42,${opacity * 0.45})`;
  const navyColor = isDark
    ? `rgba(26,48,96,${opacity * 0.8})`
    : `rgba(253,240,213,${opacity * 2.0})`;  /* Gold-100 tint for light */
  const lightTint = isDark
    ? `rgba(232,184,75,${opacity * 0.5})`
    : `rgba(254,247,232,${opacity * 2.5})`;  /* Gold-50 tint for light */

  return (
    <>
      {/* Orb 1 — top-left, slow drift */}
      <div
        className="absolute will-change-transform"
        style={{
          width: '50%',
          height: '60%',
          top: '-10%',
          left: '-10%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${orbColor} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: 'ab-float-1 18s ease-in-out infinite',
        }}
      />
      {/* Orb 2 — center-right, medium drift */}
      <div
        className="absolute will-change-transform"
        style={{
          width: '40%',
          height: '50%',
          top: '20%',
          right: '-5%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${navyColor} 0%, transparent 70%)`,
          filter: 'blur(50px)',
          animation: 'ab-float-2 22s ease-in-out infinite',
        }}
      />
      {/* Orb 3 — bottom-center, slow drift */}
      <div
        className="absolute will-change-transform"
        style={{
          width: '35%',
          height: '40%',
          bottom: '-5%',
          left: '30%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${lightTint} 0%, transparent 70%)`,
          filter: 'blur(45px)',
          animation: 'ab-float-3 25s ease-in-out infinite',
        }}
      />
    </>
  );
}

/* ── Particles variant — Floating gold dust motes ────────────────────────── */
function ParticlesVariant({ isDark, opacity, isMobile }: { isDark: boolean; opacity: number; isMobile: boolean }) {
  /* Mobile: fewer particles for performance */
  const count = isMobile ? 8 : 18;

  /* Generate deterministic particle positions */
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 7 + 3;
      return {
        id: i,
        x: ((seed * 13) % 100),
        size: isMobile ? 2 + (i % 2) : 2 + (i % 3),
        duration: 12 + (i % 5) * 4,
        delay: (i * 1.7) % 8,
        opacity: opacity * (0.5 + ((i % 4) * 0.15)),
      };
    });
  }, [opacity, count, isMobile]);

  /* Dark: gold particles with glow, Light: warm amber dots, more subtle */
  const color = isDark ? '200,146,42' : '180,130,50';
  const glowOpacity = isDark ? opacity * 1.2 : opacity * 0.5;

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute will-change-transform"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: '-5%',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${color},${p.opacity}) 0%, rgba(${color},${p.opacity * 0.3}) 60%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(${color},${glowOpacity * 0.5})`,
            animation: `ab-particle-rise ${p.duration}s ${p.delay}s ease-in infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ── Waves variant — Subtle wave pattern at bottom ───────────────────────── */
function WavesVariant({ isDark, opacity }: { isDark: boolean; opacity: number }) {
  const waveColor = isDark
    ? `rgba(200,146,42,${opacity})`
    : `rgba(200,146,42,${opacity * 0.4})`;
  const waveColor2 = isDark
    ? `rgba(232,184,75,${opacity * 0.7})`
    : `rgba(200,146,42,${opacity * 0.25})`;

  return (
    <>
      {/* Wave 1 — back layer, slower */}
      <svg
        className="absolute bottom-0 left-0 w-[200%] will-change-transform"
        style={{ height: '30%', animation: 'ab-wave-drift 25s linear infinite' }}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,200 L0,200 Z"
          fill={waveColor}
        />
      </svg>
      {/* Wave 2 — front layer, faster */}
      <svg
        className="absolute bottom-0 left-0 w-[200%] will-change-transform"
        style={{ height: '20%', animation: 'ab-wave-drift 18s linear infinite reverse' }}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,140 C360,80 600,180 900,120 C1100,80 1300,160 1440,140 L1440,200 L0,200 Z"
          fill={waveColor2}
        />
      </svg>
    </>
  );
}

/* ── Aurora variant — Northern-lights style gradient animation ───────────── */
function AuroraVariant({ isDark, opacity }: { isDark: boolean; opacity: number }) {
  /* Dark: gold/navy aurora bands — clearly visible */
  /* Light: warm cream/gold aurora bands — very subtle */
  const band1Color = isDark
    ? `rgba(200,146,42,${opacity})`
    : `rgba(200,146,42,${opacity * 0.35})`;
  const band2Color = isDark
    ? `rgba(26,48,96,${opacity * 0.8})`
    : `rgba(253,240,213,${opacity * 1.5})`;
  const band3Color = isDark
    ? `rgba(232,184,75,${opacity * 0.5})`
    : `rgba(254,247,232,${opacity * 1.0})`;

  return (
    <>
      {/* Aurora band 1 — top, wide sweep */}
      <div
        className="absolute will-change-transform"
        style={{
          top: '0%',
          left: '-20%',
          width: '140%',
          height: '50%',
          background: `linear-gradient(90deg, transparent 0%, ${band1Color} 20%, ${band2Color} 50%, ${band1Color} 80%, transparent 100%)`,
          filter: 'blur(40px)',
          animation: 'ab-aurora-sweep 20s ease-in-out infinite',
          transformOrigin: 'center center',
        }}
      />
      {/* Aurora band 2 — middle, narrower */}
      <div
        className="absolute will-change-transform"
        style={{
          top: '20%',
          left: '-10%',
          width: '120%',
          height: '35%',
          background: `linear-gradient(90deg, transparent 0%, ${band3Color} 30%, ${band1Color} 60%, transparent 100%)`,
          filter: 'blur(35px)',
          animation: 'ab-aurora-sweep 16s ease-in-out infinite reverse',
          transformOrigin: 'center center',
        }}
      />
      {/* Aurora band 3 — bottom, subtle */}
      <div
        className="absolute will-change-transform"
        style={{
          top: '40%',
          left: '-15%',
          width: '130%',
          height: '40%',
          background: `linear-gradient(90deg, transparent 0%, ${band2Color} 25%, ${band3Color} 55%, transparent 90%)`,
          filter: 'blur(45px)',
          animation: 'ab-aurora-sweep 24s ease-in-out infinite',
          animationDelay: '-6s',
          transformOrigin: 'center center',
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main AnimatedBackground Component
   ═══════════════════════════════════════════════════════════════════════════ */
export function AnimatedBackground({
  variant = 'mesh',
  intensity = 'subtle',
  className = '',
}: AnimatedBackgroundProps) {
  const { resolvedTheme } = useSafeTheme();
  const isDark = resolvedTheme !== 'light';
  const isMobile = useIsMobile();
  const opacities = INTENSITY_MAP[intensity];

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Keyframes are defined in globals.css (ab-float-1/2/3, ab-particle-rise, ab-wave-drift, ab-aurora-sweep) */}

      <div className="ab-animated-container absolute inset-0">
        {variant === 'mesh' && (
          <MeshVariant isDark={isDark} opacity={opacities.orb} />
        )}
        {variant === 'particles' && (
          <ParticlesVariant isDark={isDark} opacity={opacities.particle} isMobile={isMobile} />
        )}
        {variant === 'waves' && (
          <WavesVariant isDark={isDark} opacity={opacities.wave} />
        )}
        {variant === 'aurora' && (
          <AuroraVariant isDark={isDark} opacity={opacities.aurora} />
        )}
      </div>
    </div>
  );
}
