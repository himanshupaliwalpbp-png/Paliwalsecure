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
import { Users, Calculator, TrendingUp, AlertCircle, CheckCircle2, Info, IndianRupee, Sparkles, Loader2 } from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type FamilyMember = {
  id: string;
  role: 'self' | 'spouse' | 'child' | 'parent' | 'parent-in-law';
  age: number;
  hasPed: boolean;
  pedType?: 'diabetes' | 'bp' | 'heart' | 'asthma' | 'thyroid';
};

type CityTier = 'tier1' | 'tier2' | 'tier3';

const PED_LOADING: Record<string, number> = {
  diabetes: 20,
  bp: 15,
  heart: 75,
  asthma: 17.5,
  thyroid: 10,
};

const PED_LABELS: Record<string, string> = {
  diabetes: 'Diabetes',
  bp: 'High BP',
  heart: 'Heart Disease',
  asthma: 'Asthma',
  thyroid: 'Thyroid',
};

const ROLE_LABELS: Record<FamilyMember['role'], { label: string; emoji: string }> = {
  self: { label: 'Self (You)', emoji: '👤' },
  spouse: { label: 'Spouse', emoji: '👫' },
  child: { label: 'Child', emoji: '👶' },
  parent: { label: 'Parent', emoji: '👵' },
  'parent-in-law': { label: 'Parent-in-law', emoji: '🧓' },
};

const CITY_TIER_LOADING: Record<CityTier, number> = {
  tier1: 10,
  tier2: 0,
  tier3: -5,
};

const CITY_TIER_LABELS: Record<CityTier, string> = {
  tier1: 'Tier 1 (Metro)',
  tier2: 'Tier 2 (Jaipur, Kota)',
  tier3: 'Tier 3 (Small town)',
};

// Optimal sum insured recommendations based on family composition
function getRecommendedSumInsured(members: FamilyMember[], cityTier: CityTier): {
  recommended: number;
  reason: string;
  baseSI: number;
  topUpSI: number;
} {
  const hasSenior = members.some((m) => m.age >= 60);
  const hasPed = members.some((m) => m.hasPed);
  const memberCount = members.length;
  const isMetro = cityTier === 'tier1';

  let baseSI = 500000; // default 5L
  let reason = '';

  if (hasSenior && hasPed) {
    baseSI = 1000000; // 10L
    reason = 'Senior member + PED — higher base cover recommended for safety';
  } else if (hasSenior) {
    baseSI = 750000; // 7.5L
    reason = 'Senior member present — ₹7.5L base for adequate coverage';
  } else if (hasPed) {
    baseSI = 1000000;
    reason = 'PED member — ₹10L base to handle disease-related hospitalization';
  } else if (memberCount >= 4) {
    baseSI = 1000000;
    reason = 'Large family (4+ members) — ₹10L base for shared coverage';
  } else if (isMetro) {
    baseSI = 750000;
    reason = 'Metro city — higher medical costs, ₹7.5L recommended';
  } else {
    baseSI = 500000;
    reason = 'Standard family — ₹5L base sufficient for tier 2/3 city';
  }

  // Super top-up always 1 Crore (affordable + comprehensive)
  const topUpSI = 10000000;

  return { recommended: baseSI + topUpSI, reason, baseSI, topUpSI };
}

// ============================================================================
// CALCULATION
// ============================================================================

interface FamilyCalcResult {
  basePremiumMonthly: number;
  basePremiumAnnual: number;
  topUpPremiumMonthly: number;
  topUpPremiumAnnual: number;
  totalMonthly: number;
  totalAnnual: number;
  ageLoading: number;
  pedLoading: number;
  familySizeLoading: number;
  cityLoading: number;
  taxSaved: number;
  effectiveMonthly: number;
  recommendedBaseSI: number;
  recommendedTopUpSI: number;
  recommendationReason: string;
  perMemberCost: number;
  warningMessage: string;
}

