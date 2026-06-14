'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import {
  Newspaper, TrendingUp, ShieldCheck, IndianRupee,
  ArrowRight, MessageCircle, ChevronRight, AlertTriangle,
  Clock, Scale, FileText, Zap, Heart, Car,
} from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "Latest Updates 2025", hi: "नवीनतम अपडेट 2025", hinglish: "Latest Updates 2025" },
    title1: { en: "Insurance News Hub", hi: "इंश्योरेंस न्यूज़ हब", hinglish: "Insurance News Hub" },
    title2: { en: "IRDAI Updates & Regulation News 2025", hi: "IRDAI अपडेट और विनियमन समाचार 2025", hinglish: "IRDAI Updates & Regulation News 2025" },
    desc: { en: "Latest IRDAI regulations, GST changes, medical inflation impact, and policyholder rights. Expert analysis and actionable guidance.", hi: "नवीनतम IRDAI विनियमन, GST परिवर्तन, चिकित्सा मुद्रास्फीति प्रभाव और पॉलिसीधारक अधिकार। विशेषज्ञ विश्लेषण और कार्यवाहक मार्गदर्शन।", hinglish: "Latest IRDAI regulations, GST changes, medical inflation impact, aur policyholder rights. Expert analysis aur actionable guidance." },
    ctaWhatsApp: { en: "💬 Ask About IRDAI Updates", hi: "💬 IRDAI अपडेट पूछें", hinglish: "💬 IRDAI Updates Poochiye" },
  },
  latestNews: {
    heading: { en: "Latest Insurance News & Updates", hi: "नवीनतम बीमा समाचार और अपडेट", hinglish: "Latest Insurance News & Updates" },
    desc: { en: "Stay updated on IRDAI regulations, GST changes, and policy changes that affect your insurance coverage.", hi: "IRDAI विनियमन, GST परिवर्तन और नीति परिवर्तनों पर अपडेट रहें जो आपके बीमा कवरेज को प्रभावित करते हैं।", hinglish: "IRDAI regulations, GST changes, aur policy changes pe update rahein jo aapke insurance coverage ko affect karte hain." },
    gst: { en: "GST Exempted on Health Insurance from Sept 2025", hi: "सितंबर 2025 से हेल्थ इंश्योरेंस पर GST छूट", hinglish: "GST Exempted on Health Insurance from Sept 2025" },
    gstSummary: { en: "Union Budget 2025-26 removes 18% GST from health insurance premiums. Policies will become ~18% cheaper from 22 September 2025.", hi: "केंद्रीय बजट 2025-26 हेल्थ इंश्योरेंस प्रीमियम से 18% GST हटाता है। 22 सितंबर 2025 से पॉलिसियाँ ~18% सस्ती होंगी।", hinglish: "Union Budget 2025-26 removes 18% GST from health insurance premiums. Policies ~18% cheaper hongi from 22 September 2025." },
    gstImpact: { en: "Positive — premiums drop ~18%", hi: "सकारात्मक — प्रीमियम ~18% कम", hinglish: "Positive — premiums drop ~18%" },
    ageLimit: { en: "IRDAI Removes Upper Age Limit for Health Insurance", hi: "IRDAI ने हेल्थ इंश्योरेंस की अधिकतम आयु सीमा हटाई", hinglish: "IRDAI Removes Upper Age Limit for Health Insurance" },
    ageSummary: { en: "No insurer can refuse to issue a policy based on age. Benefits senior citizens aged 60-80+.", hi: "कोई बीमाकर्ता आयु के आधार पर पॉलिसी जारी करने से इंकार नहीं कर सकता। 60-80+ वरिष्ठ नागरिकों को लाभ।", hinglish: "No insurer age ke basis pe policy issue karne se refuse nahi kar sakta. Senior citizens 60-80+ ko benefit." },
    ageImpact: { en: "Positive — more coverage access", hi: "सकारात्मक — अधिक कवरेज पहुँच", hinglish: "Positive — more coverage access" },
    tpRate: { en: "MoRTH TP Rate Revision — Rates Stable for 2024-25", hi: "MoRTH TP दर संशोधन — 2024-25 के लिए दरें स्थिर", hinglish: "MoRTH TP Rate Revision — Rates Stable for 2024-25" },
    tpSummary: { en: "Third-party motor insurance rates remain unchanged. EVs continue to enjoy 15% discount on TP premiums.", hi: "थर्ड-पार्टी मोटर बीमा दरें अपरिवर्तित रहती हैं। EV को TP प्रीमियम पर 15% छूट जारी।", hinglish: "Third-party motor insurance rates unchanged. EVs continue 15% discount on TP premiums." },
    tpImpact: { en: "Neutral — no rate increase", hi: "तटस्थ — कोई दर वृद्धि नहीं", hinglish: "Neutral — no rate increase" },
    cashless: { en: "1-Hour Cashless Approval Mandate by IRDAI", hi: "IRDAI द्वारा 1 घंटे का कैशलेस अनुमोदन अनिवार्य", hinglish: "1-Hour Cashless Approval Mandate by IRDAI" },
    cashlessSummary: { en: "IRDAI mandates 1-hour approval for cashless requests and 3-hour discharge authorization at network hospitals.", hi: "IRDAI नेटवर्क अस्पतालों में कैशलेस अनुरोधों के लिए 1 घंटे की मंजूरी और 3 घंटे की डिस्चार्ज प्राधिकरण अनिवार्य करता है।", hinglish: "IRDAI mandates 1-hour approval for cashless requests aur 3-hour discharge authorization at network hospitals." },
    cashlessImpact: { en: "Positive — faster claim processing", hi: "सकारात्मक — तेज़ क्लेम प्रोसेसिंग", hinglish: "Positive — faster claim processing" },
    medInflation: { en: "Medical Inflation at 14% — Highest in Asia", hi: "14% पर चिकित्सा मुद्रास्फीति — एशिया में सबसे अधिक", hinglish: "Medical Inflation at 14% — Highest in Asia" },
    medInflationSummary: { en: "India's medical inflation rate of 14% is the highest in Asia. Hospital bills double every 5 years.", hi: "भारत की 14% चिकित्सा मुद्रास्फीति दर एशिया में सबसे अधिक है। अस्पताल बिल हर 5 वर्ष में दोगुने होते हैं।", hinglish: "India ka 14% medical inflation rate Asia mein sabse zyada hai. Hospital bills har 5 saal mein double hote hain." },
    medInflationImpact: { en: "Negative — premiums rising", hi: "नकारात्मक — प्रीमियम बढ़ रहे हैं", hinglish: "Negative — premiums rising" },
    portability: { en: "IRDAI Simplifies Insurance Portability Rules", hi: "IRDAI ने बीमा पोर्टेबिलिटी नियम सरल किए", hinglish: "IRDAI Simplifies Insurance Portability Rules" },
    portabilitySummary: { en: "New insurers must process portability within 30 days. Waiting period credits from old insurer must be honored.", hi: "नए बीमाकर्ताओं को 30 दिनों में पोर्टेबिलिटी प्रोसेस करनी चाहिए। पुराने बीमाकर्ता की प्रतीक्षा अवधि क्रेडिट का सम्मान करना चाहिए।", hinglish: "New insurers must process portability within 30 days. Waiting period credits from old insurer must be honored." },
    portabilityImpact: { en: "Positive — easier insurer switching", hi: "सकारात्मक — आसान बीमाकर्ता बदलाव", hinglish: "Positive — easier insurer switching" },
    tax: { en: "Tax & Premium", hi: "कर और प्रीमियम", hinglish: "Tax & Premium" },
    health: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    motor: { en: "Motor Insurance", hi: "मोटर इंश्योरेंस", hinglish: "Motor Insurance" },
    claims: { en: "Claims", hi: "क्लेम", hinglish: "Claims" },
    premiumImpact: { en: "Premium Impact", hi: "प्रीमियम प्रभाव", hinglish: "Premium Impact" },
    regulation: { en: "Regulation", hi: "विनियमन", hinglish: "Regulation" },
  },
  regulationTable: {
    heading: { en: "Key IRDAI Regulation Changes 2024-2025", hi: "प्रमुख IRDAI विनियमन परिवर्तन 2024-2025", hinglish: "Key IRDAI Regulation Changes 2024-2025" },
    desc: { en: "These regulation changes directly impact your insurance coverage, claims, and premiums.", hi: "ये विनियमन परिवर्तन सीधे आपके बीमा कवरेज, क्लेम और प्रीमियम को प्रभावित करते हैं।", hinglish: "Yeh regulation changes directly aapke insurance coverage, claims, aur premiums ko affect karte hain." },
    thRule: { en: "Regulation", hi: "विनियमन", hinglish: "Regulation" },
    thStatus: { en: "Status", hi: "स्थिति", hinglish: "Status" },
    thEffective: { en: "Effective", hi: "प्रभावी", hinglish: "Effective" },
    thImpact: { en: "Impact on You", hi: "आप पर प्रभाव", hinglish: "Impact on You" },
    active: { en: "Active", hi: "सक्रिय", hinglish: "Active" },
    fromSept: { en: "From Sept 2025", hi: "सितंबर 2025 से", hinglish: "From Sept 2025" },
    ongoing: { en: "Ongoing", hi: "जारी", hinglish: "Ongoing" },
  },
  gstImpact: {
    heading: { en: "GST on Health Insurance — Impact Analysis", hi: "हेल्थ इंश्योरेंस पर GST — प्रभाव विश्लेषण", hinglish: "GST on Health Insurance — Impact Analysis" },
    desc: { en: "The removal of 18% GST from health insurance premiums is the biggest cost reduction in Indian health insurance history.", hi: "हेल्थ इंश्योरेंस प्रीमियम से 18% GST हटाना भारतीय हेल्थ इंश्योरेंस इतिहास में सबसे बड़ी लागत कमी है।", hinglish: "18% GST removal from health insurance premiums is the biggest cost reduction in Indian health insurance history." },
    card1Title: { en: "Individual Plan Savings", hi: "व्यक्तिगत योजना बचत", hinglish: "Individual Plan Savings" },
    card1Desc: { en: "A ₹10,000/year policy becomes ~₹8,475 — saving ₹1,525/year", hi: "₹10,000/वर्ष की पॉलिसी ~₹8,475 हो जाती है — ₹1,525/वर्ष की बचत", hinglish: "₹10,000/year policy becomes ~₹8,475 — saving ₹1,525/year" },
    card2Title: { en: "Family Floater Savings", hi: "फ़ैमिली फ्लोटर बचत", hinglish: "Family Floater Savings" },
    card2Desc: { en: "A ₹25,000/year family plan saves ~₹4,500/year in GST", hi: "₹25,000/वर्ष का फ़ैमिली प्लान GST में ~₹4,500/वर्ष बचाता है", hinglish: "₹25,000/year family plan saves ~₹4,500/year in GST" },
    card3Title: { en: "Senior Citizen Savings", hi: "वरिष्ठ नागरिक बचत", hinglish: "Senior Citizen Savings" },
    card3Desc: { en: "₹50,000/year senior citizen plan saves ~₹9,000/year", hi: "₹50,000/वर्ष वरिष्ठ नागरिक योजना ~₹9,000/वर्ष बचाती है", hinglish: "₹50,000/year senior citizen plan saves ~₹9,000/year" },
    readFull: { en: "Read Full GST Impact Analysis →", hi: "पूर्ण GST प्रभाव विश्लेषण पढ़ें →", hinglish: "Read Full GST Impact Analysis →" },
  },
  medicalInflation: {
    heading: { en: "Medical Inflation — Why Your Coverage May Be Inadequate", hi: "चिकित्सा मुद्रास्फीति — आपका कवरेज अपर्याप्त हो सकता है", hinglish: "Medical Inflation — Why Your Coverage May Be Inadequate" },
    desc: { en: "At 14% medical inflation, hospital bills double every 5 years. A ₹5 Lakh cover that was sufficient in 2020 may fall short in 2025.", hi: "14% चिकित्सा मुद्रास्फीति पर, अस्पताल बिल हर 5 वर्ष में दोगुने होते हैं। 2020 में पर्याप्त ₹5 लाख कवर 2025 में कम पड़ सकता है।", hinglish: "14% medical inflation pe, hospital bills har 5 saal mein double hote hain. ₹5 Lakh cover jo 2020 mein sufficient tha, 2025 mein shortfall ho sakta hai." },
    thYear: { en: "Year", hi: "वर्ष", hinglish: "Year" },
    thRealValue: { en: "₹5L Cover Value (Real)", hi: "₹5L कवर मूल्य (वास्तविक)", hinglish: "₹5L Cover Value (Real)" },
    thRecommended: { en: "Recommended Cover", hi: "अनुशंसित कवर", hinglish: "Recommended Cover" },
    review: { en: "Medical inflation erodes your coverage.", hi: "चिकित्सा मुद्रास्फीति आपके कवरेज को कम करती है।", hinglish: "Medical inflation erodes your coverage." },
    reviewLink: { en: "Review your health insurance coverage →", hi: "अपना हेल्थ इंश्योरेंस कवरेज समीक्षा करें →", hinglish: "Review your health insurance coverage →" },
  },
  rights: {
    heading: { en: "Your Rights as a Policyholder (IRDAI 2025)", hi: "पॉलिसीधारक के रूप में आपके अधिकार (IRDAI 2025)", hinglish: "Your Rights as a Policyholder (IRDAI 2025)" },
    desc: { en: "IRDAI has strengthened policyholder rights significantly. Know your rights — they protect you.", hi: "IRDAI ने पॉलिसीधारक अधिकारों को काफी मजबूत किया है। अपने अधिकार जानें — वे आपकी रक्षा करते हैं।", hinglish: "IRDAI ne policyholder rights significantly strengthen kiye hain. Apne rights jaanein — yeh aapki raksha karte hain." },
  },
  cta: {
    heading: { en: "Confused About Insurance Regulation Changes?", hi: "बीमा विनियमन परिवर्तनों को लेकर उलझन में हैं?", hinglish: "Insurance Regulation Changes ke Baare Mein Confused?" },
    desc: { en: "Get clarity on how IRDAI updates affect YOUR insurance. Free consultation with IRDAI-certified advisor Himanshu Paliwal (POSP Code: IP429834).", hi: "जानें कि IRDAI अपडेट आपके बीमे को कैसे प्रभावित करते हैं। IRDAI-प्रमाणित सलाहकार हिमांशु पालीवाल से मुफ़्त परामर्श।", hinglish: "Jaaniye IRDAI updates aapke insurance ko kaise affect karte hain. IRDAI-certified advisor Himanshu Paliwal se free consultation." },
    ctaWhatsApp: { en: "💬 Ask Expert on WhatsApp", hi: "💬 WhatsApp पर विशेषज्ञ से पूछें", hinglish: "💬 WhatsApp pe Expert se Poochiye" },
    ctaClaims: { en: "Claims Hub →", hi: "क्लेम हब →", hinglish: "Claims Hub →" },
  },
};

