'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Check,
  GitCompareArrows,
  Trash2,
  Star,
  Heart,
  Shield,
  Car,
  ArrowRight,
  Building2,
  Clock,
  Sparkles,
  MessageSquare,
  ChevronDown,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  healthInsurancePlans,
  lifeInsurancePlans,
  motorInsurancePlans,
  allInsurancePlans,
  type InsurancePlan,
  type InsuranceCategory,
} from '@/lib/insurance-data';
import { formatIndianCurrency, formatRupees } from '@/lib/premiumUtils';

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_COMPARE = 4;

type FilterTab = 'all' | 'health' | 'life' | 'motor';

const FILTER_TABS: { id: FilterTab; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'Sab Plans', icon: GitCompareArrows },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'life', label: 'Life', icon: Shield },
  { id: 'motor', label: 'Motor', icon: Car },
];

const CATEGORY_GRADIENT: Record<string, string> = {
  health: 'from-rose-500 to-pink-600',
  life: 'from-blue-500 to-indigo-600',
  motor: 'from-amber-500 to-orange-600',
  travel: 'from-violet-500 to-purple-600',
  home: 'from-teal-500 to-cyan-600',
};

const CATEGORY_BG: Record<string, string> = {
  health: 'bg-rose-50 dark:bg-rose-950/30',
  life: 'bg-blue-50 dark:bg-blue-950/30',
  motor: 'bg-amber-50 dark:bg-amber-950/30',
  travel: 'bg-violet-50 dark:bg-violet-950/30',
  home: 'bg-teal-50 dark:bg-teal-950/30',
};

