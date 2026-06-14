'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { isGSTExempt, getGSTRate, HEALTH_GST_EXEMPTION_DATE, LIFE_GST_EXEMPTION_DATE } from '@/lib/compare/gst-rules';

export type GSTCategory = 'motor' | 'health' | 'life' | 'travel' | 'home';

interface GSTNoteProps {
  category: GSTCategory;
  quoteAmount?: number;
  className?: string;
}

// Category-specific GST messages
const GST_MESSAGES: Record<GSTCategory, { exempt: string; nonExempt: string }> = {
  motor: {
    exempt: '',
    nonExempt: 'GST @18% applicable on all motor insurance premiums',
  },
  health: {
    exempt: 'GST 0% applicable (from 22 Sept 2025, GST Council 56th meeting)',
    nonExempt: '',
  },
  life: {
    exempt: 'GST 0% applicable (from 22 Sept 2025, GST Council 56th meeting)',
    nonExempt: '',
  },
  travel: {
    exempt: '',
    nonExempt: 'GST @18% included in premium',
  },
  home: {
    exempt: '',
    nonExempt: 'GST @18% included in premium',
  },
};

export function GSTNote({ category, quoteAmount, className }: GSTNoteProps) {
  const exempt = isGSTExempt(category);
  const currentRate = getGSTRate(category);
  const oldRate = 0.18; // previous GST rate

  // For health/life: show savings vs old 18% rate
  if (exempt) {
    const exemptionDate = category === 'health' ? HEALTH_GST_EXEMPTION_DATE : LIFE_GST_EXEMPTION_DATE;
    const formattedDate = new Date(exemptionDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const categoryLabel = category === 'health' ? 'Health' : 'Term Life';

    // Calculate savings: premium * 0.18 (what you would have paid as GST last year)
    const gstSavings = quoteAmount && quoteAmount > 0 ? Math.round(quoteAmount * oldRate) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Card className={`border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/40 ${className ?? ''}`}>
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🟢</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                    0% GST
                  </span>
                  <Badge className="bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100 text-[10px]">
                    Exempt from {formattedDate}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                  {GST_MESSAGES[category].exempt}
                </p>
                <p className="mt-1 text-[10px] text-green-600 dark:text-green-400">
                  GST Council 56th Meeting — {categoryLabel} insurance GST removed w.e.f. {formattedDate}
                </p>
              </div>
            </div>

            {/* Savings banner for health/life */}
            {gstSavings > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-800 dark:to-emerald-700 p-3 text-white"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <div>
                    <p className="text-sm font-semibold">
                      आप पिछले साल की तुलना में ₹{gstSavings.toLocaleString('en-IN')} बचा रहे हैं (0% GST)
                    </p>
                    <p className="text-[10px] text-green-100 mt-0.5">
                      You save ₹{gstSavings.toLocaleString('en-IN')} compared to last year&apos;s GST on {categoryLabel} insurance
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // For motor/travel/home: show applicable GST
  const gstAmount = quoteAmount ? Math.round(quoteAmount * currentRate) : 0;
  const categoryMessage = GST_MESSAGES[category]?.nonExempt ?? `GST @${(currentRate * 100).toFixed(0)}% applicable`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className={`border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 ${className ?? ''}`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📋</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {categoryMessage}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {category === 'motor' ? 'Additional on premium' : 'Included in premium'}
                </Badge>
              </div>
              {gstAmount > 0 && (
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  GST amount: ₹{gstAmount.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
