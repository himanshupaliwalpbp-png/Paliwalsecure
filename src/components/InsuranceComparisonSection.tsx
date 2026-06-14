'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Shield, Car, Plane, Home as HomeIcon,
  Star, CheckCircle2, ArrowRight, Calculator,
  ChevronLeft, ChevronRight, TrendingUp, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  healthInsurancePlans,
  lifeInsurancePlans,
  motorInsurancePlans,
  travelInsurancePlans,
  homeInsurancePlans,
  type InsurancePlan,
  type InsuranceCategory,
} from '@/lib/insurance-data';
import { useLanguage } from '@/lib/i18n';

// ── Category config ──────────────────────────────────────────────────────────
const categoryConfig: {
  id: InsuranceCategory;
  labelKey: string;
  icon: React.ElementType;
  emoji: string;
  plans: InsurancePlan[];
  premiumUnit: string;
}[] = [
  {
    id: 'health',
    labelKey: 'plans.tab.health',
    icon: Heart,
    emoji: '❤️',
    plans: healthInsurancePlans,
    premiumUnit: '/mo',
  },
  {
    id: 'life',
    labelKey: 'plans.tab.term',
    icon: Shield,
    emoji: '🛡️',
    plans: lifeInsurancePlans,
    premiumUnit: '/mo',
  },
  {
    id: 'motor',
    labelKey: 'plans.tab.motor',
    icon: Car,
    emoji: '🚗',
    plans: motorInsurancePlans,
    premiumUnit: '/yr',
  },
  {
    id: 'travel',
    labelKey: 'plans.tab.travel',
    icon: Plane,
    emoji: '✈️',
    plans: travelInsurancePlans,
    premiumUnit: '/trip',
  },
  {
    id: 'home',
    labelKey: 'plans.tab.home',
    icon: HomeIcon,
    emoji: '🏠',
    plans: homeInsurancePlans,
    premiumUnit: '/mo',
  },
];

// ── Coverage amount options per category ─────────────────────────────────────
const coverageOptions: Record<InsuranceCategory, { label: string; value: number }[]> = {
  health: [
    { label: '₹3 Lakh', value: 300000 },
    { label: '₹5 Lakh', value: 500000 },
    { label: '₹10 Lakh', value: 1000000 },
    { label: '₹15 Lakh', value: 1500000 },
    { label: '₹25 Lakh', value: 2500000 },
  ],
  life: [
    { label: '₹25 Lakh', value: 2500000 },
    { label: '₹50 Lakh', value: 5000000 },
    { label: '₹75 Lakh', value: 7500000 },
    { label: '₹1 Crore', value: 10000000 },
    { label: '₹2 Crore', value: 20000000 },
  ],
  motor: [
    { label: '₹3 Lakh', value: 300000 },
    { label: '₹5 Lakh', value: 500000 },
    { label: '₹10 Lakh', value: 1000000 },
    { label: '₹15 Lakh', value: 1500000 },
    { label: '₹25 Lakh', value: 2500000 },
  ],
  travel: [
    { label: '₹50 Thousand', value: 50000 },
    { label: '₹1 Lakh', value: 100000 },
    { label: '₹2 Lakh', value: 200000 },
    { label: '₹5 Lakh', value: 500000 },
  ],
  home: [
    { label: '₹5 Lakh', value: 500000 },
    { label: '₹10 Lakh', value: 1000000 },
    { label: '₹25 Lakh', value: 2500000 },
    { label: '₹50 Lakh', value: 5000000 },
    { label: '₹1 Crore', value: 10000000 },
  ],
};

