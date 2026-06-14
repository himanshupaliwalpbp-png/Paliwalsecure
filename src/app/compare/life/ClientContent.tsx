'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { LifeForm, type LifeFormData } from '@/components/compare/life/LifeForm';
import { LifeResults, type LifeDetailsResult } from '@/components/compare/life/LifeResults';
import {
  calculateLifeQuote,
  formatINR,
} from '@/lib/compare/compare-engine';
import type { LifePayTerm, LifeDetails } from '@/lib/compare/compare-engine';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';
import { LIFE_INSURER_DATA, LIMITED_PAY } from '@/lib/compare/life-rates';
import { calculateGST } from '@/lib/compare/gst-rules';

/* ────────────────────────────────────────────────────────────────────────────
   Life Compare Client — Full i18n + ShinyButton + Design
   ──────────────────────────────────────────────────────────────────────────── */

type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  hero: {
    badge: { en: "0% GST + Best CSR", hi: "0% GST + सर्वोत्तम CSR", hinglish: "0% GST + Best CSR" },
    title1: { en: "Term Insurance", hi: "टर्म इंश्योरेंस", hinglish: "Term Insurance" },
    title2: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    description: {
      en: "Compare term life insurance quotes from 8 IRDAI-licensed insurers. 0% GST from 22 Sept 2025. Check CSR, solvency ratios, and find the cheapest term plan.",
      hi: "8 IRDAI-लाइसेंस प्राप्त बीमाकर्ताओं से टर्म लाइफ इंश्योरेंस कोट की तुलना करें। 22 सितंबर 2025 से 0% GST। CSR, सॉल्वेंसी रेश्यो चेक करें और सबसे सस्ती टर्म योजना खोजें।",
      hinglish: "8 IRDAI-licensed insurers se term life insurance quotes compare karo. 22 Sept 2025 se 0% GST. CSR, solvency ratios check karo aur sabse sasti term plan dhoondho."
    },
    stat1Value: { en: "8", hi: "8", hinglish: "8" },
    stat1Label: { en: "Insurers", hi: "बीमाकर्ता", hinglish: "Insurers" },
    stat2Value: { en: "0%", hi: "0%", hinglish: "0%" },
    stat2Label: { en: "GST", hi: "GST", hinglish: "GST" },
    stat3Value: { en: "99%", hi: "99%", hinglish: "99%" },
    stat3Label: { en: "Best CSR", hi: "सर्वोत्तम CSR", hinglish: "Best CSR" },
  },
  header: {
    title: { en: "🛡️ Term Insurance Compare", hi: "🛡️ टर्म इंश्योरेंस तुलना", hinglish: "🛡️ Term Insurance Compare" },
    subtitle: { en: "Term Insurance Compare — 0% GST + Best CSR | PaliwalSecure", hi: "टर्म इंश्योरेंस तुलना — 0% GST + सर्वोत्तम CSR | PaliwalSecure", hinglish: "Term Insurance Compare — 0% GST + Best CSR | PaliwalSecure" },
    back: { en: "Back", hi: "वापस", hinglish: "Back" },
    newComparison: { en: "New Comparison", hi: "नई तुलना", hinglish: "New Comparison" },
  },
  breadcrumb: {
    home: { en: "Home", hi: "होम", hinglish: "Home" },
    compare: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    current: { en: "Term Insurance", hi: "टर्म इंश्योरेंस", hinglish: "Term Insurance" },
  },
  footer: {
    disclaimer: {
      en: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312",
      hi: "पालीवल सिक्योर (IRDAI POSP: IP429834) • एजेंट: हिमांशु पालीवल • फ़ोन: +91 9257877312",
      hinglish: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312"
    },
    note: {
      en: "Term insurance premiums are based on IRDAI-mandated mortality tables and insurer filings. GST removed w.e.f. 22 Sept 2025. Actual premiums may vary based on insurer underwriting and medical evaluation.",
      hi: "टर्म इंश्योरेंस प्रीमियम IRDAI-अनिवार्य मॉर्टैलिटी टेबल और बीमाकर्ता दाखिलों पर आधारित हैं। GST हटाया गया 22 सितंबर 2025 से। वास्तविक प्रीमियम बीमाकर्ता अंडरराइटिंग और चिकित्सा मूल्यांकन के आधार पर भिन्न हो सकते हैं।",
      hinglish: "Term insurance premiums IRDAI-mandated mortality tables aur insurer filings pe based hain. GST removed 22 Sept 2025 se. Actual premiums insurer underwriting aur medical evaluation pe depend karke alag ho sakte hain."
    },
  },
};

