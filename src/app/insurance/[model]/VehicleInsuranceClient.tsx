'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QuickAnswerBox } from '@/components/geo/QuickAnswerBox';
import { AddOnGuide } from '@/components/geo/AddOnGuide';
import { ClaimTips } from '@/components/geo/ClaimTips';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import Schema from '@/components/Schema';
import { useLanguage, type Language } from '@/lib/i18n';
import {
  Car, Bike, Zap, Shield, Calculator, ArrowRight,
  Phone, MessageCircle, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

interface VehicleData {
  slug: string;
  brand: string;
  name: string;
  category: string;
  isEV: boolean;
  year: number;
  engineCC: number;
  idv: number;
  exShowroom: number;
  tp_base: number;
  primaryKeyword: string;
  relatedKeywords: string[];
}

function calculateODPremium(idv: number): number {
  return Math.round(idv * 0.035);
}

function calculateComprehensivePremium(idv: number, tp: number): number {
  const od = calculateODPremium(idv);
  return od + tp + 200;
}

// ── Localized Add-on Data ──────────────────────────────────────────────────
const addonTranslations: Record<string, Record<Language, string>> = {
  'Zero Depreciation': { en: 'Zero Depreciation', hi: 'ज़ीरो डेप्रिसिएशन', hinglish: 'Zero Depreciation' },
  'Roadside Assistance (RSA)': { en: 'Roadside Assistance (RSA)', hi: 'रोडसाइड असिस्टेंस (RSA)', hinglish: 'Roadside Assistance (RSA)' },
  'Engine Protect': { en: 'Engine Protect', hi: 'इंजन प्रोटेक्ट', hinglish: 'Engine Protect' },
  'Return to Invoice (RTI)': { en: 'Return to Invoice (RTI)', hi: 'रिटर्न टू इनवॉइस (RTI)', hinglish: 'Return to Invoice (RTI)' },
  'Personal Accident Cover': { en: 'Personal Accident Cover', hi: 'पर्सनल एक्सीडेंट कवर', hinglish: 'Personal Accident Cover' },
  'Passenger Cover': { en: 'Passenger Cover', hi: 'पैसेंजर कवर', hinglish: 'Passenger Cover' },
  'EV Battery Protect': { en: 'EV Battery Protect', hi: 'EV बैटरी प्रोटेक्ट', hinglish: 'EV Battery Protect' },
  'Charging Cable Cover': { en: 'Charging Cable Cover', hi: 'चार्जिंग केबल कवर', hinglish: 'Charging Cable Cover' },
};

const addonDescTranslations: Record<string, Record<Language, string>> = {
  'Zero Depreciation': {
    en: 'Full claim without depreciation deduction on parts. Must-have for new vehicles.',
    hi: 'पार्ट्स पर मूल्यह्रास कटौती के बिना पूरा क्लेम। नए वाहनों के लिए ज़रूरी।',
    hinglish: 'Full claim without depreciation deduction on parts. Must-have for new vehicles.',
  },
  'Roadside Assistance (RSA)': {
    en: 'Towing, flat tire, battery jumpstart, fuel delivery — 24/7 across India.',
    hi: 'टोइंग, फ्लैट टायर, बैटरी जंपस्टार्ट, फ्यूल डिलीवरी — भारत भर में 24/7।',
    hinglish: 'Towing, flat tire, battery jumpstart, fuel delivery — 24/7 across India.',
  },
  'Engine Protect': {
    en: 'Covers engine damage due to waterlogging, hydrostatic lock, and lubricant leakage.',
    hi: 'जलभराव, हाइड्रोस्टैटिक लॉक और लुब्रिकेंट लीकेज के कारण इंजन डैमेज कवर।',
    hinglish: 'Covers engine damage due to waterlogging, hydrostatic lock, and lubricant leakage.',
  },
  'Return to Invoice (RTI)': {
    en: 'Get full invoice value (not IDV) if vehicle is stolen or total loss. Best for new cars.',
    hi: 'वाहन चोरी होने या टोटल लॉस पर पूरा इनवॉइस वैल्यू (IDV नहीं) मिलता है। नई कारों के लिए सबसे अच्छा।',
    hinglish: 'Get full invoice value (not IDV) if vehicle is stolen or total loss. Best for new cars.',
  },
  'Personal Accident Cover': {
    en: '₹15L cover for death/disability. Mandatory for owner-driver.',
    hi: 'मृत्यु/विकलांगता पर ₹15 लाख कवर। मालिक-चालक के लिए अनिवार्य।',
    hinglish: '₹15L cover for death/disability. Mandatory for owner-driver.',
  },
  'Passenger Cover': {
    en: 'Covers co-passengers up to ₹2L each. Important for family cars.',
    hi: 'सह-यात्रियों को प्रति व्यक्ति ₹2 लाख तक कवर। परिवार की कारों के लिए ज़रूरी।',
    hinglish: 'Covers co-passengers up to ₹2L each. Important for family cars.',
  },
  'EV Battery Protect': {
    en: 'Covers EV battery degradation, charging damage, and electrical surge. Critical for EVs.',
    hi: 'EV बैटरी डिग्रेडेशन, चार्जिंग डैमेज और इलेक्ट्रिकल सर्ज कवर। EV के लिए अनिवार्य।',
    hinglish: 'Covers EV battery degradation, charging damage, and electrical surge. Critical for EVs.',
  },
  'Charging Cable Cover': {
    en: 'Covers theft/damage of portable charger and charging accessories.',
    hi: 'पोर्टेबल चार्जर और चार्जिंग एक्सेसरी की चोरी/डैमेज कवर।',
    hinglish: 'Covers theft/damage of portable charger and charging accessories.',
  },
};

function getLocalizedAddons(vehicle: { isEV: boolean; category: string }, language: Language) {
  const baseAddons = [
    { name: 'Zero Depreciation', cost: '₹2,500 – ₹6,000/yr', recommended: true, description: 'Full claim without depreciation deduction on parts. Must-have for new vehicles.' },
    { name: 'Roadside Assistance (RSA)', cost: '₹500 – ₹1,200/yr', recommended: true, description: 'Towing, flat tire, battery jumpstart, fuel delivery — 24/7 across India.' },
    { name: 'Engine Protect', cost: '₹800 – ₹2,000/yr', recommended: true, description: 'Covers engine damage due to waterlogging, hydrostatic lock, and lubricant leakage.' },
    { name: 'Return to Invoice (RTI)', cost: '₹1,500 – ₹3,500/yr', recommended: false, description: 'Get full invoice value (not IDV) if vehicle is stolen or total loss. Best for new cars.' },
    { name: 'Personal Accident Cover', cost: '₹300 – ₹600/yr', recommended: true, description: '₹15L cover for death/disability. Mandatory for owner-driver.' },
    { name: 'Passenger Cover', cost: '₹200 – ₹500/yr', recommended: false, description: 'Covers co-passengers up to ₹2L each. Important for family cars.' },
  ];

  if (vehicle.isEV) {
    baseAddons.push(
      { name: 'EV Battery Protect', cost: '₹3,000 – ₹8,000/yr', recommended: true, description: 'Covers EV battery degradation, charging damage, and electrical surge. Critical for EVs.' },
      { name: 'Charging Cable Cover', cost: '₹500 – ₹1,000/yr', recommended: false, description: 'Covers theft/damage of portable charger and charging accessories.' },
    );
  }

  return baseAddons.map(addon => ({
    ...addon,
    name: addonTranslations[addon.name]?.[language] || addon.name,
    description: addonDescTranslations[addon.name]?.[language] || addon.description,
  }));
}

// ── Localized FAQ builder ──────────────────────────────────────────────────
function getLocalizedFaqs(
  vehicle: VehicleData,
  language: Language,
  comprehensivePremium: number,
  odPremium: number,
) {
  const year = new Date().getFullYear();
  const v = vehicle;

  if (language === 'hi') {
    return [
      {
        question: `${v.brand} ${v.name} की ${year} में इंश्योरेंस लागत क्या है?`,
        answer: `${v.brand} ${v.name} की कॉम्प्रिहेंसिव इंश्योरेंस लगभग ₹${comprehensivePremium.toLocaleString('en-IN')}/वर्ष (नए वाहन) से शुरू होती है। इसमें ओन डैमेज (₹${odPremium.toLocaleString('en-IN')}), थर्ड पार्टी (₹${v.tp_base.toLocaleString('en-IN')}) और PA कवर शामिल है। ज़ीरो डेप जोड़ने से ₹2,500–₹6,000 अतिरिक्त लगता है।`,
      },
      {
        question: `${v.brand} ${v.name} का IDV क्या है?`,
        answer: `नए ${v.brand} ${v.name} (${v.year}) का IDV (इंश्योर्ड डिक्लेयर्ड वैल्यू) लगभग ₹${(v.idv / 100000).toFixed(1)} लाख है (एक्स-शोरूम ₹${(v.exShowroom / 100000).toFixed(1)} लाख × 95%)। IDV हर साल 10-15% मूल्यह्रास के कारण कम होता है।`,
      },
      {
        question: `क्या ${v.brand} ${v.name} के लिए ज़ीरो डेप्रिसिएशन कवर ज़रूरी है?`,
        answer: `हाँ, बिल्कुल! ${v.brand} ${v.name} के लिए ज़ीरो डेप्रिसिएशन अत्यधिक अनुशंसित है, खासकर यदि 5 साल से कम पुराना है। ज़ीरो डेप के बिना, क्लेम में प्लास्टिक/मेटल पार्ट्स पर 25-50% कटौती होती है। ज़ीरो डेप पार्ट्स पर पूर्ण क्लेम सेटलमेंट सुनिश्चित करता है।`,
      },
      {
        question: `${v.brand} ${v.name} का थर्ड पार्टी प्रीमियम क्या है?`,
        answer: `IRDAI द्वारा निर्धारित ${v.brand} ${v.name} (${v.engineCC > 0 ? `${v.engineCC}cc` : 'EV'}) का थर्ड पार्टी प्रीमियम ₹${v.tp_base.toLocaleString('en-IN')}/वर्ष है।${v.isEV ? ' EV को IRDAI दिशानिर्देशों के अनुसार TP दरों पर 15% छूट मिलती है।' : ''} भारतीय सड़कों पर चलाने के लिए यह न्यूनतम कानूनी आवश्यकता है।`,
      },
      v.isEV
        ? {
            question: `क्या ${v.brand} ${v.name} EV के लिए विशेष इंश्योरेंस विचार हैं?`,
            answer: `हाँ! ${v.brand} ${v.name} EV के लिए, बैटरी प्रोटेक्शन ऐड-ऑन अनिवार्य है। EV बैटरी बदलने की लागत ₹2-5 लाख है, जो इस ऐड-ऑन को बेहद मूल्यवान बनाती है। साथ ही, IRDAI EV पर TP प्रीमियम में 15% छूट देता है — जिससे कॉम्प्रिहेंसिव EV इंश्योरेंस उम्मीद से ज़्यादा किफ़ायती होता है।`,
          }
        : {
            question: `${v.brand} ${v.name} के लिए कौन से ऐड-ऑन चुनने चाहिए?`,
            answer: `${v.brand} ${v.name} के लिए, शीर्ष 3 अनुशंसित ऐड-ऑन हैं: (1) ज़ीरो डेप्रिसिएशन — पार्ट्स पर पूर्ण क्लेम, (2) रोडसाइड असिस्टेंस — 24/7 इमरजेंसी सपोर्ट, (3) इंजन प्रोटेक्ट — जलभराव डैमेज कवर। यदि लोन है, तो RTI जोड़ें।`,
          },
    ];
  }

  if (language === 'hinglish') {
    return [
      {
        question: `${v.brand} ${v.name} ki insurance cost ${year} mein kya hai?`,
        answer: `${v.brand} ${v.name} ki comprehensive insurance starts from approx ₹${comprehensivePremium.toLocaleString('en-IN')}/yr (new vehicle). This includes Own Damage (₹${odPremium.toLocaleString('en-IN')}), Third-Party (₹${v.tp_base.toLocaleString('en-IN')}), and PA cover. Adding Zero Dep increases it by ₹2,500–₹6,000.`,
      },
      {
        question: `${v.brand} ${v.name} ka IDV kya hai?`,
        answer: `Naye ${v.brand} ${v.name} (${v.year}) ka IDV (Insured Declared Value) approximately ₹${(v.idv / 100000).toFixed(1)}L hai (ex-showroom ₹${(v.exShowroom / 100000).toFixed(1)}L × 95%). IDV decreases by 10-15% each year due to depreciation.`,
      },
      {
        question: `Kya ${v.brand} ${v.name} ke liye Zero Depreciation cover zaroori hai?`,
        answer: `Haan, bilkul! ${v.brand} ${v.name} ke liye Zero Depreciation highly recommended hai, especially if it's under 5 years old. Without Zero Dep, you lose 25-50% on plastic/metal parts during claims. Zero Dep ensures full claim settlement on parts.`,
      },
      {
        question: `${v.brand} ${v.name} ka Third-Party premium kya hai?`,
        answer: `IRDAI-mandated Third-Party premium for ${v.brand} ${v.name} (${v.engineCC > 0 ? `${v.engineCC}cc` : 'EV'}) is ₹${v.tp_base.toLocaleString('en-IN')}/yr.${v.isEV ? ' EVs get a 15% discount on TP rates as per IRDAI guidelines.' : ''} This is the minimum legal requirement to drive on Indian roads.`,
      },
      v.isEV
        ? {
            question: `Kya ${v.brand} ${v.name} EV ke liye special insurance considerations hain?`,
            answer: `Haan! ${v.brand} ${v.name} EV ke liye, battery protection add-on non-negotiable hai. EV battery replacement costs ₹2-5L, making this add-on extremely valuable. Also, IRDAI offers 15% discount on TP premium for EVs — making comprehensive EV insurance more affordable than you'd expect.`,
          }
        : {
            question: `${v.brand} ${v.name} ke liye kaun se add-ons choose karein?`,
            answer: `${v.brand} ${v.name} ke liye, top 3 recommended add-ons hain: (1) Zero Depreciation — full claim on parts, (2) Roadside Assistance — 24/7 emergency support, (3) Engine Protect — covers waterlogging damage. If you have a loan, add Return to Invoice (RTI).`,
          },
    ];
  }

  // English (default)
  return [
    {
      question: `What is the insurance cost for ${v.brand} ${v.name} in ${year}?`,
      answer: `The comprehensive insurance for ${v.brand} ${v.name} starts from approximately ₹${comprehensivePremium.toLocaleString('en-IN')}/yr (new vehicle). This includes Own Damage (₹${odPremium.toLocaleString('en-IN')}), Third-Party (₹${v.tp_base.toLocaleString('en-IN')}), and PA cover. Adding Zero Dep increases it by ₹2,500–₹6,000.`,
    },
    {
      question: `What is the IDV of ${v.brand} ${v.name}?`,
      answer: `For a new ${v.brand} ${v.name} (${v.year}), the IDV (Insured Declared Value) is approximately ₹${(v.idv / 100000).toFixed(1)}L (ex-showroom ₹${(v.exShowroom / 100000).toFixed(1)}L × 95%). IDV decreases by 10-15% each year due to depreciation.`,
    },
    {
      question: `Is Zero Depreciation cover recommended for ${v.brand} ${v.name}?`,
      answer: `Yes, absolutely! Zero Depreciation is highly recommended for the ${v.brand} ${v.name}, especially if it's under 5 years old. Without Zero Dep, you lose 25-50% on plastic/metal parts during claims. Zero Dep ensures full claim settlement on parts.`,
    },
    {
      question: `What is the Third-Party premium for ${v.brand} ${v.name}?`,
      answer: `The IRDAI-mandated Third-Party premium for ${v.brand} ${v.name} (${v.engineCC > 0 ? `${v.engineCC}cc` : 'EV'}) is ₹${v.tp_base.toLocaleString('en-IN')}/yr.${v.isEV ? ' EVs get a 15% discount on TP rates as per IRDAI guidelines.' : ''} This is the minimum legal requirement to drive on Indian roads.`,
    },
    {
      question: v.isEV ? `Are there special insurance considerations for ${v.brand} ${v.name} EV?` : `Which add-ons should I choose for ${v.brand} ${v.name}?`,
      answer: v.isEV
        ? `Yes! For ${v.brand} ${v.name} EV, you should add: (1) EV Battery Protect — covers battery degradation and charging damage, (2) Zero Dep — full claim on parts, (3) Charging Cable Cover — theft/damage of portable charger. EVs also get 15% TP discount per IRDAI.`
        : `For ${v.brand} ${v.name}, the top 3 recommended add-ons are: (1) Zero Depreciation — full claim on parts, (2) Roadside Assistance — 24/7 emergency support, (3) Engine Protect — covers waterlogging damage. If you have a loan, add Return to Invoice (RTI).`,
    },
  ];
}

// ── Localized Expert Insight ───────────────────────────────────────────────
function getLocalizedExpertInsight(vehicle: VehicleData, language: Language): string {
  if (language === 'hi') {
    return vehicle.isEV
      ? `${vehicle.brand} ${vehicle.name} EV के लिए, बैटरी प्रोटेक्शन ऐड-ऑन अनिवार्य है। EV बैटरी बदलने की लागत ₹2-5 लाख है। साथ ही, IRDAI EV पर TP प्रीमियम में 15% छूट देता है।`
      : `${vehicle.brand} ${vehicle.name} के लिए, मैं हमेशा ज़ीरो डेप + RSA + इंजन प्रोटेक्ट को न्यूनतम ऐड-ऑन कॉम्बो के रूप में अनुशंसा करता हूं। यह 90% क्लेम परिदृश्यों को कवर करता है। यदि आपका वाहन 3 साल से पुराना है तो RTI छोड़ दें — लागत-लाभ उचित नहीं है।`;
  }

  if (language === 'hinglish') {
    return vehicle.isEV
      ? `For the ${vehicle.brand} ${vehicle.name} EV, battery protection add-on is non-negotiable. EV battery replacement costs ₹2-5L, making this add-on extremely valuable. Also, IRDAI offers 15% discount on TP premium for EVs.`
      : `For the ${vehicle.brand} ${vehicle.name}, I always recommend Zero Dep + RSA + Engine Protect as the minimum add-on combo. This covers 90% of claim scenarios. Skip Return to Invoice if your vehicle is older than 3 years — the cost-benefit doesn't justify it.`;
  }

  // English
  return vehicle.isEV
    ? `For the ${vehicle.brand} ${vehicle.name} EV, battery protection add-on is non-negotiable. EV battery replacement costs ₹2-5L, making this add-on extremely valuable. Also, IRDAI offers 15% discount on TP premium for EVs — making comprehensive EV insurance more affordable than you'd expect.`
    : `For the ${vehicle.brand} ${vehicle.name}, I always recommend Zero Dep + RSA + Engine Protect as the minimum add-on combo. This covers 90% of claim scenarios. Skip Return to Invoice if your vehicle is older than 3 years — the cost-benefit doesn't justify it.`;
}

export default function VehicleInsuranceClient({ vehicle }: { vehicle: VehicleData }) {
  const { t, language } = useLanguage();

  const typeLabel = vehicle.category === 'car' ? t('vehicle.type.car') : vehicle.category === 'bike' ? t('vehicle.type.bike') : t('vehicle.type.scooter');
  const insuranceTypeLabel = vehicle.category === 'car' ? t('vehicle.insuranceType.car') : vehicle.category === 'bike' ? t('vehicle.insuranceType.bike') : t('vehicle.insuranceType.scooter');
  const odPremium = calculateODPremium(vehicle.idv);
  const comprehensivePremium = calculateComprehensivePremium(vehicle.idv, vehicle.tp_base);
  const addons = getLocalizedAddons(vehicle, language);
  const faqs = getLocalizedFaqs(vehicle, language, comprehensivePremium, odPremium);
  const expertInsightText = getLocalizedExpertInsight(vehicle, language);

  // Build disclaimer based on language
  const disclaimerText = (() => {
    const compBase = t('vehicle.disclaimer.comp');
    const odPart = `₹${odPremium.toLocaleString('en-IN')}`;
    const tpPart = `₹${vehicle.tp_base.toLocaleString('en-IN')}`;
    const evPart = vehicle.isEV ? ` ${t('vehicle.disclaimer.evTPdiscount')}` : '';
    const varyPart = ` ${t('vehicle.disclaimer.actualVary')}`;

    if (language === 'hi') {
      return `* कॉम्प्रिहेंसिव = ओन डैमेज (₹${odPremium.toLocaleString('en-IN')}) + थर्ड पार्टी (₹${vehicle.tp_base.toLocaleString('en-IN')}) + PA मालिक-चालक (₹200)।${evPart}${varyPart}`;
    }
    if (language === 'hinglish') {
      return `* Comprehensive = Own Damage (₹${odPremium.toLocaleString('en-IN')}) + Third-Party (₹${vehicle.tp_base.toLocaleString('en-IN')}) + PA Owner-Driver (₹200).${evPart}${varyPart}`;
    }
    return `* Comprehensive = Own Damage (₹${odPremium.toLocaleString('en-IN')}) + Third-Party (₹${vehicle.tp_base.toLocaleString('en-IN')}) + PA Owner-Driver (₹200).${evPart}${varyPart}`;
  })();

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <Schema type="Organization" />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li><Link href="/insurance" className="hover:text-foreground transition-colors">{insuranceTypeLabel}</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li className="text-foreground font-medium">{vehicle.brand} {vehicle.name}</li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg">
              {vehicle.category === 'car' ? <Car className="w-6 h-6 text-white" /> :
               vehicle.category === 'bike' ? <Bike className="w-6 h-6 text-white" /> :
               <Zap className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                {vehicle.brand} {vehicle.name} {t('vehicle.insurance')} {year}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {vehicle.year} {t('vehicle.model')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {typeLabel}
                </Badge>
                {vehicle.isEV && (
                  <Badge className="text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300">
                    ⚡ {t('vehicle.electric')}
                  </Badge>
                )}
                {vehicle.engineCC > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {vehicle.engineCC}cc
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaway */}
        <QuickAnswerBox
          title={`${vehicle.brand} ${vehicle.name} ${t('vehicle.insuranceQuickAnswer')}`}
          answer={language === 'hi'
            ? `${vehicle.brand} ${vehicle.name} की कॉम्प्रिहेंसिव इंश्योरेंस नए वाहन के लिए ₹${comprehensivePremium.toLocaleString('en-IN')}/वर्ष से शुरू होती है। इसमें OD प्रीमियम (₹${odPremium.toLocaleString('en-IN')}), TP (₹${vehicle.tp_base.toLocaleString('en-IN')}) + PA कवर शामिल है। ज़ीरो डेप ऐड-ऑन ₹2,500–₹6,000 अतिरिक्त।`
            : language === 'hinglish'
              ? `${vehicle.brand} ${vehicle.name} ki comprehensive insurance starts at ₹${comprehensivePremium.toLocaleString('en-IN')}/yr for a new vehicle. This includes OD premium (₹${odPremium.toLocaleString('en-IN')}), TP (₹${vehicle.tp_base.toLocaleString('en-IN')}) + PA cover. Zero Dep add-on costs ₹2,500–₹6,000 extra.`
              : `The comprehensive insurance for ${vehicle.brand} ${vehicle.name} starts at ₹${comprehensivePremium.toLocaleString('en-IN')}/yr for a new vehicle. This includes OD premium (₹${odPremium.toLocaleString('en-IN')}), TP (₹${vehicle.tp_base.toLocaleString('en-IN')}) + PA cover. Zero Dep add-on costs ₹2,500–₹6,000 extra.`
          }
          bestOption={language === 'hi' ? 'कॉम्प्रिहेंसिव + ज़ीरो डेप + RSA' : 'Comprehensive + Zero Dep + RSA'}
          costRange={`₹${comprehensivePremium.toLocaleString('en-IN')} – ₹${(comprehensivePremium + 8000).toLocaleString('en-IN')}/yr`}
          keyTip={t('vehicle.zeroDepTip')}
          vehicle={{ brand: vehicle.brand, name: vehicle.name, year: vehicle.year, isEV: vehicle.isEV }}
        />

        {/* Premium Breakdown */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-600 dark:text-sky-400" />
              {t('vehicle.premiumBreakdown')} — {vehicle.brand} {vehicle.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t('vehicle.exShowroom')}</p>
                <p className="text-xl font-bold text-foreground">₹{(vehicle.exShowroom / 100000).toFixed(1)}L</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t('vehicle.idvNew')}</p>
                <p className="text-xl font-bold text-foreground">₹{(vehicle.idv / 100000).toFixed(1)}L</p>
              </div>
              <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t('vehicle.tpPremium')}</p>
                <p className="text-xl font-bold text-cyan-700 dark:text-cyan-300">₹{vehicle.tp_base.toLocaleString('en-IN')}/yr</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t('vehicle.comprehensive')}</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">₹{comprehensivePremium.toLocaleString('en-IN')}/yr</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {disclaimerText}
            </p>
          </CardContent>
        </Card>

        {/* Add-on Guide */}
        <div className="mt-8">
          <AddOnGuide vehicleName={`${vehicle.brand} ${vehicle.name}`} addons={addons} />
        </div>

        {/* Claim Tips */}
        <div className="mt-8">
          <ClaimTips
            category={vehicle.category}
            insuranceType="motor"
          />
        </div>

        {/* Expert Insight */}
        <div className="mt-8">
          <ExpertInsight
            insight={expertInsightText}
            topic={`${vehicle.brand} ${vehicle.name} ${t('vehicle.expertTopic')}`}
          />
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <FAQSection faqs={faqs} title={`${vehicle.brand} ${vehicle.name} ${t('vehicle.faq.title')}`} />
        </div>

        {/* CTA Section */}
        <Card className="mt-8 border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/10">
          <CardContent className="p-6 sm:p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">
              {t('vehicle.getBestQuote')} {vehicle.brand} {vehicle.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
              {t('vehicle.compareInsurers')} {language === 'hi' ? 'सीधे खरीदने जैसा ही प्रीमियम — साथ में Paliwal Secure AI से मुफ़्त क्लेम सपोर्ट।' : language === 'hinglish' ? 'Same premium as buying direct — plus free claim support from Paliwal Secure AI.' : 'Same premium as buying direct — plus free claim support from Paliwal Secure AI.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-teal-400 text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <MessageCircle className="w-4 h-4" />
                {t('vehicle.quoteWhatsApp')}
              </a>
              <a
                href="tel:+919257877312"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border border-cyan-500/30 text-cyan-700 dark:text-sky-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {t('vehicle.callLabel')} 9257877312
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {t('vehicle.irdaiCertifiedPOSP')} | Himanshu Paliwal | POSP Code: IP429834
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
