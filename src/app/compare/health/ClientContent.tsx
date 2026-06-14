'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { HealthForm, type HealthFormData } from '@/components/compare/health/HealthForm';
import { HealthResults, type HealthDetailsResult } from '@/components/compare/health/HealthResults';
import {
  calculateHealthQuote,
  formatINR,
} from '@/lib/compare/compare-engine';
import type { HealthPED, HealthDetails } from '@/lib/compare/compare-engine';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';
import { HEALTH_ADDONS, PED_LOADING } from '@/lib/compare/health-rates';
import { calculateGST } from '@/lib/compare/gst-rules';

/* ────────────────────────────────────────────────────────────────────────────
   Health Compare Client — Full i18n + ShinyButton + Design
   ──────────────────────────────────────────────────────────────────────────── */

type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  hero: {
    badge: { en: "0% GST Savings via POSP", hi: "POSP से 0% GST बचत", hinglish: "0% GST Savings via POSP" },
    title1: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    title2: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    description: {
      en: "Compare health insurance premiums from 7 IRDAI-registered insurers. Save 0% GST via POSP route with PED loading & disease-specific recommendations.",
      hi: "7 IRDAI-पंजीकृत बीमाकर्ताओं से हेल्थ इंश्योरेंस प्रीमियम की तुलना करें। POSP मार्ग से 0% GST बचाएँ, PED लोडिंग और रोग-विशिष्ट सिफ़ारिशों के साथ।",
      hinglish: "7 IRDAI-registered insurers se health insurance premium compare karo. POSP route se 0% GST bachao, PED loading aur disease-specific recommendations ke saath."
    },
    stat1Value: { en: "7", hi: "7", hinglish: "7" },
    stat1Label: { en: "Insurers", hi: "बीमाकर्ता", hinglish: "Insurers" },
    stat2Value: { en: "0%", hi: "0%", hinglish: "0%" },
    stat2Label: { en: "GST Savings", hi: "GST बचत", hinglish: "GST Savings" },
    stat3Value: { en: "6", hi: "6", hinglish: "6" },
    stat3Label: { en: "Add-ons", hi: "ऐड-ऑन", hinglish: "Add-ons" },
  },
  header: {
    title: { en: "🏥 Health Insurance Compare", hi: "🏥 हेल्थ इंश्योरेंस तुलना", hinglish: "🏥 Health Insurance Compare" },
    subtitle: { en: "Health Insurance Compare — 0% GST Save More | PaliwalSecure", hi: "हेल्थ इंश्योरेंस तुलना — 0% GST अधिक बचत | PaliwalSecure", hinglish: "Health Insurance Compare — 0% GST Save More | PaliwalSecure" },
    back: { en: "Back", hi: "वापस", hinglish: "Back" },
    newComparison: { en: "New Comparison", hi: "नई तुलना", hinglish: "New Comparison" },
  },
  breadcrumb: {
    home: { en: "Home", hi: "होम", hinglish: "Home" },
    compare: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    current: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
  },
  footer: {
    disclaimer: {
      en: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312",
      hi: "पालीवल सिक्योर (IRDAI POSP: IP429834) • एजेंट: हिमांशु पालीवल • फ़ोन: +91 9257877312",
      hinglish: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312"
    },
    note: {
      en: "Health insurance premiums are market averages based on IRDAI data. GST removed w.e.f. 22 Sept 2025. Actual premiums may vary based on insurer underwriting and medical evaluation.",
      hi: "हेल्थ इंश्योरेंस प्रीमियम IRDAI डेटा पर आधारित बाज़ार औसत हैं। GST हटाया गया 22 सितंबर 2025 से। वास्तविक प्रीमियम बीमाकर्ता अंडरराइटिंग और चिकित्सा मूल्यांकन के आधार पर भिन्न हो सकते हैं।",
      hinglish: "Health insurance premiums IRDAI data pe based market averages hain. GST removed 22 Sept 2025 se. Actual premiums insurer underwriting aur medical evaluation pe depend karke alag ho sakte hain."
    },
  },
};

// ---------------------------------------------------------------------------
// Health Insurers for comparison
// ---------------------------------------------------------------------------
const HEALTH_INSURERS = [
  'HDFC_ERGO',
  'ACKO',
  'STAR',
  'NIVA_BUPA',
  'CARE',
  'ADITYA_BIRLA',
  'ICICI_LOMBARD',
];

// ---------------------------------------------------------------------------
// PED key mapping (form ID → engine key)
// ---------------------------------------------------------------------------
const PED_KEY_MAP: Record<string, HealthPED> = {
  diabetes: 'diabetes',
  hypertension: 'hypertension',
  heartDisease: 'heartDisease',
  cancer: 'cancer',
  thyroid: 'thyroid',
  asthma: 'asthma',
  none: 'none',
};

