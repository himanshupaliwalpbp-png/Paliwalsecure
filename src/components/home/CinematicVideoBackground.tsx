'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CinematicVideoBackground — full-bleed looping video with custom fade-in/fade-out
 * loop logic AND scroll-driven opacity transition.
 *
 * Behavior:
 *
 * 1. VIDEO LOOP (per cinematic hero spec):
 *   - Fade in over 0.5s at the start (opacity 0 → initialOpacity)
 *   - Fade out over 0.5s before the end (opacity → 0)
 *   - On `ended`: set opacity to 0, wait 100ms, reset currentTime = 0, play again
 *   - Uses requestAnimationFrame to monitor currentTime vs duration
 *
 * 2. SCROLL-DRIVEN OPACITY (the "3D website" effect):
 *   - At scrollY = 0: video shows at `initialOpacity` (default 0.35) — text is readable
 *   - As user scrolls down, video opacity smoothly increases to `maxOpacity` (default 1.0)
 *   - Full opacity reached after scrolling `scrollRange` pixels (default 600px)
 *   - This creates the effect of "video emerging from behind text" as user scrolls
 *
 * Positioned with `top: 300px` and `inset: 'auto 0 0 0'` per spec.
 *
 * Gradient overlay: from-background via-transparent to-background positioned over video.
 */
export function CinematicVideoBackground({
  src,
  className = '',
  initialOpacity = 0.35,
  maxOpacity = 1.0,
  scrollRange = 600,
  overlayFrom = 'rgba(250, 247, 242, 1)',
  overlayTo = 'rgba(250, 247, 242, 1)',
  overlayFadeWithScroll = true,
}: {
  src: string;
  className?: string;
  /** Video opacity when page is at top (scrollY = 0). Text must remain readable. */
  initialOpacity?: number;
  /** Video opacity when user has scrolled `scrollRange` pixels. Default 1.0 (100%). */
  maxOpacity?: number;
  /** How many pixels of scroll transitions the video from initial → max opacity. */
  scrollRange?: number;
  /** Top gradient overlay color. */
  overlayFrom?: string;
  /** Bottom gradient overlay color. */
  overlayTo?: string;
  /** If true, gradient overlay also fades out as user scrolls (so video becomes fully visible). */
  overlayFadeWithScroll?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);
  // Tracks the loop-driven opacity (0 → initialOpacity → 0 → repeat)
  const [loopOpacity, setLoopOpacity] = useState(0);
  // Tracks the scroll-driven multiplier (0 → 1 as user scrolls scrollRange px)
  const [scrollFactor, setScrollFactor] = useState(0);

  // ── Scroll listener ────────────────────────────────────────────────────
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      scrollYRef.current = y;
      // 0 at top, 1 after scrolling `scrollRange` pixels
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
    update(); // initial call

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollRange]);

  // ── Video loop + fade-in/fade-out logic ─────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const FADE_DURATION = 0.5; // seconds — fade window at start + end

    const tick = () => {
      const { currentTime, duration } = video;

      if (duration && Number.isFinite(duration)) {
        let baseOpacity: number;

        if (currentTime < FADE_DURATION) {
          // Fade-in window (0 → 0.5s)
          const ratio = currentTime / FADE_DURATION;
          baseOpacity = Math.min(1, Math.max(0, ratio));
        } else if (currentTime > duration - FADE_DURATION) {
          // Fade-out window (last 0.5s)
          const ratio = (duration - currentTime) / FADE_DURATION;
          baseOpacity = Math.min(1, Math.max(0, ratio));
        } else {
          // Mid-playback — full loop opacity
          baseOpacity = 1;
        }

        setLoopOpacity(baseOpacity);
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

    // Spec: set opacity to 0, wait 100ms, reset currentTime = 0, then play()
    setLoopOpacity(0);
    window.setTimeout(() => {
      if (!video) return;
      video.currentTime = 0;
      void video.play();
    }, 100);
  };

  // Combine loop opacity + scroll factor to get the final video opacity
  // At scrollY=0: finalOpacity = loopOpacity * initialOpacity
  // At scrollY=scrollRange: finalOpacity = loopOpacity * maxOpacity
  const targetOpacity = initialOpacity + (maxOpacity - initialOpacity) * scrollFactor;
  const finalOpacity = loopOpacity * targetOpacity;

  // Gradient overlay opacity — fades from 1 (at top) to 0 (after scrollRange)
  // so the video becomes fully visible at the bottom of the scroll range
  const overlayOpacity = overlayFadeWithScroll ? 1 - scrollFactor : 1;

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        style={{
          position: 'absolute',
          top: '300px',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: 'calc(100% - 300px)',
          objectFit: 'cover',
          opacity: finalOpacity,
          transition: 'opacity 0.05s linear',
          // Slight scale on scroll for parallax depth feel
          transform: `scale(${1 + scrollFactor * 0.05})`,
          transformOrigin: 'center center',
        }}
      />

      {/* Gradient overlay — fades to background color at top and bottom.
          As user scrolls, overlay fades out so video becomes fully visible. */}
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: 'none',
          opacity: overlayOpacity,
          transition: 'opacity 0.1s linear',
          background: `linear-gradient(to bottom, ${overlayFrom} 0%, transparent 30%, transparent 70%, ${overlayTo} 100%)`,
        }}
      />
    </div>
  );
}

// Default export for easier dynamic imports
export default CinematicVideoBackground;
