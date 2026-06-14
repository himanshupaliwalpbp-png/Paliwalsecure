'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info,
  Calculator,
  AlertTriangle,
  TrendingUp,
  Shield,
  Heart,
  Cigarette,
  Droplets,
  Activity,
  Users,
  ChevronRight,
  Sparkles,
  IndianRupee,
  ArrowDown,
  ArrowUp,
  Minus,
} from 'lucide-react';

import {
  HEALTH_AGE_PREMIUM_10L,
  HEALTH_LOADINGS,
  SI_SCALING_FROM_10L,
  IRDAI_AGE_GUIDELINES,
  calculateAgeBasedHealthPremium,
  formatRupees,
  formatRupeesFull,
  type AgeHealthCalcInput,
  type AgeHealthCalcResult,
} from '@/data/ageBasedData';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

// ─── Constants ─────────────────────────────────────────────
const DEEP_BLUE = '#0A2540';
const ACCENT_TEAL = '#00A9A6';

const SUM_INSURED_OPTIONS = [
  { label: '₹3L', value: 3 },
  { label: '₹5L', value: 5 },
  { label: '₹10L', value: 10 },
  { label: '₹15L', value: 15 },
  { label: '₹25L', value: 25 },
  { label: '₹50L', value: 50 },
  { label: '₹1Cr', value: 100 },
];

const TOOLTIPS: Record<string, string> = {
  age: 'Premium age ke saath badhta hai — jaldi karein, kam pay karein!',
  smoker: 'Smokers ko 25% zyada premium lagta hai',
  diabetes: 'Diabetes se 30% loading hota hai',
  hypertension: 'BP/Hypertension se 15% loading',
  heart: 'Heart condition se 50% loading — sabse zyada impact',
  familyFloater: 'Family floater mein sabse bade member ki age se premium calculate hota hai',
  sumInsured: '₹10L = Base rate, ₹5L = 35% kam, ₹25L = 75% zyada',
};

// ─── Helpers ───────────────────────────────────────────────
function getAgeGradient(index: number, total: number): string {
  const ratio = index / Math.max(total - 1, 1);
  if (ratio < 0.33) return 'from-emerald-400 to-emerald-500';
  if (ratio < 0.66) return 'from-amber-400 to-amber-500';
  return 'from-rose-400 to-rose-500';
}

function getAgeCardBg(index: number, total: number, selected: boolean): string {
  if (selected) return 'ring-2 ring-offset-2 ring-[#00A9A6]';
  const ratio = index / Math.max(total - 1, 1);
  if (ratio < 0.33) return 'hover:border-emerald-300';
  if (ratio < 0.66) return 'hover:border-amber-300';
  return 'hover:border-rose-300';
}

function getImpactStyle(impact: 'positive' | 'neutral' | 'important') {
  switch (impact) {
    case 'positive':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', icon: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' };
    case 'important':
      return { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' };
    case 'neutral':
      return { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', icon: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' };
  }
}

