'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  Target,
  Info,
  ChevronRight,
  Shield,
  IndianRupee,
  Clock,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  calculateHLV,
  getAgeMultiplier,
  HLV_AGE_MULTIPLIERS,
  formatRupees,
  formatRupeesFull,
  formatIndianCurrency,
  type HLVResult,
} from '@/data/ageBasedData';
import { useLanguage } from '@/lib/i18n';

// ── Constants ──────────────────────────────────────────────────────────────
const INCOME_MIN = 200000;       // ₹2L
const INCOME_MAX = 20000000;     // ₹2Cr
const INCOME_STEP = 100000;      // ₹1L

const EXPENSE_MIN = 100000;      // ₹1L
const EXPENSE_MAX = 10000000;    // ₹1Cr
const EXPENSE_STEP = 50000;      // ₹50K

const DEBT_MIN = 0;
const DEBT_MAX = 50000000;       // ₹5Cr
const DEBT_STEP = 500000;        // ₹5L

const AGE_MIN = 18;
const AGE_MAX = 60;

const RETIREMENT_OPTIONS = [55, 58, 60, 65] as const;

const COMPARISON_AGES = [25, 30, 35, 40, 45, 50];

const INSIGHTS = [
  {
    icon: '💰',
    text: 'Aapki HLV aapki income aur savings pe depend karti hai',
  },
  {
    icon: '⏰',
    text: 'Jaldi insurance lena = kam premium + zyada cover',
  },
  {
    icon: '🏠',
    text: 'Outstanding debts (home loan, car loan) bhi cover mein add karein',
  },
  {
    icon: '📊',
    text: 'Har saal HLV recalculate karein — income badhne pe cover bhi badhana padega',
  },
];

const TOOLTIPS: Record<string, string> = {
  annualIncome:
    'Total saalana income — salary + business + other sources',
  annualExpenses:
    'Total kharcha — rent, EMI, food, bills, sab kuch',
  retirementAge:
    'Aap kab retire karna chahte hain? Standard: 60 years',
  outstandingDebts:
    'Home loan, car loan, personal loan — jo bhi outstanding hai',
};

// ── Helper: Animated Number ────────────────────────────────────────────────
function useAnimatedValue(target: number, duration = 600) {
  const [current, setCurrent] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    const startTime = performance.now();
    const startVal = prevTarget.current;
    prevTarget.current = target;

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }, [target, duration]);

  return current;
}

