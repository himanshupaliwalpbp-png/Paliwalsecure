"use client";

/**
 * Paliwal Saver — count-up hook for savings figures.
 * Ease-out cubic, ~1.2s default, honours prefers-reduced-motion.
 */

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useCountUp(
  target: number | null | undefined,
  opts?: { duration?: number; delay?: number; active?: boolean }
): number {
  const duration = opts?.duration ?? 1200;
  const delay = opts?.delay ?? 0;
  const active = opts?.active ?? true;
  const reduce = useReducedMotion();

  const [value, setValue] = useState(0);
  const goal = typeof target === "number" && Number.isFinite(target) ? target : 0;

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let cancelled = false;
    // reduced motion → duration collapses to 0 → first frame lands on the goal
    const dur = reduce ? 0 : duration;
    const start = performance.now() + (reduce ? 0 : delay);
    const tick = (now: number) => {
      if (cancelled) return;
      const t = dur <= 0 ? 1 : Math.min(1, Math.max(0, (now - start) / dur));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(goal * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [goal, duration, delay, active, reduce]);

  return value;
}

/** Rounded display value from a count-up — avoids re-render noise mid-flight. */
export function useCountUpRounded(
  target: number | null | undefined,
  opts?: { duration?: number; delay?: number; active?: boolean }
): number {
  const v = useCountUp(target, opts);
  return Math.round(v);
}
