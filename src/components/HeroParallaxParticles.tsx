'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ── Individual Parallax Particle ──────────────────────────────────────────────
function ParallaxParticle({
  size,
  color,
  x,
  y,
  speed,
  scrollYProgress,
  delay,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  speed: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  delay: number;
}) {
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);

  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        y: yOffset,
        opacity,
      }}
      animate={{
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 3 + speed * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

// ── Particle Data ────────────────────────────────────────────────────────────
const particles = [
  { id: 1, size: 4, color: 'bg-blue-400', x: '10%', y: '20%', speed: 0.3 },
  { id: 2, size: 3, color: 'bg-indigo-400', x: '25%', y: '60%', speed: 0.5 },
  { id: 3, size: 5, color: 'bg-amber-400', x: '70%', y: '30%', speed: 0.2 },
  { id: 4, size: 2, color: 'bg-blue-300', x: '85%', y: '70%', speed: 0.6 },
  { id: 5, size: 4, color: 'bg-indigo-300', x: '40%', y: '80%', speed: 0.4 },
  { id: 6, size: 3, color: 'bg-amber-300', x: '55%', y: '15%', speed: 0.35 },
  { id: 7, size: 6, color: 'bg-blue-400', x: '90%', y: '45%', speed: 0.25 },
  { id: 8, size: 2, color: 'bg-indigo-500', x: '5%', y: '50%', speed: 0.55 },
  { id: 9, size: 3, color: 'bg-amber-500', x: '35%', y: '40%', speed: 0.45 },
  { id: 10, size: 4, color: 'bg-blue-300', x: '60%', y: '85%', speed: 0.3 },
];

// ── Main Component ──────────────────────────────────────────────────────────
export default function HeroParallaxParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <ParallaxParticle
          key={particle.id}
          size={particle.size}
          color={particle.color}
          x={particle.x}
          y={particle.y}
          speed={particle.speed}
          scrollYProgress={scrollYProgress}
          delay={particle.id * 0.3}
        />
      ))}
    </div>
  );
}
