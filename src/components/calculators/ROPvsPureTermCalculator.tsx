'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Scale, TrendingUp, AlertCircle, CheckCircle2, IndianRupee, ArrowRight, PiggyBank } from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type SmokerStatus = 'non-smoker' | 'smoker';
type PolicyTerm = 20 | 25 | 30 | 35 | 40;

// Pure Term premium rates (₹ per ₹1,000 sum assured per year) — IRDAI 2025-26
// Varies by age, smoker status, policy term
const PURE_TERM_RATES: Record<number, Record<SmokerStatus, number>> = {
  // age: { non-smoker, smoker } — annual premium per lakh sum assured
  25: { 'non-smoker': 1500, 'smoker': 2200 },
  30: { 'non-smoker': 1700, 'smoker': 2500 },
  35: { 'non-smoker': 2100, 'smoker': 3100 },
  40: { 'non-smoker': 2800, 'smoker': 4200 },
  45: { 'non-smoker': 3800, 'smoker': 5700 },
  50: { 'non-smoker': 5500, 'smoker': 8200 },
  55: { 'non-smoker': 8000, 'smoker': 12000 },
  60: { 'non-smoker': 12000, 'smoker': 18000 },
};

// ROP (Return of Premium) is typically 2.5-3.5x pure term
const ROP_MULTIPLIER = 3.0;

// Expected mutual fund SIP returns (long-term equity) — 12% CAGR conservative
const MF_RETURN_RATE = 0.12;

// Inflation rate for adjusting future value
const INFLATION_RATE = 0.06;

// ============================================================================
// HELPERS
// ============================================================================

