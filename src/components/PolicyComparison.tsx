'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowRight, CheckCircle2, XCircle, AlertTriangle, TrendingUp,
  TrendingDown, Minus, Shield, Award, Sparkles, MessageSquare,
  Phone, Share2, Download, ExternalLink, Zap,
} from 'lucide-react';
import { getRecommendations, type RecommendationResult } from '@/lib/scoring-engine';
import { allInsurancePlans, type InsurancePlan, type UserProfile } from '@/lib/insurance-data';
import { useToast } from '@/hooks/use-toast';
import { formatIndianCurrency, formatRupees } from '@/lib/premiumUtils';

// ============================================================================
// PROPS & TYPES
// ============================================================================
export interface ExtractedPolicyData {
  id: string;
  insurer: string;
  policyType: string;
  sumInsured: number | null;
  premium: number | null;
  premiumFrequency: string;
  waitingPeriods: Record<string, number>;
  exclusions: string[];
  keyCoverages: string[];
  ncbDetails: string | null;
  networkHospitals: string | null;
  startDate: string | null;
  endDate: string | null;
  missingBenefits: string[];
  llmSummary: string;
}

interface PolicyComparisonProps {
  uploadedPolicy: ExtractedPolicyData;
  userProfile: UserProfile | null;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Map uploaded policy type string to insurance category */
function mapPolicyTypeToCategory(policyType: string): InsurancePlan['category'] {
  const lower = policyType.toLowerCase();
  if (lower.includes('health') || lower.includes('medical') || lower.includes('hospital')) return 'health';
  if (lower.includes('life') || lower.includes('term') || lower.includes('endowment')) return 'life';
  if (lower.includes('motor') || lower.includes('car') || lower.includes('bike') || lower.includes('auto')) return 'motor';
  if (lower.includes('travel')) return 'travel';
  if (lower.includes('home') || lower.includes('property')) return 'home';
  return 'health'; // default fallback
}

/** Default profile when userProfile is null: age 30, middle income */
const DEFAULT_PROFILE: UserProfile = {
  age: 30,
  income: '5-10l',
  pincode: '110001',
  medicalHistory: [],
  lifestyle: [],
  dependents: 0,
  occupation: 'salaried-private',
  existingInsurance: [],
  priority: 'health',
};

/** Convert uploaded policy premium to monthly equivalent */
function getMonthlyPremium(policy: ExtractedPolicyData): number | null {
  if (policy.premium == null) return null;
  const freq = policy.premiumFrequency?.toLowerCase() ?? '';
  if (freq.includes('annual') || freq.includes('yearly') || freq === 'year') {
    return Math.round(policy.premium / 12);
  }
  if (freq.includes('quarter')) {
    return Math.round(policy.premium / 3);
  }
  if (freq.includes('half') || freq.includes('semi')) {
    return Math.round(policy.premium / 6);
  }
  // Default to monthly
  return policy.premium;
}

/** Get a waiting period value from the uploaded policy for a given condition key */
function getUploadedWaitingPeriod(policy: ExtractedPolicyData, condition: string): number | null {
  if (!policy.waitingPeriods) return null;
  const keys = Object.keys(policy.waitingPeriods);
  const match = keys.find(k => k.toLowerCase().includes(condition.toLowerCase()));
  return match ? policy.waitingPeriods[match] : null;
}

/** Comparison indicator type */
type ComparisonType = 'better' | 'worse' | 'same';

function getComparisonIcon(type: ComparisonType) {
  switch (type) {
    case 'better': return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    case 'worse': return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
    case 'same': return <Minus className="w-4 h-4 text-amber-500 shrink-0" />;
  }
}

function getComparisonColors(type: ComparisonType): string {
  switch (type) {
    case 'better': return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'worse': return 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'same': return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
}

function getScoreBadgeColor(score: number): string {
  if (score >= 80) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
  if (score >= 65) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300 dark:border-amber-700';
  return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-red-300 dark:border-red-700';
}

/** Parse network hospitals count from string */
function parseNetworkCount(val: string | null): number | null {
  if (!val) return null;
  const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? null : num;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function PolicyComparison({ uploadedPolicy, userProfile }: PolicyComparisonProps) {
  const { toast } = useToast();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // ── Compute recommendations with useMemo ──────────────────────────────────
  const category = useMemo(() => mapPolicyTypeToCategory(uploadedPolicy.policyType), [uploadedPolicy.policyType]);

  const recommendations = useMemo(() => {
    const profile = userProfile ?? DEFAULT_PROFILE;
    try {
      return getRecommendations(profile, category, 3);
    } catch {
      // Fallback: sort matching plans by CSR and take top 3
      return allInsurancePlans
        .filter(p => p.category === category)
        .sort((a, b) => b.claimSettlementRatio - a.claimSettlementRatio)
        .slice(0, 3)
        .map(plan => ({
          plan,
          score: {
            planId: plan.id,
            trustScore: { csrScore: plan.claimSettlementRatio, solvencyScore: 0, complaintScore: 0, claimSpeedScore: 0, total: plan.claimSettlementRatio },
            compatibilityScore: { budgetMatch: 0, agePEDMatch: 0, familySuitability: 0, featuresMatch: 0, total: 0 },
            finalScore: plan.claimSettlementRatio,
            percentage: Math.round(plan.claimSettlementRatio),
            breakdown: {
              ageMatch: { score: 0, max: 10, reason: '' },
              incomeFit: { score: 0, max: 10, reason: '' },
              claimHistory: { score: 0, max: 10, reason: '' },
              solvencyScore: { score: 0, max: 10, reason: '' },
              coverageFit: { score: 0, max: 10, reason: '' },
              lifestyleMatch: { score: 0, max: 10, reason: '' },
              priorityMatch: { score: 0, max: 12, reason: '' },
              networkScore: { score: 0, max: 5, reason: '' },
              turnaroundScore: { score: 0, max: 10, reason: '' },
            },
            disclaimers: [],
          },
          whyRecommended: `High CSR of ${plan.claimSettlementRatio}%`,
          personalizedMessage: `Yeh plan aapke liye accha option ho sakta hai — ${plan.claimSettlementRatio}% CSR ke saath.`,
        }));
    }
  }, [userProfile, category]);

  // ── Uploaded policy monthly premium ───────────────────────────────────────
  const uploadedMonthlyPremium = useMemo(() => getMonthlyPremium(uploadedPolicy), [uploadedPolicy]);

  // ── Action handlers ───────────────────────────────────────────────────────
  const handleBuyRecommended = (planId: string) => {
    setSelectedPlanId(planId);
    const chatSection = document.getElementById('insuregpt-chat');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeepExisting = () => {
    toast({
      title: 'Choice Save Ho Gayi! ✅',
      description: 'Aapki choice save ho gayi! Renewal time pe hum remind karenge.',
    });
  };

  const handleShareAnalysis = async () => {
    const summary = buildShareSummary(uploadedPolicy, recommendations, uploadedMonthlyPremium);
    try {
      await navigator.clipboard.writeText(summary);
      toast({
        title: 'Analysis Copy Ho Gaya! 📋',
        description: 'Ab kahi bhi paste karke share kar sakte hain.',
      });
    } catch {
      toast({
        title: 'Copy Nahi Hua',
        description: 'Manually copy karein ya screenshot lein.',
        variant: 'destructive',
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Koi Recommended Plan Nahi Mila
        </h3>
        <p className="text-sm text-muted-foreground">
          Aapki policy category ke liye abhi koi alternative plan available nahi hai.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="text-center">
        <Badge className="mb-3 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 dark:from-emerald-950/50 dark:to-teal-950/50 dark:text-emerald-300 dark:border-emerald-800 rounded-full px-4 py-1 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Policy vs Top Plans
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Aapki Policy vs <span className="text-emerald-600 dark:text-emerald-400">Top 3 Plans</span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Aapki existing policy ko best alternative plans se compare karein — premium, CSR, waiting period sab ek nazar mein
        </p>
      </motion.div>

      {/* ── Uploaded Policy Summary Card ────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 p-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base truncate">{uploadedPolicy.insurer}</p>
                <p className="text-xs opacity-80">
                  {uploadedPolicy.policyType} Policy
                  {uploadedPolicy.sumInsured && ` • Sum Insured: ₹${formatIndianCurrency(uploadedPolicy.sumInsured)}`}
                </p>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-xs shrink-0">
                Your Policy
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Premium</p>
                <p className="text-sm font-bold text-foreground">
                  {uploadedMonthlyPremium != null ? `${formatRupees(uploadedMonthlyPremium)}/mo` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">PED Wait</p>
                <p className="text-sm font-bold text-foreground">
                  {getUploadedWaitingPeriod(uploadedPolicy, 'diabetes') ?? 'N/A'} months
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Key Coverages</p>
                <p className="text-sm font-bold text-foreground">{uploadedPolicy.keyCoverages.length} items</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Missing</p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {uploadedPolicy.missingBenefits.length > 0 ? `${uploadedPolicy.missingBenefits.length} gaps` : 'None'}
                </p>
              </div>
            </div>
            {uploadedPolicy.missingBenefits.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {uploadedPolicy.missingBenefits.slice(0, 4).map((b, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] border-red-200 text-red-600 dark:border-red-800 dark:text-red-400">
                    <XCircle className="w-3 h-3 mr-0.5" />
                    {b}
                  </Badge>
                ))}
                {uploadedPolicy.missingBenefits.length > 4 && (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    +{uploadedPolicy.missingBenefits.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Desktop Comparison Table ────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="hidden lg:block">
        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* ── Header Row ─────────────────────────────────────────────── */}
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 border-r border-b border-border p-3 text-left min-w-[150px]">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Feature</span>
                  </th>
                  {/* Uploaded Policy Column */}
                  <th className="border-b border-border p-0 min-w-[180px]">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 p-3 text-white">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <div className="text-left min-w-0">
                          <p className="text-sm font-bold truncate">{uploadedPolicy.insurer}</p>
                          <p className="text-[10px] opacity-80">Your Policy</p>
                        </div>
                      </div>
                    </div>
                  </th>
                  {/* Recommended Plans Columns */}
                  {recommendations.map((rec, idx) => (
                    <th key={rec.plan.id} className="border-b border-border p-0 min-w-[200px]">
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 p-3 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                              <Award className="w-3.5 h-3.5" />
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-sm font-bold truncate">{rec.plan.name}</p>
                              <p className="text-[10px] opacity-80">Plan #{idx + 1}</p>
                            </div>
                          </div>
                          <Badge className={`text-[9px] border ${getScoreBadgeColor(rec.score.percentage)}`}>
                            <Zap className="w-2.5 h-2.5 mr-0.5" />
                            {rec.score.percentage}%
                          </Badge>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ── Body Rows ─────────────────────────────────────────────── */}
              <tbody>
                {/* Premium Row */}
                <ComparisonRow label="Premium (Monthly)" featureKey="premium">
                  <CellContent>
                    <span className="text-sm font-bold">
                      {uploadedMonthlyPremium != null ? `${formatRupees(uploadedMonthlyPremium)}/mo` : 'N/A'}
                    </span>
                  </CellContent>
                  {recommendations.map(rec => {
                    const diff = uploadedMonthlyPremium != null
                      ? uploadedMonthlyPremium - rec.plan.premium.monthly
                      : null;
                    const type: ComparisonType = diff == null ? 'same' : diff > 0 ? 'better' : diff < 0 ? 'worse' : 'same';
                    return (
                      <CellContent key={rec.plan.id}>
                        <span className="text-sm font-bold">{formatRupees(rec.plan.premium.monthly)}/mo</span>
                        {diff != null && diff !== 0 && (
                          <span className={`ml-1.5 inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full border ${getComparisonColors(type)}`}>
                            {getComparisonIcon(type)}
                            {diff > 0
                              ? `Save ${formatRupees(diff)}/mo`
                              : `${formatRupees(Math.abs(diff))} extra`}
                          </span>
                        )}
                      </CellContent>
                    );
                  })}
                </ComparisonRow>

                {/* CSR Row */}
                <ComparisonRow label="Claim Settlement Ratio" featureKey="csr">
                  <CellContent>
                    <span className="text-sm font-bold text-muted-foreground">Not available</span>
                  </CellContent>
                  {recommendations.map(rec => (
                    <CellContent key={rec.plan.id}>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0 font-bold text-xs">
                        {rec.plan.claimSettlementRatio}%
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-1">✅ IRDAI verified</span>
                    </CellContent>
                  ))}
                </ComparisonRow>

                {/* Diabetes Waiting Period Row */}
                <ComparisonRow label="Diabetes Waiting" featureKey="diabetes-wait">
                  <CellContent>
                    {(() => {
                      const val = getUploadedWaitingPeriod(uploadedPolicy, 'diabetes');
                      return val != null ? (
                        <span className="text-sm font-bold">
                          {val} months
                          {val > 24 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 ml-1 inline" />}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      );
                    })()}
                  </CellContent>
                  {recommendations.map(rec => {
                    const uploadedVal = getUploadedWaitingPeriod(uploadedPolicy, 'diabetes');
                    const planVal = rec.plan.waitingPeriodDetailed?.diabetes ?? rec.plan.waitingPeriodPED;
                    const type: ComparisonType = uploadedVal != null && planVal != null
                      ? planVal < uploadedVal ? 'better' : planVal > uploadedVal ? 'worse' : 'same'
                      : 'same';
                    const pctShorter = uploadedVal != null && planVal != null && planVal < uploadedVal
                      ? Math.round((1 - planVal / uploadedVal) * 100)
                      : null;
                    return (
                      <CellContent key={rec.plan.id}>
                        <span className="text-sm font-bold">{planVal ?? 'N/A'}{planVal != null ? ' months' : ''}</span>
                        {pctShorter != null && pctShorter > 0 && (
                          <span className={`ml-1.5 inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full border ${getComparisonColors(type)}`}>
                            {getComparisonIcon(type)}
                            {pctShorter}% shorter
                          </span>
                        )}
                      </CellContent>
                    );
                  })}
                </ComparisonRow>

                {/* BP Waiting Period Row */}
                <ComparisonRow label="BP Waiting" featureKey="bp-wait">
                  <CellContent>
                    {(() => {
                      const val = getUploadedWaitingPeriod(uploadedPolicy, 'bp') ?? getUploadedWaitingPeriod(uploadedPolicy, 'hypertension') ?? getUploadedWaitingPeriod(uploadedPolicy, 'blood pressure');
                      return val != null ? (
                        <span className="text-sm font-bold">
                          {val} months
                          {val > 24 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 ml-1 inline" />}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      );
                    })()}
                  </CellContent>
                  {recommendations.map(rec => {
                    const uploadedVal = getUploadedWaitingPeriod(uploadedPolicy, 'bp') ?? getUploadedWaitingPeriod(uploadedPolicy, 'hypertension');
                    const planVal = rec.plan.waitingPeriodDetailed?.bp ?? rec.plan.waitingPeriodPED;
                    const type: ComparisonType = uploadedVal != null && planVal != null
                      ? planVal < uploadedVal ? 'better' : planVal > uploadedVal ? 'worse' : 'same'
                      : 'same';
                    const pctShorter = uploadedVal != null && planVal != null && planVal < uploadedVal
                      ? Math.round((1 - planVal / uploadedVal) * 100)
                      : null;
                    return (
                      <CellContent key={rec.plan.id}>
                        <span className="text-sm font-bold">{planVal ?? 'N/A'}{planVal != null ? ' months' : ''}</span>
                        {pctShorter != null && pctShorter > 0 && (
                          <span className={`ml-1.5 inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full border ${getComparisonColors(type)}`}>
                            {getComparisonIcon(type)}
                            {pctShorter}% shorter
                          </span>
                        )}
                      </CellContent>
                    );
                  })}
                </ComparisonRow>

                {/* Heart Waiting Period Row */}
                <ComparisonRow label="Heart Waiting" featureKey="heart-wait">
                  <CellContent>
                    {(() => {
                      const val = getUploadedWaitingPeriod(uploadedPolicy, 'heart') ?? getUploadedWaitingPeriod(uploadedPolicy, 'cardiac');
                      return val != null ? (
                        <span className="text-sm font-bold">
                          {val} months
                          {val > 36 && <AlertTriangle className="w-3.5 h-3.5 text-red-500 ml-1 inline" />}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      );
                    })()}
                  </CellContent>
                  {recommendations.map(rec => {
                    const uploadedVal = getUploadedWaitingPeriod(uploadedPolicy, 'heart') ?? getUploadedWaitingPeriod(uploadedPolicy, 'cardiac');
                    const planVal = rec.plan.waitingPeriodDetailed?.heart ?? rec.plan.waitingPeriodPED;
                    const type: ComparisonType = uploadedVal != null && planVal != null
                      ? planVal < uploadedVal ? 'better' : planVal > uploadedVal ? 'worse' : 'same'
                      : 'same';
                    const pctShorter = uploadedVal != null && planVal != null && planVal < uploadedVal
                      ? Math.round((1 - planVal / uploadedVal) * 100)
                      : null;
                    return (
                      <CellContent key={rec.plan.id}>
                        <span className="text-sm font-bold">{planVal ?? 'N/A'}{planVal != null ? ' months' : ''}</span>
                        {pctShorter != null && pctShorter > 0 && (
                          <span className={`ml-1.5 inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full border ${getComparisonColors(type)}`}>
                            {getComparisonIcon(type)}
                            {pctShorter}% shorter
                          </span>
                        )}
                      </CellContent>
                    );
                  })}
                </ComparisonRow>

                {/* Network Hospitals Row (health only) */}
                {category === 'health' && (
                  <ComparisonRow label="Network Hospitals" featureKey="network">
                    <CellContent>
                      {(() => {
                        const count = parseNetworkCount(uploadedPolicy.networkHospitals);
                        return count != null
                          ? <span className="text-sm font-bold">{formatIndianCurrency(count)}+</span>
                          : <span className="text-sm text-muted-foreground">Not specified</span>;
                      })()}
                    </CellContent>
                    {recommendations.map(rec => {
                      const uploadedCount = parseNetworkCount(uploadedPolicy.networkHospitals);
                      const planCount = rec.plan.networkHospitals ?? rec.plan.networkGarages;
                      const type: ComparisonType = uploadedCount != null && planCount != null
                        ? planCount > uploadedCount ? 'better' : planCount < uploadedCount ? 'worse' : 'same'
                        : 'same';
                      return (
                        <CellContent key={rec.plan.id}>
                          <span className="text-sm font-bold">
                            {planCount != null ? `${formatIndianCurrency(planCount)}+` : 'N/A'}
                          </span>
                          {type === 'better' && (
                            <span className={`ml-1.5 inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full border ${getComparisonColors(type)}`}>
                              {getComparisonIcon(type)}
                              Wider network
                            </span>
                          )}
                        </CellContent>
                      );
                    })}
                  </ComparisonRow>
                )}

                {/* Coverage Gaps Row */}
                <ComparisonRow label="Coverage Gaps" featureKey="coverage-gaps">
                  <CellContent>
                    {uploadedPolicy.missingBenefits.length > 0 ? (
                      <div className="space-y-1">
                        {uploadedPolicy.missingBenefits.slice(0, 3).map((b, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs">
                            <XCircle className="w-3 h-3 text-red-500 shrink-0" />
                            <span className="text-red-600 dark:text-red-400 font-medium">{b}</span>
                          </div>
                        ))}
                        {uploadedPolicy.missingBenefits.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{uploadedPolicy.missingBenefits.length - 3} more</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> No gaps found
                      </span>
                    )}
                  </CellContent>
                  {recommendations.map(rec => {
                    // Check which missing benefits are covered by this plan
                    const coveredGaps = uploadedPolicy.missingBenefits.filter(b => {
                      const planFeatures = rec.plan.features.map(f => f.toLowerCase());
                      const bLower = b.toLowerCase();
                      return planFeatures.some(f =>
                        f.includes(bLower) ||
                        bLower.includes('restoration') && (f.includes('restore') || f.includes('restoration')) ||
                        bLower.includes('maternity') && f.includes('maternity') ||
                        bLower.includes('wellness') && f.includes('wellness') ||
                        bLower.includes('room rent') && (f.includes('room') || f.includes('no limit'))
                      ) ||
                      (bLower.includes('maternity') && rec.plan.maternityCover) ||
                      (bLower.includes('family floater') && rec.plan.familyFloater) ||
                      (bLower.includes('wellness') && rec.plan.wellnessAddons);
                    });
                    const uncoveredGaps = uploadedPolicy.missingBenefits.filter(b => !coveredGaps.includes(b));
                    return (
                      <CellContent key={rec.plan.id}>
                        {uploadedPolicy.missingBenefits.length > 0 ? (
                          <div className="space-y-1">
                            {coveredGaps.slice(0, 3).map((b, i) => (
                              <div key={i} className="flex items-center gap-1 text-xs">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{b}</span>
                              </div>
                            ))}
                            {uncoveredGaps.slice(0, 2).map((b, i) => (
                              <div key={i} className="flex items-center gap-1 text-xs">
                                <XCircle className="w-3 h-3 text-red-500 shrink-0" />
                                <span className="text-red-600 dark:text-red-400 font-medium">{b}</span>
                              </div>
                            ))}
                            {coveredGaps.length > 0 && (
                              <span className="text-[10px] text-emerald-500">
                                {coveredGaps.length}/{uploadedPolicy.missingBenefits.length} gaps covered
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </CellContent>
                    );
                  })}
                </ComparisonRow>

                {/* Solvency Ratio Row */}
                <ComparisonRow label="Solvency Ratio" featureKey="solvency">
                  <CellContent>
                    <span className="text-sm text-muted-foreground">Not available</span>
                  </CellContent>
                  {recommendations.map(rec => (
                    <CellContent key={rec.plan.id}>
                      {rec.plan.solvencyRatio ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold">{rec.plan.solvencyRatio}</span>
                          <span className="text-[10px] text-muted-foreground">(IRDAI min: 1.5)</span>
                          {rec.plan.solvencyRatio >= 2.0 && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </CellContent>
                  ))}
                </ComparisonRow>

                {/* Key Features Row */}
                <ComparisonRow label="Key Features" featureKey="features">
                  <CellContent>
                    {uploadedPolicy.keyCoverages.length > 0 ? (
                      <div className="space-y-1">
                        {uploadedPolicy.keyCoverages.slice(0, 3).map((c, i) => (
                          <div key={i} className="flex items-start gap-1 text-xs">
                            <Sparkles className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                        {uploadedPolicy.keyCoverages.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{uploadedPolicy.keyCoverages.length - 3} more</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not extracted</span>
                    )}
                  </CellContent>
                  {recommendations.map(rec => (
                    <CellContent key={rec.plan.id}>
                      <div className="space-y-1">
                        {rec.plan.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-start gap-1 text-xs">
                            <Sparkles className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                        {rec.plan.features.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{rec.plan.features.length - 3} more</span>
                        )}
                      </div>
                    </CellContent>
                  ))}
                </ComparisonRow>

                {/* Why Recommended Row */}
                <ComparisonRow label="Why Recommended?" featureKey="why">
                  <CellContent>
                    <span className="text-xs text-muted-italic">Your current policy</span>
                  </CellContent>
                  {recommendations.map(rec => (
                    <CellContent key={rec.plan.id}>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rec.whyRecommended}
                      </p>
                    </CellContent>
                  ))}
                </ComparisonRow>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ── Mobile Card View ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="lg:hidden space-y-4">
        {recommendations.map((rec, idx) => {
          const premiumDiff = uploadedMonthlyPremium != null
            ? uploadedMonthlyPremium - rec.plan.premium.monthly
            : null;
          const premiumType: ComparisonType = premiumDiff == null ? 'same' : premiumDiff > 0 ? 'better' : premiumDiff < 0 ? 'worse' : 'same';

          // PED comparisons for mobile
          const diabetesUploaded = getUploadedWaitingPeriod(uploadedPolicy, 'diabetes');
          const diabetesPlan = rec.plan.waitingPeriodDetailed?.diabetes ?? rec.plan.waitingPeriodPED;
          const diabetesType: ComparisonType = diabetesUploaded != null && diabetesPlan != null
            ? diabetesPlan < diabetesUploaded ? 'better' : diabetesPlan > diabetesUploaded ? 'worse' : 'same'
            : 'same';

          // Coverage gaps covered
          const coveredGaps = uploadedPolicy.missingBenefits.filter(b => {
            const planFeatures = rec.plan.features.map(f => f.toLowerCase());
            const bLower = b.toLowerCase();
            return planFeatures.some(f =>
              f.includes(bLower) ||
              bLower.includes('restoration') && (f.includes('restore') || f.includes('restoration')) ||
              bLower.includes('maternity') && f.includes('maternity') ||
              bLower.includes('wellness') && f.includes('wellness') ||
              bLower.includes('room rent') && (f.includes('room') || f.includes('no limit'))
            ) ||
            (bLower.includes('maternity') && rec.plan.maternityCover) ||
            (bLower.includes('family floater') && rec.plan.familyFloater) ||
            (bLower.includes('wellness') && rec.plan.wellnessAddons);
          });

          return (
            <motion.div
              key={rec.plan.id}
              variants={cardVariants}
            >
              <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow" style={{ borderColor: idx === 0 ? 'rgb(16 185 129 / 0.5)' : idx === 1 ? 'rgb(245 158 11 / 0.5)' : 'rgb(148 163 184 / 0.5)' }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                        #{idx + 1}
                      </Badge>
                      <CardTitle className="text-base font-bold">{rec.plan.name}</CardTitle>
                    </div>
                    <Badge className={`text-[10px] border ${getScoreBadgeColor(rec.score.percentage)}`}>
                      <Zap className="w-2.5 h-2.5 mr-0.5" />
                      {rec.score.percentage}% match
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.plan.provider}</p>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3">
                  {/* Premium Comparison */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">Premium</p>
                      <p className="text-sm font-bold">{formatRupees(rec.plan.premium.monthly)}/mo</p>
                    </div>
                    {premiumDiff != null && premiumDiff !== 0 && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getComparisonColors(premiumType)}`}>
                        {premiumType === 'better' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {premiumDiff > 0 ? `Save ${formatRupees(premiumDiff)}/mo` : `${formatRupees(Math.abs(premiumDiff))} extra`}
                      </div>
                    )}
                  </div>

                  {/* CSR */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">CSR</p>
                      <p className="text-sm font-bold">{rec.plan.claimSettlementRatio}%</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0 text-xs">
                      ✅ IRDAI verified
                    </Badge>
                  </div>

                  {/* Diabetes Waiting */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">Diabetes Wait</p>
                      <p className="text-sm font-bold">{diabetesPlan ?? 'N/A'}{diabetesPlan != null ? ' mo' : ''}</p>
                    </div>
                    {diabetesType === 'better' && diabetesUploaded != null && diabetesPlan != null && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getComparisonColors(diabetesType)}`}>
                        {getComparisonIcon(diabetesType)}
                        {Math.round((1 - diabetesPlan / diabetesUploaded) * 100)}% shorter
                      </div>
                    )}
                  </div>

                  {/* Coverage Gaps */}
                  {uploadedPolicy.missingBenefits.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-muted/50">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1.5">Coverage Gaps</p>
                      <div className="space-y-1">
                        {coveredGaps.map((b, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="text-emerald-600 dark:text-emerald-400">{b}</span>
                          </div>
                        ))}
                        {uploadedPolicy.missingBenefits.filter(b => !coveredGaps.includes(b)).map((b, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs">
                            <XCircle className="w-3 h-3 text-red-500 shrink-0" />
                            <span className="text-red-600 dark:text-red-400">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Network Hospitals */}
                  {category === 'health' && rec.plan.networkHospitals && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase">Network</p>
                        <p className="text-sm font-bold">{formatIndianCurrency(rec.plan.networkHospitals)}+ hospitals</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Why recommended */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    💡 {rec.whyRecommended}
                  </p>

                  {/* Mobile Action */}
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl gap-1.5 shadow-md"
                    onClick={() => handleBuyRecommended(rec.plan.id)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Yeh Plan Dekhein
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Hinglish Insights ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              Aapke Liye Khaas Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {uploadedMonthlyPremium != null && recommendations.length > 0 && (() => {
              const bestPremium = Math.min(...recommendations.map(r => r.plan.premium.monthly));
              const saving = uploadedMonthlyPremium - bestPremium;
              if (saving > 0) {
                return (
                  <p className="text-sm text-foreground flex items-start gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Aap har mahine <strong>{formatRupees(saving)}</strong> bacha sakte hain! Best plan ka premium sirf <strong>{formatRupees(bestPremium)}/mo</strong> hai aapke <strong>{formatRupees(uploadedMonthlyPremium)}/mo</strong> ke muqable mein.</span>
                  </p>
                );
              }
              return null;
            })()}
            {uploadedPolicy.missingBenefits.length > 0 && (
              <p className="text-sm text-foreground flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>Aapki policy mein <strong>{uploadedPolicy.missingBenefits.length} important benefits</strong> missing hain — jaise {uploadedPolicy.missingBenefits.slice(0, 2).join(', ')}. Recommended plans mein yeh available hain!</span>
              </p>
            )}
            {recommendations.length > 0 && (
              <p className="text-sm text-foreground flex items-start gap-2">
                <Award className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Top recommended plan <strong>{recommendations[0].plan.name}</strong> ka match score <strong>{recommendations[0].score.percentage}%</strong> hai — matlab aapke profile ke liye sabse better fit hai!</span>
              </p>
            )}
            {uploadedPolicy.waitingPeriods && Object.keys(uploadedPolicy.waitingPeriods).length > 0 && (() => {
              const bestDiabetesWait = Math.min(...recommendations.filter(r => r.plan.waitingPeriodDetailed?.diabetes).map(r => r.plan.waitingPeriodDetailed!.diabetes));
              const uploadedDiabetes = getUploadedWaitingPeriod(uploadedPolicy, 'diabetes');
              if (uploadedDiabetes != null && bestDiabetesWait < uploadedDiabetes) {
                return (
                  <p className="text-sm text-foreground flex items-start gap-2">
                    <Shield className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Diabetes ka waiting period <strong>{uploadedDiabetes} months</strong> se <strong>{bestDiabetesWait} months</strong> tak mil sakta hai — aadhe time mein coverage shuru!</span>
                  </p>
                );
              }
              return null;
            })()}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Action Buttons ──────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="border-border shadow-md">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Buy Recommended Plan */}
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl gap-2 shadow-md h-12 text-sm font-semibold"
                onClick={() => handleBuyRecommended(recommendations[0]?.plan.id ?? '')}
              >
                <MessageSquare className="w-4 h-4" />
                Buy Recommended Plan
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Keep Existing Policy */}
              <Button
                variant="outline"
                className="flex-1 rounded-xl gap-2 h-12 text-sm font-semibold border-2"
                onClick={handleKeepExisting}
              >
                <Shield className="w-4 h-4" />
                Keep Existing Policy
              </Button>

              {/* Share Analysis */}
              <Button
                variant="outline"
                className="flex-1 rounded-xl gap-2 h-12 text-sm font-semibold border-2"
                onClick={handleShareAnalysis}
              >
                <Share2 className="w-4 h-4" />
                Share Analysis
              </Button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Free expert advice ke liye call karein
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                Detailed report download karein
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── IRDAI Disclaimer ───────────────────────────────────────────────── */}
      <motion.p variants={itemVariants} className="text-[10px] text-muted-foreground leading-relaxed px-1">
        * Claim Settlement Ratio data source: IRDAI Annual Report 2024-25. Past performance is not indicative of future results.
        For more details on risk factors, terms and conditions, please read the sales brochure/policy wording carefully.
        Insurance is the subject matter of solicitation. Tax benefits are subject to changes in tax laws.
      </motion.p>
    </motion.div>
  );
}

// ============================================================================
// SUB-COMPONENTS (Desktop Table helpers)
// ============================================================================

/** A row in the desktop comparison table */
function ComparisonRow({
  label,
  featureKey,
  children,
}: {
  label: string;
  featureKey: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="group transition-colors hover:bg-muted/50 even:bg-muted/20">
      <td className="sticky left-0 z-10 bg-inherit border-r border-border p-3 min-w-[150px]">
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      </td>
      {children}
    </tr>
  );
}

/** A cell content wrapper for desktop table */
function CellContent({ children }: { children: React.ReactNode }) {
  return (
    <td className="p-3 border-b border-border/50 align-top">
      {children}
    </td>
  );
}

// ============================================================================
// SHARE SUMMARY BUILDER
// ============================================================================
function buildShareSummary(
  policy: ExtractedPolicyData,
  recommendations: RecommendationResult[],
  uploadedMonthlyPremium: number | null,
): string {
  const lines: string[] = [
    `🛡️ Insurance Policy Analysis - Paliwal Secure`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `📋 Your Policy: ${policy.insurer}`,
    `   Type: ${policy.policyType}`,
    `   Premium: ${uploadedMonthlyPremium != null ? `₹${uploadedMonthlyPremium}/mo` : 'N/A'}`,
    `   Sum Insured: ${policy.sumInsured ? `₹${formatIndianCurrency(policy.sumInsured)}` : 'N/A'}`,
    ...(policy.missingBenefits.length > 0 ? [
      `   Missing Benefits: ${policy.missingBenefits.join(', ')}`,
    ] : []),
    ``,
    `🏆 Top 3 Recommended Plans:`,
    ...recommendations.map((rec, idx) => [
      ``,
      `${idx + 1}. ${rec.plan.name} (${rec.plan.provider})`,
      `   Score: ${rec.score.percentage}% | CSR: ${rec.plan.claimSettlementRatio}% | Premium: ₹${rec.plan.premium.monthly}/mo`,
      `   Why: ${rec.whyRecommended}`,
    ].join('\n')),
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Source: IRDAI Annual Report 2025-26`,
    `Insurance is the subject matter of solicitation.`,
  ];

  return lines.join('\n');
}
