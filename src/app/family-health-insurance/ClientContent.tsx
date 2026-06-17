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
    badge: { en: "Best Floater Plans 2026", hi: "सर्वोत्तम फ्लोटर योजनाएँ 2026", hinglish: "Best Floater Plans 2026" },
    title1: { en: "Family Health Insurance Guide –", hi: "परिवार हेल्थ इंश्योरेंस गाइड –", hinglish: "Family Health Insurance Guide –" },
    title2: { en: "Best Floater Plans 2026", hi: "सर्वोत्तम फ्लोटर योजनाएँ 2026", hinglish: "Best Floater Plans 2026" },
    desc: {
      en: "Protect your entire family under one comprehensive health insurance plan. Compare the best family floater plans, understand floater vs individual coverage, and get premium estimates for every budget.",
      hi: "एक व्यापक हेल्थ इंश्योरेंस योजना के तहत अपने पूरे परिवार को सुरक्षित करें। सर्वोत्तम फ़ैमिली फ्लोटर योजनाओं की तुलना करें, फ्लोटर बनाम व्यक्तिगत कवरेज समझें, और हर बजट के लिए प्रीमियम अनुमान प्राप्त करें।",
      hinglish: "Apne poore family ko ek comprehensive health insurance plan ke tahat protect karein. Best family floater plans compare karein, floater vs individual coverage samjhiye, aur har budget ke liye premium estimates paayein."
    },
    ctaWhatsApp: { en: "Get Family Plan Recommendation", hi: "परिवार योजना सिफारिश प्राप्त करें", hinglish: "Family Plan Recommendation Lo" },
    ctaAudit: { en: "AI Audit My Policy", hi: "AI मेरी पॉलिसी ऑडिट करे", hinglish: "AI Audit My Policy" },
    trustBadge1: { en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" },
    trustBadge2: { en: "500+ Families", hi: "500+ परिवार", hinglish: "500+ Families" },
    trustBadge3: { en: "Free Consultation", hi: "मुफ़्त परामर्श", hinglish: "Free Consultation" },
  },
  floaterVsInd: {
    heading: { en: "Family Floater vs", hi: "फ़ैमिली फ्लोटर बनाम", hinglish: "Family Floater vs" },
    headingHighlight: { en: "Individual Plans", hi: "व्यक्तिगत योजनाएँ", hinglish: "Individual Plans" },
    desc: {
      en: "Understanding the fundamental difference between floater and individual plans is the first step to making the right choice for your family. Here is a detailed comparison:",
      hi: "फ्लोटर और व्यक्तिगत योजनाओं के बीच मौलिक अंतर को समझना आपके परिवार के लिए सही विकल्प चुनने का पहला कदम है। यहाँ विस्तृत तुलना है:",
      hinglish: "Floater aur individual plans ke beech fundamental difference ko samajhna aapke family ke liye sahi choice karne ka pehla kadam hai. Yahan detailed comparison hai:"
    },
    thFeature: { en: "Feature", hi: "विशेषता", hinglish: "Feature" },
    thFloater: { en: "Family Floater", hi: "फ़ैमिली फ्लोटर", hinglish: "Family Floater" },
    thIndividual: { en: "Individual Plan", hi: "व्यक्तिगत योजना", hinglish: "Individual Plan" },
    r1Feature: { en: "Sum Insured", hi: "बीमित राशि", hinglish: "Sum Insured" },
    r2Feature: { en: "Premium Cost", hi: "प्रीमियम लागत", hinglish: "Premium Cost" },
    r3Feature: { en: "Claim Impact", hi: "क्लेम प्रभाव", hinglish: "Claim Impact" },
    r4Feature: { en: "Best For", hi: "सर्वोत्तम के लिए", hinglish: "Best For" },
    r5Feature: { en: "Flexibility", hi: "लचीलापन", hinglish: "Flexibility" },
    r6Feature: { en: "Senior Citizens", hi: "सीनियर सिटीज़न", hinglish: "Senior Citizens" },
    r7Feature: { en: "Tax Benefit (80D)", hi: "कर लाभ (80D)", hinglish: "Tax Benefit (80D)" },
    r8Feature: { en: "Premium (2A+2C, ₹10L)", hi: "प्रीमियम (2A+2C, ₹10L)", hinglish: "Premium (2A+2C, ₹10L)" },
    r9Feature: { en: "Risk Distribution", hi: "जोखिम वितरण", hinglish: "Risk Distribution" },
    r1Float: { en: "Shared by all members", hi: "सभी सदस्यों द्वारा साझा", hinglish: "Sab members dwara shared" },
    r1Ind: { en: "Separate for each member", hi: "प्रत्येक सदस्य के लिए अलग", hinglish: "Har member ke liye alag" },
    r2Float: { en: "Lower (shared cost)", hi: "कम (साझा लागत)", hinglish: "Kam (shared cost)" },
    r2Ind: { en: "Higher (per-person cost)", hi: "अधिक (प्रति-व्यक्ति लागत)", hinglish: "Zyada (per-person cost)" },
    r3Float: { en: "One claim reduces cover for all", hi: "एक क्लेम सभी का कवर कम करता है", hinglish: "Ek claim sabka cover kam karta hai" },
    r3Ind: { en: "No impact on others' cover", hi: "दूसरों के कवर पर कोई प्रभाव नहीं", hinglish: "Doosron ke cover pe koi impact nahi" },
    r4Float: { en: "Young families (2A+1-3C)", hi: "युवा परिवार (2A+1-3C)", hinglish: "Young families (2A+1-3C)" },
    r4Ind: { en: "Families with elderly members", hi: "बुज़ुर्ग सदस्यों वाले परिवार", hinglish: "Families with elderly members" },
    r5Float: { en: "One policy, one renewal date", hi: "एक पॉलिसी, एक नवीनीकरण तिथि", hinglish: "Ek policy, ek renewal date" },
    r5Ind: { en: "Multiple policies, different dates", hi: "कई पॉलिसियाँ, अलग-अलग तिथियाँ", hinglish: "Multiple policies, different dates" },
    r6Float: { en: "Not ideal (high claim risk)", hi: "आदर्श नहीं (उच्च क्लेम जोखिम)", hinglish: "Not ideal (high claim risk)" },
    r6Ind: { en: "Recommended (dedicated cover)", hi: "अनुशंसित (समर्पित कवर)", hinglish: "Recommended (dedicated cover)" },
    r7Float: { en: "Up to ₹25,000 (self+family)", hi: "₹25,000 तक (स्वयं+परिवार)", hinglish: "Up to ₹25,000 (self+family)" },
    r7Ind: { en: "Up to ₹25,000 per policy", hi: "प्रति पॉलिसी ₹25,000 तक", hinglish: "Up to ₹25,000 per policy" },
    r8Float: { en: "₹12,000 – ₹18,000/yr", hi: "₹12,000 – ₹18,000/वर्ष", hinglish: "₹12,000 – ₹18,000/yr" },
    r8Ind: { en: "₹32,000 – ₹48,000/yr", hi: "₹32,000 – ₹48,000/वर्ष", hinglish: "₹32,000 – ₹48,000/yr" },
    r9Float: { en: "All members share one pool", hi: "सभी सदस्य एक पूल साझा करते हैं", hinglish: "Sab members ek pool share karte hain" },
    r9Ind: { en: "Each member has own safety net", hi: "प्रत्येक सदस्य का अपना सुरक्षा जाल", hinglish: "Har member ka apna safety net" },
    recTitle: { en: "Our Recommendation:", hi: "हमारी सिफारिश:", hinglish: "Hamari Sujhav:" },
    recText: { en: "For most young families (2 adults + 1-3 children under 45), a family floater plan with restore benefit offers the best value. Buy a separate individual plan for senior citizen parents — their higher claim probability makes floaters expensive and risky. Use the savings from the floater to enhance coverage with a super top-up plan.", hi: "अधिकांश युवा परिवारों (2 वयस्क + 1-3 बच्चे 45 वर्ष से कम) के लिए, रिस्टोर लाभ वाली फ़ैमिली फ्लोटर योजना सर्वोत्तम मूल्य प्रदान करती है। सीनियर सिटीज़न माता-पिता के लिए अलग व्यक्तिगत योजना खरीदें।", hinglish: "Most young families (2 adults + 1-3 children under 45) ke liye, restore benefit wali family floater plan best value offer karti hai. Senior citizen parents ke liye alag individual plan khareedein." },
  },
  bestPlans: {
    heading: { en: "Best Family Floater Plans for", hi: "शीर्ष फ़ैमिली फ्लोटर योजनाएँ", hinglish: "Best Family Floater Plans for" },
    headingHighlight: { en: "2 Adults + 2 Children", hi: "2 वयस्क + 2 बच्चे", hinglish: "2 Adults + 2 Children" },
    desc: { en: "The 2A+2C (2 Adults + 2 Children) is the most common family configuration in India. Here are the top 5 family floater plans ranked by overall value, features, and claim reliability:", hi: "2A+2C (2 वयस्क + 2 बच्चे) भारत में सबसे आम परिवार विन्यास है। यहाँ समग्र मूल्य, विशेषताओं और क्लेम विश्वसनीयता के आधार पर शीर्ष 5 फ़ैमिली फ्लोटर योजनाएँ हैं:", hinglish: "2A+2C (2 Adults + 2 Children) India mein sabse common family configuration hai. Yahan overall value, features aur claim reliability ke basis pe top 5 family floater plans hain:" },
    premiumLabel: { en: "Premium (₹10L, 2A+2C)", hi: "प्रीमियम (₹10L, 2A+2C)", hinglish: "Premium (₹10L, 2A+2C)" },
    highlightLabel: { en: "Key Highlights", hi: "मुख्य विशेषताएँ", hinglish: "Key Highlights" },
    drawbackLabel: { en: "Watch Out", hi: "सावधानी", hinglish: "Watch Out" },
    plan1Name: { en: "Star Health Family Health Optima", hi: "स्टार हेल्थ फ़ैमिली हेल्थ ऑप्टिमा", hinglish: "Star Health Family Health Optima" },
    plan1Insurer: { en: "Star Health and Allied Insurance", hi: "स्टार हेल्थ एंड अलाइड इंश्योरेंस", hinglish: "Star Health and Allied Insurance" },
    plan2Name: { en: "Care Health Supreme (Family Floater)", hi: "केयर हेल्थ सुप्रीम (फ़ैमिली फ्लोटर)", hinglish: "Care Health Supreme (Family Floater)" },
    plan2Insurer: { en: "Care Health Insurance", hi: "केयर हेल्थ इंश्योरेंस", hinglish: "Care Health Insurance" },
    plan3Name: { en: "Niva Bupa Health Companion", hi: "निवा बूपा हेल्थ कंपेनियन", hinglish: "Niva Bupa Health Companion" },
    plan3Insurer: { en: "Niva Bupa Health Insurance", hi: "निवा बूपा हेल्थ इंश्योरेंस", hinglish: "Niva Bupa Health Insurance" },
    plan4Name: { en: "HDFC ERGO Optima Secure (Family)", hi: "HDFC एर्गो ऑप्टिमा सिक्योर (फ़ैमिली)", hinglish: "HDFC ERGO Optima Secure (Family)" },
    plan4Insurer: { en: "HDFC ERGO General Insurance", hi: "HDFC एर्गो जनरल इंश्योरेंस", hinglish: "HDFC ERGO General Insurance" },
    plan5Name: { en: "ICICI Lombard Complete Health (Family)", hi: "ICICI लोम्बार्ड कम्प्लीट हेल्थ (फ़ैमिली)", hinglish: "ICICI Lombard Complete Health (Family)" },
    plan5Insurer: { en: "ICICI Lombard General Insurance", hi: "ICICI लोम्बार्ड जनरल इंश्योरेंस", hinglish: "ICICI Lombard General Insurance" },
  },
  premiumEst: {
    heading: { en: "Family Health Insurance", hi: "परिवार हेल्थ इंश्योरेंस", hinglish: "Family Health Insurance" },
    headingHighlight: { en: "Premium Estimates", hi: "प्रीमियम अनुमान", hinglish: "Premium Estimates" },
    desc: { en: "Approximate annual premium ranges for family floater plans across the top 5 insurers. Actual premiums vary based on age, health profile, city, and add-ons selected.", hi: "शीर्ष 5 बीमाकर्ताओं में फ़ैमिली फ्लोटर योजनाओं के अनुमानित वार्षिक प्रीमियम सीमा। वास्तविक प्रीमियम आयु, स्वास्थ्य प्रोफ़ाइल, शहर और ऐड-ऑन पर निर्भर करता है।", hinglish: "Top 5 insurers mein family floater plans ke approximate annual premium ranges. Actual premiums age, health profile, city aur add-ons ke basis pe vary karte hain." },
    thCover: { en: "Sum Insured", hi: "बीमित राशि", hinglish: "Sum Insured" },
    th2a1c: { en: "2A + 1C", hi: "2A + 1C", hinglish: "2A + 1C" },
    th2a2c: { en: "2A + 2C", hi: "2A + 2C", hinglish: "2A + 2C" },
    th2a2c1p: { en: "2A + 2C + 1 Parent", hi: "2A + 2C + 1 अभिभावक", hinglish: "2A + 2C + 1 Parent" },
    footnote: { en: "* Premiums are approximate annual ranges for family floater plans (age of eldest member: 30-35 years). GST is 0% on health insurance as per current IRDAI guidelines.", hi: "* प्रीमियम फ़ैमिली फ्लोटर योजनाओं के लिए अनुमानित वार्षिक सीमा हैं (सबसे बड़े सदस्य की आयु: 30-35 वर्ष)।", hinglish: "* Premiums approximate annual ranges hain family floater plans ke liye (eldest member ki age: 30-35 years)." },
  },
  keyFeatures: {
    heading: { en: "Key Features to", hi: "मुख्य विशेषताएँ", hinglish: "Key Features to" },
    headingHighlight: { en: "Look For", hi: "देखें", hinglish: "Look For" },
    headingSuffix: { en: "in Family Health Insurance", hi: "परिवार हेल्थ इंश्योरेंस में", hinglish: "in Family Health Insurance" },
    desc: { en: "Not all family floater plans are equal. These features can make the difference between a smooth claim experience and a financial nightmare. Prioritize based on your family's needs:", hi: "सभी फ़ैमिली फ्लोटर योजनाएँ समान नहीं हैं। ये विशेषताएँ एक सहज क्लेम अनुभव और वित्तीय दुःस्वप्न के बीच अंतर कर सकती हैं।", hinglish: "Saari family floater plans equal nahi hoti. Yeh features smooth claim experience aur financial nightmare ke beech farq kar sakti hain." },
    f1Title: { en: "Restore Benefit", hi: "रिस्टोर लाभ", hinglish: "Restore Benefit" },
    f1Desc: { en: "The most critical feature for family floaters. If one member uses up the sum insured, the restore benefit automatically reinstates it for other members. Without this, one major illness can leave your entire family without coverage.", hi: "फ़ैमिली फ्लोटर के लिए सबसे महत्वपूर्ण विशेषता। यदि किसी सदस्य ने बीमित राशि पूरी खर्च कर दी, तो रिस्टोर लाभ स्वचालित रूप से अन्य सदस्यों के लिए इसे पुनर्स्थापित करता है।", hinglish: "Family floaters ke liye sabse critical feature. Agar ek member sum insured poora kharch kar de, toh restore benefit automatically dusre members ke liye reinstate karta hai." },
    f1Importance: { en: "Critical", hi: "अत्यंत महत्वपूर्ण", hinglish: "Critical" },
    f2Title: { en: "No Room Rent Cap", hi: "कोई कमरा किराया सीमा नहीं", hinglish: "No Room Rent Cap" },
    f2Desc: { en: "Room rent caps (typically 1-2% of sum insured) restrict your hospital room choice. In metro cities, good rooms cost ₹5,000 – ₹15,000/day. No cap means freedom to choose the best room.", hi: "कमरा किराया सीमा (आमतौर पर बीमित राशि का 1-2%) आपकी अस्पताल कमरे की पसंद को सीमित करती है। कोई सीमा न होने का मतलब सबसे अच्छा कमरा चुनने की आज़ादी।", hinglish: "Room rent caps (typically 1-2% of sum insured) aapki hospital room choice ko restrict karti hain. No cap ka matlab best room choose karne ki azaadi." },
    f2Importance: { en: "Very Important", hi: "बहुत महत्वपूर्ण", hinglish: "Very Important" },
    f3Title: { en: "Short PED Waiting Period", hi: "छोटी PED प्रतीक्षा अवधि", hinglish: "Short PED Waiting Period" },
    f3Desc: { en: "Pre-existing disease waiting periods range from 2-4 years. A 2-year waiting period (Niva Bupa, Star Health) is significantly better than 3-4 years. Early coverage can save lakhs in medical bills.", hi: "पूर्व-मौजूदा रोग प्रतीक्षा अवधि 2-4 वर्ष होती है। 2-वर्ष की प्रतीक्षा अवधि 3-4 वर्ष से काफी बेहतर है।", hinglish: "Pre-existing disease waiting periods 2-4 saal ki hoti hai. 2-year waiting period 3-4 saal se kaafi better hai." },
    f3Importance: { en: "Very Important", hi: "बहुत महत्वपूर्ण", hinglish: "Very Important" },
    f4Title: { en: "No Co-payment", hi: "कोई सह-भुगतान नहीं", hinglish: "No Co-payment" },
    f4Desc: { en: "Co-payment means you bear a fixed percentage of every claim (typically 10-20%). For a ₹5L hospital bill with 20% co-pay, you pay ₹1L out of pocket. Avoid co-payment clauses.", hi: "सह-भुगतान का मतलब है कि आप हर क्लेम का एक निश्चित प्रतिशत वहन करते हैं (आमतौर पर 10-20%)। ₹5L के अस्पताल बिल में 20% सह-भुगतान पर आप ₹1L अपनी जेब से देंगे।", hinglish: "Co-payment ka matlab hai ki aap har claim ka ek fixed percentage bear karte hain (typically 10-20%). ₹5L hospital bill mein 20% co-pay pe aap ₹1L pocket se denge." },
    f4Importance: { en: "Important", hi: "महत्वपूर्ण", hinglish: "Important" },
    f5Title: { en: "Day Care Procedures", hi: "डे केयर प्रक्रियाएँ", hinglish: "Day Care Procedures" },
    f5Desc: { en: "Modern medicine allows many procedures without 24-hour hospitalization. Ensure your plan covers 500+ day care procedures. Without this, you pay for common treatments that do not require overnight stays.", hi: "आधुनिक चिकित्सा कई प्रक्रियाओं को 24-घंटे अस्पताल में भर्ती के बिना करने की अनुमति देती है। सुनिश्चित करें कि आपकी योजना 500+ डे केयर प्रक्रियाओं को कवर करती है।", hinglish: "Modern medicine kai procedures 24-hour hospitalization ke bina karne ki permission deta hai. Ensure karein ki aapki plan 500+ day care procedures cover karti hai." },
    f5Importance: { en: "Important", hi: "महत्वपूर्ण", hinglish: "Important" },
    f6Title: { en: "Newborn Baby Cover", hi: "नवजात शिशु कवर", hinglish: "Newborn Baby Cover" },
    f6Desc: { en: "Some plans cover newborns from Day 1 without additional premium, while others require a waiting period of 90 days. For families planning children, this feature can save significant costs during the first year.", hi: "कुछ योजनाएँ बिना अतिरिक्त प्रीमियम के पहले दिन से नवजात शिशु को कवर करती हैं, जबकि अन्य में 90 दिनों की प्रतीक्षा अवधि होती है।", hinglish: "Kuch plans Day 1 se newborns ko bina additional premium ke cover karti hain, jabki others mein 90 din ki waiting period hoti hai." },
    f6Importance: { en: "Important for Young Families", hi: "युवा परिवारों के लिए महत्वपूर्ण", hinglish: "Important for Young Families" },
    f7Title: { en: "AYUSH Treatment Cover", hi: "AYUSH उपचार कवर", hinglish: "AYUSH Treatment Cover" },
    f7Desc: { en: "Ayurveda, Yoga, Unani, Siddha, and Homeopathy treatments are increasingly popular in India. Ensure your plan covers AYUSH treatments at recognized hospitals.", hi: "आयुर्वेद, योग, यूनानी, सिद्ध और होम्योपैथी उपचार भारत में तेज़ी से लोकप्रिय हो रहे हैं। सुनिश्चित करें कि आपकी योजना AYUSH उपचार कवर करती है।", hinglish: "Ayurveda, Yoga, Unani, Siddha aur Homeopathy treatments India mein tezi se popular ho rahe hain. Ensure karein ki aapki plan AYUSH treatments cover karti hai." },
    f7Importance: { en: "Good to Have", hi: "अच्छा है", hinglish: "Good to Have" },
    f8Title: { en: "Annual Health Check-up", hi: "वार्षिक स्वास्थ्य जाँच", hinglish: "Annual Health Check-up" },
    f8Desc: { en: "Many family plans include free annual health check-ups for all members. Preventive screening catches health issues early when they are treatable and affordable.", hi: "कई परिवार योजनाओं में सभी सदस्यों के लिए मुफ़्त वार्षिक स्वास्थ्य जाँच शामिल है। निवारक जाँच स्वास्थ्य समस्याओं को जल्दी पकड़ती है।", hinglish: "Kai family plans mein sab members ke liye free annual health check-ups shamil hain. Preventive screening health issues ko jaldi pakadti hai." },
    f8Importance: { en: "Good to Have", hi: "अच्छा है", hinglish: "Good to Have" },
  },
  strategy: {
    heading: { en: "Smart Family Insurance", hi: "स्मार्ट परिवार बीमा", hinglish: "Smart Family Insurance" },
    headingHighlight: { en: "Strategy", hi: "रणनीति", hinglish: "Strategy" },
    s1Title: { en: "Base: Family Floater ₹10-25L", hi: "आधार: फ़ैमिली फ्लोटर ₹10-25L", hinglish: "Base: Family Floater ₹10-25L" },
    s1Desc: { en: "Cover yourself, spouse, and children under a floater plan with restore benefit and no room rent cap. This is your primary coverage for hospitalizations.", hi: "रिस्टोर लाभ और बिना कमरा किराया सीमा के फ्लोटर योजना के तहत स्वयं, पति/पत्नी और बच्चों को कवर करें।", hinglish: "Khud ko, spouse aur children ko floater plan ke tahat cover karein with restore benefit aur no room rent cap." },
    s2Title: { en: "Enhance: Super Top-Up ₹25-50L", hi: "बढ़ाएँ: सुपर टॉप-अप ₹25-50L", hinglish: "Enhance: Super Top-Up ₹25-50L" },
    s2Desc: { en: "Add a super top-up plan with ₹5L deductible for just ₹3,000-5,000/year. This gives you ₹50L+ total coverage at a fraction of the cost of a high-SI base plan.", hi: "₹5L डिडक्टिबल के साथ सुपर टॉप-अप योजना केवल ₹3,000-5,000/वर्ष में जोड़ें। इससे आपको ₹50L+ कुल कवरेज मिलती है।", hinglish: "₹5L deductible ke saath super top-up plan sirf ₹3,000-5,000/year mein add karein. Isse aapko ₹50L+ total coverage milti hai." },
    s3Title: { en: "Separate: Parents Individual Plan", hi: "अलग: माता-पिता व्यक्तिगत योजना", hinglish: "Separate: Parents Individual Plan" },
    s3Desc: { en: "Buy a dedicated senior citizen plan for parents. Do not include them in the floater — their higher claim risk will inflate the family premium.", hi: "माता-पिता के लिए समर्पित सीनियर सिटीज़न योजना खरीदें। उन्हें फ्लोटर में शामिल न करें — उनका अधिक क्लेम जोखिम परिवार का प्रीमियम बढ़ा देगा।", hinglish: "Parents ke liye dedicated senior citizen plan khareedein. Unhe floater mein include mat karein — unka higher claim risk family premium inflate karega." },
  },
  faq: {
    heading: { en: "Family Health Insurance", hi: "परिवार हेल्थ इंश्योरेंस", hinglish: "Family Health Insurance" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: { en: "Frequently asked questions about family health insurance plans in India.", hi: "भारत में परिवार हेल्थ इंश्योरेंस योजनाओं के बारे में अक्सर पूछे जाने वाले सवाल।", hinglish: "India mein family health insurance plans ke baare mein often pooche jaane wale sawaal." },
  },
  cta: {
    heading: { en: "Find the Perfect", hi: "सही खोजें", hinglish: "Perfect Dhoondhein" },
    headingHighlight: { en: "Family Health Plan", hi: "परिवार हेल्थ प्लान", hinglish: "Family Health Plan" },
    desc: { en: "Chat with Himanshu Paliwal on WhatsApp — IRDAI Certified Insurance Advisor. Get personalized family floater recommendations based on your family size, age, medical history, and budget. No spam, no pressure.", hi: "WhatsApp पर हिमांशु पालीवाल से चैट करें — IRDAI प्रमाणित बीमा सलाहकार। अपने परिवार के आकार, आयु, चिकित्सा इतिहास और बजट के आधार पर व्यक्तिगत सिफारिशें प्राप्त करें।", hinglish: "WhatsApp pe Himanshu Paliwal se chat karein — IRDAI Certified Insurance Advisor. Apne family size, age, medical history aur budget ke basis pe personalized family floater recommendations paayein." },
    ctaWhatsApp: { en: "Chat on WhatsApp Now", hi: "अभी WhatsApp पर चैट करें", hinglish: "Abhi WhatsApp pe Chat Karein" },
    advisorName: { en: "Himanshu Paliwal", hi: "हिमांशु पालीवाल", hinglish: "Himanshu Paliwal" },
    advisorPOSP: { en: "POSP Code: IP429834", hi: "POSP कोड: IP429834", hinglish: "POSP Code: IP429834" },
    advisorCert: { en: "IRDAI Certified Insurance Advisor", hi: "IRDAI प्रमाणित बीमा सलाहकार", hinglish: "IRDAI Certified Insurance Advisor" },
    advisorWebsite: { en: "PaliwalSecure.in", hi: "PaliwalSecure.in", hinglish: "PaliwalSecure.in" },
  },
};

