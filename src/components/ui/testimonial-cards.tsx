'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion';
import { Star, User, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSafeTheme } from '@/lib/safe-theme-provider';

/* ═══════════════════════════════════════════════════════════════════════════
   Testimonial ShuffleCards — Premium Swipe Card Stack
   Inspired by Eldora UI / MagicUI: draggable card stack with 3D perspective,
   physics-based fly-off animations, auto-play cycling, and full dark/light
   mode support.

   Dark mode:  Glass cards on navy (#0A1330) with gold (#C98A1C) accents
   Light mode: White/cream (#FAFAF8) cards with warm gold borders
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface TestimonialData {
  /** Display name */
  name: string;
  /** Location text (city, country) */
  location: string;
  /** Star rating 1-5 */
  rating: number;
  /** Review / testimonial text */
  review: string;
  /** Avatar background color (hex or CSS color) */
  avatarColor?: string;
}

export interface TestimonialCardsProps {
  /** Array of testimonial data to display */
  testimonials: TestimonialData[];
  /** Auto-play interval in ms (default: 4000). Set 0 to disable. */
  autoPlayInterval?: number;
  /** Additional CSS classes for the container */
  className?: string;
}

/* ─── Constants ─────────────────────────────────────────────────────────── */

const GOLD = '#C98A1C';
const CARD_WIDTH = 340;
const CARD_HEIGHT = 420;
const SWIPE_THRESHOLD = 120;
const SPRING_CONFIG = { type: 'spring' as const, stiffness: 300, damping: 30 };

/* ─── Avatar Color Palette ─────────────────────────────────────────────── */

const AVATAR_PALETTE = [
  'linear-gradient(135deg, #C98A1C 0%, #C98A1C 100%)',
  'linear-gradient(135deg, #059669 0%, #34D399 100%)',
  'linear-gradient(135deg, #C98A1C 0%, #C98A1C 100%)',
  'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
  'linear-gradient(135deg, #0A1330 0%, #162D5A 100%)',
  'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)',
  'linear-gradient(135deg, #C98A1C 0%, #C98A1C 100%)',
  'linear-gradient(135deg, #BE185D 0%, #F472B6 100%)',
];

function getAvatarGradient(index: number): string {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}

/* ─── Star Rating Display ──────────────────────────────────────────────── */

