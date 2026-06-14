'use client';

import { useState, useEffect, useRef } from 'react';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Star, Shield, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/* ── Advisors Data ──────────────────────────────────────────────── */
const advisors = [
  {
    name: { en: 'Rajesh Paliwal', hi: 'राजेश पालीवाल', hg: 'Rajesh Paliwal' },
    role: { en: 'Founder & Senior Advisor', hi: 'संस्थापक और वरिष्ठ सलाहकार', hg: 'Founder & Senior Advisor' },
    experience: '15+ years',
    specialization: { en: 'Life & Health Insurance', hi: 'जीवन और स्वास्थ्य बीमा', hg: 'Life & Health Insurance' },
    rating: 4.9,
    reviews: 250,
  },
  {
    name: { en: 'Priya Sharma', hi: 'प्रिया शर्मा', hg: 'Priya Sharma' },
    role: { en: 'Senior Consultant', hi: 'वरिष्ठ सलाहकार', hg: 'Senior Consultant' },
    experience: '12+ years',
    specialization: { en: 'Business & Corporate Insurance', hi: 'व्यापार और कॉर्पोरेट बीमा', hg: 'Business & Corporate Insurance' },
    rating: 4.8,
    reviews: 180,
  },
  {
    name: { en: 'Amit Kumar', hi: 'अमित कुमार', hg: 'Amit Kumar' },
    role: { en: 'Vehicle Insurance Expert', hi: 'वाहन बीमा विशेषज्ञ', hg: 'Vehicle Insurance Expert' },
    experience: '8+ years',
    specialization: { en: 'Motor & Travel Insurance', hi: 'मोटर और यात्रा बीमा', hg: 'Motor & Travel Insurance' },
    rating: 4.9,
    reviews: 210,
  },
];

const achievements = [
  { icon: Shield, title: { en: 'IRDA Certified', hi: 'IRDAI प्रमाणित', hg: 'IRDA Certified' }, description: { en: 'All advisors are licensed by Insurance Regulatory Authority', hi: 'सभी सलाहकार बीमा नियामक प्राधिकरण द्वारा लाइसेंस प्राप्त हैं', hg: 'All advisors are licensed by Insurance Regulatory Authority' } },
  { icon: Award, title: { en: 'Industry Recognition', hi: 'उद्योग मान्यता', hg: 'Industry Recognition' }, description: { en: 'Award-winning team with proven track record', hi: 'साबित ट्रैक रिकॉर्ड वाली पुरस्कार विजेता टीम', hg: 'Award-winning team with proven track record' } },
  { icon: CheckCircle2, title: { en: '100% Claim Success', hi: '100% क्लेम सफलता', hg: '100% Claim Success' }, description: { en: 'Perfect claim settlement ratio for our clients', hi: 'हमारे ग्राहकों के लिए परफेक्ट क्लेम सेटलमेंट अनुपात', hg: 'Perfect claim settlement ratio for our clients' } },
];

/* ── Helper ────────────────────────────────────────────────────────── */
function tr(data: { en: string; hi: string; hg: string }, isHindi: boolean, isEnglish: boolean) {
  return isHindi ? data.hi : isEnglish ? data.en : data.hg;
}

/* ── Main Component ────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const { resolvedTheme } = useSafeTheme();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const [mounted, setMounted] = useState(false);
  const mountRef = useRef(false);
  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;
      requestAnimationFrame(() => setMounted(true));
    }
  }, []);

  const badgeText = isHindi ? 'विशेषज्ञ टीम' : isEnglish ? 'Expert Team' : 'Expert Team';
  const heading = isHindi ? 'अपने से मिलें' : isEnglish ? 'Meet Your Trusted' : 'Meet Your Trusted';
  const headingAccent = isHindi ? 'विश्वसनीय सलाहकार' : isEnglish ? 'Advisors' : 'Advisors';
  const subtitle = isHindi
    ? 'प्रमाणित पेशेवरों के साथ काम करें जो आपके परिवार की सुरक्षा को पहले रखते हैं।'
    : isEnglish
      ? 'Work with certified professionals who put your family\'s protection first.'
      : 'Certified professionals ke saath kaam karein jo aapke parivaar ki protection ko pehle rakhte hain.';
  const ctaText = isHindi ? 'मुफ्त परामर्श शेड्यूल करें' : isEnglish ? 'Schedule a Free Consultation' : 'Free Consultation schedule karein';
  const experienceLabel = isHindi ? 'अनुभव' : isEnglish ? 'Experience' : 'Experience';
  const specializationLabel = isHindi ? 'विशेषज्ञता' : isEnglish ? 'Specialization' : 'Specialization';
  const reviewsLabel = isHindi ? 'समीक्षाएँ' : isEnglish ? 'reviews' : 'reviews';

  return (
    <section className="py-24 bg-[#F8FAFC] dark:bg-[#0A1330]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 rounded-full border border-[#E2E8F0] dark:border-white/10 mb-4 shadow-premium">
            <Award className="h-4 w-4 text-[#E8C872]" />
            <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">{badgeText}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#F8F6F0] mb-4 font-display">
            {heading} <span className="gradient-text-blue-emerald">{headingAccent}</span>
          </h2>
          <p className="text-xl text-[#64748B] dark:text-[#A6AEC7] max-w-3xl mx-auto font-body">
            {subtitle}
          </p>
        </motion.div>

        {/* Advisors Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {advisors.map((advisor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-card/60 rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 border border-[#E2E8F0] dark:border-white/10 group"
            >
              <div className="mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#10B981]/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="text-3xl font-bold text-[#0F172A] dark:text-[#F8F6F0] font-display">
                    {tr(advisor.name, isHindi, isEnglish).charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-[#F8F6F0] mb-1 font-display">
                  {tr(advisor.name, isHindi, isEnglish)}
                </h3>
                <p className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">{tr(advisor.role, isHindi, isEnglish)}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] dark:text-[#A6AEC7] font-body">{experienceLabel}</span>
                  <span className="font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">{advisor.experience}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] dark:text-[#A6AEC7] font-body">{specializationLabel}</span>
                  <span className="font-medium text-[#0F172A] dark:text-[#F8F6F0] text-right font-body">
                    {tr(advisor.specialization, isHindi, isEnglish)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#E8C872] text-[#E8C872]" />
                    <span className="font-semibold text-[#0F172A] dark:text-[#F8F6F0] font-body">{advisor.rating}</span>
                    <span className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">
                      ({advisor.reviews} {reviewsLabel})
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-card/60 rounded-xl p-6 border border-[#E2E8F0] dark:border-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#2563EB]/10 to-[#10B981]/10 rounded-xl flex-shrink-0">
                    <Icon className="h-6 w-6 text-[#2563EB]" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0F172A] dark:text-[#F8F6F0] mb-1 font-display">
                      {tr(achievement.title, isHindi, isEnglish)}
                    </h4>
                    <p className="text-sm text-[#64748B] dark:text-[#A6AEC7] font-body">{tr(achievement.description, isHindi, isEnglish)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="gap-2 bg-[#0F172A] dark:bg-[#D4A853] hover:bg-[#1E293B] dark:hover:bg-[#E2C06E] text-white dark:text-[#060E22] shadow-premium-lg font-body"
            asChild
          >
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              {ctaText}
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
