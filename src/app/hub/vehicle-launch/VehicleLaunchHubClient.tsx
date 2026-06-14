'use client';

import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { vehicles } from '@/data/vehicles';
import { useLanguage, type Language } from '@/lib/i18n';
import { t as tStandalone } from '@/lib/i18n';
import {
  Car, Bike, Zap, Shield, IndianRupee, ArrowRight,
  MessageCircle, ChevronRight, Star, Clock, Battery,
  Gauge, Sparkles, TrendingUp,
} from 'lucide-react';

// ── Localized EV vs Petrol comparison rows ──────────────────────────────────
function getLocalizedComparisonRows(language: Language) {
  const t = (key: string) => tStandalone(key, language);

  return [
    { feature: t('vehicleHub.tpPremium'), ev: t('vehicleHub.tpPremiumEv'), petrol: t('vehicleHub.tpPremiumPetrol') },
    { feature: t('vehicleHub.comprehensivePremium'), ev: t('vehicleHub.comprehensivePremiumEv'), petrol: t('vehicleHub.comprehensivePremiumPetrol') },
    { feature: t('vehicleHub.batteryCover'), ev: t('vehicleHub.batteryCoverEv'), petrol: t('vehicleHub.batteryCoverPetrol') },
    { feature: t('vehicleHub.engineProtect'), ev: t('vehicleHub.engineProtectEv'), petrol: t('vehicleHub.engineProtectPetrol') },
    { feature: t('vehicleHub.taxBenefit'), ev: t('vehicleHub.taxBenefitEv'), petrol: t('vehicleHub.taxBenefitPetrol') },
    { feature: t('vehicleHub.chargingCover'), ev: t('vehicleHub.chargingCoverEv'), petrol: t('vehicleHub.chargingCoverPetrol') },
  ];
}

// ── Localized add-on data ───────────────────────────────────────────────────
function getLocalizedAddons(language: Language) {
  const t = (key: string) => tStandalone(key, language);

  return [
    { name: t('vehicleHub.addon.zeroDep.name'), desc: t('vehicleHub.addon.zeroDep.desc'), icon: Shield, cost: '~15-20% of OD' },
    { name: t('vehicleHub.addon.returnToInvoice.name'), desc: t('vehicleHub.addon.returnToInvoice.desc'), icon: IndianRupee, cost: '~₹2,000-4,000/yr' },
    { name: t('vehicleHub.addon.batteryProtection.name'), desc: t('vehicleHub.addon.batteryProtection.desc'), icon: Battery, cost: '~₹2,000-6,000/yr' },
    { name: t('vehicleHub.addon.engineProtect.name'), desc: t('vehicleHub.addon.engineProtect.desc'), icon: Car, cost: '~₹1,500-3,000/yr' },
    { name: t('vehicleHub.addon.ncbProtection.name'), desc: t('vehicleHub.addon.ncbProtection.desc'), icon: Star, cost: '~₹1,000-2,000/yr' },
    { name: t('vehicleHub.addon.roadsideAssistance.name'), desc: t('vehicleHub.addon.roadsideAssistance.desc'), icon: Clock, cost: '~₹500-1,500/yr' },
  ];
}

