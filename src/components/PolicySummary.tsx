'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Shield, Building2, IndianRupee, Clock, AlertTriangle, CheckCircle2,
  XCircle, Heart, Car, Plane, Home as HomeIcon, Info, FileWarning,
  Calendar, Award, Hospital, Sparkles,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ExtractedPolicyData {
  id: string;
  insurer: string;
  policyType: string; // health | life | motor | travel | home
  sumInsured: number | null;
  premium: number | null;
  premiumFrequency: string; // monthly | yearly
  waitingPeriods: Record<string, number>; // e.g., { diabetes: 24, bp: 12, heart: 36 }
  exclusions: string[];
  keyCoverages: string[];
  ncbDetails: string | null;
  networkHospitals: string | null;
  startDate: string | null;
  endDate: string | null;
  missingBenefits: string[];
  llmSummary: string;
}

interface PolicySummaryProps {
  data: ExtractedPolicyData;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const POLICY_TYPE_CONFIG: Record<string, { color: string; bgClass: string; borderClass: string; icon: React.ReactNode }> = {
  health: {
    color: 'rose',
    bgClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    borderClass: 'border-rose-300 dark:border-rose-700',
    icon: <Heart className="h-4 w-4" />,
  },
  life: {
    color: 'emerald',
    bgClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    borderClass: 'border-emerald-300 dark:border-emerald-700',
    icon: <Shield className="h-4 w-4" />,
  },
  motor: {
    color: 'amber',
    bgClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    borderClass: 'border-amber-300 dark:border-amber-700',
    icon: <Car className="h-4 w-4" />,
  },
  travel: {
    color: 'violet',
    bgClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    borderClass: 'border-violet-300 dark:border-violet-700',
    icon: <Plane className="h-4 w-4" />,
  },
  home: {
    color: 'cyan',
    bgClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    borderClass: 'border-cyan-300 dark:border-cyan-700',
    icon: <HomeIcon className="h-4 w-4" />,
  },
};

const PED_LABELS: Record<string, string> = {
  diabetes: 'Diabetes / Sugar',
  bp: 'BP / Hypertension',
  heart: 'Heart Disease / Cardiac',
  cataract: 'Cataract / Aankh ka operation',
  knee: 'Knee Replacement',
  maternity: 'Maternity / Pregnancy',
  dental: 'Dental / Daant',
  hernia: 'Hernia',
  arthritis: 'Arthritis / Joints',
  obesity: 'Obesity / Weight Loss Surgery',
  ent: 'ENT / Kaan-Nak-Gala',
  kidney: 'Kidney / Renal',
  cancer: 'Cancer',
  mental: 'Mental Health / Psychiatry',
};

function formatCurrency(amount: number | null): string {
  if (amount === null) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getWaitingPeriodHinglish(condition: string, months: number): string {
  const label = PED_LABELS[condition] ?? condition;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let durationStr = '';
  if (years > 0 && remainingMonths > 0) {
    durationStr = `${years} saal ${remainingMonths} mahine`;
  } else if (years > 0) {
    durationStr = `${years} saal`;
  } else {
    durationStr = `${months} mahine`;
  }

  let severityNote = '';
  if (months > 36) {
    severityNote = ', jo bahut lamba hai! Aisa policy mein PED cover hone mein bahut der lagti hai.';
  } else if (months > 24) {
    severityNote = ', jo lamba hai. Aapko itne mahine wait karna padega.';
  } else if (months > 12) {
    severityNote = '. Thoda wait karna padega, par yeh normal range mein hai.';
  } else {
    severityNote = '. Yeh short waiting period hai, theek hai.';
  }

  return `Is policy mein ${label} ke liye ${durationStr} ka waiting period hai${severityNote}`;
}

// ─── Animation variants ─────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function PolicySummary({ data }: PolicySummaryProps) {
  const typeConfig = POLICY_TYPE_CONFIG[data.policyType] ?? POLICY_TYPE_CONFIG.health;
  const waitingPeriodEntries = Object.entries(data.waitingPeriods);
  const hasLongWaiting = waitingPeriodEntries.some(([, m]) => m > 24);

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto space-y-5 px-4 sm:px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ────────────────────────────────────────────────────────────────────
          1. Policy at a Glance
      ────────────────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-shadow hover:shadow-xl">
          {/* Gradient top accent bar */}
          <div
            className={`h-1.5 w-full ${
              data.policyType === 'health'
                ? 'bg-gradient-to-r from-rose-400 to-rose-600'
                : data.policyType === 'life'
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                  : data.policyType === 'motor'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                    : data.policyType === 'travel'
                      ? 'bg-gradient-to-r from-violet-400 to-violet-600'
                      : 'bg-gradient-to-r from-cyan-400 to-cyan-600'
            }`}
          />

          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeConfig.bgClass}`}>
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                    {data.insurer}
                  </CardTitle>
                  <CardDescription className="text-sm mt-0.5">Insurance Policy</CardDescription>
                </div>
              </div>

              <Badge className={`${typeConfig.bgClass} ${typeConfig.borderClass} border text-sm px-3 py-1 gap-1.5 font-semibold`}>
                {typeConfig.icon}
                {data.policyType.charAt(0).toUpperCase() + data.policyType.slice(1)} Insurance
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <Separator className="mb-4" />

            {/* Key metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Sum Insured */}
              <div className="flex flex-col gap-1 rounded-lg bg-muted/50 p-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <Shield className="h-3.5 w-3.5" />
                  Sum Insured
                </span>
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  {formatCurrency(data.sumInsured)}
                </span>
              </div>

              {/* Premium */}
              <div className="flex flex-col gap-1 rounded-lg bg-muted/50 p-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Premium
                </span>
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  {formatCurrency(data.premium)}
                </span>
                {data.premium && (
                  <span className="text-xs text-muted-foreground">
                    /{data.premiumFrequency === 'monthly' ? 'month' : 'year'}
                  </span>
                )}
              </div>

              {/* Policy Dates */}
              <div className="flex flex-col gap-1 rounded-lg bg-muted/50 p-3 col-span-2 sm:col-span-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <Calendar className="h-3.5 w-3.5" />
                  Policy Period
                </span>
                <span className="text-sm font-semibold">
                  {formatDate(data.startDate)} — {formatDate(data.endDate)}
                </span>
              </div>
            </div>

            {/* NCB Details */}
            {data.ncbDetails && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3">
                <Award className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">No Claim Bonus</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{data.ncbDetails}</p>
                </div>
              </div>
            )}

            {/* Network Hospitals */}
            {data.networkHospitals && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30 p-3">
                <Hospital className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-teal-800 dark:text-teal-300">Network Hospitals</p>
                  <p className="text-xs text-teal-700 dark:text-teal-400 mt-0.5">{data.networkHospitals}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ────────────────────────────────────────────────────────────────────
          2. AI Summary (Hinglish)
      ────────────────────────────────────────────────────────────────────── */}
      {data.llmSummary && (
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-shadow hover:shadow-xl">
            <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI Summary
              </CardTitle>
              <CardDescription>Hinglish mein policy ka summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 p-4">
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                  {data.llmSummary}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ────────────────────────────────────────────────────────────────────
          3. Key Coverages
      ────────────────────────────────────────────────────────────────────── */}
      {data.keyCoverages.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-shadow hover:shadow-xl">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Key Coverages
              </CardTitle>
              <CardDescription>Yeh cheezein policy cover karti hai</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.keyCoverages.map((coverage, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 p-2.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/90">{coverage}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ────────────────────────────────────────────────────────────────────
          4. Waiting Periods
      ────────────────────────────────────────────────────────────────────── */}
      {waitingPeriodEntries.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-shadow hover:shadow-xl">
            <div className={`h-1 w-full ${hasLongWaiting ? 'bg-gradient-to-r from-red-400 to-orange-500' : 'bg-gradient-to-r from-yellow-400 to-amber-500'}`} />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Clock className="h-4 w-4 text-amber-500" />
                Waiting Periods
              </CardTitle>
              <CardDescription>
                In conditions ke liye aapko wait karna padega before claim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {waitingPeriodEntries.map(([condition, months], idx) => {
                  const label = PED_LABELS[condition] ?? condition;
                  const isVeryLong = months > 36;
                  const isLong = months > 24;

                  return (
                    <motion.div
                      key={condition}
                      className={`rounded-lg border p-3 ${
                        isVeryLong
                          ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                          : isLong
                            ? 'border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
                            : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20'
                      }`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className={`h-4 w-4 shrink-0 ${
                            isVeryLong ? 'text-red-500' : isLong ? 'text-orange-500' : 'text-amber-500'
                          }`} />
                          <span className="text-sm font-semibold">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs font-bold ${
                              isVeryLong
                                ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700'
                                : isLong
                                  ? 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700'
                                  : 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700'
                            }`}
                          >
                            {months} months
                          </Badge>
                          {isVeryLong && (
                            <Badge className="bg-red-600 text-white border-red-700 text-xs font-bold">
                              Bahut lamba! ⛔
                            </Badge>
                          )}
                          {isLong && !isVeryLong && (
                            <Badge className="bg-red-500 text-white border-red-600 text-xs font-bold">
                              Lamba waiting period ⚠️
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {getWaitingPeriodHinglish(condition, months)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ────────────────────────────────────────────────────────────────────
          5. Exclusions
      ────────────────────────────────────────────────────────────────────── */}
      {data.exclusions.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-shadow hover:shadow-xl">
            <div className="h-1 w-full bg-gradient-to-r from-red-400 to-rose-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Exclusions
              </CardTitle>
              <CardDescription>Yeh cheezein policy cover nahi karti:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
                <ul className="space-y-2.5">
                  {data.exclusions.slice(0, 5).map((exclusion, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-2.5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx }}
                    >
                      <XCircle className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground/90">{exclusion}</span>
                    </motion.li>
                  ))}
                  {data.exclusions.length > 5 && (
                    <li className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                      <FileWarning className="h-3.5 w-3.5" />
                      Aur {data.exclusions.length - 5} exclusions policy document mein hain
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ────────────────────────────────────────────────────────────────────
          6. Missing Benefits
      ────────────────────────────────────────────────────────────────────── */}
      {data.missingBenefits.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-shadow hover:shadow-xl">
            <div className="h-1 w-full bg-gradient-to-r from-yellow-400 to-amber-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Info className="h-4 w-4 text-amber-500" />
                Missing Benefits
              </CardTitle>
              <CardDescription>
                Yeh benefits is policy mein nahi hain, jo zaroori ho sakte hain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {data.missingBenefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <Badge className="bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700 text-xs font-bold shrink-0">
                      ⚠️ Missing
                    </Badge>
                    <div>
                      <span className="text-sm font-medium">{benefit}</span>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Is policy mein {benefit.toLowerCase()} nahi hai, jo health insurance mein bahut zaroori hai.
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
