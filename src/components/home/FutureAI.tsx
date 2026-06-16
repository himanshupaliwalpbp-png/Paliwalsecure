'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowUpRight, Check, X, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Protection Score Quiz — types & scoring logic ──────────────────── */
type Answer = 'yes' | 'no' | 'na' | null;
interface QuizAnswers {
  life: Answer;
  health: Answer;
  vehicle: Answer;
  homeTravel: Answer;
}

interface ScoreResult {
  score: number;
  life: number;
  health: number;
  vehicle: number;
  bonus: number;
  tier: 'excellent' | 'good' | 'fair' | 'risk';
  gaps: string[];
}

function computeProtectionScore(answers: QuizAnswers): ScoreResult {
  let life = 0, health = 0, vehicle = 0, bonus = 0;
  const gaps: string[] = [];

  if (answers.life === 'yes') life = 35;
  else gaps.push('life');

  if (answers.health === 'yes') health = 35;
  else gaps.push('health');

  // Vehicle: N/A (don't own) counts as full marks; Yes = full; No = 0 (gap)
  if (answers.vehicle === 'na' || answers.vehicle === 'yes') vehicle = 15;
  else gaps.push('vehicle');

  if (answers.homeTravel === 'yes') bonus = 15;

  const score = life + health + vehicle + bonus;
  let tier: ScoreResult['tier'];
  if (score >= 85) tier = 'excellent';
  else if (score >= 65) tier = 'good';
  else if (score >= 40) tier = 'fair';
  else tier = 'risk';

  return { score, life, health, vehicle, bonus, tier, gaps };
}

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
      className="card-midnight-brass p-6 flex flex-col h-full group"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}25`, boxShadow: `0 0 24px ${color}18` }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }} />
      </div>

      <h3 className="font-display text-base sm:text-lg font-medium text-brass-heading leading-snug mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-brass-body leading-relaxed flex-1 mb-5">
        {desc}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-[rgba(201,168,76,0.15)]">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brass-heading px-3.5 py-1.5 rounded-full border border-[rgba(201,168,76,0.35)] bg-[rgba(201,168,76,0.10)]">
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

  /* ── Protection Score Quiz state ── */
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0); // 0..3 questions, 4 = result
  const [answers, setAnswers] = useState<QuizAnswers>({ life: null, health: null, vehicle: null, homeTravel: null });
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [animatedScore, setAnimatedScore] = useState<number | null>(null); // null = demo 87

  // Lock body scroll when modal open
  useEffect(() => {
    if (quizOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [quizOpen]);

  // Animate the score count-up when result is computed
  useEffect(() => {
    if (!result || animatedScore !== null) return;
    let rafId: number;
    const target = result.score;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setAnimatedScore(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setAnimatedScore(target);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [result, animatedScore]);

  // Refs to read latest state inside async callback without side-effects in updaters
  // Clean handler — sets answer, then advances step (and computes result on last Q)
  const handleAnswer = useCallback((key: keyof QuizAnswers, value: Answer) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    window.setTimeout(() => {
      if (quizStep >= 3) {
        setResult(computeProtectionScore(next));
        setQuizStep(4);
      } else {
        setQuizStep(quizStep + 1);
      }
    }, 240);
  }, [answers, quizStep]);

  const resetQuiz = useCallback(() => {
    setAnswers({ life: null, health: null, vehicle: null, homeTravel: null });
    setResult(null);
    setAnimatedScore(null);
    setQuizStep(0);
  }, []);

  const closeQuiz = useCallback(() => {
    setQuizOpen(false);
    // keep result so the score circle shows the user's actual score after closing
    setTimeout(() => {
      if (!result) resetQuiz();
    }, 300);
  }, [result, resetQuiz]);

  // Display score: user's computed score if available, else demo 87
  const displayScore = animatedScore !== null ? animatedScore : 87;
  const hasUserScore = result !== null;

  const badge = isHindi ? 'जल्द आ रहा है' : isEnglish ? 'Coming Soon' : 'Jald aa raha hai';
  const heading = isHindi ? 'अपना जानें' : isEnglish ? 'Discover Your' : 'Apna jaanein';
  const headingAccent = isHindi ? 'सुरक्षा स्कोर' : isEnglish ? 'Protection Score' : 'Protection Score';
  const outOf = isHindi ? '100 में से' : isEnglish ? 'out of 100' : '100 mein se';
  const scoreLabels = {
    life: { en: 'Life', hi: 'जीवन', hg: 'Jeevan' },
    health: { en: 'Health', hi: 'स्वास्थ्य', hg: 'Swasthya' },
    vehicle: { en: 'Vehicle', hi: 'वाहन', hg: 'Vahan' },
  };

  // Tier labels (reactive)
  const tierLabels = {
    excellent: { en: 'Excellent Protection', hi: 'उत्कृष्ट सुरक्षा', hg: 'Excellent Suraksha' },
    good: { en: 'Good Protection', hi: 'अच्छी सुरक्षा', hg: 'Achhi Suraksha' },
    fair: { en: 'Fair — Gaps Found', hi: 'ठीक — कमियां मिलीं', hg: 'Theek — KAMIYAN mili' },
    risk: { en: 'At Risk — Act Now', hi: 'जोखिम में — अभी करें', hg: 'Risk mein — Abhi karein' },
  };
  const goodProtection = isHindi ? 'अच्छी सुरक्षा' : isEnglish ? 'Good Protection' : 'Achhi Suraksha';
  const tierLabel = result ? (isHindi ? tierLabels[result.tier].hi : isEnglish ? tierLabels[result.tier].en : tierLabels[result.tier].hg) : goodProtection;

  // Tier color for the badge
  const tierColors: Record<ScoreResult['tier'], string> = {
    excellent: '#4FB3A9', // teal
    good: '#4FB3A9',
    fair: '#C9A84C',      // brass
    risk: '#D4633F',      // sienna
  };

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
  const recalcText = isHindi ? 'फिर से गणना करें' : isEnglish ? 'Recalculate' : 'Phir se calculate karein';

  // Quiz questions
  const quizQuestions = [
    {
      key: 'life' as keyof QuizAnswers,
      title: isHindi ? 'क्या आपके पास जीवन/टर्म बीमा है?' : isEnglish ? 'Do you have Life / Term insurance?' : 'Kya aapke paas Life/Term insurance hai?',
      options: [
        { value: 'yes' as Answer, label: isHindi ? 'हाँ, है' : isEnglish ? 'Yes, I do' : 'Haan, hai' },
        { value: 'no' as Answer, label: isHindi ? 'नहीं' : isEnglish ? 'No' : 'Nahi' },
      ],
    },
    {
      key: 'health' as keyof QuizAnswers,
      title: isHindi ? 'क्या आपके पास हेल्थ बीमा है?' : isEnglish ? 'Do you have Health insurance?' : 'Kya aapke paas Health insurance hai?',
      options: [
        { value: 'yes' as Answer, label: isHindi ? 'हाँ, है' : isEnglish ? 'Yes, I do' : 'Haan, hai' },
        { value: 'no' as Answer, label: isHindi ? 'नहीं' : isEnglish ? 'No' : 'Nahi' },
      ],
    },
    {
      key: 'vehicle' as keyof QuizAnswers,
      title: isHindi ? 'क्या आपके पास वाहन (कार/बाइक) बीमा है?' : isEnglish ? 'Do you have Vehicle (car/bike) insurance?' : 'Kya aapke paas Vehicle (car/bike) insurance hai?',
      options: [
        { value: 'yes' as Answer, label: isHindi ? 'हाँ, है' : isEnglish ? 'Yes, I do' : 'Haan, hai' },
        { value: 'no' as Answer, label: isHindi ? 'नहीं' : isEnglish ? 'No' : 'Nahi' },
        { value: 'na' as Answer, label: isHindi ? 'वाहन नहीं है' : isEnglish ? "Don't own a vehicle" : 'Vehicle nahi hai' },
      ],
    },
    {
      key: 'homeTravel' as keyof QuizAnswers,
      title: isHindi ? 'क्या आपके पास होम या ट्रैवल बीमा भी है?' : isEnglish ? 'Do you also have Home or Travel insurance?' : 'Kya aapke paas Home ya Travel insurance bhi hai?',
      options: [
        { value: 'yes' as Answer, label: isHindi ? 'हाँ, है' : isEnglish ? 'Yes, I do' : 'Haan, hai' },
        { value: 'no' as Answer, label: isHindi ? 'नहीं' : isEnglish ? 'No' : 'Nahi' },
      ],
    },
  ];

  // Gap recommendations
  const gapRecommendations: Record<string, { en: string; hi: string; hg: string }> = {
    life: { en: 'Get a Term Life plan — 10× your annual income, starting ₹489/mo', hi: 'टर्म लाइफ प्लान लें — आपकी वार्षिक आय का 10 गुना, ₹489/माह से', hg: 'Term Life plan lein — aapki annual income ka 10 guna, ₹489/mah se' },
    health: { en: 'Add Health cover — family floater, cashless, from ₹499/mo', hi: 'हेल्थ कवर लें — फैमिली फ्लोटर, कैशलेस, ₹499/माह से', hg: 'Health cover lein — family floater, cashless, ₹499/mah se' },
    vehicle: { en: 'Insure your vehicle — comprehensive cover from ₹714/yr', hi: 'अपना वाहन बीमित करें — व्यापक कवर ₹714/वर्ष से', hg: 'Apna vehicle insure karein — comprehensive cover ₹714/varsh se' },
  };

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

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => { resetQuiz(); setQuizOpen(true); }}
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
                {hasUserScore ? recalcText : ctaText}
                <ArrowUpRight className="h-4 w-4" />
              </button>
              {hasUserScore && (
                <button
                  onClick={() => setQuizOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(201,168,76,0.35)] bg-[rgba(201,168,76,0.10)] text-[#C9A84C] text-sm font-body font-medium hover:bg-[rgba(201,168,76,0.18)] transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {isHindi ? 'विवरण देखें' : isEnglish ? 'View breakdown' : 'Breakdown dekhein'}
                </button>
              )}
            </div>
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
                  {/* Animated progress — reactive to displayScore */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#scoreGradientDark)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="534"
                    animate={{ strokeDashoffset: 534 - (534 * displayScore) / 100 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
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
                  <div>
                    <div
                      className="font-display text-7xl font-medium tracking-tight text-white tabular-nums"
                      key={displayScore}
                    >
                      {displayScore}
                    </div>
                  </div>
                  <div className="text-base sm:text-lg text-[#8B9099] mt-1">{outOf}</div>
                  <div
                    className="mt-5 px-4 py-2 rounded-full border backdrop-blur-sm transition-colors duration-300"
                    style={{
                      backgroundColor: `${result ? tierColors[result.tier] : '#2D7A77'}20`,
                      borderColor: `${result ? tierColors[result.tier] : '#2D7A77'}59`,
                    }}
                  >
                    <span
                      className="text-sm font-semibold font-display tracking-wide"
                      style={{ color: result ? tierColors[result.tier] : '#E6EFEE' }}
                    >
                      {tierLabel}
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
                <div className="card-midnight-brass p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-medium font-display tabular-nums text-brass-accent">
                        {result ? Math.round((result.life / 35) * 100) : 92}%
                      </div>
                      <div className="text-caption-premium text-brass-body mt-1">{isHindi ? scoreLabels.life.hi : isEnglish ? scoreLabels.life.en : scoreLabels.life.hg}</div>
                    </div>
                    <div className="border-x border-[rgba(255,255,255,0.06)]">
                      <div className="text-xl font-medium font-display tabular-nums text-brass-accent">
                        {result ? Math.round((result.health / 35) * 100) : 85}%
                      </div>
                      <div className="text-caption-premium text-brass-body mt-1">{isHindi ? scoreLabels.health.hi : isEnglish ? scoreLabels.health.en : scoreLabels.health.hg}</div>
                    </div>
                    <div>
                      <div className="text-xl font-medium font-display tabular-nums text-brass-accent">
                        {result ? Math.round((result.vehicle / 15) * 100) : 84}%
                      </div>
                      <div className="text-caption-premium text-brass-body mt-1">{isHindi ? scoreLabels.vehicle.hi : isEnglish ? scoreLabels.vehicle.en : scoreLabels.vehicle.hg}</div>
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

      {/* ═══ PROTECTION SCORE QUIZ MODAL ═══ */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeQuiz}
              aria-hidden="true"
            />

            {/* Modal — Midnight Brass card */}
            <motion.div
              className="relative card-midnight-brass w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="quiz-title"
            >
              {/* Close button */}
              <button
                onClick={closeQuiz}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-brass-body hover:text-brass-heading hover:bg-[rgba(201,168,76,0.10)] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {quizStep < 4 ? (
                  /* ── Question step ── */
                  <motion.div
                    key={`q-${quizStep}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Progress dots */}
                    <div className="flex items-center gap-2 mb-6">
                      {quizQuestions.map((_, i) => (
                        <div
                          key={i}
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: i === quizStep ? '28px' : '10px',
                            backgroundColor: i <= quizStep ? '#C9A84C' : 'rgba(201,168,76,0.20)',
                          }}
                        />
                      ))}
                      <span className="ml-auto text-xs text-brass-body font-body tabular-nums">
                        {quizStep + 1} / {quizQuestions.length}
                      </span>
                    </div>

                    {/* Question */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] mb-4">
                      <Shield className="w-3.5 h-3.5 text-brass-accent" />
                      <span className="text-caption-premium text-brass-accent">
                        {isHindi ? 'सुरक्षा जांच' : isEnglish ? 'Protection Check' : 'Suraksha Check'}
                      </span>
                    </div>
                    <h3 id="quiz-title" className="font-display text-xl sm:text-2xl font-medium text-brass-heading leading-snug mb-6 tracking-tight">
                      {quizQuestions[quizStep].title}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {quizQuestions[quizStep].options.map((opt) => {
                        const selected = answers[quizQuestions[quizStep].key] === opt.value;
                        return (
                          <button
                            key={String(opt.value)}
                            onClick={() => handleAnswer(quizQuestions[quizStep].key, opt.value)}
                            className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl border text-left transition-all duration-200 ${
                              selected
                                ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.14)]'
                                : 'border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(201,168,76,0.35)] hover:bg-[rgba(201,168,76,0.06)]'
                            }`}
                          >
                            <span className={`font-body text-base ${selected ? 'text-brass-heading' : 'text-brass-body'}`}>
                              {opt.label}
                            </span>
                            <span
                              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selected ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-[rgba(201,168,76,0.35)]'
                              }`}
                            >
                              {selected && <Check className="w-3 h-3 text-[#0E1424]" strokeWidth={3} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Back button (if not first) */}
                    {quizStep > 0 && (
                      <button
                        onClick={() => setQuizStep(s => Math.max(0, s - 1))}
                        className="mt-5 text-sm text-brass-body hover:text-brass-accent font-body transition-colors"
                      >
                        ← {isHindi ? 'पिछला' : isEnglish ? 'Back' : 'Pichla'}
                      </button>
                    )}
                  </motion.div>
                ) : (
                  /* ── Result step ── */
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4"
                        style={{
                          borderColor: `${tierColors[result!.tier]}59`,
                          backgroundColor: `${tierColors[result!.tier]}20`,
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5" style={{ color: tierColors[result!.tier] }} />
                        <span className="text-caption-premium" style={{ color: tierColors[result!.tier] }}>
                          {isHindi ? 'आपका स्कोर तैयार' : isEnglish ? 'Your score is ready' : 'Aapka score ready hai'}
                        </span>
                      </div>

                      {/* Big score number */}
                      <div className="font-display text-7xl sm:text-8xl font-medium tabular-nums tracking-tight my-2"
                        style={{ color: tierColors[result!.tier] }}
                      >
                        {result!.score}
                      </div>
                      <div className="text-sm text-brass-body mb-3">{outOf}</div>

                      <div className="inline-block px-4 py-2 rounded-full border mb-6"
                        style={{
                          borderColor: `${tierColors[result!.tier]}59`,
                          backgroundColor: `${tierColors[result!.tier]}20`,
                        }}
                      >
                        <span className="text-sm font-semibold font-display tracking-wide"
                          style={{ color: tierColors[result!.tier] }}
                        >
                          {isHindi ? tierLabels[result!.tier].hi : isEnglish ? tierLabels[result!.tier].en : tierLabels[result!.tier].hg}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown bars */}
                    <div className="space-y-3 mb-6">
                      {[
                        { label: isHindi ? scoreLabels.life.hi : isEnglish ? scoreLabels.life.en : scoreLabels.life.hg, val: result!.life, max: 35 },
                        { label: isHindi ? scoreLabels.health.hi : isEnglish ? scoreLabels.health.en : scoreLabels.health.hg, val: result!.health, max: 35 },
                        { label: isHindi ? scoreLabels.vehicle.hi : isEnglish ? scoreLabels.vehicle.en : scoreLabels.vehicle.hg, val: result!.vehicle, max: 15 },
                        { label: isHindi ? 'बोनस (होम/ट्रैवल)' : isEnglish ? 'Bonus (Home/Travel)' : 'Bonus (Home/Travel)', val: result!.bonus, max: 15 },
                      ].map((row) => (
                        <div key={row.label}>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-brass-body font-body">{row.label}</span>
                            <span className="text-brass-heading font-body tabular-nums">{row.val}/{row.max}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: row.val > 0 ? '#C9A84C' : 'rgba(255,255,255,0.15)' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(row.val / row.max) * 100}%` }}
                              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Gaps + recommendations */}
                    {result!.gaps.length > 0 ? (
                      <div className="rounded-xl border border-[rgba(212,99,63,0.25)] bg-[rgba(212,99,63,0.08)] p-4 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-[#D4633F] flex-shrink-0" />
                          <span className="text-sm font-semibold text-brass-heading font-body">
                            {isHindi ? `${result!.gaps.length} कमी मिली` : isEnglish ? `${result!.gaps.length} gap${result!.gaps.length > 1 ? 's' : ''} found` : `${result!.gaps.length} gap mili`}
                          </span>
                        </div>
                        <ul className="space-y-2.5">
                          {result!.gaps.map((g) => (
                            <li key={g} className="flex items-start gap-2.5 text-sm text-brass-body font-body">
                              <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4633F]" />
                              <span>{isHindi ? gapRecommendations[g]?.hi : isEnglish ? gapRecommendations[g]?.en : gapRecommendations[g]?.hg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-[rgba(79,179,169,0.30)] bg-[rgba(79,179,169,0.08)] p-4 mb-6 flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#4FB3A9] flex-shrink-0" />
                        <span className="text-sm text-brass-heading font-body">
                          {isHindi ? 'बधाई! आपके पास सभी ज़रूरी कवर हैं।' : isEnglish ? 'Great! You have all essential covers.' : 'Badhai! Aapke paas saari zaroori covers hain.'}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          const el = document.getElementById('advisor-form');
                          closeQuiz();
                          if (el) {
                            setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
                          } else {
                            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
                          }
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FAF7F2] text-[#0E1116] font-body font-semibold text-sm hover:bg-[#D4633F] hover:text-white transition-colors"
                      >
                        {isHindi ? 'फ्री सलाह लें' : isEnglish ? 'Get free advice' : 'Free salah lein'}
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={resetQuiz}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[rgba(201,168,76,0.35)] bg-[rgba(201,168,76,0.08)] text-[#C9A84C] font-body font-medium text-sm hover:bg-[rgba(201,168,76,0.16)] transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        {recalcText}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
