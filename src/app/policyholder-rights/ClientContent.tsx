'use client';

import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import Link from 'next/link';
import { useState } from 'react';
import {
  Shield, Clock, FileCheck, Phone, Mail, AlertCircle,
  CheckCircle, Scale, Users, Building2, ExternalLink,
} from 'lucide-react';

// ── Translation helper ──────────────────────────────────────────────────────
type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

// ── Inline page translations ────────────────────────────────────────────────
const pageText = {
  hero: {
    badge: { en: "IRDAI Regulations 2025-26", hi: "IRDAI नियम 2025-26", hinglish: "IRDAI Regulations 2025-26" },
    title1: { en: "Your Insurance", hi: "आपके बीमा", hinglish: "Aapke Insurance" },
    titleHighlight: { en: "Rights", hi: "अधिकार", hinglish: "Rights" },
    desc: {
      en: "Know your rights as a policyholder under IRDAI regulations. If your claim is rejected unfairly, you have legal protection and multiple escalation options.",
      hi: "IRDAI नियमों के तहत पॉलिसीधारक के रूप में अपने अधिकार जानें। यदि आपका क्लेम अनुचित रूप से अस्वीकृत होता है, तो आपके पास कानूनी सुरक्षा और कई एस्कलेशन विकल्प हैं।",
      hinglish: "IRDAI regulations ke tahat policyholder ke roop mein apne rights jaanein. Agar aapka claim unfairly reject hota hai, toh aapke paas legal protection aur multiple escalation options hain."
    },
    ctaWhatsApp: { en: "💬 Get Free Help", hi: "💬 मुफ़्त मदद लें", hinglish: "💬 Free Help Lo" },
    ctaClaimGuide: { en: "📋 Claim Guide", hi: "📋 क्लेम गाइड", hinglish: "📋 Claim Guide" },
  },
  rights: [
    {
      title: { en: "30-Day Free Look Period", hi: "30 दिन की फ्री-लुक अवधि", hinglish: "30-Day Free Look Period" },
      description: { en: "You can cancel your policy within 15-30 days of receiving it if not satisfied. Full refund after deducting stamp duty and proportionate risk premium.", hi: "आप असंतुष्ट होने पर पॉलिसी प्राप्ति के 15-30 दिन के भीतर रद्द कर सकते हैं। स्टैम्प ड्यूटी और आनुपातिक जोखिम प्रीमियम घटाकर पूर्ण रिफंड।", hinglish: "Aap unsatisfied hone pe policy receive ke 15-30 din ke bheetar cancel kar sakte hain. Stamp duty aur proportionate risk premium ghata kar full refund." },
      icon: 'clock',
    },
    {
      title: { en: "Moratorium Period (5 Years)", hi: "मोरेटोरियम अवधि (5 वर्ष)", hinglish: "Moratorium Period (5 Years)" },
      description: { en: "After 5 continuous years of policy, no claim can be rejected for non-disclosure (except fraud). This is reduced from 8 years in 2025.", hi: "5 वर्ष निरंतर पॉलिसी के बाद, गैर-प्रकटीकरण के लिए कोई क्लेम अस्वीकृत नहीं किया जा सकता (धोखाधड़ी को छोड़कर)। यह 2025 में 8 वर्ष से घटाया गया है।", hinglish: "5 saal continuous policy ke baad, non-disclosure ke liye koi claim reject nahi kiya ja sakta (fraud ko chodke). Yeh 2025 mein 8 saal se ghataaya gaya hai." },
      icon: 'shield',
    },
    {
      title: { en: "Portability Right", hi: "पोर्टेबिलिटी अधिकार", hinglish: "Portability Right" },
      description: { en: "You can switch insurers without losing accrued benefits (waiting period, no claim bonus). New insurer cannot impose fresh waiting periods for existing conditions.", hi: "आप जमा लाभ (प्रतीक्षा अवधि, नो-क्लेम बोनस) खोए बिना बीमाकर्ता बदल सकते हैं। नया बीमाकर्ता मौजूदा स्थितियों के लिए नई प्रतीक्षा अवधि नहीं लगा सकता।", hinglish: "Aap accrued benefits (waiting period, no claim bonus) khoye bina insurer badal sakte hain. Naya insurer existing conditions ke liye fresh waiting period nahi laga sakta." },
      icon: 'users',
    },
    {
      title: { en: "Claim Settlement Timeline", hi: "क्लेम निपटान समयसीमा", hinglish: "Claim Settlement Timeline" },
      description: { en: "Insurers must settle claims within 30 days of receiving all documents. Cashless pre-authorisation within 1 hour, discharge within 3 hours (IRDAI mandate).", hi: "बीमाकर्ताओं को सभी दस्तावेज़ प्राप्ति के 30 दिन के भीतर क्लेम निपटान करना चाहिए। कैशलेस प्री-ऑथ 1 घंटे में, डिस्चार्ज 3 घंटे में (IRDAI अनिवार्य)।", hinglish: "Insurers ko sabhi documents receive ke 30 din ke bheetar claims settle karne chahiye. Cashless pre-auth 1 ghante mein, discharge 3 ghante mein (IRDAI mandate)." },
      icon: 'clock',
    },
    {
      title: { en: "Grievance Redressal", hi: "शिकायत निवारण", hinglish: "Grievance Redressal" },
      description: { en: "Every insurer has an internal ombudsman. You can escalate to IRDAI Bima Bharosa portal or Insurance Ombudsman (free, for claims up to ₹50 lakh).", hi: "हर बीमाकर्ता के पास आंतरिक लोकपाल है। आप IRDAI बीमा भरोसा पोर्टल या बीमा लोकपाल (मुफ़्त, ₹50 लाख तक के क्लेम) तक एस्केलेट कर सकते हैं।", hinglish: "Har insurer ke paas internal ombudsman hai. Aap IRDAI Bima Bharosa portal ya Insurance Ombudsman (free, ₹50 lakh tak ke claims) tak escalate kar sakte hain." },
      icon: 'scale',
    },
    {
      title: { en: "Nomination & Assignment", hi: "नामांकन और हस्तांतरण", hinglish: "Nomination & Assignment" },
      description: { en: "You can nominate beneficiaries. Assignment allows transferring policy ownership. Both are your legal rights under IRDAI regulations.", hi: "आप लाभार्थी नामांकित कर सकते हैं। असाइनमेंट पॉलिसी स्वामित्व हस्तांतरण की अनुमति देता है। दोनों IRDAI नियमों के तहत आपके कानूनी अधिकार हैं।", hinglish: "Aap beneficiaries nominate kar sakte hain. Assignment policy ownership transfer ki anumati deta hai. Dono IRDAI regulations ke tahat aapke legal rights hain." },
      icon: 'filecheck',
    },
  ],
  tabs: {
    appeal: { en: "Claim Rejection Appeal", hi: "क्लेम अस्वीकृति अपील", hinglish: "Claim Rejection Appeal" },
    timeline: { en: "IRDAI Timelines", hi: "IRDAI समयसीमा", hinglish: "IRDAI Timelines" },
    regulations: { en: "Key Regulations", hi: "प्रमुख नियम", hinglish: "Key Regulations" },
  },
  appeal: {
    heading: { en: "Step-by-Step: How to Appeal a Rejected Claim", hi: "चरण-दर-चरण: अस्वीकृत क्लेम की अपील कैसे करें", hinglish: "Step-by-Step: Rejected Claim Ki Appeal Kaise Karein" },
    desc: { en: "Follow these steps if your insurance claim is rejected or delayed unreasonably.", hi: "यदि आपका बीमा क्लेम अस्वीकृत या अनुचित रूप से विलंबित होता है तो इन चरणों का पालन करें।", hinglish: "Agar aapka insurance claim reject ya unreasonably delay hota hai toh in steps ko follow karein." },
    steps: [
      { title: { en: "Contact Insurer Grievance Cell", hi: "बीमाकर्ता शिकायत सेल से संपर्क करें", hinglish: "Insurer Grievance Cell Se Contact Karein" }, description: { en: "First, raise a complaint with the insurer's internal grievance redressal officer. Most issues resolved here within 15 days.", hi: "पहले बीमाकर्ता के आंतरिक शिकायत निवारण अधिकारी के पास शिकायत दर्ज करें। अधिकांश मुद्दे 15 दिन में यहाँ सुलझते हैं।", hinglish: "Pehle insurer ke internal grievance redressal officer paas complaint darj karein. Zyadaatar issues 15 din mein yahan sulajh jaate hain." }, contact: { en: "Find on insurer's website under \"Grievance Redressal\"", hi: "बीमाकर्ता की वेबसाइट पर \"शिकायत निवारण\" में खोजें", hinglish: "Insurer ki website pe \"Grievance Redressal\" mein dhoondhein" } },
      { title: { en: "Escalate to IRDAI Bima Bharosa Portal", hi: "IRDAI बीमा भरोसा पोर्टल पर एस्केलेट करें", hinglish: "IRDAI Bima Bharosa Portal Pe Escalate Karein" }, description: { en: "If not satisfied, register complaint on IRDAI's centralized portal. Insurers must respond within 15 days.", hi: "असंतुष्ट हों तो IRDAI के केंद्रीकृत पोर्टल पर शिकायत दर्ज करें। बीमाकर्ताओं को 15 दिन में जवाब देना चाहिए।", hinglish: "Unsatisfied ho toh IRDAI ke centralized portal pe complaint darj karein. Insurers ko 15 din mein respond karna chahiye." }, contact: { en: "https://bimabharosa.irda.gov.in | Toll-free: bimabharosa.irda.gov.in", hi: "https://bimabharosa.irda.gov.in | टोल-फ्री: bimabharosa.irda.gov.in", hinglish: "https://bimabharosa.irda.gov.in | Toll-free: bimabharosa.irda.gov.in" } },
      { title: { en: "Approach Insurance Ombudsman", hi: "बीमा लोकपाल से संपर्क करें", hinglish: "Insurance Ombudsman Se Contact Karein" }, description: { en: "For claims up to ₹50 lakh, you can file a complaint with the Insurance Ombudsman (free service). Award binding on insurer.", hi: "₹50 लाख तक के क्लेम के लिए, बीमा लोकपाल के पास शिकायत दर्ज कर सकते हैं (मुफ़्त सेवा)। पुरस्कार बीमाकर्ता पर बाध्यकारी।", hinglish: "₹50 lakh tak ke claims ke liye, Insurance Ombudsman ke paas complaint darj kar sakte hain (free service). Award insurer pe binding hai." }, contact: { en: "12 offices across India. Find nearest on IRDAI website.", hi: "भारत भर में 12 कार्यालय। IRDAI वेबसाइट पर निकटतम खोजें।", hinglish: "12 offices across India. Nearest IRDAI website pe dhoondhein." } },
      { title: { en: "Consumer Court / Legal Action", hi: "उपभोक्ता न्यायालय / कानूनी कार्रवाई", hinglish: "Consumer Court / Legal Action" }, description: { en: "If ombudsman fails or claim exceeds ₹50 lakh, approach District/State/National Consumer Disputes Redressal Commission.", hi: "यदि लोकपाल विफल हो या क्लेम ₹50 लाख से अधिक हो, तो ज़िला/राज्य/राष्ट्रीय उपभोक्ता विवाद निवारण आयोग से संपर्क करें।", hinglish: "Agar ombudsman fail ho ya claim ₹50 lakh se zyada ho, toh District/State/National Consumer Disputes Redressal Commission se contact karein." }, contact: { en: "Legal assistance may be required; document all correspondence.", hi: "कानूनी सहायता आवश्यक हो सकती है; सभी पत्राचार दस्तावेज़ीकरण करें।", hinglish: "Legal assistance zaroori ho sakti hai; sab correspondence document karein." } },
    ],
    important: { en: "Always keep copies of all correspondence, claim forms, medical reports, and the insurer's rejection letter. These are essential for appeal.", hi: "हमेशा सभी पत्राचार, क्लेम फॉर्म, चिकित्सा रिपोर्ट और बीमाकर्ता के अस्वीकृति पत्र की प्रतियाँ रखें। ये अपील के लिए आवश्यक हैं।", hinglish: "Hamesha sabhi correspondence, claim forms, medical reports aur insurer ki rejection letter ki copies rakhein. Yeh appeal ke liye zaroori hain." },
  },
  timeline: {
    heading: { en: "Insurer Response Timelines (IRDAI Mandated)", hi: "बीमाकर्ता प्रतिक्रिया समयसीमा (IRDAI अनिवार्य)", hinglish: "Insurer Response Timelines (IRDAI Mandated)" },
    desc: { en: "Insurers must adhere to these timelines; delays can be reported to IRDAI.", hi: "बीमाकर्ताओं को इन समयसीमाओं का पालन करना चाहिए; देरी की सूचना IRDAI को दी जा सकती है।", hinglish: "Insurers ko in timelines ka palan karna chahiye; delays ki report IRDAI ko di ja sakti hai." },
    rows: [
      { rule: { en: "Cashless pre-authorisation decision", hi: "कैशलेस प्री-ऑथ निर्णय", hinglish: "Cashless pre-auth decision" }, timeline: { en: "Within 1 hour of receiving documents", hi: "दस्तावेज़ प्राप्ति के 1 घंटे के भीतर", hinglish: "Documents receive ke 1 ghante ke bheetar" } },
      { rule: { en: "Discharge approval (final bill)", hi: "डिस्चार्ज अनुमोदन (अंतिम बिल)", hinglish: "Discharge approval (final bill)" }, timeline: { en: "Within 3 hours of submission", hi: "जमा करने के 3 घंटे के भीतर", hinglish: "Submission ke 3 ghante ke bheetar" } },
      { rule: { en: "Claim settlement (reimbursement)", hi: "क्लेम निपटान (प्रतिपूर्ति)", hinglish: "Claim settlement (reimbursement)" }, timeline: { en: "Within 30 days of all documents", hi: "सभी दस्तावेज़ों के 30 दिन के भीतर", hinglish: "Sabhi documents ke 30 din ke bheetar" } },
      { rule: { en: "Grievance acknowledgement", hi: "शिकायत स्वीकृति", hinglish: "Grievance acknowledgement" }, timeline: { en: "Within 3 working days", hi: "3 कार्य दिवसों के भीतर", hinglish: "3 working days ke bheetar" } },
      { rule: { en: "Grievance resolution (insurer level)", hi: "शिकायत समाधान (बीमाकर्ता स्तर)", hinglish: "Grievance resolution (insurer level)" }, timeline: { en: "Within 15 days", hi: "15 दिन के भीतर", hinglish: "15 din ke bheetar" } },
    ],
    source: { en: "Source: IRDAI (Insurance Regulatory and Development Authority of India) circulars 2025-26.", hi: "स्रोत: IRDAI (भारतीय बीमा विनियामक और विकास प्राधिकरण) परिपत्र 2025-26।", hinglish: "Source: IRDAI (Insurance Regulatory and Development Authority of India) circulars 2025-26." },
  },
  regulations: {
    heading: { en: "Recent IRDAI Regulations (2025-26)", hi: "हालिया IRDAI नियम (2025-26)", hinglish: "Recent IRDAI Regulations (2025-26)" },
    desc: { en: "These changes strengthen policyholder protection.", hi: "ये परिवर्तन पॉलिसीधारक सुरक्षा को मजबूत करते हैं।", hinglish: "Yeh changes policyholder protection ko mazboot karte hain." },
    items: [
      { en: "PED Waiting Period capped at 3 years (max) – IRDAI 2025", hi: "PED प्रतीक्षा अवधि अधिकतम 3 वर्ष तक सीमित – IRDAI 2025", hinglish: "PED Waiting Period max 3 saal tak capped – IRDAI 2025" },
      { en: "No upper age limit for buying health insurance – insurers must offer at least one plan", hi: "हेल्थ इंश्योरेंस खरीदने की कोई ऊपरी आयु सीमा नहीं – बीमाकर्ताओं को कम से कम एक प्लान देना चाहिए", hinglish: "Health insurance khareedne ki koi upper age limit nahi – insurers ko kam se kam ek plan dena chahiye" },
      { en: "Lifelong renewability guaranteed for all retail health policies", hi: "सभी खुदरा हेल्थ पॉलिसियों के लिए आजीवन नवीनीकरण गारंटी", hinglish: "Sabhi retail health policies ke liye lifelong renewability guaranteed" },
      { en: "100% cashless claims mandate – insurers cannot deny cashless facility", hi: "100% कैशलेस क्लेम अनिवार्य – बीमाकर्ता कैशलेस सुविधा से इनकार नहीं कर सकते", hinglish: "100% cashless claims mandatory – insurers cashless facility deny nahi kar sakte" },
      { en: "Penalty on insurers for delays (from shareholders' funds)", hi: "देरी पर बीमाकर्ताओं पर जुर्माना (शेयरधारकों के फंड से)", hinglish: "Delay pe insurers pe penalty (shareholders' funds se)" },
    ],
    ombudsmanNote: { en: "Insurers must now maintain an internal ombudsman to resolve disputes up to ₹50 lakh. This is mandatory from July 2025.", hi: "बीमाकर्ताओं को अब ₹50 लाख तक विवाद सुलझाने के लिए आंतरिक लोकपाल रखना चाहिए। यह जुलाई 2025 से अनिवार्य है।", hinglish: "Insurers ko ab ₹50 lakh tak disputes resolve karne ke liye internal ombudsman rakhna chahiye. Yeh July 2025 se mandatory hai." },
  },
  help: {
    heading: { en: "Where to Get Help?", hi: "मदद कहाँ से प्राप्त करें?", hinglish: "Madad Kahan Se Paayein?" },
    portalTitle: { en: "Bima Bharosa Portal", hi: "बीमा भरोसा पोर्टल", hinglish: "Bima Bharosa Portal" },
    portalUrl: { en: "https://bimabharosa.irda.gov.in", hi: "https://bimabharosa.irda.gov.in", hinglish: "https://bimabharosa.irda.gov.in" },
    helplineTitle: { en: "IRDAI Toll-Free Helpline", hi: "IRDAI टोल-फ्री हेल्पलाइन", hinglish: "IRDAI Toll-Free Helpline" },
    helplineNum: { en: "bimabharosa.irda.gov.in", hi: "bimabharosa.irda.gov.in", hinglish: "bimabharosa.irda.gov.in" },
    ombudsmanTitle: { en: "Ombudsman Offices", hi: "लोकपाल कार्यालय", hinglish: "Ombudsman Offices" },
    ombudsmanDesc: { en: "Find nearest office on IRDAI website", hi: "IRDAI वेबसाइट पर निकटतम कार्यालय खोजें", hinglish: "IRDAI website pe nearest office dhoondhein" },
  },
  related: {
    claimsTitle: { en: "Claims Dashboard", hi: "क्लेम डैशबोर्ड", hinglish: "Claims Dashboard" },
    claimsDesc: { en: "CSR & grievance data", hi: "CSR और शिकायत डेटा", hinglish: "CSR & grievance data" },
    sellingTitle: { en: "Mis-selling Alert", hi: "गलत बिक्री अलर्ट", hinglish: "Mis-selling Alert" },
    sellingDesc: { en: "Know the red flags", hi: "खतरे के संकेत जानें", hinglish: "Red flags jaanein" },
    insightsTitle: { en: "Industry Insights", hi: "उद्योग अंतर्दृष्टि", hinglish: "Industry Insights" },
    insightsDesc: { en: "IRDAI market data", hi: "IRDAI बाज़ार डेटा", hinglish: "IRDAI market data" },
  },
  disclaimer: {
    text: { en: "This information is for general awareness and based on IRDAI regulations (2025-26). For specific legal advice, consult a professional or contact IRDAI directly.", hi: "यह जानकारी सामान्य जागरूकता के लिए है और IRDAI नियमों (2025-26) पर आधारित है। विशिष्ट कानूनी सलाह के लिए, पेशेवर से परामर्श करें या सीधे IRDAI से संपर्क करें।", hinglish: "Yeh information general awareness ke liye hai aur IRDAI regulations (2025-26) pe based hai. Specific legal advice ke liye, professional se consult karein ya directly IRDAI se contact karein." },
    updated: { en: "Last updated: May 2026.", hi: "अंतिम अपडेट: मई 2026।", hinglish: "Last updated: May 2026." },
  },
  cta: {
    heading: { en: "Need Help with a", hi: "मदद चाहिए", hinglish: "Madad Chahiye" },
    headingHighlight: { en: "Claim Issue?", hi: "क्लेम समस्या में?", hinglish: "Claim Issue Mein?" },
    desc: { en: "Chat with Himanshu Paliwal on WhatsApp — IRDAI Certified Insurance Advisor. Free claim assistance, grievance escalation support. No charge, no spam.", hi: "हिमांशु पालीवाल से WhatsApp पर चैट करें — IRDAI प्रमाणित बीमा सलाहकार। मुफ़्त क्लेम सहायता, शिकायत एस्कलेशन समर्थन।", hinglish: "Himanshu Paliwal se WhatsApp pe chat karein — IRDAI Certified Insurance Advisor. Free claim assistance, grievance escalation support. No charge, no spam." },
    ctaWhatsApp: { en: "💬 Chat on WhatsApp", hi: "💬 WhatsApp पर चैट करें", hinglish: "💬 WhatsApp pe Chat Karein" },
  },
};

