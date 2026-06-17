'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator, Heart, Car, UserCheck, IndianRupee, ShieldCheck,
  TrendingUp, Clock, CheckCircle2, Sparkles, ArrowRight, Info,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';

// ── Lazy-load each calculator (only loads when tab is active) ────────────────
const HealthPremiumCalculator = dynamic(
  () => import('@/components/calculators/HealthPremiumCalculator'),
  {
    ssr: false,
    loading: () => <CalculatorLoading />,
  }
);
const MotorPremiumCalculator = dynamic(
  () => import('@/components/calculators/MotorPremiumCalculator'),
  {
    ssr: false,
    loading: () => <CalculatorLoading />,
  }
);
const TermLifeCalculator = dynamic(
  () => import('@/components/calculators/TermLifeCalculator'),
  {
    ssr: false,
    loading: () => <CalculatorLoading />,
  }
);
const TaxSavingsCalculator = dynamic(
  () => import('@/components/calculators/TaxSavingsCalculator'),
  {
    ssr: false,
    loading: () => <CalculatorLoading />,
  }
);
const ClaimSettlementPredictor = dynamic(
  () => import('@/components/calculators/ClaimSettlementPredictor'),
  {
    ssr: false,
    loading: () => <CalculatorLoading />,
  }
);

function CalculatorLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#B8482C]/20 border-t-[#B8482C] rounded-full" />
    </div>
  );
}

// ── Calculator tab config ────────────────────────────────────────────────────
type CalcTab = 'health' | 'motor' | 'term' | 'tax' | 'claim';

interface TabConfig {
  id: CalcTab;
  label: { en: string; hi: string; hinglish: string };
  icon: typeof Heart;
  color: string;
  description: { en: string; hi: string; hinglish: string };
  features: { en: string; hi: string; hinglish: string }[];
}

