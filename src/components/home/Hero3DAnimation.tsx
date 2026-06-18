'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Heart, Shield, Car, Plane, Building2, Sparkles } from 'lucide-react';

// ============================================================================
// Hero3DAnimation — Futuristic AI Insurance Universe
// Style: Apple × Stripe × Tesla × SpaceX × Linear
// Pure CSS 3D + React — no Three.js needed, blazing fast
// ============================================================================

const ORBITING_NODES = [
  { icon: Heart, label: 'Health', color: '#2D6A4F', angle: 0, delay: '0s' },
  { icon: Shield, label: 'Term', color: '#B8482C', angle: 72, delay: '0.5s' },
  { icon: Car, label: 'Car', color: '#1B4D4A', angle: 144, delay: '1s' },
  { icon: Plane, label: 'Travel', color: '#B8860B', angle: 216, delay: '1.5s' },
  { icon: Building2, label: 'Business', color: '#4A4F57', angle: 288, delay: '2s' },
];

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 5,
  delay: Math.random() * 5,
}));

export default function Hero3DAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x: x * 30, y: y * 30 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl"
      style={{
        background: 'radial-gradient(ellipse at center, #0A1F44 0%, #07111F 70%, #050B15 100%)',
        perspective: '1200px',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════
          BACKGROUND LAYERS — Deep Space + Nebula + Particles
         ════════════════════════════════════════════════════════════════ */}

      {/* Nebula glow 1 — Blue */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(10, 31, 68, 0.6) 0%, transparent 50%)',
          transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Nebula glow 2 — Gold tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 70% 60%, rgba(200, 155, 60, 0.08) 0%, transparent 40%)',
          transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Star particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.id % 3 === 0 ? '#C89B3C' : p.id % 2 === 0 ? '#FFFFFF' : '#4A90D9',
            opacity: 0,
            animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 2}px currentColor`,
          }}
        />
      ))}

      {/* ════════════════════════════════════════════════════════════════
          CENTER STAGE — Crystal Shield + AI Core
         ════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `rotateY(${mousePos.x * 0.5}deg) rotateX(${mousePos.y * -0.5}deg)`,
          transition: 'transform 0.3s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(200, 155, 60, 0.15) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }}
        />

        {/* Crystal Shield — Glassmorphism */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: '220px',
            height: '220px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(200, 155, 60, 0.3)',
            boxShadow: `
              0 0 60px rgba(200, 155, 60, 0.15),
              inset 0 0 40px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            animation: 'float 6s ease-in-out infinite',
          }}
        >
          {/* Inner shield ring — rotating */}
          <div
            className="absolute rounded-full"
            style={{
              width: '180px',
              height: '180px',
              border: '1px solid rgba(200, 155, 60, 0.15)',
              animation: 'rotate-slow 20s linear infinite',
            }}
          >
            {/* Ring dots */}
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: '#C89B3C',
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateY(-90px) translateX(-50%)`,
                  boxShadow: '0 0 8px #C89B3C',
                }}
              />
            ))}
          </div>

          {/* AI Core — Glowing center */}
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(200, 155, 60, 0.4) 0%, rgba(200, 155, 60, 0.1) 60%, transparent 100%)',
              animation: 'core-pulse 3s ease-in-out infinite',
            }}
          >
            {/* Core icon */}
            <Sparkles
              className="w-8 h-8 text-[#C89B3C]"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(200, 155, 60, 0.8))',
                animation: 'rotate-slow 10s linear infinite',
              }}
            />

            {/* Core glow */}
            <div
              className="absolute rounded-full"
              style={{
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(200, 155, 60, 0.2) 0%, transparent 70%)',
                filter: 'blur(15px)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            />
          </div>

          {/* Energy particles inside shield */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '3px',
                height: '3px',
                background: '#C89B3C',
                boxShadow: '0 0 6px #C89B3C',
                animation: `orbit-inside ${4 + i}s linear ${i * 0.5}s infinite`,
                transformOrigin: 'center',
              }}
            />
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            ORBITING INSURANCE NODES
           ════════════════════════════════════════════════════════════════ */}
        {ORBITING_NODES.map((node, i) => {
          const Icon = node.icon;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                width: '320px',
                height: '320px',
                animation: `orbit-rotate ${25 + i * 2}s linear infinite`,
                animationDelay: node.delay,
                transformOrigin: 'center',
              }}
            >
              <div
                className="absolute flex flex-col items-center gap-1"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${node.angle}deg) translateY(-160px) rotate(-${node.angle}deg) translateX(-50%)`,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: `linear-gradient(135deg, ${node.color}30, ${node.color}10)`,
                    border: `1px solid ${node.color}40`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 0 20px ${node.color}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: node.color, filter: `drop-shadow(0 0 4px ${node.color}80)` }}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold tracking-wide"
                  style={{ color: `${node.color}cc` }}
                >
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Orbit trail rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${300 + i * 40}px`,
              height: `${300 + i * 40}px`,
              borderColor: `rgba(200, 155, 60, ${0.05 - i * 0.01})`,
              transform: 'translate(-50%, -50%)',
              top: '50%',
              left: '50%',
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          BRAND OVERLAY — Paliwal Secure AI
         ════════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase"
          style={{
            color: 'rgba(200, 155, 60, 0.6)',
            textShadow: '0 0 20px rgba(200, 155, 60, 0.3)',
          }}
        >
          Paliwal Secure AI
        </p>
        <p className="text-[10px] text-white/30 mt-1">AI-Powered Insurance Universe</p>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CSS KEYFRAMES (inline for portability)
         ════════════════════════════════════════════════════════════════ */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes core-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit-inside {
          from {
            transform: rotate(0deg) translateY(-60px) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          to {
            transform: rotate(360deg) translateY(-60px) rotate(-360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
