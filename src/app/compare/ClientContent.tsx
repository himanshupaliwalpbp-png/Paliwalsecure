'use client';

import { useCallback } from 'react';
import { Shield, ShieldCheck, Clock, Sparkles, CheckCircle2, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { siteConfig } from '@/config/site';
import CategoryHub from '@/components/compare/CategoryHub';

/* ────────────────────────────────────────────────────────────────────────────
   Compare Hub Client Page — Full i18n + ShinyButton + Design
   ──────────────────────────────────────────────────────────────────────────── */

type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  hero: {
    badge: { en: "IRDAI Certified POSP — Accurate Rates", hi: "IRDAI प्रमाणित POSP — सटीक दरें", hinglish: "IRDAI Certified POSP — Accurate Rates" },
    title1a: { en: "Insurance Compare", hi: "इंश्योरेंस तुलना", hinglish: "Insurance Compare" },
    title1b: { en: "Engine", hi: "इंजन", hinglish: "Engine" },
    title2a: { en: "IRDAI Accurate", hi: "IRDAI सटीक", hinglish: "IRDAI Accurate" },
    title2b: { en: "Rates", hi: "दरें", hinglish: "Rates" },
    description: {
      en: "Compare real premiums from IRDAI-registered insurers. No fake discounts — only regulator-approved rates with transparent breakdowns. Save up to 18% GST on Health & Life via POSP route.",
      hi: "IRDAI-पंजीकृत बीमाकर्ताओं से वास्तविक प्रीमियम की तुलना करें। कोई फर्जी छूट नहीं — केवल नियामक-अनुमोदित दरें पारदर्शी विवरण के साथ। POSP मार्ग से हेल्थ और लाइफ पर 18% GST तक बचाएँ।",
      hinglish: "IRDAI-registered insurers se real premium compare karo. Koi fake discount nahi — sirf regulator-approved rates with transparent breakdowns. Health & Life pe POSP route se 18% GST tak bachao."
    },
    benefit1: { en: "IRDAI Mandated Rates", hi: "IRDAI अनिवार्य दरें", hinglish: "IRDAI Mandated Rates" },
    benefit2: { en: "5 Insurance Categories", hi: "5 बीमा श्रेणियाँ", hinglish: "5 Insurance Categories" },
    benefit3: { en: "Updated FY 2024-25", hi: "FY 2024-25 अपडेट", hinglish: "Updated FY 2024-25" },
    stat1Value: { en: "5", hi: "5", hinglish: "5" },
    stat1Label: { en: "Categories", hi: "श्रेणियाँ", hinglish: "Categories" },
    stat2Value: { en: "8+", hi: "8+", hinglish: "8+" },
    stat2Label: { en: "Insurers", hi: "बीमाकर्ता", hinglish: "Insurers" },
    stat3Value: { en: "0%", hi: "0%", hinglish: "0%" },
    stat3Label: { en: "GST (Health/Life)", hi: "GST (हेल्थ/लाइफ)", hinglish: "GST (Health/Life)" },
  },
  categories: {
    badge: { en: "Choose Your Category", hi: "अपनी श्रेणी चुनें", hinglish: "Apni Category Chunein" },
    heading1a: { en: "Compare Insurance Across", hi: "बीमा की तुलना करें", hinglish: "Insurance Compare Karein" },
    heading1b: { en: "5 Categories", hi: "5 श्रेणियों में", hinglish: "5 Categories Mein" },
    description: {
      en: "Select a category below to get instant, accurate premium comparisons from IRDAI-registered insurers.",
      hi: "नीचे एक श्रेणी चुनें और IRDAI-पंजीकृत बीमाकर्ताओं से तत्काल, सटीक प्रीमियम तुलना प्राप्त करें।",
      hinglish: "Neeche ek category chunein aur IRDAI-registered insurers se instant, accurate premium comparison paayein."
    },
  },
  dataFreshness: {
    heading: { en: "Data Freshness Guarantee", hi: "डेटा ताज़गी गारंटी", hinglish: "Data Freshness Guarantee" },
    description: {
      en: "All rates sourced from IRDAI FY 2024-25 mandated third-party tariffs, insurer filing records, and POSP advisory guidelines. Premiums are updated quarterly to reflect the latest regulatory changes.",
      hi: "सभी दरें IRDAI FY 2024-25 अनिवार्य थर्ड-पार्टी टैरिफ़, बीमाकर्ता दाखिल रिकॉर्ड और POSP सलाहकार दिशानिर्देशों से प्राप्त। प्रीमियम नवीनतम नियामक परिवर्तनों को दर्शाने के लिए तिमाही अपडेट किए जाते हैं।",
      hinglish: "Saari rates IRDAI FY 2024-25 mandated third-party tariffs, insurer filing records aur POSP advisory guidelines se li gayi hain. Premiums quarterly update hote hain latest regulatory changes reflect karne ke liye."
    },
    source1: { en: "IRDAI Tariff Orders", hi: "IRDAI टैरिफ़ आदेश", hinglish: "IRDAI Tariff Orders" },
    source2: { en: "Insurer Rate Filings", hi: "बीमाकर्ता दर दाखिल", hinglish: "Insurer Rate Filings" },
    source3: { en: "POSP Advisory Circulars", hi: "POSP सलाहकार परिपत्र", hinglish: "POSP Advisory Circulars" },
    source4: { en: "GST Exemption Rules", hi: "GST छूट नियम", hinglish: "GST Exemption Rules" },
  },
  posp: {
    heading: { en: "Why Paliwal Secure?", hi: "पालीवल सिक्योर क्यों?", hinglish: "Paliwal Secure Kyun?" },
    description: {
      en: "As an IRDAI-certified POSP (Point of Sales Person), we can offer health and life insurance at 0% GST, saving you up to 18% on your premiums. Every quote is backed by regulator-approved rates — no inflated discounts, no hidden charges.",
      hi: "IRDAI-प्रमाणित POSP (पॉइंट ऑफ सेल्स पर्सन) के रूप में, हम हेल्थ और लाइफ इंश्योरेंस 0% GST पर दे सकते हैं, जिससे आप अपने प्रीमियम पर 18% तक की बचत होती है। हर कोट नियामक-अनुमोदित दरों पर आधारित है — कोई बढ़ाई गई छूट नहीं, कोई छुपे शुल्क नहीं।",
      hinglish: "IRDAI-certified POSP (Point of Sales Person) ke roop mein, hum health aur life insurance 0% GST pe de sakte hain, jisse tumhare premium pe 18% tak ki bachat hoti hai. Har quote regulator-approved rates pe based hai — koi inflated discount nahi, koi hidden charges nahi."
    },
    ctaPrimary: { en: "Get Best Plan", hi: "सर्वोत्तम योजना प्राप्त करें", hinglish: "Best Plan Pao" },
    ctaSecondary: { en: "WhatsApp", hi: "अभी कॉल करें", hinglish: "Abhi Call Karein" },
    pospId: { en: `IRDAI POSP: IP429834 • Agent: ${siteConfig.author.name} • Regulated by IRDAI of India`, hi: `IRDAI POSP: IP429834 • एजेंट: ${siteConfig.author.name} • IRDAI of India द्वारा विनियमित`, hinglish: `IRDAI POSP: IP429834 • Agent: ${siteConfig.author.name} • Regulated by IRDAI of India` },
  },
};

