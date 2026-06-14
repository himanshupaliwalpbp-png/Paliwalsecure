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
import { TravelCard } from '@/components/compare/travel/TravelCard';
import { formatINR } from '@/lib/compare/compare-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface TravelDetailsResult {
  destination: string;
  tripDurationDays: number;
  adults: number;
  children: number;
  seniors: number;
  medicalCover: number;
  addons: string[];
  departureDate: string;
}

interface TravelResultsProps {
  quotes: any[];
  travelDetails: TravelDetailsResult;
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
// TravelResults Component
// ---------------------------------------------------------------------------
export function TravelResults({ quotes, travelDetails }: TravelResultsProps) {
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

  const totalTravellers =
    travelDetails.adults + travelDetails.children + travelDetails.seniors;

  if (!quotes || quotes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Disclaimer */}
      <DisclaimerBox category="travel" />

      {/* GST Note — 18% applicable */}
      <GSTNote category="travel" quoteAmount={bestPremium} />

      {/* Savings Banner */}
      <SavingsBanner
        bestPremium={bestPremium}
        worstPremium={worstPremium}
        category="travel"
      />

      {/* Data freshness + source badge */}
      <div className="flex flex-wrap items-center gap-3">
        <UpdatedOn category="travel" />
        <DataBadge source="irdai" />
      </div>

      {/* Quote Summary */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h3 className="text-sm font-semibold mb-2">
          ✈️ Travel Insurance Comparison
        </h3>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>
            Destination:{' '}
            <strong className="text-foreground">
              {DESTINATION_LABELS[travelDetails.destination] ?? travelDetails.destination}
            </strong>
          </span>
          <span>•</span>
          <span>
            Duration:{' '}
            <strong className="text-foreground">{travelDetails.tripDurationDays} days</strong>
          </span>
          <span>•</span>
          <span>
            Travellers:{' '}
            <strong className="text-foreground">
              {travelDetails.adults}A + {travelDetails.children}C + {travelDetails.seniors}S
            </strong>
          </span>
          <span>•</span>
          <span>
            Medical Cover:{' '}
            <strong className="text-foreground">
              ${(travelDetails.medicalCover / 1000).toFixed(0)}K
            </strong>
          </span>
          {travelDetails.addons.length > 0 && (
            <>
              <span>•</span>
              <span>
                Add-ons:{' '}
                <strong className="text-foreground">{travelDetails.addons.length}</strong>
              </span>
            </>
          )}
          <span>•</span>
          <span>
            Cheapest:{' '}
            <strong className="text-teal-700 dark:text-teal-400">
              {formatINR(bestPremium)}
            </strong>
          </span>
        </div>
      </div>

      {/* Quote Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedQuotes.map((quote, idx) => (
          <TravelCard
            key={quote.insurerId ?? quote.insurer ?? idx}
            quote={quote}
            isRecommended={idx === 0}
            tripDurationDays={travelDetails.tripDurationDays}
            destination={travelDetails.destination}
            medicalCover={travelDetails.medicalCover}
            addons={travelDetails.addons}
          />
        ))}
      </div>

      {/* Travel Insurance Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-teal-200 dark:border-teal-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              💡 Travel Insurance Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg bg-teal-50 dark:bg-teal-950/30 p-3">
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">
                  Senior Citizens (60+)
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Premium is 2.8× the adult rate for travellers aged 60+. Consider separate policies for seniors to optimise costs.
                </p>
              </div>
              <div className="rounded-lg bg-cyan-50 dark:bg-cyan-950/30 p-3">
                <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 mb-1">
                  Long-Trip Discounts
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Trips over 30 days get 5% off; over 60 days get 10% off base premium. Already applied in quotes.
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                  USA/Canada Travel
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Worldwide incl USA policies cost 40-50% more due to high medical costs in USA. Choose higher medical cover ($250K+) for USA.
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                  GST @ 18%
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Travel insurance attracts 18% GST. Premiums shown are inclusive of GST. No GST exemption for travel insurance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
