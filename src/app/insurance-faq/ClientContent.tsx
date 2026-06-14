'use client';

import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import Link from 'next/link';
import { useState } from 'react';

// ── Translation helper ──────────────────────────────────────────────────────
type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

// ── Inline page translations ────────────────────────────────────────────────
const pageText = {
  hero: {
    badge: { en: "50+ Questions Answered", hi: "50+ सवालों के जवाब", hinglish: "50+ Sawaalon Ke Jawab" },
    title1: { en: "Insurance", hi: "बीमा", hinglish: "Insurance" },
    titleHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: {
      en: "Get answers to 50+ frequently asked questions about health, car, and life insurance in India. IRDAI-compliant answers in simple language.",
      hi: "भारत में हेल्थ, कार और लाइफ इंश्योरेंस के 50+ अक्सर पूछे जाने वाले सवालों के जवाब पाएँ। IRDAI अनुपालित जवाब सरल भाषा में।",
      hinglish: "India mein health, car aur life insurance ke 50+ often pooche jaane wale sawaalon ke jawab paayein. IRDAI-compliant answers aasan bhasha mein."
    },
    ctaWhatsApp: { en: "💬 Ask on WhatsApp", hi: "💬 WhatsApp पर पूछें", hinglish: "💬 WhatsApp pe Poochiye" },
    ctaChat: { en: "🤖 Chat with InsureGPT", hi: "🤖 InsureGPT से चैट करें", hinglish: "🤖 InsureGPT se Chat Karein" },
  },
  categories: {
    all: { en: "All", hi: "सभी", hinglish: "All" },
    health: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    car: { en: "Car Insurance", hi: "कार बीमा", hinglish: "Car Insurance" },
    life: { en: "Life Insurance", hi: "लाइफ इंश्योरेंस", hinglish: "Life Insurance" },
    claims: { en: "Claims", hi: "क्लेम", hinglish: "Claims" },
    general: { en: "General", hi: "सामान्य", hinglish: "General" },
  },
  cta: {
    heading: { en: "Still Have", hi: "अभी भी सवाल", hinglish: "Abhi Bhi Sawaal" },
    headingHighlight: { en: "Questions?", hi: "हैं?", hinglish: "Hai?" },
    desc: {
      en: "Chat with our AI advisor or talk to Himanshu Paliwal on WhatsApp. Get personalized guidance — zero spam, zero charges.",
      hi: "हमारे AI सलाहकार से चैट करें या हिमांशु पालीवाल से WhatsApp पर बात करें। व्यक्तिगत मार्गदर्शन प्राप्त करें — शून्य स्पैम, शून्य शुल्क।",
      hinglish: "Hamaare AI advisor se chat karein ya Himanshu Paliwal se WhatsApp pe baat karein. Personalized guidance paayein — zero spam, zero charges."
    },
    ctaWhatsApp: { en: "💬 Chat on WhatsApp", hi: "💬 WhatsApp पर चैट करें", hinglish: "💬 WhatsApp pe Chat Karein" },
    ctaInsureGPT: { en: "🤖 Ask InsureGPT", hi: "🤖 InsureGPT से पूछें", hinglish: "🤖 InsureGPT se Poochiye" },
    byline: { en: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834", hi: "हिमांशु पालीवाल द्वारा — IRDAI प्रमाणित बीमा सलाहकार · POSP कोड: IP429834", hinglish: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834" },
  },
  related: {
    heading: { en: "Explore", hi: "और जानें", hinglish: "Aur Jaaniye" },
    headingHighlight: { en: "More", hi: "और", hinglish: "Aur" },
    glossaryTitle: { en: "Insurance Glossary", hi: "बीमा शब्दावली", hinglish: "Insurance Glossary" },
    glossaryDesc: { en: "30+ terms explained in Hindi & English", hi: "हिंदी और अंग्रेज़ी में 30+ शब्द समझाए गए", hinglish: "30+ terms Hindi & English mein samjhaye gaye" },
    claimTitle: { en: "Claim Guide", hi: "क्लेम गाइड", hinglish: "Claim Guide" },
    claimDesc: { en: "Cashless & reimbursement process explained", hi: "कैशलेस और प्रतिपूर्ति प्रक्रिया समझाई गई", hinglish: "Cashless & reimbursement process samjhaayi gayi" },
    rightsTitle: { en: "Policyholder Rights", hi: "पॉलिसीधारक अधिकार", hinglish: "Policyholder Rights" },
    rightsDesc: { en: "Know your rights under IRDAI regulations", hi: "IRDAI नियमों के तहत अपने अधिकार जानें", hinglish: "IRDAI regulations ke tahat apne rights jaanein" },
    healthTitle: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    healthDesc: { en: "Compare best health plans in India", hi: "भारत में सर्वोत्तम हेल्थ प्लान की तुलना करें", hinglish: "Best health plans India mein compare karein" },
  },
};

