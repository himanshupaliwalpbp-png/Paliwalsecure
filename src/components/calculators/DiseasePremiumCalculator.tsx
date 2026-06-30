'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Calculator, Heart, Brain, Droplet, Wind, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type DiseaseType = 'diabetes' | 'bp' | 'heart' | 'cancer' | 'asthma' | 'thyroid' | 'kidney' | 'liver' | 'none';
type DiseaseSeverity = 'mild' | 'moderate' | 'severe';
type CityTier = 'tier1' | 'tier2' | 'tier3';

interface DiseaseConfig {
  label: string;
  icon: typeof Heart;
  baseLoading: number; // %
  severityMultiplier: Record<DiseaseSeverity, number>;
  pedWaitingMonths: number;
  bestInsurer: string;
  bestInsurerCsr: string;
  emoji: string;
}

const DISEASE_CONFIG: Record<DiseaseType, DiseaseConfig> = {
  none: {
    label: 'None (Healthy)',
    icon: CheckCircle2,
    baseLoading: 0,
    severityMultiplier: { mild: 1, moderate: 1, severe: 1 },
    pedWaitingMonths: 0,
    bestInsurer: 'Any (all insurers)',
    bestInsurerCsr: 'Standard rates',
    emoji: '✅',
  },
  diabetes: {
    label: 'Diabetes (Type 2)',
    icon: Droplet,
    baseLoading: 20,
    severityMultiplier: { mild: 0.8, moderate: 1.0, severe: 1.5 },
    pedWaitingMonths: 24,
    bestInsurer: 'Star Health Diabetes Safe',
    bestInsurerCsr: '82% CSR',
    emoji: '🩸',
  },
  bp: {
    label: 'High BP / Hypertension',
    icon: Heart,
    baseLoading: 15,
    severityMultiplier: { mild: 0.7, moderate: 1.0, severe: 1.3 },
    pedWaitingMonths: 24,
    bestInsurer: 'Care Health Care Freedom',
    bestInsurerCsr: '98% CSR',
    emoji: '❤️',
  },
  heart: {
    label: 'Heart Disease',
    icon: Heart,
    baseLoading: 75,
    severityMultiplier: { mild: 0.6, moderate: 1.0, severe: 1.4 },
    pedWaitingMonths: 48,
    bestInsurer: 'Star Health Cardiac Care',
    bestInsurerCsr: '82% CSR',
    emoji: '💓',
  },
  cancer: {
    label: 'Cancer (Survivor)',
    icon: Activity,
    baseLoading: 50,
    severityMultiplier: { mild: 0.7, moderate: 1.0, severe: 1.6 },
    pedWaitingMonths: 60,
    bestInsurer: 'Star Cancer Care Gold',
    bestInsurerCsr: '82% CSR',
    emoji: '🎗️',
  },
  asthma: {
    label: 'Asthma',
    icon: Wind,
    baseLoading: 17.5,
    severityMultiplier: { mild: 0.6, moderate: 1.0, severe: 1.4 },
    pedWaitingMonths: 24,
    bestInsurer: 'Care Health Care Freedom',
    bestInsurerCsr: '98% CSR',
    emoji: '🫁',
  },
  thyroid: {
    label: 'Thyroid Disorder',
    icon: Activity,
    baseLoading: 10,
    severityMultiplier: { mild: 0.7, moderate: 1.0, severe: 1.3 },
    pedWaitingMonths: 24,
    bestInsurer: 'Care Health Care Freedom',
    bestInsurerCsr: '98% CSR',
    emoji: '🦋',
  },
  kidney: {
    label: 'Kidney Disease (CKD)',
    icon: Droplet,
    baseLoading: 45,
    severityMultiplier: { mild: 0.6, moderate: 1.0, severe: 1.5 },
    pedWaitingMonths: 48,
    bestInsurer: 'Star Health Red Carpet',
    bestInsurerCsr: '82% CSR',
    emoji: '🫘',
  },
  liver: {
    label: 'Liver Disease',
    icon: Activity,
    baseLoading: 35,
    severityMultiplier: { mild: 0.7, moderate: 1.0, severe: 1.4 },
    pedWaitingMonths: 48,
    bestInsurer: 'Care Health Care Freedom',
    bestInsurerCsr: '98% CSR',
    emoji: '🫀',
  },
};

