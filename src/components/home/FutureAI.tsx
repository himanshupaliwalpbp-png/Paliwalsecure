'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Check } from 'lucide-react';
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

const featureColors = ['#2563EB', '#10B981', '#E8C872', '#8B5CF6'];

/* ── Feature Card ──────────────────────────────────────────────── */
function FeatureCard({
  featureKey,
  index,
  isHindi,
  isEnglish,
}: {
  featureKey: string;
  index: number;
  isHindi: boolean;
  isEnglish: boolean;
}) {
  const color = featureColors[index % featureColors.length];
  const title = isHindi ? featureTitles[featureKey]?.hi : isEnglish ? featureTitles[featureKey]?.en : featureTitles[featureKey]?.hg;
  const desc = isHindi ? featureDescs[featureKey]?.hi : isEnglish ? featureDescs[featureKey]?.en : featureDescs[featureKey]?.hg;
  const comingSoon = isHindi ? 'जल्द आ रहा है' : isEnglish ? 'Coming Soon' : 'Jald aa raha hai';

  return (
    <motion.div
      className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-[#E2E8F0]/50 dark:border-white/10 rounded-2xl p-6 flex flex-col h-full group transition-all duration-500 hover:bg-white dark:hover:bg-white/10 hover:shadow-premium-lg hover:border-[#E2E8F0] dark:hover:border-white/20"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: `${color}15` }}
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      </div>

      <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-white/60 leading-relaxed flex-1 mb-5 font-body">
        {desc}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8C872] px-2.5 py-1 rounded-full bg-[#E8C872]/10 border border-[#E8C872]/20 font-body">
          {comingSoon}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Main Component ────────────────────────────────────────────── */
export default function FutureAI() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const badge = isHindi ? 'जल्द आ रहा है' : isEnglish ? 'Coming Soon' : 'Jald aa raha hai';
  const heading = isHindi ? 'अपना जानें' : isEnglish ? 'Know Your' : 'Apna jaanein';
  const headingAccent = isHindi ? 'सुरक्षा स्कोर' : isEnglish ? 'Protection Score' : 'Protection Score';
  const subtitle = isHindi
    ? 'केवल 2 मिनट में अपने वर्तमान बीमा कवरेज का व्यापक विश्लेषण प्राप्त करें। अंतराल खोजें, लागत अनुकूलित करें।'
    : isEnglish
      ? 'Get a comprehensive analysis of your current insurance coverage in just 2 minutes. Discover gaps, optimize costs.'
      : 'Bas 2 minute mein aapke current insurance coverage ka comprehensive analysis paayein. Gaps discover karein, costs optimize karein.';

  const checklistItems = [
    { en: 'Instant coverage gap analysis', hi: 'तत्काल कवरेज अंतर विश्लेषण', hg: 'Instant coverage gap analysis' },
    { en: 'Personalized recommendations', hi: 'व्यक्तिगत सिफारिशें', hg: 'Personalized recommendations' },
    { en: 'Compare with similar families', hi: 'समान परिवारों से तुलना करें', hg: 'Compare with similar families' },
    { en: 'Track improvements over time', hi: 'समय के साथ सुधार ट्रैक करें', hg: 'Track improvements over time' },
  ];

  const ctaText = isHindi ? 'अपना स्कोर गणना करें' : isEnglish ? 'Calculate Your Score' : 'Apna score calculate karein';

  return (
    <section className="py-24 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white overflow-hidden relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#10B981]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Shield className="h-4 w-4 text-[#E8C872]" />
              <span className="text-sm font-medium font-body">
                {isHindi ? 'मुफ्त सुरक्षा विश्लेषण' : isEnglish ? 'Free Protection Analysis' : 'Free Protection Analysis'}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
              {heading} <span className="gradient-luxury">{headingAccent}</span>
            </h2>

            <p className="text-xl text-white/70 mb-8 leading-relaxed font-body">
              {subtitle}
            </p>

            <div className="space-y-4 mb-8">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#10B981]" />
                  </div>
                  <span className="text-white/90 font-body">
                    {isHindi ? item.hi : isEnglish ? item.en : item.hg}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('advisor-form');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F172A] hover:bg-white/90 font-semibold rounded-xl shadow-premium-lg transition-all duration-300 font-body"
            >
              {ctaText}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Visual: Animated Score Circle */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-square relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#scoreGradientDark)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="534"
                    initial={{ strokeDashoffset: 534 }}
                    whileInView={{ strokeDashoffset: 534 - (534 * 87) / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="scoreGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E8C872" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-7xl font-bold font-display"
                  >
                    87
                  </motion.div>
                  <div className="text-xl text-white/60 font-body">out of 100</div>
                  <div className="mt-4 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                    <span className="text-sm font-medium font-body">
                      {isHindi ? 'अच्छी सुरक्षा' : isEnglish ? 'Good Protection' : 'Good Protection'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Score Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold gradient-luxury font-display">92%</div>
                      <div className="text-xs text-white/60 font-body">Life</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold gradient-text-blue-emerald font-display">85%</div>
                      <div className="text-xs text-white/60 font-body">Health</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white font-display">84%</div>
                      <div className="text-xs text-white/60 font-body">Vehicle</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
