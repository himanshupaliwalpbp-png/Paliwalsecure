'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Zap, CheckCircle2, TrendingDown, ArrowRight, Sparkles } from 'lucide-react';

const bestOfferFeatures = [
  'Same ₹10 Lakh Coverage',
  'Additional Roadside Assistance',
  'Free Health Check-up Yearly',
  'Cashless at 12,000+ Hospitals',
];

const currentFeatures = [
  'Basic Coverage Only',
  'No Roadside Assistance',
  'Limited Hospital Network',
  'Standard Processing',
];

// ─── Animated Price Counter ───────────────────────────────────────────────────
function AnimatedPrice({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;
    const duration = 800;
    let startTime: number | null = null;

    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.round(startVal + (endVal - startVal) * easedProgress);
      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = endVal;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <span className="text-4xl sm:text-5xl font-bold tabular-nums text-foreground">
      ₹{displayValue.toLocaleString('en-IN')}
      <span className="text-lg sm:text-xl font-normal opacity-70">/year</span>
    </span>
  );
}

// ─── Savings Badge with Bouncy 3D Pop ────────────────────────────────────────
function SaveBadge() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotateX: -90 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      transition={{
        type: 'spring' as const,
        stiffness: 500,
        damping: 12,
        delay: 0.3,
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: '#00A9A6', transformOrigin: 'center bottom' }}
    >
      <TrendingDown className="w-4 h-4" />
      Save 15%
    </motion.div>
  );
}

// ─── Glowing Border Overlay for Best Offer ────────────────────────────────────
function GlowBorder() {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      style={{ zIndex: 1 }}
      animate={{
        boxShadow: [
          'inset 0 0 0 1px rgba(0,169,166,0.4), 0 0 20px rgba(0,169,166,0.1)',
          'inset 0 0 0 2px rgba(0,169,166,0.7), 0 0 40px rgba(0,169,166,0.3)',
          'inset 0 0 0 1px rgba(0,169,166,0.4), 0 0 20px rgba(0,169,166,0.1)',
        ],
      }}
      transition={{
        duration: 2.5,
        ease: 'easeInOut' as const,
        repeat: Infinity,
        repeatType: 'loop',
      }}
    />
  );
}