const TABS: TabConfig[] = [
  {
    id: 'health',
    label: { en: 'Health', hi: 'स्वास्थ्य', hinglish: 'Health' },
    icon: Heart,
    color: 'emerald',
    description: {
      en: 'Calculate health insurance premium based on age, family size, PED, city tier, and smoker status. Includes Section 80D tax savings.',
      hi: 'आयु, परिवार के आकार, पूर्व-मौजूद बीमारी, शहर, और धूम्रपान की स्थिति के आधार पर स्वास्थ्य बीमा प्रीमियम की गणना करें। Section 80D कर बचत शामिल।',
      hinglish: 'Age, family size, PED, city tier, aur smoker status ke hisaab se health insurance premium calculate karein. Section 80D tax savings bhi milega.',
    },
    features: [
      { en: 'Real IRDAI premium rates', hi: 'वास्तविक IRDAI दरें', hinglish: 'Real IRDAI rates' },
      { en: 'PED loading (Diabetes, BP, Heart)', hi: 'PED लोडिंग (मधुमेह, बीपी, हृदय)', hinglish: 'PED loading (Diabetes, BP, Heart)' },
      { en: 'Section 80D tax calculation', hi: 'Section 80D कर गणना', hinglish: 'Section 80D tax calculation' },
    ],
  },
  {
    id: 'motor',
    label: { en: 'Motor', hi: 'मोटर', hinglish: 'Motor' },
    icon: Car,
    color: 'sienna',
    description: {
      en: 'Calculate car/bike insurance premium. Includes IDV, NCB discount, zero depreciation add-on, and IRDAI third-party rates.',
      hi: 'कार/बाइक बीमा प्रीमियम की गणना करें। IDV, NCB छूट, जीरो डेप्रिसिएशन, और IRDAI थर्ड-पार्टी दरें शामिल।',
      hinglish: 'Car/bike insurance premium calculate karein. IDV, NCB discount, zero dep add-on, aur IRDAI third-party rates included.',
    },
    features: [
      { en: 'IRDAI third-party rates', hi: 'IRDAI थर्ड-पार्टी दरें', hinglish: 'IRDAI third-party rates' },
      { en: 'NCB discount calculator', hi: 'NCB छूट कैलकुलेटर', hinglish: 'NCB discount calculator' },
      { en: 'Zero dep + add-on pricing', hi: 'जीरो डेप + ऐड-ऑन मूल्य', hinglish: 'Zero dep + add-on pricing' },
    ],
  },
  {
    id: 'term',
    label: { en: 'Term Life', hi: 'टर्म जीवन', hinglish: 'Term Life' },
    icon: UserCheck,
    color: 'emerald',
    description: {
      en: 'Calculate term insurance premium for ₹1 Crore+ cover. Age, smoker status, sum assured, and policy term based calculations.',
      hi: '₹1 करोड़+ कवर के लिए टर्म बीमा प्रीमियम की गणना करें। आयु, धूम्रपान, बीमा राशि, और नीति अवधि आधारित।',
      hinglish: '₹1 Crore+ cover ke liye term insurance premium calculate karein. Age, smoker status, sum assured, aur policy term based.',
    },
    features: [
      { en: '₹1 Cr+ cover estimates', hi: '₹1 करोड़+ कवर अनुमान', hinglish: '₹1 Cr+ cover estimates' },
      { en: 'Smoker vs non-smoker rates', hi: 'धूम्रपान vs गैर-धूम्रपान दरें', hinglish: 'Smoker vs non-smoker rates' },
      { en: 'Rider recommendations', hi: 'राइडर सिफारिशें', hinglish: 'Rider recommendations' },
    ],
  },
  {
    id: 'tax',
    label: { en: 'Tax (80D)', hi: 'कर (80D)', hinglish: 'Tax (80D)' },
    icon: IndianRupee,
    color: 'gold',
    description: {
      en: 'Calculate tax savings under Section 80D (health insurance) and 80C (life insurance). Max ₹75,000 + ₹1,50,000 deduction.',
      hi: 'Section 80D (स्वास्थ्य बीमा) और 80C (जीवन बीमा) के तहत कर बचत की गणना करें। अधिकतम ₹75,000 + ₹1,50,000 की कटौती।',
      hinglish: 'Section 80D (health insurance) aur 80C (life insurance) ke under tax savings calculate karein. Max ₹75,000 + ₹1,50,000 deduction.',
    },
    features: [
      { en: 'Section 80D + 80C combined', hi: 'Section 80D + 80C संयुक्त', hinglish: 'Section 80D + 80C combined' },
      { en: 'Senior citizen parents bonus', hi: 'वरिष्ठ नागरिक अभिभावक बोनस', hinglish: 'Senior citizen parents bonus' },
      { en: 'All tax brackets supported', hi: 'सभी कर ब्रैकेट समर्थित', hinglish: 'All tax brackets supported' },
    ],
  },
  {
    id: 'claim',
    label: { en: 'Claim', hi: 'क्लेम', hinglish: 'Claim' },
    icon: ShieldCheck,
    color: 'sienna',
    description: {
      en: 'Predict claim settlement probability based on insurer CSR, policy type, claim amount, and documentation quality.',
      hi: 'बीमाकर्ता CSR, नीति प्रकार, क्लेम राशि, और दस्तावेज़ गुणवत्ता के आधार पर क्लेम निपटान संभावना की भविष्यवाणी करें।',
      hinglish: 'Insurer CSR, policy type, claim amount, aur documentation quality ke basis pe claim settlement probability predict karein.',
    },
    features: [
      { en: 'ML-based probability', hi: 'ML-आधारित संभावना', hinglish: 'ML-based probability' },
      { en: 'Insurer-wise CSR data', hi: 'बीमाकर्ता-वार CSR डेटा', hinglish: 'Insurer-wise CSR data' },
      { en: 'Documentation checklist', hi: 'दस्तावेज़ीकरण चेकलिस्ट', hinglish: 'Documentation checklist' },
    ],
  },
];

