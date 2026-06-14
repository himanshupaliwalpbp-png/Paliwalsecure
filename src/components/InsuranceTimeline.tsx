'use client';

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  Target,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import React, { useCallback, useEffect, useRef, useState } from 'react';

/* ─── Types & Data ─────────────────────────────────────────────────── */

interface TimelineStep {
  number: number;
  title: string;
  icon: LucideIcon;
  description: string;
}

const steps: TimelineStep[] = [
  { number: 1, title: 'Select Plan', icon: Target, description: 'Choose from 51+ insurers' },
  { number: 2, title: 'Get Quote', icon: Calculator, description: 'AI-powered instant premium' },
  { number: 3, title: 'Secure Policy', icon: ShieldCheck, description: 'Buy online in 2 minutes' },
  { number: 4, title: 'Easy Claim', icon: CheckCircle2, description: 'Hassle-free settlement' },
];

/* ─── Animation Variants ───────────────────────────────────────────── */
/* All spring variants use exactly 2 keyframes (hidden → visible)      */

const stepEntranceVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
      delay: i * 0.15,
    },
  }),
};

const numberBounceVariants = {
  hidden: { scale: 0, rotateY: -90 },
  visible: (i: number) => ({
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 350,
      damping: 15,
      delay: i * 0.15 + 0.3,
    },
  }),
};

const badgeVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20, delay: 0.1 },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20, delay: 0.2 },
  },
};

/* ─── Sub-components ───────────────────────────────────────────────── */

/** Teal particle that floats upward and fades — 2 keyframes, tween */
function Particle({ delay, xOffset }: { delay: number; xOffset: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, #00D4D0, transparent)',
        left: `calc(50% + ${xOffset}px)`,
        top: '50%',
        boxShadow: '0 0 6px rgba(0,169,166,0.7)',
      }}
      animate={{ y: [0, -45], opacity: [1, 0], scale: [1, 0.15] }}
      transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeOut' as const }}
    />
  );
}

