'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, TrendingDown, TrendingUp, ArrowRight, ShieldCheck, Heart,
  Car, AlertTriangle, IndianRupee, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';

// ── Types ────────────────────────────────────────────────────────────────────
type AgeGroup = '20-30' | '30-40' | '40-50' | '50-60';
type CityTier = 'metro' | 'non-metro';

interface SavingsData {
  withoutInsurance: number;
  withInsurance: number;
  savings: number;
  breakdown: {
    medical: { without: number; with: number };
    accident: { without: number; with: number };
    critical: { without: number; with: number };
  };
}

// ── Real Indian Insurance Cost Data ──────────────────────────────────────────
const costData: Record<AgeGroup, Record<CityTier, Record<number, SavingsData>>> = {
  '20-30': {
    metro: {
      1: { withoutInsurance: 85000, withInsurance: 18000, savings: 67000, breakdown: { medical: { without: 50000, with: 8000 }, accident: { without: 20000, with: 5000 }, critical: { without: 15000, with: 5000 } } },
      2: { withoutInsurance: 150000, withInsurance: 30000, savings: 120000, breakdown: { medical: { without: 90000, with: 15000 }, accident: { without: 35000, with: 8000 }, critical: { without: 25000, with: 7000 } } },
      3: { withoutInsurance: 220000, withInsurance: 42000, savings: 178000, breakdown: { medical: { without: 130000, with: 20000 }, accident: { without: 50000, with: 12000 }, critical: { without: 40000, with: 10000 } } },
      4: { withoutInsurance: 300000, withInsurance: 55000, savings: 245000, breakdown: { medical: { without: 180000, with: 28000 }, accident: { without: 70000, with: 15000 }, critical: { without: 50000, with: 12000 } } },
      5: { withoutInsurance: 380000, withInsurance: 68000, savings: 312000, breakdown: { medical: { without: 230000, with: 35000 }, accident: { without: 85000, with: 18000 }, critical: { without: 65000, with: 15000 } } },
      6: { withoutInsurance: 460000, withInsurance: 82000, savings: 378000, breakdown: { medical: { without: 280000, with: 42000 }, accident: { without: 100000, with: 22000 }, critical: { without: 80000, with: 18000 } } },
    },
    'non-metro': {
      1: { withoutInsurance: 65000, withInsurance: 14000, savings: 51000, breakdown: { medical: { without: 38000, with: 6000 }, accident: { without: 16000, with: 4000 }, critical: { without: 11000, with: 4000 } } },
      2: { withoutInsurance: 115000, withInsurance: 24000, savings: 91000, breakdown: { medical: { without: 70000, with: 12000 }, accident: { without: 27000, with: 6000 }, critical: { without: 18000, with: 6000 } } },
      3: { withoutInsurance: 170000, withInsurance: 34000, savings: 136000, breakdown: { medical: { without: 100000, with: 16000 }, accident: { without: 40000, with: 9000 }, critical: { without: 30000, with: 9000 } } },
      4: { withoutInsurance: 230000, withInsurance: 44000, savings: 186000, breakdown: { medical: { without: 140000, with: 22000 }, accident: { without: 55000, with: 12000 }, critical: { without: 35000, with: 10000 } } },
      5: { withoutInsurance: 290000, withInsurance: 54000, savings: 236000, breakdown: { medical: { without: 180000, with: 28000 }, accident: { without: 65000, with: 14000 }, critical: { without: 45000, with: 12000 } } },
      6: { withoutInsurance: 350000, withInsurance: 65000, savings: 285000, breakdown: { medical: { without: 215000, with: 33000 }, accident: { without: 80000, with: 17000 }, critical: { without: 55000, with: 15000 } } },
    },
  },
  '30-40': {
    metro: {
      1: { withoutInsurance: 120000, withInsurance: 24000, savings: 96000, breakdown: { medical: { without: 70000, with: 12000 }, accident: { without: 30000, with: 6000 }, critical: { without: 20000, with: 6000 } } },
      2: { withoutInsurance: 210000, withInsurance: 42000, savings: 168000, breakdown: { medical: { without: 125000, with: 20000 }, accident: { without: 50000, with: 12000 }, critical: { without: 35000, with: 10000 } } },
      3: { withoutInsurance: 310000, withInsurance: 60000, savings: 250000, breakdown: { medical: { without: 185000, with: 30000 }, accident: { without: 70000, with: 15000 }, critical: { without: 55000, with: 15000 } } },
      4: { withoutInsurance: 420000, withInsurance: 80000, savings: 340000, breakdown: { medical: { without: 250000, with: 40000 }, accident: { without: 100000, with: 20000 }, critical: { without: 70000, with: 20000 } } },
      5: { withoutInsurance: 530000, withInsurance: 100000, savings: 430000, breakdown: { medical: { without: 320000, with: 50000 }, accident: { without: 120000, with: 25000 }, critical: { without: 90000, with: 25000 } } },
      6: { withoutInsurance: 640000, withInsurance: 120000, savings: 520000, breakdown: { medical: { without: 390000, with: 60000 }, accident: { without: 140000, with: 30000 }, critical: { without: 110000, with: 30000 } } },
    },
    'non-metro': {
      1: { withoutInsurance: 95000, withInsurance: 19000, savings: 76000, breakdown: { medical: { without: 55000, with: 9000 }, accident: { without: 24000, with: 5000 }, critical: { without: 16000, with: 5000 } } },
      2: { withoutInsurance: 165000, withInsurance: 33000, savings: 132000, breakdown: { medical: { without: 98000, with: 16000 }, accident: { without: 40000, with: 9000 }, critical: { without: 27000, with: 8000 } } },
      3: { withoutInsurance: 245000, withInsurance: 48000, savings: 197000, breakdown: { medical: { without: 145000, with: 24000 }, accident: { without: 56000, with: 12000 }, critical: { without: 44000, with: 12000 } } },
      4: { withoutInsurance: 330000, withInsurance: 63000, savings: 267000, breakdown: { medical: { without: 200000, with: 32000 }, accident: { without: 75000, with: 16000 }, critical: { without: 55000, with: 15000 } } },
      5: { withoutInsurance: 420000, withInsurance: 80000, savings: 340000, breakdown: { medical: { without: 255000, with: 40000 }, accident: { without: 95000, with: 20000 }, critical: { without: 70000, with: 20000 } } },
      6: { withoutInsurance: 510000, withInsurance: 96000, savings: 414000, breakdown: { medical: { without: 310000, with: 48000 }, accident: { without: 115000, with: 24000 }, critical: { without: 85000, with: 24000 } } },
    },
  },
  '40-50': {
    metro: {
      1: { withoutInsurance: 180000, withInsurance: 36000, savings: 144000, breakdown: { medical: { without: 110000, with: 18000 }, accident: { without: 40000, with: 8000 }, critical: { without: 30000, with: 10000 } } },
      2: { withoutInsurance: 320000, withInsurance: 64000, savings: 256000, breakdown: { medical: { without: 200000, with: 32000 }, accident: { without: 70000, with: 15000 }, critical: { without: 50000, with: 17000 } } },
      3: { withoutInsurance: 470000, withInsurance: 92000, savings: 378000, breakdown: { medical: { without: 290000, with: 46000 }, accident: { without: 100000, with: 22000 }, critical: { without: 80000, with: 24000 } } },
      4: { withoutInsurance: 630000, withInsurance: 122000, savings: 508000, breakdown: { medical: { without: 390000, with: 61000 }, accident: { without: 130000, with: 28000 }, critical: { without: 110000, with: 33000 } } },
      5: { withoutInsurance: 800000, withInsurance: 154000, savings: 646000, breakdown: { medical: { without: 500000, with: 77000 }, accident: { without: 160000, with: 35000 }, critical: { without: 140000, with: 42000 } } },
      6: { withoutInsurance: 970000, withInsurance: 186000, savings: 784000, breakdown: { medical: { without: 610000, with: 93000 }, accident: { without: 190000, with: 41000 }, critical: { without: 170000, with: 52000 } } },
    },
    'non-metro': {
      1: { withoutInsurance: 140000, withInsurance: 28000, savings: 112000, breakdown: { medical: { without: 85000, with: 14000 }, accident: { without: 32000, with: 6000 }, critical: { without: 23000, with: 8000 } } },
      2: { withoutInsurance: 250000, withInsurance: 50000, savings: 200000, breakdown: { medical: { without: 155000, with: 25000 }, accident: { without: 55000, with: 12000 }, critical: { without: 40000, with: 13000 } } },
      3: { withoutInsurance: 370000, withInsurance: 72000, savings: 298000, breakdown: { medical: { without: 230000, with: 36000 }, accident: { without: 80000, with: 18000 }, critical: { without: 60000, with: 18000 } } },
      4: { withoutInsurance: 500000, withInsurance: 96000, savings: 404000, breakdown: { medical: { without: 310000, with: 48000 }, accident: { without: 105000, with: 22000 }, critical: { without: 85000, with: 26000 } } },
      5: { withoutInsurance: 630000, withInsurance: 120000, savings: 510000, breakdown: { medical: { without: 395000, with: 60000 }, accident: { without: 130000, with: 28000 }, critical: { without: 105000, with: 32000 } } },
      6: { withoutInsurance: 760000, withInsurance: 145000, savings: 615000, breakdown: { medical: { without: 480000, with: 72000 }, accident: { without: 155000, with: 34000 }, critical: { without: 125000, with: 39000 } } },
    },
  },
  '50-60': {
    metro: {
      1: { withoutInsurance: 280000, withInsurance: 55000, savings: 225000, breakdown: { medical: { without: 180000, with: 28000 }, accident: { without: 50000, with: 12000 }, critical: { without: 50000, with: 15000 } } },
      2: { withoutInsurance: 500000, withInsurance: 100000, savings: 400000, breakdown: { medical: { without: 320000, with: 50000 }, accident: { without: 90000, with: 22000 }, critical: { without: 90000, with: 28000 } } },
      3: { withoutInsurance: 740000, withInsurance: 146000, savings: 594000, breakdown: { medical: { without: 475000, with: 73000 }, accident: { without: 130000, with: 32000 }, critical: { without: 135000, with: 41000 } } },
      4: { withoutInsurance: 990000, withInsurance: 194000, savings: 796000, breakdown: { medical: { without: 640000, with: 97000 }, accident: { without: 170000, with: 42000 }, critical: { without: 180000, with: 55000 } } },
      5: { withoutInsurance: 1250000, withInsurance: 244000, savings: 1006000, breakdown: { medical: { without: 810000, with: 122000 }, accident: { without: 210000, with: 52000 }, critical: { without: 230000, with: 70000 } } },
      6: { withoutInsurance: 1520000, withInsurance: 296000, savings: 1224000, breakdown: { medical: { without: 990000, with: 148000 }, accident: { without: 250000, with: 62000 }, critical: { without: 280000, with: 86000 } } },
    },
    'non-metro': {
      1: { withoutInsurance: 220000, withInsurance: 44000, savings: 176000, breakdown: { medical: { without: 140000, with: 22000 }, accident: { without: 40000, with: 10000 }, critical: { without: 40000, with: 12000 } } },
      2: { withoutInsurance: 390000, withInsurance: 78000, savings: 312000, breakdown: { medical: { without: 250000, with: 39000 }, accident: { without: 70000, with: 17000 }, critical: { without: 70000, with: 22000 } } },
      3: { withoutInsurance: 580000, withInsurance: 114000, savings: 466000, breakdown: { medical: { without: 375000, with: 57000 }, accident: { without: 100000, with: 25000 }, critical: { without: 105000, with: 32000 } } },
      4: { withoutInsurance: 780000, withInsurance: 152000, savings: 628000, breakdown: { medical: { without: 505000, with: 76000 }, accident: { without: 135000, with: 33000 }, critical: { without: 140000, with: 43000 } } },
      5: { withoutInsurance: 990000, withInsurance: 192000, savings: 798000, breakdown: { medical: { without: 645000, with: 96000 }, accident: { without: 165000, with: 41000 }, critical: { without: 180000, with: 55000 } } },
      6: { withoutInsurance: 1200000, withInsurance: 232000, savings: 968000, breakdown: { medical: { without: 785000, with: 116000 }, accident: { without: 195000, with: 49000 }, critical: { without: 220000, with: 67000 } } },
    },
  },
};

