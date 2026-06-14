'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, FileSearch, HandHelping, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Inline translations ───────────────────────────────────────────── */
const featureTitles: Record<string, { en: string; hi: string; hg: string }> = {
  feature1: { en: 'AI Chatbot 24×7', hi: 'AI Chatbot 24×7', hg: 'AI Chatbot 24×7' },
  feature2: { en: 'AI Policy Analyzer', hi: 'AI Policy Analyzer', hg: 'AI Policy Analyzer' },
  feature3: { en: 'AI Claim Copilot', hi: 'AI Claim Copilot', hg: 'AI Claim Copilot' },
  feature4: { en: 'AI Coverage Gap Analysis', hi: 'AI Gap Analysis', hg: 'AI Gap Analysis' },
};

const featureDescs: Record<string, { en: string; hi: string; hg: string }> = {
  feature1: { en: 'Hinglish AI assistant available round the clock', hi: 'हिंग्लिश AI सहायक चौबीसों घंटे उपलब्ध', hg: 'Hinglish AI assistant available round the clock' },
  feature2: { en: 'Upload PDF → plain-English summary + red flags', hi: 'PDF अपलोड करें → सादे अंग्रेज़ी में सारांश + खतरे के संकेत', hg: 'Upload PDF → plain-English summary + red flags' },
  feature3: { en: 'Step-by-step claim guidance in your language', hi: 'आपकी भाषा में चरण-दर-चरण क्लेम मार्गदर्शन', hg: 'Step-by-step claim guidance aapki bhasha mein' },
  feature4: { en: "Find what your current policy doesn't cover", hi: 'पता लगाएं कि आपकी मौजूदा पॉलिसी क्या कवर नहीं करती', hg: 'Find out aapki current policy kya cover nahi karti' },
};

const featureTimelines: Record<string, { en: string; hi: string; hg: string }> = {
  feature1: { en: 'Q1 2026', hi: 'Q1 2026', hg: 'Q1 2026' },
  feature2: { en: 'Q1 2026', hi: 'Q1 2026', hg: 'Q1 2026' },
  feature3: { en: 'Q2 2026', hi: 'Q2 2026', hg: 'Q2 2026' },
  feature4: { en: 'Q2 2026', hi: 'Q2 2026', hg: 'Q2 2026' },
};

/* ── Helper to get trilingual string ───────────────────────────────────── */
function tr(data: { en: string; hi: string; hg: string }, isHindi: boolean, isEnglish: boolean) {
  return isHindi ? data.hi : isEnglish ? data.en : data.hg;
}

/* ── Feature data interface ────────────────────────────────────────────── */
interface FutureFeatureInfo {
  featureKey: string;
  icon: React.ReactNode;
}

const features: FutureFeatureInfo[] = [
  {
    featureKey: 'feature1',
    icon: <Bot className="w-6 h-6" />,
  },
  {
    featureKey: 'feature2',
    icon: <FileSearch className="w-6 h-6" />,
  },
  {
    featureKey: 'feature3',
    icon: <HandHelping className="w-6 h-6" />,
  },
  {
    featureKey: 'feature4',
    icon: <ShieldCheck className="w-6 h-6" />,
  },
];

/* ── Feature Card ──────────────────────────────────────────────────────── */
function FeatureCard({
  feature,
  isHindi,
  isEnglish,
  index,
}: {
  feature: FutureFeatureInfo;
  isHindi: boolean;
  isEnglish: boolean;
  index: number;
}) {
  const fk = feature.featureKey;
  const title = tr(featureTitles[fk], isHindi, isEnglish);
  const desc = tr(featureDescs[fk], isHindi, isEnglish);
  const timeline = tr(featureTimelines[fk], isHindi, isEnglish);
  const comingSoon = isHindi ? 'जल्द आ रहा है' : 'Coming Soon';

  return (
    <motion.div
      className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-primary/10 border border-border text-primary"
      >
        {feature.icon}
      </div>

      {/* Title */}
      <h3
        className="font-heading text-base sm:text-lg lg:text-xl font-bold text-foreground leading-snug mb-2"
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
        {desc}
      </p>

      {/* Bottom row: Timeline pill + Coming Soon label */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        {/* Timeline badge */}
        <span
          className="text-xs font-mono text-muted-foreground"
        >
          {timeline}
        </span>

        {/* Coming Soon label */}
        <span
          className="text-xs font-bold uppercase tracking-wider text-primary"
        >
          {comingSoon}
        </span>
      </div>

    </motion.div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────── */
export default function FutureAI() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const badge = isHindi ? 'जल्द आ रहा है' : 'Coming Soon';
  const heading = isHindi ? 'आगे क्या आने वाला है' : isEnglish ? "What's coming next" : 'Aage kya aane wala hai';

  return (
    <section
      dir="ltr"
      className="relative py-24 md:py-32 overflow-hidden bg-background text-foreground"
      aria-label="Upcoming AI features"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 bg-card border border-border text-primary"
          >
            {badge}
          </div>

          {/* Heading */}
          <h2
            className="font-heading text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground"
          >
            {heading
              .split(' ')
              .map((word: string, i: number, arr: string[]) =>
                i === arr.length - 1 ? (
                  <span key={i} className="italic text-primary">
                    {' '}
                    {word}
                  </span>
                ) : (
                  <span key={i}>{i > 0 ? ' ' : ''}{word}</span>
                )
              )}
          </h2>
        </motion.div>

        {/* Feature Cards — 2×2 on desktop, 1 col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} isHindi={isHindi} isEnglish={isEnglish} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
