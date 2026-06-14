'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X, Info, Shield, Banknote, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

// ============================================
// DATA (Source: IRDAI, Insurance Samadhan, ED Reports)
// ============================================

const misSellingStats = {
  totalBankCommission: 21773, // ₹ Crore (FY24, Top 15 banks)
  highestBankCommission: { name: 'HDFC Bank', amount: 6467 },
  misSellingComplaintsIncrease: 11.2, // YoY %
  healthMisSellingShare: 68, // % of total mis-selling complaints
  lifeMisSellingShare: 25.5,
  estimatedFraudClaims: '10-15%', // industry estimate
  majorFraudCase: { amount: 500, location: 'Uttar Pradesh', description: 'Forged documents scam' },
  ageGroupMostAffected: '31-40 years',
  topStateComplaints: 'Uttar Pradesh (16%)',
  bankEarningsShare: { bank: 'Axis Bank', share: 25.2 }, // commission as % of earnings
  policyLapseRate: 43.3, // % of benefits paid due to churning
};

// Tip translation keys
const preventionTipKeys = [
  'misSelling.tip1',
  'misSelling.tip2',
  'misSelling.tip3',
  'misSelling.tip4',
  'misSelling.tip5',
  'misSelling.tip6',
  'misSelling.tip7',
];

// Red flag translation keys
const redFlagKeys = [
  'misSelling.redFlag1',
  'misSelling.redFlag2',
  'misSelling.redFlag3',
  'misSelling.redFlag4',
  'misSelling.redFlag5',
  'misSelling.redFlag6',
];

export default function MisSellingAlert() {
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'alert' | 'tips' | 'redflags'>('alert');
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
    >
      <Card className="border-orange-300 dark:border-orange-800/40 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 shadow-lg shadow-orange-200/30 dark:shadow-none">
        <CardContent className="p-4 md:p-6">
          {/* Header with close button */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-bold text-orange-800 dark:text-orange-300">
                {t('misSelling.title')}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setIsVisible(false)}
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tab navigation */}
          <div className="flex flex-wrap gap-2 mb-4 border-b border-orange-200 dark:border-orange-800/30 pb-2">
            <button
              onClick={() => setActiveTab('alert')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'alert'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70'
              }`}
            >
              {t('misSelling.tab.alert')}
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'tips'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70'
              }`}
            >
              {t('misSelling.tab.tips')}
            </button>
            <button
              onClick={() => setActiveTab('redflags')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'redflags'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70'
              }`}
            >
              {t('misSelling.tab.redFlags')}
            </button>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'alert' && (
              <motion.div
                key="alert"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                    <Banknote className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('misSelling.stat.commission')}</p>
                      <p className="font-bold text-lg text-slate-800 dark:text-white">
                        ₹{misSellingStats.totalBankCommission.toLocaleString()} Crore
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t('misSelling.stat.hdfcAlone')}: ₹{misSellingStats.highestBankCommission.amount} Cr
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('misSelling.stat.misSellingComplaints')}</p>
                      <p className="font-bold text-lg text-slate-800 dark:text-white">
                        +{misSellingStats.misSellingComplaintsIncrease}%
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t('misSelling.stat.healthShare')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('misSelling.stat.mostAffected')}</p>
                      <p className="font-bold text-lg text-slate-800 dark:text-white">
                        {misSellingStats.ageGroupMostAffected}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t('misSelling.stat.youngTargeted')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('misSelling.stat.fraudClaims')}</p>
                      <p className="font-bold text-lg text-slate-800 dark:text-white">
                        {misSellingStats.estimatedFraudClaims}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t('misSelling.stat.upScam')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground border-t border-orange-200 dark:border-orange-800/30 pt-3 mt-2">
                  <p className="flex items-start gap-1">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>
                      {t('misSelling.stat.source')}
                    </span>
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                <ul className="list-disc list-inside space-y-1.5 text-sm">
                  {preventionTipKeys.map((tipKey, idx) => (
                    <li key={idx} className="text-slate-700 dark:text-slate-300">{t(tipKey)}</li>
                  ))}
                </ul>
                <div className="mt-3 p-2 bg-green-50 dark:bg-green-950/30 rounded-lg text-sm">
                  <strong>{t('misSelling.proTip')}</strong> {t('misSelling.proTipDesc')}
                </div>
              </motion.div>
            )}

            {activeTab === 'redflags' && (
              <motion.div
                key="redflags"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                <ul className="list-disc list-inside space-y-1.5 text-sm">
                  {redFlagKeys.map((flagKey, idx) => (
                    <li key={idx} className="text-red-700 dark:text-red-300">{t(flagKey)}</li>
                  ))}
                </ul>
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/30 rounded-lg text-sm">
                  <strong>{t('misSelling.redFlagAction')}</strong>{' '}
                  <span className="font-semibold">1800-258-1111</span> {t('misSelling.irdaiHelpline')}.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
