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
import { ShieldCheck, Calculator, TrendingDown, AlertCircle, Info, Users, ChevronRight } from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type RetirementAge = 58 | 60 | 65;

const RETIREMENT_OPTIONS: { label: string; value: RetirementAge }[] = [
  { label: '58 years', value: 58 },
  { label: '60 years', value: 60 },
  { label: '65 years', value: 65 },
];

interface InsurerRecommendation {
  name: string;
  csr: number;
  premiumPerCrore: number;
  aum: string;
  tagline: string;
}

const INSURER_COMPARISON: InsurerRecommendation[] = [
  { name: 'HDFC Life Insurance', csr: 99.97, premiumPerCrore: 8200, aum: '₹2.5L Cr', tagline: 'Selfless Protection for Selfless Love' },
  { name: 'Max Life Insurance', csr: 99.08, premiumPerCrore: 8800, aum: '₹1.5L Cr', tagline: 'Smart Protection, Secure Future' },
  { name: 'LIC of India', csr: 95.55, premiumPerCrore: 11500, aum: '₹50L Cr', tagline: 'Zindagi Ke Saath Bhi, Zindagi Ke Baad Bhi' },
  { name: 'SBI Life Insurance', csr: 98.50, premiumPerCrore: 9000, aum: '₹3.8L Cr', tagline: 'Suraksha Ke Sath, Vishwas Ke Sath' },
  { name: 'ICICI Prudential Life', csr: 98.20, premiumPerCrore: 8500, aum: '₹2.2L Cr', tagline: 'Smart Protection, Smart Choice' },
  { name: 'Tata AIA Life', csr: 98.00, premiumPerCrore: 9200, aum: '₹1.2L Cr', tagline: 'Raksha That Goes Beyond' },
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

function formatLakhsCrores(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Crore`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
  return formatCurrencyFull(amount);
}

function getPremiumPerCrore(age: number, smoker: boolean): number {
  let base: number;
  if (age <= 35) base = 7500;
  else if (age <= 45) base = 15000;
  else base = 32500;

  if (smoker) base *= 1.4; // 40% average loading for smokers

  return base;
}

interface TermLifeResult {
  annualIncome: number;
  annualExpenses: number;
  yearsToRetirement: number;
  hlv: number;
  outstandingLoans: number;
  dependentsCover: number;
  recommendedCover: number;
  premiumPerCrore: number;
  annualPremium: number;
  monthlyPremium: number;
  smokerLoading: number;
  hinglishMessage: string;
}

function calculateTermLife(
  age: number,
  annualIncome: number,
  annualExpenses: number,
  retirementAge: RetirementAge,
  outstandingLoans: number,
  dependents: number,
  smoker: boolean
): TermLifeResult {
  const yearsToRetirement = Math.max(retirementAge - age, 1);
  const hlv = (annualIncome - annualExpenses) * yearsToRetirement;
  const dependentsCover = dependents * 500000;
  const recommendedCover = hlv + outstandingLoans + dependentsCover;

  const premiumPerCrore = getPremiumPerCrore(age, smoker);
  const coverInCrores = recommendedCover / 10000000;
  const annualPremium = premiumPerCrore * coverInCrores;
  const monthlyPremium = annualPremium / 12;
  const smokerLoading = smoker ? 40 : 0;

  const hinglishMessage = `आपकी Human Life Value ${formatLakhsCrores(hlv)} hai. Recommended cover: ${formatLakhsCrores(recommendedCover)} — saalana premium lagbhag ${formatCurrency(Math.round(annualPremium))}`;

  return {
    annualIncome,
    annualExpenses,
    yearsToRetirement,
    hlv,
    outstandingLoans,
    dependentsCover,
    recommendedCover,
    premiumPerCrore,
    annualPremium,
    monthlyPremium,
    smokerLoading,
    hinglishMessage,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TermLifeCalculator() {
  const [age, setAge] = useState(30);
  const [annualIncome, setAnnualIncome] = useState(800000);
  const [annualExpenses, setAnnualExpenses] = useState(400000);
  const [retirementAge, setRetirementAge] = useState<RetirementAge>(60);
  const [outstandingLoans, setOutstandingLoans] = useState(0);
  const [dependents, setDependents] = useState(2);
  const [smoker, setSmoker] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () => calculateTermLife(age, annualIncome, annualExpenses, retirementAge, outstandingLoans, dependents, smoker),
    [age, annualIncome, annualExpenses, retirementAge, outstandingLoans, dependents, smoker]
  );

  const handleCalculate = () => {
    setShowResult(true);
  };

  return (
    <Card className="w-full border-0 shadow-lg shadow-emerald-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Term Insurance HLV Calculator</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Human Life Value se jaanein kitna cover chahiye
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Age Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Current Age</Label>
            <Badge variant="secondary" className="text-sm font-semibold">{age} years</Badge>
          </div>
          <Slider
            value={[age]}
            onValueChange={(v) => setAge(v[0])}
            min={18}
            max={60}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>18</span>
            <span>60</span>
          </div>
        </div>

        {/* Annual Income */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annual Income</Label>
            <Badge variant="secondary" className="text-sm font-semibold">{formatCurrency(annualIncome)}</Badge>
          </div>
          <Slider
            value={[annualIncome]}
            onValueChange={(v) => setAnnualIncome(v[0])}
            min={200000}
            max={20000000}
            step={100000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹2 Lakh</span>
            <span>₹2 Crore</span>
          </div>
        </div>

        {/* Annual Expenses */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annual Expenses</Label>
            <Badge variant="secondary" className="text-sm font-semibold">{formatCurrency(annualExpenses)}</Badge>
          </div>
          <Slider
            value={[annualExpenses]}
            onValueChange={(v) => setAnnualExpenses(v[0])}
            min={100000}
            max={10000000}
            step={50000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹1 Lakh</span>
            <span>₹1 Crore</span>
          </div>
        </div>

        {/* Retirement Age */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Retirement Age</Label>
          <Select value={String(retirementAge)} onValueChange={(v) => setRetirementAge(Number(v) as RetirementAge)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RETIREMENT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Outstanding Loans */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Outstanding Loans (Home, Car, Personal)</Label>
            <Badge variant="secondary" className="text-sm font-semibold">{formatCurrency(outstandingLoans)}</Badge>
          </div>
          <Slider
            value={[outstandingLoans]}
            onValueChange={(v) => setOutstandingLoans(v[0])}
            min={0}
            max={50000000}
            step={500000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹0</span>
            <span>₹5 Crore</span>
          </div>
        </div>

        {/* Number of Dependents */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Number of Dependents</Label>
            <Badge variant="secondary" className="text-sm font-semibold">{dependents}</Badge>
          </div>
          <Slider
            value={[dependents]}
            onValueChange={(v) => setDependents(v[0])}
            min={0}
            max={8}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>8</span>
          </div>
        </div>

        {/* Smoker Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Smoker Status</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={!smoker ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSmoker(false)}
              className={!smoker ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              Non-Smoker
            </Button>
            <Button
              type="button"
              variant={smoker ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSmoker(true)}
              className={smoker ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Smoker (+40%)
            </Button>
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          size="lg"
        >
          <Calculator className="h-4 w-4" />
          Calculate Coverage Need
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

              {/* HLV Calculation */}
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-5 dark:from-emerald-950/30 dark:to-teal-950/30">
                <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Human Life Value (HLV) Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Income</span>
                    <span className="font-medium">{formatCurrencyFull(result.annualIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Expenses</span>
                    <span className="font-medium text-red-600">- {formatCurrencyFull(result.annualExpenses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Savings (Income - Expenses)</span>
                    <span className="font-medium text-emerald-600">{formatCurrencyFull(result.annualIncome - result.annualExpenses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Years to Retirement</span>
                    <span className="font-medium">{result.yearsToRetirement} years</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-300">
                    <span>HLV (Savings × Years)</span>
                    <span>{formatLakhsCrores(result.hlv)}</span>
                  </div>
                </div>
              </div>

              {/* Recommended Cover */}
              <div className="rounded-xl bg-white/50 dark:bg-white/5 p-4 border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Recommended Cover Calculation
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Human Life Value</span>
                    <span className="font-medium">{formatLakhsCrores(result.hlv)}</span>
                  </div>
                  {result.outstandingLoans > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Outstanding Loans</span>
                      <span className="font-medium">{formatLakhsCrores(result.outstandingLoans)}</span>
                    </div>
                  )}
                  {result.dependentsCover > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dependents Cover ({dependents} × ₹5 Lakh)</span>
                      <span className="font-medium">{formatLakhsCrores(result.dependentsCover)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base text-emerald-700 dark:text-emerald-300">
                    <span>Total Recommended Cover</span>
                    <span>{formatLakhsCrores(result.recommendedCover)}</span>
                  </div>
                </div>
              </div>

              {/* Premium Estimate */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white text-center"
              >
                <p className="text-sm opacity-90">Estimated Premium (for recommended cover)</p>
                <p className="text-2xl sm:text-3xl font-bold">{formatCurrencyFull(Math.round(result.annualPremium))}/yr</p>
                <p className="text-xs opacity-75 mt-1">({formatCurrency(Math.round(result.monthlyPremium))}/month)</p>
                <div className="mt-2 text-xs opacity-80">
                  Rate: {formatCurrencyFull(result.premiumPerCrore)}/Cr/yr
                  {result.smokerLoading > 0 && ` (includes ${result.smokerLoading}% smoker loading)`}
                </div>
              </motion.div>

              {/* Hinglish Message */}
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  {result.hinglishMessage}
                </p>
              </div>

              {/* Insurer Comparison Table */}
              <div className="rounded-xl bg-white/50 dark:bg-white/5 p-4 border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Insurer Comparison (Term Insurance)
                </h3>
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-3 font-semibold text-muted-foreground">Insurer</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">CSR %</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">AUM</th>
                        <th className="text-right py-2 pl-3 font-semibold text-muted-foreground">Premium/Cr</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INSURER_COMPARISON.map((insurer, idx) => (
                        <motion.tr
                          key={insurer.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + idx * 0.05 }}
                          className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-2.5 pr-3">
                            <div>
                              <p className="font-medium text-sm">{insurer.name}</p>
                              <p className="text-xs text-muted-foreground">{insurer.tagline}</p>
                            </div>
                          </td>
                          <td className="text-center py-2.5 px-2">
                            <Badge variant={insurer.csr >= 99 ? 'default' : insurer.csr >= 97 ? 'secondary' : 'outline'} className="text-xs">
                              {insurer.csr}%
                            </Badge>
                          </td>
                          <td className="text-center py-2.5 px-2 text-xs">{insurer.aum}</td>
                          <td className="text-right py-2.5 pl-3 font-medium">
                            {formatCurrencyFull(insurer.premiumPerCrore)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-950/30 dark:to-orange-950/30">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  Key Takeaways
                </h3>
                <ul className="space-y-1.5 text-sm text-amber-700 dark:text-amber-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    HDFC Life has the highest CSR at 99.97% — recommended for claim reliability
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    Term plans start from ₹7,500/Cr/year for non-smokers under 35
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    Smoker premium lagbhag 40% zyada hota hai — quit for health & savings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    Section 80C mein upto ₹1.5 Lakh ka tax deduction milta hai
                  </li>
                </ul>
              </div>

              {/* IRDAI Disclaimer */}
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  HLV is a theoretical estimate. Actual coverage needs may vary based on lifestyle, inflation, and goals. Premium rates are approximate and vary by insurer. CSR data from IRDAI Annual Report 2025-26.
                </p>
              </div>

              {/* Branding */}
              <p className="text-center text-xs text-muted-foreground pt-1">
                Powered by <span className="font-semibold text-emerald-600">Himanshu Paliwal</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
