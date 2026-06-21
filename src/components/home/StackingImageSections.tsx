'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * StackingImageSections — Premium scroll-stacking (position:fixed approach)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Uses position:fixed instead of position:sticky to avoid overflow:hidden
 * ancestor issues that break sticky positioning.
 *
 * Structure:
 *   1. A 700vh tall invisible "scroll space" div — provides scroll distance
 *   2. A position:fixed panel container — always pinned to viewport top
 *   3. Panels inside the fixed container, animated via Framer Motion useTransform
 *
 * The fixed container's opacity is driven by scrollYProgress:
 *   - 0 when outside the stacking section (so it doesn't block other content)
 *   - 1 when inside the stacking section
 *
 * Panel animation (per panel i of N total):
 *   - Segment [i/N, (i+1)/N] of total scroll
 *   - Before segment: y = 100vh (off-screen below)
 *   - During segment: y animates 100vh → 0 (slides up, covers previous)
 *   - After segment: y = 0 (stays in stack, behind newer panels)
 *   - Z-index increments so newer panels are always above older ones
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
    accentColor: '#2D6A4F',
  },
  {
    key: 'life',
    title: 'Life Insurance',
    titleHindi: 'लाइफ इंश्योरेंस',
    description: 'Apne parivaar ka future secure karein — Term Plans, Investment Plans, Critical Illness Cover',
    price: '₹489/mo',
    image: '/images/category-cards/life-stack.png',
    href: '/life-insurance',
    accentColor: '#1B4D4A',
  },
  {
    key: 'car',
    title: 'Car Insurance',
    titleHindi: 'कार इंश्योरेंस',
    description: 'Poori car coverage — Comprehensive Cover, Zero Depreciation, Roadside Assistance',
    price: '₹2,094/yr',
    image: '/images/category-cards/car-stack.png',
    href: '/car-insurance',
    accentColor: '#B8482C',
  },
  {
    key: 'bike',
    title: 'Bike Insurance',
    titleHindi: 'बाइक इंश्योरेंस',
    description: 'Poori bike suraksha — Third Party Cover, Comprehensive Plan, Add-on Covers',
    price: '₹714/yr',
    image: '/images/category-cards/bike-stack.png',
    href: '/bike-insurance',
    accentColor: '#B8482C',
  },
  {
    key: 'travel',
    title: 'Travel Insurance',
    titleHindi: 'ट्रैवल इंश्योरेंस',
    description: 'Bina tension ki yatra — Medical Emergency, Trip Cancellation, Lost Baggage cover',
    price: '₹256/trip',
    image: '/images/category-cards/travel-stack.png',
    href: '/travel-insurance',
    accentColor: '#B8860B',
  },
  {
    key: 'home',
    title: 'Home Insurance',
    titleHindi: 'होम इंश्योरेंस',
    description: 'Apni sabse badi sampatti ki raksha karein — Structure Cover, Contents Insurance, Natural Disaster',
    price: '₹1,500/yr',
    image: '/images/category-cards/home-stack.png',
    href: '/home-insurance',
    accentColor: '#B8860B',
  },
];

/* ── Individual panel ───────────────────────────────────────────────────── */
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
  // Scale segments to 0-0.9 range, leaving 0.9-1.0 for the last panel
  // to stay visible before the container fades out
  const SCALE = 0.9;
  const segStart = (index / total) * SCALE;
  const segEnd = ((index + 1) / total) * SCALE;

  // Panel 0 is always at y=0 (base panel)
  // Other panels: start at 100% (below), slide to 0 during their segment, stay at 0
  const y = useTransform(
    scrollYProgress,
    [0, segStart, segEnd, 1],
    index === 0 ? [0, 0, 0, 0] : ['100%', '100%', '0%', '0%']
  );

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full overflow-hidden"
      style={{
        y,
        zIndex: index + 1,
      }}
    >
      <Link href={item.href} className="block w-full h-full relative group" prefetch={false}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={`${item.title} — premium protection hero`}
          className="w-full h-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
        />

        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg,
              rgba(0, 0, 0, 0.1) 0%,
              rgba(0, 0, 0, 0.0) 30%,
              rgba(0, 0, 0, 0.5) 70%,
              rgba(0, 0, 0, 0.85) 100%)`,
          }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end items-start p-8 sm:p-12 md:p-16 lg:p-20">
          <div className="max-w-3xl">
            <div
              className="w-16 h-1 rounded-full mb-6"
              style={{ background: item.accentColor }}
            />
            <div
              className="font-mono text-sm tracking-widest uppercase mb-4"
              style={{ color: item.accentColor, opacity: 0.95 }}
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
            <h2
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-2"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
            >
              {item.title}
            </h2>
            <p
              className="text-lg sm:text-xl text-white/70 font-body mb-6"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}
            >
              {item.titleHindi}
            </p>
            <p
              className="text-base sm:text-lg md:text-xl text-white/90 font-body leading-relaxed mb-8 max-w-2xl"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}
            >
              {item.description}
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <span
                className="font-mono text-2xl sm:text-3xl font-bold text-white"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
              >
                {item.price}
              </span>
              <span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 group-hover:scale-105 group-hover:gap-3"
                style={{
                  background: item.accentColor,
                  color: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                Explore Plans
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {index === 0 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70">
            <span className="font-mono text-xs tracking-widest uppercase">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-white/70 to-transparent"
            />
          </div>
        )}
      </Link>
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

  // Fixed container opacity: visible only during the stacking section
  // Fades in at start, stays visible through all panels (0-0.9),
  // then fades out after the last panel is fully shown (0.95-1.0)
  const containerOpacity = useTransform(
    scrollYProgress,
    [-0.01, 0, 0.95, 1],
    [0, 1, 1, 0]
  );

  return (
    <>
      {/* ═══ Fixed panel container — always at viewport top ═══
          position:fixed is NOT affected by ancestor overflow:hidden,
          so this works regardless of body overflow settings. */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen overflow-hidden"
        style={{
          opacity: containerOpacity,
          zIndex: 40,
          pointerEvents: 'auto',
        }}
      >
        {/* Section header */}
        <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
            >
              Complete Protection{' '}
              <span style={{ color: '#E8C872' }}>Package</span>
            </h2>
            <p
              className="text-base sm:text-lg text-white/80 font-body mt-4 max-w-2xl mx-auto"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}
            >
              Har zaroorat ke liye insurance — 51+ insurers se AI ki salah par plan
            </p>
          </div>
        </div>

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
      </motion.div>

      {/* ═══ Scroll space — invisible div that creates scroll distance ═══
          This is what the user scrolls through. The fixed container above
          shows/hides based on scroll progress through this element. */}
      <section
        ref={containerRef}
        className="relative w-full"
        style={{ height: `${(total + 1) * 100}vh` }}
      />
    </>
  );
}
