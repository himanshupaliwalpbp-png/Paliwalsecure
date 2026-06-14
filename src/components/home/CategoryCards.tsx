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
  color: string;
  features: { en: string; hi: string; hg: string }[];
}

const categories: CategoryItem[] = [
  { key: 'health', icon: Heart, href: '/health-insurance', price: '₹499/mo', emoji: '', quickStat: 'Starting ₹15/day', color: '#EF4444',
    features: [
      { en: 'Cashless Treatment', hi: 'कैशलेस इलाज', hg: 'Cashless Treatment' },
      { en: 'Family Floater', hi: 'फैमिली फ्लोटर', hg: 'Family Floater' },
      { en: 'Pre & Post Hospitalization', hi: 'अस्पताल से पहले और बाद', hg: 'Pre & Post Hospitalization' },
    ] },
  { key: 'termLife', icon: Shield, href: '/life-insurance', price: '₹489/mo', emoji: '', quickStat: 'Starting ₹16/day', color: '#2563EB',
    features: [
      { en: 'Term Plans', hi: 'टर्म प्लान', hg: 'Term Plans' },
      { en: 'Investment Plans', hi: 'निवेश योजनाएं', hg: 'Investment Plans' },
      { en: 'Critical Illness Cover', hi: 'गंभीर बीमारी कवर', hg: 'Critical Illness Cover' },
    ] },
  { key: 'car', icon: Car, href: '/car-insurance', price: '₹2,094/yr', emoji: '', quickStat: 'Starting ₹5.7/day', color: '#10B981',
    features: [
      { en: 'Comprehensive Cover', hi: 'व्यापक कवर', hg: 'Comprehensive Cover' },
      { en: 'Zero Depreciation', hi: 'ज़ीरो डेप्रिसिएशन', hg: 'Zero Depreciation' },
      { en: 'Roadside Assistance', hi: 'रोडसाइड सहायता', hg: 'Roadside Assistance' },
    ] },
  { key: 'bike', icon: Bike, href: '/bike-insurance', price: '₹714/yr', emoji: '', quickStat: 'Starting ₹2/day', color: '#F59E0B',
    features: [
      { en: 'Third Party Cover', hi: 'थर्ड पार्टी कवर', hg: 'Third Party Cover' },
      { en: 'Comprehensive Plan', hi: 'व्यापक प्लान', hg: 'Comprehensive Plan' },
      { en: 'Add-on Covers', hi: 'अड-ऑन कवर', hg: 'Add-on Covers' },
    ] },
  { key: 'travel', icon: Plane, href: '/travel-insurance', price: '₹256/trip', emoji: '', quickStat: 'From ₹256/trip', color: '#06B6D4',
    features: [
      { en: 'Medical Emergency', hi: 'मेडिकल इमरजेंसी', hg: 'Medical Emergency' },
      { en: 'Trip Cancellation', hi: 'ट्रिप कैंसिलेशन', hg: 'Trip Cancellation' },
      { en: 'Lost Baggage', hi: 'खोई हुई सामान', hg: 'Lost Baggage' },
    ] },
  { key: 'home', icon: Home, href: '/home-insurance', price: '₹1,500/yr', emoji: '', quickStat: 'Starting ₹4/day', color: '#8B5CF6',
    features: [
      { en: 'Structure Cover', hi: 'संरचना कवर', hg: 'Structure Cover' },
      { en: 'Contents Insurance', hi: 'सामग्री बीमा', hg: 'Contents Insurance' },
      { en: 'Natural Disaster', hi: 'प्राकृतिक आपदा', hg: 'Natural Disaster' },
    ] },
];

