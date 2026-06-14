'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
  aiPlanMatch: { en: 'AI-Powered Recommendations', hi: 'AI रिकमेंडेशन', hg: 'AI-Powered Recommendations' },
  insurers51: { en: '51+ Insurers', hi: '51+ बीमाकर्ता', hg: '51+ Insurers' },
  noBias: { en: 'No Bias / Unbiased Advice', hi: 'निष्पक्ष सलाह', hg: 'No Bias / Unbiased Advice' },
  freeConsult: { en: 'Free Consultation', hi: 'मुफ्त परामर्श', hg: 'Free Consultation' },
  claimHandling: { en: 'Claim Handling', hi: 'क्लेम हैंडलिंग', hg: 'Claim Handling' },
  lifetimeClaims: { en: 'Lifetime Claims Support', hi: 'जीवनभर क्लेम सहायता', hg: 'Lifetime Claims Support' },
  noSpamCalls: { en: 'No Spam Calls', hi: 'कोई स्पैम कॉल नहीं', hg: 'No Spam Calls' },
  whatsappFirst: { en: 'WhatsApp-First', hi: 'व्हाट्सएप-प्रथम', hg: 'WhatsApp-First' },
  transparentCommissions: { en: 'Transparent Commissions', hi: 'पारदर्शी कमीशन', hg: 'Transparent Commissions' },
};

/* ── Cell renderer ─────────────────────────────────────────────────── */
function CellRenderer({ cell, isPaliwal }: { cell: CellValue; isPaliwal: boolean }) {
  switch (cell.type) {
    case 'check':
      return (
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${isPaliwal ? 'bg-[#2563EB]/10 border border-[#2563EB]/20' : 'bg-[#F1F5F9] dark:bg-white/5'}`}>
          <Check className={`w-4 h-4 ${isPaliwal ? 'text-[#2563EB]' : 'text-[#64748B]'}`} strokeWidth={2.5} />
        </span>
      );
    case 'cross':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F1F5F9] dark:bg-white/5">
          <X className="w-4 h-4 text-[#64748B]/30" strokeWidth={2.5} />
        </span>
      );
    case 'dash':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F1F5F9] dark:bg-white/5">
          <Minus className="w-4 h-4 text-[#64748B]/30" strokeWidth={2} />
        </span>
      );
    case 'text':
      return (
        <span className={`text-xs font-medium capitalize ${isPaliwal ? 'text-[#2563EB]' : 'text-[#64748B]/70'} font-body`}>
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
    <section className="py-24 bg-white dark:bg-[#0A1330]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] dark:bg-white/5 rounded-full border border-[#E2E8F0] dark:border-white/10 mb-5 shadow-premium">
            <Sparkles className="w-3 h-3 text-[#E8C872]" />
            <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">Comparison</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8F6F0] leading-[1.1] font-display">
            {heading}
          </h2>
          <p className="mt-4 text-[#64748B] dark:text-[#A6AEC7] text-sm md:text-base max-w-md mx-auto leading-relaxed font-body">
            {isHindi ? 'देखें कि Paliwal Secure कैसे अलग है' : isEnglish ? 'See how Paliwal Secure stands out from the competition' : 'Dekhein Paliwal Secure kaisa alag hai'}
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="overflow-x-auto rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-card/40 backdrop-blur-sm"
        >
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-white/10">
                <th className="text-left px-6 py-5 font-medium text-[#64748B] dark:text-[#A6AEC7] text-xs uppercase tracking-wider font-body">
                  {featureLabel}
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-5 text-center font-medium text-xs uppercase tracking-wider ${
                      col.highlight
                        ? 'text-[#2563EB] font-bold bg-[#2563EB]/[0.04] dark:bg-[#D4A853]/[0.04] border-x border-[#2563EB]/[0.08] dark:border-[#D4A853]/[0.08]'
                        : 'text-[#64748B] dark:text-[#A6AEC7]'
                    } font-body`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{getColumnLabel(col)}</span>
                      {col.highlight && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#2563EB]/10 dark:bg-[#D4A853]/10 border border-[#2563EB]/20 dark:border-[#D4A853]/20 text-[#2563EB] dark:text-[#D4A853] normal-case tracking-normal">
                          {isHindi ? 'अनुशंसित' : isEnglish ? 'Recommended' : 'Recommended'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((row) => (
                <tr
                  key={row.key}
                  className="border-b border-[#E2E8F0]/60 dark:border-white/5 last:border-b-0 transition-colors duration-300 hover:bg-[#F8FAFC]/50 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4 text-[#0F172A] dark:text-[#F8F6F0] font-medium text-sm font-body">
                    {getFeatureLabel(row.key)}
                  </td>
                  {columns.map((col) => {
                    const cellKey = col.key as keyof FeatureRow;
                    const cell = row[cellKey] as CellValue;
                    const isPaliwal = !!col.highlight;
                    return (
                      <td
                        key={col.key}
                        className={`px-6 py-4 text-center transition-colors duration-300 ${
                          isPaliwal ? 'bg-[#2563EB]/[0.02] dark:bg-[#D4A853]/[0.02] border-x border-[#2563EB]/[0.06] dark:border-[#D4A853]/[0.06]' : ''
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
        </motion.div>
      </div>
    </section>
  );
}
