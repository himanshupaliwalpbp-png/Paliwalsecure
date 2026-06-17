'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import type { Language } from '@/lib/i18n';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "Updated for 2026", hi: "2026 के लिए अपडेटेड", hinglish: "Updated for 2026" },
    title1: { en: "Best Health Insurance India 2026 –", hi: "भारत का सर्वश्रेष्ठ हेल्थ इंश्योरेंस 2026 –", hinglish: "Best Health Insurance India 2026 –" },
    titleHighlight: { en: "Detailed Comparison & Recommendations", hi: "विस्तृत तुलना और सिफारिशें", hinglish: "Detailed Comparison & Recommendations" },
    desc: { en: "We compared 50+ health insurance plans across claim settlement, room rent caps, restore benefits, waiting periods and premiums. Here are the top 5 — with honest pros, cons, and who each plan is really for.", hi: "हमने 50+ हेल्थ इंश्योरेंस योजनाओं की क्लेम सेटलमेंट, रूम रेंट कैप, रिस्टोर बेनिफ़िट, वेटिंग पीरियड और प्रीमियम में तुलना की। यहाँ शीर्ष 5 हैं — ईमानदार फायदे, नुकसान और किसके लिए है।", hinglish: "Humne 50+ health insurance plans ko claim settlement, room rent caps, restore benefits, waiting periods aur premiums mein compare kiya. Yahan top 5 hain — honest pros, cons aur kiske liye hai." },
    ctaRecommend: { en: "Get Free Recommendation", hi: "मुफ़्त सिफारिश प्राप्त करें", hinglish: "Free Recommendation Lo" },
    ctaAudit: { en: "AI Audit My Policy", hi: "AI मेरी पॉलिसी ऑडिट करे", hinglish: "AI Meri Policy Audit Kare" },
  },
  comparison: {
    heading: { en: "Top 5 Health Plans –", hi: "शीर्ष 5 हेल्थ प्लान –", hinglish: "Top 5 Health Plans –" },
    headingHighlight: { en: "Quick Comparison", hi: "त्वरित तुलना", hinglish: "Quick Comparison" },
    thPlan: { en: "Plan", hi: "योजना", hinglish: "Plan" },
    thSumInsured: { en: "Sum Insured", hi: "बीमित राशि", hinglish: "Sum Insured" },
    thPedWait: { en: "PED Wait", hi: "PED प्रतीक्षा", hinglish: "PED Wait" },
    thRestore: { en: "Restore", hi: "रिस्टोर", hinglish: "Restore" },
    thRoomRent: { en: "Room Rent", hi: "रूम रेंट", hinglish: "Room Rent" },
    thCsr: { en: "CSR", hi: "CSR", hinglish: "CSR" },
    thNetwork: { en: "Network", hi: "नेटवर्क", hinglish: "Network" },
    aiPick: { en: "🤖 AI Pick", hi: "🤖 AI चयन", hinglish: "🤖 AI Pick" },
  },
  prosCons: {
    heading: { en: "Detailed Plan", hi: "विस्तृत योजना", hinglish: "Detailed Plan" },
    headingHighlight: { en: "Pros & Cons", hi: "फायदे और नुकसान", hinglish: "Pros & Cons" },
    pros: { en: "✅ Pros", hi: "✅ फायदे", hinglish: "✅ Pros" },
    cons: { en: "❌ Cons", hi: "❌ नुकसान", hinglish: "❌ Cons" },
    bestFor: { en: "Best for:", hi: "सर्वोत्तम:", hinglish: "Best for:" },
  },
  premium: {
    heading: { en: "Premium Estimates –", hi: "प्रीमियम अनुमान –", hinglish: "Premium Estimates –" },
    headingHighlight: { en: "₹10L & ₹25L Cover", hi: "₹10L और ₹25L कवर", hinglish: "₹10L & ₹25L Cover" },
    desc: { en: "Approximate annual premium ranges across the top 5 plans for an individual policyholder. Actual premiums may vary based on health profile, city, and add-ons selected.", hi: "व्यक्तिगत पॉलिसीधारक के लिए शीर्ष 5 योजनाओं में अनुमानित वार्षिक प्रीमियम सीमा। वास्तविक प्रीमियम स्वास्थ्य प्रोफ़ाइल, शहर और चुने गए ऐड-ऑन के आधार पर भिन्न हो सकते हैं।", hinglish: "Top 5 plans mein individual policyholder ke liye approximate annual premium ranges. Actual premiums health profile, city aur add-ons ke basis pe different ho sakte hain." },
    thAge: { en: "Age", hi: "आयु", hinglish: "Age" },
    th10L: { en: "₹10 Lakh Cover", hi: "₹10 लाख कवर", hinglish: "₹10 Lakh Cover" },
    th25L: { en: "₹25 Lakh Cover", hi: "₹25 लाख कवर", hinglish: "₹25 Lakh Cover" },
    years: { en: "years", hi: "वर्ष", hinglish: "years" },
    footnote: { en: "* Premiums are approximate annual ranges (GST extra where applicable). Health insurance GST is 0% as per current IRDAI guidelines for health policies.", hi: "* प्रीमियम अनुमानित वार्षिक सीमा हैं (जहाँ लागू हो GST अतिरिक्त)। हेल्थ इंश्योरेंस GST वर्तमान IRDAI दिशानिर्देशों के अनुसार 0% है।", hinglish: "* Premiums approximate annual ranges hain (GST extra where applicable). Health insurance GST 0% hai current IRDAI guidelines ke according." },
  },
  recommendations: {
    heading: { en: "Which Plan is Right for", hi: "कौन सी योजना सही है", hinglish: "Kaunsi Plan Sahi Hai" },
    headingHighlight: { en: "You?", hi: "आपके लिए?", hinglish: "Aapke Liye?" },
    desc: { en: "Your ideal plan depends on your life stage, health needs, and budget. Here is our expert recommendation logic:", hi: "आपकी आदर्श योजना आपके जीवन चरण, स्वास्थ्य आवश्यकताओं और बजट पर निर्भर करती है। यहाँ हमारी विशेषज्ञ सिफारिश तर्क है:", hinglish: "Aapki ideal plan aapke life stage, health needs aur budget pe depend karti hai. Yahan hamari expert recommendation logic hai:" },
    recommended: { en: "Recommended:", hi: "सिफारिश:", hinglish: "Recommended:" },
  },
  keyFeatures: {
    heading: { en: "Key Features to", hi: "मुख्य विशेषताएँ जो", hinglish: "Key Features to" },
    headingHighlight: { en: "Look For", hi: "देखनी चाहिए", hinglish: "Look For" },
    headingSuffix: { en: "in Any Health Plan", hi: "किसी भी हेल्थ प्लान में", hinglish: "in Any Health Plan" },
  },
  faq: {
    heading: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: { en: "Frequently asked questions about the best health insurance plans in India for 2026.", hi: "2026 के लिए भारत में सर्वश्रेष्ठ हेल्थ इंश्योरेंस योजनाओं के बारे में अक्सर पूछे जाने वाले सवाल।", hinglish: "2026 ke liye India mein best health insurance plans ke baare mein often pooche jaane wale sawaal." },
  },
  cta: {
    heading1: { en: "Still Confused? Get a", hi: "अभी भी confused? प्राप्त करें एक", hinglish: "Abhi bhi confused? Paayein ek" },
    headingHighlight: { en: "Free Personalized Recommendation", hi: "मुफ़्त व्यक्तिगत सिफारिश", hinglish: "Free Personalized Recommendation" },
    desc: { en: "Chat with Himanshu Paliwal on WhatsApp — IRDAI Certified Insurance Advisor. Get unbiased, personalized plan recommendations based on your exact needs. No spam, no sales pressure.", hi: "WhatsApp पर हिमांशु पालीवाल से चैट करें — IRDAI प्रमाणित बीमा सलाहकार। अपनी सटीक आवश्यकताओं के आधार पर निष्पक्ष, व्यक्तिगत योजना सिफारिशें प्राप्त करें। कोई स्पैम नहीं, कोई बिक्री दबाव नहीं।", hinglish: "WhatsApp pe Himanshu Paliwal se chat karein — IRDAI Certified Insurance Advisor. Apni exact needs ke basis pe unbiased, personalized plan recommendations paayein. No spam, no sales pressure." },
    ctaWhatsApp: { en: "Chat on WhatsApp Now", hi: "अभी WhatsApp पर चैट करें", hinglish: "WhatsApp pe Abhi Chat Karein" },
    advisorName: { en: "Himanshu Paliwal", hi: "हिमांशु पालीवाल", hinglish: "Himanshu Paliwal" },
    advisorPOSP: { en: "POSP Code: IP429834", hi: "POSP कोड: IP429834", hinglish: "POSP Code: IP429834" },
    advisorCert: { en: "IRDAI Certified Insurance Advisor", hi: "IRDAI प्रमाणित बीमा सलाहकार", hinglish: "IRDAI Certified Insurance Advisor" },
    advisorSite: { en: "PaliwalSecure.in", hi: "PaliwalSecure.in", hinglish: "PaliwalSecure.in" },
  },
};

