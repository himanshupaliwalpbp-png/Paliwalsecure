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
  { key: 'health', icon: Heart, href: '/health-insurance', price: '₹499/mo', emoji: '', quickStat: 'Starting ₹15/day', color: '#B8482C', badgeVariant: 'green',
    features: [
      { en: 'Cashless Treatment', hi: 'कैशलेस इलाज', hg: 'Cashless Ilaj' },
      { en: 'Family Floater', hi: 'फैमिली फ्लोटर', hg: 'Family Floater' },
      { en: 'Pre & Post Hospitalization', hi: 'अस्पताल से पहले और बाद', hg: 'Hospital ke pehle aur baad ka kharcha' },
    ] },
  { key: 'termLife', icon: Shield, href: '/life-insurance', price: '₹489/mo', emoji: '', quickStat: 'Starting ₹16/day', color: '#1B4D4A', badgeVariant: 'blue',
    features: [
      { en: 'Term Plans', hi: 'टर्म प्लान', hg: 'Term Plans' },
      { en: 'Investment Plans', hi: 'निवेश योजनाएं', hg: 'Investment Plans' },
      { en: 'Critical Illness Cover', hi: 'गंभीर बीमारी कवर', hg: 'Bimari Cover' },
    ] },
  { key: 'car', icon: Car, href: '/car-insurance', price: '₹2,094/yr', emoji: '', quickStat: 'Starting ₹5.7/day', color: '#B8482C', badgeVariant: 'green',
    features: [
      { en: 'Comprehensive Cover', hi: 'व्यापक कवर', hg: 'Poori Cover' },
      { en: 'Zero Depreciation', hi: 'ज़ीरो डेप्रिसिएशन', hg: 'Zero Depreciation' },
      { en: 'Roadside Assistance', hi: 'रोडसाइड सहायता', hg: 'Roadside Help' },
    ] },
  { key: 'bike', icon: Bike, href: '/bike-insurance', price: '₹714/yr', emoji: '', quickStat: 'Starting ₹2/day', color: '#1B4D4A', badgeVariant: 'gold',
    features: [
      { en: 'Third Party Cover', hi: 'थर्ड पार्टी कवर', hg: 'Third Party Cover' },
      { en: 'Comprehensive Plan', hi: 'व्यापक प्लान', hg: 'Poori Plan' },
      { en: 'Add-on Covers', hi: 'अड-ऑन कवर', hg: 'Extra Covers' },
    ] },
  { key: 'travel', icon: Plane, href: '/travel-insurance', price: '₹256/trip', emoji: '', quickStat: 'From ₹256/trip', color: '#B8482C', badgeVariant: 'blue',
    features: [
      { en: 'Medical Emergency', hi: 'मेडिकल इमरजेंसी', hg: 'Medical Emergency' },
      { en: 'Trip Cancellation', hi: 'ट्रिप कैंसिलेशन', hg: 'Trip Cancel' },
      { en: 'Lost Baggage', hi: 'खोई हुई सामान', hg: 'Samaan kho jane par' },
    ] },
  { key: 'home', icon: Home, href: '/home-insurance', price: '₹1,500/yr', emoji: '', quickStat: 'Starting ₹4/day', color: '#1B4D4A', badgeVariant: 'blue',
    features: [
      { en: 'Structure Cover', hi: 'संरचना कवर', hg: 'Ghar ki Structure Cover' },
      { en: 'Contents Insurance', hi: 'सामग्री बीमा', hg: 'Samaan ka Insurance' },
      { en: 'Natural Disaster', hi: 'प्राकृतिक आपदा', hg: 'Prakritik Aapda' },
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
      className="section-premium bg-[#FAF7F2] dark:bg-[#0E1116]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 md:mb-18"
        >
          <h2 className="text-display-h2 font-display text-[#0E1116] dark:text-[#FAF7F2] mb-4">
            {heading.replace(headingAccent, '')}
            <span className="text-accent-gradient"> {headingAccent}</span>
          </h2>
          <p className="text-lead-premium text-[#4A4F57] dark:text-[#B8BCC2] max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Bento grid — 2→3→4 cols responsive; first card spans 2 cols at lg for bento rhythm */}
        <div className="bento-grid">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const title = isHindi ? categoryTitles[cat.key]?.hi : isEnglish ? categoryTitles[cat.key]?.en : categoryTitles[cat.key]?.hg;
            const description = isHindi ? categoryDescriptions[cat.key]?.hi : isEnglish ? categoryDescriptions[cat.key]?.en : categoryDescriptions[cat.key]?.hg;
            const isAccent = cat.color === '#B8482C';
            const tintBg = isAccent ? 'bg-[#F4E5DD] dark:bg-[#3A1E14]' : 'bg-[#E6EFEE] dark:bg-[#0F2A28]';
            const iconColor = isAccent ? '#B8482C' : '#1B4D4A';
            const checkBg = isAccent ? 'rgba(184,72,44,0.10)' : 'rgba(27,77,74,0.10)';
            const isFirst = index === 0;

            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className={isFirst ? 'lg:col-span-2' : ''}
              >
                <Link href={cat.href} className="block group h-full">
                  <div className="bg-white dark:bg-[#161A22] border border-[rgba(14,17,22,0.08)] dark:border-white/[0.08] rounded-2xl shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 p-6 md:p-7 h-full flex flex-col cursor-pointer">
                    {/* Icon + Title row */}
                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className={`flex-shrink-0 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${tintBg}`}
                      >
                        <Icon className="h-5 w-5" style={{ color: iconColor }} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-[#0E1116] dark:text-[#FAF7F2] text-xl md:text-2xl tracking-tight" style={{ fontWeight: 500 }}>
                          {title}
                        </h3>
                        <p className="text-body-premium text-[#4A4F57] dark:text-[#B8BCC2] mt-1">
                          {description}
                        </p>
                      </div>
                    </div>

                    {/* Feature list with check icons */}
                    <ul className="space-y-2.5 flex-1 mb-5">
                      {cat.features.map((feature, i) => {
                        const featureText = isHindi ? feature.hi : isEnglish ? feature.en : feature.hg;
                        return (
                          <li key={i} className="flex items-center gap-2.5 text-body-premium text-[#0E1116] dark:text-[#FAF7F2]">
                            <div
                              className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: checkBg }}
                            >
                              <Check className="w-2.5 h-2.5" style={{ color: iconColor }} strokeWidth={3} />
                            </div>
                            {featureText}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Price + AI Pick badge */}
                    <div className="pt-4 border-t border-[rgba(14,17,22,0.08)] dark:border-white/[0.08] flex items-center justify-between gap-3">
                      <span className="font-display text-[#0E1116] dark:text-[#FAF7F2] tabular-nums text-lg md:text-xl" style={{ fontWeight: 500 }}>
                        {cat.price}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4E5DD] dark:bg-[#3A1E14] text-[#8B3520] dark:text-[#E89572] text-caption-premium"
                        style={{ fontSize: '0.6875rem', letterSpacing: '0.04em' }}
                      >
                        <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                        {isHindi ? 'AI चुनाव' : isEnglish ? 'AI Pick' : 'AI Chunaav'}
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
