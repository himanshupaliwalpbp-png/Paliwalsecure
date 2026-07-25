import dynamic from 'next/dynamic';
import { SafeRender } from '@/components/SafeRender';

/* ═══════════════════════════════════════════════════════════════════════════
   Homepage — Paliwal Secure AI
   "Insurance Intelligence for Modern India"
   
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
   11. RatingLeadForm (lazy)
   12. KnowledgeHub (lazy)
   13. FutureAI / ProtectionScorePreview (lazy)
   14. HomeFAQSection (lazy)
   15. HomeCTASection (lazy)
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Eager: Above-fold (visible on first paint) ──────────────────────────────
import HeroAdvisor from '@/components/home/HeroAdvisor';

// ── Lazy: Below-fold ────────────────────────────────────────────────────────
const InsurerLogoMarquee = dynamic(() => import('@/components/home/InsurerLogoMarquee'), {
  loading: () => <div className="min-h-[80px]" />,
});
const TrustStrip = dynamic(() => import('@/components/home/TrustStrip'), {
  loading: () => <div className="min-h-[60px]" />,
});
const StackingImageSections = dynamic(() => import('@/components/home/StackingImageSections'), {
  loading: () => <div className="min-h-[100vh]" />,
});
const HealthFeaturedBanner = dynamic(() => import('@/components/home/HealthFeaturedBanner'), {
  loading: () => <div className="min-h-[300px]" />,
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
// TestimonialsSection removed per user request
const RatingLeadForm = dynamic(() => import('@/components/RatingLeadForm'), {
  loading: () => <div className="min-h-[600px]" />,
});

// 5-Star Customer Reviews Section — shows approved reviews + rating submission form
const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'), {
  loading: () => <div className="min-h-[500px]" />,
});
const KnowledgeHub = dynamic(() => import('@/components/home/KnowledgeHub'), {
  loading: () => <div className="min-h-[300px]" />,
});
const FutureAI = dynamic(() => import('@/components/home/FutureAI'), {
  loading: () => <div className="min-h-[400px]" />,
});
const HomeFAQSection = dynamic(() => import('@/components/home/HomeFAQSection'), {
  loading: () => <div className="min-h-[300px]" />,
});
const HomeCTASection = dynamic(() => import('@/components/home/HomeCTASection'), {
  loading: () => <div className="min-h-[200px]" />,
});

export default function Home() {
  return (
    <main className="flex-1">
      {/* 1. Hero with Quick Adviser form panel */}
      <SafeRender name="HeroAdvisor" fallback={
        <section className="min-h-[90vh] flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-4xl sm:text-5xl font-bold font-display">
              Insurance <span className="gradient-text-blue-emerald">Intelligence</span> for Modern India
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-body">
              Get a personalised plan from 51+ insurers in 30 seconds — no spam, no pushy agents, IRDAI-registered.
            </p>
          </div>
        </section>
      }>
        <HeroAdvisor />
      </SafeRender>

      {/* 2. Insurer logo marquee */}
      <SafeRender name="InsurerLogoMarquee">
        <InsurerLogoMarquee />
      </SafeRender>

      {/* 3. Trust signals / Stats */}
      <SafeRender name="TrustStrip">
        <TrustStrip />
      </SafeRender>

      {/* 3.5. Health Insurance Featured Banner */}
      <SafeRender name="HealthFeaturedBanner">
        <HealthFeaturedBanner />
      </SafeRender>

      {/* 4. Stacking full-screen insurance images — scroll to reveal each */}
      <SafeRender name="StackingImageSections">
        <StackingImageSections />
      </SafeRender>

      {/* 5. InsureGPT AI Chat Section */}
      <SafeRender name="InsureGPTSection">
        <InsureGPTSection />
      </SafeRender>

      {/* 6. Insurance Beast Quiz */}
      <SafeRender name="InsuranceBeastQuiz">
        <InsuranceBeastQuiz />
      </SafeRender>

      {/* 7. How the Quick Adviser works / Features */}
      <SafeRender name="HowAIWorks">
        <HowAIWorks />
      </SafeRender>

      {/* 8. Comparison: us vs competitors */}
      <SafeRender name="ComparisonMatrix">
        <ComparisonMatrix />
      </SafeRender>

      {/* 9. Claims journey */}
      <SafeRender name="ClaimsTimeline">
        <ClaimsTimeline />
      </SafeRender>

      {/* 10. Trusted Advisors / Testimonials — REMOVED */}

      {/* 10.5. 5-Star Customer Reviews — NEW: shows approved reviews + rating form */}
      <SafeRender name="ReviewsSection">
        <ReviewsSection />
      </SafeRender>

      {/* 11. 5-Star Review + Lead Capture Form */}
      <SafeRender name="RatingLeadForm">
        <RatingLeadForm />
      </SafeRender>

      {/* 12. Knowledge hub */}
      <SafeRender name="KnowledgeHub">
        <KnowledgeHub />
      </SafeRender>

      {/* 13. Future AI / Protection Score Preview — dark section */}
      <SafeRender name="FutureAI">
        <FutureAI />
      </SafeRender>

      {/* 14. FAQ Section — new */}
      <SafeRender name="HomeFAQSection">
        <HomeFAQSection />
      </SafeRender>

      {/* 15. Final CTA Section — new */}
      <SafeRender name="HomeCTASection">
        <HomeCTASection />
      </SafeRender>
    </main>
  );
}
