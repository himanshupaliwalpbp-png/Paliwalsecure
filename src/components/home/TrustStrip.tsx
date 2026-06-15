'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Shield, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

// ── Stats data with icons and colors ─────────────────────────────────────────
const stats = [
  { key: 'families', icon: Users, target: 500, color: '#2563EB', accentClass: '' },
  { key: 'coverage', icon: Shield, target: 500, color: '#10B981', accentClass: 'stat-premium-block-green' },
  { key: 'claims', icon: TrendingUp, target: 100, color: '#E8C872', accentClass: 'stat-premium-block-gold' },
  { key: 'experience', icon: Award, target: 15, color: '#8B5CF6', accentClass: 'stat-premium-block-violet' },
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`stat-premium-block ${stat.accentClass}`}
      style={{ borderLeftColor: stat.accentClass ? undefined : stat.color }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 p-3 rounded-xl transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${stat.color}10` }}
        >
          <Icon className="h-5 w-5" style={{ color: stat.color }} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="stat-number">
            {formatValue()}
          </div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TrustStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const sectionTitle = isHindi ? 'विश्वास के आँकड़े' : 'Trusted by Thousands';
  const sectionSubtitle = isHindi
    ? 'हमारे ग्राहकों का विश्वास हमारी सबसे बड़ी उपलब्धि है'
    : 'Numbers that reflect our commitment to protecting what matters most';

  return (
    <section
      ref={sectionRef}
      aria-label="Trust indicators"
      className="section-luxury bg-background dark:bg-[#0A1330] border-y border-[#E2E8F0] dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-section-title mb-3">
            {sectionTitle}
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Stats grid — 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.key}
              stat={stat}
              inView={isInView}
              index={index}
              isHindi={isHindi}
              isEnglish={isEnglish}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
