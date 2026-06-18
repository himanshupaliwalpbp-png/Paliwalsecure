'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ── Testimonial Data ──────────────────────────────────────────────────────
const testimonials = [
  {
    id: 1,
    quote: 'Paliwal Secure ne meri health insurance mein \u20B98000 bachaye!',
    name: 'Rajesh K.',
    city: 'Delhi',
    rating: 5,
    initials: 'RK',
    gradient: 'from-teal-400 to-emerald-500',
  },
  {
    id: 2,
    quote: 'Claim settlement sirf 3 din mein \u2014 unbelievable!',
    name: 'Priya S.',
    city: 'Mumbai',
    rating: 5,
    initials: 'PS',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 3,
    quote: 'AI recommendation itni accurate thi ki mujhe compare karne ki zaroorat nahi padi',
    name: 'Amit T.',
    city: 'Bangalore',
    rating: 4,
    initials: 'AT',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    id: 4,
    quote: 'Family floater plan ke liye best advice mili',
    name: 'Sunita R.',
    city: 'Kota',
    rating: 5,
    initials: 'SR',
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    id: 5,
    quote: 'Roadside assistance add karne mein kitna aasan tha!',
    name: 'Vikram M.',
    city: 'Chennai',
    rating: 5,
    initials: 'VM',
    gradient: 'from-cyan-400 to-blue-500',
  },
];

// ── Cylinder geometry constants ───────────────────────────────────────────
const CYLINDER_RADIUS = 320; // px – radius of the virtual cylinder
const ANGLE_PER_CARD = 360 / testimonials.length; // 72° for 5 cards

// ── Helper: get card position offset from active ──────────────────────────
function getOffset(index: number, activeIndex: number, total: number): number {
  const half = Math.floor(total / 2);
  let offset = index - activeIndex;
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
}

// ── Card transform based on offset (cylindrical fan) ─────────────────────
function getCardTransform(offset: number) {
  const angle = offset * ANGLE_PER_CARD;
  const rad = (angle * Math.PI) / 180;
  const x = Math.sin(rad) * CYLINDER_RADIUS;
  const z = CYLINDER_RADIUS - Math.cos(rad) * CYLINDER_RADIUS;
  const absOffset = Math.abs(offset);
  const total = testimonials.length;

  // Normalized depth 0 = front, 1 = farthest
  const maxOffset = Math.floor(total / 2);
  const depth = maxOffset === 0 ? 0 : absOffset / maxOffset;

  return {
    rotateY: -angle,
    translateZ: -z,
    translateX: x,
    scale: 1 - depth * 0.3,
    opacity: 1 - depth * 0.65,
    zIndex: total - absOffset + 1,
    blur: depth * 3,
    shadowIntensity: depth, // 0 = full shadow, 1 = minimal
  };
}

// ── Animated Star Rating Component ────────────────────────────────────────
function TestimonialStars({
  rating,
  isActive,
}: {
  rating: number;
  isActive: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.span
          key={star}
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={
            isActive
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 1, scale: 1, rotate: 0 }
          }
          transition={
            isActive
              ? {
                  type: 'tween' as const,
                  duration: 0.3,
                  delay: star * 0.08,
                  ease: [0.34, 1.56, 0.64, 1], // back ease-out
                }
              : { duration: 0.01 }
          }
        >
          <Star
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300 dark:text-white/20 fill-slate-200 dark:fill-white/10'
            }`}
          />
        </motion.span>
      ))}
    </div>
  );
}

// ── Animated Quote Mark ───────────────────────────────────────────────────
function AnimatedQuoteMark({
  isOpen,
  isActive,
}: {
  isOpen: boolean;
  isActive: boolean;
}) {
  return (
    <motion.span
      className="text-teal-700 dark:text-[#00A9A6] font-serif leading-none select-none inline-block"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        isActive
          ? { opacity: 0.6, scale: 1 }
          : { opacity: 0.6, scale: 1 }
      }
      transition={
        isActive
          ? {
              type: 'spring' as const,
              stiffness: 260,
              damping: 20,
              delay: isOpen ? 0 : 0.1,
            }
          : { duration: 0.01 }
      }
      style={{ fontSize: isOpen ? '3rem' : '2.25rem' }}
    >
      {isOpen ? '\u201C' : '\u201D'}
    </motion.span>
  );
}

// ── Dots Indicator ────────────────────────────────────────────────────────
function CarouselDots({
  activeIndex,
  total,
  onSelect,
}: {
  activeIndex: number;
  total: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to testimonial ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${
            i === activeIndex
              ? 'w-8 h-2.5 bg-[#00A9A6]'
              : 'w-2.5 h-2.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
          }`}
        />
      ))}
    </div>
  );
}

