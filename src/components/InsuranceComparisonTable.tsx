'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  IndianRupee,
  ArrowRight,
  Scale,
  FileText,
  Calculator,
  Phone,
  Clock,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────
interface ComparisonColumn {
  key: string;
  label: string;
  labelHindi?: string;
  highlight?: boolean;
}

interface ComparisonTableProps {
  type: 'premium' | 'features' | 'claim-steps' | 'tax-saving';
  title?: string;
  titleHindi?: string;
  data: Record<string, any>[];
  columns: ComparisonColumn[];
  highlightRow?: number;
  language?: 'en' | 'hi' | 'hinglish';
}

// ── Translation Maps ─────────────────────────────────────────────────────
const typeLabels: Record<string, Record<string, string>> = {
  premium: { en: 'Premium Comparison', hi: 'प्रीमियम तुलना', hinglish: 'Premium Comparison' },
  features: { en: 'Feature Comparison', hi: 'फीचर तुलना', hinglish: 'Feature Comparison' },
  'claim-steps': { en: 'Claim Process Steps', hi: 'क्लेम प्रक्रिया', hinglish: 'Claim Process Steps' },
  'tax-saving': { en: 'Tax Saving Comparison', hi: 'टैक्स बचत तुलना', hinglish: 'Tax Saving Comparison' },
};

const typeIcons: Record<string, React.ReactNode> = {
  premium: <IndianRupee className="h-4 w-4" />,
  features: <Scale className="h-4 w-4" />,
  'claim-steps': <FileText className="h-4 w-4" />,
  'tax-saving': <Calculator className="h-4 w-4" />,
};

