'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingDown, AlertCircle, Info, PiggyBank, Receipt, IndianRupee } from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type AgeBracket = 'under60' | '60plus';
type ParentsAgeBracket = 'under60' | '60plus' | 'na';
type TaxBracket = 0 | 5 | 10 | 15 | 20 | 25 | 30;

const TAX_BRACKET_OPTIONS: { label: string; value: TaxBracket }[] = [
  { label: '0% (Below ₹2.5 Lakh)', value: 0 },
  { label: '5% (₹2.5–5 Lakh)', value: 5 },
  { label: '10% (₹5–7.5 Lakh)', value: 10 },
  { label: '15% (₹7.5–10 Lakh)', value: 15 },
  { label: '20% (₹10–12.5 Lakh)', value: 20 },
  { label: '25% (₹12.5–15 Lakh)', value: 25 },
  { label: '30% (Above ₹15 Lakh)', value: 30 },
];

// Section 80D limits
const LIMITS = {
  selfUnder60: 25000,
  self60Plus: 50000,
  parentsUnder60: 25000,
  parents60Plus: 50000,
  preventiveCheckup: 5000,
  section80C: 150000,
};

// ============================================================================
// HELPERS
// ============================================================================

function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

interface TaxSavingsResult {
  // 80D Self
  healthPremiumSelf: number;
  maxDeductionSelf: number;
  actualDeductionSelf: number;
  // 80D Parents
  healthPremiumParents: number;
  maxDeductionParents: number;
  actualDeductionParents: number;
  // Preventive check-up
  preventiveExpense: number;
  maxPreventive: number;
  actualPreventive: number;
  // 80D Total
  totalDeduction80D: number;
  // 80C
  lifeInsurancePremium: number;
  maxDeduction80C: number;
  actualDeduction80C: number;
  // Grand total
  totalDeduction: number;
  // Tax savings
  taxBracket: TaxBracket;
  taxSaved80D: number;
  taxSaved80C: number;
  totalTaxSaved: number;
  // Effective premium
  totalPremiumPaid: number;
  effectivePremiumAfterTax: number;
  // Visual data
  savingsBreakdown: { section: string; deduction: number; taxSaved: number; color: string }[];
}