// ── FAQ data with full i18n ─────────────────────────────────────────────────
const faqs: { cat: string; q: TEntry; a: TEntry }[] = [
  // ── Health Insurance ────────────────────────────────────────────────────
  {
    cat: 'health',
    q: { en: "What is health insurance and why do I need it?", hi: "हेल्थ इंश्योरेंस क्या है और मुझे इसकी ज़रूरत क्यों है?", hinglish: "Health insurance kya hai aur mujhe iski zaroorat kyun hai?" },
    a: { en: "Health insurance is a contract where the insurer pays for your medical expenses — hospitalization, surgeries, treatments, and more. In India, medical inflation is 12-15% annually. A single hospitalization can cost ₹2-10 lakhs. Health insurance protects your savings and ensures you get quality treatment without financial stress. Every Indian family should have at least ₹10 lakh health cover.", hi: "हेल्थ इंश्योरेंस एक अनुबंध है जिसमें बीमाकर्ता आपके चिकित्सा खर्चों — अस्पताल में भर्ती, सर्जरी, उपचार आदि का भुगतान करता है। भारत में मेडिकल महंगाई 12-15% वार्षिक है। एक बार अस्पताल में भर्ती होने पर ₹2-10 लाख खर्च हो सकते हैं। हेल्थ इंश्योरेंस आपकी बचत को सुरक्षित रखता है। हर भारतीय परिवार के पास कम से कम ₹10 लाख का हेल्थ कवर होना चाहिए।", hinglish: "Health insurance ek contract hai jismein insurer aapke medical expenses — hospitalization, surgeries, treatments, aur more ke liye pay karta hai. India mein medical inflation 12-15% annual hai. Ek hospitalization mein ₹2-10 lakh lag sakta hai. Health insurance aapki savings ko protect karta hai. Har Indian family ke paas kam se kam ₹10 lakh health cover hona chahiye." },
  },
  {
    cat: 'health',
    q: { en: "What is cashless health insurance?", hi: "कैशलेस हेल्थ इंश्योरेंस क्या है?", hinglish: "Cashless health insurance kya hai?" },
    a: { en: "In cashless claims, the insurance company pays the hospital directly — you don't pay upfront (except co-pay/deductibles). This works only at network hospitals empanelled with your insurer. India has 10,000+ network hospitals. IRDAI mandates 1-hour pre-auth approval for emergencies and 3-hour discharge clearance. Always verify network status before admission.", hi: "कैशलेस क्लेम में, बीमा कंपनी सीधे अस्पताल को भुगतान करती है — आपको अग्रिम भुगतान नहीं करना पड़ता (सिवाय को-पे/कटौती के)। यह केवल आपके बीमाकर्ता के नेटवर्क अस्पतालों में काम करता है। भारत में 10,000+ नेटवर्क अस्पताल हैं। IRDAI आपातकाल के लिए 1 घंटे की प्री-ऑथ अनुमोदन और 3 घंटे की डिस्चार्ज क्लीयरेंस अनिवार्य करता है।", hinglish: "Cashless claims mein, insurance company directly hospital ko pay karti hai — aapko upfront pay nahi karna padta (except co-pay/deductibles). Yeh sirf network hospitals mein kaam karta hai. India mein 10,000+ network hospitals hain. IRDAI 1-hour pre-auth approval for emergencies aur 3-hour discharge clearance mandatory karta hai." },
  },
  {
    cat: 'health',
    q: { en: "What is PED (Pre-existing Disease) in health insurance?", hi: "हेल्थ इंश्योरेंस में PED (पूर्व-मौजूदा बीमारी) क्या है?", hinglish: "Health insurance mein PED (Pre-existing Disease) kya hai?" },
    a: { en: "PED means any health condition that existed before your policy start date — diabetes, hypertension, thyroid, asthma, etc. Most insurers cover PEDs after a 1-4 year waiting period. Non-disclosure of PED is the #1 reason for claim rejection. Always declare your complete medical history honestly when buying insurance.", hi: "PED का मतलब कोई भी स्वास्थ्य स्थिति जो आपकी पॉलिसी शुरू होने से पहले मौजूद थी — मधुमेह, उच्च रक्तचाप, थायरॉइड, अस्थमा आदि। अधिकांश बीमाकर्ता PED को 1-4 वर्ष की प्रतीक्षा अवधि के बाद कवर करते हैं। PED छुपाना क्लेम अस्वीकृति का #1 कारण है। हमेशा अपनी पूरी चिकित्सा इतिहास ईमानदारी से घोषित करें।", hinglish: "PED matlab koi bhi health condition jo aapki policy start hone se pehle mojud thi — diabetes, hypertension, thyroid, asthma, etc. Zyadaatar insurers PED ko 1-4 year waiting period ke baad cover karte hain. PED chhupana claim rejection ka #1 reason hai. Hamesha apni poori medical history honestly declare karein." },
  },
  {
    cat: 'health',
    q: { en: "How much health insurance coverage do I need?", hi: "मुझे कितने हेल्थ इंश्योरेंस कवरेज की ज़रूरत है?", hinglish: "Mujhe kitne health insurance coverage ki zaroorat hai?" },
    a: { en: "Minimum ₹10 lakh for individuals, ₹15-25 lakh for families. In metro cities, a single hospitalization can cost ₹5-15 lakhs. Consider: (1) City you live in — metros cost more. (2) Family size and ages. (3) Medical inflation at 12-15% annually. (4) Your savings. A ₹10 lakh policy costs just ₹500-800/month. Add a super top-up of ₹50 lakh for just ₹200-400/month extra.", hi: "व्यक्तिगत रूप से न्यूनतम ₹10 लाख, परिवारों के लिए ₹15-25 लाख। मेट्रो शहरों में एक बार अस्पताल में ₹5-15 लाख खर्च हो सकते हैं। ₹10 लाख की पॉलिसी महज़ ₹500-800/माह में मिलती है। ₹50 लाख का सुपर टॉप-अप महज़ ₹200-400/माह अतिरिक्त में जोड़ें।", hinglish: "Individuals ke liye minimum ₹10 lakh, families ke liye ₹15-25 lakh. Metro cities mein ek hospitalization mein ₹5-15 lakh lag sakte hain. ₹10 lakh ki policy sirf ₹500-800/month mein milti hai. ₹50 lakh ka super top-up sirf ₹200-400/month extra mein add karein." },
  },
  {
    cat: 'health',
    q: { en: "What is the waiting period in health insurance?", hi: "हेल्थ इंश्योरेंस में प्रतीक्षा अवधि क्या है?", hinglish: "Health insurance mein waiting period kya hai?" },
    a: { en: "Waiting period is when certain benefits are NOT available: (1) Initial waiting period — 30 days from policy start. (2) PED waiting — 1-4 years for pre-existing diseases. (3) Specific disease waiting — 1-2 years for cataract, hernia, etc. (4) Maternity waiting — 9 months to 2 years. Claims during waiting period are rejected except for accidents. IRDAI 2025 has capped PED waiting at 3 years max.", hi: "प्रतीक्षा अवधि वह समय है जब कुछ लाभ उपलब्ध नहीं होते: (1) प्रारंभिक प्रतीक्षा — पॉलिसी शुरू से 30 दिन। (2) PED प्रतीक्षा — पूर्व-मौजूदा बीमारियों के लिए 1-4 वर्ष। (3) विशिष्ट रोग प्रतीक्षा — मोतियाबिंद, हर्निया आदि के लिए 1-2 वर्ष। (4) मातृत्व प्रतीक्षा — 9 महीने से 2 वर्ष। IRDAI 2025 ने PED प्रतीक्षा अधिकतम 3 वर्ष तक सीमित की है।", hinglish: "Waiting period woh time hai jab kuch benefits available nahi hote: (1) Initial waiting — policy start se 30 din. (2) PED waiting — pre-existing diseases ke liye 1-4 saal. (3) Specific disease waiting — cataract, hernia etc ke liye 1-2 saal. (4) Maternity waiting — 9 mahine se 2 saal. IRDAI 2025 ne PED waiting max 3 saal tak cap ki hai." },
  },
  {
    cat: 'health',
    q: { en: "Can I switch my health insurance to another company?", hi: "क्या मैं अपना हेल्थ इंश्योरेंस दूसरी कंपनी में बदल सकता हूँ?", hinglish: "Kya main apna health insurance dusri company mein badal sakta hoon?" },
    a: { en: "Yes! This is called portability. Under IRDAI rules, you can switch insurers while retaining your accumulated benefits — waiting period credits, no-claim bonus, etc. Apply at least 45 days before renewal. The new insurer cannot impose fresh waiting periods for conditions already covered. This protects you from being stuck with a bad insurer.", hi: "हाँ! इसे पोर्टेबिलिटी कहते हैं। IRDAI नियमों के तहत, आप अपने जमा लाभ — प्रतीक्षा अवधि क्रेडिट, नो-क्लेम बोनस आदि को बनाए रखते हुए बीमाकर्ता बदल सकते हैं। नवीनीकरण से कम से कम 45 दिन पहले आवेदन करें। नया बीमाकर्ता पहले से कवर की गई स्थितियों के लिए नई प्रतीक्षा अवधि नहीं लगा सकता।", hinglish: "Haan! Isse portability kehte hain. IRDAI rules ke tahat, aap apne accumulated benefits — waiting period credits, no-claim bonus, etc. retain karte hue insurer switch kar sakte hain. Renewal se kam se kam 45 din pehle apply karein. Naya insurer pehle se covered conditions ke liye fresh waiting period nahi laga sakta." },
  },
  {
    cat: 'health',
    q: { en: "What is co-payment (co-pay) in health insurance?", hi: "हेल्थ इंश्योरेंस में को-पेमेंट (को-पे) क्या है?", hinglish: "Health insurance mein co-payment (co-pay) kya hai?" },
    a: { en: "Co-pay is the fixed percentage of the claim you must pay from your pocket. The insurer pays the rest. Example: 20% co-pay on ₹2 lakh bill = you pay ₹40,000, insurer pays ₹1,60,000. Policies with co-pay have lower premiums but higher out-of-pocket during claims. Senior citizen plans often have mandatory 10-20% co-pay. Avoid co-pay plans if possible — choose policies without co-pay for complete coverage.", hi: "को-पे क्लेम का वह निश्चित प्रतिशत है जो आपको अपनी जेब से देना होता है। बीमाकर्ता बाकी देता है। उदाहरण: ₹2 लाख के बिल पर 20% को-पे = आप ₹40,000 देंगे, बीमाकर्ता ₹1,60,000। को-पे वाली पॉलिसियों का प्रीमियम कम होता है लेकिन क्लेम में जेब से ज़्यादा देना पड़ता है। यदि संभव हो तो को-पे रहित पॉलिसी चुनें।", hinglish: "Co-pay claim ka woh fixed percentage hai jo aapko apni jeb se dena padta hai. Insurer baaki deta hai. Example: 20% co-pay on ₹2 lakh bill = aap ₹40,000 denge, insurer ₹1,60,000. Co-pay wali policies ka premium kam hota hai lekin claim mein jeb se zyada dena padta hai. Agar possible ho toh bina co-pay wali policy choose karein." },
  },
  // ── Car Insurance ───────────────────────────────────────────────────────
  {
    cat: 'car',
    q: { en: "Is car insurance mandatory in India?", hi: "क्या भारत में कार बीमा अनिवार्य है?", hinglish: "Kya India mein car insurance mandatory hai?" },
    a: { en: "Yes! Under the Motor Vehicles Act, 1988, at least Third-Party (TP) insurance is mandatory. Driving without valid insurance attracts fines up to ₹2,000 (first offence) and ₹4,000 (repeat), plus possible imprisonment up to 3 months. Despite this, millions of vehicles remain uninsured. Always keep your car insurance active — renew before expiry.", hi: "हाँ! मोटर वाहन अधिनियम, 1988 के तहत कम से कम थर्ड-पार्टी (TP) बीमा अनिवार्य है। बिना वैध बीमा के गाड़ी चलाने पर ₹2,000 (पहली बार) और ₹4,000 (दोहराने पर) तक का जुर्माना होता है। हमेशा अपना कार बीमा सक्रिय रखें।", hinglish: "Haan! Motor Vehicles Act 1988 ke tahat kam se kam Third-Party (TP) insurance mandatory hai. Bina valid insurance ke driving karne pe ₹2,000 (first offence) aur ₹4,000 (repeat) tak ka fine hota hai. Hamesha apna car insurance active rakhein." },
  },
  {
    cat: 'car',
    q: { en: "What is the difference between Third-Party and Comprehensive car insurance?", hi: "थर्ड-पार्टी और कॉम्प्रिहेंसिव कार बीमे में क्या अंतर है?", hinglish: "Third-Party aur Comprehensive car insurance mein kya farq hai?" },
    a: { en: "Third-Party (TP) covers damage to others — their vehicle, property, or injury. It is mandatory but does NOT cover your own car's damage. Comprehensive covers both third-party liability AND own damage from accidents, theft, fire, floods, and vandalism. TP is cheaper but limited. Comprehensive gives complete protection plus add-on options like zero depreciation and engine protect. Strongly recommended for all cars.", hi: "थर्ड-पार्टी (TP) दूसरों की क्षति कवर करता है — उनका वाहन, संपत्ति या चोट। यह अनिवार्य है लेकिन आपकी अपनी कार की क्षति कवर नहीं करता। कॉम्प्रिहेंसिव थर्ड-पार्टी देयता और ओन डैमेज दोनों कवर करता है। सभी कारों के लिए दृढ़ता से अनुशंसित।", hinglish: "Third-Party (TP) doosron ki damage cover karta hai — unka vehicle, property ya injury. Yeh mandatory hai lekin aapki apni car ki damage cover nahi karta. Comprehensive third-party liability aur own damage dono cover karta hai. Sabhi cars ke liye strongly recommended." },
  },
  {
    cat: 'car',
    q: { en: "What is IDV (Insured Declared Value) in car insurance?", hi: "कार बीमे में IDV (बीमित घोषित मूल्य) क्या है?", hinglish: "Car insurance mein IDV (Insured Declared Value) kya hai?" },
    a: { en: "IDV is your car's current market value — the maximum amount your insurer will pay if your car is stolen or declared a total loss. IDV = Ex-showroom price minus depreciation based on car age. Higher IDV = higher premium but better claim payout. Always ensure your IDV is fair — don't under-insure to save premium.", hi: "IDV आपकी कार का वर्तमान बाज़ार मूल्य है — अधिकतम राशि जो बीमाकर्ता चोरी या पूर्ण हानि पर देगा। IDV = एक्स-शोरूम मूल्य घटा कार आयु के आधार पर ह्रास। उच्च IDV = उच्च प्रीमियम लेकिन बेहतर क्लेम भुगतान। हमेशा अपना IDV उचित रखें।", hinglish: "IDV aapki car ka current market value hai — maximum amount jo insurer theft ya total loss pe dega. IDV = Ex-showroom price minus depreciation based on car age. Higher IDV = higher premium lekin better claim payout. Hamesha apna IDV fair rakhein." },
  },
  {
    cat: 'car',
    q: { en: "What is NCB (No Claim Bonus) in car insurance?", hi: "कार बीमे में NCB (बिना क्लेम बोनस) क्या है?", hinglish: "Car insurance mein NCB (No Claim Bonus) kya hai?" },
    a: { en: "NCB is a discount on Own Damage (OD) premium for every claim-free year. It starts at 20% after 1 year and goes up to 50% after 5+ claim-free years. NCB belongs to you, not the car — it transfers when you buy a new car. A single claim resets it to zero. Protect your NCB with zero dep add-on for small claims.", hi: "NCB हर क्लेम-मुक्त वर्ष पर ओन डैमेज (OD) प्रीमियम पर छूट है। यह 1 वर्ष बाद 20% से शुरू होकर 5+ क्लेम-मुक्त वर्षों बाद 50% तक जाती है। NCB आपका है, कार का नहीं — नई कार खरीदने पर ट्रांसफर होती है। एक क्लेम इसे ज़ीरो कर देता है। छोटे क्लेम के लिए ज़ीरो डेप ऐड-ऑन से NCB बचाएँ।", hinglish: "NCB har claim-free year pe Own Damage (OD) premium pe discount hai. Yeh 1 year baad 20% se shuru hoti hai aur 5+ claim-free years baad 50% tak jaati hai. NCB aapka hai, car ka nahi — nayi car khareedne pe transfer hoti hai. Ek claim isse zero kar deta hai. Chhote claims ke liye zero dep add-on se NCB bachayein." },
  },
  {
    cat: 'car',
    q: { en: "Should I buy Zero Depreciation (Zero Dep) add-on?", hi: "क्या मुझे ज़ीरो डेप्रिसिएशन (ज़ीरो डेप) ऐड-ऑन खरीदना चाहिए?", hinglish: "Kya mujhe Zero Depreciation (Zero Dep) add-on khareedna chahiye?" },
    a: { en: "Absolutely! Zero Dep is the most valuable car insurance add-on. Without it, you bear 30-50% cost of plastic, rubber, and fiber parts during claims. With Zero Dep, the insurer pays full cost minus only compulsory deductible. Available for cars up to 5-7 years old. Costs 15-20% extra premium but saves thousands per claim. Essential for new cars and cars under 5 years.", hi: "बिलकुल! ज़ीरो डेप सबसे मूल्यवान कार बीमा ऐड-ऑन है। इसके बिना, आप क्लेम में प्लास्टिक, रबर और फाइबर पुर्जों की 30-50% लागत वहन करते हैं। ज़ीरो डेप के साथ, बीमाकर्ता पूरी लागत देता है। नई कारों और 5 वर्ष से कम आयु की कारों के लिए आवश्यक।", hinglish: "Bilkul! Zero Dep sabse valuable car insurance add-on hai. Bina iske, aap claim mein plastic, rubber aur fiber parts ki 30-50% cost bear karte hain. Zero Dep ke saath, insurer full cost deta hai. Nayi cars aur 5 saal se kam age ki cars ke liye zaroori." },
  },
  {
    cat: 'car',
    q: { en: "What happens if I don't renew my car insurance on time?", hi: "यदि मैं अपना कार बीमा समय पर नवीनीकरण नहीं करता तो क्या होगा?", hinglish: "Agar main apna car insurance time pe renew nahi karta toh kya hoga?" },
    a: { en: "Your policy enters a grace period of 30 days (yearly payment). During grace period, coverage continues but you must pay immediately. After grace period, the policy lapses — no coverage, NCB lost (if not transferred within 90 days), and you may need fresh inspection. Driving with a lapsed policy is illegal. Set auto-renewal or reminders to avoid this.", hi: "आपकी पॉलिसी 30 दिन की अनुग्रह अवधि में प्रवेश करती है। अनुग्रह अवधि के दौरान कवरेज जारी रहता है। अनुग्रह अवधि के बाद पॉलिसी लैप्स हो जाती है — कोई कवरेज नहीं, NCB खो जाता है, और नया इंस्पेक्शन ज़रूरी हो सकता है। लैप्स पॉलिसी के साथ गाड़ी चलाना अवैध है।", hinglish: "Aapki policy 30 din ki grace period mein enter karti hai. Grace period ke dauraan coverage jaari rehta hai. Grace period ke baad policy lapse ho jaati hai — koi coverage nahi, NCB kho jaata hai, aur naya inspection zaroori ho sakta hai. Lapsed policy ke saath driving illegal hai." },
  },
  // ── Life Insurance ──────────────────────────────────────────────────────
  {
    cat: 'life',
    q: { en: "What is term insurance and do I need it?", hi: "टर्म इंश्योरेंस क्या है और क्या मुझे इसकी ज़रूरत है?", hinglish: "Term insurance kya hai aur kya mujhe iski zaroorat hai?" },
    a: { en: "Term insurance is the purest form of life insurance — you pay a small premium and your family gets a large sum assured if you die during the policy term. A ₹1 crore term plan costs just ₹500-800/month for a 25-year-old. It has no investment component, no maturity benefit — just pure protection. Every earning member of the family should have term insurance worth at least 10-15 times their annual income.", hi: "टर्म इंश्योरेंस जीवन बीमे का सबसे शुद्ध रूप है — आप थोड़ा प्रीमियम देते हैं और पॉलिसी अवधि में आपकी मृत्यु पर आपके परिवार को बड़ी राशि मिलती है। ₹1 करोड़ का टर्म प्लान महज़ ₹500-800/माह में मिलता है। इसमें कोई निवेश घटक नहीं — सिर्फ शुद्ध सुरक्षा। हर कमाने वाले सदस्य के पास वार्षिक आय का 10-15 गुना टर्म बीमा होना चाहिए।", hinglish: "Term insurance life insurance ka sabse pure form hai — aap chhota premium dete hain aur policy period mein aapki death pe aapke family ko badi amount milti hai. ₹1 crore term plan sirf ₹500-800/month mein milta hai. Ismein koi investment component nahi — sirf pure protection. Har earning member ke paas annual income ka 10-15 guna term insurance hona chahiye." },
  },
  {
    cat: 'life',
    q: { en: "How much term insurance coverage do I need?", hi: "मुझे कितने टर्म इंश्योरेंस कवरेज की ज़रूरत है?", hinglish: "Mujhe kitne term insurance coverage ki zaroorat hai?" },
    a: { en: "A common rule: 10-15 times your annual income. If you earn ₹10 lakh/year, get ₹1-1.5 crore cover. Also consider: (1) Outstanding loans (home loan, car loan). (2) Children's education expenses. (3) Monthly household expenses. (4) Inflation — ₹1 crore today will be worth less in 20 years. Choose a policy term that covers you until retirement or until your dependents become self-sufficient.", hi: "सामान्य नियम: आपकी वार्षिक आय का 10-15 गुना। यदि आप ₹10 लाख/वर्ष कमाते हैं, तो ₹1-1.5 करोड़ का कवर लें। विचार करें: (1) बकाया ऋण। (2) बच्चों की शिक्षा। (3) मासिक घरेलू खर्चे। (4) महंगाई। पॉलिसी अवधि सेवानिवृत्ति तक या जब तक आश्रित स्वयं-निर्भर न हों, चुनें।", hinglish: "Common rule: 10-15 times your annual income. Agar aap ₹10 lakh/year kamate hain, toh ₹1-1.5 crore cover lein. Consider karein: (1) Outstanding loans. (2) Bachhon ki education. (3) Monthly household expenses. (4) Inflation. Policy term retirement tak ya jab tak dependents self-sufficient na ho, choose karein." },
  },
  {
    cat: 'life',
    q: { en: "What is CSR (Claim Settlement Ratio) and why does it matter?", hi: "CSR (क्लेम निपटान अनुपात) क्या है और यह क्यों महत्वपूर्ण है?", hinglish: "CSR (Claim Settlement Ratio) kya hai aur yeh kyun important hai?" },
    a: { en: "CSR is the percentage of claims an insurer settles out of total claims received. Formula: (Claims Settled ÷ Total Claims) × 100. For life insurance, look for CSR above 95%. Higher CSR = more reliable insurer. IRDAI publishes this annually. However, CSR alone is not enough — also check claim amount settlement ratio and average settlement time.", hi: "CSR प्राप्त कुल क्लेम में से बीमाकर्ता द्वारा निपटाए गए क्लेम का प्रतिशत है। सूत्र: (निपटाए गए क्लेम ÷ कुल क्लेम) × 100। लाइफ इंश्योरेंस के लिए 95% से अधिक CSR वाला बीमाकर्ता चुनें। उच्च CSR = अधिक विश्वसनीय बीमाकर्ता।", hinglish: "CSR percentage of claims hai jo insurer settle karta hai total claims received mein se. Formula: (Claims Settled ÷ Total Claims) × 100. Life insurance ke liye 95% se zyada CSR wala insurer choose karein. Higher CSR = more reliable insurer." },
  },
  {
    cat: 'life',
    q: { en: "Should I buy riders with my term insurance?", hi: "क्या मुझे टर्म इंश्योरेंस के साथ राइडर खरीदने चाहिए?", hinglish: "Kya mujhe term insurance ke saath riders khareedne chahiye?" },
    a: { en: "Yes, select riders add great value at low cost: (1) Critical Illness Rider — ₹25L cover for just ₹1,500/year. (2) Accidental Death Benefit — extra payout on accidental death. (3) Waiver of Premium — future premiums waived if you get disabled. (4) Income Benefit — monthly income for family instead of lump sum. Riders cost ₹200-2,000/year extra — much cheaper than separate policies.", hi: "हाँ, चुनिंदा राइडर कम लागत पर बड़ा मूल्य जोड़ते हैं: (1) क्रिटिकल इलनेस राइडर — ₹25L कवर महज़ ₹1,500/वर्ष। (2) एक्सीडेंटल डेथ बेनिफिट। (3) वेवर ऑफ प्रीमियम। (4) इनकम बेनिफिट। राइडर ₹200-2,000/वर्ष अतिरिक्त में मिलते हैं।", hinglish: "Haan, select riders kam cost pe bada value add karte hain: (1) Critical Illness Rider — ₹25L cover sirf ₹1,500/year. (2) Accidental Death Benefit. (3) Waiver of Premium. (4) Income Benefit. Riders ₹200-2,000/year extra mein miltte hain." },
  },
  // ── Claims ──────────────────────────────────────────────────────────────
  {
    cat: 'claims',
    q: { en: "How long does an insurance company take to settle a claim?", hi: "बीमा कंपनी क्लेम सेटल करने में कितना समय लेती है?", hinglish: "Insurance company claim settle karne mein kitna time leti hai?" },
    a: { en: "IRDAI mandates: (1) Cashless pre-auth — 1 hour (emergency), 4 hours (planned). (2) Discharge approval — 3 hours. (3) Reimbursement claims — 30 days from all documents. (4) Motor accident claims — 30 days. (5) Theft claims — 60 days (after police untraced report). File a complaint with IRDAI if timelines are not met.", hi: "IRDAI अनिवार्य करता है: (1) कैशलेस प्री-ऑथ — 1 घंटा (आपातकाल), 4 घंटे (नियोजित)। (2) डिस्चार्ज अनुमोदन — 3 घंटे। (3) प्रतिपूर्ति क्लेम — सभी दस्तावेज़ों से 30 दिन। (4) मोटर दुर्घटना क्लेम — 30 दिन। (5) चोरी क्लेम — 60 दिन। यदि समयसीमा पूरी नहीं होती तो IRDAI में शिकायत करें।", hinglish: "IRDAI mandates: (1) Cashless pre-auth — 1 hour (emergency), 4 hours (planned). (2) Discharge approval — 3 hours. (3) Reimbursement claims — 30 days from all documents. (4) Motor accident claims — 30 days. (5) Theft claims — 60 days. Agar timelines meet nahi hoti toh IRDAI mein complaint karein." },
  },
  {
    cat: 'claims',
    q: { en: "What should I do if my insurance claim is rejected?", hi: "यदि मेरा बीमा क्लेम अस्वीकृत हो जाए तो क्या करूँ?", hinglish: "Agar mera insurance claim reject ho jaaye toh kya karoon?" },
    a: { en: "Don't panic. Follow this escalation path: (1) Get the rejection letter with reason. (2) Contact insurer's grievance cell within 30 days. (3) If unsatisfied, file complaint on IRDAI Bima Bharosa portal (bimabharosa.irda.gov.in) or call 155255. (4) Approach Insurance Ombudsman — free, for claims up to ₹50 lakh. (5) Consumer Court as last resort. You can also get free claim assistance from PaliwalSecure on WhatsApp.", hi: "घबराएँ नहीं। यह एस्कलेशन पाथ फ़ॉलो करें: (1) कारण के साथ अस्वीकृति पत्र लें। (2) 30 दिन के भीतर बीमाकर्ता की शिकायत सेल से संपर्क करें। (3) असंतुष्ट हों तो IRDAI बीमा भरोसा पोर्टल पर शिकायत करें। (4) बीमा लोकपाल से संपर्क करें — ₹50 लाख तक मुफ़्त। (5) उपभोक्ता न्यायालय। PaliwalSecure से WhatsApp पर मुफ़्त क्लेम सहायता भी लें।", hinglish: "Ghabraayein nahi. Yeh escalation path follow karein: (1) Reason ke saath rejection letter lein. (2) 30 din ke bheetar insurer ki grievance cell se contact karein. (3) Unsatisfied ho toh IRDAI Bima Bharosa portal pe complaint karein. (4) Insurance Ombudsman se contact karein — free, ₹50 lakh tak. (5) Consumer Court. PaliwalSecure se WhatsApp pe free claim assistance bhi le sakte hain." },
  },
  {
    cat: 'claims',
    q: { en: "What documents are needed to file a health insurance claim?", hi: "हेल्थ इंश्योरेंस क्लेम के लिए कौन-कौन से दस्तावेज़ चाहिए?", hinglish: "Health insurance claim ke liye kaun-kaun se documents chahiye?" },
    a: { en: "For cashless: Health card, valid ID, pre-auth form (filled by hospital). For reimbursement: Claim form, original hospital bills, discharge summary, doctor's prescription, diagnostic reports, pharmacy bills, FIR (if accident-related), and bank details for NEFT transfer. Always submit original documents and keep copies for your records.", hi: "कैशलेस के लिए: हेल्थ कार्ड, वैध ID, प्री-ऑथ फॉर्म। प्रतिपूर्ति के लिए: क्लेम फॉर्म, मूल अस्पताल बिल, डिस्चार्ज सारांश, डॉक्टर की प्रिस्क्रिप्शन, डायग्नोस्टिक रिपोर्ट, फार्मेसी बिल, FIR (यदि दुर्घटना से संबंधित), और NEFT हस्तांतरण के लिए बैंक विवरण।", hinglish: "Cashless ke liye: Health card, valid ID, pre-auth form. Reimbursement ke liye: Claim form, original hospital bills, discharge summary, doctor ki prescription, diagnostic reports, pharmacy bills, FIR (agar accident-related), aur NEFT ke liye bank details." },
  },
  {
    cat: 'claims',
    q: { en: "Is FIR mandatory for car insurance claims?", hi: "क्या कार बीमा क्लेम के लिए FIR ज़रूरी है?", hinglish: "Kya car insurance claim ke liye FIR zaroori hai?" },
    a: { en: "FIR is mandatory for theft claims and third-party injury/death claims. For own damage (when no third party is involved), FIR is usually not required but you must inform the insurer within 48 hours. Hit-and-run and third-party property damage require FIR. Always file FIR immediately for theft — delay can cause claim rejection.", hi: "चोरी क्लेम और थर्ड-पार्टी चोट/मृत्यु क्लेम के लिए FIR अनिवार्य है। ओन डैमेज (जब कोई थर्ड पार्टी शामिल नहीं) के लिए FIR आमतौर पर ज़रूरी नहीं लेकिन 48 घंटे के भीतर बीमाकर्ता को सूचित करें। हिट-एंड-रन के लिए FIR अनिवार्य है।", hinglish: "FIR mandatory hai theft claims aur third-party injury/death claims ke liye. Own damage (jab koi third party involved nahi) ke liye FIR usually zaroori nahi lekin 48 ghante ke bheetar insurer ko inform karein. Hit-and-run ke liye FIR mandatory hai." },
  },
  // ── General ─────────────────────────────────────────────────────────────
  {
    cat: 'general',
    q: { en: "What is the free-look period in insurance?", hi: "बीमे में फ्री-लुक पीरियड क्या है?", hinglish: "Insurance mein free-look period kya hai?" },
    a: { en: "A 15-30 day window after receiving your policy document during which you can return the policy and get a full refund (minus stamp duty and proportionate risk premium). This protects you from mis-selling. Available for all life and health insurance in India. Read your policy carefully during this period and cancel if terms are not as promised.", hi: "पॉलिसी दस्तावेज़ प्राप्त करने के बाद 15-30 दिन की अवधि जिसमें आप पॉलिसी वापस कर पूर्ण रिफंड पा सकते हैं (स्टैम्प ड्यूटी और आनुपातिक जोखिम प्रीमियम घटाकर)। यह आपको गलत बिक्री से बचाता है। भारत में सभी लाइफ और हेल्थ इंश्योरेंस के लिए उपलब्ध।", hinglish: "15-30 day window policy document receive karne ke baad jismein aap policy return kar full refund paa sakte hain (minus stamp duty aur proportionate risk premium). Yeh aapko mis-selling se bachata hai. India mein sabhi life aur health insurance ke liye available." },
  },
  {
    cat: 'general',
    q: { en: "What is the grace period in insurance?", hi: "बीमे में अनुग्रह अवधि क्या है?", hinglish: "Insurance mein grace period kya hai?" },
    a: { en: "Extra time (15-30 days) after premium due date during which you can pay without the policy lapsing. For yearly/half-yearly modes — 30 days. For monthly/quarterly — 15 days. Coverage continues during grace period. After grace period, policy lapses and no claims are payable. Always set reminders or auto-debit to avoid missing premiums.", hi: "प्रीमियम नियत तारीख़ के बाद अतिरिक्त समय (15-30 दिन) जिसमें आप बिना पॉलिसी लैप्स किए भुगतान कर सकते हैं। वार्षिक/अर्ध-वार्षिक — 30 दिन। मासिक/त्रैमासिक — 15 दिन। अनुग्रह अवधि में कवरेज जारी रहता है।", hinglish: "Extra time (15-30 days) premium due date ke baad jismein aap bina policy lapse kiye payment kar sakte hain. Yearly/half-yearly — 30 days. Monthly/quarterly — 15 days. Grace period mein coverage jaari rehta hai." },
  },
  {
    cat: 'general',
    q: { en: "How can I avoid mis-selling when buying insurance?", hi: "बीमा खरीदते समय मैं गलत बिक्री से कैसे बच सकता हूँ?", hinglish: "Insurance khareedte waqt main mis-selling se kaise bach sakta hoon?" },
    a: { en: "Red flags of mis-selling: (1) Agent promises guaranteed returns higher than bank FD. (2) Pressured to buy immediately. (3) Told to hide medical conditions. (4) Told insurance is an investment — it's protection first. (5) Not given time to read policy document. Always: Buy from IRDAI-registered advisors. Read policy wording yourself. Use the free-look period. Verify all details before signing. Get everything in writing.", hi: "गलत बिक्री के संकेत: (1) एजेंट बैंक FD से अधिक गारंटीड रिटर्न का वादा। (2) तुरंत खरीदने का दबाव। (3) चिकित्सा स्थिति छुपाने की सलाह। (4) बीमा को निवेश बताना। (5) पॉलिसी दस्तावेज़ पढ़ने का समय नहीं देना। हमेशा: IRDAI-पंजीकृत सलाहकार से खरीदें। पॉलिसी शब्दावली स्वयं पढ़ें। फ्री-लुक पीरियड का उपयोग करें।", hinglish: "Mis-selling ke signs: (1) Agent bank FD se zyada guaranteed returns ka wada. (2) Turant khareedne ka pressure. (3) Medical condition chhupane ki salah. (4) Insurance ko investment batana. (5) Policy document padhne ka time nahi dena. Hamesha: IRDAI-registered advisor se khareedein. Policy wording khud padhein. Free-look period use karein." },
  },
  {
    cat: 'general',
    q: { en: "Can I buy insurance online or should I use an agent?", hi: "क्या मैं ऑनलाइन बीमा खरीद सकता हूँ या एजेंट का उपयोग करूँ?", hinglish: "Kya main online insurance khareed sakta hoon ya agent use karoon?" },
    a: { en: "Both options work: Online is cheaper (5-15% lower premium), convenient, and transparent. Agent provides personalized guidance, claim assistance, and helps with paperwork. Best approach: Use an IRDAI-certified advisor like PaliwalSecure for recommendations and comparison, then buy online or through them. You get both — expert advice AND competitive pricing. Claims assistance is crucial — that's where advisors add the most value.", hi: "दोनों विकल्प काम करते हैं: ऑनलाइन सस्ता (5-15% कम प्रीमियम), सुविधाजनक। एजेंट व्यक्तिगत मार्गदर्शन, क्लेम सहायता प्रदान करता है। सबसे अच्छा तरीका: PaliwalSecure जैसे IRDAI-प्रमाणित सलाहकार से सिफारिश और तुलना करें। क्लेम सहायता सबसे महत्वपूर्ण है।", hinglish: "Dono options kaam karte hain: Online sasta (5-15% kam premium), convenient. Agent personalized guidance, claim assistance deta hai. Best approach: PaliwalSecure jaise IRDAI-certified advisor se recommendations aur comparison lein. Claim assistance sabse important hai." },
  },
  {
    cat: 'general',
    q: { en: "What is the difference between Sum Insured and Sum Assured?", hi: "बीमित राशि और बीमा राशि में क्या अंतर है?", hinglish: "Sum Insured aur Sum Assured mein kya farq hai?" },
    a: { en: "Sum Insured is used in general insurance (health, car, home) — it's the maximum payout for claims in a policy year. It resets each year on renewal. Sum Assured is used in life insurance — it's the fixed amount paid on death/maturity. Example: ₹10 lakh health insurance = ₹10L max claim per year. ₹1 crore term plan = ₹1 crore paid on death.", hi: "बीमित राशि सामान्य बीमे (हेल्थ, कार, होम) में उपयोग होती है — यह पॉलिसी वर्ष में अधिकतम भुगतान है। यह नवीनीकरण पर रीसेट होती है। बीमा राशि लाइफ इंश्योरेंस में उपयोग होती है — यह मृत्यु/परिपक्वता पर दी जाने वाली निश्चित राशि है।", hinglish: "Sum Insured general insurance (health, car, home) mein use hoti hai — yeh policy year mein maximum payout hai. Yeh renewal pe reset hoti hai. Sum Assured life insurance mein use hoti hai — yeh death/maturity pe di jaane wali fixed amount hai." },
  },
  {
    cat: 'general',
    q: { en: "Is it better to buy insurance when I'm young?", hi: "क्या जवानी में बीमा खरीदना बेहतर है?", hinglish: "Kya jawani mein insurance khareedna behtar hai?" },
    a: { en: "Absolutely! Buying insurance young gives you: (1) Lower premiums — a 25-year-old pays 50-70% less than a 45-year-old for the same cover. (2) Easy approval — no medical tests usually needed below 35. (3) Longer coverage period. (4) Waiting periods get over early. (5) Better health = more plan options. Don't wait for illness or age — premiums only increase and options decrease.", hi: "बिलकुल! जवानी में बीमा खरीदने से: (1) कम प्रीमियम — 25 वर्ष का व्यक्ति 45 वर्ष की तुलना में 50-70% कम भुगतान करता है। (2) आसान अनुमोदन। (3) लंबी कवरेज अवधि। (4) प्रतीक्षा अवधि जल्दी पूरी। (5) बेहतर स्वास्थ्य = अधिक प्लान विकल्प। बीमारी या उम्र का इंतज़ार न करें।", hinglish: "Bilkul! Jawani mein insurance khareedne se: (1) Lower premiums — 25 saal ka aadmi 45 saal ke mukable mein 50-70% kam pay karta hai. (2) Easy approval. (3) Longer coverage period. (4) Waiting periods jaldi poori. (5) Better health = zyada plan options. Bimari ya umr ka intezaar na karein." },
  },
];

