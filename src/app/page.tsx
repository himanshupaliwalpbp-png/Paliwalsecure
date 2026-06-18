import dynamic from 'next/dynamic';
import { SafeRender } from '@/components/SafeRender';

/* ═══════════════════════════════════════════════════════════════════════════
   Homepage — Paliwal Secure AI
   "Intelligence Platform" v9.0 — Complete Redesign Blueprint
   
   9 sections per blueprint:
   1. IntelHero (eager — above fold)
   2. IntelTrustBar (lazy)
   3. IntelAIPlatform (lazy)
   4. IntelCategories (lazy)
   5. IntelProtectionScore (lazy)
   6. IntelWhyUs (lazy)
   7. IntelTestimonials (lazy)
   8. IntelFAQ (lazy)
   9. IntelFinalCTA (lazy)
   
   This is additive — the legacy homepage components are preserved in
   src/components/home/ for reference and can be restored by switching
   the imports below.
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Eager: Above-fold (visible on first paint) ──────────────────────────────
import IntelHero from '@/components/home/IntelHero';

// ── Lazy: Below-fold ────────────────────────────────────────────────────────
const IntelTrustBar = dynamic(() => import('@/components/home/IntelTrustBar'), {
  loading: () => <div className="min-h-[120px]" />,
});
const IntelAIPlatform = dynamic(() => import('@/components/home/IntelAIPlatform'), {
  loading: () => <div className="min-h-[600px]" />,
});
const IntelCategories = dynamic(() => import('@/components/home/IntelCategories'), {
  loading: () => <div className="min-h-[600px]" />,
});
const IntelProtectionScore = dynamic(
  () => import('@/components/home/IntelProtectionScore'),
  { loading: () => <div className="min-h-[600px]" /> }
);
const IntelWhyUs = dynamic(() => import('@/components/home/IntelWhyUs'), {
  loading: () => <div className="min-h-[400px]" />,
});
const IntelTestimonials = dynamic(() => import('@/components/home/IntelTestimonials'), {
  loading: () => <div className="min-h-[400px]" />,
});
const IntelFAQ = dynamic(() => import('@/components/home/IntelFAQ'), {
  loading: () => <div className="min-h-[400px]" />,
});
const IntelFinalCTA = dynamic(() => import('@/components/home/IntelFinalCTA'), {
  loading: () => <div className="min-h-[400px]" />,
});

export default function Home() {
  return (
    <main className="flex-1 intel-bg-midnight">
      {/* 1. Hero — Intelligence Platform intro with score gauge */}
      <SafeRender name="IntelHero">
        <IntelHero />
      </SafeRender>

      {/* 2. Trust Bar — partner insurer logos */}
      <SafeRender name="IntelTrustBar">
        <IntelTrustBar />
      </SafeRender>

      {/* 3. AI Platform — What we are (the 4 features) */}
      <SafeRender name="IntelAIPlatform">
        <IntelAIPlatform />
      </SafeRender>

      {/* 4. Insurance Categories — 6 categories with AI-Optimized badges */}
      <SafeRender name="IntelCategories">
        <IntelCategories />
      </SafeRender>

      {/* 5. Protection Score — Signature feature, large gauge */}
      <SafeRender name="IntelProtectionScore">
        <IntelProtectionScore />
      </SafeRender>

      {/* 6. Why Choose Us — 3 pillars (Intelligence, Not Commissions) */}
      <SafeRender name="IntelWhyUs">
        <IntelWhyUs />
      </SafeRender>

      {/* 7. Testimonials — Real stories from Indian families */}
      <SafeRender name="IntelTestimonials">
        <IntelTestimonials />
      </SafeRender>

      {/* 8. FAQ — Address objections */}
      <SafeRender name="IntelFAQ">
        <IntelFAQ />
      </SafeRender>

      {/* 9. Final CTA — Closing argument */}
      <SafeRender name="IntelFinalCTA">
        <IntelFinalCTA />
      </SafeRender>
    </main>
  );
}
