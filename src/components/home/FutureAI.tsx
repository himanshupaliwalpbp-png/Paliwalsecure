'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Inline translations ───────────────────────────────────────────── */
const featureTitles: Record<string, { en: string; hi: string; hg: string }> = {
  feature1: { en: 'AI Chatbot 24×7', hi: 'AI चैटबॉट 24×7', hg: 'AI Chatbot 24×7' },
  feature2: { en: 'AI Policy Analyzer', hi: 'AI पॉलिसी एनालाइज़र', hg: 'AI Policy Analyzer' },
  feature3: { en: 'AI Claim Copilot', hi: 'AI क्लेम कोपायलट', hg: 'AI Claim Copilot' },
  feature4: { en: 'AI Coverage Gap Analysis', hi: 'AI कवरेज गैप एनालिसिस', hg: 'AI Coverage Gap Analysis' },
};

const featureDescs: Record<string, { en: string; hi: string; hg: string }> = {
  feature1: { en: 'Hinglish AI assistant available round the clock', hi: 'हिंग्लिश AI सहायक चौबीसों घंटे उपलब्ध', hg: 'Hinglish AI assistant 24 ghante available' },
  feature2: { en: 'Upload PDF → plain-English summary + red flags', hi: 'PDF अपलोड करें → सादे अंग्लिश में सारांश + खतरे के संकेत', hg: 'PDF upload karo → aasan summary + danger signs' },
  feature3: { en: 'Step-by-step claim guidance in your language', hi: 'आपकी भाषा में चरण-दर-चरण क्लेम मार्गदर्शन', hg: 'Step-by-step claim guidance aapki bhasha mein' },
  feature4: { en: "Find what your current policy doesn't cover", hi: 'पता लगाएं कि आपकी मौजूदा पॉलिसी क्या कवर नहीं करती', hg: 'Jaanein aapki current policy kya cover nahi karti' },
};

