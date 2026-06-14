'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IDV_DEPRECIATION_RATES } from '@/lib/compare/motor-rates';
import { formatINR } from '@/lib/compare/compare-engine';

interface IDVCalculatorProps {
  exShowroomPrice: number;
  registrationYear: number;
}

// ---------------------------------------------------------------------------
// Depreciation Timeline Data
// ---------------------------------------------------------------------------
const DEPRECIATION_TIMELINE = [
  { ageKey: 0, label: 'Brand New', ageLabel: '0 yr' },
  { ageKey: 0.5, label: '6 months', ageLabel: '0.5 yr' },
  { ageKey: 1, label: '1 year', ageLabel: '1 yr' },
  { ageKey: 2, label: '2 years', ageLabel: '2 yr' },
  { ageKey: 3, label: '3 years', ageLabel: '3 yr' },
  { ageKey: 4, label: '4 years', ageLabel: '4 yr' },
  { ageKey: 5, label: '5+ years', ageLabel: '5+ yr' },
];

// ---------------------------------------------------------------------------
// IDVCalculator Component
// ---------------------------------------------------------------------------
export function IDVCalculator({ exShowroomPrice, registrationYear }: IDVCalculatorProps) {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const vehicleAge = Math.max(0, currentYear - registrationYear);

  const currentDepreciationKey = vehicleAge === 0 ? 0 : (vehicleAge >= 5 ? 5 : vehicleAge);
  const currentDepreciationRate = IDV_DEPRECIATION_RATES[currentDepreciationKey] ?? 0.50;
  const currentIDV = Math.round(exShowroomPrice * (1 - currentDepreciationRate));

  const timelineData = useMemo(() => {
    return DEPRECIATION_TIMELINE.map((item) => {
      const depRate = IDV_DEPRECIATION_RATES[item.ageKey] ?? 0.50;
      const idv = Math.round(exShowroomPrice * (1 - depRate));
      const isCurrent = item.ageKey === currentDepreciationKey;
      return {
        ...item,
        depreciationRate: depRate,
        idv,
        isCurrent,
      };
    });
  }, [exShowroomPrice, currentDepreciationKey]);

  if (exShowroomPrice <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="text-lg">🚗</span>
            {t('motorCompare.idvDepreciationSchedule')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Current IDV Highlight */}
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              {t('motorCompare.yourCurrentIDV')}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">
              {formatINR(currentIDV)}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="outline" className="text-[10px]">
                {t('motorCompare.ageLabel')} {vehicleAge} {vehicleAge === 1 ? t('motorCompare.yearSingular') : t('motorCompare.yearPlural')}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {t('motorCompare.depreciationLabel')} {(currentDepreciationRate * 100).toFixed(0)}%
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {t('motorCompare.regLabel')} {registrationYear}
              </Badge>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('motorCompare.depreciationOverTime')}
            </p>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

              {timelineData.map((item, idx) => {
                const barWidth = ((1 - item.depreciationRate) * 100);
                return (
                  <motion.div
                    key={item.ageKey}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.06 }}
                    className={`relative flex items-center gap-3 py-2 pl-8 ${
                      item.isCurrent ? 'bg-blue-50 dark:bg-blue-950/20 -mx-2 px-2 rounded-lg' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-[11px] w-3 h-3 rounded-full border-2 ${
                        item.isCurrent
                          ? 'bg-blue-500 border-blue-300 dark:bg-blue-400 dark:border-blue-500'
                          : 'bg-background border-muted-foreground/30'
                      }`}
                    />

                    {/* Age label */}
                    <span className={`text-[10px] w-10 shrink-0 ${
                      item.isCurrent ? 'font-bold text-blue-700 dark:text-blue-400' : 'text-muted-foreground'
                    }`}>
                      {item.ageLabel}
                    </span>

                    {/* Bar */}
                    <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                        className={`h-full rounded-full ${
                          item.isCurrent
                            ? 'bg-blue-500 dark:bg-blue-500'
                            : 'bg-blue-300 dark:bg-blue-700'
                        }`}
                      />
                    </div>

                    {/* Value */}
                    <span className={`text-[10px] w-24 shrink-0 text-right tabular-nums ${
                      item.isCurrent ? 'font-bold text-blue-700 dark:text-blue-400' : 'text-muted-foreground'
                    }`}>
                      {formatINR(item.idv)}
                    </span>

                    {/* Dep % */}
                    <span className={`text-[10px] w-8 shrink-0 text-right ${
                      item.isCurrent ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-muted-foreground/70'
                    }`}>
                      -{(item.depreciationRate * 100).toFixed(0)}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Info Note */}
          <p className="text-[10px] text-muted-foreground border-t pt-3">
            {t('motorCompare.idvInfoNote')}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
