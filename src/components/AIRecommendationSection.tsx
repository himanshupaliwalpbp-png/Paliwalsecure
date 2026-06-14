'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Heart, Shield, Car, Clock, Sparkles, ChevronRight,
  AlertTriangle, CheckCircle2, Loader2, RotateCcw, Info,
  TrendingUp, Users, Wallet, Activity, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// TYPES
// ============================================================================

interface RecommendedRider {
  id: string;
  name: string;
  reason: string;
}

interface ScoredPlan {
  planId: string;
  planName: string;
  insurer: string;
  category: 'health' | 'term' | 'motor' | 'senior' | 'critical-illness';
  score: number;
  trustScore: number;
  compatibilityScore: number;
  recommendedRiders: RecommendedRider[];
  explanation: string;
  flags: string[];
}

interface ProfileStrengthResult {
  score: number;
  missing: string[];
  tips: string[];
}

interface RecommendationResponse {
  success: boolean;
  profileStrength: ProfileStrengthResult;
  persona: {
    age: number;
    income: string;
    familySize: number;
    dependents: number;
    purchaseIntent: string;
    profileCompleteness: number;
  };
  recommendations: Record<string, ScoredPlan[]>;
}

type CategoryKey = 'health' | 'term' | 'motor' | 'senior' | 'critical-illness';

// ============================================================================
// CATEGORY CONFIG
// ============================================================================

const CATEGORY_CONFIG: Record<CategoryKey, { label: string; icon: React.ElementType; gradient: string; color: string }> = {
  health: { label: 'Health', icon: Heart, gradient: 'from-rose-500 to-pink-600', color: 'text-rose-600 dark:text-rose-400' },
  term: { label: 'Term Life', icon: Shield, gradient: 'from-emerald-500 to-teal-600', color: 'text-emerald-600 dark:text-emerald-400' },
  motor: { label: 'Motor', icon: Car, gradient: 'from-amber-500 to-orange-600', color: 'text-amber-600 dark:text-amber-400' },
  senior: { label: 'Senior Citizen', icon: Users, gradient: 'from-violet-500 to-purple-600', color: 'text-violet-600 dark:text-violet-400' },
  'critical-illness': { label: 'Critical Illness', icon: Activity, gradient: 'from-red-500 to-rose-600', color: 'text-red-600 dark:text-red-400' },
};

const INCOME_OPTIONS = [
  { value: 'below-3l', label: '₹3 Lakh se neeche' },
  { value: '3-5l', label: '₹3 - 5 Lakh' },
  { value: '5-10l', label: '₹5 - 10 Lakh' },
  { value: '10-25l', label: '₹10 - 25 Lakh' },
  { value: '25-50l', label: '₹25 - 50 Lakh' },
  { value: 'above-50l', label: '₹50 Lakh se upar' },
];

const PURCHASE_INTENTS = [
  { value: 'budget', label: 'Paisa Bachao 💰', desc: 'Budget-friendly plans' },
  { value: 'premium', label: 'Best Quality 👑', desc: 'Top-rated insurers' },
  { value: 'family', label: 'Family First 👨‍👩‍👧‍👦', desc: 'Family floater focus' },
  { value: 'ped_specific', label: 'Medical Priority 🏥', desc: 'PED coverage focus' },
  { value: 'comprehensive', label: 'Sab Kuch 🛡️', desc: 'Complete coverage' },
] as const;

const MEDICAL_OPTIONS = [
  { value: 'diabetes', label: 'Diabetes / Sugar' },
  { value: 'bp', label: 'BP / Hypertension' },
  { value: 'heart-disease', label: 'Heart Disease' },
];

