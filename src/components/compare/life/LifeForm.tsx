'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, TrendingDown, AlertTriangle, Cigarette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SMOKER_LOADING, RETURN_OF_PREMIUM, LIFE_GST } from '@/lib/compare/life-rates';
import { formatINR } from '@/lib/compare/compare-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type LifeGender = 'MALE' | 'FEMALE';
export type LifeSmoker = 'yes' | 'no';
export type LifePayMode = 'regular' | 'pay12' | 'pay15' | 'single';

export interface LifeFormData {
  gender: LifeGender;
  age: number;
  isSmoker: boolean;
  sumAssured: number;
  policyTerm: number;
  payMode: LifePayMode;
  isROP: boolean;
  annualIncome: number;
  currentLifeCover: number;
}

interface LifeFormProps {
  onCompare: (data: LifeFormData) => void;
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const AGE_OPTIONS = Array.from({ length: 36 }, (_, i) => i + 25); // 25-60

const SUM_ASSURED_OPTIONS = [
  { value: 5000000, label: '₹50L' },
  { value: 7500000, label: '₹75L' },
  { value: 10000000, label: '₹1Cr' },
  { value: 15000000, label: '₹1.5Cr' },
  { value: 20000000, label: '₹2Cr' },
  { value: 50000000, label: '₹5Cr' },
];

const POLICY_TERM_OPTIONS = [10, 15, 20, 25, 30, 40];

const PAY_MODE_OPTIONS: { value: LifePayMode; label: string; desc: string }[] = [
  { value: 'regular', label: 'Regular Pay', desc: 'Pay till policy term' },
  { value: 'pay12', label: 'Limited Pay 12yr', desc: 'Pay only for 12 years' },
  { value: 'pay15', label: 'Limited Pay 15yr', desc: 'Pay only for 15 years' },
  { value: 'single', label: 'Single Pay', desc: 'One-time lumpsum' },
];

// ---------------------------------------------------------------------------
// Estimated GST saving for banner
// ---------------------------------------------------------------------------
function estimateGSTSaving(age: number, sumAssured: number, gender: LifeGender, isSmoker: boolean): number {
  // Rough base estimate using male non-smoker rate at age 30, ₹1Cr as reference
  const refRatePerCr = 5680; // HDFC_LIFE male non-smoker age 30
  const proportion = sumAssured / 10000000;
  let base = refRatePerCr * proportion;

  // Age factor
  const ageFactor = age <= 25 ? 0.85 : age <= 30 ? 1 : age <= 35 ? 1.25 : age <= 40 ? 1.75 : age <= 45 ? 2.55 : age <= 50 ? 4.05 : 4.65;
  base = base * ageFactor;

  // Gender factor
  if (gender === 'FEMALE') base = base * 0.83;

  // Smoker loading
  if (isSmoker) base = base * SMOKER_LOADING;

  base = Math.round(base);

  // GST saving = what would have been 18%
  return Math.round(base * 0.18);
}

// ---------------------------------------------------------------------------
// LifeForm Component
// ---------------------------------------------------------------------------
export function LifeForm({ onCompare, loading = false }: LifeFormProps) {
  const [gender, setGender] = useState<LifeGender>('MALE');
  const [age, setAge] = useState(30);
  const [smoker, setSmoker] = useState<LifeSmoker>('no');
  const [sumAssured, setSumAssured] = useState(10000000);
  const [policyTerm, setPolicyTerm] = useState(20);
  const [payMode, setPayMode] = useState<LifePayMode>('regular');
  const [isROP, setIsROP] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [currentLifeCover, setCurrentLifeCover] = useState(0);

  const gstSavingEstimate = useMemo(
    () => estimateGSTSaving(age, sumAssured, gender, smoker === 'yes'),
    [age, sumAssured, gender, smoker]
  );

  const handleSubmit = () => {
    onCompare({
      gender,
      age,
      isSmoker: smoker === 'yes',
      sumAssured,
      policyTerm,
      payMode,
      isROP,
      annualIncome,
      currentLifeCover,
    });
  };

  const isFormValid = age >= 25 && age <= 60 && sumAssured > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-violet-200 dark:border-violet-800 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🛡️</span>
            Term Insurance Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare quotes from 8 IRDAI-licensed life insurers — 0% GST from 22 Sept 2025
          </p>

          {/* GST Savings Banner */}
          {gstSavingEstimate > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 px-3 py-2 mt-2">
                <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-xs font-semibold text-green-800 dark:text-green-300">
                  0% GST — Save up to {formatINR(gstSavingEstimate)} vs last year
                </span>
              </div>
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Gender Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Gender</Label>
            <RadioGroup
              value={gender}
              onValueChange={(val) => setGender(val as LifeGender)}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { value: 'MALE', label: 'Male', icon: '👨' },
                { value: 'FEMALE', label: 'Female', icon: '👩' },
              ].map((opt) => {
                const isSelected = gender === opt.value;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`gender-${opt.value}`}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 dark:border-violet-600'
                        : 'border-border hover:border-violet-300 dark:hover:border-violet-700'
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={`gender-${opt.value}`} className="sr-only" />
                    <span className="text-xl">{opt.icon}</span>
                    <span className={`text-xs font-medium ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Age + Policy Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Age</Label>
              <Select
                value={String(age)}
                onValueChange={(val) => setAge(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {AGE_OPTIONS.map((a) => (
                    <SelectItem key={a} value={String(a)}>
                      {a} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Policy Term</Label>
              <Select
                value={String(policyTerm)}
                onValueChange={(val) => setPolicyTerm(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POLICY_TERM_OPTIONS.map((t) => (
                    <SelectItem key={t} value={String(t)}>
                      {t} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Smoker Toggle */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Tobacco / Smoker Status</Label>
            <RadioGroup
              value={smoker}
              onValueChange={(val) => setSmoker(val as LifeSmoker)}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { value: 'no', label: 'Non-Smoker', desc: 'Standard rates', icon: '✅' },
                { value: 'yes', label: 'Smoker', desc: `+${((SMOKER_LOADING - 1) * 100).toFixed(0)}% loading`, icon: '🚬' },
              ].map((opt) => {
                const isSelected = smoker === opt.value;
                const isSmokerOption = opt.value === 'yes';
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`smoker-${opt.value}`}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? isSmokerOption
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600'
                          : 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 dark:border-violet-600'
                        : 'border-border hover:border-violet-300 dark:hover:border-violet-700'
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={`smoker-${opt.value}`} className="sr-only" />
                    <span className="text-xl">{opt.icon}</span>
                    <span className={`text-xs font-medium ${isSelected ? (isSmokerOption ? 'text-amber-700 dark:text-amber-300' : 'text-violet-700 dark:text-violet-300') : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                    {isSmokerOption && isSelected && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                          Higher premium applies
                        </span>
                      </div>
                    )}
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Sum Assured Radio Cards */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Sum Assured</Label>
            <RadioGroup
              value={String(sumAssured)}
              onValueChange={(val) => setSumAssured(Number(val))}
              className="grid grid-cols-3 sm:grid-cols-6 gap-2"
            >
              {SUM_ASSURED_OPTIONS.map((opt) => {
                const isSelected = sumAssured === opt.value;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`sa-${opt.value}`}
                    className={`flex items-center justify-center p-2.5 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 dark:border-violet-600'
                        : 'border-border hover:border-violet-300 dark:hover:border-violet-700'
                    }`}
                  >
                    <RadioGroupItem value={String(opt.value)} id={`sa-${opt.value}`} className="sr-only" />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Pay Mode */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Premium Pay Mode</Label>
            <RadioGroup
              value={payMode}
              onValueChange={(val) => setPayMode(val as LifePayMode)}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            >
              {PAY_MODE_OPTIONS.map((opt) => {
                const isSelected = payMode === opt.value;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`pay-${opt.value}`}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 dark:border-violet-600'
                        : 'border-border hover:border-violet-300 dark:hover:border-violet-700'
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={`pay-${opt.value}`} className="sr-only" />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{opt.desc}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Return of Premium */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 rounded-lg border-2 border-dashed border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-3">
              <Checkbox
                id="rop-option"
                checked={isROP}
                onCheckedChange={(checked) => setIsROP(checked === true)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <Label htmlFor="rop-option" className="text-sm font-medium cursor-pointer">
                  Return of Premium (ROP) Variant
                </Label>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                  Get all premiums back if you survive the policy term. Premium increases by ~{((RETURN_OF_PREMIUM - 1) * 100).toFixed(0)}%.
                </p>
                <Badge className="mt-1.5 bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 text-[9px] h-4 px-1.5">
                  +75% extra premium
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cover Adequacy Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Cover Adequacy Check <span className="text-muted-foreground font-normal">(Optional)</span></Label>
            <p className="text-[10px] text-muted-foreground">
              Check if your life cover is sufficient based on your income
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Annual Income (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 1000000"
                  value={annualIncome || ''}
                  onChange={(e) => setAnnualIncome(Number(e.target.value) || 0)}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Current Life Cover (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 5000000"
                  value={currentLifeCover || ''}
                  onChange={(e) => setCurrentLifeCover(Number(e.target.value) || 0)}
                  min={0}
                />
              </div>
            </div>
            {annualIncome > 0 && (
              <div className="rounded-md bg-muted/50 p-2.5 text-xs text-muted-foreground">
                💡 Recommended cover: {formatINR(annualIncome * 15)} (15× annual income)
                {currentLifeCover > 0 && currentLifeCover < annualIncome * 15 && (
                  <span className="text-red-600 dark:text-red-400 font-medium ml-1">
                    — Shortfall: {formatINR(annualIncome * 15 - currentLifeCover)}
                  </span>
                )}
                {currentLifeCover >= annualIncome * 15 && currentLifeCover > 0 && (
                  <span className="text-green-600 dark:text-green-400 font-medium ml-1">
                    — ✅ Adequately covered
                  </span>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Compare Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Comparing Quotes...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compare Now
                <ChevronRight className="h-5 w-5" />
              </span>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-[10px] text-muted-foreground text-center">
              Please fill in all required fields (Age: 25-60, Sum Assured)
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
