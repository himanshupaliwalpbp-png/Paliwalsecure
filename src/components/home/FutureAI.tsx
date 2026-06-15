'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Check, Heart, Car, Home as HomeIcon, Users, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Types ─────────────────────────────────────────────────────────── */
// Quiz step: 0 = landing, 1-4 = questions, 5 = results
type QuizPhase = 'landing' | 'quiz' | 'results';

interface ScoreResult {
  total: number;
  life: number;
  health: number;
  vehicle: number;
  level: 'excellent' | 'good' | 'fair' | 'needs-work';
}

/* ── Score calculation ──────────────────────────────────────────── */
function calculateScore(
  selectedTypes: number[],  // Q1: array of selected insurance type values
  familySize: number,       // Q2: 1-4
  checkupRecency: number,   // Q3: 1-4 (1=recent, 4=never)
  policyReview: number      // Q4: 1-3 (1=yes regularly, 3=no)
): ScoreResult {
  // Check which insurance types are actually selected
  // Q1 options: 1=Health, 2=Life, 3=Vehicle, 4=Home/Travel
  const hasHealth = selectedTypes.includes(1);
  const hasLife = selectedTypes.includes(2);
  const hasVehicle = selectedTypes.includes(3);
  const hasHome = selectedTypes.includes(4);
  const insuranceCount = selectedTypes.length;

  // Health score: based on having health insurance, recent checkup, and coverage breadth
  let healthScore = 15
    + (hasHealth ? 35 : 0)
    + (checkupRecency === 1 ? 25 : checkupRecency === 2 ? 15 : 5)
    + (insuranceCount >= 2 ? 15 : 0)
    + (hasHome ? 5 : 0);

  // Life score: based on having life insurance, family size coverage, and policy review
  let lifeScore = 15
    + (hasLife ? 35 : 0)
    + (familySize <= 2 ? 20 : familySize <= 3 ? 15 : 5)
    + (policyReview === 1 ? 20 : policyReview === 2 ? 10 : 0)
    + (insuranceCount >= 2 ? 5 : 0);

  // Vehicle score: based on having vehicle insurance, policy review, and overall coverage
  let vehicleScore = 15
    + (hasVehicle ? 40 : 0)
    + (policyReview === 1 ? 20 : policyReview === 2 ? 10 : 0)
    + (insuranceCount >= 3 ? 15 : 0)
    + (hasHome ? 5 : 0);

  // Clamp scores
  healthScore = Math.min(100, Math.max(15, healthScore));
  lifeScore = Math.min(100, Math.max(15, lifeScore));
  vehicleScore = Math.min(100, Math.max(15, vehicleScore));

  const total = Math.round((healthScore + lifeScore + vehicleScore) / 3);

  let level: ScoreResult['level'] = 'needs-work';
  if (total >= 80) level = 'excellent';
  else if (total >= 60) level = 'good';
  else if (total >= 40) level = 'fair';

  return { total, life: lifeScore, health: healthScore, vehicle: vehicleScore, level };
}

function getLevelLabel(level: ScoreResult['level'], isHindi: boolean, isEnglish: boolean) {
  const labels = {
    excellent: { en: 'Excellent Protection', hi: 'उत्कृष्ट सुरक्षा', hg: 'Excellent Protection' },
    good: { en: 'Good Protection', hi: 'अच्छी सुरक्षा', hg: 'Good Protection' },
    fair: { en: 'Fair Protection', hi: 'औसत सुरक्षा', hg: 'Fair Protection' },
    'needs-work': { en: 'Needs Improvement', hi: 'सुधार ज़रूरी', hg: 'Needs Improvement' },
  };
  const l = labels[level];
  return isHindi ? l.hi : isEnglish ? l.en : l.hg;
}

function getLevelColor(level: ScoreResult['level']) {
  switch (level) {
    case 'excellent': return '#10B981';
    case 'good': return '#2563EB';
    case 'fair': return '#F59E0B';
    case 'needs-work': return '#EF4444';
  }
}

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

const featureColors = ['#2563EB', '#10B981', '#2563EB', '#8B5CF6'];

/* ── Quiz questions data ────────────────────────────────────────── */
interface QuizOption {
  value: number;
  label: { en: string; hi: string; hg: string };
  icon?: React.ElementType;
}

