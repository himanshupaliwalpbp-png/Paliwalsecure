'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

// ── Stats data with icons and colors ─────────────────────────────────────────
// Colors aligned with Design Bible v8.0: forest teal (trust) + burnt sienna (accent)
const stats = [
  { key: 'families', icon: Users, target: 200, color: '#1B4D4A' },
  { key: 'claims', icon: TrendingUp, target: 100, color: '#B8482C' },
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
    families: { en: 'Families Protected', hi: 'परिवार सुरक्षित', hg: 'Parivaar Surakshit' },
    claims: { en: 'Claims Settled', hi: 'क्लेम निपटाए', hg: 'Claim Settle' },
  };

  const label = isHindi ? valueLabels[stat.key]?.hi : isEnglish ? valueLabels[stat.key]?.en : valueLabels[stat.key]?.hg;

  const formatValue = () => {
    if (stat.key === 'families') return `${Math.round(animated)}+`;
    if (stat.key === 'claims') return `${Math.round(animated)}%`;
    return String(Math.round(animated));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="stat-hairline group"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: `${stat.color}14` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: stat.color }} strokeWidth={2} />
        </span>
        <span className="stat-hairline-label !mb-0">{label}</span>
      </div>
      <div className="stat-hairline-value tabular-nums">
        {formatValue()}
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

  const sectionTitle = isHindi ? 'विश्वास के आँकड़े' : isEnglish ? 'Trusted by Thousands' : 'Hazaaron ka Bharosa';
  const sectionSubtitle = isHindi
    ? 'हमारे ग्राहकों का विश्वास हमारी सबसे बड़ी उपलब्धि है'
    : isEnglish
      ? 'Numbers that reflect our commitment to protecting what matters most'
      : 'Yeh numbers humari commitment ko reflect karte hain — jo sabse zaroori hai uski suraksha ke liye';

  return (
    <section
      ref={sectionRef}
      aria-label="Trust indicators"
      className="section-luxury bg-white dark:bg-[#0E1116] border-y border-[rgba(14,17,22,0.08)] dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-display-h2 mb-4 text-[#0E1116] dark:text-[#FAF7F2]">
            {sectionTitle}
          </h2>
          <p className="text-lead-premium max-w-2xl mx-auto text-[#4A4F57] dark:text-[#B8BCC2]">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Stats grid — 2 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 max-w-2xl mx-auto">
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
