'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Heart,
  Shield,
  Car,
  Bike,
  Home,
  Plane,
  Sparkles,
  Check,
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
  badgeVariant: 'blue' | 'green' | 'gold';
  features: { en: string; hi: string; hg: string }[];
}

const categories: CategoryItem[] = [
  { key: 'health', icon: Heart, href: '/health-insurance', price: '₹499/mo', emoji: '', quickStat: 'Starting ₹15/day', color: '#EF4444', badgeVariant: 'green',
    features: [
      { en: 'Cashless Treatment', hi: 'कैशलेस इलाज', hg: 'Cashless Treatment' },
      { en: 'Family Floater', hi: 'फैमिली फ्लोटर', hg: 'Family Floater' },
      { en: 'Pre & Post Hospitalization', hi: 'अस्पताल से पहले और बाद', hg: 'Hospitalization se pehle aur baad' },
    ] },
  { key: 'termLife', icon: Shield, href: '/life-insurance', price: '₹489/mo', emoji: '', quickStat: 'Starting ₹16/day', color: '#043C50', badgeVariant: 'blue',
    features: [
      { en: 'Term Plans', hi: 'टर्म प्लान', hg: 'Term Plans' },
      { en: 'Investment Plans', hi: 'निवेश योजनाएं', hg: 'Investment Plans' },
      { en: 'Critical Illness Cover', hi: 'गंभीर बीमारी कवर', hg: 'Critical Illness Cover' },
    ] },
  { key: 'car', icon: Car, href: '/car-insurance', price: '₹2,094/yr', emoji: '', quickStat: 'Starting ₹5.7/day', color: '#08799A', badgeVariant: 'green',
    features: [
      { en: 'Comprehensive Cover', hi: 'व्यापक कवर', hg: 'Comprehensive Cover' },
      { en: 'Zero Depreciation', hi: 'ज़ीरो डेप्रिसिएशन', hg: 'Zero Depreciation' },
      { en: 'Roadside Assistance', hi: 'रोडसाइड सहायता', hg: 'Roadside Assistance' },
    ] },
  { key: 'bike', icon: Bike, href: '/bike-insurance', price: '₹714/yr', emoji: '', quickStat: 'Starting ₹2/day', color: '#F59E0B', badgeVariant: 'gold',
    features: [
      { en: 'Third Party Cover', hi: 'थर्ड पार्टी कवर', hg: 'Third Party Cover' },
      { en: 'Comprehensive Plan', hi: 'व्यापक प्लान', hg: 'Comprehensive Plan' },
      { en: 'Add-on Covers', hi: 'अड-ऑन कवर', hg: 'Add-on Covers' },
    ] },
  { key: 'travel', icon: Plane, href: '/travel-insurance', price: '₹256/trip', emoji: '', quickStat: 'From ₹256/trip', color: '#06B6D4', badgeVariant: 'blue',
    features: [
      { en: 'Medical Emergency', hi: 'मेडिकल इमरजेंसी', hg: 'Medical Emergency' },
      { en: 'Trip Cancellation', hi: 'ट्रिप कैंसिलेशन', hg: 'Trip Cancellation' },
      { en: 'Lost Baggage', hi: 'खोई हुई सामान', hg: 'Samaan kho jane par' },
    ] },
  { key: 'home', icon: Home, href: '/home-insurance', price: '₹1,500/yr', emoji: '', quickStat: 'Starting ₹4/day', color: '#8B5CF6', badgeVariant: 'blue',
    features: [
      { en: 'Structure Cover', hi: 'संरचना कवर', hg: 'Structure Cover' },
      { en: 'Contents Insurance', hi: 'सामग्री बीमा', hg: 'Contents Insurance' },
      { en: 'Natural Disaster', hi: 'प्राकृतिक आपदा', hg: 'Prakritik aapda' },
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
  car: { en: 'Complete car coverage', hi: 'व्यापक कार कवरेज', hg: 'Poori car coverage' },
  bike: { en: 'Full bike protection', hi: 'पूर्ण बाइक सुरक्षा', hg: 'Poori bike suraksha' },
  home: { en: 'Protect your biggest asset', hi: 'अपनी सबसे बड़ी संपत्ति की रक्षा करें', hg: 'Apni sabse badi sampatti ki raksha karein' },
  travel: { en: 'Worry-free travel', hi: 'चिंता-मुक्त यात्रा', hg: 'Bina tension ki yatra' },
};

/* ── Badge class helper ───────────────────────────────────────────── */
function getBadgeClass(variant: 'blue' | 'green' | 'gold') {
  switch (variant) {
    case 'green': return 'badge-premium-green';
    case 'gold': return 'badge-premium-gold';
    default: return 'badge-premium-blue';
  }
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function CategoryCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const heading = isHindi ? 'संपूर्ण सुरक्षा' : isEnglish ? 'Complete Protection Suite' : 'Complete Protection';
  const headingAccent = isHindi ? 'पैकेज' : isEnglish ? 'Suite' : 'Package';
  const subtitle = isHindi ? 'हर ज़रूरत के लिए इंश्योरेंस — 51+ बीमाकर्ताओं से AI की सलाह पर प्लान' : isEnglish ? 'From health to wealth, we\'ve got you covered with India\'s leading insurance providers.' : 'Har zaroorat ke liye insurance — 51+ insurers se AI ki salah par plan';

  return (
    <section
      ref={sectionRef}
      className="section-luxury section-luxury-alt"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 md:mb-18"
        >
          <h2 className="text-section-title mb-4">
            {heading.replace(headingAccent, '')}
            <span className="gradient-text-blue-emerald"> {headingAccent}</span>
          </h2>
          <p className="text-body-lg max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Grid — 3 columns desktop, 2 tablet, 1 mobile */}
        <div className="category-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const title = isHindi ? categoryTitles[cat.key]?.hi : isEnglish ? categoryTitles[cat.key]?.en : categoryTitles[cat.key]?.hg;
            const description = isHindi ? categoryDescriptions[cat.key]?.hi : isEnglish ? categoryDescriptions[cat.key]?.en : categoryDescriptions[cat.key]?.hg;

            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <Link href={cat.href} className="block group h-full">
                  <div className="premium-card h-full flex flex-col cursor-pointer">
                    {/* Icon + Title row */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="flex-shrink-0 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#DBEAFE]"
                      >
                        <Icon className="h-5 w-5" style={{ color: cat.color }} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-card-title">
                          {title}
                        </h3>
                        <p className="text-sm font-body mt-0.5 category-card-description" style={{ color: '#374151' }}>
                          {description}
                        </p>
                      </div>
                    </div>

                    {/* Feature list with check icons */}
                    <ul className="space-y-2.5 flex-1 mb-5">
                      {cat.features.map((feature, i) => {
                        const featureText = isHindi ? feature.hi : isEnglish ? feature.en : feature.hg;
                        return (
                          <li key={i} className="flex items-center gap-2.5 text-sm text-[#111111] dark:text-[#F3EADB] font-body category-card-feature">
                            <div
                              className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${cat.color}12` }}
                            >
                              <Check className="w-2.5 h-2.5" style={{ color: cat.color }} strokeWidth={3} />
                            </div>
                            {featureText}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Price + AI Pick badge */}
                    <div className="pt-4 border-t border-[#E8E2D6] dark:border-[#F3EADB]/10 flex items-center justify-between gap-3 category-card-footer">
                      <span className={getBadgeClass(cat.badgeVariant)}>
                        {cat.price}
                      </span>
                      <span className="badge-premium-gold">
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