const faqsEn = [
  { q: "Which is the best health insurance plan in India for 2026?", a: "The best plan depends on your needs. Care Health Supreme offers the best overall value with unlimited restore and no room rent cap. HDFC ERGO Optima Secure has the highest claim settlement ratio (94.1%)." },
  { q: "What is restore benefit in health insurance?", a: "Restore benefit automatically reinstates your sum insured if you exhaust it during the policy year. Care Supreme offers unlimited restoration, while most others offer a single restore of up to 100%." },
  { q: "How much does health insurance cost for a 30-year-old in India?", a: "For a 30-year-old, a ₹10L plan costs ₹6,200-₹9,100/year and a ₹25L plan costs ₹11,000-₹16,200/year across the top 5 plans." },
  { q: "What is the waiting period for pre-existing diseases?", a: "Most plans have 2-4 years waiting period. Niva Bupa ReAssure 2.0 and Star Health Comprehensive offer only 2-year waiting periods." },
  { q: "Should I choose a plan with no room rent cap?", a: "Yes, a plan with no room rent cap is highly recommended, especially in metro cities where hospital room charges can be ₹5,000-₹15,000/day." },
  { q: "Can I switch my health insurance plan to a better one?", a: "Yes, IRDAI allows health insurance portability. You can switch insurers while retaining your accumulated benefits. Apply for portability at least 45 days before renewal." },
  { q: "Is it worth buying a super top-up plan along with base health insurance?", a: "Absolutely. A super top-up plan provides additional coverage above your deductible at a very low premium. A ₹25L super top-up with ₹5L deductible may cost just ₹2,000-₹3,000/year." },
];

