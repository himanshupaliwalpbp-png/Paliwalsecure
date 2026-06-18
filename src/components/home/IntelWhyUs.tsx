'use client';

/**
 * IntelWhyUs — Design Bible v9.0 "Why Choose Us" Section
 * Per Blueprint Section 6:
 *   - 3 pillars (AI-First, Your Data Your Control, From Purchase to Claim)
 *   - Numbered cards (01, 02, 03)
 *   - "Intelligence, Not Commissions"
 */

import { motion } from 'framer-motion';
import { Cpu, Lock, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Pillar {
  id: string;
  number: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

const PILLARS: Pillar[] = [
  {
    id: 'ai-first',
    number: '01',
    title: 'AI-First, Always',
    body:
      'Our recommendations come from algorithms analyzing 200+ parameters across 51+ insurers. No human bias. No commission-driven suggestions. Just pure intelligence.',
    icon: Cpu,
  },
  {
    id: 'data-control',
    number: '02',
    title: 'Your Data, Your Control',
    body:
      'DPDP Act 2023 compliant. We don\'t sell your data. We don\'t spam your phone. We don\'t push products you don\'t need. Your information is encrypted and used only to serve you better.',
    icon: Lock,
  },
  {
    id: 'claim-support',
    number: '03',
    title: 'From Purchase to Claim',
    body:
      'Most advisors disappear after the sale. We\'re with you when it matters most — during claims. Our Claim Intelligence system guides you step-by-step from filing to settlement.',
    icon: ShieldCheck,
  },
];

export default function IntelWhyUs() {
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
          <div className="intel-label">WHY PALIWAL SECURE</div>
          <h2 className="intel-headline intel-headline-h1">
            Intelligence,{' '}
            <span style={{ color: 'var(--color-intel-gold)' }}>
              Not Commissions
            </span>
          </h2>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                className="intel-pillar relative"
              >
                {/* Number in top-right */}
                <span
                  className="intel-section-number absolute top-0 right-0"
                  style={{ opacity: 0.4 }}
                >
                  {p.number}
                </span>

                {/* Icon */}
                <div
                  className="mb-6 inline-flex"
                  style={{ color: 'var(--color-intel-gold)' }}
                >
                  <Icon className="w-12 h-12" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3
                  className="intel-headline mb-4"
                  style={{ fontSize: '24px', fontWeight: 600 }}
                >
                  {p.title}
                </h3>

                {/* Body */}
                <p
                  className="intel-body"
                  style={{ fontSize: '16px', lineHeight: 1.6 }}
                >
                  {p.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