// ── Localized FAQs ──────────────────────────────────────────────────────────
function getLocalizedFAQs(language: Language) {
  if (language === 'hi') {
    return [
      {
        question: 'भारत में नई कार इंश्योरेंस की लागत कितनी है?',
        answer: 'नई कार की कॉम्प्रिहेंसिव इंश्योरेंस ₹6,000-₹40,000/वर्ष तक काम करती है, जो कार की एक्स-शोरूम कीमत, इंजन CC और ऐड-ऑन पर निर्भर करती है। थर्ड पार्टी दरें IRDAI द्वारा निर्धारित हैं: ₹2,861 (< 1000cc), ₹3,416 (1000-1500cc), ₹7,890 (> 1500cc)। नई कारों के लिए ज़ीरो डेप्रिसिएशन ऐड-ऑन की अत्यधिक सिफारिश की जाती है।',
      },
      {
        question: 'क्या EV इंश्योरेंस पेट्रोल/डीज़ल कार इंश्योरेंस से सस्ती है?',
        answer: 'EV थर्ड पार्टी इंश्योरेंस समकक्ष ICE वाहनों से 15% सस्ती है (IRDAI छूट)। हालांकि, कॉम्प्रिहेंसिव EV इंश्योरेंस महंगी बैटरी बदलाव लागत के कारण 10-20% अधिक हो सकती है। कुल मिलाकर, EV ईंधन और TP प्रीमियम पर बचत करते हैं, लेकिन बैटरी प्रोटेक्शन ऐड-ऑन ज़रूरी है और लागत बढ़ाता है।',
      },
      {
        question: 'IRDAI का 15% EV इंश्योरेंस छूट क्या है?',
        answer: 'IRDAI सभी इलेक्ट्रिक वाहनों पर थर्ड पार्टी प्रीमियम में 15% छूट अनिवार्य करता है। उदाहरण के लिए, यदि 1000-1500cc के लिए मानक TP दर ₹3,416 है, तो समकक्ष EV ₹2,904 चुकाता है। यह छूट केवल TP पर लागू होती है, ओन डैमेज प्रीमियम पर नहीं। इसे भारत में EV अपनाने को बढ़ावा देने के लिए पेश किया गया था।',
      },
      {
        question: 'नई कार के लिए कौन से ऐड-ऑन खरीदने चाहिए?',
        answer: 'नई कारों के लिए ज़रूरी ऐड-ऑन: ज़ीरो डेप्रिसिएशन (मूल्यह्रास कटौती के बिना पूरा क्लेम), रिटर्न टू इनवॉइस (चोरी/टोटल लॉस पर एक्स-शोरूम कीमत), इंजन प्रोटेक्ट (पानी से डैमेज), और NCB प्रोटेक्शन (क्लेम के बाद भी डिस्काउंट)। यह कॉम्बो ~25% अतिरिक्त लागता है लेकिन क्लेम में ₹30,000-₹2,00,000 बचाता है।',
      },
      {
        question: 'क्या EV इंश्योरेंस के लिए बैटरी प्रोटेक्शन ऐड-ऑन ज़रूरी है?',
        answer: 'हाँ, बिल्कुल! बैटरी बदलाव की लागत EV कारों के लिए ₹3-6 लाख और EV स्कूटरों के लिए ₹40,000-₹80,000 है। मानक कॉम्प्रिहेंसिव पॉलिसी बैटरी डिग्रेडेशन या चार्जिंग से डैमेज को कवर नहीं करती। बैटरी प्रोटेक्शन ऐड-ऑन इस महत्वपूर्ण घटक को कवर करता है। इसके बिना, आपको बैटरी बदलाव की पूरी लागत वहन करनी पड़ती है।',
      },
      {
        question: 'नए वाहन का IDV क्या है?',
        answer: 'एक बिल्कुल नए वाहन के लिए, IDV = एक्स-शोरूम कीमत × 0.95 (वर्ष 1 में 5% मूल्यह्रास)। उदाहरण के लिए, ₹10 लाख एक्स-शोरूम कार का IDV ₹9.5 लाख है। उच्च IDV का अर्थ अधिक प्रीमियम लेकिन बेहतर क्लेम भुगतान। हमेशा सुनिश्चित करें कि आपका IDV सही सेट है — बीमाकर्ताओं को प्रीमियम कम करने के लिए इसे कम न करने दें।',
      },
      {
        question: 'क्या वाहन डिलीवरी से पहले इंश्योरेंस खरीद सकते हैं?',
        answer: 'हाँ, आप डिलीवरी से पहले इंश्योरेंस खरीद सकते हैं और खरीदना चाहिए। अधिकांश डीलर शोरूम में इंश्योरेंस ऑफर करते हैं, लेकिन यह अक्सर 20-30% अधिक महंगी होती है। कई बीमाकर्ताओं से ऑनलाइन कोटेशन लें और अलग से खरीदें। आपको कोटेशन के लिए वाहन की एक्स-शोरूम कीमत और इंजन CC की ज़रूरत है। पॉलिसी डिलीवरी तिथि पर सक्रिय होती है।',
      },
    ];
  }

  if (language === 'hinglish') {
    return [
      {
        question: 'India mein naye car insurance ki cost kitni hai?',
        answer: 'New car comprehensive insurance costs ₹6,000-₹40,000/year depending on the car\'s ex-showroom price, engine CC, and add-ons. Third-party rates are fixed by IRDAI: ₹2,861 (< 1000cc), ₹3,416 (1000-1500cc), ₹7,890 (> 1500cc). Zero Depreciation add-on is highly recommended for new cars.',
      },
      {
        question: 'Kya EV insurance petrol/diesel car insurance se sasti hai?',
        answer: 'EV third-party insurance 15% cheaper hai equivalent ICE vehicles se (IRDAI discount). Lekin, comprehensive EV insurance expensive battery replacement costs ki wajah se 10-20% higher ho sakti hai. Overall, EVs fuel aur TP premium pe bachat karte hain, lekin battery protection add-on zaroori hai aur cost badhata hai.',
      },
      {
        question: 'IRDAI ka 15% EV insurance discount kya hai?',
        answer: 'IRDAI mandates 15% discount on third-party premiums for all electric vehicles. For example, agar standard TP rate for 1000-1500cc ₹3,416 hai, toh equivalent EV ₹2,904 pay karta hai. Yeh discount sirf TP par apply hoti hai, own-damage premium par nahi. India mein EV adoption promote karne ke liye introduce kiya gaya tha.',
      },
      {
        question: 'Naye car ke liye kaun se add-ons khareedne chahiye?',
        answer: 'Must-have add-ons for new cars: Zero Depreciation (full claim without depreciation cut), Return to Invoice (ex-showroom price if stolen/totalled), Engine Protect (water damage), aur NCB Protection (saves your discount even after a claim). Yeh combo ~25% extra cost karta hai lekin claims mein ₹30,000-₹2,00,000 bachata hai.',
      },
      {
        question: 'Kya EV insurance ke liye battery protection add-on zaroori hai?',
        answer: 'Haan, bilkul! Battery replacement costs ₹3-6 Lakh for EV cars aur ₹40,000-₹80,000 for EV scooters. Standard comprehensive policies do NOT cover battery degradation ya charging se damage. Battery protection add-on is critical component ko cover karta hai. Without it, aapko battery replacement ki poori cost bear karni padti hai.',
      },
      {
        question: 'Naye vehicle ka IDV kya hai?',
        answer: 'Brand new vehicle ke liye, IDV = Ex-showroom price × 0.95 (5% depreciation year 1 mein). For example, ₹10 Lakh ex-showroom car ka IDV ₹9.5 Lakh hai. Higher IDV means higher premium lekin better claim payout. Always ensure your IDV is set correctly — insurers ko premium reduce karne ke liye IDV kam karne mat dein.',
      },
      {
        question: 'Kya vehicle delivery se pehle insurance khareed sakte hain?',
        answer: 'Haan, aap delivery se pehle insurance khareed sakte hain aur khareedna chahiye. Most dealers insurance showroom pe offer karte hain, lekin yeh often 20-30% more expensive hoti hai. Multiple insurers se online quotes lo aur separately khareedein. Aapko vehicle ki ex-showroom price aur engine CC chahiye quote ke liye. Policy delivery date par activate hoti hai.',
      },
    ];
  }

  // English (default)
  return [
    {
      question: 'How much does new car insurance cost in India?',
      answer: 'New car comprehensive insurance costs ₹6,000-₹40,000/year depending on the car\'s ex-showroom price, engine CC, and add-ons. Third-party rates are fixed by IRDAI: ₹2,861 (< 1000cc), ₹3,416 (1000-1500cc), ₹7,890 (> 1500cc). Zero Depreciation add-on is highly recommended for new cars.',
    },
    {
      question: 'Is EV insurance cheaper than petrol/diesel car insurance?',
      answer: 'EV third-party insurance is 15% cheaper than equivalent ICE vehicles (IRDAI discount). However, comprehensive EV insurance can be 10-20% higher due to expensive battery replacement costs. Overall, EVs save on fuel and TP premium, but battery protection add-on is essential and adds to the cost.',
    },
    {
      question: 'What is the 15% EV insurance discount by IRDAI?',
      answer: 'IRDAI mandates 15% discount on third-party premiums for all electric vehicles. For example, if the standard TP rate for 1000-1500cc is ₹3,416, an equivalent EV pays ₹2,904. This discount applies only to TP, not to own-damage premium. It was introduced to promote EV adoption in India.',
    },
    {
      question: 'Which add-ons should I buy for a new car?',
      answer: 'Must-have add-ons for new cars: Zero Depreciation (full claim without depreciation cut), Return to Invoice (get ex-showroom price if stolen/totalled), Engine Protect (covers water damage), and NCB Protection (saves your discount even after a claim). This combo costs ~25% extra but saves ₹30,000-₹2,00,000 during claims.',
    },
    {
      question: 'Do I need battery protection add-on for EV insurance?',
      answer: 'Yes, absolutely. Battery replacement costs ₹3-6 Lakh for EV cars and ₹40,000-₹80,000 for EV scooters. Standard comprehensive policies do NOT cover battery degradation or damage from charging. Battery protection add-on covers this critical component. Without it, you bear the full cost of battery replacement.',
    },
    {
      question: 'What is IDV for a new vehicle?',
      answer: 'For a brand new vehicle, IDV = Ex-showroom price × 0.95 (5% depreciation in year 1). For example, a ₹10 Lakh ex-showroom car has IDV of ₹9.5 Lakh. Higher IDV means higher premium but better claim payout. Always ensure your IDV is set correctly — don\'t let insurers lower it to reduce premium.',
    },
    {
      question: 'Can I buy insurance before vehicle delivery?',
      answer: 'Yes, you can and should buy insurance before delivery. Most dealers offer insurance at the showroom, but it\'s often 20-30% more expensive. Get quotes from multiple insurers online and buy separately. You need the vehicle\'s ex-showroom price and engine CC to get a quote. The policy activates on the delivery date.',
    },
  ];
}

