'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Check, X, Minus, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Data ──────────────────────────────────────────────────────────── */
type CellValue = { type: 'check' } | { type: 'cross' } | { type: 'dash' } | { type: 'text'; value: string };

interface FeatureRow {
  key: string;
  paliwal: CellValue;
  ditto: CellValue;
  localAgent: CellValue;
}

const features: FeatureRow[] = [
  { key: 'aiPlanMatch', paliwal: { type: 'check' }, ditto: { type: 'text', value: 'Human-only' }, localAgent: { type: 'dash' } },
  { key: 'insurers51', paliwal: { type: 'check' }, ditto: { type: 'text', value: '20–30' }, localAgent: { type: 'text', value: '2–4' } },
  { key: 'noBias', paliwal: { type: 'check' }, ditto: { type: 'text', value: 'Limited' }, localAgent: { type: 'cross' } },
  { key: 'freeConsult', paliwal: { type: 'check' }, ditto: { type: 'check' }, localAgent: { type: 'text', value: 'Varies' } },
  { key: 'claimHandling', paliwal: { type: 'text', value: 'End-to-end' }, ditto: { type: 'text', value: 'Limited' }, localAgent: { type: 'text', value: 'Varies' } },
  { key: 'lifetimeClaims', paliwal: { type: 'check' }, ditto: { type: 'cross' }, localAgent: { type: 'text', value: 'If active' } },
  { key: 'noSpamCalls', paliwal: { type: 'check' }, ditto: { type: 'check' }, localAgent: { type: 'cross' } },
  { key: 'whatsappFirst', paliwal: { type: 'check' }, ditto: { type: 'cross' }, localAgent: { type: 'text', value: 'Varies' } },
  { key: 'transparentCommissions', paliwal: { type: 'check' }, ditto: { type: 'dash' }, localAgent: { type: 'cross' } },
];

interface ColumnDef {
  key: string;
  label: { en: string; hi: string; hg: string };
  highlight?: boolean;
}

const columns: ColumnDef[] = [
  { key: 'paliwal', label: { en: 'Paliwal Secure', hi: 'पालीवाल सिक्योर', hg: 'Paliwal Secure' }, highlight: true },
  { key: 'ditto', label: { en: 'Ditto', hi: 'Ditto', hg: 'Ditto' } },
  { key: 'localAgent', label: { en: 'Local Agent', hi: 'स्थानीय एजेंट', hg: 'Local Agent' } },
];

/* ── Inline translations ───────────────────────────────────────────── */
const featureLabels: Record<string, { en: string; hi: string; hg: string }> = {
  aiPlanMatch: { en: 'AI-Powered Recommendations', hi: 'AI रिकमेंडेशन', hg: 'AI Recommendations' },
  insurers51: { en: '51+ Insurers', hi: '51+ बीमाकर्ता', hg: '51+ Insurers' },
  noBias: { en: 'No Bias / Unbiased Advice', hi: 'निष्पक्ष सलाह', hg: 'Bina pakshpaat ki salah' },
  freeConsult: { en: 'Free Consultation', hi: 'मुफ्त परामर्श', hg: 'Free Consultation' },
  claimHandling: { en: 'Claim Handling', hi: 'क्लेम हैंडलिंग', hg: 'Claim Handling' },
  lifetimeClaims: { en: 'Lifetime Claims Support', hi: 'जीवनभर क्लेम सहायता', hg: 'Zindagibhar Claim Support' },
  noSpamCalls: { en: 'No Spam Calls', hi: 'कोई स्पैम कॉल नहीं', hg: 'Koi Spam Call Nahi' },
  whatsappFirst: { en: 'WhatsApp-First', hi: 'व्हाट्सएप-प्रथम', hg: 'WhatsApp-First' },
  transparentCommissions: { en: 'Transparent Commissions', hi: 'पारदर्शी कमीशन', hg: 'Pardarshi Commission' },
};