const faqsTranslated = [
  { q: { en: "Which is the best health insurance plan in India for 2026?", hi: "2026 के लिए भारत में सबसे अच्छी हेल्थ इंश्योरेंस योजना कौन सी है?", hinglish: "2026 ke liye India mein sabse achchi health insurance plan kaunsi hai?" }, a: { en: "The best plan depends on your needs. Care Health Supreme offers the best overall value with unlimited restore and no room rent cap. HDFC ERGO Optima Secure has the highest claim settlement ratio (94.1%). Star Health Comprehensive is best for families with newborns.", hi: "सबसे अच्छी योजना आपकी आवश्यकताओं पर निर्भर करती है। Care Health Supreme असीमित रिस्टोर और बिना रूम रेंट कैप के साथ सबसे अच्छा मूल्य देता है। HDFC ERGO Optima Secure का सबसे अधिक क्लेम सेटलमेंट रेशियो (94.1%) है।", hinglish: "Best plan aapki needs pe depend karti hai. Care Health Supreme unlimited restore aur no room rent cap ke saath best overall value deta hai. HDFC ERGO Optima Secure ka highest claim settlement ratio (94.1%) hai." } },
  { q: { en: "What is restore benefit in health insurance?", hi: "हेल्थ इंश्योरेंस में रिस्टोर बेनिफ़िट क्या है?", hinglish: "Health insurance mein restore benefit kya hai?" }, a: { en: "Restore benefit automatically reinstates your sum insured if you exhaust it during the policy year. Care Supreme offers unlimited restoration, while most others offer a single restore of up to 100%.", hi: "रिस्टोर बेनिफ़िट स्वचालित रूप से आपकी बीमित राशि को पुनर्स्थापित करता है यदि आप पॉलिसी वर्ष में इसे समाप्त कर देते हैं। Care Supreme असीमित पुनर्स्थापना प्रदान करता है।", hinglish: "Restore benefit automatically aapki sum insured reinstate karta hai agar aap policy year mein ise exhaust kar dete hain. Care Supreme unlimited restoration provide karta hai." } },
  { q: { en: "How much does health insurance cost for a 30-year-old in India?", hi: "भारत में 30 वर्षीय के लिए हेल्थ इंश्योरेंस कितना खर्च होता है?", hinglish: "India mein 30-year-old ke liye health insurance kitna kharch hota hai?" }, a: { en: "For a 30-year-old, a ₹10L plan costs ₹6,200-₹9,100/year and a ₹25L plan costs ₹11,000-₹16,200/year across the top 5 plans.", hi: "30 वर्षीय के लिए, ₹10L योजना ₹6,200-₹9,100/वर्ष और ₹25L योजना ₹11,000-₹16,200/वर्ष खर्च होती है।", hinglish: "30-year-old ke liye, ₹10L plan ₹6,200-₹9,100/year aur ₹25L plan ₹11,000-₹16,200/year kharch hoti hai top 5 plans mein." } },
  { q: { en: "What is the waiting period for pre-existing diseases?", hi: "पूर्व-मौजूदा बीमारियों की प्रतीक्षा अवधि क्या है?", hinglish: "Pre-existing diseases ki waiting period kya hai?" }, a: { en: "Most plans have 2-4 years waiting period. Niva Bupa ReAssure 2.0 and Star Health Comprehensive offer only 2-year waiting periods, while Care Supreme, HDFC ERGO and ICICI Lombard have 3-year periods.", hi: "अधिकांश योजनाओं में 2-4 वर्ष की प्रतीक्षा अवधि है। Niva Bupa ReAssure 2.0 और Star Health Comprehensive केवल 2 वर्ष की प्रतीक्षा अवधि प्रदान करते हैं।", hinglish: "Zyadatar plans mein 2-4 saal ki waiting period hai. Niva Bupa ReAssure 2.0 aur Star Health Comprehensive sirf 2-year waiting periods provide karte hain." } },
  { q: { en: "Should I choose a plan with no room rent cap?", hi: "क्या मुझे बिना रूम रेंट कैप वाली योजना चुननी चाहिए?", hinglish: "Kya mujhe no room rent cap wali plan choose karni chahiye?" }, a: { en: "Yes, a plan with no room rent cap is highly recommended, especially in metro cities where hospital room charges can be ₹5,000-₹15,000/day. Plans with room rent caps limit your hospital room choice.", hi: "हाँ, बिना रूम रेंट कैप वाली योजना की अत्यधिक सिफारिश की जाती है, विशेषकर मेट्रो शहरों में जहाँ अस्पताल कक्ष शुल्क ₹5,000-₹15,000/दिन हो सकता है।", hinglish: "Haan, no room rent cap wali plan ki highly recommendation ki jaati hai, especially metro cities mein jahan hospital room charges ₹5,000-₹15,000/day ho sakte hain." } },
  { q: { en: "Can I switch my health insurance plan to a better one?", hi: "क्या मैं अपनी हेल्थ इंश्योरेंस योजना बेहतर में बदल सकता हूँ?", hinglish: "Kya main apni health insurance plan better mein badal sakta hoon?" }, a: { en: "Yes, IRDAI allows health insurance portability. You can switch insurers while retaining your accumulated benefits like waiting period credits and no-claim bonus. Apply at least 45 days before renewal.", hi: "हाँ, IRDAI हेल्थ इंश्योरेंस पोर्टेबिलिटी की अनुमति देता है। आप अपने जमा लाभों को बनाए रखते हुए बीमाकर्ता बदल सकते हैं। नवीनीकरण से 45 दिन पहले आवेदन करें।", hinglish: "Haan, IRDAI health insurance portability ki permission deta hai. Aap accumulated benefits retain karte hue insurers switch kar sakte hain. Renewal se 45 din pehle apply karein." } },
  { q: { en: "Is it worth buying a super top-up plan along with base health insurance?", hi: "क्या बेस हेल्थ इंश्योरेंस के साथ सुपर टॉप-अप प्लान खरीदना फायदेमंद है?", hinglish: "Kya base health insurance ke saath super top-up plan khareedna faydemand hai?" }, a: { en: "Absolutely. A super top-up plan provides additional coverage above your deductible at a very low premium. A ₹25L super top-up with ₹5L deductible may cost just ₹2,000-₹3,000/year. It is the most cost-effective way to enhance your coverage.", hi: "बिल्कुल। सुपर टॉप-अप योजना बहुत कम प्रीमियम पर आपके डिडक्टिबल से ऊपर अतिरिक्त कवरेज प्रदान करती है। ₹25L सुपर टॉप-अप ₹5L डिडक्टिबल के साथ केवल ₹2,000-₹3,000/वर्ष।", hinglish: "Bilkul. Super top-up plan bahut kam premium pe aapke deductible se upar additional coverage provide karti hai. ₹25L super top-up ₹5L deductible ke saath sirf ₹2,000-₹3,000/year." } },
];

