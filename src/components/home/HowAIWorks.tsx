'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
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
    color: '#E8C872',
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
const stepVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ── Component ─────────────────────────────────────────────────────── */
export default function HowAIWorks() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const badgeText = isHindi ? 'Paliwal Secure क्यों चुनें' : isEnglish ? 'Why Choose Paliwal Secure' : 'Paliwal Secure kyun chunein';
  const heading = isHindi ? 'बुद्धिमत्ता मिलती है' : isEnglish ? 'Intelligence Meets' : 'Intelligence Meets';
  const headingAccent = isHindi ? 'सुरक्षा से' : isEnglish ? 'Protection' : 'Protection';
  const subtitle = isHindi
    ? 'हम अत्याधुनिक तकनीक को मानव विशेषज्ञता के साथ जोड़ते हैं ताकि सबसे अच्छा बीमा अनुभव दे सकें।'
    : isEnglish
      ? 'We combine cutting-edge technology with human expertise to deliver the best insurance experience.'
      : 'Hum cutting-edge technology ko human expertise ke saath jodte hain taaki best insurance experience de sakein.';

  return (
    <section className="py-24 bg-[#F8FAFC] dark:bg-[#060E22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 rounded-full border border-[#E2E8F0] dark:border-white/10 mb-4 shadow-premium">
            <Zap className="h-4 w-4 text-[#E8C872]" />
            <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">
              {badgeText}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#F8F6F0] mb-4 font-display">
            {heading} <span className="gradient-text-blue-emerald">{headingAccent}</span>
          </h2>
          <p className="text-xl text-[#64748B] dark:text-[#A6AEC7] max-w-3xl mx-auto font-body">
            {subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => {
            const Icon = feature.icon;
            const title = isHindi ? feature.titles.hi : isEnglish ? feature.titles.en : feature.titles.hg;
            const desc = isHindi ? feature.descriptions.hi : isEnglish ? feature.descriptions.en : feature.descriptions.hg;

            return (
              <motion.div
                key={feature.key}
                custom={index}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="group"
              >
                <div className="bg-white dark:bg-card/60 rounded-2xl p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 border border-[#E2E8F0] dark:border-white/10 h-full">
                  <div
                    className="inline-flex p-4 rounded-2xl mb-6 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: feature.color }} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A] dark:text-[#F8F6F0] mb-3 font-display">
                    {title}
                  </h3>
                  <p className="text-[#64748B] dark:text-[#A6AEC7] leading-relaxed font-body">
                    {desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
