'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InsurerBadge } from '@/components/compare/shared/InsurerBadge';
import { WhatsAppCTA } from '@/components/compare/shared/WhatsAppCTA';
import { formatINR } from '@/lib/compare/compare-engine';
import { HEALTH_INSURER_DATA } from '@/lib/compare/health-rates';
import type { HealthInsurerDataItem } from '@/lib/compare/health-rates';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface HealthCardProps {
  quote: any;
  isRecommended: boolean;
  pedList?: string[];
}

// ---------------------------------------------------------------------------
// Premium Breakdown Row
// ---------------------------------------------------------------------------
function BreakdownRow({
  label,
  value,
  isNegative = false,
  isBold = false,
  className = '',
}: {
  label: string;
  value: number;
  isNegative?: boolean;
  isBold?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${className}`}>
      <span className={`text-xs ${isBold ? 'font-semibold' : 'text-muted-foreground'}`}>
        {label}
      </span>
      <span
        className={`text-xs tabular-nums ${
          isBold
            ? 'font-bold text-foreground'
            : isNegative
              ? 'text-green-600 dark:text-green-400'
              : 'text-muted-foreground'
        }`}
      >
        {isNegative && value > 0 ? '-' : ''}{formatINR(Math.abs(value))}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature Highlight Pill
// ---------------------------------------------------------------------------
function FeaturePill({ label, value }: { label: string; value: string }) {
  const isGood = value.toLowerCase().includes('no limit') ||
    value.toLowerCase().includes('none') ||
    value.toLowerCase().includes('unlimited') ||
    value.toLowerCase().includes('0%');

  return (
    <div className="flex items-center gap-1.5 text-[11px]">
      <span
        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
          isGood ? 'bg-green-500' : 'bg-amber-500'
        }`}
      />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PED Match Badge
// ---------------------------------------------------------------------------
function PEDMatchBadge({ pedList }: { pedList: string[] }) {
  if (!pedList || pedList.length === 0 || pedList.includes('none')) return null;

  const pedLabels: Record<string, string> = {
    diabetes: 'Diabetes',
    hypertension: 'Hypertension',
    heartDisease: 'Heart Disease',
    cancer: 'Cancer',
    thyroid: 'Thyroid',
    asthma: 'Asthma',
  };

  const labels = pedList
    .filter((p) => p !== 'none')
    .map((p) => pedLabels[p] ?? p);

  if (labels.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
        Recommended for:
      </span>
      {labels.map((label) => (
        <Badge
          key={label}
          className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[9px] h-4 px-1.5"
        >
          {label}
        </Badge>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HealthCard Component
// ---------------------------------------------------------------------------
export function HealthCard({ quote, isRecommended, pedList = [] }: HealthCardProps) {
  const bd = quote.breakdown ?? {};
  const insurerData: HealthInsurerDataItem | undefined =
    HEALTH_INSURER_DATA[quote.insurerId ?? ''];

  // Premium breakdown items
  const premiumBreakdown = [
    { label: 'Base Premium', value: bd['Base_Premium_Raw'] ?? 0 },
    { label: 'Zone Loading', value: bd['Zone_Loading'] ?? 0 },
    { label: 'Floater Loading', value: bd['Floater_Loading'] ?? 0 },
    { label: 'PED Loading', value: bd['PED_Loading'] ?? 0 },
    { label: 'Additional Members', value: bd['Additional_Members'] ?? 0 },
    { label: 'Add-Ons', value: bd['AddOn_Total'] ?? 0 },
    { label: 'GST Savings (0% vs 18%)', value: Math.round((bd['Base_Premium_Final'] ?? 0) * 0.18), isNegative: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card
        className={`h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl ${
          isRecommended
            ? 'border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-400/30 dark:ring-emerald-600/30'
            : 'border-border'
        }`}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-center">
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              ✅ Recommended — Best Value
            </span>
          </div>
        )}

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Insurer Header */}
          <div className="flex items-start justify-between">
            <InsurerBadge insurerId={quote.insurerId ?? ''} />
            {isRecommended && (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] shrink-0">
                Best Value
              </Badge>
            )}
          </div>

          {/* Plan Name & Network Hospitals */}
          {insurerData && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px]">
                {insurerData.planName}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                🏥 {insurerData.networkHospitals.toLocaleString('en-IN')} Network Hospitals
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                ⭐ {insurerData.appRating}
              </Badge>
            </div>
          )}

          {/* PED Match */}
          {pedList.length > 0 && !pedList.includes('none') && (
            <PEDMatchBadge pedList={pedList} />
          )}

          {/* Total Premium - Hero */}
          <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Annual Premium
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatINR(quote.totalPremium)}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
              0% GST — Save {formatINR(Math.round((bd['Base_Premium_Final'] ?? 0) * 0.18))} vs last year
            </p>
          </div>

          <Separator />

          {/* Premium Breakdown */}
          <div className="space-y-0">
            {premiumBreakdown
              .filter((item) => item.value !== 0)
              .map((item) => (
                <BreakdownRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  isNegative={item.isNegative}
                />
              ))}

            <Separator className="my-1" />

            <BreakdownRow
              label="Total Annual Premium"
              value={quote.totalPremium}
              isBold
              className="bg-muted/30 -mx-1 px-1 rounded"
            />
          </div>

          {/* Feature Highlights */}
          {insurerData && (
            <>
              <Separator />
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Key Features
                </p>
                <FeaturePill label="Room Rent" value={insurerData.roomRentLimit} />
                <FeaturePill label="Co-payment" value={insurerData.coPayment} />
                <FeaturePill label="Restoration" value={insurerData.restoration} />
                <FeaturePill label="Waiting Period" value={insurerData.waitingPeriod} />
                <FeaturePill label="NCB" value={insurerData.ncb} />
              </div>

              {/* Unique Feature */}
              <div className="rounded-md bg-primary/5 dark:bg-primary/10 p-2.5">
                <p className="text-[10px] font-semibold text-primary mb-0.5">
                  ✨ Unique Feature
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {insurerData.uniqueFeature}
                </p>
              </div>
            </>
          )}

          {/* WhatsApp CTA */}
          <WhatsAppCTA
            quote={{
              insurerName: quote.insurerName ?? quote.insurerId,
              totalPremium: quote.totalPremium,
              sumInsured: quote.sumInsured,
            }}
            category="health"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
