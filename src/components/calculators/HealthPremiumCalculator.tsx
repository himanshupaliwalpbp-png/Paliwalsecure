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
import { Heart, Calculator, TrendingDown, Shield, AlertCircle, CheckCircle2, Info } from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type FamilyType = 'self' | 'self-spouse' | 'self-spouse-1kid' | 'self-spouse-2kids' | 'family-senior';
type PEDStatus = 'none' | 'diabetes' | 'bp' | 'heart' | 'thyroid' | 'asthma';
type CityTier = 'tier1' | 'tier2' | 'tier3';

const SUM_INSURED_OPTIONS = [
  { label: '₹2 Lakh', value: 200000 },
  { label: '₹3 Lakh', value: 300000 },
  { label: '₹5 Lakh', value: 500000 },
  { label: '₹7 Lakh', value: 700000 },
  { label: '₹10 Lakh', value: 1000000 },
  { label: '₹15 Lakh', value: 1500000 },
  { label: '₹25 Lakh', value: 2500000 },
];

const FAMILY_LABELS: Record<FamilyType, string> = {
  'self': 'Self Only',
  'self-spouse': 'Self + Spouse',
  'self-spouse-1kid': 'Self + Spouse + 1 Kid',
  'self-spouse-2kids': 'Self + Spouse + 2 Kids',
  'family-senior': 'Family Floater with Senior Parents',
};

const PED_LABELS: Record<PEDStatus, string> = {
  'none': 'None',
  'diabetes': 'Diabetes',
  'bp': 'BP / Hypertension',
  'heart': 'Heart Disease',
  'thyroid': 'Thyroid',
  'asthma': 'Asthma',
};

const PED_LOADING: Record<PEDStatus, { min: number; max: number; avg: number }> = {
  'none': { min: 0, max: 0, avg: 0 },
  'diabetes': { min: 15, max: 25, avg: 20 },
  'bp': { min: 10, max: 20, avg: 15 },
  'heart': { min: 50, max: 100, avg: 75 },
  'thyroid': { min: 5, max: 10, avg: 7.5 },
  'asthma': { min: 10, max: 25, avg: 17.5 },
};

const FAMILY_LOADING: Record<FamilyType, number> = {
  'self': 0,
  'self-spouse': 30,
  'self-spouse-1kid': 50,
  'self-spouse-2kids': 70,
  'family-senior': 110,
};

const CITY_TIER_LOADING: Record<CityTier, number> = {
  'tier1': 10,
  'tier2': 0,
  'tier3': -5,
};

const INSURER_RECOMMENDATIONS = [
  { name: 'Acko General Insurance', csr: 99.91, pedWaiting: '24 months', specialty: 'Digital-First, Quick Claims' },
  { name: 'HDFC ERGO', csr: 98.85, pedWaiting: '24 months', specialty: 'Optima Restore, 100% Restoration' },
  { name: 'TATA AIG', csr: 96.67, pedWaiting: '24 months', specialty: 'Trusted Brand, Critical Illness Rider' },
];

// Base monthly premium per sum insured (approximate Indian market rates)
const BASE_PREMIUM_MAP: Record<number, number> = {
  200000: 350,
  300000: 420,
  500000: 550,
  700000: 680,
  1000000: 850,
  1500000: 1100,
  2500000: 1600,
};

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

function getTaxBracket(age: number): number {
  // Default 20% for calculation display
  return 20;
}

interface CalculationResult {
  basePremiumMonthly: number;
  basePremiumAnnual: number;
  ageLoadingPercent: number;
  ageLoadingAmount: number;
  pedLoadingPercent: number;
  pedLoadingAmount: number;
  familyLoadingPercent: number;
  familyLoadingAmount: number;
  smokerLoadingPercent: number;
  smokerLoadingAmount: number;
  cityTierLoadingPercent: number;
  cityTierLoadingAmount: number;
  totalLoadingPercent: number;
  loadedPremiumMonthly: number;
  loadedPremiumAnnual: number;
  // Tax savings
  selfDeduction80D: number;
  parentsDeduction80D: number;
  totalDeduction80D: number;
  preventiveCheckup: number;
  taxSaved: number;
  effectivePremiumAnnual: number;
  effectivePremiumMonthly: number;
  // Hinglish message
  hinglishMessage: string;
}

