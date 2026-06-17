'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import type { Language } from '@/lib/i18n';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "AI-Powered Insurance Advisor", hi: "AI-संचालित बीमा सलाहकार", hinglish: "AI-Powered Insurance Advisor" },
    title1: { en: "Travel Insurance", hi: "ट्रैवल इंश्योरेंस", hinglish: "Travel Insurance" },
    title2: { en: "India", hi: "भारत", hinglish: "India" },
    titleSuffix: { en: "— Compare & Save", hi: "— तुलना करें और बचत करें", hinglish: "— Compare & Save" },
    desc: { en: "Compare travel insurance plans from India's top insurers. Coverage from ₹50,000 to ₹10 lakh. Premiums starting at ₹449 per trip. Get AI-powered recommendations from PaliwalSecure.in for domestic and international travel.", hi: "भारत के शीर्ष बीमाकर्ताओं से ट्रैवल इंश्योरेंस योजनाओं की तुलना करें। ₹50,000 से ₹10 लाख तक कवरेज। ₹449 प्रति यात्रा से प्रीमियम। PaliwalSecure.in से घरेलू और अंतर्राष्ट्रीय यात्रा के लिए AI-संचालित सिफारिशें।", hinglish: "India ke top insurers se travel insurance plans compare karein. ₹50,000 se ₹10 lakh tak coverage. Premiums starting at ₹449 per trip. PaliwalSecure.in se domestic aur international travel ke liye AI-powered recommendations." },
    ctaCompare: { en: "Compare & Buy Now", hi: "तुलना करें और अभी खरीदें", hinglish: "Compare & Buy Now" },
    ctaWhatsApp: { en: "💬 Chat on WhatsApp", hi: "💬 WhatsApp पर चैट करें", hinglish: "💬 WhatsApp pe Chat Karein" },
    stat1Val: { en: "₹449", hi: "₹449", hinglish: "₹449" },
    stat1Label: { en: "Premium Starts At", hi: "प्रीमियम शुरू", hinglish: "Premium Starts At" },
    stat2Val: { en: "₹10L", hi: "₹10L", hinglish: "₹10L" },
    stat2Label: { en: "Max Coverage", hi: "अधिकतम कवरेज", hinglish: "Max Coverage" },
    stat3Val: { en: "190+", hi: "190+", hinglish: "190+" },
    stat3Label: { en: "Countries Covered", hi: "देश कवर", hinglish: "Countries Covered" },
    stat4Val: { en: "24/7", hi: "24/7", hinglish: "24/7" },
    stat4Label: { en: "Claim Support", hi: "क्लेम सहायता", hinglish: "Claim Support" },
  },
  breadcrumb: { home: { en: "Home", hi: "होम", hinglish: "Home" }, current: { en: "Travel Insurance", hi: "ट्रैवल इंश्योरेंस", hinglish: "Travel Insurance" } },
  whatIs: {
    heading: { en: "What is", hi: "क्या है", hinglish: "Kya Hai" },
    headingHighlight: { en: "Travel Insurance", hi: "ट्रैवल इंश्योरेंस", hinglish: "Travel Insurance" },
    para1: { en: "Travel insurance is a financial safety net that protects you against unexpected expenses before and during your trip — whether domestic or international. It covers medical emergencies abroad, trip cancellation, baggage loss, flight delays, and personal liability. For Indian travellers, a single medical emergency in the USA can cost upwards of ₹10 lakh, and in Europe, even a short hospital stay can exceed ₹3 lakh.", hi: "ट्रैवल इंश्योरेंस एक वित्तीय सुरक्षा जाल है जो आपकी यात्रा से पहले और के दौरान अप्रत्याशित खर्चों से सुरक्षित करता है — चाहे घरेलू हो या अंतर्राष्ट्रीय। यह विदेश में चिकित्सा आपातकाल, यात्रा रद्द, सामान खोना, फ्लाइट देरी और व्यक्तिगत देयता कवर करता है।", hinglish: "Travel insurance ek financial safety net hai jo aapki trip se pehle aur ke dauraan unexpected expenses se protect karta hai — domestic ya international. Yeh medical emergencies abroad, trip cancellation, baggage loss, flight delays aur personal liability cover karta hai." },
    para2: { en: "In India, travel insurance is regulated by IRDAI. Whether you are a student going abroad for studies, a family visiting relatives overseas, or a business traveller on a short trip — there is a travel insurance plan designed for your specific needs. PaliwalSecure.in helps you compare plans from 5+ insurers.", hi: "भारत में, ट्रैवल इंश्योरेंस IRDAI द्वारा विनियमित है। चाहे आप पढ़ाई के लिए विदेश जाने वाले छात्र हों, परिवार जो रिश्तेदारों से मिलने जा रहे हों, या व्यापार यात्री हों — आपकी विशिष्ट आवश्यकताओं के लिए ट्रैवल इंश्योरेंस योजना है।", hinglish: "India mein, travel insurance IRDAI dwara regulated hai. Chaahe aap student hon, family visiting relatives, ya business traveller — aapki specific needs ke liye travel insurance plan hai. PaliwalSecure.in 5+ insurers se plans compare karne mein madad karta hai." },
    domesticTitle: { en: "Domestic Travel Insurance", hi: "घरेलू ट्रैवल इंश्योरेंस", hinglish: "Domestic Travel Insurance" },
    domestic1: { en: "Covers trips within India — from ₹449 per trip", hi: "भारत के भीतर यात्रा कवर — ₹449 प्रति यात्रा से", hinglish: "India ke andar trips cover — ₹449 per trip se" },
    domestic2: { en: "Medical emergencies, flight delays, baggage loss", hi: "चिकित्सा आपातकाल, फ्लाइट देरी, सामान खोना", hinglish: "Medical emergencies, flight delays, baggage loss" },
    domestic3: { en: "Coverage from ₹50,000 to ₹2 lakh", hi: "₹50,000 से ₹2 लाख तक कवरेज", hinglish: "Coverage ₹50,000 se ₹2 lakh tak" },
    domestic4: { en: "Ideal for train/flight travellers within India", hi: "भारत के भीतर ट्रेन/फ्लाइट यात्रियों के लिए आदर्श", hinglish: "India ke andar train/flight travellers ke liye ideal" },
    domestic5: { en: "No visa requirement — buy for pure protection", hi: "कोई वीज़ा आवश्यकता नहीं — शुद्ध सुरक्षा के लिए खरीदें", hinglish: "No visa requirement — pure protection ke liye khareedein" },
    intlTitle: { en: "International Travel Insurance", hi: "अंतर्राष्ट्रीय ट्रैवल इंश्योरेंस", hinglish: "International Travel Insurance" },
    intl1: { en: "Covers overseas trips — from ₹599 per trip", hi: "विदेशी यात्रा कवर — ₹599 प्रति यात्रा से", hinglish: "Overseas trips cover — ₹599 per trip se" },
    intl2: { en: "Medical emergencies, evacuation, repatriation", hi: "चिकित्सा आपातकाल, निकासी, प्रत्यावर्तन", hinglish: "Medical emergencies, evacuation, repatriation" },
    intl3: { en: "Coverage from ₹1 lakh to ₹10 lakh+", hi: "₹1 लाख से ₹10 लाख+ कवरेज", hinglish: "Coverage ₹1 lakh se ₹10 lakh+" },
    intl4: { en: "Mandatory for Schengen visa (min €30,000 cover)", hi: "शेंगेन वीज़ा के लिए अनिवार्य (न्यूनतम €30,000 कवर)", hinglish: "Schengen visa ke liye mandatory (min €30,000 cover)" },
    intl5: { en: "Cashless treatment through global network hospitals", hi: "वैश्विक नेटवर्क अस्पतालों से कैशलेस उपचार", hinglish: "Global network hospitals se cashless treatment" },
  },
  features: {
    heading: { en: "Key", hi: "मुख्य", hinglish: "Key" },
    headingHighlight: { en: "Features & Benefits", hi: "विशेषताएँ और लाभ", hinglish: "Features & Benefits" },
    headingSuffix: { en: "of Travel Insurance", hi: "ट्रैवल इंश्योरेंस की", hinglish: "of Travel Insurance" },
    desc: { en: "Travel insurance is more than just medical coverage. A comprehensive plan protects you against a wide range of travel-related risks.", hi: "ट्रैवल इंश्योरेंस केवल चिकित्सा कवरेज से अधिक है। एक व्यापक योजना यात्रा-संबंधित जोखिमों की एक विस्तृत श्रृंखला से सुरक्षा करती है।", hinglish: "Travel insurance sirf medical coverage se zyada hai. Comprehensive plan travel-related risks ki wide range se protect karti hai." },
    f1Title: { en: "Medical Emergency Cover", hi: "चिकित्सा आपातकाल कवर", hinglish: "Medical Emergency Cover" },
    f1Desc: { en: "Hospitalization, doctor visits, dental emergencies, and surgical procedures abroad. Includes cashless treatment at network hospitals across 190+ countries.", hi: "विदेश में अस्पताल में भर्ती, डॉक्टर विज़िट, दंत आपातकाल और सर्जिकल प्रक्रियाएँ। 190+ देशों के नेटवर्क अस्पतालों में कैशलेस उपचार शामिल।", hinglish: "Hospitalization, doctor visits, dental emergencies, aur surgical procedures abroad. 190+ countries ke network hospitals mein cashless treatment included." },
    f2Title: { en: "Trip Cancellation & Curtailment", hi: "यात्रा रद्द और संक्षेपण", hinglish: "Trip Cancellation & Curtailment" },
    f2Desc: { en: "Reimburses non-refundable flight, hotel, and tour bookings if you cancel or cut short your trip. Can save you ₹50,000-₹5 lakh.", hi: "यदि आप अपनी यात्रा रद्द या छोटी करते हैं तो गैर-वापसी योग्य फ्लाइट, होटल और टूर बुकिंग की प्रतिपूर्ति। ₹50,000-₹5 लाख तक बचा सकता है।", hinglish: "Non-refundable flight, hotel aur tour bookings ki reimbursement agar aap trip cancel ya cut short karte hain. ₹50,000-₹5 lakh tak bacha sakta hai." },
    f3Title: { en: "Baggage Loss & Delay", hi: "सामान खोना और देरी", hinglish: "Baggage Loss & Delay" },
    f3Desc: { en: "Compensation for lost, stolen, or damaged checked-in baggage. Also covers essential items if your baggage is delayed beyond 12-24 hours.", hi: "खोए, चोरी हुए या क्षतिग्रस्त चेक-इन सामान के लिए मुआवज़ा। यदि सामान 12-24 घंटे से अधिक देरी हो तो आवश्यक वस्तुएँ भी कवर।", hinglish: "Lost, stolen ya damaged checked-in baggage ke liye compensation. Agar baggage 12-24 hours se zyada delayed ho toh essential items bhi cover." },
    f4Title: { en: "Flight Delay Compensation", hi: "फ्लाइट देरी मुआवज़ा", hinglish: "Flight Delay Compensation" },
    f4Desc: { en: "Fixed compensation if your flight is delayed beyond 6-12 hours. Covers meals, accommodation, and communication expenses.", hi: "यदि आपकी फ्लाइट 6-12 घंटे से अधिक देरी हो तो निश्चित मुआवज़ा। भोजन, आवास और संचार खर्च कवर करता है।", hinglish: "Fixed compensation agar flight 6-12 hours se zyada delayed ho. Meals, accommodation aur communication expenses cover karta hai." },
    f5Title: { en: "Personal Accident Cover", hi: "व्यक्तिगत दुर्घटना कवर", hinglish: "Personal Accident Cover" },
    f5Desc: { en: "Lump sum payout for accidental death or permanent total disability during the trip. Coverage ranges from ₹5 lakh to ₹25 lakh.", hi: "यात्रा के दौरान दुर्घटनावश मृत्यु या स्थायी पूर्ण विकलांगता पर एकमुश्त भुगतान। ₹5 लाख से ₹25 लाख तक कवरेज।", hinglish: "Trip ke dauraan accidental death ya permanent total disability pe lump sum payout. Coverage ₹5 lakh se ₹25 lakh tak." },
    f6Title: { en: "Emergency Evacuation & Repatriation", hi: "आपातकालीन निकासी और प्रत्यावर्तन", hinglish: "Emergency Evacuation & Repatriation" },
    f6Desc: { en: "Covers the cost of medical evacuation to the nearest hospital or repatriation of remains to India. Evacuation by air ambulance can cost ₹10-50 lakh — this benefit alone justifies the premium.", hi: "निकटतम अस्पताल में चिकित्सा निकासी या भारत में अवशेषों के प्रत्यावर्तन की लागत कवर करता है। एयर एम्बुलेंस द्वारा निकासी ₹10-50 लाख की लागत हो सकती है।", hinglish: "Nearest hospital mein medical evacuation ya India mein remains ki repatriation ki cost cover karta hai. Air ambulance se evacuation ₹10-50 lakh ki cost ho sakti hai." },
  },
  comparison: {
    heading: { en: "Compare", hi: "तुलना करें", hinglish: "Compare" },
    headingHighlight: { en: "Top Travel Insurance", hi: "शीर्ष ट्रैवल इंश्योरेंस", hinglish: "Top Travel Insurance" },
    headingSuffix: { en: "Plans in India", hi: "भारत में योजनाएँ", hinglish: "Plans in India" },
    desc: { en: "Premiums, coverage, and claim settlement ratios vary significantly across insurers. Our AI-powered comparison engine helps you find the best plan.", hi: "प्रीमियम, कवरेज और क्लेम सेटलमेंट रेशियो बीमाकर्ताओं में काफी भिन्न होते हैं। हमारा AI-संचालित तुलना इंजन सर्वोत्तम योजना ढूंढने में मदद करता है।", hinglish: "Premiums, coverage aur claim settlement ratios insurers mein kaafi different hote hain. Hamaara AI-powered comparison engine best plan dhoondhne mein madad karta hai." },
    thInsurer: { en: "Insurer", hi: "बीमाकर्ता", hinglish: "Insurer" },
    thPlan: { en: "Plan Name", hi: "योजना नाम", hinglish: "Plan Name" },
    thPremium: { en: "Premium (per trip)", hi: "प्रीमियम (प्रति यात्रा)", hinglish: "Premium (per trip)" },
    thCoverage: { en: "Coverage", hi: "कवरेज", hinglish: "Coverage" },
    thClaim: { en: "Claim Settlement", hi: "क्लेम सेटलमेंट", hinglish: "Claim Settlement" },
    thHighlight: { en: "Key Highlight", hi: "मुख्य विशेषता", hinglish: "Key Highlight" },
    aiPick: { en: "🤖 AI Pick", hi: "🤖 AI चयन", hinglish: "🤖 AI Pick" },
    footnote: { en: "Premiums are indicative for a 7-day trip for a 30-year-old traveller. Actual premiums vary based on destination, duration, age, and sum insured.", hi: "प्रीमियम 30 वर्षीय यात्री की 7-दिन यात्रा के लिए सांकेतिक हैं। वास्तविक प्रीमियम गंतव्य, अवधि, आयु और बीमित राशि के आधार पर भिन्न होते हैं।", hinglish: "Premiums 30-year-old traveller ki 7-day trip ke liye indicative hain. Actual premiums destination, duration, age aur sum insured ke basis pe different hote hain." },
  },
  premiumEst: {
    heading: { en: "Travel Insurance", hi: "ट्रैवल इंश्योरेंस", hinglish: "Travel Insurance" },
    headingHighlight: { en: "Premium Estimates", hi: "प्रीमियम अनुमान", hinglish: "Premium Estimates" },
    desc: { en: "Wondering how much travel insurance will cost for your next trip? Here are indicative premiums across popular destinations and durations.", hi: "अपनी अगली यात्रा के लिए ट्रैवल इंश्योरेंस कितना खर्च होगा? यहाँ लोकप्रिय गंतव्यों और अवधियों में सांकेतिक प्रीमियम हैं।", hinglish: "Apni agli trip ke liye travel insurance kitna kharch hoga? Yahan popular destinations aur durations mein indicative premiums hain." },
    thDest: { en: "Destination", hi: "गंतव्य", hinglish: "Destination" },
    thDuration: { en: "Duration", hi: "अवधि", hinglish: "Duration" },
    thAge: { en: "Age Group", hi: "आयु वर्ग", hinglish: "Age Group" },
    thBasic: { en: "Basic Plan", hi: "बेसिक प्लान", hinglish: "Basic Plan" },
    thComprehensive: { en: "Comprehensive", hi: "कॉम्प्रिहेंसिव", hinglish: "Comprehensive" },
    tipTitle: { en: "💡 Expert Tip: Buy insurance when you book your trip!", hi: "💡 विशेषज्ञ सुझाव: यात्रा बुक करते समय बीमा खरीदें!", hinglish: "💡 Expert Tip: Trip book karte waqt insurance khareedein!" },
    tipDesc: { en: "Buying early ensures you are covered for trip cancellation from day one. If you fall ill before departure and need to cancel, you can claim the non-refundable costs.", hi: "जल्दी खरीदने से पहले दिन से ही यात्रा रद्द कवरेज सुनिश्चित होता है। यदि प्रस्थान से पहले बीमार होते हैं और रद्द करना पड़ता है, तो गैर-वापसी योग्य लागत का दावा कर सकते हैं।", hinglish: "Jaldi khareedne se pehle din se hi trip cancellation coverage ensure hota hai. Agar departure se pehle ill hote hain aur cancel karna padta hai, toh non-refundable costs claim kar sakte hain." },
  },
  addOns: {
    heading: { en: "Travel Insurance", hi: "ट्रैवल इंश्योरेंस", hinglish: "Travel Insurance" },
    headingHighlight: { en: "Add-on Riders", hi: "ऐड-ऑन राइडर", hinglish: "Add-on Riders" },
    desc: { en: "Standard travel insurance covers the basics, but add-on riders enhance your policy for specific needs. Choose wisely based on your destination and activities.", hi: "स्टैंडर्ड ट्रैवल इंश्योरेंस बेसिक्स कवर करता है, लेकिन ऐड-ऑन राइडर विशिष्ट आवश्यकताओं के लिए पॉलिसी को बेहतर बनाते हैं।", hinglish: "Standard travel insurance basics cover karta hai, lekin add-on riders specific needs ke liye policy enhance karte hain. Destination aur activities ke basis pe wisely choose karein." },
    approxCost: { en: "Approx. Cost:", hi: "अनुमानित लागत:", hinglish: "Approx. Cost:" },
  },
  faq: {
    heading: { en: "Travel Insurance", hi: "ट्रैवल इंश्योरेंस", hinglish: "Travel Insurance" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: { en: "Frequently asked questions about travel insurance in India. Still have questions? Chat with our AI advisor or talk to Himanshu on WhatsApp.", hi: "भारत में ट्रैवल इंश्योरेंस के बारे में अक्सर पूछे जाने वाले सवाल। अभी भी सवाल हैं? हमारे AI सलाहकार से चैट करें या हिमांशु से WhatsApp पर बात करें।", hinglish: "India mein travel insurance ke baare mein often pooche jaane wale sawaal. Abhi bhi sawaal hain? Hamaare AI advisor se chat karein ya Himanshu se WhatsApp pe baat karein." },
  },
  cta: {
    heading1: { en: "Compare Travel Insurance Plans &", hi: "ट्रैवल इंश्योरेंस योजनाओं की तुलना करें और", hinglish: "Travel Insurance Plans Compare Karein &" },
    headingHighlight: { en: "Travel Worry-Free", hi: "निश्चिंत यात्रा करें", hinglish: "Travel Worry-Free" },
    desc: { en: "Don't let unexpected emergencies ruin your trip. Compare travel insurance from 5+ insurers, choose the best plan, and travel with confidence. Premiums start at just ₹449 per trip.", hi: "अप्रत्याशित आपातकाल अपनी यात्रा को खराब न होने दें। 5+ बीमाकर्ताओं से ट्रैवल इंश्योरेंस की तुलना करें, सर्वोत्तम योजना चुनें, और आत्मविश्वास से यात्रा करें। प्रीमियम केवल ₹449 प्रति यात्रा से शुरू।", hinglish: "Unexpected emergencies apni trip ko kharab na hone dein. 5+ insurers se travel insurance compare karein, best plan choose karein, aur confidence se travel karein. Premiums sirf ₹449 per trip se shuru." },
    ctaCompare: { en: "Compare & Buy Now", hi: "तुलना करें और अभी खरीदें", hinglish: "Compare & Buy Now" },
    ctaWhatsApp: { en: "💬 Talk to Himanshu on WhatsApp", hi: "💬 हिमांशु से WhatsApp पर बात करें", hinglish: "💬 Himanshu se WhatsApp pe Baat Karein" },
    byline: { en: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834", hi: "हिमांशु पालीवाल द्वारा — IRDAI प्रमाणित बीमा सलाहकार · POSP कोड: IP429834", hinglish: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834" },
  },
};

