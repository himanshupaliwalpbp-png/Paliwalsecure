'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * StackingImageSections — Full-screen scroll-stacking insurance images
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Effect (the "premium 3D website" feel):
 *   1. First image (Health Insurance) appears FULL SCREEN
 *   2. User scrolls → second image (Life Insurance) slides UP from below,
 *      covering the first. First image gets BLURRED behind.
 *   3. Continue scrolling → Car, Bike, Travel, Home each stack on top
 *   4. Clicking any image navigates to that insurance page
 *
 * Technical: CSS `position: sticky` for stacking + Framer Motion `useScroll`
 * for the blur-on-previous effect.
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
    image: '/images/category-cards/health-stack.jpg',
    href: '/health-insurance',
    accentColor: '#2D6A4F',
  },
  {
    key: 'life',
    title: 'Life Insurance',
    titleHindi: 'लाइफ इंश्योरेंस',
    description: 'Apne parivaar ka future secure karein — Term Plans, Investment Plans, Critical Illness Cover',
    price: '₹489/mo',
    image: '/images/category-cards/life-stack.jpg',
    href: '/life-insurance',
    accentColor: '#1B4D4A',
  },
  {
    key: 'car',
    title: 'Car Insurance',
    titleHindi: 'कार इंश्योरेंस',
    description: 'Poori car coverage — Comprehensive Cover, Zero Depreciation, Roadside Assistance',
    price: '₹2,094/yr',
    image: '/images/category-cards/car-stack.jpg',
    href: '/car-insurance',
    accentColor: '#B8482C',
  },
  {
    key: 'bike',
    title: 'Bike Insurance',
    titleHindi: 'बाइक इंश्योरेंस',
    description: 'Poori bike suraksha — Third Party Cover, Comprehensive Plan, Add-on Covers',
    price: '₹714/yr',
    image: '/images/category-cards/bike-stack.jpg',
    href: '/bike-insurance',
    accentColor: '#B8482C',
  },
  {
    key: 'travel',
    title: 'Travel Insurance',
    titleHindi: 'ट्रैवल इंश्योरेंस',
    description: 'Bina tension ki yatra — Medical Emergency, Trip Cancellation, Lost Baggage cover',
    price: '₹256/trip',
    image: '/images/category-cards/travel-stack.jpg',
    href: '/travel-insurance',
    accentColor: '#B8860B',
  },
  {
    key: 'home',
    title: 'Home Insurance',
    titleHindi: 'होम इंश्योरेंस',
    description: 'Apni sabse badi sampatti ki raksha karein — Structure Cover, Contents Insurance, Natural Disaster',
    price: '₹1,500/yr',
    image: '/images/category-cards/home-stack.jpg',
    href: '/home-insurance',
    accentColor: '#B8860B',
  },
];

/* ── Individual stacking panel ──────────────────────────────────────────── */
function StackPanel({
  item,
  index,
  total,
}: {
  item: StackItem;
  index: number;
  total: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for THIS panel — used to blur the image as the
  // next panel slides over it
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ['start start', 'end start'],
  });

  // As the next panel slides over this one, blur this image
  // 0 = sharp (at top), 1 = blurred (scrolled past)
  const blurAmount = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0, 12]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.7]);

  return (
    <div
      ref={panelRef}
      className="sticky top-0 h-screen w-full overflow-hidden"
      style={{ zIndex: index + 1 }}
    >
      <Link href={item.href} className="block w-full h-full relative group" prefetch={false}>
        {/* Full-screen image with scroll-driven blur + scale */}
        <motion.div
          className="absolute inset-0"
          style={{
            filter: useTransform(blurAmount, (b) => `blur(${b}px)`),
            scale: imageScale,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={`${item.title} — premium protection hero`}
            className="w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </motion.div>

        {/* Gradient overlay for text readability — darkens bottom + adds depth */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: overlayOpacity,
            background: `linear-gradient(180deg, 
              rgba(11, 18, 33, 0.3) 0%, 
              rgba(11, 18, 33, 0.1) 40%, 
              rgba(11, 18, 33, 0.8) 100%)`,
          }}
        />

        {/* Content overlay — category name, description, price, CTA */}
        <div className="absolute inset-0 flex flex-col justify-end items-start p-8 sm:p-12 md:p-16 lg:p-20">
          <div className="max-w-3xl">
            {/* Accent line */}
            <div
              className="w-16 h-1 rounded-full mb-6"
              style={{ background: item.accentColor }}
            />

            {/* Category number — subtle indicator */}
            <div
              className="font-mono text-sm tracking-widest uppercase mb-4"
              style={{ color: item.accentColor, opacity: 0.9 }}
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>

            {/* Title — large, bold, white */}
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-2">
              {item.title}
            </h2>
            <p className="text-lg sm:text-xl text-white/60 font-body mb-6">
              {item.titleHindi}
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-white/80 font-body leading-relaxed mb-8 max-w-2xl">
              {item.description}
            </p>

            {/* Price + CTA */}
            <div className="flex items-center gap-6 flex-wrap">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-white">
                {item.price}
              </span>
              <span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 group-hover:scale-105 group-hover:gap-3"
                style={{
                  background: item.accentColor,
                  color: '#FFFFFF',
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
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
            <span className="font-mono text-xs tracking-widest uppercase">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
            />
          </div>
        )}
      </Link>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function StackingImageSections() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${STACK_ITEMS.length * 100}vh` }}
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
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            Complete Protection{' '}
            <span className="text-accent-gradient">Package</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-white/70 font-body mt-4 max-w-2xl mx-auto"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
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
          total={STACK_ITEMS.length}
        />
      ))}
    </section>
  );
}
