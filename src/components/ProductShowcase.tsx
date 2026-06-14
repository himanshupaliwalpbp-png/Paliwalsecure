'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Car, Plane, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/components/LanguageToggle';
import { t } from '@/lib/i18n';
import {
  categoryInfo,
  getPlansByCategory,
  type InsuranceCategory,
  type InsurancePlan,
} from '@/lib/insurance-data';

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

interface ProductShowcaseProps {
  onPlanSelect?: (planId: string) => void;
  onCompare?: () => void;
}

type ShowcaseTab = 'health' | 'life' | 'motor' | 'travel';

interface TabConfig {
  value: ShowcaseTab;
  labelKey: string;
  icon: React.ElementType;
  emoji: string;
  gradient: string;
  accentColor: string;
}

const TAB_CONFIG: TabConfig[] = [
  {
    value: 'health',
    labelKey: 'showcase.health',
    icon: Heart,
    emoji: '\u2764\uFE0F',
    gradient: 'from-rose-500 to-pink-600',
    accentColor: '#ef4444',
  },
  {
    value: 'life',
    labelKey: 'showcase.term',
    icon: Shield,
    emoji: '\uD83D\uDEE1\uFE0F',
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
  },
  {
    value: 'motor',
    labelKey: 'showcase.motor',
    icon: Car,
    emoji: '\uD83D\uDE97',
    gradient: 'from-amber-500 to-orange-600',
    accentColor: '#f59e0b',
  },
  {
    value: 'travel',
    labelKey: 'showcase.travel',
    icon: Plane,
    emoji: '\u2708\uFE0F',
    gradient: 'from-violet-500 to-purple-600',
    accentColor: '#C98A1C',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCsrColor(csr: number): { bg: string; text: string; border: string } {
  if (csr >= 99) return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' };
  if (csr >= 95) return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' };
  return { bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
}

function formatIndianPrice(amount: number): string {
  if (amount >= 100000) return `\u20B9${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `\u20B9${amount.toLocaleString('en-IN')}`;
  return `\u20B9${amount}`;
}

function getFrequencySuffix(category: ShowcaseTab, lang: ReturnType<typeof useLanguage>['language']): string {
  if (category === 'motor') return t('showcase.perYear', lang);
  if (category === 'travel') return t('showcase.perTrip', lang);
  return t('showcase.perMonth', lang);
}

function getPremiumAmount(plan: InsurancePlan, category: ShowcaseTab): number {
  if (category === 'motor' || category === 'travel') return plan.premium.annual;
  return plan.premium.monthly;
}

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

// ---------------------------------------------------------------------------
// PlanCard Component
// ---------------------------------------------------------------------------

function PlanCard({
  plan,
  category,
  isSelected,
  onSelect,
  lang,
  tabGradient,
  accentColor,
}: {
  plan: InsurancePlan;
  category: ShowcaseTab;
  isSelected: boolean;
  onSelect: (id: string) => void;
  lang: ReturnType<typeof useLanguage>['language'];
  tabGradient: string;
  accentColor: string;
}) {
  const csrColors = getCsrColor(plan.claimSettlementRatio);
  const premium = getPremiumAmount(plan, category);
  const frequencySuffix = getFrequencySuffix(category, lang);
  const features = plan.features.slice(0, 3);

  return (
    <motion.div variants={cardVariants} layout>
      <Card
        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-lg
          ${isSelected ? 'ring-2 ring-offset-2 ring-offset-background' : ''}
          border-border/60 bg-card`}
        style={isSelected ? { ringColor: accentColor } : undefined}
        onClick={() => onSelect(plan.id)}
      >
        {/* Gradient accent top bar */}
        <div
          className={`h-[2px] w-full bg-gradient-to-r ${tabGradient}`}
          style={{ background: isSelected ? accentColor : undefined }}
        />

        <CardContent className="p-5 flex flex-col gap-4">
          {/* Insurer + Plan name */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {plan.provider}
            </span>
            <h3 className="text-base font-semibold leading-snug line-clamp-2">
              {plan.name}
            </h3>
          </div>

          {/* CSR Badge + Rating */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`text-[11px] font-semibold px-2 py-0.5 border ${csrColors.bg} ${csrColors.text} ${csrColors.border}`}
            >
              {t('showcase.csr', lang)} {plan.claimSettlementRatio}%
            </Badge>
            {plan.rating > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {plan.rating}
              </span>
            )}
          </div>

          {/* Premium */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-muted-foreground">
              {t('showcase.startingFrom', lang)}
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-extrabold bg-gradient-to-r ${tabGradient} bg-clip-text text-transparent`}
              >
                {formatIndianPrice(premium)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {frequencySuffix}
              </span>
            </div>
          </div>

          {/* Key Features */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {t('showcase.keyFeatures', lang)}
            </span>
            <ul className="flex flex-col gap-1">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-500" />
                  <span className="text-foreground/80 leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                // Compare action handled by parent
              }}
            >
              {t('showcase.compare', lang)}
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs h-8 rounded-lg"
              style={{ background: accentColor }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(plan.id);
              }}
            >
              {t('showcase.details', lang)}
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
        </CardContent>

        {/* Selected indicator overlay */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-2xl pointer-events-none ring-2"
            style={{ ringColor: accentColor, boxShadow: `0 0 0 2px ${accentColor}` }}
          />
        )}
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ProductShowcase({ onPlanSelect, onCompare }: ProductShowcaseProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('health');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Get 3 featured plans for the active category, sorted by rating then CSR
  const featuredPlans = useMemo(() => {
    const all = getPlansByCategory(activeTab as InsuranceCategory);
    return [...all]
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.claimSettlementRatio - a.claimSettlementRatio;
      })
      .slice(0, 3);
  }, [activeTab]);

  // Get the active tab config
  const activeTabConfig = TAB_CONFIG.find((tc) => tc.value === activeTab)!;

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId((prev) => (prev === planId ? null : planId));
    onPlanSelect?.(planId);
  };

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="text-center mb-6 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t('showcase.title', language)}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          {t('showcase.subtitle', language)}
        </p>
      </div>

      {/* Tab Interface */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as ShowcaseTab);
          setSelectedPlanId(null);
        }}
        className="w-full"
      >
        <div className="flex justify-center px-4 mb-6">
          <TabsList className="h-auto p-1 rounded-xl bg-muted/60 backdrop-blur-sm gap-0.5">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`
                    relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium
                    transition-all duration-200 data-[state=active]:shadow-sm
                    ${isActive ? '' : 'hover:bg-background/50'}
                  `}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-base" aria-hidden="true">
                      {tab.emoji}
                    </span>
                    <span className="hidden sm:inline">{t(tab.labelKey, language)}</span>
                    <span className="sm:hidden">{t(tab.labelKey, language).charAt(0)}</span>
                  </span>
                  {/* Animated indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="showcase-tab-indicator"
                      className="absolute inset-0 rounded-lg bg-background dark:bg-input/30 shadow-sm"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        {TAB_CONFIG.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0 outline-none">
            <AnimatePresence mode="wait">
              {activeTab === tab.value && (
                <motion.div
                  key={tab.value}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4"
                >
                  {featuredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      category={tab.value}
                      isSelected={selectedPlanId === plan.id}
                      onSelect={handlePlanSelect}
                      lang={language}
                      tabGradient={tab.gradient}
                      accentColor={tab.accentColor}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>

      {/* View All CTA */}
      <div className="flex justify-center mt-8 px-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl gap-2"
          onClick={onCompare}
        >
          {t('showcase.viewAllPlans', language)}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
