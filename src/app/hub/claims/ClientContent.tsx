'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { healthInsurers, motorInsurers } from '@/data/insurers';
import {
  ShieldCheck, FileText, Clock, IndianRupee, ArrowRight,
  MessageCircle, ChevronRight, CheckCircle2, AlertTriangle,
  PhoneCall, Hospital, Car, ClipboardList, Scale, BookOpen,
} from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "Step-by-Step Guide", hi: "चरण-दर-चरण गाइड", hinglish: "Step-by-Step Guide" },
    title1: { en: "Insurance Claims Hub", hi: "बीमा क्लेम हब", hinglish: "Insurance Claims Hub" },
    title2: { en: "Step-by-Step Claim Guide 2025", hi: "चरण-दर-चरण क्लेम गाइड 2025", hinglish: "Step-by-Step Claim Guide 2025" },
    desc: { en: "Cashless & reimbursement claim processes, document checklists, IRDAI timelines, and your rights as a policyholder.", hi: "कैशलेस और प्रतिपूर्ति क्लेम प्रक्रियाएँ, दस्तावेज़ चेकलिस्ट, IRDAI समय-सीमा और पॉलिसीधारक के रूप में आपके अधिकार।", hinglish: "Cashless & reimbursement claim processes, document checklists, IRDAI timelines, aur policyholder ke roop mein aapke rights." },
    ctaWhatsApp: { en: "💬 Get Claim Assistance", hi: "💬 क्लेम सहायता लें", hinglish: "💬 Claim Assistance Lo" },
  },
  cashless: {
    heading: { en: "Cashless Claims — How It Works", hi: "कैशलेस क्लेम — यह कैसे काम करता है", hinglish: "Cashless Claims — Kaise Kaam Karta Hai" },
    desc: { en: "Cashless claims mean zero upfront payment at network hospitals. IRDAI mandates 1-hour approval and 3-hour discharge authorization.", hi: "कैशलेस क्लेम का मतलब नेटवर्क अस्पतालों में शून्य अग्रिम भुगतान। IRDAI 1 घंटे की मंजूरी और 3 घंटे के डिस्चार्ज प्राधिकरण का आदेश देता है।", hinglish: "Cashless claims matlab zero upfront payment at network hospitals. IRDAI mandates 1-hour approval aur 3-hour discharge authorization." },
    step1: { en: "Show Health Card", hi: "हेल्थ कार्ड दिखाएँ", hinglish: "Health Card Dikhayein" },
    step1Desc: { en: "Present your health card + ID at the network hospital reception. Hospital will verify your policy details.", hi: "नेटवर्क अस्पताल रिसेप्शन पर अपना हेल्थ कार्ड + ID दिखाएँ। अस्पताल आपकी पॉलिसी विवरण सत्यापित करेगा।", hinglish: "Network hospital reception pe apna health card + ID dikhayein. Hospital verify karega aapki policy details." },
    step2: { en: "Pre-Authorization", hi: "पूर्व-प्राधिकरण", hinglish: "Pre-Authorization" },
    step2Desc: { en: "Hospital sends pre-auth request to insurer. IRDAI mandates approval within 1 hour for emergency cases.", hi: "अस्पताल बीमाकर्ता को पूर्व-प्राधिकरण अनुरोध भेजता है। IRDAI आपातकालीन मामलों में 1 घंटे में मंजूरी का आदेश देता है।", hinglish: "Hospital insurer ko pre-auth request bhejta hai. IRDAI mandates approval within 1 hour for emergency cases." },
    step3: { en: "Get Treatment", hi: "उपचार प्राप्त करें", hinglish: "Treatment Paayein" },
    step3Desc: { en: "Receive treatment without paying upfront. Insurer settles bills directly with hospital up to your sum insured.", hi: "अग्रिम भुगतान किए बिना उपचार प्राप्त करें। बीमाकर्ता आपकी बीमित राशि तक अस्पताल के साथ सीधे बिल निपटान करता है।", hinglish: "Upfront payment kiye bina treatment paayein. Insurer settles bills directly with hospital up to sum insured." },
    step4: { en: "Discharge", hi: "डिस्चार्ज", hinglish: "Discharge" },
    step4Desc: { en: "Pay only non-covered expenses (co-pay, room rent difference, consumables). Discharge authorization within 3 hours.", hi: "केवल गैर-कवर खर्चे का भुगतान करें (कोपे, कमरा किराया अंतर, कंस्यूमेबल्स)। 3 घंटे में डिस्चार्ज प्राधिकरण।", hinglish: "Only non-covered expenses pay karein (copay, room rent difference, consumables). Discharge authorization within 3 hours." },
  },
  reimbursement: {
    heading: { en: "Reimbursement Claims — Step by Step", hi: "प्रतिपूर्ति क्लेम — चरण दर चरण", hinglish: "Reimbursement Claims — Step by Step" },
    desc: { en: "When you visit a non-network hospital, pay upfront and claim reimbursement within 15 days of discharge.", hi: "जब आप गैर-नेटवर्क अस्पताल में जाते हैं, तो अग्रिम भुगतान करें और डिस्चार्ज के 15 दिनों के भीतर प्रतिपूर्ति का दावा करें।", hinglish: "Non-network hospital mein jaane pe upfront pay karein aur discharge ke 15 dino ke andar reimbursement claim karein." },
    step1: { en: "Inform Insurer", hi: "बीमाकर्ता को सूचित करें", hinglish: "Insurer ko Inform Karein" },
    step1Desc: { en: "Call insurer helpline within 24-48 hours of hospitalization. Get claim reference number.", hi: "अस्पताल में भर्त होने के 24-48 घंटे के भीतर बीमाकर्ता हेल्पलाइन पर कॉल करें। क्लेम संदर्भ संख्या प्राप्त करें।", hinglish: "Hospitalization ke 24-48 ghanton ke andar insurer helpline pe call karein. Claim reference number paayein." },
    step2: { en: "Pay & Collect Bills", hi: "भुगतान करें और बिल जमा करें", hinglish: "Pay Karein & Bills Collect Karein" },
    step2Desc: { en: "Pay hospital bills and collect all original bills, discharge summary, and medical reports.", hi: "अस्पताल बिल का भुगतान करें और सभी मूल बिल, डिस्चार्ज सारांश और चिकित्सा रिपोर्ट जमा करें।", hinglish: "Hospital bills pay karein aur saare original bills, discharge summary, aur medical reports collect karein." },
    step3: { en: "Submit Documents", hi: "दस्तावेज़ जमा करें", hinglish: "Documents Submit Karein" },
    step3Desc: { en: "Submit claim form + original bills + discharge summary + ID proof within 15 days of discharge.", hi: "डिस्चार्ज के 15 दिनों के भीतर क्लेम फ़ॉर्म + मूल बिल + डिस्चार्ज सारांश + ID प्रमाण जमा करें।", hinglish: "Discharge ke 15 dino ke andar claim form + original bills + discharge summary + ID proof submit karein." },
    step4: { en: "Receive Payment", hi: "भुगतान प्राप्त करें", hinglish: "Payment Paayein" },
    step4Desc: { en: "Insurer processes claim in 15-30 days. Amount credited directly to your bank account via NEFT.", hi: "बीमाकर्ता 15-30 दिनों में क्लेम प्रोसेस करता है। NEFT के माध्यम से सीधे आपके बैंक खाते में राशि जमा।", hinglish: "Insurer 15-30 dino mein claim process karta hai. Amount directly bank account mein NEFT se credit." },
  },
  comparison: {
    heading: { en: "Cashless vs Reimbursement — Comparison", hi: "कैशलेस बनाम प्रतिपूर्ति — तुलना", hinglish: "Cashless vs Reimbursement — Comparison" },
    thFeature: { en: "Feature", hi: "विशेषता", hinglish: "Feature" },
    thCashless: { en: "Cashless", hi: "कैशलेस", hinglish: "Cashless" },
    thReimburse: { en: "Reimbursement", hi: "प्रतिपूर्ति", hinglish: "Reimbursement" },
  },
  documents: {
    heading: { en: "Documents Needed for Claims", hi: "क्लेम के लिए आवश्यक दस्तावेज़", hinglish: "Documents Needed for Claims" },
    healthTitle: { en: "Health Insurance Claims", hi: "हेल्थ इंश्योरेंस क्लेम", hinglish: "Health Insurance Claims" },
    motorTitle: { en: "Motor Insurance Claims", hi: "मोटर इंश्योरेंस क्लेम", hinglish: "Motor Insurance Claims" },
  },
  timeline: {
    heading: { en: "Claim Timeline — IRDAI Mandates", hi: "क्लेम समय-सीमा — IRDAI आदेश", hinglish: "Claim Timeline — IRDAI Mandates" },
    cashless: { en: "Cashless Approval", hi: "कैशलेस अनुमोदन", hinglish: "Cashless Approval" },
    cashlessDesc: { en: "IRDAI mandate for emergency cashless approval at network hospitals.", hi: "नेटवर्क अस्पतालों में आपातकालीन कैशलेस अनुमोदन के लिए IRDAI आदेश।", hinglish: "IRDAI mandate for emergency cashless approval at network hospitals." },
    discharge: { en: "Discharge Authorization", hi: "डिस्चार्ज प्राधिकरण", hinglish: "Discharge Authorization" },
    dischargeDesc: { en: "IRDAI mandate for discharge clearance after treatment completion.", hi: "उपचार पूरा होने के बाद डिस्चार्ज क्लीयरेंस के लिए IRDAI आदेश।", hinglish: "IRDAI mandate for discharge clearance after treatment completion." },
    decision: { en: "Claim Decision", hi: "क्लेम निर्णय", hinglish: "Claim Decision" },
    decisionDesc: { en: "Maximum time for insurer to accept or reject a claim from filing date.", hi: "दावा दाखिल करने की तारीख से बीमाकर्ता द्वारा स्वीकार या अस्वीकार करने का अधिकतम समय।", hinglish: "Maximum time for insurer to accept or reject a claim from filing date." },
    payment: { en: "Payment After Approval", hi: "अनुमोदन के बाद भुगतान", hinglish: "Payment After Approval" },
    paymentDesc: { en: "Insurer must settle approved claim amount within 7 days of decision.", hi: "बीमाकर्ता को निर्णय के 7 दिनों के भीतर स्वीकृत क्लेम राशि का निपटान करना चाहिए।", hinglish: "Insurer must settle approved claim amount within 7 days of decision." },
  },
  rejection: {
    heading: { en: "Top Claim Rejection Reasons — And How to Avoid Them", hi: "क्लेम अस्वीकृति के प्रमुख कारण — और उनसे कैसे बचें", hinglish: "Top Claim Rejection Reasons — Aur Kaise Bachen" },
    reason1: { en: "Non-disclosure of Pre-existing Conditions", hi: "पूर्व-मौजूदा स्थितियों का खुलासा न करना", hinglish: "Pre-existing Conditions Chhupana" },
    avoid1: { en: "Disclose ALL medical history at the time of buying. Hiding conditions leads to permanent rejection.", hi: "खरीदते समय सारा चिकित्सा इतिहास बताएँ। छिपाने पर स्थायी अस्वीकृति।", hinglish: "Khareedte waqt SAARA medical history batayein. Chhupane pe permanent rejection." },
    reason2: { en: "Claim During Waiting Period", hi: "प्रतीक्षा अवधि में क्लेम", hinglish: "Waiting Period mein Claim" },
    avoid2: { en: "Initial 30-day waiting period, 2-year specific diseases, 3-4 year PED. Wait for the period to end before claiming.", hi: "प्रारंभिक 30-दिन प्रतीक्षा अवधि, 2-वर्ष विशिष्ट बीमारियाँ, 3-4 वर्ष PED। अवधि समाप्त होने का इंतज़ार करें।", hinglish: "Initial 30-day waiting, 2-year specific diseases, 3-4 year PED. Period khatam hone ka wait karein." },
    reason3: { en: "Policy Lapse (Unpaid Premium)", hi: "पॉलिसी समाप्त (अवैतनिक प्रीमियम)", hinglish: "Policy Lapse (Unpaid Premium)" },
    avoid3: { en: "Pay premium before due date. Grace period is 15-30 days. No claim is payable during lapse.", hi: "नियत तारीख से पहले प्रीमियम भुगतान करें। अनुग्रह अवधि 15-30 दिन। लैप्स के दौरान कोई क्लेम देय नहीं।", hinglish: "Due date se pehle premium pay karein. Grace period 15-30 din. Lapse ke dauraan koi claim payable nahi." },
    reason4: { en: "Treatment Not Covered", hi: "उपचार कवर नहीं", hinglish: "Treatment Not Covered" },
    avoid4: { en: "Read policy wordings carefully. Cosmetic surgery, experimental treatments are typically excluded.", hi: "पॉलिसी शर्तें ध्यान से पढ़ें। कॉस्मेटिक सर्जरी, प्रायोगिक उपचार आमतौर पर अपवर्जित।", hinglish: "Policy wordings dhyan se padhein. Cosmetic surgery, experimental treatments typically excluded." },
    reason5: { en: "Incorrect Documentation", hi: "गलत दस्तावेज़", hinglish: "Incorrect Documentation" },
    avoid5: { en: "Submit ALL original bills, discharge summary, and medical reports. Keep copies of everything you submit.", hi: "सभी मूल बिल, डिस्चार्ज सारांश और चिकित्सा रिपोर्ट जमा करें। जो भी जमा करें उसकी प्रतियाँ रखें।", hinglish: "SAARE original bills, discharge summary, aur medical reports submit karein. Jo bhi submit karein uski copies rakhein." },
    reason6: { en: "Late Claim Filing", hi: "देर से क्लेम दाखिल करना", hinglish: "Late Claim Filing" },
    avoid6: { en: "File within 15 days of discharge (health) or 48 hours (motor). Delay beyond deadline can lead to rejection.", hi: "डिस्चार्ज के 15 दिन (स्वास्थ्य) या 48 घंटे (मोटर) में दावा दाखिल करें। समय सीमा के बाद अस्वीकृति हो सकती है।", hinglish: "Discharge ke 15 din (health) ya 48 ghante (motor) mein claim file karein. Deadline ke baad rejection ho sakti hai." },
  },
  insurerGuides: {
    heading: { en: "Insurer-specific Claim Guides", hi: "बीमाकर्ता-विशिष्ट क्लेम गाइड", hinglish: "Insurer-specific Claim Guides" },
    desc: { en: "Detailed claim process for each insurer. Click to view step-by-step guide.", hi: "प्रत्येक बीमाकर्ता के लिए विस्तृत क्लेम प्रक्रिया। चरण-दर-चरण गाइड देखने के लिए क्लिक करें।", hinglish: "Each insurer ke liye detailed claim process. Step-by-step guide dekhne ke liye click karein." },
    viewGuide: { en: "View Claim Guide →", hi: "क्लेम गाइड देखें →", hinglish: "View Claim Guide →" },
  },
  rights: {
    heading: { en: "Your Rights as a Policyholder (IRDAI)", hi: "पॉलिसीधारक के रूप में आपके अधिकार (IRDAI)", hinglish: "Your Rights as a Policyholder (IRDAI)" },
    fullGuide: { en: "Full Policyholder Rights Guide →", hi: "पूर्ण पॉलिसीधारक अधिकार गाइड →", hinglish: "Full Policyholder Rights Guide →" },
  },
  cta: {
    heading: { en: "Need Help with Your Claim?", hi: "अपने क्लेम में मदद चाहिए?", hinglish: "Claim Mein Madad Chahiye?" },
    desc: { en: "Get free claim assistance from IRDAI-certified advisor Himanshu Paliwal (POSP Code: IP429834). We help with documentation, follow-up, and grievance redressal.", hi: "IRDAI-प्रमाणित सलाहकार हिमांशु पालीवाल से मुफ़्त क्लेम सहायता। हम दस्तावेज़, अनुवर्ती और शिकायत निवारण में मदद करते हैं।", hinglish: "IRDAI-certified advisor Himanshu Paliwal se free claim assistance. Documentation, follow-up, aur grievance redressal mein madad." },
    ctaWhatsApp: { en: "💬 Claim Help on WhatsApp", hi: "💬 WhatsApp पर क्लेम सहायता", hinglish: "💬 WhatsApp pe Claim Help" },
    ctaGuide: { en: "Full Claim Guide →", hi: "पूर्ण क्लेम गाइड →", hinglish: "Full Claim Guide →" },
  },
};