// ── FAQ data ────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: { en: "What is a family floater health insurance plan?", hi: "फ़ैमिली फ्लोटर हेल्थ इंश्योरेंस प्लान क्या है?", hinglish: "Family floater health insurance plan kya hai?" },
    a: { en: "A family floater plan provides a single sum insured that is shared among all family members covered under the policy. For example, a ₹10L floater for a family of 4 means any member can use up to ₹10L, and the remaining amount is available for others. It is more affordable than buying separate individual plans for each member.", hi: "फ़ैमिली फ्लोटर प्लान एक ही बीमित राशि प्रदान करता है जो पॉलिसी के तहत सभी परिवार सदस्यों में साझा है। उदाहरण के लिए, 4 सदस्यों के परिवार के लिए ₹10L फ्लोटर का मतलब है कि कोई भी सदस्य ₹10L तक उपयोग कर सकता है। यह प्रत्येक सदस्य के लिए अलग योजना खरीदने से अधिक किफ़ायती है।", hinglish: "Family floater plan ek hi sum insured provide karta hai jo policy ke tahat sab family members mein shared hai. Example ke liye, 4 members ke family ke liye ₹10L floater ka matlab hai ki koi bhi member ₹10L tak use kar sakta hai. Yeh har member ke liye alag plan khareedne se zyada affordable hai." },
  },
  {
    q: { en: "Should I choose a family floater or individual plans for my family?", hi: "क्या मुझे अपने परिवार के लिए फ़ैमिली फ्लोटर या व्यक्तिगत योजनाएँ चुननी चाहिए?", hinglish: "Kya mujhe apne family ke liye family floater ya individual plans choose karne chahiye?" },
    a: { en: "Family floater is best for young, healthy families (2 adults + children) where the risk of simultaneous major claims is low. Individual plans are better if you have elderly parents, members with chronic conditions, or if you want dedicated coverage for each person. A common strategy: floater for adults+children, separate individual plan for senior citizen parents.", hi: "फ़ैमिली फ्लोटर युवा, स्वस्थ परिवारों (2 वयस्क + बच्चे) के लिए सबसे अच्छा है जहाँ एक साथ प्रमुख क्लेम का जोखिम कम है। व्यक्तिगत योजनाएँ बेहतर हैं यदि बुज़ुर्ग माता-पिता हैं या पुरानी बीमारियों वाले सदस्य हैं।", hinglish: "Family floater young, healthy families (2 adults + children) ke liye best hai jahan simultaneous major claims ka risk low hai. Individual plans better hain agar elderly parents hain ya chronic conditions wale members hain." },
  },
  {
    q: { en: "How much family health insurance coverage do I need?", hi: "मुझे कितने परिवार हेल्थ इंश्योरेंस कवरेज की ज़रूरत है?", hinglish: "Mujhe kitne family health insurance coverage ki zaroorat hai?" },
    a: { en: "For a family of 4 in a metro city, we recommend minimum ₹15-25L coverage. Consider: (1) Rising medical inflation (12-15% annually), (2) Cost of major treatments (heart surgery: ₹3-8L, cancer: ₹5-20L), (3) Family size and age of members. A ₹10L plan is the absolute minimum, but ₹25L is the sweet spot for most urban families.", hi: "मेट्रो शहर में 4 सदस्यों वाले परिवार के लिए, हम न्यूनतम ₹15-25L कवरेज अनुशंसा करते हैं। विचार करें: (1) बढ़ती मेडिकल मुद्रास्फीति (12-15% वार्षिक), (2) प्रमुख उपचारों की लागत, (3) परिवार का आकार। ₹25L अधिकांश शहरी परिवारों के लिए सही बिंदु है।", hinglish: "Metro city mein 4 members wale family ke liye, hum minimum ₹15-25L coverage recommend karte hain. Consider karein: (1) Rising medical inflation (12-15% annually), (2) Major treatments ki cost, (3) Family size. ₹25L most urban families ke liye sweet spot hai." },
  },
  {
    q: { en: "Can I add my parents to a family floater plan?", hi: "क्या मैं अपने माता-पिता को फ़ैमिली फ्लोटर प्लान में जोड़ सकता हूँ?", hinglish: "Kya main apne parents ko family floater plan mein add kar sakta hoon?" },
    a: { en: "Some family floater plans allow parents, but it is generally not recommended. Elderly parents have higher claim probability, which increases the premium for everyone and depletes the shared sum insured faster. It is better to buy a separate senior citizen health plan for parents and a family floater for yourself, spouse, and children.", hi: "कुछ फ़ैमिली फ्लोटर योजनाएँ माता-पिता को शामिल करने की अनुमति देती हैं, लेकिन आमतौर पर यह अनुशंसित नहीं है। बुज़ुर्ग माता-पिता की क्लेम संभावना अधिक होती है। माता-पिता के लिए अलग सीनियर सिटीज़न योजना खरीदना बेहतर है।", hinglish: "Kuch family floater plans parents ko allow karti hain, lekin generally yeh recommended nahi hai. Elderly parents ki claim probability zyada hoti hai. Parents ke liye alag senior citizen plan khareedna better hai." },
  },
  {
    q: { en: "What happens if one member uses the entire sum insured in a floater?", hi: "यदि कोई सदस्य फ्लोटर में पूरी बीमित राशि खर्च कर दे तो क्या होता है?", hinglish: "Agar ek member poora sum insured floater mein kharach kar de toh kya hota hai?" },
    a: { en: "If one member exhausts the sum insured, other members have no coverage left for that policy year — unless your plan has a restore benefit. This is why restore benefit is the most critical feature in family floater plans. Look for plans with unlimited restore or at least 100% single restore.", hi: "यदि कोई सदस्य बीमित राशि पूरी खर्च कर देता है, तो अन्य सदस्यों के लिए उस पॉलिसी वर्ष में कोई कवरेज नहीं बचता — जब तक कि आपकी योजना में रिस्टोर लाभ न हो। इसीलिए रिस्टोर लाभ सबसे महत्वपूर्ण विशेषता है।", hinglish: "Agar ek member sum insured exhaust kar deta hai, toh dusre members ke liye us policy year mein koi coverage nahi bachta — jab tak aapki plan mein restore benefit na ho. Isliye restore benefit sabse critical feature hai." },
  },
  {
    q: { en: "Is newborn baby covered under family health insurance?", hi: "क्या परिवार हेल्थ इंश्योरेंस में नवजात शिशु कवर है?", hinglish: "Kya family health insurance mein newborn baby covered hai?" },
    a: { en: "It depends on the plan. Star Health Family Health Optima covers newborns from Day 1 without additional premium. Most other plans have a 90-day waiting period for newborns. If you are planning a family, specifically check the newborn cover terms before buying.", hi: "यह योजना पर निर्भर करता है। स्टार हेल्थ फ़ैमिली हेल्थ ऑप्टिमा पहले दिन से नवजात शिशु को बिना अतिरिक्त प्रीमियम के कवर करती है। अधिकांश अन्य योजनाओं में नवजात शिशु के लिए 90 दिनों की प्रतीक्षा अवधि होती है।", hinglish: "Yeh plan pe depend karta hai. Star Health Family Health Optima Day 1 se newborns ko bina additional premium ke cover karti hai. Most other plans mein 90-day waiting period hai newborns ke liye." },
  },
  {
    q: { en: "How much tax benefit can I get on family health insurance?", hi: "परिवार हेल्थ इंश्योरेंस पर मुझे कितना कर लाभ मिल सकता है?", hinglish: "Family health insurance pe mujhe kitna tax benefit mil sakta hai?" },
    a: { en: "Under Section 80D, you can claim: (1) Up to ₹25,000 for premium paid for self, spouse, and children, (2) Additional ₹25,000 for parents (₹50,000 if parents are senior citizens). Maximum total tax benefit: ₹75,000 per year. For a family floater of ₹25L costing ₹35,000/year, you can recover nearly the entire premium as tax savings.", hi: "धारा 80D के तहत, आप दावा कर सकते हैं: (1) स्वयं, पति/पत्नी और बच्चों के लिए ₹25,000 तक, (2) माता-पिता के लिए अतिरिक्त ₹25,000 (₹50,000 यदि सीनियर सिटीज़न)। अधिकतम कुल कर लाभ: ₹75,000 प्रति वर्ष।", hinglish: "Section 80D ke tahat, aap claim kar sakte hain: (1) Self, spouse aur children ke liye ₹25,000 tak, (2) Parents ke liye additional ₹25,000 (₹50,000 agar senior citizen). Maximum total tax benefit: ₹75,000 per year." },
  },
];

