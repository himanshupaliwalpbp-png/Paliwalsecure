'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { vehicles } from '@/data/vehicles';
import { motorInsurers } from '@/data/insurers';
import {
  Car, Bike, Zap, Shield, IndianRupee, Wrench,
  ArrowRight, MessageCircle, ChevronRight, Star,
  FileCheck, RotateCcw, Gauge, Lock, Siren,
} from 'lucide-react';

// ── Translation helper ──────────────────────────────────────────────────────
type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

// ── Inline page translations ────────────────────────────────────────────────
const pageText = {
  hero: {
    badge: { en: "Motor Insurance Hub", hi: "मोटर इंश्योरेंस हब", hinglish: "Motor Insurance Hub" },
    title1: { en: "Motor Insurance Hub", hi: "मोटर इंश्योरेंस हब", hinglish: "Motor Insurance Hub" },
    title2: { en: "Car, Bike & EV Insurance Guide 2025", hi: "कार, बाइक और EV बीमा गाइड 2025", hinglish: "Car, Bike & EV Insurance Guide 2025" },
    desc: { en: "Complete motor insurance guide for India 2025. Car, bike, scooter & EV insurance rates, add-ons, claim process, and comparisons. Expert-curated data from IRDAI reports and top insurers.", hi: "भारत 2025 के लिए संपूर्ण मोटर बीमा गाइड। कार, बाइक, स्कूटर और EV बीमा दरें, ऐड-ऑन, क्लेम प्रक्रिया और तुलना। IRDAI रिपोर्ट और शीर्ष बीमाकर्ताओं के विशेषज्ञ डेटा।", hinglish: "India 2025 ke liye complete motor insurance guide. Car, bike, scooter & EV insurance rates, add-ons, claim process, aur comparisons. IRDAI reports aur top insurers se expert-curated data." },
    ctaWhatsApp: { en: "💬 Get Quote on WhatsApp", hi: "💬 WhatsApp पर कोटेशन लें", hinglish: "💬 WhatsApp pe Quote Lo" },
    ctaCompare: { en: "Compare Insurers →", hi: "बीमाकर्ताओं की तुलना करें →", hinglish: "Compare Insurers →" },
    stat1Val: { en: "₹3,416/yr", hi: "₹3,416/वर्ष", hinglish: "₹3,416/yr" },
    stat1Label: { en: "TP Rate (Car)", hi: "TP दर (कार)", hinglish: "TP Rate (Car)" },
    stat2Val: { en: "₹20,000/yr", hi: "₹20,000/वर्ष", hinglish: "₹20,000/yr" },
    stat2Label: { en: "Avg Comprehensive", hi: "औसत कॉम्प्रिहेंसिव", hinglish: "Avg Comprehensive" },
    stat3Val: { en: "15%", hi: "15%", hinglish: "15%" },
    stat3Label: { en: "EV Discount", hi: "EV छूट", hinglish: "EV Discount" },
    stat4Val: { en: "POSP IP429834", hi: "POSP IP429834", hinglish: "POSP IP429834" },
    stat4Label: { en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" },
  },
  popularCar: {
    heading: { en: "Popular Car Insurance", hi: "लोकप्रिय कार बीमा", hinglish: "Popular Car Insurance" },
    desc: { en: "Insurance rates for India's most popular cars. Click to get a personalized quote.", hi: "भारत की सबसे लोकप्रिय कारों की बीमा दरें। व्यक्तिगत कोटेशन प्राप्त करने के लिए क्लिक करें।", hinglish: "India ki sabse popular cars ki insurance rates. Personalized quote ke liye click karein." },
  },
  popularBike: {
    heading: { en: "Popular Bike Insurance", hi: "लोकप्रिय बाइक बीमा", hinglish: "Popular Bike Insurance" },
    desc: { en: "Two-wheeler insurance rates for top bikes and scooters in India.", hi: "भारत में शीर्ष बाइक और स्कूटर के लिए द्विपहिया बीमा दरें।", hinglish: "India mein top bikes aur scooters ke liye two-wheeler insurance rates." },
  },
  evInsurance: {
    heading: { en: "EV Insurance — Electric Cars & Scooters", hi: "EV बीमा — इलेक्ट्रिक कार और स्कूटर", hinglish: "EV Insurance — Electric Cars & Scooters" },
    desc: { en: "Electric vehicles get 15% discount on TP premiums by IRDAI. Battery protection add-on is a must for EVs.", hi: "इलेक्ट्रिक वाहनों को IRDAI द्वारा TP प्रीमियम पर 15% छूट मिलती है। EV के लिए बैटरी प्रोटेक्शन ऐड-ऑन ज़रूरी है।", hinglish: "Electric vehicles ko IRDAI dwara TP premium pe 15% discount milti hai. EV ke liye battery protection add-on zaroori hai." },
    discount: { en: "15% EV Discount", hi: "15% EV छूट", hinglish: "15% EV Discount" },
    viewAll: { en: "View All Vehicles →", hi: "सभी वाहन देखें →", hinglish: "View All Vehicles →" },
  },
  irdaiRates: {
    heading: { en: "IRDAI TP Rates — Fixed by Regulator", hi: "IRDAI TP दरें — नियामक द्वारा निर्धारित", hinglish: "IRDAI TP Rates — Fixed by Regulator" },
    desc: { en: "Third-party motor insurance rates are fixed by IRDAI and are the same across all insurers. You cannot negotiate these rates.", hi: "थर्ड-पार्टी मोटर बीमा दरें IRDAI द्वारा तय होती हैं और सभी बीमाकर्ताओं के लिए समान हैं। आप इन दरों पर बातचीत नहीं कर सकते।", hinglish: "Third-party motor insurance rates IRDAI dwara fix hoti hain aur sab insurers ke liye same hain. Aap in rates pe negotiate nahi kar sakte." },
    thType: { en: "Vehicle Type", hi: "वाहन प्रकार", hinglish: "Vehicle Type" },
    th1yr: { en: "1-Year TP", hi: "1-वर्ष TP", hinglish: "1-Year TP" },
    th3yr: { en: "3-Year TP", hi: "3-वर्ष TP", hinglish: "3-Year TP" },
    th5yr: { en: "5-Year TP", hi: "5-वर्ष TP", hinglish: "5-Year TP" },
    carUpTo1000: { en: "Car (up to 1000cc)", hi: "कार (1000cc तक)", hinglish: "Car (up to 1000cc)" },
    car1000To1500: { en: "Car (1000-1500cc)", hi: "कार (1000-1500cc)", hinglish: "Car (1000-1500cc)" },
    carAbove1500: { en: "Car (above 1500cc)", hi: "कार (1500cc से अधिक)", hinglish: "Car (above 1500cc)" },
    bikeUpTo75: { en: "Bike (up to 75cc)", hi: "बाइक (75cc तक)", hinglish: "Bike (up to 75cc)" },
    bike75to150: { en: "Bike (75-150cc)", hi: "बाइक (75-150cc)", hinglish: "Bike (75-150cc)" },
    bike150to350: { en: "Bike (150-350cc)", hi: "बाइक (150-350cc)", hinglish: "Bike (150-350cc)" },
    bikeAbove350: { en: "Bike (above 350cc)", hi: "बाइक (350cc से अधिक)", hinglish: "Bike (above 350cc)" },
  },
  comparison: {
    heading: { en: "Motor Insurer Comparison", hi: "मोटर बीमाकर्ता तुलना", hinglish: "Motor Insurer Comparison" },
    desc: { en: "Side-by-side comparison of India's top motor insurers. CSR, garage network, OD rates, and claim ratings.", hi: "भारत के शीर्ष मोटर बीमाकर्ताओं की समानांतर तुलना। CSR, गैराज नेटवर्क, OD दरें और क्लेम रेटिंग।", hinglish: "India ke top motor insurers ka side-by-side comparison. CSR, garage network, OD rates, aur claim ratings." },
    thInsurer: { en: "Insurer", hi: "बीमाकर्ता", hinglish: "Insurer" },
    thCsr: { en: "CSR", hi: "CSR", hinglish: "CSR" },
    thGarage: { en: "Garage Network", hi: "गैराज नेटवर्क", hinglish: "Garage Network" },
    thOdRate: { en: "OD Rate", hi: "OD दर", hinglish: "OD Rate" },
    thClaim: { en: "Claim Rating", hi: "क्लेम रेटिंग", hinglish: "Claim Rating" },
  },
  addons: {
    heading: { en: "Motor Insurance Add-ons", hi: "मोटर बीमा ऐड-ऑन", hinglish: "Motor Insurance Add-ons" },
    desc: { en: "Essential add-on covers that protect you from out-of-pocket expenses during claims. Choose wisely based on your vehicle age and usage.", hi: "आवश्यक ऐड-ऑन कवर जो क्लेम के दौरान आपको अपनी जेब से खर्चे से बचाते हैं। अपने वाहन की आयु और उपयोग के आधार पर समझदारी से चुनें।", hinglish: "Essential add-on covers jo claim ke dauraan aapko out-of-pocket expenses se bachate hain. Apne vehicle ki age aur usage ke basis pe wisely choose karein." },
    zeroDep: { en: "Zero Depreciation", hi: "ज़ीरो डेप्रिसिएशन", hinglish: "Zero Depreciation" },
    zeroDepDesc: { en: "No depreciation deducted on parts. Get full claim amount for repairs. Must-have for new cars under 5 years.", hi: "पुर्जों पर कोई ह्रास नहीं। मरम्मत के लिए पूरा क्लेम राशि। 5 वर्ष से कम की नई कारों के लिए ज़रूरी।", hinglish: "Parts pe koi depreciation nahi. Full claim amount for repairs. Must-have for new cars under 5 years." },
    engineProtect: { en: "Engine Protect", hi: "इंजन प्रोटेक्ट", hinglish: "Engine Protect" },
    engineProtectDesc: { en: "Covers engine damage from waterlogging, hydrostatic lock, and coolant leakage. Critical in monsoon cities.", hi: "जलभराव, हाइड्रोस्टैटिक लॉक और कूलेंट रिसाव से इंजन डैमेज कवर। मानसून शहरों में अत्यंत ज़रूरी।", hinglish: "Engine damage from waterlogging, hydrostatic lock, aur coolant leakage cover karta hai. Monsoon cities mein critical." },
    rsa: { en: "Roadside Assistance", hi: "रोडसाइड असिस्टेंस", hinglish: "Roadside Assistance" },
    rsaDesc: { en: "24/7 emergency support — towing, flat tyre, fuel delivery, battery jumpstart. Essential for highway drivers.", hi: "24/7 आपातकालीन सहायता — टोइंग, फ्लैट टायर, ईंधन, बैटरी जंपस्टार्ट। हाईवे ड्राइवरों के लिए ज़रूरी।", hinglish: "24/7 emergency support — towing, flat tyre, fuel delivery, battery jumpstart. Highway drivers ke liye zaroori." },
    rti: { en: "Return to Invoice", hi: "रिटर्न टू इनवॉइस", hinglish: "Return to Invoice" },
    rtiDesc: { en: "Get full invoice value if car is stolen or totalled — not just IDV. Must-have for new expensive cars.", hi: "कार चोरी या टोटल लॉस होने पर पूर्ण इनवॉइस मूल्य — केवल IDV नहीं। नई महंगी कारों के लिए ज़रूरी।", hinglish: "Full invoice value if car stolen or totalled — not just IDV. Must-have for new expensive cars." },
    consumables: { en: "Consumables Cover", hi: "कंस्यूमेबल्स कवर", hinglish: "Consumables Cover" },
    consumablesDesc: { en: "Covers engine oil, coolant, brake fluid, nuts, bolts used during repairs. Saves ₹3,000-₹8,000 per claim.", hi: "मरम्मत में इस्तेमाल इंजन ऑयल, कूलेंट, ब्रेक फ्लूइड कवर। प्रति क्लेम ₹3,000-₹8,000 बचाता है।", hinglish: "Engine oil, coolant, brake fluid used during repairs cover karta hai. Per claim ₹3,000-₹8,000 bachata hai." },
    ncbProtection: { en: "NCB Protection", hi: "NCB प्रोटेक्शन", hinglish: "NCB Protection" },
    ncbProtectionDesc: { en: "Protects your No Claim Bonus even after one claim. Your accumulated 20-50% discount stays intact.", hi: "एक क्लेम के बाद भी आपका नो क्लेम बोनस सुरक्षित। आपका 20-50% जमा डिस्काउंट बना रहता है।", hinglish: "Your No Claim Bonus stays safe even after one claim. Accumulated 20-50% discount stays intact." },
  },
  claimProcess: {
    heading: { en: "Motor Insurance Claim Process", hi: "मोटर बीमा क्लेम प्रक्रिया", hinglish: "Motor Insurance Claim Process" },
    step1: { en: "1. Inform Insurer", hi: "1. बीमाकर्ता को सूचित करें", hinglish: "1. Insurer ko Inform Karein" },
    step1Desc: { en: "Call insurer helpline within 48 hours of accident. Get claim reference number.", hi: "दुर्घटना के 48 घंटे के भीतर बीमाकर्ता हेल्पलाइन पर कॉल करें। क्लेम संदर्भ संख्या प्राप्त करें।", hinglish: "Accident ke 48 ghanton ke andar insurer helpline pe call karein. Claim reference number paayein." },
    step2: { en: "2. Survey & Documentation", hi: "2. सर्वेक्षण और दस्तावेज़", hinglish: "2. Survey & Documentation" },
    step2Desc: { en: "Do not repair before surveyor inspection. Collect FIR copy, photos, and repair estimate.", hi: "सर्वेयर निरीक्षण से पहले मरम्मत न करें। FIR कॉपी, फ़ोटो और मरम्मत अनुमान जमा करें।", hinglish: "Surveyor inspection se pehle repair mat karein. FIR copy, photos, aur repair estimate collect karein." },
    step3: { en: "3. Repair at Network Garage", hi: "3. नेटवर्क गैराज में मरम्मत", hinglish: "3. Network Garage mein Repair" },
    step3Desc: { en: "Get cashless repair at network garage or submit bills for reimbursement.", hi: "नेटवर्क गैराज में कैशलेस मरम्मत या प्रतिपूर्ति के लिए बिल जमा करें।", hinglish: "Network garage mein cashless repair ya reimbursement ke liye bills submit karein." },
    step4: { en: "4. Claim Settlement", hi: "4. क्लेम निपटान", hinglish: "4. Claim Settlement" },
    step4Desc: { en: "Insurer settles directly with garage (cashless) or reimburses you within 30 days.", hi: "बीमाकर्ता गैराज के साथ सीधे निपटान (कैशलेस) या 30 दिनों में प्रतिपूर्ति करता है।", hinglish: "Insurer garage ke saath directly settle (cashless) ya 30 dino mein reimburse karta hai." },
    detailedGuide: { en: "Detailed Claim Guide →", hi: "विस्तृत क्लेम गाइड →", hinglish: "Detailed Claim Guide →" },
  },
  cta: {
    heading: { en: "Get the Best Motor Insurance Quote", hi: "सर्वोत्तम मोटर बीमा कोटेशन प्राप्त करें", hinglish: "Best Motor Insurance Quote Lo" },
    desc: { en: "Compare 10+ insurers, get AI-powered recommendations, and save up to 50% on your premium. Free consultation with IRDAI-certified advisor Himanshu Paliwal (POSP Code: IP429834).", hi: "10+ बीमाकर्ताओं की तुलना करें, AI-संचालित सिफारिशें प्राप्त करें और प्रीमियम पर 50% तक की बचत करें। IRDAI-प्रमाणित सलाहकार हिमांशु पालीवाल (POSP कोड: IP429834) से मुफ़्त परामर्श।", hinglish: "10+ insurers compare karein, AI-powered recommendations paayein, aur premium pe 50% tak bachat karein. IRDAI-certified advisor Himanshu Paliwal (POSP Code: IP429834) se free consultation." },
    ctaWhatsApp: { en: "💬 Get Quote on WhatsApp", hi: "💬 WhatsApp पर कोटेशन लें", hinglish: "💬 WhatsApp pe Quote Lo" },
    ctaCompare: { en: "Compare Insurers →", hi: "बीमाकर्ताओं की तुलना करें →", hinglish: "Compare Insurers →" },
  },
};

export default function ClientContent() {
  const { language } = useLanguage();

  const cars = vehicles.filter(v => v.category === 'car').slice(0, 8);
  const bikes = vehicles.filter(v => v.category === 'bike').slice(0, 6);
  const evs = vehicles.filter(v => v.isEV).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        {/* Floating Orbs */}
        <div className="orb-1 absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="orb-2 absolute bottom-10 right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">{pt({ en: "Home", hi: "होम", hinglish: "Home" }, language)}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{pt(pageText.hero.badge, language)}</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Car className="h-3.5 w-3.5 mr-1" />
              {pt(pageText.hero.badge, language)}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {pt(pageText.hero.title1, language)}{' '}
              <span className="gradient-text">{pt(pageText.hero.title2, language)}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {pt(pageText.hero.desc, language)}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: IndianRupee, label: pt(pageText.hero.stat1Label, language), value: pt(pageText.hero.stat1Val, language) },
                { icon: Gauge, label: pt(pageText.hero.stat2Label, language), value: pt(pageText.hero.stat2Val, language) },
                { icon: Zap, label: pt(pageText.hero.stat3Label, language), value: pt(pageText.hero.stat3Val, language) },
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="blue">
                  <span>{pt(pageText.hero.ctaWhatsApp, language)}</span>
                </ShinyButton>
              </a>
              <Link href="/compare">
                <ShinyButton variant="secondary">
                  <span>{pt(pageText.hero.ctaCompare, language)}</span>
                </ShinyButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">

        {/* Popular Cars */}
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
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Popular Bikes */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.popularBike.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.popularBike.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {bikes.map(bike => (
              <Link key={bike.slug} href={`/insurance/${bike.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <Bike className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-sm font-semibold">{bike.brand} {bike.name}</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(bike.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* EV Insurance */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Zap className="h-6 w-6 text-emerald-600" />
            <span className="gradient-text">{pt(pageText.evInsurance.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.evInsurance.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {evs.map(ev => (
              <Link key={ev.slug} href={`/insurance/${ev.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-emerald-500/30 transition-all cursor-pointer h-full bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
                  <CardContent className="p-3 text-center">
                    <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                    <p className="text-sm font-semibold">{ev.brand} {ev.name}</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(ev.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                    <Badge className="mt-1.5 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" variant="secondary">
                      {pt(pageText.evInsurance.discount, language)}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/bike-insurance">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.evInsurance.viewAll, language)}</span>
              </ShinyButton>
            </Link>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* IRDAI TP Rates Table */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <IndianRupee className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.irdaiRates.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.irdaiRates.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">{pt(pageText.irdaiRates.thType, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.irdaiRates.th1yr, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.irdaiRates.th3yr, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.irdaiRates.th5yr, language)}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: pt(pageText.irdaiRates.carUpTo1000, language), one: '₹2,861', three: '₹8,583', five: '—' },
                  { type: pt(pageText.irdaiRates.car1000To1500, language), one: '₹3,416', three: '₹10,248', five: '—' },
                  { type: pt(pageText.irdaiRates.carAbove1500, language), one: '₹7,890', three: '₹23,670', five: '—' },
                  { type: pt(pageText.irdaiRates.bikeUpTo75, language), one: '₹538', three: '—', five: '₹2,690' },
                  { type: pt(pageText.irdaiRates.bike75to150, language), one: '₹1,194', three: '—', five: '₹5,970' },
                  { type: pt(pageText.irdaiRates.bike150to350, language), one: '₹1,366', three: '—', five: '₹6,830' },
                  { type: pt(pageText.irdaiRates.bikeAbove350, language), one: '₹3,443', three: '—', five: '₹17,215' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                    <td className="p-3 font-medium">{row.type}</td>
                    <td className="p-3 text-center">{row.one}</td>
                    <td className="p-3 text-center">{row.three}</td>
                    <td className="p-3 text-center">{row.five}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Motor Comparisons */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.comparison.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.comparison.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">{pt(pageText.comparison.thInsurer, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.comparison.thCsr, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.comparison.thGarage, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.comparison.thOdRate, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.comparison.thClaim, language)}</th>
                </tr>
              </thead>
              <tbody>
                {motorInsurers.map((ins, i) => (
                  <tr key={ins.slug} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                    <td className="p-3 font-medium">{ins.name}</td>
                    <td className="p-3 text-center">{ins.csr}%</td>
                    <td className="p-3 text-center">{(ins.networkGarages ?? 0).toLocaleString()}+</td>
                    <td className="p-3 text-center">{ins.odRatePercent}%</td>
                    <td className="p-3 text-center">{'⭐'.repeat(ins.claimProcessRating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Add-ons Section */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.addons.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.addons.desc, language)}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: pt(pageText.addons.zeroDep, language), desc: pt(pageText.addons.zeroDepDesc, language), icon: Shield, cost: '~15-20% of OD' },
              { name: pt(pageText.addons.engineProtect, language), desc: pt(pageText.addons.engineProtectDesc, language), icon: Wrench, cost: '~₹1,500-3,000/yr' },
              { name: pt(pageText.addons.rsa, language), desc: pt(pageText.addons.rsaDesc, language), icon: Siren, cost: '~₹500-1,500/yr' },
              { name: pt(pageText.addons.rti, language), desc: pt(pageText.addons.rtiDesc, language), icon: FileCheck, cost: '~₹2,000-4,000/yr' },
              { name: pt(pageText.addons.consumables, language), desc: pt(pageText.addons.consumablesDesc, language), icon: Lock, cost: '~₹800-1,500/yr' },
              { name: pt(pageText.addons.ncbProtection, language), desc: pt(pageText.addons.ncbProtectionDesc, language), icon: RotateCcw, cost: '~₹1,000-2,000/yr' },
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

        {/* Claim Process */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.claimProcess.heading, language)}</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: pt(pageText.claimProcess.step1, language), desc: pt(pageText.claimProcess.step1Desc, language) },
              { step: 2, title: pt(pageText.claimProcess.step2, language), desc: pt(pageText.claimProcess.step2Desc, language) },
              { step: 3, title: pt(pageText.claimProcess.step3, language), desc: pt(pageText.claimProcess.step3Desc, language) },
              { step: 4, title: pt(pageText.claimProcess.step4, language), desc: pt(pageText.claimProcess.step4Desc, language) },
            ].map(s => (
              <Card key={s.step} className="glass-card hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-2">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/claim-guide">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.claimProcess.detailedGuide, language)}</span>
              </ShinyButton>
            </Link>
          </div>
        </section>

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
            <Link href="/compare">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.cta.ctaCompare, language)}</span>
              </ShinyButton>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