// ─── Background Particles ─────────────────────────────────────────────────────
function BackgroundParticles() {
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.05,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#00A9A6',
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, p.id % 2 === 0 ? 15 : -15, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            ease: 'easeInOut' as const,
            repeat: Infinity,
            repeatType: 'loop',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Toggle Label with Animated Transition ────────────────────────────────────
function ToggleLabel({
  children,
  isActive,
  accentColor = false,
}: {
  children: React.ReactNode;
  isActive: boolean;
  accentColor?: boolean;
}) {
  return (
    <motion.span
      animate={{
        scale: isActive ? 1.1 : 0.9,
        opacity: isActive ? 1 : 0.4,
      }}
      transition={{
        type: 'spring' as const,
        stiffness: 400,
        damping: 20,
      }}
      className={`font-medium text-sm cursor-pointer select-none ${
        isActive && accentColor ? 'text-[#00A9A6]' : 'text-foreground'
      }`}
    >
      {children}
    </motion.span>
  );
}

// ─── Current Premium Card (Front Face) ────────────────────────────────────────
function CurrentPremiumCard() {
  return (
    <div className="bg-white/80 border-slate-200/60 shadow-sm backdrop-blur-xl dark:bg-white/10 dark:border-white/20 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-5 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Current Premium</h3>
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30">
          Standard
        </span>
      </div>

      <AnimatedPrice value={7200} />

      <div className="h-px bg-slate-200 dark:bg-white/10" />

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">What you currently pay:</p>
        <ul className="space-y-2">
          {currentFeatures.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.2, duration: 0.35, ease: 'easeOut' as const }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-slate-400" />
              </div>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 pt-2 text-sm text-amber-600 dark:text-amber-400/80">
        <ArrowRight className="w-4 h-4" />
        <span>Toggle to see your savings</span>
      </div>
    </div>
  );
}

// ─── Best Offer Card (Back Face) ──────────────────────────────────────────────
function BestOfferCard() {
  return (
    <div className="relative bg-white/80 border-slate-200/60 shadow-sm backdrop-blur-xl dark:bg-white/10 dark:border-white/20 border rounded-2xl p-6 sm:p-8 space-y-5 overflow-hidden h-full">
      <GlowBorder />

      <div className="relative flex items-center justify-between" style={{ zIndex: 2 }}>
        <h3 className="text-lg font-semibold text-foreground dark:text-white">Our Best Offer</h3>
        <SaveBadge />
      </div>

      <div className="relative" style={{ zIndex: 2 }}>
        <AnimatedPrice value={6120} />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' as const }}
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
        style={{ backgroundColor: 'rgba(0, 169, 166, 0.15)', color: '#00A9A6', zIndex: 2 }}
      >
        <Sparkles className="w-4 h-4" />
        Save ₹1,080/year
      </motion.div>

      <div className="relative h-px bg-slate-200 dark:bg-white/10" style={{ zIndex: 2 }} />

      <div className="relative space-y-3" style={{ zIndex: 2 }}>
        <p className="text-sm text-muted-foreground">Everything included:</p>
        <ul className="space-y-2.5">
          {bestOfferFeatures.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -30, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                type: 'spring' as const,
                stiffness: 300,
                damping: 20,
                delay: 0.12 * i + 0.5,
              }}
              className="flex items-center gap-2.5 text-sm text-foreground"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring' as const,
                  stiffness: 500,
                  damping: 15,
                  delay: 0.12 * i + 0.6,
                }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#00A9A6' }} />
              </motion.div>
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TiltToggleDemo() {
  const [isToggled, setIsToggled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [isFlipping, setIsFlipping] = useState(false);

  const handleToggle = useCallback((checked: boolean) => {
    setIsToggled(checked);
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 800);
  }, []);

  const tiltTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        type: 'spring' as const,
        stiffness: 300,
        damping: 15,
        mass: 0.8,
      };

  const flipTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        type: 'spring' as const,
        stiffness: 180,
        damping: 22,
        mass: 1.2,
      };

  return (
    <section
      id="premium-tools-demo"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#0A2540] dark:via-[#0d2d4f] dark:to-[#0f172a]"
    >
      {/* Background Particles */}
      <BackgroundParticles />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, rgba(0, 169, 166, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 169, 166, 0.2) 0%, transparent 50%)',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:border-white/10 mb-4">
              <Zap className="w-3.5 h-3.5" style={{ color: '#00A9A6' }} />
              Smart Comparison
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-white mt-4"
          >
            Experience Our{' '}
            <span style={{ color: '#00A9A6' }}>Premium Tools</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
          >
            Toggle to see how much you can save with our smart comparison engine
          </motion.p>
        </div>

        {/* Main Content - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center lg:items-end gap-6"
          >
            <div className="flex flex-col items-center gap-6">
              {/* 3D Perspective Container for Toggle */}
              <div style={{ perspective: '600px' }}>
                <motion.div
                  animate={{
                    rotateY: isToggled ? 12 : -12,
                    rotateX: isFlipping ? (isToggled ? -5 : 5) : 0,
                  }}
                  transition={tiltTransition}
                  className="flex flex-col items-center gap-4"
                >
                  <Switch
                    checked={isToggled}
                    onCheckedChange={handleToggle}
                    className="h-8 w-[3.5rem] data-[state=checked]:bg-[#00A9A6] data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600 cursor-pointer shadow-lg data-[state=checked]:shadow-[0_0_20px_rgba(0,169,166,0.5)]"
                  />
                </motion.div>
              </div>

              {/* Toggle Labels with Animated Transitions */}
              <div className="flex items-center gap-4">
                <ToggleLabel isActive={!isToggled}>Current</ToggleLabel>
                <motion.div
                  animate={{ scaleX: isToggled ? 1.5 : 1 }}
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                  className="w-px h-4"
                  style={{ backgroundColor: isToggled ? '#00A9A6' : '#475569' }}
                />
                <ToggleLabel isActive={isToggled} accentColor>
                  Best Offer
                </ToggleLabel>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-slate-50 border-slate-200/60 dark:bg-white/5 dark:border-white/10 backdrop-blur-sm border rounded-xl p-5 max-w-sm w-full">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(0, 169, 166, 0.15)' }}
                >
                  <Zap className="w-5 h-5" style={{ color: '#00A9A6' }} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground dark:text-white">
                    Smart Premium Optimizer
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Our AI-powered engine scans 50+ insurers to find you the same coverage at the best price. Toggle to compare instantly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - 3D Flip Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              animate={{
                rotateY: isToggled ? 180 : 0,
              }}
              transition={flipTransition}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative min-h-[400px]"
            >
              {/* Front Face - Current Premium */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  position: 'absolute',
                  inset: 0,
                }}
              >
                <CurrentPremiumCard />
              </div>

              {/* Back Face - Best Offer (starts rotated 180deg so it shows correctly when flipped) */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  position: 'absolute',
                  inset: 0,
                }}
              >
                <BestOfferCard />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
