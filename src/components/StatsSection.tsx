'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import { Shield, Users, CheckCircle, MessageCircle, IndianRupee, Building2, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ──────────────────────────────────────────────
   Custom Count-Up Hook using requestAnimationFrame
   ────────────────────────────────────────────── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView) return;
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return { count, ref };
}

/* ──────────────────────────────────────────────
   Stagger Container Variants
   ────────────────────────────────────────────── */
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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/* ──────────────────────────────────────────────
   Stat Data — 6 Premium Fintech Stats
   ────────────────────────────────────────────── */
const statsData = [
  {
    icon: Shield,
    value: 51,
    suffix: '+',
    prefix: '',
    labelKey: 'stats.insurers',
    displayOverride: null as string | null,
  },
  {
    icon: Users,
    value: 500,
    suffix: '+',
    prefix: '',
    labelKey: 'stats.families',
    displayOverride: null as string | null,
  },
  {
    icon: CheckCircle,
    value: 97,
    suffix: '%',
    prefix: '',
    labelKey: 'stats.claimRate',
    displayOverride: null as string | null,
  },
  {
    icon: MessageCircle,
    value: 24,
    suffix: '/7',
    prefix: '',
    labelKey: 'stats.whatsapp',
    displayOverride: null as string | null,
  },
  {
    icon: IndianRupee,
    value: 75,
    suffix: 'K',
    prefix: '₹',
    labelKey: 'stats.taxSavings',
    displayOverride: null as string | null,
  },
  {
    icon: Building2,
    value: 10,
    suffix: 'K+',
    prefix: '',
    labelKey: 'stats.hospitals',
    displayOverride: null as string | null,
  },
];

/* ──────────────────────────────────────────────
   Stat Card Component
   ────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  value,
  suffix,
  prefix,
  labelKey,
  index,
}: {
  icon: React.ElementType;
  value: number;
  suffix: string;
  prefix: string;
  labelKey: string;
  index: number;
}) {
  const { count, ref } = useCountUp(value, 2200);
  const { t } = useLanguage();

  return (
    <motion.div
      className="group relative rounded-2xl p-6 sm:p-7 bg-white/[0.06] dark:bg-white/[0.06] bg-[#F5F4F0] dark:backdrop-blur-sm border border-[#C98A1C]/15 dark:border-[#C98A1C]/15 text-center transition-all duration-300 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] hover:bg-[#FDF0D5] hover:border-[#C98A1C]/25 hover:shadow-lg hover:shadow-[#C98A1C]/5"
      variants={cardVariants}
      custom={index}
    >
      {/* Gold shimmer line at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201, 138, 28, 0.6), transparent)',
        }}
      />

      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 138, 28, 0.15), rgba(10, 19, 48, 0.15))',
            border: '1px solid rgba(201, 138, 28, 0.2)',
          }}
        >
          <Icon className="w-5 h-5 text-[#C98A1C]" aria-hidden="true" />
        </div>
      </div>

      {/* Animated number */}
      <span
        ref={ref}
        className="block text-3xl sm:text-4xl font-extrabold text-[#C98A1C] tabular-nums font-heading leading-tight"
        style={{
          textShadow: '0 0 20px rgba(201, 138, 28, 0.2), 0 0 40px rgba(201, 138, 28, 0.06)',
        }}
      >
        {prefix}
        {count.toLocaleString('en-IN')}
        {suffix}
      </span>

      {/* Label */}
      <span className="block mt-2 text-xs text-white/60 dark:text-white/60 text-[#6B7280] uppercase tracking-wider font-medium">
        {t(labelKey)}
      </span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Main StatsSection Component
   ────────────────────────────────────────────── */
export default function StatsSection() {
  const { t } = useLanguage();
  const { resolvedTheme } = useSafeTheme();
  const isDark = resolvedTheme !== 'light';

  return (
    <section
      dir="ltr"
      className="relative py-20 sm:py-24 lg:py-28 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(165deg, #071B3B 0%, #0A1F3D 40%, #081221 100%)'
          : 'linear-gradient(165deg, #F5F1E6 0%, #FDF0D5 40%, #FEF7E8 100%)',
      }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] hidden light:block"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Radial glow accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-12"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(244, 180, 0, 0.1) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[300px] opacity-8"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] opacity-6"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(244, 180, 0, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.06] dark:bg-white/[0.06] bg-[#FEF7E8] backdrop-blur-sm border border-[#C98A1C]/15 dark:border-[#C98A1C]/15 rounded-full px-4 py-1.5 mb-6">
            <TrendingUp className="w-4 h-4 text-[#C98A1C]" />
            <span className="text-xs sm:text-sm text-white/70 dark:text-white/70 text-[#6B7280] font-medium">{t('stats.badge')}</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white text-[#0A1330] tracking-tight font-heading"
          >
            Paliwal Secure{' '}
            <span
              className="text-[#C98A1C] inline-block"
              style={{
                textShadow: '0 0 30px rgba(201, 138, 28, 0.25), 0 0 60px rgba(201, 138, 28, 0.08)',
              }}
            >
              AI in Numbers
            </span>
          </h2>
          <p className="mt-4 text-white/60 dark:text-white/60 text-[#6B7280] text-base sm:text-lg max-w-xl mx-auto">
            {t('stats.subtitle')}
          </p>
        </motion.div>

        {/* Stats Grid — 2 cols mobile, 3 cols tablet, 6 cols desktop */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {statsData.map((stat, index) => (
            <StatCard
              key={stat.labelKey}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              labelKey={stat.labelKey}
              index={index}
            />
          ))}
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          className="mt-12 sm:mt-14 flex justify-center"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className="h-px w-48 sm:w-64"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(201, 138, 28, 0.4), transparent)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
