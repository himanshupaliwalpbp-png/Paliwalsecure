'use client';

/**
 * IntelTestimonials — Design Bible v9.0 Testimonials Section
 * Per Blueprint Section 7:
 *   - Horizontal scroll carousel (3 cards visible on desktop)
 *   - Real Indian families with specific outcomes
 *   - Tier 2 city positioning (Kota, Jaipur, Indore)
 */

import { motion } from 'framer-motion';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef } from 'react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  badge: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rahul & Priya Sharma',
    location: 'Kota, Rajasthan',
    quote:
      'Our Protection Score was 43. We thought we were fully covered, but Paliwal Secure found gaps in our health and home insurance that could have cost us ₹15 lakhs. We optimized everything in one afternoon.',
    badge: '43 → 89  ·  ₹23,000/year saved',
  },
  {
    id: '2',
    name: 'Vikram Mehta',
    location: 'Jaipur',
    quote:
      'When my father\'s claim was rejected, I had no idea what to do. The Claim Intelligence system guided me through the appeal process. The claim was approved in 12 days. This platform doesn\'t just sell insurance — it makes insurance work.',
    badge: 'Claim approved: ₹4.5 lakhs',
  },
  {
    id: '3',
    name: 'Ananya Gupta',
    location: 'Indore',
    quote:
      'I used to spend weekends comparing policies on 5 different websites. InsureGPT answered all my questions in Hinglish and found me a family floater that covers everything I need — at 30% less than I was paying.',
    badge: '8 hours → 20 minutes',
  },
];

export default function IntelTestimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="intel-section intel-bg-surface-light">
      <div className="intel-container">
        {/* Header with carousel controls */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12 gap-4"
        >
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="intel-label">FAMILIES SECURED</div>
            <h2 className="intel-headline intel-headline-h1">
              Real Protection,{' '}
              <span style={{ color: 'var(--color-intel-gold)' }}>
                Real Stories
              </span>
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Previous testimonials"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/5 hover:border-white/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="More testimonials"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/5 hover:border-white/30 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              className="intel-testimonial snap-center shrink-0 w-[85%] md:w-[calc(33.333%-16px)]"
            >
              {/* 5-star rating */}
              <div className="flex gap-1 mb-4" style={{ color: 'var(--color-intel-gold)' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="intel-testimonial-quote">"{t.quote}"</p>

              {/* Name + Location */}
              <div>
                <div className="intel-testimonial-name">{t.name}</div>
                <div className="intel-testimonial-location">{t.location}</div>
              </div>

              {/* Outcome badge */}
              <div className="intel-testimonial-badge">{t.badge}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
