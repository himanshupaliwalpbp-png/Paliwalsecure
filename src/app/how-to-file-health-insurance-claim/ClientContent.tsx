'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Language } from '@/lib/i18n-strings';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthorBio from '@/components/AuthorBio';
import { generateArticleSchema, irdaiDisclaimer, getWhatsAppCTA } from '@/lib/content-templates';
import { FileText, MessageCircle, Scale, ShieldCheck, Wallet, CheckCircle2, Clock } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const cashlessSteps = [
  { step: 1, title: { en: "Go to network hospital", hi: "नेटवर्क अस्पताल में जाएँ", hinglish: "Network hospital mein jaayein" }, desc: { en: "Check insurer's website/app for network hospitals near you.", hi: "अपने पास के नेटवर्क अस्पताल के लिए बीमाकर्ता की वेबसाइट/ऐप जाँचें।", hinglish: "Insurer ki website/app check karein network hospitals ke liye." } },
  { step: 2, title: { en: "Show health card at insurance desk", hi: "इंश्योरेंस डेस्क पर हेल्थ कार्ड दिखाएँ", hinglish: "Insurance desk pe health card dikhayein" }, desc: { en: "Present your health insurance card and valid ID proof.", hi: "अपना हेल्थ इंश्योरेंस कार्ड और वैध ID प्रमाण दिखाएँ।", hinglish: "Apna health insurance card aur valid ID proof dikhayein." } },
  { step: 3, title: { en: "Hospital sends pre-auth request", hi: "अस्पताल प्री-ऑथ अनुरोध भेजता है", hinglish: "Hospital pre-auth request bhejta hai" }, desc: { en: "Hospital submits pre-authorization to TPA/insurer. Emergency: 1-2 hours. Planned: 48-72 hours before.", hi: "अस्पताल TPA/बीमाकर्ता को प्री-ऑथोराइज़ेशन जमा करता है। आपातकाल: 1-2 घंटे। नियोजित: 48-72 घंटे पहले।", hinglish: "Hospital TPA/insurer ko pre-authorization submit karta hai." } },
  { step: 4, title: { en: "Get treated & discharged", hi: "इलाज कराएँ और छुट्टी लें", hinglish: "Treatment karayein aur discharge lein" }, desc: { en: "Insurer pays hospital directly. You only pay non-covered items and co-pay (if any).", hi: "बीमाकर्ता सीधे अस्पताल को भुगतान करता है। आप केवल गैर-कवर वाली चीज़ें और को-पे चुकाते हैं।", hinglish: "Insurer seedha hospital ko payment karta hai. Aap sirf non-covered items chukate hain." } },
];

const reimbursementSteps = [
  { step: 1, title: { en: "Get treated at any hospital", hi: "किसी भी अस्पताल में इलाज कराएँ", hinglish: "Kisi bhi hospital mein treatment karayein" }, desc: { en: "Pay all bills from your pocket.", hi: "सभी बिल अपनी जेब से चुकाएँ।", hinglish: "Sabhi bills apni jeb se chukayein." } },
  { step: 2, title: { en: "Collect all documents", hi: "सभी दस्तावेज़ इकट्ठा करें", hinglish: "Sabhi documents ikatthe karein" }, desc: { en: "Discharge summary, original bills, prescriptions, reports, payment receipts.", hi: "डिस्चार्ज सारांश, मूल बिल, पर्चे, रिपोर्ट, भुगतान रसीदें।", hinglish: "Discharge summary, original bills, prescriptions, reports, payment receipts." } },
  { step: 3, title: { en: "Submit claim within 7-15 days", hi: "7-15 दिनों में क्लेम जमा करें", hinglish: "7-15 dino mein claim jamaa karein" }, desc: { en: "File claim form with all documents to insurer. Late filing may cause rejection.", hi: "सभी दस्तावेज़ों के साथ क्लेम फॉर्म बीमाकर्ता को जमा करें। देर से जमा करने पर अस्वीकृति हो सकती है।", hinglish: "Claim form with all documents insurer ko jamaa karein." } },
  { step: 4, title: { en: "Receive payment in 15-30 days", hi: "15-30 दिनों में भुगतान प्राप्त करें", hinglish: "15-30 dino mein payment paayein" }, desc: { en: "Insurer processes and transfers approved amount to your bank account.", hi: "बीमाकर्ता स्वीकृत राशि आपके बैंक खाते में ट्रांसफर करता है।", hinglish: "Insurer approved amount aapke bank account mein transfer karta hai." } },
];