// ── Color helpers per tab ────────────────────────────────────────────────────
const colorClasses: Record<string, { active: string; icon: string; tint: string }> = {
  emerald: {
    active: 'bg-[#2D6A4F] text-white shadow-lg shadow-[#2D6A4F]/30',
    icon: 'text-[#2D6A4F] dark:text-[#6EE7B7]',
    tint: 'bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)] text-[#2D6A4F] dark:text-[#6EE7B7] border-[rgba(45,106,79,0.20)]',
  },
  sienna: {
    active: 'bg-[#B8482C] text-white shadow-lg shadow-[#B8482C]/30',
    icon: 'text-[#B8482C] dark:text-[#F0A88B]',
    tint: 'bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.18)] text-[#B8482C] dark:text-[#F0A88B] border-[rgba(184,72,44,0.20)]',
  },
  gold: {
    active: 'bg-[#B8860B] text-white shadow-lg shadow-[#B8860B]/30',
    icon: 'text-[#B8860B] dark:text-[#E8C872]',
    tint: 'bg-[#FBF3DD] dark:bg-[rgba(184,134,11,0.18)] text-[#8B6508] dark:text-[#E8C872] border-[rgba(184,134,11,0.22)]',
  },
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function CalculatorHubClient() {
  const [activeTab, setActiveTab] = useState<CalcTab>('health');
  const { language } = useLanguage();

  const isHindi = language === 'hi';
  const isEnglish = language === 'en';
  const tr = (text: { en: string; hi: string; hinglish: string }) =>
    isHindi ? text.hi : isEnglish ? text.en : text.hinglish;

  const activeConfig = TABS.find((t) => t.id === activeTab)!;

  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116]">
      {/* ════════════════════════════════════════════════════════════════════
          HERO SECTION
         ════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 section-glow" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.15)] border border-[rgba(184,72,44,0.20)] text-[#B8482C] dark:text-[#F0A88B] text-xs font-semibold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isHindi ? 'मुफ़्त • IRDAI-सत्यापित • रियल-टाइम' : isEnglish ? 'Free • IRDAI-Verified • Real-Time' : 'Free • IRDAI-Verified • Real-Time'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0E1116] dark:text-[#FAF7F2] mb-6"
          >
            {isHindi ? 'बीमा कैलकुलेटर' : isEnglish ? 'Insurance Calculators' : 'Insurance Calculators'}
            <span className="block mt-2 text-[#B8482C] dark:text-[#E8C872] text-3xl sm:text-4xl lg:text-5xl">
              {isHindi ? 'भारत 2026 के लिए' : isEnglish ? 'For India 2026' : 'India 2026 Ke Liye'}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#4A4F57] dark:text-[#A8B0C2] max-w-3xl mx-auto mb-8"
          >
            {isHindi
              ? 'वास्तविक IRDAI दरों के साथ सटीक प्रीमियम गणना। स्वास्थ्य, मोटर, जीवन, कर बचत, और क्लेम भविष्यवाणी — सब एक जगह।'
              : isEnglish
                ? 'Accurate premium calculations with real IRDAI rates. Health, Motor, Life, Tax Savings, and Claim Prediction — all in one place.'
                : 'Real IRDAI rates ke saath accurate premium calculation. Health, Motor, Life, Tax Bachat, aur Claim Prediction — sab ek jagah.'}
          </motion.p>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#4A4F57] dark:text-[#A8B0C2]"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] dark:text-[#6EE7B7]" />
              {isHindi ? 'IRDAI POSP IP429834' : isEnglish ? 'IRDAI POSP IP429834' : 'IRDAI POSP IP429834'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] dark:text-[#6EE7B7]" />
              {isHindi ? '500+ परिवार सेवा' : isEnglish ? '500+ Families Served' : '500+ Parivaar Seva'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] dark:text-[#6EE7B7]" />
              {isHindi ? '100% मुफ़्त' : isEnglish ? '100% Free' : '100% Free'}
            </span>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TAB NAVIGATION
         ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 p-2 bg-white dark:bg-[#161A24] rounded-2xl border border-[rgba(15,19,32,0.08)] dark:border-[rgba(232,200,114,0.15)] shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const colors = colorClasses[tab.color];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2
                    px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold
                    transition-all duration-300
                    ${isActive
                      ? colors.active
                      : 'text-[#4A4F57] dark:text-[#A8B0C2] hover:bg-[#FAF7F2] dark:hover:bg-[#1A1F27]'
                    }
                  `}
                  aria-pressed={isActive}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                  <span className="text-center leading-tight">{tr(tab.label)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          ACTIVE CALCULATOR
         ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Active calculator description */}
          <motion.div
            key={`desc-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-2 flex items-center justify-center gap-2">
              <activeConfig.icon className={`w-6 h-6 ${colorClasses[activeConfig.color].icon}`} />
              {tr(TABS.find((t) => t.id === activeTab)!.label)}
              {' '}
              {isHindi ? 'कैलकुलेटर' : isEnglish ? 'Calculator' : 'Calculator'}
            </h2>
            <p className="text-sm sm:text-base text-[#4A4F57] dark:text-[#A8B0C2] max-w-2xl mx-auto">
              {tr(activeConfig.description)}
            </p>
          </motion.div>

          {/* Calculator component (lazy-loaded) */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-4 sm:p-6 lg:p-8"
          >
            <Suspense fallback={<CalculatorLoading />}>
              {activeTab === 'health' && <HealthPremiumCalculator />}
              {activeTab === 'motor' && <MotorPremiumCalculator />}
              {activeTab === 'term' && <TermLifeCalculator />}
              {activeTab === 'tax' && <TaxSavingsCalculator />}
              {activeTab === 'claim' && <ClaimSettlementPredictor />}
            </Suspense>
          </motion.div>

          {/* Features row */}
          <motion.div
            key={`features-${activeTab}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {activeConfig.features.map((feat, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${colorClasses[activeConfig.color].tint}`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{tr(feat)}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          WHY USE OUR CALCULATORS
         ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-[#161A24] border-y border-[rgba(15,19,32,0.06)] dark:border-[rgba(232,200,114,0.10)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0E1116] dark:text-[#FAF7F2] mb-10">
            {isHindi ? 'हमारे कैलकुलेटर का उपयोग क्यों करें?' : isEnglish ? 'Why Use Our Calculators?' : 'Humare Calculators Kyu Use Karein?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: { en: 'Real IRDAI Data', hi: 'वास्तविक IRDAI डेटा', hinglish: 'Real IRDAI Data' },
                desc: {
                  en: 'Premiums calculated using IRDAI Annual Report 2025-26 rates, not random estimates.',
                  hi: 'IRDAI वार्षिक रिपोर्ट 2025-26 दरों का उपयोग, यादृच्छिक अनुमान नहीं।',
                  hinglish: 'IRDAI Annual Report 2025-26 rates use kiye, random estimates nahi.',
                },
                color: 'emerald',
              },
              {
                icon: Clock,
                title: { en: 'Instant Results', hi: 'तत्काल परिणाम', hinglish: 'Turant Results' },
                desc: {
                  en: 'Real-time calculation in your browser — no waiting, no signup, no spam calls.',
                  hi: 'अपने ब्राउज़र में रियल-टाइम गणना — कोई प्रतीक्षा नहीं, कोई साइनअप नहीं।',
                  hinglish: 'Browser me real-time calculation — no waiting, no signup, no spam calls.',
                },
                color: 'sienna',
              },
              {
                icon: ShieldCheck,
                title: { en: 'IRDAI Compliant', hi: 'IRDAI अनुपालित', hinglish: 'IRDAI Compliant' },
                desc: {
                  en: 'Every calculation follows IRDAI guidelines. No misleading claims, transparent math.',
                  hi: 'हर गणना IRDAI दिशानिर्देशों का पालन करती है। पारदर्शी गणित।',
                  hinglish: 'Har calculation IRDAI guidelines follow karta hai. Transparent math.',
                },
                color: 'gold',
              },
              {
                icon: Info,
                title: { en: 'Hinglish Support', hi: 'हिंग्लिश समर्थन', hinglish: 'Hinglish Support' },
                desc: {
                  en: 'Use in Hinglish, Hindi, or English. Insurance terms explained in simple language.',
                  hi: 'हिंग्लिश, हिंदी, या अंग्रेज़ी में उपयोग करें। बीमा शर्तें सरल भाषा में।',
                  hinglish: 'Hinglish, Hindi, ya English me use karein. Insurance terms simple bhasha me.',
                },
                color: 'emerald',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const colors = colorClasses[item.color];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${colors.tint} border`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-2">
                    {tr(item.title)}
                  </h3>
                  <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2] leading-relaxed">
                    {tr(item.desc)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CTA SECTION
         ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 sm:p-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-4">
              {isHindi ? 'अभी अपना बीमा सुरक्षित करें' : isEnglish ? 'Secure Your Insurance Now' : 'Abhi Apna Insurance Secure Karein'}
            </h2>
            <p className="text-sm sm:text-base text-[#4A4F57] dark:text-[#A8B0C2] mb-6 max-w-2xl mx-auto">
              {isHindi
                ? 'अपनी गणना प्राप्त करें? IRDAI-प्रमाणित सलाहकार से निःशुल्क परामर्श प्राप्त करें। WhatsApp या कॉल द्वारा।'
                : isEnglish
                  ? 'Got your calculation? Get free consultation from IRDAI-certified advisor. Via WhatsApp or call.'
                  : 'Apni calculation mil gayi? IRDAI-certified advisor se free consultation paayein. WhatsApp ya call ke through.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20used%20the%20calculator%20on%20paliwalsecure.in%20and%20need%20help%20choosing%20the%20right%20plan"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#2D6A4F] hover:bg-[#235541] text-white">
                  <span className="flex items-center gap-2">
                    {isHindi ? 'WhatsApp पर बात करें' : isEnglish ? 'Chat on WhatsApp' : 'WhatsApp pe Baat Karein'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </a>
              <Link href="/insuregpt">
                <Button variant="outline" className="border-[#B8482C] text-[#B8482C] hover:bg-[#FBE8E1] dark:hover:bg-[rgba(184,72,44,0.10)]">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {isHindi ? 'InsureGPT पूछें' : isEnglish ? 'Ask InsureGPT' : 'InsureGPT se Puchiye'}
                  </span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          IRDAI DISCLAIMER
         ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-[#8B9099] dark:text-[#8B9099] leading-relaxed">
            ⚠️ {isHindi
              ? 'ये कैलकुलेटर केवल अनुमानित गणना के लिए हैं। वास्तविक प्रीमियम आपी आयु, चिकित्सा इतिहास, शहर, और बीमाकर्ता अंडरराइटिंग के आधार पर भिन्न होंगे। कृपया नीति शब्दों को ध्यान से पढ़ें। बीमा आग्रह का विषय है।'
              : isEnglish
                ? 'These calculators are for estimation only. Actual premiums will vary based on exact age, medical history, city, and insurer underwriting. Please read policy wording carefully. Insurance is the subject matter of solicitation.'
                : 'Yeh calculators sirf estimation ke liye hain. Actual premium aapki exact age, medical history, city, aur insurer underwriting pe depend karega. Policy wording dhyan se padhein. Insurance subject matter of solicitation hai.'}
            <br />
            <span className="inline-block mt-2 font-semibold text-[#B8482C] dark:text-[#E8C872]">
              Paliwal Secure • IRDAI Registered POSP • Code: IP429834
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}