const SEVERITY_LABELS: Record<DiseaseSeverity, string> = {
  mild: 'Mild (Controlled)',
  moderate: 'Moderate (On medication)',
  severe: 'Severe (Active treatment)',
};

const CITY_TIER_LOADING: Record<CityTier, number> = {
  tier1: 10,
  tier2: 0,
  tier3: -5,
};

const CITY_TIER_LABELS: Record<CityTier, string> = {
  tier1: 'Tier 1 (Metro: Delhi, Mumbai, Bangalore)',
  tier2: 'Tier 2 (Jaipur, Kota, Lucknow)',
  tier3: 'Tier 3 (Small town/village)',
};

// Base monthly premium per sum insured (IRDAI average rates 2025-26)
const BASE_PREMIUM_MAP: Record<number, number> = {
  300000: 420,
  500000: 550,
  700000: 680,
  1000000: 850,
  1500000: 1100,
  2500000: 1600,
  5000000: 2800,
  10000000: 4500,
};

const SUM_INSURED_OPTIONS = [
  { label: '₹3 Lakh', value: 300000 },
  { label: '₹5 Lakh', value: 500000 },
  { label: '₹7 Lakh', value: 700000 },
  { label: '₹10 Lakh', value: 1000000 },
  { label: '₹15 Lakh', value: 1500000 },
  { label: '₹25 Lakh', value: 2500000 },
  { label: '₹50 Lakh', value: 5000000 },
  { label: '₹1 Crore', value: 10000000 },
];