const faqsEn = [
  { q: "Is travel insurance mandatory for international trips from India?", a: "Travel insurance is not legally mandatory for all international trips, but several countries require it as part of the visa application process. Schengen countries mandate travel insurance with a minimum coverage of €30,000." },
  { q: "What does travel insurance typically cover in India?", a: "A standard travel insurance policy covers medical emergencies, trip cancellation, baggage loss, flight delay, personal accident, personal liability, and emergency evacuation." },
  { q: "How much does travel insurance cost in India?", a: "Travel insurance premiums start from ₹449 for a short domestic trip and go up to ₹2,999 for comprehensive international coverage." },
  { q: "Can I buy travel insurance after starting my trip?", a: "Most insurers require you to purchase before your trip begins. Some allow purchase after departure with a 24-48 hour waiting period." },
  { q: "What is not covered under travel insurance?", a: "Common exclusions include pre-existing conditions, adventure sports, self-inflicted injuries, losses due to war, and baggage loss not reported within 24 hours." },
  { q: "How do I file a travel insurance claim?", a: "Notify the insurer immediately, collect all documents, submit the claim form within the specified timeline. The insurer processes the claim within 15-30 days." },
  { q: "Should I buy individual or family floater travel insurance?", a: "Family floater is usually more economical for families — it costs 20-30% less than individual policies. For solo travellers, individual plans offer the best value." },
];

