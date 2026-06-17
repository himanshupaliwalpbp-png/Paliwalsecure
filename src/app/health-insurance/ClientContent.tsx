'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import type { Language } from '@/lib/i18n';

// ── Translation helper ──────────────────────────────────────────────────────
type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

// ── Inline page translations ────────────────────────────────────────────────
const pageText = {
  hero: {
    badge: { en: "AI-Powered Recommendations", hi: "AI-संचालित सिफारिशें", hinglish: "AI-Powered Recommendations" },
    title1: { en: "Best", hi: "सर्वोत्तम", hinglish: "Best" },
    title2: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    titleSuffix: { en: "Plans in India", hi: "योजनाएँ भारत में", hinglish: "Plans in India" },
    desc: {
      en: "Compare 51+ IRDAI-registered health insurers instantly. Get personalized plan recommendations with InsureGPT AI, enjoy hassle-free cashless claims, and save up to ₹75,000 under Section 80D.",
      hi: "51+ IRDAI-पंजीकृत हेल्थ बीमाकर्ताओं की तुरंत तुलना करें। InsureGPT AI से व्यक्तिगत योजना सिफारिशें प्राप्त करें, परेशानी-मुक्त कैशलेस क्लेम का आनंद लें, और धारा 80D के तहत ₹75,000 तक की बचत करें।",
      hinglish: "51+ IRDAI-registered health insurers ko instantly compare karein. InsureGPT AI se personalized plan recommendations paayein, hassle-free cashless claims enjoy karein, aur Section 80D ke tahat ₹75,000 tak save karein."
    },
    ctaCompare: { en: "Compare Plans Now", hi: "अभी योजनाओं की तुलना करें", hinglish: "Plans Compare Karein Abhi" },
    ctaCalculator: { en: "Premium Calculator", hi: "प्रीमियम कैलकुलेटर", hinglish: "Premium Calculator" },
    trustBadge1: { en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" },
    trustBadge2: { en: "500+ Families Trust Us", hi: "500+ परिवारों का भरोसा", hinglish: "500+ Families Ka Bharosa" },
    trustBadge3: { en: "Free Consultation", hi: "मुफ़्त परामर्श", hinglish: "Free Consultation" },
  },
  planTypes: {
    heading: { en: "Types of", hi: "प्रकार", hinglish: "Types of" },
    headingHighlight: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    desc: { en: "Choose the right health insurance type based on your needs. Our AI advisor helps you pick the perfect plan.", hi: "अपनी आवश्यकताओं के आधार पर सही हेल्थ इंश्योरेंस प्रकार चुनें। हमारा AI सलाहकार आपको सही योजना चुनने में मदद करता है।", hinglish: "Apni needs ke basis pe sahi health insurance type choose karein. Hamaara AI advisor aapko perfect plan pick karne mein madad karta hai." },
    p1Title: { en: "Individual Health Insurance", hi: "व्यक्तिगत हेल्थ इंश्योरेंस", hinglish: "Individual Health Insurance" },
    p1Desc: { en: "Personalized coverage for a single person with dedicated sum insured. Ideal for young professionals and self-employed individuals.", hi: "समर्पित बीमित राशि के साथ एक व्यक्ति के लिए व्यक्तिगत कवरेज। युवा पेशेवरों और स्वरोजगार व्यक्तियों के लिए आदर्श।", hinglish: "Dedicated sum insured ke saath ek vyakti ke liye personalized coverage. Young professionals aur self-employed individuals ke liye ideal." },
    p1F1: { en: "Dedicated sum insured", hi: "समर्पित बीमित राशि", hinglish: "Dedicated sum insured" },
    p1F2: { en: "Cashless hospitalization", hi: "कैशलेस अस्पताल में भर्ती", hinglish: "Cashless hospitalization" },
    p1F3: { en: "No-claim bonus", hi: "नो-क्लेम बोनस", hinglish: "No-claim bonus" },
    p1F4: { en: "Day-care procedures", hi: "डे-केयर प्रक्रियाएँ", hinglish: "Day-care procedures" },
    p2Title: { en: "Family Floater Plan", hi: "फ़ैमिली फ्लोटर प्लान", hinglish: "Family Floater Plan" },
    p2Desc: { en: "One policy covers the entire family under a shared sum insured. Most cost-effective for families of 3-6 members.", hi: "एक पॉलिसी साझा बीमित राशि के तहत पूरे परिवार को कवर करती है। 3-6 सदस्यों वाले परिवारों के लिए सबसे किफ़ायती।", hinglish: "Ek policy shared sum insured ke tahat poore family ko cover karti hai. 3-6 members wale families ke liye sabse cost-effective." },
    p2F1: { en: "Shared sum insured", hi: "साझा बीमित राशि", hinglish: "Shared sum insured" },
    p2F2: { en: "Covers spouse & children", hi: "पति/पत्नी और बच्चों को कवर", hinglish: "Covers spouse & children" },
    p2F3: { en: "Lower premium per person", hi: "प्रति व्यक्ति कम प्रीमियम", hinglish: "Lower premium per person" },
    p2F4: { en: "Flexible member addition", hi: "लचीला सदस्य जोड़", hinglish: "Flexible member addition" },
    p3Title: { en: "Senior Citizen Plan", hi: "सीनियर सिटीज़न प्लान", hinglish: "Senior Citizen Plan" },
    p3Desc: { en: "Specially designed for people above 60 years with higher coverage, shorter waiting periods, and comprehensive benefits.", hi: "60 वर्ष से अधिक उम्र के लोगों के लिए विशेष रूप से डिज़ाइन किया गया, उच्च कवरेज, कम प्रतीक्षा अवधि और व्यापक लाभों के साथ।", hinglish: "60 saal se zyada umr ke logon ke liye specially designed, higher coverage, shorter waiting periods aur comprehensive benefits ke saath." },
    p3F1: { en: "No co-payment option", hi: "को-पेमेंट विकल्प नहीं", hinglish: "No co-payment option" },
    p3F2: { en: "Pre-existing disease cover", hi: "पूर्व-मौजूदा रोग कवर", hinglish: "Pre-existing disease cover" },
    p3F3: { en: "Domiciliary treatment", hi: "घरेलू उपचार", hinglish: "Domiciliary treatment" },
    p3F4: { en: "AYUSH treatments", hi: "AYUSH उपचार", hinglish: "AYUSH treatments" },
    p4Title: { en: "Critical Illness Cover", hi: "क्रिटिकल इलनेस कवर", hinglish: "Critical Illness Cover" },
    p4Desc: { en: "Lump sum payout on diagnosis of critical illnesses like cancer, heart disease, or kidney failure. Standalone or rider.", hi: "कैंसर, हृदय रोग या किडनी विफलता जैसी गंभीर बीमारियों के निदान पर एकमुश्त भुगतान। स्टैंडअलोन या राइडर।", hinglish: "Critical illnesses jaise cancer, heart disease ya kidney failure ke diagnosis pe lump sum payout. Standalone ya rider." },
    p4F1: { en: "Lump sum payout", hi: "एकमुश्त भुगतान", hinglish: "Lump sum payout" },
    p4F2: { en: "Covers 30+ illnesses", hi: "30+ बीमारियाँ कवर", hinglish: "Covers 30+ illnesses" },
    p4F3: { en: "Income replacement", hi: "आय प्रतिस्थापन", hinglish: "Income replacement" },
    p4F4: { en: "Tax benefits under 80D", hi: "80D के तहत कर लाभ", hinglish: "Tax benefits under 80D" },
    p5Title: { en: "Top-Up & Super Top-Up", hi: "टॉप-अप और सुपर टॉप-अप", hinglish: "Top-Up & Super Top-Up" },
    p5Desc: { en: "Additional coverage above your existing health insurance at a very affordable premium. Perfect for enhancing coverage.", hi: "मौजूदा हेल्थ इंश्योरेंस के ऊपर बहुत किफ़ायती प्रीमियम पर अतिरिक्त कवरेज। कवरेज बढ़ाने के लिए उत्तम।", hinglish: "Existing health insurance ke upar bahut affordable premium pe additional coverage. Coverage enhance karne ke liye perfect." },
    p5F1: { en: "Low premium", hi: "कम प्रीमियम", hinglish: "Low premium" },
    p5F2: { en: "High deductible", hi: "उच्च डिडक्टिबल", hinglish: "High deductible" },
    p5F3: { en: "Enhances base cover", hi: "बेस कवर बढ़ाता है", hinglish: "Enhances base cover" },
    p5F4: { en: "Covers same illnesses", hi: "वही बीमारियाँ कवर", hinglish: "Covers same illnesses" },
    p6Title: { en: "Maternity Insurance", hi: "मैटरनिटी इंश्योरेंस", hinglish: "Maternity Insurance" },
    p6Desc: { en: "Covers pre and post-natal expenses, delivery costs, and newborn baby care. Must-have for young couples planning a family.", hi: "प्रसवपूर्व और प्रसवोत्तर खर्च, डिलीवरी लागत और नवजात शिशु देखभाल कवर करता है। परिवार की योजना बनाने वाले युवा जोड़ों के लिए ज़रूरी।", hinglish: "Pre aur post-natal expenses, delivery costs aur newborn baby care cover karta hai. Family plan karne wale young couples ke liye must-have." },
    p6F1: { en: "Delivery expenses", hi: "डिलीवरी खर्च", hinglish: "Delivery expenses" },
    p6F2: { en: "Newborn cover", hi: "नवजात कवर", hinglish: "Newborn cover" },
    p6F3: { en: "Pre/post-natal care", hi: "प्रसवपूर्व/प्रसवोत्तर देखभाल", hinglish: "Pre/post-natal care" },
    p6F4: { en: "C-section covered", hi: "सी-सेक्शन कवर", hinglish: "C-section covered" },
  },
  comparison: {
    heading: { en: "Compare", hi: "तुलना करें", hinglish: "Compare" },
    headingHighlight: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    headingSuffix: { en: "Types", hi: "प्रकार", hinglish: "Types" },
    desc: { en: "Side-by-side comparison of popular health insurance categories to help you make an informed decision.", hi: "सूचित निर्णय लेने में मदद के लिए लोकप्रिय हेल्थ इंश्योरेंस श्रेणियों की समानांतर तुलना।", hinglish: "Informed decision lene mein madad ke liye popular health insurance categories ki side-by-side comparison." },
    thFeature: { en: "Feature", hi: "विशेषता", hinglish: "Feature" },
    thIndividual: { en: "Individual", hi: "व्यक्तिगत", hinglish: "Individual" },
    thFloater: { en: "Family Floater", hi: "फ़ैमिली फ्लोटर", hinglish: "Family Floater" },
    thTopUp: { en: "Top-Up", hi: "टॉप-अप", hinglish: "Top-Up" },
    row1Feature: { en: "Sum Insured Range", hi: "बीमित राशि सीमा", hinglish: "Sum Insured Range" },
    row2Feature: { en: "Premium (Avg)", hi: "प्रीमियम (औसत)", hinglish: "Premium (Avg)" },
    row3Feature: { en: "Waiting Period", hi: "प्रतीक्षा अवधि", hinglish: "Waiting Period" },
    row4Feature: { en: "Pre-existing Disease", hi: "पूर्व-मौजूदा रोग", hinglish: "Pre-existing Disease" },
    row5Feature: { en: "Tax Benefit (80D)", hi: "कर लाभ (80D)", hinglish: "Tax Benefit (80D)" },
    row6Feature: { en: "Cashless Network", hi: "कैशलेस नेटवर्क", hinglish: "Cashless Network" },
    row7Feature: { en: "Best For", hi: "सर्वोत्तम के लिए", hinglish: "Best For" },
    r4Individual: { en: "Covered after waiting", hi: "प्रतीक्षा के बाद कवर", hinglish: "Covered after waiting" },
    r4Floater: { en: "Covered after waiting", hi: "प्रतीक्षा के बाद कवर", hinglish: "Covered after waiting" },
    r4TopUp: { en: "Covered after base policy", hi: "बेस पॉलिसी के बाद कवर", hinglish: "Covered after base policy" },
    r7Individual: { en: "Single individuals", hi: "एकल व्यक्ति", hinglish: "Single individuals" },
    r7Floater: { en: "Families (3-6 members)", hi: "परिवार (3-6 सदस्य)", hinglish: "Families (3-6 members)" },
    r7TopUp: { en: "Enhancing existing cover", hi: "मौजूदा कवर बढ़ाना", hinglish: "Enhancing existing cover" },
  },
  whyUs: {
    heading: { en: "Why Choose", hi: "क्यों चुनें", hinglish: "Why Choose" },
    headingHighlight: { en: "Paliwal Secure", hi: "पालीवाल सिक्योर", hinglish: "Paliwal Secure" },
    w1Title: { en: "AI-Powered", hi: "AI-संचालित", hinglish: "AI-Powered" },
    w1Desc: { en: "InsureGPT analyzes 1000+ plans to find your perfect match", hi: "InsureGPT 1000+ योजनाओं का विश्लेषण करके आपका सही मिलान खोजता है", hinglish: "InsureGPT 1000+ plans analyze karke aapka perfect match dhoondhta hai" },
    w2Title: { en: "Instant Compare", hi: "तत्काल तुलना", hinglish: "Instant Compare" },
    w2Desc: { en: "Compare 51+ insurers side-by-side in seconds", hi: "51+ बीमाकर्ताओं की समानांतर तुलना सेकंड में", hinglish: "51+ insurers ko side-by-side seconds mein compare karein" },
    w3Title: { en: "Cashless Claims", hi: "कैशलेस क्लेम", hinglish: "Cashless Claims" },
    w3Desc: { en: "10,000+ network hospitals for hassle-free treatment", hi: "परेशानी-मुक्त उपचार के लिए 10,000+ नेटवर्क अस्पताल", hinglish: "10,000+ network hospitals hassle-free treatment ke liye" },
    w4Title: { en: "Save ₹75,000", hi: "₹75,000 बचत", hinglish: "Save ₹75,000" },
    w4Desc: { en: "Maximum tax savings under Section 80D every year", hi: "हर वर्ष धारा 80D के तहत अधिकतम कर बचत", hinglish: "Maximum tax savings Section 80D ke tahat har saal" },
  },
  faq: {
    heading: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: { en: "Frequently asked questions about health insurance in India. Can't find your answer? Ask InsureGPT!", hi: "भारत में हेल्थ इंश्योरेंस के बारे में अक्सर पूछे जाने वाले सवाल। जवाब नहीं मिला? InsureGPT से पूछें!", hinglish: "India mein health insurance ke baare mein often pooche jaane wale sawaal. Jawab nahi mila? InsureGPT se poochiye!" },
  },
  cta: {
    heading: { en: "Ready to Find Your", hi: "अपनी खोजने के लिए तैयार हैं", hinglish: "Ready to Find Your" },
    headingHighlight: { en: "Perfect Plan", hi: "सही योजना", hinglish: "Perfect Plan" },
    desc: { en: "Get personalized health insurance recommendations powered by AI. Compare, choose, and save — all in one place.", hi: "AI द्वारा संचालित व्यक्तिगत हेल्थ इंश्योरेंस सिफारिशें प्राप्त करें। तुलना करें, चुनें और बचत करें — सब एक जगह।", hinglish: "AI-powered personalized health insurance recommendations paayein. Compare, choose aur save — sab ek jagah." },
    ctaCompare: { en: "Start Comparing Now", hi: "अभी तुलना शुरू करें", hinglish: "Abhi Comparing Start Karein" },
    ctaExpert: { en: "Talk to an Expert", hi: "विशेषज्ञ से बात करें", hinglish: "Expert se Baat Karein" },
    byline: { en: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor", hi: "हिमांशु पालीवाल द्वारा — IRDAI प्रमाणित बीमा सलाहकार", hinglish: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor" },
  },
};

// ── FAQ data (English only for JSON-LD, translated for display) ────────────
const faqs = [
  {
    q: { en: "What is the best health insurance plan in India for families?", hi: "भारत में परिवारों के लिए सबसे अच्छी हेल्थ इंश्योरेंस योजना कौन सी है?", hinglish: "India mein families ke liye best health insurance plan kaunsi hai?" },
    a: { en: "The best family health insurance plan depends on your family size, age, and medical history. Family floater plans like Star Health Family Health Optima, HDFC Ergo Optima Secure, and Niva Bupa Health Companion are top picks. Use our AI comparison tool to find the perfect match for your family.", hi: "सबसे अच्छी परिवार हेल्थ इंश्योरेंस योजना आपके परिवार के आकार, आयु और चिकित्सा इतिहास पर निर्भर करती है। स्टार हेल्थ फ़ैमिली हेल्थ ऑप्टिमा, HDFC एर्गो ऑप्टिमा सिक्योर, और निवा बूपा हेल्थ कंपेनियन शीर्ष विकल्प हैं।", hinglish: "Best family health insurance plan aapke family size, age aur medical history pe depend karti hai. Star Health Family Health Optima, HDFC Ergo Optima Secure, aur Niva Bupa Health Companion top picks hain. Hamaare AI comparison tool se perfect match dhoondhein." },
  },
  {
    q: { en: "How much health insurance coverage do I need?", hi: "मुझे कितने हेल्थ इंश्योरेंस कवरेज की ज़रूरत है?", hinglish: "Mujhe kitne health insurance coverage ki zaroorat hai?" },
    a: { en: "A general rule is to have coverage equal to at least 50% of your annual income, with a minimum of ₹5-10 lakhs. For families in metro cities, ₹15-25 lakhs is recommended due to higher medical costs. Consider inflation and future medical needs when choosing your sum insured.", hi: "एक सामान्य नियम है कि कवरेज कम से कम अपनी वार्षिक आय के 50% के बराबर हो, न्यूनतम ₹5-10 लाख। मेट्रो शहरों में परिवारों के लिए ₹15-25 लाख अनुशंसित है।", hinglish: "Ek general rule hai ki coverage kam se kam annual income ke 50% ke barabar ho, minimum ₹5-10 lakhs. Metro cities mein families ke liye ₹15-25 lakhs recommended hai." },
  },
  {
    q: { en: "What is the waiting period in health insurance?", hi: "हेल्थ इंश्योरेंस में प्रतीक्षा अवधि क्या है?", hinglish: "Health insurance mein waiting period kya hai?" },
    a: { en: "Health insurance waiting periods typically include: 30 days for initial coverage, 1-2 years for pre-existing diseases, and 1-2 years for specific treatments like cataract, hernia, or joint replacement. Some plans offer shorter waiting periods or waiver options.", hi: "हेल्थ इंश्योरेंस प्रतीक्षा अवधियों में आमतौर पर शामिल हैं: प्रारंभिक कवरेज के लिए 30 दिन, पूर्व-मौजूदा रोगों के लिए 1-2 वर्ष, और मोतियाबिंद, हर्निया या जोड़ प्रतिस्थापन जैसे विशिष्ट उपचारों के लिए 1-2 वर्ष।", hinglish: "Health insurance waiting periods mein typically shamil hain: initial coverage ke liye 30 din, pre-existing diseases ke liye 1-2 saal, aur specific treatments jaise cataract, hernia ya joint replacement ke liye 1-2 saal." },
  },
  {
    q: { en: "Can I get health insurance with pre-existing diseases?", hi: "क्या मैं पूर्व-मौजूदा बीमारियों के साथ हेल्थ इंश्योरेंस प्राप्त कर सकता हूँ?", hinglish: "Kya main pre-existing diseases ke saath health insurance pa sakta hoon?" },
    a: { en: "Yes, most health insurance plans cover pre-existing diseases after a waiting period of 1-4 years. Some insurers like Star Health, Care Health, and Niva Bupa offer plans with shorter waiting periods or even day-1 coverage for certain conditions. Our AI advisor can help you find the best options.", hi: "हाँ, अधिकांश हेल्थ इंश्योरेंस योजनाएँ 1-4 वर्ष की प्रतीक्षा अवधि के बाद पूर्व-मौजूदा बीमारियों को कवर करती हैं। कुछ बीमाकर्ता कम प्रतीक्षा अवधि या दिन-1 कवरेज प्रदान करते हैं।", hinglish: "Haan, most health insurance plans pre-existing diseases ko 1-4 saal ki waiting period ke baad cover karti hain. Kuch insurers jaise Star Health, Care Health aur Niva Bupa shorter waiting periods ya day-1 coverage offer karte hain." },
  },
  {
    q: { en: "What is cashless hospitalization?", hi: "कैशलेस अस्पताल में भर्ती क्या है?", hinglish: "Cashless hospitalization kya hai?" },
    a: { en: "Cashless hospitalization allows you to receive treatment at network hospitals without paying upfront. The insurer settles the bill directly with the hospital. Paliwal Secure partners with 10,000+ network hospitals across India for seamless cashless claims.", hi: "कैशलेस अस्पताल में भर्ती आपको अग्रिम भुगतान किए बिना नेटवर्क अस्पतालों में उपचार प्राप्त करने की अनुमति देती है। बीमाकर्ता बिल का सीधे अस्पताल से निपटान करता है।", hinglish: "Cashless hospitalization aapko upfront payment kiye bina network hospitals mein treatment lene ki permission deta hai. Insurer bill ka directly hospital se settlement karta hai. Paliwal Secure 10,000+ network hospitals ke saath partner hai." },
  },
  {
    q: { en: "How do I claim tax benefits under Section 80D?", hi: "मैं धारा 80D के तहत कर लाभ कैसे प्राप्त करूँ?", hinglish: "Main Section 80D ke tahat tax benefits kaise claim karoon?" },
    a: { en: "Under Section 80D, you can claim up to ₹25,000 for self/family health insurance premium, and an additional ₹25,000 for parents (₹50,000 if parents are senior citizens). This means maximum savings of ₹75,000 per year on health insurance premiums.", hi: "धारा 80D के तहत, आप स्वयं/परिवार के हेल्थ इंश्योरेंस प्रीमियम के लिए ₹25,000 तक का दावा कर सकते हैं, और माता-पिता के लिए अतिरिक्त ₹25,000 (₹50,000 यदि माता-पिता सीनियर सिटीज़न हैं)। अधिकतम बचत ₹75,000 प्रति वर्ष।", hinglish: "Section 80D ke tahat, aap self/family health insurance premium ke liye ₹25,000 tak claim kar sakte hain, aur parents ke liye additional ₹25,000 (₹50,000 agar parents senior citizen hain). Maximum savings ₹75,000 per year." },
  },
  {
    q: { en: "What is the difference between individual and family floater plans?", hi: "व्यक्तिगत और फ़ैमिली फ्लोटर योजनाओं में क्या अंतर है?", hinglish: "Individual aur family floater plans mein kya farq hai?" },
    a: { en: "Individual plans provide separate sum insured for each member, while family floater plans share a single sum insured among all family members. Family floaters are usually more affordable, but individual plans offer dedicated coverage. Choose based on your family's health needs and budget.", hi: "व्यक्तिगत योजनाएँ प्रत्येक सदस्य के लिए अलग बीमित राशि प्रदान करती हैं, जबकि फ़ैमिली फ्लोटर योजनाएँ सभी परिवार सदस्यों में एक ही बीमित राशि साझा करती हैं। फ़ैमिली फ्लोटर आमतौर पर अधिक किफ़ायती होते हैं।", hinglish: "Individual plans har member ke liye separate sum insured provide karti hain, jabki family floater plans sab family members mein ek hi sum insured share karte hain. Family floaters usually zyada affordable hote hain. Apne family ki health needs aur budget ke basis pe choose karein." },
  },
  {
    q: { en: "How does health insurance portability work?", hi: "हेल्थ इंश्योरेंस पोर्टेबिलिटी कैसे काम करती है?", hinglish: "Health insurance portability kaise kaam karti hai?" },
    a: { en: "Health insurance portability allows you to switch insurers while retaining your accumulated benefits like waiting period credits and no-claim bonus. Apply for portability at least 45 days before your policy renewal date. IRDAI mandates a 30-day window for the new insurer to process your request.", hi: "हेल्थ इंश्योरेंस पोर्टेबिलिटी आपको जमा लाभों को बनाए रखते हुए बीमाकर्ता बदलने की अनुमति देती है। पॉलिसी नवीनीकरण तिथि से कम से कम 45 दिन पहले पोर्टेबिलिटी के लिए आवेदन करें।", hinglish: "Health insurance portability aapko accumulated benefits jaise waiting period credits aur no-claim bonus retain karte hue insurer switch karne ki permission deti hai. Policy renewal date se kam se kam 45 din pehle portability ke liye apply karein." },
  },
];

const comparisonData = [
  { featureKey: "row1Feature" as const, individual: "₹3L - ₹1Cr", floater: "₹5L - ₹1Cr", topUp: "₹10L - ₹1Cr" },
  { featureKey: "row2Feature" as const, individual: "₹8,000/yr", floater: "₹12,000/yr", topUp: "₹3,000/yr" },
  { featureKey: "row3Feature" as const, individual: "1-4 years", floater: "1-4 years", topUp: "3-4 years" },
  { featureKey: "row4Feature" as const, individual: "r4Individual" as const, floater: "r4Floater" as const, topUp: "r4TopUp" as const },
  { featureKey: "row5Feature" as const, individual: "Up to ₹75,000", floater: "Up to ₹75,000", topUp: "Up to ₹75,000" },
  { featureKey: "row6Feature" as const, individual: "10,000+ hospitals", floater: "10,000+ hospitals", topUp: "Same as base plan" },
  { featureKey: "row7Feature" as const, individual: "r7Individual" as const, floater: "r7Floater" as const, topUp: "r7TopUp" as const },
];

// ── Client Component ────────────────────────────────────────────────────────
export default function HealthInsuranceClientContent() {
  const { language } = useLanguage();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q.en,
      acceptedAnswer: { "@type": "Answer", text: faq.a.en },
    })),
  };

  const planCards = [
    { titleKey: "p1Title" as const, descKey: "p1Desc" as const, icon: "🛡️", featureKeys: ["p1F1", "p1F2", "p1F3", "p1F4"] as const },
    { titleKey: "p2Title" as const, descKey: "p2Desc" as const, icon: "👨‍👩‍👧‍👦", featureKeys: ["p2F1", "p2F2", "p2F3", "p2F4"] as const, aiPick: true },
    { titleKey: "p3Title" as const, descKey: "p3Desc" as const, icon: "👴", featureKeys: ["p3F1", "p3F2", "p3F3", "p3F4"] as const },
    { titleKey: "p4Title" as const, descKey: "p4Desc" as const, icon: "❤️‍🩹", featureKeys: ["p4F1", "p4F2", "p4F3", "p4F4"] as const },
    { titleKey: "p5Title" as const, descKey: "p5Desc" as const, icon: "⬆️", featureKeys: ["p5F1", "p5F2", "p5F3", "p5F4"] as const },
    { titleKey: "p6Title" as const, descKey: "p6Desc" as const, icon: "🤰", featureKeys: ["p6F1", "p6F2", "p6F3", "p6F4"] as const },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{pt(pageText.hero.badge, language)}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {pt(pageText.hero.title1, language)}{' '}
            <span className="gradient-text">{pt(pageText.hero.title2, language)}</span>{' '}
            {pt(pageText.hero.titleSuffix, language)}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {pt(pageText.hero.desc, language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/#compare">
              <ShinyButton variant="blue">
                <span>{pt(pageText.hero.ctaCompare, language)}</span>
              </ShinyButton>
            </a>
            <a href="/calculators">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.hero.ctaCalculator, language)}</span>
              </ShinyButton>
            </a>
          </div>
          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {[
              { text: pageText.hero.trustBadge1 },
              { text: pageText.hero.trustBadge2 },
              { text: pageText.hero.trustBadge3 },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                {pt(b.text, language)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* PLAN TYPES SECTION */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {pt(pageText.planTypes.heading, language)}{' '}
              <span className="gradient-text">{pt(pageText.planTypes.headingHighlight, language)}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{pt(pageText.planTypes.desc, language)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {planCards.map((plan, idx) => (
              <div key={idx} className="glass-card p-6 flex flex-col hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-3">{plan.icon}</div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  {pt(pageText.planTypes[plan.titleKey], language)}
                  {plan.aiPick && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                      🤖 AI Pick
                    </span>
                  )}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{pt(pageText.planTypes[plan.descKey], language)}</p>
                <ul className="space-y-2">
                  {plan.featureKeys.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span>{pt(pageText.planTypes[f], language)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* COMPARISON TABLE */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {pt(pageText.comparison.heading, language)}{' '}
              <span className="gradient-text">{pt(pageText.comparison.headingHighlight, language)}</span>{' '}
              {pt(pageText.comparison.headingSuffix, language)}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{pt(pageText.comparison.desc, language)}</p>
          </div>
          <div className="glass-card p-6 overflow-x-auto hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(pageText.comparison.thFeature, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(pageText.comparison.thIndividual, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(pageText.comparison.thFloater, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(pageText.comparison.thTopUp, language)}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => {
                  const getCellValue = (val: string) => {
                    if (val.startsWith('r4') || val.startsWith('r7')) {
                      return pt(pageText.comparison[val as keyof typeof pageText.comparison] as TEntry, language);
                    }
                    return val;
                  };
                  return (
                    <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{pt(pageText.comparison[row.featureKey], language)}</td>
                      <td className="py-3 px-4 text-sm text-center text-muted-foreground">{getCellValue(row.individual)}</td>
                      <td className="py-3 px-4 text-sm text-center text-muted-foreground">{getCellValue(row.floater)}</td>
                      <td className="py-3 px-4 text-sm text-center text-muted-foreground">{getCellValue(row.topUp)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {pt(pageText.whyUs.heading, language)}{' '}
              <span className="gradient-text">{pt(pageText.whyUs.headingHighlight, language)}</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🤖", titleKey: "w1Title" as const, descKey: "w1Desc" as const },
              { icon: "⚡", titleKey: "w2Title" as const, descKey: "w2Desc" as const, aiPick: true },
              { icon: "🏥", titleKey: "w3Title" as const, descKey: "w3Desc" as const },
              { icon: "💰", titleKey: "w4Title" as const, descKey: "w4Desc" as const },
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 text-center hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                  {pt(pageText.whyUs[item.titleKey], language)}
                  {item.aiPick && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                      🤖 AI Pick
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{pt(pageText.whyUs[item.descKey], language)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* FAQ SECTION */}
      <section className="py-16 md:py-24 bg-card/50" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {pt(pageText.faq.heading, language)}{' '}
              <span className="gradient-text">{pt(pageText.faq.headingHighlight, language)}</span>
            </h2>
            <p className="text-muted-foreground">{pt(pageText.faq.desc, language)}</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="glass-card p-5 group cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
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

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* CTA SECTION */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {pt(pageText.cta.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.cta.headingHighlight, language)}</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(pageText.cta.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/#compare">
              <ShinyButton variant="blue">
                <span>{pt(pageText.cta.ctaCompare, language)}</span>
              </ShinyButton>
            </a>
            <a href="/#contact">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.cta.ctaExpert, language)}</span>
              </ShinyButton>
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{pt(pageText.cta.byline, language)}</p>
        </div>
      </section>
    </>
  );
}
