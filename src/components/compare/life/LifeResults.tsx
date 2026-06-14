'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBox } from '@/components/compare/shared/DisclaimerBox';
import { GSTNote } from '@/components/compare/shared/GSTNote';
import { SavingsBanner } from '@/components/compare/shared/SavingsBanner';
import { UpdatedOn } from '@/components/compare/shared/UpdatedOn';
import { DataBadge } from '@/components/compare/shared/DataBadge';
import { WhatsAppCTA } from '@/components/compare/shared/WhatsAppCTA';
import { LifeCard } from '@/components/compare/life/LifeCard';
import { CoverAdequacy } from '@/components/compare/life/CoverAdequacy';
import { formatINR } from '@/lib/compare/compare-engine';
import { LIFE_INSURER_DATA } from '@/lib/compare/life-rates';
import type { LifeInsurerDataItem } from '@/lib/compare/life-rates';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface LifeDetailsResult {
  gender: 'MALE' | 'FEMALE';
  age: number;
  isSmoker: boolean;
  sumAssured: number;
  policyTerm: number;
  payMode: string;
  isROP: boolean;
  annualIncome: number;
  currentLifeCover: number;
}

interface LifeResultsProps {
  quotes: any[];
  lifeDetails: LifeDetailsResult;
}

// ---------------------------------------------------------------------------
// CSR Comparison Chart Component
// ---------------------------------------------------------------------------
function CSRComparisonChart({ quotes }: { quotes: any[] }) {
  // Build CSR data from insurer data
  const csrData = useMemo(() => {
    return quotes
      .map((q) => {
        const data: LifeInsurerDataItem | undefined = LIFE_INSURER_DATA[q.insurerId ?? ''];
        if (!data) return null;
        return {
          insurerId: q.insurerId,
          insurerName: q.insurerName ?? q.insurerId,
          csr: data.csr,
          planName: data.planName,
        };
      })
      .filter(Boolean) as { insurerId: string; insurerName: string; csr: number; planName: string }[];
  }, [quotes]);

  if (csrData.length === 0) return null;

  const maxCSR = Math.max(...csrData.map((d) => d.csr));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-violet-200 dark:border-violet-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            Claim Settlement Ratio (CSR) Comparison
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Higher CSR = better claim settlement track record (IRDAI FY24-25 data)
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {csrData
            .sort((a, b) => b.csr - a.csr)
            .map((item, idx) => {
              const barWidth = (item.csr / 100) * 100;
              const isHighest = item.csr === maxCSR;
              const isMaxLife = item.insurerId === 'MAX_LIFE';
              const isLIC = item.insurerId === 'LIC';

              return (
                <motion.div
                  key={item.insurerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-medium truncate">
                        {item.insurerName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.planName}
                      </span>
                      {isMaxLife && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-[8px] h-3.5 px-1">
                          Highest
                        </Badge>
                      )}
                      {isLIC && (
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 text-[8px] h-3.5 px-1">
                          Govt.
                        </Badge>
                      )}
                    </div>
                    <span className={`text-xs font-bold tabular-nums ${
                      item.csr >= 99 ? 'text-green-700 dark:text-green-400' :
                      item.csr >= 98 ? 'text-emerald-700 dark:text-emerald-400' :
                      'text-amber-700 dark:text-amber-400'
                    }`}>
                      {item.csr.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        isHighest
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : item.csr >= 98.5
                            ? 'bg-gradient-to-r from-violet-400 to-purple-500'
                            : 'bg-gradient-to-r from-amber-400 to-orange-500'
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}

          <div className="mt-3 pt-2 border-t text-[10px] text-muted-foreground">
            <p>💡 CSR above 98% is considered excellent. All 8 insurers have strong claim settlement records.</p>
            <p className="mt-0.5">Source: IRDAI Annual Report FY24-25 | IRDAI minimum: No statutory minimum for life insurers</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// LifeResults Component
// ---------------------------------------------------------------------------
export function LifeResults({ quotes, lifeDetails }: LifeResultsProps) {
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
      <DisclaimerBox category="life" />

      {/* GST Note — emphasizes 0% GST savings */}
      <GSTNote category="life" quoteAmount={bestPremium} />

      {/* Savings Banner */}
      <SavingsBanner
        bestPremium={bestPremium}
        worstPremium={worstPremium}
        category="life"
      />

      {/* Data freshness + source badge */}
      <div className="flex flex-wrap items-center gap-3">
        <UpdatedOn category="life" />
        <DataBadge source="irdai" />
      </div>

      {/* Quote Summary */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h3 className="text-sm font-semibold mb-2">
          🛡️ Term Insurance Comparison
        </h3>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>
            Gender:{' '}
            <strong className="text-foreground">
              {lifeDetails.gender === 'MALE' ? 'Male' : 'Female'}
            </strong>
          </span>
          <span>•</span>
          <span>
            Age:{' '}
            <strong className="text-foreground">{lifeDetails.age} years</strong>
          </span>
          <span>•</span>
          <span>
            Smoker:{' '}
            <strong className={lifeDetails.isSmoker ? 'text-amber-700 dark:text-amber-400' : 'text-green-700 dark:text-green-400'}>
              {lifeDetails.isSmoker ? 'Yes' : 'No'}
            </strong>
          </span>
          <span>•</span>
          <span>
            Sum Assured:{' '}
            <strong className="text-foreground">
              {lifeDetails.sumAssured >= 10000000
                ? `₹${(lifeDetails.sumAssured / 10000000).toFixed(lifeDetails.sumAssured % 10000000 === 0 ? 0 : 1)}Cr`
                : `₹${(lifeDetails.sumAssured / 100000).toFixed(0)}L`}
            </strong>
          </span>
          <span>•</span>
          <span>
            Policy Term:{' '}
            <strong className="text-foreground">{lifeDetails.policyTerm} years</strong>
          </span>
          <span>•</span>
          <span>
            Pay Mode:{' '}
            <strong className="text-foreground">
              {lifeDetails.payMode === 'regular' ? 'Regular' :
               lifeDetails.payMode === 'pay12' ? 'Limited 12yr' :
               lifeDetails.payMode === 'pay15' ? 'Limited 15yr' : 'Single Pay'}
            </strong>
          </span>
          {lifeDetails.isROP && (
            <>
              <span>•</span>
              <span>
                <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 text-[9px] h-4 px-1.5">
                  ROP Variant
                </Badge>
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
          <LifeCard
            key={quote.insurerId ?? quote.insurer ?? idx}
            quote={quote}
            isRecommended={idx === 0}
            isSmoker={lifeDetails.isSmoker}
          />
        ))}
      </div>

      {/* CSR Comparison Chart */}
      <CSRComparisonChart quotes={sortedQuotes} />

      {/* Cover Adequacy Section */}
      {lifeDetails.annualIncome > 0 && (
        <CoverAdequacy
          income={lifeDetails.annualIncome}
          currentCover={lifeDetails.currentLifeCover}
          sumAssured={lifeDetails.sumAssured}
        />
      )}

      {/* WhatsApp CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
                Need Help Choosing the Right Term Plan?
              </h3>
            </div>
            <p className="text-xs text-green-700 dark:text-green-400">
              Our IRDAI-certified advisor can help you understand claim settlement ratios, solvency ratios, and find the best plan for your family&apos;s protection. WhatsApp us for a free consultation.
            </p>
            <WhatsAppCTA
              quote={{
                insurerName: sortedQuotes[0]?.insurerName ?? '',
                totalPremium: bestPremium,
                sumInsured: lifeDetails.sumAssured,
              }}
              userDetails={{
                age: lifeDetails.age,
              }}
              category="life"
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
