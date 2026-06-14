'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { InsuranceComparisonTable } from '@/components/InsuranceComparisonTable';
import { PremiumTable } from '@/components/PremiumTable';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────
interface BlogContentRendererProps {
  content: string;
  language?: 'en' | 'hi' | 'hinglish';
}

// ── Helper: Parse comparison table from markdown comment markers ─────────
// The markdown content may contain markers like:
// <!-- COMPARISON_TABLE:premium -->
// | Plan | Premium | CSR | ... |
// |------|---------|-----|-----|
// | ...  | ...     | ... | ... |
// <!-- /COMPARISON_TABLE -->
//
// Or standalone tables without markers (which still get enhanced rendering)

interface ParsedBlock {
  type: 'markdown' | 'comparison-table' | 'premium-table';
  content: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  tableType?: string;
}

function parseComparisonTableMarker(line: string): string | null {
  const match = line.match(/<!--\s*COMPARISON_TABLE(?::(\w+))?\s*-->/);
  return match ? (match[1] || 'premium') : null;
}

function parseEndMarker(line: string): boolean {
  return /<!--\s*\/COMPARISON_TABLE\s*-->/.test(line);
}

function parseMarkdownTable(lines: string[]): { headers: string[]; rows: string[][] } | null {
  if (lines.length < 2) return null;

  // Parse header row
  const headerLine = lines[0];
  const headers = headerLine
    .split('|')
    .map((h) => h.trim())
    .filter(Boolean);

  // Skip separator line (line with ---)
  const dataLines = lines.slice(2);
  if (dataLines.length === 0) return null;

  const rows = dataLines
    .filter((line) => line.trim() && !line.match(/^\|[\s\-:|]+\|$/))
    .map((line) =>
      line
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean)
    )
    .filter((row) => row.length > 0);

  return { headers, rows };
}

function parseContent(content: string): ParsedBlock[] {
  const lines = content.split('\n');
  const blocks: ParsedBlock[] = [];
  let currentMarkdown: string[] = [];
  let inComparisonTable = false;
  let comparisonType = 'premium';
  let tableLines: string[] = [];

  const flushMarkdown = () => {
    if (currentMarkdown.length > 0) {
      const md = currentMarkdown.join('\n');
      if (md.trim()) {
        blocks.push({ type: 'markdown', content: md });
      }
      currentMarkdown = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for COMPARISON_TABLE start marker
    const markerType = parseComparisonTableMarker(line);
    if (markerType) {
      flushMarkdown();
      inComparisonTable = true;
      comparisonType = markerType;
      tableLines = [];
      continue;
    }

    // Check for COMPARISON_TABLE end marker
    if (inComparisonTable && parseEndMarker(line)) {
      const tableData = parseMarkdownTable(tableLines);
      if (tableData) {
        blocks.push({
          type: 'comparison-table',
          content: tableLines.join('\n'),
          tableData,
          tableType: comparisonType,
        });
      }
      inComparisonTable = false;
      tableLines = [];
      continue;
    }

    // If inside a comparison table, collect table lines
    if (inComparisonTable) {
      tableLines.push(line);
      continue;
    }

    // Detect standalone markdown tables (without markers) and give them enhanced rendering
    if (line.trim().startsWith('|') && currentMarkdown.length > 0) {
      // Check if this is the start of a table
      const lookAhead = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('|')) {
        lookAhead.push(lines[j]);
        j++;
      }

      // Check if it's a valid table (has separator row)
      if (
        lookAhead.length >= 2 &&
        lookAhead[1].match(/^\|[\s\-:|]+\|$/)
      ) {
        flushMarkdown();
        const tableData = parseMarkdownTable(lookAhead);
        if (tableData) {
          blocks.push({
            type: 'comparison-table',
            content: lookAhead.join('\n'),
            tableData,
            tableType: 'premium', // default type for standalone tables
          });
        }
        i = j - 1; // skip ahead
        continue;
      }
    }

    currentMarkdown.push(line);
  }

  flushMarkdown();

  // If we're still in a comparison table at the end, flush it
  if (inComparisonTable && tableLines.length > 0) {
    const tableData = parseMarkdownTable(tableLines);
    if (tableData) {
      blocks.push({
        type: 'comparison-table',
        content: tableLines.join('\n'),
        tableData,
        tableType: comparisonType,
      });
    }
  }

  return blocks;
}

// ── Helper: Detect if a column contains CSR data ─────────────────────────
function isCsrColumn(header: string): boolean {
  const h = header.toLowerCase();
  return h === 'csr' || h.includes('claim settlement') || h.includes('claim ratio');
}

// ── Helper: Detect if a column contains premium data ─────────────────────
function isPremiumColumn(header: string): boolean {
  const h = header.toLowerCase();
  return h.includes('premium') || h.includes('price') || h.includes('cost');
}

// ── Helper: Detect if a column contains sum insured data ─────────────────
function isSumInsuredColumn(header: string): boolean {
  const h = header.toLowerCase();
  return h.includes('sum insured') || h.includes('cover') || h.includes('si');
}