// ── Helper: CSR color coding ─────────────────────────────────────────────
function getCsrColor(csr: number): string {
  if (csr >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (csr >= 80) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getCsrBg(csr: number): string {
  if (csr >= 90) return 'bg-emerald-50 dark:bg-emerald-950/30';
  if (csr >= 80) return 'bg-amber-50 dark:bg-amber-950/30';
  return 'bg-red-50 dark:bg-red-950/30';
}

// ── Helper: Format currency ───────────────────────────────────────────────
function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

// ── Sub-Components ────────────────────────────────────────────────────────

/** Claim Steps Renderer — Timeline style */
function ClaimStepsRenderer({
  data,
  columns,
  language,
}: {
  data: Record<string, any>[];
  columns: ComparisonColumn[];
  language: string;
}) {
  return (
    <div className="space-y-0">
      {data.map((step, idx) => {
        const stepNum = step.step || step.number || idx + 1;
        const title = step.title || step.step_title || '';
        const description = step.description || step.detail || '';
        const time = step.time || step.duration || '';
        const isLast = idx === data.length - 1;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.35 }}
            className="relative flex gap-4"
          >
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[17px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-[#C98A1C]/40 to-[#E0A830]/20 dark:from-[#C98A1C]/30 dark:to-[#E0A830]/10" />
            )}

            {/* Step circle */}
            <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-[#C98A1C]/20">
              {stepNum}
            </div>

            {/* Step content */}
            <div className={cn('pb-8 flex-1', isLast && 'pb-0')}>
              <div className="flex items-start gap-2 mb-1">
                <h4 className="font-semibold text-foreground text-sm sm:text-base">
                  {title}
                </h4>
                {time && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 whitespace-nowrap"
                  >
                    <Clock className="w-2.5 h-2.5 mr-0.5" />
                    {time}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/** Feature Comparison Renderer — Checkmarks/Crosses */
function FeatureComparisonRenderer({
  data,
  columns,
  highlightRow,
  language,
}: {
  data: Record<string, any>[];
  columns: ComparisonColumn[];
  highlightRow?: number;
  language: string;
}) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-collapse" role="table">
          <thead>
            <tr className="border-b-2 border-[#C98A1C]/20">
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap',
                    col.highlight
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
                      : 'text-muted-foreground'
                  )}
                >
                  {language === 'hi' && col.labelHindi ? col.labelHindi : col.label}
                  {col.highlight && (
                    <Badge className="ml-1.5 text-[8px] px-1 py-0 bg-[#C98A1C] text-white">
                      Best
                    </Badge>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <motion.tr
                key={rowIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIdx * 0.05, duration: 0.3 }}
                className={cn(
                  'border-b border-border/30 transition-colors hover:bg-muted/30',
                  rowIdx % 2 === 1 && 'bg-muted/5',
                  highlightRow === rowIdx &&
                    'bg-amber-50/60 dark:bg-amber-950/20 border-l-2 border-l-[#C98A1C]'
                )}
              >
                {columns.map((col) => {
                  const val = row[col.key];
                  const isFirst = col.key === columns[0].key;

                  return (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 whitespace-nowrap',
                        isFirst && 'font-semibold text-foreground'
                      )}
                    >
                      {typeof val === 'boolean' ? (
                        val ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )
                      ) : (
                        <span className="text-foreground/80">{val}</span>
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((row, rowIdx) => {
          const planName = row[columns[0].key] || `Plan ${rowIdx + 1}`;
          const isHighlighted = highlightRow === rowIdx;

          return (
            <motion.div
              key={rowIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIdx * 0.06, duration: 0.3 }}
              className={cn(
                'glass-card p-4 rounded-xl',
                isHighlighted && 'ring-2 ring-[#C98A1C]/50'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{planName}</h4>
                {isHighlighted && (
                  <Badge className="text-[10px] bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white border-0">
                    <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                    Recommended
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                {columns.slice(1).map((col) => {
                  const val = row[col.key];
                  return (
                    <div
                      key={col.key}
                      className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0"
                    >
                      <span className="text-xs text-muted-foreground">
                        {language === 'hi' && col.labelHindi ? col.labelHindi : col.label}
                      </span>
                      {typeof val === 'boolean' ? (
                        val ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-foreground">
                          {val}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

/** Tax Saving Renderer — Section 80C/80D layout */
function TaxSavingRenderer({
  data,
  columns,
  language,
}: {
  data: Record<string, any>[];
  columns: ComparisonColumn[];
  language: string;
}) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-collapse" role="table">
          <thead>
            <tr className="border-b-2 border-[#C98A1C]/20">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                >
                  {language === 'hi' && col.labelHindi ? col.labelHindi : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <motion.tr
                key={rowIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIdx * 0.05, duration: 0.3 }}
                className={cn(
                  'border-b border-border/30 transition-colors hover:bg-muted/30',
                  rowIdx % 2 === 1 && 'bg-muted/5'
                )}
              >
                {columns.map((col, colIdx) => {
                  const val = row[col.key];
                  const isFirst = colIdx === 0;
                  const isAmount =
                    typeof val === 'number' ||
                    (typeof val === 'string' && val.startsWith('₹'));

                  return (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 whitespace-nowrap',
                        isFirst && 'font-semibold text-foreground',
                        isAmount && !isFirst && 'font-semibold text-emerald-600 dark:text-emerald-400'
                      )}
                    >
                      {typeof val === 'number' ? formatCurrency(val) : val}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((row, rowIdx) => {
          const label = row[columns[0].key] || `Item ${rowIdx + 1}`;
          return (
            <motion.div
              key={rowIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIdx * 0.06, duration: 0.3 }}
              className="glass-card p-4 rounded-xl"
            >
              <h4 className="font-semibold text-foreground mb-3">{label}</h4>
              <div className="space-y-2">
                {columns.slice(1).map((col) => {
                  const val = row[col.key];
                  const isAmount =
                    typeof val === 'number' ||
                    (typeof val === 'string' && val.startsWith('₹'));
                  return (
                    <div
                      key={col.key}
                      className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0"
                    >
                      <span className="text-xs text-muted-foreground">
                        {language === 'hi' && col.labelHindi ? col.labelHindi : col.label}
                      </span>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          isAmount
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground'
                        )}
                      >
                        {typeof val === 'number' ? formatCurrency(val) : val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

/** Premium Renderer — Full premium table with CSR colors, badges, CTA */
function PremiumRenderer({
  data,
  columns,
  highlightRow,
  language,
}: {
  data: Record<string, any>[];
  columns: ComparisonColumn[];
  highlightRow?: number;
  language: string;
}) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-collapse" role="table">
          <thead>
            <tr className="border-b-2 border-[#C98A1C]/20">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap',
                    col.highlight
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
                      : 'text-muted-foreground'
                  )}
                >
                  {language === 'hi' && col.labelHindi ? col.labelHindi : col.label}
                  {col.highlight && (
                    <Badge className="ml-1.5 text-[8px] px-1 py-0 bg-[#C98A1C] text-white">
                      Best
                    </Badge>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => {
              const isHighlighted = highlightRow === rowIdx || row.recommended;
              const csr = row.csr ?? row.claim_settlement_ratio;

              return (
                <motion.tr
                  key={rowIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIdx * 0.05, duration: 0.3 }}
                  className={cn(
                    'border-b border-border/30 transition-colors hover:bg-muted/30',
                    rowIdx % 2 === 1 && 'bg-muted/5',
                    isHighlighted &&
                      'bg-amber-50/60 dark:bg-amber-950/20 border-l-2 border-l-[#C98A1C]'
                  )}
                >
                  {columns.map((col, colIdx) => {
                    const val = row[col.key];
                    const isFirst = colIdx === 0;
                    const isCsr = col.key === 'csr' || col.key === 'claim_settlement_ratio';
                    const isPremium = col.key === 'premium' || col.key === 'premiumYearly' || col.key === 'premium_yearly';
                    const isSumInsured = col.key === 'sumInsured' || col.key === 'sum_insured';

                    return (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-3 whitespace-nowrap',
                          isFirst && 'font-semibold text-foreground'
                        )}
                      >
                        {isCsr && typeof val === 'number' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                                  getCsrBg(val),
                                  getCsrColor(val)
                                )}
                              >
                                {val}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {val >= 90
                                ? 'Excellent CSR — Very high claim approval rate'
                                : val >= 80
                                ? 'Good CSR — Reliable claim settlement'
                                : 'Average CSR — Check details before buying'}
                            </TooltipContent>
                          </Tooltip>
                        ) : (isPremium || isSumInsured) && typeof val === 'number' ? (
                          <span className="font-semibold text-foreground">
                            {formatCurrency(val)}
                          </span>
                        ) : col.key === 'features' && Array.isArray(val) ? (
                          <div className="flex flex-wrap gap-1">
                            {val.slice(0, 3).map((f: string, fi: number) => (
                              <Badge
                                key={fi}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                              >
                                {f}
                              </Badge>
                            ))}
                            {val.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                +{val.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-foreground/80">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((row, rowIdx) => {
          const isHighlighted = highlightRow === rowIdx || row.recommended;
          const planName = row[columns[0].key] || `Plan ${rowIdx + 1}`;

          return (
            <motion.div
              key={rowIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIdx * 0.06, duration: 0.3 }}
              className={cn(
                'glass-card p-4 rounded-xl',
                isHighlighted && 'ring-2 ring-[#C98A1C]/50'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground text-base">
                  {planName}
                </h4>
                {isHighlighted && (
                  <Badge className="text-[10px] bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white border-0">
                    <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                    Recommended
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                {columns.slice(1).map((col) => {
                  const val = row[col.key];
                  const isCsr = col.key === 'csr' || col.key === 'claim_settlement_ratio';
                  const isPremium = col.key === 'premium' || col.key === 'premiumYearly' || col.key === 'premium_yearly';
                  const isSumInsured = col.key === 'sumInsured' || col.key === 'sum_insured';

                  return (
                    <div
                      key={col.key}
                      className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0"
                    >
                      <span className="text-xs text-muted-foreground">
                        {language === 'hi' && col.labelHindi ? col.labelHindi : col.label}
                      </span>
                      {isCsr && typeof val === 'number' ? (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                            getCsrBg(val),
                            getCsrColor(val)
                          )}
                        >
                          {val}%
                        </span>
                      ) : (isPremium || isSumInsured) && typeof val === 'number' ? (
                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(val)}
                        </span>
                      ) : col.key === 'features' && Array.isArray(val) ? (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {val.slice(0, 2).map((f: string, fi: number) => (
                            <Badge
                              key={fi}
                              variant="secondary"
                              className="text-[9px] px-1 py-0 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                            >
                              {f}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-foreground">
                          {val}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

// ── Main Component ───────────────────────────────────────────────────────
export function InsuranceComparisonTable({
  type,
  title,
  titleHindi,
  data,
  columns,
  highlightRow,
  language = 'hinglish',
}: ComparisonTableProps) {
  const displayTitle =
    title || (language === 'hi' && titleHindi ? titleHindi : typeLabels[type]?.[language] || typeLabels[type]?.en || 'Comparison');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full my-6"
    >
      <div className="glass-card p-4 sm:p-6 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#C98A1C]/10 to-[#E0A830]/10 dark:from-[#C98A1C]/20 dark:to-[#E0A830]/20 text-[#C98A1C] dark:text-[#C98A1C]">
            {typeIcons[type]}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {displayTitle}
          </h3>
          <Badge
            variant="secondary"
            className="ml-auto text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 whitespace-nowrap"
          >
            <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
            {data.length} {type === 'claim-steps' ? 'Steps' : 'Plans'}
          </Badge>
        </div>

        {/* Content based on type */}
        {type === 'claim-steps' ? (
          <ClaimStepsRenderer data={data} columns={columns} language={language} />
        ) : type === 'features' ? (
          <FeatureComparisonRenderer
            data={data}
            columns={columns}
            highlightRow={highlightRow}
            language={language}
          />
        ) : type === 'tax-saving' ? (
          <TaxSavingRenderer data={data} columns={columns} language={language} />
        ) : (
          <PremiumRenderer
            data={data}
            columns={columns}
            highlightRow={highlightRow}
            language={language}
          />
        )}

        {/* Scroll hint for mobile (non-claim-steps) */}
        {type !== 'claim-steps' && (
          <p className="text-[10px] text-muted-foreground mt-3 text-center md:hidden">
            Scroll horizontally for more details
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default InsuranceComparisonTable;
