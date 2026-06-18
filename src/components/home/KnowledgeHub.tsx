'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Heart, Car, ArrowRight, BookOpen, Shield, TrendingUp, CheckCircle2, Languages, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Article data ────────────────────────────────────────────── */
interface ArticleData {
  articleKey: string;
  icon: React.ReactNode;
  slug: string;
  titles: { en: string; hi: string; hg: string };
  categories: { en: string; hi: string; hg: string };
  readTimes: { en: string; hi: string; hg: string };
  keyPoints: { en: string[]; hi: string[]; hg: string[] };
  summaries: { en: string; hi: string; hg: string };
  color: string;
  badgeVariant: string;
}

const articles: ArticleData[] = [
  {
    articleKey: 'article1',
    icon: <Shield className="w-5 h-5" />,
    slug: 'term-insurance-guide-india',
    color: '#2563EB',
    badgeVariant: 'blue',
    titles: { en: 'Term vs Whole Life — explained in 3 min', hi: 'Term vs Whole Life — 3 minute mein samjhein', hg: 'Term vs Whole Life — 3 minute mein samjhein' },
    categories: { en: 'Insurance Guide', hi: 'बीमा गाइड', hg: 'Insurance Guide' },
    readTimes: { en: '3 min read', hi: '3 मिनट पढ़ें', hg: '3 min read' },
    keyPoints: {
      en: ['Term = pure protection, lowest premium', 'Whole life = insurance + savings, 5-10x more', 'Best: Term Plan + Mutual Fund SIP separately'],
      hi: ['Term = सिर्फ सुरक्षा, सबसे कम प्रीमियम', 'Whole life = बीमा + बचत, 5-10 गुना ज्यादा', 'बेस्ट: Term Plan + Mutual Fund SIP अलग से'],
      hg: ['Term = sirf protection, sabse kam premium', 'Whole life = insurance + savings, 5-10x zyada', 'Best: Term Plan + Mutual Fund SIP alag se'],
    },
    summaries: { en: 'Term insurance gives you maximum life cover at minimum cost. Our recommendation: Buy term for protection, invest the difference.', hi: 'Term insurance कम से कम लागत पर अधिकतम जीवन कवर देता है। हमारी सलाह: सुरक्षा के लिए Term खरीदें।', hg: 'Term insurance minimum cost pe maximum life cover deta hai. Recommendation: Protection ke liye Term buy karo.' },
  },
  {
    articleKey: 'article2',
    icon: <Heart className="w-5 h-5" />,
    slug: 'family-health-insurance-guide',
    color: '#EF4444',
    badgeVariant: 'gold',
    titles: { en: 'How much health cover does a Kota family of 4 need?', hi: 'कोटा के 4-सदस्य परिवार को कितना हेल्थ कवर चाहिए?', hg: 'Kota ke 4-member parivaar ko kitna health cover chahiye?' },
    categories: { en: 'Health Insurance', hi: 'हेल्थ इंश्योरेंस', hg: 'Health Insurance' },
    readTimes: { en: '5 min read', hi: '5 मिनट पढ़ें', hg: '5 min read' },
    keyPoints: {
      en: ['₹10-15 Lakh family floater is minimum', 'Super Top-Up adds ₹1 Crore for ₹3,000/yr', 'Room rent capping is critical'],
      hi: ['₹10-15 लाख फैमिली फ्लोटर न्यूनतम', 'सुपर टॉप-अप ₹3,000/साल में ₹1 करोड़ जोड़ सकता है', 'रूम रेंट कैपिंग बहुत जरूरी'],
      hg: ['₹10-15 Lakh family floater minimum', 'Super Top-Up ₹3,000/year mein ₹1 Crore add karta hai', 'Room rent capping critical hai'],
    },
    summaries: { en: 'For a Kota family of 4, we recommend ₹10-15 Lakh base + ₹1 Crore Super Top-Up. Total cost: ₹8,000-₹15,000/year.', hi: 'कोटा के 4-सदस्य परिवार के लिए, हम ₹10-15 लाख बेस + ₹1 करोड़ सुपर टॉप-अप की सलाह देते हैं।', hg: 'Kota ke 4-member family ke liye, hum ₹10-15 Lakh base + ₹1 Crore Super Top-Up recommend karte hain.' },
  },
  {
    articleKey: 'article3',
    icon: <Car className="w-5 h-5" />,
    slug: 'insurance-claim-rejection-reasons',
    color: '#10B981',
    badgeVariant: 'green',
    titles: { en: 'Motor insurance claim rejected? Do this.', hi: 'मोटर इंश्योरेंस क्लेम रिजेक्ट हो गया? ये करें।', hg: 'Motor insurance claim reject ho gaya? Ye karein.' },
    categories: { en: 'Claims Help', hi: 'क्लेम सहायता', hg: 'Claim Sahayata' },
    readTimes: { en: '4 min read', hi: '4 मिनट पढ़ें', hg: '4 min read' },
    keyPoints: {
      en: ['Not informing insurer within 48-72 hrs = common reason', 'Driving without valid license = automatic rejection', 'File appeal with insurer first, then IRDAI'],
      hi: ['48-72 घंटे में सूचित नहीं करना = आम वजह', 'बिना वैलिड लाइसेंस = ऑटोमैटिक रिजेक्शन', 'पहले इंश्योरर के पास अपील करें, फिर IRDAI'],
      hg: ['48-72 hrs mein inform nahi karna = common reason', 'Bina valid license = automatic rejection', 'Pehle insurer ke paas appeal karo, phir IRDAI'],
    },
    summaries: { en: "Don't panic if your motor claim is rejected. Get the rejection in writing, file an appeal within 15 days. IRDAI resolves 90%+ cases in favor of policyholders.", hi: 'अगर आपका मोटर क्लेम रिजेक्ट हो गया है तो घबराएं नहीं। 15 दिन में अपील करें। IRDAI 90%+ मामले ग्राहक के पक्ष में करता है।', hg: 'Agar motor claim reject ho gaya toh ghabrayein nahi. 15 din mein appeal karein. IRDAI 90%+ cases policyholder ke favour mein solve karta hai.' },
  },
];

