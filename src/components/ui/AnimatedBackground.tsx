'use client';

import React, { useMemo, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { useSafeTheme } from '@/lib/safe-theme-provider';

interface OrbConfig {
  id: number;
  size: number;
  x: string;
  y: string;
  darkColor: string;
  lightColor: string;
  duration: number;
  delay: number;
  opacity: number;
}

// Very subtle orbs — ink and sienna tones, barely perceptible
// "Quiet confidence" design: crafted feel, not AI template
const orbs: OrbConfig[] = [
  {
    id: 0,
    size: 420,
    x: '10%',
    y: '10%',
    darkColor: 'rgba(14,18,32,0.03)',       // Subtle ink — Deep Ink bg complement
    lightColor: 'rgba(194,86,44,0.03)',       // Subtle sienna for light
    duration: 45,
    delay: 0,
    opacity: 0.03,
  },
  {
    id: 1,
    size: 315,
    x: '65%',
    y: '10%',
    darkColor: 'rgba(14,18,32,0.03)',        // Subtle ink for dark mode
    lightColor: 'rgba(15,19,32,0.02)',        // Very subtle ink for light
    duration: 55,
    delay: -8,
    opacity: 0.03,
  },
  {
    id: 4,
    size: 350,
    x: '50%',
    y: '80%',
    darkColor: 'rgba(212,132,90,0.04)',       // Faint sienna glow at bottom
    lightColor: 'rgba(194,86,44,0.02)',        // Very subtle sienna for light
    duration: 65,
    delay: -12,
    opacity: 0.04,
  },
];

// Mobile-optimized orbs — smaller sizes and fewer count
const mobileOrbs: OrbConfig[] = [
  {
    id: 0,
    size: 175,
    x: '15%',
    y: '10%',
    darkColor: 'rgba(14,18,32,0.03)',        // Subtle ink
    lightColor: 'rgba(194,86,44,0.02)',       // Very subtle sienna
    duration: 45,
    delay: 0,
    opacity: 0.03,
  },
];

// Hydration-safe hook for client-only rendering
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},  // No-op subscribe
    () => true,   // Client snapshot
    () => false,  // Server snapshot
  );
}

// Hydration-safe hook for prefers-reduced-motion
function usePrefersReducedMotion() {
  const subscribe = useMemo(
    () =>
      function onStoreChange(callback: () => void) {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        mq.addEventListener('change', callback);
        return () => mq.removeEventListener('change', callback);
      },
    [],
  );

  const getSnapshot = useMemo(
    () =>
      function getSnapshot() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      },
    [],
  );

  const getServerSnapshot = useMemo(
    () =>
      function getServerSnapshot() {
        return false;
      },
    [],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Hydration-safe hook for mobile viewport — uses matchMedia (no re-renders on every resize)
function useIsMobile() {
  const subscribe = useMemo(
    () =>
      function onStoreChange(callback: () => void) {
        const mq = window.matchMedia('(max-width: 767px)');
        mq.addEventListener('change', callback);
        return () => mq.removeEventListener('change', callback);
      },
    [],
  );

  const getSnapshot = useMemo(
    () =>
      function getSnapshot() {
        return window.matchMedia('(max-width: 767px)').matches;
      },
    [],
  );

  const getServerSnapshot = useMemo(
    () =>
      function getServerSnapshot() {
        return false; // Default to desktop on server
      },
    [],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * AnimatedBackground — Subtle atmospheric texture for Paliwal Secure
 *
 * Design philosophy: "Quiet confidence"
 * - Very faint ink/sienna orbs that slowly drift — barely perceptible
 * - No mesh gradients or flashy effects — just crafted noise + faint dots
 * - Opacity reduced 50% from previous version
 * - Respects prefers-reduced-motion: disables all animation
 * - CSS classes for noise texture and very faint dots are layered beneath
 */
const AnimatedBackground: React.FC = () => {
  const { resolvedTheme } = useSafeTheme();
  const mounted = useHasMounted();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Check if mobile viewport — uses matchMedia for zero re-renders on resize
  const isMobile = useIsMobile();
  const activeOrbs = isMobile ? mobileOrbs : orbs;

  // Don't render orbs until mounted (avoids hydration mismatch with theme)
  if (!mounted) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ contain: 'strict', transform: 'translateZ(0)' }}
        aria-hidden="true"
      />
    );
  }

  // Hydration-safe: only treat as light when explicitly 'light'
  const isLight = resolvedTheme === 'light';

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ contain: 'strict', transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      {/* Very subtle floating orbs — barely perceptible */}
      {activeOrbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: isLight
              ? `radial-gradient(circle, ${orb.lightColor} 0%, transparent 70%)`
              : `radial-gradient(circle, ${orb.darkColor} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            opacity: isLight ? Math.min(orb.opacity + 0.01, 0.06) : orb.opacity,
            willChange: 'transform',
          }}
          animate={{
            x: [0, 15, -10, 0],
            y: [0, -12, 8, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

    </div>
  );
};

export default AnimatedBackground;
