'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingDown, Sparkles, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface SavingsBannerProps {
  bestPremium: number;
  worstPremium: number;
  category: string;
  /** For health/life: the premium amount used to calculate GST savings */
  gstSavingsAmount?: number;
  /** For motor: NCB discount percentage (0-50) */
  ncbPercent?: number;
  /** For motor: NCB discount amount in ₹ */
  ncbSavings?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Indian Number Formatter
// ---------------------------------------------------------------------------
function formatINR(amount: number): string {
  const fixed = Math.round(amount).toString();
  const isNegative = fixed.startsWith('-');
  const absInt = isNegative ? fixed.slice(1) : fixed;

  let formatted: string;
  if (absInt.length <= 3) {
    formatted = absInt;
  } else {
    const last3 = absInt.slice(-3);
    const rest = absInt.slice(0, -3);
    const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formatted = `${grouped},${last3}`;
  }

  return `${isNegative ? '-' : '₹'}${formatted}`;
}

// ---------------------------------------------------------------------------
// Animated Counter Hook
// ---------------------------------------------------------------------------
function useAnimatedCounter(target: number, duration: number = 1200): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.round(target * eased));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [target, duration]);

  return count;
}

// ---------------------------------------------------------------------------
// Category labels for display
// ---------------------------------------------------------------------------
const CATEGORY_LABELS: Record<string, string> = {
  motor: 'Motor Insurance',
  health: 'Health Insurance',
  life: 'Life Insurance',
  travel: 'Travel Insurance',
  home: 'Home Insurance',
};

// ---------------------------------------------------------------------------
// Category-specific savings highlights
// ---------------------------------------------------------------------------
function getCategorySavingsHighlight(
  category: string,
  savings: number,
  savingsPercent: number,
  worstPremium: number,
  gstSavingsAmount?: number,
  ncbPercent?: number,
  ncbSavings?: number,
): { highlight: string; subHighlights: string[] } {
  switch (category) {
    case 'health':
    case 'life': {
      const gstSavings = gstSavingsAmount ?? 0;
      const label = category === 'health' ? 'Health' : 'Term Life';
      return {
        highlight: `${label} — You save ₹${savings.toLocaleString('en-IN')} (${savingsPercent.toFixed(1)}%)`,
        subHighlights: gstSavings > 0
          ? [
              `🎉 0% GST बचत: ₹${gstSavings.toLocaleString('en-IN')} (पिछले साल की तुलना में)`,
              `प्रीमियम तुलना: सबसे सस्ता vs सबसे महँगा (${formatINR(worstPremium)})`,
            ]
          : [
              `प्रीमियम तुलना: सबसे सस्ता vs सबसे महँगा (${formatINR(worstPremium)})`,
            ],
      };
    }
    case 'motor': {
      const ncbHighlights: string[] = [];
      if (ncbPercent && ncbPercent > 0 && ncbSavings && ncbSavings > 0) {
        ncbHighlights.push(`🚗 NCB ${ncbPercent}% छूट: ₹${ncbSavings.toLocaleString('en-IN')} की बचत`);
      }
      ncbHighlights.push(`🔄 इंश्योरर बदलने पर अतिरिक्त बचत संभव`);
      return {
        highlight: `Motor — You save ₹${savings.toLocaleString('en-IN')} (${savingsPercent.toFixed(1)}%)`,
        subHighlights: ncbHighlights,
      };
    }
    case 'travel':
      return {
        highlight: `Travel — You save ₹${savings.toLocaleString('en-IN')} (${savingsPercent.toFixed(1)}%)`,
        subHighlights: [`सबसे महँगा कोटेशन: ${formatINR(worstPremium)}`],
      };
    case 'home':
      return {
        highlight: `Home — You save ₹${savings.toLocaleString('en-IN')} (${savingsPercent.toFixed(1)}%)`,
        subHighlights: [`सबसे महँगा कोटेशन: ${formatINR(worstPremium)}`],
      };
    default:
      return {
        highlight: `You save ₹${savings.toLocaleString('en-IN')} (${savingsPercent.toFixed(1)}%)`,
        subHighlights: [],
      };
  }
}

// ---------------------------------------------------------------------------
// Savings Banner Component
// ---------------------------------------------------------------------------
export function SavingsBanner({
  bestPremium,
  worstPremium,
  category,
  gstSavingsAmount,
  ncbPercent,
  ncbSavings,
  className,
}: SavingsBannerProps) {
  const savings = worstPremium - bestPremium;
  const savingsPercent = worstPremium > 0 ? ((savings / worstPremium) * 100) : 0;
  const animatedSavings = useAnimatedCounter(savings);

  if (savings <= 0 || worstPremium <= 0) {
    return null;
  }

  const { highlight, subHighlights } = getCategorySavingsHighlight(
    category,
    savings,
    savingsPercent,
    worstPremium,
    gstSavingsAmount,
    ncbPercent,
    ncbSavings,
  );

  // Choose gradient based on category
  const isHealthOrLife = category === 'health' || category === 'life';
  const gradientClasses = isHealthOrLife
    ? 'from-emerald-600 to-teal-500 dark:from-emerald-800 dark:to-teal-700'
    : 'from-green-600 to-emerald-500 dark:from-green-800 dark:to-emerald-700';

  const IconComponent = isHealthOrLife ? Sparkles : category === 'motor' ? Percent : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card
        className={`border-green-300 bg-gradient-to-r ${gradientClasses} text-white shadow-lg ${className ?? ''}`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/20 shrink-0">
              <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-green-100">
                {CATEGORY_LABELS[category] ?? category} — You save
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl sm:text-3xl font-bold tracking-tight">
                  ₹{animatedSavings.toLocaleString('en-IN')}
                </span>
                <span className="text-sm sm:text-base font-semibold text-green-100">
                  ({savingsPercent.toFixed(1)}%)
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-green-200 mt-1">
                vs the most expensive quote of {formatINR(worstPremium)}
              </p>

              {/* Category-specific sub-highlights */}
              {subHighlights.length > 0 && (
                <div className="mt-2 space-y-0.5">
                  {subHighlights.map((sub, idx) => (
                    <p key={idx} className="text-[10px] sm:text-xs text-green-100 font-medium">
                      {sub}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
