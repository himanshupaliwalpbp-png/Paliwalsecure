'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CinematicVideoBackground — premium video background for the hero section.
 *
 * Professional design fixes (per user feedback):
 *   1. Video positioned at TOP of hero (not 300px down) — visible behind headline text
 *   2. No hard dark line — smooth gradient overlay blends video into background
 *   3. Better video quality — object-cover with proper sizing
 *   4. Dark mode aware — adjusts opacity + overlay for dark theme
 *
 * Scroll effect:
 *   - At scrollY=0: video subtle (initialOpacity) — text fully readable
 *   - As user scrolls: video brightens to maxOpacity
 *   - Gradient overlay ensures text remains readable in all states
 *
 * Loop logic (per cinematic spec):
 *   - Fade in over 0.5s at start (opacity 0 → target)
 *   - Fade out over 0.5s before end (opacity → 0)
 *   - On ended: opacity → 0, wait 100ms, reset currentTime, play again
 */
export function CinematicVideoBackground({
  src,
  className = '',
  initialOpacity = 0.3,
  maxOpacity = 0.55,
  scrollRange = 500,
}: {
  src: string;
  className?: string;
  /** Video opacity when page is at top (scrollY = 0). */
  initialOpacity?: number;
  /** Video opacity when user has scrolled `scrollRange` pixels. */
  maxOpacity?: number;
  /** How many pixels of scroll transitions the video from initial → max opacity. */
  scrollRange?: number;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [loopOpacity, setLoopOpacity] = useState(0);
  const [scrollFactor, setScrollFactor] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode for overlay adjustments
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    // Listen for class changes on <html>
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Scroll listener — drives the scroll-based opacity transition
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const factor = Math.min(1, Math.max(0, y / scrollRange));
      setScrollFactor(factor);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollRange]);

  // Video loop + fade-in/fade-out logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const FADE_DURATION = 0.5;

    const tick = () => {
      const { currentTime, duration } = video;

      if (duration && Number.isFinite(duration)) {
        let baseOpacity: number;

        if (currentTime < FADE_DURATION) {
          baseOpacity = currentTime / FADE_DURATION;
        } else if (currentTime > duration - FADE_DURATION) {
          baseOpacity = (duration - currentTime) / FADE_DURATION;
        } else {
          baseOpacity = 1;
        }

        setLoopOpacity(Math.min(1, Math.max(0, baseOpacity)));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    setLoopOpacity(0);
    window.setTimeout(() => {
      if (!video) return;
      video.currentTime = 0;
      void video.play();
    }, 100);
  };

  // Combine loop opacity + scroll factor
  const targetOpacity = initialOpacity + (maxOpacity - initialOpacity) * scrollFactor;
  const finalOpacity = loopOpacity * targetOpacity;

  // Smooth gradient overlay — no hard lines
  // In light mode: fades to warm bone background (#FAF7F2)
  // In dark mode: fades to dark background (#0E1116)
  const bgColor = isDark ? '#0E1116' : '#FAF7F2';
  const overlayGradient = isDark
    ? `linear-gradient(to bottom,
        ${bgColor} 0%,
        rgba(14, 17, 22, 0.7) 15%,
        rgba(14, 17, 22, 0.3) 35%,
        rgba(14, 17, 22, 0.3) 65%,
        rgba(14, 17, 22, 0.7) 85%,
        ${bgColor} 100%)`
    : `linear-gradient(to bottom,
        ${bgColor} 0%,
        rgba(250, 247, 242, 0.5) 15%,
        rgba(250, 247, 242, 0.1) 35%,
        rgba(250, 247, 242, 0.1) 65%,
        rgba(250, 247, 242, 0.5) 85%,
        ${bgColor} 100%)`;

  // Text protection overlay — ensures headline is always readable
  // A semi-transparent layer between video and text
  const textProtection = isDark
    ? 'rgba(14, 17, 22, 0.35)'
    : 'rgba(250, 247, 242, 0.25)';

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      {/* ═══ Video — covers full hero area, positioned at TOP ═══
          Per user fix: video should be visible behind the headline text,
          not pushed down 300px. Using object-cover for proper filling. */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: finalOpacity,
          transition: 'opacity 0.05s linear',
          // Slight scale for parallax depth
          transform: `scale(${1 + scrollFactor * 0.04})`,
          transformOrigin: 'center center',
          // Improve video quality rendering
          filter: 'saturate(1.1) contrast(1.05)',
        }}
      />

      {/* ═══ Smooth gradient overlay — no hard lines ═══
          Fades video into background color at top + bottom,
          creating a seamless blend with the page background.
          Middle section is more transparent so video is visible. */}
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: 'none',
          background: overlayGradient,
        }}
      />

      {/* ═══ Text protection layer ═══
          Semi-transparent overlay ensures headline text remains
          readable regardless of video content behind it.
          This replaces the hard "dark line" with a soft, even wash. */}
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: 'none',
          background: textProtection,
        }}
      />
    </div>
  );
}

export default CinematicVideoBackground;
