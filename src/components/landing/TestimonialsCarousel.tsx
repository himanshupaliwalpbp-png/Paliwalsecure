'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, MessageSquare, User } from 'lucide-react';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import { useLanguage } from '@/lib/i18n';
import TestimonialCards from '@/components/ui/testimonial-cards';
import type { TestimonialData } from '@/components/ui/testimonial-cards';

/* ═══════════════════════════════════════════════════════════════════════════
   TestimonialsCarousel — Real Reviews from API
   Design: Dark Premium #0A1330 × Gold #C98A1C
   ═══════════════════════════════════════════════════════════════════════════ */

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location?: string;
  createdAt: string;
}

/* ─── Animated Stars Component ──────────────────────────────────────────── */
function AnimatedStars({ rating, delay, isDark }: { rating: number; delay: number; isDark: boolean }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.35,
            delay: delay + i * 0.1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <Star
            className={`w-4 h-4 ${i < rating ? 'fill-[#C98A1C] text-[#C98A1C]' : isDark ? 'text-white/20' : 'text-gray-300'}`}
            aria-hidden="true"
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Review Card ──────────────────────────────────────────────────── */
function ReviewCard({
  review,
  index,
  isInView,
  isDark,
}: {
  review: Review;
  index: number;
  isInView: boolean;
  isDark: boolean;
}) {
  return (
    <motion.div
      className={`flex-shrink-0 w-[300px] sm:w-[340px] lg:w-[380px] p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
        isDark
          ? 'glass-card'
          : 'bg-white border-[#E5E2DB] shadow-sm hover:shadow-lg'
      }`}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 30, scale: 0.96 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Avatar + Name + Location */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-full border-2 border-[#C98A1C] overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(201,138,28,0.2) 0%, rgba(201,138,28,0.05) 100%)',
            boxShadow: '0 0 15px rgba(201, 138, 28, 0.25)',
          }}
        >
          <User className="w-6 h-6 text-[#C98A1C]" />
        </div>
        <div className="min-w-0">
          <h4 className={`font-semibold text-base truncate ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>
            {review.name}
          </h4>
          {review.location && (
            <p className={`text-sm truncate ${isDark ? 'text-[#B0BEC5]' : 'text-[#6B7280]'}`}>
              {review.location}
            </p>
          )}
        </div>
      </div>

      {/* Stars */}
      <div className="mb-4">
        <AnimatedStars rating={review.rating} delay={index * 0.15 + 0.3} isDark={isDark} />
      </div>

      {/* Review Text */}
      <p className={`text-sm sm:text-base lg:text-lg leading-relaxed font-[family-name:var(--font-sans)] ${isDark ? 'text-white/95' : 'text-[#1A1A2E]/90'}`}>
        &ldquo;{review.comment}&rdquo;
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main TestimonialsCarousel Component — Real Reviews
   ═══════════════════════════════════════════════════════════════════════════ */
export default function TestimonialsCarousel() {
  const { t } = useLanguage();
  const { resolvedTheme } = useSafeTheme();
  const isDark = resolvedTheme !== 'light';
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [activeDot, setActiveDot] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real reviews from API
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews?limit=10&approved=true');
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch {
        // Silently fail — empty state will show
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  /* Handle scroll to update active dot */
  const handleScroll = () => {
    if (!scrollRef.current || reviews.length === 0) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const scrollRatio = scrollLeft / maxScroll;
    const dotIndex = Math.round(scrollRatio * (reviews.length - 1));
    setActiveDot(Math.min(dotIndex, reviews.length - 1));
  };

  /* Handle dot click to scroll */
  const handleDotClick = (index: number) => {
    if (!scrollRef.current || reviews.length === 0) return;
    const cardWidth = scrollRef.current.scrollWidth / reviews.length;
    scrollRef.current.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth',
    });
    setActiveDot(index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: isDark ? '#050B18' : '#FAFAF8' }}
      dir="ltr"
    >
      {/* ─── Section Glow ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(201,138,28,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Heading ─── */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight mb-3 font-[family-name:var(--font-heading)]"
          >
            <span className="gradient-text-universal">{t('landing.testimonials.heading')}</span>
          </h2>
          <p className={`text-base sm:text-lg max-w-lg mx-auto font-[family-name:var(--font-sans)] ${isDark ? 'text-[#D0D8E0]' : 'text-[#6B7280]'}`}>
            {t('landing.testimonials.subheading')}
          </p>
        </motion.div>

        {/* ─── Reviews Content ─── */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-[#B0BEC5]">
              <div className="w-5 h-5 border-2 border-[#C98A1C]/30 border-t-[#C98A1C] rounded-full animate-spin" />
              <span className="text-sm">{t('landing.testimonials.loading')}</span>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16">
            {/* ─── ShuffleCards (Desktop) ─── */}
            <div className="hidden lg:flex justify-center">
              <TestimonialCards
                testimonials={reviews.map((r): TestimonialData => ({
                  name: r.name,
                  location: r.location || 'India',
                  rating: r.rating,
                  review: r.comment,
                }))}
                autoPlayInterval={5000}
              />
            </div>

            {/* ─── Carousel Container (Mobile + additional desktop view) ─── */}
            <div className="w-full lg:w-auto">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="snap-center flex-shrink-0"
                  >
                    <ReviewCard
                      review={review}
                      index={index}
                      isInView={isInView}
                      isDark={isDark}
                    />
                  </div>
                ))}
              </div>

              {/* ─── Navigation Dots ─── */}
              {reviews.length > 1 && (
                <motion.div
                  className="flex items-center justify-center gap-3 mt-8"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className="relative w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50"
                      aria-label={`Testimonial ${index + 1}`}
                      style={{
                        background:
                          activeDot === index
                            ? 'linear-gradient(135deg, #C98A1C, #C98A1C)'
                            : 'rgba(201, 138, 28, 0.25)',
                        boxShadow:
                          activeDot === index
                            ? '0 0 10px rgba(201, 138, 28, 0.4)'
                            : 'none',
                        transform: activeDot === index ? 'scale(1.25)' : 'scale(1)',
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          /* ─── Empty State — No reviews yet ─── */
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,138,28,0.1)' }}>
              <MessageSquare className="w-8 h-8 text-[#C98A1C]" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>
              {t('landing.testimonials.emptyTitle')}
            </h3>
            <p className={`text-sm max-w-md mx-auto mb-6 ${isDark ? 'text-[#B0BEC5]' : 'text-[#6B7280]'}`}>
              {t('landing.testimonials.emptyDesc')}
            </p>
            <a
              href="/api/reviews"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[#0F1C40] to-[#162D5A] text-white border border-[#C98A1C]/40 hover:shadow-lg hover:shadow-[#C98A1C]/25 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                // Scroll to bottom or open review form
                window.dispatchEvent(new CustomEvent('open-insuregpt'));
              }}
            >
              <Star className="w-4 h-4" />
              {t('landing.testimonials.reviewBtn')}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
