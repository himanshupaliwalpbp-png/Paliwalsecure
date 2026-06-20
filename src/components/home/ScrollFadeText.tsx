'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * ScrollFadeText — wraps hero text content and fades it out as the user scrolls.
 *
 * The "3D website" effect:
 *   - At scrollY = 0: text is fully visible (opacity 1, translateY 0)
 *   - As user scrolls down, text opacity decreases to 0 and translates upward
 *   - Full fade-out reached after scrolling `scrollRange` pixels (default 500px)
 *
 * Combined with CinematicVideoBackground (which fades IN as user scrolls),
 * this creates the illusion of text dissolving into the background video —
 * exactly the "3D website" feel the user asked for.
 *
 * Uses requestAnimationFrame-throttled scroll listener for smooth performance.
 */
export function ScrollFadeText({
  children,
  className = '',
  scrollRange = 500,
  translateY = 80,
}: {
  children: ReactNode;
  className?: string;
  /** How many pixels of scroll completes the fade-out. */
  scrollRange?: number;
  /** How many pixels the text translates upward as it fades. */
  translateY?: number;
}) {
  const [scrollFactor, setScrollFactor] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
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
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollRange]);

  // Easing curve — ease-in for a more cinematic feel (text fades faster at start,
  // then slows down). Using cubic ease-in: f(t) = t^3
  const eased = scrollFactor * scrollFactor * scrollFactor;

  return (
    <div
      className={className}
      style={{
        opacity: 1 - eased,
        transform: `translateY(${-eased * translateY}px)`,
        transition: 'opacity 0.1s linear, transform 0.1s linear',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

export default ScrollFadeText;