// ---------------------------------------------------------------------------
// Life Insurers for comparison
// ---------------------------------------------------------------------------
const LIFE_INSURERS = [
  'HDFC_LIFE',
  'ICICI_PRU',
  'SBI_LIFE',
  'MAX_LIFE',
  'TATA_AIA',
  'LIC',
  'BAJAJ_LIFE',
  'KOTAK',
];

// ---------------------------------------------------------------------------
// Extended pay term mapping
// ---------------------------------------------------------------------------
const PAY_TERM_MAP: Record<string, LifePayTerm> = {
  regular: 'regular',
  pay12: 'pay12',
  pay15: 'pay12',
  single: 'single',
};

const PAY15_FACTOR = 1.90;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function LifeCompareClient() {
  const { language } = useLanguage();
  const tr = useCallback((obj: Tr) => obj[language as keyof Tr] || obj.en, [language]);

  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lifeDetails, setLifeDetails] = useState<LifeDetailsResult | null>(null);

  const handleCompare = useCallback(async (data: LifeFormData) => {
    setLoading(true);
    setShowResults(false);

    try {
      const response = await fetch('/api/compare/life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setQuotes(result.quotes);
        setLifeDetails({
          gender: data.gender,
          age: data.age,
          isSmoker: data.isSmoker,
          sumAssured: data.sumAssured,
          policyTerm: data.policyTerm,
          payMode: data.payMode,
          isROP: data.isROP,
          annualIncome: data.annualIncome,
          currentLifeCover: data.currentLifeCover,
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
      const isPay15 = data.payMode === 'pay15';
      const mappedPayTerm: LifePayTerm = PAY_TERM_MAP[data.payMode] ?? 'regular';

      const lifeDetailsForCalc: LifeDetails = {
        age: data.age,
        sumAssured: data.sumAssured,
        gender: data.gender,
        isSmoker: data.isSmoker,
        payTerm: mappedPayTerm,
        isROP: data.isROP,
        isGroup: false,
      };

      const clientQuotes = LIFE_INSURERS.map((insurerId) => {
        const quote = calculateLifeQuote(lifeDetailsForCalc, insurerId);
        const insurerRecord = INSURER_MASTER[insurerId];
        const insurerData = LIFE_INSURER_DATA[insurerId];

        let adjustedTotal = quote.totalPremium;
        let adjustedBase = quote.basePremium;

        if (isPay15) {
          const pay12Factor = LIMITED_PAY['pay12'] ?? 2.30;
          const baseBeforeLimitedPay = adjustedBase / pay12Factor;
          adjustedBase = Math.round(baseBeforeLimitedPay * PAY15_FACTOR);
          const gstAmount = calculateGST(adjustedBase, 'life', false);
          adjustedTotal = adjustedBase + gstAmount;

          quote.breakdown['Limited_Pay_Factor'] = Math.round(adjustedBase - baseBeforeLimitedPay);
          quote.breakdown['Base_Premium_Final'] = adjustedBase;
          quote.breakdown['GST'] = gstAmount;
        }

        return {
          insurerId,
          insurerName: insurerRecord?.shortName ?? insurerId,
          planName: insurerData?.planName ?? '',
          csr: insurerData?.csr ?? 0,
          solvencyRatio: insurerData?.solvencyRatio ?? 0,
          uniqueFeature: insurerData?.uniqueFeature ?? '',
          appRating: insurerData?.appRating ?? 0,
          ...quote,
          basePremium: adjustedBase,
          totalPremium: adjustedTotal,
          sumAssured: data.sumAssured,
        };
      });

      clientQuotes.sort((a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity));

      if (clientQuotes.length > 0) {
        (clientQuotes[0] as Record<string, unknown>).isRecommended = true;
      }

      setQuotes(clientQuotes);
      setLifeDetails({
        gender: data.gender,
        age: data.age,
        isSmoker: data.isSmoker,
        sumAssured: data.sumAssured,
        policyTerm: data.policyTerm,
        payMode: data.payMode,
        isROP: data.isROP,
        annualIncome: data.annualIncome,
        currentLifeCover: data.currentLifeCover,
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
    setLifeDetails(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-50/50 via-white to-white dark:from-violet-950/10 dark:via-background dark:to-background">
      {/* Hero Section (when not showing results) */}
      {!showResults && (
        <section className="relative overflow-hidden pt-8 sm:pt-12 pb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900" />
          <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(110deg,transparent_30%,rgba(139,92,246,0.08)_50%,transparent_70%)] bg-[length:200%_100%]" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-medium text-violet-500">{tr(pageText.hero.badge)}</span>
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
              <LifeForm onCompare={handleCompare} loading={loading} />
            </div>
          ) : (
            lifeDetails && (
              <LifeResults
                quotes={quotes}
                lifeDetails={lifeDetails}
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
