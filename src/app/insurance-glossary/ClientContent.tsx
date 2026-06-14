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
    badge: { en: "30+ Terms Explained", hi: "30+ शब्द समझाए गए", hinglish: "30+ Terms Explained" },
    title1: { en: "Insurance", hi: "बीमा", hinglish: "Insurance" },
    titleHighlight: { en: "Glossary", hi: "शब्दावली", hinglish: "Glossary" },
    titleSuffix: { en: "– Terms Explained", hi: "– शब्द समझाए गए", hinglish: "– Terms Explained" },
    desc: {
      en: "Understand insurance terminology in simple Hindi and English. From IDV to NCB, PED to CSR — every term you need to know before buying insurance in India.",
      hi: "सरल हिंदी और अंग्रेज़ी में बीमा शब्दावली समझें। IDV से NCB, PED से CSR तक — भारत में बीमा खरीदने से पहले हर शब्द जो आपको जानना चाहिए।",
      hinglish: "Aasan Hindi aur English mein insurance terminology samjhiye. IDV se NCB, PED se CSR tak — India mein insurance khareedne se pehle har term jo aapko jaanna chahiye."
    },
    ctaWhatsApp: { en: "💬 Ask on WhatsApp", hi: "💬 WhatsApp पर पूछें", hinglish: "💬 WhatsApp pe Poochiye" },
    ctaFAQ: { en: "📋 Read 50+ FAQs", hi: "📋 50+ सवाल-जवाब पढ़ें", hinglish: "📋 50+ FAQs Padhiye" },
  },
  refTable: {
    heading: { en: "Quick", hi: "त्वरित", hinglish: "Quick" },
    headingHighlight: { en: "Reference", hi: "संदर्भ", hinglish: "Reference" },
    headingSuffix: { en: "– Most Searched Terms", hi: "– सबसे अधिक खोजे गए शब्द", hinglish: "– Most Searched Terms" },
    thAbbr: { en: "Abbreviation", hi: "संक्षेपाक्षर", hinglish: "Abbreviation" },
    thFull: { en: "Full Form", hi: "पूरा नाम", hinglish: "Full Form" },
    thHindi: { en: "Hindi", hi: "हिंदी", hinglish: "Hindi" },
    thWhy: { en: "Why It Matters", hi: "महत्व", hinglish: "Why It Matters" },
  },
  cta: {
    heading1: { en: "Confused by", hi: "समझ नहीं आ रहा", hinglish: "Confused by" },
    headingHighlight: { en: "Insurance Jargon", hi: "बीमा शब्दावली", hinglish: "Insurance Jargon" },
    headingSuffix: { en: "?", hi: "?", hinglish: "?" },
    desc: {
      en: "Don't let complex terms stop you from making the right insurance decision. Our AI advisor explains everything in simple language — Hindi, English, or Hinglish. Get personalized guidance, zero spam.",
      hi: "जटिल शब्दों को सही बीमा निर्णय लेने से न रोकें। हमारे AI सलाहकार सब कुछ सरल भाषा में समझाते हैं — हिंदी, अंग्रेज़ी या हिंग्लिश। व्यक्तिगत मार्गदर्शन, शून्य स्पैम।",
      hinglish: "Complex terms ko sahi insurance decision lene se na rokein. Hamaare AI advisor sab kuch aasan bhasha mein samjhate hain — Hindi, English, ya Hinglish. Personalized guidance, zero spam."
    },
    ctaWhatsApp: { en: "💬 Ask on WhatsApp", hi: "💬 WhatsApp पर पूछें", hinglish: "💬 WhatsApp pe Poochiye" },
    ctaChat: { en: "🤖 Chat with InsureGPT", hi: "🤖 InsureGPT से चैट करें", hinglish: "🤖 InsureGPT se Chat Karein" },
    byline: { en: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834", hi: "हिमांशु पालीवाल द्वारा — IRDAI प्रमाणित बीमा सलाहकार · POSP कोड: IP429834", hinglish: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834" },
  },
  related: {
    heading: { en: "Explore", hi: "और जानें", hinglish: "Explore" },
    headingHighlight: { en: "More", hi: "और", hinglish: "More" },
    faqTitle: { en: "Insurance FAQ", hi: "बीमा सवाल-जवाब", hinglish: "Insurance FAQ" },
    faqDesc: { en: "50+ common questions answered", hi: "50+ सामान्य सवालों के जवाब", hinglish: "50+ common questions ke jawab" },
    healthTitle: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    healthDesc: { en: "Compare best health plans", hi: "सर्वोत्तम हेल्थ प्लान तुलना करें", hinglish: "Best health plans compare karein" },
    zeroDepTitle: { en: "Zero Dep Car Insurance", hi: "ज़ीरो डेप कार बीमा", hinglish: "Zero Dep Car Insurance" },
    zeroDepDesc: { en: "Save 30-50% on claims", hi: "क्लेम पर 30-50% बचत", hinglish: "Claims pe 30-50% save karein" },
    auditTitle: { en: "Free Insurance Audit", hi: "मुफ़्त बीमा ऑडिट", hinglish: "Free Insurance Audit" },
    auditDesc: { en: "Audit + Compare + Save", hi: "ऑडिट + तुलना + बचत", hinglish: "Audit + Compare + Save" },
  },
  exampleLabel: { en: "📌 Example:", hi: "📌 उदाहरण:", hinglish: "📌 Example:" },
  readMoreLabel: { en: "→ Read more:", hi: "→ और पढ़ें:", hinglish: "→ Read more:" },
};

// ── Glossary Terms with full i18n ───────────────────────────────────────────
type GlossaryTerm = {
  term: string;
  hindi: TEntry;
  definition: TEntry;
  example?: TEntry;
  relatedLink?: { label: TEntry; href: string };
};

