'use client';

import { Shield, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: 0.1 * i,
      ease: 'easeOut' as const,
    },
  }),
};

export default function PolicyholderRightsSection() {
  const { t } = useLanguage();

  const rights = [
    {
      icon: Shield,
      title: t('rights.moratorium.title'),
      color: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      borderColor: 'border-blue-200 dark:border-blue-800/40',
      content: (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('rights.moratorium.desc')}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            {t('rights.moratorium.source')}
          </p>
        </>
      ),
    },
    {
      icon: Clock,
      title: t('rights.cashless.title'),
      color: 'text-teal-700 dark:text-[#00A9A6]',
      iconBg: 'bg-teal-100 dark:bg-teal-900/40',
      borderColor: 'border-teal-200 dark:border-teal-800/40',
      content: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700 dark:bg-[#00A9A6]" />
            {t('rights.cashless.preAuth')} <strong className="text-slate-800 dark:text-white">{t('rights.cashless.preAuthTime')}</strong> {t('rights.cashless.preAuthSuffix')}
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700 dark:bg-[#00A9A6]" />
            {t('rights.cashless.discharge')} <strong className="text-slate-800 dark:text-white">{t('rights.cashless.dischargeTime')}</strong> {t('rights.cashless.dischargeSuffix')}
          </li>
          <li className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            {t('rights.cashless.mandated')}
          </li>
        </ul>
      ),
    },
    {
      icon: AlertCircle,
      title: t('rights.appeal.title'),
      color: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      borderColor: 'border-amber-200 dark:border-amber-800/40',
      content: (
        <ol className="space-y-2.5">
          <li className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 text-xs font-semibold text-amber-700 dark:text-amber-300">
              1
            </span>
            <span>
              <strong className="text-slate-800 dark:text-white">{t('rights.appeal.step1.title')}</strong> — {t('rights.appeal.step1.desc')}
            </span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 text-xs font-semibold text-amber-700 dark:text-amber-300">
              2
            </span>
            <span>
              <strong className="text-slate-800 dark:text-white">{t('rights.appeal.step2.title')}</strong> — {t('rights.appeal.step2.desc')}
            </span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 text-xs font-semibold text-amber-700 dark:text-amber-300">
              3
            </span>
            <span>
              <strong className="text-slate-800 dark:text-white">{t('rights.appeal.step3.title')}</strong> — {t('rights.appeal.step3.desc')}
            </span>
          </li>
        </ol>
      ),
    },
    {
      icon: RefreshCw,
      title: t('rights.portability.title'),
      color: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      borderColor: 'border-green-200 dark:border-green-800/40',
      content: (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('rights.portability.desc')}
          </p>
        </>
      ),
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-teal-700 dark:text-[#00A9A6]" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          {t('rights.heading')}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rights.map((right, index) => {
          const Icon = right.icon;
          return (
            <motion.div
              key={right.title}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card className={`h-full ${right.borderColor}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${right.iconBg}`}
                    >
                      <Icon className={`h-5 w-5 ${right.color}`} />
                    </div>
                    <span className="text-sm text-slate-800 dark:text-white">
                      {right.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>{right.content}</CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xs text-center text-slate-400 dark:text-slate-500"
      >
        {t('rights.disclaimer')}
      </motion.p>
    </motion.section>
  );
}
