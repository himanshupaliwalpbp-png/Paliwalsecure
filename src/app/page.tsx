import dynamic from 'next/dynamic';
import { SafeRender } from '@/components/SafeRender';

/* ═══════════════════════════════════════════════════════════════════════════
   Homepage — Paliwal Secure AI
   "Insurance, decoded by AI. Backed by humans."
   
   Sections:
   1. HeroAdvisor (eager — above fold)
   2. InsurerLogoMarquee (lazy)
   3. TrustStrip (lazy)
   4. CategoryCards (lazy)
   5. InsureGPT AI Section (lazy)
   6. Insurance Quiz (lazy)
   7. HowAIWorks (lazy)
   8. ComparisonMatrix (lazy)
   9. ClaimsTimeline (lazy)
   10. TestimonialsSection (lazy)
   11. RatingLeadForm — 5-star review + lead capture (lazy)
   12. KnowledgeHub (lazy)
   13. FutureAI (lazy)
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Eager: Above-fold (visible on first paint) ──────────────────────────────
import HeroAdvisor from '@/components/home/HeroAdvisor';

// ── Lazy: Below-fold (loaded when about to scroll into view) ────────────────
const InsurerLogoMarquee = dynamic(() => import('@/components/home/InsurerLogoMarquee'), {
  loading: () => <div className="min-h-[80px]" />,
});
const TrustStrip = dynamic(() => import('@/components/home/TrustStrip'), {
  loading: () => <div className="min-h-[60px]" />,
});
const CategoryCards = dynamic(() => import('@/components/home/CategoryCards'), {
  loading: () => <div className="min-h-[400px]" />,
});
const InsureGPTSection = dynamic(() => import('@/components/InsureGPTSection'), {
  loading: () => <div className="min-h-[400px]" />,
});
const InsuranceBeastQuiz = dynamic(() => import('@/components/InsuranceBeastQuiz'), {
  loading: () => <div className="min-h-[400px]" />,
});
const HowAIWorks = dynamic(() => import('@/components/home/HowAIWorks'), {
  loading: () => <div className="min-h-[300px]" />,
});
const ComparisonMatrix = dynamic(() => import('@/components/home/ComparisonMatrix'), {
  loading: () => <div className="min-h-[300px]" />,
});
const ClaimsTimeline = dynamic(() => import('@/components/home/ClaimsTimeline'), {
  loading: () => <div className="min-h-[300px]" />,
});
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), {
  loading: () => <div className="min-h-[300px]" />,
});
const RatingLeadForm = dynamic(() => import('@/components/RatingLeadForm'), {
  loading: () => <div className="min-h-[600px]" />,
});
const KnowledgeHub = dynamic(() => import('@/components/home/KnowledgeHub'), {
  loading: () => <div className="min-h-[300px]" />,
});
const FutureAI = dynamic(() => import('@/components/home/FutureAI'), {
  loading: () => <div className="min-h-[300px]" />,
});

export default function Home() {
  return (
    <main className="flex-1">
      {/* 1. Hero with Quick Adviser form panel — CRITICAL: wrapped in SafeRender */}
      <SafeRender name="HeroAdvisor" fallback={
        <section className="min-h-[90vh] flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text-hero" style={{ fontFamily: 'var(--font-heading), Instrument Serif, serif' }}>
              Insurance, decoded by AI. Backed by humans.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Get a personalised plan from 51+ insurers in 30 seconds — no spam, no pushy agents, IRDAI-registered.
            </p>
            <a
              href="https://wa.me/919257877312"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] font-semibold text-base hover:shadow-[0_0_20px_rgba(201,138,28,0.3)] transition-shadow"
            >
              WhatsApp Consult
            </a>
          </div>
        </section>
      }>
        <HeroAdvisor />
      </SafeRender>

      {/* 2. Insurer logo marquee */}
      <SafeRender name="InsurerLogoMarquee">
        <InsurerLogoMarquee />
      </SafeRender>

      {/* 3. Trust signals strip */}
      <SafeRender name="TrustStrip">
        <TrustStrip />
      </SafeRender>

      {/* 4. Insurance category cards */}
      <SafeRender name="CategoryCards">
        <CategoryCards />
      </SafeRender>

      {/* 5. InsureGPT AI Chat Section — Real AI Insurance Advisor */}
      <SafeRender name="InsureGPTSection">
        <InsureGPTSection />
      </SafeRender>

      {/* 6. Insurance Beast Quiz — 155+ Hinglish Questions */}
      <SafeRender name="InsuranceBeastQuiz">
        <InsuranceBeastQuiz />
      </SafeRender>

      {/* 7. How the Quick Adviser works — 3 steps */}
      <SafeRender name="HowAIWorks">
        <HowAIWorks />
      </SafeRender>

      {/* 8. Comparison: us vs competitors */}
      <SafeRender name="ComparisonMatrix">
        <ComparisonMatrix />
      </SafeRender>

      {/* 9. Claims journey — 5 steps */}
      <SafeRender name="ClaimsTimeline">
        <ClaimsTimeline />
      </SafeRender>

      {/* 10. Real testimonials */}
      <SafeRender name="TestimonialsSection">
        <TestimonialsSection />
      </SafeRender>

      {/* 11. 5-Star Review + Lead Capture Form */}
      <SafeRender name="RatingLeadForm">
        <RatingLeadForm />
      </SafeRender>

      {/* 12. Knowledge hub / SEO content teaser */}
      <SafeRender name="KnowledgeHub">
        <KnowledgeHub />
      </SafeRender>

      {/* 13. Future AI features — coming soon */}
      <SafeRender name="FutureAI">
        <FutureAI />
      </SafeRender>
    </main>
  );
}
