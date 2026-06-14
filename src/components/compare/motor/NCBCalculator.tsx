'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { NCB_DISCOUNT } from '@/lib/compare/motor-rates';
import { formatINR } from '@/lib/compare/compare-engine';

interface NCBCalculatorProps {
  currentODPremium: number;
}

// ---------------------------------------------------------------------------
// NCB Slab Data
// ---------------------------------------------------------------------------
const NCB_SLABS = [
  { years: 0, percent: 0, label: '0%' },
  { years: 1, percent: 20, label: '20%' },
  { years: 2, percent: 25, label: '25%' },
  { years: 3, percent: 35, label: '35%' },
  { years: 4, percent: 45, label: '45%' },
  { years: 5, percent: 50, label: '50%' },
];

const BAR_COLORS = [
  'bg-gray-300 dark:bg-gray-600',
  'bg-amber-400 dark:bg-amber-500',
  'bg-amber-500 dark:bg-amber-600',
  'bg-orange-500 dark:bg-orange-600',
  'bg-green-500 dark:bg-green-600',
  'bg-emerald-600 dark:bg-emerald-700',
];

// ---------------------------------------------------------------------------
// NCBCalculator Component
// ---------------------------------------------------------------------------
export function NCBCalculator({ currentODPremium }: NCBCalculatorProps) {
  const { t } = useLanguage();
  const [claimFreeYears, setClaimFreeYears] = useState(0);

  const currentNCBRate = NCB_DISCOUNT[claimFreeYears] ?? 0;
  const currentSavings = Math.round(currentODPremium * currentNCBRate);
  const nextYearNCBRate = NCB_DISCOUNT[Math.min(claimFreeYears + 1, 5)] ?? 0;
  const nextYearSavings = Math.round(currentODPremium * nextYearNCBRate);

  const maxBarPercent = 50; // max NCB is 50%

  const barData = useMemo(() => {
    return NCB_SLABS.map((slab) => ({
      ...slab,
      width: maxBarPercent > 0 ? (slab.percent / maxBarPercent) * 100 : 0,
      savings: Math.round(currentODPremium * (NCB_DISCOUNT[slab.years] ?? 0)),
    }));
  }, [currentODPremium]);

  if (currentODPremium <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="text-lg">📈</span>
            {t('motorCompare.ncbCalculatorTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {t('motorCompare.claimFreeYears')}
              </label>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-sm px-3 py-1">
                {claimFreeYears} {claimFreeYears === 1 ? t('motorCompare.year') : t('motorCompare.years')}
              </Badge>
            </div>
            <Slider
              min={0}
              max={5}
              step={1}
              value={[claimFreeYears]}
              onValueChange={(val) => setClaimFreeYears(val[0])}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              {NCB_SLABS.map((slab) => (
                <span key={slab.years} className="w-6 text-center">
                  {slab.years}
                </span>
              ))}
            </div>
          </div>

          {/* Hindi + English Result */}
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 space-y-2">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              {t('motorCompare.ncbResult')
                .replace('{years}', String(claimFreeYears))
                .replace('{percent}', (currentNCBRate * 100).toFixed(0))
                .replace('{amount}', formatINR(currentSavings))}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {claimFreeYears < 5 ? (
                <>
                  {t('motorCompare.nextYearSavings')
                    .replace('{year}', String(claimFreeYears + 1))
                    .replace('{percent}', (nextYearNCBRate * 100).toFixed(0))
                    .replace('{amount}', formatINR(nextYearSavings))}
                </>
              ) : (
                <>{t('motorCompare.maxNCBReached')}</>
              )}
            </p>
          </div>

          {/* Visual Bar Chart */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('motorCompare.ncbProgression')}
            </p>
            {barData.map((item, idx) => (
              <div key={item.years} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-8 text-right shrink-0">
                  {item.years}yr
                </span>
                <div className="flex-1 h-5 bg-muted/50 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.width}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                    className={`h-full rounded-full ${BAR_COLORS[idx]} ${
                      claimFreeYears === item.years ? 'ring-2 ring-amber-500' : ''
                    }`}
                  />
                  {item.percent > 0 && (
                    <span className="absolute right-2 top-0 bottom-0 flex items-center text-[10px] font-medium text-muted-foreground">
                      {formatINR(item.savings)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium w-8 shrink-0 text-right">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tip */}
          <p className="text-[10px] text-muted-foreground border-t pt-3">
            {t('motorCompare.ncbTip')}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