/** Glowing dot that travels along the connector line — 2 keyframes, tween */
function TravelingDot() {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10"
      style={{
        background: '#00D4D0',
        boxShadow:
          '0 0 8px rgba(0,212,208,0.9), 0 0 20px rgba(0,169,166,0.5), 0 0 40px rgba(0,169,166,0.2)',
      }}
      animate={{ left: ['0%', '100%'] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
    />
  );
}

/* ─── StepCard ──────────────────────────────────────────────────────── */

function StepCard({
  step,
  index,
  isLast,
  reducedMotion,
  isActive,
  onSetActive,
}: {
  step: TimelineStep;
  index: number;
  isLast: boolean;
  reducedMotion: boolean;
  isActive: boolean;
  onSetActive: (index: number) => void;
}) {
  const Icon = step.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useSafeTheme();
  const isDark = resolvedTheme !== 'light';

  /* ── Mouse-tracking 3D tilt ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [reducedMotion, mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  /* ── Particle positions ── */
  const particleConfigs = [
    { delay: 0, xOffset: -20 },
    { delay: 0.3, xOffset: 20 },
    { delay: 0.6, xOffset: -10 },
    { delay: 0.9, xOffset: 10 },
    { delay: 0.15, xOffset: -28 },
    { delay: 0.45, xOffset: 28 },
    { delay: 0.75, xOffset: 0 },
    { delay: 1.1, xOffset: -15 },
  ];

  return (
    <div className="relative flex flex-col items-center flex-shrink-0 snap-center min-w-[230px] sm:min-w-0 sm:flex-1">
      {/* ── Desktop connector line + traveling dot ── */}
      {!isLast && (
        <div className="absolute top-[28px] left-1/2 w-full h-[3px] z-0 hidden sm:block overflow-visible">
          <motion.div
            className="h-full w-full origin-left rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(0,169,166,0.45), rgba(0,169,166,0.06))',
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' as const }}
          />
          {!reducedMotion && <TravelingDot />}
        </div>
      )}

      {/* ── Mobile connector line ── */}
      {!isLast && (
        <div className="absolute top-[28px] left-1/2 w-full h-[3px] z-0 sm:hidden">
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(0,169,166,0.35), rgba(0,169,166,0.06))',
            }}
          />
        </div>
      )}

      {/* ── Entrance animation wrapper (spring, 2 keyframes) ── */}
      <motion.div
        className="flex flex-col items-center"
        style={{ perspective: '500px' }}
        variants={reducedMotion ? undefined : stepEntranceVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={index}
      >
        {/* ── Floating wrapper (tween, 3 keyframes — rule compliant) ── */}
        <motion.div
          className="flex flex-col items-center"
          style={{ transformStyle: 'preserve-3d' }}
          {...(!reducedMotion
            ? {
                animate: { y: [0, -8, 0] },
                transition: {
                  y: {
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                  },
                },
              }
            : {})}
        >
          {/* ── Step number with 3D pop (spring, 2 keyframes) ── */}
          <motion.div
            className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-5 text-white font-bold text-base"
            style={{
              background: isActive
                ? 'linear-gradient(135deg, #00E0DC, #00A9A6, #008C89)'
                : 'linear-gradient(135deg, #00A9A6, #008C89)',
              boxShadow: isActive
                ? '0 4px 30px rgba(0,169,166,0.65), 0 0 60px rgba(0,169,166,0.2)'
                : '0 4px 20px rgba(0,169,166,0.4)',
              transformStyle: 'preserve-3d',
            }}
            variants={reducedMotion ? undefined : numberBounceVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          >
            {step.number}

            {/* Particles around active step */}
            {isActive && !reducedMotion && (
              <div className="absolute inset-0 pointer-events-none">
                {particleConfigs.map((p, i) => (
                  <Particle key={i} delay={p.delay} xOffset={p.xOffset} />
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Glassmorphic card with 3D tilt ── */}
          <motion.div
            ref={cardRef}
            className={`relative z-10 w-full max-w-[235px] px-5 py-7 rounded-2xl text-center cursor-pointer border-solid border-[1.5px] ${
              isActive
                ? 'bg-white/90 border-teal-500/40 dark:bg-white/[0.09] dark:border-teal-500/40'
                : 'bg-white/80 border-slate-200/60 dark:bg-white/[0.04] dark:border-white/[0.08]'
            }`}
            style={{
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              transformStyle: 'preserve-3d',
              boxShadow: isActive
                ? `0 16px 48px rgba(0,169,166,0.12),
                   inset 0 1px 0 rgba(255,255,255,0.14),
                   0 0 0 1px rgba(0,169,166,0.06),
                   0 0 80px -20px rgba(0,169,166,0.15)`
                : isDark
                  ? `0 16px 48px rgba(0,0,0,0.3),
                     inset 0 1px 0 rgba(255,255,255,0.06)`
                  : `0 4px 16px rgba(0,0,0,0.08),
                     inset 0 1px 0 rgba(255,255,255,0.8)`,
              rotateX: reducedMotion ? 0 : rotateX,
              rotateY: reducedMotion ? 0 : rotateY,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onSetActive(index)}
          >
            {/* Top edge glow */}
            <div
              className="absolute top-0 left-[8%] right-[8%] h-px rounded-full"
              style={{
                background: isActive
                  ? 'linear-gradient(90deg, transparent, rgba(0,212,208,0.7), transparent)'
                  : isDark
                    ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(148,163,184,0.15), transparent)',
              }}
            />

            {/* Bottom edge glow (active only) */}
            {isActive && (
              <div
                className="absolute bottom-0 left-[15%] right-[15%] h-px rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(0,169,166,0.35), transparent)',
                }}
              />
            )}

            {/* Side accent glows (active only) */}
            {isActive && (
              <>
                <div
                  className="absolute top-[20%] bottom-[20%] left-0 w-px"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent, rgba(0,169,166,0.25), transparent)',
                  }}
                />
                <div
                  className="absolute top-[20%] bottom-[20%] right-0 w-px"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent, rgba(0,169,166,0.25), transparent)',
                  }}
                />
              </>
            )}

            {/* Icon with pulsing glow — 2 keyframes, tween */}
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 relative"
              style={{
                background: 'linear-gradient(135deg, #00D4D0, #00A9A6, #008C89)',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(24px)',
              }}
              animate={
                !reducedMotion
                  ? {
                      boxShadow: [
                        '0 6px 24px rgba(0,169,166,0.3), 0 0 0 0 rgba(0,169,166,0)',
                        '0 8px 36px rgba(0,169,166,0.6), 0 0 24px 6px rgba(0,169,166,0.12)',
                      ],
                    }
                  : undefined
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut' as const,
              }}
            >
              <Icon className="w-6 h-6 text-white relative z-10" strokeWidth={2} />
            </motion.div>

            <h3
              className="text-slate-800 dark:text-white font-semibold text-base mb-1.5 tracking-wide"
              style={{ transform: 'translateZ(16px)' }}
            >
              {step.title}
            </h3>
            <p
              className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed"
              style={{ transform: 'translateZ(8px)' }}
            >
              {step.description}
            </p>

            {/* Active step bottom indicator bar */}
            {isActive && (
              <motion.div
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 rounded-full"
                style={{
                  width: '40px',
                  background: 'linear-gradient(90deg, #00D4D0, #00A9A6)',
                  boxShadow: '0 0 12px rgba(0,169,166,0.5)',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
              />
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */

export default function InsuranceTimeline() {
  const reducedMotion = useReducedMotion() ?? false;
  const [activeStep, setActiveStep] = useState(0);
  const mountedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollSnapIndex, setScrollSnapIndex] = useState(0);
  const { resolvedTheme } = useSafeTheme();
  const isDark = resolvedTheme !== 'light';

  /* Auto-advance steps for demo */
  useEffect(() => {
    if (reducedMotion) return;
    mountedRef.current = true;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [reducedMotion]);

  /* Track mobile scroll for pagination dots */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const progress = el.scrollLeft / maxScroll;
      setScrollSnapIndex(
        Math.min(steps.length - 1, Math.round(progress * (steps.length - 1))),
      );
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStep = useCallback((index: number) => {
    setActiveStep(index);
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / steps.length;
      scrollRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <section
      id="insurance-timeline"
      className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#0A2540] dark:via-[#0d1f33] dark:to-[#0f172a]"
    >
      {/* ── Background decorative orbs ── */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00A9A6, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05] dark:opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00A9A6, transparent 70%)' }}
      />

      {/* ── Animated grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,169,166,0.4) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,169,166,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Floating ambient orbs ── */}
      {!reducedMotion && (
        <>
          <motion.div
            className="absolute w-72 h-72 rounded-full pointer-events-none"
            style={{
              top: '10%',
              right: '-5%',
              background:
                'radial-gradient(circle, rgba(0,169,166,0.06), transparent 70%)',
            }}
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
          />
          <motion.div
            className="absolute w-56 h-56 rounded-full pointer-events-none"
            style={{
              bottom: '15%',
              left: '-3%',
              background:
                'radial-gradient(circle, rgba(0,169,166,0.04), transparent 70%)',
            }}
            animate={{ y: [0, 25, 0], x: [0, -10, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut' as const,
              delay: 1,
            }}
          />
        </>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Badge ── */}
        <motion.div
          className="flex justify-center mb-5"
          variants={reducedMotion ? undefined : badgeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-[#00A9A6] bg-[#00A9A6]/10 border border-[#00A9A6]/25 shadow-[0_0_24px_rgba(0,169,166,0.08)]">
            ✨ Simple Process
          </span>
        </motion.div>

        {/* ── Title & Subtitle ── */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          variants={reducedMotion ? undefined : titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            How It <span className="text-[#00A9A6]">Works</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-md mx-auto">
            4 simple steps to secure your future
          </p>
        </motion.div>

        {/* ── Progress Indicator ── */}
        <div className="max-w-sm mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              Progress
            </span>
            <span className="text-[#00A9A6] text-xs font-bold">
              Step {activeStep + 1} of {steps.length}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00D4D0, #00A9A6, #008C89)',
                boxShadow: '0 0 14px rgba(0,169,166,0.4)',
              }}
              animate={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            />
          </div>
          {/* Step marker dots */}
          <div className="flex justify-between mt-2.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center"
                style={{ width: `${100 / steps.length}%` }}
              >
                <motion.div
                  className="rounded-full"
                  animate={{
                    background: i <= activeStep ? '#00A9A6' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
                    boxShadow:
                      i <= activeStep
                        ? '0 0 10px rgba(0,169,166,0.5)'
                        : '0 0 0px rgba(0,169,166,0)',
                    scale: i === activeStep ? 1.4 : 1,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' as const }}
                  style={{ width: 8, height: 8 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Timeline with 3D perspective ── */}
        <div className="relative" style={{ perspective: '900px' }}>
          <div
            ref={scrollRef}
            className="flex gap-8 sm:gap-5 items-start justify-center overflow-x-auto pb-8 sm:pb-0 px-4 sm:px-0 timeline-scroll"
            style={{
              transform: reducedMotion ? 'none' : 'rotateX(2deg)',
              transformStyle: 'preserve-3d',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                index={index}
                isLast={index === steps.length - 1}
                reducedMotion={reducedMotion}
                isActive={activeStep === index}
                onSetActive={setActiveStep}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile pagination dots ── */}
        <div className="flex justify-center gap-3 mt-6 sm:hidden">
          {steps.map((_, i) => (
            <button
              key={i}
              className={`rounded-full transition-all duration-300 h-2 ${
                i === scrollSnapIndex
                  ? 'w-7 bg-[#00A9A6] shadow-[0_0_12px_rgba(0,169,166,0.5)]'
                  : 'w-2 bg-slate-300 dark:bg-white/15'
              }`}
              onClick={() => scrollToStep(i)}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Step labels below (mobile) ── */}
        <div className="mt-3 sm:hidden text-center">
          <motion.span
            className="text-[#00A9A6] text-sm font-semibold"
            key={scrollSnapIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
          >
            {steps[scrollSnapIndex]?.title}
          </motion.span>
        </div>
      </div>

      {/* Hide WebKit scrollbar */}
      <style jsx global>{`
        .timeline-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
