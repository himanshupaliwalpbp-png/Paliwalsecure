'use client';

import Link from 'next/link';
import {
  UserCheck, FileText, Shield, Scale, Clock, Phone,
  ChevronRight, Mail, MapPin, MessageCircle, AlertTriangle
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
    title: { en: 'Grievance Policy', hi: 'शिकायत नीति', hinglish: 'Grievance Policy' },
    subtitle: { en: 'We are committed to resolving your concerns fairly and promptly. This policy outlines our grievance redressal mechanism under DPDP Act 2023 and IRDAI guidelines.', hi: 'हम आपकी चिंताओं का निष्पक्ष और शीघ्र समाधान करने के लिए प्रतिबद्ध हैं। यह नीति DPDP अधिनियम 2023 और IRDAI दिशानिर्देशों के तहत हमारे शिकायत निवारण तंत्र को रेखांकित करती है।', hinglish: 'Hum aapki concerns ko fairly aur promptly resolve karne ke liye committed hain. Yeh policy DPDP Act 2023 aur IRDAI guidelines ke tahat hamara grievance redressal mechanism outline karti hai.' },
    lastUpdated: { en: 'Last Updated: March 2025', hi: 'अंतिम अपडेट: मार्च 2025', hinglish: 'Last Updated: March 2025' },
  },
  toc: { en: 'Table of Contents', hi: 'विषय सूची', hinglish: 'Table of Contents' },
  sections: [
    {
      heading: { en: '1. Grievance Officer', hi: '1. शिकायत अधिकारी', hinglish: '1. Grievance Officer' },
      items: [
        { title: { en: 'Name', hi: 'नाम', hinglish: 'Name' }, desc: { en: 'Himanshu Paliwal', hi: 'हिमांशु पालीवाल', hinglish: 'Himanshu Paliwal' } },
        { title: { en: 'Designation', hi: 'पदनाम', hinglish: 'Designation' }, desc: { en: 'IRDAI POSP / Data Fiduciary', hi: 'IRDAI POSP / डेटा फिड्यूशियरी', hinglish: 'IRDAI POSP / Data Fiduciary' } },
        { title: { en: 'POSP ID', hi: 'POSP आईडी', hinglish: 'POSP ID' }, desc: { en: 'IP429834', hi: 'IP429834', hinglish: 'IP429834' } },
        { title: { en: 'Email', hi: 'ईमेल', hinglish: 'Email' }, desc: { en: 'himanshupaliwalpbp@gmail.com', hi: 'himanshupaliwalpbp@gmail.com', hinglish: 'himanshupaliwalpbp@gmail.com' } },
        { title: { en: 'Location', hi: 'स्थान', hinglish: 'Location' }, desc: { en: 'Kota, Rajasthan — 324001', hi: 'कोटा, राजस्थान — 324001', hinglish: 'Kota, Rajasthan — 324001' } },
        { title: { en: 'Response Time', hi: 'प्रतिक्रिया समय', hinglish: 'Response Time' }, desc: { en: '30 working days from receipt of grievance', hi: 'शिकायत प्राप्ति से 30 कार्य दिवस', hinglish: 'Shikayat milne se 30 working days' } },
      ],
    },
    {
      heading: { en: '2. Shikayat Kaise Karein (How to File a Complaint)', hi: '2. शिकायत कैसे करें', hinglish: '2. Shikayat Kaise Karein' },
      items: [
        { title: { en: 'Step 1: Send an Email', hi: 'चरण 1: ईमेल भेजें', hinglish: 'Step 1: Email Bhejein' }, desc: { en: 'Write to himanshupaliwalpbp@gmail.com with your complaint details.', hi: 'himanshupaliwalpbp@gmail.com पर अपनी शिकायत विवरण के साथ लिखें।', hinglish: 'himanshupaliwalpbp@gmail.com pe apni complaint details ke saath likhein.' } },
        { title: { en: 'Step 2: Subject Line Format', hi: 'चरण 2: विषय पंक्ति प्रारूप', hinglish: 'Step 2: Subject Mein Format' }, desc: { en: 'Use the subject line: "Grievance — [Your Name]" for faster processing.', hi: 'तेज़ प्रोसेसिंग के लिए विषय पंक्ति का उपयोग करें: "Grievance — [आपका नाम]"।', hinglish: 'Subject line use karein: "Grievance — [Aapka Naam]" taaki jaldi process ho.' } },
        { title: { en: 'Step 3: Describe Your Problem', hi: 'चरण 3: अपनी समस्या बताएं', hinglish: 'Step 3: Problem Describe Karein' }, desc: { en: 'Clearly describe your issue, include relevant details like dates, policy numbers, or screenshots.', hi: 'अपनी समस्या स्पष्ट रूप से बताएं, तारीख, पॉलिसी नंबर, या स्क्रीनशॉट जैसे संबंधित विवरण शामिल करें।', hinglish: 'Apni problem clearly batayein, dates, policy numbers, ya screenshots jaise relevant details include karein.' } },
        { title: { en: 'Step 4: Await Response', hi: 'चरण 4: प्रतिक्रिया की प्रतीक्षा करें', hinglish: 'Step 4: 30 Din Mein Jawab' }, desc: { en: 'You will receive a response within 30 working days. If unsatisfied, you may escalate.', hi: 'आपको 30 कार्य दिवसों में प्रतिक्रिया प्राप्त होगी। यदि असंतुष्ट हैं, तो आप एस्केलेट कर सकते हैं।', hinglish: 'Aapko 30 working days mein response milega. Agar satisfied nahi hain, toh escalate kar sakte hain.' } },
      ],
    },
    {
      heading: { en: '3. Kis Cheez Ki Shikayat (What You Can Complain About)', hi: '3. किस चीज़ की शिकायत करें', hinglish: '3. Kis Cheez Ki Shikayat' },
      items: [
        { title: { en: 'Personal Data Access / Correction / Deletion', hi: 'व्यक्तिगत डेटा एक्सेस / सुधार / हटाना', hinglish: 'Personal Data Dekhna / Sudharna / Mitana' }, desc: { en: 'If you want to view, correct, or delete your personal data held by us.', hi: 'यदि आप हमारे पास रखे गए अपने व्यक्तिगत डेटा को देखना, सुधारना या हटाना चाहते हैं।', hinglish: 'Agar aap humare paas rakhe apne personal data ko dekhna, sudharna ya mitana chahte hain.' } },
        { title: { en: 'Incorrect Information from InsureGPT', hi: 'InsureGPT से गलत जानकारी', hinglish: 'InsureGPT Se Galat Jankari' }, desc: { en: 'If InsureGPT provided incorrect or misleading insurance information.', hi: 'यदि InsureGPT ने गलत या भ्रामक बीमा जानकारी प्रदान की है।', hinglish: 'Agar InsureGPT ne galat ya misleading insurance information di hai.' } },
        { title: { en: 'Privacy Policy Violation', hi: 'गोपनीयता नीति उल्लंघन', hinglish: 'Privacy Policy Ullanghan' }, desc: { en: 'If you believe our privacy practices violate our stated policy.', hi: 'यदि आप मानते हैं कि हमारी गोपनीयता प्रथाएं हमारी नीति का उल्लंघन करती हैं।', hinglish: 'Agar aap maante hain ki hamari privacy practices hamari stated policy ka ullanghan karti hain.' } },
        { title: { en: 'Unauthorized Data Use', hi: 'अनधिकृत डेटा उपयोग', hinglish: 'Unauthorized Data Use' }, desc: { en: 'If your data was used without your consent or beyond the stated purpose.', hi: 'यदि आपके डेटा का उपयोग आपकी सहमति के बिना या बताए गए उद्देश्य से परे किया गया।', hinglish: 'Agar aapka data aapki consent ke bina ya stated purpose se beyond use kiya gaya.' } },
        { title: { en: 'Website Feature Problem', hi: 'वेबसाइट सुविधा समस्या', hinglish: 'Website Feature Problem' }, desc: { en: 'If you face technical issues, broken features, or errors on our platform.', hi: 'यदि आपको तकनीकी समस्याएं, टूटी सुविधाएं, या हमारे प्लेटफ़ॉर्म पर त्रुटियां आती हैं।', hinglish: 'Agar aapko technical issues, broken features, ya hamare platform pe errors aate hain.' } },
        { title: { en: 'IRDAI-Related Complaint', hi: 'IRDAI संबंधित शिकायत', hinglish: 'IRDAI Complaint' }, desc: { en: 'Complaints related to insurance transactions, policy issuance, or claim settlements under IRDAI regulations.', hi: 'IRDAI विनियमों के तहत बीमा लेनदेन, पॉलिसी जारी करने, या क्लेम निपटान से संबंधित शिकायतें।', hinglish: 'IRDAI regulations ke tahat insurance transactions, policy issuance, ya claim settlements se related complaints.' } },
      ],
    },
    {
      heading: { en: '4. Escalation', hi: '4. एस्केलेशन', hinglish: '4. Escalation' },
      intro: { en: 'If your grievance is not resolved satisfactorily, you may escalate to the following authorities:', hi: 'यदि आपकी शिकायत संतोषजनक रूप से सुलझाई नहीं गई, तो आप निम्नलिखित प्राधिकरणों के पास जा सकते हैं:', hinglish: 'Agar aapki grievance satisfactorily resolve nahi hui, toh aap following authorities ke paas ja sakte hain:' },
      items: [
        { title: { en: 'DPDP Board', hi: 'DPDP बोर्ड', hinglish: 'DPDP Board' }, desc: { en: 'File a complaint with the Data Protection Board of India at dpdpboard.gov.in for data protection related grievances under DPDP Act 2023.', hi: 'DPDP अधिनियम 2023 के तहत डेटा सुरक्षा से संबंधित शिकायतों के लिए dpdpboard.gov.in पर भारत के डेटा सुरक्षा बोर्ड में शिकायत दर्ज करें।', hinglish: 'DPDP Act 2023 ke tahat data protection related grievances ke liye dpdpboard.gov.in pe Data Protection Board of India mein complaint file karein.' } },
        { title: { en: 'IRDAI Bima Bharosa', hi: 'IRDAI बीमा भरोसा', hinglish: 'IRDAI Bima Bharosa' }, desc: { en: 'Lodge a complaint with IRDAI at bimabharosa.irdai.gov.in or call bimabharosa.irda.gov.in (Toll Free) for insurance-related grievances.', hi: 'बीमा से संबंधित शिकायतों के लिए bimabharosa.irdai.gov.in पर IRDAI में शिकायत दर्ज करें या bimabharosa.irda.gov.in (टोल फ्री) पर कॉल करें।', hinglish: 'Insurance-related grievances ke liye bimabharosa.irdai.gov.in pe IRDAI mein complaint lodge karein ya bimabharosa.irda.gov.in (Toll Free) pe call karein.' } },
        { title: { en: 'Consumer Forum', hi: 'उपभोक्ता मंच', hinglish: 'Consumer Forum' }, desc: { en: 'File a consumer complaint at consumerhelpline.gov.in for unresolved issues related to service quality or deficiency.', hi: 'सेवा गुणवत्ता या कमी से संबंधित अनसुलझे मुद्दों के लिए consumerhelpline.gov.in पर उपभोक्ता शिकायत दर्ज करें।', hinglish: 'Service quality ya deficiency se related unresolved issues ke liye consumerhelpline.gov.in pe consumer complaint file karein.' } },
      ],
    },
    {
      heading: { en: '5. DPDP Act 2023 Compliance', hi: '5. DPDP अधिनियम 2023 अनुपालन', hinglish: '5. DPDP Act 2023 Compliance' },
      items: [
        { title: { en: '30-Day Resolution Requirement', hi: '30 दिन की समाधान आवश्यकता', hinglish: '30 Day Resolution Requirement' }, desc: { en: 'Under the Digital Personal Data Protection Act 2023, we are obligated to acknowledge and resolve grievances within 30 days of receipt.', hi: 'डिजिटल व्यक्तिगत डेटा सुरक्षा अधिनियम 2023 के तहत, हम प्राप्ति के 30 दिनों के भीतर शिकायतों को स्वीकार करने और हल करने के लिए बाध्य हैं।', hinglish: 'Digital Personal Data Protection Act 2023 ke tahat, hum receipt ke 30 days ke andar grievances acknowledge aur resolve karne ke liye obligated hain.' } },
        { title: { en: 'Data Fiduciary Obligations', hi: 'डेटा फिड्यूशियरी दायित्व', hinglish: 'Data Fiduciary Obligations' }, desc: { en: 'As a Data Fiduciary, we are responsible for ensuring lawful processing of personal data, maintaining accuracy, and implementing reasonable security safeguards.', hi: 'डेटा फिड्यूशियरी के रूप में, हम व्यक्तिगत डेटा की वैध प्रोसेसिंग सुनिश्चित करने, सटीकता बनाए रखने, और उचित सुरक्षा उपायों को लागू करने के लिए जिम्मेदार हैं।', hinglish: 'Data Fiduciary ke roop mein, hum personal data ki lawful processing ensure karne, accuracy maintain karne, aur reasonable security safeguards implement karne ke liye responsible hain.' } },
        { title: { en: 'Consent Management', hi: 'सहमति प्रबंधन', hinglish: 'Consent Management' }, desc: { en: 'We manage and record your consent for data processing. You may withdraw consent at any time, and we will cease processing except where required by law.', hi: 'हम डेटा प्रोसेसिंग के लिए आपकी सहमति का प्रबंधन और रिकॉर्ड करते हैं। आप किसी भी समय सहमति वापस ले सकते हैं, और हम कानून द्वारा आवश्यक होने को छोड़कर प्रोसेसिंग बंद कर देंगे।', hinglish: 'Hum data processing ke liye aapki consent manage aur record karte hain. Aap kisi bhi time consent withdraw kar sakte hain, aur hum law dwara zaroori hone ko chodke processing band kar denge.' } },
      ],
    },
    {
      heading: { en: '6. Contact Information', hi: '6. संपर्क जानकारी', hinglish: '6. Contact Information' },
      intro: { en: 'For any grievances or queries, reach out to us through the following channels:', hi: 'किसी भी शिकायत या प्रश्न के लिए, निम्नलिखित माध्यमों से हमसे संपर्क करें:', hinglish: 'Kisi bhi grievance ya query ke liye, following channels se humse contact karein:' },
    },
  ],
  cta: {
    backToHome: { en: 'Back to Home', hi: 'होम पेज वापस', hinglish: 'Back to Home' },
    chatLabel: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें', hinglish: 'WhatsApp pe Chat Karein' },
  },
};

