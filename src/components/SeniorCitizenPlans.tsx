'use client';

import { motion } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Shield,
  BadgeCheck,
  Clock,
  IndianRupee,
  Users,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  SENIOR_CITIZEN_PLANS,
  formatRupeesFull,
  type SeniorPlan,
} from '@/data/ageBasedData';

// ── "Best For" mapping ────────────────────────────────────────
const BEST_FOR_MAP: Record<string, string> = {
  'Star Health-Red Carpet': 'Best PED Coverage',
  'Care Health-Senior Plan': 'Best Value',
  'Niva Bupa-Senior First': 'Lowest Co-Pay',
  'HDFC ERGO-Optima Senior': 'Highest CSR & Trust',
};

function getBestFor(plan: SeniorPlan): string {
  return BEST_FOR_MAP[`${plan.insurer}-${plan.name}`] ?? '';
}

// ── Color helpers ─────────────────────────────────────────────
function coPayColor(coPay: string): string {
  const match = coPay.match(/(\d+)/);
  if (!match) return 'text-amber-600';
  const val = parseInt(match[1], 10);
  if (val <= 10) return 'text-green-600 dark:text-green-400';
  if (val <= 20) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function coPayBg(coPay: string): string {
  const match = coPay.match(/(\d+)/);
  if (!match) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  const val = parseInt(match[1], 10);
  if (val <= 10) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
  if (val <= 20) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
}

function pedColor(pedWaiting: string): string {
  const match = pedWaiting.match(/(\d+)/);
  if (!match) return 'text-amber-600';
  const months = parseInt(match[1], 10);
  if (months <= 12) return 'text-green-600 dark:text-green-400';
  if (months <= 24) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function pedBg(pedWaiting: string): string {
  const match = pedWaiting.match(/(\d+)/);
  if (!match) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  const months = parseInt(match[1], 10);
  if (months <= 12) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
  if (months <= 24) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
}

function isPedBest(pedWaiting: string): boolean {
  const match = pedWaiting.match(/(\d+)/);
  return match ? parseInt(match[1], 10) <= 12 : false;
}

// ── Star Rating ───────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && (
        <span className="relative inline-block h-4 w-4">
          <Star className="absolute h-4 w-4 text-gray-300 dark:text-gray-600" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </span>
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
      ))}
      <span className="ml-1 text-sm font-semibold text-foreground">{rating}</span>
    </span>
  );
}