/* ── Inline translations ───────────────────────────────────────────── */
const categoryTitles: Record<string, { en: string; hi: string; hg: string }> = {
  health: { en: 'Health Insurance', hi: 'हेल्थ इंश्योरेंस', hg: 'Health Insurance' },
  termLife: { en: 'Life Insurance', hi: 'लाइफ इंश्योरेंस', hg: 'Life Insurance' },
  car: { en: 'Car Insurance', hi: 'कार इंश्योरेंस', hg: 'Car Insurance' },
  bike: { en: 'Bike Insurance', hi: 'बाइक इंश्योरेंस', hg: 'Bike Insurance' },
  home: { en: 'Home Insurance', hi: 'होम इंश्योरेंस', hg: 'Home Insurance' },
  travel: { en: 'Travel Insurance', hi: 'ट्रैवल इंश्योरेंस', hg: 'Travel Insurance' },
};

const categoryDescriptions: Record<string, { en: string; hi: string; hg: string }> = {
  health: { en: "Protect your family's health", hi: 'अपने परिवार के स्वास्थ्य की रक्षा करें', hg: 'Apne parivaar ki health ki raksha karein' },
  termLife: { en: "Secure your family's future", hi: 'अपने परिवार का भविष्य सुरक्षित करें', hg: 'Apne parivaar ka future secure karein' },
  car: { en: 'Complete car coverage', hi: 'व्यापक कार कवरेज', hg: 'Complete car coverage' },
  bike: { en: 'Full bike protection', hi: 'पूर्ण बाइक सुरक्षा', hg: 'Full bike protection' },
  home: { en: 'Protect your biggest asset', hi: 'अपनी सबसे बड़ी संपत्ति की रक्षा करें', hg: 'Apni sabse badi sampatti ki raksha karein' },
  travel: { en: 'Worry-free travel', hi: 'चिंता-मुक्त यात्रा', hg: 'Worry-free travel' },
};

/* ── Animation variants ────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── Component ─────────────────────────────────────────────────────── */
export default function CategoryCards() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const heading = isHindi ? 'संपूर्ण सुरक्षा' : isEnglish ? 'Complete Protection Suite' : 'Complete Protection Suite';
  const headingAccent = isHindi ? 'पैकेज' : isEnglish ? 'Suite' : 'Suite';
  const subtitle = isHindi ? 'हर ज़रूरत के लिए इंश्योरेंस — 51+ बीमाकर्ताओं से AI की सलाह पर प्लान' : isEnglish ? 'From health to wealth, we\'ve got you covered with India\'s leading insurance providers.' : 'Har zaroorat ke liye insurance — 51+ insurers se AI ki salah par plan';

  return (
    <section className="py-24 bg-white dark:bg-[#060E22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#F8F6F0] mb-4 font-display">
            {heading.replace(headingAccent, '')}
            <span className="gradient-text-blue-emerald"> {headingAccent}</span>
          </h2>
          <p className="text-xl text-[#64748B] dark:text-[#A6AEC7] max-w-3xl mx-auto font-body">
            {subtitle}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const title = isHindi ? categoryTitles[cat.key]?.hi : isEnglish ? categoryTitles[cat.key]?.en : categoryTitles[cat.key]?.hg;
            const description = isHindi ? categoryDescriptions[cat.key]?.hi : isEnglish ? categoryDescriptions[cat.key]?.en : categoryDescriptions[cat.key]?.hg;

            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={cat.href} className="block group">
                  <div className="p-6 border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-card/60 hover:shadow-premium-lg transition-all duration-300 rounded-2xl h-full cursor-pointer">
                    <div
                      className="inline-flex p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: cat.color }} strokeWidth={2} />
                    </div>

                    <h3 className="text-xl font-semibold text-[#0F172A] dark:text-[#F8F6F0] mb-2 font-display">
                      {title}
                    </h3>
                    <p className="text-[#64748B] dark:text-[#A6AEC7] mb-4 font-body">{description}</p>

                    <ul className="space-y-2">
                      {cat.features.map((feature, i) => {
                        const featureText = isHindi ? feature.hi : isEnglish ? feature.en : feature.hg;
                        return (
                          <li key={i} className="flex items-center gap-2 text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            ></div>
                            {featureText}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Price */}
                    <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-white/10 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#2563EB] dark:text-[#D4A853] font-body">{cat.price}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-[#64748B] dark:text-[#A6AEC7] font-body">
                        <Sparkles className="w-3 h-3" />
                        AI Pick
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