const faqs = [
  { question: 'How long does a cashless insurance claim take?', answer: 'IRDAI mandates 1-hour approval for cashless requests and 3-hour discharge authorization at network hospitals. Most top insurers approve cashless claims within 1-2 hours.' },
  { question: 'What is the difference between cashless and reimbursement claims?', answer: 'In cashless claims, the insurer pays the hospital directly — you pay nothing upfront. In reimbursement, you pay the hospital first, then submit bills for refund within 15-30 days.' },
  { question: 'What documents are needed for a health insurance claim?', answer: 'Cashless: Health card + ID proof at network hospital. Reimbursement: Policy copy, ID proof, original hospital bills, discharge summary, medical reports, pharmacy bills, NEFT/bank details.' },
  { question: 'Can an insurance claim be rejected?', answer: 'Yes, top 5 rejection reasons: (1) Non-disclosure of pre-existing conditions, (2) Claim during waiting period, (3) Policy lapse, (4) Treatment not covered, (5) Incorrect documentation.' },
  { question: 'What is IRDAI Bima Bharosa portal?', answer: 'Bima Bharosa (formerly IGMS) is IRDAI\'s online grievance redressal portal where you can file complaints against insurers. The insurer must respond within 15 days.' },
  { question: 'What are my rights as a policyholder during claims?', answer: 'IRDAI guarantees: (1) Right to fair claim assessment, (2) 30-day maximum for claim decision, (3) Interest on delayed payments, (4) Right to appeal rejection, (5) Free-look period of 15-30 days.' },
  { question: 'How to file a motor insurance claim after an accident?', answer: 'Step 1: Call insurer helpline within 48 hours. Step 2: File FIR if third-party injury is involved. Step 3: Do not repair before surveyor inspection. Step 4: Take photos. Step 5: Submit documents. Step 6: Insurer settles directly with garage (cashless) or reimburses you.' },
];

