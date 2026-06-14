'use client';

import { useState } from 'react';
import {
  INSURER_COMPLAINT_DATA,
  getComplaintLevel,
  getComplaintLevelColor,
  formatNumber,
  formatCurrencyCrore,
  type InsurerComplaintData,
  type InsurerSector,
} from '@/lib/complaintData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

type SortKey = 'name' | 'grievancesReported' | 'complaintsPer10k' | 'complaintsPerCrore' | 'pendencyPercent' | 'csr';
type SortDir = 'asc' | 'desc';

const sectorFilters: { value: InsurerSector | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'standalone-health', label: 'Health' },
];

export default function ComplaintTable() {
  const [sortKey, setSortKey] = useState<SortKey>('complaintsPer10k');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [sectorFilter, setSectorFilter] = useState<InsurerSector | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = INSURER_COMPLAINT_DATA.filter(
    (d) => sectorFilter === 'all' || d.sector === sectorFilter
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const renderSortIcon = (col: SortKey) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const sectorBadgeColor: Record<string, string> = {
    public: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800',
    private: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'standalone-health': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  };

  return (
    <Card className="border border-border glass-card overflow-hidden">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2 flex-wrap">
        {sectorFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setSectorFilter(f.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              sectorFilter === f.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{sorted.length} insurers</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('name')}>
                <span className="flex items-center gap-1">Insurer {renderSortIcon("name")}</span>
              </th>
              <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('grievancesReported')}>
                <span className="flex items-center justify-end gap-1">Grievances {renderSortIcon("grievancesReported")}</span>
              </th>
              <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('complaintsPer10k')}>
                <span className="flex items-center justify-end gap-1">/10K {renderSortIcon("complaintsPer10k")}</span>
              </th>
              <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('pendencyPercent')}>
                <span className="flex items-center justify-end gap-1">Pendency {renderSortIcon("pendencyPercent")}</span>
              </th>
              <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('csr')}>
                <span className="flex items-center justify-end gap-1">CSR {renderSortIcon("csr")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((insurer) => {
              const level = getComplaintLevel(insurer.complaintsPer10k);
              const levelColor = getComplaintLevelColor(level);
              const isExpanded = expanded === insurer.name;

              return (
                <>
                  <tr
                    key={insurer.name}
                    className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors ${levelColor.bg}`}
                    onClick={() => setExpanded(isExpanded ? null : insurer.name)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${levelColor.dot}`} />
                        <span className="font-medium text-foreground">{insurer.name}</span>
                      </div>
                    </td>
                    <td className="text-right px-3 py-2.5 font-mono text-foreground">
                      {formatNumber(insurer.grievancesReported)}
                      <span className="text-red-500 ml-1">+{insurer.percentRise}%</span>
                    </td>
                    <td className="text-right px-3 py-2.5">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${levelColor.badge}`}>
                        {insurer.complaintsPer10k}
                      </Badge>
                    </td>
                    <td className="text-right px-3 py-2.5 font-mono text-foreground">
                      {insurer.pendencyPercent}%
                    </td>
                    <td className="text-right px-3 py-2.5 font-mono text-foreground">
                      {insurer.csr}%
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${insurer.name}-detail`} className="border-b border-border/50 bg-muted/10">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <p className="text-muted-foreground">Sector</p>
                            <Badge variant="outline" className={`text-[10px] mt-0.5 ${sectorBadgeColor[insurer.sector]}`}>
                              {insurer.sector === 'standalone-health' ? 'Health' : insurer.sector.charAt(0).toUpperCase() + insurer.sector.slice(1)}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Premium Collected</p>
                            <p className="font-mono text-foreground mt-0.5">{formatCurrencyCrore(insurer.premiumCollected)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Complaints/₹1Cr</p>
                            <p className="font-mono text-foreground mt-0.5">{insurer.complaintsPerCrore}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Category</p>
                            <p className="text-foreground mt-0.5 capitalize">{insurer.category}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
