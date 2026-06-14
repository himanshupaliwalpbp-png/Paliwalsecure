'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { MotorForm, type MotorFormData, getZone } from '@/components/compare/motor/MotorForm';
import { MotorResults } from '@/components/compare/motor/MotorResults';
import {
  calculateMotorQuote,
  formatINR,
} from '@/lib/compare/compare-engine';
import type { MotorVehicleType, MotorCCBand, MotorAddOn } from '@/lib/compare/compare-engine';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';

/* ────────────────────────────────────────────────────────────────────────────
   Motor Compare Client — Full i18n + ShinyButton + Design
   ──────────────────────────────────────────────────────────────────────────── */

type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  hero: {
    badge: { en: "IRDAI Mandated Rates", hi: "IRDAI अनिवार्य दरें", hinglish: "IRDAI Mandated Rates" },
    title1: { en: "Motor Insurance", hi: "मोटर बीमा", hinglish: "Motor Insurance" },
    title2: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    subtitle: { en: "Car & Bike Insurance Compare — IRDAI Rates 2026 | PaliwalSecure", hi: "कार और बाइक बीमा तुलना — IRDAI दरें 2026 | PaliwalSecure", hinglish: "Car & Bike Insurance Compare — IRDAI Rates 2026 | PaliwalSecure" },
    description: {
      en: "Compare car, bike & EV insurance premiums from 8 IRDAI-registered insurers. Get accurate rates with NCB & IDV calculators built-in.",
      hi: "8 IRDAI-पंजीकृत बीमाकर्ताओं से कार, बाइक और EV बीमा प्रीमियम की तुलना करें। NCB और IDV कैलकुलेटर के साथ सटीक दरें प्राप्त करें।",
      hinglish: "8 IRDAI-registered insurers se car, bike & EV insurance premium compare karo. NCB & IDV calculators ke saath accurate rates pao."
    },
    stat1Value: { en: "8", hi: "8", hinglish: "8" },
    stat1Label: { en: "Insurers", hi: "बीमाकर्ता", hinglish: "Insurers" },
    stat2Value: { en: "3", hi: "3", hinglish: "3" },
    stat2Label: { en: "Vehicle Types", hi: "वाहन प्रकार", hinglish: "Vehicle Types" },
    stat3Value: { en: "₹0", hi: "₹0", hinglish: "₹0" },
    stat3Label: { en: "Hidden Charges", hi: "छुपे शुल्क", hinglish: "Hidden Charges" },
  },
  header: {
    title: { en: "🚘 Motor Insurance Compare", hi: "🚘 मोटर बीमा तुलना", hinglish: "🚘 Motor Insurance Compare" },
    subtitle: { en: "Car & Bike Insurance Compare — IRDAI Rates 2026 | PaliwalSecure", hi: "कार और बाइक बीमा तुलना — IRDAI दरें 2026 | PaliwalSecure", hinglish: "Car & Bike Insurance Compare — IRDAI Rates 2026 | PaliwalSecure" },
    back: { en: "Back", hi: "वापस", hinglish: "Back" },
    newComparison: { en: "New Comparison", hi: "नई तुलना", hinglish: "New Comparison" },
  },
  breadcrumb: {
    home: { en: "Home", hi: "होम", hinglish: "Home" },
    compare: { en: "Compare", hi: "तुलना", hinglish: "Compare" },
    current: { en: "Motor Insurance", hi: "मोटर बीमा", hinglish: "Motor Insurance" },
  },
  footer: {
    disclaimer: {
      en: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312",
      hi: "पालीवल सिक्योर (IRDAI POSP: IP429834) • एजेंट: हिमांशु पालीवल • फ़ोन: +91 9257877312",
      hinglish: "Paliwal Secure (IRDAI POSP: IP429834) • Agent: Himanshu Paliwal • Phone: +91 9257877312"
    },
    note: {
      en: "Motor insurance premiums calculated using IRDAI-mandated Third-Party rates and indicative OD rates. Actual premiums may vary based on insurer underwriting.",
      hi: "मोटर बीमा प्रीमियम IRDAI-अनिवार्य थर्ड-पार्टी दरों और सांकेतिक OD दरों का उपयोग करके गणना किए गए हैं। वास्तविक प्रीमियम बीमाकर्ता अंडरराइटिंग के आधार पर भिन्न हो सकते हैं।",
      hinglish: "Motor insurance premiums IRDAI-mandated Third-Party rates aur indicative OD rates use karke calculate kiye gaye hain. Actual premiums insurer underwriting pe depend karke alag ho sakte hain."
    },
  },
};

// ---------------------------------------------------------------------------
// Motor Insurers
// ---------------------------------------------------------------------------
const MOTOR_INSURERS = [
  'HDFC_ERGO',
  'ACKO',
  'GO_DIGIT',
  'ICICI_LOMBARD',
  'TATA_AIG',
  'BAJAJ_ALLIANZ',
  'NEW_INDIA',
  'RELIANCE',
];

