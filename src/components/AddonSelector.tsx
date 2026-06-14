'use client';

import { motion } from 'framer-motion';
import { Heart, Shield, Car, Sparkles, Clock, IndianRupee, Target } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ============================================================================
// Types
// ============================================================================
export interface Addon {
  id: string;
  name: string;
  description: string;
  avgCost?: string | number;
  waitingPeriod?: string;
  bestFor?: string;
  recommended?: boolean;
}

export interface AddonSelectorProps {
  addons: Addon[];
  selectedAddons: string[];
  onToggle: (addonId: string) => void;
  type: 'health' | 'term' | 'motor';
  title?: string;
  showCost?: boolean;
}

// ============================================================================
// Icon & style maps by type
// ============================================================================
const typeConfig = {
  health: {
    icon: Heart,
    gradient: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50 dark:bg-rose-950/30',
    borderSelected: 'border-teal-400 dark:border-teal-500',
    bgSelected: 'bg-teal-50/50 dark:bg-teal-950/20',
    iconColor: 'text-rose-500',
    costBadgeBg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    waitBadgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    bestForBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
  term: {
    icon: Shield,
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    borderSelected: 'border-teal-400 dark:border-teal-500',
    bgSelected: 'bg-teal-50/50 dark:bg-teal-950/20',
    iconColor: 'text-blue-500',
    costBadgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    waitBadgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    bestForBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
  motor: {
    icon: Car,
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    borderSelected: 'border-teal-400 dark:border-teal-500',
    bgSelected: 'bg-teal-50/50 dark:bg-teal-950/20',
    iconColor: 'text-amber-500',
    costBadgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    waitBadgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    bestForBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
} as const;

// ============================================================================
// Animation variants
// ============================================================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

// ============================================================================
// AddonSelector Component
// ============================================================================
export default function AddonSelector({
  addons,
  selectedAddons,
  onToggle,
  type,
  title,
  showCost = true,
}: AddonSelectorProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const selectedCount = selectedAddons.length;

  const defaultTitles: Record<'health' | 'term' | 'motor', string> = {
    health: 'Health Riders & Add-ons',
    term: 'Term Life Riders',
    motor: 'Motor Insurance Add-ons',
  };

  const displayTitle = title ?? defaultTitles[type];

  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-card">
      {/* Section Header */}
      <CardHeader className={`${config.bgLight} border-b border-border/50`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {displayTitle}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {addons.length} options available · Select riders to enhance your coverage
              </p>
            </div>
          </div>
          {selectedCount > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-0 px-3 py-1 text-xs font-semibold">
                {selectedCount} selected
              </Badge>
            </motion.div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {addons.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);

            return (
              <motion.div
                key={addon.id}
                variants={itemVariants}
                layout
              >
                <label
                  htmlFor={`addon-${addon.id}`}
                  className={`
                    flex gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer
                    transition-all duration-200 ease-out group
                    ${
                      isSelected
                        ? `${config.bgSelected} ${config.borderSelected} shadow-sm`
                        : 'bg-background border-border hover:border-teal-200 dark:hover:border-teal-800'
                    }
                  `}
                >
                  {/* Checkbox */}
                  <div className="pt-0.5 shrink-0">
                    <Checkbox
                      id={`addon-${addon.id}`}
                      checked={isSelected}
                      onCheckedChange={() => onToggle(addon.id)}
                      aria-label={`Select ${addon.name}`}
                      className={`
                        transition-all duration-200
                        ${isSelected ? 'ring-2 ring-teal-400/30' : ''}
                      `}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Name + Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground leading-tight">
                        {addon.name}
                      </span>
                      {addon.recommended && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 px-2 py-0 h-5 text-[10px] font-semibold gap-1">
                          <Sparkles className="w-3 h-3" />
                          Recommended
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {addon.description}
                    </p>

                    {/* Badges row */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {/* Cost badge */}
                      {showCost && addon.avgCost && (
                        <Badge
                          variant="outline"
                          className={`${config.costBadgeBg} border-0 px-2 py-0 h-5 text-[10px] font-medium gap-1`}
                        >
                          <IndianRupee className="w-2.5 h-2.5" />
                          {typeof addon.avgCost === 'number'
                            ? `₹${addon.avgCost.toLocaleString()}/yr`
                            : addon.avgCost}
                        </Badge>
                      )}

                      {/* Waiting period badge */}
                      {addon.waitingPeriod && (
                        <Badge
                          variant="outline"
                          className={`${config.waitBadgeBg} border-0 px-2 py-0 h-5 text-[10px] font-medium gap-1`}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          {addon.waitingPeriod}
                        </Badge>
                      )}
                    </div>

                    {/* Best for */}
                    {addon.bestFor && (
                      <div className="flex items-start gap-1.5 pt-0.5">
                        <Target className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          <span className="font-medium">Best for:</span> {addon.bestFor}
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer info */}
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-border"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  {selectedCount} {selectedCount === 1 ? 'rider' : 'riders'}
                </span>{' '}
                selected — premium will be adjusted accordingly
              </span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
