'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Users } from 'lucide-react';

// ── Ease curve ────────────────────────────────────────────────────────────────
const easeOutQuart: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Animated number hook ──────────────────────────────────────────────────────
function useAnimatedNumber(
  target: number,
  shouldAnimate: boolean,
  duration = 1400,
  decimals = 0,
) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let startTime: number | null = null;
    let frame: number;

    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(Number((eased * target).toFixed(decimals)));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, shouldAnimate, duration, decimals]);

  return shouldAnimate ? current : target;
}

// ── Individual stat component (hook-safe) ─────────────────────────────────────
function StatChip({
  target,
  decimals = 0,
  inView,
  isFirst,
  icon: Icon,
  children,
}: {
  target: number;
  decimals?: number;
  inView: boolean;
  isFirst: boolean;
  icon: React.ElementType;
  children: (animated: number) => React.ReactNode;
}) {
  const animated = useAnimatedNumber(target, inView, 1400, decimals);

  return (
    <span className="flex items-center">
      {/* Thin vertical divider before every item except the first */}
      {!isFirst && (
        <span
          aria-hidden="true"
          className="mx-5 sm:mx-7 h-4 w-px bg-border select-none"
        />
      )}

      <span
        className="whitespace-nowrap inline-flex items-center gap-2 text-sm text-muted-foreground"
        style={{ letterSpacing: '0.01em' }}
      >
        <Icon className="w-3.5 h-3.5 text-primary/50 shrink-0" strokeWidth={1.8} />
        <span>{children(animated)}</span>
      </span>
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TrustStrip() {
  const [inView, setInView] = useState(false);

  return (
    <motion.section
      aria-label="Trust indicators"
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: easeOutQuart }}
      onAnimationComplete={() => setInView(true)}
      className="w-full border-t border-b border-border/60 bg-background/50 backdrop-blur-sm py-7 sm:py-9"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Stat 1: IRDAI Registration */}
        <StatChip target={0} inView={inView} isFirst icon={ShieldCheck}>
          {() => <><span className="font-medium text-foreground/80">IRDAI POSP</span> IP429834</>}
        </StatChip>

        {/* Stat 2: Google Rating */}
        <StatChip target={4.8} decimals={1} inView={inView} isFirst={false} icon={Star}>
          {(animated) => (
            <>
              <span className="font-mono font-semibold text-foreground">{animated.toFixed(1)}</span>
              <span className="text-muted-foreground/70">(Google, 247 reviews)</span>
            </>
          )}
        </StatChip>

        {/* Stat 3: Families covered */}
        <StatChip target={500} inView={inView} isFirst={false} icon={Users}>
          {(animated) => (
            <>
              <span className="font-mono font-semibold text-foreground">{Math.round(animated)}</span>+
              {' '}families covered
            </>
          )}
        </StatChip>
      </div>
    </motion.section>
  );
}