// ---------------------------------------------------------------------------
// CC / kW Band Mapping
// ---------------------------------------------------------------------------
function getCCBand(vehicleCategory: string, exShowroomPrice: number, engineCC: number, powerKW?: number): MotorCCBand {
  if (vehicleCategory === 'EV_CAR') {
    if ((powerKW ?? 0) <= 30 || exShowroomPrice <= 1500000) return 'upto30kW';
    if ((powerKW ?? 0) <= 65 || exShowroomPrice <= 2500000) return '30to65kW';
    return 'above65kW';
  }
  if (vehicleCategory === 'EV_BIKE') {
    if ((powerKW ?? 0) <= 4 || exShowroomPrice <= 100000) return 'upto4kW';
    if ((powerKW ?? 0) <= 25 || exShowroomPrice <= 200000) return '4to25kW';
    return 'above25kW';
  }
  if (vehicleCategory === 'Bike') {
    if (engineCC <= 75) return 'upTo75cc';
    if (engineCC <= 150) return '76to150cc';
    if (engineCC <= 350) return '151to350cc';
    return 'above350cc';
  }
  // Car
  if (engineCC <= 1000) return 'upTo1000cc';
  if (engineCC <= 1500) return '1001to1500cc';
  return 'above1500cc';
}

// ---------------------------------------------------------------------------
// Map form category to engine vehicle type
// ---------------------------------------------------------------------------
function mapVehicleType(category: string): MotorVehicleType {
  const mapping: Record<string, MotorVehicleType> = {
    Car: 'Car',
    Bike: 'Bike',
    EV_CAR: 'EV_CAR',
    EV_BIKE: 'EV_BIKE',
  };
  return mapping[category] ?? 'Car';
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function MotorCompareClient() {
  const { language } = useLanguage();
  const tr = useCallback((obj: Tr) => obj[language as keyof Tr] || obj.en, [language]);

  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState<any>(null);

  const handleCompare = useCallback(async (data: MotorFormData) => {
    setLoading(true);
    setShowResults(false);

    try {
      const response = await fetch('/api/compare/motor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setQuotes(result.quotes);
        setVehicleDetails({
          exShowroomPrice: data.exShowroomPrice,
          registrationYear: data.registrationYear,
          vehicleCategory: data.vehicleCategory,
          makeModel: data.makeModel,
          ncbYears: data.ncbYears,
          fuelType: data.fuelType,
          engineCC: data.engineCC,
          seatingCapacity: data.seatingCapacity,
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
      const vehicleType = mapVehicleType(data.vehicleCategory);
      const ccBand = getCCBand(data.vehicleCategory, data.exShowroomPrice, data.engineCC);
      const currentYear = new Date().getFullYear();
      const ageYears = Math.max(0, currentYear - data.registrationYear);
      const zone = getZone(data.rtoCode);
      const isNew = data.registrationYear === currentYear;
      const isCNG = data.fuelType === 'CNG';

      const vehicleDetailsForCalc = {
        vehicleType,
        ccBand,
        exShowroomPrice: data.exShowroomPrice,
        ageYears,
        zone,
        isNew,
        ncbYears: Math.min(data.ncbYears, 5),
        isCNG,
      };

      const selectedAddOns = data.addons as MotorAddOn[];
      const clientQuotes: any[] = MOTOR_INSURERS.map((insurerId) => {
        const quote = calculateMotorQuote(vehicleDetailsForCalc, insurerId, selectedAddOns);
        const insurerRecord = INSURER_MASTER[insurerId];
        return {
          insurerId,
          insurerName: insurerRecord?.shortName ?? insurerId,
          exShowroomPrice: data.exShowroomPrice,
          ...quote,
          zone,
          vehicleType,
          ccBand,
          ageYears,
        };
      });

      clientQuotes.sort((a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity));

      if (clientQuotes.length > 0) {
        clientQuotes[0].isRecommended = true;
      }

      setQuotes(clientQuotes);
      setVehicleDetails({
        exShowroomPrice: data.exShowroomPrice,
        registrationYear: data.registrationYear,
        vehicleCategory: data.vehicleCategory,
        makeModel: data.makeModel,
        ncbYears: data.ncbYears,
        fuelType: data.fuelType,
        engineCC: data.engineCC,
        seatingCapacity: data.seatingCapacity,
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
    setVehicleDetails(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 via-white to-white dark:from-amber-950/10 dark:via-background dark:to-background">
      {/* Hero Section (when not showing results) */}
      {!showResults && (
        <section className="relative overflow-hidden pt-8 sm:pt-12 pb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-amber-900/40 to-slate-900" />
          <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(110deg,transparent_30%,rgba(201,138,28,0.08)_50%,transparent_70%)] bg-[length:200%_100%]" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">{tr(pageText.hero.badge)}</span>
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
              <MotorForm onCompare={handleCompare} loading={loading} />
            </div>
          ) : (
            vehicleDetails && (
              <MotorResults
                quotes={quotes}
                vehicleDetails={vehicleDetails}
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
