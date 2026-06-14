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
  switch (cell.type) {
    case 'check':
      return (
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${isPaliwal ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}`}>
          <Check className={`w-4 h-4 ${isPaliwal ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={2.5} />
        </span>
      );
    case 'cross':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted/30">
          <X className="w-4 h-4 text-muted-foreground/30" strokeWidth={2.5} />
        </span>
      );
    case 'dash':
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted/30">
          <Minus className="w-4 h-4 text-muted-foreground/30" strokeWidth={2} />
        </span>
      );
    case 'text':
      return (
        <span className={`text-xs font-medium capitalize ${isPaliwal ? 'text-primary' : 'text-muted-foreground/70'}`}>
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
    <section className="py-28 md:py-36 px-4 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 bg-primary/[0.07] border border-primary/[0.12] text-primary">
            <Sparkles className="w-3 h-3" />
            Comparison
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            {heading}
          </h2>
          <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
            {isHindi
              ? 'देखें कि Paliwal Secure कैसे अलग है'
              : isEnglish
                ? 'See how Paliwal Secure stands out from the competition'
                : 'Dekhein Paliwal Secure kaisa alag hai'}
          </p>
        </motion.div>

        {/* ── Table ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="overflow-x-auto rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm"
        >
          <table className="w-full min-w-[680px] text-sm">
            {/* Head */}
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left px-6 py-5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  {featureLabel}
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-5 text-center font-medium text-xs uppercase tracking-wider ${
                      col.highlight
                        ? 'text-primary font-bold bg-primary/[0.04] border-x border-primary/[0.08]'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{getColumnLabel(col)}</span>
                      {col.highlight && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-primary/10 border border-primary/20 text-primary normal-case tracking-normal">
                          {isHindi ? 'अनुशंसित' : isEnglish ? 'Recommended' : 'Recommended'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {features.map((row, i) => (
                <tr
                  key={row.key}
                  className={`border-b border-border/40 last:border-b-0 transition-colors duration-300 hover:bg-muted/[0.03]`}
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
                        className={`px-6 py-4 text-center transition-colors duration-300 ${
                          isPaliwal ? 'bg-primary/[0.02] border-x border-primary/[0.06]' : ''
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
