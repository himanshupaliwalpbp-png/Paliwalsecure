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
    title1: { en: "Bike Insurance", hi: "बाइक बीमा", hinglish: "Bike Insurance" },
    title2: { en: "India", hi: "भारत", hinglish: "India" },
    titleSuffix: { en: "— Compare & Save", hi: "— तुलना करें और बचत करें", hinglish: "— Compare & Save Karein" },
    desc: {
      en: "Compare two-wheeler insurance plans from India's top insurers. IRDAI TP rates from ₹538/year. Comprehensive from ₹799/year. Get AI-powered recommendations from PaliwalSecure.in.",
      hi: "भारत के शीर्ष बीमाकर्ताओं से दो-पहिया बीमा योजनाओं की तुलना करें। IRDAI TP दरें ₹538/वर्ष से। कॉम्प्रिहेंसिव ₹799/वर्ष से। PaliwalSecure.in की AI-संचालित सिफारिशें प्राप्त करें।",
      hinglish: "India ke top insurers se two-wheeler insurance plans compare karein. IRDAI TP rates ₹538/year se. Comprehensive ₹799/year se. PaliwalSecure.in ke AI-powered recommendations paayein."
    },
    ctaCompare: { en: "Compare & Buy Now", hi: "तुलना करें और अभी खरीदें", hinglish: "Compare & Buy Now" },
    ctaWhatsApp: { en: "💬 Chat on WhatsApp", hi: "💬 WhatsApp पर चैट करें", hinglish: "💬 WhatsApp pe Chat Karein" },
    stat1Val: { en: "₹538", hi: "₹538", hinglish: "₹538" },
    stat1Label: { en: "TP Premium Starts", hi: "TP प्रीमियम शुरू", hinglish: "TP Premium Starts" },
    stat2Val: { en: "₹799", hi: "₹799", hinglish: "₹799" },
    stat2Label: { en: "Comprehensive From", hi: "कॉम्प्रिहेंसिव से", hinglish: "Comprehensive From" },
    stat3Val: { en: "50%", hi: "50%", hinglish: "50%" },
    stat3Label: { en: "Max NCB Discount", hi: "अधिकतम NCB छूट", hinglish: "Max NCB Discount" },
    stat4Val: { en: "75%", hi: "75%", hinglish: "75%" },
    stat4Label: { en: "Bikes Uninsured", hi: "बाइकें अबीमित", hinglish: "Bikes Uninsured" },
    trustBadge1: { en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" },
    trustBadge2: { en: "5+ Insurers", hi: "5+ बीमाकर्ता", hinglish: "5+ Insurers" },
    trustBadge3: { en: "Instant Policy", hi: "तत्काल पॉलिसी", hinglish: "Instant Policy" },
    trustBadge4: { en: "Claim Support", hi: "क्लेम सहायता", hinglish: "Claim Support" },
  },
  breadcrumb: {
    home: { en: "Home", hi: "होम", hinglish: "Home" },
    current: { en: "Bike Insurance", hi: "बाइक बीमा", hinglish: "Bike Insurance" },
  },
  whatIs: {
    heading: { en: "What is", hi: "क्या है", hinglish: "Kya Hai" },
    headingHighlight: { en: "Bike Insurance", hi: "बाइक बीमा", hinglish: "Bike Insurance" },
    desc1: {
      en: "Bike insurance (two-wheeler insurance) is a contract between you and an insurance company that protects you financially against loss or damage to your motorcycle or scooter. In India, at least Third-Party bike insurance is mandatory under the Motor Vehicles Act, 1988. Despite this, approximately 75% of India's 200+ crore two-wheelers are either uninsured or have expired policies. Riding without valid insurance can result in fines of ₹2,000 (first offence) and ₹4,000 (repeat), along with possible imprisonment up to 3 months and vehicle impoundment.",
      hi: "बाइक बीमा (दो-पहिया बीमा) आप और बीमा कंपनी के बीच एक अनुबंध है जो आपके मोटरसाइकिल या स्कूटर की हानि या क्षति से वित्तीय रूप से सुरक्षित करता है। भारत में, मोटर वाहन अधिनियम, 1988 के तहत कम से कम थर्ड-पार्टी बाइक बीमा अनिवार्य है। इसके बावजूद, भारत के 200+ करोड़ दो-पहिया वाहनों में से लगभग 75% या तो अबीमित हैं या उनकी पॉलिसी समाप्त हो चुकी है। बिना वैध बीमा के गाड़ी चलाने पर ₹2,000 (पहली बार) और ₹4,000 (दोहराने पर) का जुर्माना हो सकता है।",
      hinglish: "Bike insurance (two-wheeler insurance) aap aur insurance company ke beech ek contract hai jo aapke motorcycle ya scooter ke loss ya damage se financially protect karta hai. India mein, Motor Vehicles Act 1988 ke tahat kam se kam Third-Party bike insurance mandatory hai. Iske bawajood, India ke 200+ crore two-wheelers mein se lagbhag 75% ya toh uninsured hain ya unki policy expire ho chuki hai. Bina valid insurance ke riding karne pe ₹2,000 (first offence) aur ₹4,000 (repeat) ka fine ho sakta hai."
    },
    desc2: {
      en: "Two-wheelers are India's most popular mode of transport, and they are also the most vulnerable on the road. In 2023, two-wheeler riders accounted for over 40% of all road fatalities in India. A comprehensive bike insurance policy not only keeps you legal but also protects you from hefty repair bills, theft losses, and third-party liability claims. PaliwalSecure.in helps you compare plans from 5+ insurers to find the best coverage for your ride.",
      hi: "दो-पहिया वाहन भारत का सबसे लोकप्रिय परिवहन साधन हैं, और सड़क पर सबसे असुरक्षित भी। 2023 में, दो-पहिया सवारों ने भारत में सभी सड़क दुर्घटनाओं के 40% से अधिक में हिस्सा लिया। एक कॉम्प्रिहेंसिव बाइक बीमा पॉलिसी न केवल आपको कानूनी रखती है बल्कि भारी मरम्मत बिल, चोरी के नुकसान और थर्ड-पार्टी देयता दावों से भी सुरक्षित करती है। PaliwalSecure.in आपकी सवारी के लिए सर्वोत्तम कवरेज खोजने में मदद करता है।",
      hinglish: "Two-wheelers India ka sabse popular transport mode hai, aur road pe sabse vulnerable bhi. 2023 mein, two-wheeler riders ne India ke saare road fatalities ka 40% se zyada hissa liya. Ek comprehensive bike insurance policy na sirf aapko legal rakhti hai balki hefty repair bills, theft losses aur third-party liability claims se bhi protect karti hai. PaliwalSecure.in aapki ride ke liye best coverage dhoondhne mein madad karta hai."
    },
    carLink: { en: "Car Insurance", hi: "कार बीमा", hinglish: "Car Insurance" },
    healthLink: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    tpTitle: { en: "Third-Party (TP) Insurance", hi: "थर्ड-पार्टी (TP) बीमा", hinglish: "Third-Party (TP) Insurance" },
    tp1: { en: "Mandatory by law — same rate across all insurers (IRDAI fixed)", hi: "कानून द्वारा अनिवार्य — सभी बीमाकर्ताओं के लिए समान दर (IRDAI निर्धारित)", hinglish: "Law ke hisaab se mandatory — sab insurers ke liye same rate (IRDAI fixed)" },
    tp2: { en: "Covers damage to third-party person, vehicle, or property", hi: "थर्ड-पार्टी व्यक्ति, वाहन, या संपत्ति को हुई क्षति कवर करता है", hinglish: "Third-party person, vehicle ya property ko hui damage cover karta hai" },
    tp3: { en: "Does NOT cover damage to your own bike", hi: "आपकी अपनी बाइक की क्षति कवर नहीं करता", hinglish: "Aapki apni bike ki damage cover nahi karta" },
    tp4: { en: "Includes ₹15 lakh personal accident cover for owner-driver", hi: "मालिक-चालक के लिए ₹15 लाख व्यक्तिगत दुर्घटना कवर शामिल", hinglish: "Owner-driver ke liye ₹15 lakh personal accident cover included" },
    tp5: { en: "Long-term TP (3/5 year) available for new bikes", hi: "नई बाइकों के लिए दीर्घकालिक TP (3/5 वर्ष) उपलब्ध", hinglish: "New bikes ke liye long-term TP (3/5 year) available" },
    tpNote: { en: "IRDAI TP rates (2024-25): Up to 75cc — ₹538; 75-150cc — ₹714; 150-350cc — ₹1,366; Above 350cc — ₹2,023 per year.", hi: "IRDAI TP दरें (2024-25): 75cc तक — ₹538; 75-150cc — ₹714; 150-350cc — ₹1,366; 350cc से अधिक — ₹2,023 प्रति वर्ष।", hinglish: "IRDAI TP rates (2024-25): 75cc tak — ₹538; 75-150cc — ₹714; 150-350cc — ₹1,366; 350cc se zyada — ₹2,023 per year." },
    compTitle: { en: "Comprehensive Insurance", hi: "कॉम्प्रिहेंसिव बीमा", hinglish: "Comprehensive Insurance" },
    comp1: { en: "Covers third-party liability AND own damage (OD)", hi: "थर्ड-पार्टी देयता और ओन डैमेज (OD) दोनों कवर करता है", hinglish: "Third-party liability aur own damage (OD) dono cover karta hai" },
    comp2: { en: "Accidents, theft, fire, natural calamities, vandalism", hi: "दुर्घटना, चोरी, आग, प्राकृतिक आपदाएँ, बर्बरता", hinglish: "Accidents, theft, fire, natural calamities, vandalism" },
    comp3: { en: "Add-on riders available (zero dep, engine protect, etc.)", hi: "ऐड-ऑन राइडर उपलब्ध (ज़ीरो डेप, इंजन प्रोटेक्ट, आदि)", hinglish: "Add-on riders available (zero dep, engine protect, etc.)" },
    comp4: { en: "NCB discount on OD premium for claim-free years", hi: "क्लेम-मुक्त वर्षों के लिए OD प्रीमियम पर NCB छूट", hinglish: "Claim-free years ke liye OD premium pe NCB discount" },
    comp5: { en: "From ₹799/year — strongly recommended for all bikes", hi: "₹799/वर्ष से — सभी बाइकों के लिए दृढ़ता से अनुशंसित", hinglish: "₹799/year se — sabhi bikes ke liye strongly recommended" },
    compNote: { en: "Comprehensive = Third-Party + Own Damage. Add zero dep and engine protect for complete protection, especially in monsoon season.", hi: "कॉम्प्रिहेंसिव = थर्ड-पार्टी + ओन डैमेज। पूर्ण सुरक्षा के लिए ज़ीरो डेप और इंजन प्रोटेक्ट जोड़ें, विशेषकर मानसून में।", hinglish: "Comprehensive = Third-Party + Own Damage. Complete protection ke liye zero dep aur engine protect add karein, specially monsoon mein." },
  },
  tpRates: {
    heading: { en: "IRDAI", hi: "IRDAI", hinglish: "IRDAI" },
    headingHighlight: { en: "Third-Party Rates", hi: "थर्ड-पार्टी दरें", hinglish: "Third-Party Rates" },
    headingSuffix: { en: "for Two-Wheelers (2024-25)", hi: "दो-पहिया वाहनों के लिए (2024-25)", hinglish: "Two-Wheelers ke liye (2024-25)" },
    desc: {
      en: "Third-Party premium rates are fixed by IRDAI and are the same across all insurance companies. You cannot negotiate TP rates. However, you can choose your insurer for the OD component in a comprehensive policy. Here are the current TP rates for two-wheelers.",
      hi: "थर्ड-पार्टी प्रीमियम दरें IRDAI द्वारा तय की जाती हैं और सभी बीमा कंपनियों में समान हैं। आप TP दरों पर बातचीत नहीं कर सकते। हालांकि, कॉम्प्रिहेंसिव पॉलिसी में OD घटक के लिए अपना बीमाकर्ता चुन सकते हैं।",
      hinglish: "Third-Party premium rates IRDAI fix karta hai aur sab insurance companies mein same hoti hain. Aap TP rates pe negotiate nahi kar sakte. Lekin, comprehensive policy mein OD component ke liye apna insurer choose kar sakte hain."
    },
    tableTitle: { en: "Third-Party Premium Table", hi: "थर्ड-पार्टी प्रीमियम तालिका", hinglish: "Third-Party Premium Table" },
    thCc: { en: "Engine Capacity", hi: "इंजन क्षमता", hinglish: "Engine Capacity" },
    th1yr: { en: "1-Year TP", hi: "1-वर्ष TP", hinglish: "1-Year TP" },
    th3yr: { en: "3-Year TP", hi: "3-वर्ष TP", hinglish: "3-Year TP" },
    th5yr: { en: "5-Year TP", hi: "5-वर्ष TP", hinglish: "5-Year TP" },
    footnote: { en: "Long-term TP policies (3-year and 5-year) are available for new two-wheelers at the time of purchase. These protect you from annual rate hikes and eliminate the hassle of yearly renewal.", hi: "दीर्घकालिक TP पॉलिसियाँ (3-वर्ष और 5-वर्ष) खरीद के समय नए दो-पहिया वाहनों के लिए उपलब्ध हैं। ये आपको वार्षिक दर वृद्धि से बचाती हैं और वार्षिक नवीनीकरण की परेशानी से मुक्त करती हैं।", hinglish: "Long-term TP policies (3-year aur 5-year) new two-wheelers ke liye purchase ke time available hain. Yeh aapko annual rate hikes se bachati hain aur yearly renewal ki pareshani se mukt karti hain." },
    tipTitle: { en: "💡 Expert Tip: New bike? Buy long-term TP + Annual Comprehensive!", hi: "💡 विशेषज्ञ सुझाव: नई बाइक? दीर्घकालिक TP + वार्षिक कॉम्प्रिहेंसिव खरीदें!", hinglish: "💡 Expert Tip: Naye bike? Long-term TP + Annual Comprehensive khareedein!" },
    tipDesc: { en: "For new bikes, buy a 5-year TP policy (mandatory at the time of purchase) and a 1-year comprehensive policy that you renew annually. This gives you the flexibility to switch comprehensive insurers each year while staying compliant with the law.", hi: "नई बाइकों के लिए, 5-वर्ष की TP पॉलिसी खरीदें (खरीद के समय अनिवार्य) और 1-वर्ष की कॉम्प्रिहेंसिव पॉलिसी जो आप वार्षिक रूप से नवीनीकरण करें। इससे आपको हर साल कॉम्प्रिहेंसिव बीमाकर्ता बदलने की लचीलापन मिलती है।", hinglish: "New bikes ke liye, 5-year TP policy khareedein (purchase ke time mandatory) aur 1-year comprehensive policy jo aap annually renew karein. Isse aapko har saal comprehensive insurer switch karne ki flexibility milti hai." },
  },
  features: {
    heading: { en: "Key", hi: "मुख्य", hinglish: "Key" },
    headingHighlight: { en: "Features & Benefits", hi: "विशेषताएँ और लाभ", hinglish: "Features & Benefits" },
    headingSuffix: { en: "of Bike Insurance", hi: "बाइक बीमा के", hinglish: "of Bike Insurance" },
    desc: {
      en: "A comprehensive bike insurance policy offers much more than just accident coverage. Here are the key benefits you should look for.",
      hi: "एक कॉम्प्रिहेंसिव बाइक बीमा पॉलिसी केवल दुर्घटना कवरेज से कहीं अधिक प्रदान करती है। यहाँ मुख्य लाभ हैं जिन पर आप ध्यान दें।",
      hinglish: "Ek comprehensive bike insurance policy sirf accident coverage se kaafi zyada provide karti hai. Yahan key benefits hain jin par aap dhyan dein."
    },
    f1Title: { en: "Own Damage Cover", hi: "ओन डैमेज कवर", hinglish: "Own Damage Cover" },
    f1Desc: { en: "Covers repair costs for your bike from accidents, collisions, and self-inflicted damage. Without this (TP-only), you bear 100% of repair costs.", hinglish: "Aapki bike ke repair costs cover karta hai accidents, collisions aur self-inflicted damage se. Bina iske (TP-only), aap 100% repair costs khud dete hain.", hi: "दुर्घटनाओं, टकरावों और स्व-क्षति से आपकी बाइक की मरम्मत लागत कवर करता है। इसके बिना (केवल TP), आप 100% मरम्मत लागत वहन करते हैं।" },
    f2Title: { en: "Theft Protection", hi: "चोरी सुरक्षा", hinglish: "Theft Protection" },
    f2Desc: { en: "If your bike is stolen and not recovered, the insurer pays the IDV as settlement. Two-wheeler theft is extremely common in India — over 1 lakh bikes are stolen annually.", hi: "यदि आपकी बाइक चोरी हो जाती है और वापस नहीं मिलती, तो बीमाकर्ता IDV का भुगतान करता है। भारत में दो-पहिया चोरी बहुत आम है — सालाना 1 लाख से अधिक बाइकें चोरी होती हैं।", hinglish: "Agar aapki bike chori ho jaye aur recover na ho, toh insurer IDV pay karta hai. India mein two-wheeler theft bahut common hai — saalana 1 lakh se zyada bikes chori hoti hain." },
    f3Title: { en: "Natural Calamity Cover", hi: "प्राकृतिक आपदा कवर", hinglish: "Natural Calamity Cover" },
    f3Desc: { en: "Covers damage from floods, storms, earthquakes, landslides, and cyclones. Monsoon waterlogging alone damages thousands of bikes every year.", hi: "बाढ़, तूफ़ान, भूकंप, भूस्खलन और चक्रवात से क्षति कवर करता है। केवल मानसून जलभराव हर साल हज़ारों बाइकों को नुकसान पहुँचाता है।", hinglish: "Floods, storms, earthquakes, landslides aur cyclones se damage cover karta hai. Monsoon waterlogging alone har saal hazaron bikes ko nuksan pahunchata hai." },
    f4Title: { en: "Fire & Explosion Cover", hi: "आग और विस्फोट कवर", hinglish: "Fire & Explosion Cover" },
    f4Desc: { en: "Covers damage from fire, self-ignition, and explosion. Fuel leaks and electrical short-circuits can cause fires, especially in older bikes.", hi: "आग, स्व-प्रज्वलन और विस्फोट से क्षति कवर करता है। ईंधन रिसाव और विद्युत शॉर्ट-सर्किट आग का कारण बन सकते हैं।", hinglish: "Fire, self-ignition aur explosion se damage cover karta hai. Fuel leaks aur electrical short-circuits aag ka reason ban sakte hain." },
    f5Title: { en: "Personal Accident Cover", hi: "व्यक्तिगत दुर्घटना कवर", hinglish: "Personal Accident Cover" },
    f5Desc: { en: "Mandatory ₹15 lakh personal accident cover for owner-driver included with TP. Covers accidental death and permanent disability.", hi: "TP के साथ मालिक-चालक के लिए अनिवार्य ₹15 लाख व्यक्तिगत दुर्घटना कवर शामिल। आकस्मिक मृत्यु और स्थायी विकलांगता कवर करता है।", hinglish: "TP ke saath owner-driver ke liye mandatory ₹15 lakh personal accident cover included. Accidental death aur permanent disability cover karta hai." },
    f6Title: { en: "Cashless Claims at Garages", hi: "गैराज में कैशलेस क्लेम", hinglish: "Cashless Claims at Garages" },
    f6Desc: { en: "Get your bike repaired at network garages without paying upfront (except deductible). Acko and Digit offer 1-day cashless repairs at 2,000-6,000+ garages across India.", hi: "नेटवर्क गैराज में अपनी बाइक बिना अग्रिम भुगतान के मरम्मत करवाएँ। Acko और Digit भारत भर में 2,000-6,000+ गैराज पर 1-दिन कैशलेस मरम्मत प्रदान करते हैं।", hinglish: "Network garages mein apni bike bina upfront payment ke repair karwaein. Acko aur Digit India bhar mein 2,000-6,000+ garages pe 1-day cashless repairs provide karte hain." },
  },
  comparison: {
    heading: { en: "Compare", hi: "तुलना करें", hinglish: "Compare" },
    headingHighlight: { en: "Top Bike Insurance", hi: "शीर्ष बाइक बीमा", hinglish: "Top Bike Insurance" },
    headingSuffix: { en: "Plans in India", hi: "भारत में योजनाएँ", hinglish: "Plans in India" },
    desc: {
      en: "Premiums, claim settlement ratios, and garage networks vary across insurers. Our AI-powered comparison engine helps you find the best plan for your bike model, city, and coverage needs.",
      hi: "प्रीमियम, क्लेम निपटान अनुपात और गैराज नेटवर्क बीमाकर्ताओं में भिन्न होते हैं। हमारा AI-संचालित तुलना इंजन आपकी बाइक मॉडल, शहर और कवरेज आवश्यकताओं के लिए सर्वोत्तम योजना खोजने में मदद करता है।",
      hinglish: "Premium, claim settlement ratios aur garage networks insurers mein different hote hain. Hamaara AI-powered comparison engine aapki bike model, city aur coverage needs ke liye best plan dhoondhne mein madad karta hai."
    },
    thInsurer: { en: "Insurer", hi: "बीमाकर्ता", hinglish: "Insurer" },
    thPremium: { en: "Comprehensive From", hi: "कॉम्प्रिहेंसिव से", hinglish: "Comprehensive From" },
    thCsr: { en: "Claim Settlement", hi: "क्लेम निपटान", hinglish: "Claim Settlement" },
    thGarages: { en: "Network Garages", hi: "नेटवर्क गैराज", hinglish: "Network Garages" },
    thHighlight: { en: "Key Highlight", hi: "मुख्य विशेषता", hinglish: "Key Highlight" },
    aiPick: { en: "🤖 AI Pick", hi: "🤖 AI चयन", hinglish: "🤖 AI Pick" },
    footnote: { en: "Premiums are indicative for a 125cc bike, 1-2 years old, in a metro city. Actual premiums vary based on bike model, age, location, NCB, and add-ons.", hi: "प्रीमियम एक 125cc बाइक, 1-2 वर्ष पुरानी, मेट्रो शहर में सांकेतिक हैं। वास्तविक प्रीमियम बाइक मॉडल, आयु, स्थान, NCB और ऐड-ऑन के आधार पर भिन्न होते हैं।", hinglish: "Premiums ek 125cc bike, 1-2 saal purani, metro city mein indicative hain. Actual premiums bike model, age, location, NCB aur add-ons ke basis pe different hote hain." },
    insurer1Name: { en: "Acko General", hi: "Acko जनरल", hinglish: "Acko General" },
    insurer1Highlight: { en: "Digital-first, instant claims, 1-day cashless", hi: "डिजिटल-फर्स्ट, तत्काल क्लेम, 1-दिन कैशलेस", hinglish: "Digital-first, instant claims, 1-day cashless" },
    insurer2Name: { en: "Go Digit", hi: "Go Digit", hinglish: "Go Digit" },
    insurer2Highlight: { en: "Smartphone self-inspection, quick settlement", hi: "स्मार्टफ़ोन सेल्फ-इंस्पेक्शन, त्वरित निपटान", hinglish: "Smartphone self-inspection, quick settlement" },
    insurer3Name: { en: "Bajaj Allianz", hi: "बजाज अलियांज", hinglish: "Bajaj Allianz" },
    insurer3Highlight: { en: "6,000+ garages, wide add-on range", hi: "6,000+ गैराज, विस्तृत ऐड-ऑन श्रृंखला", hinglish: "6,000+ garages, wide add-on range" },
    insurer4Name: { en: "ICICI Lombard", hi: "ICICI लोम्बार्ड", hinglish: "ICICI Lombard" },
    insurer4Highlight: { en: "Instant policy, reliable claim process", hi: "तत्काल पॉलिसी, विश्वसनीय क्लेम प्रक्रिया", hinglish: "Instant policy, reliable claim process" },
    insurer5Name: { en: "New India Assurance", hi: "न्यू इंडिया अश्योरेंस", hinglish: "New India Assurance" },
    insurer5Highlight: { en: "Govt-backed, widest acceptance", hi: "सरकार-समर्थित, सबसे व्यापक स्वीकृति", hinglish: "Govt-backed, widest acceptance" },
  },
  premiums: {
    heading: { en: "Bike Insurance", hi: "बाइक बीमा", hinglish: "Bike Insurance" },
    headingHighlight: { en: "Premium Estimates", hi: "प्रीमियम अनुमान", hinglish: "Premium Estimates" },
    desc: {
      en: "Here are indicative annual premiums across popular bike categories. Use our AI comparison tool for exact quotes from multiple insurers.",
      hi: "लोकप्रिय बाइक श्रेणियों में सांकेतिक वार्षिक प्रीमियम यहाँ दिए गए हैं। कई बीमाकर्ताओं से सटीक कोटेशन के लिए हमारे AI तुलना टूल का उपयोग करें।",
      hinglish: "Yahan popular bike categories mein indicative annual premiums diye gaye hain. Multiple insurers se exact quotes ke liye hamaare AI comparison tool ka use karein."
    },
    thBike: { en: "Bike Category", hi: "बाइक श्रेणी", hinglish: "Bike Category" },
    thAge: { en: "Age", hi: "आयु", hinglish: "Age" },
    thTp: { en: "TP Only", hi: "केवल TP", hinglish: "TP Only" },
    thComp: { en: "Comprehensive", hi: "कॉम्प्रिहेंसिव", hinglish: "Comprehensive" },
    thZeroDep: { en: "With Zero Dep", hi: "ज़ीरो डेप के साथ", hinglish: "With Zero Dep" },
    footnote: { en: "Premiums are approximate for a metro city location. Actual rates vary by RTO, IDV, NCB, and add-on selection.", hi: "प्रीमियम मेट्रो शहर स्थान के लिए अनुमानित हैं। वास्तविक दरें RTO, IDV, NCB और ऐड-ऑन चयन के अनुसार भिन्न होती हैं।", hinglish: "Premiums metro city location ke liye approximate hain. Actual rates RTO, IDV, NCB aur add-on selection ke hisaab se different hoti hain." },
  },
  addOns: {
    heading: { en: "Bike Insurance", hi: "बाइक बीमा", hinglish: "Bike Insurance" },
    headingHighlight: { en: "Add-on Riders", hi: "ऐड-ऑन राइडर", hinglish: "Add-on Riders" },
    desc: {
      en: "Add-ons enhance your comprehensive bike insurance policy by covering risks that the standard policy excludes. Choose add-ons based on your bike age, riding conditions, and city.",
      hi: "ऐड-ऑन आपकी कॉम्प्रिहेंसिव बाइक बीमा पॉलिसी को उन जोखिमों को कवर करके बेहतर बनाते हैं जो स्टैंडर्ड पॉलिसी छोड़ती है। अपनी बाइक आयु, सवारी की स्थिति और शहर के आधार पर ऐड-ऑन चुनें।",
      hinglish: "Add-ons aapki comprehensive bike insurance policy ko enhance karte hain by covering risks jo standard policy exclude karta hai. Apni bike age, riding conditions aur city ke basis pe add-ons choose karein."
    },
    carGuideLink: { en: "Car Insurance Guide", hi: "कार बीमा गाइड", hinglish: "Car Insurance Guide" },
    approxCost: { en: "Approx. Cost:", hi: "अनुमानित लागत:", hinglish: "Approx. Cost:" },
    a1Name: { en: "Zero Depreciation", hi: "ज़ीरो डेप्रिसिएशन", hinglish: "Zero Depreciation" },
    a1Desc: { en: "No depreciation deducted on replaced parts during claims. Get full repair cost covered. For bikes up to 3 years old, this add-on can save you ₹3,000-₹8,000 on a single claim.", hi: "क्लेम के दौरान बदले गए पुर्जों पर कोई ह्रास नहीं काटा जाता। पूरी मरम्मत लागत कवर। 3 वर्ष तक की बाइकों के लिए, यह ऐड-ऑन एक ही क्लेम पर ₹3,000-₹8,000 बचा सकता है।", hinglish: "Claim ke dauraan replaced parts pe koi depreciation nahi kaata jaata. Full repair cost covered. 3 saal tak ki bikes ke liye, yeh add-on ek hi claim pe ₹3,000-₹8,000 bacha sakta hai." },
    a2Name: { en: "Engine Protect", hi: "इंजन प्रोटेक्ट", hinglish: "Engine Protect" },
    a2Desc: { en: "Covers engine damage from waterlogging, hydrostatic lock, coolant leakage, and gear box damage. Critical for riders in monsoon-prone cities.", hi: "जलभराव, हाइड्रोस्टैटिक लॉक, कूलेंट रिसाव और गियरबॉक्स क्षति से इंजन डैमेज कवर करता है। मानसून वाले शहरों में अत्यंत ज़रूरी।", hinglish: "Waterlogging, hydrostatic lock, coolant leakage aur gear box damage se engine damage cover karta hai. Monsoon-prone cities mein critical." },
    a3Name: { en: "Roadside Assistance (RSA)", hi: "रोडसाइड असिस्टेंस (RSA)", hinglish: "Roadside Assistance (RSA)" },
    a3Desc: { en: "24/7 emergency support including towing, flat tyre repair, fuel delivery, battery jumpstart, and locksmith services. Essential for highway riders and long-distance touring.", hi: "24/7 आपातकालीन सहायता जिसमें टोइंग, फ्लैट टायर मरम्मत, ईंधन वितरण, बैटरी जंपस्टार्ट और लॉकस्मिथ सेवाएँ शामिल हैं। हाईवे सवारों के लिए ज़रूरी।", hinglish: "24/7 emergency support including towing, flat tyre repair, fuel delivery, battery jumpstart aur locksmith services. Highway riders ke liye zaroori." },
    a4Name: { en: "Return to Invoice (RTI)", hi: "रिटर्न टू इनवॉइस (RTI)", hinglish: "Return to Invoice (RTI)" },
    a4Desc: { en: "If your bike is stolen or declared a total loss, get the full invoice value instead of just the IDV. Must-have for new and expensive bikes.", hi: "यदि आपकी बाइक चोरी हो जाती है या पूर्ण हानि घोषित होती है, तो केवल IDV के बजाय पूर्ण इनवॉइस मूल्य प्राप्त करें। नई और महंगी बाइकों के लिए ज़रूरी।", hinglish: "Agar aapki bike chori ho jaye ya total loss declare ho, toh sirf IDV ki jagah full invoice value paayein. Nayi aur mehengi bikes ke liye must-have." },
    a5Name: { en: "Pillion Rider Cover", hi: "पिलियन राइडर कवर", hinglish: "Pillion Rider Cover" },
    a5Desc: { en: "Provides personal accident cover for the pillion (passenger) rider. Standard policy only covers the owner-driver. Essential if you regularly ride with family or friends.", hi: "पिलियन (यात्री) सवार के लिए व्यक्तिगत दुर्घटना कवर प्रदान करता है। स्टैंडर्ड पॉलिसी केवल मालिक-चालक को कवर करती है। परिवार या दोस्तों के साथ नियमित राइड करने वालों के लिए ज़रूरी।", hinglish: "Pillion (passenger) rider ke liye personal accident cover provide karta hai. Standard policy sirf owner-driver ko cover karti hai. Family ya dost ke saath regular ride karne wale ke liye zaroori." },
    a6Name: { en: "Consumables Cover", hi: "कंस्यूमेबल्स कवर", hinglish: "Consumables Cover" },
    a6Desc: { en: "Pays for consumable items used during repairs — engine oil, coolant, brake fluid, nuts, bolts, washers, and grease. For a small premium, ensures you pay nothing out of pocket during cashless repairs.", hi: "मरम्मत के दौरान उपयोग की गई कंस्यूमेबल वस्तुओं — इंजन ऑयल, कूलेंट, ब्रेक फ्लूइड, नट, बोल्ट, वॉशर और ग्रीस का भुगतान करता है। थोड़े प्रीमियम में, कैशलेस मरम्मत के दौरान आपको कुछ भी जेब से नहीं देना पड़ता।", hinglish: "Repair ke dauraan use hue consumable items — engine oil, coolant, brake fluid, nuts, bolts, washers aur grease ka payment karta hai. Chhote premium mein, cashless repairs ke dauraan aapko kuch bhi jeb se nahi dena padta." },
  },
  faq: {
    heading: { en: "Bike Insurance", hi: "बाइक बीमा", hinglish: "Bike Insurance" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: { en: "Frequently asked questions about two-wheeler insurance in India. Still have questions? Chat with our AI advisor or talk to Himanshu on WhatsApp.", hi: "भारत में दो-पहिया बीमे के बारे में अक्सर पूछे जाने वाले सवाल। अभी भी सवाल हैं? हमारे AI सलाहकार से चैट करें या हिमांशु से WhatsApp पर बात करें।", hinglish: "India mein two-wheeler insurance ke baare mein often pooche jaane wale sawaal. Abhi bhi sawaal hain? Hamaare AI advisor se chat karein ya Himanshu se WhatsApp pe baat karein." },
  },
  cta: {
    heading: { en: "Compare Bike Insurance &", hi: "बाइक बीमा की तुलना करें और", hinglish: "Bike Insurance Compare Karein &" },
    headingHighlight: { en: "Save Up to 50%", hi: "50% तक बचत करें", hinglish: "50% Tak Save Karein" },
    desc: { en: "Don't ride uninsured. Compare two-wheeler insurance from 5+ insurers, choose the best plan with add-ons, and ride with confidence. Comprehensive coverage from just ₹799/year.", hi: "बिना बीमा के सवारी मत करें। 5+ बीमाकर्ताओं से दो-पहिया बीमा की तुलना करें, ऐड-ऑन के साथ सर्वोत्तम योजना चुनें। कॉम्प्रिहेंसिव कवरेज केवल ₹799/वर्ष से।", hinglish: "Bina insurance ke ride mat karein. 5+ insurers se two-wheeler insurance compare karein, add-ons ke saath best plan choose karein. Comprehensive coverage sirf ₹799/year se." },
    ctaCompare: { en: "Compare & Buy Now", hi: "तुलना करें और अभी खरीदें", hinglish: "Compare & Buy Now" },
    ctaWhatsApp: { en: "💬 Talk to Himanshu on WhatsApp", hi: "💬 हिमांशु से WhatsApp पर बात करें", hinglish: "💬 Himanshu se WhatsApp pe Baat Karein" },
    byline: { en: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834", hi: "हिमांशु पालीवाल द्वारा — IRDAI प्रमाणित बीमा सलाहकार · POSP कोड: IP429834", hinglish: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834" },
  },
};

