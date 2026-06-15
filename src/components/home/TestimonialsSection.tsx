'use client';

import { useState, useEffect, useRef } from 'react';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import { useLanguage } from '@/lib/i18n';
import { motion, useInView } from 'framer-motion';
import { Star, Shield, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── Advisors Data ──────────────────────────────────────────────── */
const advisors = [
  {
    name: { en: 'Rajesh Paliwal', hi: 'राजेश पालीवाल', hg: 'Rajesh Paliwal' },
    role: { en: 'Founder & Senior Advisor', hi: 'संस्थापक और वरिष्ठ सलाहकार', hg: 'Founder & Senior Advisor' },
    experience: '15+ years',
    specialization: { en: 'Life & Health Insurance', hi: 'जीवन और स्वास्थ्य बीमा', hg: 'Life & Health Insurance' },
    rating: 4.9,
    reviews: 250,
    badge: 'gold' as const,
  },
  {
    name: { en: 'Priya Sharma', hi: 'प्रिया शर्मा', hg: 'Priya Sharma' },
    role: { en: 'Senior Consultant', hi: 'वरिष्ठ सलाहकार', hg: 'Senior Consultant' },
    experience: '12+ years',
    specialization: { en: 'Business & Corporate Insurance', hi: 'व्यापार और कॉर्पोरेट बीमा', hg: 'Business & Corporate Insurance' },
    rating: 4.8,
    reviews: 180,
    badge: 'blue' as const,
  },
  {
    name: { en: 'Amit Kumar', hi: 'अमित कुमार', hg: 'Amit Kumar' },
    role: { en: 'Vehicle Insurance Expert', hi: 'वाहन बीमा विशेषज्ञ', hg: 'Vehicle Insurance Expert' },
    experience: '8+ years',
    specialization: { en: 'Motor & Travel Insurance', hi: 'मोटर और यात्रा बीमा', hg: 'Motor & Travel Insurance' },
    rating: 4.9,
    reviews: 210,
    badge: 'green' as const,
  },
];

const achievements = [
  { icon: Shield, title: { en: 'IRDA Certified', hi: 'IRDAI प्रमाणित', hg: 'IRDA Certified' }, description: { en: 'All advisors are licensed by Insurance Regulatory Authority', hi: 'सभी सलाहकार बीमा नियामक प्राधिकरण द्वारा लाइसेंस प्राप्त हैं', hg: 'All advisors are licensed by Insurance Regulatory Authority' }, badgeVariant: 'blue' as const },
  { icon: Award, title: { en: 'Industry Recognition', hi: 'उद्योग मान्यता', hg: 'Industry Recognition' }, description: { en: 'Award-winning team with proven track record', hi: 'साबित ट्रैक रिकॉर्ड वाली पुरस्कार विजेता टीम', hg: 'Award-winning team with proven track record' }, badgeVariant: 'gold' as const },
  { icon: CheckCircle2, title: { en: '100% Claim Success', hi: '100% क्लेम सफलता', hg: '100% Claim Success' }, description: { en: 'Perfect claim settlement ratio for our clients', hi: 'हमारे ग्राहकों के लिए परफेक्ट क्लेम सेटलमेंट अनुपात', hg: 'Perfect claim settlement ratio for our clients' }, badgeVariant: 'green' as const },
];

/* ── Helper ────────────────────────────────────────────────────────── */
function tr(data: { en: string; hi: string; hg: string }, isHindi: boolean, isEnglish: boolean) {
  return isHindi ? data.hi : isEnglish ? data.en : data.hg;
}

/* ── Star Rating Component ─────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < fullStars
              ? 'fill-[#2563EB] text-[#2563EB]'
              : i === fullStars && hasHalf
                ? 'fill-[#2563EB]/50 text-[#2563EB]'
                : 'fill-transparent text-[#E8E2D6] dark:text-white/20'
          }`}
        />
      ))}
    </div>
  );
}

/* ── Badge variant class map ───────────────────────────────────────── */
const badgeClassMap: Record<string, string> = {
  blue: 'badge-premium-blue',
  green: 'badge-premium-green',
  gold: 'badge-premium-gold',
  slate: 'badge-premium-slate',
};

/* ── Main Component ────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const { resolvedTheme } = useSafeTheme();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const [mounted, setMounted] = useState(false);
  const mountRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

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
    <section ref={sectionRef} className="section-luxury section-luxury-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-16"
        >
          <div className="badge-premium-gold mb-5">
            <Award className="h-3.5 w-3.5" />
            <span className="font-body">{badgeText}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#111111] dark:text-[#F3EADB] mb-4 font-display tracking-tight leading-[1.1]">
            {heading} <span className="gradient-text-blue-emerald">{headingAccent}</span>
          </h2>
          <p className="text-base md:text-lg text-[#374151] dark:text-[#A6AEC7] max-w-2xl mx-auto font-body leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Advisors Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {advisors.map((advisor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.12, ease: [0.22, 1, 0.36, 1] as const }}
              className="premium-card premium-card-featured flex flex-col"
            >
              {/* Avatar + Name */}
              <div className="mb-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB]/15 to-[#10B981]/15 dark:from-[#2563EB]/20 dark:to-[#10B981]/20 flex items-center justify-center ring-2 ring-white dark:ring-[#1E293B] shadow-sm">
                    <span className="text-xl font-bold text-[#111111] dark:text-[#F3EADB] font-display">
                      {tr(advisor.name, isHindi, isEnglish).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111111] dark:text-[#F3EADB] font-display tracking-tight">
                      {tr(advisor.name, isHindi, isEnglish)}
                    </h3>
                    <p className="text-sm text-[#374151] dark:text-[#A6AEC7] font-body">{tr(advisor.role, isHindi, isEnglish)}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-5 flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#374151] dark:text-[#A6AEC7] font-body">{experienceLabel}</span>
                  <span className="font-semibold text-[#111111] dark:text-[#F3EADB] font-body">{advisor.experience}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#374151] dark:text-[#A6AEC7] font-body">{specializationLabel}</span>
                  <span className="font-medium text-[#111111] dark:text-[#F3EADB] text-right text-xs font-body">
                    {tr(advisor.specialization, isHindi, isEnglish)}
                  </span>
                </div>
              </div>

              {/* Rating + Badge */}
              <div className="pt-4 border-t border-[#E8E2D6] dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarRating rating={advisor.rating} />
                  <span className="font-semibold text-[#111111] dark:text-[#F3EADB] text-sm font-body">{advisor.rating}</span>
                  <span className="text-xs text-[#374151] dark:text-[#A6AEC7] font-body">
                    ({advisor.reviews} {reviewsLabel})
                  </span>
                </div>
                <span className={badgeClassMap[advisor.badge]}>
                  {advisor.badge === 'gold' ? '★ Top Rated' : advisor.badge === 'blue' ? '◆ Verified' : '✓ Expert'}
                </span>
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
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="premium-card premium-card-compact"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl flex-shrink-0 bg-[#EFF6FF] dark:bg-[#2563EB]/10">
                    <Icon className="h-5 w-5 text-[#2563EB] dark:text-[#60A5FA]" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#111111] dark:text-[#F3EADB] font-display text-sm mb-1">
                      {tr(achievement.title, isHindi, isEnglish)}
                    </h4>
                    <span className={`${badgeClassMap[achievement.badgeVariant]} mb-2`}>
                      <Icon className="w-3 h-3" />
                      Verified
                    </span>
                    <p className="text-sm text-[#374151] dark:text-[#A6AEC7] font-body leading-relaxed">{tr(achievement.description, isHindi, isEnglish)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-premium-lg font-body"
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
