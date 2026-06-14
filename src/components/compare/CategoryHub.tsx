'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Car, Heart, Shield, Plane, Home, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/* ────────────────────────────────────────────────────────────────────────────
   CategoryHub — Animated category selector cards for the compare hub page
   ──────────────────────────────────────────────────────────────────────────── */

export interface CategoryData {
  id: string;
  icon: React.ElementType;
  emoji: string;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  borderHover: string;
  href: string;
  showGSTBadge?: boolean;
}

const categories: CategoryData[] = [
  {
    id: 'motor',
    icon: Car,
    emoji: '🚗',
    title: 'Motor Insurance',
    description: 'Compare Car, Bike & EV insurance with IRDAI-mandated third-party rates and own-damage premiums.',
    features: ['Car / Bike / EV', '8 Insurers', 'NCB Calculator', 'IDV Calculator'],
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderHover: 'hover:border-amber-300 dark:hover:border-amber-700/50',
    href: '/compare/motor',
  },
  {
    id: 'health',
    icon: Heart,
    emoji: '🏥',
    title: 'Health Insurance',
    description: 'Save 0% GST on health insurance via POSP route. Compare plans with PED loading & disease-specific recos.',
    features: ['0% GST Savings', '7 Insurers', 'PED Loading', 'Disease Recos'],
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-600 dark:text-rose-400',
    borderHover: 'hover:border-rose-300 dark:hover:border-rose-700/50',
    href: '/compare/health',
    showGSTBadge: true,
  },
  {
    id: 'life',
    icon: Shield,
    emoji: '🛡️',
    title: 'Life Insurance',
    description: '0% GST on term plans via POSP. Smoker loading, cover adequacy checks & riders from 8 insurers.',
    features: ['0% GST Savings', '8 Insurers', 'Smoker Loading', 'Cover Adequacy'],
    gradient: 'from-blue-700 to-blue-500',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-700 dark:text-blue-400',
    borderHover: 'hover:border-blue-300 dark:hover:border-blue-700/50',
    href: '/compare/life',
    showGSTBadge: true,
  },
  {
    id: 'travel',
    icon: Plane,
    emoji: '✈️',
    title: 'Travel Insurance',
    description: 'Senior-friendly travel insurance for 4 destination zones with 6 add-on covers and instant quotes.',
    features: ['4 Destinations', 'Senior Friendly', '6 Add-ons', 'Instant Quotes'],
    gradient: 'from-teal-500 to-cyan-600',
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-600 dark:text-teal-400',
    borderHover: 'hover:border-teal-300 dark:hover:border-teal-700/50',
    href: '/compare/travel',
  },
  {
    id: 'home',
    icon: Home,
    emoji: '🏠',
    title: 'Home Insurance',
    description: 'Structure + Contents coverage with zone loading, earthquake cover & flood protection for your property.',
    features: ['Structure + Contents', 'Zone Loading', 'Earthquake Cover', 'Flood Protection'],
    gradient: 'from-emerald-500 to-green-600',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700/50',
    href: '/compare/home',
  },
];

/* ── Animation Variants ────────────────────────────────────────────────────── */

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function CategoryHub() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
    >
      {categories.map((cat) => {
        const CatIcon = cat.icon;
        return (
          <motion.div
            key={cat.id}
            variants={cardVariant}
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
            className="group"
          >
            <Link href={cat.href} className="block h-full">
              <div
                className={`relative h-full rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-5 sm:p-6 transition-all duration-300 ${cat.borderHover} hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 overflow-hidden`}
              >
                {/* ── Subtle gradient overlay on hover ── */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-500 rounded-2xl sm:rounded-3xl pointer-events-none`}
                />

                {/* ── Top row: Icon + Badge ── */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl ${cat.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <CatIcon className={`w-6 h-6 ${cat.iconColor}`} />
                  </div>

                  {cat.showGSTBadge && (
                    <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800 text-[10px] font-semibold px-2 py-0.5">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                      0% GST
                    </Badge>
                  )}
                </div>

                {/* ── Title + Emoji ── */}
                <div className="relative z-10 mb-2">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    {cat.title}
                  </h3>
                </div>

                {/* ── Description ── */}
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* ── Feature Pills ── */}
                <div className="relative z-10 flex flex-wrap gap-1.5 mb-5">
                  {cat.features.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] sm:text-xs font-medium text-muted-foreground"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* ── CTA Button ── */}
                <div className="relative z-10 flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  <span>Compare Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>

                {/* ── Bottom accent line ── */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export { categories };
