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
              ? 'text-[#E8C872] fill-[#E8C872]'
              : i === fullStars && hasHalf
              ? 'text-[#E8C872] fill-[#E8C872]/50'
              : 'text-[#64748B]/30'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-[#64748B] font-body">{rating.toFixed(1)}</span>
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
  const trustBadgeText = isHindi ? '10,000+ भारतीय परिवारों का भरोसा' : isEnglish ? 'Trusted by 10,000+ Indian Families' : '10,000+ Indian parivaron ka bharosa';

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
  const socialProof2Val = '₹500Cr+';
  const socialProof2Label = isHindi ? 'कवरेज मैनेज्ड' : isEnglish ? 'Coverage Managed' : 'Coverage Managed';
  const socialProof3Val = '24/7';
  const socialProof3Label = isHindi ? 'सहायता' : isEnglish ? 'Support' : 'Support';

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
      className="bg-white rounded-3xl p-8 shadow-premium-lg border border-[#E2E8F0]"
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#10B981]/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#2563EB]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] font-display">{resultsTitle}</h2>
          <p className="text-xs text-[#64748B] font-body mt-0.5">{resultsSubtitle}</p>
        </div>
      </div>

      {/* Content */}
      {isSubmitting && !result && (
        <div className="flex flex-col items-center py-12 gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
          <p className="text-sm text-[#64748B] font-body">Analyzing...</p>
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
              className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-premium transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#0F172A] font-display">{plan.insurer}</h3>
                  <p className="text-sm text-[#64748B] font-body">{plan.plan}</p>
                </div>
                <StarRating rating={plan.rating} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[#64748B] font-body">{sumInsuredLabel}</span>
                  <p className="font-semibold text-[#0F172A] font-body">{plan.sumInsured}</p>
                </div>
                <div>
                  <span className="text-[#64748B] font-body">{premiumLabel}</span>
                  <p className="font-semibold text-[#0F172A] font-body">{plan.monthlyPremium}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-1.5">
                <p className="text-xs text-[#64748B] font-body">
                  <span className="font-medium text-[#0F172A]">{whyFitsLabel}:</span> {plan.whyItFits}
                </p>
                <p className="text-xs text-[#64748B] font-body">
                  <span className="font-medium text-[#0F172A]">{claimRatioLabel}:</span> {plan.claimRatio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {result && result.advisorMessage && (
        <div className="mt-4 p-4 bg-gradient-to-r from-[#EFF6FF] to-[#F0FDF4] rounded-xl border border-[#E2E8F0]">
          <p className="text-sm font-medium text-[#0F172A] font-body mb-1">{advisorMessageLabel}</p>
          <p className="text-sm text-[#64748B] font-body">{result.advisorMessage}</p>
        </div>
      )}

      {result && result.followUpQuestion && (
        <div className="mt-3 p-4 bg-[#EFF6FF] rounded-xl border border-[#2563EB]/10">
          <p className="text-sm font-medium text-[#2563EB] font-body mb-1">{followUpLabel}</p>
          <p className="text-sm text-[#64748B] font-body">{result.followUpQuestion}</p>
        </div>
      )}

      {result && (!result.plans || result.plans.length === 0) && (
        <div className="text-center py-8">
          <p className="text-[#64748B] font-body">{noPlansMsg}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          href="https://wa.me/919257877312"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] text-white font-semibold text-sm hover:bg-[#059669] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {whatsappCTA}
        </a>
        <button
          onClick={handleStartOver}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E2E8F0] text-[#0F172A] font-semibold text-sm hover:bg-[#F8FAFC] transition-colors font-body"
        >
          {startOverLabel}
        </button>
      </div>
    </motion.div>
  );

  return (
    <section
      id="advisor-form"
      className="relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F8FAFC] dark:from-[#060E22] dark:via-[#0A1330] dark:to-[#060E22] pt-20 pb-20 sm:pb-32"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2563EB]/10 dark:bg-[#2563EB]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#10B981]/10 dark:bg-[#10B981]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8C872]/5 dark:bg-[#D4A853]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-full border border-[#E2E8F0] dark:border-white/10 mb-6 shadow-premium"
            >
              <Sparkles className="h-4 w-4 text-[#E8C872]" />
              <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">
                {trustBadgeText}
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] dark:text-[#F8F6F0] mb-6 leading-tight font-display">
              {headlineBefore}{' '}
              <span className="gradient-text-blue-emerald">{headlineAccent}</span>{' '}
              {headlineAfter}
            </h1>

            <p className="text-lg text-[#64748B] dark:text-[#A6AEC7] mb-8 leading-relaxed font-body max-w-xl">
              {subtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#advisor-form"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('advisor-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F172A] dark:bg-[#D4A853] hover:bg-[#1E293B] dark:hover:bg-[#E2C06E] text-white dark:text-[#060E22] font-semibold rounded-xl shadow-premium-lg transition-all duration-300 font-body"
              >
                <Shield className="h-5 w-5" />
                {primaryCTA}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#E2E8F0] dark:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 text-[#0F172A] dark:text-[#F8F6F0] font-semibold rounded-xl transition-all duration-300 font-body"
              >
                {secondaryCTA}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8F6F0] font-display">{socialProof1Val}</div>
                <div className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">{socialProof1Label}</div>
              </div>
              <div className="h-12 w-px bg-[#E2E8F0] dark:bg-white/10"></div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8F6F0] font-display">{socialProof2Val}</div>
                <div className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">{socialProof2Label}</div>
              </div>
              <div className="h-12 w-px bg-[#E2E8F0] dark:bg-white/10"></div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8F6F0] font-display">{socialProof3Val}</div>
                <div className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">{socialProof3Label}</div>
              </div>
            </div>
          </motion.div>

          {/* Visual: Protection Score Card + Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Protection Score Card — desktop only, shown when not filling form */}
            <div className="hidden lg:block mb-6">
              <div className="bg-white dark:bg-card/80 rounded-3xl p-8 shadow-premium-lg border border-[#E2E8F0] dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body mb-1">Protection Score</div>
                    <div className="text-4xl font-bold text-[#0F172A] dark:text-[#F8F6F0] font-display">87/100</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#2563EB]/10 to-[#10B981]/10 rounded-2xl">
                    <Shield className="h-8 w-8 text-[#2563EB]" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">Life Coverage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-[#F1F5F9] dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[90%] bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">90%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">Health Protection</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-[#F1F5F9] dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">Vehicle Insurance</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-[#F1F5F9] dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[95%] bg-gradient-to-r from-[#E8C872] to-[#F59E0B] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">95%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-[#EFF6FF] to-[#F0FDF4] dark:from-[#2563EB]/5 dark:to-[#10B981]/5 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">
                    <TrendingUp className="h-4 w-4 text-[#10B981]" />
                    {isHindi ? 'इस साल आपका सुरक्षा 23% बेहतर हुआ' : isEnglish ? 'Your protection improved by 23% this year' : 'Aapki protection 23% better hui is saal'}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards — desktop only */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white dark:bg-card/80 rounded-2xl p-4 shadow-premium-lg border border-[#E2E8F0] dark:border-white/10 hidden lg:block z-10"
            >
              <div className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body mb-1">Savings This Year</div>
              <div className="text-2xl font-bold gradient-text-blue-emerald font-display">₹45,000</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-24 -left-4 bg-white dark:bg-card/80 rounded-2xl p-4 shadow-premium-lg border border-[#E2E8F0] dark:border-white/10 hidden lg:block z-10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#10B981]/10 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-xs text-[#64748B] dark:text-[#A6AEC7] font-body">Claims Settled</div>
                  <div className="text-lg font-bold text-[#0F172A] dark:text-[#F8F6F0] font-display">100%</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Adviser Form — premium white card */}
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
                  {/* Premium white form card */}
                  <div className="bg-white dark:bg-card/80 rounded-3xl overflow-hidden shadow-premium-lg border border-[#E2E8F0] dark:border-white/10">
                    {/* Card header */}
                    <div className="flex items-center gap-3.5 px-7 py-5 border-b border-[#E2E8F0] dark:border-white/10">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB]/15 to-[#10B981]/5 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-[#2563EB]" />
                      </div>
                      <span className="text-sm font-bold tracking-[0.1em] text-[#0F172A] dark:text-[#F8F6F0] uppercase font-body">
                        AI Quick Adviser
                      </span>
                      <span className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2563EB]/10 text-[10px] font-bold text-[#2563EB] border border-[#2563EB]/10">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI
                      </span>
                      <div className="ml-auto text-xs text-[#64748B] dark:text-[#A6AEC7] font-body">
                        {step}/4
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="px-7 pt-3">
                      <Progress value={progressPercent} className="h-1 bg-[#F1F5F9] dark:bg-white/10" />
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
                            <label className="text-xl font-semibold text-[#0F172A] dark:text-[#F8F6F0] tracking-tight font-display">
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
                                className="h-14 text-xl bg-transparent border-0 border-b-2 border-[#E2E8F0] dark:border-white/20 rounded-none focus:border-[#2563EB] dark:focus:border-[#D4A853] focus:ring-0 px-0 text-[#0F172A] dark:text-[#F8F6F0] placeholder:text-[#64748B]/40 transition-colors duration-300"
                              />
                              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#64748B]/40 text-sm font-body">
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
                            <label className="text-xl font-semibold text-[#0F172A] dark:text-[#F8F6F0] tracking-tight font-display">
                              {stepLabels[2]}
                            </label>
                            <div className="flex gap-2.5 flex-wrap">
                              {familySizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() =>
                                    setFormData((p) => ({ ...p, familySize: size }))
                                  }
                                  className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border transition-all duration-300 font-body ${
                                    formData.familySize === size
                                      ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] scale-[1.03] shadow-premium'
                                      : 'border-[#E2E8F0] dark:border-white/20 bg-[#F8FAFC] dark:bg-white/5 text-[#64748B] dark:text-[#A6AEC7] hover:border-[#2563EB]/30 hover:bg-[#2563EB]/5 hover:scale-[1.02]'
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
                            <label className="text-xl font-semibold text-[#0F172A] dark:text-[#F8F6F0] tracking-tight font-display">
                              {stepLabels[3]}
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]/40" />
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
                                className="h-14 text-xl bg-transparent border-0 border-b-2 border-[#E2E8F0] dark:border-white/20 rounded-none focus:border-[#2563EB] dark:focus:border-[#D4A853] focus:ring-0 pl-7 px-0 text-[#0F172A] dark:text-[#F8F6F0] placeholder:text-[#64748B]/30 transition-colors duration-300"
                              />
                            </div>
                            {/* City suggestions dropdown */}
                            {showSuggestions && (
                              <div className="absolute top-full left-0 right-0 mt-2 z-20 rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white/90 dark:bg-card/90 backdrop-blur-xl overflow-hidden shadow-premium-lg">
                                {citySuggestions.map((city) => (
                                  <button
                                    key={city}
                                    onClick={() => selectCity(city)}
                                    className="w-full px-5 py-3 text-left text-sm text-[#0F172A] dark:text-[#F8F6F0] hover:bg-[#2563EB]/10 hover:text-[#2563EB] transition-colors duration-200 font-body"
                                  >
                                    <MapPin className="w-3.5 h-3.5 inline mr-2.5 text-[#64748B]/50" />
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
                            <label className="text-xl font-semibold text-[#0F172A] dark:text-[#F8F6F0] tracking-tight font-display">
                              {stepLabels[4]}
                            </label>
                            <div className="flex items-center gap-3">
                              <IndianRupee className="w-5 h-5 text-[#2563EB]/70 shrink-0" />
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
                              <span className="text-[#64748B]/40 text-xs font-body">₹500</span>
                              <span className="text-2xl font-bold text-[#0F172A] dark:text-[#F8F6F0] font-display tracking-tight">
                                ₹{formData.budget.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[#64748B]/40 text-xs font-body">₹10,000</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation buttons */}
                      <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#E2E8F0] dark:border-white/10">
                        {step > 1 ? (
                          <button
                            onClick={handleBack}
                            className="text-sm text-[#64748B] dark:text-[#A6AEC7] hover:text-[#0F172A] dark:hover:text-[#F8F6F0] transition-all duration-200 hover:-translate-x-0.5 font-body"
                          >
                            ← {isHindi ? 'पीछे' : isEnglish ? 'Back' : 'Back'}
                          </button>
                        ) : (
                          <div />
                        )}

                        {step < 4 ? (
                          <button
                            onClick={handleNext}
                            className="group flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#0F172A] dark:bg-[#D4A853] text-white dark:text-[#060E22] font-semibold text-sm hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 font-body shadow-premium"
                          >
                            {isHindi ? 'अगला' : isEnglish ? 'Next' : 'Next'}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="group flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#0F172A] dark:bg-[#D4A853] text-white dark:text-[#060E22] font-semibold text-sm hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 font-body shadow-premium"
                          >
                            {isSubmitting ? '...' : getPlanLabel}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Divider + WhatsApp link */}
                    <div className="px-7 pb-6">
                      <div className="flex items-center gap-3 text-[#64748B]/40 text-xs font-body">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E2E8F0] dark:via-white/10 to-transparent" />
                        {orDivider}
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E2E8F0] dark:via-white/10 to-transparent" />
                      </div>
                      <a
                        href="https://wa.me/919257877312"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl border border-[#E2E8F0] dark:border-white/20 text-[#64748B] dark:text-[#A6AEC7] text-sm font-medium hover:text-[#0F172A] dark:hover:text-[#F8F6F0] hover:border-[#2563EB]/30 hover:bg-[#2563EB]/5 transition-all duration-200 font-body hover:scale-[1.01] active:scale-[0.99]"
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
