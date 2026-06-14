'use client';

import { Shield, Building2, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';
import type { InsurerRecord } from '@/lib/compare/insurer-master';

interface InsurerBadgeProps {
  insurerId: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Insurer Type Badge Config
// ---------------------------------------------------------------------------
const TYPE_CONFIG: Record<string, { label: string; color: string; darkColor: string; icon: typeof Building2 }> = {
  general: {
    label: 'Private',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    darkColor: 'dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
    icon: Building2,
  },
  standalone_health: {
    label: 'Standalone Health',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    darkColor: 'dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    icon: Shield,
  },
  life: {
    label: 'Life',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    darkColor: 'dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700',
    icon: Shield,
  },
};

// ---------------------------------------------------------------------------
// CSR Color Coding
// ---------------------------------------------------------------------------
function getCSRColor(csr: number): { text: string; bg: string; darkText: string; darkBg: string } {
  if (csr >= 98) {
    return {
      text: 'text-green-700',
      bg: 'bg-green-100',
      darkText: 'dark:text-green-300',
      darkBg: 'dark:bg-green-900/40',
    };
  }
  if (csr >= 95) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-100',
      darkText: 'dark:text-amber-300',
      darkBg: 'dark:bg-amber-900/40',
    };
  }
  return {
    text: 'text-red-700',
    bg: 'bg-red-100',
    darkText: 'dark:text-red-300',
    darkBg: 'dark:bg-red-900/40',
  };
}

// ---------------------------------------------------------------------------
// Insurer Badge Component
// ---------------------------------------------------------------------------
export function InsurerBadge({ insurerId, className }: InsurerBadgeProps) {
  const insurer: InsurerRecord | undefined = INSURER_MASTER[insurerId];

  if (!insurer) {
    return (
      <div className={`inline-flex items-center gap-2 ${className ?? ''}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold">
          {insurerId.charAt(0)}
        </div>
        <span className="text-sm text-muted-foreground">{insurerId}</span>
      </div>
    );
  }

  const typeConfig = TYPE_CONFIG[insurer.type] ?? TYPE_CONFIG['general'];
  const TypeIcon = typeConfig.icon;
  const csrColor = getCSRColor(insurer.CSR);
  const isDigital = insurerId === 'ACKO' || insurerId === 'GO_DIGIT';
  const isPSU = insurerId === 'NEW_INDIA' || insurerId === 'LIC';

  // Determine display type
  let typeLabel = typeConfig.label;
  let typeColor = typeConfig.color;
  let typeDarkColor = typeConfig.darkColor;
  let TypeIconToUse = TypeIcon;

  if (isDigital) {
    typeLabel = 'Digital';
    typeColor = 'bg-cyan-100 text-cyan-800 border-cyan-300';
    typeDarkColor = 'dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700';
    TypeIconToUse = Wifi;
  } else if (isPSU) {
    typeLabel = 'PSU';
    typeColor = 'bg-orange-100 text-orange-800 border-orange-300';
    typeDarkColor = 'dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700';
    TypeIconToUse = Building2;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-2.5 ${className ?? ''}`}
    >
      {/* Logo placeholder */}
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0 dark:bg-primary/20">
        {insurer.shortName.slice(0, 2).toUpperCase()}
      </div>

      {/* Name and type */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium truncate leading-tight">
          {insurer.shortName}
        </span>
        <div className="flex items-center gap-1.5">
          <Badge
            className={`${typeColor} ${typeDarkColor} border text-[9px] px-1.5 py-0 h-4 gap-0.5`}
          >
            <TypeIconToUse className="h-2.5 w-2.5" />
            {typeLabel}
          </Badge>

          {/* CSR badge */}
          <Badge
            className={`${csrColor.bg} ${csrColor.text} ${csrColor.darkBg} ${csrColor.darkText} border-0 text-[9px] px-1.5 py-0 h-4`}
          >
            CSR {insurer.CSR.toFixed(1)}%
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
