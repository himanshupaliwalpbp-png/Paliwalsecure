'use client';

/**
 * IntelFinalCTA — Design Bible v9.0 Final CTA Section
 * Per Blueprint Section 9:
 *   - The closing argument. Convert browsers into users.
 *   - Generous padding (160px vertical), centered content
 *   - Background: subtle radial gradient warm gold at 5% fading to midnight navy
 */

import { motion } from 'framer-motion';
import { Shield, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function IntelFinalCTA() {
  return (
    <section className="intel-section-lg intel-bg-gradient-cta relative overflow-hidden">
      {/* Ambient particle field */}
      <div className="intel-particles" aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="intel-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              opacity: 0.2 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      <div className="intel-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto"
        >
          {/* Headline */}
          <h2 className="intel-headline intel-headline-h1">
            Your Family&apos;s Security{' '}
            <span style={{ color: 'var(--color-intel-gold)' }}>
              Deserves Intelligence
            </span>
          </h2>

          {/* Subheadline */}
          <p className="intel-body-large" style={{ maxWidth: '560px' }}>
            Join 10,000+ Indian families who have optimized their protection
            with AI. Calculate your Protection Score — free, takes 2 minutes,
            reveals what you actually need.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Link
              href="/protection-score"
              className="intel-btn-cta-large group"
              prefetch={false}
            >
              <Shield className="w-5 h-5" />
              Calculate My Protection Score
            </Link>

            <a
              href="https://wa.me/919257877312"
              target="_blank"
              rel="noopener noreferrer"
              className="intel-btn-secondary"
            >
              <MessageCircle className="w-5 h-5" />
              Talk to an Advisor on WhatsApp
            </a>
          </div>

          {/* Trust Line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="intel-trust-line mt-8"
          >
            <span>IRDAI Certified</span>
            <span className="intel-dot" />
            <span>51+ Insurer Partners</span>
            <span className="intel-dot" />
            <span>100% Free</span>
            <span className="intel-dot" />
            <span>DPDP 2023 Compliant</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
