'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, TrendingDown, TrendingUp,
  CheckCircle2, XCircle, Info, ChevronRight, Sparkles,
  IndianRupee, AlertCircle, Lightbulb, ArrowRight,
  ThumbsUp, ThumbsDown, Minus, FileCheck, Clock,
  FileText, ListChecks, BookOpen, Zap, RotateCcw,
  Loader2, Heart, Car, Plane, Shield, ClipboardList,
  CircleDot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ============================================================================
// TYPES
// ============================================================================

interface KeyFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface ClaimAssessment {
  approvalProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  keyFactors: KeyFactor[];
  potentialIssues: string[];
  requiredDocuments: string[];
  filingSteps: string[];
  estimatedTimeline: string;
  tips: string[];
  aiRecommendation: string;
}

interface ApiResponse {
  success: boolean;
  assessment?: ClaimAssessment;
  error?: string;
}

interface FormData {
  claimType: string;
  claimAmount: string;
  sumInsured: string;
  policyAge: string;
  hasPED: boolean;
  waitingPeriodCompleted: boolean;
  hospitalType: string;
  insurerCsr: string;
  description: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function formatIndianCurrency(num: number): string {
  return num.toLocaleString('en-IN');
}

function parseIndianNumber(str: string): number {
  return Number(str.replace(/[^0-9]/g, '')) || 0;
}

function getRiskColor(level: string) {
  switch (level) {
    case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    case 'High': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
    default: return '';
  }
}

function getRiskIcon(level: string) {
  switch (level) {
    case 'Low': return ThumbsUp;
    case 'Medium': return Minus;
    case 'High': return ThumbsDown;
    default: return Minus;
  }
}

function getProbabilityColor(prob: number): string {
  if (prob >= 75) return '#10b981';
  if (prob >= 40) return '#f59e0b';
  return '#ef4444';
}

function getProbabilityGradient(prob: number): string {
  if (prob >= 75) return 'from-emerald-400 to-teal-500';
  if (prob >= 40) return 'from-amber-400 to-amber-500';
  return 'from-red-400 to-red-500';
}

function getProbabilityBg(prob: number): string {
  if (prob >= 75) return 'bg-emerald-100 dark:bg-emerald-950/30';
  if (prob >= 40) return 'bg-amber-100 dark:bg-amber-950/30';
  return 'bg-red-100 dark:bg-red-950/30';
}

function getImpactIcon(impact: string) {
  switch (impact) {
    case 'positive': return TrendingUp;
    case 'negative': return TrendingDown;
    default: return Minus;
  }
}

function getImpactColor(impact: string) {
  switch (impact) {
    case 'positive': return 'text-emerald-500';
    case 'negative': return 'text-red-500';
    default: return 'text-slate-400';
  }
}

function getImpactBadge(impact: string) {
  switch (impact) {
    case 'positive': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'negative': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
    default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  }
}

function getClaimTypeIcon(type: string) {
  switch (type) {
    case 'health': return Heart;
    case 'motor': return Car;
    case 'life': return Shield;
    case 'travel': return Plane;
    default: return ShieldCheck;
  }
}

// ============================================================================
// ANIMATED PROBABILITY RING
// ============================================================================

function ProbabilityRing({ probability }: { probability: number }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1500;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setAnimatedValue(Math.round(eased * probability));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [probability]);

