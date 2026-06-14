'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Scale } from 'lucide-react';

/**
 * ComparisonTable — GEO Comparison Table
 *
 * Renders structured comparison data optimized for AI answers,
 * Google Featured Snippets, and rich results.
 *
 * Features:
 * - Semantic table markup with proper th/td
 * - JSON-LD for ItemList schema
 * - Mobile-responsive with horizontal scroll
 * - Highlight column support (e.g., "recommended" column)
 * - Accessible with proper scope, headers attributes
 */

interface ComparisonTableProps {
  title: string;
  headers: string[];
  rows: string[][];
  highlight?: number; // column index to highlight (0-based)
  className?: string;
}

export function ComparisonTable({
  title,
  headers,
  rows,
  highlight,
  className,
}: ComparisonTableProps) {
  // Build ItemList JSON-LD schema
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description: `Comparison of ${title.toLowerCase()}`,
    numberOfItems: rows.length,
    itemListElement: rows.map((row, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: row[0],
      description: headers
        .slice(1)
        .map((h, i) => `${h}: ${row[i + 1]}`)
        .join('. '),
    })),
  };

  return (
    <>
      {/* ItemList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />

      <Card className={cn('w-full', className)}>
        <CardContent className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10">
              <Scale className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {title}
            </h3>
            <Badge
              variant="secondary"
              className="ml-auto text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
            >
              Compare
            </Badge>
          </div>

          {/* Responsive table wrapper */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table
              className="w-full text-sm border-collapse min-w-[500px]"
              role="table"
              aria-label={title}
            >
              <thead>
                <tr className="border-b border-border/50">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className={cn(
                        'px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap',
                        highlight === idx &&
                          'bg-cyan-50/80 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300'
                      )}
                    >
                      {header}
                      {highlight === idx && (
                        <Badge className="ml-1.5 text-[8px] px-1 py-0 bg-cyan-500 text-white">
                          Best
                        </Badge>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={cn(
                      'border-b border-border/30 transition-colors hover:bg-muted/30',
                      rowIdx % 2 === 1 && 'bg-muted/10'
                    )}
                  >
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={cn(
                          'px-3 py-2.5 text-foreground/80 whitespace-nowrap',
                          cellIdx === 0 && 'font-semibold text-foreground',
                          highlight === cellIdx &&
                            'bg-cyan-50/50 dark:bg-cyan-950/20 font-semibold text-cyan-700 dark:text-cyan-300'
                        )}
                        headers={headers[cellIdx]}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scroll hint for mobile */}
          <p className="text-[10px] text-muted-foreground mt-2 text-center sm:hidden">
            Swipe to see more columns
          </p>
        </CardContent>
      </Card>
    </>
  );
}