const plans = [
  { name: "Care Health Supreme", insurer: "Care Health Insurance", sumInsuredRange: "₹5L – ₹1Cr", waitingPeriodPED: "3 years", restoreBenefit: "Up to 100%", roomRentCap: "No Cap (Single AC)", claimSettlement: "92.5%", networkHospitals: "20,000+", aiPick: true,
    pros: { en: ["Unlimited automatic restoration of sum insured","No room rent cap on single AC room","Covers modern treatments (robotics, stem cell)","Annual health check-up included","Day-1 cover for accidents"], hi: ["बीमित राशि की असीमित स्वचालित पुनर्स्थापना","सिंगल AC कमरे पर कोई रूम रेंट कैप नहीं","आधुनिक उपचार कवर (रोबोटिक्स, स्टेम सेल)","वार्षिक स्वास्थ्य जाँच शामिल","दुर्घटना के लिए दिन-1 कवर"], hinglish: ["Sum insured ki unlimited automatic restoration","Single AC room pe koi room rent cap nahi","Modern treatments cover (robotics, stem cell)","Annual health check-up included","Day-1 cover for accidents"] },
    cons: { en: ["3-year waiting period for pre-existing diseases","Co-payment of 20% for entry age above 61","Maternity cover not included in base plan","No OPD cover in base variant"], hi: ["पूर्व-मौजूदा बीमारियों के लिए 3 वर्ष प्रतीक्षा अवधि","61 से अधिक प्रवेश आयु पर 20% सह-भुगतान","बेस प्लान में मातृत्व कवर शामिल नहीं","बेस वेरिएंट में कोई OPD कवर नहीं"], hinglish: ["3-year waiting period for pre-existing diseases","Co-payment 20% for entry age above 61","Maternity cover base plan mein included nahi","No OPD cover in base variant"] },
    bestFor: { en: "Young families & individuals seeking unlimited restore benefit with no room rent restrictions", hi: "युवा परिवार और व्यक्ति जो बिना रूम रेंट प्रतिबंध के असीमित रिस्टोर बेनिफ़िट चाहते हैं", hinglish: "Young families & individuals jo bina room rent restrictions ke unlimited restore benefit chahte hain" } },
  { name: "Niva Bupa ReAssure 2.0", insurer: "Niva Bupa Health Insurance", sumInsuredRange: "₹5L – ₹1Cr", waitingPeriodPED: "2 years", restoreBenefit: "Up to 100%", roomRentCap: "No Cap", claimSettlement: "89.3%", networkHospitals: "10,000+", aiPick: false,
    pros: { en: ["Only 2-year waiting period for PED","No room rent cap at all","ReAssure benefit restores 100% on partial claims too","Wellness rewards up to 30% discount","Covers mental illness treatment"], hi: ["PED के लिए केवल 2 वर्ष प्रतीक्षा अवधि","कोई रूम रेंट कैप नहीं","आंशिक क्लेम पर भी 100% रिस्टोर","30% छूट तक वेलनेस पुरस्कार","मानसिक बीमारी उपचार कवर"], hinglish: ["Sirf 2-year waiting period for PED","Koi room rent cap nahi","ReAssure benefit partial claims pe bhi 100% restore karta hai","Wellness rewards 30% discount tak","Mental illness treatment cover"] },
    cons: { en: ["Slightly lower claim settlement ratio","Smaller network hospital base","No OPD in base plan","Domiciliary treatment only if advised by doctor"], hi: ["क्लेम सेटलमेंट रेशियो थोड़ा कम","छोटा नेटवर्क अस्पताल आधार","बेस प्लान में कोई OPD नहीं","डोमिसाइलरी उपचार केवल डॉक्टर की सलाह पर"], hinglish: ["Slightly lower claim settlement ratio","Chhota network hospital base","Base plan mein koi OPD nahi","Domiciliary treatment sirf doctor ki salah pe"] },
    bestFor: { en: "People with pre-existing conditions wanting shorter PED waiting period with full restore", hi: "पूर्व-मौजूदा स्थिति वाले लोग जो छोटी PED प्रतीक्षा अवधि और पूर्ण रिस्टोर चाहते हैं", hinglish: "Pre-existing conditions wale log jo chhoti PED waiting period aur full restore chahte hain" } },
  { name: "HDFC ERGO Optima Secure", insurer: "HDFC ERGO General Insurance", sumInsuredRange: "₹5L – ₹75L", waitingPeriodPED: "3 years", restoreBenefit: "Up to 100%", roomRentCap: "No Cap", claimSettlement: "94.1%", networkHospitals: "13,000+", aiPick: false,
    pros: { en: ["Highest claim settlement ratio among these plans","Secure benefit increases sum insured by 100% over 2 years","No room rent cap","Covers air ambulance up to ₹2.5L","AYUSH treatment fully covered"], hi: ["इन योजनाओं में सबसे अधिक क्लेम सेटलमेंट रेशियो","2 वर्ष में बीमित राशि 100% बढ़ाता है","कोई रूम रेंट कैप नहीं","₹2.5L तक एयर एम्बुलेंस कवर","AYUSH उपचार पूरी तरह कवर"], hinglish: ["Highest claim settlement ratio in these plans","Secure benefit 2 saal mein sum insured 100% badhata hai","Koi room rent cap nahi","Air ambulance ₹2.5L tak cover","AYUSH treatment fully covered"] },
    cons: { en: ["Maximum sum insured capped at ₹75L","No unlimited restore (single restore only)","3-year PED waiting period","Co-payment of 10% for Pune/Nagpur zone"], hi: ["अधिकतम बीमित राशि ₹75L तक सीमित","असीमित रिस्टोर नहीं (केवल एक बार)","3 वर्ष PED प्रतीक्षा अवधि","पुणे/नागपुर ज़ोन के लिए 10% सह-भुगतान"], hinglish: ["Maximum sum insured ₹75L tak limited","Unlimited restore nahi (single restore only)","3-year PED waiting period","10% co-payment for Pune/Nagpur zone"] },
    bestFor: { en: "Risk-averse buyers who value claim settlement reliability and brand trust", hi: "जोखिम-से बचने वाले खरीदार जो क्लेम सेटलमेंट विश्वसनीयता और ब्रांड भरोसा महत्व देते हैं", hinglish: "Risk-averse buyers jo claim settlement reliability aur brand trust value karte hain" } },
  { name: "Star Health Comprehensive", insurer: "Star Health and Allied Insurance", sumInsuredRange: "₹5L – ₹1Cr", waitingPeriodPED: "2 years", restoreBenefit: "Up to 100%", roomRentCap: "Single AC Room", claimSettlement: "87.8%", networkHospitals: "14,000+", aiPick: false,
    pros: { en: ["Only 2-year PED waiting period","Automatic 100% restoration of sum insured","In-house claim settlement team (no TPA)","Covers bariatric surgery","Newborn baby covered from Day 1"], hi: ["केवल 2 वर्ष PED प्रतीक्षा अवधि","बीमित राशि का स्वचालित 100% पुनर्स्थापन","इन-हाउस क्लेम सेटलमेंट टीम (कोई TPA नहीं)","बैरिएट्रिक सर्जरी कवर","नवजात शिशु दिन-1 से कवर"], hinglish: ["Sirf 2-year PED waiting period","Automatic 100% restoration of sum insured","In-house claim settlement team (no TPA)","Bariatric surgery cover","Newborn baby Day 1 se covered"] },
    cons: { en: ["Lower claim settlement ratio","Room rent capped at single AC room","Co-payment of 20% for age above 60","Specific disease waiting period of 2 years"], hi: ["क्लेम सेटलमेंट रेशियो कम","सिंगल AC कमरे तक रूम रेंट सीमित","60 से अधिक आयु पर 20% सह-भुगतान","2 वर्ष की विशिष्ट बीमारी प्रतीक्षा अवधि"], hinglish: ["Lower claim settlement ratio","Room rent single AC room tak capped","20% co-payment for age above 60","2-year specific disease waiting period"] },
    bestFor: { en: "Families expecting newborns — newborn covered from Day 1, no TPA delays", hi: "नवजात की उम्मीद वाले परिवार — नवजात दिन-1 से कवर, कोई TPA देरी नहीं", hinglish: "Families expecting newborns — newborn Day 1 se covered, no TPA delays" } },
  { name: "ICICI Lombard Complete Health", insurer: "ICICI Lombard General Insurance", sumInsuredRange: "₹3L – ₹50L", waitingPeriodPED: "3 years", restoreBenefit: "Up to 100%", roomRentCap: "No Cap (select plans)", claimSettlement: "91.2%", networkHospitals: "9,000+", aiPick: false,
    pros: { en: ["Sum insured starts as low as ₹3L (affordable entry)","No room rent cap on select variants","Corporate-style wellness program","Multi-year policy discount up to 15%","Covers organ donor expenses"], hi: ["बीमित राशि ₹3L से शुरू (किफ़ायती प्रवेश)","चयनित वेरिएंट पर कोई रूम रेंट कैप नहीं","कॉर्पोरेट-स्टाइल वेलनेस प्रोग्राम","15% तक बहु-वर्षीय पॉलिसी छूट","अंग दाता खर्च कवर"], hinglish: ["Sum insured ₹3L se shuru (affordable entry)","Select variants pe koi room rent cap nahi","Corporate-style wellness program","Multi-year policy discount 15% tak","Organ donor expenses cover"] },
    cons: { en: ["Smaller hospital network","Maximum sum insured only ₹50L","3-year PED waiting period","No restore benefit on base plan (only Elite variant)","OPD cover limited to select variants"], hi: ["छोटा अस्पताल नेटवर्क","अधिकतम बीमित राशि केवल ₹50L","3 वर्ष PED प्रतीक्षा अवधि","बेस प्लान पर कोई रिस्टोर बेनिफ़िट नहीं","OPD कवर चयनित वेरिएंट तक सीमित"], hinglish: ["Chhota hospital network","Maximum sum insured sirf ₹50L","3-year PED waiting period","Base plan pe koi restore benefit nahi","OPD cover select variants tak limited"] },
    bestFor: { en: "Budget-conscious buyers and those wanting multi-year policy discounts", hi: "बजट-सचेत खरीदार और बहु-वर्षीय पॉलिसी छूट चाहने वाले", hinglish: "Budget-conscious buyers aur multi-year policy discounts chahne wale" } },
];

