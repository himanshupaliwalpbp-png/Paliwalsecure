'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, TrendingDown, TrendingUp,
  CheckCircle2, XCircle, Info, ChevronRight, Sparkles,
  IndianRupee, AlertCircle, Lightbulb, ArrowRight,
  ThumbsUp, ThumbsDown, Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/lib/i18n';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface InsurerData {
  name: string;
  csr: number; // Claim Settlement Ratio %
  pedWaitingMonths: number;
  specialty: string;
}

const INSURER_LIST: InsurerData[] = [
  { name: 'HDFC ERGO', csr: 98.85, pedWaitingMonths: 24, specialty: 'Optima Restore, Wide Network' },
  { name: 'Star Health', csr: 88.34, pedWaitingMonths: 36, specialty: 'Diabetic Care Package' },
  { name: 'Care Health', csr: 93.13, pedWaitingMonths: 24, specialty: '21.7K Hospitals, Ayurveda Cover' },
  { name: 'Niva Bupa', csr: 95.20, pedWaitingMonths: 24, specialty: 'ReAssure 2.0, Wellness' },
  { name: 'Acko', csr: 99.91, pedWaitingMonths: 24, specialty: 'Digital-First, Quick Claims' },
];

const SUM_INSURED_OPTIONS = [
  { value: '200000', label: '₹2 Lakh' },
  { value: '500000', label: '₹5 Lakh' },
  { value: '1000000', label: '₹10 Lakh' },
  { value: '2500000', label: '₹25 Lakh' },
  { value: '5000000', label: '₹50 Lakh' },
];

// ============================================================================
// CALCULATION LOGIC
// ============================================================================

interface AdjustmentFactor {
  label: string;
  impact: number; // positive or negative percentage
  description: string;
  type: 'positive' | 'negative' | 'neutral';
}

interface SimulationResult {
  probability: number;
  level: 'High' | 'Medium' | 'Low';
  factors: AdjustmentFactor[];
  reasoning: string[];
}

function formatIndianCurrency(num: number): string {
  return num.toLocaleString('en-IN');
}

function parseIndianNumber(str: string): number {
  return Number(str.replace(/[^0-9]/g, '')) || 0;
}