// ── Premium estimator logic ──────────────────────────────────────────────────
function estimatePremium(
  category: InsuranceCategory,
  age: number,
  coverage: number
): { min: number; max: number; unit: string } | null {
  const catConfig = categoryConfig.find((c) => c.id === category);
  if (!catConfig || catConfig.plans.length === 0) return null;

  const plans = catConfig.plans;
  const avgMonthlyPremium = plans.reduce((sum, p) => sum + p.premium.monthly, 0) / plans.length;
  const avgSumInsured = plans.reduce((sum, p) => sum + (p.sumInsured.min + p.sumInsured.max) / 2, 0) / plans.length;

  // Age factor
  const ageFactor = age < 25 ? 0.8 : age < 35 ? 1.0 : age < 45 ? 1.3 : age < 55 ? 1.6 : 2.0;
  // Coverage factor
  const coverageFactor = coverage / avgSumInsured;

  const basePremium = avgMonthlyPremium * ageFactor * coverageFactor;

  if (category === 'motor') {
    const annualPremium = basePremium * 12;
    return {
      min: Math.round(annualPremium * 0.8),
      max: Math.round(annualPremium * 1.4),
      unit: '/yr',
    };
  }
  if (category === 'travel') {
    return {
      min: Math.round(basePremium * 0.7),
      max: Math.round(basePremium * 1.5),
      unit: '/trip',
    };
  }

  return {
    min: Math.round(basePremium * 0.8),
    max: Math.round(basePremium * 1.4),
    unit: '/mo',
  };
}

