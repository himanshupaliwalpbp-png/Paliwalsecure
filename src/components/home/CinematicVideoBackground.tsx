'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CinematicVideoBackground — full-bleed looping video with custom fade-in/fade-out logic.
 *
 * Per the cinematic hero spec, this is integrated into the Paliwalsecure hero section
 * as a subtle background layer behind the existing content.
 *
 * Behavior:
 *   - Fade in over 0.5s at the start (opacity 0 → 1)
 *   - Fade out over 0.5s before the end (opacity 1 → 0)
 *   - On `ended`: set opacity to 0, wait 100ms, reset currentTime = 0, play again
 *   - Uses requestAnimationFrame to monitor currentTime vs duration
 *
 * Positioned with `top: 300px` and `inset: 'auto 0 0 0'` per spec — sits 300px
 * from the top, full width, anchored to bottom.
 *
 * Gradient overlay: absolute inset-0 bg-gradient-to-b from-background via-transparent to-background
 * positioned over the video.
 *
 * The video is intentionally kept at low opacity (max ~30% in light mode) so the
 * existing hero content (Protection Score dashboard, headline, CTAs) remains the
 * primary focus, with the video acting as ambient cinematic atmosphere.
 */
export function CinematicVideoBackground({
  src,
  className = '',
  maxOpacity = 0.28,
  overlayFrom = 'rgba(250, 247, 242, 1)', // Paliwalsecure warm bone background
  overlayTo = 'rgba(250, 247, 242, 1)',
}: {
  src: string;
  className?: string;
  /** Maximum video opacity (0–1). Low value keeps the video as ambient atmosphere. */
  maxOpacity?: number;
  /** Top gradient overlay color (matches Paliwalsecure background). */
  overlayFrom?: string;
  /** Bottom gradient overlay color. */
  overlayTo?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  // Start at opacity 0 so the very first paint fades in cleanly
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const FADE_DURATION = 0.5; // seconds — fade window at start + end

    const tick = () => {
      const { currentTime, duration } = video;

      if (duration && Number.isFinite(duration)) {
        if (currentTime < FADE_DURATION) {
          // Fade-in window (0 → 0.5s)
          const ratio = currentTime / FADE_DURATION;
          setOpacity(Math.min(1, Math.max(0, ratio)) * maxOpacity);
        } else if (currentTime > duration - FADE_DURATION) {
          // Fade-out window (last 0.5s)
          const ratio = (duration - currentTime) / FADE_DURATION;
          setOpacity(Math.min(1, Math.max(0, ratio)) * maxOpacity);
        } else {
          // Mid-playback — full opacity (clamped to maxOpacity)
          setOpacity(maxOpacity);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [maxOpacity]);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    // Spec: set opacity to 0, wait 100ms, reset currentTime = 0, then play()
    setOpacity(0);
    window.setTimeout(() => {
      if (!video) return;
      video.currentTime = 0;
      void video.play();
    }, 100);
  };

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
        // Don't use the native `loop` — we handle the loop manually for
        // seamless fade transitions per spec
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
          opacity,
          transition: 'opacity 0.05s linear',
        }}
      />

      {/* Gradient overlay — fades to background color at top and bottom
          so the video blends seamlessly with the warm bone canvas */}
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: 'none',
          background: `linear-gradient(to bottom, ${overlayFrom} 0%, transparent 30%, transparent 70%, ${overlayTo} 100%)`,
        }}
      />
    </div>
  );
}

// Default export for easier dynamic imports
export default CinematicVideoBackground;
