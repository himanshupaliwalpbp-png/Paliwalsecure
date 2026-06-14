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
    badge: { en: "AI-Powered Insurance Advisor", hi: "AI-संचालित बीमा सलाहकार", hinglish: "AI-Powered Insurance Advisor" },
    title1: { en: "Car Insurance Renewal &", hi: "कार बीमा नवीनीकरण और", hinglish: "Car Insurance Renewal &" },
    title2: { en: "Comparison", hi: "तुलना", hinglish: "Comparison" },
    titleSuffix: { en: "— Save with NCB", hi: "— NCB के साथ बचत करें", hinglish: "— NCB ke saath Bachat karein" },
    desc: {
      en: "Compare car insurance plans from India's top insurers. Understand IDV, NCB, zero depreciation, and TP vs Comprehensive. Save up to 50% on your renewal with AI-powered recommendations from PaliwalSecure.in.",
      hi: "भारत के शीर्ष बीमाकर्ताओं से कार बीमा योजनाओं की तुलना करें। IDV, NCB, ज़ीरो डेप्रिसिएशन, और TP बनाम कॉम्प्रिहेंसिव समझें। PaliwalSecure.in की AI-संचालित सिफारिशों से अपने नवीनीकरण पर 50% तक की बचत करें।",
      hinglish: "India ke top insurers se car insurance plans compare karein. IDV, NCB, zero depreciation, aur TP vs Comprehensive samjhiye. Apne renewal pe 50% tak bachat karein PaliwalSecure.in ke AI-powered recommendations se."
    },
    ctaCompare: { en: "Compare & Save Now", hi: "तुलना करें और अभी बचत करें", hinglish: "Compare & Save Now" },
    ctaWhatsApp: { en: "💬 Chat on WhatsApp", hi: "💬 WhatsApp पर चैट करें", hinglish: "💬 WhatsApp pe Chat Karein" },
    stat1Val: { en: "50%", hi: "50%", hinglish: "50%" },
    stat1Label: { en: "Max NCB Discount", hi: "अधिकतम NCB छूट", hinglish: "Max NCB Discount" },
    stat2Val: { en: "10+", hi: "10+", hinglish: "10+" },
    stat2Label: { en: "Insurers Compared", hi: "बीमाकर्ताओं की तुलना", hinglish: "Insurers Compared" },
    stat3Val: { en: "5 min", hi: "5 मिनट", hinglish: "5 min" },
    stat3Label: { en: "Renewal Time", hi: "नवीनीकरण समय", hinglish: "Renewal Time" },
    stat4Val: { en: "6,000+", hi: "6,000+", hinglish: "6,000+" },
    stat4Label: { en: "Network Garages", hi: "नेटवर्क गैराज", hinglish: "Network Garages" },
    trustBadge1: { en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" },
    trustBadge2: { en: "51+ Insurers", hi: "51+ बीमाकर्ता", hinglish: "51+ Insurers" },
    trustBadge3: { en: "Instant Policy", hi: "तत्काल पॉलिसी", hinglish: "Instant Policy" },
    trustBadge4: { en: "Claim Support", hi: "क्लेम सहायता", hinglish: "Claim Support" },
  },
  whatIs: {
    heading: { en: "What is", hi: "कार बीमा", hinglish: "Car Insurance" },
    headingHighlight: { en: "Car Insurance", hi: "क्या है?", hinglish: "Kya Hai?" },
    desc: {
      en: "Car insurance is a contract between you and an insurance company that protects you financially against loss or damage to your vehicle. In India, at least Third-Party (TP) car insurance is mandatory under the Motor Vehicles Act, 1988. Driving without valid insurance can result in fines of ₹2,000 for the first offence and ₹4,000 for repeat offences, along with possible imprisonment.",
      hi: "कार बीमा आप और बीमा कंपनी के बीच एक अनुबंध है जो आपके वाहन की हानि या क्षति से वित्तीय रूप से सुरक्षित करता है। भारत में, मोटर वाहन अधिनियम, 1988 के तहत कम से कम थर्ड-पार्टी (TP) कार बीमा अनिवार्य है। बिना वैध बीमा के गाड़ी चलाने पर पहली बार ₹2,000 और दोहराने पर ₹4,000 का जुर्माना हो सकता है, साथ ही कैद भी हो सकती है।",
      hinglish: "Car insurance aap aur insurance company ke beech ek contract hai jo aapke vehicle ke loss ya damage se financially protect karta hai. India mein, Motor Vehicles Act 1988 ke tahat kam se kam Third-Party (TP) car insurance mandatory hai. Bina valid insurance ke gaadi chalane pe first offence pe ₹2,000 aur repeat pe ₹4,000 fine ho sakta hai, saath hi jail bhi ho sakti hai."
    },
    tpTitle: { en: "Third-Party (TP) Insurance", hi: "थर्ड-पार्टी (TP) बीमा", hinglish: "Third-Party (TP) Insurance" },
    tp1: { en: "Mandatory by law — you must have this to drive legally in India", hi: "कानून द्वारा अनिवार्य — भारत में कानूनी रूप से गाड़ी चलाने के लिए यह ज़रूरी है", hinglish: "Law ke hisaab se mandatory — India mein legally gaadi chalane ke liye yeh zaroori hai" },
    tp2: { en: "Covers damage to third-party vehicle, property, or person", hi: "थर्ड-पार्टी वाहन, संपत्ति या व्यक्ति को हुई क्षति कवर करता है", hinglish: "Third-party vehicle, property ya person ko hui damage cover karta hai" },
    tp3: { en: "Does NOT cover damage to your own car", hi: "आपकी अपनी कार की क्षति कवर नहीं करता", hinglish: "Aapki apni car ki damage cover nahi karta" },
    tp4: { en: "TP rates fixed by IRDAI — same across all insurers", hi: "IRDAI द्वारा TP दरें तय — सभी बीमाकर्ताओं के लिए समान", hinglish: "TP rates IRDAI fix karta hai — sab insurers ke liye same" },
    tp5: { en: "Includes personal accident cover of up to ₹15 lakh", hi: "₹15 लाख तक का व्यक्तिगत दुर्घटना कवर शामिल", hinglish: "₹15 lakh tak ka personal accident cover included" },
    tpNote: { en: "IRDAI TP rates (2024-25): Cars below 1000cc — ₹2,094; 1000-1500cc — ₹3,416; Above 1500cc — ₹7,897 per year.", hi: "IRDAI TP दरें (2024-25): 1000cc से कम कारें — ₹2,094; 1000-1500cc — ₹3,416; 1500cc से अधिक — ₹7,897 प्रति वर्ष।", hinglish: "IRDAI TP rates (2024-25): 1000cc se kam cars — ₹2,094; 1000-1500cc — ₹3,416; 1500cc se zyada — ₹7,897 per year." },
    compTitle: { en: "Comprehensive Insurance", hi: "कॉम्प्रिहेंसिव बीमा", hinglish: "Comprehensive Insurance" },
    comp1: { en: "Covers third-party liability AND own damage (OD)", hi: "थर्ड-पार्टी देयता और ओन डैमेज (OD) दोनों कवर करता है", hinglish: "Third-party liability aur own damage (OD) dono cover karta hai" },
    comp2: { en: "Protects against accidents, theft, fire, vandalism, natural calamities", hi: "दुर्घटना, चोरी, आग, बर्बरता, प्राकृतिक आपदाओं से सुरक्षा", hinglish: "Accidents, theft, fire, vandalism, natural calamities se protection" },
    comp3: { en: "Add-on covers available (zero dep, RSA, engine protect, etc.)", hi: "ऐड-ऑन कवर उपलब्ध (ज़ीरो डेप, RSA, इंजन प्रोटेक्ट, आदि)", hinglish: "Add-on covers available (zero dep, RSA, engine protect, etc.)" },
    comp4: { en: "OD premium varies by car model, age, and location", hi: "कार मॉडल, आयु और स्थान के अनुसार OD प्रीमियम भिन्न होता है", hinglish: "OD premium car model, age aur location ke hisaab se different hota hai" },
    comp5: { en: "NCB discount applies on the OD portion of the premium", hi: "प्रीमियम के OD भाग पर NCB छूट लागू होती है", hinglish: "Premium ke OD portion pe NCB discount apply hota hai" },
    compNote: { en: "Comprehensive = Third-Party + Own Damage. You can add zero dep, engine protect, and 10+ other add-ons for complete protection.", hi: "कॉम्प्रिहेंसिव = थर्ड-पार्टी + ओन डैमेज। आप पूर्ण सुरक्षा के लिए ज़ीरो डेप, इंजन प्रोटेक्ट और 10+ अन्य ऐड-ऑन जोड़ सकते हैं।", hinglish: "Comprehensive = Third-Party + Own Damage. Aap complete protection ke liye zero dep, engine protect aur 10+ aur add-ons add kar sakte hain." },
  },
  idv: {
    heading: { en: "What is", hi: "क्या है", hinglish: "Kya Hai" },
    headingHighlight: { en: "IDV", hi: "IDV", hinglish: "IDV" },
    headingSuffix: { en: "(Insured Declared Value)?", hi: "(बीमित घोषित मूल्य)?", hinglish: "(Insured Declared Value)?" },
    desc: {
      en: "IDV is the maximum amount your insurer will pay if your car is stolen or declared a total loss (beyond repair). Think of it as the \"sum insured\" for your vehicle. It is calculated based on the manufacturer's ex-showroom price minus depreciation for the vehicle's age. IDV directly affects your premium — a higher IDV means a slightly higher premium, but you receive a better payout in case of a total loss or theft claim.",
      hi: "IDV वह अधिकतम राशि है जो आपका बीमाकर्ता तब देगा जब आपकी कार चोरी हो जाए या पूर्ण हानि (मरम्मत से परे) घोषित हो। इसे अपने वाहन के लिए \"बीमित राशि\" समझें। यह निर्माता के एक्स-शोरूम मूल्य में से वाहन की आयु के अनुसार ह्रास घटाकर गणना किया जाता है। IDV सीधे आपके प्रीमियम को प्रभावित करता है — अधिक IDV का मतलब थोड़ा अधिक प्रीमियम, लेकिन पूर्ण हानि या चोरी क्लेम में बेहतर भुगतान।",
      hinglish: "IDV woh maximum amount hai jo aapka insurer tab dega jab aapki car chori ho jaye ya total loss declare ho. Isse apne vehicle ke liye \"sum insured\" samjhiye. Yeh manufacturer ke ex-showroom price mein se vehicle ki age ke hisaab se depreciation ghata kar calculate hota hai. IDV directly aapke premium ko affect karta hai — zyada IDV ka matlab thoda zyada premium, lekin total loss ya theft claim mein better payout."
    },
    tableTitle: { en: "IDV Depreciation Schedule", hi: "IDV ह्रास अनुसूची", hinglish: "IDV Depreciation Schedule" },
    thAge: { en: "Vehicle Age", hi: "वाहन आयु", hinglish: "Vehicle Age" },
    thDep: { en: "Depreciation %", hi: "ह्रास %", hinglish: "Depreciation %" },
    thIdv: { en: "IDV (% of Ex-Showroom)", hi: "IDV (एक्स-शोरूम का %)", hinglish: "IDV (% of Ex-Showroom)" },
    note5yr: { en: "Beyond 5 years, IDV is determined by mutual agreement between you and the insurer based on the vehicle's condition and market value.", hi: "5 वर्ष से अधिक में, IDV वाहन की स्थिति और बाज़ार मूल्य के आधार पर आप और बीमाकर्ता के बीच पारस्परिक समझौते से तय होता है।", hinglish: "5 saal se zyada mein, IDV vehicle ki condition aur market value ke basis pe aap aur insurer ke beech mutual agreement se tay hota hai." },
    tipTitle: { en: "💡 Expert Tip: Don't understate your IDV to save premium!", hi: "💡 विशेषज्ञ सुझाव: प्रीमियम बचाने के लिए IDV कम मत बताएँ!", hinglish: "💡 Expert Tip: Premium bachane ke liye IDV kam mat batayein!" },
    tipDesc: { en: "A lower IDV means a smaller payout if your car is stolen or totalled. Always set IDV close to the actual market value. Our AI advisor helps you find the right balance between premium and coverage.", hi: "कम IDV का मतलब है कि यदि आपकी कार चोरी हो जाए या पूरी तरह नष्ट हो जाए तो कम भुगतान। हमेशा IDV वास्तविक बाज़ार मूल्य के करीब रखें। हमारा AI सलाहकार प्रीमियम और कवरेज के बीच सही संतुलन खोजने में मदद करता है।", hinglish: "Kam IDV ka matlab hai ki agar aapki car chori ho jaye ya totalled ho jaye toh chhota payout. Hamesha IDV actual market value ke kareeb rakhein. Hamaara AI advisor premium aur coverage ke beech sahi balance dhoondhne mein madad karta hai." },
  },
  ncb: {
    headingHighlight: { en: "NCB", hi: "NCB", hinglish: "NCB" },
    headingSuffix: { en: "(No Claim Bonus) — How It Works", hi: "(नो क्लेम बोनस) — यह कैसे काम करता है", hinglish: "(No Claim Bonus) — Kaise Kaam Karta Hai" },
    desc: {
      en: "No Claim Bonus (NCB) is the single biggest discount available on your car insurance own damage premium. It rewards you for safe driving and claim-free years. The discount increases progressively with each consecutive claim-free year — starting at 20% and going up to a maximum of 50%. NCB belongs to the policyholder, not the car — so you can transfer it when switching insurers or even when buying a new vehicle.",
      hi: "नो क्लेम बोनस (NCB) आपके कार बीमा ओन डैमेज प्रीमियम पर उपलब्ध सबसे बड़ी छूट है। यह सुरक्षित ड्राइविंग और क्लेम-मुक्त वर्षों के लिए आपको पुरस्कृत करता है। छूट लगातार प्रत्येक क्लेम-मुक्त वर्ष के साथ बढ़ती है — 20% से शुरू होकर अधिकतम 50% तक। NCB पॉलिसीधारक का है, कार का नहीं — इसलिए आप बीमाकर्ता बदलते समय या नया वाहन खरीदते समय इसे स्थानांतरित कर सकते हैं।",
      hinglish: "No Claim Bonus (NCB) aapke car insurance own damage premium pe available sabse badi discount hai. Yeh safe driving aur claim-free years ke liye aapko reward karta hai. Discount har consecutive claim-free year ke saath badhti hai — 20% se shuru hokar maximum 50% tak. NCB policyholder ka hai, car ka nahi — isliye aap insurer switch karte waqt ya naya vehicle khareedte waqt ise transfer kar sakte hain."
    },
    slabsTitle: { en: "NCB Discount Slabs", hi: "NCB छूट स्लैब", hinglish: "NCB Discount Slabs" },
    slab1: { en: "1st claim-free year", hi: "पहला क्लेम-मुक्त वर्ष", hinglish: "1st claim-free year" },
    slab2: { en: "2nd consecutive claim-free year", hi: "दूसरा लगातार क्लेम-मुक्त वर्ष", hinglish: "2nd consecutive claim-free year" },
    slab3: { en: "3rd consecutive claim-free year", hi: "तीसरा लगातार क्लेम-मुक्त वर्ष", hinglish: "3rd consecutive claim-free year" },
    slab4: { en: "4th consecutive claim-free year", hi: "चौथा लगातार क्लेम-मुक्त वर्ष", hinglish: "4th consecutive claim-free year" },
    slab5: { en: "5th consecutive claim-free year & beyond", hi: "5वाँ लगातार क्लेम-मुक्त वर्ष और उसके बाद", hinglish: "5th consecutive claim-free year & beyond" },
    retainedTitle: { en: "✅ NCB is Retained When", hi: "✅ NCB बना रहता है जब", hinglish: "✅ NCB Bacha Rehta Hai Jab" },
    retained1: { en: "You switch insurers at renewal time", hi: "आप नवीनीकरण के समय बीमाकर्ता बदलें", hinglish: "Aap renewal ke time insurer switch karein" },
    retained2: { en: "You buy a new car and transfer the NCB", hi: "आप नई कार खरीदें और NCB स्थानांतरित करें", hinglish: "Aap nayi car khareedein aur NCB transfer karein" },
    retained3: { en: "You renew your policy before the expiry date", hi: "आप समाप्ति तिथि से पहले अपनी पॉलिसी नवीनीकरण करें", hinglish: "Aap expiry date se pehle apni policy renew karein" },
    retained4: { en: "You have an NCB Protector add-on and make 1 claim", hi: "आपके पास NCB प्रोटेक्टर ऐड-ऑन है और आप 1 क्लेम करें", hinglish: "Aapke paas NCB Protector add-on hai aur aap 1 claim karein" },
    lostTitle: { en: "❌ NCB is Lost When", hi: "❌ NCB खो जाता है जब", hinglish: "❌ NCB Kho Jata Hai Jab" },
    lost1: { en: "You make any claim during the policy year", hi: "आप पॉलिसी वर्ष में कोई भी क्लेम करें", hinglish: "Aap policy year mein koi bhi claim karein" },
    lost2: { en: "Your policy lapses (not renewed within 90 days)", hi: "आपकी पॉलिसी समाप्त हो जाए (90 दिनों में नवीनीकरण न हो)", hinglish: "Aapki policy lapse ho jaye (90 dinon mein renew na ho)" },
    lost3: { en: "You don't have NCB Protector and file a claim", hi: "आपके पास NCB प्रोटेक्टर न हो और आप क्लेम दाखिल करें", hinglish: "Aapke paas NCB Protector na ho aur aap claim file karein" },
  },
  zeroDep: {
    heading: { en: "Zero Depreciation vs", hi: "ज़ीरो डेप्रिसिएशन बनाम", hinglish: "Zero Depreciation vs" },
    headingHighlight: { en: "Standard Comprehensive", hi: "स्टैंडर्ड कॉम्प्रिहेंसिव", hinglish: "Standard Comprehensive" },
    desc: {
      en: "A standard comprehensive policy deducts depreciation on replaced parts during claims. Zero Depreciation (zero dep) add-on eliminates this deduction — the insurer pays the full repair cost. For a detailed comparison of depreciation rates, claim savings, and top insurers, visit our Zero Dep Car Insurance Guide.",
      hi: "स्टैंडर्ड कॉम्प्रिहेंसिव पॉलिसी क्लेम के दौरान बदले गए पुर्जों पर ह्रास काटती है। ज़ीरो डेप्रिसिएशन (ज़ीरो डेप) ऐड-ऑन यह कटौती हटा देता है — बीमाकर्ता पूरी मरम्मत लागत चुकाता है। ह्रास दरों, क्लेम बचत और शीर्ष बीमाकर्ताओं की विस्तृत तुलना के लिए हमारी ज़ीरो डेप कार बीमा गाइड देखें।",
      hinglish: "Standard comprehensive policy claim ke dauraan replaced parts pe depreciation kaatti hai. Zero Depreciation (zero dep) add-on yeh deduction hata deta hai — insurer full repair cost pay karta hai. Depreciation rates, claim savings aur top insurers ki detailed comparison ke liye hamari Zero Dep Car Insurance Guide dekhein."
    },
    guideLink: { en: "Zero Dep Car Insurance Guide", hi: "ज़ीरो डेप कार बीमा गाइड", hinglish: "Zero Dep Car Insurance Guide" },
    standardTitle: { en: "Standard Comprehensive", hi: "स्टैंडर्ड कॉम्प्रिहेंसिव", hinglish: "Standard Comprehensive" },
    zeroDepTitle: { en: "With Zero Dep Add-on", hi: "ज़ीरो डेप ऐड-ऑन के साथ", hinglish: "Zero Dep Add-on ke Saath" },
    repairBill: { en: "Repair bill (₹1L claim)", hi: "मरम्मत बिल (₹1L क्लेम)", hinglish: "Repair bill (₹1L claim)" },
    depParts: { en: "Depreciation on parts", hi: "पुर्जों पर ह्रास", hinglish: "Depreciation on parts" },
    compDeductible: { en: "Compulsory deductible", hi: "अनिवार्य डिडक्टिबल", hinglish: "Compulsory deductible" },
    youPay: { en: "You pay from pocket", hi: "आप अपनी जेब से चुकाते हैं", hinglish: "Aap apni jeb se pay karte hain" },
    waived: { en: "₹0 (Waived)", hi: "₹0 (छूट)", hinglish: "₹0 (Waived)" },
    footnote: { en: "*Illustrative example for a 3-year-old car. Actual savings vary by vehicle age and damage type.", hi: "*3 वर्ष पुरानी कार का उदाहरण। वास्तविक बचत वाहन आयु और क्षति प्रकार के अनुसार भिन्न होती है।", hinglish: "*3 saal purani car ka example. Actual savings vehicle age aur damage type ke hisaab se different hoti hai." },
  },
  comparison: {
    heading: { en: "Compare", hi: "तुलना करें", hinglish: "Compare" },
    headingHighlight: { en: "Top Car Insurers", hi: "शीर्ष कार बीमाकर्ता", hinglish: "Top Car Insurers" },
    headingSuffix: { en: "in India", hi: "भारत में", hinglish: "in India" },
    desc: {
      en: "Not all car insurance policies are created equal. Premiums, claim settlement ratios, network garages, and add-on availability vary significantly across insurers. Our AI-powered comparison engine helps you find the best plan based on your car model, city, and coverage needs. Here's a snapshot of leading insurers and their OD rates.",
      hi: "सभी कार बीमा पॉलिसियाँ समान नहीं होतीं। प्रीमियम, क्लेम निपटान अनुपात, नेटवर्क गैराज और ऐड-ऑन उपलब्धता बीमाकर्ताओं में काफी भिन्न होती है। हमारा AI-संचालित तुलना इंजन आपके कार मॉडल, शहर और कवरेज आवश्यकताओं के आधार पर सर्वोत्तम योजना खोजने में मदद करता है। यहाँ प्रमुख बीमाकर्ताओं और उनकी OD दरों का स्नैपशॉट है।",
      hinglish: "Saari car insurance policies same nahi hoti. Premium, claim settlement ratio, network garages, aur add-on availability insurers mein kaafi different hoti hai. Hamaara AI-powered comparison engine aapke car model, city aur coverage needs ke basis pe best plan dhoondhne mein madad karta hai. Yahan leading insurers aur unki OD rates ka snapshot hai."
    },
    thInsurer: { en: "Insurer", hi: "बीमाकर्ता", hinglish: "Insurer" },
    thOdRate: { en: "OD Rate Range", hi: "OD दर सीमा", hinglish: "OD Rate Range" },
    thCsr: { en: "Claim Settlement Ratio", hi: "क्लेम निपटान अनुपात", hinglish: "Claim Settlement Ratio" },
    thGarages: { en: "Network Garages", hi: "नेटवर्क गैराज", hinglish: "Network Garages" },
    thHighlight: { en: "Key Highlight", hi: "मुख्य विशेषता", hinglish: "Key Highlight" },
    aiPick: { en: "🤖 AI Pick", hi: "🤖 AI चयन", hinglish: "🤖 AI Pick" },
    footnote: { en: "OD rates are indicative and vary based on car make, model, age, RTO location, and NCB. Get personalized quotes using our comparison tool.", hi: "OD दरें सांकेतिक हैं और कार बनावट, मॉडल, आयु, RTO स्थान और NCB के आधार पर भिन्न होती हैं। हमारे तुलना टूल से व्यक्तिगत कोटेशन प्राप्त करें।", hinglish: "OD rates indicative hain aur car make, model, age, RTO location aur NCB ke basis pe different hoti hain. Hamaare comparison tool se personalized quotes paayein." },
  },
  renewal: {
    heading: { en: "Car Insurance", hi: "कार बीमा", hinglish: "Car Insurance" },
    headingHighlight: { en: "Renewal", hi: "नवीनीकरण", hinglish: "Renewal" },
    headingSuffix: { en: "Process — Step by Step", hi: "प्रक्रिया — चरण दर चरण", hinglish: "Process — Step by Step" },
    desc: {
      en: "Renewing your car insurance has never been easier. With PaliwalSecure.in's AI-powered platform, you can compare, customize, and renew your policy in under 5 minutes — all from your phone. Don't let your policy lapse; you'll lose your valuable NCB and risk driving uninsured. Also check our Car Insurance Renewal Guide for detailed information.",
      hi: "कार बीमा नवीनीकरण इतना आसान कभी नहीं था। PaliwalSecure.in के AI-संचालित प्लेटफ़ॉर्म से, आप 5 मिनट से कम समय में तुलना, अनुकूलन और नवीनीकरण कर सकते हैं — सब अपने फ़ोन से। अपनी पॉलिसी समाप्त मत होने दें; आप अपना मूल्यवान NCB खो देंगे और बिना बीमे गाड़ी चलाने का जोखिम उठाएंगे। विस्तृत जानकारी के लिए हमारी कार बीमा नवीनीकरण गाइड भी देखें।",
      hinglish: "Car insurance renewal itna aasan kabhi nahi tha. PaliwalSecure.in ke AI-powered platform se, aap 5 minute se kam time mein compare, customize aur renew kar sakte hain — sab apne phone se. Apni policy lapse mat hone dein; aap apna valuable NCB khoyenge aur bina insurance ke gaadi chalane ka risk uthayenge. Detailed info ke liye hamari Car Insurance Renewal Guide bhi dekhein."
    },
    renewalLink: { en: "Car Insurance Renewal Guide", hi: "कार बीमा नवीनीकरण गाइड", hinglish: "Car Insurance Renewal Guide" },
    step1Title: { en: "Enter Your Car Details", hi: "अपनी कार का विवरण दर्ज करें", hinglish: "Apni Car ka Detail Enter Karein" },
    step1Desc: { en: "Visit PaliwalSecure.in and enter your car registration number or previous policy number. Our AI instantly fetches your vehicle and policy details.", hi: "PaliwalSecure.in पर जाएँ और अपनी कार पंजीकरण संख्या या पिछली पॉलिसी संख्या दर्ज करें। हमारा AI तुरंत आपका वाहन और पॉलिसी विवरण प्राप्त करता है।", hinglish: "PaliwalSecure.in pe jayein aur apni car registration number ya previous policy number enter karein. Hamaara AI instantly aapka vehicle aur policy details fetch karta hai." },
    step2Title: { en: "Compare Quotes from 10+ Insurers", hi: "10+ बीमाकर्ताओं से कोटेशन की तुलना करें", hinglish: "10+ Insurers se Quotes Compare Karein" },
    step2Desc: { en: "View side-by-side comparisons of premiums, IDV, claim settlement ratios, add-on options, and network garages. Our AI highlights the best-value plan for your needs.", hi: "प्रीमियम, IDV, क्लेम निपटान अनुपात, ऐड-ऑन विकल्प और नेटवर्क गैराज की समानांतर तुलना देखें। हमारा AI आपकी आवश्यकताओं के लिए सर्वोत्तम मूल्य योजना दिखाता है।", hinglish: "Premium, IDV, claim settlement ratio, add-on options aur network garages ki side-by-side comparison dekhein. Hamaara AI aapki needs ke liye best-value plan highlight karta hai." },
    step3Title: { en: "Select Add-ons & Customize", hi: "ऐड-ऑन चुनें और अनुकूलित करें", hinglish: "Add-ons Select Karein & Customize Karein" },
    step3Desc: { en: "Choose from zero dep, RSA, engine protect, RTI, consumables, and NCB protector. Each add-on is explained clearly so you make an informed decision.", hi: "ज़ीरो डेप, RSA, इंजन प्रोटेक्ट, RTI, कंस्यूमेबल्स और NCB प्रोटेक्टर में से चुनें। प्रत्येक ऐड-ऑन स्पष्ट रूप से समझाया गया है ताकि आप सूचित निर्णय लें।", hinglish: "Zero dep, RSA, engine protect, RTI, consumables aur NCB protector mein se choose karein. Each add-on clearly explain kiya gaya hai taaki aap informed decision lein." },
    step4Title: { en: "Make Payment & Get Instant Policy", hi: "भुगतान करें और तत्काल पॉलिसी प्राप्त करें", hinglish: "Payment Karein & Instant Policy Paayein" },
    step4Desc: { en: "Pay securely via UPI, credit/debit card, or net banking. Your renewed policy is issued instantly and sent to your email. No paperwork, no waiting.", hi: "UPI, क्रेडिट/डेबिट कार्ड या नेट बैंकिंग से सुरक्षित भुगतान करें। आपकी नवीनीकृत पॉलिसी तुरंत जारी होती है और ईमेल पर भेजी जाती है। कोई कागज़ी काम नहीं, कोई प्रतीक्षा नहीं।", hinglish: "UPI, credit/debit card ya net banking se secure payment karein. Aapki renewed policy instantly issue hoti hai aur email pe bheji jaati hai. Koi paperwork nahi, koi waiting nahi." },
    step5Title: { en: "Retain Your NCB & Drive Worry-Free", hi: "अपना NCB बनाए रखें और निश्चिंत ड्राइव करें", hinglish: "Apna NCB Bachaye Rakhein & Worry-Free Drive Karein" },
    step5Desc: { en: "Your No Claim Bonus transfers automatically when you switch insurers. Drive with confidence knowing you have the best coverage at the lowest price.", hi: "जब आप बीमाकर्ता बदलते हैं तो आपका नो क्लेम बोनस स्वचालित रूप से स्थानांतरित होता है। सबसे कम कीमत पर सर्वोत्तम कवरेज होने का विश्वास रखकर ड्राइव करें।", hinglish: "Jab aap insurer switch karte hain toh aapka No Claim Bonus automatically transfer hota hai. Confidence ke saath drive karein jaante hue ki aapke paas best coverage hai sabse kam price pe." },
  },
  addOns: {
    heading: { en: "Important Car Insurance", hi: "महत्वपूर्ण कार बीमा", hinglish: "Important Car Insurance" },
    headingHighlight: { en: "Add-ons", hi: "ऐड-ऑन", hinglish: "Add-ons" },
    desc: {
      en: "Add-ons are optional covers that enhance your comprehensive car insurance policy. They fill the gaps that a standard policy leaves open. Choosing the right combination of add-ons can save you lakhs in out-of-pocket expenses during claims. Here are the most valuable add-ons you should consider.",
      hi: "ऐड-ऑन वैकल्पिक कवर हैं जो आपकी कॉम्प्रिहेंसिव कार बीमा पॉलिसी को बेहतर बनाते हैं। वे उन अंतरालों को भरते हैं जो स्टैंडर्ड पॉलिसी खुली छोड़ती है। सही ऐड-ऑन संयोजन चुनने से क्लेम के दौरान लाखों का खर्चा बच सकता है। यहाँ सबसे मूल्यवान ऐड-ऑन हैं जिन पर आप विचार करें।",
      hinglish: "Add-ons optional covers hain jo aapki comprehensive car insurance policy ko enhance karte hain. Yeh woh gaps fill karte hain jo standard policy open chhodti hai. Sahi add-on combination choose karne se claim ke dauraan lakhs ka kharcha bach sakta hai. Yahan sabse valuable add-ons hain jin par aap vichar karein."
    },
    detailedGuide: { en: "Detailed Guide →", hi: "विस्तृत गाइड →", hinglish: "Detailed Guide →" },
    approxCost: { en: "Approx. Cost:", hi: "अनुमानित लागत:", hinglish: "Approx. Cost:" },
    zeroDep: { en: "Zero Depreciation", hi: "ज़ीरो डेप्रिसिएशन", hinglish: "Zero Depreciation" },
    zeroDepDesc: { en: "No depreciation deducted on replaced parts during claims. Get full repair cost covered. Ideal for new and luxury cars up to 5 years old.", hi: "क्लेम के दौरान बदले गए पुर्जों पर कोई ह्रास नहीं काटा जाता। पूरी मरम्मत लागत कवर होती है। 5 वर्ष तक की नई और लक्ज़री कारों के लिए आदर्श।", hinglish: "Claim ke dauraan replaced parts pe koi depreciation nahi kaata jaata. Full repair cost covered. 5 saal tak ki nayi aur luxury cars ke liye ideal." },
    rsa: { en: "Roadside Assistance (RSA)", hi: "रोडसाइड असिस्टेंस (RSA)", hinglish: "Roadside Assistance (RSA)" },
    rsaDesc: { en: "24/7 emergency support including towing, flat tyre change, fuel delivery, battery jumpstart, and locksmith services. Essential for highway and long-distance drivers.", hi: "24/7 आपातकालीन सहायता जिसमें टोइंग, फ्लैट टायर बदलाव, ईंधन वितरण, बैटरी जंपस्टार्ट और लॉकस्मिथ सेवाएँ शामिल हैं। हाईवे और लंबी दूरी के ड्राइवरों के लिए ज़रूरी।", hinglish: "24/7 emergency support including towing, flat tyre change, fuel delivery, battery jumpstart, aur locksmith services. Highway aur long-distance drivers ke liye zaroori." },
    rti: { en: "Return to Invoice (RTI)", hi: "रिटर्न टू इनवॉइस (RTI)", hinglish: "Return to Invoice (RTI)" },
    rtiDesc: { en: "If your car is stolen or declared a total loss, get the full invoice value (ex-showroom + registration + road tax) instead of just the IDV. Must-have for new cars.", hi: "यदि आपकी कार चोरी हो जाती है या पूर्ण हानि घोषित होती है, तो केवल IDV के बजाय पूर्ण इनवॉइस मूल्य (एक्स-शोरूम + पंजीकरण + रोड टैक्स) प्राप्त करें। नई कारों के लिए ज़रूरी।", hinglish: "Agar aapki car chori ho jaye ya total loss declare ho, toh sirf IDV ki jagah full invoice value (ex-showroom + registration + road tax) paayein. Nayi cars ke liye must-have." },
    engine: { en: "Engine Protect", hi: "इंजन प्रोटेक्ट", hinglish: "Engine Protect" },
    engineDesc: { en: "Covers engine damage due to waterlogging, hydrostatic lock, coolant leakage, and gear box damage. Standard policies exclude this. Critical in monsoon-prone cities like Mumbai, Chennai, and Bengaluru.", hi: "जलभराव, हाइड्रोस्टैटिक लॉक, कूलेंट रिसाव और गियरबॉक्स क्षति से इंजन डैमेज कवर करता है। स्टैंडर्ड पॉलिसियाँ इसे छोड़ती हैं। मानसून वाले शहरों जैसे मुंबई, चेन्नई और बेंगलुरु में अत्यंत ज़रूरी।", hinglish: "Waterlogging, hydrostatic lock, coolant leakage aur gear box damage se engine damage cover karta hai. Standard policies isse exclude karti hain. Monsoon-prone cities jaise Mumbai, Chennai aur Bengaluru mein critical." },
    consumables: { en: "Consumables Cover", hi: "कंस्यूमेबल्स कवर", hinglish: "Consumables Cover" },
    consumablesDesc: { en: "Pays for consumables like engine oil, coolant, brake fluid, nuts, bolts, washers, and grease used during repairs. Normally excluded from standard claims, these can add up to ₹3,000-₹8,000 per repair.", hi: "मरम्मत के दौरान इस्तेमाल हुए इंजन ऑयल, कूलेंट, ब्रेक फ्लूइड, नट, बोल्ट, वॉशर और ग्रीस जैसे कंस्यूमेबल्स का भुगतान करता है। आमतौर पर स्टैंडर्ड क्लेम से बाहर, ये प्रति मरम्मत ₹3,000-₹8,000 तक हो सकते हैं।", hinglish: "Repair ke dauraan use hue engine oil, coolant, brake fluid, nuts, bolts, washers aur grease jaise consumables ka payment karta hai. Normally standard claims se excluded, yeh per repair ₹3,000-₹8,000 tak ho sakte hain." },
    ncbProtector: { en: "NCB Protector", hi: "NCB प्रोटेक्टर", hinglish: "NCB Protector" },
    ncbProtectorDesc: { en: "Preserves your No Claim Bonus even after one claim in the policy year. Your NCB slab stays unchanged — perfect for those who have built up 35-50% NCB and don't want to lose it.", hi: "पॉलिसी वर्ष में एक क्लेम के बाद भी आपका नो क्लेम बोनस बनाए रखता है। आपका NCB स्लैब अपरिवर्तित रहता है — उनके लिए बिल्कुल सही जिन्होंने 35-50% NCB जमा किया है और नहीं खोना चाहते।", hinglish: "Policy year mein ek claim ke baad bhi aapka No Claim Bonus bachaye rakhta hai. Aapka NCB slab unchanged rehta hai — unke liye perfect jinhone 35-50% NCB jama kiya hai aur nahi khona chahte." },
  },
  claim: {
    heading: { en: "Need to File a", hi: "करना चाहते हैं", hinglish: "Karna Chahte Hain" },
    headingHighlight: { en: "Car Insurance Claim", hi: "कार बीमा क्लेम", hinglish: "Car Insurance Claim" },
    headingSuffix: { en: "?", hi: "?", hinglish: "?" },
    desc: {
      en: "Whether it's a minor dent, a major accident, or theft — filing a car insurance claim doesn't have to be stressful. Our step-by-step Claim Guide walks you through the entire process from registering your claim to receiving the settlement. We also help you understand cashless claims, reimbursement claims, and what documents you need for a smooth experience.",
      hi: "चाहे मामूली खरोंच हो, बड़ी दुर्घटना हो, या चोरी — कार बीमा क्लेम दाखिल करना परेशानी भरा नहीं होना चाहिए। हमारी चरण-दर-चरण क्लेम गाइड पूरी प्रक्रिया में आपका मार्गदर्शन करती है। हम कैशलेस क्लेम, प्रतिपूर्ति क्लेम और आवश्यक दस्तावेज़ भी समझाते हैं।",
      hinglish: "Chaahe minor dent ho, major accident ho, ya theft — car insurance claim file karna stressful nahi hona chahiye. Hamaari step-by-step Claim Guide poori process mein aapka guidance karti hai. Hum cashless claims, reimbursement claims aur zaroori documents bhi samjhate hain."
    },
    claimGuideLink: { en: "Claim Guide", hi: "क्लेम गाइड", hinglish: "Claim Guide" },
    ctaGuide: { en: "Read the Claim Guide", hi: "क्लेम गाइड पढ़ें", hinglish: "Claim Guide Padhein" },
    ctaWhatsApp: { en: "💬 Get Expert Claim Help", hi: "💬 विशेषज्ञ क्लेम सहायता प्राप्त करें", hinglish: "💬 Expert Claim Help Lo" },
  },
  faq: {
    heading: { en: "Car Insurance", hi: "कार बीमा", hinglish: "Car Insurance" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: { en: "Frequently asked questions about car insurance in India. Still have questions? Chat with our AI advisor or talk to Himanshu on WhatsApp.", hi: "भारत में कार बीमे के बारे में अक्सर पूछे जाने वाले सवाल। अभी भी सवाल हैं? हमारे AI सलाहकार से चैट करें या हिमांशु से WhatsApp पर बात करें।", hinglish: "India mein car insurance ke baare mein often pooche jaane wale sawaal. Abhi bhi sawaal hain? Hamaare AI advisor se chat karein ya Himanshu se WhatsApp pe baat karein." },
  },
  expert: {
    heading: { en: "Expert Insight by", hi: "विशेषज्ञ अंतर्दृष्टि", hinglish: "Expert Insight" },
    headingHighlight: { en: "Himanshu Paliwal", hi: "हिमांशु पालीवाल", hinglish: "Himanshu Paliwal" },
    subtitle: { en: "IRDAI Certified Insurance Advisor · POSP Code:", hi: "IRDAI प्रमाणित बीमा सलाहकार · POSP कोड:", hinglish: "IRDAI Certified Insurance Advisor · POSP Code:" },
    para1: {
      en: "\"Most car owners in India are either over-insured or under-insured. They either pay for add-ons they don't need, or skip critical covers that would save them lakhs during claims. The biggest mistake I see is people choosing the cheapest premium without understanding what they're giving up — lower IDV, missing add-ons, poor claim settlement records.\"",
      hi: "\"भारत में अधिकांश कार मालिक या तो अधिक बीमित हैं या कम बीमित। वे या तो ऐसे ऐड-ऑन के लिए भुगतान करते हैं जिनकी ज़रूरत नहीं, या ऐसे महत्वपूर्ण कवर छोड़ देते हैं जो क्लेम में लाखों बचा सकते थे। सबसे बड़ी गलती जो मैं देखता हूँ वह है सबसे सस्ता प्रीमियम चुनना बिना यह समझे कि वे क्या छोड़ रहे हैं — कम IDV, गायब ऐड-ऑन, खराब क्लेम निपटान रिकॉर्ड।\"",
      hinglish: "\"Most car owners India mein ya toh over-insured hain ya under-insured. Woh ya toh aise add-ons ke liye pay karte hain jinki zaroorat nahi, ya aise critical covers skip kar dete hain jo claim mein lakhs bacha sakte the. Sabse badi galti jo main dekhta hoon woh hai sabse sasta premium choose karna bina yeh samjhe ki woh kya chhod rahe hain — lower IDV, missing add-ons, poor claim settlement records.\""
    },
    para2: {
      en: "\"My advice: always compare at least 5 insurers before renewing. Don't just look at the premium — check the IDV offered, claim settlement ratio, network garages in your city, and add-on availability. A ₹2,000 saving on premium today can cost you ₹50,000+ during a claim if you chose the wrong plan. Use our AI audit tool to get a free, unbiased comparison.\"",
      hi: "\"मेरी सलाह: नवीनीकरण से पहले हमेशा कम से कम 5 बीमाकर्ताओं की तुलना करें। केवल प्रीमियम न देखें — दी गई IDV, क्लेम निपटान अनुपात, आपके शहर के नेटवर्क गैराज और ऐड-ऑन उपलब्धता जाँचें। आज प्रीमियम पर ₹2,000 की बचत गलत योजना चुनने पर क्लेम में ₹50,000+ का खर्चा करा सकती है। मुफ़्त, निष्पक्ष तुलना पाने के लिए हमारे AI ऑडिट टूल का उपयोग करें।\"",
      hinglish: "\"Meri salaah: renew karne se pehle hamesha kam se kam 5 insurers compare karein. Sirf premium mat dekhein — IDV offered, claim settlement ratio, aapke city ke network garages aur add-on availability check karein. Aaj premium pe ₹2,000 ki bachat galat plan choose karne pe claim mein ₹50,000+ ka kharcha kara sakti hai. Free, unbiased comparison paane ke liye hamaare AI audit tool ka use karein.\""
    },
    para3: {
      en: "\"And remember — your NCB is your biggest asset. If you have 50% NCB, protect it with an NCB Protector add-on. One small claim can reset years of accumulated discount.\"",
      hi: "\"और याद रखें — आपका NCB आपकी सबसे बड़ी संपत्ति है। यदि आपके पास 50% NCB है, तो NCB प्रोटेक्टर ऐड-ऑन से इसे सुरक्षित करें। एक छोटा क्लेम सालों से जमा छूट को रीसेट कर सकता है।\"",
      hinglish: "\"Aur yaad rakhein — aapka NCB aapki sabse badi asset hai. Agar aapke paas 50% NCB hai, toh NCB Protector add-on se ise protect karein. Ek chhota claim saalon se jama discount ko reset kar sakta hai.\""
    },
  },
  cta: {
    heading: { en: "Compare Car Insurance Plans &", hi: "कार बीमा योजनाओं की तुलना करें और", hinglish: "Car Insurance Plans Compare Karein &" },
    headingHighlight: { en: "Save Up to 50%", hi: "50% तक बचत करें", hinglish: "50% Tak Bachat Karein" },
    desc: { en: "Don't overpay for car insurance. Use our AI-powered comparison engine to find the best plan from 10+ insurers. Get instant quotes, compare add-ons, and renew in under 5 minutes.", hi: "कार बीमे के लिए अधिक भुगतान मत करें। 10+ बीमाकर्ताओं से सर्वोत्तम योजना खोजने के लिए हमारे AI-संचालित तुलना इंजन का उपयोग करें। तत्काल कोटेशन प्राप्त करें, ऐड-ऑन की तुलना करें, और 5 मिनट से कम में नवीनीकरण करें।", hinglish: "Car insurance ke liye zyada payment mat karein. 10+ insurers se best plan dhoondhne ke liye hamaare AI-powered comparison engine ka use karein. Instant quotes paayein, add-ons compare karein, aur 5 minute se kam mein renew karein." },
    ctaCompare: { en: "Compare & Save Now", hi: "तुलना करें और अभी बचत करें", hinglish: "Compare & Save Now" },
    ctaWhatsApp: { en: "💬 Talk to Himanshu on WhatsApp", hi: "💬 हिमांशु से WhatsApp पर बात करें", hinglish: "💬 Himanshu se WhatsApp pe Baat Karein" },
    link1: { en: "Zero Dep Car Insurance →", hi: "ज़ीरो डेप कार बीमा →", hinglish: "Zero Dep Car Insurance →" },
    link2: { en: "Claim Guide →", hi: "क्लेम गाइड →", hinglish: "Claim Guide →" },
    link3: { en: "Car Insurance Renewal →", hi: "कार बीमा नवीनीकरण →", hinglish: "Car Insurance Renewal →" },
    link4: { en: "Health Insurance →", hi: "हेल्थ बीमा →", hinglish: "Health Insurance →" },
    footer: { en: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834", hi: "हिमांशु पालीवाल द्वारा — IRDAI प्रमाणित बीमा सलाहकार · POSP कोड: IP429834", hinglish: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834" },
  },
  faqs: [
    {
      q: { en: "What is the difference between Third-Party and Comprehensive car insurance?", hi: "थर्ड-पार्टी और कॉम्प्रिहेंसिव कार बीमे में क्या अंतर है?", hinglish: "Third-Party aur Comprehensive car insurance mein kya farak hai?" },
      a: { en: "Third-Party (TP) insurance covers only damage caused by your car to a third person, their vehicle, or property — it is mandatory by law. Comprehensive insurance covers both third-party liability and own damage (OD) to your car from accidents, theft, fire, natural calamities, and vandalism. TP is cheaper but offers limited protection; Comprehensive gives you complete peace of mind.", hi: "थर्ड-पार्टी (TP) बीमा केवल आपकी कार द्वारा किसी तीसरे व्यक्ति, उनके वाहन या संपत्ति को हुई क्षति कवर करता है — यह कानून द्वारा अनिवार्य है। कॉम्प्रिहेंसिव बीमा थर्ड-पार्टी देयता और अपनी कार को दुर्घटना, चोरी, आग, प्राकृतिक आपदा और बर्बरता से ओन डैमेज (OD) दोनों कवर करता है। TP सस्ता है लेकिन सीमित सुरक्षा; कॉम्प्रिहेंसिव पूर्ण मन की शांति देता है।", hinglish: "Third-Party (TP) insurance sirf aapki car kisi teesre person, unke vehicle ya property ko hui damage cover karta hai — yeh law ke hisaab se mandatory hai. Comprehensive insurance third-party liability aur apni car ke own damage (OD) dono cover karta hai — accidents, theft, fire, natural calamities, vandalism se. TP sasta hai lekin limited protection; Comprehensive complete peace of mind deta hai." },
    },
    {
      q: { en: "How is IDV calculated for car insurance?", hi: "कार बीमे के लिए IDV की गणना कैसे होती है?", hinglish: "Car insurance ke liye IDV kaise calculate hota hai?" },
      a: { en: "IDV (Insured Declared Value) is the current market value of your car. It is calculated as: IDV = Manufacturer's Ex-Showroom Price minus Depreciation based on vehicle age. For new cars, IDV is up to 95% of ex-showroom price. For cars aged 1-2 years, depreciation is 20%; 2-3 years, 30%; 3-4 years, 40%; 4-5 years, 50%. Beyond 5 years, IDV is mutually agreed between you and the insurer based on the vehicle's condition. A higher IDV means a slightly higher premium but better claim settlement.", hi: "IDV (बीमित घोषित मूल्य) आपकी कार का वर्तमान बाज़ार मूल्य है। यह इस प्रकार गणना होता है: IDV = निर्माता का एक्स-शोरूम मूल्य घटा वाहन आयु के आधार पर ह्रास। नई कारों के लिए IDV एक्स-शोरूम मूल्य का 95% तक है। 1-2 वर्ष की कारों के लिए ह्रास 20%; 2-3 वर्ष, 30%; 3-4 वर्ष, 40%; 4-5 वर्ष, 50%। 5 वर्ष से अधिक में, IDV वाहन की स्थिति के आधार पर आप और बीमाकर्ता के बीच पारस्परिक समझौते से तय होता है। अधिक IDV का मतलब थोड़ा अधिक प्रीमियम लेकिन बेहतर क्लेम निपटान।", hinglish: "IDV (Insured Declared Value) aapki car ka current market value hai. Yeh aise calculate hota hai: IDV = Manufacturer ka Ex-Showroom Price minus Vehicle age ke basis pe Depreciation. Nayi cars ke liye IDV ex-showroom price ka 95% tak hota hai. 1-2 saal ki cars ke liye depreciation 20%; 2-3 saal, 30%; 3-4 saal, 40%; 4-5 saal, 50%. 5 saal se zyada mein, IDV vehicle ki condition ke basis pe aap aur insurer ke beech mutual agreement se tay hota hai. Zyada IDV ka matlab thoda zyada premium lekin better claim settlement." },
    },
    {
      q: { en: "What is NCB and how does it reduce my car insurance premium?", hi: "NCB क्या है और यह मेरा कार बीमा प्रीमियम कैसे कम करता है?", hinglish: "NCB kya hai aur yeh mera car insurance premium kaise kam karta hai?" },
      a: { en: "NCB (No Claim Bonus) is a discount on your Own Damage premium rewarded for every claim-free year. It starts at 20% after the first claim-free year and increases progressively: 25% after 2 years, 35% after 3 years, 45% after 4 years, and 50% after 5+ consecutive claim-free years. NCB can reduce your premium by up to half! Importantly, NCB belongs to you (the driver), not the car — you can transfer it when switching insurers or buying a new car.", hi: "NCB (नो क्लेम बोनस) प्रत्येक क्लेम-मुक्त वर्ष के लिए आपके ओन डैमेज प्रीमियम पर छूट है। यह पहले क्लेम-मुक्त वर्ष के बाद 20% से शुरू होती है और बढ़ती जाती है: 2 वर्ष बाद 25%, 3 वर्ष बाद 35%, 4 वर्ष बाद 45%, और 5+ लगातार क्लेम-मुक्त वर्षों बाद 50%। NCB आपके प्रीमियम को आधा तक कम कर सकता है! महत्वपूर्ण रूप से, NCB आपका है (ड्राइवर), कार का नहीं — आप बीमाकर्ता बदलते या नई कार खरीदते समय इसे स्थानांतरित कर सकते हैं।", hinglish: "NCB (No Claim Bonus) aapke Own Damage premium pe discount hai jo har claim-free year ke liye milta hai. Yeh pehle claim-free year ke baad 20% se shuru hota hai aur badhta jaata hai: 2 saal baad 25%, 3 saal baad 35%, 4 saal baad 45%, aur 5+ consecutive claim-free years baad 50%. NCB aapka premium aadha tak kam kar sakta hai! Important baat — NCB aapka hai (driver ka), car ka nahi — aap insurer switch karte ya nayi car khareedte waqt ise transfer kar sakte hain." },
    },
    {
      q: { en: "Should I choose Zero Depreciation add-on for my car insurance?", hi: "क्या मुझे अपने कार बीमे के लिए ज़ीरो डेप्रिसिएशन ऐड-ऑन चुनना चाहिए?", hinglish: "Kya mujhe apne car insurance ke liye Zero Depreciation add-on choose karna chahiye?" },
      a: { en: "Zero Depreciation (zero dep) is highly recommended for cars up to 5 years old, luxury vehicles, and cars driven in high-traffic cities. Without zero dep, your insurer deducts 30-50% depreciation on replaced parts during a claim. With zero dep, you get the full repair cost covered (minus compulsory deductible). The add-on costs 15-20% extra on your OD premium but can save you ₹30,000-₹50,000 on a single claim. Learn more on our dedicated zero dep guide.", hi: "ज़ीरो डेप्रिसिएशन (ज़ीरो डेप) 5 वर्ष तक की कारों, लक्ज़री वाहनों और उच्च-यातायात शहरों में चलने वाली कारों के लिए अत्यधिक अनुशंसित है। ज़ीरो डेप के बिना, आपका बीमाकर्ता क्लेम के दौरान बदले गए पुर्जों पर 30-50% ह्रास काटता है। ज़ीरो डेप के साथ, आपको पूरी मरम्मत लागत कवर मिलती है (अनिवार्य डिडक्टिबल घटाकर)। यह ऐड-ऑन आपके OD प्रीमियम पर 15-20% अतिरिक्त लागत करता है लेकिन एक क्लेम पर ₹30,000-₹50,000 बचा सकता है। हमारी ज़ीरो डेप गाइड पर और जानें।", hinglish: "Zero Depreciation (zero dep) 5 saal tak ki cars, luxury vehicles aur high-traffic cities mein chalne wali cars ke liye highly recommended hai. Zero dep ke bina, aapka insurer claim ke dauraan replaced parts pe 30-50% depreciation kaatta hai. Zero dep ke saath, aapko full repair cost covered milta hai (compulsory deductible minus). Yeh add-on aapke OD premium pe 15-20% extra lagata hai lekin ek claim pe ₹30,000-₹50,000 bacha sakta hai. Hamaari zero dep guide pe aur jaaniye." },
    },
    {
      q: { en: "How do I renew my car insurance online?", hi: "मैं अपना कार बीमा ऑनलाइन कैसे नवीनीकरण करूँ?", hinglish: "Main apna car insurance online kaise renew karoon?" },
      a: { en: "Renewing car insurance online is simple: (1) Visit PaliwalSecure.in and enter your car number or previous policy details. (2) Compare quotes from 10+ insurers side by side. (3) Select add-ons like zero dep, RSA, engine protect. (4) Make payment via UPI, card, or net banking. (5) Policy is issued instantly and sent to your email. The entire process takes under 5 minutes. Always renew before expiry to retain your NCB discount.", hi: "कार बीमा ऑनलाइन नवीनीकरण आसान है: (1) PaliwalSecure.in पर जाएँ और अपनी कार नंबर या पिछली पॉलिसी विवरण दर्ज करें। (2) 10+ बीमाकर्ताओं से कोटेशन समानांतर तुलना करें। (3) ज़ीरो डेप, RSA, इंजन प्रोटेक्ट जैसे ऐड-ऑन चुनें। (4) UPI, कार्ड या नेट बैंकिंग से भुगतान करें। (5) पॉलिसी तुरंत जारी होती है और ईमेल पर भेजी जाती है। पूरी प्रक्रिया 5 मिनट से कम में होती है। हमेशा समाप्ति से पहले नवीनीकरण करें ताकि NCB छूट बनी रहे।", hinglish: "Car insurance online renew karna aasan hai: (1) PaliwalSecure.in pe jayein aur apni car number ya previous policy details enter karein. (2) 10+ insurers se quotes side by side compare karein. (3) Zero dep, RSA, engine protect jaise add-ons choose karein. (4) UPI, card ya net banking se payment karein. (5) Policy instantly issue hoti hai aur email pe bheji jaati hai. Poori process 5 minute se kam mein hoti hai. Hamesha expiry se pehle renew karein taaki NCB discount bani rahe." },
    },
    {
      q: { en: "Can I switch my car insurance company during renewal?", hi: "क्या मैं नवीनीकरण के दौरान अपनी कार बीमा कंपनी बदल सकता हूँ?", hinglish: "Kya main renewal ke dauraan apni car insurance company badal sakta hoon?" },
      a: { en: "Yes! You can switch insurers at the time of renewal without losing your NCB. Your No Claim Bonus is transferable — just provide your NCB certificate from the previous insurer. Use our comparison tool to find a better plan with the same or more benefits at a lower premium. Switching is seamless and your new policy starts immediately after the old one expires.", hi: "हाँ! आप नवीनीकरण के समय बीमाकर्ता बदल सकते हैं बिना अपना NCB खोए। आपका नो क्लेम बोनस हस्तांतरणीय है — बस पिछले बीमाकर्ता से NCB प्रमाणपत्र प्रदान करें। कम प्रीमियम पर समान या अधिक लाभ वाली बेहतर योजना खोजने के लिए हमारे तुलना टूल का उपयोग करें। स्विचिंग सहज है और आपकी नई पॉलिसी पुरानी समाप्त होते ही शुरू हो जाती है।", hinglish: "Haan! Aap renewal ke time insurer badal sakte hain bina apna NCB khoye. Aapka No Claim Bonus transferable hai — bas pichle insurer se NCB certificate provide karein. Kam premium pe same ya zyada benefits wali better plan dhoondhne ke liye hamaare comparison tool ka use karein. Switching seamless hai aur aapki nayi policy purani expire hote hi shuru ho jaati hai." },
    },
    {
      q: { en: "What add-ons should I consider for my car insurance policy?", hi: "मुझे अपनी कार बीमा पॉलिसी के लिए कौन से ऐड-ऑन पर विचार करने चाहिए?", hinglish: "Mujhe apni car insurance policy ke liye kaun se add-ons par vichar karna chahiye?" },
      a: { en: "The most valuable add-ons are: (1) Zero Depreciation — covers full repair cost without depreciation deduction. (2) Roadside Assistance (RSA) — towing, fuel delivery, flat tyre help 24/7. (3) Engine Protect — covers engine damage from waterlogging, a must in monsoon-prone cities. (4) Return to Invoice (RTI) — get full invoice value if your car is stolen or totalled. (5) Consumables — covers oil, coolant, nuts, bolts during repairs. (6) NCB Protector — keeps your NCB intact even after one claim. Choose based on your car age, city, and driving habits.", hi: "सबसे मूल्यवान ऐड-ऑन हैं: (1) ज़ीरो डेप्रिसिएशन — बिना ह्रास कटौती पूरी मरम्मत लागत कवर। (2) रोडसाइड असिस्टेंस (RSA) — 24/7 टोइंग, ईंधन वितरण, फ्लैट टायर सहायता। (3) इंजन प्रोटेक्ट — जलभराव से इंजन डैमेज कवर, मानसून शहरों के लिए ज़रूरी। (4) रिटर्न टू इनवॉइस (RTI) — चोरी या पूर्ण हानि पर पूर्ण इनवॉइस मूल्य प्राप्त करें। (5) कंस्यूमेबल्स — मरम्मत में तेल, कूलेंट, नट, बोल्ट कवर। (6) NCB प्रोटेक्टर — एक क्लेम के बाद भी NCB बनाए रखता है। अपनी कार आयु, शहर और ड्राइविंग आदतों के आधार पर चुनें।", hinglish: "Sabse valuable add-ons hain: (1) Zero Depreciation — bina depreciation deduction full repair cost cover. (2) Roadside Assistance (RSA) — 24/7 towing, fuel delivery, flat tyre help. (3) Engine Protect — waterlogging se engine damage cover, monsoon cities ke liye zaroori. (4) Return to Invoice (RTI) — theft ya total loss pe full invoice value paayein. (5) Consumables — repair mein oil, coolant, nuts, bolts cover. (6) NCB Protector — ek claim ke baad bhi NCB intact rakhta hai. Apni car age, city aur driving habits ke basis pe choose karein." },
    },
  ],
};

