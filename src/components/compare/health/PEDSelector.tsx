'use client';

import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface PEDOption {
  id: string;
  label: string;
  loadingPercent: number;
  isHighRisk: boolean;
  warningText?: string;
}

interface PEDSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// PED Options Data
// ---------------------------------------------------------------------------
export const PED_OPTIONS: PEDOption[] = [
  {
    id: 'diabetes',
    label: 'Diabetes',
    loadingPercent: 20,
    isHighRisk: false,
  },
  {
    id: 'hypertension',
    label: 'Hypertension',
    loadingPercent: 15,
    isHighRisk: false,
  },
  {
    id: 'heartDisease',
    label: 'Heart Disease',
    loadingPercent: 40,
    isHighRisk: true,
    warningText: 'Decline likely — limited insurers',
  },
  {
    id: 'cancer',
    label: 'Cancer',
    loadingPercent: 55,
    isHighRisk: true,
    warningText: 'Decline likely — limited insurers',
  },
  {
    id: 'thyroid',
    label: 'Thyroid',
    loadingPercent: 10,
    isHighRisk: false,
  },
  {
    id: 'asthma',
    label: 'Asthma',
    loadingPercent: 10,
    isHighRisk: false,
  },
];

const NONE_OPTION: PEDOption = {
  id: 'none',
  label: 'None',
  loadingPercent: 0,
  isHighRisk: false,
};

// ---------------------------------------------------------------------------
// PED Selector Component
// ---------------------------------------------------------------------------
export function PEDSelector({ selected, onChange, className }: PEDSelectorProps) {
  const hasNone = selected.includes('none');
  const hasPED = selected.some((s) => s !== 'none');

  const handleToggle = (id: string) => {
    if (id === 'none') {
      // Selecting "None" clears all others
      onChange(['none']);
      return;
    }

    // Selecting a specific PED removes "None"
    let newSelected = selected.filter((s) => s !== 'none');

    if (newSelected.includes(id)) {
      newSelected = newSelected.filter((s) => s !== id);
    } else {
      newSelected = [...newSelected, id];
    }

    // If nothing selected, default to "None"
    if (newSelected.length === 0) {
      newSelected = ['none'];
    }

    onChange(newSelected);
  };

  // Total loading percent
  const totalLoading = selected
    .filter((s) => s !== 'none')
    .reduce((sum, id) => {
      const opt = PED_OPTIONS.find((o) => o.id === id);
      return sum + (opt?.loadingPercent ?? 0);
    }, 0);

  const hasHighRisk = selected.some((s) => {
    const opt = PED_OPTIONS.find((o) => o.id === s);
    return opt?.isHighRisk;
  });

  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <Label className="text-sm font-semibold">
        Pre-Existing Diseases (PED)
      </Label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PED_OPTIONS.map((opt) => {
          const isChecked = selected.includes(opt.id);
          return (
            <motion.div
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Label
                htmlFor={`ped-${opt.id}`}
                className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  isChecked
                    ? opt.isHighRisk
                      ? 'border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/30'
                      : 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30'
                    : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <Checkbox
                  id={`ped-${opt.id}`}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(opt.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium leading-tight">
                      {opt.label}
                    </span>
                    {opt.loadingPercent > 0 && (
                      <Badge
                        variant="outline"
                        className={`text-[9px] h-4 px-1 ${
                          opt.isHighRisk
                            ? 'border-red-300 text-red-700 dark:border-red-600 dark:text-red-400'
                            : 'border-emerald-300 text-emerald-700 dark:border-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        +{opt.loadingPercent}%
                      </Badge>
                    )}
                  </div>
                  {opt.warningText && isChecked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-1"
                    >
                      <AlertTriangle className="h-3 w-3 text-red-500 dark:text-red-400 shrink-0" />
                      <span className="text-[10px] text-red-600 dark:text-red-400 leading-tight">
                        {opt.warningText}
                      </span>
                    </motion.div>
                  )}
                </div>
              </Label>
            </motion.div>
          );
        })}

        {/* None option */}
        <Label
          htmlFor="ped-none"
          className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
            hasNone
              ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30'
              : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700'
          }`}
        >
          <Checkbox
            id="ped-none"
            checked={hasNone}
            onCheckedChange={() => handleToggle('none')}
            className="mt-0.5"
          />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium">None</span>
          </div>
        </Label>
      </div>

      {/* Loading summary */}
      {hasPED && totalLoading > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            className={`border ${
              hasHighRisk
                ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20'
            }`}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Total PED Loading
                </span>
                <Badge
                  className={`text-xs ${
                    hasHighRisk
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                >
                  +{totalLoading}% on base premium
                </Badge>
              </div>
              {hasHighRisk && (
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-1.5">
                  ⚠️ High-risk PED selected. Some insurers may decline or impose
                  longer waiting periods.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