// ─── Sub-components ────────────────────────────────────────

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex items-center ml-1 text-muted-foreground hover:text-[#00A9A6] transition-colors" aria-label="More info">
          <Info className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px] text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function ToggleRow({
  id,
  label,
  icon: Icon,
  checked,
  onCheckedChange,
  tooltipKey,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  tooltipKey: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer text-sm">
        <Icon className="size-4 text-muted-foreground" />
        {label}
        <InfoTooltip text={TOOLTIPS[tooltipKey]} />
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────

export default function AgeBasedPremiumCalculator() {
  // Form state
  const [age, setAge] = useState(30);
  const [sumInsured, setSumInsured] = useState(10);
  const [smoker, setSmoker] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [heart, setHeart] = useState(false);
  const [familyFloater, setFamilyFloater] = useState(false);
  const [oldestMemberAge, setOldestMemberAge] = useState(50);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<AgeHealthCalcResult | null>(null);

  // Computed premium at current age for tooltip
  const premiumAtAge = useMemo(() => {
    const r = calculateAgeBasedHealthPremium({
      age,
      sumInsured: 10,
      smoker: false,
      diabetes: false,
      hypertension: false,
      heart: false,
      familyFloater: false,
    });
    return r.basePremium;
  }, [age]);

  // Calculate handler
  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    // Simulate brief loading for UX
    setTimeout(() => {
      const input: AgeHealthCalcInput = {
        age,
        sumInsured,
        smoker,
        diabetes,
        hypertension,
        heart,
        familyFloater,
        oldestMemberAge: familyFloater ? oldestMemberAge : undefined,
      };
      const res = calculateAgeBasedHealthPremium(input);
      setResult(res);
      setIsCalculating(false);
    }, 400);
  }, [age, sumInsured, smoker, diabetes, hypertension, heart, familyFloater, oldestMemberAge]);

  // Age card click
  const handleAgeCardClick = useCallback((cardAge: number) => {
    setAge(cardAge);
    setResult(null);
  }, []);

  // Compare with age 25
  const comparison = useMemo(() => {
    if (!result) return null;
    const at25 = calculateAgeBasedHealthPremium({
      age: 25,
      sumInsured,
      smoker,
      diabetes,
      hypertension,
      heart,
      familyFloater,
      oldestMemberAge: familyFloater ? oldestMemberAge : undefined,
    });
    const diff = result.totalYearly - at25.totalYearly;
    const pct = at25.totalYearly > 0 ? Math.round((diff / at25.totalYearly) * 100) : 0;
    return { at25: at25.totalYearly, diff, pct };
  }, [result, sumInsured, smoker, diabetes, hypertension, heart, familyFloater, oldestMemberAge]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="w-full space-y-6">
        {/* ═══════════════════════════════════════════════════
            SECTION 1: Age Premium Reference Table
        ═══════════════════════════════════════════════════ */}
        <Card className="glass-card rounded-2xl border-0 shadow-lg bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base" style={{ color: DEEP_BLUE }}>
                  Age-wise Premium Table
                </CardTitle>
                <CardDescription className="text-xs">
                  ₹10L cover ke liye annual premium — click karein age set karne ke liye
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 pb-2">
                {HEALTH_AGE_PREMIUM_10L.map((entry, idx) => {
                  const isSelected = age === entry.age;
                  return (
                    <motion.button
                      key={entry.age}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAgeCardClick(entry.age)}
                      className={`flex-shrink-0 w-[130px] rounded-xl border-2 p-3 transition-all cursor-pointer text-left ${getAgeCardBg(idx, HEALTH_AGE_PREMIUM_10L.length, isSelected)} ${isSelected ? 'border-[#00A9A6] bg-[#00A9A6]/5' : 'border-border bg-background'}`}
                    >
                      <div className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold text-white bg-gradient-to-r ${getAgeGradient(idx, HEALTH_AGE_PREMIUM_10L.length)}`}>
                        Age {entry.age}
                      </div>
                      <div className="mt-2 text-lg font-bold" style={{ color: DEEP_BLUE }}>
                        {formatRupees(entry.annual)}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{entry.label}</div>
                      {isSelected && (
                        <motion.div
                          layoutId="age-indicator"
                          className="mt-1.5 h-1 rounded-full bg-[#00A9A6]"
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════
            SECTION 2: Premium Calculator Form
        ═══════════════════════════════════════════════════ */}
        <Card className="glass-card rounded-2xl border-0 shadow-lg bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
                <Calculator className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base" style={{ color: DEEP_BLUE }}>
                  Premium Calculator
                </CardTitle>
                <CardDescription className="text-xs">
                  Apni details daalein, exact premium jaanein
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pb-6">
            {/* Age Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center text-sm font-medium" style={{ color: DEEP_BLUE }}>
                  Aapki Age
                  <InfoTooltip text={TOOLTIPS.age} />
                </Label>
                <Badge variant="secondary" className="text-sm font-bold px-3" style={{ backgroundColor: '#00A9A6', color: '#fff' }}>
                  {age} yrs
                </Badge>
              </div>
              <div className="relative pt-1">
                <Slider
                  value={[age]}
                  onValueChange={([v]) => { setAge(v); setResult(null); }}
                  min={18}
                  max={80}
                  step={1}
                  className="w-full [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-emerald-400 [&_[data-slot=slider-range]]:via-amber-400 [&_[data-slot=slider-range]]:to-rose-500 [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-[#00A9A6]"
                />
                <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                  <span>18</span>
                  <span>30</span>
                  <span>45</span>
                  <span>60</span>
                  <span>80</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                ₹10L cover pe age {age} par base premium: <span className="font-semibold" style={{ color: ACCENT_TEAL }}>{formatRupeesFull(premiumAtAge)}</span>/year
              </p>
            </div>

            <Separator />

            {/* Sum Insured Selector */}
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium" style={{ color: DEEP_BLUE }}>
                Sum Insured (Cover Amount)
                <InfoTooltip text={TOOLTIPS.sumInsured} />
              </Label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {SUM_INSURED_OPTIONS.map((opt) => {
                  const isActive = sumInsured === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSumInsured(opt.value); setResult(null); }}
                      className={`rounded-lg border-2 px-2 py-2 text-xs font-semibold transition-all ${isActive ? 'border-[#00A9A6] bg-[#00A9A6]/10 text-[#00A9A6]' : 'border-border bg-background text-muted-foreground hover:border-[#00A9A6]/40'}`}
                    >
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Toggle Switches */}
            <div className="space-y-1">
              <ToggleRow id="smoker" label="Smoker / Tobacco" icon={Cigarette} checked={smoker} onCheckedChange={(v) => { setSmoker(v); setResult(null); }} tooltipKey="smoker" />
              <ToggleRow id="diabetes" label="Diabetes" icon={Droplets} checked={diabetes} onCheckedChange={(v) => { setDiabetes(v); setResult(null); }} tooltipKey="diabetes" />
              <ToggleRow id="hypertension" label="Hypertension / BP" icon={Activity} checked={hypertension} onCheckedChange={(v) => { setHypertension(v); setResult(null); }} tooltipKey="hypertension" />
              <ToggleRow id="heart" label="Heart Condition" icon={Heart} checked={heart} onCheckedChange={(v) => { setHeart(v); setResult(null); }} tooltipKey="heart" />
            </div>

            <Separator />

            {/* Family Floater */}
            <div className="space-y-3">
              <ToggleRow
                id="familyFloater"
                label="Family Floater"
                icon={Users}
                checked={familyFloater}
                onCheckedChange={(v) => { setFamilyFloater(v); setResult(null); }}
                tooltipKey="familyFloater"
              />
              <AnimatePresence>
                {familyFloater && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 border-l-2 border-[#00A9A6]/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center text-sm" style={{ color: DEEP_BLUE }}>
                          Oldest Member Age
                          <InfoTooltip text={TOOLTIPS.familyFloater} />
                        </Label>
                        <Badge variant="secondary" className="text-sm font-bold px-3" style={{ backgroundColor: '#0A2540', color: '#fff' }}>
                          {oldestMemberAge} yrs
                        </Badge>
                      </div>
                      <Slider
                        value={[oldestMemberAge]}
                        onValueChange={([v]) => { setOldestMemberAge(v); setResult(null); }}
                        min={18}
                        max={80}
                        step={1}
                        className="w-full [&_[data-slot=slider-range]]:bg-[#0A2540] [&_[data-slot=slider-thumb]]:border-[#0A2540]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator />

            {/* Calculate Button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full h-12 text-base font-bold rounded-xl shadow-lg"
                style={{ backgroundColor: ACCENT_TEAL, color: '#fff' }}
              >
                {isCalculating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="size-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Sparkles className="size-5 mr-2" />
                    Premium Calculate Karein
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════
            SECTION 3: Result Breakdown Card
        ═══════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result-card"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="glass-card rounded-2xl border-0 shadow-lg bg-card overflow-hidden">
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-5 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="size-5" />
                    <span className="text-sm font-medium opacity-90">Aapka Health Insurance Premium</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <p className="text-xs opacity-80">Monthly Premium</p>
                      <motion.p
                        className="text-3xl sm:text-4xl font-extrabold"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                      >
                        {formatRupeesFull(result.totalMonthly)}
                        <span className="text-sm font-normal opacity-80">/month</span>
                      </motion.p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80">Yearly Premium (GST incl.)</p>
                      <p className="text-xl sm:text-2xl font-bold">
                        {formatRupeesFull(result.totalYearly)}
                        <span className="text-sm font-normal opacity-80">/year</span>
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="pt-4 pb-6 space-y-3">
                  {/* Effective age notice */}
                  {result.premiumAge !== age && (
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-xs">
                      <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-amber-800 dark:text-amber-200">
                        Family floater mein sabse bade member ki age ({result.premiumAge}) se premium calculate hua hai
                      </span>
                    </div>
                  )}

                  {/* Itemized Breakdown */}
                  <div className="space-y-2 text-sm">
                    <BreakdownRow label="Base Premium (Age)" amount={result.basePremium} />
                    {result.siLoading !== 0 && (
                      <BreakdownRow label={`SI Loading (${formatRupees(sumInsured * 100000)} cover)`} amount={result.siLoading} isAddition />
                    )}
                    {result.pedLoadings.map((ped) => (
                      <BreakdownRow key={ped.name} label={ped.name} amount={ped.amount} isAddition />
                    ))}
                    {result.smokerLoading > 0 && (
                      <BreakdownRow label="Smoker Loading (+25%)" amount={result.smokerLoading} isAddition />
                    )}
                    {result.familyFloaterLoading > 0 && (
                      <BreakdownRow label="Family Floater Loading (+30%)" amount={result.familyFloaterLoading} isAddition />
                    )}
                    <Separator />
                    <BreakdownRow label="Subtotal" amount={result.subtotal} isBold />
                    <BreakdownRow label="GST (18%)" amount={result.gst} isAddition />
                    <Separator />
                    <div className="flex items-center justify-between font-extrabold text-base pt-1" style={{ color: DEEP_BLUE }}>
                      <span>Total Yearly</span>
                      <span>{formatRupeesFull(result.totalYearly)}</span>
                    </div>
                  </div>

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {result.warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-3 text-xs">
                          <AlertTriangle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                          <span className="text-rose-800 dark:text-rose-200">{w}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comparison with Age 25 */}
                  {comparison && age > 25 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 rounded-xl border-2 border-dashed border-[#00A9A6]/40 bg-[#00A9A6]/5 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IndianRupee className="size-4" style={{ color: ACCENT_TEAL }} />
                        <span className="text-sm font-semibold" style={{ color: DEEP_BLUE }}>
                          Age 25 se Compare
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Age 25 pe</p>
                          <p className="text-sm font-bold" style={{ color: DEEP_BLUE }}>{formatRupees(comparison.at25)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Fark</p>
                          <p className="text-sm font-bold text-rose-500 flex items-center justify-center gap-0.5">
                            <ArrowUp className="size-3" />
                            {formatRupees(comparison.diff)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Zyada %</p>
                          <p className="text-sm font-bold text-rose-500">+{comparison.pct}%</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Agar age 25 pe policy li hoti toh itna kam premium lagta! 💡
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════
            SECTION 4: IRDAI 2025-26 Guidelines
        ═══════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Shield className="size-3.5" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: DEEP_BLUE }}>
              IRDAI 2025-26 Age Guidelines
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {IRDAI_AGE_GUIDELINES.map((guideline, idx) => {
              const styles = getImpactStyle(guideline.impact);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`rounded-xl border ${styles.border} ${styles.bg} h-full`}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{guideline.icon}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
                            {guideline.impact === 'positive' ? 'Positive' : guideline.impact === 'important' ? 'Important' : 'Info'}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold leading-tight" style={{ color: DEEP_BLUE }}>
                        {guideline.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {guideline.description}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1">
                        <ChevronRight className="size-3" />
                        Effective: {guideline.effectiveFrom}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ─── Breakdown Row Helper ──────────────────────────────────

function BreakdownRow({
  label,
  amount,
  isAddition = false,
  isBold = false,
}: {
  label: string;
  amount: number;
  isAddition?: boolean;
  isBold?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${isBold ? 'font-bold' : ''}`}>
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {isAddition && <ArrowUp className="size-3 text-rose-400" />}
        {!isAddition && amount > 0 && <Minus className="size-3 text-muted-foreground/50" />}
        {label}
      </span>
      <span style={{ color: isAddition ? '#e11d48' : DEEP_BLUE }} className={isBold ? 'font-bold' : ''}>
        {isAddition ? '+' : ''}{formatRupeesFull(amount)}
      </span>
    </div>
  );
}