const requiredDocumentsHealth = [
  pt({ en: "Policy copy / Health card", hi: "पॉलिसी कॉपी / हेल्थ कार्ड", hinglish: "Policy copy / Health card" }, 'en'),
  pt({ en: "Government ID proof (Aadhaar/PAN)", hi: "सरकारी ID प्रमाण (आधार/PAN)", hinglish: "Government ID proof (Aadhaar/PAN)" }, 'en'),
  pt({ en: "Original hospital bills (itemized)", hi: "मूल अस्पताल बिल (विस्तृत)", hinglish: "Original hospital bills (itemized)" }, 'en'),
  pt({ en: "Discharge summary", hi: "डिस्चार्ज सारांश", hinglish: "Discharge summary" }, 'en'),
  pt({ en: "Medical reports & prescriptions", hi: "चिकित्सा रिपोर्ट और पर्चे", hinglish: "Medical reports & prescriptions" }, 'en'),
  pt({ en: "Pharmacy bills with prescriptions", hi: "दवा बिल पर्चे के साथ", hinglish: "Pharmacy bills with prescriptions" }, 'en'),
  pt({ en: "Pre-authorization form (cashless)", hi: "पूर्व-प्राधिकरण फ़ॉर्म (कैशलेस)", hinglish: "Pre-authorization form (cashless)" }, 'en'),
  pt({ en: "NEFT/bank details for reimbursement", hi: "प्रतिपूर्ति के लिए NEFT/बैंक विवरण", hinglish: "NEFT/bank details for reimbursement" }, 'en'),
  pt({ en: "Claim form (duly filled & signed)", hi: "क्लेम फ़ॉर्म (भरा और हस्ताक्षरित)", hinglish: "Claim form (duly filled & signed)" }, 'en'),
];

