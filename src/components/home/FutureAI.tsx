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
  feature2: { en: 'Upload PDF → plain-English summary + red flags', hi: 'PDF अपलोड करें → सादे अंग्लिश में सारांश + खतरे के संकेत', hg: 'Upload PDF → plain-English summary + red flags' },
  feature3: { en: 'Step-by-step claim guidance in your language', hi: 'आपकी भाषा में चरण-दर-चरण क्लेम मार्गदर्शन', hg: 'Step-by-step claim guidance aapki bhasha mein' },
  feature4: { en: "Find what your current policy doesn't cover", hi: 'पता लगाएं कि आपकी मौजूदा पॉलिसी क्या कवर नहीं करती', hg: 'Find out aapki current policy kya cover nahi karti' },
};

const featureColors = ['#2563EB', '#10B981', '#5E1223', '#8B5CF6'];

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
      className="border border-white/[0.12] rounded-2xl p-6 flex flex-col h-full group transition-all duration-500 hover:border-white/[0.20] hover:shadow-lg"
      style={{ backgroundColor: '#111827' }}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#1a2332'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#111827'; }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}25`, boxShadow: `0 0 24px ${color}18` }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }} />
      </div>

      <h3 className="font-heading text-base sm:text-lg font-bold text-white leading-snug mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-[#CBD5E1] leading-relaxed flex-1 mb-5 font-sans">
        {desc}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.10]">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white px-3.5 py-1.5 rounded-full bg-[#2563EB] border border-[#3B82F6] font-heading shadow-[0_0_12px_rgba(37,99,235,0.3)]">
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
  const heading = isHindi ? 'अपना जानें' : isEnglish ? 'Discover Your' : 'Apna jaanein';
  const headingAccent = isHindi ? 'सुरक्षा स्कोर' : isEnglish ? 'Protection Score' : 'Protection Score';
  const subtitle = isHindi
    ? 'आपके पास अभी कौन सा इंश्योरेंस है? केवल 2 मिनट में अपने वर्तमान बीमा कवरेज का व्यापक विश्लेषण प्राप्त करें।'
    : isEnglish
      ? 'What insurance do you currently have? Get a comprehensive analysis of your current insurance coverage in just 2 minutes. Discover gaps, optimize costs.'
      : 'Aapke paas abhi kaun sa insurance hai? Bas 2 minute mein aapke current insurance coverage ka comprehensive analysis paayein.';

  const checklistItems = [
    { en: 'Instant coverage gap analysis', hi: 'तत्काल कवरेज अंतर विश्लेषण', hg: 'Instant coverage gap analysis' },
    { en: 'Personalized recommendations', hi: 'व्यक्तिगत सिफारिशें', hg: 'Personalized recommendations' },
    { en: 'Compare with similar families', hi: 'समान परिवारों से तुलना करें', hg: 'Compare with similar families' },
    { en: 'Track improvements over time', hi: 'समय के साथ सुधार ट्रैक करें', hg: 'Track improvements over time' },
  ];

  const ctaText = isHindi ? 'अपना स्कोर गणना करें' : isEnglish ? 'Calculate Your Score' : 'Apna score calculate karein';

  return (
    <section className="section-luxury bg-[#070B14] dark:bg-[#070B14] text-white overflow-hidden relative">
      {/* Premium ambient background — layered depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary glow — top-left */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#2563EB]/[0.10] rounded-full blur-[120px]" />
        {/* Secondary glow — bottom-right */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#10B981]/[0.08] rounded-full blur-[120px]" />
        {/* Center accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#2563EB]/[0.06] rounded-full blur-[150px]" />
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top gradient edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#2563EB]/[0.15] backdrop-blur-sm rounded-full border border-[#2563EB]/[0.30] mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
              <Shield className="h-3.5 w-3.5 text-[#60A5FA]" />
              <span className="text-xs font-semibold font-heading tracking-wide uppercase text-[#93C5FD]">
                {isHindi ? 'मुफ्त सुरक्षा विश्लेषण' : isEnglish ? 'Free Protection Analysis' : 'Free Protection Analysis'}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold mb-6 font-heading leading-[1.1] tracking-tight text-white">
              {heading}{' '}
              <span className="gradient-text-blue-emerald">{headingAccent}</span>
            </h2>

            <p className="text-lg text-[#CBD5E1] mb-10 leading-relaxed font-sans max-w-lg">
              {subtitle}
            </p>

            <div className="space-y-4 mb-10">
              {checklistItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#10B981]/[0.15] border border-[#10B981]/[0.25] flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-[#34D399]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[0.9375rem] text-[#E2E8F0] font-sans">
                    {isHindi ? item.hi : isEnglish ? item.en : item.hg}
                  </span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('advisor-form');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="btn-luxury-primary btn-luxury-lg group"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </motion.div>

          {/* Visual: Animated Score Circle */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Outer ring glow */}
              <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-[#2563EB]/[0.12] via-transparent to-[#10B981]/[0.08] blur-xl" />

              <div className="aspect-square relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  {/* Background track */}
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  {/* Subtle outer track */}
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="14" />
                  {/* Animated progress */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#scoreGradientDark)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="534"
                    initial={{ strokeDashoffset: 534 }}
                    whileInView={{ strokeDashoffset: 534 - (534 * 87) / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <defs>
                    <linearGradient id="scoreGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="50%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-7xl font-bold font-heading tracking-tight text-white"
                  >
                    87
                  </motion.div>
                  <div className="text-base text-[#CBD5E1] font-sans mt-1">out of 100</div>
                  <div className="mt-5 px-4 py-2 bg-[#2563EB]/[0.20] rounded-full border border-[#2563EB]/[0.35] backdrop-blur-sm">
                    <span className="text-xs font-semibold font-heading tracking-wide text-[#93C5FD]">
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
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm"
              >
                <div className="rounded-2xl p-5 border border-white/[0.12]" style={{ backgroundColor: '#111827' }}>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold gradient-text-blue-emerald font-heading">92%</div>
                      <div className="text-[11px] text-[#94A3B8] font-sans mt-0.5">Life</div>
                    </div>
                    <div className="border-x border-white/[0.10]">
                      <div className="text-xl font-bold gradient-text-blue-emerald font-heading">85%</div>
                      <div className="text-[11px] text-[#94A3B8] font-sans mt-0.5">Health</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white font-heading">84%</div>
                      <div className="text-[11px] text-[#94A3B8] font-sans mt-0.5">Vehicle</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Coming Soon Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 pt-16 border-t border-white/[0.08]"
        >
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2563EB]/[0.12] rounded-full border border-[#2563EB]/[0.25] text-xs font-bold uppercase tracking-widest text-[#93C5FD] font-heading mb-4">
              <Shield className="h-3 w-3" />
              {badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
              {isHindi ? 'AI की शक्ति' : isEnglish ? 'Powered by AI' : 'Powered by AI'}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {['feature1', 'feature2', 'feature3', 'feature4'].map((key, index) => (
              <FeatureCard
                key={key}
                featureKey={key}
                index={index}
                isHindi={isHindi}
                isEnglish={isEnglish}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </section>
  );
}
