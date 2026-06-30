'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IntelCategories — Design Bible v9.0 Insurance Categories Section
 * ═══════════════════════════════════════════════════════════════════════════
 * Per Blueprint Section 4:
 *   - 2x3 grid of category cards (Health, Life, Motor on row 1; Home, Travel, Business on row 2)
 *   - Each card: 56px icon circle, name, description, starting price, AI-Optimized badge
 *   - Background: Surface Light (#131C2E)
 *   - Glassmorphism cards with hover lift + gold border glow
 */

import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Car, Home, Plane, Building2 } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  startingPrice: string;
  icon: LucideIcon;
  href: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'health',
    name: 'Health Insurance',
    description:
      'Family floater, senior care, critical illness — find the optimal health cover for your family\'s needs.',
    startingPrice: '₹499/month',
    icon: Heart,
    href: '/health-insurance',
  },
  {
    id: 'life',
    name: 'Life Insurance',
    description:
      'Term plans, ULIPs, endowment — protect your family\'s financial future with data-backed recommendations.',
    startingPrice: '₹489/month',
    icon: ShieldCheck,
    href: '/life-insurance',
  },
  {
    id: 'motor',
    name: 'Motor Insurance',
    description:
      'Car, bike, commercial vehicle — comprehensive or third-party, optimized for your vehicle and usage.',
    startingPrice: '₹714/year',
    icon: Car,
    href: '/car-insurance',
  },
  {
    id: 'home',
    name: 'Home Insurance',
    description:
      'Structure cover, content protection, natural disaster — secure your biggest asset intelligently.',
    startingPrice: '₹1,500/year',
    icon: Home,
    href: '/home-insurance',
  },
  {
    id: 'travel',
    name: 'Travel Insurance',
    description:
      'Domestic, international, student travel — coverage that matches your itinerary, not a generic package.',
    startingPrice: '₹256/trip',
    icon: Plane,
    href: '/travel-insurance',
  },
  {
    id: 'business',
    name: 'Business Insurance',
    description:
      'Group health, professional indemnity, fire & theft — protect what you\'ve built.',
    startingPrice: 'Custom',
    icon: Building2,
    href: '/business-insurance',
  },
];

export default function IntelCategories() {
  return (
    <section className="intel-section intel-bg-surface-light">
      <div className="intel-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <div className="intel-label">COMPLETE PROTECTION</div>
          <h2 className="intel-headline intel-headline-h1 max-w-3xl">
            Every Coverage You Need,{' '}
            <span style={{ color: 'var(--color-intel-gold)' }}>
              Optimized by AI
            </span>
          </h2>
          <p
            className="intel-body-large max-w-2xl"
            style={{ textAlign: 'center' }}
          >
            From health to home, get intelligent recommendations across all
            insurance categories.
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <Link href={cat.href} className="intel-card-category group" prefetch={false}>
                  <div className="flex flex-col gap-4 h-full">
                    {/* Icon + AI-Optimized badge */}
                    <div className="flex items-start justify-between">
                      <div className="intel-icon-circle">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="intel-badge-ai-optimized">
                        <Sparkle /> AI-Optimized
                      </span>
                    </div>

                    {/* Category Name */}
                    <h3
                      className="intel-headline"
                      style={{ fontSize: '20px', fontWeight: 600 }}
                    >
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p
                      className="intel-body"
                      style={{ fontSize: '14px', lineHeight: 1.6, flex: 1 }}
                    >
                      {cat.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span
                          style={{
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '10px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-intel-gray)',
                          }}
                        >
                          STARTING
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--color-intel-gold)',
                          }}
                        >
                          {cat.startingPrice}
                        </span>
                      </div>
                      <ArrowRightIcon />
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

/* ── Inline helpers (avoiding extra imports) ────────────────────────────── */
function Sparkle() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-intel-gold)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform group-hover:translate-x-1"
      aria-hidden
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