/* Alternating sienna + teal accent dots for feature cards (dark palette) */
const featureColors = ['#D4633F', '#2D7A77', '#D4633F', '#2D7A77'];

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
      className="border border-[rgba(250,247,242,0.10)] rounded-2xl p-6 flex flex-col h-full group transition-all duration-500 hover:border-[rgba(250,247,242,0.20)] hover:shadow-lg"
      style={{ backgroundColor: '#161A21' }}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#1A1F27'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#161A21'; }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}25`, boxShadow: `0 0 24px ${color}18` }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }} />
      </div>

      <h3 className="font-display text-base sm:text-lg font-medium text-white leading-snug mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-[#8B9099] leading-relaxed flex-1 mb-5">
        {desc}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-[rgba(250,247,242,0.10)]">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white px-3.5 py-1.5 rounded-full bg-[#D4633F] border border-[#D4633F] shadow-[0_0_12px_rgba(212,99,63,0.30)]">
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
  const outOf = isHindi ? '100 में से' : isEnglish ? 'out of 100' : '100 mein se';
  const scoreLabels = {
    life: { en: 'Life', hi: 'जीवन', hg: 'Jeevan' },
    health: { en: 'Health', hi: 'स्वास्थ्य', hg: 'Swasthya' },
    vehicle: { en: 'Vehicle', hi: 'वाहन', hg: 'Vahan' },
  };
  const goodProtection = isHindi ? 'अच्छी सुरक्षा' : isEnglish ? 'Good Protection' : 'Achhi Suraksha';
  const freeAnalysis = isHindi ? 'मुफ्त सुरक्षा विश्लेषण' : isEnglish ? 'Free Protection Analysis' : 'Free Suraksha Analysis';
  const poweredByAI = isHindi ? 'AI की शक्ति' : isEnglish ? 'Powered by AI' : 'AI ki Shakti';
  const scoreNote = isHindi ? 'केवल 2 मिनट में अपना वास्तविक स्कोर जानें' : isEnglish ? 'Get your actual score in just 2 minutes' : 'Bas 2 minute mein apna actual score jaanein';
  const subtitle = isHindi
    ? 'आपके पास अभी कौन सा इंश्योरेंस है? केवल 2 मिनट में अपने वर्तमान बीमा कवरेज का व्यापक विश्लेषण प्राप्त करें।'
    : isEnglish
      ? 'What insurance do you currently have? Get a comprehensive analysis of your current insurance coverage in just 2 minutes. Discover gaps, optimize costs.'
      : 'Aapke paas abhi kaun sa insurance hai? Bas 2 minute mein aapke current insurance coverage ka comprehensive analysis paayein.';

  const checklistItems = [
    { en: 'Instant coverage gap analysis', hi: 'तत्काल कवरेज अंतर विश्लेषण', hg: 'Turant coverage gap analysis' },
    { en: 'Personalized recommendations', hi: 'व्यक्तिगत सिफारिशें', hg: 'Aapke liye personalized recommendations' },
    { en: 'Compare with similar families', hi: 'समान परिवारों से तुलना करें', hg: 'Similar families ke saath compare karein' },
    { en: 'Track improvements over time', hi: 'समय के साथ सुधार ट्रैक करें', hg: 'Time ke saath sudhar track karein' },
  ];

  const ctaText = isHindi ? 'अपना स्कोर गणना करें' : isEnglish ? 'Calculate Your Score' : 'Apna score calculate karein';

  return (
    <section
      className="section-luxury dark overflow-hidden relative"
      style={{ backgroundColor: '#0E1116', color: '#FAF7F2' }}
    >
      {/* Premium ambient background — layered depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary glow — top-left (sienna) */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#D4633F]/[0.10] rounded-full blur-[120px]" />
        {/* Secondary glow — bottom-right (teal) */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#2D7A77]/[0.08] rounded-full blur-[120px]" />
        {/* Center accent glow (sienna) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4633F]/[0.06] rounded-full blur-[150px]" />
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250,247,242,0.5) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top gradient edge — bone hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(250,247,242,0.10)] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#D4633F]/[0.15] backdrop-blur-sm rounded-full border border-[#D4633F]/[0.30] mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4633F] animate-pulse" />
              <Shield className="h-3.5 w-3.5 text-[#D4633F]" />
              <span className="text-sm font-semibold font-display tracking-wide uppercase text-[#F4E5DD]">
                {freeAnalysis}
              </span>
            </div>

            <h2 className="text-display-h2 font-display text-white mb-6 leading-[1.1]">
              {heading}{' '}
              <span className="text-accent-gradient">{headingAccent}</span>
            </h2>

            <p className="text-lead-premium text-[#8B9099] mb-10 max-w-lg">
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
                  transition={{ delay: 0.1 * index, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#2D7A77]/[0.18] border border-[#2D7A77]/[0.30] flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-[#2D7A77]" strokeWidth={2.5} />
                  </div>
                  <span className="text-base text-[#FAF7F2]">
                    {isHindi ? item.hi : isEnglish ? item.en : item.hg}
                  </span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('advisor-form');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="btn-stripe group"
              style={{ backgroundColor: '#FAF7F2', color: '#0E1116' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#D4633F';
                (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#FAF7F2';
                (e.currentTarget as HTMLElement).style.color = '#0E1116';
              }}
            >
              {ctaText}
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <p className="text-sm text-[#8B9099] mt-3">{scoreNote}</p>
          </motion.div>

          {/* Visual: Animated Score Circle */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Outer ring glow — sienna → teal */}
              <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-[#D4633F]/[0.14] via-transparent to-[#2D7A77]/[0.10] blur-xl" />

              <div className="aspect-square relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  {/* Background track */}
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(250,247,242,0.06)" strokeWidth="10" />
                  {/* Subtle outer track */}
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(250,247,242,0.03)" strokeWidth="14" />
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
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <defs>
                    <linearGradient id="scoreGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4633F" />
                      <stop offset="50%" stopColor="#F4E5DD" />
                      <stop offset="100%" stopColor="#2D7A77" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div
                      className="font-display text-7xl font-medium tracking-tight text-white tabular-nums"
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                    >
                      87
                    </motion.div>
                  </motion.div>
                  <div className="text-base sm:text-lg text-[#8B9099] mt-1">{outOf}</div>
                  <div className="mt-5 px-4 py-2 bg-[#2D7A77]/[0.20] rounded-full border border-[#2D7A77]/[0.35] backdrop-blur-sm">
                    <span className="text-sm font-semibold font-display tracking-wide text-[#E6EFEE]">
                      {goodProtection}
                    </span>
                  </div>
                </div>
              </div>

              {/* Score Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm"
              >
                <div className="rounded-2xl p-5 border border-[rgba(250,247,242,0.10)]" style={{ backgroundColor: '#161A21' }}>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-medium font-display tabular-nums text-accent-gradient">92%</div>
                      <div className="text-caption-premium text-[#8B9099] mt-1">{isHindi ? scoreLabels.life.hi : isEnglish ? scoreLabels.life.en : scoreLabels.life.hg}</div>
                    </div>
                    <div className="border-x border-[rgba(250,247,242,0.10)]">
                      <div className="text-xl font-medium font-display tabular-nums text-accent-gradient">85%</div>
                      <div className="text-caption-premium text-[#8B9099] mt-1">{isHindi ? scoreLabels.health.hi : isEnglish ? scoreLabels.health.en : scoreLabels.health.hg}</div>
                    </div>
                    <div>
                      <div className="text-xl font-medium font-display tabular-nums text-accent-gradient">84%</div>
                      <div className="text-caption-premium text-[#8B9099] mt-1">{isHindi ? scoreLabels.vehicle.hi : isEnglish ? scoreLabels.vehicle.en : scoreLabels.vehicle.hg}</div>
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
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 pt-16 border-t border-[rgba(250,247,242,0.10)]"
        >
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4633F]/[0.12] rounded-full border border-[#D4633F]/[0.25] text-sm font-semibold uppercase tracking-[0.12em] text-[#F4E5DD] font-display mb-4">
              <Shield className="h-4 w-4" />
              {badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
              {poweredByAI}
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

      {/* Bottom gradient edge — bone hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(250,247,242,0.10)] to-transparent" />
    </section>
  );
}