/* ── Animation ─────────────────────────────────────────────────────── */
const tableVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ── Cell renderer ─────────────────────────────────────────────────── */
function CellRenderer({ cell, isPaliwal }: { cell: CellValue; isPaliwal: boolean }) {
  switch (cell.type) {
    case 'check':
      return (
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-200 ${
          isPaliwal
            ? 'bg-[#E6EFEE] dark:bg-[#0F2A28] border border-[#1B4D4A]/25 dark:border-[#2D7A77]/30'
            : 'bg-white dark:bg-white/[0.04] border border-[rgba(14,17,22,0.08)] dark:border-white/[0.08]'
        }`}>
          <Check className="w-3.5 h-3.5 text-[#1B4D4A] dark:text-[#2D7A77]" strokeWidth={2.5} />
        </span>
      );
    case 'cross':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#9B2C2C]/[0.06] dark:bg-[#9B2C2C]/[0.10] border border-[#9B2C2C]/15 dark:border-[#9B2C2C]/25">
          <X className="w-3.5 h-3.5 text-[#9B2C2C] dark:text-[#E57373]" strokeWidth={2} />
        </span>
      );
    case 'dash':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-white/[0.04] border border-[rgba(14,17,22,0.08)] dark:border-white/[0.08]">
          <Minus className="w-3.5 h-3.5 text-[#8B9099] dark:text-[#8B9099]" strokeWidth={2} />
        </span>
      );
    case 'text':
      return (
        <span className={`text-xs font-medium capitalize font-body tabular-nums ${
          isPaliwal
            ? 'text-[#0E1116] dark:text-[#FAF7F2]'
            : 'text-[#4A4F57] dark:text-[#B8BCC2]'
        }`}>
          {cell.value}
        </span>
      );
  }
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function ComparisonMatrix() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const tableRef = useRef<HTMLDivElement>(null);
  const tableInView = useInView(tableRef, { once: true, margin: '-80px' });

  const heading = isHindi ? 'परिवार हमें क्यों चुनते हैं' : isEnglish ? 'Why families choose us' : 'Parivaar humein kyun chunte hain';
  const featureLabel = isHindi ? 'विशेषता' : isEnglish ? 'Feature' : 'Feature';

  const getFeatureLabel = (key: string) => isHindi
    ? featureLabels[key]?.hi ?? featureLabels[key]?.en
    : isEnglish
      ? featureLabels[key]?.en
      : featureLabels[key]?.hg ?? featureLabels[key]?.en;

  const getColumnLabel = (col: ColumnDef) => isHindi
    ? col.label.hi
    : isEnglish
      ? col.label.en
      : col.label.hg;

  return (
    <section className="section-premium bg-[#FAF7F2] dark:bg-[#0E1116]">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mb-14 text-center"
        >
          <div className="btn-pill-dot mb-5 bg-[#F4E5DD] dark:bg-[#3A1E14] text-[#8B3520] dark:text-[#E89572]">
            <Sparkles className="w-3 h-3" />
            <span className="font-body">Comparison</span>
          </div>
          <h2 className="text-display-h2 font-display text-[#0E1116] dark:text-[#FAF7F2] mb-4">
            {heading}
          </h2>
          <p className="text-lead-premium text-[#4A4F57] dark:text-[#B8BCC2] max-w-lg mx-auto">
            {isHindi ? 'देखें कि Paliwal Secure कैसे अलग है' : isEnglish ? 'See how Paliwal Secure stands out from the competition' : 'Dekhein Paliwal Secure kaisa alag hai'}
          </p>
        </motion.div>

        {/* Comparison Table — premium paper card */}
        <motion.div
          ref={tableRef}
          variants={tableVariants}
          initial="hidden"
          animate={tableInView ? 'visible' : 'hidden'}
          className="bg-white dark:bg-[#161A22] border border-[rgba(14,17,22,0.08)] dark:border-white/[0.08] rounded-2xl shadow-premium overflow-hidden"
        >
          {/* Desktop Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-base">
              <thead>
                <tr className="bg-[#0E1116] dark:bg-[#FAF7F2]">
                  {/* Feature label column header */}
                  <th className="text-left px-6 py-5 text-caption-premium text-[#FAF7F2] dark:text-[#0E1116] font-body border-b border-[rgba(14,17,22,0.08)] dark:border-white/[0.08]">
                    {featureLabel}
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-6 py-5 text-center font-body border-b border-[rgba(14,17,22,0.08)] dark:border-white/[0.08] ${
                        col.highlight ? 'bg-[#F4E5DD] dark:bg-[#3A1E14]' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`text-caption-premium ${
                          col.highlight
                            ? 'text-[#8B3520] dark:text-[#E89572]'
                            : 'text-[#FAF7F2]/70 dark:text-[#0E1116]/70'
                        }`}>
                          {getColumnLabel(col)}
                        </span>
                        {col.highlight && (
                          <span className="text-caption-premium bg-[#B8482C] dark:bg-[#D4633F] text-[#FAF7F2] !text-[9px] !gap-1 !px-2 !py-0.5 normal-case !tracking-normal !font-semibold rounded-full inline-flex items-center">
                            <Sparkles className="w-2.5 h-2.5" />
                            {isHindi ? 'अनुशंसित' : isEnglish ? 'Recommended' : 'Recommended'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((row, rowIndex) => (
                  <tr
                    key={row.key}
                    className={`border-b border-[rgba(14,17,22,0.08)] dark:border-white/[0.06] last:border-b-0 transition-colors duration-200 ${
                      rowIndex % 2 === 1
                        ? 'bg-[#FAF7F2]/40 dark:bg-white/[0.015]'
                        : ''
                    } hover:bg-[#FAF7F2]/70 dark:hover:bg-white/[0.03]`}
                  >
                    {/* Feature name */}
                    <td className="px-6 py-4 text-[#0E1116] dark:text-[#FAF7F2] font-medium text-base font-body">
                      {getFeatureLabel(row.key)}
                    </td>
                    {/* Column cells */}
                    {columns.map((col) => {
                      const cellKey = col.key as keyof FeatureRow;
                      const cell = row[cellKey] as CellValue;
                      const isPaliwal = !!col.highlight;
                      return (
                        <td
                          key={col.key}
                          className={`px-6 py-4 text-center transition-colors duration-200 ${
                            isPaliwal
                              ? 'bg-[#F4E5DD]/40 dark:bg-[#3A1E14]/40 border-x border-[#B8482C]/20 dark:border-[#D4633F]/20'
                              : ''
                          }`}
                        >
                          <CellRenderer cell={cell} isPaliwal={isPaliwal} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom summary bar for Paliwal column */}
          <div className="border-t border-[rgba(14,17,22,0.08)] dark:border-white/[0.08] bg-[#FAF7F2]/60 dark:bg-[#1E293B]/60 px-6 py-4">
            <div className="flex items-center justify-center gap-2">
              <span className="btn-pill-dot bg-[#F4E5DD] dark:bg-[#3A1E14] text-[#8B3520] dark:text-[#E89572] !gap-1.5">
                <Sparkles className="w-3 h-3" />
                {isHindi ? 'सबसे अच्छा विकल्प' : isEnglish ? 'Best choice' : 'Best choice'}
              </span>
              <span className="text-body-premium text-[#4A4F57] dark:text-[#B8BCC2] tabular-nums">
                {isHindi ? '9 में से 9 सुविधाएँ' : isEnglish ? '9 of 9 features' : '9 mein se 9 features'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