// ── Animated Counter Hook ────────────────────────────────────────────────────
function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const prevTarget = useRef(0);

  useEffect(() => {
    const startVal = prevTarget.current;
    const startTime = performance.now();
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) { rafRef.current = requestAnimationFrame(animate); }
    }
    rafRef.current = requestAnimationFrame(animate);
    prevTarget.current = target;
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}

// ── Format Indian currency ───────────────────────────────────────────────────
function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

function formatINRFull(num: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

// ── Component ────────────────────────────────────────────────────────────────
export default function InsuranceSavingsCalculator() {
  const { language } = useLanguage();
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('30-40');
  const [cityTier, setCityTier] = useState<CityTier>('metro');
  const [familySize, setFamilySize] = useState(3);

  const data = costData[ageGroup][cityTier][familySize as keyof typeof costData[AgeGroup][CityTier]] || costData[ageGroup][cityTier][3];

  const animatedWithout = useAnimatedNumber(data.withoutInsurance);
  const animatedWith = useAnimatedNumber(data.withInsurance);
  const animatedSavings = useAnimatedNumber(data.savings);
  const savingsPercent = Math.round((data.savings / data.withoutInsurance) * 100);

  // Hinglish labels
  const labels = useMemo(() => ({
    title: language === 'hi' ? 'बीमा बचत कैलकुलेटर' : language === 'hinglish' ? 'Insurance Savings Calculator' : 'Insurance Savings Calculator',
    subtitle: language === 'hi' ? 'बीमे से कितनी बचत होगी, अभी पता लगाएं!' : language === 'hinglish' ? 'Insurance se kitni bachat hogi, abhi pata lagao!' : 'See how much you can save with insurance vs without!',
    ageGroup: language === 'hi' ? 'आयु वर्ग' : language === 'hinglish' ? 'Age Group' : 'Age Group',
    cityTier: language === 'hi' ? 'शहर प्रकार' : language === 'hinglish' ? 'City Type' : 'City Tier',
    familySize: language === 'hi' ? 'परिवार के सदस्य' : language === 'hinglish' ? 'Family Members' : 'Family Size',
    without: language === 'hi' ? 'बीमे के बिना' : language === 'hinglish' ? 'Without Insurance' : 'Without Insurance',
    withIns: language === 'hi' ? 'बीमे के साथ' : language === 'hinglish' ? 'With Insurance' : 'With Insurance',
    youSave: language === 'hi' ? 'आपकी बचत' : language === 'hinglish' ? 'Aapki Bachat' : 'You Save',
    medical: language === 'hi' ? 'चिकित्सा खर्च' : language === 'hinglish' ? 'Medical Costs' : 'Medical Costs',
    accident: language === 'hi' ? 'दुर्घटना खर्च' : language === 'hinglish' ? 'Accident Costs' : 'Accident Costs',
    critical: language === 'hi' ? 'गंभीर बीमारी' : language === 'hinglish' ? 'Critical Illness' : 'Critical Illness',
    cta: language === 'hi' ? 'अपनी व्यक्तिगत योजना प्राप्त करें →' : language === 'hinglish' ? 'Get Your Personalized Plan →' : 'Get Your Personalized Plan →',
    metro: language === 'hi' ? 'मेट्रो शहर' : language === 'hinglish' ? 'Metro City' : 'Metro City',
    nonMetro: language === 'hi' ? 'गैर-मेट्रो' : language === 'hinglish' ? 'Non-Metro' : 'Non-Metro',
    perYear: language === 'hi' ? 'प्रति वर्ष' : language === 'hinglish' ? 'per year' : 'per year',
    estimated: language === 'hi' ? 'अनुमानित वार्षिक लागत' : language === 'hinglish' ? 'Estimated Annual Cost' : 'Estimated Annual Cost',
  }), [language]);

  const ageGroups: AgeGroup[] = ['20-30', '30-40', '40-50', '50-60'];

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">{labels.title}</h3>
            <p className="text-sm text-white/80">{labels.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* ── Input Controls ────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Age Group */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">{labels.ageGroup}</label>
            <div className="grid grid-cols-2 gap-1.5">
              {ageGroups.map((ag) => (
                <button
                  key={ag}
                  onClick={() => setAgeGroup(ag)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    ageGroup === ag
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {ag}
                </button>
              ))}
            </div>
          </div>

          {/* City Tier */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">{labels.cityTier}</label>
            <div className="grid grid-cols-2 gap-1.5">
              {([['metro', labels.metro], ['non-metro', labels.nonMetro]] as const).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setCityTier(val)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityTier === val
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Family Size */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              {labels.familySize}: <span className="text-cyan-600 dark:text-cyan-400">{familySize}</span>
            </label>
            <input
              type="range"
              min={1}
              max={6}
              value={familySize}
              onChange={(e) => setFamilySize(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <span key={n} className={familySize === n ? 'text-cyan-600 dark:text-cyan-400 font-bold' : ''}>{n}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Comparison Cards ──────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Without Insurance */}
          <motion.div
            layout
            className="relative p-5 rounded-xl border-2 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-bold text-red-700 dark:text-red-300">{labels.without}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-700 dark:text-red-300">
              {formatINR(animatedWithout)}
            </div>
            <p className="text-[10px] text-red-500/70 mt-1">{labels.estimated} {labels.perYear}</p>
          </motion.div>

          {/* With Insurance */}
          <motion.div
            layout
            className="relative p-5 rounded-xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{labels.withIns}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">
              {formatINR(animatedWith)}
            </div>
            <p className="text-[10px] text-emerald-500/70 mt-1">{labels.estimated} {labels.perYear}</p>
          </motion.div>
        </div>

        {/* ── Savings Highlight ─────────────────────────────────────────── */}
        <motion.div
          layout
          className="relative p-5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold text-white/90">{labels.youSave}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold mb-1">
              {formatINRFull(animatedSavings)}
            </div>
            <Badge className="bg-white/20 text-white border-white/30 rounded-full">
              {savingsPercent}% {language === 'hi' ? 'बचत' : language === 'hinglish' ? 'Bachat' : 'savings'}
            </Badge>
          </div>
        </motion.div>

        {/* ── Breakdown ─────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {[
            { icon: Heart, label: labels.medical, without: data.breakdown.medical.without, with: data.breakdown.medical.with, color: 'red' },
            { icon: Car, label: labels.accident, without: data.breakdown.accident.without, with: data.breakdown.accident.with, color: 'amber' },
            { icon: AlertTriangle, label: labels.critical, without: data.breakdown.critical.without, with: data.breakdown.critical.with, color: 'purple' },
          ].map((item) => {
            const itemSavings = item.without - item.with;
            return (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                  item.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  <item.icon className={`w-4 h-4 ${
                    item.color === 'red' ? 'text-red-600 dark:text-red-400' :
                    item.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                    'text-purple-600 dark:text-purple-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-foreground">{item.label}</div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="text-red-500 line-through">{formatINR(item.without)}</span>
                    <span>→</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatINR(item.with)}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatINR(itemSavings)}
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    {language === 'hi' ? 'बचत' : 'saved'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA Button ────────────────────────────────────────────────── */}
        <Button
          onClick={() => window.open('https://wa.me/919257877312?text=Hi! I want a personalized insurance plan based on the savings calculator.', '_blank')}
          className="w-full h-12 text-base font-bold rounded-xl gap-2 cta-glow"
        >
          {labels.cta}
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          {language === 'hi'
            ? '* अनुमानित आंकड़े। वास्तविक लागत भिन्न हो सकती है।'
            : language === 'hinglish'
            ? '* Estimated figures. Actual costs may vary.'
            : '* Estimated figures based on Indian healthcare & auto repair data. Actual costs may vary.'}
        </p>
      </div>
    </div>
  );
}
