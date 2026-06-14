'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatINR } from '@/lib/compare/compare-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CoverAdequacyProps {
  income: number;
  currentCover: number;
  sumAssured?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Indian Number Formatter (short form for display)
// ---------------------------------------------------------------------------
function formatShortINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return formatINR(amount);
}

// ---------------------------------------------------------------------------
// Cover Adequacy Component
// ---------------------------------------------------------------------------
export function CoverAdequacy({ income, currentCover, sumAssured, className }: CoverAdequacyProps) {
  const recommendedCover = income * 15;
  const shortfall = Math.max(recommendedCover - currentCover, 0);
  const coveragePercent = recommendedCover > 0
    ? Math.min(Math.round((currentCover / recommendedCover) * 100), 100)
    : 0;
  const isAdequate = currentCover >= recommendedCover;

  // Include new sum assured being considered
  const totalCoverWithNew = currentCover + (sumAssured ?? 0);
  const totalCoveragePercent = recommendedCover > 0
    ? Math.min(Math.round((totalCoverWithNew / recommendedCover) * 100), 100)
    : 0;
  const wouldBeAdequate = totalCoverWithNew >= recommendedCover;

  if (income <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className={`border-violet-200 dark:border-violet-800 ${className ?? ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {isAdequate ? (
              <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            Cover Adequacy Check
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Financial advisors recommend life cover = 15× annual income
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Annual Income
              </p>
              <p className="text-lg font-bold text-foreground">
                {formatShortINR(income)}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Recommended Cover
              </p>
              <p className="text-lg font-bold text-violet-700 dark:text-violet-400">
                {formatShortINR(recommendedCover)}
              </p>
              <p className="text-[10px] text-muted-foreground">(15× income)</p>
            </div>
          </div>

          {/* Current Cover Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current Life Cover</span>
              <span className="text-xs font-medium">{formatShortINR(currentCover)}</span>
            </div>
            <div className="relative">
              <Progress
                value={coveragePercent}
                className={`h-3 ${isAdequate ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{coveragePercent}% of recommended</span>
              <span className="text-[10px] text-muted-foreground">{formatShortINR(recommendedCover)}</span>
            </div>
          </div>

          {/* Shortfall or Adequate */}
          {!isAdequate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                <span className="text-xs font-semibold text-red-800 dark:text-red-300">
                  Cover Shortfall
                </span>
              </div>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                {formatINR(shortfall)}
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                आपके पास {formatShortINR(shortfall)} कम cover है
              </p>
              <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">
                Your current cover is insufficient by {formatShortINR(shortfall)}
              </p>
            </motion.div>
          )}

          {isAdequate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-xs font-semibold text-green-800 dark:text-green-300">
                  Adequately Covered ✅
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Your current life cover of {formatShortINR(currentCover)} meets the recommended {formatShortINR(recommendedCover)}.
              </p>
            </motion.div>
          )}

          {/* If adding new policy */}
          {sumAssured && sumAssured > 0 && (
            <div className="rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 text-[9px] h-4 px-1.5">
                  After New Policy
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">
                  Total cover: {formatShortINR(totalCoverWithNew)} (current + new)
                </span>
                <span className={`font-medium ${wouldBeAdequate ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {totalCoveragePercent}% of recommended
                </span>
              </div>
              <Progress
                value={totalCoveragePercent}
                className={`h-2 ${wouldBeAdequate ? '[&>div]:bg-green-500' : '[&>div]:bg-amber-500'}`}
              />
              {wouldBeAdequate ? (
                <p className="text-[10px] text-green-700 dark:text-green-400 mt-1.5 font-medium">
                  ✅ With this policy, you&apos;ll be adequately covered!
                </p>
              ) : (
                <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1.5">
                  Still {formatShortINR(recommendedCover - totalCoverWithNew)} short of recommended cover
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
