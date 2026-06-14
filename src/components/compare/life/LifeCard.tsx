'use client';

import { motion } from 'framer-motion';
import { Shield, Landmark, Star, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InsurerBadge } from '@/components/compare/shared/InsurerBadge';
import { WhatsAppCTA } from '@/components/compare/shared/WhatsAppCTA';
import { formatINR } from '@/lib/compare/compare-engine';
import { LIFE_INSURER_DATA } from '@/lib/compare/life-rates';
import type { LifeInsurerDataItem } from '@/lib/compare/life-rates';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface LifeCardProps {
  quote: any;
  isRecommended: boolean;
  isSmoker?: boolean;
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
  if (value === 0 && !isBold) return null;

  return (
    <div className={`flex items-center justify-between py-1 ${className}`}>
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
// LifeCard Component
// ---------------------------------------------------------------------------
export function LifeCard({ quote, isRecommended, isSmoker = false }: LifeCardProps) {
  const bd = quote.breakdown ?? {};
  const insurerData: LifeInsurerDataItem | undefined =
    LIFE_INSURER_DATA[quote.insurerId ?? ''];
  const insurerId = quote.insurerId ?? '';

  // Premium breakdown items
  const premiumBreakdown = [
    { label: 'Base Premium (Non-Smoker)', value: bd['Base_Premium'] ?? 0 },
    { label: 'Smoker Loading (×1.35)', value: bd['Smoker_Loading'] ?? 0 },
    { label: 'Limited Pay Factor', value: bd['Limited_Pay_Factor'] ?? 0 },
    { label: 'Return of Premium (×1.75)', value: bd['ROP_Loading'] ?? 0 },
    { label: 'GST Savings (0% vs 18%)', value: Math.round((bd['Base_Premium_Final'] ?? 0) * 0.18), isNegative: true },
  ];

  // Monthly premium
  const monthlyPremium = Math.round(quote.totalPremium / 12);

  // Special badges
  const isHighestCSR = insurerId === 'MAX_LIFE';
  const isGovernmentBacked = insurerId === 'LIC';

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
            ? 'border-violet-400 dark:border-violet-600 ring-2 ring-violet-400/30 dark:ring-violet-600/30'
            : 'border-border'
        }`}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 text-center">
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              ✅ Recommended — Best Value
            </span>
          </div>
        )}

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Insurer Header */}
          <div className="flex items-start justify-between gap-2">
            <InsurerBadge insurerId={insurerId} />
            {isRecommended && (
              <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 text-[10px] shrink-0">
                Best Value
              </Badge>
            )}
          </div>

          {/* Plan Name + Special Badges */}
          {insurerData && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px]">
                {insurerData.planName}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                ⭐ {insurerData.appRating}
              </Badge>
              {isHighestCSR && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-[9px] h-4 px-1.5 gap-0.5">
                  <Award className="h-2.5 w-2.5" />
                  Highest CSR in Private Sector
                </Badge>
              )}
              {isGovernmentBacked && (
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 text-[9px] h-4 px-1.5 gap-0.5">
                  <Landmark className="h-2.5 w-2.5" />
                  Government-backed
                </Badge>
              )}
            </div>
          )}

          {/* Total Premium - Hero */}
          <div className="rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Annual Premium
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-violet-700 dark:text-violet-400">
              {formatINR(quote.totalPremium)}
            </p>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
              ≈ {formatINR(monthlyPremium)}/month
            </p>
            {isSmoker && bd['Smoker_Loading'] > 0 && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                🚬 Smoker premium: {formatINR(quote.totalPremium)} (includes 35% loading)
              </p>
            )}
            <p className="text-[10px] text-violet-600 dark:text-violet-400 mt-0.5 font-medium">
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

          {/* CSR & Solvency */}
          {insurerData && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Key Metrics
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-muted/50 p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Claim Settlement Ratio</p>
                    <p className={`text-sm font-bold ${
                      insurerData.csr >= 99 ? 'text-green-700 dark:text-green-400' :
                      insurerData.csr >= 98 ? 'text-emerald-700 dark:text-emerald-400' :
                      'text-amber-700 dark:text-amber-400'
                    }`}>
                      {insurerData.csr.toFixed(1)}%
                    </p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Solvency Ratio</p>
                    <p className={`text-sm font-bold ${
                      insurerData.solvencyRatio >= 2.0 ? 'text-green-700 dark:text-green-400' :
                      insurerData.solvencyRatio >= 1.5 ? 'text-emerald-700 dark:text-emerald-400' :
                      'text-amber-700 dark:text-amber-400'
                    }`}>
                      {insurerData.solvencyRatio.toFixed(2)}
                    </p>
                    <p className="text-[9px] text-muted-foreground">IRDAI min: 1.50</p>
                  </div>
                </div>
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
              sumInsured: quote.sumAssured,
            }}
            category="life"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