const faqs = [
  { question: 'Is GST removed from health insurance in India?', answer: 'Yes, the Union Budget 2025-26 announced GST exemption on health insurance premiums from 22 September 2025. Health insurance premiums will become approximately 18% cheaper. The exemption applies to both individual and group health insurance policies.' },
  { question: 'What are the latest IRDAI regulations for policyholders?', answer: 'Key IRDAI regulations in 2025: (1) No upper age limit for buying health insurance, (2) 1-hour cashless approval mandate, (3) 3-hour discharge authorization, (4) Maximum 3-year PED waiting period, (5) Free-look period extended to 30 days for online policies.' },
  { question: 'How does medical inflation affect health insurance premiums?', answer: 'Medical inflation in India is 14-15% annually — far higher than general inflation (5-6%). This means hospital bills double every 5 years. Insurers increase premiums by 5-10% each year to keep up.' },
  { question: 'What is the IRDAI mandate on claim settlement timeline?', answer: 'IRDAI mandates: Cashless health claims must be approved within 1 hour for emergencies. Discharge authorization must be given within 3 hours. All claim decisions must be communicated within 30 days.' },
  { question: 'Has IRDAI removed the age limit for health insurance?', answer: 'Yes, since April 2025, IRDAI has removed the upper age limit for buying health insurance. No insurer can refuse to issue a policy based on age. This is a major relief for senior citizens aged 60-80+.' },
  { question: 'What is the Insurance Ombudsman and how does it help?', answer: 'The Insurance Ombudsman is a free, independent dispute resolution body created by IRDAI. You can approach them for claim rejection disputes, delayed settlement, premium disagreements. File online at ciio.co.in. Resolution within 3 months.' },
];

