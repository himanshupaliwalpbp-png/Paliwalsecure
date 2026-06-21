'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
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
  image: string;
  features: { en: string; hi: string; hg: string }[];
}

const categories: CategoryItem[] = [
  // 🟢 Emerald = Protection (health, life) — trust, safety
  { key: 'health', icon: Heart, href: '/health-insurance', price: '₹499/mo', emoji: '', quickStat: 'Starting ₹15/day', color: '#2D6A4F', badgeVariant: 'green', image: '/images/category-cards/health-insurance-hero.png',
    features: [
      { en: 'Cashless Treatment', hi: 'कैशलेस इलाज', hg: 'Cashless Ilaj' },
      { en: 'Family Floater', hi: 'फैमिली फ्लोटर', hg: 'Family Floater' },
      { en: 'Pre & Post Hospitalization', hi: 'अस्पताल से पहले और बाद', hg: 'Hospital ke pehle aur baad ka kharcha' },
    ] },
  { key: 'termLife', icon: Shield, href: '/life-insurance', price: '₹489/mo', emoji: '', quickStat: 'Starting ₹16/day', color: '#1B4D4A', badgeVariant: 'blue', image: '/images/category-cards/life-insurance-hero.png',
    features: [
      { en: 'Term Plans', hi: 'टर्म प्लान', hg: 'Term Plans' },
      { en: 'Investment Plans', hi: 'निवेश योजनाएं', hg: 'Investment Plans' },
      { en: 'Critical Illness Cover', hi: 'गंभीर बीमारी कवर', hg: 'Bimari Cover' },
    ] },
  // 🟠 Sienna = Action (car, bike) — energy, movement
  { key: 'car', icon: Car, href: '/car-insurance', price: '₹2,094/yr', emoji: '', quickStat: 'Starting ₹5.7/day', color: '#B8482C', badgeVariant: 'green', image: '/images/category-cards/car-insurance-hero-v2.png',
    features: [
      { en: 'Comprehensive Cover', hi: 'व्यापक कवर', hg: 'Poori Cover' },
      { en: 'Zero Depreciation', hi: 'ज़ीरो डेप्रिसिएशन', hg: 'Zero Depreciation' },
      { en: 'Roadside Assistance', hi: 'रोडसाइड सहायता', hg: 'Roadside Help' },
    ] },
  { key: 'bike', icon: Bike, href: '/bike-insurance', price: '₹714/yr', emoji: '', quickStat: 'Starting ₹2/day', color: '#B8482C', badgeVariant: 'gold', image: '/images/category-cards/bike-insurance-hero.png',
    features: [
      { en: 'Third Party Cover', hi: 'थर्ड पार्टी कवर', hg: 'Third Party Cover' },
      { en: 'Comprehensive Plan', hi: 'व्यापक प्लान', hg: 'Poori Plan' },
      { en: 'Add-on Covers', hi: 'अड-ऑन कवर', hg: 'Extra Covers' },
    ] },
  // 🟡 Gold = Premium (travel, home) — luxury, valuable
  { key: 'travel', icon: Plane, href: '/travel-insurance', price: '₹256/trip', emoji: '', quickStat: 'From ₹256/trip', color: '#B8860B', badgeVariant: 'blue', image: '/images/category-cards/travel-insurance-hero.png',
    features: [
      { en: 'Medical Emergency', hi: 'मेडिकल इमरजेंसी', hg: 'Medical Emergency' },
      { en: 'Trip Cancellation', hi: 'ट्रिप कैंसिलेशन', hg: 'Trip Cancel' },
      { en: 'Lost Baggage', hi: 'खोई हुई सामान', hg: 'Samaan kho jane par' },
    ] },
  { key: 'home', icon: Home, href: '/home-insurance', price: '₹1,500/yr', emoji: '', quickStat: 'Starting ₹4/day', color: '#B8860B', badgeVariant: 'blue', image: '/images/category-cards/home-insurance-hero.png',
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

/* ── 3D Scroll Card — each card reveals its image as it enters viewport ── */
function ScrollRevealCard({
  cat,
  index,
  isHindi,
  isEnglish,
}: {
  cat: CategoryItem;
  index: number;
  isHindi: boolean;
  isEnglish: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [imageRevealed, setImageRevealed] = useState(false);

  // Track scroll progress within this card for the 3D image reveal effect
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Image starts hidden (opacity 0, scale 0.8, translateY 60px)
  // and reveals as the card enters the viewport center
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 0, 1, 1, 0.7]);
  const imageScale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.8, 0.85, 1, 1, 1.05]);
  const imageY = useTransform(scrollYProgress, [0, 0.3, 0.5, 1], [60, 30, 0, -20]);

  // Reveal the image when card enters viewport (staggered by index for the "one by one" effect)
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setImageRevealed(true), index * 150);
      return () => clearTimeout(timer);
    }
  }, [isInView, index]);

  const Icon = cat.icon;
  const title = isHindi ? categoryTitles[cat.key]?.hi : isEnglish ? categoryTitles[cat.key]?.en : categoryTitles[cat.key]?.hg;
  const description = isHindi ? categoryDescriptions[cat.key]?.hi : isEnglish ? categoryDescriptions[cat.key]?.en : categoryDescriptions[cat.key]?.hg;

  // 3-tone color system
  const colorFamily = cat.color === '#2D6A4F' || cat.color === '#1B4D4A'
    ? 'emerald'
    : cat.color === '#B8860B'
      ? 'gold'
      : 'sienna';

  const tintBg = colorFamily === 'emerald'
    ? 'bg-[#E6F4EF] dark:bg-[#0F2A28]'
    : colorFamily === 'gold'
      ? 'bg-[#FBF3DD] dark:bg-[#2A2310]'
      : 'bg-[#FBE8E1] dark:bg-[#3A1E14]';

  const iconColor = colorFamily === 'emerald'
    ? '#2D6A4F'
    : colorFamily === 'gold'
      ? '#B8860B'
      : '#B8482C';

  const checkBg = colorFamily === 'emerald'
    ? 'rgba(45,106,79,0.12)'
    : colorFamily === 'gold'
      ? 'rgba(184,134,11,0.12)'
      : 'rgba(184,72,44,0.12)';

  const badgeBg = colorFamily === 'emerald'
    ? 'bg-[#E6F4EF] text-[#2D6A4F]'
    : colorFamily === 'gold'
      ? 'bg-[#FBF3DD] text-[#8B6508]'
      : 'bg-[#FBE8E1] text-[#8B3520]';

  const isFirst = index === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className={isFirst ? 'lg:col-span-2 min-w-0' : 'min-w-0'}
    >
      <Link href={cat.href} className="block group h-full min-w-0">
        <div className="card-ivory-vault dark:card-midnight-brass p-5 sm:p-6 md:p-7 h-full flex flex-col cursor-pointer min-w-0 overflow-hidden relative">

          {/* ═══ 3D SCROLL-REVEAL IMAGE LAYER ═══
              This image starts invisible (opacity 0, scaled down, translated down)
              and reveals as the user scrolls — creating the "3D website" effect
              where each card's premium hero image appears one by one.

              The image is positioned as a subtle background layer behind the
              card content, with a gradient overlay for text readability. */}
          <motion.div
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
            style={{
              opacity: imageOpacity,
              scale: imageScale,
              y: imageY,
            }}
          >
            {/* High-quality premium 3D hero image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cat.image}
              alt={`${title} — premium 3D protection visualization`}
              className="w-full h-full object-cover"
              style={{
                filter: imageRevealed ? 'none' : 'blur(8px)',
                transition: 'filter 0.6s ease-out',
              }}
              loading={isFirst ? 'eager' : 'lazy'}
            />
            {/* Gradient overlay for text readability — fades from card surface
                color at top to transparent at center, ensuring the icon, title,
                and feature list remain readable on top of the image */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 40%, rgba(255,255,255,0.6) 100%)',
              }}
            />
            <div
              className="absolute inset-0 dark:hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(22,26,36,0.92) 0%, rgba(22,26,36,0.75) 40%, rgba(22,26,36,0.6) 100%)',
                opacity: 0,
              }}
            />
          </motion.div>

          {/* ── Card Content (above the image layer) ──────────────────── */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Icon + Title row */}
            <div className="flex items-start gap-4 mb-5">
              <div
                className={`flex-shrink-0 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${tintBg}`}
              >
                <Icon className="h-5 w-5" style={{ color: iconColor }} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-vault-heading dark:text-brass-heading text-xl md:text-2xl tracking-tight" style={{ fontWeight: 500 }}>
                  {title}
                </h3>
                <p className="text-body-premium text-vault-body dark:text-brass-body mt-1">
                  {description}
                </p>
              </div>
            </div>

            {/* Feature list with check icons */}
            <ul className="space-y-2.5 flex-1 mb-5">
              {cat.features.map((feature, i) => {
                const featureText = isHindi ? feature.hi : isEnglish ? feature.en : feature.hg;
                return (
                  <li key={i} className="flex items-start gap-2.5 text-body-premium text-vault-heading dark:text-brass-heading min-w-0">
                    <div
                      className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: checkBg }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: iconColor }} strokeWidth={3} />
                    </div>
                    <span className="min-w-0 break-words leading-snug">{featureText}</span>
                  </li>
                );
              })}
            </ul>

            {/* Price + AI Pick badge */}
            <div className="pt-4 border-t border-[rgba(15,19,32,0.08)] dark:border-[rgba(201,168,76,0.15)] flex items-center justify-between gap-3">
              <span className="font-display text-vault-accent dark:text-brass-accent tabular-nums text-lg md:text-xl" style={{ fontWeight: 500 }}>
                {cat.price}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badgeBg} dark:bg-[rgba(232,200,114,0.12)] dark:text-[#E8C872] text-caption-premium`}
                style={{ fontSize: '0.6875rem', letterSpacing: '0.04em' }}
              >
                <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                {isHindi ? 'AI चुनाव' : isEnglish ? 'AI Pick' : 'AI Chunaav'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
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
          {categories.map((cat, index) => (
            <ScrollRevealCard
              key={cat.key}
              cat={cat}
              index={index}
              isHindi={isHindi}
              isEnglish={isEnglish}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