// ── Static data (not translated) ────────────────────────────────────────────
const bestPlans2A2C = [
  {
    nameKey: "plan1Name" as const,
    insurerKey: "plan1Insurer" as const,
    sumInsured: "₹5L – ₹25L",
    premium: "₹14,000 – ₹22,000/yr",
    highlights: [
      "Automatic 100% restore of sum insured",
      "In-house claim settlement (no TPA)",
      "Newborn covered from Day 1",
      "Covers Ayush treatments",
      "No co-payment for entry age below 61",
    ],
    drawback: "Room rent capped at single AC room",
    aiPick: true,
  },
  {
    nameKey: "plan2Name" as const,
    insurerKey: "plan2Insurer" as const,
    sumInsured: "₹5L – ₹1Cr",
    premium: "₹13,500 – ₹21,000/yr",
    highlights: [
      "Unlimited automatic restoration",
      "No room rent cap",
      "Covers modern treatments (robotics, stem cell)",
      "Annual health check-up for all members",
      "Day 1 cover for accidents",
    ],
    drawback: "3-year PED waiting period",
  },
  {
    nameKey: "plan3Name" as const,
    insurerKey: "plan3Insurer" as const,
    sumInsured: "₹5L – ₹1Cr",
    premium: "₹12,000 – ₹19,000/yr",
    highlights: [
      "Only 2-year PED waiting period",
      "No room rent cap",
      "Wellness rewards up to 30% discount",
      "Covers mental illness",
      "ReAssure benefit restores on partial claims too",
    ],
    drawback: "Smaller network hospital base (10,000+)",
  },
  {
    nameKey: "plan4Name" as const,
    insurerKey: "plan4Insurer" as const,
    sumInsured: "₹5L – ₹75L",
    premium: "₹15,000 – ₹24,000/yr",
    highlights: [
      "94.1% claim settlement ratio (highest)",
      "Secure benefit auto-increases SI by 100%",
      "No room rent cap",
      "Covers air ambulance up to ₹2.5L",
      "AYUSH treatment fully covered",
    ],
    drawback: "Maximum sum insured capped at ₹75L",
    aiPick: true,
  },
  {
    nameKey: "plan5Name" as const,
    insurerKey: "plan5Insurer" as const,
    sumInsured: "₹3L – ₹50L",
    premium: "₹11,500 – ₹17,000/yr",
    highlights: [
      "Most affordable entry (starts ₹3L SI)",
      "Multi-year policy discount up to 15%",
      "Wellness program included",
      "Covers organ donor expenses",
      "No room rent cap on select variants",
    ],
    drawback: "Restore benefit only on Elite variant, smaller network",
  },
];

