'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useSyncExternalStore, useState, useEffect } from 'react';
import { Users, TrendingUp, Shield } from 'lucide-react';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

type CharDef =
  | { type: 'digit'; value: number }
  | { type: 'static'; value: string };

interface StatConfig {
  chars: CharDef[];
  suffix: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const STATS: StatConfig[] = [
  {
    chars: [
      { type: 'digit', value: 6 },
      { type: 'digit', value: 8 },
      { type: 'digit', value: 8 },
    ],
    suffix: 'M+',
    label: 'Uninsured Indians',
    icon: Users,
    description: 'Lack health insurance coverage',
  },
  {
    chars: [
      { type: 'digit', value: 3 },
      { type: 'static', value: '.' },
      { type: 'digit', value: 7 },
    ],
    suffix: '%',
    label: 'Insurance Penetration',
    icon: TrendingUp,
    description: 'Of GDP in India',
  },
  {
    chars: [
      { type: 'digit', value: 8 },
      { type: 'digit', value: 7 },
    ],
    suffix: '%',
    label: 'Claim Settlement Rate',
    icon: Shield,
    description: 'Across major insurers',
  },
];

// ──────────────────────────────────────────────
// Animated Grid Background
// ──────────────────────────────────────────────

function AnimatedGridBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,169,166,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,169,166,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          opacity: 0.04,
        }}
        animate={{ x: [0, 24], y: [0, 24] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear' as const,
        }}
      />
      {/* Radial vignette — light mode */}
      <div
        className="absolute inset-0 block dark:hidden"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(100,116,139,0.12) 100%)',
        }}
      />
      {/* Radial vignette — dark mode */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(10,37,64,0.6) 100%)',
        }}
      />
    </div>
  );
}

// ──────────────────────────────────────────────
// FlipDigit — Reliable split-flap odometer
// ──────────────────────────────────────────────

function FlipDigit({
  target,
  delay,
  shouldAnimate,
}: {
  target: number;
  delay: number;
  shouldAnimate: boolean;
}) {
  const [showGlow, setShowGlow] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);

  // Animate digit counting up to target
  useEffect(() => {
    if (!shouldAnimate) return;

    // Quick spin through digits before landing on target
    const spinDuration = 800 + delay * 300; // ms
    const spinSteps = 8 + Math.floor(delay * 4);
    const stepTime = spinDuration / spinSteps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step >= spinSteps) {
        clearInterval(interval);
        setCurrentValue(target);
        setShowGlow(true);
        setTimeout(() => setShowGlow(false), 700);
      } else {
        setCurrentValue(step % 10);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [shouldAnimate, target, delay]);

  return (
    <span
      className="inline-flex items-center justify-center relative"
      style={{ minWidth: '0.65em' }}
    >
      {/* The displayed digit */}
      <motion.span
        className="inline-block text-inherit"
        key={currentValue}
        initial={{ y: -8, opacity: 0.3 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' as const }}
      >
        {currentValue}
      </motion.span>

      {/* Glow pulse on settle */}
      {showGlow && (
        <motion.span
          className="absolute inset-0 rounded pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.7, ease: 'easeOut' as const }}
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,169,166,0.5), transparent 70%)',
          }}
        />
      )}
    </span>
  );
}

// ──────────────────────────────────────────────
// StatCard — Glass card with all enhancements
// ──────────────────────────────────────────────

function StatCard({
  stat,
  isInView,
  reducedMotion,
  index,
}: {
  stat: StatConfig;
  isInView: boolean;
  reducedMotion: boolean;
  index: number;
}) {
  const Icon = stat.icon;

  return (
    <motion.div
      /* Entrance: fly in from below */
      initial={{ opacity: 0, y: 60 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 60 }
      }
      transition={{
        type: 'spring' as const,
        stiffness: 70,
        damping: 20,
        delay: index * 0.18,
      }}
      /* Hover lift with teal glow */
      whileHover={{
        y: -8,
        boxShadow:
          '0 14px 44px rgba(0,169,166,0.3), 0 0 24px rgba(0,169,166,0.12)',
      }}
      className="relative bg-white/90 border-slate-200/60 shadow-md backdrop-blur-xl dark:bg-white/10 dark:border-white/20 dark:shadow-none border rounded-2xl p-6 sm:p-8 min-h-[170px] sm:min-h-[190px] flex flex-col items-center justify-center gap-3 sm:gap-4 overflow-hidden cursor-default group"
    >
      {/* Animated grid background */}
      <AnimatedGridBackground />

      {/* Top edge shine */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(0,169,166,0.4) 50%, transparent 90%)',
        }}
      />

      {/* Icon with glow ring */}
      <div className="relative z-10">
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:border-[#00A9A6]/60"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,169,166,0.2), rgba(0,169,166,0.05))',
            border: '1px solid rgba(0,169,166,0.3)',
            boxShadow: '0 0 12px rgba(0,169,166,0.1)',
          }}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#00A9A6]" />
        </div>
      </div>

      {/* Animated number with strong contrast */}
      <div
        className="relative z-10 flex items-center text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-[#00A9A6] leading-none"
        style={{
          textShadow:
            '0 0 20px rgba(0,169,166,0.6), 0 0 40px rgba(0,169,166,0.3), 0 0 80px rgba(0,169,166,0.15)',
          color: '#00A9A6',
        }}
        aria-label={`${stat.chars.map((c) => (c.type === 'digit' ? c.value : c.value)).join('')}${stat.suffix}`}
      >
        {reducedMotion ? (
          <span>
            {stat.chars.map((c, i) => (
              <span key={i}>{c.type === 'digit' ? c.value : c.value}</span>
            ))}
            {stat.suffix}
          </span>
        ) : (
          <>
            {stat.chars.map((char, i) =>
              char.type === 'digit' ? (
                <FlipDigit
                  key={i}
                  target={char.value}
                  delay={i * 0.12}
                  shouldAnimate={isInView}
                />
              ) : (
                <span key={i} className="inline-block mx-[0.03em]">
                  {char.value}
                </span>
              ),
            )}
            <span className="inline-block ml-[0.06em] text-[0.55em] self-end mb-[0.18em] font-bold tracking-wide">
              {stat.suffix}
            </span>
          </>
        )}
      </div>

      {/* Label + description */}
      <div className="relative z-10 text-center">
        <p className="text-slate-800 dark:text-white text-sm sm:text-base font-semibold leading-snug">
          {stat.label}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{stat.description}</p>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Reduced-motion hook
// ──────────────────────────────────────────────

function usePrefersReducedMotion() {
  const subscribe = (callback: () => void) => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
  };
  const getSnapshot = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

export default function StatsFlipCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      className="w-full py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#0A2540] dark:via-[#0d2f52] dark:to-[#0A2540]"
      aria-label="Key Insurance Statistics"
    >
      {/* Perspective container for 3D tilt */}
      <div className="max-w-5xl mx-auto" style={{ perspective: '1200px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              stat={stat}
              isInView={isInView}
              reducedMotion={reducedMotion}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
