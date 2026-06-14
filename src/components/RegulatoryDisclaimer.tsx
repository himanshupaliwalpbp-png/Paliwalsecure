'use client';

import { Shield, Info, AlertTriangle, Scale, Phone, TrendingUp, BarChart3, GitCompare } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Context-specific disclaimer configs
// ---------------------------------------------------------------------------
type DisclaimerContext = 'standard' | 'claim' | 'investment' | 'comparison';

const contextConfig: Record<DisclaimerContext, {
  title: string;
  subtitle: string;
  items: { icon: React.ElementType; title: string; color: string; iconBg: string; content: string }[];
  footer: string;
  borderColor: string;
  bgColor: string;
  headerColor: string;
}> = {
  standard: {
    title: 'Regulatory Notice & Disclaimers',
    subtitle: 'Based on IRDAI regulations 2025-26',
    borderColor: 'border-blue-200 dark:border-blue-800/40',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    headerColor: 'text-blue-700 dark:text-blue-300',
    items: [
      {
        icon: Shield,
        title: 'Moratorium Clause (5-Year Protection)',
        color: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-900/40',
        content: 'After 5 continuous years of coverage, IRDAI mandates that no claim can be rejected for non-disclosure — except in cases of proven fraud. This is your strongest protection as a policyholder.',
      },
      {
        icon: AlertTriangle,
        title: 'Not Financial Advice',
        color: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-900/40',
        content: 'All data on this platform is for educational and comparison purposes only. This is NOT financial advice. Insurance decisions should be made after consulting a licensed insurance advisor.',
      },
      {
        icon: Scale,
        title: 'IRDAI Compliance & Prohibited Terms',
        color: 'text-teal-700 dark:text-[#00A9A6]',
        iconBg: 'bg-teal-100 dark:bg-teal-900/40',
        content: 'This platform complies with IRDAI (Insurance Web Aggregators) Regulations. We do not use prohibited terms like "best", "cheapest", or "guaranteed".',
      },
      {
        icon: Phone,
        title: 'Grievance Redressal',
        color: 'text-violet-600 dark:text-violet-400',
        iconBg: 'bg-violet-100 dark:bg-violet-900/40',
        content: "For complaints: (1) Contact your insurer's Grievance Redressal Officer, (2) File on Bima Bharosa Portal (bimabharosa.irdai.gov.in), (3) Approach Insurance Ombudsman. IRDAI Toll-Free: 1800-425-4732.",
      },
    ],
    footer: 'Data sourced from IRDAI Annual Report 2025-26, Economic Survey of India 2026, Swiss Re sigma reports. Projections based on industry estimates. Not investment advice.',
  },
  claim: {
    title: 'Claim-Related Disclaimer',
    subtitle: 'Important information about insurance claims',
    borderColor: 'border-amber-200 dark:border-amber-800/40',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    headerColor: 'text-amber-700 dark:text-amber-300',
    items: [
      {
        icon: Shield,
        title: 'Claim Settlement Ratios',
        color: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-900/40',
        content: 'Past claim settlement ratios do not guarantee future claim acceptance. Each claim is assessed on its own merits and policy terms. CSR data is from IRDAI Annual Report 2024-25.',
      },
      {
        icon: AlertTriangle,
        title: 'Claim Process Varies',
        color: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-900/40',
        content: 'Claim processing time and requirements vary by insurer and policy type. Always read policy wording carefully. Cashless facility depends on network hospital availability.',
      },
      {
        icon: Phone,
        title: 'If Claim Is Rejected',
        color: 'text-violet-600 dark:text-violet-400',
        iconBg: 'bg-violet-100 dark:bg-violet-900/40',
        content: "You have the right to appeal: (1) Insurer's Grievance Officer — must respond in 30 days, (2) Bima Bharosa Portal — bimabharosa.irdai.gov.in, (3) Insurance Ombudsman — free for claims up to ₹50 Lakh.",
      },
    ],
    footer: 'Claim data is indicative. Actual claim experience may differ. Always disclose all material facts to avoid claim rejection.',
  },
  investment: {
    title: 'Investment & Returns Disclaimer',
    subtitle: 'Important for ULIP, endowment & savings plans',
    borderColor: 'border-emerald-200 dark:border-emerald-800/40',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    headerColor: 'text-emerald-700 dark:text-emerald-300',
    items: [
      {
        icon: TrendingUp,
        title: 'Market-Linked Returns Not Guaranteed',
        color: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
        content: 'ULIP and market-linked insurance plans are subject to market risks. Past performance does not guarantee future returns. The premium allocated to investments is subject to market fluctuations.',
      },
      {
        icon: AlertTriangle,
        title: 'Not Pure Investment',
        color: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-900/40',
        content: 'Insurance-cum-investment plans (ULIP, endowment) have mortality charges and admin fees. For pure investment goals, consider mutual funds or other instruments separately.',
      },
      {
        icon: Scale,
        title: 'Lock-In Periods Apply',
        color: 'text-teal-700 dark:text-[#00A9A6]',
        iconBg: 'bg-teal-100 dark:bg-teal-900/40',
        content: 'Most investment-linked insurance plans have a 5-year lock-in. Early surrender results in significant loss. Read policy terms carefully before committing.',
      },
    ],
    footer: 'Returns shown are illustrative and based on assumed growth rates. Actual returns depend on market performance. This is not investment advice.',
  },
  comparison: {
    title: 'Comparison & Recommendation Disclaimer',
    subtitle: 'How our AI-powered comparison works',
    borderColor: 'border-violet-200 dark:border-violet-800/40',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    headerColor: 'text-violet-700 dark:text-violet-300',
    items: [
      {
        icon: GitCompare,
        title: 'Weighted Scoring System',
        color: 'text-violet-600 dark:text-violet-400',
        iconBg: 'bg-violet-100 dark:bg-violet-900/40',
        content: 'Our AI uses a weighted formula: CSR (25%) + Complaint Score (25%) + Premium (20%) + Family Fit (15%) - Mis-selling Risk - PED Penalty. Scores are indicative, not absolute.',
      },
      {
        icon: BarChart3,
        title: 'Data Sources',
        color: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-900/40',
        content: 'Insurer data is sourced from IRDAI Annual Reports, public disclosures, and Bima Bharosa portal. Premium quotes are estimates — actual premiums depend on underwriting.',
      },
      {
        icon: Scale,
        title: 'No "Best" or "Guaranteed" Claims',
        color: 'text-teal-700 dark:text-[#00A9A6]',
        iconBg: 'bg-teal-100 dark:bg-teal-900/40',
        content: 'Per IRDAI regulations, we do not use terms like "best plan", "cheapest", or "guaranteed returns". All recommendations are relative and based on stated criteria.',
      },
    ],
    footer: 'Comparison is for informational purposes only. Your actual experience may vary. Consult a licensed advisor before purchasing.',
  },
};

