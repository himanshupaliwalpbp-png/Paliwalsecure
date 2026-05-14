'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Heart, Car, Plane, Brain, ShieldCheck } from 'lucide-react';

// ── 3D Shield Component ──────────────────────────────────────────────────────
export default function HeroShield3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-linked 3D rotation (desktop only via CSS media query)
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, -5]);

  // Orbiting icons data
  const orbitIcons = [
    { Icon: Heart, color: 'from-rose-400 to-pink-500', angle: 0 },
    { Icon: Shield, color: 'from-blue-400 to-indigo-500', angle: 90 },
    { Icon: Car, color: 'from-amber-400 to-orange-500', angle: 180 },
    { Icon: Plane, color: 'from-violet-400 to-purple-500', angle: 270 },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      {/* 3D Perspective Container */}
      <div className="perspective-[1000px] hidden lg:block">
        <motion.div
          style={{ rotateY, rotateX }}
          className="relative"
        >
          {/* Main Shield Card */}
          <div className="relative rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            {/* Animated gradient border glow */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
              style={{
                background: 'conic-gradient(from var(--border-angle, 0deg), transparent 40%, rgba(99,102,241,0.4) 50%, transparent 60%)',
                animation: 'rotateBorder 8s linear infinite',
              }}
            />
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-900/95 to-blue-900/95" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Coverage Score</h3>
                  <p className="text-sm text-slate-400">AI Analysis</p>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'Health', pct: 85, gradient: 'from-rose-400 to-pink-600', color: 'text-rose-400' },
                  { label: 'Life', pct: 60, gradient: 'from-blue-400 to-indigo-600', color: 'text-blue-400' },
                  { label: 'Motor', pct: 92, gradient: 'from-amber-400 to-orange-600', color: 'text-amber-400' },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300">{bar.label}</span>
                      <span className={`font-semibold ${bar.color}`}>{bar.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${bar.gradient} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.pct}%` }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <p className="text-sm text-amber-300 font-medium">
                  2 gaps found in your coverage
                </p>
              </div>
            </div>
          </div>

          {/* Pulsing Rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-3xl border border-blue-400/10 pointer-events-none"
              style={{
                inset: `-${ring * 16}px`,
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: ring * 0.5,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Orbiting Insurance Icons */}
          {orbitIcons.map(({ Icon, color, angle }, idx) => (
            <motion.div
              key={angle}
              className="absolute pointer-events-none"
              style={{
                top: '50%',
                left: '50%',
                width: 0,
                height: 0,
              }}
              animate={{
                rotate: [angle, angle + 360],
              }}
              transition={{
                duration: 20 + idx * 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(${Math.cos((angle * Math.PI) / 180) * 200}px, ${Math.sin((angle * Math.PI) / 180) * 200}px)`,
                }}
                animate={{
                  x: [
                    Math.cos((angle * Math.PI) / 180) * 200,
                    Math.cos(((angle + 360) * Math.PI) / 180) * 200,
                  ],
                  y: [
                    Math.sin((angle * Math.PI) / 180) * 200,
                    Math.sin(((angle + 360) * Math.PI) / 180) * 200,
                  ],
                }}
                transition={{
                  duration: 20 + idx * 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile version — simple breathing animation */}
      <div className="lg:hidden">
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="glass-dark rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Coverage Score</h3>
                <p className="text-xs text-slate-400">AI Analysis</p>
              </div>
            </div>
            {[
              { label: 'Health', pct: 85, gradient: 'from-rose-400 to-pink-600', color: 'text-rose-400' },
              { label: 'Life', pct: 60, gradient: 'from-blue-400 to-indigo-600', color: 'text-blue-400' },
              { label: 'Motor', pct: 92, gradient: 'from-amber-400 to-orange-600', color: 'text-amber-400' },
            ].map((bar) => (
              <div key={bar.label} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{bar.label}</span>
                  <span className={`font-semibold ${bar.color}`}>{bar.pct}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${bar.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.pct}%` }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-4 p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <p className="text-xs text-amber-300 font-medium">2 gaps found in your coverage</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Badges */}
      <motion.div
        className="hidden lg:block absolute -top-4 -right-4 glass-dark rounded-xl p-3 shadow-lg z-20"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold text-white">AI Ready</span>
        </div>
      </motion.div>

      <motion.div
        className="hidden lg:block absolute -bottom-4 -left-4 glass-dark rounded-xl p-3 shadow-lg z-20"
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold text-white">IRDAI Verified</span>
        </div>
      </motion.div>

      {/* CSS for animated border */}
      <style jsx>{`
        @keyframes rotateBorder {
          from { --border-angle: 0deg; }
          to { --border-angle: 360deg; }
        }
        @property --border-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </div>
  );
}