// ── Star rating display ──────────────────────────────────────────────────────
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const iconSize = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${iconSize} ${
            s <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : s - 0.5 <= rating
                ? 'fill-amber-200 text-amber-400'
                : 'text-muted-foreground/30'
          }`}
        />
      ))}
      <span className={`ml-1 font-semibold ${size === 'md' ? 'text-sm' : 'text-xs'} text-amber-600 dark:text-amber-400`}>
        {rating}
      </span>
    </span>
  );
}

// ── Plan Comparison Card ─────────────────────────────────────────────────────
function PlanCard({
  plan,
  rank,
  isTop,
  premiumUnit,
}: {
  plan: InsurancePlan;
  rank: number;
  isTop: boolean;
  premiumUnit: string;
}) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank * 0.1 }}
      className={`relative flex flex-col rounded-2xl border-2 overflow-hidden transition-shadow hover:shadow-lg ${
        isTop
          ? 'border-[#C98A1C] dark:border-[#C98A1C] bg-gradient-to-b from-[#C98A1C]/5 to-background dark:from-[#C98A1C]/10 dark:to-background shadow-lg shadow-[#C98A1C]/10'
          : 'border-border/50 bg-card hover:border-[#C98A1C]/30'
      }`}
    >
      {/* Rank badge */}
      {isTop && (
        <div className="absolute -top-0 left-4 px-3 py-1 bg-gradient-to-r from-[#C98A1C] to-[#E0A830] dark:from-[#C98A1C] dark:to-[#E0A830] text-white text-xs font-bold rounded-b-lg shadow-md">
          #1 {t('compare.topPick') || 'Top Pick'}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Provider & Plan Name */}
        <div className="mt-1">
          <p className="text-xs text-muted-foreground font-medium break-words">{plan.provider}</p>
          <h4 className="text-sm sm:text-base font-bold text-foreground mt-0.5 leading-tight line-clamp-2 break-words">
            {plan.name}
          </h4>
        </div>

        {/* Premium */}
        <div className="mt-4 p-3 rounded-xl bg-muted/50 border border-border/30">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {t('compare.startingPremium') || 'Starting Premium'}
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl sm:text-2xl font-extrabold ${isTop ? 'gradient-text' : 'text-foreground'}`}>
              ₹{plan.premium.monthly.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-muted-foreground">{premiumUnit}</span>
          </div>
          {plan.premium.annual > 0 && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              ₹{plan.premium.annual.toLocaleString('en-IN')}/yr
            </p>
          )}
        </div>

        {/* Key metrics */}
        <div className="mt-4 space-y-2.5">
          {/* CSR */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              {t('plans.csr') || 'CSR'}
            </span>
            <span className={`text-sm font-bold ${
              plan.claimSettlementRatio >= 98
                ? 'text-emerald-600 dark:text-emerald-400'
                : plan.claimSettlementRatio >= 95
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-foreground'
            }`}>
              {plan.claimSettlementRatio}%
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500" />
              {t('plans.rating') || 'Rating'}
            </span>
            <StarRating rating={plan.rating} />
          </div>

          {/* Sum Insured */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground shrink-0">{t('plans.sumInsured') || 'Sum Insured'}</span>
            <span className="text-xs font-semibold text-foreground">
              ₹{(plan.sumInsured.min / 100000).toFixed(0)}L–₹{(plan.sumInsured.max / 100000 >= 100)
                ? `₹${(plan.sumInsured.max / 10000000).toFixed(0)}Cr`
                : `${(plan.sumInsured.max / 100000).toFixed(0)}L`
              }
            </span>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-4 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {t('compare.keyFeatures') || 'Key Features'}
          </p>
          {plan.features.slice(0, 4).map((feat, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-foreground leading-tight break-words">{feat}</span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="mt-3 text-[10px] text-muted-foreground italic leading-tight line-clamp-1">
          &ldquo;{plan.tagline}&rdquo;
        </p>

        {/* CTA */}
        <div className="mt-auto pt-4 flex gap-2">
          <Button
            onClick={() => {
              const el = document.getElementById('whatsapp-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex-1 h-9 text-xs font-bold rounded-xl gap-1 ${
              isTop
                ? 'cta-glow'
                : 'bg-[#C98A1C] hover:bg-[#C98A1C]/90 dark:bg-[#C98A1C] dark:hover:bg-[#C98A1C]/90 text-white'
            }`}
          >
            {t('plans.getQuote') || 'Get Quote'} <ArrowRight className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const el = document.getElementById('whatsapp-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="h-9 px-3 text-xs font-bold rounded-xl border-[#C98A1C]/30 text-[#C98A1C] dark:text-[#C98A1C] hover:bg-[#C98A1C]/5 dark:hover:bg-[#C98A1C]/10"
          >
            {t('plans.compare') || 'Compare'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Premium Estimator ────────────────────────────────────────────────────────
function PremiumEstimator() {
  const { t } = useLanguage();
  const [estCategory, setEstCategory] = useState<InsuranceCategory>('health');
  const [estAge, setEstAge] = useState<string>('30');
  const [estCoverage, setEstCoverage] = useState<string>('500000');
  const [showEstimate, setShowEstimate] = useState(false);

  const estimate = useMemo(() => {
    if (!estAge || !estCoverage) return null;
    const age = parseInt(estAge, 10);
    const coverage = parseInt(estCoverage, 10);
    if (isNaN(age) || isNaN(coverage) || age < 18 || age > 80) return null;
    return estimatePremium(estCategory, age, coverage);
  }, [estCategory, estAge, estCoverage]);

  const handleEstimate = () => {
    setShowEstimate(true);
  };

  const catOptions = coverageOptions[estCategory];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#C98A1C]/20 dark:border-[#C98A1C]/20">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C98A1C] to-[#E0A830] dark:from-[#C98A1C] dark:to-[#E0A830] flex items-center justify-center shadow-lg">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {t('compare.estimatorTitle') || 'Quick Premium Estimator'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t('compare.estimatorDesc') || 'Get an instant premium estimate based on your profile'}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {/* Insurance Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            {t('compare.insuranceType') || 'Insurance Type'}
          </label>
          <Select value={estCategory} onValueChange={(v) => { setEstCategory(v as InsuranceCategory); setShowEstimate(false); }}>
            <SelectTrigger className="h-10 rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryConfig.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <span>{t(cat.labelKey) || cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Age */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            {t('compare.yourAge') || 'Your Age'}
          </label>
          <Input
            type="number"
            min={18}
            max={80}
            value={estAge}
            onChange={(e) => { setEstAge(e.target.value); setShowEstimate(false); }}
            placeholder="e.g., 30"
            className="h-10 rounded-xl text-sm"
          />
        </div>

        {/* Coverage Amount */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            {t('compare.coverageAmount') || 'Coverage Amount'}
          </label>
          <Select value={estCoverage} onValueChange={(v) => { setEstCoverage(v); setShowEstimate(false); }}>
            <SelectTrigger className="h-10 rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {catOptions.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estimate button */}
      <Button
        onClick={handleEstimate}
        className="mt-4 w-full sm:w-auto h-10 px-6 text-sm font-bold rounded-xl cta-glow gap-2"
        disabled={!estAge || parseInt(estAge, 10) < 18 || parseInt(estAge, 10) > 80}
      >
        <Calculator className="w-4 h-4" />
        {t('compare.estimatePremium') || 'Estimate Premium'}
      </Button>

      {/* Result */}
      <AnimatePresence>
        {showEstimate && estimate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-50 dark:from-amber-950/30 dark:to-amber-950/20 border border-[#C98A1C]/20 dark:border-[#C98A1C]/20">
              <p className="text-xs text-muted-foreground font-medium mb-2">
                {t('compare.estimatedRange') || 'Estimated Premium Range'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold gradient-text">
                  ₹{estimate.min.toLocaleString('en-IN')}
                </span>
                <span className="text-lg text-muted-foreground">–</span>
                <span className="text-2xl sm:text-3xl font-extrabold gradient-text">
                  ₹{estimate.max.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground font-medium">{estimate.unit}</span>
              </div>
              <div className="flex items-start gap-1.5 mt-3">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('compare.estimatorDisclaimer') || 'This is an indicative estimate based on IRDAI 2025-26 data. Actual premiums may vary based on health, medical history, and insurer terms.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Mobile Carousel ──────────────────────────────────────────────────────────
function MobilePlanCarousel({
  plans,
  premiumUnit,
}: {
  plans: InsurancePlan[];
  premiumUnit: string;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const goNext = () => setCurrentIdx((i) => Math.min(i + 1, plans.length - 1));
  const goPrev = () => setCurrentIdx((i) => Math.max(i - 1, 0));

  return (
    <div className="relative">
      {/* Card viewport */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={plans[currentIdx].id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <PlanCard
              plan={plans[currentIdx]}
              rank={currentIdx}
              isTop={currentIdx === 0}
              premiumUnit={premiumUnit}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {plans.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="w-9 h-9 rounded-full border border-border/50 bg-card flex items-center justify-center disabled:opacity-30 hover:border-[#C98A1C]/30 transition-colors"
            aria-label="Previous plan"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1.5">
            {plans.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIdx
                    ? 'w-6 bg-[#C98A1C] dark:bg-[#C98A1C]'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to plan ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentIdx === plans.length - 1}
            className="w-9 h-9 rounded-full border border-border/50 bg-card flex items-center justify-center disabled:opacity-30 hover:border-[#C98A1C]/30 transition-colors"
            aria-label="Next plan"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function InsuranceComparisonSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('health');

  const activeConfig = categoryConfig.find((c) => c.id === activeTab) || categoryConfig[0];
  const topPlans = useMemo(
    () =>
      [...activeConfig.plans]
        .sort((a, b) => b.claimSettlementRatio - a.claimSettlementRatio)
        .slice(0, 3),
    [activeConfig]
  );

  return (
    <div className="space-y-8">
      {/* ── Tabs & Comparison Cards ────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-auto flex-wrap h-auto gap-1 p-1 bg-muted/60 rounded-2xl border border-border/30">
          {categoryConfig.map((cat) => {
            const Icon = cat.icon;
            return (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C98A1C] data-[state=active]:to-[#E0A830] dark:data-[state=active]:from-[#C98A1C] dark:data-[state=active]:to-[#E0A830] data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t(cat.labelKey) || cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categoryConfig.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="mt-6">
            {/* Category header */}
            <div className="flex items-center gap-2 mb-4 min-w-0">
              <span className="text-2xl shrink-0">{cat.emoji}</span>
              <div className="min-w-0 overflow-hidden">
                <h3 className="text-lg font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {t(cat.labelKey) || cat.id.charAt(0).toUpperCase() + cat.id.slice(1)} {t('compare.insurance') || 'Insurance'}
                </h3>
                <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {t('compare.topPlansByCSR') || 'Top plans ranked by Claim Settlement Ratio'} &bull; {cat.plans.length} {t('compare.plansAvailable') || 'plans available'}
                </p>
              </div>
            </div>

            {/* Desktop: Side-by-side comparison */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-5">
              {[...cat.plans]
                .sort((a, b) => b.claimSettlementRatio - a.claimSettlementRatio)
                .slice(0, 3)
                .map((plan, idx) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    rank={idx}
                    isTop={idx === 0}
                    premiumUnit={cat.premiumUnit}
                  />
                ))}
            </div>

            {/* Mobile: Carousel */}
            <div className="lg:hidden">
              <MobilePlanCarousel
                plans={[...cat.plans]
                  .sort((a, b) => b.claimSettlementRatio - a.claimSettlementRatio)
                  .slice(0, 3)}
                premiumUnit={cat.premiumUnit}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* ── Quick Premium Estimator ────────────────────────────────────── */}
      <PremiumEstimator />
    </div>
  );
}
