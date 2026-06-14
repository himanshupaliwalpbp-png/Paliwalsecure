'use client';

import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = progressBarRef.current;
      if (!el) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress = totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0;
      el.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-progress" ref={progressBarRef} style={{ width: '0%' }} />
  );
}
