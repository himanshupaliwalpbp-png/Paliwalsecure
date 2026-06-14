'use client';

import { useState, useRef, useCallback, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Heart, Shield, Car, Plane, type LucideIcon } from 'lucide-react';

// ── Card Data ─────────────────────────────────────────────────────────────────
interface CoverageCardData {
  id: string;
  icon: LucideIcon;
  title: string;
  price: string;
  gradient: string;
  benefits: string;
  ariaLabel: string;
}

const coverageCards: CoverageCardData[] = [
  {
    id: 'health',
    icon: Heart,
    title: 'Health Insurance',
    price: '₹399/mo',
    gradient: 'from-rose-500 to-pink-600',
    benefits: '₹10 Lakh Cover • Cashless 8000+ Hospitals • No Room Capping',
    ariaLabel: 'Health Insurance - Starting at ₹399 per month',
  },
  {
    id: 'life',
    icon: Shield,
    title: 'Life Insurance',
    price: '₹999/mo',
    gradient: 'from-emerald-500 to-teal-600',
    benefits: '₹1 Crore Term Cover • Tax Savings u/s 80C • Critical Illness Rider',
    ariaLabel: 'Life Insurance - Starting at ₹999 per month',
  },
  {
    id: 'motor',
    icon: Car,
    title: 'Motor Insurance',
    price: '₹1,899/yr',
    gradient: 'from-amber-500 to-orange-600',
    benefits: 'Own Damage + Third Party • Zero Dep Add-on • Roadside Assistance',
    ariaLabel: 'Motor Insurance - Starting at ₹1,899 per year',
  },
  {
    id: 'travel',
    icon: Plane,
    title: 'Travel Insurance',
    price: '₹449/trip',
    gradient: 'from-violet-500 to-purple-600',
    benefits: 'Trip Cancellation • Baggage Loss • Emergency Medical Abroad',
    ariaLabel: 'Travel Insurance - Starting at ₹449 per trip',
  },
];

// ── Floating Particle Component ───────────────────────────────────────────────
function FloatingParticle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: 'radial-gradient(circle, rgba(0,169,166,0.8) 0%, rgba(0,169,166,0) 70%)',
      }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0.5], y: [0, -30, -60] }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        ease: 'easeOut' as const,
      }}
      aria-hidden="true"
    />
  );
}

