'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, MessageCircle } from 'lucide-react';
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

  const trustIndicators = [
    { en: 'Free Analysis', hi: 'मुफ्त विश्लेषण', hg: 'Free Analysis' },
    { en: 'No Obligation', hi: 'कोई बाध्यता नहीं', hg: 'No Obligation' },
    { en: 'Expert Support', hi: 'विशेषज्ञ सहायता', hg: 'Expert Support' },
    { en: '100% Confidential', hi: '100% गोपनीय', hg: '100% Confidential' },
  ];

  return (
    <section className="section-luxury relative bg-[#070B14] dark:bg-[#070B14] text-white overflow-hidden">
      {/* Premium layered background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep radial gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B14] via-[#0C1425] to-[#070B14]" />
        {/* Primary glow — center top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#043C50]/[0.08] rounded-full blur-[150px]" />
        {/* Gold glow — center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E8C872]/[0.04] rounded-full blur-[120px]" />
        {/* Emerald glow — bottom */}
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#08799A]/[0.05] rounded-full blur-[120px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top gradient edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Icon */}
          <motion.div
            className="inline-flex p-4 bg-white/[0.05] backdrop-blur-sm rounded-2xl border border-white/[0.08] mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Shield className="h-10 w-10 text-[#E8C872]" strokeWidth={1.8} />
          </motion.div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold mb-6 font-heading leading-[1.08] tracking-tight">
            {heading}{' '}
            <span className="gradient-luxury">{headingAccent}</span>
          </h2>

          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-sans">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const el = document.getElementById('advisor-form');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="btn-luxury-gold btn-luxury-lg group"
            >
              <Shield className="h-4 w-4" />
              {cta1Text}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
            <a
              href="https://wa.me/919257877312"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-secondary btn-luxury-lg !border-white/[0.12] !text-white/90 !bg-white/[0.04] hover:!bg-white/[0.08] hover:!border-white/[0.2] hover:!text-white"
            >
              <MessageCircle className="h-4 w-4" />
              {cta2Text}
            </a>
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 pt-10 border-t border-white/[0.06]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#08799A] shadow-[0_0_6px_rgba(8,121,154,0.4)]" />
                  <span className="text-sm text-white/45 font-sans">
                    {isHindi ? indicator.hi : isEnglish ? indicator.en : indicator.hg}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </section>
  );
}
