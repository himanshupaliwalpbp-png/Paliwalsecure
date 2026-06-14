'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Shield, ArrowRight, Star, Sparkles, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ═══════════════════════════════════════════════════════════════════════════
   Animated Counter Hook — Counts up when in view
   ═══════════════════════════════════════════════════════════════════════════ */
function useCountUp(target: number, duration = 2200, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startOnView || !isInView) return;
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, startOnView, target, duration]);

  return { count, ref };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Framer Motion Variants — Premium Stagger System
   ═══════════════════════════════════════════════════════════════════════════ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const fadeInScaleVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardFloatVariants = {
  hidden: { opacity: 0, y: 60, rotateY: -12, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.5,
    },
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   Floating Orb — Animated Gold & Navy Blobs
   ═══════════════════════════════════════════════════════════════════════════ */
function FloatingOrb({
  color,
  size,
  x,
  y,
  delay,
  duration,
}: {
  color: string;
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        filter: 'blur(90px)',
        left: x,
        top: y,
      }}
      animate={{
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 20, 0],
        scale: [1, 1.08, 0.95, 1.04, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Stat Item — Animated Counter with Icon
   ═══════════════════════════════════════════════════════════════════════════ */
function StatItem({
  value,
  suffix,
  label,
  icon,
  isDecimal,
  decimalValue,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  isDecimal?: boolean;
  decimalValue?: string;
}) {
  const { count, ref } = useCountUp(value, 2200);

  return (
    <motion.div
      className="flex flex-col items-center gap-2 px-4 sm:px-6"
      variants={fadeInScaleVariants}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span
          ref={ref}
          className="stat-number text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold gradient-text-hero tabular-nums"
          data-mono
        >
          {isDecimal ? decimalValue : count}
          {suffix}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs lg:text-base dark:text-white/50 text-slate-500 font-medium tracking-widest uppercase">
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Noise Texture Overlay
   ═══════════════════════════════════════════════════════════════════════════ */
function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1] opacity-[0.025]"
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Floating Policy Card — Desktop Right Side
   Glassmorphism insurance policy card with animated elements
   ═══════════════════════════════════════════════════════════════════════════ */
function FloatingPolicyCard() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="hidden lg:block relative"
      variants={cardFloatVariants}
    >
      <motion.div
        className="relative w-[340px] xl:w-[420px]"
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Main Card */}
        <div className="glass-card p-6 relative overflow-hidden">
          {/* Gold accent line top */}
          <div
            className="absolute top-0 left-6 right-6 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(201,138,28,0.6), rgba(126,211,230,0.3), transparent)',
            }}
          />

          {/* AI Recommended Badge */}
          <div className="flex items-center justify-between mb-5">
            <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/25 rounded-full px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 dark:text-gold-400 text-amber-600" aria-hidden="true" />
              <span className="text-[11px] font-semibold dark:text-gold-400 text-amber-700">{t('hero.v2.card.aiTag')}</span>
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-gold text-gold" aria-hidden="true" />
              ))}
            </div>
          </div>

          {/* Plan Title */}
          <h3 className="text-lg xl:text-xl font-bold dark:text-white text-slate-900 mb-1 font-[family-name:var(--font-heading)]">
            {t('hero.v2.card.title')}
          </h3>
          <p className="text-sm xl:text-base dark:text-white/50 text-slate-500 mb-5">{t('hero.v2.card.provider')}</p>

          {/* Plan Details */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between py-2 border-b dark:border-white/[0.06] border-sky-200/30">
              <span className="text-xs dark:text-white/45 text-slate-500 uppercase tracking-wider">{t('hero.v2.card.sumInsured')}</span>
              <span className="text-sm font-bold dark:text-white text-slate-900 stat-number" data-mono>₹10,00,000</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b dark:border-white/[0.06] border-sky-200/30">
              <span className="text-xs dark:text-white/45 text-slate-500 uppercase tracking-wider">{t('hero.v2.card.premium')}</span>
              <span className="text-sm font-bold gradient-text stat-number" data-mono>₹699{t('hero.v2.card.perYear')}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs dark:text-white/45 text-slate-500 uppercase tracking-wider">{t('hero.v2.card.csr')}</span>
              <span className="text-sm font-bold dark:text-emerald-400 text-emerald-600 stat-number" data-mono>98.5%</span>
            </div>
          </div>

          {/* Coverage Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {['Cashless', 'No Waiting Period', 'Day 1 Cover', '₹5L+ Savings'].map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium dark:text-gold-300/80 text-amber-700 bg-gold/[0.08] border border-gold/15 rounded-full px-2.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Mini CTA */}
          <Link
            href="/compare"
            className="ps-btn-primary w-full text-center text-sm"
          >
            {t('hero.v2.cta.getQuote')}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Shadow glow beneath card */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(ellipse, rgba(201,138,28,0.30), rgba(126,211,230,0.10), transparent)',
            filter: 'blur(12px)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main HeroSection Component — Design Bible v2.0
   Navy #0A1330 × Gold #C98A1C Premium Fintech Design
   ═══════════════════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const handleInsureGPT = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-insuregpt'));
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden min-h-[92vh] sm:min-h-[88vh] lg:min-h-[80vh] hero-gradient"
      dir="ltr"
    >
      {/* ─── Noise Texture ─── */}
      <NoiseOverlay />

      {/* ─── Animated Floating Orbs — Golden Honey Amber + Arctic Glacier Cyan ─── */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <FloatingOrb color="rgba(201,138,28,0.10)" size={480} x="0%" y="2%" delay={0} duration={14} />
        <FloatingOrb color="rgba(126,211,230,0.08)" size={400} x="65%" y="0%" delay={2} duration={16} />
        <FloatingOrb color="rgba(201,138,28,0.06)" size={320} x="75%" y="50%" delay={4} duration={12} />
        <FloatingOrb color="rgba(126,211,230,0.06)" size={360} x="5%" y="55%" delay={2.5} duration={18} />
        <FloatingOrb color="rgba(201,138,28,0.04)" size={220} x="40%" y="70%" delay={5.5} duration={11} />
        <FloatingOrb color="rgba(126,211,230,0.05)" size={280} x="85%" y="25%" delay={3} duration={13} />
      </div>

      {/* ─── Section Glow — Radial Gold + Cyan ─── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(201,138,28,0.18) 0%, rgba(126,211,230,0.06) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[700px] h-[450px] opacity-12"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(26,48,96,0.2) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ─── Content Layout: Two-Column Desktop, Single Column Mobile ─── */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-8 xl:py-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-8 xl:gap-12">
          {/* ─── Left Column: Text + CTAs + Stats ─── */}
          <div className="w-full flex-1 min-w-0 max-w-2xl lg:max-w-none xl:max-w-3xl text-center lg:text-left">

            {/* ─── Badge ─── */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start mb-4 lg:mb-5">
              <div className="badge-shimmer inline-flex items-center gap-2 dark:bg-white/[0.06] bg-sky-100/50 backdrop-blur-md border border-gold/25 rounded-full px-5 py-2.5 text-sm lg:text-base font-medium dark:text-white/90 text-slate-800 shadow-lg dark:shadow-black/10 shadow-sky-200/10">
                <Shield className="w-4 h-4 text-gold" aria-hidden="true" />
                <span className="whitespace-nowrap">{t('hero.v2.badge')}</span>
              </div>
            </motion.div>

            {/* ─── Main Headline — Playfair Display ─── */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] font-extrabold leading-[1.1] tracking-tight mb-4 lg:mb-5 font-[family-name:var(--font-heading)]"
            >
              <span className="block dark:text-white text-slate-900">{t('hero.v2.headlinePrefix')}</span>
              <span className="block mt-1 lg:mt-2 gradient-text italic">
                {t('hero.v2.headlineGold')}
              </span>
            </motion.h1>

            {/* ─── Subheadline — DM Sans ─── */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl dark:text-white/65 text-slate-700 max-w-xl mx-auto lg:mx-0 mb-5 lg:mb-6 leading-relaxed font-[family-name:var(--font-sans)]"
            >
              {t('hero.v2.subheadline')}
            </motion.p>

            {/* ─── CTA Buttons ─── */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 lg:mb-8"
            >
              {/* Primary CTA: Gold gradient */}
              <Link
                href="/compare"
                className="ps-btn-primary btn-ripple animate-pulse-gold text-base lg:text-lg py-3.5 lg:py-4 px-8 lg:px-10 w-full sm:w-auto justify-center"
                onClick={handleInsureGPT}
              >
                <Zap className="w-4 h-4" aria-hidden="true" />
                {t('hero.v2.cta.getQuote')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              {/* Secondary CTA: Outline gold */}
              <Link
                href="/compare"
                className="ps-btn-secondary text-base lg:text-lg py-3.5 lg:py-4 px-8 lg:px-10 w-full sm:w-auto justify-center"
              >
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                {t('hero.v2.cta.comparePlans')}
              </Link>
            </motion.div>

            {/* ─── Trust Stats Row ─── */}
            <motion.div
              variants={itemVariants}
              className="mb-5 lg:mb-6"
            >
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-0">
                <StatItem
                  value={51}
                  suffix="+"
                  label={t('hero.v2.stat.insurers')}
                  icon={<Shield className="w-4 h-4 text-gold/70" aria-hidden="true" />}
                />
                <div className="hidden sm:block w-px h-10 dark:bg-white/10 bg-sky-200/50" aria-hidden="true" />
                <StatItem
                  value={500}
                  suffix="+"
                  label={t('hero.v2.stat.families')}
                  icon={<CheckCircle className="w-4 h-4 text-gold/70" aria-hidden="true" />}
                />
                <div className="hidden sm:block w-px h-10 dark:bg-white/10 bg-sky-200/50" aria-hidden="true" />
                <StatItem
                  value={98}
                  suffix="%"
                  label={t('hero.v2.stat.claims')}
                  icon={<Star className="w-4 h-4 text-gold/70" aria-hidden="true" />}
                />
                <div className="hidden sm:block w-px h-10 dark:bg-white/10 bg-sky-200/50" aria-hidden="true" />
                <StatItem
                  value={0}
                  suffix=""
                  label={t('hero.v2.stat.rating')}
                  icon={<Star className="w-4 h-4 text-gold/70" aria-hidden="true" />}
                  isDecimal
                  decimalValue="4.9★"
                />
              </div>
            </motion.div>

            {/* ─── Social Proof Line ─── */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-2.5"
            >
              {/* Mini avatar stack */}
              <div className="flex -space-x-2" aria-hidden="true">
                {[
                  'bg-gradient-to-br from-gold to-gold-400',
                  'bg-gradient-to-br from-navy-600 to-navy-500',
                  'bg-gradient-to-br from-gold-400 to-gold-300',
                  'bg-gradient-to-br from-navy-500 to-navy-600',
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full ${bg} border-2 dark:border-navy-800 border-sky-200 flex items-center justify-center`}
                  >
                    <span className="text-[7px] font-bold dark:text-white/90 text-slate-900">
                      {['R', 'P', 'S', 'K'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs dark:text-white/45 text-slate-500 leading-snug">
                {t('hero.socialProof.trustedBy')} <strong className="text-gold font-semibold">{t('hero.socialProof.families')}</strong> {t('hero.socialProof.across')}{' '}
                <span className="dark:text-white/60 text-slate-600">{t('hero.socialProof.cities')}</span>
              </p>
            </motion.div>
          </div>

          {/* ─── Right Column: Floating Policy Card (Desktop Only) ─── */}
          <FloatingPolicyCard />
        </div>
      </motion.div>

      {/* ─── Bottom Gradient Fade ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(to top, var(--background), transparent)',
        }}
        aria-hidden="true"
      />
    </section>
  );
}