function calculateTaxSavings(
  yourAge: AgeBracket,
  parentsAge: ParentsAgeBracket,
  healthPremiumSelf: number,
  healthPremiumParents: number,
  preventiveExpense: number,
  lifeInsurancePremium: number,
  taxBracket: TaxBracket
): TaxSavingsResult {
  // 80D Self/Family
  const maxDeductionSelf = yourAge === 'under60' ? LIMITS.selfUnder60 : LIMITS.self60Plus;
  const actualDeductionSelf = Math.min(healthPremiumSelf, maxDeductionSelf);

  // 80D Parents
  const maxDeductionParents = parentsAge === '60plus' ? LIMITS.parents60Plus : LIMITS.parentsUnder60;
  const actualDeductionParents = parentsAge === 'na' ? 0 : Math.min(healthPremiumParents, maxDeductionParents);

  // Preventive check-up (within 80D limits)
  const maxPreventive = LIMITS.preventiveCheckup;
  const actualPreventive = Math.min(preventiveExpense, maxPreventive);
  // Note: preventive is within the overall 80D limit, not additional
  const total80DClaimable = Math.min(actualDeductionSelf + actualDeductionParents + actualPreventive, maxDeductionSelf + maxDeductionParents);

  const totalDeduction80D = total80DClaimable;

  // 80C Life Insurance
  const maxDeduction80C = LIMITS.section80C;
  const actualDeduction80C = Math.min(lifeInsurancePremium, maxDeduction80C);

  // Total deduction
  const totalDeduction = totalDeduction80D + actualDeduction80C;

  // Tax savings
  const taxSaved80D = (totalDeduction80D * taxBracket) / 100;
  const taxSaved80C = (actualDeduction80C * taxBracket) / 100;
  const totalTaxSaved = taxSaved80D + taxSaved80C;

  // Effective premium
  const totalPremiumPaid = healthPremiumSelf + healthPremiumParents + lifeInsurancePremium;
  const effectivePremiumAfterTax = totalPremiumPaid - totalTaxSaved;

  const savingsBreakdown = [
    { section: '80D Self/Family', deduction: actualDeductionSelf, taxSaved: (actualDeductionSelf * taxBracket) / 100, color: 'bg-blue-500' },
    { section: '80D Parents', deduction: actualDeductionParents, taxSaved: (actualDeductionParents * taxBracket) / 100, color: 'bg-teal-500' },
    { section: '80D Preventive', deduction: actualPreventive, taxSaved: (actualPreventive * taxBracket) / 100, color: 'bg-cyan-500' },
    { section: '80C Life Insurance', deduction: actualDeduction80C, taxSaved: (actualDeduction80C * taxBracket) / 100, color: 'bg-amber-500' },
  ];

  return {
    healthPremiumSelf,
    maxDeductionSelf,
    actualDeductionSelf,
    healthPremiumParents,
    maxDeductionParents,
    actualDeductionParents,
    preventiveExpense,
    maxPreventive,
    actualPreventive,
    totalDeduction80D,
    lifeInsurancePremium,
    maxDeduction80C,
    actualDeduction80C,
    totalDeduction,
    taxBracket,
    taxSaved80D,
    taxSaved80C,
    totalTaxSaved,
    totalPremiumPaid,
    effectivePremiumAfterTax,
    savingsBreakdown,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TaxSavingsCalculator() {
  const [yourAge, setYourAge] = useState<AgeBracket>('under60');
  const [parentsAge, setParentsAge] = useState<ParentsAgeBracket>('under60');
  const [healthPremiumSelf, setHealthPremiumSelf] = useState(25000);
  const [healthPremiumParents, setHealthPremiumParents] = useState(15000);
  const [preventiveExpense, setPreventiveExpense] = useState(3000);
  const [lifeInsurancePremium, setLifeInsurancePremium] = useState(50000);
  const [taxBracket, setTaxBracket] = useState<TaxBracket>(20);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () => calculateTaxSavings(yourAge, parentsAge, healthPremiumSelf, healthPremiumParents, preventiveExpense, lifeInsurancePremium, taxBracket),
    [yourAge, parentsAge, healthPremiumSelf, healthPremiumParents, preventiveExpense, lifeInsurancePremium, taxBracket]
  );

  const handleCalculate = () => {
    setShowResult(true);
  };

  const maxDeductionForChart = Math.max(result.totalDeduction, 1);

  return (
    <Card className="w-full border-0 shadow-lg shadow-blue-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Section 80D Tax Savings Calculator</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Jaanein kitna tax bachega insurance se — detailed breakdown
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Your Age */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Your Age Category</Label>
          <Select value={yourAge} onValueChange={(v) => setYourAge(v as AgeBracket)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under60">Under 60 years (₹25,000 limit)</SelectItem>
              <SelectItem value="60plus">60+ years — Senior Citizen (₹50,000 limit)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parents Age */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Parents&apos; Age Category</Label>
          <Select value={parentsAge} onValueChange={(v) => setParentsAge(v as ParentsAgeBracket)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under60">Under 60 years (₹25,000 limit)</SelectItem>
              <SelectItem value="60plus">60+ years — Senior Citizen (₹50,000 limit)</SelectItem>
              <SelectItem value="na">Not applicable / No parents&apos; policy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Health Premium Self */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Annual Health Insurance Premium (Self + Family)</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={healthPremiumSelf}
              onChange={(e) => setHealthPremiumSelf(Number(e.target.value) || 0)}
              className="pl-9"
              min={0}
              max={1000000}
            />
          </div>
          <p className="text-xs text-muted-foreground">Max deduction: {formatCurrencyFull(result.maxDeductionSelf)}</p>
        </div>

        {/* Health Premium Parents */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Annual Health Insurance Premium (Parents)</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={healthPremiumParents}
              onChange={(e) => setHealthPremiumParents(Number(e.target.value) || 0)}
              className="pl-9"
              min={0}
              max={1000000}
              disabled={parentsAge === 'na'}
            />
          </div>
          {parentsAge !== 'na' && (
            <p className="text-xs text-muted-foreground">Max deduction: {formatCurrencyFull(result.maxDeductionParents)}</p>
          )}
        </div>

        {/* Preventive Health Check-up */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Preventive Health Check-up Expenses</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={preventiveExpense}
              onChange={(e) => setPreventiveExpense(Number(e.target.value) || 0)}
              className="pl-9"
              min={0}
              max={50000}
            />
          </div>
          <p className="text-xs text-muted-foreground">Max: ₹5,000 (within 80D limit)</p>
        </div>

        {/* Life Insurance Premium */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Life Insurance Premium (for Section 80C)</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={lifeInsurancePremium}
              onChange={(e) => setLifeInsurancePremium(Number(e.target.value) || 0)}
              className="pl-9"
              min={0}
              max={1500000}
            />
          </div>
          <p className="text-xs text-muted-foreground">Max deduction under 80C: ₹1,50,000</p>
        </div>

        {/* Tax Bracket */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Your Tax Bracket (Old Regime)</Label>
          <Select value={String(taxBracket)} onValueChange={(v) => setTaxBracket(Number(v) as TaxBracket)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAX_BRACKET_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          size="lg"
        >
          <Calculator className="h-4 w-4" />
          Calculate Tax Savings
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

              {/* Total Tax Saved */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 text-white text-center"
              >
                <p className="text-sm opacity-90">Total Tax Saved</p>
                <p className="text-3xl sm:text-4xl font-bold">{formatCurrencyFull(result.totalTaxSaved)}/yr</p>
                <p className="text-xs opacity-75 mt-2">At {result.taxBracket}% tax bracket</p>
              </motion.div>

              {/* Section-wise Breakdown */}
              <div className="rounded-xl bg-white/50 dark:bg-white/5 p-4 border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-blue-600" />
                  Section-wise Breakdown
                </h3>
                <div className="space-y-4">
                  {/* 80D Self */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Section 80D — Self/Family</span>
                      <Badge variant="secondary" className="text-xs">
                        {formatCurrencyFull(result.actualDeductionSelf)} / {formatCurrencyFull(result.maxDeductionSelf)}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((result.actualDeductionSelf / result.maxDeductionSelf) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Tax saved: {formatCurrencyFull((result.actualDeductionSelf * result.taxBracket) / 100)}</p>
                  </div>

                  {/* 80D Parents */}
                  {result.actualDeductionParents > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Section 80D — Parents</span>
                        <Badge variant="secondary" className="text-xs">
                          {formatCurrencyFull(result.actualDeductionParents)} / {formatCurrencyFull(result.maxDeductionParents)}
                        </Badge>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((result.actualDeductionParents / result.maxDeductionParents) * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full bg-teal-500 rounded-full"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Tax saved: {formatCurrencyFull((result.actualDeductionParents * result.taxBracket) / 100)}</p>
                    </div>
                  )}

                  {/* 80D Preventive */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">80D — Preventive Health Check-up</span>
                      <Badge variant="secondary" className="text-xs">
                        {formatCurrencyFull(result.actualPreventive)} / {formatCurrencyFull(result.maxPreventive)}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((result.actualPreventive / result.maxPreventive) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-full bg-cyan-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Tax saved: {formatCurrencyFull((result.actualPreventive * result.taxBracket) / 100)}</p>
                  </div>

                  {/* 80C */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Section 80C — Life Insurance</span>
                      <Badge variant="secondary" className="text-xs">
                        {formatCurrencyFull(result.actualDeduction80C)} / {formatCurrencyFull(result.maxDeduction80C)}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((result.actualDeduction80C / result.maxDeduction80C) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Tax saved: {formatCurrencyFull(result.taxSaved80C)}</p>
                  </div>
                </div>
              </div>

              {/* Visual Savings Bar Chart */}
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-950/30 dark:to-indigo-950/30">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Tax Savings Visual
                </h3>
                <div className="space-y-2">
                  {result.savingsBreakdown.map((item, idx) => (
                    <motion.div
                      key={item.section}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{item.section}</span>
                        <span>{formatCurrencyFull(item.taxSaved)} saved</span>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max((item.deduction / maxDeductionForChart) * 100, 1)}%` }}
                          transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                          className={`h-full ${item.color} rounded-full flex items-center justify-end pr-2`}
                        >
                          {item.deduction > maxDeductionForChart * 0.15 && (
                            <span className="text-[10px] text-white font-medium">{formatCurrencyFull(item.deduction)}</span>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Effective Premium */}
              <div className="rounded-xl bg-white/50 dark:bg-white/5 p-4 border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-blue-600" />
                  Effective Premium After Tax Savings
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Premium Paid (Health + Life)</span>
                    <span className="font-medium">{formatCurrencyFull(result.totalPremiumPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Tax Saved</span>
                    <span className="font-medium text-blue-600">- {formatCurrencyFull(result.totalTaxSaved)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-blue-700 dark:text-blue-300">
                    <span>Effective Premium After Tax Savings</span>
                    <span>{formatCurrencyFull(result.effectivePremiumAfterTax)}</span>
                  </div>
                </div>
              </div>

              {/* Hinglish Message */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  {result.totalTaxSaved > 0
                    ? `${formatCurrencyFull(result.totalPremiumPaid)} premium bharne par aap ${formatCurrencyFull(result.totalTaxSaved)} tax bacha sakte hain! Effective cost sirf ${formatCurrencyFull(result.effectivePremiumAfterTax)}`
                    : 'Aapka tax bracket 0% hai, toh tax savings nahi hoga. Lekin insurance ki zaroorat abhi bhi hai!'}
                </p>
              </div>

              {/* IRDAI Disclaimer */}
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  Tax benefits are as per Income Tax Act, 1961 and are subject to changes in tax laws. Calculations are based on Old Tax Regime. Please consult your tax advisor for personalized advice. Section 80D preventive check-up limit is within the overall 80D limit.
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
