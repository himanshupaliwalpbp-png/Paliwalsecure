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
 * Professional design:
 *   - Image fills entire viewport (object-cover, NO letterbox/dark bars)
 *   - Text is overlaid DIRECTLY ON the image
 *   - Subtle gradient at bottom ensures text readability
 *   - Clean, premium feel like Apple/Stripe product pages
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
  const SCALE = 0.92;
  const segStart = (index / total) * SCALE;
  const segEnd = ((index + 1) / total) * SCALE;

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
      <Link href={item.href} className="block w-full h-full relative group" prefetch={false}>
        {/* ═══ FULL-BLEED IMAGE — object-cover fills entire viewport ═══
            No letterbox, no dark bars. Image covers the full screen
            like Apple/Stripe hero sections. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={`${item.title} — premium protection hero`}
          className="absolute inset-0 w-full h-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
        />

        {/* ═══ Subtle gradient overlay for text readability ═══
            Only at the bottom — fades from transparent to dark.
            This ensures text is readable WITHOUT a separate dark section.
            The rest of the image remains fully visible. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, transparent 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.9) 100%)',
          }}
        />

        {/* ═══ Text overlay — DIRECTLY ON the image ═══
            Positioned at the bottom-left, with text shadow for readability.
            No separate dark section — text floats on the image. */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-8 sm:px-12 md:px-16 lg:px-20 pb-10 sm:pb-12 md:pb-14">
          <div className="max-w-3xl">
            {/* Accent line + category number */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-0.5 rounded-full shrink-0"
                style={{ background: item.accentColor, boxShadow: `0 0 12px ${item.accentColor}` }}
              />
              <span
                className="font-mono text-xs tracking-widest uppercase shrink-0"
                style={{ color: item.accentColor, textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
              >
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>

            {/* Title — large, bold, white with text shadow */}
            <h2
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-2"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)' }}
            >
              {item.title}
            </h2>
            <p
              className="text-lg sm:text-xl text-white/70 font-body mb-5"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}
            >
              {item.titleHindi}
            </p>

            {/* Description */}
            <p
              className="text-base sm:text-lg md:text-xl text-white/90 font-body leading-relaxed mb-7 max-w-2xl"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}
            >
              {item.description}
            </p>

            {/* Price + CTA */}
            <div className="flex items-center gap-5 flex-wrap">
              <span
                className="font-mono text-2xl sm:text-3xl font-bold text-white"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
              >
                {item.price}
              </span>
              <span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 group-hover:scale-105 group-hover:gap-3"
                style={{
                  background: item.accentColor,
                  color: '#0B1221',
                  boxShadow: `0 4px 20px ${item.accentColor}40, 0 0 0 1px ${item.accentColor}30`,
                  textShadow: 'none',
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 z-20 pointer-events-none">
            <span className="font-mono text-[10px] tracking-widest uppercase"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
            >
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
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

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${(total + 1) * 100}vh` }}
    >
      {/* Sticky inner wrapper — pins to top during entire scroll */}
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
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)' }}
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
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}
            >
              Har zaroorat ke liye insurance — 51+ insurers se AI ki salah par plan
            </motion.p>
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
      </div>
    </section>
  );
}
