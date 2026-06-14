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
interface TravelCardProps {
  quote: any;
  isRecommended: boolean;
  tripDurationDays: number;
  destination: string;
  medicalCover: number;
  addons: string[];
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
// Destination Label Map
// ---------------------------------------------------------------------------
const DESTINATION_LABELS: Record<string, string> = {
  DOMESTIC: 'Domestic India',
  ASIA: 'Asia',
  WORLDWIDE_EXCL_USA: 'Worldwide excl USA',
  WORLDWIDE_INCL_USA: 'Worldwide incl USA',
};

// ---------------------------------------------------------------------------
// Medical Cover Label
// ---------------------------------------------------------------------------
function formatMedicalCover(cover: number): string {
  return `$${cover / 1000}K`;
}

// ---------------------------------------------------------------------------
// TravelCard Component
// ---------------------------------------------------------------------------
export function TravelCard({
  quote,
  isRecommended,
  tripDurationDays,
  destination,
  medicalCover,
  addons,
}: TravelCardProps) {
  const bd = quote.breakdown ?? {};

  // Premium breakdown items
  const premiumBreakdown: Array<{
    label: string;
    value: number;
    isNegative?: boolean;
  }> = [];

  // Traveller breakdowns
  const travellerKeys = Object.keys(bd).filter((k) => k.startsWith('Traveller_'));
  for (const key of travellerKeys) {
    if (bd[key] > 0) {
      premiumBreakdown.push({ label: key.replace('Traveller_', '').replace(/×/g, ' × '), value: bd[key] });
    }
  }

  // Long trip discount
  if (bd['Long_Trip_Discount'] && bd['Long_Trip_Discount'] !== 0) {
    premiumBreakdown.push({ label: 'Long-Trip Discount', value: Math.abs(bd['Long_Trip_Discount']), isNegative: true });
  }

  // Add-ons
  const addonKeys = Object.keys(bd).filter((k) => k.startsWith('Addon_'));
  for (const key of addonKeys) {
    if (bd[key] > 0 && key !== 'AddOn_Total') {
      premiumBreakdown.push({ label: key.replace('Addon_', ''), value: bd[key] });
    }
  }

  // Base premium after discount
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
            ? 'border-teal-400 dark:border-teal-600 ring-2 ring-teal-400/30 dark:ring-teal-600/30'
            : 'border-border'
        }`}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-center">
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
              <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 text-[10px] shrink-0">
                Best Value
              </Badge>
            )}
          </div>

          {/* Trip Details */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px]">
              ✈️ {DESTINATION_LABELS[destination] ?? destination}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              📅 {tripDurationDays} days
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              🏥 Medical: {formatMedicalCover(medicalCover)}
            </Badge>
          </div>

          {/* Add-on Tags */}
          {addons.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {addons.map((addon) => (
                <Badge
                  key={addon}
                  className="bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 text-[9px] h-4 px-1.5 border-0"
                >
                  {addon}
                </Badge>
              ))}
            </div>
          )}

          {/* Total Premium - Hero */}
          <div className="rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Total Premium
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-teal-700 dark:text-teal-400">
              {formatINR(quote.totalPremium)}
            </p>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-0.5 font-medium">
              Daily rate × {tripDurationDays} days × {quote.totalTravellers ?? 1} travellers
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Incl. 18% GST: {formatINR(quote.gstAmount)}
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
              label="Total Premium (incl. GST)"
              value={quote.totalPremium}
              isBold
              className="bg-muted/30 -mx-1 px-1 rounded"
            />
          </div>

          {/* WhatsApp CTA */}
          <WhatsAppCTA
            quote={{
              insurerName: quote.insurerName ?? quote.insurerId,
              totalPremium: quote.totalPremium,
              sumInsured: medicalCover,
            }}
            category="travel"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