// ── FAQ data (English only for JSON-LD, translated for display) ────────────
const faqs = [
  {
    q: { en: "Is bike insurance mandatory in India?", hi: "क्या भारत में बाइक बीमा अनिवार्य है?", hinglish: "Kya India mein bike insurance mandatory hai?" },
    a: { en: "Yes! Under the Motor Vehicles Act, 1988, at least Third-Party (TP) insurance is mandatory for all two-wheelers plying on Indian roads. Riding without valid insurance can result in a fine of ₹2,000 for the first offence and ₹4,000 for repeat offences, along with imprisonment of up to 3 months. Your vehicle can also be impounded. Despite this, approximately 75% of two-wheelers in India are uninsured or have expired policies. Always ensure your bike insurance is active — renew before the expiry date to avoid penalties and maintain continuous coverage.", hi: "हाँ! मोटर वाहन अधिनियम, 1988 के तहत, भारतीय सड़कों पर चलने वाले सभी दो-पहिया वाहनों के लिए कम से कम थर्ड-पार्टी (TP) बीमा अनिवार्य है। बिना वैध बीमा के गाड़ी चलाने पर पहली बार ₹2,000 और दोहराने पर ₹4,000 का जुर्माना हो सकता है, साथ ही 3 महीने तक की कैद भी हो सकती है। लगभग 75% दो-पहिया वाहन अबीमित हैं। हमेशा अपना बाइक बीमा सक्रिय रखें।", hinglish: "Haan! Motor Vehicles Act 1988 ke tahat, India ki sadkon pe chalne wale sabhi two-wheelers ke liye kam se kam Third-Party (TP) insurance mandatory hai. Bina valid insurance ke riding karne pe first offence pe ₹2,000 aur repeat pe ₹4,000 ka fine ho sakta hai, saath hi 3 mahine tak ki jail bhi ho sakti hai. Lagbhag 75% two-wheelers uninsured hain. Hamesha apna bike insurance active rakhein." },
  },
  {
    q: { en: "What is the difference between Third-Party and Comprehensive bike insurance?", hi: "थर्ड-पार्टी और कॉम्प्रिहेंसिव बाइक बीमे में क्या अंतर है?", hinglish: "Third-Party aur Comprehensive bike insurance mein kya farq hai?" },
    a: { en: "Third-Party (TP) insurance covers only the damage caused by your bike to a third person, their vehicle, or property. It is mandatory by law but does not cover any damage to your own bike. Comprehensive insurance covers both third-party liability and own damage (OD) to your bike from accidents, theft, fire, natural calamities, and vandalism. TP is cheaper but offers limited protection. Comprehensive gives you complete coverage plus the option to add valuable riders like zero depreciation and engine protect. For bikes less than 5 years old, comprehensive insurance is strongly recommended.", hi: "थर्ड-पार्टी (TP) बीमा केवल आपकी बाइक द्वारा किसी तीसरे व्यक्ति, उनके वाहन या संपत्ति को हुई क्षति कवर करता है। यह कानून द्वारा अनिवार्य है लेकिन आपकी अपनी बाइक की कोई क्षति कवर नहीं करता। कॉम्प्रिहेंसिव बीमा थर्ड-पार्टी देयता और ओन डैमेज (OD) दोनों कवर करता है। 5 वर्ष से कम आयु की बाइकों के लिए कॉम्प्रिहेंसिव बीमा दृढ़ता से अनुशंसित है।", hinglish: "Third-Party (TP) insurance sirf aapki bike dwara kisi teesre vyakti, unke vehicle ya property ko hui damage cover karta hai. Yeh law ke hisaab se mandatory hai lekin aapki apni bike ki koi damage cover nahi karta. Comprehensive insurance third-party liability aur own damage (OD) dono cover karta hai. 5 saal se kam age ki bikes ke liye comprehensive insurance strongly recommended hai." },
  },
  {
    q: { en: "What are the IRDAI Third-Party rates for bike insurance in 2024-25?", hi: "2024-25 में बाइक बीमे के लिए IRDAI थर्ड-पार्टी दरें क्या हैं?", hinglish: "2024-25 mein bike insurance ke liye IRDAI Third-Party rates kya hain?" },
    a: { en: "IRDAI fixes Third-Party premium rates annually — they are the same across all insurers. For 2024-25, the rates are: (1) Two-wheelers up to 75cc — ₹538 per year. (2) Two-wheelers 75cc to 150cc — ₹714 per year. (3) Two-wheelers 150cc to 350cc — ₹1,366 per year. (4) Two-wheelers above 350cc — ₹2,023 per year. These rates include personal accident cover of ₹15 lakh for the owner-driver. Long-term TP policies (3 years and 5 years) are also available at discounted rates for new bikes.", hi: "IRDAI थर्ड-पार्टी प्रीमियम दरें वार्षिक रूप से तय करता है — ये सभी बीमाकर्ताओं में समान हैं। 2024-25 के लिए दरें हैं: (1) 75cc तक — ₹538 प्रति वर्ष। (2) 75cc से 150cc — ₹714 प्रति वर्ष। (3) 150cc से 350cc — ₹1,366 प्रति वर्ष। (4) 350cc से अधिक — ₹2,023 प्रति वर्ष। इन दरों में मालिक-चालक के लिए ₹15 लाख का व्यक्तिगत दुर्घटना कवर शामिल है।", hinglish: "IRDAI Third-Party premium rates annually fix karta hai — yeh sab insurers mein same hain. 2024-25 ke liye rates hain: (1) 75cc tak — ₹538 per year. (2) 75cc se 150cc — ₹714 per year. (3) 150cc se 350cc — ₹1,366 per year. (4) 350cc se zyada — ₹2,023 per year. In rates mein owner-driver ke liye ₹15 lakh ka personal accident cover included hai." },
  },
  {
    q: { en: "How much does comprehensive bike insurance cost?", hi: "कॉम्प्रिहेंसिव बाइक बीमे की लागत कितनी होती है?", hinglish: "Comprehensive bike insurance ki cost kitni hoti hai?" },
    a: { en: "Comprehensive bike insurance premiums start from ₹799 per year for a basic commuter bike (100-125cc). The premium depends on: (1) Bike make, model, and engine capacity — higher CC means higher premium. (2) Age of the bike — older bikes have lower IDV and hence lower OD premium. (3) IDV (Insured Declared Value) — higher IDV means higher premium but better claim payout. (4) NCB (No Claim Bonus) — up to 50% discount on OD premium for claim-free years. (5) Location — metro cities and high-traffic zones have higher premiums. (6) Add-ons selected — zero dep, engine protect, etc. increase the premium. A 150cc bike (1-2 years old) typically costs ₹1,500-₹3,000/year for comprehensive cover with zero dep.", hi: "कॉम्प्रिहेंसिव बाइक बीमा प्रीमियम एक बुनियादी कम्यूटर बाइक (100-125cc) के लिए ₹799 प्रति वर्ष से शुरू होता है। प्रीमियम बाइक बनावट, मॉडल, इंजन क्षमता, आयु, IDV, NCB, स्थान और ऐड-ऑन पर निर्भर करता है। एक 150cc बाइक (1-2 वर्ष पुरानी) आमतौर पर ज़ीरो डेप के साथ ₹1,500-₹3,000/वर्ष की लागत होती है।", hinglish: "Comprehensive bike insurance premiums ₹799 per year se shuru hota hai basic commuter bike (100-125cc) ke liye. Premium bike make, model, engine capacity, age, IDV, NCB, location aur add-ons pe depend karta hai. Ek 150cc bike (1-2 saal purani) typically ₹1,500-₹3,000/year cost karti hai comprehensive cover with zero dep ke saath." },
  },
  {
    q: { en: "What is IDV in bike insurance and how is it calculated?", hi: "बाइक बीमे में IDV क्या है और यह कैसे गणना किया जाता है?", hinglish: "Bike insurance mein IDV kya hai aur kaise calculate hota hai?" },
    a: { en: "IDV (Insured Declared Value) is the current market value of your bike — the maximum amount your insurer will pay if the bike is stolen or declared a total loss. It is calculated as: IDV = Manufacturer's Ex-Showroom Price minus Depreciation based on bike age. For new bikes, IDV is up to 95% of ex-showroom price. Depreciation schedule: 6 months-1 year (15%), 1-2 years (20%), 2-3 years (30%), 3-4 years (40%), 4-5 years (50%). Beyond 5 years, IDV is mutually agreed between you and the insurer. Always set IDV close to actual market value — under-insuring means smaller claim payouts.", hi: "IDV (बीमित घोषित मूल्य) आपकी बाइक का वर्तमान बाज़ार मूल्य है — अधिकतम राशि जो बीमाकर्ता चोरी या पूर्ण हानि पर देगा। गणना: IDV = निर्माता का एक्स-शोरूम मूल्य घटा ह्रास। नई बाइकों के लिए IDV एक्स-शोरूम मूल्य का 95% तक होता है। ह्रास अनुसूची: 6 महीने-1 वर्ष (15%), 1-2 वर्ष (20%), 2-3 वर्ष (30%), 3-4 वर्ष (40%), 4-5 वर्ष (50%)।", hinglish: "IDV (Insured Declared Value) aapki bike ka current market value hai — maximum amount jo insurer dega agar bike chori ho jaye ya total loss declare ho. Calculation: IDV = Manufacturer's Ex-Showroom Price minus Depreciation. New bikes ke liye IDV ex-showroom price ka 95% tak hota hai." },
  },
  {
    q: { en: "Does bike insurance cover pillion riders?", hi: "क्या बाइक बीमा पिलियन राइडर को कवर करता है?", hinglish: "Kya bike insurance pillion rider ko cover karta hai?" },
    a: { en: "Standard bike insurance includes mandatory personal accident cover of ₹15 lakh for the owner-driver only. Pillion riders (passengers) are NOT covered by default. To protect pillion riders, you must buy a Personal Accident cover for unnamed passengers as an add-on. This provides coverage of ₹1-15 lakh for accidental death or disability of the pillion rider. The add-on costs just ₹50-300 per year depending on the coverage amount. This is especially important if you regularly ride with family members or friends. Some comprehensive policies from ICICI Lombard and Bajaj Allianz bundle pillion rider cover.", hi: "स्टैंडर्ड बाइक बीमे में केवल मालिक-चालक के लिए अनिवार्य ₹15 लाख व्यक्तिगत दुर्घटना कवर शामिल है। पिलियन राइडर (यात्री) डिफ़ॉल्ट रूप से कवर नहीं हैं। पिलियन राइडर को सुरक्षित करने के लिए, आपको एक ऐड-ऑन के रूप में अनामित यात्रियों के लिए PA कवर खरीदना होगा। यह ऐड-ऑन केवल ₹50-300 प्रति वर्ष में उपलब्ध है।", hinglish: "Standard bike insurance mein sirf owner-driver ke liye mandatory ₹15 lakh personal accident cover included hai. Pillion riders (passengers) default mein covered NAHI hain. Pillion riders ko protect karne ke liye, aapko ek add-on ke roop mein unnamed passengers ke liye PA cover khareedna hoga. Yeh add-on sirf ₹50-300 per year mein available hai." },
  },
  {
    q: { en: "Can I ride my bike during the insurance claim process?", hi: "क्या मैं बीमा क्लेम प्रक्रिया के दौरान अपनी बाइक चला सकता हूँ?", hinglish: "Kya main insurance claim process ke dauraan apni bike chala sakta hoon?" },
    a: { en: "No. If your bike is damaged in an accident and you are filing an own damage claim, you should not ride the bike until the surveyor has inspected it and the insurer has approved repairs. Riding a damaged bike can worsen the damage and may lead to claim rejection. After the surveyor inspection, you can take the bike to a network garage for cashless repairs or to any garage for reimbursement claims. For minor scratches or dents where the bike is roadworthy, you can continue riding but must still get the damage documented by the surveyor before repairs. Check our Claim Guide for detailed steps.", hi: "नहीं। यदि आपकी बाइक दुर्घटना में क्षतिग्रस्त हो गई है और आप ओन डैमेज क्लेम दाखिल कर रहे हैं, तो आपको सर्वेयर के निरीक्षण और बीमाकर्ता की मरम्मत स्वीकृति तक बाइक नहीं चलानी चाहिए। क्षतिग्रस्त बाइक चलाने से क्षति और बढ़ सकती है और क्लेम अस्वीकृत हो सकता है।", hinglish: "Nahi. Agar aapki bike accident mein damaged ho gayi hai aur aap own damage claim file kar rahe hain, toh aapko surveyor ke inspection aur insurer ki repair approval tak bike nahi chalani chahiye. Damaged bike chalane se damage aur badh sakta hai aur claim reject ho sakta hai." },
  },
];

