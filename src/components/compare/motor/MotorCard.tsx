'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InsurerBadge } from '@/components/compare/shared/InsurerBadge';
import { WhatsAppCTA } from '@/components/compare/shared/WhatsAppCTA';
import { formatINR, type AddonBreakdownItem } from '@/lib/compare/compare-engine';

interface MotorCardProps {
  quote: any;
  isRecommended: boolean;
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
          isBold ? 'font-bold text-foreground' : isNegative ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
        }`}
      >
        {isNegative && value > 0 ? '-' : ''}{formatINR(Math.abs(value))}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Addon Breakdown Item Row
// ---------------------------------------------------------------------------
function AddonRow({ item }: { item: AddonBreakdownItem }) {
  return (
    <div className="flex items-center justify-between py-1 pl-4">
      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-amber-400 inline-block" />
        {item.label}
      </span>
      <span className="text-[11px] tabular-nums text-muted-foreground">
        +{formatINR(item.premium)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MotorCard Component
// ---------------------------------------------------------------------------
export function MotorCard({ quote, isRecommended }: MotorCardProps) {
  const { t } = useLanguage();
  const bd = quote.breakdown ?? {};
  const addonItems: AddonBreakdownItem[] = quote.addonBreakdown ?? [];
  const [showAddons, setShowAddons] = useState(false);

  const hasAddons = addonItems.length > 0;

  const premiumBreakdown = [
    { label: t('motorCompare.insuredDeclaredValue'), value: bd['IDV'] ?? 0 },
    { label: t('motorCompare.ownDamagePremium'), value: bd['OD_Premium_After_NCB'] ?? bd['OD_Premium_Before_NCB'] ?? 0 },
    { label: t('motorCompare.ncbDiscount'), value: Math.abs(bd['NCB_Discount'] ?? 0), isNegative: true },
    { label: t('motorCompare.thirdPartyPremium'), value: bd['TP_Premium'] ?? 0 },
    { label: t('motorCompare.personalAccidentCover'), value: bd['PA_Cover'] ?? 0 },
    { label: t('motorCompare.addonsTotal'), value: bd['AddOn_Total'] ?? 0 },
    { label: t('motorCompare.gst18'), value: bd['GST'] ?? 0 },
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
            ? 'border-green-400 dark:border-green-600 ring-2 ring-green-400/30 dark:ring-green-600/30'
            : 'border-border'
        }`}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-center">
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              {t('motorCompare.recommendedBestDeal')}
            </span>
          </div>
        )}

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Insurer Header */}
          <div className="flex items-start justify-between">
            <InsurerBadge insurerId={quote.insurerId ?? quote.insurer ?? ''} />
            {isRecommended && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-[10px] shrink-0">
                {t('motorCompare.bestDeal')}
              </Badge>
            )}
          </div>

          {/* Total Premium - Hero */}
          <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              {t('motorCompare.totalPremium')}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-400">
              {formatINR(quote.totalPremium)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {t('motorCompare.inclGST')}
            </p>
          </div>

          <Separator />

          {/* Premium Breakdown */}
          <div className="space-y-0">
            {premiumBreakdown.map((item) => (
              <BreakdownRow
                key={item.label}
                label={item.label}
                value={item.value}
                isNegative={(item as any).isNegative}
              />
            ))}

            {/* Addon breakdown expand/collapse */}
            {hasAddons && (
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setShowAddons(!showAddons)}
                  className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline ml-4"
                >
                  {showAddons ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {showAddons ? t('motorCompare.hideAddonDetails') : t('motorCompare.viewAddonDetails')} ({addonItems.length})
                </button>
                {showAddons && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                    className="border-l-2 border-amber-200 dark:border-amber-800 mt-1"
                  >
                    {addonItems.map((item) => (
                      <AddonRow key={item.id} item={item} />
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            <Separator className="my-1" />

            <BreakdownRow
              label={t('motorCompare.totalPremium')}
              value={quote.totalPremium}
              isBold
              className="bg-muted/30 -mx-1 px-1 rounded"
            />
          </div>

          {/* OD Rate Info */}
          {bd['OD_Rate_%'] && (
            <p className="text-[10px] text-muted-foreground text-center">
              {t('motorCompare.odRate')} {bd['OD_Rate_%']}% | {t('motorCompare.zoneLabel')} {quote.zone ?? '—'} | IDV: {((bd['IDV'] / (quote.exShowroomPrice || 1)) * 100).toFixed(0)}% {t('motorCompare.ofExShowroom')}
            </p>
          )}

          {/* WhatsApp CTA */}
          <WhatsAppCTA
            quote={{
              insurerName: quote.insurerName ?? quote.insurerId,
              totalPremium: quote.totalPremium,
              sumInsured: bd['IDV'],
            }}
            category="motor"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
