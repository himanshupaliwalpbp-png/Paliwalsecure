'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InsurerBadge } from '@/components/compare/shared/InsurerBadge';
import { WhatsAppCTA } from '@/components/compare/shared/WhatsAppCTA';
import { formatINR } from '@/lib/compare/compare-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface HomeCardProps {
  quote: any;
  isRecommended: boolean;
  coverType: string;
  propertyType: string;
  earthquakeCover: boolean;
  burglaryCover: boolean;
}

// ---------------------------------------------------------------------------
// Premium Breakdown Row
// ---------------------------------------------------------------------------
function BreakdownRow({
  label,
  value,
  isNegative = false,
  isBold = false,
}: {
  label: string;
  value: number;
  isNegative?: boolean;
  isBold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
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
// Cover Type Label Map
// ---------------------------------------------------------------------------
const COVER_TYPE_LABELS: Record<string, string> = {
  STRUCTURE_ONLY: 'Structure Only',
  STRUCTURE_CONTENTS: 'Structure + Contents',
  CONTENTS_ONLY: 'Contents Only',
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Apartment',
  INDEPENDENT_HOUSE: 'Independent House',
  VILLA: 'Villa',
};

// ---------------------------------------------------------------------------
// HomeCard Component
// ---------------------------------------------------------------------------
export function HomeCard({
  quote,
  isRecommended,
  coverType,
  propertyType,
  earthquakeCover,
  burglaryCover,
}: HomeCardProps) {
  const bd = quote.breakdown ?? {};

  // Build premium breakdown
  const premiumBreakdown: Array<{
    label: string;
    value: number;
    isNegative?: boolean;
  }> = [];

  // Structure premium
  if (bd['Structure_Premium'] && bd['Structure_Premium'] > 0) {
    premiumBreakdown.push({
      label: `Structure (₹${bd['Structure_Rate']}/1000 SI)`,
      value: bd['Structure_Premium'],
    });
  }

  // Contents premium
  if (bd['Contents_Premium'] && bd['Contents_Premium'] > 0) {
    premiumBreakdown.push({
      label: `Contents (₹${bd['Contents_Rate']}/1000 SI)`,
      value: bd['Contents_Premium'],
    });
  }

  // Zone loading
  if (bd['Zone_Loading'] && bd['Zone_Loading'] !== 0) {
    premiumBreakdown.push({ label: 'Zone Loading', value: Math.abs(bd['Zone_Loading']) });
  }

  // Base premium
  premiumBreakdown.push({ label: 'Base Premium', value: bd['Base_Premium'] ?? quote.basePremium });

  // GST
  premiumBreakdown.push({ label: 'GST (18%)', value: quote.gstAmount });

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

          {/* Property Details */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px]">
              🏠 {COVER_TYPE_LABELS[coverType] ?? coverType}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              🏗️ {PROPERTY_TYPE_LABELS[propertyType] ?? propertyType}
            </Badge>
            {earthquakeCover && (
              <Badge className="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-[9px] border-0 h-4 px-1.5">
                🌍 Earthquake
              </Badge>
            )}
            {burglaryCover && (
              <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 text-[9px] border-0 h-4 px-1.5">
                🔒 Burglary
              </Badge>
            )}
          </div>

          {/* Total Premium - Hero */}
          <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Annual Premium
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatINR(quote.totalPremium)}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
              Incl. 18% GST: {formatINR(quote.gstAmount)}
            </p>
            {bd['Zone_Loading'] > 0 && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                Zone loading: +{formatINR(bd['Zone_Loading'])}
              </p>
            )}
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
              label="Total Annual Premium (incl. GST)"
              value={quote.totalPremium}
              isBold
              className="bg-muted/30 -mx-1 px-1 rounded"
            />
          </div>

          {/* Zone Loading Info */}
          {bd['Zone_Loading'] > 0 && (
            <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-2.5">
              <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 mb-0.5">
                ⚠️ Zone Loading Applied
              </p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-tight">
                Your property is in a high-seismic zone and/or flood-prone city. Additional loading of{' '}
                {formatINR(bd['Zone_Loading'])} has been applied to the base premium.
              </p>
            </div>
          )}

          {/* WhatsApp CTA */}
          <WhatsAppCTA
            quote={{
              insurerName: quote.insurerName ?? quote.insurerId,
              totalPremium: quote.totalPremium,
              sumInsured: quote.structureSI ?? 0,
            }}
            category="home"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
