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
    <section className="py-24 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#10B981]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Icon */}
          <div className="inline-flex p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <Shield className="h-12 w-12 text-[#E8C872]" strokeWidth={2} />
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display">
            {heading} <span className="gradient-luxury">{headingAccent}</span>
          </h2>

          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-body">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const el = document.getElementById('advisor-form');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F172A] hover:bg-white/90 font-semibold rounded-xl shadow-premium-lg transition-all duration-300 font-body"
            >
              <Shield className="h-5 w-5" />
              {cta1Text}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://wa.me/919257877312"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 font-body"
            >
              <MessageCircle className="h-5 w-5" />
              {cta2Text}
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-white/60">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                <span className="font-body">
                  {isHindi ? indicator.hi : isEnglish ? indicator.en : indicator.hg}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
