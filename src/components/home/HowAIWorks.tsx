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
    color: '#2563EB',
    titles: { en: 'AI-Powered Insights', hi: 'AI-संचालित अंतर्दृष्टि', hg: 'AI-Powered Insights' },
    descriptions: { en: 'Get personalized recommendations based on your unique financial situation and goals.', hi: 'अपनी अनूठी वित्तीय स्थिति और लक्ष्यों के आधार पर व्यक्तिगत सिफारिशें प्राप्त करें।', hg: 'Apni unique financial situation aur goals ke basis par personalized recommendations payein.' },
  },
  {
    key: 'smartAnalytics',
    icon: LineChart,
    color: '#10B981',
    titles: { en: 'Smart Analytics', hi: 'स्मार्ट एनालिटिक्स', hg: 'Smart Analytics' },
    descriptions: { en: 'Track your protection score and see how your coverage evolves over time.', hi: 'अपना सुरक्षा स्कोर ट्रैक करें और देखें कि आपका कवरेज समय के साथ कैसे बदलता है।', hg: 'Apna protection score track karein aur dekhein aapka coverage kaise badalta hai.' },
  },
  {
    key: 'comprehensiveProtection',
    icon: Shield,
    color: '#2563EB',
    titles: { en: 'Comprehensive Protection', hi: 'व्यापक सुरक्षा', hg: 'Comprehensive Protection' },
    descriptions: { en: 'Life, health, vehicle, and business insurance — all in one intelligent platform.', hi: 'जीवन, स्वास्थ्य, वाहन और व्यापार बीमा — एक ही बुद्धिमान प्लेटफॉर्म पर।', hg: 'Life, health, vehicle, aur business insurance — ek hi intelligent platform par.' },
  },
  {
    key: 'instantComparisons',
    icon: Zap,
    color: '#8B5CF6',
    titles: { en: 'Instant Comparisons', hi: 'तत्काल तुलना', hg: 'Instant Comparisons' },
    descriptions: { en: 'Compare policies from top insurers in seconds with transparent pricing.', hi: 'पारदर्शी मूल्य निर्धारण के साथ सेकंड में शीर्ष बीमाकर्ताओं की नीतियों की तुलना करें।', hg: 'Transparent pricing ke saath seconds mein top insurers ki policies compare karein.' },
  },
  {
    key: 'securePrivate',
    icon: Lock,
    color: '#EF4444',
    titles: { en: 'Secure & Private', hi: 'सुरक्षित और निजी', hg: 'Secure & Private' },
    descriptions: { en: 'Bank-level security for your sensitive financial and personal information.', hi: 'आपकी संवेदनशील वित्तीय और व्यक्तिगत जानकारी के लिए बैंक-स्तरीय सुरक्षा।', hg: 'Aapki sensitive financial aur personal information ke liye bank-level security.' },
  },
  {
    key: 'expertAdvisors',
    icon: Users,
    color: '#F59E0B',
    titles: { en: 'Expert Advisors', hi: 'विशेषज्ञ सलाहकार', hg: 'Expert Advisors' },
    descriptions: { en: 'Connect with certified advisors who understand your needs and priorities.', hi: 'प्रमाणित सलाहकारों से जुड़ें जो आपकी ज़रूरतों और प्राथमिकताओं को समझते हैं।', hg: 'Certified advisors se judein jo aapki zarooraton aur priorities ko samajhte hain.' },
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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
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
  const heading = isHindi ? 'बुद्धिमत्ता मिलती है' : isEnglish ? 'Intelligence Meets' : 'Intelligence Meets';
  const headingAccent = isHindi ? 'सुरक्षा से' : isEnglish ? 'Protection' : 'Protection';
  const subtitle = isHindi
    ? 'हम अत्याधुनिक तकनीक को मानव विशेषज्ञता के साथ जोड़ते हैं ताकि सबसे अच्छा बीमा अनुभव दे सकें।'
    : isEnglish
      ? 'We combine cutting-edge technology with human expertise to deliver the best insurance experience.'
      : 'Hum cutting-edge technology ko human expertise ke saath jodte hain taaki best insurance experience de sakein.';

  return (
    <section className="section-luxury bg-background dark:bg-[#111111]">
      {/* Subtle background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2563EB]/[0.03] dark:bg-[#2563EB]/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#10B981]/[0.03] dark:bg-[#10B981]/[0.04] rounded-full blur-[100px]" />
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
          <div className="badge-premium-blue mb-5">
            <Zap className="h-3 w-3" />
            <span className="font-body">{badgeText}</span>
          </div>
          <h2 className="text-section-title mb-5">
            {heading} <span className="gradient-text-blue-emerald">{headingAccent}</span>
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
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
                <div className="premium-card h-full flex flex-col relative overflow-hidden">
                  {/* Subtle gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.color}06, transparent 40%)`,
                    }}
                  />

                  {/* Top row: index badge + icon */}
                  <div className="flex items-start justify-between mb-5">
                    {/* Icon in colored circular container */}
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm"
                      style={{
                        backgroundColor: `${feature.color}10`,
                        boxShadow: `0 0 0 0 ${feature.color}00`,
                      }}
                    >
                      <Icon
                        className="h-5 w-5 transition-transform duration-300 group-hover:scale-105"
                        style={{ color: feature.color }}
                        strokeWidth={2}
                      />
                    </div>
                    {/* Feature index badge */}
                    <span
                      className="badge-premium-blue !gap-0 !px-2 !py-0.5 !text-[10px] font-mono"
                      style={{
                        background: `${feature.color}08`,
                        color: feature.color,
                        borderColor: `${feature.color}18`,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-card-title mb-2.5">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#4A4A4A] dark:text-[#94A3B8] text-sm leading-relaxed font-body flex-1">
                    {desc}
                  </p>

                  {/* Bottom accent line — reveals on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${feature.color}40, transparent)`,
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