const comparisonPlans = [
  { nameKey: "insurer1Name", premium: "From ₹799/yr", claimSettlement: "95%", highlightKey: "insurer1Highlight", networkGarages: "2,000+", aiPick: true },
  { nameKey: "insurer2Name", premium: "From ₹849/yr", claimSettlement: "93%", highlightKey: "insurer2Highlight", networkGarages: "3,000+" },
  { nameKey: "insurer3Name", premium: "From ₹999/yr", claimSettlement: "92%", highlightKey: "insurer3Highlight", networkGarages: "6,000+" },
  { nameKey: "insurer4Name", premium: "From ₹1,099/yr", claimSettlement: "91%", highlightKey: "insurer4Highlight", networkGarages: "5,000+" },
  { nameKey: "insurer5Name", premium: "From ₹899/yr", claimSettlement: "87%", highlightKey: "insurer5Highlight", networkGarages: "4,500+" },
];

const tpRates = [
  { cc: "Up to 75cc", annual: "₹538", threeYear: "₹1,541", fiveYear: "₹2,547" },
  { cc: "75cc to 150cc", annual: "₹714", threeYear: "₹2,046", fiveYear: "₹3,381" },
  { cc: "150cc to 350cc", annual: "₹1,366", threeYear: "₹3,916", fiveYear: "₹6,471" },
  { cc: "Above 350cc", annual: "₹2,023", threeYear: "₹5,799", fiveYear: "₹9,586" },
];