const CATEGORY_ICON: Record<string, React.ElementType> = {
  health: Heart,
  life: Shield,
  motor: Car,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getCsrColor(csr: number) {
  if (csr > 95) return 'text-emerald-600 dark:text-emerald-400';
  if (csr >= 90) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getCsrBg(csr: number) {
  if (csr > 95) return 'bg-emerald-50 dark:bg-emerald-950/30';
  if (csr >= 90) return 'bg-amber-50 dark:bg-amber-950/30';
  return 'bg-red-50 dark:bg-red-950/30';
}

function getCsrBadge(csr: number) {
  if (csr > 95) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300';
  if (csr >= 90) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300';
  return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
}

function getFilteredPlans(tab: FilterTab): InsurancePlan[] {
  switch (tab) {
    case 'health': return healthInsurancePlans;
    case 'life': return lifeInsurancePlans;
    case 'motor': return motorInsurancePlans;
    case 'all':
    default:
      return allInsurancePlans;
  }
}

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

// ── Comparison Row Data ───────────────────────────────────────────────────────
interface ComparisonRow {
  label: string;
  key: string;
  render: (plan: InsurancePlan) => React.ReactNode;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: 'Insurer',
    key: 'provider',
    render: (plan) => (
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium">{plan.provider}</span>
      </div>
    ),
  },
  {
    label: 'Premium (Monthly)',
    key: 'premium-monthly',
    render: (plan) => (
      <span className="text-lg font-bold text-foreground">{formatRupees(plan.premium.monthly)}</span>
    ),
  },
  {
    label: 'Premium (Yearly)',
    key: 'premium-annual',
    render: (plan) => (
      <span className="text-sm font-semibold text-muted-foreground">{formatRupees(plan.premium.annual)}/yr</span>
    ),
  },
  {
    label: 'CSR %',
    key: 'csr',
    render: (plan) => (
      <Badge className={`${getCsrBadge(plan.claimSettlementRatio)} border-0 font-bold`}>
        {plan.claimSettlementRatio}%
      </Badge>
    ),
  },
  {
    label: 'Waiting Period (PED)',
    key: 'waiting-ped',
    render: (plan) => (
      <span className="text-sm">
        {plan.waitingPeriodPED ? `${plan.waitingPeriodPED} months` : 'N/A'}
      </span>
    ),
  },
  {
    label: 'Network Hospitals',
    key: 'network-hospitals',
    render: (plan) => (
      <span className="text-sm font-medium">
        {plan.networkHospitals ? `${formatIndianCurrency(plan.networkHospitals)}+` : plan.networkGarages ? `${formatIndianCurrency(plan.networkGarages)}+ garages` : 'N/A'}
      </span>
    ),
  },
  {
    label: 'Key Add-ons',
    key: 'features',
    render: (plan) => (
      <div className="space-y-1">
        {plan.features.slice(0, 3).map((f, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs">
            <Sparkles className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
            <span>{f}</span>
          </div>
        ))}
        {plan.features.length > 3 && (
          <span className="text-[10px] text-muted-foreground">+{plan.features.length - 3} more</span>
        )}
      </div>
    ),
  },
  {
    label: 'Rating',
    key: 'rating',
    render: (plan) => (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="text-sm font-semibold">{plan.rating}</span>
      </div>
    ),
  },
  {
    label: 'Sum Insured Range',
    key: 'sum-insured',
    render: (plan) => (
      <span className="text-xs text-muted-foreground">
        {formatRupees(plan.sumInsured.min)} – {formatRupees(plan.sumInsured.max)}
      </span>
    ),
  },
  {
    label: 'Waiting Period',
    key: 'waiting',
    render: (plan) => (
      <div className="flex items-center gap-1.5 text-xs">
        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span>{plan.waitingPeriod === 'N/A' ? 'No waiting' : plan.waitingPeriod}</span>
      </div>
    ),
  },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function PlanComparison() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedPlans, setSelectedPlans] = useState<InsurancePlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredPlans = useMemo(() => {
    let plans = getFilteredPlans(activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      plans = plans.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.provider.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return plans;
  }, [activeTab, searchQuery]);

  const togglePlan = (plan: InsurancePlan) => {
    setSelectedPlans((prev) => {
      const exists = prev.find((p) => p.id === plan.id);
      if (exists) return prev.filter((p) => p.id !== plan.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, plan];
    });
  };

  const removePlan = (planId: string) => {
    setSelectedPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const clearAll = () => setSelectedPlans([]);

  const isSelected = (planId: string) => selectedPlans.some((p) => p.id === planId);

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Badge className="mb-3 bg-gradient-to-r from-rose-100 to-amber-100 text-rose-700 border-rose-200 dark:from-rose-950/50 dark:to-amber-950/50 dark:text-rose-300 dark:border-rose-800 rounded-full px-4 py-1 text-xs font-semibold">
          <GitCompareArrows className="w-3.5 h-3.5 mr-1" />
          Plan Comparison
        </Badge>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
          Plans <span className="gradient-text">Compare Karein</span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          2 se 4 plans select karein aur side-by-side dekhein — CSR, premium, waiting period sab ek nazar mein
        </p>
      </motion.div>

      {/* ── Category Filter Tabs ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-5 justify-center">
        {FILTER_TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                isActive
                  ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white border-slate-700 dark:from-slate-100 dark:to-white dark:text-slate-900 dark:border-slate-300 shadow-lg'
                  : 'bg-card text-muted-foreground border-border hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div className="relative max-w-md mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Plan ya insurer dhundhein..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-full border-border bg-card"
        />
      </div>

      {/* ── Plan Selector Grid ────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Plan Add Karein
            <span className="text-xs">({selectedPlans.length}/{MAX_COMPARE})</span>
          </h3>
          {selectedPlans.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-7 gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </Button>
            </motion.div>
          )}
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          key={activeTab + searchQuery}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
        >
          {filteredPlans.map((plan) => {
            const selected = isSelected(plan.id);
            const CatIcon = CATEGORY_ICON[plan.category] || Shield;
            const gradient = CATEGORY_GRADIENT[plan.category] || 'from-slate-500 to-slate-600';
            const full = selectedPlans.length >= MAX_COMPARE;

            return (
              <motion.div
                key={plan.id}
                variants={staggerItem}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  onClick={() => togglePlan(plan)}
                  className={`cursor-pointer transition-all duration-300 overflow-hidden relative group ${
                    selected
                      ? 'ring-2 ring-primary shadow-lg'
                      : full
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {/* Category indicator bar */}
                  <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                        <CatIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      {selected ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                        >
                          <Check className="w-3 h-3" />
                        </motion.div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2 mb-0.5">
                      {plan.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{plan.provider}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {formatRupees(plan.premium.monthly)}
                        <span className="text-[9px] font-normal text-muted-foreground">/mo</span>
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1.5 py-0 h-4 ${getCsrBg(plan.claimSettlementRatio)} ${getCsrColor(plan.claimSettlementRatio)} border-0`}
                      >
                        {plan.claimSettlementRatio}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Koi plan nahi mila. Search change karein.</p>
          </div>
        )}
      </div>

      {/* ── Selected Plans Chips ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPlans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-muted/50 border border-border"
          >
            <span className="text-xs font-medium text-muted-foreground mr-1">Comparing:</span>
            {selectedPlans.map((plan) => {
              const gradient = CATEGORY_GRADIENT[plan.category] || 'from-slate-500 to-slate-600';
              return (
                <motion.div
                  key={plan.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5 pl-1.5 pr-1 py-0.5 rounded-full border border-border bg-card"
                >
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    {(() => { const I = CATEGORY_ICON[plan.category] || Shield; return <I className="w-2.5 h-2.5 text-white" />; })()}
                  </div>
                  <span className="text-xs font-medium max-w-[100px] truncate">{plan.name}</span>
                  <button
                    onClick={() => removePlan(plan.id)}
                    className="w-4 h-4 rounded-full bg-muted hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-2.5 h-2.5 text-muted-foreground hover:text-red-500" />
                  </button>
                </motion.div>
              );
            })}
            <Button
              size="sm"
              onClick={scrollToTable}
              className="ml-auto h-7 gap-1.5 text-xs rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md"
            >
              <GitCompareArrows className="w-3 h-3" />
              Compare Karein
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Comparison Table ───────────────────────────────────────────────── */}
      <div ref={tableRef}>
        <AnimatePresence mode="wait">
          {selectedPlans.length === 0 ? (
            /* ── Empty State ────────────────────────────────────────────────── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16 sm:py-24"
            >
              <div className="w-20 h-20 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
                <GitCompareArrows className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Plans Select Karein
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Upar se 2-4 plans choose karein — phir yahan side-by-side comparison dikhega!
              </p>
            </motion.div>
          ) : (
            /* ── Actual Comparison ──────────────────────────────────────────── */
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-lg scrollbar-thin">
                <table className="w-full min-w-[640px]">
                  {/* ── Sticky Header Row ─────────────────────────────────── */}
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {/* Feature label column */}
                      <th className="sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 border-r border-b border-border p-3 text-left min-w-[160px]">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Features</span>
                      </th>
                      {/* Plan columns */}
                      {selectedPlans.map((plan, idx) => {
                        const gradient = CATEGORY_GRADIENT[plan.category] || 'from-slate-500 to-slate-600';
                        const CatIcon = CATEGORY_ICON[plan.category] || Shield;
                        return (
                          <th
                            key={plan.id}
                            className={`border-b border-border p-0 min-w-[200px] relative ${CATEGORY_BG[plan.category] || ''}`}
                          >
                            <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <CatIcon className="w-4 h-4" />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-bold leading-tight">{plan.name}</p>
                                    <p className="text-[10px] opacity-80">{plan.provider}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removePlan(plan.id)}
                                  className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                                  aria-label={`Remove ${plan.name}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              {/* Quick stats in header */}
                              <div className="mt-3 flex items-center gap-3 text-[10px] opacity-90">
                                <span className="flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                                  {plan.rating}
                                </span>
                                <span>{formatRupees(plan.premium.monthly)}/mo</span>
                                <Badge className="bg-white/20 text-white border-0 text-[9px] h-4 px-1.5">
                                  {plan.claimSettlementRatio}%
                                </Badge>
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  {/* ── Body Rows ─────────────────────────────────────────── */}
                  <tbody>
                    {COMPARISON_ROWS.map((row, rowIdx) => (
                      <tr
                        key={row.key}
                        className={`group transition-colors ${
                          rowIdx % 2 === 0
                            ? 'bg-card'
                            : 'bg-muted/30'
                        } hover:bg-muted/50`}
                      >
                        {/* Feature label */}
                        <td className="sticky left-0 z-10 bg-inherit border-r border-border p-3">
                          <span className="text-xs font-semibold text-muted-foreground">{row.label}</span>
                        </td>
                        {/* Plan values */}
                        {selectedPlans.map((plan) => (
                          <td
                            key={`${plan.id}-${row.key}`}
                            className="p-3 border-b border-border/50"
                          >
                            {row.render(plan)}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* ── Apply Now Row ─────────────────────────────────────── */}
                    <tr className="bg-card">
                      <td className="sticky left-0 z-10 bg-card border-r border-border p-3">
                        <span className="text-xs font-semibold text-muted-foreground">Action</span>
                      </td>
                      {selectedPlans.map((plan) => {
                        const gradient = CATEGORY_GRADIENT[plan.category] || 'from-slate-500 to-slate-600';
                        return (
                          <td key={`apply-${plan.id}`} className="p-4 border-b border-border/50">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                              <Button
                                className={`w-full bg-gradient-to-r ${gradient} text-white rounded-xl gap-1.5 shadow-md hover:shadow-lg transition-shadow font-semibold`}
                                onClick={() => {
                                  const chatSection = document.getElementById('insuregpt-chat');
                                  if (chatSection) {
                                    chatSection.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }}
                              >
                                <MessageSquare className="w-4 h-4" />
                                Apply Now
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Button>
                            </motion.div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ── Bottom Actions ──────────────────────────────────────────── */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                <p className="text-xs text-muted-foreground">
                  💡 CSR &gt;95% = Excellent 🟢 | 90-95% = Good 🟡 | &lt;90% = Average 🔴
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    className="gap-1.5 text-xs h-8"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={scrollToTable}
                    className="gap-1.5 text-xs h-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white dark:from-slate-100 dark:to-white dark:text-slate-900"
                  >
                    <ChevronDown className="w-3 h-3" />
                    Scroll to Top
                  </Button>
                </div>
              </div>

              {/* ── IRDAI Disclaimer ───────────────────────────────────────── */}
              <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                * Claim Settlement Ratio data source: IRDAI Annual Report 2024-25. Past performance is not indicative of future results.
                For more details on risk factors, terms and conditions, please read the sales brochure/policy wording carefully.
                Insurance is the subject matter of solicitation.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
