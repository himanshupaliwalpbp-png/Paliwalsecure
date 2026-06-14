'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  Users,
  MapPin,
  IndianRupee,
  ChevronRight,
  Star,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

// ── Types ──────────────────────────────────────────────────────────────────────
interface AdvisorFormData {
  age: number;
  familySize: number;
  city: string;
  budget: number;
}

interface PlanRecommendation {
  insurer: string;
  plan: string;
  monthlyPremium: string;
  sumInsured: string;
  whyItFits: string;
  claimRatio: string;
  rating: number;
}

interface AdvisorResult {
  success: boolean;
  plans?: PlanRecommendation[];
  advisorMessage?: string;
  followUpQuestion?: string;
  leadId?: string;
}

type Step = 1 | 2 | 3 | 4;

// ── Indian Cities for autocomplete ─────────────────────────────────────────────
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow',
  'Chandigarh', 'Indore', 'Bhopal', 'Coimbatore', 'Kochi',
  'Nagpur', 'Surat', 'Vadodara', 'Visakhapatnam', 'Kota',
];

// ── Animation Variants ─────────────────────────────────────────────────────────
const easeOutQuart: [number, number, number, number] = [0.22, 1, 0.36, 1];

const wordReveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: i * 0.04, duration: 0.7, ease: easeOutQuart },
  }),
};

const stepVariants: Variants = {
  enter: { opacity: 0, x: 50, filter: 'blur(4px)' },
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: easeOutQuart } },
  exit: { opacity: 0, x: -50, filter: 'blur(4px)', transition: { duration: 0.3, ease: 'easeIn' as const } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: easeOutQuart },
  }),
};

// ── Typing Dots Component ─────────────────────────────────────────────────────
function TypingDots() {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => setDots((d) => (d % 3) + 1), 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-primary">Analyzing</span>
      {'.'.repeat(dots)}
    </span>
  );
}

// ── Star Rating Display ────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < fullStars
              ? 'text-primary fill-primary'
              : i === fullStars && hasHalf
              ? 'text-primary fill-primary/50'
              : 'text-muted-foreground/20'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground font-mono">{rating.toFixed(1)}</span>
    </div>
  );
}

