'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ── Configuration ─────────────────────────────────────────────────────────────
const CURSOR_SIZE = 16;
const CURSOR_EXPANDED_SIZE = 40;
const CURSOR_COLOR = 'rgba(29, 78, 216, 0.8)'; // Royal Blue
const CURSOR_COLOR_DARK = 'rgba(96, 165, 250, 0.8)'; // Blue-400 for dark mode
const CURSOR_EXPANDED_COLOR = 'rgba(29, 78, 216, 0.15)';
const CURSOR_EXPANDED_COLOR_DARK = 'rgba(96, 165, 250, 0.15)';
const CURSOR_BORDER_COLOR = 'rgba(29, 78, 216, 0.4)';
const CURSOR_BORDER_COLOR_DARK = 'rgba(96, 165, 250, 0.4)';

// Spring config for smooth trailing effect
const SPRING_CONFIG = { damping: 25, stiffness: 300, mass: 0.5 };

// ── Helper: detect touch device (safe for SSR) ──────────────────────────────
function getIsTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getIsDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(getIsDarkMode);
  const [isTouchDevice] = useState(getIsTouchDevice);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, SPRING_CONFIG);
  const springY = useSpring(cursorY, SPRING_CONFIG);

  const rafRef = useRef<number>(0);
  const mousePos = useRef({ x: -100, y: -100 });

  // ── Listen for reduced motion changes ─────────────────────────────────────
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // ── Detect dark mode ──────────────────────────────────────────────────────
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains('dark');
      setIsDark((prev) => (prev !== nowDark ? nowDark : prev));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // ── Track mouse position with rAF ────────────────────────────────────────
  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const updatePosition = () => {
      cursorX.set(mousePos.current.x);
      cursorY.set(mousePos.current.y);
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafRef.current = requestAnimationFrame(updatePosition);

    // Add custom-cursor-active class to body
    document.body.classList.add('custom-cursor-active');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isTouchDevice, prefersReducedMotion, cursorX, cursorY]);

  // ── Detect hoverable elements with event delegation ───────────────────────
  const handleExpandStart = useCallback(() => setIsExpanded(true), []);
  const handleExpandEnd = useCallback(() => setIsExpanded(false), []);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const hoverableSelectors = 'a, button, [role="button"], input, select, textarea, [data-cursor-hover], [data-slot="button"], [tabindex]:not([tabindex="-1"])';

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(hoverableSelectors)) {
        handleExpandStart();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(hoverableSelectors)) {
        handleExpandEnd();
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isTouchDevice, prefersReducedMotion, handleExpandStart, handleExpandEnd]);

  // ── Don't render on touch devices or if reduced motion ────────────────────
  if (isTouchDevice || prefersReducedMotion) return null;

  const currentColor = isDark ? CURSOR_COLOR_DARK : CURSOR_COLOR;
  const currentExpandedBg = isDark ? CURSOR_EXPANDED_COLOR_DARK : CURSOR_EXPANDED_COLOR;
  const currentBorder = isDark ? CURSOR_BORDER_COLOR_DARK : CURSOR_BORDER_COLOR;

  return (
    <>
      {/* Outer ring - expands on hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isExpanded ? CURSOR_EXPANDED_SIZE : CURSOR_SIZE,
          height: isExpanded ? CURSOR_EXPANDED_SIZE : CURSOR_SIZE,
          backgroundColor: isExpanded ? currentExpandedBg : 'transparent',
          border: isExpanded ? `2px solid ${currentBorder}` : `2px solid ${currentColor}`,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          width: { type: 'spring', damping: 20, stiffness: 300 },
          height: { type: 'spring', damping: 20, stiffness: 300 },
          opacity: { duration: 0.2 },
          backgroundColor: { duration: 0.2 },
          border: { duration: 0.2 },
        }}
      />

      {/* Inner dot - glowing center */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isExpanded ? 6 : CURSOR_SIZE - 4,
          height: isExpanded ? 6 : CURSOR_SIZE - 4,
          backgroundColor: currentColor,
          opacity: isVisible ? (isExpanded ? 0.8 : 1) : 0,
          boxShadow: isExpanded
            ? `0 0 10px ${currentColor}, 0 0 20px ${currentExpandedBg}`
            : `0 0 8px ${currentColor}, 0 0 16px ${currentExpandedBg}`,
        }}
        transition={{
          width: { type: 'spring', damping: 20, stiffness: 300 },
          height: { type: 'spring', damping: 20, stiffness: 300 },
          opacity: { duration: 0.15 },
          boxShadow: { duration: 0.2 },
        }}
      />
    </>
  );
}