// ── FAQ JSON-LD (English for SEO) ──────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q.en,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a.en,
    },
  })),
};

// ── Client Component ────────────────────────────────────────────────────────
export default function ClientContent() {
  const { language } = useLanguage();
  const [activeCat, setActiveCat] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = ['all', 'health', 'car', 'life', 'claims', 'general'] as const;
  const filteredFaqs = activeCat === 'all' ? faqs : faqs.filter(f => f.cat === activeCat);

  return (
    <div>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            {pt(pageText.hero.title1, language)} <span className="gradient-text">{pt(pageText.hero.titleHighlight, language)}</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            {pt(pageText.hero.desc, language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/919257877312?text=Hi%20Paliwal%20Secure%2C%20I%20have%20an%20insurance%20question" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue"><span>{pt(pageText.hero.ctaWhatsApp, language)}</span></ShinyButton>
            </a>
            <Link href="/#insuregpt">
              <ShinyButton variant="secondary"><span>{pt(pageText.hero.ctaChat, language)}</span></ShinyButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Category Tabs */}
      <section className="py-6 md:py-8 sticky top-0 z-30 bg-background/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCat(cat); setOpenFaq(null); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCat === cat
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {pt(pageText.categories[cat as keyof typeof pageText.categories], language)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <div
              key={`${faq.cat}-${idx}`}
              className="glass-card rounded-xl p-5 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="font-semibold text-base text-foreground leading-snug">
                    {pt(faq.q, language)}
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openFaq === idx && (
                <div className="mt-3 ml-11 text-sm text-muted-foreground leading-relaxed">
                  {pt(faq.a, language)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {pt(pageText.cta.heading, language)} <span className="gradient-text">{pt(pageText.cta.headingHighlight, language)}</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {pt(pageText.cta.desc, language)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://wa.me/919257877312?text=Hi%2C%20I%20have%20an%20insurance%20question" target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="blue"><span>{pt(pageText.cta.ctaWhatsApp, language)}</span></ShinyButton>
              </a>
              <Link href="/#insuregpt">
                <ShinyButton variant="secondary"><span>{pt(pageText.cta.ctaInsureGPT, language)}</span></ShinyButton>
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
            <Link href="/insurance-glossary" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <span className="text-2xl">📖</span>
              <h3 className="font-semibold mt-3 group-hover:text-primary transition">{pt(pageText.related.glossaryTitle, language)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pt(pageText.related.glossaryDesc, language)}</p>
            </Link>
            <Link href="/claim-guide" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <span className="text-2xl">📋</span>
              <h3 className="font-semibold mt-3 group-hover:text-primary transition">{pt(pageText.related.claimTitle, language)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pt(pageText.related.claimDesc, language)}</p>
            </Link>
            <Link href="/policyholder-rights" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <span className="text-2xl">⚖️</span>
              <h3 className="font-semibold mt-3 group-hover:text-primary transition">{pt(pageText.related.rightsTitle, language)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pt(pageText.related.rightsDesc, language)}</p>
            </Link>
            <Link href="/health-insurance" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <span className="text-2xl">🏥</span>
              <h3 className="font-semibold mt-3 group-hover:text-primary transition">{pt(pageText.related.healthTitle, language)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pt(pageText.related.healthDesc, language)}</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
