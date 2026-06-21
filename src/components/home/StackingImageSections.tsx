'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * StackingImageSections — Professional scroll-stacking (Apple/Stripe style)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This is the proper "pinned scroll" technique used by Apple, Stripe, and
 * Linear. Each image panel is pinned to the viewport while the user scrolls,
 * and the next panel slides up from below to cover it.
 *
 * Technique:
 *   - Container is (N+1) × 100vh tall — provides scroll space
 *   - Inner wrapper is position: sticky → pins to top during scroll
 *   - Each panel is position: absolute, animated via Framer Motion useTransform
 *   - Panel Y position is driven by scrollYProgress:
 *     * Before its segment: y = 100% (off-screen below)
 *     * During its segment: y animates 100% → 0 (slides up to cover)
 *     * After its segment: y = 0 (stays in stack, behind newer panels)
 *   - Z-index increments so each new panel is above the previous
 *   - Previous panels stay SHARP (no blur) — just go to background
 *
 * Images are shown FULLY (object-contain, no cropping) at original quality.
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
   * Each panel slides up during its segment of the scroll.
   * Segments are scaled to 0-0.92 range, leaving the last 8% for the
   * final panel to stay visible before the section ends.
   */
  const SCALE = 0.92;
  const segStart = (index / total) * SCALE;
  const segEnd = ((index + 1) / total) * SCALE;

  // Panel 0 is always at y=0 (base panel, visible from start)
  // Other panels: start at 100% (below screen), slide to 0 during their segment
  const y = useTransform(
    scrollYProgress,
    [0, segStart, segEnd, 1],
    index === 0 ? ['0%', '0%', '0%', '0%'] : ['100%', '100%', '0%', '0%']
  );

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full overflow-hidden"
      style={{
        y,
        zIndex: index + 1,
      }}
    >
      {/* Dark gradient background — so letterboxed areas look intentional */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0B1221 0%, #0F1729 100%)' }}
      />

      {/* ═══ FULL IMAGE — object-contain (no cropping) ═══
          Image displays at its natural aspect ratio, fully visible.
          Letterboxed with the dark gradient background above. */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Link href={item.href} className="block w-full h-full relative group" prefetch={false}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={`${item.title} — premium protection hero`}
            className="w-full h-full object-contain"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </Link>
      </div>

      {/* ═══ Content overlay — bottom of screen, compact ═══
          Gradient ensures text is readable over the image + letterbox area. */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-10 md:px-14 pb-5 sm:pb-6 pt-3"
        style={{
          background: 'linear-gradient(0deg, rgba(11,18,33,0.98) 0%, rgba(11,18,33,0.85) 60%, transparent 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Accent line + category number */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-0.5 rounded-full shrink-0"
              style={{ background: item.accentColor }}
            />
            <span
              className="font-mono text-[10px] tracking-widest uppercase shrink-0"
              style={{ color: item.accentColor, opacity: 0.95 }}
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

          {/* Title + Hindi */}
          <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight">
              {item.title}
            </h2>
            <span className="text-sm sm:text-base text-white/60 font-body">
              {item.titleHindi}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-white/75 font-body leading-snug mb-2 max-w-2xl">
            {item.description}
          </p>

          {/* Price + CTA */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={item.href}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 hover:gap-2"
              style={{
                background: item.accentColor,
                color: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
              prefetch={false}
            >
              Explore Plans
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="font-mono text-base sm:text-lg font-bold text-white/90">
              {item.price}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll hint — only on the first panel */}
      {index === 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 z-20 pointer-events-none">
          <span className="font-mono text-[10px] tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-px h-6 bg-gradient-to-b from-white/50 to-transparent"
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

  // Track scroll progress through the entire stacking section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      // Height = (total + 1) × 100vh to give enough scroll space
      style={{ height: `${(total + 1) * 100}vh` }}
    >
      {/* ═══ Sticky inner wrapper — pins to top during entire scroll ═══
          This is the key to the "pinned scroll" effect.
          overflow-x: clip on body (already set) allows sticky to work. */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Section header — floats above the first panel */}
        <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 text-center">
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
              className="text-base sm:text-lg text-white/80 font-body mt-3 max-w-2xl mx-auto"
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