export default function ClientContent() {
  const { language } = useLanguage();

  const newsItems = [
    { title: pt(pageText.latestNews.gst, language), slug: 'gst-exempt-health-insurance', category: pt(pageText.latestNews.tax, language), date: pt({ en: "July 2025", hi: "जुलाई 2025", hinglish: "July 2025" }, language), icon: IndianRupee, summary: pt(pageText.latestNews.gstSummary, language), impact: pt(pageText.latestNews.gstImpact, language) },
    { title: pt(pageText.latestNews.ageLimit, language), slug: 'irdai-age-limit-removed', category: pt(pageText.latestNews.health, language), date: pt({ en: "April 2025", hi: "अप्रैल 2025", hinglish: "April 2025" }, language), icon: Heart, summary: pt(pageText.latestNews.ageSummary, language), impact: pt(pageText.latestNews.ageImpact, language) },
    { title: pt(pageText.latestNews.tpRate, language), slug: 'tp-rate-revision-2024', category: pt(pageText.latestNews.motor, language), date: pt({ en: "April 2024", hi: "अप्रैल 2024", hinglish: "April 2024" }, language), icon: Car, summary: pt(pageText.latestNews.tpSummary, language), impact: pt(pageText.latestNews.tpImpact, language) },
    { title: pt(pageText.latestNews.cashless, language), slug: 'irdai-cashless-mandate', category: pt(pageText.latestNews.claims, language), date: pt({ en: "January 2025", hi: "जनवरी 2025", hinglish: "January 2025" }, language), icon: Clock, summary: pt(pageText.latestNews.cashlessSummary, language), impact: pt(pageText.latestNews.cashlessImpact, language) },
    { title: pt(pageText.latestNews.medInflation, language), slug: 'medical-inflation-india', category: pt(pageText.latestNews.premiumImpact, language), date: pt({ en: "Ongoing", hi: "जारी", hinglish: "Ongoing" }, language), icon: TrendingUp, summary: pt(pageText.latestNews.medInflationSummary, language), impact: pt(pageText.latestNews.medInflationImpact, language) },
    { title: pt(pageText.latestNews.portability, language), slug: 'irdai-portability-rules', category: pt(pageText.latestNews.regulation, language), date: pt({ en: "March 2025", hi: "मार्च 2025", hinglish: "March 2025" }, language), icon: Scale, summary: pt(pageText.latestNews.portabilitySummary, language), impact: pt(pageText.latestNews.portabilityImpact, language) },
  ];

  const regulationChanges = [
    { rule: pt({ en: "No Age Limit for Health Insurance", hi: "हेल्थ इंश्योरेंस के लिए कोई आयु सीमा नहीं", hinglish: "No Age Limit for Health Insurance" }, language), status: pt(pageText.regulationTable.active, language), effective: pt({ en: "April 2025", hi: "अप्रैल 2025", hinglish: "April 2025" }, language), impact: pt({ en: "Senior citizens (60-80+) can now buy health insurance", hi: "वरिष्ठ नागरिक (60-80+) अब हेल्थ इंश्योरेंस खरीद सकते हैं", hinglish: "Senior citizens (60-80+) can now buy health insurance" }, language) },
    { rule: pt({ en: "1-Hour Cashless Approval", hi: "1 घंटे में कैशलेस अनुमोदन", hinglish: "1-Hour Cashless Approval" }, language), status: pt(pageText.regulationTable.active, language), effective: pt({ en: "Jan 2025", hi: "जनवरी 2025", hinglish: "Jan 2025" }, language), impact: pt({ en: "Emergency cashless must be approved within 1 hour", hi: "आपातकालीन कैशलेस 1 घंटे में मंजूर होना चाहिए", hinglish: "Emergency cashless must be approved within 1 hour" }, language) },
    { rule: pt({ en: "3-Hour Discharge Authorization", hi: "3 घंटे में डिस्चार्ज प्राधिकरण", hinglish: "3-Hour Discharge Authorization" }, language), status: pt(pageText.regulationTable.active, language), effective: pt({ en: "Jan 2025", hi: "जनवरी 2025", hinglish: "Jan 2025" }, language), impact: pt({ en: "Discharge clearance within 3 hours at network hospitals", hi: "नेटवर्क अस्पतालों में 3 घंटे में डिस्चार्ज", hinglish: "Discharge clearance within 3 hours at network hospitals" }, language) },
    { rule: pt({ en: "Max 3-Year PED Waiting Period", hi: "अधिकतम 3-वर्ष PED प्रतीक्षा अवधि", hinglish: "Max 3-Year PED Waiting Period" }, language), status: pt(pageText.regulationTable.active, language), effective: pt({ en: "April 2024", hi: "अप्रैल 2024", hinglish: "April 2024" }, language), impact: pt({ en: "Pre-existing diseases covered after maximum 3 years", hi: "पूर्व-मौजूदा बीमारियाँ अधिकतम 3 वर्ष बाद कवर", hinglish: "Pre-existing diseases covered after maximum 3 years" }, language) },
    { rule: pt({ en: "GST Exemption on Health Insurance", hi: "हेल्थ इंश्योरेंस पर GST छूट", hinglish: "GST Exemption on Health Insurance" }, language), status: pt(pageText.regulationTable.fromSept, language), effective: pt({ en: "22 Sept 2025", hi: "22 सितंबर 2025", hinglish: "22 Sept 2025" }, language), impact: pt({ en: "Health insurance premiums drop ~18%", hi: "हेल्थ इंश्योरेंस प्रीमियम ~18% कम", hinglish: "Health insurance premiums drop ~18%" }, language) },
    { rule: pt({ en: "30-Day Free-Look for Online Policies", hi: "ऑनलाइन पॉलिसियों के लिए 30-दिन की मुफ़्त देखें अवधि", hinglish: "30-Day Free-Look for Online Policies" }, language), status: pt(pageText.regulationTable.active, language), effective: pt({ en: "April 2024", hi: "अप्रैल 2024", hinglish: "April 2024" }, language), impact: pt({ en: "30 days to return online policies for full refund", hi: "पूर्ण वापसी के लिए ऑनलाइन पॉलिसियाँ 30 दिन", hinglish: "30 days to return online policies for full refund" }, language) },
    { rule: pt({ en: "15% EV Discount on TP", hi: "TP पर 15% EV छूट", hinglish: "15% EV Discount on TP" }, language), status: pt(pageText.regulationTable.active, language), effective: pt(pageText.regulationTable.ongoing, language), impact: pt({ en: "Electric vehicles get 15% discount on TP premiums", hi: "इलेक्ट्रिक वाहनों को TP प्रीमियम पर 15% छूट", hinglish: "Electric vehicles get 15% discount on TP premiums" }, language) },
  ];

  const rightsItems = [
    { right: pt({ en: "No Age Limit for Health Insurance", hi: "हेल्थ इंश्योरेंस के लिए कोई आयु सीमा नहीं", hinglish: "No Age Limit for Health Insurance" }, language), desc: pt({ en: "Insurers cannot refuse health insurance based on age. Effective from April 2025.", hi: "बीमाकर्ता आयु के आधार पर हेल्थ इंश्योरेंस से इंकार नहीं कर सकते। अप्रैल 2025 से प्रभावी।", hinglish: "Insurers age ke basis pe health insurance refuse nahi kar sakte. Effective from April 2025." }, language) },
    { right: pt({ en: "1-Hour Cashless Approval", hi: "1 घंटे में कैशलेस अनुमोदन", hinglish: "1-Hour Cashless Approval" }, language), desc: pt({ en: "Emergency cashless requests must be approved within 1 hour at network hospitals.", hi: "आपातकालीन कैशलेस अनुरोध नेटवर्क अस्पतालों में 1 घंटे में मंजूर होने चाहिए।", hinglish: "Emergency cashless requests must be approved within 1 hour at network hospitals." }, language) },
    { right: pt({ en: "30-Day Free-Look Period", hi: "30-दिन की मुफ़्त देखें अवधि", hinglish: "30-Day Free-Look Period" }, language), desc: pt({ en: "Online policies get 30 days to return for full refund (15 days for offline).", hi: "ऑनलाइन पॉलिसियों को पूर्ण वापसी के लिए 30 दिन (ऑफलाइन के लिए 15 दिन)।", hinglish: "Online policies get 30 days to return for full refund (15 days for offline)." }, language) },
    { right: pt({ en: "Lifelong Renewability", hi: "आजीवन नवीनीकरणीयता", hinglish: "Lifelong Renewability" }, language), desc: pt({ en: "Insurers cannot refuse renewal based on age, claims history, or health condition.", hi: "बीमाकर्ता आयु, क्लेम इतिहास या स्वास्थ्य स्थिति के आधार पर नवीनीकरण से इंकार नहीं कर सकते।", hinglish: "Insurers cannot refuse renewal based on age, claims history, or health condition." }, language) },
    { right: pt({ en: "Portability Within 30 Days", hi: "30 दिनों में पोर्टेबिलिटी", hinglish: "Portability Within 30 Days" }, language), desc: pt({ en: "Switch insurers while retaining waiting period credits. New insurer must process in 30 days.", hi: "प्रतीक्षा अवधि क्रेडिट बनाए रखते हुए बीमाकर्ता बदलें। नए बीमाकर्ता को 30 दिनों में प्रोसेस करना चाहिए।", hinglish: "Switch insurers retaining waiting period credits. New insurer must process in 30 days." }, language) },
    { right: pt({ en: "Interest on Delayed Claims", hi: "विलंबित क्लेम पर ब्याज", hinglish: "Interest on Delayed Claims" }, language), desc: pt({ en: "If insurer delays payment beyond 30 days, they must pay interest at bank rate + 2%.", hi: "यदि बीमाकर्ता 30 दिनों से अधिक भुगतान में देरी करता है, तो बैंक दर + 2% पर ब्याज चुकाना चाहिए।", hinglish: "If insurer delays payment beyond 30 days, they must pay interest at bank rate + 2%." }, language) },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        <div className="orb-1 absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="orb-2 absolute bottom-10 right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">{pt({ en: "Home", hi: "होम", hinglish: "Home" }, language)}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{pt(pageText.hero.title1, language)}</span>
          </nav>
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Newspaper className="h-3.5 w-3.5 mr-1" />
              {pt(pageText.hero.badge, language)}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {pt(pageText.hero.title1, language)}{' '}
              <span className="gradient-text">{pt(pageText.hero.title2, language)}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(pageText.hero.desc, language)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: Newspaper, label: pt({ en: "News Updates", hi: "समाचार अपडेट", hinglish: "News Updates" }, language), value: `${newsItems.length}+` },
                { icon: ShieldCheck, label: pt({ en: "IRDAI Rules", hi: "IRDAI नियम", hinglish: "IRDAI Rules" }, language), value: `${regulationChanges.length} Key` },
                { icon: TrendingUp, label: pt({ en: "Medical Inflation", hi: "चिकित्सा मुद्रास्फीति", hinglish: "Medical Inflation" }, language), value: '14%/yr' },
                { icon: IndianRupee, label: pt({ en: "GST Savings", hi: "GST बचत", hinglish: "GST Savings" }, language), value: '~18%' },
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
              <ShinyButton variant="blue"><span>{pt(pageText.hero.ctaWhatsApp, language)}</span></ShinyButton>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Latest News */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Newspaper className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.latestNews.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.latestNews.desc, language)}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems.map((item, i) => (
              <Link key={i} href={`/insurance-news/irdai-${item.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="h-5 w-5 text-primary shrink-0" />
                      <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">{item.date}</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-3">{item.summary}</p>
                    <Badge className="mt-2 text-[10px]" variant="outline">{item.impact}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Regulation Changes */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.regulationTable.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.regulationTable.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-3 font-semibold">{pt(pageText.regulationTable.thRule, language)}</th><th className="text-center p-3 font-semibold">{pt(pageText.regulationTable.thStatus, language)}</th><th className="text-center p-3 font-semibold">{pt(pageText.regulationTable.thEffective, language)}</th><th className="text-left p-3 font-semibold">{pt(pageText.regulationTable.thImpact, language)}</th></tr></thead>
              <tbody>{regulationChanges.map((row, i) => (<tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}><td className="p-3 font-medium">{row.rule}</td><td className="p-3 text-center"><Badge variant={row.status === pt(pageText.regulationTable.active, language) ? 'default' : 'secondary'} className="text-[10px]">{row.status}</Badge></td><td className="p-3 text-center text-muted-foreground">{row.effective}</td><td className="p-3 text-muted-foreground">{row.impact}</td></tr>))}</tbody>
            </table>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* GST Impact */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><IndianRupee className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.gstImpact.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.gstImpact.desc, language)}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: pt(pageText.gstImpact.card1Title, language), desc: pt(pageText.gstImpact.card1Desc, language), icon: IndianRupee },
              { title: pt(pageText.gstImpact.card2Title, language), desc: pt(pageText.gstImpact.card2Desc, language), icon: Heart },
              { title: pt(pageText.gstImpact.card3Title, language), desc: pt(pageText.gstImpact.card3Desc, language), icon: ShieldCheck },
            ].map((item, i) => (
              <Card key={i} className="glass-card border-emerald-200 dark:border-emerald-900/50 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 flex items-start gap-3">
                  <item.icon className="h-8 w-8 text-emerald-600 shrink-0 mt-1" />
                  <div><h3 className="font-semibold text-sm">{item.title}</h3><p className="text-xs text-muted-foreground mt-1">{item.desc}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4"><Link href="/insurance-news/irdai-gst-exempt-health-insurance"><ShinyButton variant="secondary"><span>{pt(pageText.gstImpact.readFull, language)}</span></ShinyButton></Link></div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Medical Inflation */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-amber-600" /><span className="gradient-text">{pt(pageText.medicalInflation.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.medicalInflation.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-3 font-semibold">{pt(pageText.medicalInflation.thYear, language)}</th><th className="text-center p-3 font-semibold">{pt(pageText.medicalInflation.thRealValue, language)}</th><th className="text-center p-3 font-semibold">{pt(pageText.medicalInflation.thRecommended, language)}</th></tr></thead>
              <tbody>{[
                { year: '2020', realValue: '₹5,00,000', recommended: '₹5 Lakh' },
                { year: '2022', realValue: '₹3,84,000', recommended: '₹7 Lakh' },
                { year: '2024', realValue: '₹2,95,000', recommended: '₹10 Lakh' },
                { year: '2026', realValue: '₹2,27,000', recommended: '₹15 Lakh' },
                { year: '2028', realValue: '₹1,74,000', recommended: '₹20 Lakh' },
              ].map((row, i) => (<tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}><td className="p-3 font-medium">{row.year}</td><td className="p-3 text-center text-amber-700 dark:text-amber-400">{row.realValue}</td><td className="p-3 text-center font-semibold">{row.recommended}</td></tr>))}</tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">{pt(pageText.medicalInflation.review, language)} <Link href="/health-insurance" className="text-primary hover:underline">{pt(pageText.medicalInflation.reviewLink, language)}</Link></p>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.rights.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.rights.desc, language)}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {rightsItems.map((item, i) => (
              <Card key={i} className="glass-card hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 flex items-start gap-3"><ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" /><div><h3 className="font-semibold text-sm">{item.right}</h3><p className="text-xs text-muted-foreground mt-1">{item.desc}</p></div></CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <ExpertInsight insight={pt({ en: "The GST exemption on health insurance from September 2025 is a once-in-a-decade opportunity. An 18% reduction means you can upgrade to a higher sum insured for the same premium you're paying now. Don't just pocket the savings — use them to increase your coverage. With medical inflation at 14%, a ₹5 Lakh cover that was adequate in 2020 is worth only ₹2.95 Lakh in real terms today. Upgrade to at least ₹10-15 Lakh.", hi: "सितंबर 2025 से हेल्थ इंश्योरेंस पर GST छूट एक दशक में एक बार का अवसर है। 18% कमी का मतलब है कि आप उसी प्रीमियम पर अधिक सम इंश्योर्ड अपग्रेड कर सकते हैं। बचत जेब में रखने के बजाय कवरेज बढ़ाएँ। 14% मुद्रास्फीति पर 2020 में ₹5 लाख कवर आज ₹2.95 लाख के बराबर है। कम से कम ₹10-15 लाख तक अपग्रेड करें।", hinglish: "GST exemption on health insurance from Sept 2025 is a once-in-a-decade opportunity. 18% reduction means you can upgrade to higher sum insured for same premium. Don't just pocket savings — increase your coverage. 14% inflation pe ₹5L cover jo 2020 mein adequate tha, aaj ₹2.95L worth hai. Upgrade to at least ₹10-15L." }, language)} topic={pt({ en: "Insurance Regulation Strategy", hi: "बीमा विनियमन रणनीति", hinglish: "Insurance Regulation Strategy" }, language)} />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <FAQSection faqs={faqs} title={pt({ en: "Insurance News & Regulation FAQ", hi: "बीमा समाचार और विनियमन सवाल-जवाब", hinglish: "Insurance News & Regulation FAQ" }, language)} />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <section className="text-center py-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
          <h2 className="text-2xl font-bold mb-3 gradient-text">{pt(pageText.cta.heading, language)}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{pt(pageText.cta.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"><ShinyButton variant="blue"><span>{pt(pageText.cta.ctaWhatsApp, language)}</span></ShinyButton></a>
            <Link href="/hub/claims"><ShinyButton variant="secondary"><span>{pt(pageText.cta.ctaClaims, language)}</span></ShinyButton></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