  const color = getProbabilityColor(probability);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted/30"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl sm:text-4xl font-extrabold"
          style={{ color }}
        >
          {animatedValue}%
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          Approval
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// SKELETON LOADER
// ============================================================================

function AssessmentSkeleton() {
  return (
    <div className="space-y-5 p-5 sm:p-6">
      <div className="flex flex-col items-center py-6 gap-4">
        <Skeleton className="w-32 h-32 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-lg" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-40 rounded" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-36 rounded" />
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIClaimAssessment() {
  const [formData, setFormData] = useState<FormData>({
    claimType: '',
    claimAmount: '',
    sumInsured: '',
    policyAge: '',
    hasPED: false,
    waitingPeriodCompleted: false,
    hospitalType: '',
    insurerCsr: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClaimAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Reset waiting period if PED is turned off
      if (field === 'hasPED' && value === false) {
        next.waitingPeriodCompleted = false;
      }
      // Reset hospital type if claim type changes from health
      if (field === 'claimType' && value !== 'health') {
        next.hospitalType = '';
      }
      return next;
    });
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!formData.claimType) {
      setError('Claim Type select karein');
      return;
    }
    const claimAmountNum = parseIndianNumber(formData.claimAmount);
    if (claimAmountNum <= 0) {
      setError('Claim Amount daalein');
      return;
    }
    const sumInsuredNum = parseIndianNumber(formData.sumInsured);
    if (sumInsuredNum <= 0) {
      setError('Sum Insured daalein');
      return;
    }
    if (!formData.policyAge.trim()) {
      setError('Policy Age daalein');
      return;
    }
    if (formData.description.trim().length < 10) {
      setError('Description mein kam se kam 10 characters likhein');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        claimType: formData.claimType,
        claimAmount: claimAmountNum,
        sumInsured: sumInsuredNum,
        policyAge: formData.policyAge.trim(),
        hasPED: formData.hasPED,
        waitingPeriodCompleted: formData.waitingPeriodCompleted,
        hospitalType: formData.hospitalType || undefined,
        insurerCsr: formData.insurerCsr ? Number(formData.insurerCsr) : undefined,
        description: formData.description.trim(),
      };

      const res = await fetch('/api/ai-claim-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await res.json();

      if (res.ok && data.success && data.assessment) {
        setResult(data.assessment);
      } else {
        setError(data.error || 'Kuch gadbad ho gayi. Dobara try karein.');
      }
    } catch {
      setError('Network error. Internet connection check karein aur dobara try karein.');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleRetry = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  const isFormValid =
    formData.claimType &&
    parseIndianNumber(formData.claimAmount) > 0 &&
    parseIndianNumber(formData.sumInsured) > 0 &&
    formData.policyAge.trim() &&
    formData.description.trim().length >= 10;

  return (
    <div className="w-full">
      <Card className="glass-card rounded-2xl border-0 shadow-xl overflow-hidden bg-card">
        {/* Gradient Header — Teal/Emerald */}
        <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 px-6 py-5">
          <div className="flex items-center gap-3 text-white">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">AI Claim Assessment</h2>
              <p className="text-white/80 text-xs sm:text-sm">Apne Claim ka AI se Assessment Karwayein — Pehle hi jaanein</p>
            </div>
            <Badge className="ml-auto bg-white/20 text-white border-white/30 text-[10px] hidden sm:inline-flex">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Two-column layout on desktop */}
          <div className="grid lg:grid-cols-2 gap-0">
            {/* ─── LEFT: Form Inputs ────────────────────────────── */}
            <div className="p-5 sm:p-6 lg:border-r border-border space-y-5">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="w-3.5 h-3.5" />
                Apni Details Bhariye
              </p>

              {/* Claim Type */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-teal-500" />
                  Claim Type
                </Label>
                <Select
                  value={formData.claimType}
                  onValueChange={(v) => updateField('claimType', v)}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Claim Type Choose Karein" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">
                      <span className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Health Insurance
                      </span>
                    </SelectItem>
                    <SelectItem value="motor">
                      <span className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-amber-500" />
                        Motor Insurance
                      </span>
                    </SelectItem>
                    <SelectItem value="life">
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                        Life Insurance
                      </span>
                    </SelectItem>
                    <SelectItem value="travel">
                      <span className="flex items-center gap-2">
                        <Plane className="w-3.5 h-3.5 text-violet-500" />
                        Travel Insurance
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Claim Amount */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-teal-500" />
                  Claim Amount (₹)
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={formData.claimAmount}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      updateField('claimAmount', raw ? formatIndianCurrency(Number(raw)) : '');
                    }}
                    placeholder="e.g. 3,00,000"
                    className="pl-9 rounded-xl h-11"
                  />
                </div>
                {parseIndianNumber(formData.claimAmount) > parseIndianNumber(formData.sumInsured) &&
                  parseIndianNumber(formData.claimAmount) > 0 && parseIndianNumber(formData.sumInsured) > 0 && (
                  <p className="text-[10px] text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Claim amount sum insured se zyada hai — insurer itna hi dega
                  </p>
                )}
              </div>

              {/* Sum Insured */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-teal-500" />
                  Sum Insured (₹)
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={formData.sumInsured}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      updateField('sumInsured', raw ? formatIndianCurrency(Number(raw)) : '');
                    }}
                    placeholder="e.g. 5,00,000"
                    className="pl-9 rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Policy Age */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  Policy Age
                </Label>
                <Input
                  type="text"
                  value={formData.policyAge}
                  onChange={(e) => updateField('policyAge', e.target.value)}
                  placeholder='e.g. "2 years", "6 months"'
                  className="rounded-xl h-11"
                />
              </div>

              {/* Has Pre-existing Disease Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    Pre-existing Disease (PED) Hai?
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${!formData.hasPED ? 'text-emerald-600' : 'text-muted-foreground'}`}>No</span>
                    <Switch
                      checked={formData.hasPED}
                      onCheckedChange={(v) => updateField('hasPED', v)}
                    />
                    <span className={`text-xs font-medium ${formData.hasPED ? 'text-amber-600' : 'text-muted-foreground'}`}>Yes</span>
                  </div>
                </div>
              </div>

              {/* Waiting Period Completed — conditional */}
              <AnimatePresence>
                {formData.hasPED && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <Label className="text-sm font-semibold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Waiting Period Complete?
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${!formData.waitingPeriodCompleted ? 'text-red-600' : 'text-muted-foreground'}`}>No</span>
                        <Switch
                          checked={formData.waitingPeriodCompleted}
                          onCheckedChange={(v) => updateField('waitingPeriodCompleted', v)}
                        />
                        <span className={`text-xs font-medium ${formData.waitingPeriodCompleted ? 'text-emerald-600' : 'text-muted-foreground'}`}>Yes</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hospital Type — only for Health claims */}
              <AnimatePresence>
                {formData.claimType === 'health' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden space-y-2"
                  >
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      Hospital Type
                    </Label>
                    <Select
                      value={formData.hospitalType}
                      onValueChange={(v) => updateField('hospitalType', v)}
                    >
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Hospital Type Choose Karein" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="network">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Network Hospital (Cashless)
                          </span>
                        </SelectItem>
                        <SelectItem value="non-network">
                          <span className="flex items-center gap-2">
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            Non-network Hospital (Reimbursement)
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Insurer CSR */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
                  Insurer CSR (Optional)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.insurerCsr}
                    onChange={(e) => updateField('insurerCsr', e.target.value)}
                    placeholder="e.g. 90 (0-100%)"
                    className="rounded-xl h-11 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Claim Settlement Ratio — insurer ki website pe milega
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-500" />
                  Claim Scenario Description
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Apna claim scenario describe karein — kya hua, kya treatment chahiye, kab hua, etc. (kam se kam 10 characters)"
                  className="rounded-xl min-h-[80px] resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">
                    Zyada detail = zyada accurate assessment
                  </p>
                  <span className={`text-[10px] font-medium ${
                    formData.description.trim().length >= 10 ? 'text-emerald-600' : 'text-amber-500'
                  }`}>
                    {formData.description.trim().length}/10 min chars
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isLoading}
                className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-600 hover:via-emerald-600 hover:to-teal-700 text-white rounded-xl h-12 text-base font-semibold gap-2 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI Assessment Chal Raha Hai...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AI Claim Assessment Karein 🤖
                  </>
                )}
              </Button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetry}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/30 p-1 h-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* ─── RIGHT: Results Display ──────────────────────── */}
            <div className="p-5 sm:p-6">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AssessmentSkeleton />
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="space-y-5"
                  >
                    {/* ── Approval Probability with Ring ── */}
                    <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-6 text-center text-white">
                      <p className="text-xs text-white/60 uppercase tracking-wider font-medium mb-3">
                        Approval Probability
                      </p>
                      <div className="flex justify-center">
                        <ProbabilityRing probability={result.approvalProbability} />
                      </div>

                      {/* Progress Bar */}
                      <div className={`mt-4 h-3 rounded-full overflow-hidden ${getProbabilityBg(result.approvalProbability)}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.approvalProbability}%` }}
                          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${getProbabilityGradient(result.approvalProbability)}`}
                        />
                      </div>