const LIFESTYLE_OPTIONS = [
  { value: 'smoker', label: 'Smoker / Tobacco' },
  { value: 'exercise', label: 'Exercise Regularly' },
  { value: 'sedentary', label: 'Sedentary Lifestyle' },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIRecommendationSection() {
  const { toast } = useToast();

  // Form state
  const [age, setAge] = useState(30);
  const [income, setIncome] = useState('5-10l');
  const [familySize, setFamilySize] = useState(2);
  const [dependents, setDependents] = useState(0);
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [purchaseIntent, setPurchaseIntent] = useState<string>('budget');
  const [vehicleAge, setVehicleAge] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('health');

  // Results state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleMedicalToggle = useCallback((value: string, checked: boolean) => {
    if (value === 'none') {
      setMedicalHistory([]);
      return;
    }
    setMedicalHistory((prev) =>
      checked ? [...prev.filter((v) => v !== 'none'), value] : prev.filter((v) => v !== value)
    );
  }, []);

  const handleLifestyleToggle = useCallback((value: string, checked: boolean) => {
    if (value === 'none') {
      setLifestyle([]);
      return;
    }
    setLifestyle((prev) =>
      checked ? [...prev.filter((v) => v !== 'none'), value] : prev.filter((v) => v !== value)
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        age,
        income,
        familySize,
        dependents,
        medicalHistory: medicalHistory.length > 0 ? medicalHistory : ['none'],
        lifestyle: lifestyle.length > 0 ? lifestyle : ['none'],
        purchaseIntent,
        vehicleAge: vehicleAge ? parseInt(vehicleAge) : undefined,
        existingInsurance: [],
      };

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Recommendations laane mein error aaya');
      }

      setResult(data as RecommendationResponse);
      toast({
        title: 'AI Recommendations Ready! 🎯',
        description: `Profile Strength: ${data.profileStrength.score}% — Top plans mil gaye!`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kuch gadbad ho gayi. Dobara try karein.';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [age, income, familySize, dependents, medicalHistory, lifestyle, purchaseIntent, vehicleAge, toast]);

  const handleReset = useCallback(() => {
    setAge(30);
    setIncome('5-10l');
    setFamilySize(2);
    setDependents(0);
    setMedicalHistory([]);
    setLifestyle([]);
    setPurchaseIntent('budget');
    setVehicleAge('');
    setResult(null);
    setError(null);
    setActiveCategory('health');
  }, []);

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getProfileStrengthColor = (score: number) => {
    if (score >= 70) return { ring: 'stroke-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', label: 'Strong 💪', bg: 'bg-emerald-50 dark:bg-emerald-950/30' };
    if (score >= 40) return { ring: 'stroke-amber-500', text: 'text-amber-600 dark:text-amber-400', label: 'Theek hai 🤔', bg: 'bg-amber-50 dark:bg-amber-950/30' };
    return { ring: 'stroke-red-500', text: 'text-red-600 dark:text-red-400', label: 'Kam hai ⚠️', bg: 'bg-red-50 dark:bg-red-950/30' };
  };

  const currentPlans = result?.recommendations[activeCategory] ?? [];

  // ============================================================================
  // RENDER: PERSONA FORM
  // ============================================================================

  const renderPersonaForm = () => (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A9A6] to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              Apna Profile Bataiye
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              AI aapke liye best plans dhundhega
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Age Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">Umar (Age)</Label>
            <Badge variant="outline" className="text-xs font-bold tabular-nums">
              {age} saal
            </Badge>
          </div>
          <Slider
            value={[age]}
            onValueChange={(v) => setAge(v[0])}
            min={18}
            max={80}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>18</span>
            <span>80</span>
          </div>
        </div>

        {/* Income Dropdown */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Salana Aay (Annual Income)</Label>
          <Select value={income} onValueChange={setIncome}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INCOME_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Family Size + Dependents */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Family Size</Label>
            <Select value={String(familySize)} onValueChange={(v) => setFamilySize(parseInt(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? 'member' : 'members'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Dependents</Label>
            <Select value={String(dependents)} onValueChange={(v) => setDependents(parseInt(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 0 ? '(none)' : n === 1 ? 'dependent' : 'dependents'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Medical History */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Medical History</Label>
          <div className="space-y-2">
            {MEDICAL_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`med-${opt.value}`}
                  checked={medicalHistory.includes(opt.value)}
                  onCheckedChange={(checked) => handleMedicalToggle(opt.value, !!checked)}
                />
                <label htmlFor={`med-${opt.value}`} className="text-sm text-foreground cursor-pointer">
                  {opt.label}
                </label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="med-none"
                checked={medicalHistory.length === 0}
                onCheckedChange={(checked) => handleMedicalToggle('none', !!checked)}
              />
              <label htmlFor="med-none" className="text-sm text-foreground cursor-pointer">
                Koi nahi (None)
              </label>
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Lifestyle</Label>
          <div className="space-y-2">
            {LIFESTYLE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`ls-${opt.value}`}
                  checked={lifestyle.includes(opt.value)}
                  onCheckedChange={(checked) => handleLifestyleToggle(opt.value, !!checked)}
                />
                <label htmlFor={`ls-${opt.value}`} className="text-sm text-foreground cursor-pointer">
                  {opt.label}
                </label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ls-none"
                checked={lifestyle.length === 0}
                onCheckedChange={(checked) => handleLifestyleToggle('none', !!checked)}
              />
              <label htmlFor="ls-none" className="text-sm text-foreground cursor-pointer">
                Koi nahi (None)
              </label>
            </div>
          </div>
        </div>

        {/* Purchase Intent */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Kya Chahiye? (Purchase Intent)</Label>
          <RadioGroup value={purchaseIntent} onValueChange={setPurchaseIntent} className="space-y-2">
            {PURCHASE_INTENTS.map((intent) => (
              <div key={intent.value} className="flex items-center space-x-2">
                <RadioGroupItem value={intent.value} id={`intent-${intent.value}`} />
                <label htmlFor={`intent-${intent.value}`} className="text-sm cursor-pointer">
                  <span className="font-medium text-foreground">{intent.label}</span>
                  <span className="text-muted-foreground ml-1">— {intent.desc}</span>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Vehicle Age */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Gaadi ki Umar <span className="text-muted-foreground">(Motor ke liye)</span>
          </Label>
          <Input
            type="number"
            min={0}
            max={20}
            placeholder="e.g. 3"
            value={vehicleAge}
            onChange={(e) => setVehicleAge(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#00A9A6] to-teal-600 hover:from-[#009695] hover:to-teal-700 text-white shadow-lg shadow-teal-500/25 gap-2 h-12 text-sm font-semibold rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI Soch raha hai...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get My AI Recommendations
              </>
            )}
          </Button>
          {result && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2 rounded-xl"
              size="icon"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // ============================================================================
  // RENDER: PROFILE STRENGTH GAUGE
  // ============================================================================

  const renderProfileStrength = () => {
    if (!result) return null;
    const { score, tips } = result.profileStrength;
    const config = getProfileStrengthColor(score);
    const circumference = 2 * Math.PI * 40;
    const dashOffset = circumference - (score / 100) * circumference;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`border-0 shadow-lg ${config.bg} backdrop-blur-xl`}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              {/* Circular Gauge */}
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48" cy="48" r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-muted-foreground/20"
                  />
                  <motion.circle
                    cx="48" cy="48" r="40"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={config.ring}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-xl font-bold tabular-nums ${config.text}`}>
                    {score}
                  </span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground">
                  Profile Strength: {config.label}
                </h4>
                {tips.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                    {tips.slice(0, 3).map((tip, i) => (
                      <p key={i} className="text-[11px] text-muted-foreground leading-snug flex gap-1">
                        <ChevronRight className="w-3 h-3 shrink-0 mt-0.5 text-[#00A9A6]" />
                        {tip}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ============================================================================
  // RENDER: PLAN CARD
  // ============================================================================

  const renderPlanCard = (plan: ScoredPlan, rank: number) => {
    const catConfig = CATEGORY_CONFIG[plan.category] ?? CATEGORY_CONFIG.health;
    const CatIcon = catConfig.icon;

    return (
      <motion.div
        key={plan.planId}
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          {/* Gradient top bar */}
          <div className={`h-1.5 bg-gradient-to-r ${catConfig.gradient}`} />

          <CardContent className="p-5 space-y-4">
            {/* Header: Rank + Name + Score */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${catConfig.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}>
                  #{rank}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground leading-tight line-clamp-2">
                    {plan.planName}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <CatIcon className="w-3 h-3" />
                    {plan.insurer}
                  </p>
                </div>
              </div>
              <Badge className={`shrink-0 text-xs font-bold ${getScoreColor(plan.score)} bg-opacity-10 border-0`}>
                {plan.score}/100
              </Badge>
            </div>

            {/* Trust + Compatibility Bars */}
            <div className="space-y-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Trust Score
                  </span>
                  <span className={`text-[11px] font-bold tabular-nums ${getScoreColor(plan.trustScore)}`}>
                    {plan.trustScore}%
                  </span>
                </div>
                <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${getScoreBg(plan.trustScore)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${plan.trustScore}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Compatibility
                  </span>
                  <span className={`text-[11px] font-bold tabular-nums ${getScoreColor(plan.compatibilityScore)}`}>
                    {plan.compatibilityScore}%
                  </span>
                </div>
                <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${getScoreBg(plan.compatibilityScore)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${plan.compatibilityScore}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Hinglish Explanation */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-[#00A9A6]" /> AI Explanation
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {plan.explanation}
              </p>
            </div>

            {/* Recommended Riders */}
            {plan.recommendedRiders.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#00A9A6]" /> Recommended Add-ons
                </p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {plan.recommendedRiders.slice(0, 3).map((rider) => (
                    <div
                      key={rider.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A9A6] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-foreground">{rider.name}</p>
                        <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                          {rider.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IRDAI Flags */}
            {plan.flags.length > 0 && (
              <div className="space-y-1.5">
                {plan.flags.map((flag, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-snug">
                      {flag}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ============================================================================
  // RENDER: RESULTS PANEL
  // ============================================================================

  const renderResultsPanel = () => {
    if (loading) {
      return (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="p-8 flex flex-col items-center justify-center gap-4 min-h-[400px]">
            <Loader2 className="w-12 h-12 text-[#00A9A6] animate-spin" />
            <div className="text-center space-y-2">
              <p className="font-bold text-foreground">AI Soch raha hai...</p>
              <p className="text-sm text-muted-foreground">
                51+ insurers compare ho rahe hain aapke profile ke hisaab se
              </p>
            </div>
            <div className="w-full max-w-xs space-y-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="p-8 flex flex-col items-center justify-center gap-4 min-h-[400px]">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <div className="text-center space-y-2">
              <p className="font-bold text-foreground">Error Aa Gaya!</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={handleSubmit} variant="outline" className="gap-2 mt-2">
              <RotateCcw className="w-4 h-4" /> Dobara Try Karein
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (!result) {
      return (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="p-8 flex flex-col items-center justify-center gap-4 min-h-[400px]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00A9A6]/20 to-teal-600/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-[#00A9A6]" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-bold text-foreground text-lg">AI Recommendations</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Pehle apna profile fill karein, phir AI aapke liye best insurance plans dhundhega
              </p>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Health
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Term
              </div>
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-500" /> Motor
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-violet-500" /> Senior
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-red-500" /> CI
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {/* Profile Strength */}
        {renderProfileStrength()}

        {/* Category Tabs */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="p-0">
            <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as CategoryKey)}>
              <div className="px-4 pt-4 pb-0">
                <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-muted/50">
                  {(Object.entries(CATEGORY_CONFIG) as [CategoryKey, typeof CATEGORY_CONFIG[CategoryKey]][]).map(([key, config]) => {
                    const Icon = config.icon;
                    const planCount = result.recommendations[key]?.length ?? 0;
                    return (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="py-2 px-1 text-[10px] sm:text-xs gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-lg"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{config.label}</span>
                        <span className="sm:hidden">{config.label.split(' ')[0]}</span>
                        {planCount > 0 && (
                          <Badge className="text-[8px] px-1 py-0 bg-[#00A9A6] text-white border-0 ml-0.5">
                            {planCount}
                          </Badge>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Tab Content */}
              {(Object.keys(CATEGORY_CONFIG) as CategoryKey[]).map((key) => (
                <TabsContent key={key} value={key} className="p-4 pt-3 mt-0">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {result.recommendations[key]?.length > 0 ? (
                      result.recommendations[key].map((plan, i) => renderPlanCard(plan, i + 1))
                    ) : (
                      <div className="py-8 text-center">
                        <Info className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Is category mein koi plan nahi mila. Dusri category try karein.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* IRDAI Disclaimer */}
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed max-w-md mx-auto">
            ⚠️ Yeh AI-powered recommendations hain — educational purpose ke liye. Actual terms aur conditions insurer ki policy document pe depend karti hain. IRDAI registered hai Paliwal Secure.
          </p>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: MAIN LAYOUT
  // ============================================================================

  return (
    <section id="ai-recommendations" className="py-16 sm:py-24 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 rounded-full px-4 py-1">
            <Brain className="w-3.5 h-3.5 mr-1" />
            AI Recommendations
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Apne Liye <span className="gradient-text">Best Plan</span> Dhundhiye
          </h2>
          <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
            AI engine 51+ insurers compare karta hai — aapki profile ke hisaab se top 3 plans with Hinglish explanation
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left: Persona Form (2 cols) */}
          <div className="lg:col-span-2">
            {renderPersonaForm()}
          </div>

          {/* Right: Results Panel (3 cols) */}
          <div className="lg:col-span-3">
            {renderResultsPanel()}
          </div>
        </div>
      </div>
    </section>
  );
}
