'use client';

import Link from 'next/link';
import {
  Shield, Eye, Brain, Globe, Heart, Users, Award, Phone,
  MapPin, Mail, MessageCircle, ArrowRight, CheckCircle2,
  Sparkles, Target, Lightbulb, Bot, Zap, ChevronRight,
  Twitter, Linkedin, Instagram, Youtube, ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';

/* ── Design tokens ─────────────────────────────────────────────────────── */
const NAVY_800 = '#0A1330';
const NAVY_600 = '#162D5A';
const GOLD = '#C98A1C';

/* ── Translation type ──────────────────────────────────────────────────── */
type Tr = { en: string; hi: string; hinglish: string };

/* ── Inline page text ──────────────────────────────────────────────────── */
const pageText = {
  hero: {
    badge: { en: 'IRDAI Registered POSP — IP429834', hi: 'IRDAI पंजीकृत POSP — IP429834', hinglish: 'IRDAI Registered POSP — IP429834' },
    title1: { en: 'About', hi: 'के बारे में', hinglish: 'About' },
    titleHighlight: { en: 'Paliwal Secure AI', hi: 'पालीवाल सिक्योर AI', hinglish: 'Paliwal Secure AI' },
    subtitle: { en: 'AI-powered insurance recommendations for every Indian family. Compare 51+ insurers, get the best plan, and enjoy free claim support.', hi: 'हर भारतीय परिवार के लिए AI-संचालित बीमा सिफारिशें। 51+ बीमाकर्ताओं की तुलना करें, सर्वोत्तम योजना पाएँ, और मुफ्त क्लेम सहायता का आनंद लें।', hinglish: 'Har Indian family ke liye AI-powered insurance recommendations. 51+ insurers compare karo, best plan pao, aur free claim support enjoy karo.' },
  },
  founder: {
    name: { en: 'Himanshu Paliwal', hi: 'हिमांशु पालीवाल', hinglish: 'Himanshu Paliwal' },
    verified: { en: 'Verified', hi: 'सत्यापित', hinglish: 'Verified' },
    pospTitle: { en: 'IRDAI Registered POSP (Point of Sales Person)', hi: 'IRDAI पंजीकृत POSP (बिक्री बिंदु व्यक्ति)', hinglish: 'IRDAI Registered POSP (Point of Sales Person)' },
    pospCode: { en: '🛡️ POSP Code: IP429834', hi: '🛡️ POSP कोड: IP429834', hinglish: '🛡️ POSP Code: IP429834' },
    desc: { en: 'Himanshu Paliwal is an IRDAI‑registered POSP based in Jaipur, Rajasthan. With deep expertise in insurance advisory and a passion for making insurance accessible to every Indian family, he founded Paliwal Secure AI to bridge the gap between complex insurance products and everyday Indians who need simple, trustworthy guidance.', hi: 'हिमांशु पालीवाल जयपुर, राजस्थान में आधारित IRDAI पंजीकृत POSP हैं। बीमा सलाहकार में गहन विशेषज्ञता के साथ, उन्होंने Paliwal Secure AI की स्थापना जटिल बीमा उत्पादों और रोज़मर्रा के भारतीयों के बीच की खाई को पाटने के लिए की — ताकि हर परिवार को सरल और भरोसेमंद मार्गदर्शन मिले।', hinglish: 'Himanshu Paliwal Jaipur, Rajasthan mein based IRDAI registered POSP hain. Insurance advisory mein deep expertise ke saath, unhone Paliwal Secure AI ki sthapana complex insurance products aur everyday Indians ke beech ki khai ko paane ke liye ki — taaki har family ko simple aur bharosemand margdarshan mile.' },
    location: { en: 'Jaipur, Rajasthan', hi: 'जयपुर, राजस्थान', hinglish: 'Jaipur, Rajasthan' },
    families: { en: '500+ Families Served', hi: '500+ परिवार सेवा प्रदान', hinglish: '500+ Families Served' },
    creator: { en: 'InsureGPT Creator', hi: 'InsureGPT निर्माता', hinglish: 'InsureGPT Creator' },
  },
  mission: {
    badge: { en: 'Our Mission', hi: 'हमारा मिशन', hinglish: 'Humara Mission' },
    heading1: { en: 'What', hi: 'क्या', hinglish: 'Kya' },
    headingHighlight: { en: 'Drives Us', hi: 'हमें प्रेरित करता है', hinglish: 'Drives Us' },
    text: { en: 'To make insurance simple, transparent, and accessible for every Indian — powered by AI, guided by trust.', hi: 'हर भारतीय के लिए बीमा सरल, पारदर्शी और सुलभ बनाना — AI द्वारा संचालित, विश्वास द्वारा निर्देशित।', hinglish: 'Har Indian ke liye insurance simple, transparent aur accessible banana — AI powered, trust guided.' },
  },
  values: [
    { title: { en: 'Transparency', hi: 'पारदर्शिता', hinglish: 'Transparency' }, desc: { en: 'No hidden charges, no mis-selling. Full commission disclosure on every plan.', hi: 'कोई छुपा शुल्क नहीं, कोई गलत बिक्री नहीं। हर योजना पर पूर्ण कमीशन प्रकटीकरण।', hinglish: 'No hidden charges, no mis-selling. Har plan pe full commission disclosure.' }, color: NAVY_800 },
    { title: { en: 'Technology', hi: 'तकनीक', hinglish: 'Technology' }, desc: { en: 'InsureGPT analyzes 51+ insurers in real-time to find your best match — zero commission bias.', hi: 'InsureGPT 51+ बीमाकर्ताओं को रियल-टाइम में विश्लेषित करता है — ज़ीरो कमीशन बायस।', hinglish: 'InsureGPT 51+ insurers ko real-time mein analyze karta hai — zero commission bias.' }, color: GOLD },
    { title: { en: 'Trust', hi: 'विश्वास', hinglish: 'Trust' }, desc: { en: 'IRDAI Registered POSP (IP429834). Your data is never sold. Free claim assistance till settlement.', hi: 'IRDAI पंजीकृत POSP (IP429834)। आपका डेटा कभी नहीं बेचा जाता। निपटान तक मुफ्त क्लेम सहायता।', hinglish: 'IRDAI Registered POSP (IP429834). Aapka data kabhi nahi becha jata. Free claim assistance till settlement.' }, color: NAVY_600 },
    { title: { en: 'Simplicity', hi: 'सरलता', hinglish: 'Simplicity' }, desc: { en: 'Hinglish, Hindi & English support. Insurance advice in your language, on WhatsApp — 24/7.', hi: 'हिंग्लिश, हिंदी और अंग्रेजी समर्थन। आपकी भाषा में बीमा सलाह, WhatsApp पर — 24/7।', hinglish: 'Hinglish, Hindi & English support. Aapki bhasha mein insurance advice, WhatsApp pe — 24/7.' }, color: NAVY_600 },
  ],
  story: {
    badge: { en: 'Our Story', hi: 'हमारी कहानी', hinglish: 'Hamari Kahani' },
    heading1: { en: 'How', hi: 'कैसे', hinglish: 'Kaise' },
    headingHighlight: { en: 'Paliwal Secure AI', hi: 'पालीवाल सिक्योर AI', hinglish: 'Paliwal Secure AI' },
    headingSuffix: { en: 'Was Born', hi: 'का जन्म हुआ', hinglish: 'Born Hua' },
    problemTitle: { en: 'The Problem:', hi: 'समस्या:', hinglish: 'Problem:' },
    problem: { en: 'Insurance in India is confusing. Jargon-heavy policies, pushy agents, hidden commissions, and no way to compare plans side‑by‑side. Most families end up buying the wrong plan — or no plan at all.', hi: 'भारत में बीमा उलझन भरा है। भारी शब्दावली, ज़बरदस्ती बिक्री, छुपे कमीशन, और योजनाओं की तुलना का कोई तरीका नहीं।', hinglish: 'India mein insurance confusing hai. Jargon-heavy policies, pushy agents, hidden commissions, aur plans compare karne ka koi tarika nahi.' },
    solutionTitle: { en: 'The Solution:', hi: 'समाधान:', hinglish: 'Solution:' },
    solution: { en: 'Paliwal Secure AI was founded by Himanshu Paliwal in Jaipur to solve this exact problem. Using AI‑powered comparison technology and InsureGPT — India\'s first Hinglish insurance AI — we make it possible for any Indian to find the right insurance in minutes, not weeks.', hi: 'हिमांशु पालीवाल ने जयपुर में Paliwal Secure AI की स्थापना इसी समस्या को हल करने के लिए की। AI-संचालित तुलना तकनीक और InsureGPT के साथ, हर भारतीय को मिनटों में सही बीमा मिल सकता है।', hinglish: 'Himanshu Paliwal ne Jaipur mein Paliwal Secure AI ki sthapana isi problem ko hal karne ke liye ki. AI-powered comparison tech aur InsureGPT ke saath, koi bhi Indian minutes mein sahi insurance pa sakta hai.' },
    resultTitle: { en: 'The Result:', hi: 'परिणाम:', hinglish: 'Result:' },
    result: { en: '500+ families trust us. 51+ insurers compared. Zero mis‑selling. Same premium as buying direct. And free claim support — always.', hi: '500+ परिवार हम पर भरोसा करते हैं। 51+ बीमाकर्ताओं की तुलना। ज़ीरो गलत बिक्री। सीधे खरीदने जैसा ही प्रीमियम। और मुफ्त क्लेम सहायता — हमेशा।', hinglish: '500+ families trust karti hain. 51+ insurers compare. Zero mis-selling. Same premium as buying direct. Aur free claim support — always.' },
  },
  milestones: [
    { year: '2022', title: { en: 'The Idea', hi: 'विचार', hinglish: 'The Idea' }, desc: { en: 'Frustrated by mis-selling in insurance, Himanshu envisioned an AI-first platform.', hi: 'बीमे में गलत बिक्री से निराश होकर, हिमांशु ने AI-प्रथम प्लेटफ़ॉर्म की कल्पना की।', hinglish: 'Insurance mein mis-selling se frustrated ho kar, Himanshu ne AI-first platform ki kalpana ki.' } },
    { year: '2023', title: { en: 'IRDAI Registration', hi: 'IRDAI पंजीकरण', hinglish: 'IRDAI Registration' }, desc: { en: 'Became an IRDAI-registered POSP (IP429834) — officially authorized to sell insurance.', hi: 'IRDAI-पंजीकृत POSP (IP429834) बने — बीमा बेचने के लिए आधिकारिक रूप से अधिकृत।', hinglish: 'IRDAI-registered POSP (IP429834) bane — insurance bechne ke liye officially authorized.' } },
    { year: '2024', title: { en: 'InsureGPT Launch', hi: 'InsureGPT लॉन्च', hinglish: 'InsureGPT Launch' }, desc: { en: "Launched India's first Hinglish AI insurance advisor — making insurance advice accessible 24/7.", hi: "भारत का पहला हिंग्लिश AI बीमा सलाहकार लॉन्च किया — बीमा सलाह 24/7 सुलभ बनाया।", hinglish: "India ka pehla Hinglish AI insurance advisor launch kiya — insurance advice 24/7 accessible banaya." } },
    { year: '2025', title: { en: '500+ Families', hi: '500+ परिवार', hinglish: '500+ Families' }, desc: { en: 'Trusted by 500+ Indian families across Jaipur, Delhi, Mumbai & 50+ cities. Growing every day.', hi: 'जयपुर, दिल्ली, मुंबई और 50+ शहरों में 500+ भारतीय परिवारों का भरोसा। हर दिन बढ़ते जा रहे हैं।', hinglish: 'Jaipur, Delhi, Mumbai & 50+ cities mein 500+ Indian families ka bharosa. Har din badh rahe hain.' } },
  ],
  contact: {
    badge: { en: 'Get In Touch', hi: 'संपर्क करें', hinglish: 'Contact Karein' },
    heading1: { en: "We're Just a", hi: 'हम बस एक', hinglish: "Hum Bas Ek" },
    headingHighlight: { en: 'Message Away', hi: 'संदेश दूर', hinglish: 'Message Door' },
    whatsapp: { en: 'WhatsApp', hi: 'व्हाट्सएप', hinglish: 'WhatsApp' },
    whatsappAvail: { en: '24/7 Available', hi: '24/7 उपलब्ध', hinglish: '24/7 Available' },
    email: { en: 'Email', hi: 'ईमेल', hinglish: 'Email' },
    emailResp: { en: 'Response within 24hrs', hi: '24 घंटे में जवाब', hinglish: '24hrs mein response' },
    location: { en: 'Location', hi: 'स्थान', hinglish: 'Location' },
    locationVal: { en: 'Jaipur, Rajasthan', hi: 'जयपुर, राजस्थान', hinglish: 'Jaipur, Rajasthan' },
    irdaiTitle: { en: 'IRDAI Registration Details', hi: 'IRDAI पंजीकरण विवरण', hinglish: 'IRDAI Registration Details' },
    irdaiText: { en: 'Paliwal Secure AI is an IRDAI‑registered insurance intermediary.', hi: 'पालीवाल सिक्योर AI एक IRDAI-पंजीकृत बीमा मध्यस्थ है।', hinglish: 'Paliwal Secure AI ek IRDAI-registered insurance intermediary hai.' },
    ctaLabel: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें', hinglish: 'WhatsApp pe Chat Karein' },
    ctaSecondary: { en: 'Back to Home', hi: 'होम पेज वापस', hinglish: 'Back to Home' },
  },
};

/* ── Section Divider ─────────────────────────────────────────────────────── */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="mx-3 h-1.5 w-1.5 rounded-full bg-primary/40" />
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

export default function AboutClientContent() {
  const { language } = useLanguage();
  const pt = (obj: Tr) => obj[language] || obj.en;

  const valueIcons = [Eye, Brain, Heart, Globe];

  return (
    <>
      {/* ═══════════════════ PAGE HEADER ═══════════════════ */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: `linear-gradient(135deg, ${NAVY_800} 0%, ${NAVY_600} 50%, #082247 100%)` }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-[#4A4F57] dark:text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0E1116] dark:text-white/80">{pt(pageText.hero.title1)}</span>
          </nav>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(201,138,28,0.15)', color: GOLD, border: '1px solid rgba(201,138,28,0.3)' }}
          >
            <Shield className="w-3.5 h-3.5" />
            {pt(pageText.hero.badge)}
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {pt(pageText.hero.title1)} <span className="gradient-text">{pt(pageText.hero.titleHighlight)}</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#4A4F57] dark:text-white/70 max-w-2xl mx-auto mb-2">
            {pt(pageText.hero.subtitle)}
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ FOUNDER HERO CARD ═══════════════════ */}
      <section className="relative -mt-12 z-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="glass-card p-6 sm:p-8 md:p-10 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
            {/* Avatar — Professional photo with gold ring */}
            <div className="shrink-0">
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-[#C98A1C] ring-offset-4 ring-offset-white dark:ring-offset-[#0A1330] shadow-lg shadow-[#C98A1C]/20"
              >
                <img
                  src="/images/himanshu-photo.jpg"
                  alt="Himanshu Paliwal — IRDAI Registered POSP (IP429834)"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0E1116] dark:text-white">{pt(pageText.founder.name)}</h2>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ background: 'rgba(201,138,28,0.12)', color: GOLD }}
                >
                  <CheckCircle2 className="w-3 h-3" /> {pt(pageText.founder.verified)}
                </span>
              </div>
              <p className="text-sm font-semibold mb-1 text-[#B8482C] dark:text-[#E8C872]">
                {pt(pageText.founder.pospTitle)}
              </p>
              <p
                className="text-xs font-mono px-3 py-1 rounded-lg inline-block mb-4"
                style={{ background: 'rgba(201,138,28,0.08)', color: GOLD }}
              >
                {pt(pageText.founder.pospCode)}
              </p>
              <p className="text-[#4A4F57] dark:text-white/70 mb-3">
                {pt(pageText.founder.desc)}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4A4F57] dark:text-white/60">
                  <MapPin className="w-3.5 h-3.5" style={{ color: GOLD }} /> {pt(pageText.founder.location)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4A4F57] dark:text-white/60">
                  <Award className="w-3.5 h-3.5" style={{ color: GOLD }} /> {pt(pageText.founder.families)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4A4F57] dark:text-white/60">
                  <Bot className="w-3.5 h-3.5" style={{ color: GOLD }} /> {pt(pageText.founder.creator)}
                </span>
              </div>
              {/* Instagram Prominent Link */}
              <div className="flex items-center justify-center md:justify-start mt-4">
                <a
                  href="https://www.instagram.com/palival_visuals?igsh=YnB4MmVkdXdiejVk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/ig inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #C98A1C 0%, #C98A1C 50%, #C98A1C 100%)',
                    color: NAVY_800,
                    boxShadow: '0 4px 15px rgba(201,138,28,0.3)',
                  }}
                >
                  <Instagram className="w-5 h-5" />
                  <span>Follow on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-2.5 mt-3">
                {[
                  { icon: Twitter, href: 'https://x.com/Paliwalinsure', label: 'X' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/himanshu-paliwal-41aa37414', label: 'LinkedIn' },
                  { icon: Youtube, href: 'https://youtube.com/@paliwalinsure', label: 'YouTube' },
                ].map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/icon relative w-9 h-9 rounded-lg border border-[#C98A1C]/12 bg-[#0A1330] flex items-center justify-center text-[#4A4F57] dark:text-white/50 hover:text-[#C98A1C] hover:border-[#C98A1C]/40 hover:bg-[#C98A1C]/8 transition-all duration-300 overflow-hidden"
                      aria-label={social.label}
                    >
                      <span
                        className="absolute inset-0 -translate-x-full group-hover/icon:translate-x-full transition-transform duration-500"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,201,122,0.12), transparent)' }}
                        aria-hidden="true"
                      />
                      <Icon className="w-4 h-4 relative z-10" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ MISSION & VALUES ═══════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(201,138,28,0.1)', color: GOLD, border: '1px solid rgba(201,138,28,0.2)' }}
          >
            <Target className="w-3.5 h-3.5" /> {pt(pageText.mission.badge)}
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#0E1116] dark:text-white mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {pt(pageText.mission.heading1)} <span className="gradient-text">{pt(pageText.mission.headingHighlight)}</span>
          </h2>
          <p className="text-[#4A4F57] dark:text-white/60 max-w-2xl mx-auto mb-2">
            {pt(pageText.mission.text)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pageText.values.map((v, i) => {
            const IconComp = valueIcons[i];
            return (
              <div
                key={i}
                className="glass-card p-6 text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ border: '1px solid rgba(201,138,28,0.12)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${v.color}, ${v.color}dd)` }}
                >
                  <IconComp className="w-7 h-7 text-[#B8482C] dark:text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0E1116] dark:text-white mb-1">{pt(v.title)}</h3>
                <p className="text-sm text-[#4A4F57] dark:text-white/60">{pt(v.desc)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ OUR STORY / TIMELINE ═══════════════════ */}
      <section
        className="relative py-16 md:py-20"
        style={{ background: 'rgba(201,138,28,0.03)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Story Text */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(201,138,28,0.12)', color: GOLD }}
              >
                <Sparkles className="w-3.5 h-3.5" /> {pt(pageText.story.badge)}
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0E1116] dark:text-white mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {pt(pageText.story.heading1)} <span className="gradient-text">{pt(pageText.story.headingHighlight)}</span> {pt(pageText.story.headingSuffix)}
              </h2>

              <div className="space-y-4 text-[#4A4F57] dark:text-white/60">
                <p>
                  <strong className="text-[#0E1116] dark:text-white">{pt(pageText.story.problemTitle)}</strong> {pt(pageText.story.problem)}
                </p>
                <p>
                  <strong className="text-[#0E1116] dark:text-white">{pt(pageText.story.solutionTitle)}</strong> {pt(pageText.story.solution)}
                </p>
                <p>
                  <strong className="text-[#0E1116] dark:text-white">{pt(pageText.story.resultTitle)}</strong> {pt(pageText.story.result)}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {pageText.milestones.map((m, i) => {
                const icons = [Lightbulb, Shield, Bot, Users];
                const MIcon = icons[i];
                return (
                  <div
                    key={i}
                    className="glass-card p-5 flex gap-4 items-start hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300"
                    style={{ border: '1px solid rgba(201,138,28,0.12)' }}
                  >
                    <div
                      className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})` }}
                    >
                      <MIcon className="w-6 h-6 text-[#B8482C] dark:text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                          style={{ background: 'rgba(201,138,28,0.12)', color: GOLD }}
                        >
                          {m.year}
                        </span>
                        <h3 className="font-bold text-[#0E1116] dark:text-white">{pt(m.title)}</h3>
                      </div>
                      <p className="text-sm text-[#4A4F57] dark:text-white/60">{pt(m.desc)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(201,138,28,0.12)', color: GOLD }}
          >
            <Phone className="w-3.5 h-3.5" /> {pt(pageText.contact.badge)}
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#0E1116] dark:text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {pt(pageText.contact.heading1)} <span className="gradient-text">{pt(pageText.contact.headingHighlight)}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"
            className="glass-card p-6 text-center group cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
              <MessageCircle className="w-7 h-7 text-[#2D6A4F] dark:text-white" />
            </div>
            <h3 className="font-bold text-[#0E1116] dark:text-white mb-1">{pt(pageText.contact.whatsapp)}</h3>
            <p className="text-sm" style={{ color: GOLD }}>+91 9257877312</p>
            <p className="text-xs text-[#4A4F57] dark:text-white/50 mt-1">{pt(pageText.contact.whatsappAvail)}</p>
          </a>

          <a href="mailto:himanshupaliwalpbp@gmail.com"
            className="glass-card p-6 text-center group cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})` }}>
              <Mail className="w-7 h-7 text-[#B8860B] dark:text-white" />
            </div>
            <h3 className="font-bold text-[#0E1116] dark:text-white mb-1">{pt(pageText.contact.email)}</h3>
            <p className="text-sm" style={{ color: GOLD }}>himanshupaliwalpbp@gmail.com</p>
            <p className="text-xs text-[#4A4F57] dark:text-white/50 mt-1">{pt(pageText.contact.emailResp)}</p>
          </a>

          <div className="glass-card p-6 text-center group hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${NAVY_600}, #1E3A5F)` }}>
              <MapPin className="w-7 h-7 text-[#B8482C] dark:text-white" />
            </div>
            <h3 className="font-bold text-[#0E1116] dark:text-white mb-1">{pt(pageText.contact.location)}</h3>
            <p className="text-sm" style={{ color: GOLD }}>{pt(pageText.contact.locationVal)}</p>
          </div>
        </div>

        {/* IRDAI Registration Notice */}
        <div
          className="mt-8 max-w-3xl mx-auto rounded-2xl p-5 text-center"
          style={{ background: 'rgba(201,138,28,0.08)', border: '1px solid rgba(201,138,28,0.25)' }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5" style={{ color: GOLD }} />
            <span className="font-bold text-[#0E1116] dark:text-white">{pt(pageText.contact.irdaiTitle)}</span>
          </div>
          <p className="text-sm text-[#4A4F57] dark:text-white/60">
            {pt(pageText.contact.irdaiText)}
          </p>
          <p className="text-xs font-mono font-semibold mt-2" style={{ color: GOLD }}>
            POSP Code: IP429834
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
            <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm">
              <span>{pt(pageText.contact.ctaLabel)}</span>
            </ShinyButton>
          </a>
          <Link href="/">
            <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm">
              <span>{pt(pageText.contact.ctaSecondary)}</span>
            </ShinyButton>
          </Link>
        </div>
      </section>
    </>
  );
}
