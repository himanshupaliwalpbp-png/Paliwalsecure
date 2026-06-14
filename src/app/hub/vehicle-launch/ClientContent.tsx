'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { vehicles } from '@/data/vehicles';
import {
  Car, Bike, Zap, Shield, IndianRupee, ArrowRight,
  MessageCircle, ChevronRight, Star, Clock, Battery,
  Gauge, Sparkles, TrendingUp,
} from 'lucide-react';

// ── Translation helper ──────────────────────────────────────────────────────
type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

// ── Inline page translations ────────────────────────────────────────────────
const pageText = {
  hero: {
    badge: { en: "New Launches 2025", hi: "नई लॉन्च 2025", hinglish: "New Launches 2025" },
    title1: { en: "Vehicle Launch Hub", hi: "वाहन लॉन्च हब", hinglish: "Vehicle Launch Hub" },
    title2: { en: "New Car, Bike & EV Insurance Guide 2025", hi: "नई कार, बाइक और EV बीमा गाइड 2025", hinglish: "New Car, Bike & EV Insurance Guide 2025" },
    desc: { en: "Insurance for newly launched vehicles in India. Cars, bikes, and EVs — premium calculator, add-on guide, and insurer comparison.", hi: "भारत में नए लॉन्च वाहनों के लिए बीमा। कार, बाइक और EV — प्रीमियम कैलकुलेटर, ऐड-ऑन गाइड और बीमाकर्ता तुलना।", hinglish: "India mein newly launched vehicles ke liye insurance. Cars, bikes, aur EVs — premium calculator, add-on guide, aur insurer comparison." },
    ctaWhatsApp: { en: "💬 Get Quote on WhatsApp", hi: "💬 WhatsApp पर कोटेशन लें", hinglish: "💬 WhatsApp pe Quote Lo" },
    stat1Val: { en: "15%", hi: "15%", hinglish: "15%" },
    stat1Label: { en: "EV TP Discount", hi: "EV TP छूट", hinglish: "EV TP Discount" },
    stat3Label: { en: "Total Vehicles", hi: "कुल वाहन", hinglish: "Total Vehicles" },
    stat4Label: { en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" },
    stat4Val: { en: "POSP IP429834", hi: "POSP IP429834", hinglish: "POSP IP429834" },
    evDiscount: { en: "15% EV Discount", hi: "15% EV छूट", hinglish: "15% EV Discount" },
    evScooter: { en: "EV Scooter", hi: "EV स्कूटर", hinglish: "EV Scooter" },
    scooter: { en: "Scooter", hi: "स्कूटर", hinglish: "Scooter" },
  },
  evCar: {
    heading: { en: "Electric Car Insurance", hi: "इलेक्ट्रिक कार बीमा", hinglish: "Electric Car Insurance" },
    desc: { en: "EV cars get 15% TP discount. Battery protection add-on is essential for expensive EV battery replacement.", hi: "EV कारों को 15% TP छूट मिलती है। महंगी EV बैटरी बदलाव के लिए बैटरी प्रोटेक्शन ऐड-ऑन ज़रूरी है।", hinglish: "EV cars ko 15% TP discount milti hai. Battery protection add-on essential hai expensive EV battery replacement ke liye." },
  },
  evScooter: {
    heading: { en: "Electric Scooter Insurance", hi: "इलेक्ट्रिक स्कूटर बीमा", hinglish: "Electric Scooter Insurance" },
    desc: { en: "EV scooters are affordable and get 15% TP discount. Battery cover is a must.", hi: "EV स्कूटर किफ़ायती हैं और 15% TP छूट मिलती है। बैटरी कवर ज़रूरी है।", hinglish: "EV scooters affordable hain aur 15% TP discount milti hai. Battery cover must hai." },
    completeGuide: { en: "Complete EV Insurance Guide →", hi: "संपूर्ण EV बीमा गाइड →", hinglish: "Complete EV Insurance Guide →" },
  },
  popularCar: {
    heading: { en: "Popular Car Insurance", hi: "लोकप्रिय कार बीमा", hinglish: "Popular Car Insurance" },
    desc: { en: "Insurance for India's most popular car models. Get quotes in 5 minutes.", hi: "भारत की सबसे लोकप्रिय कार मॉडल के लिए बीमा। 5 मिनट में कोटेशन प्राप्त करें।", hinglish: "India ki sabse popular car models ke liye insurance. 5 minute mein quotes paayein." },
    showingTop8: { en: "Showing top 8 cars.", hi: "शीर्ष 8 कारें दिखाई जा रही हैं।", hinglish: "Top 8 cars dikha rahe hain." },
    viewAll: { en: "View all car insurance →", hi: "सभी कार बीमा देखें →", hinglish: "View all car insurance →" },
  },
  popularBike: {
    heading: { en: "Popular Bike & Scooter Insurance", hi: "लोकप्रिय बाइक और स्कूटर बीमा", hinglish: "Popular Bike & Scooter Insurance" },
    desc: { en: "Two-wheeler insurance for top bikes and scooters. TP starts at ₹538/year.", hi: "शीर्ष बाइक और स्कूटर के लिए द्विपहिया बीमा। TP ₹538/वर्ष से शुरू।", hinglish: "Top bikes aur scooters ke liye two-wheeler insurance. TP starts at ₹538/year." },
    viewAll: { en: "View all bike insurance →", hi: "सभी बाइक बीमा देखें →", hinglish: "View all bike insurance →" },
  },
  brandWise: {
    heading: { en: "Brand-wise Insurance", hi: "ब्रांडवार बीमा", hinglish: "Brand-wise Insurance" },
    desc: { en: "Find insurance for your vehicle brand. Click to see models and rates.", hi: "अपने वाहन ब्रांड के लिए बीमा खोजें। मॉडल और दरें देखने के लिए क्लिक करें।", hinglish: "Apne vehicle brand ke liye insurance dhoondhein. Models aur rates dekhne ke liye click karein." },
    models: { en: "models", hi: "मॉडल", hinglish: "models" },
  },
  evVsPetrol: {
    heading: { en: "EV vs Petrol Insurance", hi: "EV बनाम पेट्रोल बीमा", hinglish: "EV vs Petrol Insurance" },
    desc: { en: "Key differences between EV and petrol vehicle insurance. EVs get TP discount but need battery add-on.", hi: "EV और पेट्रोल वाहन बीमे के बीच मुख्य अंतर। EV को TP छूट मिलती है लेकिन बैटरी ऐड-ऑन चाहिए।", hinglish: "EV aur petrol vehicle insurance ke beech key differences. EVs ko TP discount milti hai lekin battery add-on chahiye." },
    thFeature: { en: "Feature", hi: "विशेषता", hinglish: "Feature" },
    thEv: { en: "EV Insurance", hi: "EV बीमा", hinglish: "EV Insurance" },
    thPetrol: { en: "Petrol Insurance", hi: "पेट्रोल बीमा", hinglish: "Petrol Insurance" },
    tpPremium: { en: "TP Premium", hi: "TP प्रीमियम", hinglish: "TP Premium" },
    tpPremiumEv: { en: "15% cheaper (IRDAI discount)", hi: "15% सस्ती (IRDAI छूट)", hinglish: "15% cheaper (IRDAI discount)" },
    tpPremiumPetrol: { en: "Standard IRDAI rates", hi: "मानक IRDAI दरें", hinglish: "Standard IRDAI rates" },
    compPremium: { en: "Comprehensive Premium", hi: "कॉम्प्रिहेंसिव प्रीमियम", hinglish: "Comprehensive Premium" },
    compPremiumEv: { en: "10-20% higher (battery cost)", hi: "10-20% अधिक (बैटरी लागत)", hinglish: "10-20% higher (battery cost)" },
    compPremiumPetrol: { en: "Standard rates", hi: "मानक दरें", hinglish: "Standard rates" },
    batteryCover: { en: "Battery Cover", hi: "बैटरी कवर", hinglish: "Battery Cover" },
    batteryCoverEv: { en: "Essential add-on (₹2K-6K/yr)", hi: "आवश्यक ऐड-ऑन (₹2K-6K/वर्ष)", hinglish: "Essential add-on (₹2K-6K/yr)" },
    batteryCoverPetrol: { en: "Not applicable", hi: "लागू नहीं", hinglish: "Not applicable" },
    engineCover: { en: "Engine Protection", hi: "इंजन प्रोटेक्शन", hinglish: "Engine Protection" },
    engineCoverEv: { en: "Motor + inverter cover", hi: "मोटर + इन्वर्टर कवर", hinglish: "Motor + inverter cover" },
    engineCoverPetrol: { en: "Water damage cover (₹1.5K-3K/yr)", hi: "पानी से डैमेज कवर (₹1.5K-3K/वर्ष)", hinglish: "Water damage cover (₹1.5K-3K/yr)" },
    taxBenefit: { en: "Tax Benefit", hi: "कर लाभ", hinglish: "Tax Benefit" },
    taxBenefitEv: { en: "Section 80EEB up to ₹1.5L", hi: "धारा 80EEB ₹1.5L तक", hinglish: "Section 80EEB up to ₹1.5L" },
    taxBenefitPetrol: { en: "No special benefit", hi: "कोई विशेष लाभ नहीं", hinglish: "No special benefit" },
    chargingCover: { en: "Charging Station Cover", hi: "चार्जिंग स्टेशन कवर", hinglish: "Charging Station Cover" },
    chargingCoverEv: { en: "Available as add-on", hi: "ऐड-ऑन के रूप में उपलब्ध", hinglish: "Available as add-on" },
    chargingCoverPetrol: { en: "Not applicable", hi: "लागू नहीं", hinglish: "Not applicable" },
  },
  addons: {
    heading: { en: "Essential Add-ons for New Vehicles", hi: "नए वाहनों के लिए आवश्यक ऐड-ऑन", hinglish: "Essential Add-ons for New Vehicles" },
    desc: { en: "These add-ons save you thousands during claims. Choose based on your vehicle type and budget.", hi: "ये ऐड-ऑन क्लेम के दौरान हज़ारों बचाते हैं। अपने वाहन प्रकार और बजट के आधार पर चुनें।", hinglish: "Yeh add-ons claims ke dauraan hazaaron bachate hain. Vehicle type aur budget ke basis pe choose karein." },
    zeroDep: { en: "Zero Depreciation", hi: "ज़ीरो डेप्रिसिएशन", hinglish: "Zero Depreciation" },
    zeroDepDesc: { en: "Full claim without depreciation cut on parts. Must-have for new vehicles.", hi: "पुर्जों पर बिना ह्रास कटौती का पूरा क्लेम। नए वाहनों के लिए ज़रूरी।", hinglish: "Full claim without depreciation cut on parts. Must-have for new vehicles." },
    rti: { en: "Return to Invoice", hi: "रिटर्न टू इनवॉइस", hinglish: "Return to Invoice" },
    rtiDesc: { en: "Get full ex-showroom price if stolen or totalled. Essential for new cars.", hi: "चोरी या टोटल लॉस होने पर पूर्ण एक्स-शोरूम कीमत। नई कारों के लिए ज़रूरी।", hinglish: "Full ex-showroom price if stolen or totalled. Essential for new cars." },
    battery: { en: "Battery Protection", hi: "बैटरी प्रोटेक्शन", hinglish: "Battery Protection" },
    batteryDesc: { en: "Covers EV battery degradation and charging damage. Replacement costs ₹3-6L.", hi: "EV बैटरी गिरावट और चार्जिंग डैमेज कवर। बदलाव लागत ₹3-6L।", hinglish: "EV battery degradation aur charging damage cover. Replacement costs ₹3-6L." },
    engine: { en: "Engine Protect", hi: "इंजन प्रोटेक्ट", hinglish: "Engine Protect" },
    engineDesc: { en: "Covers engine damage from waterlogging. Critical in monsoon cities.", hi: "जलभराव से इंजन डैमेज कवर। मानसून शहरों में ज़रूरी।", hinglish: "Engine damage from waterlogging cover. Critical in monsoon cities." },
    ncb: { en: "NCB Protection", hi: "NCB प्रोटेक्शन", hinglish: "NCB Protection" },
    ncbDesc: { en: "Protect your NCB discount even after one claim. Saves up to 50% on OD premium.", hi: "एक क्लेम के बाद भी अपना NCB डिस्काउंट बचाएँ। OD प्रीमियम पर 50% तक बचत।", hinglish: "Apna NCB discount bachayein even after one claim. Up to 50% savings on OD premium." },
    rsa: { en: "Roadside Assistance", hi: "रोडसाइड असिस्टेंस", hinglish: "Roadside Assistance" },
    rsaDesc: { en: "24/7 emergency support — towing, flat tyre, fuel delivery. Essential for all vehicles.", hi: "24/7 आपातकालीन सहायता — टोइंग, फ्लैट टायर, ईंधन। सभी वाहनों के लिए ज़रूरी।", hinglish: "24/7 emergency support — towing, flat tyre, fuel delivery. Essential for all vehicles." },
  },
  cta: {
    heading: { en: "Get Insurance for Your New Vehicle", hi: "अपने नए वाहन का बीमा कराएँ", hinglish: "Apne Naye Vehicle ka Insurance Karayein" },
    desc: { en: "Compare 10+ insurers, get AI-powered recommendations. Free consultation with IRDAI-certified advisor Himanshu Paliwal (POSP Code: IP429834).", hi: "10+ बीमाकर्ताओं की तुलना करें, AI-संचालित सिफारिशें प्राप्त करें। IRDAI-प्रमाणित सलाहकार हिमांशु पालीवाल से मुफ़्त परामर्श।", hinglish: "10+ insurers compare karein, AI-powered recommendations paayein. IRDAI-certified advisor Himanshu Paliwal se free consultation." },
    ctaWhatsApp: { en: "💬 Get Quote on WhatsApp", hi: "💬 WhatsApp पर कोटेशन लें", hinglish: "💬 WhatsApp pe Quote Lo" },
    ctaHub: { en: "Motor Insurance Hub →", hi: "मोटर इंश्योरेंस हब →", hinglish: "Motor Insurance Hub →" },
  },
};

const faqs = [
  { question: 'How much does new car insurance cost in India?', answer: 'New car comprehensive insurance costs ₹6,000-₹40,000/year depending on the car\'s ex-showroom price, engine CC, and add-ons. Third-party rates are fixed by IRDAI: ₹2,861 (< 1000cc), ₹3,416 (1000-1500cc), ₹7,890 (> 1500cc). Zero Depreciation add-on is highly recommended for new cars.' },
  { question: 'Is EV insurance cheaper than petrol/diesel car insurance?', answer: 'EV third-party insurance is 15% cheaper than equivalent ICE vehicles (IRDAI discount). However, comprehensive EV insurance can be 10-20% higher due to expensive battery replacement costs. Overall, EVs save on fuel and TP premium, but battery protection add-on is essential and adds to the cost.' },
  { question: 'What is the 15% EV insurance discount by IRDAI?', answer: 'IRDAI mandates 15% discount on third-party premiums for all electric vehicles. For example, if the standard TP rate for 1000-1500cc is ₹3,416, an equivalent EV pays ₹2,904. This discount applies only to TP, not to own-damage premium. It was introduced to promote EV adoption in India.' },
  { question: 'Which add-ons should I buy for a new car?', answer: 'Must-have add-ons for new cars: Zero Depreciation (full claim without depreciation cut), Return to Invoice (get ex-showroom price if stolen/totalled), Engine Protect (covers water damage), and NCB Protection (saves your discount even after a claim). This combo costs ~25% extra but saves ₹30,000-₹2,00,000 during claims.' },
  { question: 'Do I need battery protection add-on for EV insurance?', answer: 'Yes, absolutely. Battery replacement costs ₹3-6 Lakh for EV cars and ₹40,000-₹80,000 for EV scooters. Standard comprehensive policies do NOT cover battery degradation or damage from charging. Battery protection add-on covers this critical component. Without it, you bear the full cost of battery replacement.' },
  { question: 'What is IDV for a new vehicle?', answer: 'For a brand new vehicle, IDV = Ex-showroom price × 0.95 (5% depreciation in year 1). For example, a ₹10 Lakh ex-showroom car has IDV of ₹9.5 Lakh. Higher IDV means higher premium but better claim payout. Always ensure your IDV is set correctly — don\'t let insurers lower it to reduce premium.' },
  { question: 'Can I buy insurance before vehicle delivery?', answer: 'Yes, you can and should buy insurance before delivery. Most dealers offer insurance at the showroom, but it\'s often 20-30% more expensive. Get quotes from multiple insurers online and buy separately. You need the vehicle\'s ex-showroom price and engine CC to get a quote. The policy activates on the delivery date.' },
];

export default function ClientContent() {
  const { language } = useLanguage();

  const cars = vehicles.filter(v => v.category === 'car' && !v.isEV).slice(0, 8);
  const evCars = vehicles.filter(v => v.isEV && v.category === 'car');
  const evScooters = vehicles.filter(v => v.isEV && v.category === 'scooter');
  const bikes = vehicles.filter(v => v.category === 'bike').slice(0, 6);
  const scooters = vehicles.filter(v => v.category === 'scooter' && !v.isEV).slice(0, 4);

  const comparisonRows = [
    { feature: pt(pageText.evVsPetrol.tpPremium, language), ev: pt(pageText.evVsPetrol.tpPremiumEv, language), petrol: pt(pageText.evVsPetrol.tpPremiumPetrol, language) },
    { feature: pt(pageText.evVsPetrol.compPremium, language), ev: pt(pageText.evVsPetrol.compPremiumEv, language), petrol: pt(pageText.evVsPetrol.compPremiumPetrol, language) },
    { feature: pt(pageText.evVsPetrol.batteryCover, language), ev: pt(pageText.evVsPetrol.batteryCoverEv, language), petrol: pt(pageText.evVsPetrol.batteryCoverPetrol, language) },
    { feature: pt(pageText.evVsPetrol.engineCover, language), ev: pt(pageText.evVsPetrol.engineCoverEv, language), petrol: pt(pageText.evVsPetrol.engineCoverPetrol, language) },
    { feature: pt(pageText.evVsPetrol.taxBenefit, language), ev: pt(pageText.evVsPetrol.taxBenefitEv, language), petrol: pt(pageText.evVsPetrol.taxBenefitPetrol, language) },
    { feature: pt(pageText.evVsPetrol.chargingCover, language), ev: pt(pageText.evVsPetrol.chargingCoverEv, language), petrol: pt(pageText.evVsPetrol.chargingCoverPetrol, language) },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        <div className="orb-1 absolute top-20 left-10 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="orb-2 absolute bottom-10 right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">{pt({ en: "Home", hi: "होम", hinglish: "Home" }, language)}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{pt(pageText.hero.title1, language)}</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              {pt(pageText.hero.badge, language)}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {pt(pageText.hero.title1, language)} —{' '}
              <span className="gradient-text">{pt(pageText.hero.title2, language)}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {pt(pageText.hero.desc, language)}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: IndianRupee, label: pt(pageText.hero.stat1Label, language), value: pt(pageText.hero.stat1Val, language) },
                { icon: Battery, label: pt({ en: "EV Models", hi: "EV मॉडल", hinglish: "EV Models" }, language), value: `${evCars.length + evScooters.length}+` },
                { icon: Gauge, label: pt(pageText.hero.stat3Label, language), value: `${vehicles.length}+` },
                { icon: Shield, label: pt(pageText.hero.stat4Label, language), value: pt(pageText.hero.stat4Val, language) },
              ].map((stat, i) => (
                <Card key={i} className="glass-card bg-background/80">
                  <CardContent className="p-3 text-center">
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-sm font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue">
                <span>{pt(pageText.hero.ctaWhatsApp, language)}</span>
              </ShinyButton>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">

        {/* EV Cars */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Zap className="h-6 w-6 text-emerald-600" />
            <span className="gradient-text">{pt(pageText.evCar.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.evCar.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {evCars.map(ev => (
              <Link key={ev.slug} href={`/insurance/${ev.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-emerald-500/30 transition-all cursor-pointer h-full bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
                  <CardContent className="p-3 text-center">
                    <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                    <p className="text-sm font-semibold">{ev.brand} {ev.name}</p>
                    <p className="text-xs text-muted-foreground">IDV: ₹{(ev.idv / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(ev.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                    <Badge className="mt-1.5 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" variant="secondary">{pt(pageText.hero.evDiscount, language)}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* EV Scooters */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Zap className="h-6 w-6 text-lime-600" />
            <span className="gradient-text">{pt(pageText.evScooter.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.evScooter.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {evScooters.map(ev => (
              <Link key={ev.slug} href={`/insurance/${ev.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-lime-500/30 transition-all cursor-pointer h-full bg-gradient-to-br from-lime-50/50 to-transparent dark:from-lime-950/20">
                  <CardContent className="p-3 text-center">
                    <Zap className="h-5 w-5 text-lime-600 dark:text-lime-400 mx-auto mb-1" />
                    <p className="text-sm font-semibold">{ev.brand} {ev.name}</p>
                    <p className="text-xs text-muted-foreground">IDV: ₹{(ev.idv / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(ev.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                    <Badge className="mt-1.5 text-[10px] bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300" variant="secondary">{pt(pageText.hero.evScooter, language)}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/blog/ev-insurance-india-guide">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.evScooter.completeGuide, language)}</span>
              </ShinyButton>
            </Link>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Popular Car Launches */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.popularCar.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.popularCar.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cars.map(car => (
              <Link key={car.slug} href={`/insurance/${car.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <Car className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-sm font-semibold">{car.brand} {car.name}</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(car.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                    <p className="text-[10px] text-muted-foreground">IDV: ₹{(car.idv / 100000).toFixed(1)}L</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {pt(pageText.popularCar.showingTop8, language)}{' '}
            <Link href="/car-insurance" className="text-primary hover:underline">{pt(pageText.popularCar.viewAll, language)}</Link>
          </p>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Bike Launches */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.popularBike.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.popularBike.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {bikes.map(bike => (
              <Link key={bike.slug} href={`/insurance/${bike.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <Bike className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-sm font-semibold">{bike.brand} {bike.name}</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(bike.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                    <p className="text-[10px] text-muted-foreground">IDV: ₹{(bike.idv / 100000).toFixed(1)}L</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {scooters.map(scooter => (
              <Link key={scooter.slug} href={`/insurance/${scooter.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <Bike className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                    <p className="text-sm font-semibold">{scooter.brand} {scooter.name}</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(scooter.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                    <Badge variant="secondary" className="mt-1 text-[10px]">{pt(pageText.hero.scooter, language)}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            <Link href="/bike-insurance" className="text-primary hover:underline">{pt(pageText.popularBike.viewAll, language)}</Link>
          </p>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Brand-wise Insurance */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.brandWise.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.brandWise.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { brand: 'Maruti Suzuki', count: vehicles.filter(v => v.brand === 'Maruti Suzuki').length, href: '/car-insurance' },
              { brand: 'Hyundai', count: vehicles.filter(v => v.brand === 'Hyundai').length, href: '/car-insurance' },
              { brand: 'Tata', count: vehicles.filter(v => v.brand === 'Tata').length, href: '/car-insurance' },
              { brand: 'Mahindra', count: vehicles.filter(v => v.brand === 'Mahindra').length, href: '/car-insurance' },
              { brand: 'Honda', count: vehicles.filter(v => v.brand === 'Honda').length, href: '/car-insurance' },
              { brand: 'Toyota', count: vehicles.filter(v => v.brand === 'Toyota').length, href: '/car-insurance' },
              { brand: 'Kia', count: vehicles.filter(v => v.brand === 'Kia').length, href: '/car-insurance' },
              { brand: 'Royal Enfield', count: vehicles.filter(v => v.brand === 'Royal Enfield').length, href: '/bike-insurance' },
              { brand: 'Bajaj', count: vehicles.filter(v => v.brand === 'Bajaj').length, href: '/bike-insurance' },
              { brand: 'Ola Electric', count: vehicles.filter(v => v.brand === 'Ola Electric').length, href: '/bike-insurance' },
              { brand: 'Ather Energy', count: vehicles.filter(v => v.brand === 'Ather Energy').length, href: '/bike-insurance' },
              { brand: 'TVS', count: vehicles.filter(v => v.brand === 'TVS').length, href: '/bike-insurance' },
            ].map(item => (
              <Link key={item.brand} href={item.href}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{item.brand}</p>
                      <p className="text-[10px] text-muted-foreground">{item.count} {pt(pageText.brandWise.models, language)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* EV vs Petrol Comparison */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.evVsPetrol.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.evVsPetrol.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">{pt(pageText.evVsPetrol.thFeature, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.evVsPetrol.thEv, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.evVsPetrol.thPetrol, language)}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3 text-center text-emerald-700 dark:text-emerald-400">{row.ev}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.petrol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Key Add-ons for New Vehicles */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.addons.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.addons.desc, language)}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: pt(pageText.addons.zeroDep, language), desc: pt(pageText.addons.zeroDepDesc, language), icon: Shield, cost: '~15-20% of OD' },
              { name: pt(pageText.addons.rti, language), desc: pt(pageText.addons.rtiDesc, language), icon: IndianRupee, cost: '~₹2,000-4,000/yr' },
              { name: pt(pageText.addons.battery, language), desc: pt(pageText.addons.batteryDesc, language), icon: Battery, cost: '~₹2,000-6,000/yr' },
              { name: pt(pageText.addons.engine, language), desc: pt(pageText.addons.engineDesc, language), icon: Car, cost: '~₹1,500-3,000/yr' },
              { name: pt(pageText.addons.ncb, language), desc: pt(pageText.addons.ncbDesc, language), icon: Star, cost: '~₹1,000-2,000/yr' },
              { name: pt(pageText.addons.rsa, language), desc: pt(pageText.addons.rsaDesc, language), icon: Clock, cost: '~₹500-1,500/yr' },
            ].map((addon, i) => (
              <Card key={i} className="glass-card hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <addon.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-sm">{addon.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{addon.desc}</p>
                  <Badge variant="secondary" className="text-[10px]">{addon.cost}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Expert Insight */}
        <ExpertInsight
          insight={pt({ en: "For new vehicles, always buy comprehensive + zero depreciation + engine protect. This combo costs ~25% extra but saves ₹30,000-₹2,00,000 during claims. For EVs, battery protection add-on is non-negotiable — battery replacement costs ₹3-6 Lakh for cars. Don't buy insurance at the showroom; compare online and save 20-30%.", hi: "नए वाहनों के लिए, हमेशा कॉम्प्रिहेंसिव + ज़ीरो डेप्रिसिएशन + इंजन प्रोटेक्ट खरीदें। यह कॉम्बो ~25% अतिरिक्त लागता है लेकिन क्लेम में ₹30,000-₹2,00,000 बचाता है। EV के लिए, बैटरी प्रोटेक्शन ऐड-ऑन अनिवार्य है। शोरूम में बीमा मत खरीदें; ऑनलाइन तुलना करें और 20-30% बचाएँ।", hinglish: "New vehicles ke liye, always buy comprehensive + zero depreciation + engine protect. Yeh combo ~25% extra cost karta hai lekin claims mein ₹30,000-₹2,00,000 bachata hai. EVs ke liye, battery protection add-on non-negotiable hai. Showroom pe insurance mat khareedein; online compare karein aur 20-30% bachayein." }, language)}
          topic={pt({ en: "New Vehicle Insurance Strategy", hi: "नए वाहन बीमा रणनीति", hinglish: "New Vehicle Insurance Strategy" }, language)}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* FAQ Section */}
        <FAQSection faqs={faqs} title={pt({ en: "Vehicle Insurance FAQ — Most Asked Questions", hi: "वाहन बीमा सवाल-जवाब", hinglish: "Vehicle Insurance FAQ — Most Asked Questions" }, language)} />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* CTA Section */}
        <section className="text-center py-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
          <h2 className="text-2xl font-bold mb-3 gradient-text">{pt(pageText.cta.heading, language)}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {pt(pageText.cta.desc, language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue">
                <span>{pt(pageText.cta.ctaWhatsApp, language)}</span>
              </ShinyButton>
            </a>
            <Link href="/hub/motor-insurance">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.cta.ctaHub, language)}</span>
              </ShinyButton>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
