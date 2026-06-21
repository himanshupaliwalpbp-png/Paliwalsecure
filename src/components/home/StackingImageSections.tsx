'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * StackingImageSections — Professional scroll-stacking (Apple style)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Per user's latest request:
 *   1. "Complete Protection Package" text is ABOVE the images (not on image)
 *   2. Images shown FULLY — no cropping (object-contain)
 *   3. Professional design like Apple / world top companies
 *
 * Structure:
 *   - Section header (title + subtitle) — normal flow, ABOVE the stacking area
 *   - Stacking area — sticky pinned, panels stack on scroll
 *   - Each panel: dark background + full image (object-contain) + text overlay at bottom
 *
 * Scroll-stacking technique:
 *   - Container is (N+1) × 100vh — provides scroll space
 *   - Inner wrapper is position: sticky → pins to top
 *   - Each panel: position:absolute, Y driven by scrollYProgress
 *   - Panel slides from 100% (below) → 0% (covers previous)
 *   - Previous panel stays behind, sharp (no blur)
 */

interface StackItem {
  key: string;
  title: string;
  titleHindi: string;
  description: string;
  price: string;
  image: string;
  href: string;
  accentColor: string;
}

const STACK_ITEMS: StackItem[] = [
  {
    key: 'health',
    title: 'Health Insurance',
    titleHindi: 'हेल्थ इंश्योरेंस',
    description: 'Apne parivaar ki health ki raksha karein — Cashless Ilaj, Family Floater, Hospital ke pehle aur baad ka kharcha',
    price: '₹499/mo',
    image: '/images/category-cards/health-stack.png',
    href: '/health-insurance',
    accentColor: '#4ADE80',
  },
  {
    key: 'life',
    title: 'Life Insurance',
    titleHindi: 'लाइफ इंश्योरेंस',
    description: 'Apne parivaar ka future secure karein — Term Plans, Investment Plans, Critical Illness Cover',
    price: '₹489/mo',
    image: '/images/category-cards/life-stack.png',
    href: '/life-insurance',
    accentColor: '#FBBF24',
  },
  {
    key: 'car',
    title: 'Car Insurance',
    titleHindi: 'कार इंश्योरेंस',
    description: 'Poori car coverage — Comprehensive Cover, Zero Depreciation, Roadside Assistance',
    price: '₹2,094/yr',
    image: '/images/category-cards/car-stack.png',
    href: '/car-insurance',
    accentColor: '#FB923C',
  },
  {
    key: 'bike',
    title: 'Bike Insurance',
    titleHindi: 'बाइक इंश्योरेंस',
    description: 'Poori bike suraksha — Third Party Cover, Comprehensive Plan, Add-on Covers',
    price: '₹714/yr',
    image: '/images/category-cards/bike-stack.png',
    href: '/bike-insurance',
    accentColor: '#F87171',
  },
  {
    key: 'travel',
    title: 'Travel Insurance',
    titleHindi: 'ट्रैवल इंश्योरेंस',
    description: 'Bina tension ki yatra — Medical Emergency, Trip Cancellation, Lost Baggage cover',
    price: '₹256/trip',
    image: '/images/category-cards/travel-stack.png',
    href: '/travel-insurance',
    accentColor: '#22D3EE',
  },
  {
    key: 'home',
    title: 'Home Insurance',
    titleHindi: 'होम इंश्योरेंस',
    description: 'Apni sabse badi sampatti ki raksha karein — Structure Cover, Contents Insurance, Natural Disaster',
    price: '₹1,500/yr',
    image: '/images/category-cards/home-stack.png',
    href: '/home-insurance',
    accentColor: '#A78BFA',
  },
];

