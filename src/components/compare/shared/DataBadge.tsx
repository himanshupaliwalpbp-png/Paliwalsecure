'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export type DataSource = 'live' | 'irdai' | 'estimated';

interface DataBadgeProps {
  source: DataSource;
  lastUpdated?: string;
  className?: string;
}

const SOURCE_CONFIG: Record<DataSource, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  darkBgColor: string;
  darkTextColor: string;
  pulse: boolean;
  icon: string;
}> = {
  live: {
    label: 'Live',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    darkBgColor: 'dark:bg-green-900/40',
    darkTextColor: 'dark:text-green-300',
    pulse: true,
    icon: '🟢',
  },
  irdai: {
    label: 'IRDAI Rates',
    color: 'text-teal-700',
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-400',
    darkBgColor: 'dark:bg-teal-900/40',
    darkTextColor: 'dark:text-teal-300',
    pulse: false,
    icon: '📋',
  },
  estimated: {
    label: 'Estimated',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-400',
    darkBgColor: 'dark:bg-amber-900/40',
    darkTextColor: 'dark:text-amber-300',
    pulse: false,
    icon: '⚠️',
  },
};

/**
 * DataBadge — Shows a small badge next to each quote indicating the data source.
 *
 * - "Live" (green, animated pulse): Real-time or recently verified data
 * - "IRDAI Rates" (teal): Rates mandated or filed with IRDAI
 * - "Estimated" (amber): Calculated / indicative rates
 */
export function DataBadge({ source, lastUpdated, className }: DataBadgeProps) {
  const config = SOURCE_CONFIG[source];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-1.5 ${className ?? ''}`}
    >
      <Badge
        className={`${config.bgColor} ${config.color} ${config.borderColor} ${config.darkBgColor} ${config.darkTextColor} border text-[11px] font-medium gap-1`}
      >
        {config.pulse ? (
          <span className="relative mr-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
        ) : (
          <span className="text-[10px]">{config.icon}</span>
        )}
        {config.label}
      </Badge>
      {lastUpdated && (
        <span className="text-[10px] text-muted-foreground">
          Updated: {lastUpdated}
        </span>
      )}
    </motion.div>
  );
}