const faqsTranslated = [
  { q: { en: "Is travel insurance mandatory for international trips from India?", hi: "क्या भारत से अंतर्राष्ट्रीय यात्रा के लिए ट्रैवल इंश्योरेंस अनिवार्य है?", hinglish: "Kya India se international trips ke liye travel insurance mandatory hai?" }, a: { en: "Travel insurance is not legally mandatory for all international trips, but several countries require it as part of the visa application process. Schengen countries mandate travel insurance with a minimum coverage of €30,000 (approximately ₹27 lakh).", hi: "सभी अंतर्राष्ट्रीय यात्राओं के लिए ट्रैवल इंश्योरेंस कानूनी रूप से अनिवार्य नहीं है, लेकिन कई देश वीज़ा आवेदन प्रक्रिया के हिस्से के रूप में इसकी आवश्यकता करते हैं। शेंगेन देश न्यूनतम €30,000 कवरेज के साथ ट्रैवल इंश्योरेंस अनिवार्य करते हैं।", hinglish: "Travel insurance sabhi international trips ke liye legally mandatory nahi hai, lekin kai desh visa application process ke hisse ke roop mein iski requirement karte hain. Schengen countries minimum €30,000 coverage ke saath travel insurance mandatory karte hain." } },
  { q: { en: "What does travel insurance typically cover in India?", hi: "भारत में ट्रैवल इंश्योरेंस आमतौर पर क्या कवर करता है?", hinglish: "India mein travel insurance typically kya cover karta hai?" }, a: { en: "A standard travel insurance policy covers medical emergencies, trip cancellation, baggage loss, flight delay, personal accident, personal liability, and emergency evacuation.", hi: "एक मानक ट्रैवल इंश्योरेंस पॉलिसी चिकित्सा आपातकाल, यात्रा रद्द, सामान खोना, फ्लाइट देरी, व्यक्तिगत दुर्घटना, व्यक्तिगत देयता और आपातकालीन निकासी कवर करती है।", hinglish: "Standard travel insurance policy medical emergencies, trip cancellation, baggage loss, flight delay, personal accident, personal liability aur emergency evacuation cover karti hai." } },
  { q: { en: "How much does travel insurance cost in India?", hi: "भारत में ट्रैवल इंश्योरेंस कितना खर्च होता है?", hinglish: "India mein travel insurance kitna kharch hota hai?" }, a: { en: "Travel insurance premiums start from ₹449 for a short domestic trip and go up to ₹2,999 for comprehensive international coverage. A 7-day trip to Southeast Asia typically costs ₹500-₹900. The same trip to the USA costs ₹1,200-₹2,500.", hi: "ट्रैवल इंश्योरेंस प्रीमियम एक छोटी घरेलू यात्रा के लिए ₹449 से शुरू होता है और व्यापक अंतर्राष्ट्रीय कवरेज के लिए ₹2,999 तक जाता है।", hinglish: "Travel insurance premiums ₹449 se shuru hote hain short domestic trip ke liye aur ₹2,999 tak jaate hain comprehensive international coverage ke liye." } },
  { q: { en: "Can I buy travel insurance after starting my trip?", hi: "क्या मैं यात्रा शुरू करने के बाद ट्रैवल इंश्योरेंस खरीद सकता हूँ?", hinglish: "Kya main trip start karne ke baad travel insurance khareed sakta hoon?" }, a: { en: "Most insurers require you to purchase travel insurance before your trip begins. However, some allow you to buy a policy even after departure, subject to a waiting period of 24-48 hours. This is not recommended because you will not be covered during the waiting period.", hi: "अधिकांश बीमाकर्ता यात्रा शुरू होने से पहले ट्रैवल इंश्योरेंस खरीदने की आवश्यकता करते हैं। हालांकि, कुछ प्रस्थान के बाद भी 24-48 घंटे की प्रतीक्षा अवधि के साथ खरीदने की अनुमति देते हैं।", hinglish: "Zyadatar insurers trip shuru hone se pehle travel insurance khareedne ki requirement karte hain. Lekin, kuch departure ke baad bhi 24-48 hours ki waiting period ke saath khareedne ki permission dete hain." } },
  { q: { en: "What is not covered under travel insurance?", hi: "ट्रैवल इंश्योरेंस के तहत क्या कवर नहीं होता?", hinglish: "Travel insurance ke tahat kya cover nahi hota?" }, a: { en: "Common exclusions include pre-existing medical conditions, adventure sports, self-inflicted injuries, losses due to war or civil unrest, baggage loss not reported within 24 hours, and trip cancellation due to change of mind. Always read policy wordings carefully.", hi: "सामान्य बहिष्करणों में पूर्व-मौजूदा चिकित्सा स्थितियाँ, एडवेंचर स्पोर्ट्स, स्व-प्रेरित चोटें, युद्ध या नागरिक अशांति के कारण नुकसान, 24 घंटे के भीतर रिपोर्ट न किया गया सामान नुकसान शामिल हैं।", hinglish: "Common exclusions mein pre-existing medical conditions, adventure sports, self-inflicted injuries, war ya civil unrest ki wajah se losses, 24 hours ke andar report na kiya gaya baggage loss shamil hain." } },
  { q: { en: "How do I file a travel insurance claim?", hi: "मैं ट्रैवल इंश्योरेंस क्लेम कैसे दाखिल करूँ?", hinglish: "Travel insurance claim kaise file karoon?" }, a: { en: "Notify the insurer immediately, collect all documents (hospital bills, police report, airline confirmation, baggage report), submit the claim form within 30 days from return. The insurer processes the claim within 15-30 days. PaliwalSecure.in assists you throughout the claim process.", hi: "बीमाकर्ता को तुरंत सूचित करें, सभी दस्तावेज़ एकत्र करें, वापसी से 30 दिनों के भीतर क्लेम फ़ॉर्म जमा करें। बीमाकर्ता 15-30 दिनों में क्लेम प्रोसेस करता है।", hinglish: "Insurer ko turant suchit karein, saare documents collect karein, return se 30 dinon ke andar claim form submit karein. Insurer 15-30 dinon mein claim process karta hai." } },
  { q: { en: "Should I buy individual or family floater travel insurance?", hi: "क्या मुझे व्यक्तिगत या फ़ैमिली फ्लोटर ट्रैवल इंश्योरेंस खरीदना चाहिए?", hinglish: "Individual ya family floater travel insurance khareedein?" }, a: { en: "If travelling with family, a family floater plan is usually more economical — it costs 20-30% less than individual policies. For solo travellers, individual plans offer the best value. Our AI advisor can help you compare both options.", hi: "यदि परिवार के साथ यात्रा कर रहे हैं, तो फ़ैमिली फ्लोटर योजना आमतौर पर अधिक किफ़ायती है — यह व्यक्तिगत पॉलिसियों से 20-30% कम खर्च होती है। एकल यात्रियों के लिए व्यक्तिगत योजनाएँ सर्वोत्तम मूल्य देती हैं।", hinglish: "Agar family ke saath travel kar rahe hain, toh family floater plan usually zyada economical hai — yeh individual policies se 20-30% kam kharch hoti hai. Solo travellers ke liye individual plans best value deti hain." } },
];

