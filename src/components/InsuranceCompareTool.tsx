'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCompareArrows, Heart, Shield, Car, Award, Star, CheckCircle2,
  ArrowRight, MessageCircle, IndianRupee, Clock, Hospital, Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  allInsurancePlans,
  categoryInfo,
  type InsuranceCategory,
  type InsurancePlan,
} from '@/lib/insurance-data';
import { useLanguage } from '@/lib/i18n';

// ── Category icon mapping ────────────────────────────────────────────────────
const categoryIcons: Record<string, React.ElementType> = {
  health: Heart,
  life: Shield,
  motor: Car,
};

const categoryColors: Record<string, { gradient: string; bg: string; text: string; light: string }> = {
  health: { gradient: 'from-red-500 to-rose-400', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', light: 'bg-red-50 dark:bg-red-950/20' },
  life: { gradient: 'from-emerald-500 to-green-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', light: 'bg-emerald-50 dark:bg-emerald-950/20' },
  motor: { gradient: 'from-amber-500 to-yellow-400', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', light: 'bg-amber-50 dark:bg-amber-950/20' },
};

// ── Get top 3 plans for comparison ───────────────────────────────────────────
function getTop3Plans(category: InsuranceCategory): InsurancePlan[] {
  const plans = allInsurancePlans.filter((p) => p.category === category);
  return plans
    .sort((a, b) => {
      // Sort by rating desc, then CSR desc
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.claimSettlementRatio - a.claimSettlementRatio;
    })
    .slice(0, 3);
}

// ── Determine "Best Value" plan ──────────────────────────────────────────────
function getBestValueIndex(plans: InsurancePlan[]): number {
  // Score: rating * 20 + CSR * 0.3 - (monthly premium / 100)
  let bestIdx = 0;
  let bestScore = -Infinity;
  plans.forEach((plan, idx) => {
    const score = plan.rating * 20 + plan.claimSettlementRatio * 0.3 - plan.premium.monthly / 100;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  });
  return bestIdx;
}

// ── Format helpers ───────────────────────────────────────────────────────────
function formatINRShort(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function InsuranceCompareTool() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<InsuranceCategory>('health');

  const plans = useMemo(() => getTop3Plans(activeCategory), [activeCategory]);
  const bestValueIdx = useMemo(() => getBestValueIndex(plans), [plans]);
  const catInfo = categoryInfo.find((c) => c.id === activeCategory);
  const catColor = categoryColors[activeCategory] || categoryColors.health;
  const CatIcon = categoryIcons[activeCategory] || Shield;

  // Labels
  const labels = useMemo(() => ({
    title: language === 'hi' ? 'बीमा तुलना उपकरण' : language === 'hinglish' ? 'Insurance Compare Tool' : 'Insurance Compare Tool',
    subtitle: language === 'hi' ? 'शीर्ष योजनाओं की साइड-बाय-साइड तुलना करें' : language === 'hinglish' ? 'Top plans ko side-by-side compare karein' : 'Compare top plans side-by-side',
    bestValue: language === 'hi' ? 'सर्वोत्तम मूल्य' : language === 'hinglish' ? 'Best Value' : 'Best Value',
    premium: language === 'hi' ? 'प्रीमियम' : language === 'hinglish' ? 'Premium' : 'Premium',
    perMonth: language === 'hi' ? '/माह' : language === 'hinglish' ? '/mo' : '/mo',
    csr: language === 'hi' ? 'क्लेम सेटलमेंट' : language === 'hinglish' ? 'Claim Settlement' : 'Claim Settlement',
    keyFeatures: language === 'hi' ? 'मुख्य विशेषताएँ' : language === 'hinglish' ? 'Key Features' : 'Key Features',
    waitingPeriod: language === 'hi' ? 'वेटिंग पीरियड' : language === 'hinglish' ? 'Waiting Period' : 'Waiting Period',
    addOns: language === 'hi' ? 'ऐड-ऑन' : language === 'hinglish' ? 'Add-ons' : 'Add-ons',
    network: language === 'hi' ? 'नेटवर्क' : language === 'hinglish' ? 'Network' : 'Network',
    getQuote: language === 'hi' ? 'कोटेशन लें' : language === 'hinglish' ? 'Get Quote' : 'Get Quote',
    hospitals: language === 'hi' ? 'अस्पताल' : language === 'hinglish' ? 'hospitals' : 'hospitals',
    garages: language === 'hi' ? 'गैरेज' : language === 'hinglish' ? 'garages' : 'garages',
    rating: language === 'hi' ? 'रेटिंग' : language === 'hinglish' ? 'Rating' : 'Rating',
    sumInsured: language === 'hi' ? 'सम इंश्योर्ड' : language === 'hinglish' ? 'Sum Insured' : 'Sum Insured',
  }), [language]);

  const categories: { id: InsuranceCategory; label: string }[] = [
    { id: 'health', label: language === 'hi' ? 'स्वास्थ्य' : language === 'hinglish' ? 'Health' : 'Health' },
    { id: 'life', label: language === 'hi' ? 'जीवन' : language === 'hinglish' ? 'Life' : 'Life' },
    { id: 'motor', label: language === 'hi' ? 'मोटर' : language === 'hinglish' ? 'Motor' : 'Motor' },
  ];

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C98A1C] via-[#C98A1C] to-emerald-500 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <GitCompareArrows className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">{labels.title}</h3>
            <p className="text-sm text-white/80">{labels.subtitle}</p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mt-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-white/25 backdrop-blur text-white shadow-md'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* ── Comparison Cards ─────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-4">
          <AnimatePresence mode="wait">
            {plans.map((plan, idx) => {
              const isBestValue = idx === bestValueIdx;
              const planColor = isBestValue ? catColor : { ...catColor, gradient: 'from-slate-400 to-slate-300', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' };

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className={`relative rounded-xl border-2 overflow-hidden ${
                    isBestValue
                      ? `border-[#C98A1C]/50 dark:border-[#C98A1C]/50 shadow-lg shadow-[#C98A1C]/10`
                      : 'border-border/50'
                  }`}
                >
                  {/* Best Value Badge */}
                  {isBestValue && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl">
                        ⭐ {labels.bestValue}
                      </div>
                    </div>
                  )}

                  {/* Card Header */}
                  <div className={`p-4 bg-gradient-to-br ${planColor.gradient} text-white`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CatIcon className="w-4 h-4 text-white/80" />
                      <span className="text-xs text-white/80 font-medium">{plan.provider}</span>
                    </div>
                    <h4 className="text-sm font-bold leading-tight">{plan.name}</h4>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
                      <span className="text-sm font-bold">{plan.rating}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Premium */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{labels.premium}</span>
                      <span className="text-sm font-extrabold text-foreground">
                        ₹{plan.premium.monthly.toLocaleString('en-IN')}{labels.perMonth}
                      </span>
                    </div>

                    {/* CSR */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{labels.csr}</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {plan.claimSettlementRatio}%
                      </span>
                    </div>

                    {/* Sum Insured */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{labels.sumInsured}</span>
                      <span className="text-xs font-semibold text-foreground">
                        {formatINRShort(plan.sumInsured.min)} – {formatINRShort(plan.sumInsured.max)}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/30" />

                    {/* Key Features */}
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{labels.keyFeatures}</span>
                      <ul className="mt-1.5 space-y-1">
                        {plan.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-start gap-1.5 text-[11px] text-foreground">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Waiting Period */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {labels.waitingPeriod}
                      </span>
                      <span className="text-[10px] font-medium text-foreground max-w-[120px] text-right truncate">
                        {plan.waitingPeriod !== 'N/A' ? plan.waitingPeriod.split(',')[0] : 'N/A'}
                      </span>
                    </div>

                    {/* Add-ons */}
                    {(plan.addonsAvailable || plan.wellnessAddons) && (
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Wrench className="w-3 h-3" /> {labels.addOns}
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(plan.addonsAvailable || []).slice(0, 2).map((addon) => (
                            <Badge key={addon} className="text-[9px] px-1.5 py-0 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                              {addon}
                            </Badge>
                          ))}
                          {plan.wellnessAddons && (
                            <Badge className="text-[9px] px-1.5 py-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                              Wellness
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Network */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Hospital className="w-3 h-3" /> {labels.network}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {plan.networkHospitals
                          ? `${plan.networkHospitals.toLocaleString()}+ ${labels.hospitals}`
                          : plan.networkGarages
                          ? `${plan.networkGarages.toLocaleString()}+ ${labels.garages}`
                          : '—'}
                      </span>
                    </div>

                    {/* Get Quote Button */}
                    <Button
                      onClick={() => window.open(`https://wa.me/919257877312?text=Hi! I want a quote for ${plan.name} (${plan.provider}).`, '_blank')}
                      className={`w-full h-9 text-xs font-bold rounded-lg gap-1 ${
                        isBestValue
                          ? 'cta-glow'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                      variant={isBestValue ? 'default' : 'secondary'}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {labels.getQuote}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Footer Note ───────────────────────────────────────────────── */}
        <p className="text-[10px] text-muted-foreground text-center mt-4">
          {language === 'hi'
            ? '* तुलना सामान्य जानकारी के लिए है। वास्तविक प्रीमियम भिन्न हो सकता है।'
            : language === 'hinglish'
            ? '* Comparison is for general info. Actual premium may vary.'
            : '* Comparison for general guidance only. Actual premiums may vary based on age, health, and location.'}
        </p>
      </div>
    </div>
  );
}