const premiumTable = [
  { age: 25, cover10L: "₹5,500 – ₹8,200", cover25L: "₹9,800 – ₹14,500" },
  { age: 30, cover10L: "₹6,200 – ₹9,100", cover25L: "₹11,000 – ₹16,200" },
  { age: 35, cover10L: "₹7,100 – ₹10,500", cover25L: "₹12,800 – ₹18,900" },
  { age: 40, cover10L: "₹8,500 – ₹12,800", cover25L: "₹15,200 – ₹22,500" },
  { age: 45, cover10L: "₹10,200 – ₹15,500", cover25L: "₹18,500 – ₹27,000" },
];

const recommendations = [
  { type: { en: "Young Individual (25-35)", hi: "युवा व्यक्ति (25-35)", hinglish: "Young Individual (25-35)" }, plan: "Care Health Supreme", reason: { en: "Unlimited restore, no room rent cap, and competitive premium. Best value for young, healthy individuals who want comprehensive coverage without overpaying.", hi: "असीमित रिस्टोर, कोई रूम रेंट कैप नहीं, और प्रतिस्पर्धी प्रीमियम। युवा, स्वस्थ व्यक्तियों के लिए सर्वोत्तम मूल्य।", hinglish: "Unlimited restore, no room rent cap, aur competitive premium. Young, healthy individuals ke liye best value jo comprehensive coverage chahte hain bina zyada pay kiye." }, aiPick: true },
  { type: { en: "Family with Kids", hi: "बच्चों वाला परिवार", hinglish: "Family with Kids" }, plan: "Star Health Comprehensive", reason: { en: "Newborn covered from Day 1, in-house claim team means faster settlement, and 2-year PED waiting period. Ideal for growing families.", hi: "नवजात दिन-1 से कवर, इन-हाउस क्लेम टीम से तेज़ निपटान, और 2 वर्ष PED प्रतीक्षा अवधि। बढ़ते परिवारों के लिए आदर्श।", hinglish: "Newborn Day 1 se covered, in-house claim team se faster settlement, aur 2-year PED waiting period. Growing families ke liye ideal." }, aiPick: false },
  { type: { en: "Pre-existing Condition", hi: "पूर्व-मौजूदा स्थिति", hinglish: "Pre-existing Condition" }, plan: "Niva Bupa ReAssure 2.0", reason: { en: "Only 2-year PED waiting period with 100% restore on partial claims. Best for those who want their pre-existing conditions covered sooner.", hi: "केवल 2 वर्ष PED प्रतीक्षा अवधि और आंशिक क्लेम पर 100% रिस्टोर। जो पूर्व-मौजूदा बीमारियों को जल्दी कवर कराना चाहते हैं।", hinglish: "Sirf 2-year PED waiting period with 100% restore on partial claims. Best for those jo pre-existing conditions jaldi cover karana chahte hain." }, aiPick: false },
  { type: { en: "Claim Reliability Seeker", hi: "क्लेम विश्वसनीयता चाहने वाले", hinglish: "Claim Reliability Seeker" }, plan: "HDFC ERGO Optima Secure", reason: { en: "94.1% claim settlement ratio, the highest among these plans. Secure benefit auto-increases your sum insured.", hi: "94.1% क्लेम सेटलमेंट रेशियो, इन योजनाओं में सबसे अधिक। सिक्योर बेनिफ़िट स्वचालित रूप से बीमित राशि बढ़ाता है।", hinglish: "94.1% claim settlement ratio, in plans mein sabse zyada. Secure benefit auto-increases sum insured." }, aiPick: false },
  { type: { en: "Budget Conscious Buyer", hi: "बजट-सचेत खरीदार", hinglish: "Budget Conscious Buyer" }, plan: "ICICI Lombard Complete Health", reason: { en: "Entry-level sum insured starts at ₹3L, multi-year discounts up to 15%, and affordable premiums. Best for first-time buyers.", hi: "प्रवेश-स्तर बीमित राशि ₹3L से शुरू, 15% तक बहु-वर्षीय छूट, और किफ़ायती प्रीमियम। पहली बार खरीदने वालों के लिए सर्वोत्तम।", hinglish: "Entry-level sum insured ₹3L se shuru, multi-year discounts 15% tak, aur affordable premiums. First-time buyers ke liye best." }, aiPick: false },
];