const comparisonPlans = [
  { name: "Star Health Travel", planName: "Star Travel Care", premium: "₹449 – ₹1,199/trip", coverage: "₹50K – ₹5L", claimSettlement: "89%", highlight: { en: "Cashless treatment in 190+ countries", hi: "190+ देशों में कैशलेस उपचार", hinglish: "Cashless treatment in 190+ countries" }, aiPick: false },
  { name: "ICICI Lombard", planName: "Overseas Gold", premium: "₹599 – ₹1,799/trip", coverage: "₹1L – ₹7.5L", claimSettlement: "91%", highlight: { en: "Trip cancellation + adventure sports add-on", hi: "यात्रा रद्द + एडवेंचर स्पोर्ट्स ऐड-ऑन", hinglish: "Trip cancellation + adventure sports add-on" }, aiPick: false },
  { name: "Bajaj Allianz", planName: "Travel Elite", premium: "₹649 – ₹2,499/trip", coverage: "₹1L – ₹10L", claimSettlement: "90%", highlight: { en: "Home burglary cover during travel", hi: "यात्रा के दौरान घर सेंधमारी कवर", hinglish: "Home burglary cover during travel" }, aiPick: true },
  { name: "TATA AIG", planName: "Travel Guard", premium: "₹549 – ₹2,199/trip", coverage: "₹75K – ₹10L", claimSettlement: "92%", highlight: { en: "Study abroad cover for students", hi: "छात्रों के लिए विदेश में पढ़ाई कवर", hinglish: "Study abroad cover for students" }, aiPick: false },
  { name: "HDFC ERGO", planName: "Travelsafe", premium: "₹499 – ₹2,999/trip", coverage: "₹50K – ₹10L", claimSettlement: "91%", highlight: { en: "Pre-existing condition cover (emergency)", hi: "पूर्व-मौजूदा स्थिति कवर (आपातकाल)", hinglish: "Pre-existing condition cover (emergency)" }, aiPick: false },
];