/* ── Helper ────────────────────────────────────────────────────── */
function tr(data: { en: string; hi: string; hg: string }, isHindi: boolean, isEnglish: boolean) {
  return isHindi ? data.hi : isEnglish ? data.en : data.hg;
}

/* ── Article Card ─────────────────────────────────────────────── */
function ArticleCard({ article, isHindi, isEnglish, isInView, index }: { article: ArticleData; isHindi: boolean; isEnglish: boolean; isInView: boolean; index: number }) {
  const category = tr(article.categories, isHindi, isEnglish);
  const title = tr(article.titles, isHindi, isEnglish);
  const readTime = tr(article.readTimes, isHindi, isEnglish);
  const summary = tr(article.summaries, isHindi, isEnglish);
  const keyPoints = isHindi ? article.keyPoints.hi : isEnglish ? article.keyPoints.en : article.keyPoints.hg;
  const readGuide = isHindi ? 'गाइड पढ़ें' : isEnglish ? 'Read guide' : 'Guide padhein';
  const keyTakeawayLabel = isHindi ? 'मुख्य बातें' : isEnglish ? 'Key Takeaways' : 'Main Baatein';
  const readHindiLabel = isHindi ? 'हिंदी में पढ़ें' : isEnglish ? 'Read in Hindi' : 'Hindi mein padhein';

  return (
    <motion.a
      href={`/blog/${article.slug}`}
      className="group relative flex flex-col h-full card-ivory-vault p-6 lg:p-7 block"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {/* Top: Icon + Category Badge + Read in Hindi */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#F4E5DD] text-[#B8482C] transition-transform duration-300 group-hover:scale-110">
          {article.icon}
        </span>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4E5DD] text-[#8B3520] text-[0.8125rem] font-medium tracking-[0.01em] font-body">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8482C]" />
          {category}
        </span>
        <span className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#8B9099] ml-auto flex items-center gap-1 font-body tabular-nums">
          <Languages className="w-3 h-3" />
          {readHindiLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-lg lg:text-xl font-medium leading-snug mb-3 tracking-tight text-[#0E1116]">
        {title}
      </h3>

      {/* Summary */}
      <p className="text-body-premium text-[#4A4F57] mb-5">
        {summary}
      </p>

      {/* Key Takeaways */}
      <div className="space-y-2.5 mb-5 flex-1">
        <p className="text-caption-premium text-[#8B3520] flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3" />
          {keyTakeawayLabel}
        </p>
        {keyPoints.slice(0, 3).map((point, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#B8482C] opacity-70" />
            <span className="text-body-premium text-[#4A4F57] leading-snug">{point}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 hairline-top">
        <span className="link-underline-reveal inline-flex items-center gap-1.5 text-sm font-medium text-[#B8482C] font-body transition-all duration-300 group-hover:gap-2.5">
          {readGuide}
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
        <span className="text-caption-premium text-[#8B9099] flex items-center gap-1 tabular-nums normal-case tracking-normal">
          <Clock className="w-3 h-3" />
          {readTime}
        </span>
      </div>
    </motion.a>
  );
}

/* ── Main Component ────────────────────────────────────────── */
export default function KnowledgeHub() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const heading = isHindi ? 'इंश्योरेंस ज्ञान' : isEnglish ? 'Insurance Knowledge' : 'Insurance Gyaan';
  const headingAccent = isHindi ? 'केंद्र' : isEnglish ? 'Hub' : 'Kendra';
  const subtitle = isHindi
    ? 'बीमा की बातें आसान भाषा में — हिंदी में समझें, सही फैसला लें'
    : isEnglish
    ? 'Insurance explained simply — understand in Hindi, make the right choice'
    : 'Insurance ki baatein aasan bhasha mein — samjho, sahi faisla lo';
  const cta = isHindi ? 'सभी गाइड देखें' : isEnglish ? 'Browse all guides' : 'Sab guides dekhein';

  return (
    <section ref={sectionRef} className="section-premium bg-[#FAF7F2]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4E5DD] text-[#8B3520] text-[0.8125rem] font-medium tracking-[0.01em] font-body mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8482C] animate-pulse" />
            <BookOpen className="w-3.5 h-3.5" />
            <span>InsureGyaan</span>
          </div>
          <h2 className="text-display-h2 font-display text-[#0E1116]">
            {heading} <span className="text-accent-gradient">{headingAccent}</span>
          </h2>
          <p className="text-lead-premium text-[#4A4F57] max-w-lg mx-auto mt-4">
            {subtitle}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={article.articleKey} article={article} isHindi={isHindi} isEnglish={isEnglish} isInView={isInView} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <a
            href="/blog"
            className="btn-stripe group"
          >
            <span>{cta}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
