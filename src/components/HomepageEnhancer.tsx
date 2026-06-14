'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import DynamicMeshGradientBackground from '@/components/ui/DynamicMeshGradientBackground';
import GlassmorphismCard from '@/components/ui/GlassmorphismCard';
import LiquidButton from '@/components/ui/LiquidButton';
import { Heart, Car, Shield, Plane, ArrowRight, Zap, FileSearch, Sparkles, CheckCircle, Star } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';

/**
 * HomepageEnhancer — Wraps existing homepage sections and adds
 * DynamicMeshGradientBackground to the hero area, GlassmorphismCard for 
 * featured services, and LiquidButton CTAs.
 */

/* ── Reduced motion detection ── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ── Featured Plans Section with GlassmorphismCards ── */
function FeaturedPlansSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLanguage();

  const plans = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health Insurance',
      description: 'Comprehensive coverage for you and your family. Cashless at 21,700+ hospitals. PED covered from 24 months.',
      price: '₹500/mo',
      featured: true,
      href: '/compare/health',
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: 'Motor Insurance',
      description: 'Zero depreciation, engine protection & 8,500+ cashless garages. Legally mandatory — drive protected.',
      price: '₹158/mo',
      featured: false,
      href: '/compare/motor',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Term Insurance',
      description: '₹1 Crore life cover from ₹1,000/month. Secure your family\'s future with highest CSR 99.97%.',
      price: '₹1,000/mo',
      featured: false,
      href: '/compare/life',
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: 'Travel Insurance',
      description: 'Trip cancellation, medical evacuation & lost baggage cover. Single trip from ₹449.',
      price: '₹449/trip',
      featured: false,
      href: '/compare/travel',
    },
  ];

  return (
    <section ref={ref} className="relative py-16 sm:py-24 overflow-hidden" dir="ltr">
      <div className="absolute inset-0 section-glow" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold dark:text-white text-slate-900 font-[family-name:var(--font-heading)] mb-3">
            Featured <span className="gradient-text">Insurance Plans</span>
          </h2>
          <p className="dark:text-[#8A96A8] text-slate-600 max-w-2xl mx-auto">
            AI-recommended plans with real premiums, CSR data, and IRDAI compliance — powered by InsureGPT
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassmorphismCard
                title={plan.title}
                description={plan.description}
                icon={plan.icon}
                featured={plan.featured}
                onClick={() => window.location.assign(plan.href)}
              >
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold gradient-text stat-number font-[family-name:var(--font-mono)]">{plan.price}</span>
                  <span className="dark:text-[#C98A1C] text-amber-700 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── How It Works Section with GlassmorphismCards ── */
function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const steps = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: '1. Ask InsureGPT',
      description: 'Chat with our AI advisor in Hindi, English or Hinglish. Get instant answers with real data.',
    },
    {
      icon: <FileSearch className="w-6 h-6" />,
      title: '2. Compare Plans',
      description: 'AI compares 51+ IRDAI-registered insurers side by side with CSR, premiums, and features.',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: '3. Choose & Save',
      description: 'Pick the right plan and save up to ₹75,000 under Section 80D. Hassle-free claims support.',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: '4. Get Ongoing Support',
      description: 'Your IRDAI-registered POSP advisor (Himanshu Paliwal) provides lifetime claims assistance.',
    },
  ];

  return (
    <section ref={ref} className="relative py-16 sm:py-24 overflow-hidden" dir="ltr">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold dark:text-white text-slate-900 font-[family-name:var(--font-heading)] mb-3">
            How <span className="gradient-text">It Works</span>
          </h2>
          <p className="dark:text-[#8A96A8] text-slate-600 max-w-xl mx-auto">
            From question to coverage in 4 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <GlassmorphismCard
                title={step.title}
                description={step.description}
                icon={step.icon}
                hoverEffect={true}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA with LiquidButton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <LiquidButton
            variant="primary"
            size="lg"
            onClick={() => window.dispatchEvent(new CustomEvent('open-insuregpt'))}
          >
            <Sparkles className="w-5 h-5" />
            Chat with InsureGPT
          </LiquidButton>
          <LiquidButton variant="secondary" size="lg" href="/compare">
            Compare Plans
            <ArrowRight className="w-5 h-5" />
          </LiquidButton>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Trust Indicators Section ── */
function TrustIndicatorsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const indicators = [
    { label: 'IRDAI Registered POSP', value: 'IP429834', icon: <Shield className="w-5 h-5" /> },
    { label: 'Claim Settlement', value: '98.5%', icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'Insurers Compared', value: '51+', icon: <Star className="w-5 h-5" /> },
    { label: 'Families Trusted', value: '500+', icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <section ref={ref} className="relative py-12 sm:py-16 overflow-hidden" dir="ltr">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {indicators.map((ind, index) => (
            <motion.div
              key={ind.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassmorphismCard
                title={ind.value}
                description={ind.label}
                icon={ind.icon}
                hoverEffect={false}
                className="text-center"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Main HomepageEnhancer Component ── */
export default function HomepageEnhancer({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative">
      {/* Dynamic Mesh Gradient Background behind hero — absolute so it doesn't push content */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <DynamicMeshGradientBackground
          colors={['#0A1330', '#162D5A', '#C98A1C', '#C98A1C']}
          animationSpeed={8}
          reducedMotion={reducedMotion}
          className="absolute inset-0 min-h-[92vh] sm:min-h-[88vh] lg:min-h-screen"
        />
        {/* Overlay to ensure content is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)] pointer-events-none z-[1]" />
      </div>

      {/* Existing homepage sections */}
      {children}

      {/* Enhanced sections after existing content */}
      <FeaturedPlansSection />
      <HowItWorksSection />
      <TrustIndicatorsSection />

      {/* Free Audit CTA Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden" dir="ltr">
        <div className="absolute inset-0 hero-gradient-radial" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold dark:text-white text-slate-900 font-[family-name:var(--font-heading)] mb-4">
              Is Your Insurance <span className="gradient-text">Wasting Money?</span>
            </h2>
            <p className="dark:text-[#8A96A8] text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
              Upload your existing policy and our AI will find better plans, hidden savings, and coverage gaps — <strong className="dark:text-[#C98A1C] text-amber-700">100% free</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <LiquidButton variant="primary" size="lg" href="/free-audit">
                <FileSearch className="w-5 h-5" />
                Get Free Audit
              </LiquidButton>
              <LiquidButton variant="ghost" size="lg" onClick={() => window.dispatchEvent(new CustomEvent('open-insuregpt'))}>
                <Sparkles className="w-5 h-5" />
                Ask InsureGPT
              </LiquidButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