// ── Reflection Component ──────────────────────────────────────────────────
function CardReflection({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="relative h-24 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-white/80 dark:bg-white/5 backdrop-blur-xl border-x border-b border-slate-200/60 dark:border-white/10 rounded-b-2xl p-6 pt-2"
        style={{
          transform: 'scaleY(-1)',
          transformOrigin: 'top',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)',
        }}
      >
        <p className="text-foreground text-sm leading-relaxed opacity-30 blur-[0.5px]">
          {testimonial.quote.slice(0, 80)}...
        </p>
      </div>
      {/* Fade overlay at the bottom of reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 dark:from-[#0A2540] to-transparent" />
    </div>
  );
}

// ── Mobile Card Stack Component ───────────────────────────────────────────
function MobileCardStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragStartTime = useRef<number>(0);
  const dragVelocity = useRef<number>(0);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Drag handlers with momentum
  const handleDragStart = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragStartTime.current = Date.now();
    dragVelocity.current = 0;
  }, []);

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    const elapsed = Date.now() - dragStartTime.current;
    if (elapsed > 0) {
      dragVelocity.current = diff / elapsed; // px per ms
    }
  }, []);

  const handleDragEnd = useCallback(
    (e: React.PointerEvent) => {
      if (dragStartX.current === null) return;
      const diff = e.clientX - dragStartX.current;
      const velocity = dragVelocity.current;
      const threshold = 40;

      // Use momentum: if velocity is high enough, trigger even with small drag
      if (Math.abs(diff) > threshold || Math.abs(velocity) > 0.3) {
        if (diff > 0 || velocity > 0.3) {
          setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        } else {
          setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }
      }
      dragStartX.current = null;
      dragVelocity.current = 0;
    },
    []
  );

  const current = testimonials[activeIndex];

  // Stacked card offsets for visual depth
  const nextIndex = (activeIndex + 1) % testimonials.length;
  const nextNextIndex = (activeIndex + 2) % testimonials.length;

  return (
    <div
      className="relative w-full max-w-sm mx-auto"
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
    >
      <div className="relative" style={{ perspective: '800px' }}>
        {/* Back card (2nd next) */}
        <motion.div
          key={`back-${testimonials[nextNextIndex].id}`}
          className="absolute inset-0"
          animate={{ scale: 0.88, y: 24, opacity: 0.4 }}
          transition={{ type: 'spring' as const, stiffness: 200, damping: 25 }}
          style={{ zIndex: 1 }}
        >
          <div className="bg-slate-50 border border-slate-200/60 dark:bg-white/5 dark:border-white/10 backdrop-blur-lg rounded-2xl p-6 h-full" />
        </motion.div>

        {/* Middle card (next) */}
        <motion.div
          key={`mid-${testimonials[nextIndex].id}`}
          className="absolute inset-0"
          animate={{ scale: 0.94, y: 12, opacity: 0.7 }}
          transition={{ type: 'spring' as const, stiffness: 200, damping: 25 }}
          style={{ zIndex: 2 }}
        >
          <div className="bg-slate-100/80 border border-slate-200/60 dark:bg-white/[0.08] dark:border-white/15 backdrop-blur-xl rounded-2xl p-6 h-full" />
        </motion.div>

        {/* Active card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring' as const, stiffness: 260, damping: 25 }}
            style={{ zIndex: 3 }}
          >
            <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-[#00A9A6]/30 shadow-sm dark:shadow-none rounded-2xl p-6 shadow-xl shadow-[#00A9A6]/10 dark:shadow-[#00A9A6]/10">
              <AnimatedQuoteMark isOpen={true} isActive={true} />
              <p className="text-foreground text-sm leading-relaxed mb-4 mt-2">
                {current.quote}
              </p>
              <AnimatedQuoteMark isOpen={false} isActive={true} />
              <div className="w-10 h-0.5 bg-[#00A9A6]/40 rounded-full my-4" />
              <TestimonialStars rating={current.rating} isActive={true} />
              <div className="flex items-center gap-3 mt-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${current.gradient} flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0`}
                >
                  {current.initials}
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{current.name}</p>
                  <p className="text-muted-foreground text-xs">{current.city}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pt-[10%]" />
      </div>

      {/* Mobile dots */}
      <CarouselDots
        activeIndex={activeIndex}
        total={testimonials.length}
        onSelect={setActiveIndex}
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function TestimonialCarousel3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragStartTime = useRef<number>(0);
  const dragVelocity = useRef<number>(0);

  // ── Detect prefers-reduced-motion changes ─────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // ── Detect mobile viewport ────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Auto-rotate with smooth easing ────────────────────────────────────
  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      if (autoRotateRef.current) clearTimeout(autoRotateRef.current);
      return;
    }
    const scheduleNext = () => {
      autoRotateRef.current = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        scheduleNext();
      }, 5000);
    };
    scheduleNext();
    return () => {
      if (autoRotateRef.current) clearTimeout(autoRotateRef.current);
    };
  }, [isPaused, prefersReducedMotion]);

  // ── Keyboard navigation ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Only handle if section is in viewport
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Navigation handlers ───────────────────────────────────────────────
  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goToIndex = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // ── Drag handlers with momentum ───────────────────────────────────────
  const handleDragStart = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragStartTime.current = Date.now();
    dragVelocity.current = 0;
  }, []);

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    const elapsed = Date.now() - dragStartTime.current;
    if (elapsed > 0) {
      dragVelocity.current = diff / elapsed;
    }
  }, []);

  const handleDragEnd = useCallback(
    (e: React.PointerEvent) => {
      if (dragStartX.current === null) return;
      const diff = e.clientX - dragStartX.current;
      const velocity = dragVelocity.current;
      const threshold = 40;

      if (Math.abs(diff) > threshold || Math.abs(velocity) > 0.3) {
        if (diff > 0 || velocity > 0.3) {
          goToPrev();
        } else {
          goToNext();
        }
      }
      dragStartX.current = null;
      dragVelocity.current = 0;
    },
    [goToPrev, goToNext]
  );

  // ── Spring transition config (2-keyframe compliant) ───────────────────
  const springTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : {
        type: 'spring' as const,
        stiffness: 180,
        damping: 22,
        mass: 0.9,
      };

  // ── Shadow classes by position ────────────────────────────────────────
  function getShadowClass(shadowIntensity: number, isFront: boolean): string {
    if (isFront) {
      return 'shadow-[0_8px_40px_rgba(0,169,166,0.18),0_2px_12px_rgba(0,0,0,0.4),0_0_80px_rgba(0,169,166,0.08)]';
    }
    if (shadowIntensity < 0.5) {
      return 'shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_30px_rgba(0,169,166,0.06)]';
    }
    return 'shadow-[0_2px_10px_rgba(0,0,0,0.2)]';
  }

  return (
    <section
      id="testimonials-3d"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-[#0A2540] dark:to-slate-900" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00A9A6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00A9A6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-[#00A9A6]/15 dark:text-[#00A9A6] dark:border-[#00A9A6]/30 px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full">
            💬 Trusted Reviews
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground dark:text-white">
            Customer{' '}
            <span className="text-teal-700 dark:text-[#00A9A6]">Stories</span>
          </h2>
          <p className="mt-3 text-sm sm:text-lg text-muted-foreground">
            Real people, real savings
          </p>
        </motion.div>

        {/* ── Mobile: Card Stack ──────────────────────────────────────── */}
        <div className="sm:hidden">
          <MobileCardStack />
        </div>

        {/* ── Desktop: 3D Carousel ────────────────────────────────────── */}
        <div className="hidden sm:block">
          <div className="relative flex items-center justify-center">
            {/* Left Arrow */}
            <motion.button
              onClick={goToPrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-2 sm:left-4 lg:left-8 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-[#00A9A6] hover:border-[#00A9A6]/50 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A9A6]/50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              onClick={goToNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-2 sm:right-4 lg:right-8 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-[#00A9A6] hover:border-[#00A9A6]/50 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A9A6]/50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Carousel Container with perspective */}
            <div
              ref={containerRef}
              className="relative w-full max-w-2xl mx-auto"
              style={{ perspective: '1400px', perspectiveOrigin: '50% 45%' }}
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              role="region"
              aria-roledescription="carousel"
              aria-label="Customer testimonials"
              tabIndex={0}
            >
              <div
                className="relative flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <AnimatePresence mode="popLayout">
                  {testimonials.map((testimonial, index) => {
                    const offset = getOffset(index, activeIndex, testimonials.length);
                    const transform = getCardTransform(offset);
                    const isFront = offset === 0;

                    return (
                      <motion.div
                        key={testimonial.id}
                        layout
                        animate={{
                          rotateY: transform.rotateY,
                          z: transform.translateZ,
                          x: transform.translateX,
                          scale: transform.scale,
                          opacity: transform.opacity,
                        }}
                        transition={springTransition}
                        className="absolute w-full max-w-md"
                        style={{
                          transformStyle: 'preserve-3d',
                          zIndex: transform.zIndex,
                          filter: transform.blur > 0 ? `blur(${transform.blur}px)` : 'none',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        {/* Animated border glow wrapper for active card */}
                        <motion.div
                          animate={
                            isFront
                              ? {
                                  boxShadow: [
                                    '0 0 0px rgba(0,169,166,0)',
                                    '0 0 20px rgba(0,169,166,0.25)',
                                  ],
                                }
                              : { boxShadow: '0 0 0px rgba(0,169,166,0)' }
                          }
                          transition={
                            isFront
                              ? {
                                  type: 'tween' as const,
                                  duration: 1.5,
                                  ease: [0.42, 0, 0.58, 1],
                                  repeat: Infinity,
                                  repeatType: 'reverse',
                                }
                              : { duration: 0.01 }
                          }
                          className="rounded-2xl"
                        >
                          <div
                            className={`
                              bg-white/80 dark:bg-white/10 backdrop-blur-xl
                              border rounded-2xl p-6 sm:p-8
                              transition-colors duration-500
                              ${isFront ? 'border-[#00A9A6]/40 bg-white/90 dark:bg-white/[0.12]' : 'border-slate-200/60 dark:border-white/15'}
                              shadow-sm dark:shadow-none
                              ${getShadowClass(transform.shadowIntensity, isFront)}
                              ${Math.abs(offset) === 1 ? 'cursor-pointer' : ''}
                            `}
                            onClick={() => !isFront && goToIndex(index)}
                            role={isFront ? undefined : 'button'}
                            aria-label={
                              isFront
                                ? undefined
                                : `View testimonial from ${testimonial.name}`
                            }
                            aria-roledescription={isFront ? 'slide' : undefined}
                          >
                            {/* Large decorative opening quote mark */}
                            <div className="mb-2">
                              <AnimatedQuoteMark isOpen={true} isActive={isFront} />
                            </div>

                            {/* Quote text */}
                            <p className="text-foreground dark:text-white text-sm sm:text-base lg:text-lg leading-relaxed mb-5 min-h-[3rem]">
                              {testimonial.quote}
                            </p>

                            {/* Closing quote mark */}
                            <div className="text-right -mt-2 mb-4">
                              <AnimatedQuoteMark isOpen={false} isActive={isFront} />
                            </div>

                            {/* Divider */}
                            <div className="w-12 h-0.5 bg-[#00A9A6]/40 rounded-full mb-4" />

                            {/* Animated rating */}
                            <TestimonialStars
                              rating={testimonial.rating}
                              isActive={isFront}
                            />

                            {/* Author info */}
                            <div className="flex items-center gap-3 mt-4">
                              <div
                                className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0`}
                              >
                                {testimonial.initials}
                              </div>
                              <div>
                                <p className="text-foreground dark:text-white text-sm font-semibold">
                                  {testimonial.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {testimonial.city}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Reflection effect below active card */}
                        {isFront && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring' as const, stiffness: 200, damping: 25, delay: 0.2 }}
                          >
                            <CardReflection testimonial={testimonial} />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Spacer to give height to the container */}
              <div className="pt-[85%] sm:pt-[75%] md:pt-[70%]" />
            </div>
          </div>

          {/* ── Dots Indicator ────────────────────────────────────────── */}
          <CarouselDots
            activeIndex={activeIndex}
            total={testimonials.length}
            onSelect={goToIndex}
          />

          {/* ── Keyboard hint ─────────────────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
            className="text-center text-muted-foreground text-xs mt-4 hidden sm:block"
          >
            Use ← → arrow keys to navigate
          </motion.p>
        </div>

        {/* ── Mobile swipe hint ───────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center text-muted-foreground text-xs mt-4 sm:hidden"
        >
          Swipe to see more reviews
        </motion.p>
      </div>
    </section>
  );
}