interface QuizQuestion {
  id: number;
  question: { en: string; hi: string; hg: string };
  options: QuizOption[];
  multiSelect?: boolean;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: {
      en: 'Which insurance do you currently have?',
      hi: 'आपके पास अभी कौन सा बीमा है?',
      hg: 'Aapke paas abhi kaun sa insurance hai?',
    },
    options: [
      { value: 1, label: { en: 'Health Insurance', hi: 'हेल्थ इंश्योरेंस', hg: 'Health Insurance' }, icon: Heart },
      { value: 2, label: { en: 'Life Insurance', hi: 'लाइफ इंश्योरेंस', hg: 'Life Insurance' }, icon: Shield },
      { value: 3, label: { en: 'Vehicle Insurance', hi: 'व्हीकल इंश्योरेंस', hg: 'Vehicle Insurance' }, icon: Car },
      { value: 4, label: { en: 'Home / Travel Insurance', hi: 'होम / ट्रैवल इंश्योरेंस', hg: 'Home / Travel Insurance' }, icon: HomeIcon },
    ],
    multiSelect: true,
  },
  {
    id: 2,
    question: {
      en: 'How many family members need coverage?',
      hi: 'कितने परिवार के सदस्यों को कवरेज चाहिए?',
      hg: 'Kitne parivaar ke sadasyon ko coverage chahiye?',
    },
    options: [
      { value: 1, label: { en: 'Just me', hi: 'सिर्फ मैं', hg: 'Just me' }, icon: Users },
      { value: 2, label: { en: '2-3 members', hi: '2-3 सदस्य', hg: '2-3 members' }, icon: Users },
      { value: 3, label: { en: '4-5 members', hi: '4-5 सदस्य', hg: '4-5 members' }, icon: Users },
      { value: 4, label: { en: '6+ members', hi: '6+ सदस्य', hg: '6+ members' }, icon: Users },
    ],
  },
  {
    id: 3,
    question: {
      en: 'When did you last get a health checkup?',
      hi: 'आपने आखिरी बार हेल्थ चेकअप कब करवाया?',
      hg: 'Aapne aakhri baar health checkup kab karvaya?',
    },
    options: [
      { value: 1, label: { en: 'Within last 6 months', hi: 'पिछले 6 महीने में', hg: 'Within last 6 months' } },
      { value: 2, label: { en: '6-12 months ago', hi: '6-12 महीने पहले', hg: '6-12 months ago' } },
      { value: 3, label: { en: 'More than a year', hi: 'एक साल से ज़्यादा', hg: 'More than a year' } },
      { value: 4, label: { en: 'Never', hi: 'कभी नहीं', hg: 'Never' } },
    ],
  },
  {
    id: 4,
    question: {
      en: 'Have you reviewed your policies in the last year?',
      hi: 'क्या आपने पिछले साल अपनी पॉलिसी की समीक्षा की?',
      hg: 'Kya aapne pichle saal apni policy ki samiksha ki?',
    },
    options: [
      { value: 1, label: { en: 'Yes, I review regularly', hi: 'हाँ, मैं नियमित रूप से जांचता हूँ', hg: 'Yes, I review regularly' } },
      { value: 2, label: { en: 'No, but I plan to', hi: 'नहीं, लेकिन मैं करूँगा', hg: 'No, but I plan to' } },
      { value: 3, label: { en: "No, I haven't", hi: 'नहीं, मैंने नहीं किया', hg: "No, I haven't" } },
    ],
  },
];

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
      className="premium-card bg-white/[0.06] dark:bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] dark:border-white/[0.06] rounded-2xl p-6 flex flex-col h-full group transition-all duration-500 hover:bg-white/[0.1] dark:hover:bg-white/[0.08] hover:border-white/[0.15] dark:hover:border-white/[0.12]"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}18`, boxShadow: `0 0 20px ${color}10` }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }} />
      </div>

      <h3 className="font-heading text-base sm:text-lg font-bold text-white leading-snug mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-white/50 leading-relaxed flex-1 mb-5 font-sans">
        {desc}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2563EB] px-3 py-1.5 rounded-full bg-[#2563EB]/[0.08] border border-[#2563EB]/[0.15] font-heading">
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

  // Quiz state
  const [phase, setPhase] = useState<QuizPhase>('landing');
  const [currentStep, setCurrentStep] = useState(1); // 1-4
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]); // Q1 multi-select
  const [singleAnswers, setSingleAnswers] = useState<Record<number, number>>({}); // Q2-Q4
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

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
  const nextText = isHindi ? 'अगला' : isEnglish ? 'Next' : 'Next';
  const backText = isHindi ? 'पीछे' : isEnglish ? 'Back' : 'Back';
  const retakeText = isHindi ? 'फिर से करें' : isEnglish ? 'Retake Quiz' : 'Retake Quiz';
  const talkAdvisorText = isHindi ? 'Advisor से बात करें' : isEnglish ? 'Talk to Advisor' : 'Advisor se baat karein';

  // Handlers
  const handleStartQuiz = useCallback(() => {
    setPhase('quiz');
    setCurrentStep(1);
    setSelectedTypes([]);
    setSingleAnswers({});
    setScoreResult(null);
  }, []);

  const handleCancel = useCallback(() => {
    setPhase('landing');
    setCurrentStep(1);
    setSelectedTypes([]);
    setSingleAnswers({});
    setScoreResult(null);
  }, []);

  const handleToggleType = useCallback((value: number) => {
    setSelectedTypes(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }, []);

  const handleSelectAnswer = useCallback((questionId: number, value: number) => {
    setSingleAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(s => s + 1);
    } else {
      // Calculate score
      const familySize = singleAnswers[2] || 1;
      const checkupRecency = singleAnswers[3] || 4;
      const policyReview = singleAnswers[4] || 3;
      const result = calculateScore(selectedTypes, familySize, checkupRecency, policyReview);
      setScoreResult(result);
      setPhase('results');
    }
  }, [currentStep, selectedTypes, singleAnswers]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    } else {
      handleCancel();
    }
  }, [currentStep, handleCancel]);

  // Current question data
  const currentQuestion = quizQuestions.find(q => q.id === currentStep);
  const canProceed = currentStep === 1
    ? selectedTypes.length > 0
    : (singleAnswers[currentStep] !== undefined);

  // Score circle values
  const displayScore = scoreResult?.total ?? null;
  const displayLevel = scoreResult?.level ?? null;

  return (
    <section className="section-luxury bg-[#111111] dark:bg-[#111111] text-white overflow-hidden relative">
      {/* Premium ambient background — layered depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#2563EB]/[0.07] rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#10B981]/[0.06] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#2563EB]/[0.03] rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Left Column: Content / Quiz */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              {/* ── Landing State ── */}
              {phase === 'landing' && (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.06] backdrop-blur-sm rounded-full border border-white/[0.08] mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                    <Shield className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span className="text-xs font-semibold font-heading tracking-wide uppercase text-white/80">
                      {isHindi ? 'मुफ्त सुरक्षा विश्लेषण' : isEnglish ? 'Free Protection Analysis' : 'Free Protection Analysis'}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold mb-6 font-heading leading-[1.1] tracking-tight">
                    {heading}{' '}
                    <span className="gradient-luxury">{headingAccent}</span>
                  </h2>

                  <p className="text-lg text-white/50 mb-10 leading-relaxed font-sans max-w-lg">
                    {subtitle}
                  </p>

                  <div className="space-y-4 mb-10">
                    {checklistItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#10B981]/[0.1] border border-[#10B981]/[0.15] flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-[#10B981]" strokeWidth={2.5} />
                        </div>
                        <span className="text-[0.9375rem] text-white/75 font-sans">
                          {isHindi ? item.hi : isEnglish ? item.en : item.hg}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleStartQuiz}
                    className="btn-luxury-gold btn-luxury-lg group"
                  >
                    {ctaText}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </motion.div>
              )}

              {/* ── Quiz State ── */}
              {phase === 'quiz' && currentQuestion && (
                <motion.div
                  key={`quiz-${currentStep}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Progress */}
                  <div className="flex items-center gap-3 mb-8">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            s < currentStep
                              ? 'bg-[#2563EB] text-white'
                              : s === currentStep
                                ? 'bg-[#2563EB] text-white ring-2 ring-[#2563EB]/30'
                                : 'bg-white/[0.06] text-white/30 border border-white/[0.08]'
                          }`}
                        >
                          {s < currentStep ? <Check className="w-4 h-4" /> : s}
                        </div>
                        {s < 4 && (
                          <div className={`w-8 h-0.5 ${s < currentStep ? 'bg-[#2563EB]' : 'bg-white/[0.06]'}`} />
                        )}
                      </div>
                    ))}
                    <span className="ml-auto text-sm text-white/40 font-sans">{currentStep}/4</span>
                  </div>

                  {/* Question */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-8 font-heading leading-tight">
                    {isHindi ? currentQuestion.question.hi : isEnglish ? currentQuestion.question.en : currentQuestion.question.hg}
                  </h3>

                  {/* Options */}
                  <div className="grid gap-3 mb-8">
                    {currentQuestion.options.map((option) => {
                      const Icon = option.icon;
                      const isSelected = currentStep === 1
                        ? selectedTypes.includes(option.value)
                        : singleAnswers[currentStep] === option.value;
                      return (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => {
                            if (currentStep === 1) {
                              handleToggleType(option.value);
                            } else {
                              handleSelectAnswer(currentStep, option.value);
                            }
                          }}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left group ${
                            isSelected
                              ? 'bg-[#2563EB]/[0.12] border-[#2563EB]/[0.4] shadow-[0_0_20px_rgba(37,99,235,0.08)]'
                              : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]'
                          }`}
                        >
                          {Icon && (
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                              isSelected ? 'bg-[#2563EB]/20' : 'bg-white/[0.06]'
                            }`}>
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-[#2563EB]' : 'text-white/50'}`} />
                            </div>
                          )}
                          <span className={`text-base font-medium font-sans ${isSelected ? 'text-[#2563EB]' : 'text-white/70'}`}>
                            {isHindi ? option.label.hi : isEnglish ? option.label.en : option.label.hg}
                          </span>
                          {isSelected && (
                            <Check className="w-5 h-5 text-[#2563EB] ml-auto" strokeWidth={2.5} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors font-sans"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {currentStep > 1 ? backText : (isHindi ? 'रद्द करें' : isEnglish ? 'Cancel' : 'Cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed}
                      className={`btn-luxury-gold btn-luxury-lg group ${!canProceed ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {currentStep === 4 ? ctaText : nextText}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Results State ── */}
              {phase === 'results' && scoreResult && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#10B981]/[0.1] backdrop-blur-sm rounded-full border border-[#10B981]/[0.15] mb-8">
                    <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    <span className="text-xs font-semibold font-heading tracking-wide uppercase text-[#10B981]">
                      {isHindi ? 'विश्लेषण पूर्ण' : isEnglish ? 'Analysis Complete' : 'Analysis Complete'}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-heading leading-[1.1] tracking-tight">
                    {isHindi ? 'आपका' : isEnglish ? 'Your' : 'Aapka'}{' '}
                    <span className="gradient-luxury">{headingAccent}</span>
                  </h2>

                  <p className="text-lg text-white/50 mb-8 leading-relaxed font-sans">
                    {isHindi
                      ? 'आपके उत्तरों के आधार पर AI-संचालित विश्लेषण'
                      : isEnglish
                        ? 'AI-powered analysis based on your answers'
                        : 'AI-powered analysis based on your answers'}
                  </p>

                  {/* Score Breakdown Cards */}
                  <div className="space-y-3 mb-8">
                    {[
                      { label: isHindi ? 'स्वास्थ्य सुरक्षा' : isEnglish ? 'Health Protection' : 'Health Protection', value: scoreResult.health, color: '#10B981' },
                      { label: isHindi ? 'जीवन सुरक्षा' : isEnglish ? 'Life Protection' : 'Life Protection', value: scoreResult.life, color: '#2563EB' },
                      { label: isHindi ? 'वाहन सुरक्षा' : isEnglish ? 'Vehicle Protection' : 'Vehicle Protection', value: scoreResult.vehicle, color: '#F59E0B' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        <span className="text-sm text-white/60 font-sans min-w-[130px]">{item.label}</span>
                        <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.2 }}
                          />
                        </div>
                        <span className="text-sm font-bold font-heading min-w-[40px] text-right" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleStartQuiz}
                      className="btn-luxury-secondary btn-luxury-lg !border-white/[0.15] !text-white/80 !bg-white/[0.04] hover:!bg-white/[0.08] hover:!border-white/[0.25] hover:!text-white"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {retakeText}
                    </button>
                    <a
                      href="https://wa.me/919257877312"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-luxury-gold btn-luxury-lg group"
                    >
                      {talkAdvisorText}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Visual Score Circle */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-[#2563EB]/[0.06] via-transparent to-[#10B981]/[0.06] blur-xl" />

              <div className="aspect-square relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="14" />
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
                    animate={displayScore !== null
                      ? { strokeDashoffset: 534 - (534 * displayScore) / 100 }
                      : { strokeDashoffset: 534 }
                    }
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <defs>
                    <linearGradient id="scoreGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={displayLevel ? getLevelColor(displayLevel) : '#2563EB'} />
                      <stop offset="50%" stopColor={displayLevel ? getLevelColor(displayLevel) : '#60A5FA'} />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {phase === 'quiz' ? (
                    /* Quiz in progress indicator */
                    <motion.div
                      key={`quiz-circle-${currentStep}`}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="text-center"
                    >
                      <div className="text-7xl font-bold font-heading tracking-tight text-[#2563EB]">
                        {currentStep}
                      </div>
                      <div className="text-base text-white/40 font-sans mt-1">of 4</div>
                      <div className="mt-5 px-4 py-2 bg-white/[0.06] rounded-full border border-white/[0.08] backdrop-blur-sm">
                        <span className="text-xs font-semibold font-heading tracking-wide text-[#2563EB]">
                          {isHindi ? 'क्विज़ जारी' : isEnglish ? 'Quiz in Progress' : 'Quiz in Progress'}
                        </span>
                      </div>
                    </motion.div>
                  ) : displayScore !== null ? (
                    /* Results score */
                    <motion.div
                      key={`score-${displayScore}`}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="text-center"
                    >
                      <div className="text-7xl font-bold font-heading tracking-tight text-white">
                        {displayScore}
                      </div>
                      <div className="text-base text-white/40 font-sans mt-1">out of 100</div>
                      <div className="mt-5 px-4 py-2 bg-white/[0.06] rounded-full border border-white/[0.08] backdrop-blur-sm">
                        <span className="text-xs font-semibold font-heading tracking-wide" style={{ color: getLevelColor(displayLevel!) }}>
                          {getLevelLabel(displayLevel!, isHindi, isEnglish)}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    /* Landing placeholder */
                    <motion.div
                      key="landing-circle"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="text-center"
                    >
                      <div className="text-7xl font-bold font-heading tracking-tight text-white/20">
                        ?
                      </div>
                      <div className="text-base text-white/40 font-sans mt-1">out of 100</div>
                      <div className="mt-5 px-4 py-2 bg-white/[0.06] rounded-full border border-white/[0.08] backdrop-blur-sm">
                        <span className="text-xs font-semibold font-heading tracking-wide text-[#2563EB]">
                          {isHindi ? 'अपना स्कोर जानें' : isEnglish ? 'Discover Your Score' : 'Apna Score Jaanein'}
                        </span>
                      </div>
                    </motion.div>
                  )}
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
                <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl p-5 border border-white/[0.08]">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold gradient-luxury font-heading">{scoreResult?.life ?? '--'}%</div>
                      <div className="text-[11px] text-white/40 font-sans mt-0.5">Life</div>
                    </div>
                    <div className="border-x border-white/[0.06]">
                      <div className="text-xl font-bold gradient-text-blue-emerald font-heading">{scoreResult?.health ?? '--'}%</div>
                      <div className="text-[11px] text-white/40 font-sans mt-0.5">Health</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white/90 font-heading">{scoreResult?.vehicle ?? '--'}%</div>
                      <div className="text-[11px] text-white/40 font-sans mt-0.5">Vehicle</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Feature cards grid — below the quiz section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {['feature1', 'feature2', 'feature3', 'feature4'].map((featureKey, index) => (
            <FeatureCard
              key={featureKey}
              featureKey={featureKey}
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
