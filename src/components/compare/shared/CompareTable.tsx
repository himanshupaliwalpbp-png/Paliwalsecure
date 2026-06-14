'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown, Trophy, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ColumnDef {
  key: string;
  label: string;
  format?: (value: any, row: Record<string, any>) => React.ReactNode;
}

interface CompareTableProps {
  quotes: Record<string, any>[];
  columns: ColumnDef[];
  category: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Indian Number Formatter
// ---------------------------------------------------------------------------
function formatINR(amount: number): string {
  const fixed = amount.toFixed(0);
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

  const prefix = isNegative ? '-' : '₹';
  return `${prefix}${formatted}`;
}

// ---------------------------------------------------------------------------
// Default Cell Formatter
// ---------------------------------------------------------------------------
function defaultFormat(value: any, key: string): React.ReactNode {
  if (value === undefined || value === null) return '—';

  // Format premium-like fields as INR
  const premiumKeys = ['totalPremium', 'basePremium', 'premium', 'gstAmount', 'addOnPremium'];
  if (premiumKeys.includes(key) && typeof value === 'number') {
    return formatINR(value);
  }

  // Format percentage fields
  if ((key.toLowerCase().includes('rate') || key === 'CSR') && typeof value === 'number') {
    return `${value.toFixed(1)}%`;
  }

  if (typeof value === 'number') {
    return value.toLocaleString('en-IN');
  }

  return String(value);
}

// ---------------------------------------------------------------------------
// Compare Table Component
// ---------------------------------------------------------------------------
export function CompareTable({ quotes, columns, category, className }: CompareTableProps) {
  const [sortKey, setSortKey] = useState<string>('totalPremium');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Find the cheapest quote (lowest totalPremium)
  const cheapestPremium = useMemo(() => {
    if (quotes.length === 0) return 0;
    const premiums = quotes.map((q) => q.totalPremium ?? q.premium ?? Infinity);
    return Math.min(...premiums);
  }, [quotes]);

  // Sort quotes
  const sortedQuotes = useMemo(() => {
    const sorted = [...quotes].sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [quotes, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (quotes.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-muted-foreground">
          No quotes to compare. Please adjust your inputs.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-amber-500" />
          Compare Quotes — {category.charAt(0).toUpperCase() + category.slice(1)} Insurance
          <Badge variant="outline" className="ml-auto text-[10px]">
            {sortedQuotes.length} quotes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-8 text-center">#</TableHead>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`cursor-pointer select-none hover:bg-muted transition-colors ${
                      col.key === sortKey ? 'font-bold' : ''
                    }`}
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown
                        className={`h-3 w-3 ${
                          sortKey === col.key
                            ? 'text-foreground'
                            : 'text-muted-foreground/50'
                        }`}
                      />
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedQuotes.map((quote, idx) => {
                const premium = quote.totalPremium ?? quote.premium ?? 0;
                const isCheapest = premium === cheapestPremium && premium > 0;

                return (
                  <motion.tr
                    key={quote.insurerId ?? quote.insurer ?? idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className={`border-b transition-colors ${
                      isCheapest
                        ? 'bg-green-50/80 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {isCheapest ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        idx + 1
                      )}
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.format ? (
                          col.format(quote[col.key], quote)
                        ) : (
                          defaultFormat(quote[col.key], col.key)
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {cheapestPremium > 0 && (
          <div className="px-4 py-2 text-xs text-muted-foreground border-t">
            💡 Green row = lowest premium ({formatINR(cheapestPremium)}). Click column headers to sort.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