// ── Helper: Format slider value ────────────────────────────────────────────
function formatSliderValue(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

// ── Sub-component: Slider Field ────────────────────────────────────────────
interface SliderFieldProps {
  label: string;
  tooltipKey: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  formatDisplay?: (val: number) => string;
  accentColor?: string;
}

function SliderField({
  label,
  tooltipKey,
  value,
  min,
  max,
  step,
  onChange,
  formatDisplay = formatSliderValue,
  accentColor = '#C98A1C',
}: SliderFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="inline-flex items-center justify-center rounded-full w-5 h-5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={`Info about ${label}`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[260px] text-xs">
              {TOOLTIPS[tooltipKey]}
            </TooltipContent>
          </Tooltip>
        </div>
        <motion.span
          key={value}
          initial={{ opacity: 0.6, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{
            background: `${accentColor}18`,
            color: accentColor,
          }}
        >
          {formatDisplay(value)}
        </motion.span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
        className="w-full [&_[data-slot=slider-range]]:rounded-full"
        aria-label={label}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{formatDisplay(min)}</span>
        <span>{formatDisplay(max)}</span>
      </div>
    </div>
  );
}

// ── Sub-component: Visual Breakdown Bar ────────────────────────────────────
interface BreakdownBarProps {
  income: number;
  expenses: number;
  savings: number;
}

function BreakdownBar({ income, expenses, savings }: BreakdownBarProps) {
  if (income <= 0) return null;

  const expensePct = Math.min((expenses / income) * 100, 100);
  const savingsPct = Math.max(0, 100 - expensePct);

  return (
    <div className="space-y-3">
      <div className="relative h-8 w-full rounded-full overflow-hidden bg-muted">
        {/* Expenses portion */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-l-full"
          style={{ background: 'linear-gradient(90deg, #ef4444, #f87171)' }}
          initial={{ width: 0 }}
          animate={{ width: `${expensePct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Savings portion */}
        <motion.div
          className="absolute top-0 h-full rounded-r-full"
          style={{ background: 'linear-gradient(90deg, #C98A1C, #C98A1C)' }}
          initial={{ width: 0, left: '0%' }}
          animate={{ width: `${savingsPct}%`, left: `${expensePct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-400" />
          <span className="text-muted-foreground">Expenses</span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            {formatRupees(expenses)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
          <span className="text-muted-foreground">Savings</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {formatRupees(savings)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Sub-component: Age Timeline ────────────────────────────────────────────
interface AgeTimelineProps {
  currentAge: number;
  annualIncome: number;
  annualExpenses: number;
  outstandingDebts: number;
  retirementAge: number;
}

function AgeTimeline({
  currentAge,
  annualIncome,
  annualExpenses,
  outstandingDebts,
  retirementAge,
}: AgeTimelineProps) {
  const visibleBrackets = HLV_AGE_MULTIPLIERS.filter((b) => b.maxAge <= 65 || b.maxAge === 100).slice(0, 8);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted hidden sm:block" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {visibleBrackets.map((bracket, idx) => {
          const isCurrentAge = currentAge <= bracket.maxAge && (idx === 0 || currentAge > visibleBrackets[idx - 1].maxAge);
          const result = calculateHLV(
            annualIncome,
            annualExpenses,
            Math.min(bracket.maxAge - 1, currentAge),
            retirementAge,
            outstandingDebts,
          );

          return (
            <motion.div
              key={bracket.maxAge}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className={`relative rounded-xl p-3 sm:p-4 border transition-all duration-300 ${
                isCurrentAge
                  ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-300 dark:border-violet-700 shadow-lg shadow-violet-200/40 dark:shadow-violet-900/30'
                  : 'bg-card border-border/60 hover:border-violet-200 dark:hover:border-violet-800'
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`hidden sm:flex absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 ${
                  isCurrentAge
                    ? 'bg-violet-500 border-violet-300 scale-125'
                    : 'bg-muted-foreground/30 border-muted'
                }`}
              />

              {isCurrentAge && (
                <Badge className="absolute -top-2 right-2 text-[9px] bg-violet-500 text-white border-0 px-1.5 py-0">
                  YOU
                </Badge>
              )}

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {idx === 0 ? '≤' : ''}{bracket.maxAge} yrs
                </p>
                <p className="text-lg font-bold mt-1" style={{ color: isCurrentAge ? '#C98A1C' : undefined }}>
                  {bracket.multiplier}×
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 min-h-[28px]">
                  {bracket.label}
                </p>
                <p className="text-xs font-semibold mt-2 text-foreground/80">
                  {formatRupees(result.recommendedCover)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Sub-component: Comparison Table ────────────────────────────────────────
interface ComparisonTableProps {
  currentAge: number;
  annualIncome: number;
  annualExpenses: number;
  outstandingDebts: number;
  retirementAge: number;
}

function ComparisonTable({
  currentAge,
  annualIncome,
  annualExpenses,
  outstandingDebts,
  retirementAge,
}: ComparisonTableProps) {
  const rows = COMPARISON_AGES.map((age) => {
    const result = calculateHLV(annualIncome, annualExpenses, age, retirementAge, outstandingDebts);
    const mult = getAgeMultiplier(age);
    return { age, ...result, multiplierLabel: mult.label, multiplier: mult.multiplier };
  });

  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60">
            <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground">Age</th>
            <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground">Multiplier</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground">HLV</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground">Cover</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Est. Premium</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isHighlight =
              currentAge >= row.age && (row.age === 50 || currentAge < rows[rows.indexOf(row) + 1]?.age);

            // Determine if this row age bracket contains the user's current age
            const ageIdx = rows.findIndex((r) => r.age === row.age);
            const nextAge = rows[ageIdx + 1]?.age ?? 100;
            const isCurrentAgeRow = currentAge >= row.age && currentAge < nextAge;

            return (
              <motion.tr
                key={row.age}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ageIdx * 0.05, duration: 0.3 }}
                className={`border-b border-border/30 transition-colors ${
                  isCurrentAgeRow
                    ? 'bg-violet-50/80 dark:bg-violet-950/20'
                    : 'hover:bg-muted/50'
                }`}
              >
                <td className="py-3 px-3 font-semibold">
                  <span className="flex items-center gap-2">
                    {row.age}
                    {isCurrentAgeRow && (
                      <Badge className="text-[9px] bg-violet-500 text-white border-0 px-1.5 py-0">
                        YOU
                      </Badge>
                    )}
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-medium">{row.multiplier}×</td>
                <td className="py-3 px-3 text-right font-medium">{formatRupees(row.hlv)}</td>
                <td className="py-3 px-3 text-right font-bold text-violet-600 dark:text-violet-400">
                  {formatRupees(row.recommendedCover)}
                </td>
                <td className="py-3 px-3 text-right text-muted-foreground hidden sm:table-cell">
                  {formatRupees(row.premiumEstimate)}/yr
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════
export default function HLVCalculator() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  // ── State ─────────────────────────────────────────────────────────────
  const [currentAge, setCurrentAge] = useState(30);
  const [annualIncome, setAnnualIncome] = useState(1000000); // ₹10L
  const [annualExpenses, setAnnualExpenses] = useState(500000); // ₹5L
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [outstandingDebts, setOutstandingDebts] = useState(0);

  // ── Live Calculation ──────────────────────────────────────────────────
  const result: HLVResult = useMemo(
    () => calculateHLV(annualIncome, annualExpenses, currentAge, retirementAge, outstandingDebts),
    [annualIncome, annualExpenses, currentAge, retirementAge, outstandingDebts],
  );

  const { multiplier: ageMultiplier, label: ageLabel } = useMemo(
    () => getAgeMultiplier(currentAge),
    [currentAge],
  );

  const yearsToRetirement = Math.max(retirementAge - currentAge, 1);
  const annualSavings = annualIncome - annualExpenses;

  // Animated HLV value
  const animatedHLV = useAnimatedValue(result.hlv, 500);
  const animatedCover = useAnimatedValue(result.recommendedCover, 500);
  const animatedPremium = useAnimatedValue(result.premiumEstimate, 500);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <section id="hlv-calculator" className="scroll-mt-16">
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-purple-600" />
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px),radial-gradient(circle_at_70%_80%,white_1px,transparent_1px)] bg-[length:40px_40px]" />
        {/* Floating orbs */}
        <motion.div
          className="absolute top-10 left-[10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{ x: [-10, 10, -10], y: [-5, 5, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-[15%] w-24 h-24 bg-pink-300/20 rounded-full blur-2xl"
          animate={{ x: [10, -10, 10], y: [5, -5, 5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative px-5 py-8 sm:px-8 sm:py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
              <Calculator className="w-3.5 h-3.5 mr-1" />
              {isHindi ? 'इंश्योरेंस कैलकुलेटर' : 'Insurance Calculator'}
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            {isHindi ? 'ह्यूमन लाइफ वैल्यू' : 'Human Life Value'}{' '}
            <span className="text-yellow-300">(HLV)</span>{' '}
            {isHindi ? 'कैलकुलेटर' : 'Calculator'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 text-sm sm:text-base text-white/80 max-w-xl mx-auto"
          >
            {isHindi ? 'जानें आपकी लाइफ कितनी कीमती है — और कितना इंश्योरेंस चाहिए' : isEnglish ? 'Know how valuable your life is — and how much insurance you need' : 'Jaanein aapki life kitni valuable hai — aur kitna insurance chahiye'}
          </motion.p>

          {/* Formula Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-5 inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3"
          >
            <span className="text-white font-bold text-xs sm:text-sm">HLV</span>
            <span className="text-white/60 text-xs sm:text-sm">=</span>
            <span className="bg-green-400/20 text-green-200 px-2 py-0.5 rounded-md text-xs sm:text-sm font-medium">(Income</span>
            <span className="text-white/60 text-xs sm:text-sm">−</span>
            <span className="bg-red-400/20 text-red-200 px-2 py-0.5 rounded-md text-xs sm:text-sm font-medium">Expenses)</span>
            <span className="text-white/60 text-xs sm:text-sm">×</span>
            <span className="bg-blue-400/20 text-blue-200 px-2 py-0.5 rounded-md text-xs sm:text-sm font-medium">Years to Retire</span>
            <span className="text-white/60 text-xs sm:text-sm">+</span>
            <span className="bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-md text-xs sm:text-sm font-medium">Debts</span>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CALCULATOR FORM + RESULTS (side by side on desktop)               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="mt-6 grid lg:grid-cols-5 gap-6">
        {/* LEFT: Calculator Form */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-border/60 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-white" />
                </div>
                {isHindi ? 'अपनी जानकारी डालें' : 'Apni Details Daalein'}
              </CardTitle>
              <CardDescription className="text-xs">
                {isHindi ? 'स्लाइडर एडजस्ट करें — कैलकुलेशन लाइव अपडेट होगी' : 'Sliders adjust karein — calculation live update hogi'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              {/* Current Age Slider */}
              <SliderField
                label="Current Age"
                tooltipKey="retirementAge"
                value={currentAge}
                min={AGE_MIN}
                max={AGE_MAX}
                step={1}
                onChange={setCurrentAge}
                formatDisplay={(v) => `${v} years`}
                accentColor="#C98A1C"
              />

              {/* Annual Income Slider */}
              <SliderField
                label="Annual Income"
                tooltipKey="annualIncome"
                value={annualIncome}
                min={INCOME_MIN}
                max={INCOME_MAX}
                step={INCOME_STEP}
                onChange={setAnnualIncome}
                accentColor="#22c55e"
              />

              {/* Annual Expenses Slider */}
              <SliderField
                label="Annual Expenses"
                tooltipKey="annualExpenses"
                value={annualExpenses}
                min={EXPENSE_MIN}
                max={Math.min(EXPENSE_MAX, annualIncome)}
                step={EXPENSE_STEP}
                onChange={setAnnualExpenses}
                accentColor="#ef4444"
              />

              {/* Retirement Age Selector */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Retirement Age</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="inline-flex items-center justify-center rounded-full w-5 h-5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Info about Retirement Age"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[260px] text-xs">
                      {TOOLTIPS.retirementAge}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {RETIREMENT_OPTIONS.map((age) => (
                    <motion.button
                      key={age}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (age > currentAge) setRetirementAge(age);
                      }}
                      disabled={age <= currentAge}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        retirementAge === age
                          ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25'
                          : age <= currentAge
                            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                            : 'bg-muted/60 text-muted-foreground hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300 border border-border/50'
                      }`}
                    >
                      {age}
                    </motion.button>
                  ))}
                </div>
                {retirementAge <= currentAge && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Retirement age must be greater than current age
                  </p>
                )}
              </div>

              {/* Outstanding Debts Slider */}
              <SliderField
                label="Outstanding Debts"
                tooltipKey="outstandingDebts"
                value={outstandingDebts}
                min={DEBT_MIN}
                max={DEBT_MAX}
                step={DEBT_STEP}
                onChange={setOutstandingDebts}
                accentColor="#f59e0b"
              />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Results */}
        <div className="lg:col-span-3 space-y-5">
          {/* Main Result Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={result.hlv}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="border-violet-200/60 dark:border-violet-800/40 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
                {/* Gradient accent bar at top */}
                <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

                <CardContent className="p-5 sm:p-6 space-y-5">
                  {/* HLV Big Number */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      {isHindi ? 'आपकी ह्यूमन लाइफ वैल्यू' : 'Your Human Life Value'}
                    </p>
                    <motion.p
                      className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent"
                      key={animatedHLV}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                    >
                      {formatRupeesFull(animatedHLV)}
                    </motion.p>
                  </div>

                  {/* Key Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Recommended Cover */}
                    <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200/50 dark:border-violet-800/40 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Shield className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                        <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                          {isHindi ? 'रिकमेंडेड कवर' : 'Recommended Cover'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {formatRupees(animatedCover)}
                      </p>
                    </div>

                    {/* Age Multiplier */}
                    <div className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200/50 dark:border-teal-800/40 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                          {isHindi ? 'एज मल्टीप्लायर' : 'Age Multiplier'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{ageMultiplier}×</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{ageLabel}</p>
                    </div>

                    {/* Premium Estimate */}
                    <div className="col-span-2 sm:col-span-1 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200/50 dark:border-amber-800/40 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <IndianRupee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                          {isHindi ? 'अनुमा. वार्षिक प्रीमियम' : 'Est. Annual Premium'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {formatRupees(animatedPremium)}
                      </p>
                    </div>
                  </div>

                  {/* Visual Breakdown */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {isHindi ? 'आय बनाम खर्च विवरण' : 'Income vs Expenses Breakdown'}
                    </p>
                    <BreakdownBar
                      income={annualIncome}
                      expenses={annualExpenses}
                      savings={annualSavings}
                    />
                  </div>

                  {/* Visual Calculation */}
                  <div className="rounded-xl bg-muted/50 border border-border/40 p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      {isHindi ? 'HLV कैलकुलेशन' : 'HLV Calculation'}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
                      <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded-md font-medium">
                        {formatRupees(annualIncome)}
                      </span>
                      <span className="text-muted-foreground font-bold">−</span>
                      <span className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-2 py-1 rounded-md font-medium">
                        {formatRupees(annualExpenses)}
                      </span>
                      <span className="text-muted-foreground font-bold">=</span>
                      <span className="bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md font-medium">
                        {formatRupees(annualSavings)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
                      <span className="bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md font-medium">
                        {formatRupees(annualSavings)}
                      </span>
                      <span className="text-muted-foreground font-bold">×</span>
                      <span className="bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 px-2 py-1 rounded-md font-medium">
                        {yearsToRetirement} yrs
                      </span>
                      <span className="text-muted-foreground font-bold">+</span>
                      <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-md font-medium">
                        {formatRupees(outstandingDebts)} debts
                      </span>
                      <span className="text-muted-foreground font-bold">=</span>
                      <span className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40 text-violet-700 dark:text-violet-400 px-2.5 py-1 rounded-md font-bold">
                        {formatRupeesFull(result.hlv)}
                      </span>
                    </div>
                  </div>

                  {/* Quick Summary */}
                  <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-950/20 rounded-xl p-3 border border-violet-200/40 dark:border-violet-800/30">
                    <Target className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <p className="text-xs sm:text-sm text-violet-800 dark:text-violet-300">
                    {isHindi ? `आपकी HLV ${formatRupees(result.hlv)} hai. Outstanding debts ke saath recommended insurance cover ${formatRupees(result.recommendedCover)} hai, jo approximately ${formatRupees(result.premiumEstimate)}/yr premium mein available hai.` : `Aapki HLV ${formatRupees(result.hlv)} hai. Outstanding debts ke saath recommended insurance cover ${formatRupees(result.recommendedCover)} hai, jo approximately ${formatRupees(result.premiumEstimate)}/yr premium mein available hai.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* AGE-BASED RECOMMENDATIONS TIMELINE                                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mt-8 border-border/60 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">{isHindi ? 'उम्र के हिसाब से सुझाव' : 'Age-Based Recommendations'}</CardTitle>
                <CardDescription className="text-xs">
                  {isHindi ? 'हर उम्र ब्रैकेट का रिकमेंडेड कवर आपकी करंट इनकम पर' : 'Har age bracket ka recommended cover aapki current income pe'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AgeTimeline
              currentAge={currentAge}
              annualIncome={annualIncome}
              annualExpenses={annualExpenses}
              outstandingDebts={outstandingDebts}
              retirementAge={retirementAge}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* COMPARISON TABLE                                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mt-6 border-border/60 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {isHindi ? 'अलग-अलग उम्र में तुलना' : 'Comparison at Different Ages'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isHindi ? 'सेम इनकम और खर्च — बस उम्र बढ़ने से कवर कैसे बदलता है' : 'Same income & expenses — bas age badhne se cover kaise change hota hai'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ComparisonTable
              currentAge={currentAge}
              annualIncome={annualIncome}
              annualExpenses={annualExpenses}
              outstandingDebts={outstandingDebts}
              retirementAge={retirementAge}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* KEY INSIGHTS                                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mt-6 border-border/60 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">{isHindi ? 'मुख्य बातें' : 'Key Insights'}</CardTitle>
                <CardDescription className="text-xs">
                  {isHindi ? 'इंश्योरेंस लेना शान, बेवकूफ़ी नहीं — समझो और सही डिसीज़न लो' : 'Insurance lena shaan, bewkoofi nahi — samjho aur sahi decision lo'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {INSIGHTS.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.35 }}
                  className="flex items-start gap-3 rounded-xl bg-muted/50 border border-border/40 p-4 group hover:bg-violet-50/50 dark:hover:bg-violet-950/20 hover:border-violet-200/50 dark:hover:border-violet-800/40 transition-all duration-300"
                >
                  <span className="text-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    {insight.icon}
                  </span>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {insight.text}
                  </p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
