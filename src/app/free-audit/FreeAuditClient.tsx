'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ArrowRight, CheckCircle, Sparkles, Phone, MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import RatingLeadForm from '@/components/RatingLeadForm';

export default function FreeAuditClient() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">Free Insurance Consultation</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Get Expert Insurance Advice —{' '}
              <span className="gradient-text">100% Free</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Talk to Himanshu Paliwal (IRDAI POSP IP429834) for personalized insurance recommendations.
              Compare 51+ insurers. Get the best plan for your needs — no obligation, no fees.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="https://wa.me/919257877312?text=Hi%20Himanshu!%20I%20want%20a%20free%20insurance%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Now
              </a>
              <a
                href="https://wa.me/919257877312"
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call +91-92587-77312
              </a>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="text-sm text-primary hover:underline font-medium"
            >
              Or fill out a quick form →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Lead Form */}
      <AnimatePresence>
        {showForm && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="max-w-2xl mx-auto px-4 py-8">
              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border/50">
                <h2 className="text-xl font-bold mb-4">Quick Consultation Request</h2>
                <RatingLeadForm />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* What You Get */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">What You Get — Free</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Personalized Recommendations',
                desc: 'Get insurance recommendations based on YOUR family size, income, age, health conditions, and budget. Not generic advice.',
              },
              {
                icon: CheckCircle,
                title: 'Compare 51+ Insurers',
                desc: 'We compare plans from 51+ IRDAI-registered insurers. See side-by-side comparison of premium, CSR, network hospitals, and add-ons.',
              },
              {
                icon: Sparkles,
                title: 'Claim Assistance',
                desc: 'We help with claims across ALL insurers we work with — documentation, follow-up, escalation to IRDAI if needed. Free for life.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-card rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">IRDAI Registered POSP (IP429834)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">500+ Families Served</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">5+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">Hindi · English · Hinglish</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Contact Himanshu on WhatsApp or call directly. No fees, no obligation.
            Get expert insurance advice in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/919257877312?text=Hi%20Himanshu!%20I%20want%20a%20free%20insurance%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp +91-92587-77312
            </a>
            <Link href="/compare" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg transition-all flex items-center gap-2">
              Compare Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Insurance is the subject matter of solicitation. IRDAI POSP Code: IP429834.
            By Himanshu Paliwal, IRDAI Certified Insurance Advisor.
          </p>
        </div>
      </section>
    </div>
  );
}