function StarRating({ rating, isDark }: { rating: number; isDark: boolean }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-[#C98A1C] text-[#C98A1C]'
              : isDark
                ? 'text-white/20'
                : 'text-gray-300'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/* ─── Single Swipe Card ─────────────────────────────────────────────────── */

interface SwipeCardProps {
  testimonial: TestimonialData;
  index: number;
  stackIndex: number;
  totalCards: number;
  isTop: boolean;
  onSwipe: () => void;
  isDark: boolean;
}

function SwipeCard({
  testimonial,
  index,
  stackIndex,
  totalCards,
  isTop,
  onSwipe,
  isDark,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0.5, 1, 1, 1, 0.5]);

  // Stack offset: cards behind are slightly smaller and shifted down
  const scaleOffset = 1 - stackIndex * 0.05;
  const yOffset = stackIndex * 12;
  const zIndex = totalCards - stackIndex;

  // Initial appear animation
  const initialScale = stackIndex === 0 ? 0.9 : 0.85;

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > 500) {
        const swipeRight = offset > 0 || velocity > 0;
        const flyX = swipeRight ? 600 : -600;
        const flyRotate = swipeRight ? 30 : -30;

        // Fly off animation
        animate(x, flyX, { ...SPRING_CONFIG, velocity: info.velocity.x });
        animate(rotate, flyRotate, SPRING_CONFIG);

        // Small delay to let animation start, then notify parent
        setTimeout(() => onSwipe(), 200);
      } else {
        // Snap back
        animate(x, 0, SPRING_CONFIG);
      }
    },
    [onSwipe, x, rotate],
  );

  // Get avatar initial from name
  const initial = (testimonial.name || '?').charAt(0).toUpperCase();
  const avatarGradient = testimonial.avatarColor || getAvatarGradient(index);

  /* ── Dark mode card style ── */
  const darkCardStyle: React.CSSProperties = {
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 50%, rgba(201,138,28,0.03) 100%)',
    backdropFilter: 'blur(24px)',
    boxShadow:
      '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(201,138,28,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
  };

  /* ── Light mode card style ── */
  const lightCardStyle: React.CSSProperties = {
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(250,250,248,0.9) 50%, rgba(201,138,28,0.04) 100%)',
    backdropFilter: 'blur(16px)',
    boxShadow:
      '0 25px 50px -12px rgba(0,0,0,0.12), 0 0 30px rgba(201,138,28,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
  };

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        zIndex,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      }}
      initial={{ scale: initialScale, y: 40, opacity: 0 }}
      animate={{
        scale: scaleOffset,
        y: yOffset,
        opacity: stackIndex <= 2 ? 1 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 25,
        mass: 0.8,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileDrag={isTop ? { scale: 1.05 } : undefined}
    >
      {/* Card body */}
      <div
        className={`w-full h-full rounded-2xl overflow-hidden ${
          isDark
            ? 'border border-white/[0.08]'
            : 'border border-[#E5E2DB]/80'
        }`}
        style={isDark ? darkCardStyle : lightCardStyle}
      >
        {/* Top gold accent line */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${GOLD}60 50%, transparent 100%)`,
          }}
        />

        <div className="p-6 sm:p-8 flex flex-col h-full">
          {/* Avatar + Name + Location */}
          <div className="flex items-center gap-4 mb-5">
            {/* Avatar circle with initial */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: avatarGradient,
                border: isDark
                  ? '2px solid rgba(255,255,255,0.1)'
                  : '2px solid rgba(201,138,28,0.3)',
                boxShadow: '0 0 20px rgba(201,138,28,0.2)',
              }}
            >
              {initial !== '?' ? (
                <span
                  className={`text-xl font-bold drop-shadow-sm ${
                    isDark ? 'text-white' : 'text-white'
                  }`}
                >
                  {initial}
                </span>
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4
                className={`font-semibold text-base truncate ${
                  isDark ? 'text-white' : 'text-[#0A1330]'
                }`}
              >
                {testimonial.name}
              </h4>
              <div className="flex items-center gap-1.5">
                <MapPin
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    isDark ? 'text-[#C98A1C]/60' : 'text-[#C98A1C]/70'
                  }`}
                  aria-hidden="true"
                />
                <p
                  className={`text-sm truncate ${
                    isDark ? 'text-white/50' : 'text-[#6B7280]'
                  }`}
                >
                  {testimonial.location}
                </p>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-5">
            <StarRating rating={testimonial.rating} isDark={isDark} />
          </div>

          {/* Review Text */}
          <div className="flex-1 overflow-hidden">
            <p
              className={`text-sm sm:text-base leading-relaxed font-[family-name:var(--font-sans)] ${
                isDark ? 'text-white/90' : 'text-[#1A1A2E]/85'
              }`}
            >
              &ldquo;{testimonial.review}&rdquo;
            </p>
          </div>

          {/* Bottom accent */}
          <div className="mt-4 flex items-center gap-2">
            <div
              className="h-0.5 w-8 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${GOLD}, transparent)`,
              }}
            />
            <span
              className={`text-xs tracking-wider uppercase ${
                isDark ? 'text-white/50' : 'text-[#9CA3AF]'
              }`}
            >
              Verified Review
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main TestimonialCards Component
   ═══════════════════════════════════════════════════════════════════════════ */

