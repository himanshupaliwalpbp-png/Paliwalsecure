'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { insuranceCompanies } from '@/lib/insurance-data';

type SortKey = 'name' | 'csr2026' | 'icr2026' | 'solvencyRatio' | 'rating';
type SortDir = 'asc' | 'desc';
type CategoryFilter = 'all' | 'health' | 'life';

function getCsrColor(csr: number): string {
  if (csr >= 99) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
  if (csr >= 95) return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
  return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
}

function getIcrColor(icr: number): string {
  if (icr >= 50 && icr <= 80) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
  if (icr > 80 && icr <= 90) return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
  if (icr > 90) return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
  return 'text-slate-600 bg-slate-50';
}

function getSolvencyColor(ratio: number): string {
  if (ratio >= 2.0) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
  if (ratio >= 1.5) return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
  return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
}

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== column) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
  return sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />;
}

export default function CompanyComparisonTable() {
  const [sortKey, setSortKey] = useState<SortKey>('csr2026');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let data = [...insuranceCompanies];
    if (categoryFilter !== 'all') data = data.filter(c => c.category === categoryFilter);
    data.sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return data;
  }, [sortKey, sortDir, categoryFilter]);

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'health', 'life'] as CategoryFilter[]).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-card border border-border text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600'
            }`}
          >
            {cat === 'all' ? 'All Companies' : cat === 'health' ? '🏥 Health & General' : '🛡️ Life Insurance'}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 dark:bg-green-950/50 border border-green-200" /> High (&ge;99% CSR)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-950/50 border border-amber-200" /> Medium (95-99%)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-100 dark:bg-rose-950/50 border border-rose-200" /> Low (&lt;95%)</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground">
                <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  Company <SortIcon column="name" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-foreground">Type</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground">
                <button onClick={() => handleSort('csr2026')} className="flex items-center gap-1 mx-auto hover:text-blue-600 transition-colors">
                  CSR 2026 <SortIcon column="csr2026" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              {categoryFilter !== 'life' && (
                <th className="text-center px-4 py-3 font-semibold text-foreground">
                  <button onClick={() => handleSort('icr2026')} className="flex items-center gap-1 mx-auto hover:text-blue-600 transition-colors">
                    ICR 2026 <SortIcon column="icr2026" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
              )}
              <th className="text-center px-4 py-3 font-semibold text-foreground">
                <button onClick={() => handleSort('solvencyRatio')} className="flex items-center gap-1 mx-auto hover:text-blue-600 transition-colors">
                  Solvency <SortIcon column="solvencyRatio" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              {categoryFilter === 'life' && (
                <th className="text-center px-4 py-3 font-semibold text-foreground">&#x20B9;1 Cr Term</th>
              )}
              {categoryFilter !== 'life' && (
                <th className="text-center px-4 py-3 font-semibold text-foreground">Network</th>
              )}
              <th className="text-left px-4 py-3 font-semibold text-foreground">Key Features</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground">
                <button onClick={() => handleSort('rating')} className="flex items-center gap-1 mx-auto hover:text-blue-600 transition-colors">
                  Rating <SortIcon column="rating" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((company, i) => (
              <tr key={company.name} className={`border-b border-border/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{company.name}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="outline" className={`text-[10px] ${company.category === 'health' ? 'border-rose-200 text-rose-600 dark:border-rose-800 dark:text-rose-400' : 'border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400'}`}>
                    {company.category === 'health' ? 'Health' : 'Life'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${getCsrColor(company.csr2026)}`}>
                    {company.csr2026}%
                  </span>
                </td>
                {categoryFilter !== 'life' && (
                  <td className="px-4 py-3 text-center">
                    {company.icr2026 ? (
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${getIcrColor(company.icr2026)}`}>
                        {company.icr2026}%
                      </span>
                    ) : '—'}
                  </td>
                )}
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${getSolvencyColor(company.solvencyRatio)}`}>
                    {company.solvencyRatio}
                  </span>
                </td>
                {categoryFilter === 'life' && (
                  <td className="px-4 py-3 text-center text-sm font-medium text-foreground">{company.premium1crTerm || '—'}</td>
                )}
                {categoryFilter !== 'life' && (
                  <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                    {company.networkHospitals ? `${(company.networkHospitals / 1000).toFixed(1)}K` : '—'}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {company.features.slice(0, 2).map((f, fi) => (
                      <span key={fi} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 whitespace-nowrap">{f}</span>
                    ))}
                    {company.features.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">+{company.features.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-bold text-amber-500">{'★'.repeat(Math.round(company.rating))}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Info className="w-3 h-3" />
        Source: IRDAI Annual Report 2025-26 | CSR = Claim Settlement Ratio | ICR = Incurred Claim Ratio | Solvency min. 1.5 (IRDAI)
      </p>
    </div>
  );
}