// ── Word-split helper for headline stagger ─────────────────────────────────────
function splitToWords(text: string): string[] {
  return text.split(/(\s+)/).filter((w) => w.length > 0);
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function HeroAdvisor() {
  const { t, language } = useLanguage();

  // Form state
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<AdvisorFormData>({
    age: 30,
    familySize: 2,
    city: '',
    budget: 2000,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Results state
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  // ── Localized strings ─────────────────────────────────────
  const headlineLine1 = isHindi ? 'Insurance ko samjho.' : isEnglish ? 'Understand Insurance.' : 'Insurance ko samjho.';
  const headlineLine2 = isHindi ? 'Sahi faisla chuno.' : isEnglish ? 'Choose the right plan.' : 'Sahi faisla chuno.';

  const subtext = isHindi
    ? 'AI-powered guidance ke saath policy compare karo, benefits samjho aur claims ko aasan banao.'
    : isEnglish
      ? 'Compare policies with AI guidance, understand benefits, and make claims easy.'
      : 'AI-powered guidance ke saath policy compare karo, benefits samjho aur claims ko aasan banao.';

  const primaryCTA = isHindi ? 'Quick Adviser Shuru karein →' : isEnglish ? 'Start Quick Adviser →' : 'Quick Adviser Shuru karein →';

  const stepLabels: Record<Step, string> = isHindi
    ? { 1: 'Aapki umar?', 2: 'Parivaar ki sankhya?', 3: 'Shehar?', 4: 'Masik budget?' }
    : isEnglish
      ? { 1: 'Your age?', 2: 'Family size?', 3: 'Your city?', 4: 'Monthly budget?' }
      : { 1: 'Aapki umar?', 2: 'Parivaar ki sankhya?', 3: 'Shehar?', 4: 'Masik budget?' };

  const getPlanLabel = isHindi ? 'Mera plan lo →' : isEnglish ? 'Get my plan →' : 'Mera plan lo →';
  const orDivider = isHindi ? '─ ya ─' : isEnglish ? '─ or ─' : '─ ya ─';
  const whatsAppInstead = isHindi ? 'WhatsApp par baat karein' : isEnglish ? 'WhatsApp instead' : 'WhatsApp par baat karein';

  // Results view localized strings
  const resultsTitle = isHindi ? 'AI Recommendations' : isEnglish ? 'Your AI Recommendations' : 'AI Recommendations';
  const resultsSubtitle = isHindi
    ? 'Aapke profile ke liye top plans'
    : isEnglish
      ? 'Top plans picked for your profile'
      : 'Aapke profile ke liye top plans';
  const advisorMessageLabel = isHindi ? 'Advisor ka sandesh' : isEnglish ? "Advisor's Note" : 'Advisor ka sandesh';
  const followUpLabel = isHindi ? 'Aage ka sawaal' : isEnglish ? 'Follow-up Question' : 'Aage ka sawaal';
  const whatsappCTA = isHindi
    ? 'WhatsApp par detail mein baat karein'
    : isEnglish
      ? 'Discuss details on WhatsApp'
      : 'WhatsApp par detail mein baat karein';
  const startOverLabel = isHindi ? 'Phir se shuru karein' : isEnglish ? 'Start Over' : 'Phir se shuru karein';
  const indicativeLabel = isHindi ? '(aadharit)' : isEnglish ? '(indicative)' : '(aadharit)';
  const claimRatioLabel = isHindi ? 'Claim Settlement Ratio' : isEnglish ? 'Claim Settlement Ratio' : 'Claim Settlement Ratio';
  const whyFitsLabel = isHindi ? 'Yeh kyun fit hai' : isEnglish ? 'Why it fits you' : 'Yeh kyun fit hai';
  const sumInsuredLabel = isHindi ? 'Sum Insured' : isEnglish ? 'Sum Insured' : 'Sum Insured';
  const premiumLabel = isHindi ? 'Masik premium' : isEnglish ? 'Monthly premium' : 'Masik premium';
  const noPlansMsg = isHindi
    ? 'Abhi plans nahi mil paaye. WhatsApp par baat karein!'
    : isEnglish
      ? 'Could not fetch plans right now. Chat with us on WhatsApp!'
      : 'Abhi plans nahi mil paaye. WhatsApp par baat karein!';

  // ── Handlers ──────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (step < 4) setStep((s) => (s + 1) as Step);
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }, [step]);

  const handleCityInput = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, city: value }));
    if (value.length > 0) {
      const filtered = INDIAN_CITIES.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 5);
      setCitySuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, []);

  const selectCity = useCallback((city: string) => {
    setFormData((prev) => ({ ...prev, city }));
    setShowSuggestions(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setShowResults(true);
    setResult(null);
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data: AdvisorResult = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, plans: [], advisorMessage: noPlansMsg });
    }
    setIsSubmitting(false);
  }, [formData, noPlansMsg]);

  const handleStartOver = useCallback(() => {
    setShowResults(false);
    setResult(null);
    setStep(1);
    setFormData({ age: 30, familySize: 2, city: '', budget: 2000 });
  }, []);

  const progressPercent = ((step) / 4) * 100;

  // ── Family size options ───────────────────────────────────
  const familySizes = [1, 2, 3, 4, 5, 6];

  // ── Headline word arrays for stagger ──────────────────────
  const line1Words = splitToWords(headlineLine1);
  const line2Words = splitToWords(headlineLine2);

  // ── Results View ──────────────────────────────────────────
  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOutQuart }}
      className="rounded-3xl overflow-hidden bg-white/[0.55] backdrop-blur-2xl border border-white/30"
      style={{
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px -12px rgba(0,0,0,0.12), 0 0 80px -20px rgba(194,86,44,0.08)',
      }}
    >
      {/* Header */}
      <div className="px-7 py-6 border-b border-white/20">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center backdrop-blur-sm border border-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading), Fraunces, serif' }}>
              {resultsTitle}
            </h2>
            <p className="text-xs text-muted-foreground/70 mt-0.5 tracking-wide">{resultsSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-h-[520px] overflow-y-auto custom-scrollbar space-y-4">
        {/* Loading state */}
        {isSubmitting && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-5"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-primary/15 border-t-primary animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-b-primary/30 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
              <Sparkles className="w-7 h-7 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xl text-foreground font-semibold tracking-tight">
              <TypingDots />
            </p>
            <p className="text-sm text-muted-foreground/70 text-center max-w-xs leading-relaxed">
              {isHindi
                ? '51+ insurers scan ho rahe hain aapke liye best plan dhundhne ke liye...'
                : isEnglish
                  ? 'Scanning 51+ insurers to find your best match...'
                  : '51+ insurers scan ho rahe hain aapke liye best plan dhundhne ke liye...'}
            </p>
          </motion.div>
        )}

        {/* Error / No plans state */}
        {!isSubmitting && result && (!result.plans || result.plans.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-10 gap-5 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <p className="text-foreground text-sm max-w-sm leading-relaxed">
              {result.advisorMessage || noPlansMsg}
            </p>
            <a
              href="https://wa.me/919257877312"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ boxShadow: '0 4px 20px -4px rgba(22,163,74,0.4)' }}
            >
              <MessageCircle className="w-4 h-4" />
              {whatsappCTA}
            </a>
          </motion.div>
        )}

        {/* Plan cards */}
        {!isSubmitting && result && result.plans && result.plans.length > 0 && (
          <>
            <div className="space-y-3.5">
              {result.plans.map((plan, i) => (
                <motion.div
                  key={`${plan.insurer}-${plan.plan}`}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/40 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/[0.03] group"
                >
                  <div className="p-5">
                    {/* Top row: insurer + rating */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                          {plan.insurer}
                        </h3>
                        <p
                          className="text-xs text-primary/80 mt-0.5 truncate"
                          style={{ fontFamily: 'var(--font-heading), Fraunces, serif' }}
                        >
                          {plan.plan}
                        </p>
                      </div>
                      <StarRating rating={plan.rating} />
                    </div>

                    {/* Premium & Sum Insured */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-xl px-3.5 py-2.5 bg-gradient-to-br from-primary/[0.06] to-transparent border border-primary/10">
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-0.5">
                          {premiumLabel}
                        </p>
                        <p className="text-base font-bold gradient-text font-mono">
                          {plan.monthlyPremium}
                        </p>
                        <p className="text-[9px] text-muted-foreground/40 italic">{indicativeLabel}</p>
                      </div>
                      <div className="rounded-xl px-3.5 py-2.5 bg-surface/50 border border-border/50">
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-0.5">
                          {sumInsuredLabel}
                        </p>
                        <p className="text-base font-bold text-foreground font-mono">
                          {plan.sumInsured}
                        </p>
                      </div>
                    </div>

                    {/* Why it fits */}
                    <div className="flex items-start gap-2.5 mb-3.5">
                      <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest mb-0.5">
                          {whyFitsLabel}
                        </p>
                        <p className="text-xs text-foreground/85 leading-relaxed">{plan.whyItFits}</p>
                      </div>
                    </div>

                    {/* Claim ratio */}
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-[var(--trust)] shrink-0" />
                      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                        {claimRatioLabel}:
                      </p>
                      <p className="text-xs font-semibold text-[var(--trust)] font-mono">
                        {plan.claimRatio}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Advisor message */}
            {result.advisorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="rounded-2xl p-5 bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] border border-primary/10 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">
                    {advisorMessageLabel}
                  </span>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {result.advisorMessage}
                </p>
              </motion.div>
            )}

            {/* Follow-up question */}
            {result.followUpQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="rounded-2xl p-4 bg-white/30 backdrop-blur-sm border border-white/30"
              >
                <p className="text-[10px] text-muted-foreground/60 mb-1.5 font-semibold uppercase tracking-widest">
                  {followUpLabel}:
                </p>
                <p className="text-sm text-foreground/75 italic leading-relaxed">
                  &ldquo;{result.followUpQuestion}&rdquo;
                </p>
              </motion.div>
            )}

            {/* Disclaimer */}
            <p className="text-[10px] text-muted-foreground/40 text-center leading-relaxed pt-1">
              {isHindi
                ? '* Premium indicative hain. Exact quote ke liye human advisor se baat karein.'
                : isEnglish
                  ? '* Premiums are indicative. Talk to a human advisor for exact quotes.'
                  : '* Premium indicative hain. Exact quote ke liye human advisor se baat karein.'}
            </p>
          </>
        )}
      </div>

      {/* Footer: WhatsApp CTA + Start Over */}
      <div className="px-6 pb-6 space-y-3">
        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/919257877312"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          style={{ boxShadow: '0 4px 24px -4px rgba(22,163,74,0.35)' }}
        >
          <MessageCircle className="w-4 h-4" />
          {whatsappCTA}
        </a>

        {/* Start Over */}
        <button
          onClick={handleStartOver}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/30 text-muted-foreground/70 text-xs font-medium hover:text-foreground hover:border-foreground/15 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {startOverLabel}
        </button>
      </div>
    </motion.div>
  );

  return (
    <section
      id="advisor-form"
      className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-background"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[50vw] h-[50vw] rounded-full bg-primary/[0.03] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-white/[0.02] blur-[80px]" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start lg:items-center">
          {/* ── LEFT COLUMN (55%): Headline + Subtext + CTA + Trust Stats ── */}
          <div className="flex-1 lg:w-[55%] lg:max-w-[55%] flex flex-col gap-8 sm:gap-10">
            {/* Headline — dramatic editorial with gradient + word stagger */}
            <motion.h1
              initial="hidden"
              animate="visible"
              className="text-foreground"
              style={{
                fontFamily: 'var(--font-heading), Fraunces, serif',
                fontSize: 'clamp(3.25rem, 7.5vw, 6.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
              }}
            >
              {/* Line 1: "Insurance ko samjho." — gradient text */}
              <span className="block">
                {line1Words.map((word, i) => (
                  <motion.span
                    key={`l1-${i}`}
                    custom={i}
                    variants={wordReveal}
                    className="inline-block font-extrabold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
                    style={{ marginRight: word.match(/^\s+$/) ? '0.25em' : '0' }}
                  >
                    {word.match(/^\s+$/) ? '\u00A0' : word}
                  </motion.span>
                ))}
              </span>

              {/* Line 2: "Sahi faisla chuno." — mixed weight with gradient accent */}
              <span className="block mt-2">
                {line2Words.map((word, i) => {
                  const isAccent = ['samjho.', 'Sahi', 'faisla', 'chuno.'].includes(word);
                  return (
                    <motion.span
                      key={`l2-${i}`}
                      custom={line1Words.length + i}
                      variants={wordReveal}
                      className={`inline-block ${
                        isAccent
                          ? 'italic font-normal bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent'
                          : 'font-extrabold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'
                      }`}
                      style={{ marginRight: word.match(/^\s+$/) ? '0.25em' : '0' }}
                    >
                      {word.match(/^\s+$/) ? '\u00A0' : word}
                    </motion.span>
                  );
                })}
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: line1Words.length * 0.04 + line2Words.length * 0.04 + 0.15, duration: 0.6, ease: easeOutQuart }}
              className="text-lg sm:text-xl text-muted-foreground/80 max-w-[58ch] leading-[1.7] tracking-[-0.01em]"
            >
              {subtext}
            </motion.p>

            {/* Primary CTA — premium button with micro-interactions */}
            <motion.div
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: line1Words.length * 0.04 + line2Words.length * 0.04 + 0.25, duration: 0.6, ease: easeOutQuart }}
            >
              <button
                onClick={() => {
                  const el = document.getElementById('advisor-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="group relative rounded-full bg-primary text-primary-foreground px-8 py-4.5 font-semibold tracking-tight transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                style={{
                  boxShadow:
                    '0 1px 0 inset rgba(255,255,255,.2), 0 4px 16px -4px rgba(194,86,44,0.3), 0 12px 32px -8px rgba(194,86,44,0.2)',
                }}
              >
                {/* Glow effect on hover */}
                <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10 scale-125" />
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  {primaryCTA}
                </span>
              </button>
            </motion.div>

            {/* Trust stats row — premium pill with backdrop blur */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: line1Words.length * 0.04 + line2Words.length * 0.04 + 0.4, duration: 0.6, ease: easeOutQuart }}
              className="inline-flex items-center gap-0 rounded-full px-5 py-2.5 bg-white/[0.5] backdrop-blur-xl border border-white/30"
              style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/70 tracking-[0.02em]">
                <ShieldCheck className="w-3.5 h-3.5 text-trust" />
                IRDAI POSP IP429834
              </span>
              <span className="mx-3 text-border/60">·</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/70 tracking-[0.02em]">
                <Star className="w-3.5 h-3.5 text-primary" />
                4.8 (Google, 247 reviews)
              </span>
              <span className="mx-3 text-border/60">·</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/70 tracking-[0.02em]">
                <Users className="w-3.5 h-3.5 text-muted-foreground/50" />
                500+ families covered
              </span>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN (45%): Quick Adviser Form Card ────────── */}
          <motion.div
            initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOutQuart }}
            className="w-full lg:w-[45%] lg:max-w-[45%] lg:sticky lg:top-8"
          >
            <AnimatePresence mode="wait">
              {showResults ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: easeOutQuart }}
                >
                  {renderResults()}
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: easeOutQuart }}
                >
                  {/* Premium glass-morphism form card */}
                  <div
                    className="rounded-3xl overflow-hidden bg-white/[0.55] backdrop-blur-2xl border border-white/30"
                    style={{
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px -12px rgba(0,0,0,0.12), 0 0 80px -20px rgba(194,86,44,0.06)',
                    }}
                  >
                    {/* Card header */}
                    <div className="flex items-center gap-3.5 px-7 py-5 border-b border-white/20">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center backdrop-blur-sm border border-primary/10">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-bold tracking-[0.15em] text-foreground/90 uppercase">
                        AI Quick Adviser
                      </span>
                      <span className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-[10px] font-bold text-primary border border-primary/10 backdrop-blur-sm">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI
                      </span>
                      <div className="ml-auto text-xs text-muted-foreground/50 font-mono tracking-wider">
                        {step}/4
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="px-7 pt-3">
                      <Progress value={progressPercent} className="h-1 bg-border/50" />
                    </div>

                    {/* Step content */}
                    <div className="px-7 py-8 min-h-[260px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {/* STEP 1: Age */}
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="flex flex-col gap-5"
                          >
                            <label className="text-xl font-semibold text-foreground tracking-tight">
                              {stepLabels[1]}
                            </label>
                            <div className="relative">
                              <Input
                                type="number"
                                min={18}
                                max={75}
                                value={formData.age}
                                onChange={(e) =>
                                  setFormData((p) => ({ ...p, age: Number(e.target.value) }))
                                }
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                placeholder="25 - 65"
                                className="h-14 text-xl bg-transparent border-0 border-b-2 border-border/50 rounded-none focus:border-primary focus:ring-0 px-0 text-foreground placeholder:text-muted-foreground/30 transition-colors duration-300"
                              />
                              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-sm tracking-wide">
                                yrs
                              </span>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 2: Family size */}
                        {step === 2 && (
                          <motion.div
                            key="step2"
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="flex flex-col gap-5"
                          >
                            <label className="text-xl font-semibold text-foreground tracking-tight">
                              {stepLabels[2]}
                            </label>
                            <div className="flex gap-2.5 flex-wrap">
                              {familySizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() =>
                                    setFormData((p) => ({ ...p, familySize: size }))
                                  }
                                  className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border transition-all duration-300 ${
                                    formData.familySize === size
                                      ? 'border-primary bg-primary/10 text-primary scale-[1.03] shadow-lg shadow-primary/10'
                                      : 'border-white/30 bg-white/20 backdrop-blur-sm text-muted-foreground hover:border-foreground/15 hover:bg-white/40 hover:scale-[1.02]'
                                  }`}
                                >
                                  <Users className="w-4 h-4" />
                                  <span className="text-sm font-semibold">{size}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 3: City */}
                        {step === 3 && (
                          <motion.div
                            key="step3"
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="flex flex-col gap-5 relative"
                          >
                            <label className="text-xl font-semibold text-foreground tracking-tight">
                              {stepLabels[3]}
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                              <Input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleCityInput(e.target.value)}
                                onFocus={() => {
                                  if (citySuggestions.length > 0) setShowSuggestions(true);
                                }}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                placeholder="Type your city..."
                                className="h-14 text-xl bg-transparent border-0 border-b-2 border-border/50 rounded-none focus:border-primary focus:ring-0 pl-7 px-0 text-foreground placeholder:text-muted-foreground/30 transition-colors duration-300"
                              />
                            </div>
                            {/* City suggestions dropdown */}
                            {showSuggestions && (
                              <div className="absolute top-full left-0 right-0 mt-2 z-20 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-2xl overflow-hidden" style={{ boxShadow: '0 8px 32px -8px rgba(0,0,0,0.12)' }}>
                                {citySuggestions.map((city) => (
                                  <button
                                    key={city}
                                    onClick={() => selectCity(city)}
                                    className="w-full px-5 py-3 text-left text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                                  >
                                    <MapPin className="w-3.5 h-3.5 inline mr-2.5 text-muted-foreground/50" />
                                    {city}
                                  </button>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* STEP 4: Budget slider */}
                        {step === 4 && (
                          <motion.div
                            key="step4"
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="flex flex-col gap-6"
                          >
                            <label className="text-xl font-semibold text-foreground tracking-tight">
                              {stepLabels[4]}
                            </label>
                            <div className="flex items-center gap-3">
                              <IndianRupee className="w-5 h-5 text-primary/70 shrink-0" />
                              <Slider
                                min={500}
                                max={10000}
                                step={100}
                                value={[formData.budget]}
                                onValueChange={([v]) =>
                                  setFormData((p) => ({ ...p, budget: v }))
                                }
                                className="flex-1"
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground/40 text-xs">₹500</span>
                              <span className="text-2xl font-bold text-foreground font-mono tracking-tight">
                                ₹{formData.budget.toLocaleString('en-IN')}
                              </span>
                              <span className="text-muted-foreground/40 text-xs">₹10,000</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation buttons */}
                      <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/20">
                        {step > 1 ? (
                          <button
                            onClick={handleBack}
                            className="text-sm text-muted-foreground/60 hover:text-foreground transition-all duration-200 hover:-translate-x-0.5"
                          >
                            ← Back
                          </button>
                        ) : (
                          <div />
                        )}

                        {step < 4 ? (
                          <button
                            onClick={handleNext}
                            className="group flex items-center gap-2 px-7 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                            style={{ boxShadow: '0 4px 16px -4px rgba(194,86,44,0.3)' }}
                          >
                            Next
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="group flex items-center gap-2 px-7 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                            style={{ boxShadow: '0 4px 16px -4px rgba(194,86,44,0.3)' }}
                          >
                            {isSubmitting ? '...' : getPlanLabel}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Divider + WhatsApp link */}
                    <div className="px-7 pb-6">
                      <div className="flex items-center gap-3 text-muted-foreground/40 text-xs">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                        {orDivider}
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                      </div>
                      <a
                        href="https://wa.me/919257877312"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl border border-white/30 text-muted-foreground/70 text-sm font-medium hover:text-foreground hover:border-foreground/15 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {whatsAppInstead}
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
