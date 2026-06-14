'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Shield,
  Car,
  Bike,
  Home,
  Plane,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Types ─────────────────────────────────────────────────────────── */
interface CategoryItem {
  key: string;
  icon: React.ElementType;
  href: string;
  price: string;
  emoji: string;
  quickStat: string;
}

const categories: CategoryItem[] = [
  { key: 'health', icon: Heart, href: '/health-insurance', price: '₹499/mo', emoji: '', quickStat: 'Starting ₹15/day' },
  { key: 'termLife', icon: Shield, href: '/life-insurance', price: '₹489/mo', emoji: '', quickStat: 'Starting ₹16/day' },
  { key: 'car', icon: Car, href: '/car-insurance', price: '₹2,094/yr', emoji: '', quickStat: 'Starting ₹5.7/day' },
  { key: 'bike', icon: Bike, href: '/bike-insurance', price: '₹714/yr', emoji: '', quickStat: 'Starting ₹2/day' },
  { key: 'travel', icon: Plane, href: '/travel-insurance', price: '₹256/trip', emoji: '', quickStat: 'From ₹256/trip' },
  { key: 'home', icon: Home, href: '/home-insurance', price: '₹1,500/yr', emoji: '', quickStat: 'Starting ₹4/day' },
  { key: 'business', icon: Building2, href: '/compare', price: '', emoji: '', quickStat: 'Custom quote' },
];

/* ── Inline translations ───────────────────────────────────────────── */
const categoryTitles: Record<string, { en: string; hi: string; hg: string }> = {
  health: { en: 'Health Insurance', hi: 'हेल्थ इंश्योरेंस', hg: 'Health Insurance' },
  termLife: { en: 'Term Insurance', hi: 'टर्म इंश्योरेंस', hg: 'Term Insurance' },
  car: { en: 'Car Insurance', hi: 'कार इंश्योरेंस', hg: 'Car Insurance' },
  bike: { en: 'Bike Insurance', hi: 'बाइक इंश्योरेंस', hg: 'Bike Insurance' },
  home: { en: 'Home Insurance', hi: 'होम इंश्योरेंस', hg: 'Home Insurance' },
  travel: { en: 'Travel Insurance', hi: 'ट्रैवल इंश्योरेंस', hg: 'Travel Insurance' },
  business: { en: 'Business Insurance', hi: 'बिज़नेस इंश्योरेंस', hg: 'Business Insurance' },
};

const categoryBenefits: Record<string, { en: string; hi: string; hg: string }> = {
  health: { en: "Protect your family's health", hi: 'अपने परिवार के स्वास्थ्य की रक्षा करें', hg: 'Apne parivaar ki health ki raksha karein' },
  termLife: { en: "Secure your family's future", hi: 'अपने परिवार का भविष्य सुरक्षित करें', hg: 'Apne parivaar ka future secure karein' },
  car: { en: 'Comprehensive car coverage', hi: 'व्यापक कार कवरेज', hg: 'Comprehensive car coverage' },
  bike: { en: 'Full bike protection', hi: 'पूर्ण बाइक सुरक्षा', hg: 'Full bike protection' },
  home: { en: 'Protect your biggest asset', hi: 'अपनी सबसे बड़ी संपत्ति की रक्षा करें', hg: 'Apni sabse badi sampatti ki raksha karein' },
  travel: { en: 'Worry-free travel', hi: 'चिंता-मुक्त यात्रा', hg: 'Worry-free travel' },
  business: { en: 'Group health & liability', hi: 'ग्रुप हेल्थ और लायबिलिटी', hg: 'Group health & liability' },
};

/* ── Animation variants ────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── Component ─────────────────────────────────────────────────────── */
export default function CategoryCards() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const heading = isHindi ? 'हर ज़रूरत के लिए इंश्योरेंस' : isEnglish ? 'Insurance for every need' : 'Har zaroorat ke liye insurance';
  const subtitle = isHindi ? '51+ बीमाकर्ताओं से AI की सलाह पर प्लान' : isEnglish ? 'AI-recommended plans from 51+ insurers' : '51+ insurers se AI ki salah par plan';

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-7xl">
        {/* ── Section Header ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {heading}
          </h2>
          <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* ── Desktop / Tablet Grid ───────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.key} item={cat} isHindi={isHindi} isEnglish={isEnglish} />
          ))}
        </motion.div>

        {/* ── Mobile: Horizontal Snap Scroll ──────────────────────── */}
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="snap-center shrink-0 w-[260px]"
            >
              <CategoryCard item={cat} isHindi={isHindi} isEnglish={isEnglish} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Card Sub-component — Clean card, no glassmorphism ───────────────── */
function CategoryCard({ item, isHindi, isEnglish }: { item: CategoryItem; isHindi: boolean; isEnglish: boolean }) {
  const Icon = item.icon;
  const customQuote = isHindi ? 'कस्टम कोट' : 'Custom quote';
  const fromLabel = isHindi ? 'से' : isEnglish ? 'From' : 'Se';
  const price = item.price || customQuote;

  const title = isHindi
    ? categoryTitles[item.key]?.hi ?? categoryTitles[item.key]?.en
    : isEnglish
      ? categoryTitles[item.key]?.en
      : categoryTitles[item.key]?.hg ?? categoryTitles[item.key]?.en;

  const benefit = isHindi
    ? categoryBenefits[item.key]?.hi ?? categoryBenefits[item.key]?.en
    : isEnglish
      ? categoryBenefits[item.key]?.en
      : categoryBenefits[item.key]?.hg ?? categoryBenefits[item.key]?.en;

  return (
    <Link href={item.href} className="block group">
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
        className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-3 h-full cursor-pointer transition-all duration-250 hover:border-foreground/20"
      >
        {/* AI Pick Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            AI Pick
          </span>
        </div>

        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-foreground text-base leading-snug">
          {title}
        </h3>

        {/* Benefit */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {benefit}
        </p>

        {/* Subtle accent line */}
        <div className="w-8 h-[2px] rounded-full bg-primary/40" />

        {/* Price + Quick Stat */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <p className="text-sm font-mono font-semibold text-primary">
            {item.key === 'business' ? (
              price
            ) : (
              <>
                <span className="text-xs text-muted-foreground font-sans font-normal mr-1">
                  {fromLabel}
                </span>
                {item.price}
              </>
            )}
          </p>
          <span className="text-[10px] text-[var(--trust)] font-mono font-medium bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
            {item.quickStat}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
