'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

// ── Stats data with icons and colors ─────────────────────────────────────────
const stats = [
  { key: 'families', icon: Users, target: 500, color: '#2563EB' },
  { key: 'coverage', icon: Shield, target: 500, color: '#10B981' },
  { key: 'claims', icon: TrendingUp, target: 100, color: '#E8C872' },
  { key: 'experience', icon: Award, target: 15, color: '#8B5CF6' },
];

// ── Animated number hook ──────────────────────────────────────────────────────
function useAnimatedNumber(
  target: number,
  shouldAnimate: boolean,
  duration = 1400,
  decimals = 0,
) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let startTime: number | null = null;
    let frame: number;

    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(Number((eased * target).toFixed(decimals)));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, shouldAnimate, duration, decimals]);

  return shouldAnimate ? current : target;
}

// ── Individual stat component ────────────────────────────────────────────────
function StatItem({
  stat,
  inView,
  index,
  isHindi,
  isEnglish,
}: {
  stat: typeof stats[number];
  inView: boolean;
  index: number;
  isHindi: boolean;
  isEnglish: boolean;
}) {
  const Icon = stat.icon;
  const animated = useAnimatedNumber(stat.target, inView);

  const valueLabels: Record<string, { en: string; hi: string; hg: string }> = {
    families: { en: 'Families Protected', hi: 'परिवार सुरक्षित', hg: 'Families Protected' },
    coverage: { en: 'Coverage Managed', hi: 'कवरेज मैनेज्ड', hg: 'Coverage Managed' },
    claims: { en: 'Claims Settled', hi: 'क्लेम निपटाए', hg: 'Claims Settled' },
    experience: { en: 'Years Experience', hi: 'वर्षों का अनुभव', hg: 'Years Experience' },
  };

  const label = isHindi ? valueLabels[stat.key]?.hi : isEnglish ? valueLabels[stat.key]?.en : valueLabels[stat.key]?.hg;

  const formatValue = () => {
    if (stat.key === 'families') return `${Math.round(animated)}+`;
    if (stat.key === 'coverage') return `₹${Math.round(animated)}Cr+`;
    if (stat.key === 'claims') return `${Math.round(animated)}%`;
    if (stat.key === 'experience') return `${Math.round(animated)}+`;
    return String(Math.round(animated));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center group"
    >
      <div className="inline-flex items-center justify-center mb-4">
        <div
          className="p-4 rounded-2xl transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${stat.color}15` }}
        >
          <Icon className="h-8 w-8" style={{ color: stat.color }} strokeWidth={2} />
        </div>
      </div>
      <div className="text-3xl lg:text-4xl font-bold text-[#0F172A] dark:text-[#F8F6F0] mb-2 font-display">
        {formatValue()}
      </div>
      <div className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">{label}</div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TrustStrip() {
  const [inView, setInView] = useState(false);
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  return (
    <motion.section
      aria-label="Trust indicators"
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => setInView(true)}
      className="py-20 bg-white dark:bg-[#0A1330] border-y border-[#E2E8F0] dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.key}
              stat={stat}
              inView={inView}
              index={index}
              isHindi={isHindi}
              isEnglish={isEnglish}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