export default function VehicleLaunchHubClient() {
  const { t, language } = useLanguage();

  const cars = vehicles.filter(v => v.category === 'car' && !v.isEV).slice(0, 8);
  const evCars = vehicles.filter(v => v.isEV && v.category === 'car');
  const evScooters = vehicles.filter(v => v.isEV && v.category === 'scooter');
  const bikes = vehicles.filter(v => v.category === 'bike').slice(0, 6);
  const scooters = vehicles.filter(v => v.category === 'scooter' && !v.isEV).slice(0, 4);

  const comparisonRows = getLocalizedComparisonRows(language);
  const addons = getLocalizedAddons(language);
  const faqs = getLocalizedFAQs(language);

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary">{t('vehicleHub.home')}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{t('vehicleHub.breadcrumb')}</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                {t('vehicleHub.badge')}
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Vehicle Launch Hub —{' '}
                <span className="text-primary">{t('vehicleHub.titleHighlight')}</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('vehicleHub.description')}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { icon: IndianRupee, label: t('vehicleHub.evTPDiscount'), value: '15%' },
                  { icon: Battery, label: t('vehicleHub.evCarsScooters'), value: `${evCars.length + evScooters.length}+` },
                  { icon: Gauge, label: t('vehicleHub.totalVehicles'), value: `${vehicles.length}+` },
                  { icon: Shield, label: t('vehicleHub.irdaiCertified'), value: 'POSP IP429834' },
                ].map((stat, i) => (
                  <Card key={i} className="bg-background/80 backdrop-blur">
                    <CardContent className="p-3 text-center">
                      <stat.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-sm font-bold">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t('vehicleHub.getQuote')}
                </Button>
              </a>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">

          {/* EV Cars Section */}
          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Zap className="h-6 w-6 text-emerald-600" />
              {t('vehicleHub.electricCarInsurance')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('vehicleHub.electricCarDesc')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {evCars.map(ev => (
                <Link key={ev.slug} href={`/insurance/${ev.slug}`}>
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
                    <CardContent className="p-3 text-center">
                      <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                      <p className="text-sm font-semibold">{ev.brand} {ev.name}</p>
                      <p className="text-xs text-muted-foreground">IDV: ₹{(ev.idv / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-muted-foreground">TP: ₹{(ev.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                      <Badge className="mt-1.5 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" variant="secondary">
                        {t('vehicleHub.evDiscount')}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <Separator />

          {/* EV Scooters Section */}
          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Zap className="h-6 w-6 text-lime-600" />
              {t('vehicleHub.electricScooterInsurance')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('vehicleHub.electricScooterDesc')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {evScooters.map(ev => (
                <Link key={ev.slug} href={`/insurance/${ev.slug}`}>
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full bg-gradient-to-br from-lime-50/50 to-transparent dark:from-lime-950/20">
                    <CardContent className="p-3 text-center">
                      <Zap className="h-5 w-5 text-lime-600 dark:text-lime-400 mx-auto mb-1" />
                      <p className="text-sm font-semibold">{ev.brand} {ev.name}</p>
                      <p className="text-xs text-muted-foreground">IDV: ₹{(ev.idv / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-muted-foreground">TP: ₹{(ev.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                      <Badge className="mt-1.5 text-[10px] bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300" variant="secondary">
                        {t('vehicleHub.evScooter')}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/blog/ev-insurance-india-guide">
                <Button variant="outline" className="gap-2">
                  {t('vehicleHub.completeEVGuide')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          <Separator />

          {/* Popular Car Launches */}
          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              {t('vehicleHub.popularCarInsurance')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('vehicleHub.popularCarDesc')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cars.map(car => (
                <Link key={car.slug} href={`/insurance/${car.slug}`}>
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
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
              {t('vehicleHub.showingTop8Cars')}{' '}
              <Link href="/car-insurance" className="text-primary hover:underline">
                {t('vehicleHub.viewAllCarInsurance')}
              </Link>
            </p>
          </section>

          <Separator />

          {/* Bike Launches */}
          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Bike className="h-6 w-6 text-primary" />
              {t('vehicleHub.popularBikeInsurance')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('vehicleHub.popularBikeDesc')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bikes.map(bike => (
                <Link key={bike.slug} href={`/insurance/${bike.slug}`}>
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
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
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                    <CardContent className="p-3 text-center">
                      <Bike className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                      <p className="text-sm font-semibold">{scooter.brand} {scooter.name}</p>
                      <p className="text-xs text-muted-foreground">TP: ₹{(scooter.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                      <Badge variant="secondary" className="mt-1 text-[10px]">{t('vehicleHub.scooter')}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              <Link href="/bike-insurance" className="text-primary hover:underline">
                {t('vehicleHub.viewAllBikeInsurance')}
              </Link>
            </p>
          </section>

          <Separator />

          {/* Brand-wise Insurance */}
          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              {t('vehicleHub.brandWiseInsurance')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('vehicleHub.brandWiseDesc')}
            </p>
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
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{item.brand}</p>
                        <p className="text-[10px] text-muted-foreground">{item.count} {t('vehicleHub.models')}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <Separator />

          {/* EV vs Petrol Comparison */}
          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              {t('vehicleHub.evVsPetrol')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('vehicleHub.evVsPetrolDesc')}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">{t('vehicleHub.feature')}</th>
                    <th className="text-center p-3 font-semibold">{t('vehicleHub.evInsurance')}</th>
                    <th className="text-center p-3 font-semibold">{t('vehicleHub.petrolInsurance')}</th>
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

          <Separator />

          {/* Key Add-ons for New Vehicles */}
          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              {t('vehicleHub.essentialAddons')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('vehicleHub.essentialAddonsDesc')}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addons.map((addon, i) => (
                <Card key={i}>
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

          <Separator />

          {/* Expert Insight */}
          <ExpertInsight
            insight={t('vehicleHub.expertInsight')}
            topic={t('vehicleHub.expertTopic')}
          />

          <Separator />

          {/* FAQ Section */}
          <FAQSection faqs={faqs} title={t('vehicleHub.faqTitle')} />

          <Separator />

          {/* CTA Section */}
          <section className="text-center py-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
            <h2 className="text-2xl font-bold mb-3">{t('vehicleHub.getInsuranceNewVehicle')}</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {t('vehicleHub.getInsuranceDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t('vehicleHub.getQuoteWhatsApp')}
                </Button>
              </a>
              <Link href="/hub/motor-insurance">
                <Button size="lg" variant="outline" className="gap-2">
                  {t('vehicleHub.motorInsuranceHub')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
}
