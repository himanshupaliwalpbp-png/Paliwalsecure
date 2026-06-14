'use client';

import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import Link from 'next/link';

// ── Translation helper ──────────────────────────────────────────────────────
type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

// ── Inline page translations ────────────────────────────────────────────────
const pageText = {
  hero: {
    badge: { en: "IRDAI Timelines Included", hi: "IRDAI समयसीमा शामिल", hinglish: "IRDAI Timelines Included" },
    title1: { en: "Cashless Claim Guide –", hi: "कैशलेस क्लेम गाइड –", hinglish: "Cashless Claim Guide –" },
    titleHighlight: { en: "Process, Network Hospitals & IRDAI Timelines", hi: "प्रक्रिया, नेटवर्क अस्पताल और IRDAI समयसीमा", hinglish: "Process, Network Hospitals & IRDAI Timelines" },
    desc: {
      en: "Everything you need to know about cashless health insurance claims in India. Step-by-step process, IRDAI-mandated timelines, major hospital chains, and how to avoid claim rejections.",
      hi: "भारत में कैशलेस हेल्थ इंश्योरेंस क्लेम के बारे में सब कुछ। चरण-दर-चरण प्रक्रिया, IRDAI-अनिवार्य समयसीमा, प्रमुख अस्पताल श्रृंखला, और क्लेम अस्वीकृति से कैसे बचें।",
      hinglish: "India mein cashless health insurance claims ke baare mein sab kuch. Step-by-step process, IRDAI-mandated timelines, major hospital chains, aur claim rejections se kaise bacha jaaye."
    },
    ctaHelp: { en: "Get Claim Assistance", hi: "क्लेम सहायता प्राप्त करें", hinglish: "Claim Assistance Lo" },
    ctaGuide: { en: "Full Claim Guide →", hi: "पूर्ण क्लेम गाइड →", hinglish: "Full Claim Guide →" },
  },
  whatIs: {
    heading: { en: "What is a", hi: "क्या है", hinglish: "Kya Hai" },
    headingHighlight: { en: "Cashless Claim?", hi: "कैशलेस क्लेम?", hinglish: "Cashless Claim?" },
    desc1: {
      en: "A cashless claim is a facility where the insurer directly settles the hospital bill — you don't need to pay the treatment cost upfront (except for non-covered expenses). This works only at network hospitals that have a cashless tie-up with your insurer.",
      hi: "कैशलेस क्लेम एक सुविधा है जहाँ बीमाकर्ता सीधे अस्पताल बिल चुकाता है — आपको इलाज की लागत अग्रिम भुगतान नहीं करनी पड़ती (गैर-कवर खर्चों को छोड़कर)। यह केवल नेटवर्क अस्पतालों में काम करता है।",
      hinglish: "Cashless claim ek facility hai jahan insurer directly hospital bill chukata hai — aapko treatment cost upfront pay nahi karni padti (non-covered expenses ko chodke). Yeh sirf network hospitals mein kaam karta hai."
    },
    desc2: { en: "In India, there are two types of health insurance claims:", hi: "भारत में हेल्थ इंश्योरेंस क्लेम के दो प्रकार हैं:", hinglish: "India mein health insurance claims ke do prakar hain:" },
    cashlessTitle: { en: "Cashless Claim", hi: "कैशलेस क्लेम", hinglish: "Cashless Claim" },
    cashlessPoints: [
      { en: "Insurer pays hospital directly", hi: "बीमाकर्ता सीधे अस्पताल को भुगतान करता है", hinglish: "Insurer directly hospital ko pay karta hai" },
      { en: "No upfront payment needed", hi: "अग्रिम भुगतान ज़रूरी नहीं", hinglish: "Upfront payment zaroori nahi" },
      { en: "Only at network hospitals", hi: "केवल नेटवर्क अस्पतालों में", hinglish: "Sirf network hospitals mein" },
      { en: "Faster processing (1-3 hrs)", hi: "तेज़ प्रोसेसिंग (1-3 घंटे)", hinglish: "Faster processing (1-3 hrs)" },
      { en: "No financial stress during emergency", hi: "आपातकाल में वित्तीय तनाव नहीं", hinglish: "Emergency mein financial stress nahi" },
    ],
    reimbTitle: { en: "Reimbursement Claim", hi: "प्रतिपूर्ति क्लेम", hinglish: "Reimbursement Claim" },
    reimbPoints: [
      { en: "You pay hospital first, insurer reimburses", hi: "आप पहले अस्पताल को भुगतान करते हैं, बीमाकर्ता प्रतिपूर्ति करता है", hinglish: "Aap pehle hospital ko pay karte hain, insurer reimburse karta hai" },
      { en: "Large upfront payment required", hi: "बड़ा अग्रिम भुगतान ज़रूरी", hinglish: "Bada upfront payment zaroori" },
      { en: "Works at any hospital", hi: "किसी भी अस्पताल में काम करता है", hinglish: "Kisi bhi hospital mein kaam karta hai" },
      { en: "Processing takes 15-30 days", hi: "प्रोसेसिंग 15-30 दिन लेती है", hinglish: "Processing 15-30 din leti hai" },
      { en: "Financial burden during emergencies", hi: "आपातकाल में वित्तीय बोझ", hinglish: "Emergency mein financial burden" },
    ],
  },
  steps: {
    heading: { en: "Cashless Claim Process –", hi: "कैशलेस क्लेम प्रक्रिया –", hinglish: "Cashless Claim Process –" },
    headingHighlight: { en: "Step by Step", hi: "चरण दर चरण", hinglish: "Step by Step" },
  },
  irdai: {
    heading: { en: "IRDAI Mandated", hi: "IRDAI अनिवार्य", hinglish: "IRDAI Mandated" },
    headingHighlight: { en: "Timelines", hi: "समयसीमा", hinglish: "Timelines" },
    headingSuffix: { en: "for Cashless Claims", hi: "कैशलेस क्लेम के लिए", hinglish: "for Cashless Claims" },
    desc: {
      en: "IRDAI has mandated strict timelines that insurers must follow for cashless claims. If your insurer violates these timelines, you can file a complaint with IRDAI's IGMS portal.",
      hi: "IRDAI ने सख्त समयसीमा अनिवार्य की है जो बीमाकर्ताओं को कैशलेस क्लेम के लिए फ़ॉलो करनी चाहिए। यदि बीमाकर्ता इन समयसीमाओं का उल्लंघन करता है, तो IRDAI IGMS पोर्टल पर शिकायत करें।",
      hinglish: "IRDAI ne strict timelines mandate ki hain jo insurers ko cashless claims ke liye follow karni chahiye. Agar insurer in timelines ka violation karta hai, toh IRDAI IGMS portal pe complaint karein."
    },
    thAction: { en: "Action", hi: "कार्रवाई", hinglish: "Action" },
    thTimeline: { en: "IRDAI Timeline", hi: "IRDAI समयसीमा", hinglish: "IRDAI Timeline" },
    thRegulation: { en: "Regulation", hi: "नियम", hinglish: "Regulation" },
    delayHeading: { en: "What to Do If Timelines Are Not Met:", hi: "यदि समयसीमा पूरी नहीं होती तो क्या करें:", hinglish: "Agar Timelines Meet Nahi Hoti Toh Kya Karein:" },
    delaySteps: [
      { en: "Contact your insurer's grievance cell with the pre-auth reference number and timestamp", hi: "प्री-ऑथ संदर्भ संख्या और टाइमस्टैम्प के साथ बीमाकर्ता की शिकायत सेल से संपर्क करें", hinglish: "Pre-auth reference number aur timestamp ke saath insurer ki grievance cell se contact karein" },
      { en: "File a complaint on IRDAI IGMS portal (igms.irda.gov.in) — turnaround: 15 days", hi: "IRDAI IGMS पोर्टल पर शिकायत दर्ज करें — समय: 15 दिन", hinglish: "IRDAI IGMS portal pe complaint darj karein — turnaround: 15 din" },
      { en: "Escalate to Insurance Ombudsman if IGMS resolution is unsatisfactory", hi: "यदि IGMS समाधान असंतोषजनक हो तो बीमा लोकपाल से एस्केलेट करें", hinglish: "Agar IGMS resolution unsatisfactory ho toh Insurance Ombudsman se escalate karein" },
    ],
  },
  hospitals: {
    heading: { en: "Major Hospital Chains –", hi: "प्रमुख अस्पताल श्रृंखला –", hinglish: "Major Hospital Chains –" },
    headingHighlight: { en: "Cashless Network", hi: "कैशलेस नेटवर्क", hinglish: "Cashless Network" },
    desc: {
      en: "India's top hospital chains are empanelled with all major insurance companies for cashless treatment.",
      hi: "भारत की शीर्ष अस्पताल श्रृंखलाएँ सभी प्रमुख बीमा कंपनियों के साथ कैशलेस उपचार के लिए एम्पैनल्ड हैं।",
      hinglish: "India ki top hospital chains sabhi major insurance companies ke saath cashless treatment ke liye empanelled hain."
    },
    specialties: { en: "Specialties:", hi: "विशेषताएँ:", hinglish: "Specialties:" },
    locations: { en: "Locations:", hi: "स्थान:", hinglish: "Locations:" },
    footnote: { en: "All the above hospital chains are covered by Star Health, HDFC ERGO, ICICI Lombard, Care Health, Niva Bupa, and all other major insurers for cashless treatment.", hi: "उपरोक्त सभी अस्पताल श्रृंखलाएँ Star Health, HDFC ERGO, ICICI Lombard, Care Health, Niva Bupa और अन्य सभी प्रमुख बीमाकर्ताओं द्वारा कैशलेस उपचार के लिए कवर की गई हैं।", hinglish: "Sabhi uparokt hospital chains Star Health, HDFC ERGO, ICICI Lombard, Care Health, Niva Bupa aur sabhi major insurers dwara cashless treatment ke liye covered hain." },
  },
  rejections: {
    heading: { en: "Common Reasons for", hi: "कैशलेस क्लेम अस्वीकृति की सामान्य वजहें", hinglish: "Common Reasons for" },
    headingHighlight: { en: "Cashless Claim Rejection", hi: "", hinglish: "Cashless Claim Rejection" },
    desc: {
      en: "Understanding why cashless claims get rejected helps you avoid these pitfalls. Here are the top 6 reasons and how to prevent each one:",
      hi: "समझना कि कैशलेस क्लेम अस्वीकृत क्यों होते हैं, इन नुकसानों से बचने में मदद करता है। यहाँ 6 प्रमुख कारण और प्रत्येक को कैसे रोकें:",
      hinglish: "Samjhna ki cashless claims reject kyun hote hain, in pitfalls se bachne mein madad karta hai. Yahan 6 main reasons aur har ek ko kaise rokein:"
    },
    solutionLabel: { en: "Solution:", hi: "समाधान:", hinglish: "Solution:" },
  },
  related: {
    heading: { en: "Related", hi: "संबंधित", hinglish: "Related" },
    headingHighlight: { en: "Guides", hi: "गाइड", hinglish: "Guides" },
    claimTitle: { en: "Complete Claim Guide →", hi: "पूर्ण क्लेम गाइड →", hinglish: "Complete Claim Guide →" },
    claimDesc: { en: "Step-by-step guide to both cashless and reimbursement claims, documents needed, timelines, and how to appeal a rejected claim.", hi: "कैशलेस और प्रतिपूर्ति दोनों क्लेम के लिए चरण-दर-चरण गाइड, आवश्यक दस्तावेज़, समयसीमा, और अस्वीकृत क्लेम की अपील कैसे करें।", hinglish: "Cashless aur reimbursement dono claims ke liye step-by-step guide, zaroori documents, timelines, aur rejected claim ki appeal kaise karein." },
  },
  faq: {
    heading: { en: "Cashless Claim", hi: "कैशलेस क्लेम", hinglish: "Cashless Claim" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: { en: "Frequently asked questions about cashless health insurance claims in India.", hi: "भारत में कैशलेस हेल्थ इंश्योरेंस क्लेम के बारे में अक्सर पूछे जाने वाले सवाल।", hinglish: "India mein cashless health insurance claims ke baare mein often pooche jaane wale sawaal." },
  },
  cta: {
    heading1: { en: "Need Help with a", hi: "मदद चाहिए", hinglish: "Madad Chahiye" },
    headingHighlight: { en: "Cashless Claim?", hi: "कैशलेस क्लेम में?", hinglish: "Cashless Claim Mein?" },
    desc: {
      en: "Chat with Himanshu Paliwal on WhatsApp — IRDAI Certified Insurance Advisor. Get step-by-step guidance for cashless claims, hospital network verification, and claim escalation support. No charge, no spam.",
      hi: "हिमांशु पालीवाल से WhatsApp पर चैट करें — IRDAI प्रमाणित बीमा सलाहकार। कैशलेस क्लेम, अस्पताल नेटवर्क सत्यापन और क्लेम एस्कलेशन समर्थन के लिए चरण-दर-चरण मार्गदर्शन।",
      hinglish: "Himanshu Paliwal se WhatsApp pe chat karein — IRDAI Certified Insurance Advisor. Cashless claims, hospital network verification aur claim escalation support ke liye step-by-step guidance. No charge, no spam."
    },
    ctaWhatsApp: { en: "Chat on WhatsApp Now", hi: "अभी WhatsApp पर चैट करें", hinglish: "Abhi WhatsApp pe Chat Karein" },
  },
};

// ── Step data with i18n ──────────────────────────────────────────────────────
const cashlessProcessSteps = [
  {
    title: { en: "Visit a Network Hospital", hi: "नेटवर्क अस्पताल में जाएँ", hinglish: "Network Hospital Mein Jaayein" },
    description: { en: "Cashless claims work only at hospitals that have a tie-up with your insurance company. Before admission, verify the hospital is in your insurer's network. PaliwalSecure's partnered plans cover 10,000+ network hospitals across India.", hi: "कैशलेस क्लेम केवल उन अस्पतालों में काम करते हैं जिनका आपकी बीमा कंपनी के साथ समझौता है। प्रवेश से पहले, अस्पताल का नेटवर्क सत्यापन करें। PaliwalSecure की साझेदारी वाली योजनाएँ भारत भर में 10,000+ नेटवर्क अस्पताल कवर करती हैं।", hinglish: "Cashless claims sirf un hospitals mein kaam karte hain jinka aapki insurance company ke saath tie-up hai. Admission se pehle, hospital ka network verify karein. PaliwalSecure ke partnered plans India bhar mein 10,000+ network hospitals cover karte hain." },
    important: { en: "Always verify network status before planned admissions. For emergencies, most insurers allow cashless at any hospital with post-notification within 24 hours.", hi: "नियोजित प्रवेश से पहले हमेशा नेटवर्क स्थिति सत्यापित करें। आपातकाल के लिए, अधिकांश बीमाकर्ता 24 घंटे के भीतर बाद-सूचना के साथ किसी भी अस्पताल में कैशलेस की अनुमति देते हैं।", hinglish: "Planned admissions se pehle hamesha network status verify karein. Emergencies ke liye, zyadaatar insurers 24 ghante ke bheetar post-notification ke saath kisi bhi hospital mein cashless ki anumati dete hain." },
  },
  {
    title: { en: "Show Your Health Card & ID Proof", hi: "अपना हेल्थ कार्ड और ID प्रमाण दिखाएँ", hinglish: "Apna Health Card & ID Proof Dikhayein" },
    description: { en: "At the hospital insurance desk, present your health insurance e-card along with a valid government ID proof (Aadhaar, PAN, or driving license). The hospital insurance desk will verify your policy details and eligibility for cashless treatment.", hi: "अस्पताल बीमा डेस्क पर, अपना हेल्थ इंश्योरेंस ई-कार्ड वैध सरकारी ID प्रमाण (आधार, PAN, या ड्राइविंग लाइसेंस) के साथ प्रस्तुत करें।", hinglish: "Hospital insurance desk pe, apna health insurance e-card valid government ID proof (Aadhaar, PAN, ya driving license) ke saath present karein." },
    important: { en: "If you don't have your health card, you can show the policy document PDF or SMS/e-mail from the insurer with your policy number.", hi: "यदि आपके पास हेल्थ कार्ड नहीं है, तो पॉलिसी दस्तावेज़ PDF या बीमाकर्ता का SMS/ईमेल पॉलिसी नंबर के साथ दिखा सकते हैं।", hinglish: "Agar aapke paas health card nahi hai, toh policy document PDF ya insurer ka SMS/email policy number ke saath dikha sakte hain." },
  },
  {
    title: { en: "Hospital Sends Pre-Authorization Request", hi: "अस्पताल प्री-ऑथोराइज़ेशन अनुरोध भेजता है", hinglish: "Hospital Pre-Auth Request Bhejta Hai" },
    description: { en: "The hospital's insurance desk fills out the pre-authorization form with treatment details and estimated cost, and sends it to the insurance company electronically. As per IRDAI guidelines, the insurer must respond within 1 hour for emergency cases and 4 hours for planned treatments.", hi: "अस्पताल का बीमा डेस्क उपचार विवरण और अनुमानित लागत के साथ प्री-ऑथोराइज़ेशन फॉर्म भरता है और बीमा कंपनी को इलेक्ट्रॉनिक रूप से भेजता है। IRDAI दिशानिर्देशों के अनुसार, बीमाकर्ता को आपातकाल में 1 घंटे और नियोजित उपचार में 4 घंटे में जवाब देना चाहिए।", hinglish: "Hospital ka insurance desk treatment details aur estimated cost ke saath pre-auth form bharta hai aur insurance company ko electronically bhejta hai. IRDAI guidelines ke according, insurer ko emergency mein 1 ghante aur planned treatment mein 4 ghante mein respond karna chahiye." },
    important: { en: "Pre-auth approval is not final claim approval — it is an authorization to proceed with treatment up to the approved amount. Final settlement happens at discharge.", hi: "प्री-ऑथ अनुमोदन अंतिम क्लेम अनुमोदन नहीं है — यह अनुमोदित राशि तक उपचार जारी रखने की अधिकृति है। अंतिम निपटान डिस्चार्ज पर होता है।", hinglish: "Pre-auth approval final claim approval nahi hai — yeh approved amount tak treatment jaari rakhne ki authorization hai. Final settlement discharge pe hota hai." },
  },
  {
    title: { en: "Insurer Approves & Treatment Begins", hi: "बीमाकर्ता अनुमोदित करता है और उपचार शुरू होता है", hinglish: "Insurer Approve Karta Hai Aur Treatment Shuru Hota Hai" },
    description: { en: "Once the insurer approves the pre-auth request, you can proceed with treatment without paying upfront (up to the approved amount). If the estimated cost exceeds the pre-auth amount, the hospital can send an enhancement request to the insurer.", hi: "जब बीमाकर्ता प्री-ऑथ अनुरोध स्वीकृत करता है, तो आप बिना अग्रिम भुगतान के उपचार शुरू कर सकते हैं (अनुमोदित राशि तक)। यदि अनुमानित लागत अनुमोदित राशि से अधिक है, तो अस्पताल बीमाकर्ता को वृद्धि अनुरोध भेज सकता है।", hinglish: "Jab insurer pre-auth request approve karta hai, toh aap bina upfront payment ke treatment shuru kar sakte hain (approved amount tak). Agar estimated cost approved amount se zyada hai, toh hospital insurer ko enhancement request bhej sakta hai." },
    important: { en: "If pre-auth is partially approved, discuss with the hospital and insurer. You may need to pay the difference as a deposit, which is refunded if the final approval covers it.", hi: "यदि प्री-ऑथ आंशिक रूप से अनुमोदित है, तो अस्पताल और बीमाकर्ता से चर्चा करें। आपको अंतर जमा के रूप में भुगतान करना पड़ सकता है, जो अंतिम अनुमोदन में वापस किया जाता है।", hinglish: "Agar pre-auth partially approved hai, toh hospital aur insurer se discussion karein. Aapko difference deposit ke roop mein pay karna pad sakta hai, jo final approval mein refund hota hai." },
  },
  {
    title: { en: "Discharge & Final Settlement", hi: "डिस्चार्ज और अंतिम निपटान", hinglish: "Discharge & Final Settlement" },
    description: { en: "At discharge, the hospital sends the final bill and treatment documents to the insurer. As per IRDAI guidelines, the insurer must process the final claim within 3 hours of receiving all documents. Once approved, the insurer pays the hospital directly.", hi: "डिस्चार्ज पर, अस्पताल अंतिम बिल और उपचार दस्तावेज़ बीमाकर्ता को भेजता है। IRDAI दिशानिर्देशों के अनुसार, बीमाकर्ता को सभी दस्तावेज़ प्राप्ति के 3 घंटे में अंतिम क्लेम प्रोसेस करना चाहिए। अनुमोदित होने पर, बीमाकर्ता सीधे अस्पताल को भुगतान करता है।", hinglish: "Discharge pe, hospital final bill aur treatment documents insurer ko bhejta hai. IRDAI guidelines ke according, insurer ko sabhi documents receive ke 3 ghante mein final claim process karna chahiye. Approve hone pe, insurer directly hospital ko pay karta hai." },
    important: { en: "Before leaving, check the final bill for any disputed items. Sign only after verifying that the settlement amount matches what was discussed. Keep a copy of all discharge documents.", hi: "जाने से पहले, अंतिम बिल में कोई विवादित मद जाँचें। केवल निपटान राशि सत्यापित करने के बाद हस्ताक्षर करें। सभी डिस्चार्ज दस्तावेज़ों की प्रति रखें।", hinglish: "Jane se pehle, final bill mein koi disputed item check karein. Sirf settlement amount verify karne ke baad sign karein. Sabhi discharge documents ki copy rakhein." },
  },
];

// ── IRDAI timelines data ─────────────────────────────────────────────────────
const irdaiTimelines = [
  { action: { en: "Pre-authorization (Emergency)", hi: "प्री-ऑथोराइज़ेशन (आपातकाल)", hinglish: "Pre-authorization (Emergency)" }, timeline: { en: "1 hour", hi: "1 घंटा", hinglish: "1 hour" }, regulation: { en: "IRDAI Health Insurance Regulations 2016", hi: "IRDAI हेल्थ इंश्योरेंस नियम 2016", hinglish: "IRDAI Health Insurance Regulations 2016" } },
  { action: { en: "Pre-authorization (Planned)", hi: "प्री-ऑथोराइज़ेशन (नियोजित)", hinglish: "Pre-authorization (Planned)" }, timeline: { en: "4 hours", hi: "4 घंटे", hinglish: "4 hours" }, regulation: { en: "IRDAI Health Insurance Regulations 2016", hi: "IRDAI हेल्थ इंश्योरेंस नियम 2016", hinglish: "IRDAI Health Insurance Regulations 2016" } },
  { action: { en: "Enhancement Request", hi: "वृद्धि अनुरोध", hinglish: "Enhancement Request" }, timeline: { en: "1 hour (Emergency)", hi: "1 घंटा (आपातकाल)", hinglish: "1 hour (Emergency)" }, regulation: { en: "IRDAI Guidelines on Cashless", hi: "IRDAI कैशलेस दिशानिर्देश", hinglish: "IRDAI Guidelines on Cashless" } },
  { action: { en: "Final Claim Settlement", hi: "अंतिम क्लेम निपटान", hinglish: "Final Claim Settlement" }, timeline: { en: "3 hours from documents", hi: "दस्तावेज़ से 3 घंटे", hinglish: "3 hours from documents" }, regulation: { en: "IRDAI 2024 Circular on Claims", hi: "IRDAI 2024 क्लेम परिपत्र", hinglish: "IRDAI 2024 Circular on Claims" } },
  { action: { en: "Claim Decision (Reimbursement)", hi: "क्लेम निर्णय (प्रतिपूर्ति)", hinglish: "Claim Decision (Reimbursement)" }, timeline: { en: "30 days from submission", hi: "जमा से 30 दिन", hinglish: "30 days from submission" }, regulation: { en: "IRDAI Protection of Policyholders", hi: "IRDAI पॉलिसीधारक सुरक्षा", hinglish: "IRDAI Protection of Policyholders" } },
  { action: { en: "Grievance Resolution", hi: "शिकायत समाधान", hinglish: "Grievance Resolution" }, timeline: { en: "15 days", hi: "15 दिन", hinglish: "15 days" }, regulation: { en: "IRDAI Integrated Grievance Management", hi: "IRDAI एकीकृत शिकायत प्रबंधन", hinglish: "IRDAI Integrated Grievance Management" } },
];

// ── Hospital chains data ─────────────────────────────────────────────────────
const majorHospitalChains = [
  { name: "Apollo Hospitals", network: { en: "70+ hospitals across India", hi: "भारत भर में 70+ अस्पताल", hinglish: "70+ hospitals across India" }, specialties: { en: "Cardiac, Oncology, Neurosciences, Orthopedics, Organ Transplant", hi: "कार्डियक, ऑन्कोलॉजी, न्यूरोसाइंस, ऑर्थोपेडिक्स, ऑर्गन ट्रांसप्लांट", hinglish: "Cardiac, Oncology, Neurosciences, Orthopedics, Organ Transplant" }, locations: { en: "Delhi, Chennai, Hyderabad, Bangalore, Mumbai, Kolkata, Ahmedabad, and 20+ cities", hi: "दिल्ली, चेन्नई, हैदराबाद, बैंगलोर, मुंबई, कोलकाता, अहमदाबाद और 20+ शहर", hinglish: "Delhi, Chennai, Hyderabad, Bangalore, Mumbai, Kolkata, Ahmedabad, aur 20+ cities" } },
  { name: "Fortis Healthcare", network: { en: "40+ hospitals across India", hi: "भारत भर में 40+ अस्पताल", hinglish: "40+ hospitals across India" }, specialties: { en: "Cardiac Sciences, Orthopedics, Neurosciences, Renal Sciences, Gastroenterology", hi: "कार्डियक साइंसेज, ऑर्थोपेडिक्स, न्यूरोसाइंस, रीनल साइंसेज, गैस्ट्रोएंटरोलॉजी", hinglish: "Cardiac Sciences, Orthopedics, Neurosciences, Renal Sciences, Gastroenterology" }, locations: { en: "Delhi NCR, Mumbai, Bangalore, Chennai, Kolkata, Mohali, Jaipur, and 15+ cities", hi: "दिल्ली NCR, मुंबई, बैंगलोर, चेन्नई, कोलकाता, मोहाली, जयपुर और 15+ शहर", hinglish: "Delhi NCR, Mumbai, Bangalore, Chennai, Kolkata, Mohali, Jaipur, aur 15+ cities" } },
  { name: "Max Healthcare", network: { en: "20+ hospitals (mainly North India)", hi: "20+ अस्पताल (मुख्य रूप से उत्तर भारत)", hinglish: "20+ hospitals (mainly North India)" }, specialties: { en: "Cardiac, Oncology, Neurosciences, BMT, Kidney & Liver Transplant", hi: "कार्डियक, ऑन्कोलॉजी, न्यूरोसाइंस, BMT, किडनी और लिवर ट्रांसप्लांट", hinglish: "Cardiac, Oncology, Neurosciences, BMT, Kidney & Liver Transplant" }, locations: { en: "Delhi NCR, Mohali, Bathinda, Dehradun", hi: "दिल्ली NCR, मोहाली, बठिंडा, देहरादून", hinglish: "Delhi NCR, Mohali, Bathinda, Dehradun" } },
  { name: "Medanta – The Medicity", network: { en: "4 hospitals (Gurugram, Lucknow, Indore, Ranchi)", hi: "4 अस्पताल (गुरुग्राम, लखनऊ, इंदौर, रांची)", hinglish: "4 hospitals (Gurugram, Lucknow, Indore, Ranchi)" }, specialties: { en: "Cardiac Surgery, Neurosciences, Oncology, Organ Transplant, Robotic Surgery", hi: "कार्डियक सर्जरी, न्यूरोसाइंस, ऑन्कोलॉजी, ऑर्गन ट्रांसप्लांट, रोबोटिक सर्जरी", hinglish: "Cardiac Surgery, Neurosciences, Oncology, Organ Transplant, Robotic Surgery" }, locations: { en: "Gurugram (flagship), Lucknow, Indore, Ranchi", hi: "गुरुग्राम (प्रमुख), लखनऊ, इंदौर, रांची", hinglish: "Gurugram (flagship), Lucknow, Indore, Ranchi" } },
  { name: "Narayana Health", network: { en: "30+ hospitals across India", hi: "भारत भर में 30+ अस्पताल", hinglish: "30+ hospitals across India" }, specialties: { en: "Cardiac Surgery (largest in India), Oncology, Neurosciences, Orthopedics", hi: "कार्डियक सर्जरी (भारत में सबसे बड़ा), ऑन्कोलॉजी, न्यूरोसाइंस, ऑर्थोपेडिक्स", hinglish: "Cardiac Surgery (largest in India), Oncology, Neurosciences, Orthopedics" }, locations: { en: "Bangalore, Kolkata, Hyderabad, Chennai, Ahmedabad, Jaipur, and 15+ cities", hi: "बैंगलोर, कोलकाता, हैदराबाद, चेन्नई, अहमदाबाद, जयपुर और 15+ शहर", hinglish: "Bangalore, Kolkata, Hyderabad, Chennai, Ahmedabad, Jaipur, aur 15+ cities" } },
  { name: "Manipal Hospitals", network: { en: "25+ hospitals across India", hi: "भारत भर में 25+ अस्पताल", hinglish: "25+ hospitals across India" }, specialties: { en: "Cardiac, Oncology, Neurosciences, Organ Transplant, Robotic Surgery", hi: "कार्डियक, ऑन्कोलॉजी, न्यूरोसाइंस, ऑर्गन ट्रांसप्लांट, रोबोटिक सर्जरी", hinglish: "Cardiac, Oncology, Neurosciences, Organ Transplant, Robotic Surgery" }, locations: { en: "Bangalore, Delhi, Goa, Jaipur, Mangalore, and 10+ cities", hi: "बैंगलोर, दिल्ली, गोवा, जयपुर, मैंगलोर और 10+ शहर", hinglish: "Bangalore, Delhi, Goa, Jaipur, Mangalore, aur 10+ cities" } },
];

// ── Rejection reasons data ───────────────────────────────────────────────────
const commonRejectionReasons = [
  { reason: { en: "Pre-existing disease within waiting period", hi: "प्रतीक्षा अवधि में पूर्व-मौजूदा बीमारी", hinglish: "Waiting period mein pre-existing disease" }, solution: { en: "Check PED waiting period before buying. Opt for plans with shorter PED wait (2 years). Disclose all conditions honestly.", hi: "खरीदने से पहले PED प्रतीक्षा अवधि जाँचें। कम PED प्रतीक्षा (2 वर्ष) वाले प्लान चुनें। सभी स्थितियाँ ईमानदारी से घोषित करें।", hinglish: "Khareedne se pehle PED waiting period check karein. Shorter PED wait (2 saal) wale plans choose karein. Sabhi conditions honestly disclose karein." } },
  { reason: { en: "Treatment not covered under policy", hi: "उपचार पॉलिसी में कवर नहीं", hinglish: "Treatment policy mein covered nahi" }, solution: { en: "Read the policy wording carefully. Most plans exclude cosmetic surgery, experimental treatments, self-inflicted injuries, and dental (unless due to accident).", hi: "पॉलिसी शब्दावली ध्यान से पढ़ें। अधिकांश प्लान कॉस्मेटिक सर्जरी, प्रायोगिक उपचार, स्व-प्रेरित चोट और डेंटल (दुर्घटना को छोड़कर) अपवर्जित करते हैं।", hinglish: "Policy wording dhyan se padhein. Zyadaatar plans cosmetic surgery, experimental treatments, self-inflicted injuries aur dental (accident ko chodke) exclude karte hain." } },
  { reason: { en: "Incorrect or incomplete documentation", hi: "गलत या अधूरा दस्तावेज़ीकरण", hinglish: "Galat ya adhoora documentation" }, solution: { en: "Ensure all documents are complete: discharge summary, bills, investigation reports, doctor's prescription, and ID proof. Missing documents are the #1 cause of delay.", hi: "सुनिश्चित करें कि सभी दस्तावेज़ पूर्ण हैं: डिस्चार्ज सारांश, बिल, जाँच रिपोर्ट, डॉक्टर की प्रिस्क्रिप्शन, और ID प्रमाण। अधूरे दस्तावेज़ देरी का #1 कारण हैं।", hinglish: "Ensure karein ki sabhi documents complete hain: discharge summary, bills, investigation reports, doctor ki prescription, aur ID proof. Missing documents delay ka #1 cause hain." } },
  { reason: { en: "Hospital not in insurer's network", hi: "अस्पताल बीमाकर्ता के नेटवर्क में नहीं", hinglish: "Hospital insurer ke network mein nahi" }, solution: { en: "Verify network status before admission. For emergencies, inform the insurer within 24 hours — most allow cashless at non-network hospitals too.", hi: "प्रवेश से पहले नेटवर्क स्थिति सत्यापित करें। आपातकाल के लिए, 24 घंटे के भीतर बीमाकर्ता को सूचित करें।", hinglish: "Admission se pehle network status verify karein. Emergencies ke liye, 24 ghante ke bheetar insurer ko inform karein." } },
  { reason: { en: "Claim filed after the deadline", hi: "समयसीमा के बाद क्लेम दर्ज", hinglish: "Deadline ke baad claim darj" }, solution: { en: "Most insurers require intimation within 24-48 hours for emergency and 3-7 days before planned hospitalization. File claims promptly.", hi: "अधिकांश बीमाकर्ताओं को आपातकाल के लिए 24-48 घंटे और नियोजित अस्पताल में भर्ती से 3-7 दिन पहले सूचना चाहिए। क्लेम तुरंत दर्ज करें।", hinglish: "Zyadaatar insurers ko emergency ke liye 24-48 ghante aur planned hospitalization se 3-7 din pehle intimation chahiye. Claims promptly file karein." } },
  { reason: { en: "Non-disclosure of medical history", hi: "चिकित्सा इतिहास का गैर-प्रकटीकरण", hinglish: "Medical history ka non-disclosure" }, solution: { en: "Always disclose your complete medical history at the time of buying the policy. Non-disclosure is the most common reason for claim rejection.", hi: "पॉलिसी खरीदते समय हमेशा अपना पूरा चिकित्सा इतिहास घोषित करें। गैर-प्रकटीकरण क्लेम अस्वीकृति का सबसे आम कारण है।", hinglish: "Policy khareedte waqt hamesha apna poora medical history disclose karein. Non-disclosure claim rejection ka sabse aam reason hai." } },
];

// ── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  { q: { en: "What is a cashless claim in health insurance?", hi: "हेल्थ इंश्योरेंस में कैशलेस क्लेम क्या है?", hinglish: "Health insurance mein cashless claim kya hai?" }, a: { en: "A cashless claim allows you to receive medical treatment at a network hospital without paying the hospital bill upfront. The insurance company settles the bill directly with the hospital. You only pay for non-covered expenses like consumables, co-payment amount, or items excluded from your policy.", hi: "कैशलेस क्लेम आपको नेटवर्क अस्पताल में बिना अस्पताल बिल अग्रिम भुगतान किए चिकित्सा उपचार प्राप्त करने की अनुमति देता है। बीमा कंपनी सीधे अस्पताल को बिल चुकाती है। आप केवल गैर-कवर खर्चों का भुगतान करते हैं।", hinglish: "Cashless claim aapko network hospital mein bina hospital bill upfront pay kiye medical treatment lene ki anumati deta hai. Insurance company directly hospital ko bill chukati hai. Aap sirf non-covered expenses ka payment karte hain." } },
  { q: { en: "What is the difference between cashless and reimbursement claims?", hi: "कैशलेस और प्रतिपूर्ति क्लेम में क्या अंतर है?", hinglish: "Cashless aur reimbursement claims mein kya farq hai?" }, a: { en: "In a cashless claim, the insurer pays the hospital directly — you don't pay the bill (except non-covered items). In a reimbursement claim, you pay the hospital first and then submit bills to the insurer. Cashless is faster and stress-free. Reimbursement works at any hospital.", hi: "कैशलेस क्लेम में, बीमाकर्ता सीधे अस्पताल को भुगतान करता है। प्रतिपूर्ति क्लेम में, आप पहले अस्पताल को भुगतान करते हैं और फिर बिल बीमाकर्ता को जमा करते हैं। कैशलेस तेज़ और तनाव-मुक्त है। प्रतिपूर्ति किसी भी अस्पताल में काम करती है।", hinglish: "Cashless claim mein, insurer directly hospital ko pay karta hai. Reimbursement claim mein, aap pehle hospital ko pay karte hain aur phir bills insurer ko submit karte hain. Cashless fast aur stress-free hai. Reimbursement kisi bhi hospital mein kaam karta hai." } },
  { q: { en: "How long does an insurer take to approve a cashless pre-authorization?", hi: "बीमाकर्ता को कैशलेस प्री-ऑथ अनुमोदन में कितना समय लगता है?", hinglish: "Insurer ko cashless pre-auth approval mein kitna time lagta hai?" }, a: { en: "As per IRDAI guidelines, insurers must approve pre-authorization within 1 hour for emergency cases and 4 hours for planned treatments. At discharge, the final claim must be processed within 3 hours of receiving all documents.", hi: "IRDAI दिशानिर्देशों के अनुसार, बीमाकर्ताओं को आपातकाल में 1 घंटे और नियोजित उपचार में 4 घंटे में प्री-ऑथ अनुमोदित करना चाहिए। डिस्चार्ज पर, अंतिम क्लेम सभी दस्तावेज़ प्राप्ति के 3 घंटे में प्रोसेस होना चाहिए।", hinglish: "IRDAI guidelines ke according, insurers ko emergency mein 1 ghante aur planned treatment mein 4 ghante mein pre-auth approve karna chahiye. Discharge pe, final claim sabhi documents receive ke 3 ghante mein process hona chahiye." } },
  { q: { en: "Can I get cashless treatment at any hospital?", hi: "क्या मैं किसी भी अस्पताल में कैशलेस उपचार प्राप्त कर सकता हूँ?", hinglish: "Kya main kisi bhi hospital mein cashless treatment paa sakta hoon?" }, a: { en: "Cashless treatment is available only at your insurer's network hospitals. However, for emergencies, most insurers allow cashless at any hospital if you intimate them within 24 hours. For planned treatments, you must choose a network hospital.", hi: "कैशलेस उपचार केवल आपके बीमाकर्ता के नेटवर्क अस्पतालों में उपलब्ध है। हालांकि, आपातकाल के लिए, अधिकांश बीमाकर्ता 24 घंटे के भीतर सूचना देने पर किसी भी अस्पताल में कैशलेस की अनुमति देते हैं।", hinglish: "Cashless treatment sirf aapke insurer ke network hospitals mein available hai. Lekin, emergencies ke liye, zyadaatar insurers 24 ghante ke bheetar intimation pe kisi bhi hospital mein cashless ki anumati dete hain." } },
  { q: { en: "What documents are needed for a cashless claim?", hi: "कैशलेस क्लेम के लिए कौन से दस्तावेज़ चाहिए?", hinglish: "Cashless claim ke liye kaun se documents chahiye?" }, a: { en: "For cashless claims at network hospitals, you need: (1) Health insurance e-card, (2) Government ID proof (Aadhaar/PAN), (3) Doctor's admission recommendation, (4) Pre-authorization form (filled by hospital). At discharge, the hospital sends: discharge summary, final bill, investigation reports, and doctor's notes to the insurer.", hi: "नेटवर्क अस्पतालों में कैशलेस क्लेम के लिए: (1) हेल्थ इंश्योरेंस ई-कार्ड, (2) सरकारी ID प्रमाण, (3) डॉक्टर की प्रवेश सिफारिश, (4) प्री-ऑथ फॉर्म। डिस्चार्ज पर अस्पताल बीमाकर्ता को डिस्चार्ज सारांश, अंतिम बिल, जाँच रिपोर्ट भेजता है।", hinglish: "Network hospitals mein cashless claims ke liye: (1) Health insurance e-card, (2) Government ID proof, (3) Doctor ki admission recommendation, (4) Pre-auth form. Discharge pe hospital insurer ko discharge summary, final bill, investigation reports bhejta hai." } },
  { q: { en: "What if my cashless claim is rejected?", hi: "यदि मेरा कैशलेस क्लेम अस्वीकृत हो जाए तो?", hinglish: "Agar mera cashless claim reject ho jaaye toh?" }, a: { en: "If your cashless pre-auth is rejected, you can: (1) Ask the hospital insurance desk to resubmit with additional medical documents, (2) Contact your insurer's grievance cell, (3) Pay the bill and file a reimbursement claim, (4) Escalate to IRDAI IGMS if the rejection seems unfair.", hi: "यदि कैशलेस प्री-ऑथ अस्वीकृत होती है, तो: (1) अस्पताल बीमा डेस्क से अतिरिक्त चिकित्सा दस्तावेज़ के साथ पुनः प्रस्तुत करने को कहें, (2) बीमाकर्ता की शिकायत सेल से संपर्क करें, (3) बिल का भुगतान करें और प्रतिपूर्ति क्लेम दर्ज करें, (4) IRDAI IGMS में एस्केलेट करें।", hinglish: "Agar cashless pre-auth reject hoti hai, toh: (1) Hospital insurance desk se additional medical documents ke saath resubmit karne ko kahein, (2) Insurer ki grievance cell se contact karein, (3) Bill pay karein aur reimbursement claim file karein, (4) IRDAI IGMS mein escalate karein." } },
  { q: { en: "Are there any expenses I must pay even in cashless claims?", hi: "क्या कैशलेस क्लेम में भी कुछ खर्च मुझे देने पड़ते हैं?", hinglish: "Kya cashless claims mein bhi kuch kharcha mujhe dena padta hai?" }, a: { en: "Yes, even in cashless claims, you may need to pay: (1) Co-payment amount, (2) Non-covered items like consumables (PPE kits, syringes), (3) Room rent difference if you choose a room above your policy limit, (4) Treatment for excluded conditions, (5) Registration charges and visitor passes.", hi: "हाँ, कैशलेस क्लेम में भी आपको भुगतान करना पड़ सकता है: (1) को-पे राशि, (2) गैर-कवर वस्तुएँ (PPE किट, सीरिंज), (3) कमरा किराया अंतर, (4) अपवर्जित स्थितियों का उपचार, (5) पंजीकरण शुल्क।", hinglish: "Haan, cashless claims mein bhi aapko pay karna pad sakta hai: (1) Co-payment amount, (2) Non-covered items (PPE kits, syringes), (3) Room rent difference, (4) Excluded conditions ka treatment, (5) Registration charges." } },
];

