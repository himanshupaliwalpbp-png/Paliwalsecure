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
const easeOutQuart: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
              ? 'text-[#2563EB] fill-[#2563EB]'
              : i === fullStars && hasHalf
              ? 'text-[#2563EB] fill-[#2563EB]/50'
              : 'text-slate-300 dark:text-slate-600'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-[#374151] dark:text-slate-400 font-body">{rating.toFixed(1)}</span>
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
          className="text-slate-100 dark:text-slate-700/50"
        />
        {/* Progress */}
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
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold font-display text-[#111111] dark:text-white tracking-tight"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: easeOutQuart }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#374151] dark:text-slate-500">
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
      className="premium-card rounded-2xl p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 dark:from-blue-400/15 dark:to-emerald-400/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#111111] dark:text-white font-display">{resultsTitle}</h2>
          <p className="text-xs text-[#374151] dark:text-slate-400 font-body mt-0.5">{resultsSubtitle}</p>
        </div>
      </div>

      {/* Content */}
      {isSubmitting && !result && (
        <div className="flex flex-col items-center py-12 gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 dark:border-blue-400/20 dark:border-t-blue-400 rounded-full animate-spin" />
          <p className="text-sm text-[#374151] dark:text-slate-400 font-body">Analyzing...</p>
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
              className="p-5 rounded-xl bg-[#F6F5F1]/80 dark:bg-slate-800/50 border border-[#E8E2D6]/80 dark:border-slate-700/50 hover:shadow-premium transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#111111] dark:text-white font-display">{plan.insurer}</h3>
                  <p className="text-sm text-[#374151] dark:text-slate-400 font-body">{plan.plan}</p>
                </div>
                <StarRating rating={plan.rating} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[#374151] dark:text-slate-400 font-body">{sumInsuredLabel}</span>
                  <p className="font-semibold text-[#111111] dark:text-white font-body">{plan.sumInsured}</p>
                </div>
                <div>
                  <span className="text-[#374151] dark:text-slate-400 font-body">{premiumLabel}</span>
                  <p className="font-semibold text-[#111111] dark:text-white font-body">{plan.monthlyPremium}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E8E2D6]/60 dark:border-slate-700/40 space-y-1.5">
                <p className="text-xs text-[#374151] dark:text-slate-400 font-body">
                  <span className="font-medium text-[#111111] dark:text-white">{whyFitsLabel}:</span> {plan.whyItFits}
                </p>
                <p className="text-xs text-[#374151] dark:text-slate-400 font-body">
                  <span className="font-medium text-[#111111] dark:text-white">{claimRatioLabel}:</span> {plan.claimRatio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {result && result.advisorMessage && (
        <div className="mt-4 p-4 bg-gradient-to-r from-[#DBEAFE] to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-xl border border-[#E8E2D6]/60 dark:border-slate-700/40">
          <p className="text-sm font-medium text-[#111111] dark:text-white font-body mb-1">{advisorMessageLabel}</p>
          <p className="text-sm text-[#374151] dark:text-slate-400 font-body">{result.advisorMessage}</p>
        </div>
      )}

      {result && result.followUpQuestion && (
        <div className="mt-3 p-4 bg-blue-50/80 dark:bg-blue-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400 font-body mb-1">{followUpLabel}</p>
          <p className="text-sm text-[#374151] dark:text-slate-400 font-body">{result.followUpQuestion}</p>
        </div>
      )}

      {result && (!result.plans || result.plans.length === 0) && (
        <div className="text-center py-8">
          <p className="text-[#374151] dark:text-slate-400 font-body">{noPlansMsg}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          href="https://wa.me/919257877312"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-premium"
        >
          <MessageCircle className="w-4 h-4" />
          {whatsappCTA}
        </a>
        <button
          onClick={handleStartOver}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E8E2D6] dark:border-slate-700 text-[#111111] dark:text-white font-semibold text-sm hover:bg-[#F6F5F1] dark:hover:bg-slate-800 transition-colors font-body"
        >
          {startOverLabel}
        </button>
      </div>
    </motion.div>
  );

  return (
    <section
      id="advisor-form"
      className="relative overflow-hidden py-20 md:py-28"
    >
      {/* ── Gradient Mesh Background ────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A9C0E0] via-[#B8CDE8] to-[#9AB5D8]/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30" />

      {/* Very subtle dots pattern overlay — barely visible for texture */}
      <div
        className="absolute inset-0 opacity-[0.12] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 0.5px, transparent 0.5px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Gradient mesh blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-400/[0.07] dark:bg-blue-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-400/[0.06] dark:bg-emerald-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-400/[0.04] dark:bg-violet-500/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Top/bottom edge fades */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-slate-700/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-slate-700/40 to-transparent" />

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* ═══════════════════════════════════════════════════════
              LEFT COLUMN — Headline + Description + CTAs + Stats
              ═══════════════════════════════════════════════════════ */}
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Trust Badge */}
            <motion.div variants={heroChild} className="mb-8">
              <span className="badge-premium-slate text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                {trustBadgeText}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={heroChild} className="text-hero mb-6">
              {headlineBefore}{' '}
              <span className="gradient-text-blue-emerald">{headlineAccent}</span>
              <br className="hidden sm:block" />
              {' '}{headlineAfter}
            </motion.h1>

            {/* Description */}
            <motion.p variants={heroChild} className="text-body-lg text-[#374151] dark:text-slate-400 mb-10 leading-relaxed font-body max-w-xl">
              {subtext}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={heroChild} className="flex flex-col sm:flex-row gap-4 mb-14">
              <a
                href="#advisor-form"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('advisor-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="btn-luxury-gold btn-luxury-lg"
              >
                <Shield className="h-5 w-5" />
                {primaryCTA}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury-secondary btn-luxury-lg !bg-white !border-[#E8E2D6] !shadow-sm hover:!bg-[#111111] hover:!text-white hover:!border-[#111111]"
              >
                {secondaryCTA}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={heroChild} className="flex flex-wrap gap-4">
              <div className="stat-premium-block rounded-xl">
                <div className="stat-number">{socialProof1Val}</div>
                <div className="stat-label">{socialProof1Label}</div>
              </div>
              <div className="stat-premium-block stat-premium-block-green rounded-xl">
                <div className="stat-number">{socialProof2Val}</div>
                <div className="stat-label">{socialProof2Label}</div>
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
              <div className="glass-premium rounded-2xl p-6 sm:p-8 border border-[#E8E2D6]/60 dark:border-slate-700/40">
                <div className="flex items-center gap-6 mb-6">
                  <AnimatedScoreCircle score={87} size={110} />
                  <div className="flex-1">
                    <div className="text-label-premium text-[#374151] dark:text-slate-400 mb-1.5">{isHindi ? 'सुरक्षा स्कोर' : isEnglish ? 'Protection Score' : 'Protection Score'}</div>
                    <div className="text-3xl font-bold font-display text-[#111111] dark:text-white tracking-tight">87/100</div>
                    <div className="flex items-center gap-1.5 mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-4 w-4" />
                      {isHindi ? 'इस साल आपका सुरक्षा 23% बेहतर हुआ' : isEnglish ? 'Your protection improved by 23% this year' : 'Aapki protection 23% better hui is saal'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    { label: isHindi ? 'जीवन कवरेज' : isEnglish ? 'Life Coverage' : 'Jeevan Coverage', pct: 90, color: 'from-emerald-500 to-emerald-600' },
                    { label: isHindi ? 'स्वास्थ्य सुरक्षा' : isEnglish ? 'Health Protection' : 'Swasthya Suraksha', pct: 85, color: 'from-blue-500 to-blue-600' },
                    { label: isHindi ? 'वाहन बीमा' : isEnglish ? 'Vehicle Insurance' : 'Vahan Insurance', pct: 95, color: 'from-amber-400 to-amber-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-[#374151] dark:text-slate-400 font-body min-w-[120px]">{item.label}</span>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1 h-1.5 bg-[#E8E2D6] dark:bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ duration: 1, ease: easeOutQuart, delay: 0.8 }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#111111] dark:text-white font-body w-9 text-right">{item.pct}%</span>
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
              className="absolute -top-2 -right-2 glass-premium rounded-xl p-3.5 border border-[#E8E2D6]/60 dark:border-slate-700/40 hidden lg:block z-10 shadow-premium"
            >
              <div className="text-xs text-[#374151] dark:text-slate-400 font-body mb-0.5">Savings This Year</div>
              <div className="text-xl font-bold gradient-text-blue-emerald font-display">₹45,000</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 -left-2 glass-premium rounded-xl p-3.5 border border-[#E8E2D6]/60 dark:border-slate-700/40 hidden lg:block z-10 shadow-premium"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] text-[#374151] dark:text-slate-400 font-body uppercase tracking-wider">Claims Settled</div>
                  <div className="text-lg font-bold text-[#111111] dark:text-white font-display">100%</div>
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
                  {/* Premium featured form card */}
                  <div className="premium-card premium-card-featured rounded-2xl overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center gap-3 px-6 sm:px-7 py-5 border-b border-[#E8E2D6] dark:border-slate-700/40">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/15 to-emerald-500/10 dark:from-blue-400/20 dark:to-emerald-400/15 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-bold tracking-[0.08em] text-[#111111] dark:text-white uppercase font-heading">
                        AI Quick Adviser
                      </span>
                      <span className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI
                      </span>
                      <div className="ml-auto text-xs text-[#374151] dark:text-slate-500 font-body tabular-nums">
                        {step}/4
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="px-6 sm:px-7 pt-3">
                      <Progress value={progressPercent} className="h-1 bg-[#E8E2D6] dark:bg-slate-700/50" />
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
                            <label className="text-xl font-semibold text-[#111111] dark:text-white tracking-tight font-display">
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
                                className="input-premium h-14 text-xl bg-transparent border-0 border-b-2 border-[#E8E2D6] dark:border-slate-700 rounded-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-0 px-0 text-[#111111] dark:text-white placeholder:text-[#E8E2D6] dark:placeholder:text-slate-600 transition-colors duration-300"
                              />
                              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#E8E2D6] dark:text-slate-600 text-sm font-body">
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
                            <label className="text-xl font-semibold text-[#111111] dark:text-white tracking-tight font-display">
                              {stepLabels[2]}
                            </label>
                            <div className="flex gap-2.5 flex-wrap">
                              {familySizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() =>
                                    setFormData((p) => ({ ...p, familySize: size }))
                                  }
                                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border-2 transition-all duration-300 font-body ${
                                    formData.familySize === size
                                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 scale-[1.03] shadow-premium'
                                      : 'border-[#E8E2D6] dark:border-slate-700 bg-[#F6F5F1]/50 dark:bg-slate-800/50 text-[#374151] dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-[#DBEAFE]/50 dark:hover:bg-blue-900/20 hover:scale-[1.02]'
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
                            <label className="text-xl font-semibold text-[#111111] dark:text-white tracking-tight font-display">
                              {stepLabels[3]}
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E8E2D6] dark:text-slate-600" />
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
                                className="input-premium input-premium-icon h-14 text-xl bg-transparent border-0 border-b-2 border-[#E8E2D6] dark:border-slate-700 rounded-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-0 pl-7 px-0 text-[#111111] dark:text-white placeholder:text-[#E8E2D6] dark:placeholder:text-slate-600 transition-colors duration-300"
                              />
                            </div>
                            {/* City suggestions dropdown */}
                            {showSuggestions && (
                              <div className="absolute top-full left-0 right-0 mt-2 z-20 rounded-xl border border-[#E8E2D6] dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl overflow-hidden shadow-premium-lg">
                                {citySuggestions.map((city) => (
                                  <button
                                    key={city}
                                    onClick={() => selectCity(city)}
                                    className="w-full px-5 py-3 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 font-body"
                                  >
                                    <MapPin className="w-3.5 h-3.5 inline mr-2.5 text-[#374151]" />
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
                            <label className="text-xl font-semibold text-[#111111] dark:text-white tracking-tight font-display">
                              {stepLabels[4]}
                            </label>
                            <div className="flex items-center gap-3">
                              <IndianRupee className="w-5 h-5 text-blue-500/70 dark:text-blue-400/70 shrink-0" />
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
                              <span className="text-[#E8E2D6] dark:text-slate-600 text-xs font-body">₹500</span>
                              <span className="text-2xl font-bold text-[#111111] dark:text-white font-display tracking-tight">
                                ₹{formData.budget.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[#E8E2D6] dark:text-slate-600 text-xs font-body">₹10,000</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation buttons */}
                      <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#E8E2D6] dark:border-slate-700/40">
                        {step > 1 ? (
                          <button
                            onClick={handleBack}
                            className="text-sm text-[#374151] dark:text-slate-500 hover:text-[#111111] dark:hover:text-white transition-all duration-200 hover:-translate-x-0.5 font-body"
                          >
                            ← {isHindi ? 'पीछे' : isEnglish ? 'Back' : 'Back'}
                          </button>
                        ) : (
                          <div />
                        )}

                        {step < 4 ? (
                          <button
                            onClick={handleNext}
                            className="btn-luxury-primary"
                          >
                            {isHindi ? 'अगला' : isEnglish ? 'Next' : 'Next'}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="btn-luxury-gold disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? '...' : getPlanLabel}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Divider + WhatsApp link */}
                    <div className="px-6 sm:px-7 pb-6">
                      <div className="flex items-center gap-3 text-[#374151] dark:text-slate-500 text-xs font-body">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-500 dark:via-slate-600 to-transparent" />
                        {orDivider}
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-500 dark:via-slate-600 to-transparent" />
                      </div>
                      <a
                        href="https://wa.me/919257877312"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 font-body hover:scale-[1.01] active:scale-[0.99]"
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
