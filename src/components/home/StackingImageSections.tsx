'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * StackingImageSections — Premium scroll-stacking effect (Apple/Stripe style)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Effect:
 *   1. First image (Health) is full-screen and pinned
 *   2. Scroll → second image (Life) slides UP from below, covering Health.
 *      Health goes to background (still visible behind, sharp).
 *   3. Continue → Car, Bike, Travel, Home each slide up over the previous
 *   4. Click any image → navigate to that insurance page
 *
 * Technique: Framer Motion useScroll + useTransform (NOT position: sticky)
 *   - Container is (N+1) × 100vh tall, creating scroll space
 *   - Inner wrapper is position: sticky → pins to top during entire scroll
 *   - Each panel uses useTransform to animate its Y position:
 *     * Current panel: starts off-screen below (100vh), slides to 0 (covers previous)
 *     * Once covered, stays at 0 (in the stack, behind newer panels)
 *   - Z-index increments so each new panel is above the previous
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
  /**
   * Each panel's lifecycle during scroll:
   *
   * Segment calculation:
   *   - The scroll (0→1) is divided into (total) segments
   *   - Panel i's "enter" segment: [i/N, (i+1)/N]
   *   - Before its segment: panel is off-screen below (y = 100vh)
   *   - During its segment: panel slides from 100vh → 0 (enters viewport)
   *   - After its segment: panel stays at y = 0 (in the stack, behind newer panels)
   *
   * Example with 6 panels (N=6):
   *   Panel 0 (Health): segment [0.00, 0.167] — starts visible, stays at 0
   *   Panel 1 (Life):   segment [0.167, 0.333] — enters from below
   *   Panel 2 (Car):    segment [0.333, 0.500] — enters from below
   *   Panel 3 (Bike):   segment [0.500, 0.667] — enters from below
   *   Panel 4 (Travel): segment [0.667, 0.833] — enters from below
   *   Panel 5 (Home):   segment [0.833, 1.000] — enters from below
   */

  const segStart = index / total;
  const segEnd = (index + 1) / total;

  // Panel 0 is always at y=0 (it's the base, visible from the start)
  // Other panels start at 100vh (off-screen below) and slide to 0
  const y = useTransform(
    scrollYProgress,
    [0, segStart, segEnd, 1],
    index === 0 ? [0, 0, 0, 0] : ['100vh', '100vh', '0vh', '0vh']
  );

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-screen overflow-hidden"
      style={{
        y,
        zIndex: index + 1,
      }}
    >
      <Link href={item.href} className="block w-full h-full relative group" prefetch={false}>
        {/* ═══ Full-screen image at ORIGINAL quality ═══ */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={`${item.title} — premium protection hero`}
          className="w-full h-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
        />

        {/* Gradient overlay for text readability — darkens bottom only */}
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
            {/* Accent line */}
            <div
              className="w-16 h-1 rounded-full mb-6"
              style={{ background: item.accentColor }}
            />

            {/* Category number */}
            <div
              className="font-mono text-sm tracking-widest uppercase mb-4"
              style={{ color: item.accentColor, opacity: 0.95 }}
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>

            {/* Title */}
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

            {/* Description */}
            <p
              className="text-base sm:text-lg md:text-xl text-white/90 font-body leading-relaxed mb-8 max-w-2xl"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}
            >
              {item.description}
            </p>

            {/* Price + CTA */}
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

        {/* Scroll hint — only on the first panel */}
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

  // Track scroll progress through the entire stacking section
  // offset: ['start start', 'end end'] means progress goes 0→1
  // from when the section top hits viewport top, to when section bottom
  // hits viewport bottom
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      // Height = (total + 1) × 100vh to give enough scroll space
      // for all panels to enter one by one
      style={{ height: `${(total + 1) * 100}vh` }}
    >
      {/* Sticky inner wrapper — pins to top during entire scroll
          This is the key: the wrapper sticks, and panels inside animate
          their Y position based on scroll progress */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Section header — floats above the first panel */}
        <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
            >
              Complete Protection{' '}
              <span style={{ color: '#E8C872' }}>Package</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-white/80 font-body mt-4 max-w-2xl mx-auto"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}
            >
              Har zaroorat ke liye insurance — 51+ insurers se AI ki salah par plan
            </motion.p>
          </div>
        </div>

        {/* Stacking panels — each is absolutely positioned, animated via useTransform */}
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
  );
}