function calculatePremium(
  age: number,
  sumInsured: number,
  familyType: FamilyType,
  ped: PEDStatus,
  cityTier: CityTier,
  smoker: boolean
): CalculationResult {
  const basePremiumMonthly = BASE_PREMIUM_MAP[sumInsured] || 550;
  const basePremiumAnnual = basePremiumMonthly * 12;

  // Age loading
  const ageLoadingPercent = getAgeLoading(age);
  const ageLoadingAmount = (basePremiumAnnual * ageLoadingPercent) / 100;

  // PED loading
  const pedLoadingPercent = PED_LOADING[ped].avg;
  const pedLoadingAmount = (basePremiumAnnual * pedLoadingPercent) / 100;

  // Family loading
  const familyLoadingPercent = FAMILY_LOADING[familyType];
  const familyLoadingAmount = (basePremiumAnnual * familyLoadingPercent) / 100;

  // Smoker loading
  const smokerLoadingPercent = smoker ? 25 : 0;
  const smokerLoadingAmount = (basePremiumAnnual * smokerLoadingPercent) / 100;

  // City tier
  const cityTierLoadingPercent = CITY_TIER_LOADING[cityTier];
  const cityTierLoadingAmount = (basePremiumAnnual * cityTierLoadingPercent) / 100;

  const totalLoadingPercent = ageLoadingPercent + pedLoadingPercent + familyLoadingPercent + smokerLoadingPercent + cityTierLoadingPercent;
  const totalLoadingAmount = ageLoadingAmount + pedLoadingAmount + familyLoadingAmount + smokerLoadingAmount + cityTierLoadingAmount;

  const loadedPremiumAnnual = basePremiumAnnual + totalLoadingAmount;
  const loadedPremiumMonthly = loadedPremiumAnnual / 12;

  // Section 80D Tax Calculation
  const isSenior = age >= 60;
  const hasSeniorParents = familyType === 'family-senior';

  const selfDeduction80D = Math.min(loadedPremiumAnnual, isSenior ? 50000 : 25000);
  const parentsDeduction80D = hasSeniorParents
    ? Math.min(loadedPremiumAnnual * 0.4, 50000) // Senior parents portion
    : 0;
  const preventiveCheckup = Math.min(5000, hasSeniorParents ? 5000 : 5000);
  const totalDeduction80D = selfDeduction80D + parentsDeduction80D;

  const taxBracket = getTaxBracket(age);
  const taxSaved = (totalDeduction80D * taxBracket) / 100;

  const effectivePremiumAnnual = loadedPremiumAnnual - taxSaved;
  const effectivePremiumMonthly = effectivePremiumAnnual / 12;

  // Hinglish message
  const hinglishMessage = `${formatCurrencyFull(loadedPremiumAnnual)} का प्रीमियम भरने पर आप ${formatCurrencyFull(taxSaved)} टैक्स बचा सकते हैं (Section 80D के तहत)`;

  return {
    basePremiumMonthly,
    basePremiumAnnual,
    ageLoadingPercent,
    ageLoadingAmount,
    pedLoadingPercent,
    pedLoadingAmount,
    familyLoadingPercent,
    familyLoadingAmount,
    smokerLoadingPercent,
    smokerLoadingAmount,
    cityTierLoadingPercent,
    cityTierLoadingAmount,
    totalLoadingPercent,
    loadedPremiumMonthly,
    loadedPremiumAnnual,
    selfDeduction80D,
    parentsDeduction80D,
    totalDeduction80D,
    preventiveCheckup,
    taxSaved,
    effectivePremiumAnnual,
    effectivePremiumMonthly,
    hinglishMessage,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function HealthPremiumCalculator() {
  const [age, setAge] = useState(30);
  const [sumInsured, setSumInsured] = useState(500000);
  const [familyType, setFamilyType] = useState<FamilyType>('self');
  const [ped, setPed] = useState<PEDStatus>('none');
  const [cityTier, setCityTier] = useState<CityTier>('tier2');
  const [smoker, setSmoker] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () => calculatePremium(age, sumInsured, familyType, ped, cityTier, smoker),
    [age, sumInsured, familyType, ped, cityTier, smoker]
  );

  const handleCalculate = () => {
    setShowResult(true);
  };

  return (
    <Card className="w-full border-0 shadow-lg shadow-blue-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Health Insurance Premium Calculator</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Section 80D Tax Savings ke saath accurate premium estimate
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
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
              <SelectValue placeholder="Select Sum Insured" />
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

        {/* Family Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Family Type</Label>
          <Select value={familyType} onValueChange={(v) => setFamilyType(v as FamilyType)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FAMILY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PED Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Pre-Existing Disease (PED)</Label>
          <Select value={ped} onValueChange={(v) => setPed(v as PEDStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PED_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label} {PED_LOADING[key as PEDStatus].avg > 0 && `(+${PED_LOADING[key as PEDStatus].avg}% loading)`}
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
              <SelectItem value="tier1">Tier 1 (Metro — +10%)</SelectItem>
              <SelectItem value="tier2">Tier 2 (Base Rate)</SelectItem>
              <SelectItem value="tier3">Tier 3 (-5%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Smoker */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Smoker Status</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={!smoker ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSmoker(false)}
              className={smoker ? '' : 'bg-blue-600 hover:bg-blue-700'}
            >
              No
            </Button>
            <Button
              type="button"
              variant={smoker ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSmoker(true)}
              className={smoker ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Yes (+25%)
            </Button>
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          size="lg"
        >
          <Calculator className="h-4 w-4" />
          Calculate Premium
        </Button>

        {/* Results */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <Separator />

              {/* Premium Summary */}
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 dark:from-blue-950/30 dark:to-indigo-950/30">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Premium Estimate
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-white/10">
                    <p className="text-xs text-muted-foreground">Base Premium</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{formatCurrency(result.basePremiumMonthly)}/mo</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(result.basePremiumAnnual)}/yr</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-100/60 dark:bg-blue-900/30">
                    <p className="text-xs text-blue-700 dark:text-blue-300">Loaded Premium</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{formatCurrency(result.loadedPremiumMonthly)}/mo</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{formatCurrency(result.loadedPremiumAnnual)}/yr</p>
                  </div>
                </div>
              </div>

              {/* Loading Breakdown */}
              <div className="rounded-xl bg-white/50 dark:bg-white/5 p-4 border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-amber-600" />
                  Loading Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  {result.ageLoadingPercent > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Age Loading (+{result.ageLoadingPercent}%)</span>
                      <span className="font-medium">+{formatCurrencyFull(result.ageLoadingAmount)}/yr</span>
                    </div>
                  )}
                  {result.pedLoadingPercent > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">PED Loading (+{result.pedLoadingPercent}%)</span>
                      <span className="font-medium text-amber-600">+{formatCurrencyFull(result.pedLoadingAmount)}/yr</span>
                    </div>
                  )}
                  {result.familyLoadingPercent > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Family Loading (+{result.familyLoadingPercent}%)</span>
                      <span className="font-medium">+{formatCurrencyFull(result.familyLoadingAmount)}/yr</span>
                    </div>
                  )}
                  {result.smokerLoadingPercent > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Smoker Loading (+{result.smokerLoadingPercent}%)</span>
                      <span className="font-medium text-red-600">+{formatCurrencyFull(result.smokerLoadingAmount)}/yr</span>
                    </div>
                  )}
                  {result.cityTierLoadingPercent !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        City Tier ({result.cityTierLoadingPercent > 0 ? '+' : ''}{result.cityTierLoadingPercent}%)
                      </span>
                      <span className={`font-medium ${result.cityTierLoadingPercent < 0 ? 'text-blue-600' : ''}`}>
                        {result.cityTierLoadingPercent > 0 ? '+' : ''}{formatCurrencyFull(result.cityTierLoadingAmount)}/yr
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Loading ({result.totalLoadingPercent}%)</span>
                    <span>+{formatCurrencyFull(result.ageLoadingAmount + result.pedLoadingAmount + result.familyLoadingAmount + result.smokerLoadingAmount + result.cityTierLoadingAmount)}/yr</span>
                  </div>
                </div>
              </div>

              {/* Section 80D Tax Savings */}
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 dark:from-blue-950/30 dark:to-indigo-950/30">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Section 80D Tax Savings
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">80D Self/Family Deduction</span>
                    <span className="font-medium">{formatCurrencyFull(result.selfDeduction80D)}</span>
                  </div>
                  {result.parentsDeduction80D > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">80D Parents Deduction</span>
                      <span className="font-medium">{formatCurrencyFull(result.parentsDeduction80D)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preventive Check-up (within limit)</span>
                    <span className="font-medium">{formatCurrencyFull(result.preventiveCheckup)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-blue-700 dark:text-blue-300">
                    <span>Total Tax Saved (20% bracket)</span>
                    <span>{formatCurrencyFull(result.taxSaved)}/yr</span>
                  </div>
                  <div className="flex justify-between font-bold text-blue-700 dark:text-blue-300">
                    <span>Effective Premium After Tax Savings</span>
                    <span>{formatCurrencyFull(result.effectivePremiumAnnual)}/yr</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ({formatCurrency(result.effectivePremiumMonthly)}/month)
                  </p>
                </div>
              </div>

              {/* Hinglish Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3"
              >
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  {result.hinglishMessage}
                </p>
              </motion.div>

              {/* Top 3 Insurer Recommendations */}
              <div className="rounded-xl bg-white/50 dark:bg-white/5 p-4 border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Recommended for You (Top 3)
                </h3>
                <div className="space-y-3">
                  {INSURER_RECOMMENDATIONS.map((insurer, idx) => (
                    <motion.div
                      key={insurer.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{insurer.name}</p>
                        <p className="text-xs text-muted-foreground">{insurer.specialty}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="secondary" className="text-xs">CSR {insurer.csr}%</Badge>
                        <p className="text-xs text-muted-foreground mt-1">PED: {insurer.pedWaiting}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* IRDAI Disclaimer */}
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  Premium estimates are approximate and based on market averages. Actual premiums may vary based on insurer underwriting. Tax benefits are subject to changes in tax laws. Please consult your tax advisor.
                </p>
              </div>

              {/* Branding */}
              <p className="text-center text-xs text-muted-foreground pt-1">
                Powered by <span className="font-semibold text-blue-600">Himanshu Paliwal</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