const premiumEstimates = [
  { bike: "100cc Commuter (e.g., Hero Splendor)", age: "New", tp: "₹538/yr", comprehensive: "₹799 – ₹1,200/yr", withZeroDep: "₹1,000 – ₹1,500/yr" },
  { bike: "125cc Commuter (e.g., Honda Shine)", age: "New", tp: "₹714/yr", comprehensive: "₹1,000 – ₹1,800/yr", withZeroDep: "₹1,300 – ₹2,200/yr" },
  { bike: "150cc Sports (e.g., Pulsar 150)", age: "1-2 yrs", tp: "₹1,366/yr", comprehensive: "₹1,800 – ₹3,000/yr", withZeroDep: "₹2,200 – ₹3,800/yr" },
  { bike: "200cc+ Premium (e.g., Duke 200)", age: "1-2 yrs", tp: "₹1,366/yr", comprehensive: "₹2,500 – ₹4,500/yr", withZeroDep: "₹3,200 – ₹5,500/yr" },
  { bike: "350cc Cruiser (e.g., RE Classic)", age: "New", tp: "₹1,366/yr", comprehensive: "₹3,000 – ₹5,500/yr", withZeroDep: "₹3,800 – ₹6,800/yr" },
  { bike: "Above 350cc (e.g., RE Himalayan 450)", age: "New", tp: "₹2,023/yr", comprehensive: "₹4,000 – ₹7,000/yr", withZeroDep: "₹5,000 – ₹8,500/yr" },
];

