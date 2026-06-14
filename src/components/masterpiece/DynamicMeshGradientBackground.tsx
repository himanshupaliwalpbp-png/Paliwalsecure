'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DynamicMeshGradientBackgroundProps {
  className?: string;
  colors?: string[];
  lightColors?: string[];
  animationSpeed?: number;
}

export default function DynamicMeshGradientBackground({
  className = '',
  colors = ['#0A192F', '#1A4A8A', '#00BFA5', '#FACC15'],
  lightColors = ['#E0F2FE', '#BAE6FD', '#CCFBF1', '#FEF9C3'],
  animationSpeed = 8,
}: DynamicMeshGradientBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
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
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {/* Base gradient - dark mode */}
      <div
        className="absolute inset-0 dark:block hidden"
        style={{
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`,
        }}
      />
      {/* Base gradient - light mode */}
      <div
        className="absolute inset-0 dark:hidden block"
        style={{
          background: `linear-gradient(135deg, ${lightColors[0]} 0%, ${lightColors[1]} 50%, ${lightColors[2]} 100%)`,
        }}
      />

      {/* Animated mesh gradient blobs - dark */}
      <motion.div
        className="absolute inset-0 dark:block hidden"
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, ${colors[3]}40 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 50%, ${colors[3]}40 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, ${colors[3]}40 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: animationSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Animated mesh gradient blobs - light */}
      <motion.div
        className="absolute inset-0 dark:hidden block"
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, ${lightColors[3]}60 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 50%, ${lightColors[3]}60 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, ${lightColors[3]}60 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: animationSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mouse-reactive gradient overlay - dark */}
      <motion.div
        className="absolute inset-0 pointer-events-none dark:block hidden"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors[3]}20 0%, transparent 40%)`,
        }}
        transition={{ type: 'tween', duration: 0.2 }}
      />
      {/* Mouse-reactive gradient overlay - light */}
      <motion.div
        className="absolute inset-0 pointer-events-none dark:hidden block"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${lightColors[3]}40 0%, transparent 40%)`,
        }}
        transition={{ type: 'tween', duration: 0.2 }}
      />

      {/* Animated floating orbs - dark */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={`dark-${index}`}
          className="absolute rounded-full blur-3xl dark:block hidden"
          style={{
            width: `${300 + index * 100}px`,
            height: `${300 + index * 100}px`,
            background: `radial-gradient(circle, ${colors[index]}30 0%, transparent 70%)`,
            left: `${-150 + index * 50}%`,
            top: `${-150 + index * 50}%`,
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: animationSpeed + index * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Animated floating orbs - light */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={`light-${index}`}
          className="absolute rounded-full blur-3xl dark:hidden block"
          style={{
            width: `${300 + index * 100}px`,
            height: `${300 + index * 100}px`,
            background: `radial-gradient(circle, ${lightColors[index]}50 0%, transparent 70%)`,
            left: `${-150 + index * 50}%`,
            top: `${-150 + index * 50}%`,
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
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
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' /%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
}