const requiredDocumentsMotor = [
  pt({ en: "Policy copy", hi: "पॉलिसी कॉपी", hinglish: "Policy copy" }, 'en'),
  pt({ en: "FIR copy (if third-party involved)", hi: "FIR कॉपी (यदि तीसरे पक्ष शामिल)", hinglish: "FIR copy (if third-party involved)" }, 'en'),
  pt({ en: "Driving license copy", hi: "ड्राइविंग लाइसेंस कॉपी", hinglish: "Driving license copy" }, 'en'),
  pt({ en: "Registration Certificate (RC) copy", hi: "पंजीकरण प्रमाणपत्र (RC) कॉपी", hinglish: "Registration Certificate (RC) copy" }, 'en'),
  pt({ en: "Survey report from insurer", hi: "बीमाकर्ता से सर्वेक्षण रिपोर्ट", hinglish: "Survey report from insurer" }, 'en'),
  pt({ en: "Repair estimate from garage", hi: "गैराज से मरम्मत अनुमान", hinglish: "Repair estimate from garage" }, 'en'),
  pt({ en: "Original repair bills & payment receipt", hi: "मूल मरम्मत बिल और भुगतान रसीद", hinglish: "Original repair bills & payment receipt" }, 'en'),
  pt({ en: "Claim form (duly filled & signed)", hi: "क्लेम फ़ॉर्म (भरा और हस्ताक्षरित)", hinglish: "Claim form (duly filled & signed)" }, 'en'),
  pt({ en: "Bank details for reimbursement", hi: "प्रतिपूर्ति के लिए बैंक विवरण", hinglish: "Bank details for reimbursement" }, 'en'),
];