const premiumEstimates = [
  { cover: "₹10 Lakh", plan2A1C: "₹10,500 – ₹16,000", plan2A2C: "₹12,000 – ₹22,000", plan2A2C1P: "₹18,000 – ₹30,000" },
  { cover: "₹25 Lakh", plan2A1C: "₹18,000 – ₹26,000", plan2A2C: "₹22,000 – ₹36,000", plan2A2C1P: "₹32,000 – ₹48,000" },
  { cover: "₹50 Lakh", plan2A1C: "₹28,000 – ₹42,000", plan2A2C: "₹35,000 – ₹55,000", plan2A2C1P: "₹50,000 – ₹75,000" },
];

const floaterVsIndividual = [
  { featureKey: "r1Feature" as const, floater: "r1Float" as const, individual: "r1Ind" as const },
  { featureKey: "r2Feature" as const, floater: "r2Float" as const, individual: "r2Ind" as const },
  { featureKey: "r3Feature" as const, floater: "r3Float" as const, individual: "r3Ind" as const },
  { featureKey: "r4Feature" as const, floater: "r4Float" as const, individual: "r4Ind" as const },
  { featureKey: "r5Feature" as const, floater: "r5Float" as const, individual: "r5Ind" as const },
  { featureKey: "r6Feature" as const, floater: "r6Float" as const, individual: "r6Ind" as const },
  { featureKey: "r7Feature" as const, floater: "r7Float" as const, individual: "r7Ind" as const },
  { featureKey: "r8Feature" as const, floater: "r8Float" as const, individual: "r8Ind" as const },
  { featureKey: "r9Feature" as const, floater: "r9Float" as const, individual: "r9Ind" as const },
];