// ── Static data ─────────────────────────────────────────────────────────────
const ncbSlabs: { yearKey: keyof typeof pageText.ncb; discount: string }[] = [
  { yearKey: 'slab1', discount: '20%' },
  { yearKey: 'slab2', discount: '25%' },
  { yearKey: 'slab3', discount: '35%' },
  { yearKey: 'slab4', discount: '45%' },
  { yearKey: 'slab5', discount: '50%' },
];

const comparisonInsurers = [
  { name: 'HDFC ERGO', odRate: '3.31% – 3.44%', claimSettlement: '92%', highlight: { en: '4,500+ network garages', hi: '4,500+ नेटवर्क गैराज', hinglish: '4,500+ network garages' }, networkGarages: '4,500+', isAiPick: true },
  { name: 'ACKO', odRate: '2.50% – 3.20%', claimSettlement: '95%', highlight: { en: 'Digital-first, instant claims', hi: 'डिजिटल-फर्स्ट, तत्काल क्लेम', hinglish: 'Digital-first, instant claims' }, networkGarages: '2,000+', isAiPick: false },
  { name: 'Go Digit', odRate: '2.75% – 3.30%', claimSettlement: '93%', highlight: { en: 'Smartphone self-inspection', hi: 'स्मार्टफ़ोन सेल्फ-इंस्पेक्शन', hinglish: 'Smartphone self-inspection' }, networkGarages: '3,500+', isAiPick: false },
  { name: 'ICICI Lombard', odRate: '3.20% – 3.55%', claimSettlement: '91%', highlight: { en: 'Instant policy issuance', hi: 'तत्काल पॉलिसी जारी', hinglish: 'Instant policy issuance' }, networkGarages: '5,000+', isAiPick: false },
  { name: 'TATA AIG', odRate: '3.10% – 3.50%', claimSettlement: '90%', highlight: { en: 'Up to 7 yr zero dep', hi: '7 वर्ष तक ज़ीरो डेप', hinglish: 'Up to 7 yr zero dep' }, networkGarages: '4,000+', isAiPick: false },
  { name: 'Bajaj Allianz', odRate: '3.25% – 3.60%', claimSettlement: '92%', highlight: { en: 'Quick claim settlement', hi: 'त्वरित क्लेम निपटान', hinglish: 'Quick claim settlement' }, networkGarages: '6,000+', isAiPick: false },
];

