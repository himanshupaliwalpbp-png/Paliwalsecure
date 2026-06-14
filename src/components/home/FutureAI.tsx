'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, FileSearch, HandHelping, ShieldCheck, Sparkles } from 'lucide-react';
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
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-7 sm:p-8 flex flex-col h-full group transition-all duration-500 hover:border-primary/20 hover:shadow-[0_12px_48px_-12px_rgba(var(--primary),0.08)] relative overflow-hidden"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle gradient glow on hover */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Icon — refined treatment */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-primary/[0.06] border border-primary/[0.10] text-primary transition-transform duration-300 group-hover:scale-105"
      >
        {feature.icon}
      </div>

      {/* Title */}
      <h3
        className="font-heading text-base sm:text-lg lg:text-xl font-bold text-foreground leading-snug mb-2 tracking-tight"
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
        {desc}
      </p>

      {/* Bottom row: Timeline pill + Coming Soon label */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        {/* Timeline badge */}
        <span
          className="text-[10px] font-mono text-muted-foreground px-2.5 py-1 rounded-full bg-muted/30 border border-border/30"
        >
          {timeline}
        </span>

        {/* Coming Soon label */}
        <span
          className="text-[10px] font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/[0.06] border border-primary/[0.10]"
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
      className="relative py-28 md:py-36 overflow-hidden bg-background text-foreground"
      aria-label="Upcoming AI features"
    >
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 bg-primary/[0.07] border border-primary/[0.12] text-primary"
          >
            <Sparkles className="w-3 h-3" />
            {badge}
          </div>

          {/* Heading */}
          <h2
            className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-[1.05]"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} isHindi={isHindi} isEnglish={isEnglish} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
