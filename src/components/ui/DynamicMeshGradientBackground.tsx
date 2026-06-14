'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DynamicMeshGradientBackgroundProps {
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  reducedMotion?: boolean;
}

/**
 * Animated mesh gradient background that reacts to mouse movement.
 * Adapted for Paliwal Secure AI's gold/navy palette.
 * Respects prefers-reduced-motion.
 */
const DynamicMeshGradientBackground: React.FC<DynamicMeshGradientBackgroundProps> = ({
  className = '',
  colors = ['#0A1330', '#162D5A', '#C98A1C', '#C98A1C'],
  animationSpeed = 8,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`,
        }}
      />

      {/* Animated mesh gradient blobs */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, ${colors[3]}30 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 50%, ${colors[3]}30 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, ${colors[3]}30 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: animationSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mouse-reactive gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors[3]}15 0%, transparent 40%)`,
        }}
        transition={{ type: 'tween', duration: 0.3 }}
      />

      {/* Animated floating orbs */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${250 + index * 80}px`,
            height: `${250 + index * 80}px`,
            background: `radial-gradient(circle, ${colors[index]}20 0%, transparent 70%)`,
            left: `${-100 + index * 40}%`,
            top: `${-100 + index * 40}%`,
          }}
          animate={{
            x: [0, 80, -80, 0],
            y: [0, -80, 80, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: animationSpeed + index * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' /%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
};

export default DynamicMeshGradientBackground;
