'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';

// ── Insurer Data ──────────────────────────────────────────────────────────
interface Insurer {
  name: string;
  rating: number;
}

const insurersRow1: Insurer[] = [
  { name: 'HDFC ERGO', rating: 4.5 },
  { name: 'Star Health', rating: 4.4 },
  { name: 'Care Health', rating: 4.6 },
  { name: 'Niva Bupa', rating: 4.3 },
  { name: 'ICICI Lombard', rating: 4.5 },
  { name: 'TATA AIG', rating: 4.4 },
  { name: 'Bajaj Allianz', rating: 4.6 },
  { name: 'Acko', rating: 4.3 },
  { name: 'HDFC Life', rating: 4.7 },
  { name: 'Max Life', rating: 4.5 },
];

const insurersRow2: Insurer[] = [
  { name: 'SBI Life', rating: 4.6 },
  { name: 'LIC', rating: 4.8 },
  { name: 'ICICI Prudential', rating: 4.7 },
  { name: 'Kotak Life', rating: 4.5 },
  { name: 'Tata AIA', rating: 4.4 },
  { name: 'Bajaj Allianz Life', rating: 4.5 },
  { name: 'Digit Insurance', rating: 4.3 },
  { name: 'Go Digit', rating: 4.4 },
  { name: 'Magma HDI', rating: 4.3 },
  { name: 'SBI General', rating: 4.5 },
];

// ── Insurer Pill Component ────────────────────────────────────────────────
function InsurerPill({ insurer }: { insurer: Insurer }) {
  return (
    <div className="group relative flex-shrink-0 mx-2">
      {/* Gradient border wrapper */}
      <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-[#071B3B] via-[#F4B400] to-[#2563EB] opacity-30 group-hover:opacity-70 transition-opacity duration-300" />
      <div className="relative flex items-center gap-2 bg-white dark:bg-slate-800/80 rounded-full px-4 py-2.5 border border-slate-100 dark:border-slate-700/50 shadow-sm group-hover:shadow-md group-hover:shadow-[#F4B400]/10 transition-all duration-300">
        <ShieldCheck className="w-3.5 h-3.5 text-[#071B3B] dark:text-[#F4B400] flex-shrink-0" />
        <span className="text-sm font-semibold text-[#071B3B] dark:text-white whitespace-nowrap">
          {insurer.name}
        </span>
        <span className="text-[10px] font-medium text-[#F4B400] dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full whitespace-nowrap">
          ★ {insurer.rating}
        </span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function PartnerLogos() {
  // Duplicate insurers for seamless loop
  const row1Duplicated = [...insurersRow1, ...insurersRow1];
  const row2Duplicated = [...insurersRow2, ...insurersRow2];
  const { t } = useLanguage();

  return (
    <section
      id="partners"
      dir="ltr"
      className="relative py-14 sm:py-18 lg:py-20 overflow-hidden bg-muted/30"
      aria-label="Insurance partner companies"
    >
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#071B3B]/10 dark:via-[#F4B400]/15 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#071B3B]/10 dark:via-[#F4B400]/15 to-transparent" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-[#F4B400]/[0.03] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-[#071B3B]/[0.03] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ──────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-200 dark:bg-[#F4B400]/15 dark:text-[#F4B400] dark:border-[#F4B400]/30 px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full badge-shimmer">
            🏢 {t('partners.badge')}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading text-[#071B3B] dark:text-white">
            {t('partners.heading')}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-muted-foreground dark:text-white/60 font-medium">
            {t('partners.description')}
          </p>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground/70 dark:text-white/40 italic">
            {t('partners.descriptionHi')}
          </p>
        </div>

        {/* ── Marquee Rows ────────────────────────────────────────────── */}
        <div className="space-y-4 mb-10">
          {/* Row 1 — scrolls left */}
          <div className="relative group/row1">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div className="flex items-center animate-marquee-left hover:[animation-play-state:paused]">
                {row1Duplicated.map((insurer, index) => (
                  <InsurerPill key={`r1-${insurer.name}-${index}`} insurer={insurer} />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 — scrolls right (opposite direction) */}
          <div className="relative group/row2">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div className="flex items-center animate-marquee-right hover:[animation-play-state:paused]">
                {row2Duplicated.map((insurer, index) => (
                  <InsurerPill key={`r2-${insurer.name}-${index}`} insurer={insurer} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Hover hint ──────────────────────────────────────────────── */}
        <p className="text-center text-muted-foreground/60 dark:text-white/55 text-xs mb-8">
          Hover to pause • रुकने के लिए होवर करें • Hover karke rok sakte hain
        </p>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="text-center">
          <Link href="/compare">
            <Button
              size="lg"
              className="cta-glow text-base font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
            >
              {t('partners.ctA')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
