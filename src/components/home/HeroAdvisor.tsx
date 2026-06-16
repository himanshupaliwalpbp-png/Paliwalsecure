'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Users,
  MapPin,
  IndianRupee,
  Star,
  Shield,
  TrendingUp,
  ShieldCheck,
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
// Design Bible v8.0 — ease-out-expo for premium feel
const easeOutQuart: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

// Stagger container for hero entrance
const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const heroChild: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: easeOutQuart },
  },
};

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
              ? 'text-[#B8482C] fill-[#B8482C]'
              : i === fullStars && hasHalf
              ? 'text-[#B8482C] fill-[#B8482C]/50'
              : 'text-[#8B9099]/30'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-[#4A4F57] font-body tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
}

// ── Animated SVG Score Circle ──────────────────────────────────────────────────
function AnimatedScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-[rgba(14,17,22,0.06)]"
        />
        {/* Progress — burnt sienna → forest teal */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: easeOutQuart, delay: 0.6 }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8482C" />
            <stop offset="100%" stopColor="#1B4D4A" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-medium font-display text-[#0E1116] tracking-tight tabular-nums"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: easeOutQuart }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8B9099]">
          /100
        </span>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function HeroAdvisor() {
  const { language } = useLanguage();

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
  const trustBadgeText = isHindi ? '200+ भारतीय परिवारों का भरोसा' : isEnglish ? 'Trusted by 200+ Indian Families' : '200+ Indian Parivaron ka Bharosa';

  const headlineAccent = isHindi ? 'Intelligence' : isEnglish ? 'Intelligence' : 'Intelligence';
  const headlineBefore = isHindi ? 'Insurance' : isEnglish ? 'Insurance' : 'Insurance';
  const headlineAfter = isHindi ? 'Modern India ke liye' : isEnglish ? 'for Modern India' : 'Modern India ke liye';

  const subtext = isHindi
    ? 'AI-powered insights aur personalized protection strategies ke saath families, professionals, aur business owners ko smarter insurance decisions lene mein madad karte hain.'
    : isEnglish
      ? 'We help families, professionals, and business owners make smarter insurance decisions with AI-powered insights and personalized protection strategies.'
      : 'AI-powered insights aur personalized protection strategies ke saath families, professionals, aur business owners ko smarter insurance decisions lene mein madad karte hain.';

  const primaryCTA = isHindi ? 'Protection Score Pao' : isEnglish ? 'Get Protection Score' : 'Protection Score Pao';
  const secondaryCTA = isHindi ? 'Advisor se Baat Karein' : isEnglish ? 'Talk to Advisor' : 'Advisor se Baat Karein';

  const socialProof1Val = '4.9/5';
  const socialProof1Label = isHindi ? 'क्लाइंट रेटिंग' : isEnglish ? 'Client Rating' : 'Client Rating';
  const socialProof2Val = '24/7';
  const socialProof2Label = isHindi ? 'सहायता' : isEnglish ? 'Support' : 'Support';

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

  // ── Results View ──────────────────────────────────────────
  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOutQuart }}
      className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(14,17,22,0.08)] shadow-premium"
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-[#E6EFEE] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#1B4D4A]" />
        </div>
        <div>
          <h2 className="text-xl font-medium text-[#0E1116] font-display">{resultsTitle}</h2>
          <p className="text-xs text-[#4A4F57] font-body mt-0.5">{resultsSubtitle}</p>
        </div>
      </div>

      {/* Content */}
      {isSubmitting && !result && (
        <div className="flex flex-col items-center py-12 gap-4">
          <div className="w-12 h-12 border-4 border-[rgba(184,72,44,0.15)] border-t-[#B8482C] rounded-full animate-spin" />
          <p className="text-sm text-[#4A4F57] font-body">Analyzing...</p>
        </div>
      )}

      {result && result.plans && result.plans.length > 0 && (
        <div className="space-y-4">
          {result.plans.map((plan, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="p-5 rounded-xl bg-[#FAF7F2] border border-[rgba(14,17,22,0.08)] hover:border-[rgba(14,17,22,0.16)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#0E1116] font-display">{plan.insurer}</h3>
                  <p className="text-sm text-[#4A4F57] font-body">{plan.plan}</p>
                </div>
                <StarRating rating={plan.rating} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[#8B9099] font-body text-caption-premium">{sumInsuredLabel}</span>
                  <p className="font-semibold text-[#0E1116] font-body tabular-nums">{plan.sumInsured}</p>
                </div>
                <div>
                  <span className="text-[#8B9099] font-body text-caption-premium">{premiumLabel}</span>
                  <p className="font-semibold text-[#0E1116] font-body tabular-nums">{plan.monthlyPremium}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[rgba(14,17,22,0.08)] space-y-1.5">
                <p className="text-xs text-[#4A4F57] font-body">
                  <span className="font-medium text-[#0E1116]">{whyFitsLabel}:</span> {plan.whyItFits}
                </p>
                <p className="text-xs text-[#4A4F57] font-body">
                  <span className="font-medium text-[#0E1116]">{claimRatioLabel}:</span> {plan.claimRatio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {result && result.advisorMessage && (
        <div className="mt-4 p-4 bg-[#E6EFEE] rounded-xl border border-[rgba(27,77,74,0.15)]">
          <p className="text-sm font-medium text-[#0E1116] font-body mb-1">{advisorMessageLabel}</p>
          <p className="text-sm text-[#4A4F57] font-body">{result.advisorMessage}</p>
        </div>
      )}

      {result && result.followUpQuestion && (
        <div className="mt-3 p-4 bg-[#F4E5DD] rounded-xl border border-[rgba(184,72,44,0.15)]">
          <p className="text-sm font-medium text-[#8B3520] font-body mb-1">{followUpLabel}</p>
          <p className="text-sm text-[#4A4F57] font-body">{result.followUpQuestion}</p>
        </div>
      )}

      {result && (!result.plans || result.plans.length === 0) && (
        <div className="text-center py-8">
          <p className="text-[#4A4F57] font-body">{noPlansMsg}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          href="https://wa.me/919257877312"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-premium-sm font-body"
        >
          <MessageCircle className="w-4 h-4" />
          {whatsappCTA}
        </a>
        <button
          onClick={handleStartOver}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[rgba(14,17,22,0.15)] text-[#0E1116] font-medium text-sm hover:bg-[#0E1116] hover:text-[#FAF7F2] transition-colors font-body"
        >
          {startOverLabel}
        </button>
      </div>
    </motion.div>
  );

  return (
    <section
      id="advisor-form"
      className="relative overflow-hidden section-premium bg-[#FAF7F2]"
    >
      {/* ── Warm Bone Canvas — Design Bible v8.0 "Quiet Confidence" ─────────────────── */}

      {/* ONE very subtle burnt-sienna tint blob (low opacity, premium restraint) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 right-[10%] w-[480px] h-[480px] bg-[#F4E5DD] rounded-full blur-3xl opacity-[0.3]" />
      </div>

      {/* Hairline top/bottom edge fades */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(14,17,22,0.08)] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(14,17,22,0.08)] to-transparent" />

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hero-asymmetric">
          {/* ═══════════════════════════════════════════════════════
              LEFT COLUMN — Headline + Description + CTAs + Stats
              ═══════════════════════════════════════════════════════ */}
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Trust Badge — Pill with animated dot */}
            <motion.div variants={heroChild} className="mb-8">
              <span className="btn-pill-dot">
                {trustBadgeText}
              </span>
            </motion.div>

            {/* Headline — Fraunces serif, mix of roman + italic + gradient accent */}
            <motion.h1 variants={heroChild} className="text-display-hero font-display text-[#0E1116] mb-6">
              {headlineBefore}{' '}
              <span className="italic text-accent-gradient">{headlineAccent}</span>
              <br className="hidden sm:block" />
              {' '}{headlineAfter}
            </motion.h1>

            {/* Description — lead body, ink-soft */}
            <motion.p variants={heroChild} className="text-lead-premium text-[#4A4F57] mb-10 max-w-xl font-body">
              {subtext}
            </motion.p>

            {/* CTA Buttons — Primary "Stripe" + Ghost "Linear" */}
            <motion.div variants={heroChild} className="flex flex-col sm:flex-row gap-4 mb-14">
              <a
                href="#advisor-form"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('advisor-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="btn-stripe"
              >
                <Shield className="h-4 w-4" />
                {primaryCTA}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-linear"
              >
                {secondaryCTA}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Stats Row — editorial hairline blocks (Fraunces serif numbers) */}
            <motion.div variants={heroChild} className="flex flex-wrap gap-10 sm:gap-14">
              <div className="stat-hairline">
                <div className="stat-hairline-label">{socialProof1Label}</div>
                <div className="stat-hairline-value tabular-nums">{socialProof1Val}</div>
              </div>
              <div className="stat-hairline">
                <div className="stat-hairline-label">{socialProof2Label}</div>
                <div className="stat-hairline-value tabular-nums">{socialProof2Val}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════
              RIGHT COLUMN — Protection Score + AI Quick Adviser Form
              ═══════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: easeOutQuart, delay: 0.3 }}
            className="relative"
          >
            {/* Protection Score Card — desktop only, shown when not filling form */}
            <div className="hidden lg:block mb-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(14,17,22,0.08)] shadow-premium-sm">
                <div className="flex items-center gap-6 mb-6">
                  <AnimatedScoreCircle score={87} size={110} />
                  <div className="flex-1">
                    <div className="text-caption-premium text-[#8B9099] mb-1.5">{isHindi ? 'सुरक्षा स्कोर' : isEnglish ? 'Protection Score' : 'Protection Score'}</div>
                    <div className="text-3xl font-medium font-display text-[#0E1116] tracking-tight tabular-nums">87/100</div>
                    <div className="flex items-center gap-1.5 mt-2 text-sm font-medium text-[#1B4D4A]">
                      <TrendingUp className="h-4 w-4" />
                      {isHindi ? 'इस साल आपका सुरक्षा 23% बेहतर हुआ' : isEnglish ? 'Your protection improved by 23% this year' : 'Aapki protection 23% better hui is saal'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    { label: isHindi ? 'जीवन कवरेज' : isEnglish ? 'Life Coverage' : 'Jeevan Coverage', pct: 90, color: 'from-[#1B4D4A] to-[#2D7A77]' },
                    { label: isHindi ? 'स्वास्थ्य सुरक्षा' : isEnglish ? 'Health Protection' : 'Swasthya Suraksha', pct: 85, color: 'from-[#B8482C] to-[#8B3520]' },
                    { label: isHindi ? 'वाहन बीमा' : isEnglish ? 'Vehicle Insurance' : 'Vahan Insurance', pct: 95, color: 'from-[#B8482C] to-[#1B4D4A]' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-[#4A4F57] font-body min-w-[120px]">{item.label}</span>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1 h-1.5 bg-[rgba(14,17,22,0.06)] rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ duration: 1, ease: easeOutQuart, delay: 0.8 }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#0E1116] font-body w-9 text-right tabular-nums">{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Cards — desktop only */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 bg-white rounded-xl p-3.5 border border-[rgba(14,17,22,0.08)] hidden lg:block z-10 shadow-premium"
            >
              <div className="text-xs text-[#8B9099] font-body mb-0.5">Savings This Year</div>
              <div className="text-xl font-medium text-accent-gradient font-display tabular-nums">₹45,000</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 -left-2 bg-white rounded-xl p-3.5 border border-[rgba(14,17,22,0.08)] hidden lg:block z-10 shadow-premium"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E6EFEE] rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-[#1B4D4A]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#8B9099] font-body uppercase tracking-wider">Claims Settled</div>
                  <div className="text-lg font-medium text-[#0E1116] font-display tabular-nums">100%</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Adviser Form — premium featured card */}
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
                  {/* Premium featured form card — paper surface, hairline border */}
                  <div className="bg-white rounded-2xl overflow-hidden border border-[rgba(14,17,22,0.08)] shadow-premium">
                    {/* Card header */}
                    <div className="flex items-center gap-3 px-6 sm:px-7 py-5 hairline-bottom">
                      <div className="w-9 h-9 rounded-xl bg-[#E6EFEE] flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-[#1B4D4A]" />
                      </div>
                      <span className="text-sm font-medium tracking-[0.08em] text-[#0E1116] uppercase font-body">
                        AI Quick Adviser
                      </span>
                      <span className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4E5DD] text-[10px] font-medium text-[#8B3520] border border-[rgba(184,72,44,0.15)]">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI
                      </span>
                      <div className="ml-auto text-xs text-[#8B9099] font-body tabular-nums">
                        {step}/4
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="px-6 sm:px-7 pt-3">
                      <Progress value={progressPercent} className="h-1 bg-[rgba(14,17,22,0.06)]" />
                    </div>

                    {/* Step content */}
                    <div className="px-6 sm:px-7 py-8 min-h-[260px] flex flex-col justify-center">
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
                            <label className="text-xl font-medium text-[#0E1116] tracking-tight font-display">
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
                                className="input-premium h-14 text-xl bg-transparent border-0 border-b border-[rgba(14,17,22,0.16)] rounded-none focus:border-[#B8482C] focus:ring-0 px-0 text-[#0E1116] placeholder:text-[#8B9099] transition-colors duration-300 font-body"
                              />
                              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8B9099] text-sm font-body">
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
                            <label className="text-xl font-medium text-[#0E1116] tracking-tight font-display">
                              {stepLabels[2]}
                            </label>
                            <div className="flex gap-2.5 flex-wrap">
                              {familySizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() =>
                                    setFormData((p) => ({ ...p, familySize: size }))
                                  }
                                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border transition-all duration-300 font-body ${
                                    formData.familySize === size
                                      ? 'border-[#0E1116] bg-[#0E1116] text-[#FAF7F2] scale-[1.03] shadow-premium-sm'
                                      : 'border-[rgba(14,17,22,0.12)] bg-transparent text-[#4A4F57] hover:border-[#0E1116] hover:bg-[#FAF7F2] hover:scale-[1.02]'
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
                            <label className="text-xl font-medium text-[#0E1116] tracking-tight font-display">
                              {stepLabels[3]}
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9099]" />
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
                                className="input-premium input-premium-icon h-14 text-xl bg-transparent border-0 border-b border-[rgba(14,17,22,0.16)] rounded-none focus:border-[#B8482C] focus:ring-0 pl-7 px-0 text-[#0E1116] placeholder:text-[#8B9099] transition-colors duration-300 font-body"
                              />
                            </div>
                            {/* City suggestions dropdown */}
                            {showSuggestions && (
                              <div className="absolute top-full left-0 right-0 mt-2 z-20 rounded-xl border border-[rgba(14,17,22,0.08)] bg-white overflow-hidden shadow-premium-lg">
                                {citySuggestions.map((city) => (
                                  <button
                                    key={city}
                                    onClick={() => selectCity(city)}
                                    className="w-full px-5 py-3 text-left text-sm text-[#4A4F57] hover:bg-[#F4E5DD] hover:text-[#0E1116] transition-colors duration-200 font-body"
                                  >
                                    <MapPin className="w-3.5 h-3.5 inline mr-2.5 text-[#8B9099]" />
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
                            <label className="text-xl font-medium text-[#0E1116] tracking-tight font-display">
                              {stepLabels[4]}
                            </label>
                            <div className="flex items-center gap-3">
                              <IndianRupee className="w-5 h-5 text-[#8B9099] shrink-0" />
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
                              <span className="text-[#8B9099] text-xs font-body tabular-nums">₹500</span>
                              <span className="text-2xl font-medium text-[#0E1116] font-display tracking-tight tabular-nums">
                                ₹{formData.budget.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[#8B9099] text-xs font-body tabular-nums">₹10,000</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation buttons */}
                      <div className="flex items-center justify-between mt-8 pt-5 hairline-top">
                        {step > 1 ? (
                          <button
                            onClick={handleBack}
                            className="text-sm text-[#4A4F57] hover:text-[#0E1116] transition-all duration-200 hover:-translate-x-0.5 font-body"
                          >
                            ← {isHindi ? 'पीछे' : isEnglish ? 'Back' : 'Back'}
                          </button>
                        ) : (
                          <div />
                        )}

                        {step < 4 ? (
                          <button
                            onClick={handleNext}
                            className="btn-stripe"
                          >
                            {isHindi ? 'अगला' : isEnglish ? 'Next' : 'Next'}
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="btn-stripe disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? '...' : getPlanLabel}
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Divider + WhatsApp link */}
                    <div className="px-6 sm:px-7 pb-6">
                      <div className="flex items-center gap-3 text-[#8B9099] text-xs font-body">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(14,17,22,0.08)] to-transparent" />
                        {orDivider}
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(14,17,22,0.08)] to-transparent" />
                      </div>
                      <a
                        href="https://wa.me/919257877312"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-premium-sm hover:shadow-premium transition-all duration-200 font-body hover:scale-[1.01] active:scale-[0.99]"
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