export default function TestimonialCards({
  testimonials,
  autoPlayInterval = 4000,
  className = '',
}: TestimonialCardsProps) {
  const { resolvedTheme } = useSafeTheme();
  const isDark = resolvedTheme !== 'light';

  // Use rotation offset to derive card order — avoids setState in useEffect
  const [rotationOffset, setRotationOffset] = useState(0);
  const totalCards = testimonials.length;

  // Derive the card order from the rotation offset
  const cardOrder = testimonials.map(
    (_, i) => (i + rotationOffset) % totalCards,
  );

  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInteracting = useRef(false);

  // Handle swipe: move top card to the bottom of the stack
  const handleSwipe = useCallback(
    () => {
      setRotationOffset((prev) => prev + 1);
    },
    [],
  );

  // Navigate to previous card (cycle backwards)
  const handlePrev = useCallback(() => {
    setRotationOffset((prev) => prev - 1);
  }, []);

  // Navigate to next card (same as swipe)
  const handleNext = useCallback(() => {
    setRotationOffset((prev) => prev + 1);
  }, []);

  // Auto-play: cycle cards every N seconds
  useEffect(() => {
    if (autoPlayInterval <= 0 || testimonials.length <= 1) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (!isInteracting.current) {
          setRotationOffset((prev) => prev + 1);
        }
      }, autoPlayInterval);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlayInterval, testimonials.length]);

  // Pause auto-play on interaction
  const handleInteractionStart = useCallback(() => {
    isInteracting.current = true;
  }, []);

  const handleInteractionEnd = useCallback(() => {
    // Resume auto-play after 3 seconds of no interaction
    setTimeout(() => {
      isInteracting.current = false;
    }, 3000);
  }, []);

  if (testimonials.length === 0) return null;

  // Only render the top 3 visible cards for performance
  const visibleCards = cardOrder.slice(0, Math.min(3, cardOrder.length));
  const currentIndex = cardOrder[0] ?? 0;

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Card Stack Container */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          perspective: '1200px',
        }}
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onPointerLeave={handleInteractionEnd}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at 50% 50%, rgba(201,138,28,0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 50%, rgba(201,138,28,0.05) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Card Stack */}
        {visibleCards.map((testimonialIndex, stackIndex) => {
          const testimonial = testimonials[testimonialIndex];
          if (!testimonial) return null;

          return (
            <SwipeCard
              key={`card-${testimonialIndex}-${stackIndex}`}
              testimonial={testimonial}
              index={testimonialIndex}
              stackIndex={stackIndex}
              totalCards={visibleCards.length}
              isTop={stackIndex === 0}
              onSwipe={handleSwipe}
              isDark={isDark}
            />
          );
        })}
      </div>

      {/* Controls Row: Navigation buttons + Counter + Swipe hint */}
      <div className="flex items-center justify-center gap-4 w-full max-w-[340px]">
        {/* Previous button */}
        <motion.button
          onClick={handlePrev}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50 ${
            isDark
              ? 'bg-white/[0.06] border border-white/10 hover:bg-white/[0.12] hover:border-[#C98A1C]/30'
              : 'bg-white border border-[#E5E2DB] hover:border-[#C98A1C]/40 hover:shadow-md'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous testimonial"
        >
          <ChevronLeft
            className={`w-5 h-5 ${isDark ? 'text-white/70' : 'text-[#6B7280]'}`}
          />
        </motion.button>

        {/* Counter */}
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold tabular-nums ${
              isDark ? 'text-white/80' : 'text-[#0A1330]'
            }`}
          >
            {currentIndex + 1}
          </span>
          <span className={`text-sm ${isDark ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
            /
          </span>
          <span className={`text-sm tabular-nums ${isDark ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
            {testimonials.length}
          </span>
        </div>

        {/* Next button */}
        <motion.button
          onClick={handleNext}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50 ${
            isDark
              ? 'bg-white/[0.06] border border-white/10 hover:bg-white/[0.12] hover:border-[#C98A1C]/30'
              : 'bg-white border border-[#E5E2DB] hover:border-[#C98A1C]/40 hover:shadow-md'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next testimonial"
        >
          <ChevronRight
            className={`w-5 h-5 ${isDark ? 'text-white/70' : 'text-[#6B7280]'}`}
          />
        </motion.button>
      </div>

      {/* Swipe hint */}
      <motion.p
        className={`text-xs tracking-wider ${
          isDark ? 'text-white/50' : 'text-[#9CA3AF]'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Drag to shuffle &bull; Use arrows to navigate
      </motion.p>
    </div>
  );
}
