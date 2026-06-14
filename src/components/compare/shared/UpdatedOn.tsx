'use client';

import { Calendar } from 'lucide-react';

interface UpdatedOnProps {
  category: string;
  className?: string;
}

// Category-specific data freshness with exact dates and sources
const DATA_FRESHNESS: Record<string, { date: string; source: string }> = {
  motorTP: {
    date: '28 Mar 2024',
    source: 'MoRTH GSR 354(E)',
  },
  motorOD: {
    date: 'Jan 2026',
    source: 'Insurer filed rates',
  },
  motor: {
    date: 'Jan 2026',
    source: 'IRDAI TP Order + Insurer OD filings',
  },
  health: {
    date: 'Sep 2025',
    source: 'Insurer filed rates + GST Council',
  },
  life: {
    date: 'Apr 2025',
    source: 'Insurer annual filings',
  },
  travel: {
    date: 'Jan 2026',
    source: 'Insurer filed rates',
  },
  home: {
    date: 'Jan 2026',
    source: 'Insurer filed rates',
  },
  csr: {
    date: 'Feb 2026',
    source: 'IRDAI Annual Report FY24-25',
  },
};

export function UpdatedOn({ category, className }: UpdatedOnProps) {
  const freshness = DATA_FRESHNESS[category];

  if (!freshness) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 text-[11px] text-muted-foreground ${className ?? ''}`}>
      <Calendar className="h-3 w-3 shrink-0" />
      <span>
        Data updated: <span className="font-medium">{freshness.date}</span>
        {' | '}
        Source: <span className="font-medium">{freshness.source}</span>
      </span>
    </div>
  );
}