// ── 3D Parallax Card Component ────────────────────────────────────────────────
function ParallaxCard({ card, index }: { card: CoverageCardData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shimmerPos, setShimmerPos] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Spring-based rotation values for smooth 3D tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  // Dynamic shadow position based on tilt
  const shadowX = useSpring(0, { stiffness: 150, damping: 20 });
  const shadowY = useSpring(0, { stiffness: 150, damping: 20 });

  // Generate random particles for hover effect
  const particles = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 1.5,
    }))
  ).current;

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset card tilt
  const resetTilt = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    shadowX.set(0);
    shadowY.set(0);
    setIsHovered(false);
  }, [rotateX, rotateY, shadowX, shadowY]);

  // Handle mouse move for 3D tilt and shimmer
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || isMobile || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized position (-1 to 1)
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);

      // Tilt: max 15 degrees
      const maxTilt = 15;
      const tiltX = -normalizedY * maxTilt;
      const tiltY = normalizedX * maxTilt;

      rotateX.set(tiltX);
      rotateY.set(tiltY);

      // Dynamic shadow offset
      shadowX.set(normalizedX * 15);
      shadowY.set(normalizedY * 15);

      // Shimmer position in percentage
      const shimmerX = ((e.clientX - rect.left) / rect.width) * 100;
      const shimmerY = ((e.clientY - rect.top) / rect.height) * 100;
      setShimmerPos({ x: shimmerX, y: shimmerY });

      setIsHovered(true);
    },
    [prefersReducedMotion, isMobile, rotateX, rotateY, shadowX, shadowY]
  );

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion && !isMobile) {
      setIsHovered(true);
    }
  }, [prefersReducedMotion, isMobile]);

  // Handle click to flip card
  const handleClick = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const IconComp = card.icon;

  // Compute holographic angle for rainbow shimmer
  const holoAngle = (shimmerPos.x + shimmerPos.y) * 1.8;

  const should3D = !prefersReducedMotion && !isMobile;

  return (
    <motion.div
      className="relative"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, rotateY: should3D ? 90 : 0, y: should3D ? 0 : 40 }}
      whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        style={{
          rotateX: should3D ? springRotateX : 0,
          rotateY: should3D ? springRotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        whileHover={should3D ? { scale: 1.02 } : {}}
        transition={{ scale: { duration: 0.2 } }}
        className="relative cursor-pointer rounded-2xl overflow-hidden group"
        role="button"
        tabIndex={0}
        aria-label={card.ariaLabel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* ── Premium Multi-Layer Shadow System ── */}
        <div className="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none" aria-hidden="true">
          {/* Ambient shadow */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: isHovered
                ? `0 25px 60px -12px rgba(0,169,166,0.25), 0 12px 30px -8px rgba(0,0,0,0.15)`
                : `0 10px 30px -5px rgba(0,0,0,0.1), 0 4px 10px -4px rgba(0,0,0,0.06)`,
              transform: should3D
                ? `translateX(${isHovered ? 4 : 0}px) translateY(${isHovered ? 8 : 0}px)`
                : 'none',
            }}
          />
          {/* Colored glow shadow */}
          <motion.div
            className="absolute -inset-1 rounded-2xl"
            style={{
              boxShadow: isHovered
                ? `0 0 40px 5px rgba(0,169,166,0.15)`
                : `0 0 0px 0px rgba(0,169,166,0)`,
              x: should3D ? shadowX : 0,
              y: should3D ? shadowY : 0,
            }}
            transition={{ boxShadow: { duration: 0.4 } }}
          />
        </div>

        {/* ── Card Glass Background (z:0) ── */}
        <div
          className="relative rounded-2xl bg-white/80 border-slate-200/60 dark:bg-white/10 dark:border-white/20 backdrop-blur-xl"
          style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}
        >
          {/* ── Edge Glow Effect ── */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              boxShadow: isHovered
                ? `inset 0 0 20px rgba(0,169,166,0.3), inset 0 0 40px rgba(0,169,166,0.1), 0 0 15px rgba(0,169,166,0.2)`
                : `inset 0 0 0px rgba(0,169,166,0), 0 0 0px rgba(0,169,166,0)`,
              border: isHovered ? '1px solid rgba(0,169,166,0.5)' : '1px solid rgba(0,169,166,0)',
            }}
            aria-hidden="true"
          />

          {/* ── Enhanced Holographic Shimmer Overlay ── */}
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300 overflow-hidden"
            style={{ opacity: isHovered ? 1 : 0 }}
            aria-hidden="true"
          >
            {/* Primary prismatic rainbow gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${shimmerPos.x}% ${shimmerPos.y}%, 
                  rgba(255,0,128,0.12) 0%, 
                  rgba(255,165,0,0.10) 15%, 
                  rgba(255,255,0,0.08) 25%, 
                  rgba(0,255,128,0.10) 35%, 
                  rgba(0,169,166,0.15) 50%, 
                  rgba(0,100,255,0.10) 65%, 
                  rgba(128,0,255,0.08) 80%, 
                  transparent 100%)`,
              }}
            />
            {/* Moving spectral band */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${holoAngle}deg, 
                  transparent 0%, 
                  rgba(255,0,128,0.06) 20%, 
                  rgba(0,255,200,0.08) 40%, 
                  rgba(0,169,166,0.12) 50%, 
                  rgba(0,100,255,0.08) 60%, 
                  rgba(255,0,255,0.06) 80%, 
                  transparent 100%)`,
                backgroundSize: '200% 200%',
              }}
            />
            {/* Specular highlight spot */}
            <div
              className="absolute"
              style={{
                width: '120px',
                height: '120px',
                left: `${shimmerPos.x}%`,
                top: `${shimmerPos.y}%`,
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`,
                borderRadius: '50%',
              }}
            />
          </div>

          {/* ── Ambient glow under shimmer ── */}
          <div
            className="pointer-events-none absolute inset-0 z-0 rounded-2xl transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle at ${shimmerPos.x}% ${shimmerPos.y}%, rgba(0,169,166,0.06) 0%, transparent 50%)`,
            }}
            aria-hidden="true"
          />

          {/* ── Particle Trail on Hover ── */}
          <AnimatePresence>
            {isHovered && should3D && (
              <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
                {particles.map((p) => (
                  <FloatingParticle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* ── Front Face (unflipped content) ── */}
          <div
            className="relative z-20 p-6 sm:p-8"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(40px)',
              transition: 'transform 0.3s ease',
            }}
          >
            {/* Icon (z:60px) - pops forward more */}
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg mb-5 transition-transform duration-300`}
              style={{
                transform: should3D ? 'translateZ(20px)' : 'none',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                <IconComp className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3
              className="text-xl font-bold text-foreground dark:text-white mb-2 tracking-tight"
              style={{ transform: should3D ? 'translateZ(10px)' : 'none', transformStyle: 'preserve-3d' }}
            >
              {card.title}
            </h3>

            {/* Floating Price Tag */}
            <motion.p
              className="text-lg font-semibold inline-block text-teal-700 dark:text-[#00A9A6]"
              style={{ transform: should3D ? 'translateZ(15px)' : 'none', transformStyle: 'preserve-3d' }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
            >
              Starting {card.price}
            </motion.p>

            {/* Tap hint */}
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <span>Tap for benefits</span>
              <motion.svg
                className="w-3 h-3"
                animate={{ rotate: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </p>
          </div>

          {/* ── Benefits Panel (3D flip reveal) ── */}
          <AnimatePresence mode="wait">
            {isFlipped && (
              <motion.div
                key="benefits"
                className="relative z-20 overflow-hidden"
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
              >
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-start gap-2">
                    <div
                      className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#00A9A6' }}
                      aria-hidden="true"
                    />
                    <p className="text-sm text-foreground/80 dark:text-white/80 leading-relaxed">
                      {card.benefits}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Bottom decorative gradient ── */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"
            style={{
              background: `linear-gradient(90deg, transparent, #00A9A6, transparent)`,
            }}
            aria-hidden="true"
          />

          {/* ── Top edge accent line ── */}
          <div
            className="absolute top-0 left-[10%] right-[10%] h-[2px] rounded-t-2xl z-30 transition-all duration-500"
            style={{
              background: isHovered
                ? `linear-gradient(90deg, transparent, rgba(0,169,166,0.8), transparent)`
                : `linear-gradient(90deg, transparent, rgba(0,169,166,0.1), transparent)`,
              opacity: isHovered ? 1 : 0.3,
            }}
            aria-hidden="true"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Section Component ─────────────────────────────────────────────────────
export default function ParallaxCoverageCards() {
  return (
    <section
      id="coverage-plans"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden scroll-mt-16"
      aria-label="Our Coverage Plans"
    >
      {/* Background gradient - light and dark variants */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#0A2540] dark:via-[#0d2d4f] dark:to-[#0f172a]"
        aria-hidden="true"
      />

      {/* Subtle background pattern overlay - light mode dots */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.4) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />
      {/* Subtle background pattern overlay - dark mode dots */}
      <div
        className="absolute inset-0 opacity-[0.03] hidden dark:block"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-[10%] w-32 h-32 rounded-full opacity-10"
        style={{ backgroundColor: '#00A9A6' }}
        animate={{ y: [-20, 20], scale: [1, 1.1] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' as const }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-20 right-[8%] w-40 h-40 rounded-full opacity-[0.06]"
        style={{ backgroundColor: '#00A9A6' }}
        animate={{ y: [20, -20], scale: [1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' as const }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-1/2 right-[20%] w-24 h-24 rounded-2xl opacity-[0.04] rotate-45"
        style={{ backgroundColor: '#00A9A6' }}
        animate={{ y: [-15, 15], rotate: [45, 65] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' as const }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border mb-6 bg-teal-50 border-teal-200/60 text-teal-700 dark:bg-[rgba(0,169,166,0.1)] dark:border-[rgba(0,169,166,0.25)] dark:text-[#00A9A6]"
            >
              🛡️ Comprehensive Protection
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground dark:text-white">
            Our Coverage{' '}
            <span className="text-teal-700 dark:text-[#00A9A6]">Plans</span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our range of insurance plans designed to protect every aspect of your life.
            Hover to interact, click to discover key benefits.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coverageCards.map((card, index) => (
            <ParallaxCard key={card.id} card={card} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10 sm:mt-14"
        >
          <p className="text-sm text-muted-foreground">
            All plans are IRDAI compliant with cashless claim support
          </p>
        </motion.div>
      </div>
    </section>
  );
}
