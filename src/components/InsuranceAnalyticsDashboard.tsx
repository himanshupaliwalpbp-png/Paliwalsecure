'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bell,
  ArrowRight,
  Zap,
  Activity,
  Heart,
  Car,
  Users,
  Globe,
  FileText,
  ExternalLink,
  Info,
  Database,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface CoverageComparison {
  sumInsured: number;
  label: string;
  avgPremiumMonthly: number;
  csr: number;
  avgClaimAmount: number;
  outOfPocketRisk: string;
  hospitalNetworkCover: string;
  roomRentLimit: string;
  maternityCover: boolean;
  pedWaitingPeriod: number;
  hinglishVerdict: string;
}

interface MacroGrowthData {
  year: number;
  healthGrowthPercent: number;
  nonLifeGrowthPercent: number;
  lifeGrowthPercent: number;
  overallGrowthPercent: number;
  healthPremiumCrore: number;
  nonLifePremiumCrore: number;
  totalPremiumCrore: number;
  projectionTo2030: number;
}

interface PremiumDriftEntry {
  category: string;
  year: number;
  avgPremiumMonthly: number;
  driftPercent: number;
  driver: string;
  alertLevel: 'normal' | 'warning' | 'critical';
  hinglishImpact: string;
}

interface ConsumerProtectionFeature {
  feature: string;
  description: string;
  maxClaimAmount: string;
  process: string;
  hinglishGuide: string;
}

interface PremiumAlert {
  id: string;
  category: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  effectiveDate: string;
  impactPercent: number;
  severity: 'info' | 'warning' | 'critical';
  actionText: string;
}