function simulateClaim(
  age: number,
  sumInsured: number,
  claimAmount: number,
  pedPresent: boolean,
  waitingCompleted: boolean,
  insurerName: string
): SimulationResult {
  const insurer = INSURER_LIST.find((i) => i.name === insurerName);
  const baseProbability = insurer?.csr ?? 90;

  const factors: AdjustmentFactor[] = [];
  const reasoning: string[] = [];

  // Factor 1: PED + Waiting period
  if (pedPresent && !waitingCompleted) {
    const pedPenalty = -20;
    factors.push({
      label: 'PED within Waiting Period',
      impact: pedPenalty,
      description: `PED (Pre-existing Disease) ka waiting period (${insurer?.pedWaitingMonths ?? 24} months) complete nahi hua hai, toh related claims reject hone ka high risk hai.`,
      type: 'negative',
    });
    reasoning.push(
      `CSR of ${insurerName} is ${baseProbability}%, but you have a PED within waiting period, so probability reduces by ${Math.abs(pedPenalty)}%.`
    );
  } else if (pedPresent && waitingCompleted) {
    factors.push({
      label: 'PED — Waiting Period Complete',
      impact: -5,
      description: 'PED ke baad bhi thoda risk rehta hai — insurers sometimes additional scrutiny karte hain.',
      type: 'negative',
    });
    reasoning.push(
      `CSR of ${insurerName} is ${baseProbability}%, your PED waiting period is complete, so only a minor reduction of 5% applies.`
    );
  } else {
    factors.push({
      label: 'No PED',
      impact: 0,
      description: 'Koi pre-existing disease nahi — better claim approval chances.',
      type: 'neutral',
    });
    reasoning.push(
      `CSR of ${insurerName} is ${baseProbability}% and you have no PED, which is favorable for claim approval.`
    );
  }

  // Factor 2: Claim amount vs Sum insured
  const claimRatio = claimAmount / sumInsured;
  if (claimRatio > 0.8) {
    factors.push({
      label: 'High Claim-to-Sum-Insured Ratio',
      impact: -5,
      description: `Claim amount ₹${formatIndianCurrency(claimAmount)} is more than 80% of sum insured (₹${formatIndianCurrency(sumInsured)}). High-value claims pe zyada scrutiny hoti hai.`,
      type: 'negative',
    });
    reasoning.push(
      `Claim amount is ${Math.round(claimRatio * 100)}% of sum insured — high ratio means more scrutiny, reducing probability by 5%.`
    );
  } else if (claimRatio < 0.2 && claimAmount > 0) {
    factors.push({
      label: 'Low Claim Amount',
      impact: 2,
      description: `Chhote claims (₹${formatIndianCurrency(claimAmount)}) generally easily approve ho jaate hain — less scrutiny.`,
      type: 'positive',
    });
    reasoning.push(
      `Claim amount is small (${Math.round(claimRatio * 100)}% of sum insured), minor claims are more likely approved — slight boost of 2%.`
    );
  } else if (claimAmount > 0) {
    factors.push({
      label: 'Moderate Claim Amount',
      impact: 0,
      description: `Claim amount ₹${formatIndianCurrency(claimAmount)} is within normal range — standard scrutiny.`,
      type: 'neutral',
    });
  }

  // Factor 3: Age factor
  if (age > 60) {
    factors.push({
      label: 'Senior Citizen (Age > 60)',
      impact: -5,
      description: 'Senior citizens ke claims mein insurers zyada documentation maangte hain — medical history verify karte hain.',
      type: 'negative',
    });
    reasoning.push(
      `Age ${age} years (senior citizen) — insurers apply extra scrutiny, reducing probability by 5%.`
    );
  } else {
    factors.push({
      label: `Age ${age} — Normal Risk`,
      impact: 0,
      description: 'Aapki age ke liye standard underwriting rules apply honge.',
      type: 'neutral',
    });
  }

  // Calculate final probability
  const totalAdjustment = factors.reduce((sum, f) => sum + f.impact, 0);
  const finalProbability = Math.max(10, Math.min(99, baseProbability + totalAdjustment));

  // Determine level
  const level = finalProbability > 80 ? 'High' : finalProbability >= 60 ? 'Medium' : 'Low';

  return { probability: Math.round(finalProbability * 10) / 10, level, factors, reasoning };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ClaimSimulator() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  // Form state
  const [age, setAge] = useState(35);
  const [sumInsured, setSumInsured] = useState('500000');
  const [claimAmount, setClaimAmount] = useState('');
  const [pedPresent, setPedPresent] = useState(false);
  const [waitingCompleted, setWaitingCompleted] = useState(false);
  const [insurer, setInsurer] = useState('HDFC ERGO');
  const [showResult, setShowResult] = useState(false);

  // Derived state
  const claimAmountNum = parseIndianNumber(claimAmount);
  const sumInsuredNum = Number(sumInsured);

  // Calculate result
  const result = useMemo(
    () => simulateClaim(age, sumInsuredNum, claimAmountNum, pedPresent, waitingCompleted, insurer),
    [age, sumInsuredNum, claimAmountNum, pedPresent, waitingCompleted, insurer]
  );

  const handleSimulate = () => {
    if (claimAmountNum <= 0) return;
    setShowResult(true);
  };

  // Localized strings
  const t = {
    heading: isHindi ? 'क्लेम सिम्युलेटर' : isEnglish ? 'Claim Simulator' : 'Claim Simulator',
    subheading: isHindi ? 'अपना क्लेम सिमुलेट करें — पहले ही संभावना जानें' : isEnglish ? 'Simulate your claim — know the probability beforehand' : 'Apna Claim Simulate Karein — Probability jaanein pehle hi',
    aiPoweredBadge: isHindi ? 'AI-संचालित' : isEnglish ? 'AI-Powered' : 'AI-Powered',
    formSectionLabel: isHindi ? 'अपना विवरण भरें' : isEnglish ? 'Fill Your Details' : 'Apni Details Bhariye',
    ageLabel: isHindi ? 'उम्र (Age)' : isEnglish ? 'Age' : 'Umari (Age)',
    sumInsuredLabel: isHindi ? 'सम इंश्योर्ड (कवर राशि)' : isEnglish ? 'Sum Insured (Cover Amount)' : 'Sum Insured (Cover Amount)',
    claimAmountLabel: isHindi ? 'क्लेम राशि (₹)' : isEnglish ? 'Claim Amount (₹)' : 'Claim Amount (₹)',
    claimAmountWarning: isHindi ? 'क्लेम राशि सम इंश्योर्ड से ज़्यादा है — इंश्योरर इतना ही देगा' : isEnglish ? 'Claim amount exceeds sum insured — insurer will only pay up to sum insured' : 'Claim amount sum insured se zyada hai — insurer itna hi dega',
    pedLabel: isHindi ? 'PED मौजूद है? (पूर्व-मौजूद बीमारी)' : isEnglish ? 'PED Present? (Pre-existing Disease)' : 'PED Present? (Pre-existing Disease)',
    waitingLabel: isHindi ? 'वेटिंग पीरियड पूरा हुआ?' : isEnglish ? 'Waiting Period Complete?' : 'Waiting Period Complete?',
    insurerLabel: isHindi ? 'कौनसा इंश्योरर?' : isEnglish ? 'Which Insurer?' : 'Kaunsa Insurer? (Which Insurer?)',
    simulateBtn: isHindi ? 'क्लेम संभावना सिमुलेट करें' : isEnglish ? 'Simulate Claim Probability' : 'Claim Probability Simulate Karein',
    enterClaimFirst: isHindi ? 'पहले क्लेम राशि डालें तभी सिमुलेट हो पाएगा' : isEnglish ? 'Enter claim amount first to simulate' : 'Pehle claim amount daalein toh simulate ho payega',
    probabilityLabel: isHindi ? 'क्लेम संभावना' : isEnglish ? 'Claim Probability' : 'Claim Probability',
    reasoningLabel: isHindi ? 'तर्क / विचार' : isEnglish ? 'Reasoning' : 'Reasoning / Vichar',
    factorsLabel: isHindi ? 'संभावना को प्रभावित करने वाले कारक' : isEnglish ? 'Factors Affecting Probability' : 'Factors Affecting Probability',
    tipsLabel: isHindi ? 'बेहतर क्लेम अनुभव के लिए सुझाव' : isEnglish ? 'Tips for Better Claim Experience' : 'Tips for Better Claim Experience',
    placeholderText: isHindi ? 'अपना विवरण भरें और' : isEnglish ? 'Fill your details and' : 'Apni details bhariye aur',
    placeholderHighlight: isHindi ? 'क्लेम संभावना' : isEnglish ? 'Claim Probability' : 'Claim Probability',
    placeholderSubtext: isHindi ? 'इंश्योरर सीएसआर, पीईडी स्थिति, उम्र और क्लेम राशि के आधार पर सटीक अनुमान' : isEnglish ? 'Accurate estimate based on insurer CSR, PED status, age, and claim amount' : 'Insurer CSR, PED status, age aur claim amount ke basis pe accurate estimate',
    disclaimer: isHindi ? 'यह शैक्षिक उपकरण है। वास्तविक क्लेम अनुमोदन इंश्योरर की अंडरराइटिंग नीति पर निर्भर करता है। पिछला सीएसआर प्रदर्शन भविष्य की गारंटी नहीं है।' : isEnglish ? 'This is an educational tool. Actual claim approval depends on the insurer\'s underwriting policy. Past CSR performance is not a guarantee of future results.' : 'Yeh educational tool hai. Actual claim approval insurer ki underwriting policy pe depend karta hai. Past CSR performance future guarantee nahi hai.',
    high: isHindi ? 'उच्च' : isEnglish ? 'High' : 'High',
    medium: isHindi ? 'मध्यम' : isEnglish ? 'Medium' : 'Medium',
    low: isHindi ? 'निम्न' : isEnglish ? 'Low' : 'Low',
    probabilitySuffix: isHindi ? ' संभावना' : isEnglish ? ' Probability' : ' Probability',
  };

  // Tips for better claim experience
  const CLAIM_TIPS = [
    {
      icon: CheckCircle2,
      text: isHindi ? 'मेडिकल दस्तावेज़ पूरे रखें — रिपोर्ट, पर्चे, डिस्चार्ज सारांश सब होना चाहिए' : isEnglish ? 'Keep medical documents complete — reports, prescriptions, discharge summary all required' : 'Medical documents complete rakhein — reports, prescriptions, discharge summary sab hona chahiye',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      icon: ShieldCheck,
      text: isHindi ? 'पॉलिसी के वेटिंग पीरियड के बाद ही क्लेम करें — वेटिंग पीरियड में पीईडी क्लेम ज़्यादातर रिजेक्ट होते हैं' : isEnglish ? 'Claim only after the policy waiting period — PED claims within waiting period are mostly rejected' : 'Policy ke waiting period ke baad hi claim karein — PED claims within waiting period mostly reject hote hain',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      icon: Info,
      text: isHindi ? 'कैशलेस क्लेम के लिए नेटवर्क अस्पताल चुनें — अप्रूवल तेज़ होता है और पेमेंट सीधा होता है' : isEnglish ? 'Choose network hospital for cashless claim — approval is faster and payment is direct' : 'Cashless claim ke liye network hospital choose karein — approval fast hota hai aur payment direct hota hai',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/30',
    },
    {
      icon: AlertCircle,
      text: isHindi ? 'क्लेम इंटिमेशन 24-48 घंटे में करें — देरी से रिजेक्शन का जोखिम बढ़ता है' : isEnglish ? 'Submit claim intimation within 24-48 hours — late intimation increases rejection risk' : 'Claim intimation 24-48 hours mein karein — late intimation se rejection ka risk badhta hai',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      icon: Lightbulb,
      text: isHindi ? 'रूम रेंट लिमिट का पालन करें — ज़्यादा किराये वाला कमरा लेने पर आनुपातिक कटौती होगी' : isEnglish ? 'Follow room rent limit — choosing a higher rent room leads to proportionate deduction' : 'Room rent limit follow karein — agar zyada rent wala room liya toh proportionate deduction hoga',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
    },
    {
      icon: CheckCircle2,
      text: isHindi ? 'प्री-अप्रूवल (कैशलेस) लें — इंश्योरर पहले से अप्रूव करता है, रिजेक्शन का कम जोखिम' : isEnglish ? 'Get pre-approval (cashless) — insurer approves beforehand, lower rejection risk' : 'Pre-approval (cashless) lein — insurer pehle se approve karta hai, rejection ka kam risk',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
    },
  ];

  // Progress bar color
  const getProgressColor = (prob: number) => {
    if (prob > 80) return 'from-emerald-400 to-teal-500';
    if (prob >= 60) return 'from-amber-400 to-amber-500';
    return 'from-red-400 to-red-500';
  };

  const getProgressBg = (prob: number) => {
    if (prob > 80) return 'bg-emerald-100 dark:bg-emerald-950/30';
    if (prob >= 60) return 'bg-amber-100 dark:bg-amber-950/30';
    return 'bg-red-100 dark:bg-red-950/30';
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'Low':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
      default:
        return '';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'High': return ThumbsUp;
      case 'Medium': return Minus;
      case 'Low': return ThumbsDown;
      default: return Minus;
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'High': return t.high;
      case 'Medium': return t.medium;
      case 'Low': return t.low;
      default: return level;
    }
  };

  const isClaimValid = claimAmountNum > 0;

  return (
    <div className="w-full">
      <Card className="glass-card rounded-2xl border-0 shadow-xl overflow-hidden bg-card">
        {/* Gradient Header — Emerald/Teal */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-6 py-5">
          <div className="flex items-center gap-3 text-white">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">{t.heading}</h2>
              <p className="text-white/80 text-xs sm:text-sm">{t.subheading}</p>
            </div>
            <Badge className="ml-auto bg-white/20 text-white border-white/30 text-[10px] hidden sm:inline-flex">
              <Sparkles className="w-3 h-3 mr-1" />
              {t.aiPoweredBadge}
            </Badge>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Two-column layout on desktop */}
          <div className="grid lg:grid-cols-2 gap-0">
            {/* ─── LEFT: Form Inputs ────────────────────────────── */}
            <div className="p-5 sm:p-6 lg:border-r border-border space-y-5">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                {t.formSectionLabel}
              </p>

              {/* Age Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">{t.ageLabel}</Label>
                  <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
                    {age} years
                  </Badge>
                </div>
                <Slider
                  value={[age]}
                  onValueChange={(v) => { setAge(v[0]); setShowResult(false); }}
                  min={18}
                  max={80}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>18 yrs</span>
                  <span>80 yrs</span>
                </div>
              </div>

              {/* Sum Insured Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t.sumInsuredLabel}</Label>
                <Select value={sumInsured} onValueChange={(v) => { setSumInsured(v); setShowResult(false); }}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUM_INSURED_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Claim Amount Input */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t.claimAmountLabel}</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={claimAmount}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      setClaimAmount(raw ? formatIndianCurrency(Number(raw)) : '');
                      setShowResult(false);
                    }}
                    placeholder="e.g. 3,00,000"
                    className="pl-9 rounded-xl h-11"
                  />
                </div>
                {claimAmountNum > sumInsuredNum && claimAmountNum > 0 && (
                  <p className="text-[10px] text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {t.claimAmountWarning}
                  </p>
                )}
              </div>

              {/* PED Present Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    {t.pedLabel}
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${!pedPresent ? 'text-emerald-600' : 'text-muted-foreground'}`}>No</span>
                    <Switch
                      checked={pedPresent}
                      onCheckedChange={(v) => { setPedPresent(v); if (!v) setWaitingCompleted(false); setShowResult(false); }}
                    />
                    <span className={`text-xs font-medium ${pedPresent ? 'text-amber-600' : 'text-muted-foreground'}`}>Yes</span>
                  </div>
                </div>
              </div>

              {/* Waiting Period Completed — only if PED = Yes */}
              <AnimatePresence>
                {pedPresent && (
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
                        {t.waitingLabel}
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${!waitingCompleted ? 'text-red-600' : 'text-muted-foreground'}`}>No</span>
                        <Switch
                          checked={waitingCompleted}
                          onCheckedChange={(v) => { setWaitingCompleted(v); setShowResult(false); }}
                        />
                        <span className={`text-xs font-medium ${waitingCompleted ? 'text-emerald-600' : 'text-muted-foreground'}`}>Yes</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Insurer Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t.insurerLabel}</Label>
                <Select value={insurer} onValueChange={(v) => { setInsurer(v); setShowResult(false); }}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSURER_LIST.map((ins) => (
                      <SelectItem key={ins.name} value={ins.name}>
                        <span className="flex items-center gap-2">
                          {ins.name}
                          <span className="text-muted-foreground text-xs">(CSR {ins.csr}%)</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {insurer && (
                  <p className="text-[10px] text-muted-foreground">
                    {INSURER_LIST.find((i) => i.name === insurer)?.specialty}
                  </p>
                )}
              </div>

              {/* Simulate Button */}
              <Button
                onClick={handleSimulate}
                disabled={!isClaimValid}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white rounded-xl h-12 text-base font-semibold gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldCheck className="w-4 h-4" />
                {t.simulateBtn}
                <ArrowRight className="w-4 h-4" />
              </Button>
              {!isClaimValid && (
                <p className="text-[10px] text-muted-foreground text-center">
                  {t.enterClaimFirst}
                </p>
              )}
            </div>

            {/* ─── RIGHT: Results ───────────────────────────────── */}
            <div className="p-5 sm:p-6">
              <AnimatePresence mode="wait">
                {showResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' as const }}
                    className="space-y-5"
                  >
                    {/* Probability Header */}
                    <div className="rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-5 text-center text-foreground dark:text-white">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">{t.probabilityLabel}</p>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' as const, stiffness: 200 }}
                        className="text-5xl sm:text-6xl font-extrabold"
                        style={{
                          color:
                            result.probability > 80
                              ? '#34d399'
                              : result.probability >= 60
                                ? '#fbbf24'
                                : '#f87171',
                        }}
                      >
                        {result.probability}%
                      </motion.div>

                      {/* Progress Bar */}
                      <div className={`mt-4 h-3 rounded-full overflow-hidden ${getProgressBg(result.probability)}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.probability}%` }}
                          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' as const }}
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(result.probability)}`}
                        />
                      </div>

                      {/* Level Badge */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-3"
                      >
                        <Badge
                          className={`text-sm font-semibold px-4 py-1 border ${getLevelBadge(result.level)}`}
                        >
                          {(() => {
                            const LvlIcon = getLevelIcon(result.level);
                            return <LvlIcon className="w-3.5 h-3.5 mr-1.5" />;
                          })()}
                          {getLevelText(result.level)}{t.probabilitySuffix}
                        </Badge>
                      </motion.div>
                    </div>

                    {/* Reasoning Section */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Info className="w-4 h-4 text-teal-600" />
                        {t.reasoningLabel}
                      </p>
                      <div className="space-y-2">
                        {result.reasoning.map((reason, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3"
                          >
                            <ChevronRight className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                            <span>{reason}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Factor Breakdown */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        {t.factorsLabel}
                      </p>
                      <div className="space-y-2">
                        {result.factors.map((factor, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.08 }}
                            className="rounded-lg border bg-card p-3 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {factor.type === 'positive' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                                {factor.type === 'negative' && <TrendingDown className="w-4 h-4 text-red-500" />}
                                {factor.type === 'neutral' && <Minus className="w-4 h-4 text-slate-400" />}
                                <span className="text-sm font-medium text-foreground">{factor.label}</span>
                              </div>
                              <Badge
                                className={`text-xs font-semibold ${
                                  factor.impact > 0
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                    : factor.impact < 0
                                      ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
                                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                }`}
                              >
                                {factor.impact > 0 ? '+' : ''}{factor.impact}%
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{factor.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4 text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-10 h-10 text-emerald-400/60" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">
                        {t.placeholderText} <span className="gradient-text font-semibold">{t.placeholderHighlight}</span> {isHindi ? 'सिमुलेट करें' : isEnglish ? 'simulate' : 'simulate karein'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {t.placeholderSubtext}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        {t.high} (&gt;80%)
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        {t.medium} (60-80%)
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        {t.low} (&lt;60%)
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ─── Tips Section (Full Width) ───────────────────────── */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="border-t border-border"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    {t.tipsLabel}
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CLAIM_TIPS.map((tip, idx) => {
                      const TipIcon = tip.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + idx * 0.06 }}
                          className={`flex items-start gap-2.5 p-3 rounded-xl border border-border ${tip.bg}`}
                        >
                          <TipIcon className={`w-4 h-4 mt-0.5 shrink-0 ${tip.color}`} />
                          <p className="text-xs text-foreground/80 leading-relaxed">{tip.text}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Disclaimer ────────────────────────────────────── */}
          <div className="border-t border-border px-5 sm:px-6 py-3 bg-muted/30">
            <p className="text-[10px] text-muted-foreground flex items-start gap-2">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
              {t.disclaimer}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