const keyFeaturesList = [
  { title: { en: "Restore Benefit", hi: "रिस्टोर बेनिफ़िट", hinglish: "Restore Benefit" }, desc: { en: "Automatic reinstatement of sum insured if exhausted. Look for unlimited restore or at least 100% single restore.", hi: "बीमित राशि समाप्त होने पर स्वचालित पुनर्स्थापन। असीमित रिस्टोर या कम से कम 100% एकल रिस्टोर देखें।", hinglish: "Sum insured exhausted hone pe automatic reinstatement. Unlimited restore ya kam se kam 100% single restore dekhein." } },
  { title: { en: "No Room Rent Cap", hi: "कोई रूम रेंट कैप नहीं", hinglish: "No Room Rent Cap" }, desc: { en: "Plans without room rent capping let you choose any room. Avoid plans that cap at 1% of SI — it limits your hospital choices.", hi: "बिना रूम रेंट कैपिंग वाली योजनाएँ कोई भी कमरा चुनने देती हैं। 1% SI पर कैप वाली योजनाएँ अस्पताल विकल्प सीमित करती हैं।", hinglish: "Plans without room rent capping let you choose any room. 1% of SI pe cap wali plans hospital choices limit karti hain." } },
  { title: { en: "Claim Settlement Ratio", hi: "क्लेम सेटलमेंट रेशियो", hinglish: "Claim Settlement Ratio" }, desc: { en: "Aim for CSR above 90%. Higher CSR means higher probability that your claim will be settled without hassle.", hi: "90% से अधिक CSR का लक्ष्य रखें। अधिक CSR का मतलब आपका क्लेम बिना परेशानी के निपटने की अधिक संभावना।", hinglish: "CSR above 90% aim karein. Higher CSR ka matlab aapka claim bina pareshani ke settle hone ki zyada probability." } },
  { title: { en: "PED Waiting Period", hi: "PED प्रतीक्षा अवधि", hinglish: "PED Waiting Period" }, desc: { en: "Shorter the better. 2-year PED waiting period (Niva Bupa, Star Health) is better than the standard 3-4 years.", hi: "जितना छोटा उतना अच्छा। 2 वर्ष PED प्रतीक्षा अवधि (Niva Bupa, Star Health) मानक 3-4 वर्ष से बेहतर है।", hinglish: "Shorter the better. 2-year PED waiting period (Niva Bupa, Star Health) standard 3-4 saal se better hai." } },
  { title: { en: "No Co-payment", hi: "कोई सह-भुगतान नहीं", hinglish: "No Co-payment" }, desc: { en: "Co-payment means you bear a percentage of the claim. Avoid co-payment clauses, especially if you are above 50.", hi: "सह-भुगतान का मतलब है कि आप क्लेम का एक प्रतिशत वहन करते हैं। सह-भुगतान शर्तों से बचें, विशेषकर 50 से अधिक होने पर।", hinglish: "Co-payment ka matlab aap claim ka ek percentage bear karte hain. Co-payment clauses se bachein, especially agar aap 50 se zyada ke hain." } },
  { title: { en: "Day Care Procedures", hi: "दिन देखभाल प्रक्रियाएँ", hinglish: "Day Care Procedures" }, desc: { en: "Ensure the plan covers 500+ day care procedures that do not require 24-hour hospitalization (cataract, dialysis, etc.).", hi: "सुनिश्चित करें कि योजना 500+ दिन देखभाल प्रक्रियाएँ कवर करती है जिनमें 24 घंटे अस्पताल में भर्ती की आवश्यकता नहीं।", hinglish: "Ensure plan 500+ day care procedures cover karti hai jinmein 24-hour hospitalization ki zaroorat nahi." } },
];