// ---------------------------------------------------------------------------
// Add-on premium calculation
// ---------------------------------------------------------------------------
function calculateAddOnPremium(basePremium: number, insurerId: string, selectedAddons: string[]): number {
  const insurerAddons = HEALTH_ADDONS[insurerId] ?? [];
  let addonTotal = 0;

  const addonNameMap: Record<string, string[]> = {
    maternity: ['Maternity'],
    opd: ['OPD'],
    criticalIllness: ['Super Top-Up', 'ACKO Super Top-Up', 'Star Super Surplus', 'ReAssure', 'Care Super Saver', 'Super Restore', 'iShield Super Top-Up'],
    internationalCoverage: ['Global Coverage', 'International'],
    roomRentWaiver: [],
    personalAccident: ['Personal Accident'],
  };

  for (const formAddonId of selectedAddons) {
    const possibleNames = addonNameMap[formAddonId];
    if (!possibleNames) continue;

    const matchingAddon = insurerAddons.find((a) =>
      possibleNames.some((name) => a.name.toLowerCase().includes(name.toLowerCase()))
    );

    if (matchingAddon) {
      addonTotal += Math.round(basePremium * matchingAddon.premiumPercent);
    } else {
      const defaultRates: Record<string, number> = {
        maternity: 0.20,
        opd: 0.14,
        criticalIllness: 0.15,
        internationalCoverage: 0.25,
        roomRentWaiver: 0.05,
        personalAccident: 0.10,
      };
      addonTotal += Math.round(basePremium * (defaultRates[formAddonId] ?? 0.10));
    }
  }

  return addonTotal;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function HealthCompareClient() {
  const { language } = useLanguage();
  const tr = useCallback((obj: Tr) => obj[language as keyof Tr] || obj.en, [language]);

  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [healthDetails, setHealthDetails] = useState<HealthDetailsResult | null>(null);

  const handleCompare = useCallback(async (data: HealthFormData) => {
    setLoading(true);
    setShowResults(false);

    try {
      const response = await fetch('/api/compare/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setQuotes(result.quotes);
        setHealthDetails({
          age: data.age,
          sumInsured: data.sumInsured,
          city: data.city,
          isFloater: data.policyType === 'familyFloater',
          adults: data.adults,
          children: data.children,
          ped: data.ped,
          addons: data.addons,
          policyType: data.policyType,
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
      const activePED = data.ped.filter((p) => p !== 'none');
      const totalPEDRate = activePED.reduce((sum, p) => {
        const key = PED_KEY_MAP[p];
        return sum + (PED_LOADING[key] ?? 0);
      }, 0);

      const primaryPED: HealthPED = activePED.length > 0
        ? (PED_KEY_MAP[activePED[0]] ?? 'none')
        : 'none';

      const memberCount = data.policyType === 'familyFloater'
        ? data.adults + data.children
        : 1;

      const healthDetailsForCalc: HealthDetails = {
        age: data.age,
        sumInsured: data.sumInsured,
        city: data.city,
        isFloater: data.policyType === 'familyFloater',
        memberCount,
        ped: primaryPED,
        isGroup: false,
      };

      const clientQuotes = HEALTH_INSURERS.map((insurerId) => {
        const quote = calculateHealthQuote(healthDetailsForCalc, insurerId);
        const insurerRecord = INSURER_MASTER[insurerId];

        let adjustedBase = quote.basePremium;
        const additionalPEDRate = totalPEDRate - (PED_LOADING[primaryPED] ?? 0);
        if (additionalPEDRate > 0) {
          const additionalPEDAmount = Math.round(
            (quote.breakdown['Base_Premium_Raw'] ?? 0) * additionalPEDRate
          );
          adjustedBase += additionalPEDAmount;
          quote.breakdown['Additional_PED_Loading'] = additionalPEDAmount;
          quote.notes.push(`Additional PED loading (+${(additionalPEDRate * 100).toFixed(0)}%): +${formatINR(additionalPEDAmount)}`);
        }

        const addonPremium = calculateAddOnPremium(
          quote.breakdown['Base_Premium_Raw'] ?? 0,
          insurerId,
          data.addons
        );
        adjustedBase += addonPremium;
        quote.breakdown['AddOn_Total'] = addonPremium;
        if (addonPremium > 0) {
          quote.notes.push(`Add-ons: +${formatINR(addonPremium)}`);
        }

        const gstAmount = calculateGST(adjustedBase, 'health', false);
        const totalPremium = adjustedBase + gstAmount;

        return {
          insurerId,
          insurerName: insurerRecord?.shortName ?? insurerId,
          ...quote,
          basePremium: adjustedBase,
          gstAmount,
          totalPremium,
          sumInsured: data.sumInsured,
          breakdown: {
            ...quote.breakdown,
            AddOn_Total: addonPremium,
            Base_Premium_Final: adjustedBase,
            GST: gstAmount,
          },
        };
      });

      clientQuotes.sort((a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity));

      if (clientQuotes.length > 0) {
        (clientQuotes[0] as Record<string, unknown>).isRecommended = true;
      }

      setQuotes(clientQuotes);
      setHealthDetails({
        age: data.age,
        sumInsured: data.sumInsured,
        city: data.city,
        isFloater: data.policyType === 'familyFloater',
        adults: data.adults,
        children: data.children,
        ped: data.ped,
        addons: data.addons,
        policyType: data.policyType,
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
    setHealthDetails(null);
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
              <HealthForm onCompare={handleCompare} loading={loading} />
            </div>
          ) : (
            healthDetails && (
              <HealthResults
                quotes={quotes}
                healthDetails={healthDetails}
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