// ── Section Divider ───────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="mx-3 h-1.5 w-1.5 rounded-full bg-primary/40" />
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

export default function ClientContent() {
  const { language } = useLanguage();
  const tr = useCallback((obj: Tr) => obj[language as keyof Tr] || obj.en, [language]);

  return (
    <div className="min-h-screen">
      {/* ================================================================ */}
      {/* HERO SECTION — Insurance Compare Engine                          */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-16 sm:pb-24">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />

        {/* CSS-only animated gradient overlay */}
        <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(110deg,transparent_30%,rgba(99,102,241,0.1)_50%,transparent_70%)] bg-[length:200%_100%]" />

        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Decorative shapes — CSS-only */}
        <div className="hidden lg:block absolute top-24 left-[10%] w-14 h-14 bg-amber-400/10 rounded-2xl rotate-12 animate-float-slow" />
        <div className="hidden lg:block absolute bottom-20 right-[12%] w-18 h-18 bg-blue-400/10 rounded-full animate-float-medium" />
        <div className="hidden lg:block absolute top-32 right-[30%] w-10 h-10 bg-teal-400/10 rounded-xl rotate-45 animate-float-fast" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="mb-4 sm:mb-6 animate-fade-in-up">
              <Badge className="badge-shimmer bg-amber-500/20 text-amber-300 border-amber-400/30 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {tr(pageText.hero.badge)}
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-[1.8rem] sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15] animate-fade-in-up animation-delay-100">
              <span className="gradient-text">{tr(pageText.hero.title1a)} {tr(pageText.hero.title1b)}</span>
              <br />
              <span className="gradient-text-amber">{tr(pageText.hero.title2a)} {tr(pageText.hero.title2b)}</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              {tr(pageText.hero.description)}
            </p>

            {/* Key benefits */}
            <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-4 animate-fade-in-up animation-delay-300">
              {[
                { icon: ShieldCheck, text: tr(pageText.hero.benefit1) },
                { icon: Sparkles, text: tr(pageText.hero.benefit2) },
                { icon: Clock, text: tr(pageText.hero.benefit3) },
              ].map((benefit) => {
                const BIcon = benefit.icon;
                return (
                  <div
                    key={benefit.text}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15"
                  >
                    <BIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs sm:text-sm font-medium text-white/90">
                      {benefit.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stats row */}
            <div className="mt-10 sm:mt-14 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto animate-fade-in-up animation-delay-500">
              {[
                { value: tr(pageText.hero.stat1Value), label: tr(pageText.hero.stat1Label) },
                { value: tr(pageText.hero.stat2Value), label: tr(pageText.hero.stat2Label) },
                { value: tr(pageText.hero.stat3Value), label: tr(pageText.hero.stat3Label) },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl sm:text-3xl font-bold text-white counter-glow">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-sm text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      <SectionDivider />

      {/* ================================================================ */}
      {/* CATEGORY CARDS GRID                                              */}
      {/* ================================================================ */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 animate-fade-in-up">
            <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 rounded-full px-4 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              {tr(pageText.categories.badge)}
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              {tr(pageText.categories.heading1a)}{' '}
              <span className="gradient-text-amber">{tr(pageText.categories.heading1b)}</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              {tr(pageText.categories.description)}
            </p>
          </div>

          {/* Category Cards — rendered via reusable component */}
          <CategoryHub />
        </div>
      </section>

      <SectionDivider />

      {/* ================================================================ */}
      {/* DATA FRESHNESS SECTION                                           */}
      {/* ================================================================ */}
      <section className="py-10 sm:py-16 bg-muted/30 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              {tr(pageText.dataFreshness.heading)}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {tr(pageText.dataFreshness.description)}
            </p>

            {/* Data sources */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                tr(pageText.dataFreshness.source1),
                tr(pageText.dataFreshness.source2),
                tr(pageText.dataFreshness.source3),
                tr(pageText.dataFreshness.source4),
              ].map((source) => (
                <span
                  key={source}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/60 text-xs font-medium text-muted-foreground"
                >
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ================================================================ */}
      {/* POSP INFO CARD                                                   */}
      {/* ================================================================ */}
      <section className="py-10 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-center hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 gradient-text">
                {tr(pageText.posp.heading)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {tr(pageText.posp.description)}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
                  <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm">
                    <span>🎯 {tr(pageText.posp.ctaPrimary)}</span>
                  </ShinyButton>
                </a>
                <a href="https://wa.me/919257877312">
                  <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm">
                    <span><Phone className="w-4 h-4 inline mr-1" />{tr(pageText.posp.ctaSecondary)}</span>
                  </ShinyButton>
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground">
                  {tr(pageText.posp.pospId)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