/* ── Section Icons mapping ─────────────────────────────────────────────── */
const sectionIcons = [UserCheck, FileText, Shield, Scale, Clock, Phone];

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

export default function GrievancePolicyClientContent() {
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

      {/* ═══════════════════ MAIN CONTENT + SIDEBAR ═══════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Table of Contents */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="glass-card p-5" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
                <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: GOLD }} /> {pt(pageText.toc)}
                </h3>
                <nav className="space-y-1">
                  {pageText.sections.map((s, i) => (
                    <a key={i} href={`#section-${i}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors group">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 group-hover:text-white transition-colors"
                        style={{ background: 'rgba(201,138,28,0.1)', color: GOLD }}
                      >
                        {i + 1}
                      </span>
                      <span className="truncate">{pt(s.heading)}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Content Sections */}
          <div className="flex-1 min-w-0 space-y-6">
            {pageText.sections.map((section, sIdx) => {
              const SIcon = sectionIcons[sIdx];
              return (
                <div key={sIdx} id={`section-${sIdx}`} className="glass-card p-6 sm:p-8 scroll-mt-24 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})` }}>
                      <SIcon className="w-5 h-5" style={{ color: GOLD }} />
                    </div>
                    <h2 className="text-xl font-bold text-white">{pt(section.heading)}</h2>
                  </div>

                  {/* Items list */}
                  {'items' in section && section.items && (
                    <div className="space-y-3">
                      {'intro' in section && section.intro && (
                        <p className="text-sm text-white/60 mb-4">{pt(section.intro as Tr)}</p>
                      )}
                      {section.items.map((item: Record<string, Tr>, i: number) => (
                        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.04)' }}>
                          {'title' in item && <h3 className="text-sm font-semibold text-white mb-1">{pt(item.title)}</h3>}
                          {'desc' in item && <p className="text-sm text-white/60">{pt(item.desc)}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Contact section specifics */}
                  {sIdx === 5 && (
                    <>
                      <p className="text-sm text-white/60 mb-5">{pt(pageText.sections[5].intro as Tr)}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                        <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"
                          className="rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-md"
                          style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                          <MessageCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
                          <h3 className="text-sm font-bold text-white">WhatsApp</h3>
                          <p className="text-xs" style={{ color: GOLD }}>WhatsApp</p>
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
                          <p className="text-xs" style={{ color: GOLD }}>Kota, Rajasthan</p>
                        </div>
                      </div>
                      <div className="rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.08)', border: '1px solid rgba(201,138,28,0.2)' }}>
                        <p className="text-sm font-semibold flex items-center gap-2 text-white">
                          <AlertTriangle className="w-4 h-4" style={{ color: GOLD }} /> {pt({ en: 'Unresolved grievances may be escalated to DPDP Board or IRDAI Bima Bharosa.', hi: 'अनसुलझी शिकायतों को DPDP बोर्ड या IRDAI बीमा भरोसा में एस्केलेट किया जा सकता है।', hinglish: 'Unresolved grievances ko DPDP Board ya IRDAI Bima Bharosa mein escalate kiya ja sakta hai.' })}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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
