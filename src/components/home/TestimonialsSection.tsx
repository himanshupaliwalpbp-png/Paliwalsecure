'use client';

import { useState, useEffect, useRef } from 'react';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import { useLanguage } from '@/lib/i18n';
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from '@/components/ui/animated-cards-stack';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Quote } from 'lucide-react';

/* ── PaliwalSecure Testimonials Data — Bilingual EN/HI/HG ──────────────── */
const TESTIMONIALS = [
  {
    id: 'rajesh-health',
    name: { en: 'Rajesh Sharma', hi: 'राजेश शर्मा', hg: 'Rajesh Sharma' },
    profession: { en: 'Business Owner', hi: 'व्यवसायी', hg: 'Business Owner' },
    city: { en: 'Jaipur', hi: 'जयपुर', hg: 'Jaipur' },
    rating: 5,
    description: {
      en: 'Paliwal ji ne meri health insurance mein ₹15,000 bachaye. Unka AI recommendation ekdum sahi tha!',
      hi: 'पालीवाल जी ने मेरी हेल्थ इंश्योरेंस में ₹15,000 बचाए। उनका AI सुझाव एकदम सही था!',
      hg: 'Paliwal ji ne meri health insurance mein ₹15,000 bachaye. Unka AI recommendation ekdum sahi tha!',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    policy: 'Health Insurance',
  },
  {
    id: 'priya-car',
    name: { en: 'Priya Patel', hi: 'प्रिया पटेल', hg: 'Priya Patel' },
    profession: { en: 'Teacher', hi: 'शिक्षिका', hg: 'Teacher' },
    city: { en: 'Kota', hi: 'कोटा', hg: 'Kota' },
    rating: 5,
    description: {
      en: 'Car insurance claim mein itni aasani se madad mili. WhatsApp pe hi sab ho gaya!',
      hi: 'कार इंश्योरेंस क्लेम में इतनी आसानी से मदद मिली। WhatsApp पर ही सब हो गया!',
      hg: 'Car insurance claim mein itni aasani se madad mili. WhatsApp pe hi sab ho gaya!',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    policy: 'Car Insurance',
  },
  {
    id: 'amit-term',
    name: { en: 'Amit Kumar', hi: 'अमित कुमार', hg: 'Amit Kumar' },
    profession: { en: 'Software Engineer', hi: 'सॉफ्टवेयर इंजीनियर', hg: 'Software Engineer' },
    city: { en: 'Delhi', hi: 'दिल्ली', hg: 'Delhi' },
    rating: 5,
    description: {
      en: 'Term insurance ke liye Paliwal Secure se better koi nahi. Transparent aur reliable.',
      hi: 'टर्म इंश्योरेंस के लिए पालीवाल सेक्योर से बेहतर कोई नहीं। पारदर्शी और विश्वसनीय।',
      hg: 'Term insurance ke liye Paliwal Secure se better koi nahi. Transparent aur reliable.',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    policy: 'Term Insurance',
  },
  {
    id: 'sunita-family',
    name: { en: 'Sunita Meena', hi: 'सुनीता मीणा', hg: 'Sunita Meena' },
    profession: { en: 'Government Employee', hi: 'सरकारी कर्मचारी', hg: 'Government Employee' },
    city: { en: 'Jaipur', hi: 'जयपुर', hg: 'Jaipur' },
    rating: 5,
    description: {
      en: 'Family floater health insurance ka comparison itna easy tha. 10 minute mein best plan mil gaya!',
      hi: 'फैमिली फ्लोटर हेल्थ इंश्योरेंस का कम्पेरिज़न इतना आसान था। 10 मिनट में बेस्ट प्लान मिल गया!',
      hg: 'Family floater health insurance ka comparison itna easy tha. 10 minute mein best plan mil gaya!',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    policy: 'Family Health',
  },
  {
    id: 'vikram-bike',
    name: { en: 'Vikram Singh', hi: 'विक्रम सिंह', hg: 'Vikram Singh' },
    profession: { en: 'Student', hi: 'छात्र', hg: 'Student' },
    city: { en: 'Kota', hi: 'कोटा', hg: 'Kota' },
    rating: 4.5,
    description: {
      en: 'Bike insurance renewal kabhi itni simple nahi thi. Paliwal ji ke AI ne best rate dhoondh liya!',
      hi: 'बाइक इंश्योरेंस रिन्यूअल कभी इतनी सिंपल नहीं थी। पालीवाल जी के AI ने बेस्ट रेट ढूंढ लिया!',
      hg: 'Bike insurance renewal kabhi itni simple nahi thi. Paliwal ji ke AI ne best rate dhoondh liya!',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    policy: 'Bike Insurance',
  },
];

/* ── Helper ────────────────────────────────────────────────────────────── */
function tr(data: { en: string; hi: string; hg: string }, isHindi: boolean, isEnglish: boolean) {
  return isHindi ? data.hi : isEnglish ? data.en : data.hg;
}

/* ── Main Component ────────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const { resolvedTheme } = useSafeTheme();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  // Wait for mount to avoid hydration mismatch with next-themes
  const [mounted, setMounted] = useState(false);
  const mountRef = useRef(false);
  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;
      // Defer state update to avoid synchronous setState in effect
      requestAnimationFrame(() => setMounted(true));
    }
  }, []);
  // Hydration-safe: default to dark, only treat as light when explicitly 'light'
  const isLight = mounted && resolvedTheme === 'light';

  const badge = isHindi ? 'विश्वसनीय समीक्षाएँ' : 'Trusted Reviews';
  const heading = isHindi ? 'असली परिवार, असली बचत' : isEnglish ? 'Real families, real savings' : 'Asli parivaar, asli bachat';
  const subtitle = isHindi
    ? 'हज़ारों परिवारों ने Paliwal Secure पर भरोसा किया'
    : isEnglish
    ? 'Thousands of families trust Paliwal Secure for their insurance needs'
    : 'Hazaaron parivaron ne Paliwal Secure par bharosa kiya';
  const verified = isHindi ? 'IRDAI सत्यापित' : 'IRDAI Verified';

  /* ── Theme-aware styles ─────────────────────────────────────────────── */
  const sectionBg = 'bg-background text-foreground';

  const cardVariant = isLight ? 'light' : 'dark';

  const starsColor = 'text-primary';

  const quoteColor = 'text-muted-foreground';

  const nameColor = undefined;

  const avatarBorder = '!size-12 border border-border/60 shadow-sm';

  const subtitleColor = 'text-muted-foreground';

  const policyClass = 'text-[10px] font-mono text-primary/80 uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/[0.07] border border-primary/[0.10]';

  const professionColor = 'text-muted-foreground';

  const shieldColor = 'text-[var(--trust)]';
  const shieldTextColor = 'text-[var(--trust)]';

  return (
    <section
      id="testimonials"
      dir="ltr"
      className={`relative w-full px-4 sm:px-8 py-28 md:py-36 ${sectionBg}`}
      aria-label="Customer testimonials"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          {/* Badge — premium pill */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 bg-primary/[0.07] border border-primary/[0.12] text-primary"
          >
            <Quote className="w-3 h-3" />
            {badge}
          </div>

          {/* Heading */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {heading
              .split(' ')
              .map((word: string, i: number, arr: string[]) =>
                i === arr.length - 1 ? (
                  <span key={i} className="italic text-primary">
                    {' '}{word}
                  </span>
                ) : (
                  <span key={i}>{i > 0 ? ' ' : ''}{word}</span>
                )
              )}
          </h2>

          {/* Subtitle */}
          <p className={`mx-auto mt-4 max-w-md text-sm sm:text-base leading-relaxed ${subtitleColor}`}>
            {subtitle}
          </p>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/60 backdrop-blur-sm border border-border/40">
              <Shield className={`w-3.5 h-3.5 ${shieldColor}`} />
              <span className={`text-[11px] font-semibold ${shieldTextColor}`}>
                {verified}
              </span>
            </div>
          </div>
        </div>

        {/* Animated Scrolling Cards Stack */}
        <ContainerScroll className="container h-[180vh]">
          <div className="sticky left-0 top-0 h-svh w-full flex items-center justify-center py-4">
            <CardsContainer className="mx-auto h-[400px] w-[320px] sm:h-[440px] sm:w-[360px] lg:h-[460px] lg:w-[400px]">
              {TESTIMONIALS.map((testimonial, index) => (
                <CardTransformed
                  arrayLength={TESTIMONIALS.length}
                  key={testimonial.id}
                  variant={cardVariant}
                  index={index + 2}
                  incrementY={8}
                  incrementZ={8}
                  role="article"
                  aria-labelledby={`card-${testimonial.id}-title`}
                  aria-describedby={`card-${testimonial.id}-content`}
                  className="!border-border/50"
                >
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <ReviewStars
                      className={starsColor}
                      rating={testimonial.rating}
                    />
                    <div className={`mx-auto w-4/5 text-sm sm:text-base leading-relaxed ${quoteColor}`}>
                      <blockquote cite="#" id={`card-${testimonial.id}-content`}>
                        &ldquo;{tr(testimonial.description, isHindi, isEnglish)}&rdquo;
                      </blockquote>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className={avatarBorder}>
                      <AvatarImage
                        src={testimonial.avatarUrl}
                        alt={`Portrait of ${tr(testimonial.name, isHindi, isEnglish)}`}
                      />
                      <AvatarFallback>
                        {tr(testimonial.name, isHindi, isEnglish)
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <span
                        id={`card-${testimonial.id}-title`}
                        className="block text-base font-semibold tracking-tight sm:text-lg text-foreground"
                      >
                        {tr(testimonial.name, isHindi, isEnglish)}
                      </span>
                      <span className={`block text-xs ${professionColor}`}>
                        {tr(testimonial.profession, isHindi, isEnglish)} · {tr(testimonial.city, isHindi, isEnglish)}
                      </span>
                      <span
                        className={`inline-block mt-1.5 ${policyClass}`}
                      >
                        {testimonial.policy}
                      </span>
                    </div>
                  </div>
                </CardTransformed>
              ))}
            </CardsContainer>
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}
