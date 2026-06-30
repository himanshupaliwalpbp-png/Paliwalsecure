'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IntelHero — Design Bible v9.0 "Intelligence Platform" Hero Section
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Per Complete Redesign Blueprint:
 *   - 3-word headline in premium typeface
 *   - Single primary CTA: "Calculate My Protection Score"
 *   - Living Score Gauge as the hero visual (CSS-only fallback for R3F)
 *   - Subtle animated gradient background (midnight navy → deep teal)
 *   - Social proof as a single line below the CTA
 *
 * Layout: 55% left (text) / 45% right (score visualization)
 * Background: Living gradient mesh using midnight navy → deep teal
 *
 * This is additive — does NOT replace the existing HeroAdvisor.
 * The page.tsx can swap between them via feature flag.
 */

import { motion } from 'framer-motion';
import { Shield, Play, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function IntelHero() {
  // Sample Protection Score for the visualization
  const sampleScore = 87;

  return (
    <section
      className="relative min-h-screen flex items-center intel-bg-gradient-hero overflow-hidden"
      style={{ paddingTop: '100px', paddingBottom: '80px' }}
    >
      {/* Ambient particle field — CSS-only fallback for 3D orb */}
      <div className="intel-particles" aria-hidden>
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="intel-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              opacity: 0.2 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Subtle radial glow background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 75% 50%, rgba(212, 168, 83, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="intel-container relative z-10">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* ── LEFT: Text Content ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="intel-label flex items-center gap-3"
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-intel-teal)',
                  boxShadow: '0 0 8px var(--color-intel-teal)',
                  animation: 'intel-score-pulse 2s ease-in-out infinite',
                }}
              />
              INDIA&apos;S AI INSURANCE INTELLIGENCE PLATFORM
            </motion.div>

            {/* Headline — 3 lines, premium typography */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="intel-headline intel-headline-display"
            >
              Know Exactly How
              <br />
              <span style={{ color: 'var(--color-intel-gold)' }}>
                Protected
              </span>{' '}
              You Are
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="intel-body-large"
              style={{ maxWidth: '480px' }}
            >
              Protection Score™ technology analyzes your life, health, motor, and
              home coverage across 51+ insurers. Get personalized recommendations
              in 2 minutes.
            </motion.p>

            {/* CTAs — single primary + text secondary */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center gap-6 mt-2"
            >
              <Link
                href="/protection-score"
                className="intel-btn-primary group"
                prefetch={false}
              >
                <Shield className="w-5 h-5" />
                Calculate My Protection Score
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#how-it-works"
                className="intel-btn-text"
                prefetch={false}
              >
                <Play className="w-4 h-4" />
                Watch How It Works
              </Link>
            </motion.div>

            {/* Trust Line — single line below CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="intel-trust-line mt-6"
              style={{ justifyContent: 'flex-start' }}
            >
              <span>Trusted by 10,000+ Indian families</span>
              <span className="intel-dot" />
              <span>IRDAI Certified</span>
              <span className="intel-dot" />
              <span>100% Free</span>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Living Score Gauge ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0, 0, 0.2, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="intel-score-ring-container">
              {/* Outer ring with gradient */}
              <div className="intel-score-ring">
                <div className="intel-score-content">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="intel-label-sage"
                    style={{ marginBottom: '8px', color: 'var(--color-intel-sage)' }}
                  >
                    PROTECTION SCORE
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="intel-score-number"
                  >
                    {sampleScore}
                    <span
                      style={{
                        fontSize: '0.4em',
                        color: 'var(--color-intel-sage)',
                        fontWeight: 500,
                      }}
                    >
                      /100
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    className="intel-score-label"
                  >
                    Good Protection
                  </motion.div>
                </div>
              </div>

              {/* Orbiting satellite nodes — Health, Life, Motor, Home */}
              <SatelliteNode label="Health" angle={0} color="var(--color-intel-teal)" />
              <SatelliteNode label="Life" angle={90} color="var(--color-intel-gold)" />
              <SatelliteNode label="Motor" angle={180} color="#7ED3E6" />
              <SatelliteNode label="Home" angle={270} color="#6EE7B7" />

              {/* Ambient glow */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(212, 168, 83, 0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'intel-score-pulse 4s ease-in-out infinite',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
          style={{ color: 'var(--color-intel-sage)' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{
              width: '1px',
              height: '32px',
              background: 'linear-gradient(to bottom, var(--color-intel-sage), transparent)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Satellite Node — orbiting data point around the score ring ──────────── */
function SatelliteNode({
  label,
  angle,
  color,
}: {
  label: string;
  angle: number;
  color: string;
}) {
  // Position on a circle around the score ring
  const radius = 52; // percentage from center
  const rad = (angle * Math.PI) / 180;
  const x = 50 + radius * Math.cos(rad);
  const y = 50 + radius * Math.sin(rad);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.6 + (angle / 360) * 0.4, duration: 0.5 }}
      className="absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 12px ${color}, 0 0 4px ${color}`,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-intel-white)',
            background: 'rgba(11, 18, 33, 0.7)',
            padding: '2px 6px',
            borderRadius: '3px',
            backdropFilter: 'blur(4px)',
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}