// ── Plan Card ─────────────────────────────────────────────────
function PlanCard({ plan, index }: { plan: SeniorPlan; index: number }) {
  const bestFor = getBestFor(plan);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="min-w-[300px] max-w-[360px] flex-shrink-0 snap-start"
    >
      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#0f2744]">
        {/* Card top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />

        <CardHeader className="pb-3 pt-4 px-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {plan.insurer}
              </p>
              <CardTitle className="text-lg font-bold text-[#0A2540] dark:text-white mt-0.5">
                {plan.name}
              </CardTitle>
            </div>
            <Badge className="bg-[#0A2540] text-white text-[10px] px-2 py-0.5 font-medium hover:bg-[#0A2540]/90">
              {plan.entryAge}
            </Badge>
          </div>

          {/* Best For Badge */}
          {bestFor && (
            <Badge
              className="mt-2 w-fit text-white text-[11px] px-3 py-1 font-semibold"
              style={{ background: 'linear-gradient(135deg, #00A9A6, #008F8C)' }}
            >
              <Heart className="h-3 w-3 mr-1" />
              {bestFor}
            </Badge>
          )}

          {/* Star rating */}
          <div className="mt-2">
            <StarRating rating={plan.rating} />
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 space-y-3">
          {/* Co-Pay */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Co-Pay
            </span>
            <span className={`text-sm font-bold ${coPayColor(plan.coPay)}`}>
              {plan.coPay}
            </span>
          </div>

          {/* PED Waiting */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> PED Waiting
            </span>
            <span className="flex items-center gap-1.5">
              <Badge
                variant="secondary"
                className={`text-[11px] font-semibold px-2 py-0.5 ${pedBg(plan.pedWaiting)}`}
              >
                {plan.pedWaiting}
              </Badge>
              {isPedBest(plan.pedWaiting) && (
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">
                  Best!
                </span>
              )}
            </span>
          </div>

          {/* Sum Insured Range */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5" /> Sum Insured
            </span>
            <span className="text-sm font-semibold text-foreground">{plan.sumInsuredRange}</span>
          </div>

          {/* Renewal Age */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Renewal
            </span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              {plan.renewalAge}
            </span>
          </div>

          {/* CSR */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5" /> Claim Settlement
            </span>
            <span className="text-sm font-bold text-foreground">{plan.csr}%</span>
          </div>

          {/* Premium */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Premium from (₹5L, age 65)</p>
            <p className="text-2xl font-extrabold text-[#0A2540] dark:text-white mt-0.5">
              {formatRupeesFull(plan.premiumFrom)}
              <span className="text-xs font-normal text-muted-foreground">/year</span>
            </p>
          </div>

          {/* Highlights */}
          <ul className="mt-3 space-y-1.5">
            {plan.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#00A9A6]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Comparison Table ──────────────────────────────────────────
function ComparisonTable() {
  const plans = SENIOR_CITIZEN_PLANS;

  const rows: { label: string; icon: React.ReactNode; getVal: (p: SeniorPlan) => React.ReactNode }[] = [
    {
      label: 'Entry Age',
      icon: <Users className="h-4 w-4" />,
      getVal: (p) => <span className="font-medium">{p.entryAge}</span>,
    },
    {
      label: 'Co-Pay',
      icon: <Shield className="h-4 w-4" />,
      getVal: (p) => (
        <Badge variant="secondary" className={`text-[11px] font-semibold px-2 py-0.5 ${coPayBg(p.coPay)}`}>
          {p.coPay}
        </Badge>
      ),
    },
    {
      label: 'PED Waiting',
      icon: <Clock className="h-4 w-4" />,
      getVal: (p) => (
        <span className="flex items-center gap-1.5">
          <Badge variant="secondary" className={`text-[11px] font-semibold px-2 py-0.5 ${pedBg(p.pedWaiting)}`}>
            {p.pedWaiting}
          </Badge>
          {isPedBest(p.pedWaiting) && (
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Best!</span>
          )}
        </span>
      ),
    },
    {
      label: 'Sum Insured',
      icon: <IndianRupee className="h-4 w-4" />,
      getVal: (p) => <span className="text-sm">{p.sumInsuredRange}</span>,
    },
    {
      label: 'Renewal',
      icon: <ArrowRight className="h-4 w-4" />,
      getVal: (p) => <span className="text-sm font-medium text-green-600 dark:text-green-400">{p.renewalAge}</span>,
    },
    {
      label: 'Premium From',
      icon: <IndianRupee className="h-4 w-4" />,
      getVal: (p) => <span className="font-bold text-[#0A2540] dark:text-white">{formatRupeesFull(p.premiumFrom)}/yr</span>,
    },
    {
      label: 'CSR',
      icon: <BadgeCheck className="h-4 w-4" />,
      getVal: (p) => <span className="font-semibold">{p.csr}%</span>,
    },
    {
      label: 'Rating',
      icon: <Star className="h-4 w-4" />,
      getVal: (p) => <StarRating rating={p.rating} />,
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#0A2540] hover:bg-[#0A2540]">
            <TableHead className="text-white font-semibold min-w-[140px] sticky left-0 bg-[#0A2540] z-10">
              Feature
            </TableHead>
            {plans.map((p) => (
              <TableHead key={p.insurer} className="text-white font-semibold text-center min-w-[150px]">
                <span className="block text-[10px] uppercase tracking-wider opacity-80">{p.insurer}</span>
                <span className="block">{p.name}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label} className="even:bg-muted/40">
              <TableCell className="font-medium text-sm flex items-center gap-2 sticky left-0 bg-background z-10">
                <span className="text-[#00A9A6]">{row.icon}</span>
                {row.label}
              </TableCell>
              {plans.map((p) => (
                <TableCell key={p.insurer} className="text-center">
                  {row.getVal(p)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function SeniorCitizenPlans() {
  return (
    <section className="w-full bg-white dark:bg-[#0A1929]">
      {/* ── Hero Banner ────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-0 text-xs px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              IRDAI 2025-26 Compliant
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Senior Citizen Health Plans 2026
            </h1>

            <p className="mt-3 text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
              60+ ke liye best health insurance — compare karein aur sahi chunein
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full">
                <Heart className="h-3.5 w-3.5" /> 4 Top Plans Compared
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" /> IRDAI Verified
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full">
                <Star className="h-3.5 w-3.5" /> Updated March 2026
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Plan Comparison Cards ──────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540] dark:text-white">
            Compare Top Senior Citizen Plans
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            Har plan ka detail side-by-side dekhein — premium, co-pay, PED waiting, aur bahut kuch
          </p>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {SENIOR_CITIZEN_PLANS.map((plan, i) => (
            <PlanCard key={plan.insurer} plan={plan} index={i} />
          ))}
        </div>
      </div>

      {/* ── Comparison Table ───────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-10 sm:pb-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540] dark:text-white">
            Feature-by-Feature Comparison
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Saari details ek nazar mein — quickly compare karein
          </p>
        </div>

        <ComparisonTable />
      </div>

      {/* ── Actionable Tip Box ─────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-10 sm:pb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-5 sm:p-7"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl sm:text-3xl flex-shrink-0 mt-0.5">💡</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A2540] dark:text-white mb-2">
                Expert Tip
              </h3>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                Agar aapke parents ko pehle se koi bimari hai, toh{' '}
                <strong className="text-[#0A2540] dark:text-white">Star Health Red Carpet</strong>{' '}
                try karein — sirf <strong className="text-green-600 dark:text-green-400">12 months PED waiting</strong>!{' '}
                Lekin agar co-pay kam chahiye toh{' '}
                <strong className="text-[#0A2540] dark:text-white">Niva Bupa Senior First</strong>{' '}
                (<strong className="text-green-600 dark:text-green-400">10%</strong>) best hai.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── IRDAI Senior Citizen Note ──────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-[#00A9A6]/30 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/10 p-5 sm:p-7"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full p-2 bg-[#00A9A6]/10">
              <Info className="h-5 w-5 text-[#00A9A6]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A2540] dark:text-white mb-1">
                IRDAI 2025-26 Senior Citizen Protection
              </h3>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                <strong>IRDAI 2025-26:</strong> Ab koi bhi insurer 60+ age pe policy refuse nahi kar sakta.{' '}
                <strong>Lifelong renewability guaranteed</strong> hai. Yeh rule se aapko poora protection milta hai — chahe kitni bhi umar ho, health insurance aapka haq hai.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="bg-[#00A9A6]/10 text-[#00A9A6] hover:bg-[#00A9A6]/20 border-0 text-xs">
                  <Shield className="h-3 w-3 mr-1" /> No Refusal at 60+
                </Badge>
                <Badge className="bg-[#00A9A6]/10 text-[#00A9A6] hover:bg-[#00A9A6]/20 border-0 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Lifelong Renewal
                </Badge>
                <Badge className="bg-[#00A9A6]/10 text-[#00A9A6] hover:bg-[#00A9A6]/20 border-0 text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Max 3 yr PED Wait
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
