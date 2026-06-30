'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IntelAIPlatform — Design Bible v9.0 "AI Intelligence Platform" Section
 * ═══════════════════════════════════════════════════════════════════════════
 * Per Blueprint Section 3:
 *   - 2x2 feature grid (Protection Score, InsureGPT, Smart Comparison, Claim Intelligence)
 *   - Background: Surface Dark (#0F1729)
 *   - "Not an agency. Not a comparison site. An intelligence platform."
 */

import { motion } from 'framer-motion';
import { Gauge, MessageSquare, BarChart3, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    id: 'score',
    title: 'Protection Score™',
    description:
      'A single number that tells you exactly how protected your family is. Updated in real-time as your life changes.',
    icon: Gauge,
  },
  {
    id: 'gpt',
    title: 'InsureGPT',
    description:
      'Ask anything about insurance in Hindi, English, or Hinglish. Get IRDAI-compliant answers, not sales pitches.',
    icon: MessageSquare,
  },
  {
    id: 'comparison',
    title: 'Smart Comparison',
    description:
      'We analyze 51+ insurers across 200+ parameters to find your optimal coverage, not just the cheapest premium.',
    icon: BarChart3,
  },
  {
    id: 'claims',
    title: 'Claim Intelligence',
    description:
      'Step-by-step claim guidance, document checklists, and status tracking. We don\'t just sell policies — we ensure they work when you need them.',
    icon: ShieldCheck,
  },
];

export default function IntelAIPlatform() {
  return (
    <section className="intel-section intel-bg-surface-dark">
      <div className="intel-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 mb-16 max-w-3xl"
        >
          <div className="intel-label">THE PLATFORM</div>
          <h2 className="intel-headline intel-headline-h1">
            Insurance Decisions,{' '}
            <span style={{ color: 'var(--color-intel-gold)' }}>
              Powered by Intelligence
            </span>
          </h2>
          <p className="intel-body-large">
            Not an agency. Not a comparison site. An intelligence platform that
            understands your unique situation and recommends precisely what you
            need.
          </p>
        </motion.div>

        {/* 2x2 Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="intel-card-feature group"
              >
                <div className="flex flex-col gap-4">
                  {/* Icon with glow */}
                  <div className="relative inline-flex">
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(212,168,83,0.25) 0%, transparent 70%)',
                      }}
                    />
                    <div
                      className="relative w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(212, 168, 83, 0.1)',
                        border: '1px solid rgba(212, 168, 83, 0.2)',
                        color: 'var(--color-intel-gold)',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title + Description */}
                  <h3
                    className="intel-headline"
                    style={{ fontSize: '24px', fontWeight: 600 }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    className="intel-body"
                    style={{ fontSize: '16px', lineHeight: 1.6 }}
                  >
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