                      {/* Risk Level Badge */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 flex items-center justify-center gap-2"
                      >
                        <Badge className={`text-sm font-semibold px-4 py-1 border ${getRiskColor(result.riskLevel)}`}>
                          {(() => {
                            const RiskIcon = getRiskIcon(result.riskLevel);
                            return <RiskIcon className="w-3.5 h-3.5 mr-1.5" />;
                          })()}
                          {result.riskLevel} Risk
                        </Badge>
                        <Badge className="text-sm font-semibold px-4 py-1 border bg-slate-700 text-slate-200 border-slate-600">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          {result.estimatedTimeline}
                        </Badge>
                      </motion.div>
                    </div>

                    {/* ── Key Factors ── */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4 text-teal-600" />
                        Key Factors / Mukhya Karak
                      </p>
                      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                        {result.keyFactors.map((factor, idx) => {
                          const ImpactIcon = getImpactIcon(factor.impact);
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + idx * 0.06 }}
                              className="rounded-lg border bg-card p-3 space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ImpactIcon className={`w-4 h-4 ${getImpactColor(factor.impact)}`} />
                                  <span className="text-sm font-medium text-foreground">{factor.factor}</span>
                                </div>
                                <Badge className={`text-xs font-semibold ${getImpactBadge(factor.impact)}`}>
                                  {factor.impact === 'positive' ? '+' : factor.impact === 'negative' ? '−' : ''}
                                  {factor.impact === 'positive' ? 'Positive' : factor.impact === 'negative' ? 'Negative' : 'Neutral'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{factor.description}</p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Potential Issues ── */}
                    {result.potentialIssues.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Potential Issues / Sambhavit Samsyaayein
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                          {result.potentialIssues.map((issue, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + idx * 0.06 }}
                              className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
                            >
                              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-foreground/80 leading-relaxed">{issue}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Required Documents ── */}
                    {result.requiredDocuments.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <ListChecks className="w-4 h-4 text-teal-600" />
                          Required Documents / Avashyak Dastaavej
                        </p>
                        <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                          {result.requiredDocuments.map((doc, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + idx * 0.04 }}
                              className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                              <span className="text-xs text-foreground/80 leading-relaxed">{doc}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Filing Steps ── */}
                    {result.filingSteps.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-teal-600" />
                          Filing Steps / Daaver Karne ke Kadam
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                          {result.filingSteps.map((step, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + idx * 0.05 }}
                              className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                            >
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {idx + 1}
                              </div>
                              <p className="text-xs text-foreground/80 leading-relaxed">{step}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Tips ── */}
                    {result.tips.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Tips / Salah
                        </p>
                        <div className="grid gap-2">
                          {result.tips.map((tip, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 + idx * 0.06 }}
                              className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800"
                            >
                              <CircleDot className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-foreground/80 leading-relaxed">{tip}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── AI Recommendation ── */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="rounded-xl bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-teal-500/5 border-2 border-teal-500/30 dark:border-teal-400/20 p-4 sm:p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">AI Recommendation</p>
                          <p className="text-[10px] text-muted-foreground">AI ka anushansan / sujhav</p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">{result.aiRecommendation}</p>
                    </motion.div>
                  </motion.div>
                ) : error && !result ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Assessment Fail Ho Gaya</p>
                      <p className="text-xs text-muted-foreground max-w-xs">{error}</p>
                    </div>
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      className="gap-2 rounded-xl"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Dobara Try Karein
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4 text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 flex items-center justify-center">
                      <FileCheck className="w-10 h-10 text-teal-400/60" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">
                        Apni details bhariye aur{' '}
                        <span className="gradient-text font-semibold">AI Claim Assessment</span>{' '}
                        karwayein
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        AI aapke claim ki probability, risk level, required documents aur filing steps batayega
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        Low Risk (75%+)
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        Medium (40-74%)
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        High Risk (&lt;40%)
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ─── Disclaimer ────────────────────────────────────── */}
          <div className="border-t border-border px-5 sm:px-6 py-3 bg-muted/30">
            <p className="text-[10px] text-muted-foreground flex items-start gap-2">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
              Yeh AI-powered assessment hai — educational purpose ke liye. Actual claim approval insurer ki underwriting policy aur investigation pe depend karta hai. Yeh koi legal advice nahi hai.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  );
}
