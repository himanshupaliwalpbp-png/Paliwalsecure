'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { DisclaimerBox } from '@/components/compare/shared/DisclaimerBox';
import { GSTNote } from '@/components/compare/shared/GSTNote';
import { SavingsBanner } from '@/components/compare/shared/SavingsBanner';
import { UpdatedOn } from '@/components/compare/shared/UpdatedOn';
import { DataBadge } from '@/components/compare/shared/DataBadge';
import { MotorCard } from '@/components/compare/motor/MotorCard';
import { NCBCalculator } from '@/components/compare/motor/NCBCalculator';
import { IDVCalculator } from '@/components/compare/motor/IDVCalculator';
import { formatINR } from '@/lib/compare/compare-engine';

interface MotorResultsProps {
  quotes: any[];
  vehicleDetails: {
    exShowroomPrice: number;
    registrationYear: number;
    vehicleCategory: string;
    makeModel: string;
    ncbYears: number;
  };
}

// ---------------------------------------------------------------------------
// MotorResults Component
// ---------------------------------------------------------------------------
export function MotorResults({ quotes, vehicleDetails }: MotorResultsProps) {
  const { t } = useLanguage();
  // Sort by total premium (cheapest first)
  const sortedQuotes = useMemo(() => {
    if (!quotes || quotes.length === 0) return [];
    return [...quotes].sort((a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity));
  }, [quotes]);

  const bestPremium = sortedQuotes.length > 0 ? sortedQuotes[0].totalPremium : 0;
  const worstPremium = sortedQuotes.length > 0 ? sortedQuotes[sortedQuotes.length - 1].totalPremium : 0;

  // Get the OD premium before NCB for NCB calculator from the cheapest quote
  const bestODPremium = useMemo(() => {
    if (sortedQuotes.length === 0) return 0;
    return sortedQuotes[0].breakdown?.['OD_Premium_Before_NCB'] ?? 0;
  }, [sortedQuotes]);

  if (!quotes || quotes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Disclaimer */}
      <DisclaimerBox category="motor" />

      {/* GST Note */}
      <GSTNote category="motor" quoteAmount={bestPremium} />

      {/* Savings Banner */}
      <SavingsBanner
        bestPremium={bestPremium}
        worstPremium={worstPremium}
        category="motor"
      />

      {/* Data freshness + source badge */}
      <div className="flex flex-wrap items-center gap-3">
        <UpdatedOn category="motor" />
        <DataBadge source="irdai" />
      </div>

      {/* Quote Summary */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h3 className="text-sm font-semibold mb-2">
          {t('motorCompare.comparisonFor')} {vehicleDetails.makeModel || t('motorCompare.yourVehicle')}
        </h3>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>{t('motorCompare.categoryLabel')} <strong className="text-foreground">{vehicleDetails.vehicleCategory}</strong></span>
          <span>•</span>
          <span>{t('motorCompare.idvLabel')} <strong className="text-foreground">{sortedQuotes[0]?.breakdown?.['IDV'] ? formatINR(sortedQuotes[0].breakdown['IDV']) : '—'}</strong></span>
          <span>•</span>
          <span>{t('motorCompare.ncbLabel')} <strong className="text-foreground">{vehicleDetails.ncbYears} {t('motorCompare.years').toLowerCase()}</strong></span>
          <span>•</span>
          <span>{t('motorCompare.cheapestLabel')} <strong className="text-green-700 dark:text-green-400">{formatINR(bestPremium)}</strong></span>
        </div>
      </div>

      {/* Quote Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedQuotes.map((quote, idx) => (
          <MotorCard
            key={quote.insurerId ?? quote.insurer ?? idx}
            quote={quote}
            isRecommended={idx === 0}
          />
        ))}
      </div>

      {/* Bottom Section: NCB Calculator + IDV Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <NCBCalculator currentODPremium={bestODPremium} />
        <IDVCalculator
          exShowroomPrice={vehicleDetails.exShowroomPrice}
          registrationYear={vehicleDetails.registrationYear}
        />
      </div>
    </motion.div>
  );
}
