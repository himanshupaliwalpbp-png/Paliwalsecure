'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IntelProtectionScore — Design Bible v9.0 Protection Score Section
 * ═══════════════════════════════════════════════════════════════════════════
 * Per Blueprint Section 5:
 *   - 40% left (text) / 60% right (large animated gauge)
 *   - Generous padding (160px vertical)
 *   - This is the PRIMARY conversion moment of the entire page
 */

import { motion } from 'framer-motion';
import { Shield, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const BULLET_POINTS = [
  'Analyzes all your existing policies in under 2 minutes',
  'Identifies coverage gaps that could cost lakhs',
  'Compares your protection to similar families',
  'Provides a personalized optimization roadmap',
];

export default function IntelProtectionScore() {
  return (
    <section className="intel-section-lg intel-bg-midnight relative overflow-hidden">
      {/* Ambient gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(212, 168, 83, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="intel-container relative z-10">
        <div className="grid lg:grid-cols-[40%_60%] gap-12 lg:gap-20 items-center">
          {/* ── LEFT: Text content ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <div className="intel-label">PROTECTION SCORE™</div>

            <h2 className="intel-headline intel-headline-h1">
              A Single Number That Defines{' '}
              <span style={{ color: 'var(--color-intel-gold)' }}>
                Your Family&apos;s Security
              </span>
            </h2>

            <p className="intel-body-large">
              Most Indians are either under-insured (paying for inadequate
              coverage) or over-insured (wasting money). Your Protection Score
              reveals the truth — and shows you exactly how to optimize.
            </p>

            {/* Bullet points */}
            <ul className="flex flex-col gap-3 mt-2">
              {BULLET_POINTS.map((point, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <span
                    className="shrink-0 mt-0.5"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'rgba(45, 212, 168, 0.15)',
                      color: 'var(--color-intel-teal)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body), Inter, sans-serif',
                      fontSize: '16px',
                      lineHeight: 1.6,
                      color: 'var(--color-intel-white)',
                    }}
                  >
                    {point}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-6 mt-6">
              <Link href="/protection-score" className="intel-btn-primary group" prefetch={false}>
                <Shield className="w-5 h-5" />
                Get My Free Protection Score
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a href="#how-it-works" className="intel-btn-text">
                See How It Works ↓
              </a>
            </div>
          </motion.div>

          {/* ── RIGHT: Large animated gauge ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
            className="relative flex justify-center items-center"
          >
            <div
              className="intel-score-ring-container"
              style={{ maxWidth: '500px' }}
            >
              {/* Outer glow */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(212, 168, 83, 0.2) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'intel-score-pulse 4s ease-in-out infinite',
                }}
              />

              {/* Main ring */}
              <div className="intel-score-ring" style={{ aspectRatio: '1' }}>
                <div className="intel-score-content">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="intel-label-sage"
                    style={{ marginBottom: '8px' }}
                  >
                    SAMPLE SCORE
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="intel-score-number"
                    style={{ fontSize: 'clamp(4rem, 10vw, 7rem)' }}
                  >
                    87
                    <span
                      style={{
                        fontSize: '0.35em',
                        color: 'var(--color-intel-sage)',
                        fontWeight: 500,
                      }}
                    >
                      /100
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="intel-score-label"
                  >
                    Good Protection
                  </motion.div>
                </div>
              </div>

              {/* Orbiting data points */}
              <OrbitingDot angle={0} color="var(--color-intel-teal)" delay={0.6} />
              <OrbitingDot angle={90} color="var(--color-intel-gold)" delay={0.7} />
              <OrbitingDot angle={180} color="#7ED3E6" delay={0.8} />
              <OrbitingDot angle={270} color="#6EE7B7" delay={0.9} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OrbitingDot({
  angle,
  color,
  delay,
}: {
  angle: number;
  color: string;
  delay: number;
}) {
  const radius = 54;
  const rad = (angle * Math.PI) / 180;
  const x = 50 + radius * Math.cos(rad);
  const y = 50 + radius * Math.sin(rad);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 16px ${color}, 0 0 4px ${color}`,
        }}
      />
    </motion.div>
  );
}
