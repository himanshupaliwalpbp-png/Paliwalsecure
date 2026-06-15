'use client';

import { SECTOR_SUMMARIES, formatNumber } from '@/lib/complaintData';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, Building2, Heart } from 'lucide-react';

const sectorIcons: Record<string, React.ReactNode> = {
  public: <Building2 className="w-5 h-5" />,
  private: <TrendingUp className="w-5 h-5" />,
  'standalone-health': <Heart className="w-5 h-5" />,
};

const sectorColors: Record<string, { bg: string; text: string; border: string }> = {
  public: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800/40',
  },
  private: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/40',
  },
  'standalone-health': {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/40',
  },
};

export default function StatsCards() {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {SECTOR_SUMMARIES.map((sector) => {
        const colors = sectorColors[sector.sector];
        const icon = sectorIcons[sector.sector];
        return (
          <Card key={sector.sector} className={`border ${colors.bg} ${colors.border} glass-card`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={colors.text}>{icon}</span>
                <h3 className="text-sm font-semibold text-foreground">{sector.label}</h3>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-foreground">{formatNumber(sector.totalGrievances)}</p>
                <p className="text-xs text-muted-foreground">Total Grievances</p>
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">+{sector.percentRise}% YoY</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Avg {sector.avgComplaintsPer10k} per 10K policies • {sector.insurerCount} insurers
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
