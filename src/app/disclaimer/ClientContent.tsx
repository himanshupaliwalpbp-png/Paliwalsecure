'use client';

import Link from 'next/link';
import {
  Shield, AlertTriangle, Scale, Bot, IndianRupee, ExternalLink,
  Phone, MapPin, Mail, MessageCircle, ChevronRight, CheckCircle2,
  Clock, FileText, Gavel, Building, BadgeCheck, ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';

/* ── Design tokens ─────────────────────────────────────────────────────── */
const NAVY_800 = '#0A1330';
const NAVY_600 = '#162D5A';
const GOLD = '#C98A1C';
const GOLD_400 = '#C98A1C';

/* ── Translation type ──────────────────────────────────────────────────── */
type Tr = { en: string; hi: string; hinglish: string };

/* ── Inline page text ──────────────────────────────────────────────────── */
const pageText = {
  hero: {
    title: { en: 'Disclaimer', hi: 'अस्वीकरण', hinglish: 'Disclaimer' },
    subtitle: { en: 'Important legal disclosures about Paliwal Secure AI services, IRDAI compliance, and your rights as a consumer.', hi: 'Paliwal Secure AI सेवाओं, IRDAI अनुपालन, और उपभोक्ता के रूप में आपके अधिकारों के बारे में महत्वपूर्ण कानूनी प्रकटीकरण।', hinglish: 'Paliwal Secure AI services, IRDAI compliance, aur consumer ke roop mein aapke rights ke baare mein important legal disclosures.' },
  },
  irdaiBox: {
    motto: { en: 'Insurance is the subject matter of solicitation.', hi: 'बीमा प्रार्थना का विषय है।', hinglish: 'Insurance is the subject matter of solicitation.' },
    description: { en: 'Paliwal Secure AI is an IRDAI‑registered insurance intermediary operating as a Point of Sales Person (POSP).', hi: 'पालीवाल सिक्योर AI एक IRDAI-पंजीकृत बीमा मध्यस्थ है जो Point of Sales Person (POSP) के रूप में कार्य करता है।', hinglish: 'Paliwal Secure AI ek IRDAI-registered insurance intermediary hai jo POSP ke roop mein kaam karta hai.' },
  },
  sections: [
    {
      heading: { en: '1. IRDAI Registration Details', hi: '1. IRDAI पंजीकरण विवरण', hinglish: '1. IRDAI Registration Details' },
      text: { en: 'Paliwal Secure AI operates as an IRDAI-registered Point of Sales Person (POSP). All insurance recommendations and comparisons provided on this platform are in strict compliance with IRDAI guidelines and regulations.', hi: 'Paliwal Secure AI एक IRDAI-पंजीकृत POSP के रूप में कार्य करता है। इस प्लेटफ़ॉर्म पर प्रदान की गई सभी बीमा सिफारिशें और तुलना IRDAI दिशानिर्देशों के सख्त अनुपालन में हैं।', hinglish: 'Paliwal Secure AI IRDAI-registered POSP ke roop mein kaam karta hai. Sabhi insurance recommendations aur comparisons IRDAI guidelines ke strict compliance mein hain.' },
      fields: [
        { label: { en: 'POSP Code', hi: 'POSP कोड', hinglish: 'POSP Code' }, value: 'IP429834' },
        { label: { en: 'Registration Type', hi: 'पंजीकरण प्रकार', hinglish: 'Registration Type' }, value: 'Point of Sales Person (POSP)' },
        { label: { en: 'Registered Entity', hi: 'पंजीकृत इकाई', hinglish: 'Registered Entity' }, value: 'Himanshu Paliwal' },
        { label: { en: 'Location', hi: 'स्थान', hinglish: 'Location' }, value: 'Kota, Rajasthan, India' },
        { label: { en: 'Regulatory Body', hi: 'नियामक निकाय', hinglish: 'Regulatory Body' }, value: 'IRDAI' },
        { label: { en: 'License Validity', hi: 'लाइसेंस वैधता', hinglish: 'License Validity' }, value: 'As per IRDAI records' },
      ],
    },
    {
      heading: { en: '2. Not a Financial Advisor', hi: '2. वित्तीय सलाहकार नहीं', hinglish: '2. Not a Financial Advisor' },
      points: [
        { en: 'Paliwal Secure AI is an insurance intermediary, NOT a registered financial advisor or investment advisor', hi: 'पालीवाल सिक्योर AI एक बीमा मध्यस्थ है, पंजीकृत वित्तीय सलाहकार नहीं', hinglish: 'Paliwal Secure AI ek insurance intermediary hai, registered financial advisor nahi' },
        { en: 'Our AI recommendations (InsureGPT) are indicative tools and do not constitute professional financial advice', hi: 'हमारी AI सिफारिशें (InsureGPT) सांकेतिक उपकरण हैं और पेशेवर वित्तीय सलाह नहीं हैं', hinglish: 'Hamari AI recommendations (InsureGPT) indicative tools hain aur professional financial advice nahi hain' },
        { en: 'Users should independently verify all information and consult qualified professionals before making financial decisions', hi: 'उपयोगकर्ताओं को सभी जानकारी स्वतंत्र रूप से सत्यापित करनी चाहिए और वित्तीय निर्णय लेने से पहले योग्य पेशेवरों से परामर्श लेना चाहिए', hinglish: 'Users ko sabhi info independently verify karni chahiye aur financial decisions lene se pehle qualified professionals se consult lena chahiye' },
        { en: 'Past performance of insurance products does not guarantee future results', hi: 'बीमा उत्पादों का पिछला प्रदर्शन भविष्य के परिणामों की गारंटी नहीं देता', hinglish: 'Insurance products ka past performance future results ki guarantee nahi deta' },
      ],
    },
    {
      heading: { en: '3. Not an Insurer', hi: '3. बीमाकर्ता नहीं', hinglish: '3. Not an Insurer' },
      points: [
        { en: 'Paliwal Secure AI does NOT underwrite, issue, or service insurance policies directly', hi: 'पालीवाल सिक्योर AI सीधे बीमा नीतियाँ जारी या सेवा नहीं करता', hinglish: 'Paliwal Secure AI directly insurance policies issue ya service nahi karta' },
        { en: 'Insurance policies are issued by IRDAI-licensed insurance companies only', hi: 'बीमा नीतियाँ केवल IRDAI-लाइसेंस प्राप्त बीमा कंपनियों द्वारा जारी की जाती हैं', hinglish: 'Insurance policies sirf IRDAI-licensed insurance companies dwara issue ki jaati hain' },
        { en: 'We act as an intermediary facilitating the comparison and purchase process', hi: 'हम तुलना और खरीद प्रक्रिया को सुगम बनाने वाले मध्यस्थ के रूप में कार्य करते हैं', hinglish: 'Hum comparison aur purchase process ko facilitate karne wale intermediary ke roop mein kaam karte hain' },
        { en: 'Claim settlement is solely at the discretion of the respective insurance company', hi: 'क्लेम निपटान केवल संबंधित बीमा कंपनी के विवेक पर है', hinglish: 'Claim settlement sirf respective insurance company ke discretion pe hai' },
      ],
    },
    {
      heading: { en: '4. Commission Disclosure', hi: '4. कमीशन प्रकटीकरण', hinglish: '4. Commission Disclosure' },
      text: { en: 'As an IRDAI-registered POSP, Paliwal Secure AI earns a commission from insurance companies when a policy is purchased through our platform. This is standard industry practice and fully disclosed:', hi: 'IRDAI-पंजीकृत POSP के रूप में, Paliwal Secure AI को प्लेटफ़ॉर्म के माध्यम से नीति खरीदे जाने पर बीमा कंपनियों से कमीशन मिलता है। यह मानक उद्योग प्रथा है और पूरी तरह प्रकट की गई है:', hinglish: 'IRDAI-registered POSP ke roop mein, Paliwal Secure AI ko platform ke through policy khareede jaane pe insurance companies se commission milta hai. Yeh standard industry practice hai aur fully disclosed hai:' },
      points: [
        { en: 'Commission is paid by the insurer, NOT by you — you pay the same premium as buying directly', hi: 'कमीशन बीमाकर्ता द्वारा भुगतान किया जाता है, आपके द्वारा नहीं — आप सीधे खरीदने जैसा ही प्रीमियम चुकाते हैं', hinglish: 'Commission insurer dwara pay kiya jata hai, aapke dwara nahi — aap same premium pay karte hain as buying directly' },
        { en: 'The commission amount does NOT affect your premium — rates are IRDAI-filed', hi: 'कमीशन राशि आपके प्रीमियम को प्रभावित नहीं करती — दरें IRDAI-दाखिल हैं', hinglish: 'Commission amount aapke premium ko affect nahi karta — rates IRDAI-filed hain' },
        { en: 'Our AI recommendations are NOT influenced by commission amounts', hi: 'हमारी AI सिफारिशें कमीशन राशि से प्रभावित नहीं हैं', hinglish: 'Hamari AI recommendations commission amounts se influenced nahi hain' },
        { en: 'We disclose this upfront as part of our transparency commitment', hi: 'हम अपनी पारदर्शिता प्रतिबद्धता के हिस्से के रूप में यह पहले ही बताते हैं', hinglish: 'Hum apni transparency commitment ke hisse ke roop mein yeh pehle hi batate hain' },
      ],
    },
    {
      heading: { en: '5. Data Accuracy Disclaimer', hi: '5. डेटा सटीकता अस्वीकरण', hinglish: '5. Data Accuracy Disclaimer' },
      points: [
        { en: 'Premium rates displayed are based on IRDAI-filed rates and may vary after underwriting', hi: 'प्रीमियम दरें IRDAI-दाखिल दरों पर आधारित हैं और अंडरराइटिंग के बाद भिन्न हो सकती हैं', hinglish: 'Premium rates IRDAI-filed rates pe based hain aur underwriting ke baad vary ho sakti hain' },
        { en: 'Claim Settlement Ratios (CSR) are sourced from IRDAI Annual Reports and represent historical data', hi: 'CSR IRDAI वार्षिक रिपोर्ट से प्राप्त हैं और ऐतिहासिक डेटा दर्शाते हैं', hinglish: 'CSR IRDAI Annual Reports se sourced hain aur historical data represent karte hain' },
        { en: 'We strive for accuracy but cannot guarantee that all information is error-free', hi: 'हम सटीकता का प्रयास करते हैं लेकिन गारंटी नहीं दे सकते कि सभी जानकारी त्रुटि-मुक्त है', hinglish: 'Hum accuracy ki koshish karte hain lekin guarantee nahi de sakte ki sabhi information error-free hai' },
        { en: 'Users should verify all details with the respective insurer before purchasing', hi: 'उपयोगकर्ताओं को खरीदने से पहले सभी विवरण संबंधित बीमाकर्ता से सत्यापित करने चाहिए', hinglish: 'Users ko purchasing se pehle sabhi details respective insurer se verify karne chahiye' },
        { en: 'Tax benefits mentioned are subject to change as per government regulations', hi: 'उल्लिखित कर लाभ सरकारी विनियमों के अनुसार बदल सकते हैं', hinglish: 'Mentioned tax benefits government regulations ke anusaar change ho sakte hain' },
      ],
    },
    {
      heading: { en: '6. Grievance Redressal', hi: '6. शिकायत निवारण', hinglish: '6. Grievance Redressal' },
      intro: { en: 'If you have any complaint or grievance, please follow the escalation process:', hi: 'यदि आपको कोई शिकायत है, तो कृपया निम्नलिखित एस्केलेशन प्रक्रिया अपनाएँ:', hinglish: 'Agar aapko koi complaint ya grievance hai, toh kripya escalation process follow karein:' },
      steps: [
        { title: { en: 'Contact Paliwal Secure AI', hi: 'पालीवाल सिक्योर AI से संपर्क करें', hinglish: 'Paliwal Secure AI se Contact Karein' }, desc: { en: 'Reach out to us first — most issues are resolved within 48 hours.', hi: 'पहले हमसे संपर्क करें — अधिकांश समस्याएं 48 घंटों के भीतर हल हो जाती हैं।', hinglish: 'Pehle humse contact karein — most issues 48 ghanton ke andar resolve ho jati hain.' } },
        { title: { en: "Contact Insurer's Grievance Officer", hi: 'बीमाकर्ता के शिकायत अधिकारी से संपर्क करें', hinglish: "Insurer's Grievance Officer se Contact Karein" }, desc: { en: "If your complaint is about a specific insurance policy or claim, contact the insurer's Grievance Redressal Officer directly.", hi: 'यदि आपकी शिकायत किसी विशिष्ट बीमा नीति या क्लेम के बारे में है, तो सीधे बीमाकर्ता के शिकायत निवारण अधिकारी से संपर्क करें।', hinglish: "Agar aapki complaint kisi specific insurance policy ya claim ke baare mein hai, toh directly insurer ke Grievance Redressal Officer se contact karein." } },
        { title: { en: 'IRDAI Bima Bharosa Portal', hi: 'IRDAI बीमा भरोसा पोर्टल', hinglish: 'IRDAI Bima Bharosa Portal' }, desc: { en: 'If your grievance remains unresolved, escalate it to IRDAI.', hi: 'यदि आपकी शिकायत अनसुलझी रहती है, तो इसे IRDAI तक बढ़ाएँ।', hinglish: 'Agar aapki grievance unresolved rehti hai, toh ise IRDAI tak escalate karein.' } },
      ],
    },
    {
      heading: { en: '7. Regulatory Contact Information', hi: '7. नियामक संपर्क जानकारी', hinglish: '7. Regulatory Contact Information' },
      compliance: { en: 'This platform complies with all applicable IRDAI regulations and guidelines.', hi: 'यह प्लेटफ़ॉर्म सभी लागू IRDAI विनियमों और दिशानिर्देशों का पालन करता है।', hinglish: 'Yeh platform sabhi applicable IRDAI regulations aur guidelines ka palan karta hai.' },
    },
  ],
  cta: {
    backToHome: { en: 'Back to Home', hi: 'होम पेज वापस', hinglish: 'Back to Home' },
    chatLabel: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें', hinglish: 'WhatsApp pe Chat Karein' },
  },
};

/* ── Section Icons ──────────────────────────────────────────────────────── */
const sectionIcons = [Shield, Scale, Building, IndianRupee, FileText, Gavel, Building];

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

export default function DisclaimerClientContent() {
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
        </div>
      </section>

      {/* ═══════════════════ PROMINENT IRDAI DISCLAIMER BOX ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div
          className="rounded-2xl p-6 sm:p-8 md:p-10 text-center"
          style={{
            background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})`,
            border: `2px solid ${GOLD}`,
            boxShadow: `0 0 40px rgba(201,138,28,0.15), 0 8px 32px rgba(0,0,0,0.2)`,
          }}
        >
          <div className="w-20 h-1 mx-auto mb-5 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: GOLD }} />
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            &ldquo;{pt(pageText.irdaiBox.motto)}&rdquo;
          </p>
          <div className="max-w-lg mx-auto rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-white/80 text-sm mb-1">{pt(pageText.irdaiBox.description)}</p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(201,138,28,0.2)', color: GOLD, border: '1px solid rgba(201,138,28,0.4)' }}>
              <BadgeCheck className="w-3.5 h-3.5" /> POSP Code: IP429834
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Shield className="w-3.5 h-3.5" /> IRDAI Compliant
            </span>
          </div>
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
              {'text' in section && <p className="text-sm text-white/60 mb-5">{pt(section.text as Tr)}</p>}

              {/* Fields (IRDAI Registration) */}
              {'fields' in section && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(section.fields as Array<{ label: Tr; value: string }>).map((field: { label: Tr; value: string }, i: number) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(201,138,28,0.04)' }}>
                      <p className="text-xs text-white/50">{pt(field.label)}</p>
                      <p className="text-sm font-semibold text-white">{field.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Points list */}
              {'points' in section && (
                <div className="space-y-2 text-sm text-white/60">
                  {(section.points as Array<Tr>).map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                      <span>{pt(point)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Grievance steps */}
              {'steps' in section && (
                <div className="space-y-4">
                  <p className="text-sm text-white/60 mb-2">{pt(section.intro as Tr)}</p>
                  {(section.steps as Array<{ title: Tr; desc: Tr }>).map((step: { title: Tr; desc: Tr }, i: number) => (
                    <div key={i} className="rounded-xl p-5" style={{ background: i === 2 ? 'rgba(201,138,28,0.08)' : 'rgba(201,138,28,0.04)', border: i === 2 ? '1px solid rgba(201,138,28,0.25)' : '1px solid rgba(201,138,28,0.1)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 2 ? '' : 'text-white'}`}
                          style={i === 2 ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_400})`, color: NAVY_800 } : { background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})` }}>
                          {i + 1}
                        </span>
                        <h3 className="font-bold text-white">{pt(step.title)}</h3>
                      </div>
                      <p className="text-sm text-white/60 ml-9">{pt(step.desc)}</p>
                      {/* Step 1 contact links */}
                      {i === 0 && (
                        <div className="flex flex-wrap gap-3 mt-3 ml-9">
                          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(37,211,102,0.1)', color: '#4ADE80', border: '1px solid rgba(37,211,102,0.2)' }}>
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp: +91 9257877312
                          </a>
                          <a href="mailto:himanshupaliwalpbp@gmail.com"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(201,138,28,0.08)', color: GOLD, border: '1px solid rgba(201,138,28,0.15)' }}>
                            <Mail className="w-3.5 h-3.5" /> himanshupaliwalpbp@gmail.com
                          </a>
                        </div>
                      )}
                      {/* Step 3 IRDAI links */}
                      {i === 2 && (
                        <div className="flex flex-wrap gap-3 mt-3 ml-9">
                          <a href="https://bimabharosa.irdai.gov.in" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})` }}>
                            <ExternalLink className="w-3.5 h-3.5" /> bimabharosa.irdai.gov.in
                          </a>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background: 'rgba(201,138,28,0.12)', color: GOLD, border: '1px solid rgba(201,138,28,0.3)' }}>
                            <Phone className="w-3.5 h-3.5" /> bimabharosa.irda.gov.in (Toll Free)
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Regulatory Contact (Section 7) */}
              {sIdx === 6 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div className="rounded-xl p-5" style={{ background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})` }}>
                      <Shield className="w-8 h-8 mb-3" style={{ color: GOLD }} />
                      <h3 className="font-bold text-white mb-2">IRDAI</h3>
                      <p className="text-xs text-white/60 mb-2">Insurance Regulatory and Development Authority of India</p>
                      <div className="space-y-1.5 text-xs text-white/80">
                        <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" style={{ color: GOLD }} /> Helpline: <strong>bimabharosa.irda.gov.in</strong> (Toll Free)</p>
                        <p className="flex items-center gap-1.5"><ExternalLink className="w-3 h-3" style={{ color: GOLD }} /> <a href="https://bimabharosa.irdai.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">bimabharosa.irdai.gov.in</a></p>
                        <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" style={{ color: GOLD }} /> Hyderabad, Telangana, India</p>
                      </div>
                    </div>
                    <div className="rounded-xl p-5" style={{ background: 'rgba(201,138,28,0.08)', border: '1px solid rgba(201,138,28,0.25)' }}>
                      <BadgeCheck className="w-8 h-8 mb-3" style={{ color: GOLD }} />
                      <h3 className="font-bold text-white mb-2">Paliwal Secure AI</h3>
                      <p className="text-xs text-white/50 mb-2">IRDAI Registered POSP</p>
                      <div className="space-y-1.5 text-xs text-white/60">
                        <p className="flex items-center gap-1.5"><Shield className="w-3 h-3" style={{ color: GOLD }} /> POSP Code: <strong style={{ color: GOLD }}>IP429834</strong></p>
                        <p className="flex items-center gap-1.5"><MessageCircle className="w-3 h-3" style={{ color: GOLD }} /> <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>WhatsApp</a></p>
                        <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" style={{ color: GOLD }} /> <a href="mailto:himanshupaliwalpbp@gmail.com" style={{ color: GOLD }}>himanshupaliwalpbp@gmail.com</a></p>
                        <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" style={{ color: GOLD }} /> Kota, Rajasthan, India</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(201,138,28,0.04)' }}>
                    <Shield className="w-10 h-10 mx-auto mb-3" style={{ color: GOLD }} />
                    <p className="text-sm font-semibold text-white mb-1">{pt(section.compliance as Tr)}</p>
                  </div>
                </>
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
