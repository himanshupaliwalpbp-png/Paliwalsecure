'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { HomeForm, type HomeFormData } from '@/components/compare/home/HomeForm';
import { HomeResults, type HomeDetailsResult } from '@/components/compare/home/HomeResults';
import { calculateHomeQuote } from '@/lib/compare/compare-engine';
import type { HomeDetails, HomeCoverType, HomeContentsCoverType } from '@/lib/compare/compare-engine';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';

/* ────────────────────────────────────────────────────────────────────────────
   Home Compare Client — Full i18n + ShinyButton + Design
   ──────────────────────────────────────────────────────────────────────────── */

type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  hero: {
    badge: { en: "Best Rates 2026", hi: "सर्वोत्तम दरें 2026", hinglish: "Best Rates 2026" },
    title1: { en: "Home Insurance", hi: "होम इंश्योरेंस", hinglish: "Home Insurance" },
    title2: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    description: {
      en: "Compare home insurance premiums from 8 IRDAI-registered insurers. Structure + Contents coverage with earthquake, flood & burglary protection.",
      hi: "8 IRDAI-पंजीकृत बीमाकर्ताओं से होम इंश्योरेंस प्रीमियम की तुलना करें। स्ट्रक्चर + कंटेंट्स कवरेज, भूकंप, बाढ़ और चोरी सुरक्षा के साथ।",
      hinglish: "8 IRDAI-registered insurers se home insurance premium compare karo. Structure + Contents coverage with earthquake, flood & burglary protection."
    },
    stat1Value: { en: "8", hi: "8", hinglish: "8" },
    stat1Label: { en: "Insurers", hi: "बीमाकर्ता", hinglish: "Insurers" },
    stat2Value: { en: "2", hi: "2", hinglish: "2" },
    stat2Label: { en: "Cover Types", hi: "कवर प्रकार", hinglish: "Cover Types" },
    stat3Value: { en: "18%", hi: "18%", hinglish: "18%" },
    stat3Label: { en: "GST", hi: "GST", hinglish: "GST" },
  },
  header: {
    title: { en: "🏠 Home Insurance Compare", hi: "🏠 होम इंश्योरेंस तुलना", hinglish: "🏠 Home Insurance Compare" },
    subtitle: { en: "Home Insurance Compare — Best Rates 2026 | PaliwalSecure", hi: "होम इंश्योरेंस तुलना — सर्वोत्तम दरें 2026 | PaliwalSecure", hinglish: "Home Insurance Compare — Best Rates 2026 | PaliwalSecure" },
    back: { en: "Back", hi: "वापस", hinglish: "Back" },
    newComparison: { en: "New Comparison", hi: "नई तुलना", hinglish: "New Comparison" },
  },
  breadcrumb: {
    home: { en: "Home", hi: "होम", hinglish: "Home" },
    compare: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    current: { en: "Home Insurance", hi: "होम इंश्योरेंस", hinglish: "Home Insurance" },
  },
  footer: {
    disclaimer: {
      en: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312",
      hi: "पालीवल सिक्योर (IRDAI POSP: IP429834) • एजेंट: हिमांशु पालीवल • फ़ोन: +91 9257877312",
      hinglish: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312"
    },
    note: {
      en: "Home insurance rates follow TAC fire tariff guidelines. 18% GST applicable. Zone loading may apply for seismic/flood-prone areas. Actual premiums may vary.",
      hi: "होम इंश्योरेंस दरें TAC फ़ायर टैरिफ़ दिशानिर्देशों का पालन करती हैं। 18% GST लागू। भूकंप/बाढ़-प्रवण क्षेत्रों के लिए ज़ोन लोडिंग लागू हो सकती है। वास्तविक प्रीमियम भिन्न हो सकते हैं।",
      hinglish: "Home insurance rates TAC fire tariff guidelines follow karti hain. 18% GST applicable. Seismic/flood-prone areas ke liye zone loading lag sakta hai. Actual premiums alag ho sakte hain."
    },
  },
};

// ---------------------------------------------------------------------------
// Home Insurers for comparison
// ---------------------------------------------------------------------------
const HOME_INSURERS = [
  'HDFC_ERGO',
  'ICICI_LOMBARD',
  'BAJAJ_ALLIANZ',
  'TATA_AIG',
  'RELIANCE',
  'GO_DIGIT',
  'NEW_INDIA',
  'SBI_GENERAL',
];

