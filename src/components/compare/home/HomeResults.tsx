'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBox } from '@/components/compare/shared/DisclaimerBox';
import { GSTNote } from '@/components/compare/shared/GSTNote';
import { SavingsBanner } from '@/components/compare/shared/SavingsBanner';
import { UpdatedOn } from '@/components/compare/shared/UpdatedOn';
import { DataBadge } from '@/components/compare/shared/DataBadge';
import { HomeCard } from '@/components/compare/home/HomeCard';
import { formatINR } from '@/lib/compare/compare-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface HomeDetailsResult {
  coverType: string;
  propertyType: string;
  structureSI: number;
  contentsSI: number;
  state: string;
  city: string;
  earthquakeCover: boolean;
  burglaryCover: boolean;
}

interface HomeResultsProps {
  quotes: any[];
  homeDetails: HomeDetailsResult;
}

// ---------------------------------------------------------------------------
// Cover Type Label Map
// ---------------------------------------------------------------------------
const COVER_TYPE_LABELS: Record<string, string> = {
  STRUCTURE_ONLY: 'Structure Only',
  STRUCTURE_CONTENTS: 'Structure + Contents',
  CONTENTS_ONLY: 'Contents Only',
};

// ---------------------------------------------------------------------------
// HomeResults Component
// ---------------------------------------------------------------------------
export function HomeResults({ quotes, homeDetails }: HomeResultsProps) {
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

  if (!quotes || quotes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Disclaimer */}
      <DisclaimerBox category="home" />

      {/* GST Note — 18% applicable */}
      <GSTNote category="home" quoteAmount={bestPremium} />

      {/* Savings Banner */}
      <SavingsBanner
        bestPremium={bestPremium}
        worstPremium={worstPremium}
        category="home"
      />

      {/* Data freshness + source badge */}
      <div className="flex flex-wrap items-center gap-3">
        <UpdatedOn category="home" />
        <DataBadge source="irdai" />
      </div>

      {/* Quote Summary */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h3 className="text-sm font-semibold mb-2">
          🏠 Home Insurance Comparison
        </h3>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>
            Cover:{' '}
            <strong className="text-foreground">
              {COVER_TYPE_LABELS[homeDetails.coverType] ?? homeDetails.coverType}
            </strong>
          </span>
          <span>•</span>
          <span>
            State:{' '}
            <strong className="text-foreground">{homeDetails.state}</strong>
          </span>
          <span>•</span>
          <span>
            City:{' '}
            <strong className="text-foreground">{homeDetails.city}</strong>
          </span>
          {homeDetails.structureSI > 0 && (
            <>
              <span>•</span>
              <span>
                Structure SI:{' '}
                <strong className="text-foreground">{formatINR(homeDetails.structureSI)}</strong>
              </span>
            </>
          )}
          {homeDetails.contentsSI > 0 && (
            <>
              <span>•</span>
              <span>
                Contents SI:{' '}
                <strong className="text-foreground">{formatINR(homeDetails.contentsSI)}</strong>
              </span>
            </>
          )}
          {homeDetails.earthquakeCover && (
            <>
              <span>•</span>
              <span>
                <strong className="text-red-600 dark:text-red-400">Earthquake Cover</strong>
              </span>
            </>
          )}
          <span>•</span>
          <span>
            Cheapest:{' '}
            <strong className="text-emerald-700 dark:text-emerald-400">
              {formatINR(bestPremium)}
            </strong>
          </span>
        </div>
      </div>

      {/* Quote Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedQuotes.map((quote, idx) => (
          <HomeCard
            key={quote.insurerId ?? quote.insurer ?? idx}
            quote={quote}
            isRecommended={idx === 0}
            coverType={homeDetails.coverType}
            propertyType={homeDetails.propertyType}
            earthquakeCover={homeDetails.earthquakeCover}
            burglaryCover={homeDetails.burglaryCover}
          />
        ))}
      </div>

      {/* Zone Loading Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              🗺️ Zone Loading Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Home insurance premiums are affected by zone loading based on your property location:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3">
                <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                  🌍 Seismic Zone Loading (1.25×)
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Applies in high-seismic states: Gujarat, Maharashtra, Bihar, Himachal Pradesh,
                  Uttarakhand, J&amp;K, Sikkim, and North-East states. Based on IS 1893 seismic map.
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                  🌊 Flood Zone Loading (1.20×)
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Applies in flood-prone cities: Mumbai, Chennai, Kolkata, Hyderabad, Patna,
                  Guwahati, Srinagar. Both loadings can apply simultaneously.
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                  📋 TAC Fire Tariff
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Structure rates follow Tariff Advisory Committee (TAC) fire tariff guidelines.
                  Earthquake cover uses higher per-₹1000 SI rate.
                </p>
              </div>
              <div className="rounded-lg bg-teal-50 dark:bg-teal-950/30 p-3">
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">
                  💰 GST @ 18%
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Home insurance attracts 18% GST. Premiums shown are inclusive of GST.
                  No GST exemption for home insurance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