export default function ClientContent() {
  const { language } = useLanguage();
  const allInsurers = [...healthInsurers, ...motorInsurers];

  const rightsItems = [
    { right: pt({ en: "Right to Fair Claim Assessment", hi: "निष्पक्ष क्लेम मूल्यांकन का अधिकार", hinglish: "Right to Fair Claim Assessment" }, language), desc: pt({ en: "Insurers must assess claims fairly and communicate decision within 30 days. No arbitrary rejection.", hi: "बीमाकर्ताओं को क्लेम का निष्पक्ष मूल्यांकन करना चाहिए और 30 दिनों में निर्णय सूचित करना चाहिए।", hinglish: "Insurers must assess claims fairly aur 30 dino mein decision communicate karna chahiye." }, language) },
    { right: pt({ en: "Right to Interest on Delayed Payment", hi: "विलंबित भुगतान पर ब्याज का अधिकार", hinglish: "Right to Interest on Delayed Payment" }, language), desc: pt({ en: "If insurer delays payment beyond 30 days, they must pay interest at bank rate + 2%.", hi: "यदि बीमाकर्ता 30 दिनों से अधिक भुगतान में देरी करता है, तो बैंक दर + 2% पर ब्याज चुकाना चाहिए।", hinglish: "If insurer delays payment beyond 30 days, bank rate + 2% interest pay karna chahiye." }, language) },
    { right: pt({ en: "Right to Appeal Rejection", hi: "अस्वीकृति की अपील का अधिकार", hinglish: "Right to Appeal Rejection" }, language), desc: pt({ en: "You can appeal through: (1) Insurer grievance cell, (2) IRDAI Bima Bharosa, (3) Insurance Ombudsman.", hi: "आप अपील कर सकते हैं: (1) बीमाकर्ता शिकायत कक्ष, (2) IRDAI बीमा भरोसा, (3) बीमा लोकपाल।", hinglish: "Appeal kar sakte hain: (1) Insurer grievance cell, (2) IRDAI Bima Bharosa, (3) Insurance Ombudsman." }, language) },
    { right: pt({ en: "Right to Free-Look Period", hi: "मुफ़्त देखें अवधि का अधिकार", hinglish: "Right to Free-Look Period" }, language), desc: pt({ en: "15-30 days to return a new policy if you're not satisfied. Full refund minus medical test costs.", hi: "संतुष्ट न होने पर नई पॉलिसी वापस करने के 15-30 दिन। चिकित्सा परीक्षण लागत माइनस पूर्ण वापसी।", hinglish: "15-30 din nayi policy return karne ke liye. Full refund minus medical test costs." }, language) },
    { right: pt({ en: "Right to Lifelong Renewability", hi: "आजीवन नवीनीकरणीयता का अधिकार", hinglish: "Right to Lifelong Renewability" }, language), desc: pt({ en: "Insurers cannot refuse policy renewal based on age, claims history, or health condition.", hi: "बीमाकर्ता आयु, क्लेम इतिहास या स्वास्थ्य स्थिति के आधार पर नवीनीकरण से इंकार नहीं कर सकते।", hinglish: "Insurers age, claims history, ya health condition ke basis pe renewal refuse nahi kar sakte." }, language) },
    { right: pt({ en: "Right to Portability", hi: "पोर्टेबिलिटी का अधिकार", hinglish: "Right to Portability" }, language), desc: pt({ en: "Switch insurers without losing waiting period credit. Apply for portability 45 days before renewal date.", hi: "प्रतीक्षा अवधि क्रेडिट खोए बिना बीमाकर्ता बदलें। नवीनीकरण तिथि से 45 दिन पहले पोर्टेबिलिटी के लिए आवेदन करें।", hinglish: "Waiting period credit khoye bina insurer switch karein. Renewal date se 45 din pehle portability apply karein." }, language) },
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
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><ShieldCheck className="h-3.5 w-3.5 mr-1" />{pt(pageText.hero.badge, language)}</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{pt(pageText.hero.title1, language)}{' '}<span className="gradient-text">{pt(pageText.hero.title2, language)}</span></h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(pageText.hero.desc, language)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: Clock, label: pt({ en: "Cashless Approval", hi: "कैशलेस अनुमोदन", hinglish: "Cashless Approval" }, language), value: '1-2 Hours' },
                { icon: IndianRupee, label: pt({ en: "Reimbursement", hi: "प्रतिपूर्ति", hinglish: "Reimbursement" }, language), value: '15-30 Days' },
                { icon: CheckCircle2, label: pt({ en: "Avg CSR (Top 6)", hi: "औसत CSR (टॉप 6)", hinglish: "Avg CSR (Top 6)" }, language), value: '89%' },
                { icon: ShieldCheck, label: pt({ en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" }, language), value: 'POSP IP429834' },
              ].map((stat, i) => (<Card key={i} className="glass-card bg-background/80"><CardContent className="p-3 text-center"><stat.icon className="h-5 w-5 text-primary mx-auto mb-1" /><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-sm font-bold">{stat.value}</p></CardContent></Card>))}
            </div>
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"><ShinyButton variant="blue"><span>{pt(pageText.hero.ctaWhatsApp, language)}</span></ShinyButton></a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Cashless Claims */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Hospital className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.cashless.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.cashless.desc, language)}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: pt(pageText.cashless.step1, language), desc: pt(pageText.cashless.step1Desc, language), icon: FileText },
              { step: 2, title: pt(pageText.cashless.step2, language), desc: pt(pageText.cashless.step2Desc, language), icon: Clock },
              { step: 3, title: pt(pageText.cashless.step3, language), desc: pt(pageText.cashless.step3Desc, language), icon: Hospital },
              { step: 4, title: pt(pageText.cashless.step4, language), desc: pt(pageText.cashless.step4Desc, language), icon: CheckCircle2 },
            ].map(s => (<Card key={s.step} className="glass-card hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{s.step}</div><s.icon className="h-5 w-5 text-primary" /></div><h3 className="font-semibold text-sm mb-1">{s.title}</h3><p className="text-xs text-muted-foreground">{s.desc}</p></CardContent></Card>))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Reimbursement Claims */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><IndianRupee className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.reimbursement.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.reimbursement.desc, language)}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: pt(pageText.reimbursement.step1, language), desc: pt(pageText.reimbursement.step1Desc, language), icon: PhoneCall },
              { step: 2, title: pt(pageText.reimbursement.step2, language), desc: pt(pageText.reimbursement.step2Desc, language), icon: IndianRupee },
              { step: 3, title: pt(pageText.reimbursement.step3, language), desc: pt(pageText.reimbursement.step3Desc, language), icon: ClipboardList },
              { step: 4, title: pt(pageText.reimbursement.step4, language), desc: pt(pageText.reimbursement.step4Desc, language), icon: CheckCircle2 },
            ].map(s => (<Card key={s.step} className="glass-card hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{s.step}</div><s.icon className="h-5 w-5 text-primary" /></div><h3 className="font-semibold text-sm mb-1">{s.title}</h3><p className="text-xs text-muted-foreground">{s.desc}</p></CardContent></Card>))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Cashless vs Reimbursement Comparison */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Scale className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.comparison.heading, language)}</span></h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-3 font-semibold">{pt(pageText.comparison.thFeature, language)}</th><th className="text-center p-3 font-semibold">{pt(pageText.comparison.thCashless, language)}</th><th className="text-center p-3 font-semibold">{pt(pageText.comparison.thReimburse, language)}</th></tr></thead>
              <tbody>{[
                { feature: pt({ en: "Upfront Payment", hi: "अग्रिम भुगतान", hinglish: "Upfront Payment" }, language), cashless: pt({ en: "None (insurer pays)", hi: "कोई नहीं (बीमाकर्ता भुगतान)", hinglish: "None (insurer pays)" }, language), reimburse: pt({ en: "You pay first", hi: "आप पहले भुगतान करते हैं", hinglish: "You pay first" }, language) },
                { feature: pt({ en: "Hospital Type", hi: "अस्पताल प्रकार", hinglish: "Hospital Type" }, language), cashless: pt({ en: "Network hospitals only", hi: "केवल नेटवर्क अस्पताल", hinglish: "Network hospitals only" }, language), reimburse: pt({ en: "Any hospital", hi: "कोई भी अस्पताल", hinglish: "Any hospital" }, language) },
                { feature: pt({ en: "Approval Time", hi: "अनुमोदन समय", hinglish: "Approval Time" }, language), cashless: pt({ en: "1-2 hours (IRDAI)", hi: "1-2 घंटे (IRDAI)", hinglish: "1-2 hours (IRDAI)" }, language), reimburse: pt({ en: "15-30 days", hi: "15-30 दिन", hinglish: "15-30 days" }, language) },
                { feature: pt({ en: "Documentation", hi: "दस्तावेज़", hinglish: "Documentation" }, language), cashless: pt({ en: "Minimal (health card + ID)", hi: "न्यूनतम (हेल्थ कार्ड + ID)", hinglish: "Minimal (health card + ID)" }, language), reimburse: pt({ en: "Full bills & reports", hi: "पूर्ण बिल और रिपोर्ट", hinglish: "Full bills & reports" }, language) },
                { feature: pt({ en: "Stress Level", hi: "तनाव स्तर", hinglish: "Stress Level" }, language), cashless: pt({ en: "Low", hi: "कम", hinglish: "Low" }, language), reimburse: pt({ en: "Higher (manage bills)", hi: "अधिक (बिल प्रबंधन)", hinglish: "Higher (manage bills)" }, language) },
                { feature: pt({ en: "Claim Rejection Risk", hi: "क्लेम अस्वीकृति जोखिम", hinglish: "Claim Rejection Risk" }, language), cashless: pt({ en: "Lower (pre-approved)", hi: "कम (पूर्व-अनुमोदित)", hinglish: "Lower (pre-approved)" }, language), reimburse: pt({ en: "Higher (post-hoc review)", hi: "अधिक (बाद में समीक्षा)", hinglish: "Higher (post-hoc review)" }, language) },
              ].map((row, i) => (<tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}><td className="p-3 font-medium">{row.feature}</td><td className="p-3 text-center text-emerald-700 dark:text-emerald-400">{row.cashless}</td><td className="p-3 text-center text-amber-700 dark:text-amber-400">{row.reimburse}</td></tr>))}</tbody>
            </table>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Documents Needed */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ClipboardList className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.documents.heading, language)}</span></h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="glass-card"><CardHeader className="pb-3"><div className="flex items-center gap-2"><Hospital className="h-5 w-5 text-primary" /><h3 className="font-semibold">{pt(pageText.documents.healthTitle, language)}</h3></div></CardHeader><CardContent><ul className="space-y-2">{requiredDocumentsHealth.map((doc, i) => (<li key={i} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /><span>{doc}</span></li>))}</ul></CardContent></Card>
            <Card className="glass-card"><CardHeader className="pb-3"><div className="flex items-center gap-2"><Car className="h-5 w-5 text-primary" /><h3 className="font-semibold">{pt(pageText.documents.motorTitle, language)}</h3></div></CardHeader><CardContent><ul className="space-y-2">{requiredDocumentsMotor.map((doc, i) => (<li key={i} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /><span>{doc}</span></li>))}</ul></CardContent></Card>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Claim Timeline */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Clock className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.timeline.heading, language)}</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: pt(pageText.timeline.cashless, language), time: '1 Hour', desc: pt(pageText.timeline.cashlessDesc, language), color: 'text-emerald-600' },
              { title: pt(pageText.timeline.discharge, language), time: '3 Hours', desc: pt(pageText.timeline.dischargeDesc, language), color: 'text-blue-600' },
              { title: pt(pageText.timeline.decision, language), time: '30 Days', desc: pt(pageText.timeline.decisionDesc, language), color: 'text-amber-600' },
              { title: pt(pageText.timeline.payment, language), time: '7 Days', desc: pt(pageText.timeline.paymentDesc, language), color: 'text-primary' },
            ].map((item, i) => (<Card key={i} className="glass-card hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300"><CardContent className="p-4 text-center"><p className={`text-3xl font-bold ${item.color}`}>{item.time}</p><h3 className="font-semibold text-sm mt-2">{item.title}</h3><p className="text-xs text-muted-foreground mt-1">{item.desc}</p></CardContent></Card>))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Top Claim Rejection Reasons */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-amber-600" /><span className="gradient-text">{pt(pageText.rejection.heading, language)}</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { reason: pt(pageText.rejection.reason1, language), avoid: pt(pageText.rejection.avoid1, language) },
              { reason: pt(pageText.rejection.reason2, language), avoid: pt(pageText.rejection.avoid2, language) },
              { reason: pt(pageText.rejection.reason3, language), avoid: pt(pageText.rejection.avoid3, language) },
              { reason: pt(pageText.rejection.reason4, language), avoid: pt(pageText.rejection.avoid4, language) },
              { reason: pt(pageText.rejection.reason5, language), avoid: pt(pageText.rejection.avoid5, language) },
              { reason: pt(pageText.rejection.reason6, language), avoid: pt(pageText.rejection.avoid6, language) },
            ].map((item, i) => (
              <Card key={i} className="glass-card border-amber-200 dark:border-amber-900/50 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" /><h3 className="font-semibold text-sm">{item.reason}</h3></div>
                  <p className="text-xs text-muted-foreground pl-6">{item.avoid}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Insurer Claim Guides */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.insurerGuides.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.insurerGuides.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allInsurers.map(insurer => (
              <Link key={insurer.slug} href={`/claim-guide/${insurer.slug}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-semibold">{insurer.name || insurer.slug}</p>
                    <p className="text-xs text-muted-foreground mt-1">CSR: {insurer.csr}%</p>
                    <Badge variant="secondary" className="mt-1.5 text-[10px]">{pt(pageText.insurerGuides.viewGuide, language)}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* IRDAI Rights */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.rights.heading, language)}</span></h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {rightsItems.map((item, i) => (
              <Card key={i} className="glass-card hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 flex items-start gap-3"><ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" /><div><h3 className="font-semibold text-sm">{item.right}</h3><p className="text-xs text-muted-foreground mt-1">{item.desc}</p></div></CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4"><Link href="/policyholder-rights"><ShinyButton variant="secondary"><span>{pt(pageText.rights.fullGuide, language)}</span></ShinyButton></Link></div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <ExpertInsight insight={pt({ en: "Always file claims within 24-48 hours of hospitalization or accident. Late filing is the #1 avoidable reason for claim rejection. Keep digital copies of all documents before submitting originals. If your cashless request is denied, don't panic — switch to reimbursement mode and file within 15 days. You have the right to appeal any rejection.", hi: "हमेशा अस्पताल में भर्त होने या दुर्घटना के 24-48 घंटे के भीतर क्लेम दाखिल करें। देर से दाखिल करना क्लेम अस्वीकृति का सबसे बड़ा कारण है। मूल दस्तावेज़ जमा करने से पहले सभी की डिजिटल प्रतियाँ रखें। कैशलेस अनुरोध अस्वीकृत होने पर घबराएँ नहीं — प्रतिपूर्ति मोड में स्विच करें और 15 दिनों में दाखिल करें।", hinglish: "Always file claims within 24-48 hours. Late filing is the #1 avoidable rejection reason. Digital copies rakhein before submitting originals. Cashless denied? Reimbursement mode switch karein aur 15 dino mein file karein. You have the right to appeal any rejection." }, language)} topic={pt({ en: "Insurance Claim Strategy", hi: "बीमा क्लेम रणनीति", hinglish: "Insurance Claim Strategy" }, language)} />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <FAQSection faqs={faqs} title={pt({ en: "Insurance Claims FAQ — Most Asked Questions", hi: "बीमा क्लेम सवाल-जवाब — सबसे अधिक पूछे जाने वाले", hinglish: "Insurance Claims FAQ — Most Asked Questions" }, language)} />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <section className="text-center py-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
          <h2 className="text-2xl font-bold mb-3 gradient-text">{pt(pageText.cta.heading, language)}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{pt(pageText.cta.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"><ShinyButton variant="blue"><span>{pt(pageText.cta.ctaWhatsApp, language)}</span></ShinyButton></a>
            <Link href="/claim-guide"><ShinyButton variant="secondary"><span>{pt(pageText.cta.ctaGuide, language)}</span></ShinyButton></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