interface RenewalReminder {
  stage: number;
  daysBefore: number;
  titleHi: string;
  messageHi: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SKELETON COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-muted/50 p-4 ${className}`}
    >
      <div className="h-4 w-2/3 rounded bg-muted mb-3" />
      <div className="h-3 w-full rounded bg-muted mb-2" />
      <div className="h-3 w-4/5 rounded bg-muted mb-2" />
      <div className="h-3 w-3/5 rounded bg-muted" />
    </div>
  );
}

function SkeletonBar() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-12 rounded bg-muted animate-pulse" />
      <div className="flex-1 h-6 rounded-full bg-muted animate-pulse" />
      <div className="h-3 w-14 rounded bg-muted animate-pulse" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function formatRupeesShort(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(0)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

function getCoverageColor(sumInsured: number): {
  border: string;
  bg: string;
  text: string;
  badge: string;
  gradient: string;
  barBg: string;
} {
  if (sumInsured <= 500000)
    return {
      border: 'border-amber-300 dark:border-amber-700',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-300',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
      gradient: 'from-amber-500 to-orange-500',
      barBg: 'from-amber-400 to-orange-400',
    };
  if (sumInsured <= 1000000)
    return {
      border: 'border-emerald-300 dark:border-emerald-700',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
      gradient: 'from-emerald-500 to-teal-500',
      barBg: 'from-emerald-400 to-teal-400',
    };
  return {
    border: 'border-teal-300 dark:border-teal-700',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    text: 'text-teal-700 dark:text-teal-300',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
    gradient: 'from-teal-500 to-cyan-500',
    barBg: 'from-teal-400 to-cyan-400',
  };
}

function getDriftColor(level: 'normal' | 'warning' | 'critical'): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  switch (level) {
    case 'critical':
      return {
        bg: 'bg-red-50 dark:bg-red-950/30',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-800',
        icon: 'text-red-500',
      };
    case 'warning':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        icon: 'text-amber-500',
      };
    default:
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: 'text-emerald-500',
      };
  }
}

function getSeverityConfig(severity: 'info' | 'warning' | 'critical'): {
  bg: string;
  border: string;
  text: string;
  icon: React.ReactNode;
  badgeClass: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-200 dark:border-red-800/50',
        text: 'text-red-700 dark:text-red-300',
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        badgeClass:
          'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800',
      };
    case 'warning':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        border: 'border-amber-200 dark:border-amber-800/50',
        text: 'text-amber-700 dark:text-amber-300',
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        badgeClass:
          'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-200 dark:border-amber-800',
      };
    default:
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800/50',
        text: 'text-blue-700 dark:text-blue-300',
        icon: <Info className="h-5 w-5 text-blue-500" />,
        badgeClass:
          'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-200 dark:border-blue-800',
      };
  }
}

function getUrgencyConfig(level: 'low' | 'medium' | 'high'): {
  bg: string;
  border: string;
  icon: React.ReactNode;
  color: string;
} {
  switch (level) {
    case 'high':
      return {
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-300 dark:border-red-800/50',
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        color: 'text-red-700 dark:text-red-300',
      };
    case 'medium':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        border: 'border-amber-300 dark:border-amber-800/50',
        icon: <Clock className="h-4 w-4 text-amber-500" />,
        color: 'text-amber-700 dark:text-amber-300',
      };
    default:
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        border: 'border-emerald-300 dark:border-emerald-800/50',
        icon: <Bell className="h-4 w-4 text-emerald-500" />,
        color: 'text-emerald-700 dark:text-emerald-300',
      };
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'motor-tp':
      return <Car className="h-4 w-4" />;
    case 'health':
      return <Heart className="h-4 w-4" />;
    case 'ev':
      return <Zap className="h-4 w-4" />;
    case 'life':
      return <Users className="h-4 w-4" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'motor-tp':
      return 'Motor TP';
    case 'health':
      return 'Health';
    case 'ev':
      return 'EV';
    case 'life-term':
      return 'Term Life';
    case 'motor-od':
      return 'Motor OD';
    case 'life':
      return 'Life';
    default:
      return category;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function InsuranceAnalyticsDashboard() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [coverageData, setCoverageData] = useState<CoverageComparison[]>([]);
  const [macroData, setMacroData] = useState<MacroGrowthData[]>([]);
  const [driftData, setDriftData] = useState<PremiumDriftEntry[]>([]);
  const [consumerData, setConsumerData] = useState<ConsumerProtectionFeature[]>(
    []
  );
  const [alertData, setAlertData] = useState<PremiumAlert[]>([]);
  const [reminderData, setReminderData] = useState<RenewalReminder[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Data Fetching ────────────────────────────────────────────────────────
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        coverageRes,
        macroRes,
        driftRes,
        consumerRes,
        alertsRes,
      ] = await Promise.all([
        fetch('/api/data-pipeline?dataset=coverage-comparison'),
        fetch('/api/data-pipeline?dataset=macro-growth'),
        fetch('/api/data-pipeline?dataset=premium-drift'),
        fetch('/api/data-pipeline?dataset=consumer-protection'),
        fetch('/api/data-pipeline?dataset=premium-alerts'),
      ]);

      if (!coverageRes.ok || !macroRes.ok || !driftRes.ok || !consumerRes.ok || !alertsRes.ok) {
        throw new Error('Failed to fetch some datasets');
      }

      const [coverageJson, macroJson, driftJson, consumerJson, alertsJson] =
        await Promise.all([
          coverageRes.json(),
          macroRes.json(),
          driftRes.json(),
          consumerRes.json(),
          alertsRes.json(),
        ]);

      setCoverageData(coverageJson?.data ?? []);
      setMacroData(macroJson?.data ?? []);
      setDriftData(driftJson?.data ?? []);
      setConsumerData(consumerJson?.data ?? []);
      setAlertData(alertsJson?.data?.alerts ?? []);
      setReminderData(alertsJson?.data?.renewalReminders ?? []);
    } catch (err) {
      console.error('[AnalyticsDashboard] Fetch error:', err);
      setError('डेटा लोड करने में समस्या हुई। कृपया रीफ्रेश करें।');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ── Group drift data by category ─────────────────────────────────────────
  const driftByCategory = driftData.reduce(
    (acc, entry) => {
      const cat = entry.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(entry);
      return acc;
    },
    {} as Record<string, PremiumDriftEntry[]>
  );

  // ── Get latest entry per category for drift cards ────────────────────────
  const latestDriftByCategory = Object.entries(driftByCategory).map(
    ([category, entries]) => {
      const sorted = [...entries].sort((a, b) => b.year - a.year);
      return { category, latest: sorted[0], all: entries };
    }
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <section id="analytics-dashboard" className="py-8 sm:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <Badge
            className="mb-3 sm:mb-4 bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-200 dark:border-teal-800"
          >
            <Database className="h-3.5 w-3.5 mr-1.5" />
            IRDAI 2025-26 डेटा
          </Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            डेटा रिश्ता विश्लेषण & बाजार इंटेलिजेंस
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
            IRDAI 2025-26 डेटा — कवरेज तुलना, प्रीमियम ड्रिफ्ट, ग्रोथ एनालिटिक्स और उपभोक्ता सुरक्षा
          </p>
        </motion.div>

        {/* ── Error State ──────────────────────────────────────────────────── */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 text-center"
          >
            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllData}
              className="mt-2"
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            1. COVERAGE COMPARISON — ₹5L vs ₹10L vs ₹25L
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                कवरेज तुलना — ₹5L vs ₹10L vs ₹25L
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                कौन सा कवरेज आपके लिए सही है? Hinglish verdict के साथ
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} className="h-64" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            >
              {coverageData.map((item, idx) => {
                const colors = getCoverageColor(item.sumInsured);
                const isBestValue = item.sumInsured === 1000000;
                return (
                  <motion.div key={item.label} variants={staggerItem}>
                    <Card
                      className={`relative overflow-hidden border-2 ${colors.border} transition-shadow hover:shadow-lg`}
                    >
                      {/* Gradient top accent */}
                      <div
                        className={`h-1.5 bg-gradient-to-r ${colors.gradient}`}
                      />
                      <CardHeader className="pb-2 pt-3 px-3 sm:px-4">
                        <div className="flex items-center justify-between">
                          <CardTitle
                            className={`text-lg sm:text-xl font-bold ${colors.text}`}
                          >
                            {item.label}
                          </CardTitle>
                          {isBestValue && (
                            <Badge className="bg-emerald-500 text-white border-0 text-[10px] sm:text-xs animate-pulse">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Best Value
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="px-3 sm:px-4 pb-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            Monthly Premium
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-foreground">
                            ₹{item.avgPremiumMonthly.toLocaleString('en-IN')}/mo
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            CSR
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] sm:text-xs ${
                              item.csr >= 95
                                ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300'
                                : item.csr >= 90
                                  ? 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300'
                                  : 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300'
                            }`}
                          >
                            {item.csr}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            Out-of-Pocket Risk
                          </span>
                          <span
                            className={`text-[10px] sm:text-xs font-medium ${
                              item.sumInsured >= 2500000
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : item.sumInsured >= 1000000
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {item.outOfPocketRisk.split('—')[0].trim()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            Room Rent
                          </span>
                          <span className="text-[10px] sm:text-xs text-foreground">
                            {item.roomRentLimit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            PED Wait
                          </span>
                          <span className="text-[10px] sm:text-xs font-medium text-foreground">
                            {item.pedWaitingPeriod} months
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            Maternity
                          </span>
                          {item.maternityCover ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <span className="text-[10px] sm:text-xs text-red-500">
                              ✕
                            </span>
                          )}
                        </div>
                        <div
                          className={`mt-2 p-2 rounded-lg ${colors.bg} border ${colors.border}`}
                        >
                          <p
                            className={`text-[10px] sm:text-xs ${colors.text} leading-relaxed`}
                          >
                            💡 {item.hinglishVerdict}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            2. MACRO ANALYTICS DASHBOARD — Growth Slowdown & Market Shift
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                ग्रोथ स्लोडाउन & बाजार शिफ्ट
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Health growth 20.25% → 8.98% — 55.7% गिरावट!
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} className="h-24" />
                ))}
              </div>
              <SkeletonCard className="h-48" />
            </div>
          ) : (
            <motion.div variants={staggerContainer} className="space-y-4">
              {/* ── Key Metrics Cards ────────────────────────────────────── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <motion.div variants={staggerItem}>
                  <Card className="border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/10">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <TrendingDown className="h-5 w-5 text-red-500 mx-auto mb-1" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Health Growth Drop
                      </p>
                      <p className="text-base sm:text-xl font-bold text-red-600 dark:text-red-400">
                        55.7%
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        20.25% → 8.98%
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card className="border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/10">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <TrendingUp className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        CAGR to 2030
                      </p>
                      <p className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        6.9%
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Projected recovery
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card className="border-teal-200 dark:border-teal-800/50 bg-teal-50/50 dark:bg-teal-950/10">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Users className="h-5 w-5 text-teal-500 mx-auto mb-1" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Senior Growth FY25
                      </p>
                      <p className="text-base sm:text-xl font-bold text-teal-600 dark:text-teal-400">
                        60%
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Fastest segment
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/10">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Globe className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Penetration
                      </p>
                      <p className="text-base sm:text-xl font-bold text-amber-600 dark:text-amber-400">
                        3.7%
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        vs Global 4.3%
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* ── Health Growth Bar Chart (CSS-based) ────────────────── */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader className="pb-2 pt-3 px-3 sm:px-4">
                    <CardTitle className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      Health Insurance Growth Trend (YoY%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 pb-4">
                    <div className="space-y-2">
                      {macroData
                        .sort((a, b) => a.year - b.year)
                        .map((entry) => {
                          const barWidth = (entry.healthGrowthPercent / 25) * 100;
                          const isDecline =
                            entry.healthGrowthPercent < 12;
                          return (
                            <motion.div
                              key={entry.year}
                              className="flex items-center gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            >
                              <span className="text-[10px] sm:text-xs w-10 sm:w-12 text-right text-muted-foreground font-medium">
                                {entry.year}
                              </span>
                              <div className="flex-1 h-5 sm:h-6 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full bg-gradient-to-r ${
                                    isDecline
                                      ? 'from-red-400 to-orange-400'
                                      : 'from-emerald-500 to-teal-500'
                                  }`}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${barWidth}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.7, delay: 0.2 }}
                                />
                              </div>
                              <span
                                className={`text-[10px] sm:text-xs font-bold w-12 sm:w-14 text-right ${
                                  isDecline
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-emerald-600 dark:text-emerald-400'
                                }`}
                              >
                                {entry.healthGrowthPercent}%
                              </span>
                            </motion.div>
                          );
                        })}
                    </div>

                    {/* CAGR projection line */}
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/40">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs font-medium text-foreground">
                            2030 CAGR Projection: 6.9%
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Recovery expected — health premium ₹1.17L Cr (2025)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ── Penetration vs Global ─────────────────────────────────── */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5">
                          India Insurance Penetration vs Global Average
                        </p>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-[10px] sm:text-xs text-foreground font-medium">
                                India
                              </span>
                              <span className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400">
                                3.7%
                              </span>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                                initial={{ width: 0 }}
                                whileInView={{ width: '37%' }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-[10px] sm:text-xs text-foreground font-medium">
                                Global Average
                              </span>
                              <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                4.3%
                              </span>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                                initial={{ width: 0 }}
                                whileInView={{ width: '43%' }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                          💡 India mein penetration sirf 3.7% — global 4.3% se 14% peeche!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            3. PREMIUM DRIFT DASHBOARD — Real-time Premium Trend Tracker
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                प्रीमियम ड्रिफ्ट ट्रैकर
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                रियल-टाइम प्रीमियम ट्रेंड — Motor TP 2026 mein 25% hike!
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} className="h-40" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            >
              {/* Critical Alert Banner for Motor TP 2026 */}
              <AnimatePresence>
                {driftData.some(
                  (d) =>
                    d.category === 'motor-tp' &&
                    d.alertLevel === 'critical' &&
                    d.year === 2026
                ) && (
                  <motion.div
                    variants={staggerItem}
                    className="sm:col-span-2 lg:col-span-3"
                  >
                    <Card className="border-2 border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                                type: 'tween',
                              }}
                            >
                              <AlertTriangle className="h-6 w-6 text-red-500" />
                            </motion.div>
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-300">
                                🚨 CRITICAL: Motor TP Premium 25% Hike — 2026!
                              </p>
                              <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">
                                Motor Third-Party premium April 2026 mein 25% badh jayega. Renew
                                before April to save!
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white shrink-0"
                          >
                            <Zap className="h-3.5 w-3.5 mr-1.5" />
                            Renew Before Hike
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Drift Cards by Category */}
              {latestDriftByCategory.map(({ category, latest, all }) => {
                const colors = getDriftColor(latest.alertLevel);
                return (
                  <motion.div key={category} variants={staggerItem}>
                    <Card
                      className={`border ${colors.border} ${colors.bg} transition-shadow hover:shadow-md`}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={colors.icon}>
                            {getCategoryIcon(category)}
                          </span>
                          <span
                            className={`text-xs sm:text-sm font-bold ${colors.text}`}
                          >
                            {getCategoryLabel(category)}
                          </span>
                          <Badge
                            variant="outline"
                            className={`ml-auto text-[10px] ${colors.text} ${colors.border}`}
                          >
                            {latest.alertLevel === 'critical'
                              ? '🔴 CRITICAL'
                              : latest.alertLevel === 'warning'
                                ? '🟡 WARNING'
                                : '🟢 NORMAL'}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                              Latest Drift ({latest.year})
                            </span>
                            <span
                              className={`text-sm sm:text-base font-bold ${colors.text}`}
                            >
                              +{latest.driftPercent}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                              Avg Premium
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-foreground">
                              ₹{latest.avgPremiumMonthly.toLocaleString('en-IN')}/mo
                            </span>
                          </div>

                          {/* Mini trend bars */}
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <p className="text-[10px] text-muted-foreground mb-1.5">
                              Trend:
                            </p>
                            <div className="space-y-1">
                              {all
                                .sort((a, b) => a.year - b.year)
                                .map((entry) => (
                                  <div
                                    key={`${entry.category}-${entry.year}`}
                                    className="flex items-center gap-1.5"
                                  >
                                    <span className="text-[10px] w-8 text-right text-muted-foreground">
                                      {String(entry.year).slice(2)}
                                    </span>
                                    <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full bg-gradient-to-r ${
                                          entry.alertLevel === 'critical'
                                            ? 'from-red-400 to-red-500'
                                            : entry.alertLevel === 'warning'
                                              ? 'from-amber-400 to-orange-400'
                                              : 'from-emerald-400 to-teal-400'
                                        }`}
                                        style={{
                                          width: `${Math.min((entry.driftPercent / 25) * 100, 100)}%`,
                                        }}
                                      />
                                    </div>
                                    <span
                                      className={`text-[10px] font-bold w-8 ${
                                        entry.alertLevel === 'critical'
                                          ? 'text-red-600 dark:text-red-400'
                                          : entry.alertLevel === 'warning'
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                      }`}
                                    >
                                      {entry.driftPercent}%
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <p
                            className={`text-[10px] sm:text-xs mt-2 ${colors.text} leading-relaxed`}
                          >
                            {latest.hinglishImpact}
                          </p>

                          {latest.alertLevel === 'critical' && (
                            <Button
                              size="sm"
                              className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs"
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Renew Before Hike
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            4. CONSUMER PROTECTION GOVERNANCE — Ombudsman + FMU + Rights
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                उपभोक्ता सुरक्षा शासन
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Ombudsman + FMU + आपके अधिकार — Hinglish guide के साथ
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonCard key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <motion.div variants={staggerItem}>
              <Card className="border-teal-200 dark:border-teal-800/50">
                <CardContent className="p-3 sm:p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {consumerData.map((feature, idx) => (
                      <AccordionItem
                        key={idx}
                        value={`consumer-${idx}`}
                        className="border-border/50"
                      >
                        <AccordionTrigger className="text-xs sm:text-sm font-semibold text-foreground hover:no-underline py-3">
                          <div className="flex items-center gap-2 text-left">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-[10px] font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span>{feature.feature}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-3 pl-8">
                            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800"
                              >
                                Max Claim: {feature.maxClaimAmount}
                              </Badge>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50 border border-border/50">
                              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 font-medium">
                                📋 Process:
                              </p>
                              <p className="text-[10px] sm:text-xs text-foreground">
                                {feature.process}
                              </p>
                            </div>
                            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/50">
                              <p className="text-[10px] sm:text-xs text-teal-700 dark:text-teal-300 leading-relaxed">
                                💬 {feature.hinglishGuide}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* BimaBharosa Portal Link */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <a
                      href="https://bimabharosa.irdai.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border border-teal-200 dark:border-teal-800/50 hover:shadow-md transition-shadow group"
                    >
                      <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-300">
                          BimaBharosa Portal — IRDAI Integrated Complaint System
                        </p>
                        <p className="text-[10px] sm:text-xs text-teal-600 dark:text-teal-400">
                          Online complaint file karein — insurer ko 15 din mein respond karna padega
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-teal-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            5. PREMIUM ALERTS & RENEWAL REMINDERS
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mb-8 sm:mb-10"
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                प्रीमियम अलर्ट & रिन्यूअल रिमाइंडर
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                रियल-टाइम नोटिफिकेशन — पहले रिन्यू करें, पैसे बचाएं!
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* ── Alert Cards ────────────────────────────────────────────── */}
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              >
                {alertData.map((alert) => {
                  const config = getSeverityConfig(alert.severity);
                  return (
                    <motion.div key={alert.id} variants={staggerItem}>
                      <Card
                        className={`border ${config.border} ${config.bg} transition-shadow hover:shadow-md`}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 shrink-0">{config.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={getCategoryIcon(alert.category)} />
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${config.badgeClass}`}
                                >
                                  {alert.severity.toUpperCase()}
                                </Badge>
                              </div>
                              <p
                                className={`text-xs sm:text-sm font-bold ${config.text} mb-1`}
                              >
                                {alert.titleHi}
                              </p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed mb-2">
                                {alert.messageHi}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground">
                                  Effective: {alert.effectiveDate}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] border-current"
                                >
                                  +{alert.impactPercent}%
                                </Badge>
                              </div>
                              {alert.severity === 'critical' && (
                                <Button
                                  size="sm"
                                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs"
                                >
                                  <Zap className="h-3 w-3 mr-1" />
                                  {alert.actionText}
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* ── 3-Stage Renewal Reminder ───────────────────────────────── */}
              <motion.div variants={staggerItem}>
                <Card className="border-border">
                  <CardHeader className="pb-2 pt-3 px-3 sm:px-4">
                    <CardTitle className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      3-Stage रिन्यूअल रिमाइंडर सिस्टम
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {reminderData.map((reminder) => {
                        const urgency = getUrgencyConfig(reminder.urgencyLevel);
                        return (
                          <motion.div
                            key={reminder.stage}
                            className={`p-3 rounded-lg ${urgency.bg} border ${urgency.border}`}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: reminder.stage * 0.15,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {urgency.icon}
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${urgency.color} ${urgency.border}`}
                              >
                                {reminder.daysBefore} Day{reminder.daysBefore > 1 ? 's' : ''} Left
                              </Badge>
                            </div>
                            <p
                              className={`text-xs sm:text-sm font-bold ${urgency.color} mb-1`}
                            >
                              {reminder.titleHi}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                              {reminder.messageHi}
                            </p>
                            <div className="mt-2">
                              <Progress
                                value={
                                  reminder.urgencyLevel === 'high'
                                    ? 90
                                    : reminder.urgencyLevel === 'medium'
                                      ? 55
                                      : 25
                                }
                                className={`h-1.5 ${
                                  reminder.urgencyLevel === 'high'
                                    ? '[&>[data-slot=progress-indicator]]:bg-red-500'
                                    : reminder.urgencyLevel === 'medium'
                                      ? '[&>[data-slot=progress-indicator]]:bg-amber-500'
                                      : '[&>[data-slot=progress-indicator]]:bg-emerald-500'
                                }`}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* ── IRDAI Disclaimer ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 sm:mt-10 p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/50 text-center"
        >
          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
            <strong>IRDAI Disclaimer:</strong> यह डेटा IRDAI Handbook 2025-26, Annual Reports, Swiss Re
            Sigma, और Economic Survey से संकलित है। सभी आंकड़े educational purpose के लिए हैं।
            Actual premiums, CSR, और coverage insurer की underwriting policy पर निर्भर करता है।
            InsureGPT / Paliwal Secure किसी वित्तीय निर्णय के लिए जिम्मेदार नहीं है। कृपया
            certified financial advisor से परामर्श लें।
          </p>
        </motion.div>
      </div>
    </section>
  );
}
