'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

/**
 * Reusable hook for auto-refreshing data at a specified interval.
 *
 * @param callback - The function to call on each interval tick
 * @param intervalMs - Interval in milliseconds (default: 30000 = 30s)
 * @param enabled - Whether the auto-refresh is active (default: true)
 */
export function useRealtime(
  callback: () => void,
  intervalMs = 30000,
  enabled = true
) {
  const callbackRef = useRef(callback);

  // Update the ref inside an effect to avoid accessing refs during render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => callbackRef.current(), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, enabled]);
}

/**
 * Hook that tracks the number of seconds since a given timestamp
 * and auto-updates every second.
 */
export function useSecondsAgo(since: number | null, enabled = true) {
  // Compute initial value using useMemo to avoid calling setState in effects
  const initialSeconds = useMemo(() => {
    if (!enabled || since === null) return null;
    return Math.floor((Date.now() - since) / 1000);
  }, [since, enabled]);

  const [seconds, setSeconds] = useState<number | null>(initialSeconds);
  const prevSinceRef = useRef(since);
  const prevEnabledRef = useRef(enabled);

  // Sync state when since/enabled changes
  if (prevSinceRef.current !== since || prevEnabledRef.current !== enabled) {
    prevSinceRef.current = since;
    prevEnabledRef.current = enabled;
    const newSeconds = !enabled || since === null ? null : Math.floor((Date.now() - since) / 1000);
    // Only update if different to avoid unnecessary re-renders
    if (newSeconds !== seconds) {
      setSeconds(newSeconds);
    }
  }

  useEffect(() => {
    if (!enabled || since === null) return;

    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - since) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [since, enabled]);

  return seconds;
}
