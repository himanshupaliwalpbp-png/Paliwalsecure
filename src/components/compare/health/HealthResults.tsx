'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DisclaimerBox } from '@/components/compare/shared/DisclaimerBox';
import { GSTNote } from '@/components/compare/shared/GSTNote';
import { SavingsBanner } from '@/components/compare/shared/SavingsBanner';
import { UpdatedOn } from '@/components/compare/shared/UpdatedOn';
import { DataBadge } from '@/components/compare/shared/DataBadge';
import { CompareTable, type ColumnDef } from '@/components/compare/shared/CompareTable';
import { HealthCard } from '@/components/compare/health/HealthCard';
import { DiseaseRecommendations } from '@/components/compare/health/DiseaseRecommendations';
import { formatINR } from '@/lib/compare/compare-engine';
import { HEALTH_INSURER_DATA } from '@/lib/compare/health-rates';
import type { HealthInsurerDataItem } from '@/lib/compare/health-rates';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface HealthDetailsResult {
  age: number;
  sumInsured: number;
  city: string;
  isFloater: boolean;
  adults: number;
  children: number;
  ped: string[];
  addons: string[];
  policyType: string;
}

interface HealthResultsProps {
  quotes: any[];
  healthDetails: HealthDetailsResult;
}

// ---------------------------------------------------------------------------
// Section 80D Tax Savings Calculator
// ---------------------------------------------------------------------------
function Section80DCalculator({ premium, isFloater, adults, childCount }: {
  premium: number;
  isFloater: boolean;
  adults: number;
  childCount: number;
}) {
  // Section 80D limits FY 2025-26
  const SELF_LIMIT = 25000;
  const PARENTS_LIMIT = 25000; // additional for parents
  const SENIOR_CITIZEN_LIMIT = 50000;
  const PREVENTIVE_HEALTH_CHECKUP = 5000;

  // For self/family
  const applicableLimit = isFloater
    ? Math.min(SELF_LIMIT + (adults > 1 ? PARENTS_LIMIT : 0), 50000)
    : SELF_LIMIT;

  const taxSavingUnder80D = Math.min(premium, applicableLimit);
  const taxSavingAt30Perc = Math.round(taxSavingUnder80D * 0.30); // 30% tax bracket
  const taxSavingAt20Perc = Math.round(taxSavingUnder80D * 0.20); // 20% tax bracket
  const preventiveDeduction = Math.min(PREVENTIVE_HEALTH_CHECKUP, premium);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-4 w-4 text-green-600 dark:text-green-400" />
            Section 80D Tax Savings
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Save tax on health insurance premium under Section 80D
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Main tax saving */}
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Tax Saving (30% bracket)
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatINR(taxSavingAt30Perc)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Tax Saving (20% bracket): {formatINR(taxSavingAt20Perc)}
            </p>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Premium Paid</span>
              <span className="font-medium">{formatINR(premium)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">80D Limit (Self/Family)</span>
              <span className="font-medium">{formatINR(applicableLimit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deductible Amount</span>
              <span className="font-medium">{formatINR(taxSavingUnder80D)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preventive Health Check-up</span>
              <span className="font-medium">Up to {formatINR(preventiveDeduction)}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-tight">
              Under Section 80D, you can claim deduction up to ₹25,000 (₹50,000 for senior citizens)
              for health insurance premium paid for self, spouse, and children. Additional ₹25,000 (₹50,000
              for senior citizens) for parents. GST exemption means more of your premium is now deductible.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Feature Comparison Table Columns
// ---------------------------------------------------------------------------
function getFeatureComparisonColumns(): ColumnDef[] {
  return [
    {
      key: 'insurerName',
      label: 'Insurer',
      format: (value: string) => (
        <span className="font-medium text-xs">{value}</span>
      ),
    },
    {
      key: 'roomRent',
      label: 'Room Rent',
      format: (value: string) => {
        const isGood = value.toLowerCase().includes('no limit');
        return (
          <span className={`text-xs ${isGood ? 'text-green-700 dark:text-green-400 font-medium' : 'text-muted-foreground'}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'coPayment',
      label: 'Co-payment',
      format: (value: string) => {
        const isGood = value.toLowerCase() === 'none';
        return (
          <span className={`text-xs ${isGood ? 'text-green-700 dark:text-green-400 font-medium' : 'text-muted-foreground'}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'restoration',
      label: 'Restoration',
      format: (value: string) => {
        const isGood = value.toLowerCase().includes('unlimited');
        return (
          <span className={`text-xs ${isGood ? 'text-green-700 dark:text-green-400 font-medium' : 'text-muted-foreground'}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'waitingPeriod',
      label: 'Waiting Period',
      format: (value: string) => (
        <span className="text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'ncb',
      label: 'NCB',
      format: (value: string) => (
        <span className="text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'totalPremium',
      label: 'Premium',
    },
  ];
}

// ---------------------------------------------------------------------------
// HealthResults Component
// ---------------------------------------------------------------------------
export function HealthResults({ quotes, healthDetails }: HealthResultsProps) {
  // Sort by total premium (cheapest first)
  const sortedQuotes = useMemo(() => {
    if (!quotes || quotes.length === 0) return [];
    return [...quotes].sort(
      (a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity)
    );
  }, [quotes]);

  const bestPremium = sortedQuotes.length > 0 ? sortedQuotes[0].totalPremium : 0;
  const worstPremium =
    sortedQuotes.length > 0 ? sortedQuotes[sortedQuotes.length - 1].totalPremium : 0;

  // Prepare feature comparison data
  const featureComparisonData = useMemo(() => {
    return sortedQuotes.map((q) => {
      const insurerData: HealthInsurerDataItem | undefined =
        HEALTH_INSURER_DATA[q.insurerId ?? ''];
      return {
        insurerName: q.insurerName ?? q.insurerId ?? '—',
        roomRent: insurerData?.roomRentLimit ?? '—',
        coPayment: insurerData?.coPayment ?? '—',
        restoration: insurerData?.restoration ?? '—',
        waitingPeriod: insurerData?.waitingPeriod ?? '—',
        ncb: insurerData?.ncb ?? '—',
        totalPremium: q.totalPremium ?? 0,
      };
    });
  }, [sortedQuotes]);

  if (!quotes || quotes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Disclaimer */}
      <DisclaimerBox category="health" />

      {/* GST Note — emphasizes 0% GST savings */}
      <GSTNote category="health" quoteAmount={bestPremium} />

      {/* Savings Banner */}
      <SavingsBanner
        bestPremium={bestPremium}
        worstPremium={worstPremium}
        category="health"
      />

      {/* Data freshness + source badge */}
      <div className="flex flex-wrap items-center gap-3">
        <UpdatedOn category="health" />
        <DataBadge source="irdai" />
      </div>

      {/* Quote Summary */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h3 className="text-sm font-semibold mb-2">
          🏥 Health Insurance Comparison
        </h3>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>
            Policy:{' '}
            <strong className="text-foreground">
              {healthDetails.isFloater ? 'Family Floater' : 'Individual'}
            </strong>
          </span>
          <span>•</span>
          <span>
            Age:{' '}
            <strong className="text-foreground">{healthDetails.age} years</strong>
          </span>
          <span>•</span>
          <span>
            Sum Insured:{' '}
            <strong className="text-foreground">
              ₹{(healthDetails.sumInsured / 100000).toFixed(0)}L
            </strong>
          </span>
          <span>•</span>
          <span>
            City:{' '}
            <strong className="text-foreground">{healthDetails.city}</strong>
          </span>
          {healthDetails.isFloater && (
            <>
              <span>•</span>
              <span>
                Members:{' '}
                <strong className="text-foreground">
                  {healthDetails.adults}A + {healthDetails.children}C
                </strong>
              </span>
            </>
          )}
          <span>•</span>
          <span>
            Cheapest:{' '}
            <strong className="text-green-700 dark:text-green-400">
              {formatINR(bestPremium)}
            </strong>
          </span>
        </div>
      </div>

      {/* Quote Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedQuotes.map((quote, idx) => (
          <HealthCard
            key={quote.insurerId ?? quote.insurer ?? idx}
            quote={quote}
            isRecommended={idx === 0}
            pedList={healthDetails.ped}
          />
        ))}
      </div>

      {/* Feature Comparison Table */}
      <CompareTable
        quotes={featureComparisonData}
        columns={getFeatureComparisonColumns()}
        category="health"
      />

      {/* Bottom Section: Tax Savings + Disease Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Section 80D Tax Savings */}
        <Section80DCalculator
          premium={bestPremium}
          isFloater={healthDetails.isFloater}
          adults={healthDetails.adults}
          childCount={healthDetails.children}
        />

        {/* Disease-Specific Recommendations */}
        {healthDetails.ped &&
          !healthDetails.ped.includes('none') &&
          healthDetails.ped.length > 0 && (
            <DiseaseRecommendations ped={healthDetails.ped} />
          )}
      </div>
    </motion.div>
  );
}
