'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  IndianRupee,
  Phone,
  TrendingUp,
  Star,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────
interface PremiumTablePlan {
  name: string;
  insurer: string;
  premiumYearly: number;
  premiumMonthly?: number;
  sumInsured: number;
  csr: number; // percentage
  features: string[];
  recommended?: boolean;
  link?: string;
}

interface PremiumTableProps {
  title?: string;
  titleHindi?: string;
  plans: PremiumTablePlan[];
  language?: 'en' | 'hi' | 'hinglish';
}

// ── Helpers ───────────────────────────────────────────────────────────────
function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

function formatLakhs(amount: number): string {
  const lakhs = amount / 100000;
  return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)} L`;
}

function getCsrInfo(csr: number): {
  color: string;
  bg: string;
  label: string;
  description: string;
} {
  if (csr >= 95) {
    return {
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      label: 'Excellent',
      description: 'Very high claim approval rate — claims almost always settled',
    };
  }
  if (csr >= 90) {
    return {
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      label: 'Great',
      description: 'High claim settlement — reliable insurer',
    };
  }
  if (csr >= 80) {
    return {
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      label: 'Good',
      description: 'Decent claim settlement — check policy terms carefully',
    };
  }
  return {
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    label: 'Fair',
    description: 'Lower claim settlement — compare with alternatives',
  };
}

// ── Desktop Row Component ─────────────────────────────────────────────────
function PremiumRow({ plan, index }: { plan: PremiumTablePlan; index: number }) {
  const csrInfo = getCsrInfo(plan.csr);
  const isRecommended = plan.recommended;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={cn(
        'border-b border-border/30 transition-colors group',
        index % 2 === 1 && 'bg-muted/5',
        'hover:bg-amber-50/40 dark:hover:bg-amber-950/15',
        isRecommended &&
          'bg-amber-50/50 dark:bg-amber-950/15 border-l-[3px] border-l-[#C98A1C]'
      )}
    >
      {/* Plan Name & Insurer */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm">
              {plan.name}
            </span>
            {isRecommended && (
              <Badge className="text-[9px] px-1.5 py-0 bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white border-0 animate-shimmer">
                <Star className="w-2.5 h-2.5 mr-0.5" />
                Best Value
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{plan.insurer}</span>
        </div>
      </td>

      {/* Sum Insured */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="font-semibold text-foreground text-sm">
          {formatLakhs(plan.sumInsured)}
        </span>
      </td>

      {/* Premium */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-foreground text-sm">
            {formatINR(plan.premiumYearly)}
            <span className="text-xs font-normal text-muted-foreground">/yr</span>
          </span>
          {plan.premiumMonthly && (
            <span className="text-xs text-muted-foreground">
              {formatINR(plan.premiumMonthly)}/mo
            </span>
          )}
        </div>
      </td>

      {/* CSR */}
      <td className="px-4 py-4 whitespace-nowrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-help',
                csrInfo.bg,
                csrInfo.color
              )}
            >
              {plan.csr}%
              <Info className="w-2.5 h-2.5 opacity-60" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[220px]">
            <p className="font-semibold text-xs mb-1">
              CSR: {plan.csr}% — {csrInfo.label}
            </p>
            <p className="text-[10px] opacity-80">{csrInfo.description}</p>
          </TooltipContent>
        </Tooltip>
      </td>

      {/* Features */}
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {plan.features.slice(0, 3).map((f, fi) => (
            <Badge
              key={fi}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
            >
              {f}
            </Badge>
          ))}
          {plan.features.length > 3 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 cursor-help"
                >
                  +{plan.features.length - 3} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[250px]">
                <div className="space-y-0.5">
                  {plan.features.slice(3).map((f, fi) => (
                    <p key={fi} className="text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                      {f}
                    </p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </td>

      {/* CTA */}
      <td className="px-4 py-4 whitespace-nowrap">
        {plan.link ? (
          <a
            href={plan.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white hover:shadow-lg hover:shadow-[#C98A1C]/25 transition-all"
          >
            Get Quote
            <ArrowRight className="w-3 h-3" />
          </a>
        ) : (
          <a
            href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20a%20quote%20for%20insurance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-card text-foreground hover:bg-accent transition"
          >
            <Phone className="w-3 h-3 text-emerald-500" />
            Get Quote
          </a>
        )}
      </td>
    </motion.tr>
  );
}

// ── Mobile Card Component ─────────────────────────────────────────────────
function PremiumCard({ plan, index }: { plan: PremiumTablePlan; index: number }) {
  const csrInfo = getCsrInfo(plan.csr);
  const isRecommended = plan.recommended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className={cn(
        'glass-card p-5 rounded-2xl',
        isRecommended && 'ring-2 ring-[#C98A1C]/50'
      )}
    >
      {/* Plan Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-foreground text-base">{plan.name}</h4>
            {isRecommended && (
              <Badge className="text-[9px] px-1.5 py-0 bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white border-0">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                Best Value
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{plan.insurer}</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold cursor-help',
                csrInfo.bg,
                csrInfo.color
              )}
            >
              {plan.csr}% CSR
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <p className="text-[10px]">{csrInfo.description}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Premium Highlight */}
      <div className="bg-gradient-to-r from-amber-50/80 to-amber-50/80 dark:from-amber-950/20 dark:to-amber-950/20 rounded-xl p-3 mb-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Yearly Premium
            </p>
            <p className="text-xl font-bold text-foreground">
              {formatINR(plan.premiumYearly)}
            </p>
          </div>
          {plan.premiumMonthly && (
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Monthly</p>
              <p className="text-sm font-semibold text-foreground">
                {formatINR(plan.premiumMonthly)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sum Insured */}
      <div className="flex items-center justify-between py-2 border-b border-border/20">
        <span className="text-xs text-muted-foreground">Sum Insured</span>
        <span className="text-sm font-semibold text-foreground">
          {formatLakhs(plan.sumInsured)}
        </span>
      </div>

      {/* Features */}
      <div className="mt-3 mb-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
          Key Features
        </p>
        <div className="flex flex-wrap gap-1.5">
          {plan.features.map((f, fi) => (
            <span
              key={fi}
              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={plan.link || 'https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20a%20quote%20for%20insurance'}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold transition-all',
          isRecommended
            ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white hover:shadow-lg hover:shadow-[#C98A1C]/25'
            : 'border border-border bg-card text-foreground hover:bg-accent'
        )}
      >
        {plan.link ? (
          <>
            Get Quote <ArrowRight className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            Get Quote on WhatsApp
          </>
        )}
      </a>
    </motion.div>
  );
}

// ── Main PremiumTable Component ───────────────────────────────────────────
export function PremiumTable({
  title,
  titleHindi,
  plans,
  language = 'hinglish',
}: PremiumTableProps) {
  const displayTitle =
    title ||
    (language === 'hi' && titleHindi
      ? titleHindi
      : language === 'hi'
      ? 'प्रीमियम तुलना'
      : 'Premium Comparison');

  // Sort: recommended plan first
  const sortedPlans = [...plans].sort((a, b) =>
    a.recommended === b.recommended ? 0 : a.recommended ? -1 : b.recommended ? 1 : 0
  );

  // Find cheapest plan
  const cheapestPremium = Math.min(...plans.map((p) => p.premiumYearly));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full my-6"
    >
      <div className="glass-card p-4 sm:p-6 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#C98A1C]/10 to-[#E0A830]/10 dark:from-[#C98A1C]/20 dark:to-[#E0A830]/20 text-[#C98A1C] dark:text-[#C98A1C]">
            <IndianRupee className="h-4 w-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {displayTitle}
          </h3>
          <div className="flex items-center gap-2 ml-auto">
            <Badge
              variant="secondary"
              className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 whitespace-nowrap"
            >
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              {plans.length} Plans
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 whitespace-nowrap"
            >
              From {formatINR(cheapestPremium)}/yr
            </Badge>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm border-collapse" role="table" aria-label={displayTitle}>
            <thead>
              <tr className="border-b-2 border-[#C98A1C]/20">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Plan
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Sum Insured
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300">
                  Premium
                  <Badge className="ml-1.5 text-[8px] px-1 py-0 bg-[#C98A1C] text-white">
                    Key
                  </Badge>
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  CSR
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Features
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlans.map((plan, idx) => (
                <PremiumRow key={idx} plan={plan} index={idx} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedPlans.map((plan, idx) => (
            <PremiumCard key={idx} plan={plan} index={idx} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-5 pt-4 border-t border-border/20">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            * Premiums shown are approximate and may vary based on age, city, medical history, and selected add-ons.
            CSR data sourced from IRDAI Annual Report.{' '}
            <a
              href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20personalized%20insurance%20quotes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Get personalized quotes →
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default PremiumTable;