function getNearestAgeBracket(age: number): number {
  const brackets = [25, 30, 35, 40, 45, 50, 55, 60];
  return brackets.reduce((prev, curr) =>
    Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
  );
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.round(amount)}`;
}

function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

// Calculate future value of SIP (monthly investment)
function futureValueSIP(monthly: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  return monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
}

// ============================================================================
// CALCULATION
// ============================================================================

interface ROPvsTermResult {
  // Pure Term
  pureTermAnnual: number;
  pureTermMonthly: number;
  pureTermTotalPremium: number; // total paid over policy term
  pureTermMaturityValue: number; // 0 (pure term has no maturity)

  // ROP
  ropAnnual: number;
  ropMonthly: number;
  ropTotalPremium: number;
  ropMaturityValue: number; // total premium returned

  // Strategy: Pure Term + MF SIP (difference invested)
  differenceAnnual: number; // ROP - Pure Term (extra you pay for ROP)
  differenceMonthly: number;
  mfSipFutureValue: number; // if difference invested in MF
  mfSipTotalInvested: number;
  mfSipGains: number;

  // Comparison
  breakEvenYears: number; // when MF SIP > ROP maturity
  recommendation: 'pure-term' | 'rop' | 'either';
  recommendationReason: string;
  winnerLabel: string;
  winnerEmoji: string;

  // Tax
  pureTermTaxSaved: number;
  ropTaxSaved: number;
}

function calculateROPvsTerm(
  age: number,
  sumAssured: number,
  smoker: SmokerStatus,
  policyTerm: PolicyTerm
): ROPvsTermResult {
  const ageBracket = getNearestAgeBracket(age);
  const ratePerLakh = PURE_TERM_RATES[ageBracket]?.[smoker] || PURE_TERM_RATES[35]['non-smoker'];

  // Premiums (per lakh × sum assured in lakhs)
  const sumAssuredLakhs = sumAssured / 100000;
  const pureTermAnnual = ratePerLakh * sumAssuredLakhs;
  const pureTermMonthly = pureTermAnnual / 12;
  const pureTermTotalPremium = pureTermAnnual * policyTerm;
  const pureTermMaturityValue = 0; // pure term = no maturity

  const ropAnnual = pureTermAnnual * ROP_MULTIPLIER;
  const ropMonthly = ropAnnual / 12;
  const ropTotalPremium = ropAnnual * policyTerm;
  const ropMaturityValue = ropTotalPremium; // all premiums returned at maturity

  // Difference (extra paid for ROP)
  const differenceAnnual = ropAnnual - pureTermAnnual;
  const differenceMonthly = ropMonthly - pureTermMonthly;

  // If you invest this difference in MF SIP for policyTerm years
  const mfSipFutureValue = futureValueSIP(differenceMonthly, MF_RETURN_RATE, policyTerm);
  const mfSipTotalInvested = differenceMonthly * 12 * policyTerm;
  const mfSipGains = mfSipFutureValue - mfSipTotalInvested;

  // Break-even: when does MF SIP value exceed ROP maturity value?
  let breakEvenYears = 0;
  for (let y = 1; y <= policyTerm; y++) {
    const fv = futureValueSIP(differenceMonthly, MF_RETURN_RATE, y);
    const ropPaidBack = ropAnnual * y;
    if (fv > ropPaidBack) {
      breakEvenYears = y;
      break;
    }
  }

  // Tax savings (Section 80C, max ₹1.5L)
  const pureTermTaxSaved = Math.min(pureTermAnnual, 150000) * 0.30; // 30% bracket
  const ropTaxSaved = Math.min(ropAnnual, 150000) * 0.30;

  // Recommendation logic
  let recommendation: 'pure-term' | 'rop' | 'either' = 'pure-term';
  let recommendationReason = '';
  let winnerLabel = '';
  let winnerEmoji = '';

  if (mfSipFutureValue > ropMaturityValue * 1.5) {
    recommendation = 'pure-term';
    recommendationReason = `Pure Term + MF SIP strategy gives ${formatCurrency(mfSipFutureValue)} at maturity vs ROP's ${formatCurrency(ropMaturityValue)} return. That's ${formatCurrency(mfSipFutureValue - ropMaturityValue)} MORE wealth created. Pure Term wins by a huge margin.`;
    winnerLabel = 'Pure Term + SIP';
    winnerEmoji = '🏆';
  } else if (mfSipFutureValue > ropMaturityValue) {
    recommendation = 'pure-term';
    recommendationReason = `Pure Term + MF SIP gives ${formatCurrency(mfSipFutureValue)} vs ROP return of ${formatCurrency(ropMaturityValue)}. MF SIP creates more wealth but ROP offers guaranteed return. Choose Pure Term if you can invest the difference consistently.`;
    winnerLabel = 'Pure Term + SIP (slight edge)';
    winnerEmoji = '✅';
  } else {
    recommendation = 'rop';
    recommendationReason = `ROP gives guaranteed ${formatCurrency(ropMaturityValue)} return vs MF SIP estimated ${formatCurrency(mfSipFutureValue)}. If you lack investment discipline, ROP is safer. Otherwise, Pure Term + SIP usually wins long-term.`;
    winnerLabel = 'ROP (for conservative investors)';
    winnerEmoji = '💰';
  }

  return {
    pureTermAnnual,
    pureTermMonthly,
    pureTermTotalPremium,
    pureTermMaturityValue,
    ropAnnual,
    ropMonthly,
    ropTotalPremium,
    ropMaturityValue,
    differenceAnnual,
    differenceMonthly,
    mfSipFutureValue,
    mfSipTotalInvested,
    mfSipGains,
    breakEvenYears,
    recommendation,
    recommendationReason,
    winnerLabel,
    winnerEmoji,
    pureTermTaxSaved,
    ropTaxSaved,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ROPvsPureTermCalculator() {
  const [age, setAge] = useState(30);
  const [sumAssured, setSumAssured] = useState(10000000); // ₹1 Cr default
  const [smoker, setSmoker] = useState<SmokerStatus>('non-smoker');
  const [policyTerm, setPolicyTerm] = useState<PolicyTerm>(30);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () => calculateROPvsTerm(age, sumAssured, smoker, policyTerm),
    [age, sumAssured, smoker, policyTerm]
  );

  const SUM_ASSURED_OPTIONS = [
    { label: '₹25 Lakh', value: 2500000 },
    { label: '₹50 Lakh', value: 5000000 },
    { label: '₹75 Lakh', value: 7500000 },
    { label: '₹1 Crore', value: 10000000 },
    { label: '₹1.5 Crore', value: 15000000 },
    { label: '₹2 Crore', value: 20000000 },
  ];

  return (
    <Card className="w-full border-0 shadow-lg shadow-amber-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">ROP vs Pure Term Calculator</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Return of Premium vs Pure Term + MF SIP — break-even analysis
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
            max={60}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>18</span>
            <span>30 (sweet spot)</span>
            <span>60</span>
          </div>
        </div>

        {/* Sum Assured */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sum Assured (Life Cover)</Label>
          <Select value={String(sumAssured)} onValueChange={(v) => setSumAssured(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUM_ASSURED_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Smoker Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Smoker Status</Label>
          <Select value={smoker} onValueChange={(v) => setSmoker(v as SmokerStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="non-smoker">🚭 Non-Smoker (lower premium)</SelectItem>
              <SelectItem value="smoker">🚬 Smoker (+40-50% premium)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Policy Term */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Policy Term</Label>
          <Select value={String(policyTerm)} onValueChange={(v) => setPolicyTerm(Number(v) as PolicyTerm)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 years</SelectItem>
              <SelectItem value="25">25 years</SelectItem>
              <SelectItem value="30">30 years (recommended)</SelectItem>
              <SelectItem value="35">35 years</SelectItem>
              <SelectItem value="40">40 years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calculate */}
        <Button onClick={() => setShowResult(true)} className="w-full bg-[#B8860B] hover:bg-[#8B6508] text-white" size="lg">
          <Calculator className="w-4 h-4 mr-2" />
          Compare ROP vs Pure Term
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

              {/* Recommendation Banner */}
              <div className="rounded-xl bg-gradient-to-br from-[#FBF3DD] to-[#F8EAC4] dark:from-[rgba(184,134,11,0.18)] dark:to-[rgba(184,134,11,0.05)] p-5 border border-[rgba(184,134,11,0.25)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{result.winnerEmoji}</span>
                  <span className="text-sm font-semibold text-[#8B6508] dark:text-[#E8C872]">
                    Recommended: {result.winnerLabel}
                  </span>
                </div>
                <p className="text-xs text-[#0E1116] dark:text-[#FAF7F2] leading-relaxed">
                  {result.recommendationReason}
                </p>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pure Term */}
                <div className="rounded-xl bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.12)] p-4 border border-[rgba(45,106,79,0.20)]">
                  <h4 className="text-sm font-bold mb-3 text-[#2D6A4F] dark:text-[#6EE7B7] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Pure Term
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Monthly</span>
                      <span className="font-semibold text-[#0E1116] dark:text-[#FAF7F2]">{formatCurrencyFull(Math.round(result.pureTermMonthly))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Annual</span>
                      <span className="font-semibold text-[#0E1116] dark:text-[#FAF7F2]">{formatCurrencyFull(Math.round(result.pureTermAnnual))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Total paid ({policyTerm}y)</span>
                      <span className="font-semibold text-[#0E1116] dark:text-[#FAF7F2]">{formatCurrencyFull(Math.round(result.pureTermTotalPremium))}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Maturity value</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">₹0 (no return)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Tax saved (80C)</span>
                      <span className="font-semibold text-[#2D6A4F]">{formatCurrencyFull(Math.round(result.pureTermTaxSaved * policyTerm))}</span>
                    </div>
                  </div>
                </div>

                {/* ROP */}
                <div className="rounded-xl bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.12)] p-4 border border-[rgba(184,72,44,0.20)]">
                  <h4 className="text-sm font-bold mb-3 text-[#B8482C] dark:text-[#F0A88B] flex items-center gap-2">
                    <PiggyBank className="w-4 h-4" />
                    ROP (Return of Premium)
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Monthly</span>
                      <span className="font-semibold text-[#0E1116] dark:text-[#FAF7F2]">{formatCurrencyFull(Math.round(result.ropMonthly))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Annual</span>
                      <span className="font-semibold text-[#0E1116] dark:text-[#FAF7F2]">{formatCurrencyFull(Math.round(result.ropAnnual))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Total paid ({policyTerm}y)</span>
                      <span className="font-semibold text-[#0E1116] dark:text-[#FAF7F2]">{formatCurrencyFull(Math.round(result.ropTotalPremium))}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Maturity value</span>
                      <span className="font-semibold text-[#2D6A4F]">{formatCurrencyFull(Math.round(result.ropMaturityValue))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Tax saved (80C)</span>
                      <span className="font-semibold text-[#2D6A4F]">{formatCurrencyFull(Math.round(result.ropTaxSaved * policyTerm))}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MF SIP Strategy */}
              <div className="rounded-xl bg-[#FAF7F2] dark:bg-[#1A1F27] p-4">
                <h4 className="text-sm font-bold mb-3 text-[#0E1116] dark:text-[#FAF7F2] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#B8860B]" />
                  Strategy: Pure Term + Invest Difference in MF SIP
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Extra paid for ROP (monthly)</span>
                    <span className="font-semibold text-[#0E1116] dark:text-[#FAF7F2]">{formatCurrencyFull(Math.round(result.differenceMonthly))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Total invested in SIP ({policyTerm}y)</span>
                    <span className="font-semibold text-[#0E1116] dark:text-[#FAF7F2]">{formatCurrencyFull(Math.round(result.mfSipTotalInvested))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A4F57] dark:text-[#A8B0C2]">MF gains (@12% CAGR)</span>
                    <span className="font-semibold text-[#2D6A4F]">+{formatCurrencyFull(Math.round(result.mfSipGains))}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-[#4A4F57] dark:text-[#A8B0C2] font-medium">MF future value at maturity</span>
                    <span className="font-bold text-[#B8860B] text-base">{formatCurrencyFull(Math.round(result.mfSipFutureValue))}</span>
                  </div>
                  {result.breakEvenYears > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[#4A4F57] dark:text-[#A8B0C2]">SIP beats ROP in</span>
                      <span className="font-semibold text-[#2D6A4F]">{result.breakEvenYears} years</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Final Verdict */}
              <div className="rounded-xl bg-gradient-to-r from-[#E6F4EF] to-[#FBF3DD] dark:from-[rgba(45,106,79,0.12)] dark:to-[rgba(184,134,11,0.12)] p-4 border border-[rgba(184,134,11,0.20)]">
                <h4 className="text-sm font-bold mb-2 text-[#0E1116] dark:text-[#FAF7F2] flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#B8860B]" />
                  Final Wealth Comparison at Maturity ({policyTerm} years)
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[#4A4F57] dark:text-[#A8B0C2]">Pure Term + SIP</div>
                    <div className="text-lg font-bold text-[#2D6A4F]">{formatCurrency(result.mfSipFutureValue)}</div>
                  </div>
                  <div>
                    <div className="text-[#4A4F57] dark:text-[#A8B0C2]">ROP return</div>
                    <div className="text-lg font-bold text-[#B8482C]">{formatCurrency(result.ropMaturityValue)}</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-[rgba(15,19,32,0.10)] dark:border-[rgba(232,200,114,0.15)]">
                  <div className="text-xs text-center">
                    <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Difference: </span>
                    <span className={`font-bold ${result.mfSipFutureValue > result.ropMaturityValue ? 'text-[#2D6A4F]' : 'text-[#B8482C]'}`}>
                      {result.mfSipFutureValue > result.ropMaturityValue ? '+' : ''}
                      {formatCurrency(result.mfSipFutureValue - result.ropMaturityValue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <a
                  href={`https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20used%20ROP%20vs%20Pure%20Term%20Calculator.%20Age%20${age}%2C%20cover%20${formatCurrency(sumAssured)}%2C%20${policyTerm}%20years.%20Need%20help%20deciding%20best%20option.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-[#B8860B] hover:bg-[#8B6508] text-white" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Get Term Plan Quote
                  </Button>
                </a>
                <a href="/compare/life" className="flex-1">
                  <Button variant="outline" className="w-full border-[#B8482C] text-[#B8482C] hover:bg-[#FBE8E1]" size="sm">
                    Compare Term Plans
                  </Button>
                </a>
              </div>

              <p className="text-[10px] text-center text-[#8B9099] dark:text-[#A8B0C2] mt-2">
                * MF SIP returns projected at 12% CAGR (long-term equity average). Actual returns may vary. Term insurance rates from IRDAI Annual Report 2025-26.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
