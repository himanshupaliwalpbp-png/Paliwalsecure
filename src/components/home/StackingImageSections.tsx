'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * StackingImageSections — Full image (no crop) + normal scroll + stacking
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Per user's latest request:
 *   1. Show the FULL image — no cropping (use object-contain, not object-cover)
 *   2. Don't pin/fixed to full screen — website should scroll normally
 *   3. Each image displays at its natural aspect ratio, fully visible
 *   4. Scroll-stacking effect: next image comes ON TOP, previous goes to background
 *
 * Technique: position:sticky (works now that body uses overflow-x:clip)
 *   - Each panel is min-h-screen, sticky to top
 *   - Image inside uses object-contain → full image visible, letterboxed if needed
 *   - As you scroll, next panel slides over the previous (sticky keeps it pinned)
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
  return (
    <div
      className="sticky top-0 w-full h-screen flex flex-col overflow-hidden"
      style={{ zIndex: index + 1 }}
    >
      {/* Dark background so letterboxed areas look intentional */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0B1221 0%, #0F1729 100%)' }}
      />

      {/* ═══ FULL IMAGE — object-contain (no cropping) ═══
          The image displays at its natural aspect ratio, fully visible.
          If the image is wider than tall, there will be dark bars top/bottom.
          If taller than wide, dark bars left/right. This is intentional —
          the user explicitly said "pura dikhao, crop mat karo".
          
          Using h-screen on the panel (not min-h-screen) so each panel is
          EXACTLY viewport height. This ensures the sticky stacking works
          properly — the next panel fully covers the previous in one viewport
          of scroll. */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-0">
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

      {/* Content overlay — compact, at the bottom, overlaid on the letterbox area
          so it doesn't cover the image itself. Kept short so panel stays h-screen. */}
      <div className="relative z-10 px-6 sm:px-10 md:px-14 pb-5 sm:pb-6 pt-3 shrink-0"
        style={{ background: 'linear-gradient(0deg, rgba(11,18,33,0.98) 0%, rgba(11,18,33,0.85) 60%, transparent 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Accent line + category number + title in one row */}
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

          {/* Title + Hindi in one line */}
          <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight">
              {item.title}
            </h2>
            <span className="text-sm sm:text-base text-white/60 font-body">
              {item.titleHindi}
            </span>
          </div>

          {/* Description + price + CTA in one compact block */}
          <p className="text-xs sm:text-sm text-white/75 font-body leading-snug mb-2 max-w-2xl">
            {item.description}
          </p>

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
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function StackingImageSections() {
  return (
    <section className="relative w-full">
      {/* Section header — normal flow, above the first panel */}
      <div className="relative z-50 pt-16 pb-8 text-center"
        style={{ background: 'linear-gradient(180deg, #0B1221 0%, #0F1729 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight"
          >
            Complete Protection{' '}
            <span style={{ color: '#E8C872' }}>Package</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-white/70 font-body mt-3 max-w-2xl mx-auto"
          >
            Har zaroorat ke liye insurance — 51+ insurers se AI ki salah par plan
          </motion.p>
        </div>
      </div>

      {/* Stacking panels — each is sticky, so they stack on scroll.
          Normal page scroll works because panels are in normal flow
          (not position:fixed). Each panel is min-h-screen so it fills
          the viewport when it sticks. */}
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
