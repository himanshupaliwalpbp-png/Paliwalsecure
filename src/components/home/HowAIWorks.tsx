'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Brain, LineChart, Shield, Zap, Lock, Users } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Features data ───────────────────────────────────────────────────── */
const featuresData = [
  {
    key: 'aiPowered',
    icon: Brain,
    color: '#B8482C',
    titles: { en: 'AI-Powered Insights', hi: 'AI-संचालित अंतर्दृष्टि', hg: 'AI-Powered Insights' },
    descriptions: { en: 'Get personalized recommendations based on your unique financial situation and goals.', hi: 'अपनी अनूठी वित्तीय स्थिति और लक्ष्यों के आधार पर व्यक्तिगत सिफारिशें प्राप्त करें।', hg: 'Aapki financial situation aur goals ke hisaab se personalized recommendations paayein.' },
  },
  {
    key: 'smartAnalytics',
    icon: LineChart,
    color: '#1B4D4A',
    titles: { en: 'Smart Analytics', hi: 'स्मार्ट एनालिटिक्स', hg: 'Smart Analytics' },
    descriptions: { en: 'Track your protection score and see how your coverage evolves over time.', hi: 'अपना सुरक्षा स्कोर ट्रैक करें और देखें कि आपका कवरेज समय के साथ कैसे बदलता है।', hg: 'Apna protection score track karein aur dekhein coverage kaise improve hota hai.' },
  },
  {
    key: 'comprehensiveProtection',
    icon: Shield,
    color: '#B8482C',
    titles: { en: 'Comprehensive Protection', hi: 'व्यापक सुरक्षा', hg: 'Poori Suraksha' },
    descriptions: { en: 'Life, health, vehicle, and business insurance — all in one intelligent platform.', hi: 'जीवन, स्वास्थ्य, वाहन और व्यापार बीमा — एक ही बुद्धिमान प्लेटफॉर्म पर।', hg: 'Life, health, vehicle, aur business insurance — ek hi intelligent platform par.' },
  },
  {
    key: 'instantComparisons',
    icon: Zap,
    color: '#1B4D4A',
    titles: { en: 'Instant Comparisons', hi: 'तत्काल तुलना', hg: 'Turant Comparison' },
    descriptions: { en: 'Compare policies from top insurers in seconds with transparent pricing.', hi: 'पारदर्शी मूल्य निर्धारण के साथ सेकंड में शीर्ष बीमाकर्ताओं की नीतियों की तुलना करें।', hg: 'Transparent pricing ke saath seconds mein top insurers ki policies compare karein.' },
  },
  {
    key: 'securePrivate',
    icon: Lock,
    color: '#B8482C',
    titles: { en: 'Secure & Private', hi: 'सुरक्षित और निजी', hg: 'Surakshit & Niji' },
    descriptions: { en: 'Bank-level security for your sensitive financial and personal information.', hi: 'आपकी संवेदनशील वित्तीय और व्यक्तिगत जानकारी के लिए बैंक-स्तरीय सुरक्षा।', hg: 'Aapki sensitive financial aur personal information ke liye bank-level security.' },
  },
  {
    key: 'expertAdvisors',
    icon: Users,
    color: '#1B4D4A',
    titles: { en: 'Expert Advisors', hi: 'विशेषज्ञ सलाहकार', hg: 'Expert Advisors' },
    descriptions: { en: 'Connect with certified advisors who understand your needs and priorities.', hi: 'प्रमाणित सलाहकारों से जुड़ें जो आपकी ज़रूरतों और प्राथमिकताओं को समझते हैं।', hg: 'Certified advisors se baat karein jo aapki zarooratein samajhte hain.' },
  },
];

