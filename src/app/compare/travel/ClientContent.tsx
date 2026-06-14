'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { TravelForm, type TravelFormData } from '@/components/compare/travel/TravelForm';
import { TravelResults, type TravelDetailsResult } from '@/components/compare/travel/TravelResults';
import {
  calculateTravelQuote,
  formatINR,
} from '@/lib/compare/compare-engine';
import type { TravelDetails, TravellerType } from '@/lib/compare/compare-engine';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';

/* ────────────────────────────────────────────────────────────────────────────
   Travel Compare Client — Full i18n + ShinyButton + Design
   ──────────────────────────────────────────────────────────────────────────── */

type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  hero: {
    badge: { en: "Best Rates 2026", hi: "सर्वोत्तम दरें 2026", hinglish: "Best Rates 2026" },
    title1: { en: "Travel Insurance", hi: "ट्रैवल इंश्योरेंस", hinglish: "Travel Insurance" },
    title2: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    description: {
      en: "Compare travel insurance premiums from 7 IRDAI-registered insurers. Senior-friendly plans, 4 destination zones, and 6 add-on covers for complete protection.",
      hi: "7 IRDAI-पंजीकृत बीमाकर्ताओं से ट्रैवल इंश्योरेंस प्रीमियम की तुलना करें। सीनियर-फ्रेंडली योजनाएँ, 4 गंतव्य क्षेत्र और संपूर्ण सुरक्षा के लिए 6 ऐड-ऑन कवर।",
      hinglish: "7 IRDAI-registered insurers se travel insurance premium compare karo. Senior-friendly plans, 4 destination zones, aur complete protection ke liye 6 add-on covers."
    },
    stat1Value: { en: "7", hi: "7", hinglish: "7" },
    stat1Label: { en: "Insurers", hi: "बीमाकर्ता", hinglish: "Insurers" },
    stat2Value: { en: "4", hi: "4", hinglish: "4" },
    stat2Label: { en: "Destinations", hi: "गंतव्य", hinglish: "Destinations" },
    stat3Value: { en: "6", hi: "6", hinglish: "6" },
    stat3Label: { en: "Add-ons", hi: "ऐड-ऑन", hinglish: "Add-ons" },
  },
  header: {
    title: { en: "✈️ Travel Insurance Compare", hi: "✈️ ट्रैवल इंश्योरेंस तुलना", hinglish: "✈️ Travel Insurance Compare" },
    subtitle: { en: "Travel Insurance Compare — Best Rates 2026 | PaliwalSecure", hi: "ट्रैवल इंश्योरेंस तुलना — सर्वोत्तम दरें 2026 | PaliwalSecure", hinglish: "Travel Insurance Compare — Best Rates 2026 | PaliwalSecure" },
    back: { en: "Back", hi: "वापस", hinglish: "Back" },
    newComparison: { en: "New Comparison", hi: "नई तुलना", hinglish: "New Comparison" },
  },
  breadcrumb: {
    home: { en: "Home", hi: "होम", hinglish: "Home" },
    compare: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    current: { en: "Travel Insurance", hi: "ट्रैवल इंश्योरेंस", hinglish: "Travel Insurance" },
  },
  footer: {
    disclaimer: {
      en: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312",
      hi: "पालीवल सिक्योर (IRDAI POSP: IP429834) • एजेंट: हिमांशु पालीवल • फ़ोन: +91 9257877312",
      hinglish: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312"
    },
    note: {
      en: "Travel insurance premiums are indicative based on IRDAI-licensed insurer filings. 18% GST applicable. Actual premiums may vary based on insurer underwriting and medical evaluation.",
      hi: "ट्रैवल इंश्योरेंस प्रीमियम IRDAI-लाइसेंस प्राप्त बीमाकर्ता दाखिलों पर आधारित सांकेतिक हैं। 18% GST लागू। वास्तविक प्रीमियम बीमाकर्ता अंडरराइटिंग और चिकित्सा मूल्यांकन के आधार पर भिन्न हो सकते हैं।",
      hinglish: "Travel insurance premiums IRDAI-licensed insurer filings pe based indicative hain. 18% GST applicable. Actual premiums insurer underwriting aur medical evaluation pe depend karke alag ho sakte hain."
    },
  },
};

// ---------------------------------------------------------------------------
// Travel Insurers for comparison
// ---------------------------------------------------------------------------
const TRAVEL_INSURERS = [
  'HDFC_ERGO',
  'BAJAJ_ALLIANZ',
  'ICICI_LOMBARD',
  'TATA_AIG',
  'RELIANCE',
  'GO_DIGIT',
  'STAR_HEALTH',
];