/* ── Individual panel with scroll-driven Y position ─────────────────────── */
function StackPanel({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: StackItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Each panel slides up during its segment: [(i-1)/N, i/N]
  // Panel 1 (index 0): always at 0 (base, visible from start)
  // Panel 2 (index 1): slides from 100%→0% during [0/6, 1/6]
  // Panel 3 (index 2): slides from 100%→0% during [1/6, 2/6]
  // etc. — continuous motion, no dead zones
  const segStart = index === 0 ? 0 : (index - 1) / total;
  const segEnd = index / total;

  const y = useTransform(
    scrollYProgress,
    [0, segStart, segEnd, 1],
    index === 0
      ? ['0%', '0%', '0%', '0%']
      : ['100%', '100%', '0%', '0%']
  );

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform stacking-panel"
      style={{
        y,
        zIndex: index + 1,
        // Dark premium background — like Apple's product pages
        background: 'linear-gradient(180deg, #050507 0%, #0A0A0F 50%, #050507 100%)',
      }}
    >
      {/* ═══ FULL IMAGE — object-contain (NO cropping) ═══
          Image displays at its natural aspect ratio, fully visible.
          The dark gradient background shows in letterbox areas,
          looking intentional and premium like Apple's dark product pages. */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-12">
        <Link href={item.href} className="block w-full h-full relative group flex items-center justify-center" prefetch={false}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={`${item.title} — premium protection hero`}
            className="max-w-full max-h-full object-contain"
            style={{
              filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))',
            }}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </Link>
      </div>

      {/* ═══ Text overlay — at the BOTTOM, overlaid on letterbox area ═══
          The text sits in the bottom letterbox area (below the image),
          so it doesn't cover the image itself. Premium Apple-style typography. */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-8 sm:px-12 md:px-16 lg:px-20 pb-8 sm:pb-10 md:pb-12 pt-6">
        {/* Subtle gradient from transparent to dark for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(5,5,7,0.95) 0%, rgba(5,5,7,0.7) 50%, transparent 100%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          {/* Accent line + category number */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-0.5 rounded-full shrink-0"
              style={{ background: item.accentColor, boxShadow: `0 0 12px ${item.accentColor}` }}
            />
            <span
              className="font-mono text-xs tracking-widest uppercase shrink-0"
              style={{ color: item.accentColor }}
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

          {/* Title + Hindi */}
          <div className="flex flex-wrap items-baseline gap-3 mb-3">
            <h2
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight"
            >
              {item.title}
            </h2>
            <span className="text-lg sm:text-xl text-white/50 font-body">
              {item.titleHindi}
            </span>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-white/70 font-body leading-relaxed mb-6 max-w-2xl">
            {item.description}
          </p>

          {/* Price + CTA */}
          <div className="flex items-center gap-5 flex-wrap">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-white">
              {item.price}
            </span>
            <Link
              href={item.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:gap-3"
              style={{
                background: item.accentColor,
                color: '#050507',
                boxShadow: `0 4px 20px ${item.accentColor}40`,
              }}
              prefetch={false}
            >
              Explore Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll hint — only on the first panel */}
      {index === 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 z-20 pointer-events-none">
          <span className="font-mono text-[10px] tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
          />
        </div>
      )}
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function StackingImageSections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const total = STACK_ITEMS.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <>
      {/* ═══ SECTION HEADER — ABOVE the stacking area (NOT on image) ═══
          Normal flow, dark premium background like Apple's product pages.
          This is where "Complete Protection Package" title lives. */}
      <section className="relative w-full py-20 md:py-28 text-center"
        style={{ background: 'linear-gradient(180deg, #FAF7F2 0%, #050507 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-12 h-0.5 rounded-full bg-[#E8C872]" />
            <span className="font-mono text-xs tracking-widest uppercase text-[#E8C872]">
              6 Categories
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#0E1116] dark:text-white tracking-tight mb-5"
          >
            Complete Protection{' '}
            <span style={{ color: '#E8C872' }}>Package</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#4A4F57] dark:text-white/60 font-body max-w-2xl mx-auto"
          >
            Har zaroorat ke liye insurance — 51+ insurers se AI ki salah par plan
          </motion.p>
        </div>
      </section>

      {/* ═══ STACKING AREA — pinned scroll with full images ═══ */}
      <section
        ref={containerRef}
        className="relative w-full"
        style={{ height: `${(total + 1) * 100}vh` }}
      >
        {/* Sticky inner wrapper — pins to top during entire scroll */}
        <div
          className="sticky top-0 w-full h-screen overflow-hidden stacking-section"
          style={{ zIndex: 1 }}
        >
          {/* Stacking panels */}
          {STACK_ITEMS.map((item, index) => (
            <StackPanel
              key={item.key}
              item={item}
              index={index}
              total={total}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </section>
    </>
  );
}
