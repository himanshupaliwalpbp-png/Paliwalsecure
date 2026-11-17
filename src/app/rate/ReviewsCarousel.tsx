'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, BadgeCheck, MoveHorizontal } from 'lucide-react';

export type PublicReview = {
  id: string;
  productName: string;
  insuranceType: string;
  rating: number;
  title: string;
  body: string;
  reviewerName: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
};

const SPRING = { type: 'spring', stiffness: 300, damping: 34 } as const;

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 380, damping: 18 }}
        >
          <Star
            className={`w-4 h-4 ${
              i <= rating ? 'text-[#C98A1C] fill-[#C98A1C]' : 'text-[#C98A1C]/30 fill-transparent'
            }`}
          />
        </motion.span>
      ))}
    </div>
  );
}

/**
 * Swipeable customer-rating carousel — spring drag physics, coverflow depth,
 * auto-advance, dots + arrow controls. v19 SAFFRON DAWN styling.
 */
export default function ReviewsCarousel({ reviews }: { reviews: PublicReview[] }) {
  const count = reviews.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [viewportW, setViewportW] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Measure viewport for slide sizing (peek of neighbours on wider screens)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setViewportW(el.clientWidth));
    ro.observe(el);
    setViewportW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const cardW = viewportW ? Math.min(460, Math.max(300, Math.round(viewportW * 0.86))) : 0;
  const gap = 20;
  const step = cardW + gap;

  // Snap track to the active card
  useEffect(() => {
    if (!step) return;
    animate(x, -index * step, SPRING);
  }, [index, step]); // x is a stable MotionValue — intentional omission

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => Math.min(count - 1, Math.max(0, i + dir)));
    },
    [count]
  );

  // Auto-advance (paused on hover/touch/hidden tab)
  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, 5200);
    return () => clearInterval(t);
  }, [paused, count]);

  const handleDragEnd = (_e: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    setPaused(false);
    if (count <= 1 || !step) return;
    const { offset, velocity } = info;
    const threshold = 60;
    let next = index;
    if (offset.x < -threshold || velocity.x < -350) next = Math.min(count - 1, index + 1);
    else if (offset.x > threshold || velocity.x > 350) next = Math.max(0, index - 1);
    if (next !== index) setIndex(next);
    else animate(x, -index * step, SPRING); // elastic snap-back
  };

  if (count === 0) return null;

  return (
    <section
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Customer ratings carousel"
    >
      <div ref={containerRef} className="overflow-hidden" style={{ paddingLeft: 0 }}>
        <motion.div
          className="flex cursor-grab active:cursor-grabbing py-2"
          style={{ x, gap }}
          drag={count > 1 ? 'x' : false}
          dragConstraints={{ left: -step * (count - 1), right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {reviews.map((r, i) => {
            const dist = Math.abs(i - index);
            return (
              <motion.div
                key={r.id}
                className="shrink-0"
                style={{ width: cardW || '100%' }}
                animate={{
                  scale: dist === 0 ? 1 : dist === 1 ? 0.94 : 0.88,
                  opacity: dist === 0 ? 1 : dist === 1 ? 0.72 : 0.42,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                aria-hidden={dist > 1}
              >
                <article className="nl-glass p-6 flex flex-col gap-3 h-full min-h-[240px] sm:min-h-[256px]">
                  <div className="flex items-center justify-between gap-2">
                    <StarRow rating={r.rating} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8272]">
                      {r.insuranceType}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#17130E] leading-snug text-balance">
                    {r.title}
                  </h3>
                  <p className="text-sm text-[#57503F] leading-relaxed line-clamp-4">{r.body}</p>
                  <div className="mt-auto pt-3 border-t border-black/5 flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#8B3520]">{r.reviewerName}</span>
                    {r.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-wider text-[#2D6A4F]">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                    <span className="ml-auto text-xs text-[#8A8272]">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {count > 1 && (
        <>
          {/* Arrows */}
          <div className="mt-7 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="Pichla review dekhein"
              className="w-12 h-12 rounded-full flex items-center justify-center border border-[#C98A1C]/40 bg-white/80 text-[#8B3520] shadow-[0_6px_18px_-8px_rgba(139,53,32,0.45)] hover:border-[#B8482C]/60 hover:bg-[#B8482C]/10 transition-all duration-200 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Reviews slides">
              {reviews.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Review ${i + 1}: ${r.reviewerName}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === index ? 'w-7 bg-[#B8482C]' : 'w-2 bg-[#C98A1C]/35 hover:bg-[#C98A1C]/60'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === count - 1}
              aria-label="Agla review dekhein"
              className="w-12 h-12 rounded-full flex items-center justify-center border border-[#C98A1C]/40 bg-white/80 text-[#8B3520] shadow-[0_6px_18px_-8px_rgba(139,53,32,0.45)] hover:border-[#B8482C]/60 hover:bg-[#B8482C]/10 transition-all duration-200 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Swipe hint */}
          <AnimatePresence>
            {index === 0 && !paused && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8A8272]"
              >
                <MoveHorizontal className="w-4 h-4 text-[#C98A1C]" />
                Card ko swipe karke agli rating dekhein
              </motion.p>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  );
}