// ---------------------------------------------------------------------------
// Senior multiplier
// ---------------------------------------------------------------------------
const SENIOR_MULTIPLIER = 2.8;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function TravelCompareClient() {
  const { language } = useLanguage();
  const tr = useCallback((obj: Tr) => obj[language as keyof Tr] || obj.en, [language]);

  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [travelDetails, setTravelDetails] = useState<TravelDetailsResult | null>(null);

  const handleCompare = useCallback(async (data: TravelFormData) => {
    setLoading(true);
    setShowResults(false);

    try {
      const response = await fetch('/api/compare/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setQuotes(result.quotes);
        setTravelDetails({
          destination: data.destination,
          tripDurationDays: data.tripDurationDays,
          adults: data.adults,
          children: data.children,
          seniors: data.seniors,
          medicalCover: data.medicalCover,
          addons: data.addons,
          departureDate: data.departureDate,
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
      const travellers: Array<{ type: TravellerType; count: number }> = [];
      if (data.adults > 0) travellers.push({ type: 'ADULT', count: data.adults });
      if (data.children > 0) travellers.push({ type: 'CHILD', count: data.children });
      if (data.seniors > 0) {
        travellers.push({ type: 'SENIOR', count: data.seniors });
      }

      const travelDetailsForCalc: TravelDetails = {
        region: data.destination,
        tripDurationDays: data.tripDurationDays,
        travellers,
        selectedAddons: data.addons,
      };

      const clientQuotes = TRAVEL_INSURERS.map((insurerId) => {
        const quote = calculateTravelQuote(travelDetailsForCalc, insurerId);
        const insurerRecord = INSURER_MASTER[insurerId];

        let adjustedBase = quote.basePremium;
        let adjustedAddOn = quote.addOnPremium;

        if (data.seniors > 0) {
          const seniorBaseKey = Object.keys(quote.breakdown).find((k) =>
            k.startsWith('Traveller_SENIOR')
          );
          if (seniorBaseKey) {
            const seniorBase = quote.breakdown[seniorBaseKey];
            const additionalSeniorLoading = Math.round(seniorBase * (SENIOR_MULTIPLIER / 1.6 - 1));
            adjustedBase += additionalSeniorLoading;
            quote.breakdown['Senior_Loading_2.8x'] = additionalSeniorLoading;
            quote.notes.push(`Senior loading (2.8×): +${formatINR(additionalSeniorLoading)}`);
          }
        }

        const premiumBeforeGST = adjustedBase + adjustedAddOn;
        const gstAmount = Math.round(premiumBeforeGST * 0.18);
        const totalPremium = premiumBeforeGST + gstAmount;

        const totalTravellers = data.adults + data.children + data.seniors;

        return {
          insurerId,
          insurerName: insurerRecord?.shortName ?? insurerId,
          ...quote,
          basePremium: adjustedBase,
          addOnPremium: adjustedAddOn,
          gstAmount,
          totalPremium,
          totalTravellers,
          breakdown: {
            ...quote.breakdown,
            Senior_Loading_2_8x: quote.breakdown['Senior_Loading_2.8x'] ?? 0,
            Base_Premium: adjustedBase,
            AddOn_Total: adjustedAddOn,
            GST: gstAmount,
          },
        };
      });

      clientQuotes.sort((a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity));

      if (clientQuotes.length > 0) {
        (clientQuotes[0] as Record<string, unknown>).isRecommended = true;
      }

      setQuotes(clientQuotes);
      setTravelDetails({
        destination: data.destination,
        tripDurationDays: data.tripDurationDays,
        adults: data.adults,
        children: data.children,
        seniors: data.seniors,
        medicalCover: data.medicalCover,
        addons: data.addons,
        departureDate: data.departureDate,
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
    setTravelDetails(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50/50 via-white to-white dark:from-teal-950/10 dark:via-background dark:to-background">
      {/* Hero Section (when not showing results) */}
      {!showResults && (
        <section className="relative overflow-hidden pt-8 sm:pt-12 pb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900/40 to-slate-900" />
          <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(110deg,transparent_30%,rgba(20,184,166,0.08)_50%,transparent_70%)] bg-[length:200%_100%]" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-medium text-teal-500">{tr(pageText.hero.badge)}</span>
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
              <TravelForm onCompare={handleCompare} loading={loading} />
            </div>
          ) : (
            travelDetails && (
              <TravelResults
                quotes={quotes}
                travelDetails={travelDetails}
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