const idvDepreciation = [
  { age: { en: 'Less than 6 months', hi: '6 महीने से कम', hinglish: 'Less than 6 months' }, dep: '5%', idv: '95%' },
  { age: { en: '6 months – 1 year', hi: '6 महीने – 1 वर्ष', hinglish: '6 months – 1 year' }, dep: '15%', idv: '85%' },
  { age: { en: '1 – 2 years', hi: '1 – 2 वर्ष', hinglish: '1 – 2 years' }, dep: '20%', idv: '80%' },
  { age: { en: '2 – 3 years', hi: '2 – 3 वर्ष', hinglish: '2 – 3 years' }, dep: '30%', idv: '70%' },
  { age: { en: '3 – 4 years', hi: '3 – 4 वर्ष', hinglish: '3 – 4 years' }, dep: '40%', idv: '60%' },
  { age: { en: '4 – 5 years', hi: '4 – 5 वर्ष', hinglish: '4 – 5 years' }, dep: '50%', idv: '50%' },
];

// ── Section divider component ────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

// ── Main Client Component ────────────────────────────────────────────────────
export default function ClientContent() {
  const { language } = useLanguage();
  const T = pageText;

  // FAQ JSON-LD (always in English for SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: T.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q.en,
      acceptedAnswer: { '@type': 'Answer', text: faq.a.en },
    })),
  };

  return (
    <div>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{pt(T.hero.badge, language)}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {pt(T.hero.title1, language)}{' '}
            <span className="gradient-text">{pt(T.hero.title2, language)}</span>{' '}
            {pt(T.hero.titleSuffix, language)}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {pt(T.hero.desc, language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#reverse-audit">
              <ShinyButton variant="blue" className="text-sm md:text-base">
                <span>{pt(T.hero.ctaCompare, language)}</span>
              </ShinyButton>
            </Link>
            <a
              href="https://wa.me/919257877312?text=Hi%2C%20I%20need%20help%20with%20car%20insurance%20renewal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ShinyButton variant="secondary" className="text-sm md:text-base">
                <span>{pt(T.hero.ctaWhatsApp, language)}</span>
              </ShinyButton>
            </a>
          </div>

          {/* Trust Badges Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-6">
            {[
              { icon: '🛡️', text: pt(T.hero.trustBadge1, language) },
              { icon: '🏢', text: pt(T.hero.trustBadge2, language) },
              { icon: '⚡', text: pt(T.hero.trustBadge3, language) },
              { icon: '🤝', text: pt(T.hero.trustBadge4, language) },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/60 border border-border/40 text-xs md:text-sm text-muted-foreground">
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Key Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { value: pt(T.hero.stat1Val, language), label: pt(T.hero.stat1Label, language) },
              { value: pt(T.hero.stat2Val, language), label: pt(T.hero.stat2Label, language) },
              { value: pt(T.hero.stat3Val, language), label: pt(T.hero.stat3Label, language) },
              { value: pt(T.hero.stat4Val, language), label: pt(T.hero.stat4Label, language) },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ WHAT IS CAR INSURANCE ═══════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            {pt(T.whatIs.heading, language)}{' '}
            <span className="gradient-text">{pt(T.whatIs.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">
            {pt(T.whatIs.desc, language)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Third-Party */}
            <div className="bg-card rounded-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{pt(T.whatIs.tpTitle, language)}</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[T.whatIs.tp1, T.whatIs.tp2, T.whatIs.tp3, T.whatIs.tp4, T.whatIs.tp5].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{pt(item, language)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg px-3 py-2">
                {pt(T.whatIs.tpNote, language)}
              </p>
            </div>

            {/* Comprehensive */}
            <div className="glass-card bg-card rounded-xl p-6 shadow-sm border border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{pt(T.whatIs.compTitle, language)}</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[T.whatIs.comp1, T.whatIs.comp2, T.whatIs.comp3, T.whatIs.comp4, T.whatIs.comp5].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{pt(item, language)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs bg-primary/10 text-primary rounded-lg px-3 py-2">
                {pt(T.whatIs.compNote, language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ IDV SECTION ═══════════════════ */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(T.idv.heading, language)}{' '}
            <span className="gradient-text">{pt(T.idv.headingHighlight, language)}</span>{' '}
            {pt(T.idv.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">
            {pt(T.idv.desc, language)}
          </p>

          <div className="bg-card rounded-xl p-6 shadow-sm max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">{pt(T.idv.tableTitle, language)}</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">{pt(T.idv.thAge, language)}</th>
                    <th className="text-center py-3 px-4 font-semibold">{pt(T.idv.thDep, language)}</th>
                    <th className="text-center py-3 px-4 font-semibold">{pt(T.idv.thIdv, language)}</th>
                  </tr>
                </thead>
                <tbody>
                  {idvDepreciation.map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{pt(row.age, language)}</td>
                      <td className="py-3 px-4 text-center text-destructive font-medium">{row.dep}</td>
                      <td className="py-3 px-4 text-center text-primary font-bold">{row.idv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{pt(T.idv.note5yr, language)}</p>
          </div>

          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 max-w-3xl">
            <p className="text-sm font-medium text-primary mb-1">{pt(T.idv.tipTitle, language)}</p>
            <p className="text-xs text-muted-foreground">{pt(T.idv.tipDesc, language)}</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ NCB SECTION ═══════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            <span className="gradient-text">{pt(T.ncb.headingHighlight, language)}</span>{' '}
            {pt(T.ncb.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">
            {pt(T.ncb.desc, language)}
          </p>

          <div className="bg-card rounded-xl p-6 shadow-sm max-w-3xl mb-6">
            <h3 className="text-xl font-semibold mb-4">{pt(T.ncb.slabsTitle, language)}</h3>
            <div className="space-y-3">
              {ncbSlabs.map((slab, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 px-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                  <span className="text-sm font-medium">{pt(T.ncb[slab.yearKey] as TEntry, language)}</span>
                  <span className="text-lg font-bold gradient-text">{slab.discount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                {pt(T.ncb.retainedTitle, language)}
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {[T.ncb.retained1, T.ncb.retained2, T.ncb.retained3, T.ncb.retained4].map((item, i) => (
                  <li key={i}>• {pt(item, language)}</li>
                ))}
              </ul>
            </div>
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-destructive mb-2">
                {pt(T.ncb.lostTitle, language)}
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {[T.ncb.lost1, T.ncb.lost2, T.ncb.lost3].map((item, i) => (
                  <li key={i}>• {pt(item, language)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ ZERO DEP VS STANDARD ═══════════════════ */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(T.zeroDep.heading, language)}{' '}
            <span className="gradient-text">{pt(T.zeroDep.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">
            {pt(T.zeroDep.desc, language).split('Zero Dep Car Insurance Guide').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <Link href="/zero-dep-car-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                    {pt(T.zeroDep.guideLink, language)}
                  </Link>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Comprehensive */}
            <div className="bg-card rounded-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-destructive/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{pt(T.zeroDep.standardTitle, language)}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{pt(T.zeroDep.repairBill, language)}</span>
                  <span className="font-medium">₹1,00,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{pt(T.zeroDep.depParts, language)}</span>
                  <span className="font-medium text-destructive">- ₹30,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{pt(T.zeroDep.compDeductible, language)}</span>
                  <span className="font-medium text-destructive">- ₹1,000</span>
                </div>
                <div className="flex justify-between py-3 bg-destructive/5 rounded-lg px-3">
                  <span className="font-semibold">{pt(T.zeroDep.youPay, language)}</span>
                  <span className="font-bold text-destructive">₹31,000</span>
                </div>
              </div>
            </div>

            {/* Zero Dep */}
            <div className="glass-card bg-card rounded-xl p-6 shadow-sm border border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{pt(T.zeroDep.zeroDepTitle, language)}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{pt(T.zeroDep.repairBill, language)}</span>
                  <span className="font-medium">₹1,00,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{pt(T.zeroDep.depParts, language)}</span>
                  <span className="font-medium text-primary">{pt(T.zeroDep.waived, language)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{pt(T.zeroDep.compDeductible, language)}</span>
                  <span className="font-medium text-destructive">- ₹1,000</span>
                </div>
                <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-3">
                  <span className="font-semibold">{pt(T.zeroDep.youPay, language)}</span>
                  <span className="font-bold text-primary">₹1,000</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            {pt(T.zeroDep.footnote, language)}
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ INSURER COMPARISON TABLE ═══════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(T.comparison.heading, language)}{' '}
            <span className="gradient-text">{pt(T.comparison.headingHighlight, language)}</span>{' '}
            {pt(T.comparison.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">
            {pt(T.comparison.desc, language)}
          </p>

          <div className="bg-card rounded-xl p-6 shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">{pt(T.comparison.thInsurer, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(T.comparison.thOdRate, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(T.comparison.thCsr, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(T.comparison.thGarages, language)}</th>
                  <th className="text-left py-3 px-4 font-semibold">{pt(T.comparison.thHighlight, language)}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonInsurers.map((ins, idx) => (
                  <tr key={idx} className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${ins.isAiPick ? 'bg-primary/5' : ''}`}>
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        {ins.name}
                        {ins.isAiPick && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            {pt(T.comparison.aiPick, language)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center gradient-text font-semibold">{ins.odRate}</td>
                    <td className="py-3 px-4 text-center">{ins.claimSettlement}</td>
                    <td className="py-3 px-4 text-center">{ins.networkGarages}</td>
                    <td className="py-3 px-4 text-primary text-xs">{pt(ins.highlight, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-4">
              {pt(T.comparison.footnote, language)}
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ RENEWAL PROCESS ═══════════════════ */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(T.renewal.heading, language)}{' '}
            <span className="gradient-text">{pt(T.renewal.headingHighlight, language)}</span>{' '}
            {pt(T.renewal.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-4xl">
            {pt(T.renewal.desc, language).split('Car Insurance Renewal Guide').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <Link href="/car-insurance-renewal" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                    {pt(T.renewal.renewalLink, language)}
                  </Link>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>

          <div className="space-y-4 max-w-3xl">
            {[
              { title: T.renewal.step1Title, desc: T.renewal.step1Desc, num: 1 },
              { title: T.renewal.step2Title, desc: T.renewal.step2Desc, num: 2 },
              { title: T.renewal.step3Title, desc: T.renewal.step3Desc, num: 3 },
              { title: T.renewal.step4Title, desc: T.renewal.step4Desc, num: 4 },
              { title: T.renewal.step5Title, desc: T.renewal.step5Desc, num: 5 },
            ].map((step, idx) => (
              <div key={idx} className="bg-card rounded-xl p-6 shadow-sm flex items-start gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#081221]">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{pt(step.title, language)}</h3>
                  <p className="text-sm text-muted-foreground">{pt(step.desc, language)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ ADD-ONS SECTION ═══════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(T.addOns.heading, language)}{' '}
            <span className="gradient-text">{pt(T.addOns.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-4xl">
            {pt(T.addOns.desc, language)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: T.addOns.zeroDep, desc: T.addOns.zeroDepDesc, cost: '15-20% of OD premium', link: '/zero-dep-car-insurance' },
              { name: T.addOns.rsa, desc: T.addOns.rsaDesc, cost: '₹500 – ₹1,500/year', link: '' },
              { name: T.addOns.rti, desc: T.addOns.rtiDesc, cost: '₹800 – ₹2,000/year', link: '' },
              { name: T.addOns.engine, desc: T.addOns.engineDesc, cost: '₹600 – ₹1,800/year', link: '' },
              { name: T.addOns.consumables, desc: T.addOns.consumablesDesc, cost: '₹400 – ₹1,200/year', link: '' },
              { name: T.addOns.ncbProtector, desc: T.addOns.ncbProtectorDesc, cost: '₹500 – ₹1,500/year', link: '' },
            ].map((addon, idx) => (
              <div key={idx} className="bg-card rounded-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                <h3 className="text-lg font-semibold mb-2">
                  {pt(addon.name, language)}
                  {addon.link && (
                    <Link href={addon.link} className="ml-2 text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-normal">
                      {pt(T.addOns.detailedGuide, language)}
                    </Link>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{pt(addon.desc, language)}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{pt(T.addOns.approxCost, language)}</span>
                  <span className="font-semibold gradient-text">{addon.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ CLAIM PROCESS LINK ═══════════════════ */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="glass-card bg-card rounded-xl p-6 shadow-sm max-w-3xl mx-auto text-center border border-primary/10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {pt(T.claim.heading, language)}{' '}
              <span className="gradient-text">{pt(T.claim.headingHighlight, language)}</span>
              {pt(T.claim.headingSuffix, language)}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {pt(T.claim.desc, language).split('Claim Guide').map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}
                    <Link href="/claim-guide" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                      {pt(T.claim.claimGuideLink, language)}
                    </Link>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/claim-guide">
                <ShinyButton variant="blue" className="text-sm md:text-base">
                  <span>{pt(T.claim.ctaGuide, language)}</span>
                </ShinyButton>
              </Link>
              <a href="https://wa.me/919257877312?text=Hi%2C%20I%20need%20help%20filing%20a%20car%20insurance%20claim" target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="secondary" className="text-sm md:text-base">
                  <span>{pt(T.claim.ctaWhatsApp, language)}</span>
                </ShinyButton>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ FAQ SECTION ═══════════════════ */}
      <section className="py-16 md:py-24" id="faq">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {pt(T.faq.heading, language)}{' '}
              <span className="gradient-text">{pt(T.faq.headingHighlight, language)}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {pt(T.faq.desc, language)}
            </p>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {T.faqs.map((faq, idx) => (
              <details key={idx} className="bg-card rounded-xl p-5 shadow-sm group cursor-pointer transition-all duration-300 hover:shadow-md">
                <summary className="flex items-center justify-between font-semibold text-base list-none">
                  <span>{pt(faq.q, language)}</span>
                  <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {pt(faq.a, language)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ EXPERT INSIGHT ═══════════════════ */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="glass-card bg-card rounded-xl p-6 shadow-sm max-w-3xl mx-auto border border-primary/10">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center flex-shrink-0">
                <span className="text-xl sm:text-2xl font-bold text-[#081221]">HP</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">
                  {pt(T.expert.heading, language)}{' '}
                  <span className="gradient-text">{pt(T.expert.headingHighlight, language)}</span>
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  {pt(T.expert.subtitle, language)}{' '}
                  <span className="font-semibold text-primary">IP429834</span>
                </p>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p>{pt(T.expert.para1, language)}</p>
                  <p>{pt(T.expert.para2, language)}</p>
                  <p>{pt(T.expert.para3, language)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(T.cta.heading, language)}{' '}
            <span className="gradient-text">{pt(T.cta.headingHighlight, language)}</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {pt(T.cta.desc, language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#reverse-audit">
              <ShinyButton variant="blue" className="text-sm md:text-base">
                <span>{pt(T.cta.ctaCompare, language)}</span>
              </ShinyButton>
            </Link>
            <a href="https://wa.me/919257877312?text=Hi%2C%20I%20want%20to%20compare%20car%20insurance%20plans" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary" className="text-sm md:text-base">
                <span>{pt(T.cta.ctaWhatsApp, language)}</span>
              </ShinyButton>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/zero-dep-car-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {pt(T.cta.link1, language)}
            </Link>
            <Link href="/claim-guide" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {pt(T.cta.link2, language)}
            </Link>
            <Link href="/car-insurance-renewal" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {pt(T.cta.link3, language)}
            </Link>
            <Link href="/health-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {pt(T.cta.link4, language)}
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {pt(T.cta.footer, language)}
          </p>
        </div>
      </section>
    </div>
  );
}