const requiredDocs = [
  { en: "Duly filled claim form", hi: "भरा हुआ क्लेम फॉर्म", hinglish: "Filled claim form" },
  { en: "Discharge summary from hospital", hi: "अस्पताल से डिस्चार्ज सारांश", hinglish: "Discharge summary from hospital" },
  { en: "Original bills & payment receipts", hi: "मूल बिल और भुगतान रसीदें", hinglish: "Original bills & payment receipts" },
  { en: "Doctor's prescriptions & consultation notes", hi: "डॉक्टर के पर्चे और परामर्श नोट्स", hinglish: "Doctor's prescriptions & notes" },
  { en: "Investigation reports (X-ray, MRI, blood tests)", hi: "जाँच रिपोर्ट (X-ray, MRI, रक्त परीक्षण)", hinglish: "Investigation reports" },
  { en: "Pharmacy bills with prescriptions", hi: "पर्चे के साथ फार्मेसी बिल", hinglish: "Pharmacy bills with prescriptions" },
  { en: "Copy of health insurance card & ID proof", hi: "हेल्थ इंश्योरेंस कार्ड और ID प्रमाण की कॉपी", hinglish: "Health card & ID proof copy" },
  { en: "NEFT/bank details for reimbursement", hi: "रिम्बर्समेंट के लिए NEFT/बैंक विवरण", hinglish: "NEFT/bank details for reimbursement" },
];

export default function HowToFileClaimClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;
  const articleSchema = generateArticleSchema({ title: "How to File Health Insurance Claim — Step by Step 2026", description: "Step-by-step guide to filing health insurance claims.", slug: "how-to-file-health-insurance-claim", datePublished: "2025-03-05", dateModified: "2026-03-04" });

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-[#C98A1C]/20 text-[#C98A1C] border-[#C98A1C]/30 rounded-full px-4 py-1"><FileText className="w-3.5 h-3.5 mr-1" />Claim Guide 2026</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="gradient-text">{lang === 'hi' ? 'हेल्थ इंश्योरेंस क्लेम कैसे करें' : 'How to File Health Insurance'}</span>{' '}
            <span className="text-[#7ED3E6]">{lang === 'hi' ? 'चरण-दर-चरण' : 'Claim — Step by Step'}</span>
          </h1>
        </div>
      </section>

      {/* Cashless Steps */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3"><ShieldCheck className="w-7 h-7 text-green-500" />{lang === 'hi' ? 'कैशलेस क्लेम प्रक्रिया' : 'Cashless Claim Process'}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {cashlessSteps.map((s) => (
            <Card key={s.step} className="rounded-2xl border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-sm">{s.step}</div>
                  <h3 className="font-bold text-foreground text-sm">{pt(s.title, lang)}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{pt(s.desc, lang)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Reimbursement Steps */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3"><Wallet className="w-7 h-7 text-amber-500" />{lang === 'hi' ? 'रिम्बर्समेंट क्लेम प्रक्रिया' : 'Reimbursement Claim Process'}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {reimbursementSteps.map((s) => (
            <Card key={s.step} className="rounded-2xl border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">{s.step}</div>
                  <h3 className="font-bold text-foreground text-sm">{pt(s.title, lang)}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{pt(s.desc, lang)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Required Documents */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8">{lang === 'hi' ? 'ज़रूरी दस्तावेज़' : 'Required Documents'}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {requiredDocs.map((doc, i) => (
            <Card key={i} className="rounded-xl"><CardContent className="p-3 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#C98A1C] shrink-0 mt-0.5" /><span className="text-sm text-foreground">{pt(doc, lang)}</span></CardContent></Card>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6"><div className="p-4 bg-muted/50 rounded-2xl border border-border/50"><div className="flex items-start gap-3"><Scale className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground leading-relaxed">{irdaiDisclaimer[lang]}</p></div></div></section>
      <AuthorBio />

      <section className="py-16 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{lang === 'hi' ? 'क्लेम करने में मदद चाहिए?' : 'Need help filing a claim?'}</h2>
          <a href={getWhatsAppCTA('Hi! I need help filing my health insurance claim.')}>
            <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-4"><MessageCircle className="w-5 h-5 mr-2" />Chat on WhatsApp</ShinyButton>
          </a>
        </div>
      </section>
    </div>
  );
}