const premiumEstimates = [
  { destination: { en: "Southeast Asia (Thailand, Bali, Singapore)", hi: "दक्षिण-पूर्व एशिया (थाईलैंड, बाली, सिंगापुर)", hinglish: "Southeast Asia (Thailand, Bali, Singapore)" }, duration: "7 days", age: "25-40", basic: "₹500 – ₹800", comprehensive: "₹900 – ₹1,400" },
  { destination: { en: "Europe (Schengen)", hi: "यूरोप (शेंगेन)", hinglish: "Europe (Schengen)" }, duration: "10 days", age: "25-40", basic: "₹1,200 – ₹1,800", comprehensive: "₹2,000 – ₹3,200" },
  { destination: { en: "USA / Canada", hi: "USA / कनाडा", hinglish: "USA / Canada" }, duration: "10 days", age: "25-40", basic: "₹1,500 – ₹2,200", comprehensive: "₹2,500 – ₹4,000" },
  { destination: { en: "Domestic (India)", hi: "घरेलू (भारत)", hinglish: "Domestic (India)" }, duration: "5 days", age: "25-40", basic: "₹449 – ₹600", comprehensive: "₹700 – ₹1,000" },
  { destination: { en: "Worldwide (excl. USA/Canada)", hi: "वैश्विक (USA/कनाडा को छोड़कर)", hinglish: "Worldwide (excl. USA/Canada)" }, duration: "15 days", age: "25-40", basic: "₹1,800 – ₹2,500", comprehensive: "₹3,000 – ₹4,500" },
  { destination: { en: "Any International", hi: "कोई भी अंतर्राष्ट्रीय", hinglish: "Any International" }, duration: "7 days", age: "60+", basic: "₹1,200 – ₹2,000", comprehensive: "₹2,200 – ₹3,800" },
];