const keyFeaturesData = [
  { titleKey: "f1Title" as const, descKey: "f1Desc" as const, importanceKey: "f1Importance" as const, importanceClass: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" },
  { titleKey: "f2Title" as const, descKey: "f2Desc" as const, importanceKey: "f2Importance" as const, importanceClass: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  { titleKey: "f3Title" as const, descKey: "f3Desc" as const, importanceKey: "f3Importance" as const, importanceClass: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  { titleKey: "f4Title" as const, descKey: "f4Desc" as const, importanceKey: "f4Importance" as const, importanceClass: "bg-primary/10 text-primary" },
  { titleKey: "f5Title" as const, descKey: "f5Desc" as const, importanceKey: "f5Importance" as const, importanceClass: "bg-primary/10 text-primary" },
  { titleKey: "f6Title" as const, descKey: "f6Desc" as const, importanceKey: "f6Importance" as const, importanceClass: "bg-primary/10 text-primary" },
  { titleKey: "f7Title" as const, descKey: "f7Desc" as const, importanceKey: "f7Importance" as const, importanceClass: "bg-muted text-muted-foreground" },
  { titleKey: "f8Title" as const, descKey: "f8Desc" as const, importanceKey: "f8Importance" as const, importanceClass: "bg-muted text-muted-foreground" },
];

// ── Client Component ────────────────────────────────────────────────────────
export default function FamilyHealthInsuranceClientContent() {
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

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">{pt(pageText.hero.badge, language)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {pt(pageText.hero.title1, language)}{' '}
              <span className="gradient-text">{pt(pageText.hero.title2, language)}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              {pt(pageText.hero.desc, language)}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20choosing%20family%20health%20insurance" target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="blue">
                  <span>{pt(pageText.hero.ctaWhatsApp, language)}</span>
                </ShinyButton>
              </a>
              <a href="/free-audit">
                <ShinyButton variant="secondary">
                  <span>{pt(pageText.hero.ctaAudit, language)}</span>
                </ShinyButton>
              </a>
            </div>
            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              {[
                { text: pageText.hero.trustBadge1 },
                { text: pageText.hero.trustBadge2 },
                { text: pageText.hero.trustBadge3 },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-primary font-bold">✓</span>
                  <span>{pt(b.text, language)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* FAMILY FLOATER VS INDIVIDUAL */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.floaterVsInd.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.floaterVsInd.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{pt(pageText.floaterVsInd.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">{pt(pageText.floaterVsInd.thFeature, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold gradient-text">{pt(pageText.floaterVsInd.thFloater, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold gradient-text">{pt(pageText.floaterVsInd.thIndividual, language)}</th>
                </tr>
              </thead>
              <tbody>
                {floaterVsIndividual.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{pt(pageText.floaterVsInd[row.featureKey], language)}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{pt(pageText.floaterVsInd[row.floater], language)}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{pt(pageText.floaterVsInd[row.individual], language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 glass-card p-6 max-w-3xl mx-auto hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <h3 className="font-bold text-sm mb-2">{pt(pageText.floaterVsInd.recTitle, language)}</h3>
            <p className="text-muted-foreground text-sm">{pt(pageText.floaterVsInd.recText, language)}</p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* BEST PLANS FOR 2A+2C */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.bestPlans.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.bestPlans.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{pt(pageText.bestPlans.desc, language)}</p>
          <div className="space-y-6">
            {bestPlans2A2C.map((plan, idx) => (
              <div key={idx} className="glass-card p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center text-[#081221] font-bold text-sm">
                        {idx + 1}
                      </span>
                      <h3 className="text-lg font-bold">{pt(pageText.bestPlans[plan.nameKey], language)}</h3>
                      {plan.aiPick && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                          🤖 AI Pick
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{pt(pageText.bestPlans[plan.insurerKey], language)} • SI: {plan.sumInsured}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <p className="text-xs text-muted-foreground">{pt(pageText.bestPlans.premiumLabel, language)}</p>
                    <p className="font-bold text-primary">{plan.premium}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">{pt(pageText.bestPlans.highlightLabel, language)}</h4>
                    <ul className="space-y-1.5">
                      {plan.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          <span className="text-muted-foreground">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">{pt(pageText.bestPlans.drawbackLabel, language)}</h4>
                    <p className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">{plan.drawback}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* PREMIUM ESTIMATES */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.premiumEst.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.premiumEst.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{pt(pageText.premiumEst.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">{pt(pageText.premiumEst.thCover, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold gradient-text">{pt(pageText.premiumEst.th2a1c, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold gradient-text">{pt(pageText.premiumEst.th2a2c, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold gradient-text">{pt(pageText.premiumEst.th2a2c1p, language)}</th>
                </tr>
              </thead>
              <tbody>
                {premiumEstimates.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{row.cover}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row.plan2A1C}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row.plan2A2C}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row.plan2A2C1P}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">{pt(pageText.premiumEst.footnote, language)}</p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* KEY FEATURES TO LOOK FOR */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.keyFeatures.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.keyFeatures.headingHighlight, language)}</span>{' '}
            {pt(pageText.keyFeatures.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{pt(pageText.keyFeatures.desc, language)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyFeaturesData.map((feature, idx) => (
              <div key={idx} className="glass-card p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-base">{pt(pageText.keyFeatures[feature.titleKey], language)}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${feature.importanceClass}`}>
                    {pt(pageText.keyFeatures[feature.importanceKey], language)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{pt(pageText.keyFeatures[feature.descKey], language)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* FAMILY INSURANCE STRATEGY */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            {pt(pageText.strategy.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.strategy.headingHighlight, language)}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "1", titleKey: "s1Title" as const, descKey: "s1Desc" as const },
              { num: "2", titleKey: "s2Title" as const, descKey: "s2Desc" as const },
              { num: "3", titleKey: "s3Title" as const, descKey: "s3Desc" as const },
            ].map((step, idx) => (
              <div key={idx} className="glass-card p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center text-[#081221] font-bold text-xl mb-4">{step.num}</div>
                <h3 className="font-bold text-base mb-2">{pt(pageText.strategy[step.titleKey], language)}</h3>
                <p className="text-muted-foreground text-sm">{pt(pageText.strategy[step.descKey], language)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-0" />

      {/* FAQ SECTION */}
      <section className="py-8 md:py-12 bg-card/50" id="faq">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.faq.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.faq.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8">{pt(pageText.faq.desc, language)}</p>
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
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(pageText.cta.heading, language)}{' '}
            <span className="gradient-text">{pt(pageText.cta.headingHighlight, language)}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(pageText.cta.desc, language)}</p>
          <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20choosing%20family%20health%20insurance" target="_blank" rel="noopener noreferrer">
            <ShinyButton variant="blue">
              <span>{pt(pageText.cta.ctaWhatsApp, language)}</span>
            </ShinyButton>
          </a>
          <div className="mt-8 glass-card p-6 max-w-md mx-auto hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <p className="font-semibold text-sm">{pt(pageText.cta.advisorName, language)}</p>
            <p className="text-xs text-muted-foreground">{pt(pageText.cta.advisorPOSP, language)}</p>
            <p className="text-xs text-muted-foreground">{pt(pageText.cta.advisorCert, language)}</p>
            <p className="text-xs text-muted-foreground">{pt(pageText.cta.advisorWebsite, language)}</p>
          </div>
        </div>
      </section>
    </>
  );
}