// ---------------------------------------------------------------------------
// Map cover type to engine types
// ---------------------------------------------------------------------------
function getEngineCoverTypes(
  coverType: string,
  earthquakeCover: boolean,
  burglaryCover: boolean
): { structureCover: HomeCoverType; contentsCover: HomeContentsCoverType } {
  return {
    structureCover: earthquakeCover ? 'WITH_EARTHQUAKE' : 'STANDARD',
    contentsCover: burglaryCover ? 'WITH_BURGLARY' : 'STANDARD',
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function HomeCompareClient() {
  const { language } = useLanguage();
  const tr = useCallback((obj: Tr) => obj[language as keyof Tr] || obj.en, [language]);

  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [homeDetails, setHomeDetails] = useState<HomeDetailsResult | null>(null);

  const handleCompare = useCallback(async (data: HomeFormData) => {
    setLoading(true);
    setShowResults(false);

    try {
      const response = await fetch('/api/compare/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setQuotes(result.quotes);
        setHomeDetails({
          coverType: data.coverType,
          propertyType: data.propertyType,
          structureSI: data.structureSI,
          contentsSI: data.contentsSI,
          state: data.state,
          city: data.city,
          earthquakeCover: data.earthquakeCover,
          burglaryCover: data.burglaryCover,
        });
        setShowResults(true);
        setLoading(false);
        return;
      }
    } catch {
      console.warn('API call failed, using client-side calculation');
    }

    // Client-side fallback
    try {
      const { structureCover, contentsCover } = getEngineCoverTypes(
        data.coverType,
        data.earthquakeCover,
        data.burglaryCover
      );

      const homeDetailsForCalc: HomeDetails = {
        structureSI: data.structureSI,
        contentsSI: data.contentsSI,
        structureCover,
        contentsCover,
        state: data.state,
        city: data.city,
        isRented: false,
      };

      const clientQuotes = HOME_INSURERS.map((insurerId) => {
        const quote = calculateHomeQuote(homeDetailsForCalc, insurerId);
        const insurerRecord = INSURER_MASTER[insurerId];

        return {
          insurerId,
          insurerName: insurerRecord?.shortName ?? insurerId,
          ...quote,
          structureSI: data.structureSI,
          contentsSI: data.contentsSI,
        };
      });

      clientQuotes.sort((a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity));

      if (clientQuotes.length > 0) {
        (clientQuotes[0] as Record<string, unknown>).isRecommended = true;
      }

      setQuotes(clientQuotes);
      setHomeDetails({
        coverType: data.coverType,
        propertyType: data.propertyType,
        structureSI: data.structureSI,
        contentsSI: data.contentsSI,
        state: data.state,
        city: data.city,
        earthquakeCover: data.earthquakeCover,
        burglaryCover: data.burglaryCover,
      });
      setShowResults(true);
    } catch (error) {
      console.error('Client-side calculation failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    setShowResults(false);
    setQuotes([]);
    setHomeDetails(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/10 dark:via-background dark:to-background">
      {/* Hero Section (when not showing results) */}
      {!showResults && (
        <section className="relative overflow-hidden pt-8 sm:pt-12 pb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/40 to-slate-900" />
          <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(110deg,transparent_30%,rgba(16,185,129,0.08)_50%,transparent_70%)] bg-[length:200%_100%]" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-500">{tr(pageText.hero.badge)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              <span className="gradient-text">{tr(pageText.hero.title2)}</span>{' '}
              <span className="gradient-text-amber">{tr(pageText.hero.title1)}</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-6">
              {tr(pageText.hero.description)}
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {[
                { value: tr(pageText.hero.stat1Value), label: tr(pageText.hero.stat1Label) },
                { value: tr(pageText.hero.stat2Value), label: tr(pageText.hero.stat2Label) },
                { value: tr(pageText.hero.stat3Value), label: tr(pageText.hero.stat3Label) },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg sm:text-xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
      )}

      {/* Sticky Header (when showing results) */}
      {showResults && (
        <header className="border-b bg-white/80 dark:bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {tr(pageText.header.back)}
                </button>
                <div>
                  <h1 className="text-lg font-bold">{tr(pageText.header.title)}</h1>
                  <p className="text-[10px] text-muted-foreground hidden sm:block">{tr(pageText.header.subtitle)}</p>
                </div>
              </div>
              <ShinyButton
                variant="secondary"
                onClick={handleReset}
                className="rounded-xl px-4 py-2 text-xs gap-1"
              >
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {tr(pageText.header.newComparison)}
                </span>
              </ShinyButton>
            </div>
          </div>
        </header>
      )}

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <nav className="text-[10px] text-muted-foreground flex items-center gap-1" aria-label="Breadcrumb">
          <a href="/" className="hover:text-foreground transition-colors">{tr(pageText.breadcrumb.home)}</a>
          <span>/</span>
          <a href="/compare" className="hover:text-foreground transition-colors">{tr(pageText.breadcrumb.compare)}</a>
          <span>/</span>
          <span className="text-foreground font-medium">{tr(pageText.breadcrumb.current)}</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-6 flex-1">
        <div
          key={showResults ? 'results' : 'form'}
          className="animate-fade-in"
        >
          {!showResults ? (
            <div className="max-w-2xl mx-auto">
              <HomeForm onCompare={handleCompare} loading={loading} />
            </div>
          ) : (
            homeDetails && (
              <HomeResults
                quotes={quotes}
                homeDetails={homeDetails}
              />
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <p className="text-[10px] text-muted-foreground text-center">
            {tr(pageText.footer.disclaimer)}
            <br />
            {tr(pageText.footer.note)}
          </p>
        </div>
      </footer>
    </div>
  );
}