function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />;
}

export default function BestHealthInsuranceClientContent() {
  const { language } = useLanguage();
  const t = pageText;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqsEn.map((faq) => ({
      "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">{pt(t.hero.badge, language)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {pt(t.hero.title1, language)} <span className="gradient-text">{pt(t.hero.titleHighlight, language)}</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">{pt(t.hero.desc, language)}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20choosing%20the%20best%20health%20insurance%20plan" target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="blue"><span>{pt(t.hero.ctaRecommend, language)}</span></ShinyButton>
              </a>
              <Link href="/free-audit">
                <ShinyButton variant="secondary"><span>{pt(t.hero.ctaAudit, language)}</span></ShinyButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* QUICK COMPARISON TABLE */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            {pt(t.comparison.heading, language)} <span className="gradient-text">{pt(t.comparison.headingHighlight, language)}</span>
          </h2>
          <div className="glass-card rounded-xl p-6 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">{pt(t.comparison.thPlan, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.comparison.thSumInsured, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.comparison.thPedWait, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.comparison.thRestore, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.comparison.thRoomRent, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.comparison.thCsr, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.comparison.thNetwork, language)}</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 font-medium">
                      <div>{plan.name}{plan.aiPick && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">{pt(t.comparison.aiPick, language)}</span>}</div>
                      <div className="text-xs text-muted-foreground">{plan.insurer}</div>
                    </td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{plan.sumInsuredRange}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{plan.waitingPeriodPED}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{plan.restoreBenefit}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{plan.roomRentCap}</td>
                    <td className="py-3 px-4 text-center font-semibold text-primary">{plan.claimSettlement}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{plan.networkHospitals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* DETAILED PLAN CARDS */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            {pt(t.prosCons.heading, language)} <span className="gradient-text">{pt(t.prosCons.headingHighlight, language)}</span>
          </h2>
          <div className="space-y-6">
            {plans.map((plan, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.insurer}</p>
                  </div>
                  <span className="mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    CSR {plan.claimSettlement}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">{pt(t.prosCons.pros, language)}</h4>
                    <ul className="space-y-2">
                      {((plan.pros as Record<Language, string[]>)[language] || (plan.pros as Record<Language, string[]>).en).map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          <span className="text-muted-foreground">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-3">{pt(t.prosCons.cons, language)}</h4>
                    <ul className="space-y-2">
                      {((plan.cons as Record<Language, string[]>)[language] || (plan.cons as Record<Language, string[]>).en).map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <svg className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                          <span className="text-muted-foreground">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-sm"><span className="font-semibold text-primary">{pt(t.prosCons.bestFor, language)}</span> {pt(plan.bestFor, language)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* PREMIUM TABLE */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">{pt(t.premium.heading, language)} <span className="gradient-text">{pt(t.premium.headingHighlight, language)}</span></h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">{pt(t.premium.desc, language)}</p>
          <div className="glass-card rounded-xl p-6 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(t.premium.thAge, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(t.premium.th10L, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(t.premium.th25L, language)}</th>
                </tr>
              </thead>
              <tbody>
                {premiumTable.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{row.age} {pt(t.premium.years, language)}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.cover10L}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.cover25L}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-4 text-center">{pt(t.premium.footnote, language)}</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* RECOMMENDATIONS */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">{pt(t.recommendations.heading, language)} <span className="gradient-text">{pt(t.recommendations.headingHighlight, language)}</span></h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">{pt(t.recommendations.desc, language)}</p>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 relative">
                {rec.aiPick && <span className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">{pt(t.comparison.aiPick, language)}</span>}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center text-[#081221] font-bold text-lg">{idx + 1}</div>
                  <div>
                    <h3 className="font-bold text-lg">{pt(rec.type, language)}</h3>
                    <p className="text-primary font-semibold mt-1">{pt(t.recommendations.recommended, language)} {rec.plan}</p>
                    <p className="text-muted-foreground text-sm mt-2">{pt(rec.reason, language)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* KEY FEATURES */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">{pt(t.keyFeatures.heading, language)} <span className="gradient-text">{pt(t.keyFeatures.headingHighlight, language)}</span> {pt(t.keyFeatures.headingSuffix, language)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeaturesList.map((feature, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-base mb-2">{pt(feature.title, language)}</h3>
                <p className="text-muted-foreground text-sm">{pt(feature.desc, language)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FAQ */}
      <section className="py-8 md:py-12 bg-card/50" id="faq">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">{pt(t.faq.heading, language)} <span className="gradient-text">{pt(t.faq.headingHighlight, language)}</span></h2>
          <p className="text-muted-foreground text-center mb-8">{pt(t.faq.desc, language)}</p>
          <div className="space-y-4">
            {faqsTranslated.map((faq, idx) => (
              <details key={idx} className="glass-card rounded-xl p-5 group cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <summary className="flex items-center justify-between font-semibold text-base list-none">
                  <span>{pt(faq.q, language)}</span>
                  <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{pt(faq.a, language)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{pt(t.cta.heading1, language)} <span className="gradient-text">{pt(t.cta.headingHighlight, language)}</span></h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(t.cta.desc, language)}</p>
          <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20choosing%20the%20best%20health%20insurance%20plan%20for%202026" target="_blank" rel="noopener noreferrer">
            <ShinyButton variant="blue"><span>{pt(t.cta.ctaWhatsApp, language)}</span></ShinyButton>
          </a>
          <div className="mt-8 glass-card rounded-xl p-6 max-w-md mx-auto">
            <p className="font-semibold text-sm">{pt(t.cta.advisorName, language)}</p>
            <p className="text-xs text-muted-foreground">{pt(t.cta.advisorPOSP, language)}</p>
            <p className="text-xs text-muted-foreground">{pt(t.cta.advisorCert, language)}</p>
            <p className="text-xs text-muted-foreground">{pt(t.cta.advisorSite, language)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
