'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { cities } from '@/data/cities';
import { healthPlans } from '@/data/healthPlans';
import {
  Heart, MapPin, Clock, Users, ShieldCheck, Activity,
  ArrowRight, MessageCircle, IndianRupee, Building2,
  ChevronRight, Star, TrendingUp, Baby, Briefcase, Stethoscope,
} from 'lucide-react';

// ── Translation helper ──────────────────────────────────────────────────────
type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

// ── Inline page translations ────────────────────────────────────────────────
const pageText = {
  hero: {
    badge: { en: "Complete Guide", hi: "संपूर्ण गाइड", hinglish: "Complete Guide" },
    title1: { en: "Health Insurance Hub", hi: "हेल्थ इंश्योरेंस हब", hinglish: "Health Insurance Hub" },
    title2: { en: "Complete Guide for India 2025", hi: "भारत 2025 के लिए संपूर्ण गाइड", hinglish: "Complete Guide for India 2025" },
    desc: { en: "Compare plans by city, age, profession, and health condition. Expert-curated data from IRDAI reports and 6 top insurers.", hi: "शहर, आयु, पेशे और स्वास्थ्य स्थिति के अनुसार योजनाओं की तुलना करें। IRDAI रिपोर्ट और 6 शीर्ष बीमाकर्ताओं के विशेषज्ञ डेटा।", hinglish: "Plans compare karein by city, age, profession, aur health condition. IRDAI reports aur 6 top insurers se expert-curated data." },
    ctaWhatsApp: { en: "💬 Get Personalized Advice", hi: "💬 व्यक्तिगत सलाह लें", hinglish: "💬 Personalized Advice Lo" },
    stat1Val: { en: "₹8,500/yr", hi: "₹8,500/वर्ष", hinglish: "₹8,500/yr" },
    stat1Label: { en: "Avg Premium (₹10L)", hi: "औसत प्रीमियम (₹10L)", hinglish: "Avg Premium (₹10L)" },
    stat2Val: { en: "89%", hi: "89%", hinglish: "89%" },
    stat2Label: { en: "Avg CSR (Top 6)", hi: "औसत CSR (टॉप 6)", hinglish: "Avg CSR (Top 6)" },
    stat3Val: { en: "10,000+", hi: "10,000+", hinglish: "10,000+" },
    stat3Label: { en: "Network Hospitals", hi: "नेटवर्क अस्पताल", hinglish: "Network Hospitals" },
    stat4Val: { en: "POSP IP429834", hi: "POSP IP429834", hinglish: "POSP IP429834" },
    stat4Label: { en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" },
  },
  overview: {
    heading: { en: "Health Insurance in India — Overview", hi: "भारत में हेल्थ इंश्योरेंस — अवलोकन", hinglish: "Health Insurance India — Overview" },
    desc: { en: "Health insurance in India covers hospitalization expenses, day care procedures, and pre/post-hospitalization costs. With medical inflation at 14% annually and IRDAI removing the upper age limit for buying policies in 2025, having adequate health cover is more important than ever. India has 6 standalone health insurers and 24 general insurers offering health plans, with average premiums starting at ₹6,000/year for ₹10 lakh cover at age 30.", hi: "भारत में हेल्थ इंश्योरेंस अस्पताल में भर्त होने के खर्चे, डे केयर प्रक्रियाओं और भर्त होने से पहले/बाद के खर्चे कवर करता है। 14% वार्षिक चिकित्सा मुद्रास्फीति और 2025 में IRDAI द्वारा नीतियाँ खरीदने की अधिकतम आयु सीमा हटाने के साथ, पर्याप्त हेल्थ कवर होना पहले से भी ज़रूरी है।", hinglish: "Health insurance India mein hospitalization expenses, day care procedures, aur pre/post-hospitalization costs cover karta hai. 14% annual medical inflation aur 2025 mein IRDAI dwara upper age limit hatane ke saath, adequate health cover hona pehle se bhi zaroori hai." },
    card1Title: { en: "Cashless at 10,000+ Hospitals", hi: "10,000+ अस्पतालों में कैशलेस", hinglish: "Cashless at 10,000+ Hospitals" },
    card1Desc: { en: "Get treatment without paying upfront at network hospitals across India", hi: "भारत भर में नेटवर्क अस्पतालों में अग्रिम भुगतान किए बिना उपचार प्राप्त करें", hinglish: "Network hospitals across India mein upfront payment kiye bina treatment paayein" },
    card2Title: { en: "Tax Savings up to ₹75,000", hi: "₹75,000 तक कर बचत", hinglish: "Tax Savings up to ₹75,000" },
    card2Desc: { en: "Section 80D deduction for self + family + parents combined", hi: "स्वयं + परिवार + माता-पिता के लिए धारा 80D कटौती", hinglish: "Section 80D deduction self + family + parents ke liye combined" },
    card3Title: { en: "Lifelong Renewability", hi: "आजीवन नवीनीकरणीयता", hinglish: "Lifelong Renewability" },
    card3Desc: { en: "IRDAI mandates insurers cannot refuse renewal based on age or claims", hi: "IRDAI अनिवार्य करता है कि बीमाकर्ता आयु या क्लेम के आधार पर नवीनीकरण से इंकार नहीं कर सकते", hinglish: "IRDAI mandates insurers age ya claims ke basis pe renewal refuse nahi kar sakte" },
  },
  cityWise: {
    heading: { en: "City-wise Health Insurance", hi: "शहरवार हेल्थ इंश्योरेंस", hinglish: "City-wise Health Insurance" },
    desc: { en: "Premiums vary by city — metro cities cost 15% more due to higher healthcare costs. Find the best plan for your city.", hi: "प्रीमियम शहर के अनुसार भिन्न होते हैं — मेट्रो शहरों में अधिक स्वास्थ्य लागत के कारण 15% अधिक लागत। अपने शहर के लिए सर्वोत्तम योजना खोजें।", hinglish: "Premiums city ke hisaab se different hoti hain — metro cities mein 15% zyada cost. Apne city ke liye best plan dhoondhein." },
    viewAll: { en: "View all 100+ cities →", hi: "सभी 100+ शहर देखें →", hinglish: "View all 100+ cities →" },
    showingTop8: { en: "Showing top 8 cities.", hi: "शीर्ष 8 शहर दिखाए जा रहे हैं।", hinglish: "Top 8 cities dikha rahe hain." },
  },
  ageWise: {
    heading: { en: "Age-based Health Insurance", hi: "आयु आधारित हेल्थ इंश्योरेंस", hinglish: "Age-based Health Insurance" },
    desc: { en: "Premiums increase significantly with age. Buy early to lock in lower rates for life.", hi: "आयु के साथ प्रीमियम काफी बढ़ता है। कम दरों पर लॉक करने के लिए जल्दी खरीदें।", hinglish: "Premiums age ke saath significantly badhte hain. Lower rates lock karne ke liye jaldi khareedein." },
    yearsOld: { en: "years old", hi: "वर्ष की आयु", hinglish: "years old" },
    forCover: { en: "for ₹10L cover", hi: "₹10L कवर के लिए", hinglish: "for ₹10L cover" },
  },
  profession: {
    heading: { en: "Profession-based Health Insurance", hi: "पेशे आधारित हेल्थ इंश्योरेंस", hinglish: "Profession-based Health Insurance" },
    desc: { en: "High-risk professions pay 10-30% more. Software engineers and office workers get standard rates.", hi: "उच्च जोखिम वाले पेशे 10-30% अधिक भुगतान करते हैं। सॉफ़्टवेयर इंजीनियर और ऑफिस कर्मचारियों को मानक दरें मिलती हैं।", hinglish: "High-risk professions 10-30% zyada pay karte hain. Software engineers aur office workers ko standard rates milti hain." },
    viewPlans: { en: "View plans →", hi: "योजनाएँ देखें →", hinglish: "View plans →" },
    softwareEngineer: { en: "Software Engineer", hi: "सॉफ़्टवेयर इंजीनियर", hinglish: "Software Engineer" },
    businessOwner: { en: "Business Owner", hi: "व्यवसायी", hinglish: "Business Owner" },
    teacher: { en: "Teacher", hi: "शिक्षक", hinglish: "Teacher" },
    doctor: { en: "Doctor", hi: "डॉक्टर", hinglish: "Doctor" },
    freelancer: { en: "Freelancer", hi: "फ़्रीलांसर", hinglish: "Freelancer" },
    farmer: { en: "Farmer", hi: "किसान", hinglish: "Farmer" },
  },
  topComparisons: {
    heading: { en: "Top Health Insurance Comparisons", hi: "शीर्ष हेल्थ इंश्योरेंस तुलना", hinglish: "Top Health Insurance Comparisons" },
    desc: { en: "Side-by-side comparison of India's top health insurers. See which plan fits your needs.", hi: "भारत के शीर्ष हेल्थ बीमाकर्ताओं की समानांतर तुलना। देखें कौन सी योजना आपकी ज़रूरतों के अनुसार है।", hinglish: "India ke top health insurers ka side-by-side comparison. Dekhein kaun si plan aapki needs ke according hai." },
    thPlan: { en: "Plan", hi: "योजना", hinglish: "Plan" },
    thInsurer: { en: "Insurer", hi: "बीमाकर्ता", hinglish: "Insurer" },
    thCsr: { en: "CSR", hi: "CSR", hinglish: "CSR" },
    thPremium: { en: "Premium/yr", hi: "प्रीमियम/वर्ष", hinglish: "Premium/yr" },
    thNetwork: { en: "Network", hi: "नेटवर्क", hinglish: "Network" },
    thRating: { en: "Rating", hi: "रेटिंग", hinglish: "Rating" },
    compareAll: { en: "Compare All Plans →", hi: "सभी योजनाओं की तुलना करें →", hinglish: "Compare All Plans →" },
  },
  conditions: {
    heading: { en: "Health Condition-specific Insurance", hi: "स्वास्थ्य स्थिति विशिष्ट बीमा", hinglish: "Health Condition-specific Insurance" },
    desc: { en: "Specialized plans for pre-existing conditions. IRDAI mandates maximum 3-year PED waiting period.", hi: "पूर्व-मौजूदा स्थितियों के लिए विशेष योजनाएँ। IRDAI अधिकतम 3-वर्ष PED प्रतीक्षा अवधि अनिवार्य करता है।", hinglish: "Pre-existing conditions ke liye specialized plans. IRDAI maximum 3-year PED waiting period mandate karta hai." },
    viewPlans: { en: "View plans →", hi: "योजनाएँ देखें →", hinglish: "View plans →" },
    diabetes: { en: "Diabetes", hi: "मधुमेह", hinglish: "Diabetes" },
    heartDisease: { en: "Heart Disease", hi: "हृदय रोग", hinglish: "Heart Disease" },
    hypertension: { en: "Hypertension", hi: "उच्च रक्तचाप", hinglish: "Hypertension" },
    cancer: { en: "Cancer", hi: "कैंसर", hinglish: "Cancer" },
    maternity: { en: "Maternity", hi: "प्रसूति", hinglish: "Maternity" },
    senior: { en: "Senior Citizens", hi: "वरिष्ठ नागरिक", hinglish: "Senior Citizens" },
    kidneyDisease: { en: "Kidney Disease", hi: "गुर्दा रोग", hinglish: "Kidney Disease" },
    covid: { en: "COVID-19", hi: "कोविड-19", hinglish: "COVID-19" },
  },
  cta: {
    heading: { en: "Need Help Choosing the Right Plan?", hi: "सही योजना चुनने में मदद चाहिए?", hinglish: "Sahi Plan Choose Karne Mein Madad Chahiye?" },
    desc: { en: "Get personalized health insurance advice from IRDAI-certified advisor Himanshu Paliwal (POSP Code: IP429834). Free consultation on WhatsApp.", hi: "IRDAI-प्रमाणित सलाहकार हिमांशु पालीवाल (POSP कोड: IP429834) से व्यक्तिगत हेल्थ इंश्योरेंस सलाह प्राप्त करें। WhatsApp पर मुफ़्त परामर्श।", hinglish: "IRDAI-certified advisor Himanshu Paliwal (POSP Code: IP429834) se personalized health insurance advice lo. WhatsApp pe free consultation." },
    ctaWhatsApp: { en: "💬 Chat on WhatsApp", hi: "💬 WhatsApp पर चैट करें", hinglish: "💬 WhatsApp pe Chat Karein" },
    ctaCompare: { en: "Compare Plans →", hi: "योजनाओं की तुलना करें →", hinglish: "Compare Plans →" },
  },
};

const faqs = [
  { question: 'Which health insurance is best for family in India?', answer: 'Family floater plans like HDFC ERGO Optima Secure, Care Health Advantage, and Niva Bupa ReAssure offer comprehensive coverage for the entire family under one premium. A family floater of ₹10L costs ₹8,000–₹15,000/year depending on the eldest member\'s age.' },
  { question: 'How much does health insurance cost in India?', answer: 'Health insurance for ₹10 lakh cover costs ₹6,000–₹10,000/year at age 30, ₹18,000–₹24,000 at age 45, and ₹40,000–₹60,000 at age 60. Metro cities have 15% higher premiums. Family floaters cost 30% more than individual plans.' },
  { question: 'What is the claim settlement ratio in health insurance?', answer: 'Top health insurers have CSR of 87-100%. Care Health leads at 93%, Niva Bupa at 91%, HDFC ERGO at 89%, ACKO at 88%, and Star Health at 87%. Higher CSR means better chances of claim approval.' },
  { question: 'Can I get health insurance with pre-existing conditions?', answer: 'Yes, IRDAI mandates that all insurers cover pre-existing conditions after a waiting period of maximum 3 years (some plans offer 1-2 years). Conditions like diabetes, hypertension, and heart disease are covered after the PED waiting period.' },
  { question: 'What is cashless health insurance?', answer: 'Cashless claim means you don\'t pay upfront at network hospitals. The insurer settles the bill directly. IRDAI mandates 1-hour approval for cashless requests and 3-hour discharge authorization. Top insurers have 5,000–20,000+ network hospitals.' },
  { question: 'Is there tax benefit on health insurance?', answer: 'Yes! Under Section 80D, you get tax deduction up to ₹25,000/year (₹50,000 for senior citizens) on health insurance premiums. Additional ₹25,000 for parents\' health insurance (₹50,000 if parents are senior citizens).' },
  { question: 'What is the IRDAI mandate on health insurance age limit?', answer: 'Since April 2025, IRDAI has removed the upper age limit for buying health insurance. No insurer can refuse to issue a policy based on age. This is a major relief for senior citizens aged 60-80+.' },
];

export default function ClientContent() {
  const { language } = useLanguage();
  const topCities = cities.slice(0, 8);
  const ages = [25, 30, 35, 40, 45, 50, 55, 60];
  const topProfessions = ['software-engineer', 'business-owner', 'teacher', 'doctor', 'freelancer', 'farmer'];
  const topPlans = healthPlans.slice(0, 6);

  const professionNames: Record<string, TEntry> = {
    'software-engineer': pageText.profession.softwareEngineer,
    'business-owner': pageText.profession.businessOwner,
    'teacher': pageText.profession.teacher,
    'doctor': pageText.profession.doctor,
    'freelancer': pageText.profession.freelancer,
    'farmer': pageText.profession.farmer,
  };
  const professionIcons: Record<string, React.ElementType> = {
    'software-engineer': Activity, 'business-owner': Building2, 'teacher': Users,
    'doctor': Stethoscope, 'freelancer': Briefcase, 'farmer': Heart,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        <div className="orb-1 absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
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
              <Heart className="h-3.5 w-3.5 mr-1" />
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
                { icon: TrendingUp, label: pt(pageText.hero.stat2Label, language), value: pt(pageText.hero.stat2Val, language) },
                { icon: Building2, label: pt(pageText.hero.stat3Label, language), value: pt(pageText.hero.stat3Val, language) },
                { icon: ShieldCheck, label: pt(pageText.hero.stat4Label, language), value: pt(pageText.hero.stat4Val, language) },
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

        {/* Overview Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.overview.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{pt(pageText.overview.desc, language)}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: pt(pageText.overview.card1Title, language), desc: pt(pageText.overview.card1Desc, language), icon: Building2 },
              { title: pt(pageText.overview.card2Title, language), desc: pt(pageText.overview.card2Desc, language), icon: IndianRupee },
              { title: pt(pageText.overview.card3Title, language), desc: pt(pageText.overview.card3Desc, language), icon: ShieldCheck },
            ].map((item, i) => (
              <Card key={i} className="glass-card hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 flex items-start gap-3">
                  <item.icon className="h-8 w-8 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* City-wise Plans */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.cityWise.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.cityWise.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topCities.map(city => (
              <Link key={city.slug} href={`/health-insurance/${city.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <MapPin className="h-4 w-4 text-primary mx-auto mb-1" />
                    <p className="text-sm font-semibold">{city.name}</p>
                    <p className="text-xs text-muted-foreground">{city.state}</p>
                    <Badge variant="secondary" className="mt-1.5 text-[10px]">{city.tier}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {pt(pageText.cityWise.showingTop8, language)}{' '}
            <Link href="/health-insurance" className="text-primary hover:underline">
              {pt(pageText.cityWise.viewAll, language)}
            </Link>
          </p>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Age-based Plans */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.ageWise.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.ageWise.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ages.map(age => {
              const premium = age <= 25 ? 8500 : age <= 30 ? 10000 : age <= 35 ? 14000 : age <= 40 ? 18000 : age <= 45 ? 24000 : age <= 50 ? 32000 : age <= 55 ? 42000 : 60000;
              return (
                <Link key={age} href={`/health-insurance/age-${age}`}>
                  <Card className="hover:translate-y-[-2px] hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                    <CardContent className="p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{age}</p>
                      <p className="text-xs text-muted-foreground">{pt(pageText.ageWise.yearsOld, language)}</p>
                      <p className="text-sm font-semibold mt-1">₹{premium.toLocaleString('en-IN')}/yr</p>
                      <p className="text-[10px] text-muted-foreground">{pt(pageText.ageWise.forCover, language)}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Profession-based Plans */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.profession.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.profession.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topProfessions.map(slug => {
              const name = pt(professionNames[slug], language);
              const Icon = professionIcons[slug] || Briefcase;
              return (
                <Link key={slug} href={`/health-insurance/profession-${slug}`}>
                  <Card className="hover:translate-y-[-2px] hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                    <CardContent className="p-3 flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">{name}</p>
                        <p className="text-[10px] text-muted-foreground">{pt(pageText.profession.viewPlans, language)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Top Comparisons */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.topComparisons.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.topComparisons.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">{pt(pageText.topComparisons.thPlan, language)}</th>
                  <th className="text-left p-3 font-semibold">{pt(pageText.topComparisons.thInsurer, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.topComparisons.thCsr, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.topComparisons.thPremium, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.topComparisons.thNetwork, language)}</th>
                  <th className="text-center p-3 font-semibold">{pt(pageText.topComparisons.thRating, language)}</th>
                </tr>
              </thead>
              <tbody>
                {topPlans.map((plan, i) => (
                  <tr key={plan.id} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                    <td className="p-3 font-medium">{plan.name}</td>
                    <td className="p-3 text-muted-foreground">{plan.insurer}</td>
                    <td className="p-3 text-center">{plan.csr}</td>
                    <td className="p-3 text-center font-semibold">₹{(plan.premium ?? 0).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center">{(plan.networkHospitals ?? 0).toLocaleString()}+</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{plan.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Link href="/compare">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.topComparisons.compareAll, language)}</span>
              </ShinyButton>
            </Link>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Health Condition Pages */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="gradient-text">{pt(pageText.conditions.heading, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.conditions.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: pt(pageText.conditions.diabetes, language), slug: 'diabetes' },
              { name: pt(pageText.conditions.heartDisease, language), slug: 'heart-disease' },
              { name: pt(pageText.conditions.hypertension, language), slug: 'hypertension' },
              { name: pt(pageText.conditions.cancer, language), slug: 'cancer' },
              { name: pt(pageText.conditions.maternity, language), slug: 'maternity' },
              { name: pt(pageText.conditions.senior, language), slug: 'senior' },
              { name: pt(pageText.conditions.kidneyDisease, language), slug: 'kidney-disease' },
              { name: pt(pageText.conditions.covid, language), slug: 'covid' },
            ].map(cond => (
              <Link key={cond.slug} href={`/health-insurance`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-semibold">{cond.name}</p>
                    <p className="text-[10px] text-muted-foreground">{pt(pageText.conditions.viewPlans, language)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Expert Insight */}
        <ExpertInsight
          insight={pt({ en: "Health insurance premium doubles every 10 years after age 30. Buying at 25 saves ₹5-10 Lakh over a lifetime compared to buying at 40. With IRDAI removing the age cap, there's no excuse to delay — but buying early is always cheaper.", hi: "30 वर्ष की आयु के बाद हेल्थ इंश्योरेंस प्रीमियम हर 10 वर्ष में दोगुना होता है। 25 पर खरीदना 40 पर खरीदने से जीवनभर में ₹5-10 लाख बचाता है। IRDAI द्वारा आयु सीमा हटाने के बाद भी, जल्दी खरीदना हमेशा सस्ता होता है।", hinglish: "Health insurance premium doubles har 10 saal mein after age 30. 25 pe khareedna 40 pe khareedne se ₹5-10 Lakh bachata hai lifetime mein. IRDAI age cap hatane ke baad bhi, jaldi khareedna hamesha sasta hota hai." }, language)}
          topic={pt({ en: "Health Insurance Strategy", hi: "हेल्थ इंश्योरेंस रणनीति", hinglish: "Health Insurance Strategy" }, language)}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* FAQ Section */}
        <FAQSection faqs={faqs} title={pt({ en: "Health Insurance FAQ — Most Asked Questions", hi: "हेल्थ इंश्योरेंस सवाल-जवाब — सबसे अधिक पूछे जाने वाले", hinglish: "Health Insurance FAQ — Most Asked Questions" }, language)} />

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
