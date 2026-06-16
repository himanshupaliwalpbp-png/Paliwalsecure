'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Shield, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Component ──────────────────────────────────────────────────── */
export default function HomeCTASection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const heading = isHindi ? 'अपना भविष्य' : isEnglish ? 'Ready to Secure' : 'Apna future';
  const headingAccent = isHindi ? 'सुरक्षित करने के लिए तैयार?' : isEnglish ? 'Your Future?' : 'secure karne ke liye ready?';
  const subtitle = isHindi
    ? 'हज़ारों भारतीय परिवारों से जुड़ें जो Paliwal Secure पर अपनी वित्तीय सुरक्षा के लिए भरोसा करते हैं। आज ही अपना मुफ्त सुरक्षा स्कोर पाएं।'
    : isEnglish
      ? 'Join thousands of Indian families who trust Paliwal Secure for their financial protection. Get your free Protection Score today.'
      : 'Hazaaron Indian parivaron se judein jo Paliwal Secure par apni financial protection ke liye bharosa karte hain. Aaj hi free Protection Score paayein.';

  const cta1Text = isHindi ? 'सुरक्षा स्कोर पाएं' : isEnglish ? 'Get Protection Score' : 'Protection Score paayein';
  const cta2Text = isHindi ? 'WhatsApp करें' : isEnglish ? 'WhatsApp Us' : 'WhatsApp karein';

  const liveBadge = isHindi ? 'लाइव: आज परिवार सुरक्षित' : isEnglish ? 'Live · families protected today' : 'Live · aaj parivaar secure';

  const trustIndicators = [
    { en: 'Free Analysis', hi: 'मुफ्त विश्लेषण', hg: 'Free Analysis' },
    { en: 'No Obligation', hi: 'कोई बाध्यता नहीं', hg: 'Koi Badhata Nahi' },
    { en: 'Expert Support', hi: 'विशेषज्ञ सहायता', hg: 'Expert Support' },
    { en: '100% Confidential', hi: '100% गोपनीय', hg: '100% Gopaniya' },
  ];

  return (
    <section className="section-premium relative bg-[#0E1116] text-[#FAF7F2] overflow-hidden">
      {/* Premium layered background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Single subtle sienna glow — top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#B8482C]/[0.18] rounded-full blur-[150px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250,247,242,0.35) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top gradient edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(250,247,242,0.08)] to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Live trust indicator */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4E5DD] text-[#8B3520] text-[0.8125rem] font-medium tracking-[0.01em] font-body mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8482C] animate-pulse" />
            {liveBadge}
          </motion.div>

          {/* Icon */}
          <motion.div
            className="inline-flex p-4 bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-[rgba(250,247,242,0.10)] mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Shield className="h-10 w-10 text-[#FAF7F2]" strokeWidth={1.8} />
          </motion.div>

          {/* Headline */}
          <h2 className="text-display-h2 font-display text-white mb-6">
            {heading}{' '}
            <span className="text-accent-gradient">{headingAccent}</span>
          </h2>

          <p className="text-lead-premium text-[#8B9099] mb-12 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const el = document.getElementById('advisor-form');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="btn-stripe !bg-[#FAF7F2] !text-[#0E1116] hover:!bg-[#D4633F] hover:!text-white group"
            >
              <Shield className="h-4 w-4" />
              {cta1Text}
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <a
              href="https://wa.me/919257877312"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[rgba(250,247,242,0.15)] bg-white/[0.04] text-[#FAF7F2]/90 text-[0.9375rem] font-medium tracking-[-0.01em] font-body transition-all duration-500 hover:bg-white/[0.08] hover:border-[rgba(250,247,242,0.28)] hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              {cta2Text}
            </a>
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 pt-10 border-t border-[rgba(250,247,242,0.08)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4633F] shadow-[0_0_6px_rgba(212,99,63,0.4)]" />
                  <span className="text-sm text-[#FAF7F2]/70 font-body tracking-[-0.01em]">
                    {isHindi ? indicator.hi : isEnglish ? indicator.en : indicator.hg}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(250,247,242,0.08)] to-transparent" />
    </section>
  );
}
