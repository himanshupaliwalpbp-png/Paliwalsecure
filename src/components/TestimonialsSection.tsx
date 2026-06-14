'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, MapPin, Shield, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Design tokens ─────────────────────────────────────────────────────── */
const NAVY_800 = '#0A1330';
const NAVY_900 = '#060B1E';
const NAVY_600 = '#162D5A';
const GOLD = '#C98A1C';
const GOLD_400 = '#C98A1C';
const MUTED = '#8A96A8';

/* ── Testimonial data (i18n keys) ──────────────────────────────────────── */
interface TestimonialData {
  quoteKey: string;
  nameKey: string;
  cityKey: string;
  rating: number;
  initial: string;
}

const testimonials: TestimonialData[] = [
  { quoteKey: 'testimonials.v2.ramesh.quote', nameKey: 'testimonials.v2.ramesh.name', cityKey: 'testimonials.v2.ramesh.city', rating: 5, initial: 'R' },
  { quoteKey: 'testimonials.v2.priya.quote', nameKey: 'testimonials.v2.priya.name', cityKey: 'testimonials.v2.priya.city', rating: 5, initial: 'P' },
  { quoteKey: 'testimonials.v2.suresh.quote', nameKey: 'testimonials.v2.suresh.name', cityKey: 'testimonials.v2.suresh.city', rating: 5, initial: 'S' },
];

/* ── Star Rating ───────────────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-current' : 'text-gray-400 dark:text-white/15 fill-gray-200 dark:fill-white/5'}`}
          style={{ color: star <= rating ? GOLD : undefined }}
        />
      ))}
    </div>
  );
}

/* ── Testimonial Card ──────────────────────────────────────────────────── */
function TestimonialCard({
  testimonial,
  t,
  index,
}: {
  testimonial: TestimonialData;
  t: (key: string) => string;
  index: number;
}) {
  return (
    <motion.div
      className="glass-card p-6 sm:p-8 flex flex-col h-full group transition-all duration-300 hover:-translate-y-1"
      style={{
        border: '1px solid rgba(201,138,28,0.15)',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Quote icon */}
      <div className="absolute -top-3 -left-1 z-10">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_400})`,
            boxShadow: `0 4px 20px rgba(201,138,28,0.35)`,
          }}
        >
          <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute -bottom-2 -right-2 opacity-[0.04] pointer-events-none">
        <Quote className="w-28 h-28" style={{ color: GOLD }} />
      </div>

      {/* 5 gold stars */}
      <div className="mb-3 mt-2">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Quote text in italic */}
      <p
        className="text-sm sm:text-base lg:text-lg dark:text-white/85 text-slate-700 leading-relaxed italic flex-1 relative z-10 mb-5"
        dir="ltr"
      >
        &ldquo;{t(testimonial.quoteKey)}&rdquo;
      </p>

      {/* Divider */}
      <div
        className="w-full h-px mb-4"
        style={{ background: `linear-gradient(to right, transparent, rgba(201,138,28,0.25), transparent)` }}
      />

      {/* Author info */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Avatar circle */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ background: `linear-gradient(135deg, ${NAVY_600}, ${GOLD})` }}
        >
          {testimonial.initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold dark:text-white text-slate-900 truncate">
            {t(testimonial.nameKey)}
          </p>
          <p className="text-xs flex items-center gap-1 truncate dark:text-[#8A96A8] text-slate-500">
            <MapPin className="w-3 h-3 shrink-0" style={{ color: GOLD }} />
            {t(testimonial.cityKey)}
          </p>
        </div>
        {/* Verified badge */}
        <div
          className="flex items-center gap-1 shrink-0 rounded-full px-2 py-1"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            {t('testimonials.v2.verified')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const { t, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll for mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const step = () => {
      if (!isPaused) {
        scrollPos += speed;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (scrollPos >= maxScroll) scrollPos = 0;
        el.scrollLeft = scrollPos;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  return (
    <section
      id="testimonials"
      dir="ltr"
      className="relative py-16 sm:py-20 lg:py-20 overflow-hidden dark:bg-gradient-to-b dark:from-[#060B1E] dark:via-[#0A1330] dark:to-[#060B1E] bg-gradient-to-b from-sky-50 via-white to-sky-50"
      aria-label="Customer testimonials"
    >
      {/* Decorative orbs */}
      <div
        className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: GOLD, filter: 'blur(100px)', opacity: 0.06 }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: NAVY_600, filter: 'blur(80px)', opacity: 0.15 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(201,138,28,0.12)', color: GOLD, border: '1px solid rgba(201,138,28,0.25)' }}
          >
            ⭐ {t('testimonials.v2.badge')}
          </div>

          {/* Heading in Playfair with gold italic */}
          <h2
            className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-tight dark:text-white text-slate-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('testimonials.v2.heading').split(' ').map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="italic" style={{ color: GOLD }}> {word}</span>
              ) : (
                <span key={i}>{i > 0 ? ' ' : ''}{word}</span>
              )
            )}
          </h2>

          {/* Trust summary */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-300">{t('testimonials.v2.irdaiVerified')}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-xs font-medium dark:text-[#8A96A8] text-slate-500">
                {t('testimonials.v2.allReviewsVerified')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Desktop: 3-column grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} t={t} index={index} />
          ))}
        </div>

        {/* Tablet: 3-column smaller grid */}
        <div className="hidden md:grid lg:hidden grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} t={t} index={index} />
          ))}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r dark:from-[#060B1E] from-sky-50 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l dark:from-[#060B1E] from-sky-50 to-transparent" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`mobile-${index}`}
                className="flex-shrink-0 w-[300px] sm:w-[340px] snap-start"
              >
                <TestimonialCard testimonial={testimonial} t={t} index={index} />
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-3 dark:text-[#8A96A8] text-slate-400">
            {t('testimonials.v2.swipeToPause')}
          </p>
        </div>
      </div>
    </section>
  );
}
