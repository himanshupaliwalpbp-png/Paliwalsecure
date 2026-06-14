'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Users, Award } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useThemeAware } from '@/lib/use-theme-aware';

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
      // Cubic ease-out
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
   Stat Item Component — Animated Counter with Icon
   ═══════════════════════════════════════════════════════════════════════════ */
function StatItem({
  value,
  suffix,
  label,
  icon: Icon,
  duration,
  isDark,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  duration?: number;
  isDark: boolean;
}) {
  const { count, ref } = useCountUp(value, duration || 2200);

  return (
    <motion.div
      className="flex flex-col items-center gap-3 px-6 sm:px-8 lg:px-10"
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mb-1" style={{ background: isDark ? 'rgba(201,138,28,0.1)' : 'rgba(201,138,28,0.12)' }}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: isDark ? '#C98A1C' : '#A67C1A' }} aria-hidden="true" />
      </div>
      <div className="flex items-baseline gap-0.5">
        <span
          ref={ref}
          className="stat-number text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-[5.5rem] font-extrabold gradient-text-universal tabular-nums leading-none"
          data-mono
        >
          {count}
        </span>
        <span className="stat-number text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-[5.5rem] font-extrabold gradient-text-universal tabular-nums leading-none" data-mono>
          {suffix}
        </span>
      </div>
      <span className={`text-[10px] sm:text-xs lg:text-xl font-medium tracking-[0.15em] uppercase text-center ${isDark ? 'text-white/90' : 'text-[#0A1330]/80'}`}>
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main StatsSection Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function StatsSection() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();

  return (
    <section
      className={`relative py-16 sm:py-20 lg:py-24 overflow-hidden ${isDark ? 'bg-[#050B18]' : 'bg-[#FAFAF8]'}`}
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #050B18 0%, #0A1330 50%, #0F1D30 100%)'
          : 'linear-gradient(180deg, #FAFAF8 0%, #F0F4FF 50%, #FAFAF8 100%)',
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 50%, rgba(201,138,28,0.06) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(201,138,28,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-0">
          {/* Stat 1: 51+ Partner Insurers */}
          <StatItem
            value={51}
            suffix="+"
            label={t('landing.stats.insurers')}
            icon={Shield}
            duration={2000}
            isDark={isDark}
          />

          {/* Divider */}
          <div className="hidden sm:block w-px h-20 lg:h-24" style={{ background: isDark ? 'rgba(201,138,28,0.2)' : 'rgba(201,138,28,0.25)' }} aria-hidden="true" />

          {/* Stat 2: 500+ Happy Families */}
          <StatItem
            value={500}
            suffix="+"
            label={t('landing.stats.families')}
            icon={Users}
            duration={2500}
            isDark={isDark}
          />

          {/* Divider */}
          <div className="hidden sm:block w-px h-20 lg:h-24" style={{ background: isDark ? 'rgba(201,138,28,0.2)' : 'rgba(201,138,28,0.25)' }} aria-hidden="true" />

          {/* Stat 3: 98% Settlement Ratio */}
          <StatItem
            value={98}
            suffix="%"
            label={t('landing.stats.settlement')}
            icon={Award}
            duration={2200}
            isDark={isDark}
          />
        </div>
      </div>
    </section>
  );
}
