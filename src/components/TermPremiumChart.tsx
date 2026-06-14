'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Calculator,
  TrendingUp,
  Info,
  ChevronRight,
  Sparkles,
  Lock,
  Flame,
  Heart,
  Stethoscope,
  Activity,
  User,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  TERM_PREMIUM_CHART,
  TERM_LOADINGS,
  formatRupees,
  formatRupeesFull,
  type TermPremiumRange,
} from '@/data/ageBasedData';

// ──────────────────────────────────────────────
// Tooltip info data
// ──────────────────────────────────────────────
const TOOLTIP_INFO: Record<string, string> = {
  minPremium: 'Sabse sasta insurer ka rate — usually online term plans',
  maxPremium: 'Expensive insurer ka rate — offline agents ya traditional plans',
  average: 'Market average — iske around expect karein',
};

// ──────────────────────────────────────────────
// Key insights
// ──────────────────────────────────────────────
const KEY_INSIGHTS = [
  {
    icon: Sparkles,
    text: `Age 25 pe lena sabse sasta hai — ₹${((TERM_PREMIUM_CHART[0].minPremium / 1000) | 0)},${String(TERM_PREMIUM_CHART[0].minPremium).slice(-3)}/yr se shuru`,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: TrendingUp,
    text: 'Har 5 saal me premium ~30-40% badh jaata hai',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: User,
    text: 'Female ko 10% discount milta hai term insurance mein',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: Flame,
    text: 'Smoker premium 25-50% zyada hota hai',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: Lock,
    text: 'Premium lock hota hai poora term ke liye — no hike!',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
];

// ──────────────────────────────────────────────
// Loading factor config
// ──────────────────────────────────────────────
interface LoadingOption {
  key: string;
  label: string;
  icon: React.ElementType;
  loading: number;
  color: string;
}

const LOADING_OPTIONS: LoadingOption[] = [
  {
    key: 'smoker',
    label: 'Smoker',
    icon: Flame,
    loading: TERM_LOADINGS.smokerMin,
    color: 'text-red-500',
  },
  {
    key: 'female',
    label: 'Female',
    icon: User,
    loading: -TERM_LOADINGS.femaleDiscount,
    color: 'text-pink-500',
  },
  {
    key: 'diabetes',
    label: 'Diabetes',
    icon: Stethoscope,
    loading: TERM_LOADINGS.diabetes,
    color: 'text-amber-500',
  },
  {
    key: 'hypertension',
    label: 'Hypertension',
    icon: Activity,
    loading: TERM_LOADINGS.hypertension,
    color: 'text-orange-500',
  },
  {
    key: 'heart',
    label: 'Heart Condition',
    icon: Heart,
    loading: TERM_LOADINGS.heart,
    color: 'text-red-600',
  },
];

// ──────────────────────────────────────────────
// Helper: compute percentage increase between ages
// ──────────────────────────────────────────────
function getPercentIncrease(prev: TermPremiumRange, curr: TermPremiumRange): number {
  return Math.round(((curr.avgPremium - prev.avgPremium) / prev.avgPremium) * 100);
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
export default function TermPremiumChart() {
  const [selectedAge, setSelectedAge] = useState<number>(25);
  const [loadings, setLoadings] = useState<Record<string, boolean>>({
    smoker: false,
    female: false,
    diabetes: false,
    hypertension: false,
    heart: false,
  });
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Calculate premium with loadings
  const calcResult = useMemo(() => {
    const entry = TERM_PREMIUM_CHART.find((e) => e.age === selectedAge);
    if (!entry) return null;

    const basePremium = entry.avgPremium;
    let positiveLoadingSum = 0;
    const breakdown: { label: string; amount: number; pct: string }[] = [];

    breakdown.push({
      label: 'Base Premium (avg)',
      amount: basePremium,
      pct: '',
    });

    // Positive loadings (smoker, diseases)
    LOADING_OPTIONS.filter((opt) => opt.key !== 'female').forEach((opt) => {
      if (loadings[opt.key]) {
        const amount = Math.round(basePremium * opt.loading);
        positiveLoadingSum += opt.loading;
        breakdown.push({
          label: `${opt.label} (+${Math.round(opt.loading * 100)}%)`,
          amount,
          pct: `+${Math.round(opt.loading * 100)}%`,
        });
      }
    });

    const afterLoadings = Math.round(basePremium * (1 + positiveLoadingSum));

    breakdown.push({
      label: 'After loadings',
      amount: afterLoadings,
      pct: '',
    });

    // Female discount applied last
    let finalPremium = afterLoadings;
    if (loadings.female) {
      const discount = Math.round(afterLoadings * TERM_LOADINGS.femaleDiscount);
      finalPremium = afterLoadings - discount;
      breakdown.push({
        label: `Female Discount (-${Math.round(TERM_LOADINGS.femaleDiscount * 100)}%)`,
        amount: -discount,
        pct: `-${Math.round(TERM_LOADINGS.femaleDiscount * 100)}%`,
      });
    }

    breakdown.push({
      label: 'Estimated Premium',
      amount: finalPremium,
      pct: '',
    });

    return { basePremium, finalPremium, breakdown };
  }, [selectedAge, loadings]);

  // Max premium across all ages for bar width scaling
  const maxRange = useMemo(
    () =>
      Math.max(...TERM_PREMIUM_CHART.map((e) => e.maxPremium - e.minPremium)),
    []
  );
  const globalMax = useMemo(
    () => Math.max(...TERM_PREMIUM_CHART.map((e) => e.maxPremium)),
    []
  );

  const toggleLoading = (key: string) => {
    setLoadings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <TooltipProvider delayDuration={200}>
      <section className="w-full space-y-8">
        {/* ─── 1. Header Section ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-8 dark:from-blue-600 dark:to-indigo-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3N2Zz4=')] opacity-60" />
          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Term Insurance Premium Chart
                </h2>
                <p className="mt-1 text-sm text-blue-100 sm:text-base">
                  ₹1 Crore cover, till age 65 — healthy non-smoker male
                </p>
              </div>
            </div>
            <Badge className="w-fit bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 border-white/20">
              IRDAI 2024-25 Data
            </Badge>
          </div>
        </div>

        {/* ─── 2. Visual Premium Range Chart ─── */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Premium Range by Age
            </CardTitle>
            <CardDescription>
              Horizontal bars show min-to-max premium range for ₹1 Crore term cover
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pb-6">
            {TERM_PREMIUM_CHART.map((entry, index) => {
              const rangeWidth =
                maxRange > 0
                  ? ((entry.maxPremium - entry.minPremium) / globalMax) * 100
                  : 50;
              const minOffset =
                globalMax > 0 ? (entry.minPremium / globalMax) * 100 : 0;
              const avgPosition =
                globalMax > 0 ? (entry.avgPremium / globalMax) * 100 : 50;
              const prevEntry = index > 0 ? TERM_PREMIUM_CHART[index - 1] : null;
              const percentIncrease = prevEntry
                ? getPercentIncrease(prevEntry, entry)
                : null;

              return (
                <div key={entry.age} className="space-y-1.5">
                  {/* Age increase indicator */}
                  {percentIncrease !== null && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400"
                    >
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-medium">+{percentIncrease}% from age {prevEntry!.age}</span>
                    </motion.div>
                  )}

                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Age label */}
                    <div className="flex w-14 shrink-0 items-center justify-center rounded-lg bg-blue-50 py-2 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 sm:w-16 sm:text-base">
                      {entry.age}yr
                    </div>

                    {/* Bar area */}
                    <div className="relative h-10 flex-1 rounded-lg bg-gray-100 dark:bg-gray-800/60">
                      {/* Premium range bar */}
                      <motion.div
                        className="absolute top-0 h-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600"
                        initial={{ left: 0, width: 0 }}
                        animate={{
                          left: `${minOffset}%`,
                          width: `${rangeWidth}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.2,
                          ease: 'easeOut',
                        }}
                      />

                      {/* Average marker */}
                      <motion.div
                        className="absolute top-0 z-10 flex h-full items-center"
                        initial={{ left: 0 }}
                        animate={{ left: `${avgPosition}%` }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.2 + 0.3,
                          ease: 'easeOut',
                        }}
                      >
                        <div className="h-6 w-0.5 -translate-x-1/2 rounded-full bg-white shadow-md" />
                        <div className="absolute -top-1 -translate-x-1/2 rounded-full bg-white p-0.5 shadow-md">
                          <div className="h-2 w-2 rounded-full bg-teal-500" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Labels */}
                    <div className="hidden shrink-0 flex-col items-end text-xs sm:flex sm:w-40">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <span>{formatRupeesFull(entry.minPremium)}</span>
                        <span>—</span>
                        <span>{formatRupeesFull(entry.maxPremium)}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 cursor-help text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">{TOOLTIP_INFO.minPremium}</p>
                            <p className="text-xs">{TOOLTIP_INFO.maxPremium}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 font-medium text-teal-600 dark:text-teal-400">
                        <span>Avg: {formatRupeesFull(entry.avgPremium)}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 cursor-help text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">{TOOLTIP_INFO.average}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  {/* Mobile labels */}
                  <div className="flex flex-col gap-0.5 pl-[68px] text-xs sm:hidden">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <span>{formatRupeesFull(entry.minPremium)}</span>
                      <span>—</span>
                      <span>{formatRupeesFull(entry.maxPremium)}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 cursor-help text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">{TOOLTIP_INFO.minPremium}</p>
                          <p className="text-xs">{TOOLTIP_INFO.maxPremium}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-teal-600 dark:text-teal-400">
                      <span>Avg: {formatRupeesFull(entry.avgPremium)}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 cursor-help text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">{TOOLTIP_INFO.average}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 border-t pt-4 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-6 rounded bg-gradient-to-r from-blue-500 to-indigo-600" />
                <span>Min — Max Range</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-teal-500 ring-2 ring-white dark:ring-gray-900" />
                <span>Average Premium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                <span>% increase from previous age</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── 3. Quick Age Cards ─── */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-5 w-5 text-teal-500" />
            Quick Age Comparison
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {TERM_PREMIUM_CHART.map((entry) => {
              const isExpanded = expandedCard === entry.age;
              return (
                <motion.div
                  key={entry.age}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 border-0 shadow-md hover:shadow-lg ${
                      isExpanded
                        ? 'ring-2 ring-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10'
                        : 'bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm'
                    }`}
                    onClick={() =>
                      setExpandedCard(isExpanded ? null : entry.age)
                    }
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 sm:text-3xl">
                          {entry.age}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {' '}yrs
                          </span>
                        </div>
                        <div className="space-y-1 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Starting</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatRupeesFull(entry.minPremium)}/yr
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Up to</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                              {formatRupeesFull(entry.maxPremium)}/yr
                            </span>
                          </div>
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 space-y-1.5 border-t pt-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Cover</span>
                                  <span className="font-medium">{entry.coverAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Policy Term</span>
                                  <span className="font-medium">{entry.policyTerm}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Avg Premium</span>
                                  <span className="font-medium text-teal-600 dark:text-teal-400">
                                    {formatRupeesFull(entry.avgPremium)}/yr
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAge(entry.age);
                                    document
                                      .getElementById('term-loading-calculator')
                                      ?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                >
                                  Calculate with Loadings
                                  <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {!isExpanded && (
                          <div className="mt-1 text-xs text-blue-500 dark:text-blue-400">
                            View Details →
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── 4. Loading Factor Calculator ─── */}
        <Card
          id="term-loading-calculator"
          className="border-0 shadow-lg overflow-hidden"
        >
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-600/10 dark:from-blue-500/5 dark:to-indigo-600/5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-blue-500" />
              Loading Factor Calculator
            </CardTitle>
            <CardDescription>
              Calculate your estimated premium based on health & lifestyle factors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Age selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Age</Label>
              <Select
                value={String(selectedAge)}
                onValueChange={(val) => setSelectedAge(Number(val))}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {TERM_PREMIUM_CHART.map((entry) => (
                    <SelectItem key={entry.age} value={String(entry.age)}>
                      Age {entry.age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Loading toggles */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Apply Loadings</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {LOADING_OPTIONS.map((opt) => {
                  const isActive = loadings[opt.key];
                  const IconComp = opt.icon;
                  return (
                    <div
                      key={opt.key}
                      className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                        isActive
                          ? 'border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20'
                          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp
                          className={`h-4 w-4 ${
                            isActive ? opt.color : 'text-gray-400'
                          }`}
                        />
                        <div>
                          <span className="text-sm font-medium">{opt.label}</span>
                          <span
                            className={`ml-1.5 text-xs ${
                              opt.loading > 0
                                ? 'text-red-500'
                                : 'text-emerald-500'
                            }`}
                          >
                            {opt.loading > 0
                              ? `+${Math.round(opt.loading * 100)}%`
                              : `${Math.round(opt.loading * 100)}%`}
                          </span>
                        </div>
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleLoading(opt.key)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {calcResult && (
                <motion.div
                  key={`${selectedAge}-${JSON.stringify(loadings)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 dark:border-gray-700 dark:from-gray-800/50 dark:to-gray-900/50 sm:p-5"
                >
                  {/* Breakdown */}
                  <div className="space-y-2">
                    {calcResult.breakdown.map((line, i) => {
                      const isLast = i === calcResult.breakdown.length - 1;
                      const isSubtotal =
                        line.label === 'After loadings';
                      return (
                        <div
                          key={line.label}
                          className={`flex items-center justify-between text-sm ${
                            isLast
                              ? 'border-t pt-2 text-base font-bold text-blue-700 dark:text-blue-300'
                              : isSubtotal
                                ? 'font-medium text-gray-700 dark:text-gray-300'
                                : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          <span>{line.label}</span>
                          <span
                            className={
                              line.amount < 0
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : line.amount > 0 && !isLast && line.pct.startsWith('+')
                                  ? 'text-red-500'
                                  : ''
                            }
                          >
                            {line.amount < 0 ? '-' : line.amount > 0 && !isLast && i > 0 && i < calcResult.breakdown.length - 2 ? '+' : ''}
                            {formatRupeesFull(Math.abs(line.amount))}
                            {line.pct ? ` (${line.pct})` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Final highlight */}
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-blue-100">
                        Estimated Annual Premium
                      </div>
                      <div className="mt-1 text-2xl font-bold sm:text-3xl">
                        {formatRupeesFull(calcResult.finalPremium)}
                        <span className="text-sm font-normal text-blue-200">/yr</span>
                      </div>
                    </div>
                    <Shield className="h-10 w-10 text-white/20" />
                  </div>

                  {/* Monthly equivalent */}
                  <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                    ≈ {formatRupeesFull(Math.round(calcResult.finalPremium / 12))}/month
                    {' • '}
                    Cover: ₹1 Crore • Term: Till 65
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* ─── 5. Key Insights ─── */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Key Insights
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {KEY_INSIGHTS.map((insight, index) => {
              const IconComp = insight.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className="h-full border-0 shadow-md bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm">
                    <CardContent className="flex items-start gap-3 p-4">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${insight.bg}`}
                      >
                        <IconComp className={`h-4 w-4 ${insight.color}`} />
                      </div>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {insight.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