// ── Helper: Parse premium amount from string ─────────────────────────────
function parsePremiumFromCell(cell: string): number | null {
  // Try to extract a number from cells like "₹10,000/yr" or "₹10,000"
  const match = cell.match(/₹?\s*([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return null;
}

// ── Helper: Parse CSR from cell ──────────────────────────────────────────
function parseCsrFromCell(cell: string): number | null {
  const match = cell.match(/([\d.]+)\s*%/);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

// ── Render a table as InsuranceComparisonTable component ─────────────────
function renderEnhancedTable(
  tableData: { headers: string[]; rows: string[][] },
  tableType: string,
  language: string
) {
  const { headers, rows } = tableData;

  // Try to build structured data for InsuranceComparisonTable
  const columns = headers.map((h) => ({
    key: h.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
    label: h,
    highlight: isPremiumColumn(h),
  }));

  // Build data records
  const data = rows.map((row) => {
    const record: Record<string, any> = {};
    columns.forEach((col, idx) => {
      const cell = row[idx] || '';
      // Try to parse structured data
      if (isCsrColumn(col.label)) {
        const csr = parseCsrFromCell(cell);
        record[col.key] = csr !== null ? csr : cell;
      } else if (isPremiumColumn(col.label)) {
        const premium = parsePremiumFromCell(cell);
        record[col.key] = premium !== null ? premium : cell;
      } else if (isSumInsuredColumn(col.label)) {
        const si = parsePremiumFromCell(cell);
        record[col.key] = si !== null ? si : cell;
      } else {
        record[col.key] = cell;
      }
    });
    return record;
  });

  // Determine the best row (highest CSR if available)
  const csrCol = columns.find((c) => isCsrColumn(c.label));
  let highlightRow: number | undefined;
  if (csrCol) {
    let bestCsr = -1;
    data.forEach((row, idx) => {
      const csr = typeof row[csrCol.key] === 'number' ? row[csrCol.key] : -1;
      if (csr > bestCsr) {
        bestCsr = csr;
        highlightRow = idx;
      }
    });
  }

  return (
    <InsuranceComparisonTable
      type={tableType as any}
      data={data}
      columns={columns}
      highlightRow={highlightRow}
      language={language as any}
    />
  );
}

// ── Custom Markdown Table Renderer (fallback for plain markdown) ─────────
function EnhancedMarkdownTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="w-full overflow-x-auto my-6 rounded-xl border border-border/50 shadow-sm">
      <table className="w-full text-sm border-collapse" role="table">
        <thead>
          <tr className="bg-gradient-to-r from-[#C98A1C]/10 to-[#E0A830]/10 dark:from-[#C98A1C]/20 dark:to-[#E0A830]/20">
            {headers.map((header, idx) => (
              <th
                key={idx}
                scope="col"
                className={cn(
                  'py-3.5 px-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 border-[#C98A1C]/20',
                  isPremiumColumn(header) && 'bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20 text-amber-700 dark:text-amber-300',
                  isCsrColumn(header) && 'text-emerald-600 dark:text-emerald-400'
                )}
              >
                {header}
                {isPremiumColumn(header) && (
                  <Badge className="ml-1.5 text-[8px] px-1 py-0 bg-[#C98A1C] text-white">
                    Key
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
                'border-b border-border/30 transition-colors hover:bg-[#C98A1C]/5 dark:hover:bg-[#C98A1C]/10',
                rowIdx % 2 === 1 && 'bg-muted/5'
              )}
            >
              {row.map((cell, cellIdx) => {
                const header = headers[cellIdx] || '';
                const isFirst = cellIdx === 0;
                const isCsr = isCsrColumn(header);
                const csrVal = parseCsrFromCell(cell);

                return (
                  <td
                    key={cellIdx}
                    className={cn(
                      'py-3 px-4 text-sm whitespace-nowrap',
                      isFirst && 'font-semibold text-foreground',
                      !isFirst && 'text-muted-foreground'
                    )}
                  >
                    {isCsr && csrVal !== null ? (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                          csrVal >= 90
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                            : csrVal >= 80
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                            : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                        )}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {cell}
                      </span>
                    ) : cell.includes('✓') || cell.toLowerCase() === 'yes' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : cell.includes('✗') || cell.toLowerCase() === 'no' ? (
                      <XCircle className="h-4 w-4 text-red-400" />
                    ) : (
                      cell
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Blog Content Renderer ───────────────────────────────────────────
export function BlogContentRenderer({
  content,
  language = 'en',
}: BlogContentRendererProps) {
  const blocks = useMemo(() => parseContent(content), [content]);

  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none
        [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8
        [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-foreground
        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-foreground
        [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
        [&_ul]:space-y-2 [&_ul]:mb-6 [&_ul]:ml-0 [&_ul]:pl-4
        [&_ol]:space-y-2 [&_ol]:mb-6 [&_ol]:ml-0 [&_ol]:pl-4
        [&_li]:text-muted-foreground [&_li]:text-sm [&_li]:leading-relaxed
        [&_strong]:text-foreground [&_strong]:font-semibold
        [&_em]:text-muted-foreground
        [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
        [&_hr]:border-border [&_hr]:my-8
        [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
        [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
      "
    >
      {blocks.map((block, idx) => {
        if (block.type === 'comparison-table' && block.tableData) {
          return (
            <div key={idx}>
              {renderEnhancedTable(
                block.tableData,
                block.tableType || 'premium',
                language
              )}
            </div>
          );
        }

        if (block.type === 'premium-table') {
          return <div key={idx}>{block.content}</div>;
        }

        // Regular markdown — use ReactMarkdown with custom table renderer
        return (
          <ReactMarkdown
            key={idx}
            components={{
              table: ({ children }) => {
                // Extract table data from children to render as enhanced table
                return <>{children}</>;
              },
              thead: ({ children }) => <thead className="sr-only">{children}</thead>,
              tbody: ({ children }) => <tbody className="sr-only">{children}</tbody>,
            }}
          >
            {block.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}

export default BlogContentRenderer;