function calculateFamilyPremium(members: FamilyMember[], cityTier: CityTier): FamilyCalcResult {
  const rec = getRecommendedSumInsured(members, cityTier);

  // Base premium for recommended SI
  const BASE_RATES: Record<number, number> = {
    500000: 550,
    750000: 700,
    1000000: 850,
    1500000: 1100,
  };
  const baseRate = BASE_RATES[rec.baseSI] || 850;
  let basePremiumAnnual = baseRate * 12;

  // Age loading — use oldest member age as floater is based on eldest
  const oldestAge = Math.max(...members.map((m) => m.age));
  const ageLoadingPercent = oldestAge <= 35 ? 0 : Math.floor((oldestAge - 35) / 5) * 5;
  const ageLoading = (basePremiumAnnual * ageLoadingPercent) / 100;

  // PED loading — apply if ANY member has PED (highest loading applies)
  const pedLoadings = members
    .filter((m) => m.hasPed && m.pedType)
    .map((m) => PED_LOADING[m.pedType!]);
  const maxPedLoading = pedLoadings.length > 0 ? Math.max(...pedLoadings) : 0;
  const pedLoading = (basePremiumAnnual * maxPedLoading) / 100;

  // Family size loading — each additional member adds 30-35%
  const familySizeLoadingPercent = (members.length - 1) * 32;
  const familySizeLoading = (basePremiumAnnual * familySizeLoadingPercent) / 100;

  // City tier loading
  const cityLoadingPercent = CITY_TIER_LOADING[cityTier];
  const cityLoading = (basePremiumAnnual * cityLoadingPercent) / 100;

  // Final base premium
  basePremiumAnnual = basePremiumAnnual + ageLoading + pedLoading + familySizeLoading + cityLoading;
  const basePremiumMonthly = basePremiumAnnual / 12;

  // Super top-up (₹1 Cr) — typically ₹2,500-4,000/year, deductible = base SI
  const topUpPremiumAnnual = 3000; // ~₹250/mo for ₹1Cr top-up
  const topUpPremiumMonthly = topUpPremiumAnnual / 12;

  const totalAnnual = basePremiumAnnual + topUpPremiumAnnual;
  const totalMonthly = totalAnnual / 12;

  // Tax savings (80D) — combined self + parents
  const hasSeniorMember = members.some((m) => m.role === 'parent' || m.role === 'parent-in-law');
  const hasSeniorParent = members.some((m) => (m.role === 'parent' || m.role === 'parent-in-law') && m.age >= 60);

  const selfDeduction = Math.min(basePremiumAnnual, oldestAge >= 60 ? 50000 : 25000);
  const parentsDeduction = hasSeniorMember
    ? Math.min(basePremiumAnnual * 0.4, hasSeniorParent ? 50000 : 25000)
    : 0;
  const totalDeduction = selfDeduction + parentsDeduction;
  const taxSaved = (totalDeduction * 20) / 100; // 20% bracket

  const effectiveMonthly = (totalAnnual - taxSaved) / 12;
  const perMemberCost = totalMonthly / members.length;

  // Warning
  let warningMessage = '';
  if (members.some((m) => m.age >= 65)) {
    warningMessage = '⚠️ Senior member (65+) in family — some insurers may apply co-payment (10-20%). Look for "No Co-Payment" plans.';
  } else if (pedLoadings.length > 0) {
    warningMessage = `⚠️ PED member in family — ${rec.baseSI >= 1000000 ? '₹10L+' : 'lower'} base SI recommended. Star Health, Care Health best for PED coverage.`;
  } else {
    warningMessage = '✅ Healthy family — standard rates apply. Buy early to lock in low premiums before any health issues.';
  }

  return {
    basePremiumMonthly,
    basePremiumAnnual,
    topUpPremiumMonthly,
    topUpPremiumAnnual,
    totalMonthly,
    totalAnnual,
    ageLoading,
    pedLoading,
    familySizeLoading,
    cityLoading,
    taxSaved,
    effectiveMonthly,
    recommendedBaseSI: rec.baseSI,
    recommendedTopUpSI: rec.topUpSI,
    recommendationReason: rec.reason,
    perMemberCost,
    warningMessage,
  };
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

// ============================================================================
// COMPONENT
// ============================================================================

export default function FamilyFloaterOptimizer() {
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', role: 'self', age: 35, hasPed: false },
    { id: '2', role: 'spouse', age: 32, hasPed: false },
    { id: '3', role: 'child', age: 8, hasPed: false },
  ]);
  const [cityTier, setCityTier] = useState<CityTier>('tier2');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () => calculateFamilyPremium(members, cityTier),
    [members, cityTier]
  );

  const addMember = (role: FamilyMember['role']) => {
    const defaultAge = role === 'child' ? 10 : role === 'parent' || role === 'parent-in-law' ? 60 : 35;
    setMembers([...members, {
      id: Date.now().toString(),
      role,
      age: defaultAge,
      hasPed: false,
    }]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  // ── AI-powered recommendation from InsureGPT ──────────────────────────
  const handleAIRecommendation = async () => {
    if (!result) return;
    setAiLoading(true);
    setAiAdvice(null);
    try {
      const familyDesc = members.map(m => {
        const pedInfo = m.hasPed ? `, PED: ${PED_LABELS[m.pedType || 'diabetes']}` : '';
        return `${ROLE_LABELS[m.role].label} (age ${m.age}${pedInfo})`;
      }).join(', ');
      const prompt = `I have a family of ${members.length} members: ${familyDesc}. City: ${cityTier}. My recommended base SI is ₹${result.recommendedBaseSI/100000}L with ₹${result.recommendedTopUpSI/100000}L super top-up. Monthly premium estimate: ₹${Math.round(result.totalPremiumMonthly)}. Give me the best 3 health insurance plans with real premiums, CSR, and hospital networks. Be specific with numbers.`;
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, language: 'en' }),
      });
      const data = await res.json();
      if (data.success && data.response) {
        setAiAdvice(data.response);
      } else {
        setAiAdvice('Unable to get AI recommendation right now. Please try again or chat with InsureGPT directly.');
      }
    } catch {
      setAiAdvice('Unable to connect to AI. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-lg shadow-emerald-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Family Floater Optimizer</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Optimal sum insured + premium for your entire family
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Family Members List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Family Members ({members.length})</Label>
          </div>

          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-xl bg-[#FAF7F2] dark:bg-[#1A1F27] p-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-white dark:bg-[#0E1116]">
                  {ROLE_LABELS[member.role].emoji} {ROLE_LABELS[member.role].label}
                </Badge>
                {members.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMember(member.id)}
                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#4A4F57] dark:text-[#A8B0C2]">Age</Label>
                  <Slider
                    value={[member.age]}
                    onValueChange={(v) => updateMember(member.id, { age: v[0] })}
                    min={member.role === 'child' ? 0 : 18}
                    max={member.role === 'child' ? 25 : 80}
                    step={1}
                  />
                  <div className="text-xs text-center font-medium">{member.age} years</div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-[#4A4F57] dark:text-[#A8B0C2]">Pre-Existing Disease</Label>
                  <Select
                    value={member.hasPed ? member.pedType || 'none' : 'none'}
                    onValueChange={(v) => updateMember(member.id, { hasPed: v !== 'none', pedType: v === 'none' ? undefined : v as FamilyMember['pedType'] })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Healthy)</SelectItem>
                      {Object.entries(PED_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          {/* Add member buttons */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => addMember('spouse')} disabled={members.some(m => m.role === 'spouse')}>
              + Spouse
            </Button>
            <Button size="sm" variant="outline" onClick={() => addMember('child')}>
              + Child
            </Button>
            <Button size="sm" variant="outline" onClick={() => addMember('parent')} disabled={members.some(m => m.role === 'parent')}>
              + Parent
            </Button>
            <Button size="sm" variant="outline" onClick={() => addMember('parent-in-law')} disabled={members.some(m => m.role === 'parent-in-law')}>
              + Parent-in-law
            </Button>
          </div>
        </div>

        <Separator />

        {/* City Tier */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">City Tier</Label>
          <Select value={cityTier} onValueChange={(v) => setCityTier(v as CityTier)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CITY_TIER_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calculate */}
        <Button onClick={() => setShowResult(true)} className="w-full bg-[#2D6A4F] hover:bg-[#235541] text-white" size="lg">
          <Calculator className="w-4 h-4 mr-2" />
          Optimize My Family Plan
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

              {/* Main Result */}
              <div className="rounded-xl bg-gradient-to-br from-[#E6F4EF] to-[#D5EDE3] dark:from-[rgba(45,106,79,0.18)] dark:to-[rgba(45,106,79,0.05)] p-5 border border-[rgba(45,106,79,0.25)]">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#2D6A4F] dark:text-[#6EE7B7]" />
                  <span className="text-sm font-semibold text-[#2D6A4F] dark:text-[#6EE7B7]">
                    Optimal Family Plan
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#0E1116] dark:text-[#FAF7F2]">
                      {formatCurrencyFull(Math.round(result.totalMonthly))}
                    </span>
                    <span className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">/month total</span>
                  </div>
                  <div className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">
                    = {formatCurrencyFull(Math.round(result.perMemberCost))}/member/month · Annual: {formatCurrencyFull(Math.round(result.totalAnnual))}
                  </div>
                  <div className="text-xs text-[#2D6A4F] dark:text-[#6EE7B7] font-medium">
                    💰 Tax saved (80D): {formatCurrencyFull(Math.round(result.taxSaved))}/yr · Effective: {formatCurrencyFull(Math.round(result.effectiveMonthly))}/mo
                  </div>
                </div>
              </div>

              {/* Recommended SI */}
              <div className="rounded-xl bg-[#FAF7F2] dark:bg-[#1A1F27] p-4">
                <h4 className="text-sm font-semibold mb-3 text-[#0E1116] dark:text-[#FAF7F2] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#B8482C]" />
                  Recommended Coverage Structure
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-[#0E1116] dark:text-[#FAF7F2]">
                        Base Cover: <span className="text-[#2D6A4F]">{formatCurrency(result.recommendedBaseSI)}</span>
                      </div>
                      <div className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mt-0.5">{result.recommendationReason}</div>
                    </div>
                    <Badge variant="outline" className="bg-white dark:bg-[#0E1116] text-xs">
                      {formatCurrencyFull(Math.round(result.basePremiumMonthly))}/mo
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-[#0E1116] dark:text-[#FAF7F2]">
                        Super Top-Up: <span className="text-[#B8860B]">{formatCurrency(result.recommendedTopUpSI)}</span>
                      </div>
                      <div className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mt-0.5">
                        Deductible = Base SI · Covers major illnesses, cancer, cardiac surgery
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white dark:bg-[#0E1116] text-xs">
                      {formatCurrencyFull(Math.round(result.topUpPremiumMonthly))}/mo
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Important</h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      {result.warningMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <a
                  href={`https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20have%20a%20family%20of%20${members.length}%20members.%20Used%20Family%20Floater%20Optimizer%20-%20recommended%20${formatCurrency(result.recommendedBaseSI)}%20base%20+%20${formatCurrency(result.recommendedTopUpSI)}%20top-up.%20Need%20help%20choosing%20plan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-[#2D6A4F] hover:bg-[#235541] text-white" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Get Family Plan Quote
                  </Button>
                </a>
                <a href="/compare/health" className="flex-1">
                  <Button variant="outline" className="w-full border-[#B8482C] text-[#B8482C] hover:bg-[#FBE8E1]" size="sm">
                    Compare Family Plans
                  </Button>
                </a>
              </div>

              <p className="text-[10px] text-center text-[#8B9099] dark:text-[#A8B0C2] mt-2">
                * Family floater premium based on eldest member age (IRDAI norm). Estimates from IRDAI Annual Report 2025-26.
              </p>

              {/* AI-Powered Recommendation */}
              <div className="mt-4 pt-4 border-t border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)]">
                <button
                  onClick={handleAIRecommendation}
                  disabled={aiLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Get AI Recommendation — Real Plans
                    </>
                  )}
                </button>
                
                {aiAdvice && (
                  <div className="mt-4 p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#0E1116] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] max-h-96 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(14,17,22,0.06)] dark:border-[rgba(250,247,242,0.08)]">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#2563EB] to-[#FFD700] flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-[#0E1116] dark:text-white">InsureGPT AI Recommendation</span>
                    </div>
                    <div className="text-sm text-[#4A4F57] dark:text-[#A8B0C2] leading-relaxed whitespace-pre-wrap">
                      {aiAdvice}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