// ── FAQ JSON-LD (English for SEO) ──────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q.en,
    acceptedAnswer: { "@type": "Answer", text: faq.a.en },
  })),
};

// ── Client Component ────────────────────────────────────────────────────────
export default function ClientContent() {
  const { language } = useLanguage();

  return (
    <div>
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{pt(pageText.hero.badge, language)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-6">
            {pt(pageText.hero.title1, language)} <span className="gradient-text">{pt(pageText.hero.titleHighlight, language)}</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8">{pt(pageText.hero.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20cashless%20claim" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue"><span>{pt(pageText.hero.ctaHelp, language)}</span></ShinyButton>
            </a>
            <Link href="/claim-guide">
              <ShinyButton variant="secondary"><span>{pt(pageText.hero.ctaGuide, language)}</span></ShinyButton>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* What is Cashless Claim */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            {pt(pageText.whatIs.heading, language)} <span className="gradient-text">{pt(pageText.whatIs.headingHighlight, language)}</span>
          </h2>
          <div className="max-w-3xl mx-auto glass-card rounded-xl p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">{pt(pageText.whatIs.desc1, language)}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{pt(pageText.whatIs.desc2, language)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mb-2">{pt(pageText.whatIs.cashlessTitle, language)}</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {pageText.whatIs.cashlessPoints.map((p, i) => <li key={i}>• {pt(p, language)}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-amber-700 dark:text-amber-400 text-sm mb-2">{pt(pageText.whatIs.reimbTitle, language)}</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {pageText.whatIs.reimbPoints.map((p, i) => <li key={i}>• {pt(p, language)}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Step-by-Step */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            {pt(pageText.steps.heading, language)} <span className="gradient-text">{pt(pageText.steps.headingHighlight, language)}</span>
          </h2>
          <div className="space-y-6">
            {cashlessProcessSteps.map((step, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground flex items-center justify-center font-bold text-lg">{idx + 1}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{pt(step.title, language)}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{pt(step.description, language)}</p>
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <p className="text-sm"><span className="font-semibold text-primary">Important:</span> <span className="text-muted-foreground">{pt(step.important, language)}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* IRDAI Timelines */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.irdai.heading, language)} <span className="gradient-text">{pt(pageText.irdai.headingHighlight, language)}</span> {pt(pageText.irdai.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{pt(pageText.irdai.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(pageText.irdai.thAction, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(pageText.irdai.thTimeline, language)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(pageText.irdai.thRegulation, language)}</th>
                </tr>
              </thead>
              <tbody>
                {irdaiTimelines.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{pt(row.action, language)}</td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs">{pt(row.timeline, language)}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{pt(row.regulation, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 glass-card rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="font-bold text-sm mb-2">{pt(pageText.irdai.delayHeading, language)}</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {pageText.irdai.delaySteps.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-semibold text-primary">{i + 1}.</span>{pt(s, language)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Hospital Chains */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.hospitals.heading, language)} <span className="gradient-text">{pt(pageText.hospitals.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{pt(pageText.hospitals.desc, language)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorHospitalChains.map((h, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-base mb-1">{h.name}</h3>
                <p className="text-primary text-sm font-semibold mb-3">{pt(h.network, language)}</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div><span className="font-semibold text-foreground">{pt(pageText.hospitals.specialties, language)}</span> {pt(h.specialties, language)}</div>
                  <div><span className="font-semibold text-foreground">{pt(pageText.hospitals.locations, language)}</span> {pt(h.locations, language)}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-6 text-center">{pt(pageText.hospitals.footnote, language)}</p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Rejection Reasons */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.rejections.heading, language)} <span className="gradient-text">{pt(pageText.rejections.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{pt(pageText.rejections.desc, language)}</p>
          <div className="space-y-4 max-w-3xl mx-auto">
            {commonRejectionReasons.map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-xs">{idx + 1}</div>
                  <div>
                    <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400">{pt(item.reason, language)}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      <span className="font-semibold text-primary">{pt(pageText.rejections.solutionLabel, language)}</span> {pt(item.solution, language)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Related Guides */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            {pt(pageText.related.heading, language)} <span className="gradient-text">{pt(pageText.related.headingHighlight, language)}</span>
          </h2>
          <div className="max-w-md mx-auto">
            <Link href="/claim-guide" className="glass-card rounded-xl p-6 hover:shadow-md transition-all group block hover:translate-y-[-2px]">
              <h3 className="font-bold text-base mb-2 group-hover:text-primary transition">{pt(pageText.related.claimTitle, language)}</h3>
              <p className="text-muted-foreground text-sm">{pt(pageText.related.claimDesc, language)}</p>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* FAQ */}
      <section className="py-8 md:py-12" id="faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.faq.heading, language)} <span className="gradient-text">{pt(pageText.faq.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8">{pt(pageText.faq.desc, language)}</p>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="glass-card rounded-xl p-5 group cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <summary className="flex items-center justify-between font-semibold text-base list-none">
                  <span>{pt(faq.q, language)}</span>
                  <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{pt(faq.a, language)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* CTA */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {pt(pageText.cta.heading1, language)} <span className="gradient-text">{pt(pageText.cta.headingHighlight, language)}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(pageText.cta.desc, language)}</p>
            <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20cashless%20claim" target="_blank" rel="noopener noreferrer">
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
    </div>
  );
}