// ── Color maps for icons ─────────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = { clock: Clock, shield: Shield, users: Users, scale: Scale, filecheck: FileCheck };
const colorMap: Record<string, { color: string; bg: string; border: string }> = {
  clock: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800/30' },
  shield: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800/30' },
  users: { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800/30' },
  scale: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800/30' },
  filecheck: { color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-200 dark:border-teal-800/30' },
};

// ── Client Component ────────────────────────────────────────────────────────
export default function ClientContent() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('appeal');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{pt(pageText.hero.badge, language)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-6">
            {pt(pageText.hero.title1, language)} <span className="gradient-text">{pt(pageText.hero.titleHighlight, language)}</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            {pt(pageText.hero.desc, language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20my%20insurance%20rights" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue"><span>{pt(pageText.hero.ctaWhatsApp, language)}</span></ShinyButton>
            </a>
            <Link href="/claim-guide">
              <ShinyButton variant="secondary"><span>{pt(pageText.hero.ctaClaimGuide, language)}</span></ShinyButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Rights Grid */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageText.rights.map((right, idx) => {
              const Icon = iconMap[right.icon] || Shield;
              const colors = colorMap[right.icon] || colorMap.shield;
              return (
                <div
                  key={idx}
                  className={`glass-card rounded-xl p-6 ${colors.border} hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`rounded-lg p-2 ${colors.bg}`}>
                      <Icon className={`h-5 w-5 ${colors.color}`} />
                    </div>
                    <h3 className="text-lg font-bold">{pt(right.title, language)}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pt(right.description, language)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Tabs */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {(['appeal', 'timeline', 'regulations'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {pt(pageText.tabs[tab], language)}
              </button>
            ))}
          </div>

          {/* Appeal Tab */}
          {activeTab === 'appeal' && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-2">{pt(pageText.appeal.heading, language)}</h2>
              <p className="text-sm text-muted-foreground mb-6">{pt(pageText.appeal.desc, language)}</p>
              <div className="space-y-6">
                {pageText.appeal.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{pt(step.title, language)}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{pt(step.description, language)}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{pt(step.contact, language)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-sm border border-amber-200 dark:border-amber-800/30">
                <AlertCircle className="inline h-4 w-4 text-amber-600 dark:text-amber-400 mr-1" />
                <strong className="text-amber-800 dark:text-amber-300">Important:</strong>{' '}
                <span className="text-foreground/80">{pt(pageText.appeal.important, language)}</span>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-2">{pt(pageText.timeline.heading, language)}</h2>
              <p className="text-sm text-muted-foreground mb-6">{pt(pageText.timeline.desc, language)}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-semibold">{pt({ en: "Process / Action", hi: "प्रक्रिया / कार्रवाई", hinglish: "Process / Action" }, language)}</th>
                      <th className="text-left py-3 px-2 font-semibold gradient-text">{pt({ en: "Maximum Timeline", hi: "अधिकतम समयसीमा", hinglish: "Maximum Timeline" }, language)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageText.timeline.rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2">{pt(row.rule, language)}</td>
                        <td className="py-3 px-2 font-medium text-green-600 dark:text-green-400">{pt(row.timeline, language)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">{pt(pageText.timeline.source, language)}</div>
            </div>
          )}

          {/* Regulations Tab */}
          {activeTab === 'regulations' && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-2">{pt(pageText.regulations.heading, language)}</h2>
              <p className="text-sm text-muted-foreground mb-6">{pt(pageText.regulations.desc, language)}</p>
              <ul className="space-y-3">
                {pageText.regulations.items.map((reg, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{pt(reg, language)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/30">
                <p className="text-sm flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{pt(pageText.regulations.ombudsmanNote, language)}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Help Resources */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="glass-card rounded-xl p-6 border-blue-200 dark:border-blue-800/30">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {pt(pageText.help.heading, language)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>{pt(pageText.help.portalTitle, language)}</strong>
                  <p className="text-muted-foreground">{pt(pageText.help.portalUrl, language)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>{pt(pageText.help.helplineTitle, language)}</strong>
                  <p className="text-muted-foreground">{pt(pageText.help.helplineNum, language)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>{pt(pageText.help.ombudsmanTitle, language)}</strong>
                  <p className="text-muted-foreground">{pt(pageText.help.ombudsmanDesc, language)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {pt(pageText.cta.heading, language)} <span className="gradient-text">{pt(pageText.cta.headingHighlight, language)}</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {pt(pageText.cta.desc, language)}
            </p>
            <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20my%20insurance%20claim%20or%20rights" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue"><span>{pt(pageText.cta.ctaWhatsApp, language)}</span></ShinyButton>
            </a>
            <div className="mt-8 glass-card rounded-lg p-4 max-w-md mx-auto">
              <p className="font-semibold text-sm">Himanshu Paliwal</p>
              <p className="text-xs text-muted-foreground">POSP Code: IP429834</p>
              <p className="text-xs text-muted-foreground">IRDAI Certified Insurance Advisor</p>
              <p className="text-xs text-muted-foreground">PaliwalSecure.in</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/claims-dashboard" className="glass-card rounded-xl p-4 text-center hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{pt(pageText.related.claimsTitle, language)}</h3>
              <p className="text-xs text-muted-foreground mt-1">{pt(pageText.related.claimsDesc, language)}</p>
            </Link>
            <Link href="/" className="glass-card rounded-xl p-4 text-center hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{pt(pageText.related.sellingTitle, language)}</h3>
              <p className="text-xs text-muted-foreground mt-1">{pt(pageText.related.sellingDesc, language)}</p>
            </Link>
            <Link href="/" className="glass-card rounded-xl p-4 text-center hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <Scale className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{pt(pageText.related.insightsTitle, language)}</h3>
              <p className="text-xs text-muted-foreground mt-1">{pt(pageText.related.insightsDesc, language)}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground border-t border-border pt-6 px-4 pb-4">
        <p>{pt(pageText.disclaimer.text, language)}</p>
        <p className="mt-1">{pt(pageText.disclaimer.updated, language)}</p>
      </div>
    </div>
  );
}