// ============================================================================
// HELPERS
// ============================================================================

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.round(amount)}`;
}

function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function getAgeLoading(age: number): number {
  if (age <= 35) return 0;
  const fiveYearBlocks = Math.floor((age - 35) / 5);
  return fiveYearBlocks * 5;
}

// ============================================================================
// CALCULATION
// ============================================================================

interface DiseaseCalcResult {
  basePremiumMonthly: number;
  basePremiumAnnual: number;
  ageLoading: number;
  diseaseLoading: number;
  cityLoading: number;
  totalLoading: number;
  loadedPremiumMonthly: number;
  loadedPremiumAnnual: number;
  pedWaitingMonths: number;
  taxSaved: number;
  effectiveMonthly: number;
  recommendedInsurer: string;
  recommendedCsr: string;
  diseaseEmoji: string;
  warningMessage: string;
}

function calculateDiseasePremium(
  age: number,
  sumInsured: number,
  disease: DiseaseType,
  severity: DiseaseSeverity,
  cityTier: CityTier
): DiseaseCalcResult {
  const config = DISEASE_CONFIG[disease];
  const basePremiumMonthly = BASE_PREMIUM_MAP[sumInsured] || 550;
  const basePremiumAnnual = basePremiumMonthly * 12;

  // Age loading
  const ageLoadingPercent = getAgeLoading(age);
  const ageLoadingAmount = (basePremiumAnnual * ageLoadingPercent) / 100;

  // Disease loading (base × severity multiplier)
  const diseaseLoadingPercent = config.baseLoading * config.severityMultiplier[severity];
  const diseaseLoadingAmount = (basePremiumAnnual * diseaseLoadingPercent) / 100;

  // City tier loading
  const cityLoadingPercent = CITY_TIER_LOADING[cityTier];
  const cityLoadingAmount = (basePremiumAnnual * cityLoadingPercent) / 100;

  const totalLoading = ageLoadingAmount + diseaseLoadingAmount + cityLoadingAmount;
  const loadedPremiumAnnual = basePremiumAnnual + totalLoading;
  const loadedPremiumMonthly = loadedPremiumAnnual / 12;

  // Tax savings (Section 80D)
  const isSenior = age >= 60;
  const deduction80D = Math.min(loadedPremiumAnnual, isSenior ? 50000 : 25000);
  const taxBracket = 20; // assume 20% bracket
  const taxSaved = (deduction80D * taxBracket) / 100;

  const effectiveMonthly = (loadedPremiumAnnual - taxSaved) / 12;

  // Warning messages based on disease + severity
  let warningMessage = '';
  if (disease === 'none') {
    warningMessage = 'No pre-existing disease — standard premium applies. Best time to buy insurance!';
  } else if (disease === 'heart' || disease === 'cancer' || disease === 'kidney') {
    warningMessage = `⚠️ ${config.label} is high-risk. ${config.pedWaitingMonths} months PED waiting mandatory. Honest disclosure critical — hiding leads to claim rejection.`;
  } else if (severity === 'severe') {
    warningMessage = `⚠️ Severe ${config.label} may require medical underwriting. Some insurers may reject or apply higher loading. Compare 3+ insurers.`;
  } else {
    warningMessage = `${config.label} patient CAN get insurance. ${config.pedWaitingMonths} months PED waiting. Buy early — younger age = lower premium.`;
  }

  return {
    basePremiumMonthly,
    basePremiumAnnual,
    ageLoading: ageLoadingAmount,
    diseaseLoading: diseaseLoadingAmount,
    cityLoading: cityLoadingAmount,
    totalLoading,
    loadedPremiumMonthly,
    loadedPremiumAnnual,
    pedWaitingMonths: config.pedWaitingMonths,
    taxSaved,
    effectiveMonthly,
    recommendedInsurer: config.bestInsurer,
    recommendedCsr: config.bestInsurerCsr,
    diseaseEmoji: config.emoji,
    warningMessage,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function DiseasePremiumCalculator() {
  const [age, setAge] = useState(40);
  const [sumInsured, setSumInsured] = useState(1000000);
  const [disease, setDisease] = useState<DiseaseType>('diabetes');
  const [severity, setSeverity] = useState<DiseaseSeverity>('moderate');
  const [cityTier, setCityTier] = useState<CityTier>('tier2');
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () => calculateDiseasePremium(age, sumInsured, disease, severity, cityTier),
    [age, sumInsured, disease, severity, cityTier]
  );

  const handleCalculate = () => setShowResult(true);

  const DiseaseIcon = DISEASE_CONFIG[disease].icon;

  return (
    <Card className="w-full border-0 shadow-lg shadow-red-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Disease-Specific Premium Calculator</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Diabetes, BP, Heart, Cancer, Asthma — accurate premium with PED loading
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Disease Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Pre-Existing Disease</Label>
          <Select value={disease} onValueChange={(v) => setDisease(v as DiseaseType)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DISEASE_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  {cfg.emoji} {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Severity */}
        {disease !== 'none' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Disease Severity</Label>
            <Select value={severity} onValueChange={(v) => setSeverity(v as DiseaseSeverity)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SEVERITY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Age Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Your Age</Label>
            <Badge variant="secondary" className="text-sm font-semibold">{age} years</Badge>
          </div>
          <Slider
            value={[age]}
            onValueChange={(v) => setAge(v[0])}
            min={18}
            max={80}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>18</span>
            <span>35 (no loading)</span>
            <span>80</span>
          </div>
        </div>

        {/* Sum Insured */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sum Insured (Cover Amount)</Label>
          <Select value={String(sumInsured)} onValueChange={(v) => setSumInsured(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUM_INSURED_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Tier */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">City Tier</Label>
          <Select value={cityTier} onValueChange={(v) => setCityTier(v as CityTier)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CITY_TIER_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calculate Button */}
        <Button onClick={handleCalculate} className="w-full bg-[#B8482C] hover:bg-[#8B3520] text-white" size="lg">
          <Calculator className="w-4 h-4 mr-2" />
          Calculate My Premium
        </Button>

        {/* Results */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <Separator />

              {/* Main Result */}
              <div className="rounded-xl bg-gradient-to-br from-[#FBE8E1] to-[#F4E5DD] dark:from-[rgba(184,72,44,0.15)] dark:to-[rgba(184,72,44,0.05)] p-5 border border-[rgba(184,72,44,0.20)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{result.diseaseEmoji}</span>
                  <span className="text-sm font-semibold text-[#B8482C] dark:text-[#F0A88B]">
                    Estimated Premium
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#0E1116] dark:text-[#FAF7F2]">
                      {formatCurrencyFull(Math.round(result.loadedPremiumMonthly))}
                    </span>
                    <span className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">/month</span>
                  </div>
                  <div className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">
                    Annual: <span className="font-semibold">{formatCurrencyFull(Math.round(result.loadedPremiumAnnual))}</span>
                  </div>
                  <div className="text-xs text-[#2D6A4F] dark:text-[#6EE7B7] font-medium">
                    💰 Tax saved (80D): {formatCurrencyFull(Math.round(result.taxSaved))}/yr
                  </div>
                </div>
              </div>

              {/* Loading Breakdown */}
              <div className="rounded-xl bg-[#FAF7F2] dark:bg-[#1A1F27] p-4 space-y-2">
                <h4 className="text-sm font-semibold mb-2 text-[#0E1116] dark:text-[#FAF7F2]">Premium Breakdown</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Base premium (annual)</span>
                  <span className="font-medium text-[#0E1116] dark:text-[#FAF7F2]">{formatCurrencyFull(result.basePremiumAnnual)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4F57] dark:text-[#A8B0C2]">+ Age loading ({age} yrs)</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">+{formatCurrencyFull(result.ageLoading)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4F57] dark:text-[#A8B0C2]">+ Disease loading ({DISEASE_CONFIG[disease].label})</span>
                  <span className="font-medium text-red-600 dark:text-red-400">+{formatCurrencyFull(result.diseaseLoading)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4F57] dark:text-[#A8B0C2]">+ City adjustment</span>
                  <span className={`font-medium ${result.cityLoading >= 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                    {result.cityLoading >= 0 ? '+' : ''}{formatCurrencyFull(result.cityLoading)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-[#0E1116] dark:text-[#FAF7F2]">Total annual premium</span>
                  <span className="text-[#B8482C] dark:text-[#F0A88B]">{formatCurrencyFull(Math.round(result.loadedPremiumAnnual))}</span>
                </div>
              </div>

              {/* Disease-specific Info */}
              {disease !== 'none' && (
                <div className="rounded-xl bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.12)] p-4 border border-[rgba(45,106,79,0.20)]">
                  <h4 className="text-sm font-semibold mb-2 text-[#2D6A4F] dark:text-[#6EE7B7] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {DISEASE_CONFIG[disease].label} — Insurance Info
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">PED Waiting Period</span>
                      <span className="font-medium text-[#0E1116] dark:text-[#FAF7F2]">{result.pedWaitingMonths} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Best insurer for this disease</span>
                      <span className="font-medium text-[#0E1116] dark:text-[#FAF7F2]">{result.recommendedInsurer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Insurer CSR</span>
                      <span className="font-medium text-[#0E1116] dark:text-[#FAF7F2]">{result.recommendedCsr}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Important</h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      {result.warningMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <a
                  href={`https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20used%20the%20Disease%20Premium%20Calculator.%20I%20have%20${encodeURIComponent(DISEASE_CONFIG[disease].label)}%20(age%20${age}%2C%20sum%20insured%20${formatCurrency(sumInsured)}).%20Need%20help%20choosing%20best%20plan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-[#2D6A4F] hover:bg-[#235541] text-white" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Get Personalized Quote
                  </Button>
                </a>
                <a
                  href="/compare/health"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full border-[#B8482C] text-[#B8482C] hover:bg-[#FBE8E1]" size="sm">
                    Compare Health Plans
                  </Button>
                </a>
              </div>

              <p className="text-[10px] text-center text-[#8B9099] dark:text-[#A8B0C2] mt-2">
                * Estimates based on IRDAI Annual Report 2025-26 rates. Actual premium may vary based on medical underwriting.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