const addOns = [
  { name: { en: "Adventure Sports Cover", hi: "एडवेंचर स्पोर्ट्स कवर", hinglish: "Adventure Sports Cover" }, desc: { en: "Covers injuries from bungee jumping, scuba diving, paragliding, trekking above 4,500m, white water rafting, and other high-risk activities. Standard policies exclude these.", hi: "बंजी जंपिंग, स्कूबा डाइविंग, पैराग्लाइडिंग, 4,500m से ऊपर ट्रैकिंग, व्हाइट वॉटर राफ्टिंग और अन्य उच्च-जोखिम गतिविधियों से चोट कवर करता है।", hinglish: "Bungee jumping, scuba diving, paragliding, trekking above 4,500m, white water rafting aur other high-risk activities se injuries cover karta hai." }, cost: "₹200 – ₹600/trip" },
  { name: { en: "Pre-Existing Condition Cover", hi: "पूर्व-मौजूदा स्थिति कवर", hinglish: "Pre-Existing Condition Cover" }, desc: { en: "Extends coverage to emergency medical treatment arising from pre-existing conditions like diabetes, hypertension, or heart disease. Critical for senior citizens.", hi: "मधुमेह, उच्च रक्तचाप या हृदय रोग जैसी पूर्व-मौजूदा स्थितियों से उत्पन्न आपातकालीन चिकित्सा उपचार तक कवरेज बढ़ाता है। वरिष्ठ नागरिकों के लिए महत्वपूर्ण।", hinglish: "Pre-existing conditions jaise diabetes, hypertension ya heart disease se emergency medical treatment tak coverage extend karta hai. Senior citizens ke liye critical." }, cost: "₹300 – ₹1,000/trip" },
  { name: { en: "Home Burglary Cover", hi: "घर सेंधमारी कवर", hinglish: "Home Burglary Cover" }, desc: { en: "Covers loss or damage to your home and belongings due to burglary while you are travelling. Your home is most vulnerable when you are away on a long trip.", hi: "यात्रा के दौरान सेंधमारी के कारण आपके घर और सामान की हानि या क्षति कवर करता है। लंबी यात्रा पर आपका घर सबसे अधिक संवेदनशील होता है।", hinglish: "Travel ke dauraan burglary ki wajah se aapke ghar aur samaan ka loss ya damage cover karta hai. Long trip pe aapka ghar sabse zyada vulnerable hota hai." }, cost: "₹150 – ₹400/trip" },
  { name: { en: "Golf Equipment Cover", hi: "गोल्फ़ उपकरण कवर", hinglish: "Golf Equipment Cover" }, desc: { en: "Covers loss, damage, or theft of golf equipment during your trip. Also covers third-party liability arising from playing golf.", hi: "यात्रा के दौरान गोल्फ़ उपकरण की हानि, क्षति या चोरी कवर करता है। गोल्फ़ खेलने से उत्पन्न तीसरे पक्ष की देयता भी कवर करता है।", hinglish: "Trip ke dauraan golf equipment ka loss, damage ya theft cover karta hai. Golf khelne se third-party liability bhi cover karta hai." }, cost: "₹250 – ₹500/trip" },
  { name: { en: "Trip Curtailment Extension", hi: "यात्रा संक्षेपण विस्तार", hinglish: "Trip Curtailment Extension" }, desc: { en: "Extends the trip curtailment benefit to cover additional reasons beyond the standard ones. Useful for business travellers who may need to cut short their trip unexpectedly.", hi: "मानक कारणों से परे अतिरिक्त कारणों को कवर करने के लिए यात्रा संक्षेपण लाभ का विस्तार करता है। व्यापार यात्रियों के लिए उपयोगी।", hinglish: "Standard reasons se beyond additional reasons cover karne ke liye trip curtailment benefit extend karta hai. Business travellers ke liye useful." }, cost: "₹100 – ₹300/trip" },
  { name: { en: "Personal Liability Upgrade", hi: "व्यक्तिगत देयता अपग्रेड", hinglish: "Personal Liability Upgrade" }, desc: { en: "Increases the personal liability coverage from ₹5-10 lakh to ₹25-50 lakh. Important for travellers visiting the USA, Canada, or Europe where legal costs can be extremely high.", hi: "व्यक्तिगत देयता कवरेज ₹5-10 लाख से ₹25-50 लाख तक बढ़ाता है। USA, कनाडा या यूरोप की यात्रा करने वालों के लिए महत्वपूर्ण।", hinglish: "Personal liability coverage ₹5-10 lakh se ₹25-50 lakh tak badhata hai. USA, Canada ya Europe travel karne walon ke liye important." }, cost: "₹200 – ₹600/trip" },
];