// ---------------------------------------------------------------------------
// ContextualDisclaimer — lightweight inline disclaimer for specific sections
// ---------------------------------------------------------------------------
export function ContextualDisclaimer({
  context,
  className,
}: {
  context: DisclaimerContext;
  className?: string;
}) {
  const config = contextConfig[context];
  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className={cn(
        'rounded-xl border p-4 sm:p-5',
        config.borderColor,
        config.bgColor,
        className
      )}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/60 dark:bg-white/10">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className={cn('font-semibold text-xs', config.headerColor)}>
              {config.title}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Items — compact list */}
        <div className="space-y-2">
          {config.items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-2 rounded-lg border border-white/60 dark:border-white/5 bg-white/40 dark:bg-white/5 p-2.5"
              >
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                    item.iconBg
                  )}
                >
                  <Icon className={cn('h-3 w-3', item.color)} />
                </div>
                <div className="min-w-0">
                  <h4 className={cn('text-[11px] font-semibold', item.color)}>
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200/50 dark:border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0" />
          <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-relaxed">
            {config.footer}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// RegulatoryDisclaimer — full section (default export)
// ---------------------------------------------------------------------------
const disclaimerItems = [
  {
    icon: Shield,
    title: 'Moratorium Clause (5-Year Protection)',
    color: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    content:
      'After 5 continuous years of coverage, IRDAI mandates that no claim can be rejected for non-disclosure — except in cases of proven fraud. This is your strongest protection as a policyholder.',
  },
  {
    icon: AlertTriangle,
    title: 'Not Financial Advice',
    color: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    content:
      'All data on this platform is for educational and comparison purposes only. This is NOT financial advice. Insurance decisions should be made after consulting a licensed insurance advisor. Premiums shown are estimates and may vary based on underwriting.',
  },
  {
    icon: Scale,
    title: 'IRDAI Compliance & Prohibited Terms',
    color: 'text-teal-700 dark:text-[#00A9A6]',
    iconBg: 'bg-teal-100 dark:bg-teal-900/40',
    content:
      'This platform complies with IRDAI (Insurance Web Aggregators) Regulations. We do not use prohibited terms like "best", "cheapest", or "guaranteed". All claim settlement ratios and insurer data are sourced from IRDAI Annual Reports.',
  },
  {
    icon: Phone,
    title: 'Grievance Redressal',
    color: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    content:
      "For complaints: (1) Contact your insurer's Grievance Redressal Officer, (2) File on Bima Bharosa Portal (bimabharosa.irdai.gov.in), (3) Approach Insurance Ombudsman for claims up to ₹50 Lakh. IRDAI Toll-Free: 1800-425-4732.",
  },
];

export default function RegulatoryDisclaimer({
  className,
}: {
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className={cn(
        'rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/30 p-5 sm:p-6',
        className
      )}
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300">
              Regulatory Notice & Disclaimers
            </h3>
            <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70">
              Based on IRDAI regulations 2025-26
            </p>
          </div>
        </div>

        {/* Disclaimer Items */}
        <div className="grid sm:grid-cols-2 gap-3">
          {disclaimerItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="rounded-lg border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-3.5"
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${item.iconBg}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className={`text-xs font-semibold ${item.color}`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 pt-2 border-t border-blue-200/50 dark:border-blue-800/30">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0" />
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
            Data sourced from IRDAI Annual Report 2025-26, Economic Survey of India 2026, Swiss Re sigma reports. Projections based on industry estimates. Not investment advice.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
