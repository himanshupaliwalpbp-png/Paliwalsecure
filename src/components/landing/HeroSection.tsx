'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, useSyncExternalStore, TouchEvent as ReactTouchEvent } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Zap,
  TrendingUp,
  Heart,
  Car,
  Plane,
  Star,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Home,
  Umbrella,
} from 'lucide-react';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import TypewriterText from '@/components/ui/typewriter';
import AnimatedBadge from '@/components/eldoraui/animated-badge';

/* ═══════════════════════════════════════════════════════════════════════════
   Framer Motion Variants
   ═══════════════════════════════════════════════════════════════════════════ */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.95,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    scale: 0.95,
  }),
};

/* ═══════════════════════════════════════════════════════════════════════════
   Insurance Product Data
   ═══════════════════════════════════════════════════════════════════════════ */
interface InsuranceCardData {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  premium: string;
  tag: string;
  tagColor: string;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  href: string;
  aiScore: string;
}

const INSURANCE_CARDS: InsuranceCardData[] = [
  {
    icon: Heart,
    title: 'Health Shield Pro',
    subtitle: 'HDFC Ergo',
    premium: '₹699/yr',
    tag: '98% Claims',
    tagColor: '#22C55E',
    gradientFrom: 'from-emerald-500/20',
    gradientTo: 'to-emerald-600/5',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30',
    href: '/health-insurance',
    aiScore: '9.2',
  },
  {
    icon: Car,
    title: 'Motor Zero-Dep',
    subtitle: 'Bajaj Allianz',
    premium: '₹2,499/yr',
    tag: 'Zero Dep',
    tagColor: '#162D5A',
    gradientFrom: 'from-[#162D5A]/20',
    gradientTo: 'to-[#162D5A]/5',
    iconBg: 'bg-[#162D5A]/15 border-[#162D5A]/30',
    href: '/car-insurance',
    aiScore: '9.0',
  },
  {
    icon: Home,
    title: 'Home Guard Plus',
    subtitle: 'ICICI Lombard',
    premium: '₹1,199/yr',
    tag: 'Full Cover',
    tagColor: '#F97316',
    gradientFrom: 'from-orange-500/20',
    gradientTo: 'to-orange-600/5',
    iconBg: 'bg-orange-500/15 border-orange-500/30',
    href: '/home-insurance',
    aiScore: '8.8',
  },
  {
    icon: Umbrella,
    title: 'Term Shield',
    subtitle: 'Max Life',
    premium: '₹499/yr',
    tag: '₹1Cr Cover',
    tagColor: '#C98A1C',
    gradientFrom: 'from-[#C98A1C]/20',
    gradientTo: 'to-[#E0A830]/5',
    iconBg: 'bg-[#C98A1C]/15 border-[#C98A1C]/30',
    href: '/life-insurance',
    aiScore: '9.4',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Premium Insurance Card — Glassmorphism Design (Mode-Aware)
   ═══════════════════════════════════════════════════════════════════════════ */
function InsuranceCard({ data, index, isDark }: { data: InsuranceCardData; index: number; isDark: boolean }) {
  const Icon = data.icon;
  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
    >
      <Link
        href={data.href}
        className={`block relative overflow-hidden rounded-2xl backdrop-blur-xl p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] ${
          isDark
            ? 'border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] hover:border-white/[0.15] hover:bg-gradient-to-br hover:from-white/[0.1] hover:to-white/[0.04] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
            : 'border border-[#E5E2DB] bg-white hover:border-[#C98A1C]/30 hover:shadow-lg hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* Top glow accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${data.tagColor}40, transparent)`,
          }}
        />

        {/* Background gradient (hover) */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data.gradientFrom} ${data.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

        <div className="relative z-10">
          {/* Row 1: Icon + AI Pick Badge */}
          <div className="flex items-start justify-between mb-3">
            <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl border ${data.iconBg} transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: data.tagColor }} aria-hidden="true" />
            </div>
            <div className="flex flex-col items-end gap-1">
              {/* AI Pick Badge */}
              <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                  : 'bg-amber-50 border border-amber-300/40 shadow-[0_0_8px_rgba(245,158,11,0.08)]'
              }`}>
                <Sparkles className={`w-3 h-3 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} aria-hidden="true" />
                <span className={`text-[10px] sm:text-xs font-bold tracking-wide ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>AI Pick</span>
              </div>
              {/* AI Score */}
              <div className="flex items-center gap-0.5">
                <Star className={`w-2.5 h-2.5 ${isDark ? 'text-amber-400 fill-amber-400' : 'text-amber-600 fill-amber-600'}`} />
                <span className={`text-[10px] font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{data.aiScore}</span>
              </div>
            </div>
          </div>

          {/* Row 2: Title + Provider */}
          <div className="mb-2">
            <h4 className={`text-sm sm:text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>
              {data.title}
            </h4>
            <p className={`text-[11px] sm:text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{data.subtitle}</p>
          </div>

          {/* Row 3: Premium Price */}
          <div className="mb-3">
            <span className="text-xl sm:text-2xl font-extrabold gradient-text-universal">
              {data.premium}
            </span>
          </div>

          {/* Row 4: Tag + Arrow */}
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] sm:text-xs font-semibold rounded-full px-2.5 py-1 border"
              style={{
                background: `${data.tagColor}12`,
                color: data.tagColor,
                borderColor: `${data.tagColor}30`,
              }}
            >
              {data.tag}
            </span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 ${
              isDark
                ? 'bg-white/[0.06] border border-white/[0.1] group-hover:bg-white/[0.12] group-hover:border-white/[0.2]'
                : 'bg-gray-100 border border-gray-200 group-hover:bg-gray-50 group-hover:border-[#C98A1C]/30'
            }`}>
              <ArrowRight className={`w-3.5 h-3.5 ${isDark ? 'text-white/50 group-hover:text-white/80' : 'text-gray-400 group-hover:text-[#0A1330]'}`} aria-hidden="true" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Desktop Insurance Cards — 2x2 Grid (Mode-Aware)
   ═══════════════════════════════════════════════════════════════════════════ */
function DesktopInsuranceCards({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      className="hidden lg:grid grid-cols-2 gap-3 xl:gap-4 w-full max-w-[440px] xl:max-w-[480px]"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {INSURANCE_CARDS.map((data, index) => (
        <InsuranceCard key={data.title} data={data} index={index} isDark={isDark} />
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Mobile Insurance Cards — Swipeable Carousel with dots (Mode-Aware)
   ═══════════════════════════════════════════════════════════════════════════ */
function MobileInsuranceCards({ isDark }: { isDark: boolean }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  const goTo = useCallback((index: number) => {
    const newIndex = ((index % INSURANCE_CARDS.length) + INSURANCE_CARDS.length) % INSURANCE_CARDS.length;
    setDirection(newIndex > current ? 1 : -1);
    setCurrent(newIndex);
  }, [current]);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [goNext]);

  // Touch handlers
  const handleTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: ReactTouchEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const data = INSURANCE_CARDS[current];
  const Icon = data.icon;

  return (
    <div className="lg:hidden w-full">
      {/* Carousel Container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link
              href={data.href}
              className={`block relative overflow-hidden rounded-2xl backdrop-blur-xl p-5 transition-all duration-300 active:scale-[0.98] ${
                isDark
                  ? 'border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02]'
                  : 'border border-[#E5E2DB] bg-white'
              }`}
            >
              {/* Top glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${data.tagColor}40, transparent)` }}
              />

              <div className="relative z-10">
                {/* Icon + AI Pick */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl border ${data.iconBg}`}>
                    <Icon className="w-6 h-6" style={{ color: data.tagColor }} aria-hidden="true" />
                  </div>
                  <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
                    isDark
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-amber-50 border border-amber-300/40 shadow-[0_0_8px_rgba(245,158,11,0.08)]'
                  }`}>
                    <Sparkles className={`w-3 h-3 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className={`text-[10px] font-bold tracking-wide ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>AI Pick</span>
                    <Star className={`w-2.5 h-2.5 ${isDark ? 'text-amber-400 fill-amber-400' : 'text-amber-600 fill-amber-600'} ml-0.5`} />
                    <span className={`text-[10px] font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{data.aiScore}</span>
                  </div>
                </div>

                {/* Title + Provider */}
                <div className="mb-2">
                  <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>{data.title}</h4>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{data.subtitle}</p>
                </div>

                {/* Premium + Tag + Arrow */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-extrabold gradient-text-universal">
                      {data.premium}
                    </span>
                    <span
                      className="text-[10px] font-semibold rounded-full px-2.5 py-1 border"
                      style={{ background: `${data.tagColor}12`, color: data.tagColor, borderColor: `${data.tagColor}30` }}
                    >
                      {data.tag}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark
                      ? 'bg-white/[0.06] border border-white/[0.1]'
                      : 'bg-gray-100 border border-gray-200'
                  }`}>
                    <ArrowRight className={`w-4 h-4 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={goPrev}
          className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center z-20 active:scale-90 transition-transform ${
            isDark
              ? 'bg-black/40 border border-white/10'
              : 'bg-white/70 border border-gray-200 shadow-sm'
          }`}
          aria-label="Previous card"
        >
          <ChevronLeft className={`w-4 h-4 ${isDark ? 'text-white/70' : 'text-gray-600'}`} />
        </button>
        <button
          onClick={goNext}
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center z-20 active:scale-90 transition-transform ${
            isDark
              ? 'bg-black/40 border border-white/10'
              : 'bg-white/70 border border-gray-200 shadow-sm'
          }`}
          aria-label="Next card"
        >
          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-white/70' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {INSURANCE_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 bg-gradient-to-r from-amber-400 to-yellow-400'
                : isDark
                  ? 'w-1.5 bg-white/20 hover:bg-white/30'
                  : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main HeroSection Component — Premium Redesign (Dark/Light Mode-Aware)
   ═══════════════════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const { t } = useLanguage();
  const { resolvedTheme } = useSafeTheme();

  // Hydration-safe mounted check using useSyncExternalStore
  const mounted = useSyncExternalStore(
    () => () => {}, // subscribe (no-op)
    () => true,     // getSnapshot (client)
    () => false     // getServerSnapshot
  );

  const isDark = resolvedTheme !== 'light';

  const handleScrollToCompare = useCallback(() => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('motor-comparison');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Prevent hydration mismatch — render a neutral skeleton until mounted
  if (!mounted) {
    return (
      <section className="relative flex items-center justify-center overflow-hidden min-h-[50vh] sm:min-h-[50vh] lg:min-h-[50vh]" dir="ltr">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 xl:gap-16">
            <div className="w-full flex-1 min-w-0 max-w-2xl lg:max-w-[55%] text-center lg:text-left">
              <div className="h-8 w-48 bg-muted/30 rounded-full mx-auto lg:mx-0 mb-6" />
              <div className="h-16 sm:h-20 lg:h-24 bg-muted/20 rounded-xl mb-4" />
              <div className="h-8 bg-muted/15 rounded-lg mb-8 max-w-md mx-auto lg:mx-0" />
              <div className="flex gap-4 justify-center lg:justify-start mb-8">
                <div className="h-12 w-44 bg-muted/20 rounded-xl" />
                <div className="h-12 w-44 bg-muted/20 rounded-xl" />
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3 w-full max-w-[440px]">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-muted/15 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden min-h-[90vh] sm:min-h-[85vh] lg:min-h-[92vh]"
      dir="ltr"
      style={isDark ? {
        background: 'linear-gradient(170deg, #050B18 0%, #0A1330 40%, #0D1B33 70%, #0A1330 100%)',
      } : {
        background: 'linear-gradient(170deg, #EEF2FF 0%, #FAFAF8 30%, #FFF8E7 70%, #FAFAF8 100%)',
      }}
    >
      {/* ─── Background Decorations ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Gold radial glow — top center */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] lg:w-[1200px] h-[400px] lg:h-[800px] ${isDark ? 'opacity-15 lg:opacity-25' : 'opacity-10 lg:opacity-15'}`}
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,138,28,0.2) 0%, transparent 65%)' }}
        />
        {/* Floating orbs — CSS animation */}
        <div className="hidden lg:block">
          <div
            className="absolute rounded-full animate-float"
            style={{ width: 450, height: 450, background: isDark ? 'rgba(201,138,28,0.06)' : 'rgba(201,138,28,0.04)', filter: 'blur(80px)', left: '-5%', top: '5%' }}
          />
          <div
            className="absolute rounded-full animate-float"
            style={{ width: 350, height: 350, background: isDark ? 'rgba(34,197,94,0.04)' : 'rgba(201,138,28,0.03)', filter: 'blur(60px)', right: '5%', top: '15%', animationDelay: '2s', animationDirection: 'reverse' }}
          />
          <div
            className="absolute rounded-full animate-float"
            style={{ width: 250, height: 250, background: isDark ? 'rgba(59,130,246,0.04)' : 'rgba(139,105,20,0.04)', filter: 'blur(60px)', right: '20%', bottom: '10%', animationDelay: '4s' }}
          />
        </div>
        {/* Subtle grid pattern */}
        <div
          className={`absolute inset-0 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
          style={{
            backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,22,40,0.06)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,22,40,0.06)'} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ─── Content Layout ─── */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 xl:gap-16">
          {/* ─── Left Column: Text + CTAs + Stats ─── */}
          <div className="w-full flex-1 min-w-0 max-w-2xl lg:max-w-[55%] text-center lg:text-left">
            {/* Animated Badge — Eldora UI */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start mb-4 lg:mb-6">
              <AnimatedBadge
                text="India's #1 AI-Powered Insurance Platform"
                color="#C98A1C"
              />
            </motion.div>

            {/* Headline */}
            <div className="relative">
              {/* Animated glow behind headline */}
              <div
                className="absolute inset-0 pointer-events-none animate-pulse"
                style={{
                  background: isDark
                    ? 'radial-gradient(ellipse at center, rgba(201,138,28,0.15) 0%, transparent 60%)'
                    : 'radial-gradient(ellipse at center, rgba(201,138,28,0.06) 0%, transparent 60%)',
                  filter: 'blur(30px)',
                  transform: 'scale(1.2)',
                }}
                aria-hidden="true"
              />
              <motion.h1
                variants={itemVariants}
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.02] tracking-tighter mb-3 lg:mb-5 font-[family-name:var(--font-heading)] relative ${
                  isDark ? 'text-white' : 'text-[#0A1330]'
                }`}
                style={isDark ? {
                  textShadow: '0 0 80px rgba(201,138,28,0.5), 0 0 150px rgba(201,138,28,0.2), 0 4px 40px rgba(0,0,0,0.7)',
                } : {
                  textShadow: '0 2px 15px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <span className="block">{t('landing.hero.headline1')}</span>
                <span className="block mt-1 lg:mt-2 italic">
                  <TypewriterText
                    words={[t('landing.hero.headline2'), 'Smart', 'Affordable', 'Trusted']}
                    className="gradient-text-universal font-black"
                    typingSpeed={100}
                    deleteSpeed={50}
                    pauseDuration={2500}
                  />
                </span>
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl max-w-xl mx-auto lg:mx-0 mb-5 lg:mb-8 leading-snug font-extrabold ${
                isDark ? 'text-white' : 'text-[#0A1330]'
              }`}
            >
              {t('landing.hero.subheadline')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 lg:mb-10 animate-[pulse-glow_2s_ease-in-out_infinite]"
            >
              <div className="w-full sm:w-auto" onClick={handleScrollToCompare}>
                <ShinyButton
                  variant="blue"
                  className="text-sm lg:text-lg py-3 lg:py-4 px-6 lg:px-10 w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
                    {t('landing.hero.cta1')}
                  </span>
                </ShinyButton>
              </div>
              <div className="w-full sm:w-auto" onClick={handleScrollToCompare}>
                <ShinyButton
                  variant="secondary"
                  className="text-sm lg:text-lg py-3 lg:py-4 px-6 lg:px-10 w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
                    {t('landing.hero.cta2')}
                  </span>
                </ShinyButton>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8"
            >
              {[
                { icon: Shield, value: '51+', label: t('landing.hero.stat.insurers') },
                { icon: CheckCircle, value: '98%', label: t('landing.hero.stat.settlement') },
                { icon: Star, value: '500+', label: t('landing.hero.stat.families') },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${isDark ? 'text-gold/60' : 'text-[#C98A1C]/70'}`} aria-hidden="true" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-2xl lg:text-3xl font-black gradient-text-universal">
                      {stat.value}
                    </span>
                    <span className={`text-[11px] sm:text-sm lg:text-base uppercase tracking-wider font-semibold ${
                      isDark ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      {stat.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`hidden sm:block w-px h-6 ml-4 lg:ml-6 ${
                        isDark ? 'bg-white/10' : 'bg-gray-200'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </motion.div>

            {/* Mobile Insurance Cards */}
            <motion.div variants={itemVariants} className="mt-6 lg:hidden">
              <MobileInsuranceCards isDark={isDark} />
            </motion.div>
          </div>

          {/* ─── Right Column: Insurance Cards (Desktop Only) ─── */}
          <motion.div
            className="hidden lg:flex flex-shrink-0 justify-center items-center"
            variants={containerVariants}
          >
            <DesktopInsuranceCards isDark={isDark} />
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Bottom Gradient Fade ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-[2]"
        style={isDark
          ? { background: 'linear-gradient(to top, #0A1330, transparent)' }
          : { background: 'linear-gradient(to top, #FAFAF8, transparent)' }
        }
        aria-hidden="true"
      />
    </section>
  );
}