function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />;
}

export default function TravelInsuranceClientContent() {
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

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 pt-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary transition-colors">{pt(t.breadcrumb.home, language)}</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{pt(t.breadcrumb.current, language)}</li>
        </ol>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{pt(t.hero.badge, language)}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {pt(t.hero.title1, language)} <span className="gradient-text">{pt(t.hero.title2, language)}</span> {pt(t.hero.titleSuffix, language)}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8">{pt(t.hero.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/free-audit"><ShinyButton variant="blue"><span>{pt(t.hero.ctaCompare, language)}</span></ShinyButton></Link>
            <a href="https://wa.me/919257877312?text=Hi%2C%20I%20need%20help%20with%20travel%20insurance" target="_blank" rel="noopener noreferrer"><ShinyButton variant="secondary"><span>{pt(t.hero.ctaWhatsApp, language)}</span></ShinyButton></a>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { val: pt(t.hero.stat1Val, language), label: pt(t.hero.stat1Label, language) },
              { val: pt(t.hero.stat2Val, language), label: pt(t.hero.stat2Label, language) },
              { val: pt(t.hero.stat3Val, language), label: pt(t.hero.stat3Label, language) },
              { val: pt(t.hero.stat4Val, language), label: pt(t.hero.stat4Label, language) },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{s.val}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* WHAT IS TRAVEL INSURANCE */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">{pt(t.whatIs.heading, language)} <span className="gradient-text">{pt(t.whatIs.headingHighlight, language)}</span>?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(t.whatIs.para1, language)}</p>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(t.whatIs.para2, language)}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">🇮🇳 {pt(t.whatIs.domesticTitle, language)}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[pt(t.whatIs.domestic1, language), pt(t.whatIs.domestic2, language), pt(t.whatIs.domestic3, language), pt(t.whatIs.domestic4, language), pt(t.whatIs.domestic5, language)].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">🌍 {pt(t.whatIs.intlTitle, language)}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[pt(t.whatIs.intl1, language), pt(t.whatIs.intl2, language), pt(t.whatIs.intl3, language), pt(t.whatIs.intl4, language), pt(t.whatIs.intl5, language)].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* KEY FEATURES */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{pt(t.features.heading, language)} <span className="gradient-text">{pt(t.features.headingHighlight, language)}</span> {pt(t.features.headingSuffix, language)}</h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-4xl">{pt(t.features.desc, language)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: pt(t.features.f1Title, language), desc: pt(t.features.f1Desc, language), icon: "🏥" },
              { title: pt(t.features.f2Title, language), desc: pt(t.features.f2Desc, language), icon: "✈️" },
              { title: pt(t.features.f3Title, language), desc: pt(t.features.f3Desc, language), icon: "🧳" },
              { title: pt(t.features.f4Title, language), desc: pt(t.features.f4Desc, language), icon: "⏱️" },
              { title: pt(t.features.f5Title, language), desc: pt(t.features.f5Desc, language), icon: "🛡️" },
              { title: pt(t.features.f6Title, language), desc: pt(t.features.f6Desc, language), icon: "🚁" },
            ].map((feature, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* COMPARISON TABLE */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{pt(t.comparison.heading, language)} <span className="gradient-text">{pt(t.comparison.headingHighlight, language)}</span> {pt(t.comparison.headingSuffix, language)}</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(t.comparison.desc, language)}</p>
          <div className="glass-card rounded-xl p-6 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">{pt(t.comparison.thInsurer, language)}</th>
                  <th className="text-left py-3 px-4 font-semibold">{pt(t.comparison.thPlan, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.comparison.thPremium, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.comparison.thCoverage, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.comparison.thClaim, language)}</th>
                  <th className="text-left py-3 px-4 font-semibold">{pt(t.comparison.thHighlight, language)}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonPlans.map((plan, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 font-medium">
                      {plan.name}
                      {plan.aiPick && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">{pt(t.comparison.aiPick, language)}</span>}
                    </td>
                    <td className="py-3 px-4">{plan.planName}</td>
                    <td className="py-3 px-4 text-center gradient-text font-semibold">{plan.premium}</td>
                    <td className="py-3 px-4 text-center font-medium">{plan.coverage}</td>
                    <td className="py-3 px-4 text-center">{plan.claimSettlement}</td>
                    <td className="py-3 px-4 text-primary text-xs">{pt(plan.highlight, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-4">{pt(t.comparison.footnote, language)}</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* PREMIUM ESTIMATES */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{pt(t.premiumEst.heading, language)} <span className="gradient-text">{pt(t.premiumEst.headingHighlight, language)}</span></h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(t.premiumEst.desc, language)}</p>
          <div className="glass-card rounded-xl p-6 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">{pt(t.premiumEst.thDest, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.premiumEst.thDuration, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.premiumEst.thAge, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.premiumEst.thBasic, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.premiumEst.thComprehensive, language)}</th>
                </tr>
              </thead>
              <tbody>
                {premiumEstimates.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{pt(row.destination, language)}</td>
                    <td className="py-3 px-4 text-center">{row.duration}</td>
                    <td className="py-3 px-4 text-center">{row.age}</td>
                    <td className="py-3 px-4 text-center gradient-text font-semibold">{row.basic}</td>
                    <td className="py-3 px-4 text-center gradient-text font-semibold">{row.comprehensive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 max-w-3xl">
            <p className="text-sm font-medium text-primary mb-1">{pt(t.premiumEst.tipTitle, language)}</p>
            <p className="text-xs text-muted-foreground">{pt(t.premiumEst.tipDesc, language)}</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ADD-ON RIDERS */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{pt(t.addOns.heading, language)} <span className="gradient-text">{pt(t.addOns.headingHighlight, language)}</span></h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-4xl">{pt(t.addOns.desc, language)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold mb-2">{pt(addon.name, language)}</h3>
                <p className="text-sm text-muted-foreground mb-3">{pt(addon.desc, language)}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{pt(t.addOns.approxCost, language)}</span>
                  <span className="font-semibold gradient-text">{addon.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FAQ */}
      <section className="py-12 md:py-20 bg-card/50" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{pt(t.faq.heading, language)} <span className="gradient-text">{pt(t.faq.headingHighlight, language)}</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{pt(t.faq.desc, language)}</p>
          </div>
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
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{pt(t.cta.heading1, language)} <span className="gradient-text">{pt(t.cta.headingHighlight, language)}</span></h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(t.cta.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/free-audit"><ShinyButton variant="blue"><span>{pt(t.cta.ctaCompare, language)}</span></ShinyButton></Link>
            <a href="https://wa.me/919257877312?text=Hi%2C%20I%20want%20to%20buy%20travel%20insurance" target="_blank" rel="noopener noreferrer"><ShinyButton variant="secondary"><span>{pt(t.cta.ctaWhatsApp, language)}</span></ShinyButton></a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/health-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">Health Insurance →</Link>
            <Link href="/car-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">Car Insurance →</Link>
            <Link href="/life-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">Life Insurance →</Link>
            <Link href="/claim-guide" className="text-cyan-600 dark:text-cyan-400 hover:underline">Claim Guide →</Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{pt(t.cta.byline, language)}</p>
        </div>
      </section>
    </div>
  );
}