const addOnsData = [
  { nameKey: "a1Name" as const, descKey: "a1Desc" as const, cost: "15-20% of OD premium" },
  { nameKey: "a2Name" as const, descKey: "a2Desc" as const, cost: "₹200 – ₹600/year" },
  { nameKey: "a3Name" as const, descKey: "a3Desc" as const, cost: "₹100 – ₹300/year" },
  { nameKey: "a4Name" as const, descKey: "a4Desc" as const, cost: "₹200 – ₹500/year" },
  { nameKey: "a5Name" as const, descKey: "a5Desc" as const, cost: "₹50 – ₹300/year" },
  { nameKey: "a6Name" as const, descKey: "a6Desc" as const, cost: "₹100 – ₹300/year" },
];

// ── Client Component ────────────────────────────────────────────────────────
export default function BikeInsuranceClientContent() {
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BREADCRUMB */}
      <nav className="max-w-7xl mx-auto px-4 pt-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {pt(pageText.breadcrumb.home, language)}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">{pt(pageText.breadcrumb.current, language)}</li>
        </ol>
      </nav>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{pt(pageText.hero.badge, language)}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {pt(pageText.hero.title1, language)}{' '}
            <span className="gradient-text">{pt(pageText.hero.title2, language)}</span>{' '}
            {pt(pageText.hero.titleSuffix, language)}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {pt(pageText.hero.desc, language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/#reverse-audit">
              <ShinyButton variant="blue">
                <span>{pt(pageText.hero.ctaCompare, language)}</span>
              </ShinyButton>
            </a>
            <a href="https://wa.me/919257877312?text=Hi%2C%20I%20need%20help%20with%20bike%20insurance" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.hero.ctaWhatsApp, language)}</span>
              </ShinyButton>
            </a>
          </div>
          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            {[
              { text: pageText.hero.trustBadge1, icon: "✓" },
              { text: pageText.hero.trustBadge2, icon: "✓" },
              { text: pageText.hero.trustBadge3, icon: "✓" },
              { text: pageText.hero.trustBadge4, icon: "✓" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-primary font-bold">{b.icon}</span>
                <span>{pt(b.text, language)}</span>
              </div>
            ))}
          </div>
          {/* Key Stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: pageText.hero.stat1Val, label: pageText.hero.stat1Label },
              { value: pageText.hero.stat2Val, label: pageText.hero.stat2Label },
              { value: pageText.hero.stat3Val, label: pageText.hero.stat3Label },
              { value: pageText.hero.stat4Val, label: pageText.hero.stat4Label },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{pt(stat.value, language)}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{pt(stat.label, language)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* ===================== WHAT IS BIKE INSURANCE ===================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            {pt(pageText.whatIs.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.whatIs.headingHighlight, language)}</span>?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(pageText.whatIs.desc1, language)}</p>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">
            {pt(pageText.whatIs.desc2, language)}{' '}
            <Link href="/car-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {pt(pageText.whatIs.carLink, language)}
            </Link>{' '}
            {language === 'hi' ? 'गाइड और' : language === 'hinglish' ? 'guide aur' : 'guide and'}{' '}
            <Link href="/health-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {pt(pageText.whatIs.healthLink, language)}
            </Link>{' '}
            {language === 'hi' ? 'पूर्ण सुरक्षा के लिए।' : language === 'hinglish' ? 'complete protection ke liye.' : 'for complete protection.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Third-Party */}
            <div className="glass-card p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{pt(pageText.whatIs.tpTitle, language)}</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[pageText.whatIs.tp1, pageText.whatIs.tp2, pageText.whatIs.tp3, pageText.whatIs.tp4, pageText.whatIs.tp5].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{pt(item, language)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg px-3 py-2">
                {pt(pageText.whatIs.tpNote, language)}
              </p>
            </div>
            {/* Comprehensive */}
            <div className="glass-card p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{pt(pageText.whatIs.compTitle, language)}</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[pageText.whatIs.comp1, pageText.whatIs.comp2, pageText.whatIs.comp3, pageText.whatIs.comp4, pageText.whatIs.comp5].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{pt(item, language)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs bg-primary/10 text-primary rounded-lg px-3 py-2">
                {pt(pageText.whatIs.compNote, language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* ===================== IRDAI TP RATES ===================== */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(pageText.tpRates.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.tpRates.headingHighlight, language)}</span>{' '}
            {pt(pageText.tpRates.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(pageText.tpRates.desc, language)}</p>
          <div className="glass-card p-6 max-w-3xl hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4">{pt(pageText.tpRates.tableTitle, language)}</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">{pt(pageText.tpRates.thCc, language)}</th>
                    <th className="text-center py-3 px-4 font-semibold">{pt(pageText.tpRates.th1yr, language)}</th>
                    <th className="text-center py-3 px-4 font-semibold">{pt(pageText.tpRates.th3yr, language)}</th>
                    <th className="text-center py-3 px-4 font-semibold">{pt(pageText.tpRates.th5yr, language)}</th>
                  </tr>
                </thead>
                <tbody>
                  {tpRates.map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{row.cc}</td>
                      <td className="py-3 px-4 text-center gradient-text font-bold">{row.annual}</td>
                      <td className="py-3 px-4 text-center font-medium">{row.threeYear}</td>
                      <td className="py-3 px-4 text-center font-medium">{row.fiveYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{pt(pageText.tpRates.footnote, language)}</p>
          </div>
          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 max-w-3xl">
            <p className="text-sm font-medium text-primary mb-1">{pt(pageText.tpRates.tipTitle, language)}</p>
            <p className="text-xs text-muted-foreground">{pt(pageText.tpRates.tipDesc, language)}</p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* ===================== KEY FEATURES & BENEFITS ===================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(pageText.features.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.features.headingHighlight, language)}</span>{' '}
            {pt(pageText.features.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-4xl">{pt(pageText.features.desc, language)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { titleKey: "f1Title" as const, descKey: "f1Desc" as const, icon: "🔧" },
              { titleKey: "f2Title" as const, descKey: "f2Desc" as const, icon: "🔐" },
              { titleKey: "f3Title" as const, descKey: "f3Desc" as const, icon: "🌧️" },
              { titleKey: "f4Title" as const, descKey: "f4Desc" as const, icon: "🔥" },
              { titleKey: "f5Title" as const, descKey: "f5Desc" as const, icon: "🏥" },
              { titleKey: "f6Title" as const, descKey: "f6Desc" as const, icon: "🛠️" },
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{pt(pageText.features[feature.titleKey], language)}</h3>
                <p className="text-sm text-muted-foreground">{pt(pageText.features[feature.descKey], language)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* ===================== COMPARISON TABLE ===================== */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(pageText.comparison.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.comparison.headingHighlight, language)}</span>{' '}
            {pt(pageText.comparison.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(pageText.comparison.desc, language)}</p>
          <div className="glass-card p-6 overflow-x-auto hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">{pt(pageText.comparison.thInsurer, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(pageText.comparison.thPremium, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(pageText.comparison.thCsr, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(pageText.comparison.thGarages, language)}</th>
                  <th className="text-left py-3 px-4 font-semibold">{pt(pageText.comparison.thHighlight, language)}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonPlans.map((plan, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 font-medium">
                      {pt(pageText.comparison[plan.nameKey as keyof typeof pageText.comparison] as TEntry, language)}
                      {plan.aiPick && (
                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                          {pt(pageText.comparison.aiPick, language)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center gradient-text font-semibold">{plan.premium}</td>
                    <td className="py-3 px-4 text-center">{plan.claimSettlement}</td>
                    <td className="py-3 px-4 text-center">{plan.networkGarages}</td>
                    <td className="py-3 px-4 text-primary text-xs">
                      {pt(pageText.comparison[plan.highlightKey as keyof typeof pageText.comparison] as TEntry, language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-4">{pt(pageText.comparison.footnote, language)}</p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* ===================== PREMIUM ESTIMATES ===================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(pageText.premiums.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.premiums.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(pageText.premiums.desc, language)}</p>
          <div className="glass-card p-6 overflow-x-auto hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <table className="w-full min-w-[800px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">{pt(pageText.premiums.thBike, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(pageText.premiums.thAge, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(pageText.premiums.thTp, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(pageText.premiums.thComp, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(pageText.premiums.thZeroDep, language)}</th>
                </tr>
              </thead>
              <tbody>
                {premiumEstimates.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{row.bike}</td>
                    <td className="py-3 px-4 text-center">{row.age}</td>
                    <td className="py-3 px-4 text-center">{row.tp}</td>
                    <td className="py-3 px-4 text-center gradient-text font-semibold">{row.comprehensive}</td>
                    <td className="py-3 px-4 text-center font-bold text-primary">{row.withZeroDep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-4">{pt(pageText.premiums.footnote, language)}</p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* ===================== ADD-ON RIDERS ===================== */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(pageText.addOns.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.addOns.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-4xl">
            {pt(pageText.addOns.desc, language)}{' '}
            <Link href="/car-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {pt(pageText.addOns.carGuideLink, language)}
            </Link>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOnsData.map((addon, idx) => (
              <div key={idx} className="glass-card p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold mb-2">{pt(pageText.addOns[addon.nameKey], language)}</h3>
                <p className="text-sm text-muted-foreground mb-3">{pt(pageText.addOns[addon.descKey], language)}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{pt(pageText.addOns.approxCost, language)}</span>
                  <span className="font-semibold gradient-text">{addon.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* ===================== FAQ SECTION ===================== */}
      <section className="py-16 md:py-24" id="faq">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {pt(pageText.faq.heading, language)}{' '}
              <span className="gradient-text">{pt(pageText.faq.headingHighlight, language)}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{pt(pageText.faq.desc, language)}</p>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
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

      {/* ===================== CTA SECTION ===================== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(pageText.cta.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.cta.headingHighlight, language)}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(pageText.cta.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/#reverse-audit">
              <ShinyButton variant="blue">
                <span>{pt(pageText.cta.ctaCompare, language)}</span>
              </ShinyButton>
            </a>
            <a href="https://wa.me/919257877312?text=Hi%2C%20I%20want%20to%20buy%20bike%20insurance" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary">
                <span>{pt(pageText.cta.ctaWhatsApp, language)}</span>
              </ShinyButton>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/health-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {language === 'hi' ? 'हेल्थ इंश्योरेंस →' : language === 'hinglish' ? 'Health Insurance →' : 'Health Insurance →'}
            </Link>
            <Link href="/car-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {language === 'hi' ? 'कार बीमा →' : language === 'hinglish' ? 'Car Insurance →' : 'Car Insurance →'}
            </Link>
            <Link href="/life-insurance" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {language === 'hi' ? 'लाइफ इंश्योरेंस →' : language === 'hinglish' ? 'Life Insurance →' : 'Life Insurance →'}
            </Link>
            <Link href="/claim-guide" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {language === 'hi' ? 'क्लेम गाइड →' : language === 'hinglish' ? 'Claim Guide →' : 'Claim Guide →'}
            </Link>
            <Link href="/insurance-faq" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              {language === 'hi' ? 'बीमा सवाल-जवाब →' : language === 'hinglish' ? 'Insurance FAQ →' : 'Insurance FAQ →'}
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{pt(pageText.cta.byline, language)}</p>
        </div>
      </section>
    </>
  );
}
