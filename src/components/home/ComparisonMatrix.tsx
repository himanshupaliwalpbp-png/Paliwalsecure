'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';
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
  {
    key: 'aiPlanMatch',
    paliwal: { type: 'check' },
    ditto: { type: 'text', value: 'Human-only' },
    localAgent: { type: 'dash' },
  },
  {
    key: 'insurers51',
    paliwal: { type: 'check' },
    ditto: { type: 'text', value: '20–30' },
    localAgent: { type: 'text', value: '2–4' },
  },
  {
    key: 'noBias',
    paliwal: { type: 'check' },
    ditto: { type: 'text', value: 'Limited' },
    localAgent: { type: 'cross' },
  },
  {
    key: 'freeConsult',
    paliwal: { type: 'check' },
    ditto: { type: 'check' },
    localAgent: { type: 'text', value: 'Varies' },
  },
  {
    key: 'claimHandling',
    paliwal: { type: 'text', value: 'End-to-end' },
    ditto: { type: 'text', value: 'Limited' },
    localAgent: { type: 'text', value: 'Varies' },
  },
  {
    key: 'lifetimeClaims',
    paliwal: { type: 'check' },
    ditto: { type: 'cross' },
    localAgent: { type: 'text', value: 'If active' },
  },
  {
    key: 'noSpamCalls',
    paliwal: { type: 'check' },
    ditto: { type: 'check' },
    localAgent: { type: 'cross' },
  },
  {
    key: 'whatsappFirst',
    paliwal: { type: 'check' },
    ditto: { type: 'cross' },
    localAgent: { type: 'text', value: 'Varies' },
  },
  {
    key: 'transparentCommissions',
    paliwal: { type: 'check' },
    ditto: { type: 'dash' },
    localAgent: { type: 'cross' },
  },
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
  const accentColor = isPaliwal ? 'text-primary' : 'text-muted-foreground';
  const textColor = isPaliwal ? 'text-primary' : 'text-muted-foreground';

  switch (cell.type) {
    case 'check':
      return (
        <span className={`inline-flex items-center justify-center ${accentColor}`}>
          <Check className="w-5 h-5" strokeWidth={2.5} />
        </span>
      );
    case 'cross':
      return (
        <span className="inline-flex items-center justify-center text-muted-foreground/40">
          <X className="w-5 h-5" strokeWidth={2.5} />
        </span>
      );
    case 'dash':
      return (
        <span className="inline-flex items-center justify-center text-muted-foreground/50">
          <Minus className="w-5 h-5" strokeWidth={2} />
        </span>
      );
    case 'text':
      return (
        <span className={`text-xs font-medium capitalize ${textColor}`}>
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
  const featureLabel = isHindi ? 'विशेषता' : 'Feature';

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
    <section className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {heading}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            {isHindi
              ? 'देखें कि Paliwal Secure कैसे अलग है'
              : isEnglish
                ? 'See how Paliwal Secure stands out from the competition'
                : 'Dekhein Paliwal Secure kaisa alag hai'}
          </p>
        </motion.div>

        {/* ── Table ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="overflow-x-auto border border-border rounded-2xl"
        >
          <table className="w-full min-w-[680px] text-sm">
            {/* Head */}
            <thead>
              <tr className="bg-card border-b border-border">
                <th className="text-left px-6 py-4 font-medium text-foreground">
                  {featureLabel}
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-4 text-center font-medium ${
                      col.highlight
                        ? 'text-primary font-semibold bg-primary/5 border-x border-primary/20'
                        : 'text-foreground'
                    }`}
                  >
                    {getColumnLabel(col)}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {features.map((row, i) => (
                <tr
                  key={row.key}
                  className={`border-b border-border last:border-b-0 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 text-foreground font-medium text-sm">
                    {getFeatureLabel(row.key)}
                  </td>
                  {columns.map((col) => {
                    const cellKey = col.key as keyof FeatureRow;
                    const cell = row[cellKey] as CellValue;
                    const isPaliwal = !!col.highlight;
                    return (
                      <td
                        key={col.key}
                        className={`px-6 py-4 text-center ${
                          isPaliwal ? 'bg-primary/5 border-x border-primary/20' : ''
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