/* ── Animation ─────────────────────────────────────────────────────── */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ── Component ─────────────────────────────────────────────────────── */
export default function HowAIWorks() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: '-80px' });

  const badgeText = isHindi ? 'Paliwal Secure क्यों चुनें' : isEnglish ? 'Why Choose Paliwal Secure' : 'Paliwal Secure kyun chunein';
  const heading = isHindi ? 'बुद्धिमत्ता मिलती है' : isEnglish ? 'Intelligence Meets' : 'Buddhimatta Milti Hai';
  const headingAccent = isHindi ? 'सुरक्षा से' : isEnglish ? 'Protection' : 'Suraksha Se';
  const subtitle = isHindi
    ? 'हम अत्याधुनिक तकनीक को मानव विशेषज्ञता के साथ जोड़ते हैं ताकि सबसे अच्छा बीमा अनुभव दे सकें।'
    : isEnglish
      ? 'We combine cutting-edge technology with human expertise to deliver the best insurance experience.'
      : 'Hum cutting-edge technology ko human expertise ke saath jodte hain taaki best insurance experience de sakein.';

  return (
    <section className="section-premium bg-[#FAF7F2] dark:bg-[#0E1116]">
      {/* Subtle background accent — single sienna tint blob, premium = clean, not blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#F4E5DD]/60 dark:bg-[#F4E5DD]/[0.05] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="btn-pill-dot mb-5 bg-[#F4E5DD] dark:bg-[#3A1E14] text-[#8B3520] dark:text-[#E89572]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B8482C] dark:bg-[#D4633F]" />
            <span className="font-body">{badgeText}</span>
          </div>
          <h2 className="text-display-h2 font-display text-[#0E1116] dark:text-[#FAF7F2] mb-5">
            {heading} <span className="text-accent-gradient">{headingAccent}</span>
          </h2>
          <p className="text-lead-premium text-[#4A4F57] dark:text-[#B8BCC2] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Features Grid — 3×2 desktop, 2×3 tablet, 1-col mobile */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {featuresData.map((feature, index) => {
            const Icon = feature.icon;
            const title = isHindi ? feature.titles.hi : isEnglish ? feature.titles.en : feature.titles.hg;
            const desc = isHindi ? feature.descriptions.hi : isEnglish ? feature.descriptions.en : feature.descriptions.hg;

            return (
              <motion.div
                key={feature.key}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="group"
              >
                <div className="bg-white dark:bg-[#161A22] border border-[rgba(14,17,22,0.08)] dark:border-white/[0.08] rounded-2xl shadow-sm hover:shadow-premium h-full flex flex-col relative overflow-hidden p-6 md:p-7 transition-all duration-300 hover:-translate-y-1">
                  {/* Subtle gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.color}08, transparent 40%)`,
                    }}
                  />

                  {/* Top row: index badge + icon */}
                  <div className="relative flex items-start justify-between mb-5">
                    {/* Icon in colored circular container — sienna tint or teal tint derived from feature.color */}
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                        feature.color === '#1B4D4A'
                          ? 'bg-[#E6EFEE] dark:bg-[#0F2A28]'
                          : 'bg-[#F4E5DD] dark:bg-[#3A1E14]'
                      }`}
                    >
                      <Icon
                        className="h-5 w-5 transition-transform duration-300 group-hover:scale-105"
                        style={{ color: feature.color }}
                        strokeWidth={1.75}
                      />
                    </div>
                    {/* Feature index badge — Fraunces serif step number */}
                    <span
                      className={`text-caption-premium !gap-0 !px-2.5 !py-1 !text-[10px] font-display ${
                        feature.color === '#1B4D4A'
                          ? 'bg-[#E6EFEE] dark:bg-[#0F2A28] text-[#1B4D4A] dark:text-[#2D7A77]'
                          : 'bg-[#F4E5DD] dark:bg-[#3A1E14] text-[#8B3520] dark:text-[#D4633F]'
                      }`}
                      style={{ borderRadius: '0.375rem' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Hairline connector between step badge and title */}
                  <div className="relative h-px bg-[rgba(14,17,22,0.08)] dark:bg-white/[0.08] mb-5" />

                  {/* Title */}
                  <h3 className="relative font-display text-[#0E1116] dark:text-[#FAF7F2] text-xl md:text-2xl tracking-tight mb-2.5" style={{ fontWeight: 500 }}>
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="relative text-body-premium text-[#4A4F57] dark:text-[#B8BCC2] flex-1">
                    {desc}
                  </p>

                  {/* Bottom hairline accent — reveals on hover (was thick 2px gradient) */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: feature.color,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