const glossary: GlossaryTerm[] = [
  {
    term: "Add-on Cover",
    hindi: { en: "Additional Cover", hi: "अतिरिक्त कवर", hinglish: "Extra Cover" },
    definition: { en: "An optional extra cover you can buy with your base insurance policy to enhance protection. Add-ons increase your premium but provide additional benefits not included in the standard policy.", hi: "एक वैकल्पिक अतिरिक्त कवर जो आप अपनी बेस बीमा पॉलिसी के साथ खरीद सकते हैं। ऐड-ऑन प्रीमियम बढ़ाते हैं लेकिन अतिरिक्त लाभ देते हैं।", hinglish: "Ek optional extra cover jo aap apni base insurance policy ke saath khareed sakte hain. Add-ons premium badhate hain lekin extra benefits dete hain." },
    example: { en: "Zero Depreciation, Engine Protection, and Roadside Assistance are popular add-ons for car insurance.", hi: "ज़ीरो डेप्रिसिएशन, इंजन प्रोटेक्शन और रोडसाइड असिस्टेंस कार बीमे के लोकप्रिय ऐड-ऑन हैं।", hinglish: "Zero Depreciation, Engine Protection aur Roadside Assistance car insurance ke popular add-ons hain." },
    relatedLink: { label: { en: "Zero Dep Car Insurance", hi: "ज़ीरो डेप कार बीमा", hinglish: "Zero Dep Car Insurance" }, href: "/zero-dep-car-insurance" },
  },
  {
    term: "Assignment",
    hindi: { en: "Transfer", hi: "हस्तांतरण", hinglish: "Transfer" },
    definition: { en: "The transfer of insurance policy rights from the policyholder (assignor) to another person (assignee). Once assigned, the assignee becomes the policy owner and can claim benefits. Commonly used when taking a loan against a life insurance policy.", hi: "पॉलिसीधारक (असाइनर) से दूसरे व्यक्ति (असाइनी) को बीमा पॉलिसी अधिकारों का हस्तांतरण। असाइनमेंट के बाद, असाइनी पॉलिसी का मालिक बन जाता है। आमतौर पर लाइफ इंश्योरेंस पर लोन लेते समय उपयोग।", hinglish: "Policyholder (assignor) se dusre vyakti (assignee) ko insurance policy rights ka transfer. Assignment ke baad, assignee policy ka owner ban jaata hai. Usually life insurance pe loan lete waqt use hota hai." },
    example: { en: "You assign your ₹50L life insurance policy to the bank as collateral for a home loan.", hi: "आप अपनी ₹50 लाख लाइफ इंश्योरेंस पॉलिसी बैंक को होम लोन के समान रूप में असाइन करते हैं।", hinglish: "Aap apni ₹50L life insurance policy bank ko home loan ke collateral ke roop mein assign karte hain." },
  },
  {
    term: "Bonus",
    hindi: { en: "Bonus", hi: "बोनस", hinglish: "Bonus" },
    definition: { en: "An additional amount added to your life insurance policy's sum assured, declared by the insurer based on surplus profits. Bonuses accumulate over the policy term and are paid at maturity or on death. Only participating (with-profit) policies earn bonuses.", hi: "आपकी लाइफ इंश्योरेंस पॉलिसी की बीमा राशि में जोड़ी गई अतिरिक्त राशि, बीमाकर्ता द्वारा अधिशेष लाभ के आधार पर घोषित। केवल भागीदारी (विथ-प्रॉफिट) पॉलिसियाँ बोनस कमाती हैं।", hinglish: "Aapki life insurance policy ki sum assured mein judi hui extra amount, insurer dwara surplus profits ke basis pe declared. Sirf participating (with-profit) policies bonus kamati hain." },
    example: { en: "If your policy sum assured is ₹10L and the bonus accumulated is ₹3L, your maturity payout will be ₹13L.", hi: "यदि आपकी पॉलिसी बीमा राशि ₹10 लाख है और बोनस ₹3 लाख जमा है, तो परिपक्वता भुगतान ₹13 लाख होगा।", hinglish: "Agar aapki policy sum assured ₹10L hai aur bonus ₹3L accumulated hai, toh maturity payout ₹13L hoga." },
  },
  {
    term: "Cashless Claim",
    hindi: { en: "Cashless Claim", hi: "कैशलेस क्लेम", hinglish: "Cashless Claim" },
    definition: { en: "A claim where the insurer settles the bill directly with the hospital or garage — you don't pay upfront (except for deductibles/co-pay). Available only at the insurer's network of empanelled hospitals or garages.", hi: "क्लेम जहाँ बीमाकर्ता सीधे अस्पताल या गैराज को बिल चुकाता है — आपको अग्रिम भुगतान नहीं करना (कटौती/को-पे को छोड़कर)। केवल बीमाकर्ता के नेटवर्क अस्पतालों या गैराज में उपलब्ध।", hinglish: "Claim jahan insurer directly hospital ya garage ko bill chukata hai — aapko upfront pay nahi karna (except deductibles/co-pay). Sirf insurer ke network hospitals ya garages mein available." },
    example: { en: "You get treated at a Star Health network hospital and the insurer pays the hospital directly. You only pay the co-pay amount.", hi: "आप स्टार हेल्थ नेटवर्क अस्पताल में इलाज कराते हैं और बीमाकर्ता सीधे अस्पताल को भुगतान करता है।", hinglish: "Aap Star Health network hospital mein ilaj karate hain aur insurer directly hospital ko payment karta hai." },
    relatedLink: { label: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" }, href: "/health-insurance" },
  },
  {
    term: "Co-payment (Co-pay)",
    hindi: { en: "Co-payment", hi: "सह-भुगतान", hinglish: "Co-payment" },
    definition: { en: "The fixed percentage of the claim amount that you must pay from your own pocket. The insurer pays the remaining amount. Policies with co-pay have lower premiums but higher out-of-pocket expenses during claims. Senior citizen health plans often have mandatory co-pay of 10-20%.", hi: "क्लेम राशि का निश्चित प्रतिशत जो आपको अपनी जेब से देना होता है। बीमाकर्ता शेष भुगतान करता है। को-पे वाली पॉलिसियों का प्रीमियम कम होता है लेकिन क्लेम में जेब से ज़्यादा खर्च। सीनियर सिटीज़न प्लान में अक्सर 10-20% को-पे अनिवार्य।", hinglish: "Claim amount ka fixed percentage jo aapko apni jeb se dena padta hai. Insurer baaki deta hai. Co-pay wali policies ka premium kam hota hai lekin claim mein jeb se zyada kharcha. Senior citizen plans mein aksar 10-20% co-pay mandatory." },
    example: { en: "With a 20% co-pay on a ₹2L hospital bill, you pay ₹40,000 and the insurer pays ₹1,60,000.", hi: "₹2 लाख अस्पताल बिल पर 20% को-पे के साथ, आप ₹40,000 देंगे और बीमाकर्ता ₹1,60,000।", hinglish: "₹2L hospital bill pe 20% co-pay ke saath, aap ₹40,000 denge aur insurer ₹1,60,000." },
  },
  {
    term: "CSR (Claims Settlement Ratio)",
    hindi: { en: "Claim Settlement Ratio", hi: "क्लेम निपटान अनुपात", hinglish: "Claim Settlement Ratio" },
    definition: { en: "The percentage of insurance claims an insurer settles out of the total claims received in a year. Formula: (Claims Settled ÷ Total Claims) × 100. A higher CSR indicates a more reliable insurer. For life insurance, look for CSR above 95%.", hi: "वर्ष में प्राप्त कुल क्लेम में से बीमाकर्ता द्वारा निपटाए गए क्लेम का प्रतिशत। सूत्र: (निपटाए गए क्लेम ÷ कुल क्लेम) × 100। उच्च CSR अधिक विश्वसनीय बीमाकर्ता दर्शाता है। लाइफ इंश्योरेंस के लिए 95% से अधिक CSR चुनें।", hinglish: "Year mein received total claims mein se insurer dwara settle kiye gaye claims ka percentage. Formula: (Claims Settled ÷ Total Claims) × 100. Higher CSR = more reliable insurer. Life insurance ke liye 95% se zyada CSR choose karein." },
    example: { en: "If an insurer received 1,000 claims and settled 970, the CSR is 97%.", hi: "यदि बीमाकर्ता को 1,000 क्लेम मिले और 970 निपटाए, तो CSR 97% है।", hinglish: "Agar insurer ko 1,000 claims mile aur 970 settle kiye, toh CSR 97% hai." },
  },
  {
    term: "Deductible",
    hindi: { en: "Deductible", hi: "कटौती राशि", hinglish: "Deductible" },
    definition: { en: "The amount you must pay out of pocket before the insurer starts paying. Compulsory deductibles are fixed by the insurer. Voluntary deductibles you choose to reduce your premium. Higher voluntary deductible = lower premium but more risk during claims.", hi: "वह राशि जो आपको बीमाकर्ता के भुगतान शुरू करने से पहले जेब से देनी होती है। अनिवार्य कटौती बीमाकर्ता द्वारा निश्चित। स्वैच्छिक कटौती आप प्रीमियम कम करने के लिए चुनते हैं।", hinglish: "Woh amount jo aapko insurer ke payment shuru karne se pehle jeb se deni hoti hai. Compulsory deductible insurer fix karta hai. Voluntary deductible aap premium kam karne ke liye choose karte hain." },
    example: { en: "If your policy has a ₹5,000 deductible and your claim is ₹50,000, you pay ₹5,000 and the insurer pays ₹45,000.", hi: "यदि पॉलिसी में ₹5,000 कटौती है और क्लेम ₹50,000 है, तो आप ₹5,000 देंगे और बीमाकर्ता ₹45,000।", hinglish: "Agar policy mein ₹5,000 deductible hai aur claim ₹50,000 hai, toh aap ₹5,000 denge aur insurer ₹45,000." },
  },
  {
    term: "Endorsement",
    hindi: { en: "Amendment", hi: "अनुमोदन / संशोधन", hinglish: "Amendment" },
    definition: { en: "A written amendment to an insurance policy that changes its terms, conditions, or coverage. Endorsements can add, remove, or modify coverage. They are legally binding once issued by the insurer.", hi: "बीमा पॉलिसी में लिखित संशोधन जो इसकी शर्तें, शर्तें या कवरेज बदलता है। एंडोर्समेंट कवरेज जोड़, हटा या संशोधित कर सकते हैं। बीमाकर्ता द्वारा जारी होने पर कानूनी रूप से बाध्यकारी।", hinglish: "Insurance policy mein likhit amendment jo uski terms, conditions ya coverage change karta hai. Endorsements coverage add, remove ya modify kar sakte hain. Insurer dwara issue hone pe legally binding." },
    example: { en: "You add your new-born baby to your health insurance policy through an endorsement.", hi: "आप एंडोर्समेंट के माध्यम से अपने नवजात शिशु को हेल्थ इंश्योरेंस पॉलिसी में जोड़ते हैं।", hinglish: "Aap endorsement ke madhyam se apne navjat shishu ko health insurance policy mein add karte hain." },
  },
  {
    term: "Exclusion",
    hindi: { en: "Exclusion", hi: "अपवर्जन", hinglish: "Exclusion" },
    definition: { en: "Specific conditions, treatments, or situations that are NOT covered by your insurance policy. Claims for excluded items will be rejected. Always read the exclusions list before buying — it's more important than the inclusions.", hi: "विशिष्ट स्थितियाँ, उपचार या परिस्थितियाँ जो आपकी बीमा पॉलिसी में कवर नहीं हैं। अपवर्जित वस्तुओं के क्लेम अस्वीकृत होंगे। खरीदने से पहले हमेशा अपवर्जन सूची पढ़ें।", hinglish: "Specific conditions, treatments ya situations jo aapki insurance policy mein covered nahi hain. Excluded items ke claims reject honge. Khareedne se pehle hamesha exclusion list padhein." },
    example: { en: "Your health insurance policy may exclude dental treatment unless it's due to an accident.", hi: "आपकी हेल्थ इंश्योरेंस पॉलिसी डेंटल ट्रीटमेंट को अपवर्जित कर सकती है जब तक वह दुर्घटना के कारण न हो।", hinglish: "Aapki health insurance policy dental treatment ko exclude kar sakti hai jab tak woh accident ki wajah se na ho." },
  },
  {
    term: "Free-look Period",
    hindi: { en: "Free-look Period", hi: "मुफ्त देखने की अवधि", hinglish: "Free-look Period" },
    definition: { en: "A 15-30 day window after receiving your policy document during which you can return the policy and get a full refund (minus stamp duty and proportionate risk premium). This protects you from mis-selling. Available for all life and health insurance policies in India.", hi: "पॉलिसी दस्तावेज़ प्राप्ति के बाद 15-30 दिन की अवधि जिसमें आप पॉलिसी वापस कर पूर्ण रिफंड पा सकते हैं। यह गलत बिक्री से बचाता है। भारत में सभी लाइफ और हेल्थ पॉलिसियों के लिए उपलब्ध।", hinglish: "15-30 day window policy document receive karne ke baad jismein aap policy return kar full refund paa sakte hain. Yeh mis-selling se bachata hai. India mein sabhi life aur health policies ke liye available." },
    example: { en: "You buy a policy online, read the terms, and decide it's not right. Cancel within 15 days for a full refund.", hi: "आप ऑनलाइन पॉलिसी खरीदते हैं, शर्तें पढ़ते हैं, और तय करते हैं कि यह सही नहीं है। 15 दिन के भीतर रद्द करें।", hinglish: "Aap online policy khareedte hain, terms padhte hain, aur decide karte hain ki yeh sahi nahi hai. 15 din ke bheetar cancel karein." },
  },
  {
    term: "Grace Period",
    hindi: { en: "Grace Period", hi: "अनुग्रह अवधि", hinglish: "Grace Period" },
    definition: { en: "The extra time (15-30 days) after the premium due date during which you can pay without the policy lapsing. For yearly/half-yearly modes, grace period is 30 days. For monthly/quarterly, it's 15 days. Coverage continues during the grace period.", hi: "प्रीमियम नियत तारीख़ के बाद अतिरिक्त समय (15-30 दिन) जिसमें आप बिना पॉलिसी लैप्स किए भुगतान कर सकते हैं। वार्षिक/अर्ध-वार्षिक के लिए 30 दिन। मासिक/त्रैमासिक के लिए 15 दिन।", hinglish: "Premium due date ke baad extra time (15-30 din) jismein aap bina policy lapse kiye payment kar sakte hain. Yearly/half-yearly ke liye 30 din. Monthly/quarterly ke liye 15 din." },
    example: { en: "Your premium is due on January 1st. You have until January 31st to pay without losing coverage.", hi: "आपका प्रीमियम 1 जनवरी को देय है। आपके पास कवरेज खोए बिना 31 जनवरी तक भुगतान करने का समय है।", hinglish: "Aapka premium 1 January ko due hai. Aapke paas coverage khoye bina 31 January tak payment karne ka time hai." },
  },
  {
    term: "ICR (Incurred Claims Ratio)",
    hindi: { en: "Incurred Claims Ratio", hi: "व्यय क्लेम अनुपात", hinglish: "Incurred Claims Ratio" },
    definition: { en: "The ratio of total claims paid by an insurer to the total premium collected, expressed as a percentage. ICR between 60-90% is healthy. Below 60% suggests strict claim handling. Above 100% means the insurer is paying more than earning.", hi: "बीमाकर्ता द्वारा भुगतान किए गए कुल क्लेम का कुल प्रीमियम से अनुपात। ICR 60-90% स्वस्थ है। 60% से कम सख्त क्लेम हैंडलिंग। 100% से अधिक का मतलब बीमाकर्ता कमा से ज़्यादा दे रहा है।", hinglish: "Insurer dwara paid total claims ka total premium se ratio. ICR 60-90% healthy hai. 60% se kam strict claim handling. 100% se zyada matlab insurer kam se zyada de raha hai." },
    example: { en: "If an insurer collected ₹100Cr in premiums and paid ₹75Cr in claims, the ICR is 75%.", hi: "यदि बीमाकर्ता ने ₹100 करोड़ प्रीमियम एकत्र किया और ₹75 करोड़ क्लेम भुगतान किए, तो ICR 75% है।", hinglish: "Agar insurer ne ₹100Cr premium collect kiya aur ₹75Cr claims pay kiye, toh ICR 75% hai." },
  },
  {
    term: "IDV (Insured Declared Value)",
    hindi: { en: "Insured Declared Value", hi: "बीमित घोषित मूल्य", hinglish: "Insured Declared Value" },
    definition: { en: "The current market value of your vehicle — the maximum amount your insurer will pay if your vehicle is stolen or declared a total loss. IDV = Ex-showroom price minus depreciation based on vehicle age. A higher IDV means higher premium but better claim payout.", hi: "आपके वाहन का वर्तमान बाज़ार मूल्य — चोरी या पूर्ण हानि पर बीमाकर्ता द्वारा देय अधिकतम राशि। IDV = एक्स-शोरूम मूल्य घटा वाहन आयु के आधार पर ह्रास। उच्च IDV = उच्च प्रीमियम लेकिन बेहतर क्लेम भुगतान।", hinglish: "Aapke vehicle ka current market value — theft ya total loss pe insurer dwara max payable amount. IDV = Ex-showroom price minus depreciation based on vehicle age. Higher IDV = higher premium lekin better claim payout." },
    example: { en: "A car with ex-showroom price ₹10L after 2 years has IDV of approximately ₹8L (after 20% depreciation).", hi: "एक्स-शोरूम मूल्य ₹10 लाख वाली कार 2 वर्ष बाद लगभग ₹8 लाख IDV (20% ह्रास के बाद)।", hinglish: "Ex-showroom price ₹10L wali car 2 saal baad approx ₹8L IDV (20% depreciation ke baad)." },
    relatedLink: { label: { en: "Zero Dep Car Insurance", hi: "ज़ीरो डेप कार बीमा", hinglish: "Zero Dep Car Insurance" }, href: "/zero-dep-car-insurance" },
  },
  {
    term: "Maturity Benefit",
    hindi: { en: "Maturity Benefit", hi: "परिपक्वता लाभ", hinglish: "Maturity Benefit" },
    definition: { en: "The lump sum amount you receive when a life insurance policy completes its full term. Available in endowment, money-back, and ULIP plans — NOT in term insurance. Maturity Benefit = Sum Assured + Accrued Bonus (if any).", hi: "लाइफ इंश्योरेंस पॉलिसी पूरी अवधि पूरी करने पर मिलने वाली एकमुश्त राशि। एंडोमेंट, मनी-बैक और ULIP में उपलब्ध — टर्म इंश्योरेंस में नहीं।", hinglish: "Life insurance policy poori term complete karne pe milne wali lump sum amount. Endowment, money-back aur ULIP mein available — term insurance mein nahi." },
    example: { en: "Your ₹10L endowment policy matures after 20 years. You receive ₹10L + ₹4L bonus = ₹14L.", hi: "आपकी ₹10 लाख एंडोमेंट पॉलिसी 20 वर्ष बाद परिपक्व होती है। आपको ₹10 लाख + ₹4 लाख बोनस = ₹14 लाख मिलते हैं।", hinglish: "Aapki ₹10L endowment policy 20 saal baad mature hoti hai. Aapko ₹10L + ₹4L bonus = ₹14L milte hain." },
  },
  {
    term: "NCB (No Claim Bonus)",
    hindi: { en: "No Claim Bonus", hi: "बिना क्लेम बोनस", hinglish: "No Claim Bonus" },
    definition: { en: "A discount on the Own Damage (OD) premium for every claim-free year in motor insurance. NCB starts at 20% after 1 year and increases to 50% after 5+ claim-free years. NCB belongs to the policyholder, not the vehicle. A single claim resets it to zero.", hi: "मोटर बीमे में हर क्लेम-मुक्त वर्ष पर ओन डैमेज (OD) प्रीमियम पर छूट। NCB 1 वर्ष बाद 20% से शुरू होकर 5+ क्लेम-मुक्त वर्षों बाद 50% तक बढ़ती है। NCB पॉलिसीधारक का है, वाहन का नहीं।", hinglish: "Motor insurance mein har claim-free year pe Own Damage (OD) premium pe discount. NCB 1 year baad 20% se shuru hoti hai aur 5+ claim-free years baad 50% tak badhti hai. NCB policyholder ka hai, vehicle ka nahi." },
    example: { en: "After 5 claim-free years, you get a 50% discount on your OD premium of ₹15,000 — saving ₹7,500.", hi: "5 क्लेम-मुक्त वर्षों बाद, आपको ₹15,000 के OD प्रीमियम पर 50% छूट — ₹7,500 की बचत।", hinglish: "5 claim-free years baad, aapko ₹15,000 ke OD premium pe 50% discount — ₹7,500 ki bachat." },
    relatedLink: { label: { en: "Zero Dep Car Insurance", hi: "ज़ीरो डेप कार बीमा", hinglish: "Zero Dep Car Insurance" }, href: "/zero-dep-car-insurance" },
  },
  {
    term: "Nomination",
    hindi: { en: "Nomination", hi: "नामांकन", hinglish: "Nomination" },
    definition: { en: "The process of appointing a person (nominee) who will receive the policy proceeds after the policyholder's death. The nominee acts as a trustee for the legal heirs. You can change the nominee anytime during the policy term.", hi: "एक व्यक्ति (नॉमिनी) को नियुक्त करने की प्रक्रिया जो पॉलिसीधारक की मृत्यु के बाद पॉलिसी राशि प्राप्त करेगा। नॉमिनी कानूनी उत्तराधिकारियों के लिए ट्रस्टी के रूप में कार्य करता है। आप पॉलिसी अवधि में कभी भी नॉमिनी बदल सकते हैं।", hinglish: "Ek vyakti (nominee) ko appoint karne ki process jo policyholder ki death ke baad policy proceeds receive karega. Nominee legal heirs ke liye trustee ke roop mein kaam karta hai. Aap policy term mein kabhi bhi nominee badal sakte hain." },
    example: { en: "You nominate your wife as 60% nominee and your son as 40% nominee for your ₹1 crore term insurance.", hi: "आप अपनी पत्नी को 60% और बेटे को 40% नॉमिनी के रूप में नामांकित करते हैं।", hinglish: "Aap apni wife ko 60% aur bete ko 40% nominee ke roop mein nominate karte hain." },
  },
  {
    term: "OD (Own Damage)",
    hindi: { en: "Own Damage", hi: "स्वयं की क्षति", hinglish: "Own Damage" },
    definition: { en: "The component of motor insurance that covers damage to your own vehicle due to accidents, theft, fire, natural calamities, and man-made disasters. OD is optional (unlike TP which is mandatory) but highly recommended. OD premium depends on IDV, vehicle age, cubic capacity, and NCB.", hi: "मोटर बीमे का घटक जो दुर्घटना, चोरी, आग, प्राकृतिक आपदा और मानव निर्मित आपदा से आपके वाहन की क्षति कवर करता है। OD वैकल्पिक (TP अनिवार्य के विपरीत) लेकिन अत्यधिक अनुशंसित।", hinglish: "Motor insurance ka component jo accidents, theft, fire, natural calamities aur man-made disasters se aapke vehicle ki damage cover karta hai. OD optional (TP mandatory ke viparit) lekin highly recommended." },
    example: { en: "A tree falls on your parked car — OD cover pays for the repair. TP would not cover this.", hi: "पार्क की गई कार पर पेड़ गिरता है — OD कवर मरम्मत के लिए भुगतान करता है। TP इसे कवर नहीं करता।", hinglish: "Parked car pe ped girta hai — OD cover repair ke liye payment karta hai. TP isse cover nahi karta." },
  },
  {
    term: "PED (Pre-existing Disease)",
    hindi: { en: "Pre-existing Disease", hi: "पूर्व-मौजूदा बीमारी", hinglish: "Pre-existing Disease" },
    definition: { en: "Any health condition, ailment, or injury that existed before the health insurance policy start date. Common PEDs include diabetes, hypertension, thyroid disorders, and asthma. Most insurers cover PEDs after a waiting period of 1-4 years. Non-disclosure of PEDs is the #1 reason for claim rejection.", hi: "कोई भी स्वास्थ्य स्थिति जो हेल्थ इंश्योरेंस पॉलिसी शुरू होने से पहले मौजूद थी। सामान्य PED — मधुमेह, उच्च रक्तचाप, थायरॉइड, अस्थमा। अधिकांश बीमाकर्ता 1-4 वर्ष प्रतीक्षा अवधि के बाद PED कवर करते हैं। PED छुपाना क्लेम अस्वीकृति का #1 कारण।", hinglish: "Koi bhi health condition jo health insurance policy start hone se pehle mojud thi. Common PED — diabetes, hypertension, thyroid, asthma. Zyadaatar insurers 1-4 years waiting period ke baad PED cover karte hain. PED chhupana claim rejection ka #1 reason." },
    example: { en: "You have diabetes before buying health insurance. After a 2-year waiting period, diabetes-related treatments are covered.", hi: "आपको हेल्थ इंश्योरेंस खरीदने से पहले मधुमेह है। 2 वर्ष की प्रतीक्षा अवधि के बाद, मधुमेह संबंधित उपचार कवर होते हैं।", hinglish: "Aapko health insurance khareedne se pehle diabetes hai. 2 saal ki waiting period ke baad, diabetes-related treatments covered hain." },
    relatedLink: { label: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" }, href: "/health-insurance" },
  },
  {
    term: "Portability",
    hindi: { en: "Portability", hi: "पोर्टेबिलिटी", hinglish: "Portability" },
    definition: { en: "The right to switch your health insurance from one insurer to another while retaining your accumulated benefits like waiting period credits and no-claim bonus. Apply at least 45 days before your renewal date. IRDAI mandates the new insurer to process within 30 days.", hi: "एक बीमाकर्ता से दूसरे में हेल्थ इंश्योरेंस बदलने का अधिकार जमा लाभ — प्रतीक्षा अवधि क्रेडिट और नो-क्लेम बोनस बनाए रखते हुए। नवीनीकरण से 45 दिन पहले आवेदन करें।", hinglish: "Ek insurer se dusre mein health insurance badalne ka haq accumulated benefits — waiting period credits aur no-claim bonus retain karte hue. Renewal se 45 din pehle apply karein." },
    example: { en: "You switch from Insurer A to Insurer B after 3 years. Your 3-year waiting period credit carries over.", hi: "आप 3 वर्ष बाद बीमाकर्ता A से B में स्विच करते हैं। आपका 3 वर्ष का प्रतीक्षा अवधि क्रेडिट ट्रांसफर होता है।", hinglish: "Aap 3 saal baad Insurer A se B mein switch karte hain. Aapka 3-year waiting period credit transfer hota hai." },
  },
  {
    term: "Premium",
    hindi: { en: "Premium", hi: "प्रीमियम / बीमा शुल्क", hinglish: "Premium" },
    definition: { en: "The amount you pay (annually, half-yearly, quarterly, or monthly) to the insurer to keep your insurance policy active. Premium depends on: sum insured, age, health condition, occupation, policy type, add-ons, and claim history. Failure to pay before the grace period leads to policy lapse.", hi: "आप बीमा पॉलिसी सक्रिय रखने के लिए बीमाकर्ता को जो राशि (वार्षिक, अर्ध-वार्षिक, त्रैमासिक, या मासिक) देते हैं। प्रीमियम बीमित राशि, आयु, स्वास्थ्य, पेशा, पॉलिसी प्रकार पर निर्भर। अनुग्रह अवधि से पहले भुगतान न करने पर पॉलिसी लैप्स।", hinglish: "Woh amount jo aap insurance policy active rakhne ke liye insurer ko dete hain (yearly, half-yearly, quarterly, ya monthly). Premium sum insured, age, health, occupation, policy type pe depend karta hai. Grace period se pehle payment na karne pe policy lapse." },
    example: { en: "You pay ₹12,000 per year (premium) for a ₹5 lakh health insurance policy.", hi: "आप ₹5 लाख की हेल्थ इंश्योरेंस पॉलिसी के लिए ₹12,000 प्रति वर्ष (प्रीमियम) देते हैं।", hinglish: "Aap ₹5 lakh ki health insurance policy ke liye ₹12,000 per year (premium) dete hain." },
  },
  {
    term: "Reimbursement Claim",
    hindi: { en: "Reimbursement Claim", hi: "प्रतिपूर्ति क्लेम", hinglish: "Reimbursement Claim" },
    definition: { en: "A claim where you pay the hospital or garage first, then submit bills and documents to the insurer for repayment. Unlike cashless claims, reimbursement works at any hospital. Processing takes 7-30 days. You must submit original bills and discharge summary.", hi: "क्लेम जहाँ आप पहले अस्पताल या गैराज को भुगतान करते हैं, फिर बीमाकर्ता को बिल और दस्तावेज़ प्रतिपूर्ति के लिए जमा करते हैं। कैशलेस के विपरीत, प्रतिपूर्ति किसी भी अस्पताल में काम करती है। प्रोसेसिंग 7-30 दिन।", hinglish: "Claim jahan aap pehle hospital ya garage ko payment karte hain, phir insurer ko bills aur documents repayment ke liye submit karte hain. Cashless ke viparit, reimbursement kisi bhi hospital mein kaam karta hai. Processing 7-30 din." },
    example: { en: "You pay ₹2L at a non-network hospital. Submit bills to insurer. Get ₹1.8L reimbursed (after co-pay deductions).", hi: "आप नॉन-नेटवर्क अस्पताल में ₹2 लाख भुगतान करते हैं। बीमाकर्ता को बिल जमा करें। ₹1.8 लाख प्रतिपूर्ति (को-पे कटौती के बाद)।", hinglish: "Aap non-network hospital mein ₹2L payment karte hain. Insurer ko bills submit karein. ₹1.8L reimbursement (co-pay deduction ke baad)." },
  },
  {
    term: "Restore Benefit",
    hindi: { en: "Restore Benefit", hi: "रिस्टोर लाभ", hinglish: "Restore Benefit" },
    definition: { en: "A feature in health insurance that automatically reinstates your sum insured if it gets exhausted during the policy year. The restored amount is usually equal to the base sum insured. Especially valuable for family floater plans.", hi: "हेल्थ इंश्योरेंस की सुविधा जो पॉलिसी वर्ष में बीमित राशि समाप्त होने पर स्वचालित रूप से पुनर्स्थापित करती है। रिस्टोर की गई राशि आमतौर पर बेस बीमित राशि के बराबर। फैमिली फ्लोटर प्लान के लिए विशेष रूप से मूल्यवान।", hinglish: "Health insurance ki feature jo policy year mein sum insured exhaust hone pe automatically reinstate karti hai. Restored amount usually base sum insured ke barabar hota hai. Family floater plans ke liye especially valuable." },
    example: { en: "Your ₹10L family floater gets fully used. Restore benefit adds another ₹10L for future claims in the same year.", hi: "आपका ₹10 लाख फैमिली फ्लोटर पूरी तरह खत्म। रिस्टोर बेनिफिट उसी वर्ष भविष्य के क्लेम के लिए ₹10 लाख और जोड़ता है।", hinglish: "Aapka ₹10L family floater fully use ho gaya. Restore benefit usi year future claims ke liye ₹10L aur add karta hai." },
  },
  {
    term: "Rider",
    hindi: { en: "Rider", hi: "राइडर / अतिरिक्त लाभ", hinglish: "Rider" },
    definition: { en: "An optional add-on to a life insurance policy that provides additional benefits beyond the base cover. Common riders include Critical Illness, Accidental Death Benefit, Waiver of Premium, and Income Benefit. Riders cost ₹200-2,000/year extra — much cheaper than separate standalone policies.", hi: "लाइफ इंश्योरेंस पॉलिसी का वैकल्पिक ऐड-ऑन जो बेस कवर से अधिक अतिरिक्त लाभ देता है। सामान्य राइडर — क्रिटिकल इलनेस, एक्सीडेंटल डेथ बेनिफिट, वेवर ऑफ प्रीमियम। राइडर ₹200-2,000/वर्ष अतिरिक्त — अलग पॉलिसी से बहुत सस्ते।", hinglish: "Life insurance policy ka optional add-on jo base cover se zyada extra benefits deta hai. Common riders — Critical Illness, Accidental Death Benefit, Waiver of Premium. Riders ₹200-2,000/year extra — alag policy se kaafi saste." },
    example: { en: "You add a Critical Illness Rider of ₹25L to your ₹1 crore term plan for just ₹1,500/year extra.", hi: "आप अपने ₹1 करोड़ टर्म प्लान में महज़ ₹1,500/वर्ष अतिरिक्त में ₹25 लाख का क्रिटिकल इलनेस राइडर जोड़ते हैं।", hinglish: "Aap apne ₹1 crore term plan mein sirf ₹1,500/year extra mein ₹25L ka Critical Illness Rider add karte hain." },
  },
  {
    term: "Room Rent Cap",
    hindi: { en: "Room Rent Limit", hi: "कमरा किराया सीमा", hinglish: "Room Rent Limit" },
    definition: { en: "The maximum daily room charge that your health insurance will cover, usually expressed as 1-2% of your sum insured. If you choose a room above this limit, you may have to pay the difference proportionally — and this can also increase your overall hospital bill.", hi: "अधिकतम दैनिक कमरा शुल्क जो आपका हेल्थ इंश्योरेंस कवर करेगा, आमतौर पर बीमित राशि का 1-2%। यदि आप इस सीमा से ऊपर का कमरा चुनते हैं, तो आपको अनुपातिक अंतर भुगतान करना पड़ सकता है।", hinglish: "Maximum daily room charge jo aapka health insurance cover karega, usually 1-2% of sum insured. Agar aap is limit se upar ka room choose karte hain, toh aapko proportionally difference pay karna pad sakta hai." },
    example: { en: "For a ₹5L policy with 1% room rent cap, the insurer covers up to ₹5,000/day for room charges.", hi: "₹5 लाख की पॉलिसी 1% कमरा किराया सीमा के साथ, बीमाकर्ता कमरा शुल्क के लिए ₹5,000/दिन तक कवर करता है।", hinglish: "₹5L policy 1% room rent cap ke saath, insurer room charges ke liye ₹5,000/day tak cover karta hai." },
  },
  {
    term: "Solvency Ratio",
    hindi: { en: "Solvency Ratio", hi: "देयता पर्याप्तता अनुपात", hinglish: "Solvency Ratio" },
    definition: { en: "A measure of an insurance company's financial health and ability to pay claims. IRDAI mandates a minimum solvency ratio of 1.5 (150%). Higher solvency ratio = more financially stable insurer.", hi: "बीमा कंपनी के वित्तीय स्वास्थ्य और क्लेम भुगतान क्षमता का माप। IRDAI न्यूनतम 1.5 (150%) सॉल्वेंसी रेशियो अनिवार्य करता है। उच्च सॉल्वेंसी = अधिक वित्तीय रूप से स्थिर बीमाकर्ता।", hinglish: "Insurance company ke financial health aur claim payment capability ka measure. IRDAI minimum 1.5 (150%) solvency ratio mandatory karta hai. Higher solvency = more financially stable insurer." },
    example: { en: "If an insurer has ₹150Cr in assets and ₹100Cr in liabilities, its solvency ratio is 1.5 (150%).", hi: "यदि बीमाकर्ता के ₹150 करोड़ संपत्ति और ₹100 करोड़ देयताएँ हैं, तो सॉल्वेंसी रेशियो 1.5 (150%) है।", hinglish: "Agar insurer ke ₹150Cr assets aur ₹100Cr liabilities hain, toh solvency ratio 1.5 (150%) hai." },
  },
  {
    term: "Sum Insured",
    hindi: { en: "Sum Insured", hi: "बीमित राशि", hinglish: "Sum Insured" },
    definition: { en: "The maximum amount the insurer will pay in case of a claim. For health insurance, it's the total coverage for medical expenses. For motor insurance, it equals the IDV. For life insurance, it's called Sum Assured. Choose your sum insured carefully — under-insurance is the most common mistake.", hi: "क्लेम की स्थिति में बीमाकर्ता द्वारा देय अधिकतम राशि। हेल्थ इंश्योरेंस में चिकित्सा खर्चों के लिए कुल कवरेज। मोटर बीमे में IDV के बराबर। लाइफ इंश्योरेंस में इसे सम एश्योर्ड कहते हैं। अंडर-इंश्योरेंस सबसे आम गलती है।", hinglish: "Claim ki sthiti mein insurer dwara payable maximum amount. Health insurance mein medical expenses ke liye total coverage. Motor insurance mein IDV ke barabar. Life insurance mein isse Sum Assured kehte hain. Under-insurance sabse aam galti hai." },
    example: { en: "You have a ₹10L sum insured health policy. Your maximum claim payout is ₹10L per policy year.", hi: "आपकी ₹10 लाख बीमित राशि वाली हेल्थ पॉलिसी। अधिकतम क्लेम भुगतान ₹10 लाख प्रति पॉलिसी वर्ष।", hinglish: "Aapki ₹10L sum insured wali health policy. Maximum claim payout ₹10L per policy year." },
  },
  {
    term: "Surrender Value",
    hindi: { en: "Surrender Value", hi: "समर्पण मूल्य", hinglish: "Surrender Value" },
    definition: { en: "The amount you receive if you exit a life insurance policy before its maturity date. Guaranteed surrender value (available after 3 full years) equals 30% of total premiums paid minus first year premium. Term insurance has no surrender value.", hi: "यदि आप परिपक्वता से पहले लाइफ इंश्योरेंस पॉलिसी से बाहर निकलते हैं तो मिलने वाली राशि। गारंटीड सरेंडर वैल्यू (3 वर्ष बाद) कुल प्रीमियम का 30% घटा पहले वर्ष का प्रीमियम। टर्म इंश्योरेंस में कोई समर्पण मूल्य नहीं।", hinglish: "Amount jo aapko milta hai agar aap maturity se pehle life insurance policy se bahar nikalte hain. Guaranteed surrender value (3 saal baad) total premium ka 30% minus first year premium. Term insurance mein koi surrender value nahi." },
    example: { en: "You paid ₹50,000/year for 5 years on a ₹10L endowment policy. Guaranteed surrender value ≈ ₹60,000.", hi: "आपने ₹10 लाख एंडोमेंट पॉलिसी पर ₹50,000/वर्ष 5 वर्ष तक दिए। गारंटीड सरेंडर वैल्यू ≈ ₹60,000।", hinglish: "Aapne ₹10L endowment policy pe ₹50,000/year 5 saal tak diye. Guaranteed surrender value ≈ ₹60,000." },
  },
  {
    term: "TP (Third-Party Insurance)",
    hindi: { en: "Third-Party Insurance", hi: "थर्ड-पार्टी बीमा", hinglish: "Third-Party Insurance" },
    definition: { en: "Mandatory motor insurance that covers your legal liability for injury, death, or property damage caused to a third party by your vehicle. TP rates are fixed by IRDAI based on engine capacity. TP does NOT cover damage to your own vehicle. Driving without TP is illegal.", hi: "अनिवार्य मोटर बीमा जो आपके वाहन द्वारा तीसरे पक्ष को चोट, मृत्यु या संपत्ति क्षति के लिए आपकी कानूनी देयता कवर करता है। TP दरें IRDAI इंजन क्षमता के आधार पर तय करता है। TP आपके वाहन की क्षति कवर नहीं करता।", hinglish: "Mandatory motor insurance jo aapke vehicle dwara teesre paksh ko chot, maut ya sampatti kshati ke liye aapki legal liability cover karta hai. TP rates IRDAI engine capacity ke basis pe fix karta hai. TP aapke vehicle ki damage cover nahi karta." },
    example: { en: "Your car hits a pedestrian. TP insurance covers the pedestrian's medical expenses and your legal liability.", hi: "आपकी कार पैदल यात्री से टकराती है। TP बीमा पैदल यात्री के चिकित्सा खर्च और आपकी कानूनी देयता कवर करता है।", hinglish: "Aapki car pedestrian se takrati hai. TP insurance pedestrian ke medical expenses aur aapki legal liability cover karta hai." },
  },
  {
    term: "Underwriting",
    hindi: { en: "Underwriting", hi: "अंडरराइटिंग / जोखिम मूल्यांकन", hinglish: "Underwriting" },
    definition: { en: "The process by which an insurer evaluates your risk profile (age, health, occupation, lifestyle, claims history) to decide whether to offer coverage and at what premium. Favorable underwriting results in standard or lower premiums. Honest disclosure is critical.", hi: "वह प्रक्रिया जिसमें बीमाकर्ता आपकी जोखिम प्रोफ़ाइल (आयु, स्वास्थ्य, पेशा, जीवनशैली, क्लेम इतिहास) का मूल्यांकन कवरेज और प्रीमियम तय करने के लिए करता है। ईमानदार प्रकटीकरण महत्वपूर्ण है।", hinglish: "Process jismein insurer aapki risk profile (age, health, occupation, lifestyle, claims history) evaluate karta hai coverage aur premium decide karne ke liye. Honest disclosure important hai." },
    example: { en: "A 30-year-old non-smoker gets preferred rates. A 50-year-old smoker pays 50-100% more for the same term plan.", hi: "30 वर्ष का गैर-धूम्रपान व्यक्ति अधिमान्य दरें पाता है। 50 वर्ष का धूम्रपान करने वाला उसी टर्म प्लान के लिए 50-100% अधिक भुगतान करता है।", hinglish: "30 saal ka non-smoker preferred rates pata hai. 50 saal ka smoker usi term plan ke liye 50-100% zyada pay karta hai." },
  },
  {
    term: "Waiting Period",
    hindi: { en: "Waiting Period", hi: "प्रतीक्षा अवधि", hinglish: "Waiting Period" },
    definition: { en: "The time period during which certain benefits of your insurance policy are not available. Common waiting periods: Initial (30 days), Pre-existing disease (1-4 years), Specific diseases (1-2 years), Maternity (9 months - 2 years). Claims filed during waiting period are rejected except for accidents.", hi: "वह समय जिसमें बीमा पॉलिसी के कुछ लाभ उपलब्ध नहीं होते। सामान्य प्रतीक्षा अवधि: प्रारंभिक (30 दिन), पूर्व-मौजूदा बीमारी (1-4 वर्ष), विशिष्ट रोग (1-2 वर्ष), मातृत्व (9 महीने - 2 वर्ष)। दुर्घटना को छोड़कर प्रतीक्षा अवधि में क्लेम अस्वीकृत।", hinglish: "Woh time jismein insurance policy ke kuch benefits available nahi hote. Common waiting periods: Initial (30 din), Pre-existing disease (1-4 saal), Specific diseases (1-2 saal), Maternity (9 mahine - 2 saal). Accident ko chodke waiting period mein claims reject." },
    example: { en: "You buy a health policy with a 2-year PED waiting period. Diabetes treatment is not covered for the first 2 years.", hi: "आप 2 वर्ष PED प्रतीक्षा अवधि वाली हेल्थ पॉलिसी खरीदते हैं। 2 वर्ष तक मधुमेह उपचार कवर नहीं।", hinglish: "Aap 2 saal PED waiting period wali health policy khareedte hain. 2 saal tak diabetes treatment covered nahi." },
    relatedLink: { label: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" }, href: "/health-insurance" },
  },
  {
    term: "Zero Depreciation (Zero Dep)",
    hindi: { en: "Zero Depreciation", hi: "ज़ीरो डेप्रिसिएशन / शून्य मूल्यह्रास", hinglish: "Zero Depreciation" },
    definition: { en: "An add-on cover in motor insurance where the insurer pays the full cost of parts replacement without deducting depreciation. Without Zero Dep, you bear 30-50% cost of plastic, rubber, and fiber parts during claims. Available for vehicles up to 5-7 years old. Costs 15-20% extra premium but saves thousands during claims.", hi: "मोटर बीमे में ऐड-ऑन कवर जहाँ बीमाकर्ता पुर्ज़ों की बदली की पूरी लागत बिना ह्रास काटे देता है। ज़ीरो डेप के बिना, आप क्लेम में प्लास्टिक, रबर, फाइबर पुर्ज़ों की 30-50% लागत वहन करते हैं। 5-7 वर्ष तक के वाहनों के लिए उपलब्ध।", hinglish: "Motor insurance mein add-on cover jahan insurer parts replacement ki full cost bina depreciation kaate deta hai. Zero Dep ke bina, aap claim mein plastic, rubber, fiber parts ki 30-50% cost bear karte hain. 5-7 saal tak ke vehicles ke liye available." },
    example: { en: "Without Zero Dep: ₹30,000 bumper replacement → you pay ₹15,000. With Zero Dep → you pay ₹0 (only compulsory deductible).", hi: "ज़ीरो डेप के बिना: ₹30,000 बम्पर बदली → आप ₹15,000 देंगे। ज़ीरो डेप के साथ → आप ₹0 (केवल अनिवार्य कटौती)।", hinglish: "Zero Dep ke bina: ₹30,000 bumper replacement → aap ₹15,000 denge. Zero Dep ke saath → aap ₹0 (sirf compulsory deductible)." },
    relatedLink: { label: { en: "Zero Dep Car Insurance", hi: "ज़ीरो डेप कार बीमा", hinglish: "Zero Dep Car Insurance" }, href: "/zero-dep-car-insurance" },
  },
];

// Group terms by first letter
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const termsByLetter: Record<string, GlossaryTerm[]> = {};
glossary.forEach((item) => {
  const letter = item.term[0].toUpperCase();
  if (!termsByLetter[letter]) termsByLetter[letter] = [];
  termsByLetter[letter].push(item);
});

// Quick reference data with i18n
const refData = [
  { abbr: "IDV", full: { en: "Insured Declared Value", hi: "बीमित घोषित मूल्य", hinglish: "Insured Declared Value" }, hindi: "बीमित घोषित मूल्य", why: { en: "Decides your car's claim payout", hi: "आपकी कार का क्लेम भुगतान तय करता है", hinglish: "Aapki car ka claim payout decide karta hai" } },
  { abbr: "NCB", full: { en: "No Claim Bonus", hi: "बिना क्लेम बोनस", hinglish: "No Claim Bonus" }, hindi: "बिना क्लेम बोनस", why: { en: "Up to 50% discount on OD premium", hi: "OD प्रीमियम पर 50% तक छूट", hinglish: "OD premium pe 50% tak discount" } },
  { abbr: "PED", full: { en: "Pre-existing Disease", hi: "पूर्व-मौजूदा बीमारी", hinglish: "Pre-existing Disease" }, hindi: "पूर्व-मौजूदा बीमारी", why: { en: "Must declare — else claim rejection", hi: "घोषित करना ज़रूरी — वरना क्लेम अस्वीकृति", hinglish: "Declare karna zaroori — warna claim rejection" } },
  { abbr: "CSR", full: { en: "Claims Settlement Ratio", hi: "क्लेम निपटान अनुपात", hinglish: "Claims Settlement Ratio" }, hindi: "क्लेम निपटान अनुपात", why: { en: "Higher = more reliable insurer", hi: "अधिक = अधिक विश्वसनीय बीमाकर्ता", hinglish: "Higher = more reliable insurer" } },
  { abbr: "ICR", full: { en: "Incurred Claims Ratio", hi: "व्यय क्लेम अनुपात", hinglish: "Incurred Claims Ratio" }, hindi: "व्यय क्लेम अनुपात", why: { en: "60-90% = healthy insurer", hi: "60-90% = स्वस्थ बीमाकर्ता", hinglish: "60-90% = healthy insurer" } },
  { abbr: "TP", full: { en: "Third-Party Insurance", hi: "थर्ड-पार्टी बीमा", hinglish: "Third-Party Insurance" }, hindi: "थर्ड-पार्टी बीमा", why: { en: "Mandatory by law for all vehicles", hi: "सभी वाहनों के लिए कानून द्वारा अनिवार्य", hinglish: "Sabhi vehicles ke liye law dwara mandatory" } },
  { abbr: "OD", full: { en: "Own Damage", hi: "स्वयं की क्षति", hinglish: "Own Damage" }, hindi: "स्वयं की क्षति", why: { en: "Covers your own vehicle damage", hi: "आपके वाहन की क्षति कवर करता है", hinglish: "Aapke vehicle ki damage cover karta hai" } },
  { abbr: "Zero Dep", full: { en: "Zero Depreciation", hi: "शून्य मूल्यह्रास", hinglish: "Zero Depreciation" }, hindi: "शून्य मूल्यह्रास", why: { en: "Full claim without depreciation cut", hi: "ह्रास कटौती के बिना पूर्ण क्लेम", hinglish: "Full claim bina depreciation cut ke" } },
];

// ── Client Component ────────────────────────────────────────────────────────
export default function ClientContent() {
  const { language } = useLanguage();

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
            {pt(pageText.hero.title1, language)} <span className="gradient-text">{pt(pageText.hero.titleHighlight, language)}</span> {pt(pageText.hero.titleSuffix, language)}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            {pt(pageText.hero.desc, language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/919257877312?text=Hi%20Paliwal%20Secure%2C%20I%20need%20help%20understanding%20insurance%20terms" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue"><span>{pt(pageText.hero.ctaWhatsApp, language)}</span></ShinyButton>
            </a>
            <Link href="/insurance-faq">
              <ShinyButton variant="secondary"><span>{pt(pageText.hero.ctaFAQ, language)}</span></ShinyButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Alphabet Navigation */}
      <section className="py-4 md:py-6 sticky top-0 z-30 bg-background/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {alphabet.map((letter) => {
              const hasTerms = termsByLetter[letter] && termsByLetter[letter].length > 0;
              return (
                <a
                  key={letter}
                  href={hasTerms ? `#letter-${letter}` : undefined}
                  className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition ${
                    hasTerms
                      ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                      : "bg-muted/30 text-muted-foreground/40 cursor-default"
                  }`}
                  aria-disabled={!hasTerms}
                >
                  {letter}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Glossary Terms */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          {alphabet.map((letter) => {
            const terms = termsByLetter[letter];
            if (!terms || terms.length === 0) return null;
            return (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-24 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground text-lg sm:text-xl font-bold">
                    {letter}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {terms.map((item, idx) => (
                    <div
                      key={idx}
                      className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground">{item.term}</h3>
                        <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-0.5 rounded-full whitespace-nowrap">
                          {pt(item.hindi, language)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {pt(item.definition, language)}
                      </p>
                      {item.example && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-primary mb-1">{pt(pageText.exampleLabel, language)}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{pt(item.example, language)}</p>
                        </div>
                      )}
                      {item.relatedLink && (
                        <Link
                          href={item.relatedLink.href}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                        >
                          {pt(pageText.readMoreLabel, language)} {pt(item.relatedLink.label, language)}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Quick Reference Table */}
      <section className="py-12 md:py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            {pt(pageText.refTable.heading, language)} <span className="gradient-text">{pt(pageText.refTable.headingHighlight, language)}</span> {pt(pageText.refTable.headingSuffix, language)}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse glass-card rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(pageText.refTable.thAbbr, language)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(pageText.refTable.thFull, language)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm gradient-text">{pt(pageText.refTable.thHindi, language)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(pageText.refTable.thWhy, language)}</th>
                </tr>
              </thead>
              <tbody>
                {refData.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-bold text-primary">{row.abbr}</td>
                    <td className="py-3 px-4 text-sm font-medium">{pt(row.full, language)}</td>
                    <td className="py-3 px-4 text-sm text-primary/80">{row.hindi}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{pt(row.why, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {pt(pageText.cta.heading1, language)} <span className="gradient-text">{pt(pageText.cta.headingHighlight, language)}</span>{pt(pageText.cta.headingSuffix, language)}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {pt(pageText.cta.desc, language)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://wa.me/919257877312?text=Hi%20Paliwal%20Secure%2C%20I%20need%20help%20understanding%20insurance%20terms" target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="blue"><span>{pt(pageText.cta.ctaWhatsApp, language)}</span></ShinyButton>
              </a>
              <Link href="/#insuregpt">
                <ShinyButton variant="secondary"><span>{pt(pageText.cta.ctaChat, language)}</span></ShinyButton>
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">{pt(pageText.cta.byline, language)}</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Related Pages */}
      <section className="py-12 md:py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            {pt(pageText.related.heading, language)} <span className="gradient-text">{pt(pageText.related.headingHighlight, language)}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/insurance-faq" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <span className="text-2xl">📋</span>
              <h3 className="font-semibold mt-3 group-hover:text-primary transition">{pt(pageText.related.faqTitle, language)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pt(pageText.related.faqDesc, language)}</p>
            </Link>
            <Link href="/health-insurance" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <span className="text-2xl">🏥</span>
              <h3 className="font-semibold mt-3 group-hover:text-primary transition">{pt(pageText.related.healthTitle, language)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pt(pageText.related.healthDesc, language)}</p>
            </Link>
            <Link href="/zero-dep-car-insurance" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <span className="text-2xl">🚗</span>
              <h3 className="font-semibold mt-3 group-hover:text-primary transition">{pt(pageText.related.zeroDepTitle, language)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pt(pageText.related.zeroDepDesc, language)}</p>
            </Link>
            <Link href="/#reverse-audit" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <span className="text-2xl">🔍</span>
              <h3 className="font-semibold mt-3 group-hover:text-primary transition">{pt(pageText.related.auditTitle, language)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pt(pageText.related.auditDesc, language)}</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
