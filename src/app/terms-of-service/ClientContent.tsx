'use client';

import Link from 'next/link';
import {
  Shield, CheckCircle2, Scale, Bot, AlertTriangle, Users,
  IndianRupee, Copyright, FileText, Phone, MapPin, Mail,
  MessageCircle, ChevronRight, Gavel, UserX, RefreshCcw,
  Search, Handshake, BookOpen, Building, Clock, ArrowRight
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
    title: { en: 'Terms of Service', hi: 'सेवा की शर्तें', hinglish: 'Terms of Service' },
    subtitle: { en: 'By using Paliwal Secure AI, you agree to these terms. Please read carefully before using our platform.', hi: 'Paliwal Secure AI का उपयोग करके, आप इन शर्तों से सहमत हैं। कृपया हमारे प्लेटफ़ॉर्म का उपयोग करने से पहले ध्यानपूर्वक पढ़ें।', hinglish: 'Paliwal Secure AI use karke, aap in terms se agree hain. Kripya hamare platform use karne se pehle dhyan se padhein.' },
    lastUpdated: { en: 'Last Updated: March 2025', hi: 'अंतिम अपडेट: मार्च 2025', hinglish: 'Last Updated: March 2025' },
  },
  sections: [
    {
      heading: { en: '1. Acceptance of Terms', hi: '1. शर्तों की स्वीकृति', hinglish: '1. Acceptance of Terms' },
      text: { en: 'By accessing or using the Paliwal Secure AI platform (paliwalsecure.in), including our InsureGPT chatbot, insurance comparison tools, and WhatsApp support, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.', hi: 'Paliwal Secure AI प्लेटफ़ॉर्म (paliwalsecure.in) तक पहुंच या उपयोग करके, आप स्वीकार करते हैं कि आपने इन सेवा की शर्तों को पढ़ा, समझा, और इनसे सहमत हैं।', hinglish: 'Paliwal Secure AI platform (paliwalsecure.in) tak pahunch ya use karke, aap accept karte hain ki aapne in Terms of Service ko padha, samjha, aur inse agree hain.' },
      alert: { en: 'If you do not agree with any part of these terms, you must not use our platform.', hi: 'यदि आप इन शर्तों के किसी भी हिस्से से सहमत नहीं हैं, तो आप हमारे प्लेटफ़ॉर्म का उपयोग नहीं कर सकते।', hinglish: 'Agar aap in terms ke kisi bhi hisse se agree nahi hain, toh aap hamara platform use nahi kar sakte.' },
    },
    {
      heading: { en: '2. Service Description', hi: '2. सेवा का विवरण', hinglish: '2. Service Description' },
      intro: { en: 'Paliwal Secure AI is an IRDAI-registered insurance intermediary (POSP Code: IP429834) that provides the following services:', hi: 'Paliwal Secure AI एक IRDAI-पंजीकृत बीमा मध्यस्थ (POSP कोड: IP429834) है जो निम्नलिखित सेवाएँ प्रदान करता है:', hinglish: 'Paliwal Secure AI ek IRDAI-registered insurance intermediary (POSP Code: IP429834) hai jo following services provide karta hai:' },
      services: [
        { title: { en: 'Insurance Comparison', hi: 'बीमा तुलना', hinglish: 'Insurance Comparison' }, desc: { en: 'Compare premiums, features, and claim settlement ratios across 51+ IRDAI-registered insurers.', hi: '51+ IRDAI-पंजीकृत बीमाकर्ताओं में प्रीमियम, सुविधाएँ और क्लेम निपटान अनुपात की तुलना करें।', hinglish: '51+ IRDAI-registered insurers mein premiums, features aur CSR compare karein.' } },
        { title: { en: 'AI Recommendations (InsureGPT)', hi: 'AI सिफारिशें (InsureGPT)', hinglish: 'AI Recommendations (InsureGPT)' }, desc: { en: 'Personalized insurance recommendations powered by AI, available in Hinglish, Hindi & English.', hi: 'AI द्वारा संचालित व्यक्तिगत बीमा सिफारिशें, हिंग्लिश, हिंदी और अंग्रेजी में उपलब्ध।', hinglish: 'AI-powered personalized insurance recommendations, Hinglish, Hindi & English mein available.' } },
        { title: { en: 'Claims Assistance', hi: 'क्लेम सहायता', hinglish: 'Claims Assistance' }, desc: { en: 'Free documentation help and claim support from our expert team until settlement.', hi: 'निपटान तक हमारी विशेषज्ञ टीम से मुफ्त दस्तावेज़ीकरण सहायता और क्लेम समर्थन।', hinglish: 'Free documentation help aur claim support hamari expert team se settlement tak.' } },
        { title: { en: 'WhatsApp Support', hi: 'WhatsApp सहायता', hinglish: 'WhatsApp Support' }, desc: { en: '24/7 WhatsApp support for insurance queries, policy servicing, and renewal reminders.', hi: 'बीमा प्रश्नों, पॉलिसी सेवा, और नवीनीकरण रिमाइंडर के लिए 24/7 WhatsApp समर्थन।', hinglish: 'Insurance queries, policy servicing, aur renewal reminders ke liye 24/7 WhatsApp support.' } },
      ],
    },
    {
      heading: { en: '3. Insurance Comparison Disclaimer', hi: '3. बीमा तुलना अस्वीकरण', hinglish: '3. Insurance Comparison Disclaimer' },
      intro: { en: 'Our comparison tool provides estimated premiums based on IRDAI-filed rates. While we strive for accuracy:', hi: 'हमारा तुलना उपकरण IRDAI-दाखिल दरों पर आधारित अनुमानित प्रीमियम प्रदान करता है। हम सटीकता का प्रयास करते हैं:', hinglish: 'Hamara comparison tool IRDAI-filed rates pe based estimated premiums provide karta hai. Hum accuracy ki koshish karte hain:' },
      points: [
        { en: 'Actual premiums may vary after underwriting based on individual risk assessment', hi: 'व्यक्तिगत जोखिम मूल्यांकन के बाद वास्तविक प्रीमियम भिन्न हो सकते हैं', hinglish: 'Actual premiums underwriting ke baad vary ho sakte hain individual risk assessment ke basis pe' },
        { en: 'Premium quotes are indicative and not binding on the insurer', hi: 'प्रीमियम कोटेशन सांकेतिक हैं और बीमाकर्ता को बाध्य नहीं करते', hinglish: 'Premium quotes indicative hain aur insurer ko binding nahi karte' },
        { en: 'Features, coverage, and terms are subject to the actual policy document', hi: 'सुविधाएँ, कवरेज और शर्तें वास्तविक नीति दस्तावेज़ पर निर्भर हैं', hinglish: 'Features, coverage aur terms actual policy document pe dependent hain' },
        { en: 'We do not guarantee the availability of any specific plan or rate', hi: 'हम किसी विशिष्ट योजना या दर की उपलब्धता की गारंटी नहीं देते', hinglish: 'Hum kisi specific plan ya rate ki availability ki guarantee nahi dete' },
      ],
    },
    {
      heading: { en: '4. AI Recommendations Disclaimer', hi: '4. AI सिफारिशें अस्वीकरण', hinglish: '4. AI Recommendations Disclaimer' },
      importantTitle: { en: 'Important Notice', hi: 'महत्वपूर्ण सूचना', hinglish: 'Important Notice' },
      importantText: { en: 'InsureGPT recommendations are indicative and based on the information you provide. They do not constitute professional financial or insurance advice.', hi: 'InsureGPT की सिफारिशें सांकेतिक हैं और आपके द्वारा प्रदान की गई जानकारी पर आधारित हैं। ये पेशेवर वित्तीय या बीमा सलाह नहीं हैं।', hinglish: 'InsureGPT recommendations indicative hain aur aapke dwara provided info pe based hain. Yeh professional financial ya insurance advice nahi hain.' },
      points: [
        { en: 'Always consult with our licensed POSP advisor before making a purchase decision', hi: 'खरीद निर्णय लेने से पहले हमारे लाइसेंस प्राप्त POSP सलाहकार से परामर्श ज़रूर करें', hinglish: 'Purchase decision lene se pehle hamare licensed POSP advisor se consultation zaroor karein' },
        { en: 'AI recommendations are not a substitute for reading the actual policy document', hi: 'AI सिफारिशें वास्तविक नीति दस्तावेज़ पढ़ने का विकल्प नहीं हैं', hinglish: 'AI recommendations actual policy document padhne ka substitute nahi hain' },
        { en: 'Verify all details with the insurer before purchasing', hi: 'खरीदने से पहले सभी विवरण बीमाकर्ता से सत्यापित करें', hinglish: 'Purchasing se pehle sabhi details insurer se verify karein' },
      ],
    },
    {
      heading: { en: '5. User Responsibilities', hi: '5. उपयोगकर्ता की ज़िम्मेदारियाँ', hinglish: '5. User Responsibilities' },
      items: [
        { title: { en: 'Provide Accurate Information', hi: 'सटीक जानकारी दें', hinglish: 'Provide Accurate Information' }, desc: { en: 'All personal details and insurance preferences must be truthful and accurate.', hi: 'सभी व्यक्तिगत विवरण और बीमा प्राथमिकताएँ सत्य और सटीक होनी चाहिए।', hinglish: 'Sabhi personal details aur insurance preferences truthful aur accurate honi chahiye.' } },
        { title: { en: 'No Misrepresentation', hi: 'कोई गलत प्रतिनिधित्व नहीं', hinglish: 'No Misrepresentation' }, desc: { en: 'Do not use false identities, fake documents, or misrepresent your health/financial status.', hi: 'झूठी पहचान, नकली दस्तावेज़, या अपने स्वास्थ्य/वित्तीय स्थिति का गलत प्रतिनिधित्व न करें।', hinglish: 'False identities, fake documents, ya apni health/financial status ka misrepresent na karein.' } },
        { title: { en: 'Comply with Laws', hi: 'कानूनों का पालन करें', hinglish: 'Comply with Laws' }, desc: { en: 'Use our platform in compliance with all applicable Indian laws and IRDAI regulations.', hi: 'सभी लागू भारतीय कानूनों और IRDAI विनियमों के अनुपालन में हमारे प्लेटफ़ॉर्म का उपयोग करें।', hinglish: 'Sabhi applicable Indian laws aur IRDAI regulations ke compliance mein hamara platform use karein.' } },
        { title: { en: 'Update Information', hi: 'जानकारी अपडेट करें', hinglish: 'Update Information' }, desc: { en: 'Notify us promptly of any changes to your personal details or insurance needs.', hi: 'अपने व्यक्तिगत विवरण या बीमा आवश्यकताओं में किसी भी परिवर्तन की तुरंत सूचना दें।', hinglish: 'Apne personal details ya insurance needs mein kisi bhi change ki turant suchna dein.' } },
      ],
    },
    {
      heading: { en: '6. Limitation of Liability', hi: '6. दायित्व की सीमा', hinglish: '6. Limitation of Liability' },
      intro: { en: 'Paliwal Secure AI is an IRDAI-registered insurance intermediary (POSP Code: IP429834). To the maximum extent permitted by law:', hi: 'Paliwal Secure AI एक IRDAI-पंजीकृत बीमा मध्यस्थ (POSP कोड: IP429834) है। कानून द्वारा अनुमत अधिकतम सीमा तक:', hinglish: 'Paliwal Secure AI ek IRDAI-registered insurance intermediary (POSP Code: IP429834) hai. Law dwara allowed maximum extent tak:' },
      points: [
        { en: 'We are not liable for insurer decisions regarding policy issuance, claim approval, or premium rates', hi: 'हम नीति जारी करने, क्लेम स्वीकृति या प्रीमियम दरों के लिए उत्तरदायी नहीं हैं', hinglish: 'Hum policy issuance, claim approval ya premium rates ke liye liable nahi hain' },
        { en: 'We are not liable for any loss arising from inaccurate information provided by the user', hi: 'उपयोगकर्ता द्वारा प्रदान की गई गलत जानकारी से उत्पन्न नुकसान के लिए हम उत्तरदायी नहीं हैं', hinglish: 'User dwara provided galat information se hone wale loss ke liye hum liable nahi hain' },
        { en: 'We are not liable for temporary unavailability of the platform due to maintenance or technical issues', hi: 'रखरखाव या तकनीकी समस्याओं के कारण प्लेटफ़ॉर्म की अस्थायी अनुपलब्धता के लिए हम उत्तरदायी नहीं हैं', hinglish: 'Maintenance ya technical issues ke kaaran platform ki temporary unavailability ke liye hum liable nahi hain' },
        { en: 'Our total liability shall not exceed the fees paid by you to us (₹0 as our comparison service is free)', hi: 'हमारी कुल देयता आपके द्वारा चुकाई गई फीस से अधिक नहीं होगी (जो ₹0 है)', hinglish: 'Hamari total liability aapke dwara pay ki gayi fees se zyada nahi hogi (jo ₹0 hai)' },
      ],
    },
    {
      heading: { en: '7. Governing Law', hi: '7. शासकीय कानून', hinglish: '7. Governing Law' },
      text1: { en: 'These Terms of Service are governed by and construed in accordance with the laws of India. The Insurance Regulatory and Development Authority of India (IRDAI) regulations shall apply to all insurance-related services.', hi: 'ये सेवा की शर्तें भारत के कानूनों द्वारा शासित हैं। भारत के बीमा नियामक और विकास प्राधिकरण (IRDAI) विनियम सभी बीमा-संबंधित सेवाओं पर लागू होंगे।', hinglish: 'Yeh Terms of Service India ke laws dwara governed hain. IRDAI regulations sabhi insurance-related services pe apply honge.' },
      text2: { en: 'Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Kota, Rajasthan, India.', hi: 'इन शर्तों से उत्पन्न कोई भी विवाद कोटा, राजस्थान, भारत की अदालतों के विशेष अधिकार क्षेत्र में होगा।', hinglish: 'In terms se utpann koi bhi vivaad Kota, Rajasthan, India ki adalaton ke exclusive jurisdiction mein hoga.' },
    },
    {
      heading: { en: '8. Contact', hi: '8. संपर्क', hinglish: '8. Contact' },
      intro: { en: 'For questions or concerns about these Terms of Service, please contact us:', hi: 'इन सेवा की शर्तों के बारे में प्रश्नों या चिंताओं के लिए, कृपया हमसे संपर्क करें:', hinglish: 'In Terms of Service ke baare mein questions ya concerns ke liye, kripya humse contact karein:' },
      irdaiTitle: { en: 'IRDAI Grievance Redressal', hi: 'IRDAI शिकायत निवारण', hinglish: 'IRDAI Grievance Redressal' },
      irdaiText: { en: "For unresolved disputes, contact IRDAI's Bima Bharosa Portal or call 1800-258-1111 (Toll Free).", hi: 'अनसुलझे विवादों के लिए IRDAI के बीमा भरोसा पोर्टल से संपर्क करें या 1800-258-1111 (टोल फ्री) पर कॉल करें।', hinglish: "Unresolved disputes ke liye IRDAI ke Bima Bharosa Portal se contact karein ya 1800-258-1111 (Toll Free) pe call karein." },
    },
  ],
  cta: {
    backToHome: { en: 'Back to Home', hi: 'होम पेज वापस', hinglish: 'Back to Home' },
    chatLabel: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें', hinglish: 'WhatsApp pe Chat Karein' },
  },
};

/* ── Section Icons ──────────────────────────────────────────────────────── */
const sectionIcons = [CheckCircle2, BookOpen, Scale, Bot, Users, Shield, Building, Phone];

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

export default function TermsOfServiceClientContent() {
  const { language } = useLanguage();
  const pt = (obj: Tr) => obj[language] || obj.en;

  return (
    <>
      {/* ═══════════════════ PAGE HEADER ═══════════════════ */}
      <section
        className="relative overflow-hidden py-14 md:py-20"
        style={{ background: `linear-gradient(135deg, ${NAVY_800} 0%, ${NAVY_600} 50%, #082247 100%)` }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-white/50 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80">{pt(pageText.hero.title)}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {pt(pageText.hero.title)}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto mb-4">
            {pt(pageText.hero.subtitle)}
          </p>
          <p className="text-xs font-medium text-white/50">
            {pt(pageText.hero.lastUpdated)}
          </p>
        </div>
      </section>

      {/* ═══════════════════ SECTIONS ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-6">
        {pageText.sections.map((section, sIdx) => {
          const SIcon = sectionIcons[sIdx];
          return (
            <div key={sIdx} className="glass-card p-6 sm:p-8 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})` }}>
                  <SIcon className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h2 className="text-xl font-bold text-white">{pt(section.heading)}</h2>
              </div>

              {/* Text */}
              {'text' in section && <p className="text-sm text-white/60 mb-2">{pt(section.text as Tr)}</p>}
              {'text1' in section && <p className="text-sm text-white/60 mb-2">{pt(section.text1 as Tr)}</p>}
              {'text2' in section && <p className="text-sm text-white/60 mb-3">{pt(section.text2 as Tr)}</p>}

              {/* Intro */}
              {'intro' in section && <p className="text-sm text-white/60 mb-5">{pt(section.intro as Tr)}</p>}

              {/* Alert box */}
              {'alert' in section && (
                <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.08)', border: '1px solid rgba(201,138,28,0.2)' }}>
                  <p className="text-sm font-medium text-white">
                    <AlertTriangle className="w-4 h-4 inline mr-1" style={{ color: GOLD }} />
                    {pt(section.alert as Tr)}
                  </p>
                </div>
              )}

              {/* Services grid */}
              {'services' in section && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(section.services as Array<{ title: Tr; desc: Tr }>).map((svc: { title: Tr; desc: Tr }, i: number) => (
                    <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.04)' }}>
                      <h3 className="text-sm font-semibold text-white mb-1">{pt(svc.title)}</h3>
                      <p className="text-xs text-white/60">{pt(svc.desc)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Important notice box */}
              {'importantTitle' in section && (
                <div className="rounded-xl p-5 mb-4" style={{ background: 'rgba(201,138,28,0.08)', border: '1px solid rgba(201,138,28,0.25)' }}>
                  <p className="text-sm font-semibold flex items-center gap-2 text-white">
                    <AlertTriangle className="w-4 h-4" style={{ color: GOLD }} /> {pt(section.importantTitle as Tr)}
                  </p>
                  <p className="text-sm text-white/60 mt-2">{pt(section.importantText as Tr)}</p>
                </div>
              )}

              {/* Points list */}
              {'points' in section && (
                <div className="space-y-2 text-sm text-white/60">
                  {(section.points as Array<Tr | { en: string; hi: string; hinglish: string }>).map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                      <span>{'en' in point ? pt(point as Tr) : (point as Tr)[language] || (point as Tr).en}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Items (User Responsibilities) */}
              {'items' in section && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(section.items as Array<{ title: Tr; desc: Tr }>).map((item: { title: Tr; desc: Tr }, i: number) => (
                    <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.04)' }}>
                      <h3 className="text-sm font-semibold text-white mb-1">{pt(item.title)}</h3>
                      <p className="text-xs text-white/60">{pt(item.desc)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact section */}
              {sIdx === 7 && (
                <>
                  <p className="text-sm text-white/60 mb-5">{pt(pageText.sections[7].intro as Tr)}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"
                      className="rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-md"
                      style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                      <MessageCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
                      <h3 className="text-sm font-bold text-white">WhatsApp</h3>
                      <p className="text-xs" style={{ color: GOLD }}>+91 9257877312</p>
                    </a>
                    <a href="mailto:himanshupaliwalpbp@gmail.com"
                      className="rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-md"
                      style={{ background: 'rgba(201,138,28,0.06)', border: '1px solid rgba(201,138,28,0.15)' }}>
                      <Mail className="w-6 h-6 mx-auto mb-2" style={{ color: GOLD }} />
                      <h3 className="text-sm font-bold text-white">Email</h3>
                      <p className="text-xs" style={{ color: GOLD }}>himanshupaliwalpbp@gmail.com</p>
                    </a>
                    <div className="rounded-xl p-4 text-center"
                      style={{ background: 'rgba(201,138,28,0.06)', border: '1px solid rgba(201,138,28,0.15)' }}>
                      <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: GOLD }} />
                      <h3 className="text-sm font-bold text-white">Location</h3>
                      <p className="text-xs" style={{ color: GOLD }}>Kota, Rajasthan, India</p>
                    </div>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.06)' }}>
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4" style={{ color: GOLD }} /> {pt(pageText.sections[7].irdaiTitle as Tr)}
                    </p>
                    <p className="text-sm text-white/60 mt-1">{pt(pageText.sections[7].irdaiText as Tr)}</p>
                  </div>
                </>
              )}

              {/* Governing law extra info */}
              {sIdx === 6 && (
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60">
                    <MapPin className="w-3.5 h-3.5" style={{ color: GOLD }} /> Kota, Rajasthan
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60">
                    <Shield className="w-3.5 h-3.5" style={{ color: GOLD }} /> IRDAI Regulated
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60">
                    <Scale className="w-3.5 h-3.5" style={{ color: GOLD }} /> Indian Jurisdiction
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <SectionDivider />

      {/* ═══════════════════ BACK TO HOME ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm">
              <span>{pt(pageText.cta.backToHome)}</span>
            </ShinyButton>
          </Link>
          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
            <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm">
              <span>{pt(pageText.cta.chatLabel)}</span>
            </ShinyButton>
          </a>
        </div>
      </section>
    </>
  );
}
