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
    title1: { en: "Term Life Insurance India —", hi: "भारत में टर्म लाइफ इंश्योरेंस —", hinglish: "Term Life Insurance India —" },
    title2: { en: "₹1 Crore Cover from ₹500/month", hi: "₹500/माह से ₹1 करोड़ कवर", hinglish: "₹1 Crore Cover from ₹500/month" },
    desc: { en: "Compare the best term insurance plans in India. Get premium tables for ages 25–45, Claim Settlement Ratios, essential riders, and tax benefits under Section 80C & 10(10D). Personalized AI recommendations by Paliwal Secure.", hi: "भारत की सर्वश्रेष्ठ टर्म इंश्योरेंस योजनाओं की तुलना करें। 25–45 आयु के लिए प्रीमियम टेबल, क्लेम सेटलमेंट रेशियो, आवश्यक राइडर और धारा 80C व 10(10D) के तहत कर लाभ प्राप्त करें। Paliwal Secure की AI सिफारिशें।", hinglish: "India ke best term insurance plans compare karein. Ages 25-45 ke liye premium tables, Claim Settlement Ratios, essential riders, aur Section 80C & 10(10D) ke under tax benefits paayein. Paliwal Secure ki personalized AI recommendations." },
    ctaRecommend: { en: "Get Personalized Recommendation", hi: "व्यक्तिगत सिफारिश प्राप्त करें", hinglish: "Personalized Recommendation Lo" },
    ctaCompare: { en: "Compare Plans Free", hi: "योजनाएँ मुफ़्त तुलना करें", hinglish: "Plans Free Compare Karein" },
    stat1Val: { en: "₹500", hi: "₹500", hinglish: "₹500" },
    stat1Label: { en: "Premium Starts/Month", hi: "प्रीमियम शुरू/माह", hinglish: "Premium Starts/Month" },
    stat2Val: { en: "₹1Cr", hi: "₹1Cr", hinglish: "₹1Cr" },
    stat2Label: { en: "Coverage Available", hi: "कवरेज उपलब्ध", hinglish: "Coverage Available" },
    stat3Val: { en: "99.34%", hi: "99.34%", hinglish: "99.34%" },
    stat3Label: { en: "Highest CSR", hi: "उच्चतम CSR", hinglish: "Highest CSR" },
    stat4Val: { en: "6+", hi: "6+", hinglish: "6+" },
    stat4Label: { en: "Plans Compared", hi: "योजनाओं की तुलना", hinglish: "Plans Compared" },
    trustBadge1: { en: "IRDAI Certified POSP", hi: "IRDAI प्रमाणित POSP", hinglish: "IRDAI Certified POSP" },
    trustBadge2: { en: "500+ Families Protected", hi: "500+ परिवार सुरक्षित", hinglish: "500+ Families Protected" },
    trustBadge3: { en: "Zero Hidden Charges", hi: "कोई छुपा शुल्क नहीं", hinglish: "Zero Hidden Charges" },
  },
  whatIs: {
    heading: { en: "What is", hi: "क्या है", hinglish: "Kya Hai" },
    headingHighlight: { en: "Term Life Insurance", hi: "टर्म लाइफ इंश्योरेंस", hinglish: "Term Life Insurance" },
    para1: { en: "Term life insurance is the purest form of life insurance that provides a lump sum death benefit to your nominated beneficiaries if you pass away during the policy term. Unlike traditional life insurance or endowment plans, term insurance does not have any maturity or survival benefit — which is exactly why it is so affordable. You pay a small premium (as low as ₹500/month) and your family gets a massive financial safety net (up to ₹1 crore or more).", hi: "टर्म लाइफ इंश्योरेंस जीवन बीमा का सबसे शुद्ध रूप है जो पॉलिसी अवधि के दौरान आपके निधन पर आपके नामांकित लाभार्थियों को एकमुश्त मृत्यु लाभ प्रदान करता है। पारंपरिक जीवन बीमा या एंडोमेंट योजनाओं के विपरीत, टर्म इंश्योरेंस में कोई परिपक्वता या जीवित लाभ नहीं होता — यही कारण है कि यह इतना किफ़ायती है। आप एक छोटा प्रीमियम (₹500/माह तक) देते हैं और आपके परिवार को विशाल वित्तीय सुरक्षा जाल (₹1 करोड़ या अधिक) मिलता है।", hinglish: "Term life insurance life insurance ka sabse purest form hai jo policy period ke dauraan aapke death pe aapke nominated beneficiaries ko lump sum death benefit deta hai. Traditional life insurance ya endowment plans ke ulat, term insurance mein koi maturity ya survival benefit nahi hota — yahi reason hai ki yeh itna affordable hai. Aap chhota premium (₹500/month tak) dete hain aur aapke family ko massive financial safety net (₹1 crore ya zyada) milta hai." },
    para2: { en: "Think of term insurance as the financial backbone of your family's security. If you are the primary earner and something unfortunate happens to you, your family shouldn't have to worry about EMIs, children's education, daily expenses, or outstanding loans. That's exactly what a term plan ensures — your loved ones are financially protected even in your absence.", hi: "टर्म इंश्योरेंस को अपने परिवार की सुरक्षा की वित्तीय रीढ़ मानें। यदि आप प्रमुख कमाने वाले हैं और आपके साथ कुछ दुर्भाग्यपूर्ण होता है, तो आपके परिवार को EMI, बच्चों की शिक्षा, दैनिक खर्चे या बकाया ऋण के बारे में चिंता नहीं करनी चाहिए। यही टर्म प्लान सुनिश्चित करता है — आपके अभाव में भी आपके प्रियजन वित्तीय रूप से सुरक्षित हैं।", hinglish: "Term insurance ko apne family ki security ki financial backbone maaniye. Agar aap primary earner hain aur aapke saath kuch unfortunate hota hai, toh aapke family ko EMIs, bachchon ki education, daily expenses ya outstanding loans ke baare mein worry nahi karni chahiye. Yahi term plan ensure karta hai — aapke absence mein bhi aapke loved ones financially protected hain." },
    para3: { en: "In India, term insurance has become increasingly popular because of its cost-effectiveness. A 30-year-old non-smoking male can get a ₹1 crore cover for less than ₹600/month — that's cheaper than most gym memberships! With rising awareness about financial planning, more than 2 crore term insurance policies were sold in India in 2024-25 alone.", hi: "भारत में, टर्म इंश्योरेंस अपनी लागत-प्रभावशीलता के कारण तेज़ी से लोकप्रिय हो गया है। एक 30 वर्षीय गैर-धूम्रपान पुरुष ₹600/माह से कम में ₹1 करोड़ कवर प्राप्त कर सकता है — यह अधिकांश जिम सदस्यता से सस्ता है! वित्तीय योजना के बारे में बढ़ती जागरूकता के साथ, 2024-25 में अकेले भारत में 2 करोड़ से अधिक टर्म इंश्योरेंस पॉलिसियाँ बेची गईं।", hinglish: "India mein, term insurance apni cost-effectiveness ki wajah se tezi se popular ho gaya hai. 30 saal ke non-smoking male ko ₹600/month se kam mein ₹1 crore cover mil sakta hai — yeh zyadatar gym memberships se sasta hai! Financial planning ki badhti awareness ke saath, 2024-25 mein akeli India mein 2 crore se zyada term insurance policies bechi gayi." },
  },
  premiumTable: {
    heading: { en: "Term Insurance", hi: "टर्म इंश्योरेंस", hinglish: "Term Insurance" },
    headingHighlight: { en: "Premium Table", hi: "प्रीमियम टेबल", hinglish: "Premium Table" },
    headingSuffix: { en: "— ₹1 Crore Cover", hi: "— ₹1 करोड़ कवर", hinglish: "— ₹1 Crore Cover" },
    desc: { en: "Monthly premiums for a ₹1 crore term insurance plan (30-year policy term). Actual premiums may vary based on health, occupation, and insurer.", hi: "₹1 करोड़ टर्म इंश्योरेंस योजना के लिए मासिक प्रीमियम (30 वर्ष पॉलिसी अवधि)। वास्तविक प्रीमियम स्वास्थ्य, व्यवसाय और बीमाकर्ता के आधार पर भिन्न हो सकते हैं।", hinglish: "₹1 crore term insurance plan ke liye monthly premiums (30-year policy term). Actual premiums health, occupation aur insurer ke basis pe different ho sakte hain." },
    thAge: { en: "Entry Age", hi: "प्रवेश आयु", hinglish: "Entry Age" },
    thMaleNS: { en: "Male (Non-Smoker)", hi: "पुरुष (गैर-धूम्रपान)", hinglish: "Male (Non-Smoker)" },
    thMaleS: { en: "Male (Smoker)", hi: "पुरुष (धूम्रपान)", hinglish: "Male (Smoker)" },
    thFemaleNS: { en: "Female (Non-Smoker)", hi: "महिला (गैर-धूम्रपान)", hinglish: "Female (Non-Smoker)" },
    thFemaleS: { en: "Female (Smoker)", hi: "महिला (धूम्रपान)", hinglish: "Female (Smoker)" },
    years: { en: "years", hi: "वर्ष", hinglish: "years" },
    footnote: { en: "* Premiums are indicative for a ₹1 crore cover with 30-year policy term. Actual rates vary by insurer, health profile, and occupation class. Smoker premiums are 50-80% higher.", hi: "* प्रीमियम ₹1 करोड़ कवर और 30 वर्ष पॉलिसी अवधि के लिए सांकेतिक हैं। वास्तविक दरें बीमाकर्ता, स्वास्थ्य प्रोफ़ाइल और व्यवसाय वर्ग के अनुसार भिन्न होती हैं। धूम्रपानकर्ता प्रीमियम 50-80% अधिक हैं।", hinglish: "* Premiums ₹1 crore cover aur 30-year policy term ke liye indicative hain. Actual rates insurer, health profile aur occupation class ke hisaab se different hoti hain. Smoker premiums 50-80% zyada hain." },
  },
  topPlans: {
    heading: { en: "Top 6", hi: "शीर्ष 6", hinglish: "Top 6" },
    headingHighlight: { en: "Term Insurance Plans", hi: "टर्म इंश्योरेंस योजनाएँ", hinglish: "Term Insurance Plans" },
    headingSuffix: { en: "in India (2025)", hi: "भारत में (2025)", hinglish: "in India (2025)" },
    desc: { en: "Compare the best term insurance plans based on Claim Settlement Ratio (CSR), premium, and average claim settlement time. CSR data sourced from IRDAI Annual Report 2023-24.", hi: "क्लेम सेटलमेंट रेशियो (CSR), प्रीमियम और औसत क्लेम सेटलमेंट समय के आधार पर सर्वश्रेष्ठ टर्म इंश्योरेंस योजनाओं की तुलना करें। CSR डेटा IRDAI वार्षिक रिपोर्ट 2023-24 से।", hinglish: "Claim Settlement Ratio (CSR), premium aur average claim settlement time ke basis pe best term insurance plans compare karein. CSR data IRDAI Annual Report 2023-24 se sourced hai." },
    thInsurer: { en: "Insurer", hi: "बीमाकर्ता", hinglish: "Insurer" },
    thPlan: { en: "Plan Name", hi: "योजना नाम", hinglish: "Plan Name" },
    thCsr: { en: "CSR", hi: "CSR", hinglish: "CSR" },
    thPremium: { en: "Premium (30M, NS)", hi: "प्रीमियम (30M, NS)", hinglish: "Premium (30M, NS)" },
    thClaimTime: { en: "Avg. Claim Time", hi: "औसत क्लेम समय", hinglish: "Avg. Claim Time" },
    aiPick: { en: "🤖 AI Pick", hi: "🤖 AI चयन", hinglish: "🤖 AI Pick" },
    footnote: { en: "* CSR figures from IRDAI Annual Report 2023-24. Premium for 30-year male, non-smoker, ₹1 crore cover, 30-year term.", hi: "* CSR आंकड़े IRDAI वार्षिक रिपोर्ट 2023-24 से। 30 वर्षीय पुरुष, गैर-धूम्रपान, ₹1 करोड़ कवर, 30 वर्ष अवधि के लिए प्रीमियम।", hinglish: "* CSR figures IRDAI Annual Report 2023-24 se. Premium for 30-year male, non-smoker, ₹1 crore cover, 30-year term." },
    reverseAudit: { en: "Insurance Reverse Audit™", hi: "इंश्योरेंस रिवर्स ऑडिट™", hinglish: "Insurance Reverse Audit™" },
  },
  riders: {
    heading: { en: "Essential", hi: "आवश्यक", hinglish: "Essential" },
    headingHighlight: { en: "Term Insurance Riders", hi: "टर्म इंश्योरेंस राइडर", hinglish: "Term Insurance Riders" },
    desc: { en: "Riders are optional add-ons that enhance your term insurance coverage beyond the basic death benefit. Choose riders wisely based on your lifestyle and risk profile.", hi: "राइडर वैकल्पिक ऐड-ऑन हैं जो मूल मृत्यु लाभ से परे आपके टर्म इंश्योरेंस कवरेज को बेहतर बनाते हैं। अपनी जीवनशैली और जोखिम प्रोफ़ाइल के आधार पर राइडर बुद्धिमानी से चुनें।", hinglish: "Riders optional add-ons hain jo basic death benefit se beyond aapke term insurance coverage ko enhance karte hain. Apni lifestyle aur risk profile ke basis pe riders wisely choose karein." },
    rider1Name: { en: "Critical Illness Rider", hi: "क्रिटिकल इलनेस राइडर", hinglish: "Critical Illness Rider" },
    rider1Desc: { en: "Lump sum payout on diagnosis of 40+ critical illnesses like cancer, heart attack, or kidney failure. Covers expenses that health insurance may not fully reimburse, including loss of income during recovery.", hi: "कैंसर, हार्ट अटैक या किडनी फ़ेलियर जैसी 40+ गंभीर बीमारियों की पहचान पर एकमुश्त भुगतान। स्वास्थ्य बीमा जो पूरी तरह प्रतिपूर्ति नहीं कर सकता उन खर्चों को कवर करता है, जिसमें रिकवरी के दौरान आय का नुकसान शामिल है।", hinglish: "Cancer, heart attack ya kidney failure jaisi 40+ critical illnesses ki diagnosis pe lump sum payout. Health insurance jo fully reimburse nahi kar sakta woh expenses cover karta hai, including recovery ke dauraan income ka loss." },
    rider2Name: { en: "Accidental Death Benefit Rider", hi: "एक्सीडेंटल डेथ बेनिफ़िट राइडर", hinglish: "Accidental Death Benefit Rider" },
    rider2Desc: { en: "Additional sum insured paid out if death occurs due to an accident. Typically adds 50-100% of the base cover, providing extra financial security for your family in case of accidental demise.", hi: "दुर्घटना के कारण मृत्यु होने पर अतिरिक्त बीमित राशि का भुगतान। आमतौर पर आधार कवर का 50-100% जोड़ता है, दुर्घटनावश मृत्यु की स्थिति में आपके परिवार को अतिरिक्त वित्तीय सुरक्षा प्रदान करता है।", hinglish: "Accident ki wajah se death hone pe additional sum insured payout. Typically base cover ka 50-100% add karta hai, accidental demise ki situation mein aapke family ko extra financial security deta hai." },
    rider3Name: { en: "Waiver of Premium Rider", hi: "वेवर ऑफ़ प्रीमियम राइडर", hinglish: "Waiver of Premium Rider" },
    rider3Desc: { en: "Future premiums are waived off if the policyholder is diagnosed with a critical illness or suffers total permanent disability. Your life cover continues without paying any further premiums.", hi: "यदि पॉलिसीधारक को गंभीर बीमारी होती है या पूर्ण स्थायी विकलांगता होती है तो भविष्य के प्रीमियम माफ कर दिए जाते हैं। आपका जीवन कवर बिना किसी और प्रीमियम के जारी रहता है।", hinglish: "Future premiums waived off ho jaate hain agar policyholder ko critical illness diagnose hoti hai ya total permanent disability hoti hai. Aapka life cover bina koi aur premium pay kiye continue rehta hai." },
    rider4Name: { en: "Income Benefit Rider", hi: "इनकम बेनिफ़िट राइडर", hinglish: "Income Benefit Rider" },
    rider4Desc: { en: "Provides a monthly income (typically 0.5-1% of sum insured) to your family for 10-15 years after your demise, in addition to the lump sum death benefit. Helps replace lost monthly income.", hi: "एकमुश्त मृत्यु लाभ के अतिरिक्त आपके निधन के बाद 10-15 वर्षों तक आपके परिवार को मासिक आय (आमतौर पर बीमित राशि का 0.5-1%) प्रदान करता है। खोई हुई मासिक आय को प्रतिस्थापित करने में मदद करता है।", hinglish: "Lump sum death benefit ke additional mein aapke death ke baad 10-15 saal tak aapke family ko monthly income (typically sum insured ka 0.5-1%) deta hai. Lost monthly income replace karne mein help karta hai." },
  },
  tax: {
    heading: { en: "Tax Benefits of", hi: "कर लाभ", hinglish: "Tax Benefits of" },
    headingHighlight: { en: "Term Insurance", hi: "टर्म इंश्योरेंस", hinglish: "Term Insurance" },
    section80c: { en: "Section 80C", hi: "धारा 80C", hinglish: "Section 80C" },
    sec80cTitle: { en: "Deduction on Premium Paid", hi: "प्रीमियम भुगतान पर कटौती", hinglish: "Premium Paid pe Deduction" },
    sec80cDesc: { en: "Under Section 80C of the Income Tax Act, you can claim a deduction of up to ₹1.5 lakh per financial year on the premium paid for term insurance. This deduction applies to premiums paid for yourself, your spouse, and your children.", hi: "आयकर अधिनियम की धारा 80C के तहत, आप टर्म इंश्योरेंस पर भुगतान किए गए प्रीमियम पर प्रति वित्तीय वर्ष ₹1.5 लाख तक की कटौती का दावा कर सकते हैं। यह कटौती अपने, जीवनसाथी और बच्चों के लिए भुगतान किए गए प्रीमियम पर लागू होती है।", hinglish: "Income Tax Act ki Section 80C ke under, aap term insurance pe paid premium pe per financial year ₹1.5 lakh tak deduction claim kar sakte hain. Yeh deduction apne, spouse aur bachchon ke liye paid premium pe apply hoti hai." },
    sec80c_1: { en: "Maximum deduction: ₹1,50,000/year under 80C", hi: "अधिकतम कटौती: 80C के तहत ₹1,50,000/वर्ष", hinglish: "Maximum deduction: ₹1,50,000/year under 80C" },
    sec80c_2: { en: "Covers premium for self, spouse & children", hi: "स्वयं, जीवनसाथी और बच्चों के लिए प्रीमियम कवर", hinglish: "Premium for self, spouse & children cover hota hai" },
    sec80c_3: { en: "Premium must not exceed 10% of sum insured", hi: "प्रीमियम बीमित राशि का 10% से अधिक नहीं होना चाहिए", hinglish: "Premium sum insured ka 10% se zyada nahi hona chahiye" },
    sec80c_4: { en: "Both online and offline premiums qualify", hi: "ऑनलाइन और ऑफ़लाइन दोनों प्रीमियम योग्य हैं", hinglish: "Online aur offline dono premiums qualify karte hain" },
    section1010d: { en: "Section 10(10D)", hi: "धारा 10(10D)", hinglish: "Section 10(10D)" },
    sec1010dTitle: { en: "Tax-Free Death Benefit", hi: "कर-मुक्त मृत्यु लाभ", hinglish: "Tax-Free Death Benefit" },
    sec1010dDesc: { en: "Under Section 10(10D), the death benefit received by your nominee is completely tax-free. This means your family gets the full ₹1 crore (or whatever your cover amount) without any tax deduction — making term insurance one of the most tax-efficient financial tools available.", hi: "धारा 10(10D) के तहत, आपके नामांकित को प्राप्त मृत्यु लाभ पूरी तरह कर-मुक्त है। इसका मतलब है कि आपके परिवार को पूरा ₹1 करोड़ (या जो भी आपकी कवर राशि हो) बिना किसी कर कटौती के मिलता है — जिससे टर्म इंश्योरेंस सबसे कर-कुशल वित्तीय उपकरणों में से एक बनता है।", hinglish: "Section 10(10D) ke under, aapke nominee ko milne wala death benefit completely tax-free hai. Matlab aapke family ko poora ₹1 crore (ya jo bhi aapki cover amount hai) bina kisi tax deduction ke milta hai — making term insurance one of the most tax-efficient financial tools." },
    sec1010d_1: { en: "Death benefit is 100% tax-free", hi: "मृत्यु लाभ 100% कर-मुक्त है", hinglish: "Death benefit 100% tax-free hai" },
    sec1010d_2: { en: "No upper limit on exemption amount", hi: "छूट राशि पर कोई ऊपरी सीमा नहीं", hinglish: "Exemption amount pe koi upper limit nahi" },
    sec1010d_3: { en: "Applies if premium ≤ 10% of sum insured", hi: "लागू होता है यदि प्रीमियम ≤ बीमित राशि का 10%", hinglish: "Applies agar premium ≤ 10% of sum insured" },
    sec1010d_4: { en: "Covers both death benefit and bonus (if any)", hi: "मृत्यु लाभ और बोनस (यदि कोई हो) दोनों कवर करता है", hinglish: "Death benefit aur bonus (agar koi ho) dono cover karta hai" },
  },
  steps: {
    heading: { en: "How to Choose the", hi: "कैसे चुनें", hinglish: "Kaise Choose Karein" },
    headingHighlight: { en: "Right Term Plan", hi: "सही टर्म प्लान", hinglish: "Sahi Term Plan" },
    headingSuffix: { en: "— 5-Step Guide", hi: "— 5-चरण गाइड", hinglish: "— 5-Step Guide" },
    desc: { en: "Buying term insurance is one of the most important financial decisions you'll make. Follow these five steps to ensure you pick the right plan for your family.", hi: "टर्म इंश्योरेंस खरीदना आपके सबसे महत्वपूर्ण वित्तीय निर्णयों में से एक है। अपने परिवार के लिए सही योजना चुनने के लिए इन पाँच चरणों का पालन करें।", hinglish: "Term insurance khareedna aapke sabse important financial decisions mein se ek hai. Apne family ke liye sahi plan choose karne ke liye in paanch steps ko follow karein." },
    step1Title: { en: "Calculate Your Cover", hi: "अपना कवर गणना करें", hinglish: "Apna Cover Calculate Karein" },
    step1Desc: { en: "Use the 10-15x annual income rule. Factor in home loans, children's education, and inflation. Our AI tool can calculate your exact need.", hi: "10-15x वार्षिक आय नियम का उपयोग करें। होम लोन, बच्चों की शिक्षा और मुद्रास्फीति को शामिल करें। हमारा AI टूल आपकी सटीक आवश्यकता गणना कर सकता है।", hinglish: "10-15x annual income rule use karein. Home loans, bachchon ki education aur inflation factor karein. Hamaara AI tool aapki exact need calculate kar sakta hai." },
    step2Title: { en: "Choose Policy Term", hi: "पॉलिसी अवधि चुनें", hinglish: "Policy Term Choose Karein" },
    step2Desc: { en: "Select a term that covers you until retirement (age 60-65) or until your dependents become financially independent, whichever is later.", hi: "एक अवधि चुनें जो आपको सेवानिवृत्ति (60-65 वर्ष) तक या जब तक आपके आश्रित वित्तीय रूप से स्वतंत्र न हो जाएँ, कवर करे।", hinglish: "Ek term choose karein jo aapko retirement (age 60-65) tak ya jab tak aapke dependents financially independent na ho jaayein, cover kare." },
    step3Title: { en: "Check Claim Settlement Ratio", hi: "क्लेम सेटलमेंट रेशियो जाँचें", hinglish: "Claim Settlement Ratio Check Karein" },
    step3Desc: { en: "Choose insurers with CSR above 95%. This indicates the insurer honors most claims. Check the latest IRDAI report for updated data.", hi: "95% से अधिक CSR वाले बीमाकर्ता चुनें। यह दर्शाता है कि बीमाकर्ता अधिकांश क्लेम स्वीकार करता है। अद्यतित डेटा के लिए नवीनतम IRDAI रिपोर्ट देखें।", hinglish: "95% se zyada CSR wale insurers choose karein. Yeh indicate karta hai ki insurer most claims honor karta hai. Updated data ke liye latest IRDAI report check karein." },
    step4Title: { en: "Select Right Riders", hi: "सही राइडर चुनें", hinglish: "Sahi Riders Select Karein" },
    step4Desc: { en: "Add Critical Illness and Accidental Death riders for comprehensive protection. Avoid overloading with too many riders — it increases premium significantly.", hi: "व्यापक सुरक्षा के लिए क्रिटिकल इलनेस और एक्सीडेंटल डेथ राइडर जोड़ें। बहुत अधिक राइडर लोड न करें — इससे प्रीमियम काफी बढ़ जाता है।", hinglish: "Comprehensive protection ke liye Critical Illness aur Accidental Death riders add karein. Bahut zyada riders load mat karein — isse premium kaafi badh jaata hai." },
    step5Title: { en: "Compare & Buy Online", hi: "तुलना करें और ऑनलाइन खरीदें", hinglish: "Compare Karein & Online Khareedein" },
    step5Desc: { en: "Compare premiums from 6+ insurers on Paliwal Secure. Online plans are 30-50% cheaper. Get AI-powered recommendations before buying.", hi: "Paliwal Secure पर 6+ बीमाकर्ताओं से प्रीमियम की तुलना करें। ऑनलाइन योजनाएँ 30-50% सस्ती हैं। खरीदने से पहले AI-संचालित सिफारिशें प्राप्त करें।", hinglish: "Paliwal Secure pe 6+ insurers se premiums compare karein. Online plans 30-50% sasti hain. Khareedne se pehle AI-powered recommendations paayein." },
  },
  csr: {
    heading: { en: "Why", hi: "क्यों", hinglish: "Kyun" },
    headingHighlight: { en: "Claim Settlement Ratio (CSR)", hi: "क्लेम सेटलमेंट रेशियो (CSR)", hinglish: "Claim Settlement Ratio (CSR)" },
    headingSuffix: { en: "Matters", hi: "मायने रखता है", hinglish: "Matters" },
    para1: { en: "The Claim Settlement Ratio is arguably the most important metric when choosing a term insurance provider. It tells you how reliable an insurer is when it comes to paying claims. A CSR of 98% means the insurer settled 98 out of every 100 claims received. When your family files a claim during an already difficult time, the last thing they need is a rejected claim.", hi: "क्लेम सेटलमेंट रेशियो तर्कसंगत रूप से टर्म इंश्योरेंस प्रदाता चुनने के समय सबसे महत्वपूर्ण मीट्रिक है। यह बताता है कि क्लेम का भुगतान करने में बीमाकर्ता कितना विश्वसनीय है। 98% CSR का मतलब है कि बीमाकर्ता ने प्राप्त 100 में से 98 क्लेम का निपटान किया। जब आपका परिवार पहले से कठिन समय में क्लेम दाखिल करता है, तो उन्हें अस्वीकृत क्लेम सबसे ज़रूरत नहीं होती।", hinglish: "Claim Settlement Ratio arguably sabse important metric hai jab term insurance provider choose karte hain. Yeh batata hai ki insurer claims pay karne mein kitna reliable hai. 98% CSR ka matlab insurer ne 100 mein se 98 claims settle kiye. Jab aapka family already difficult time mein claim file karta hai, toh rejected claim sabse zaroorat nahi hoti." },
    para2: { en: "IRDAI publishes the CSR of every life insurer in India in its annual report. As of the 2023-24 report, the top insurers consistently maintain CSRs above 97%. However, CSR alone shouldn't be the only factor — also consider the claim settlement amount ratio, the average claim settlement time, and the insurer's customer service reputation.", hi: "IRDAI अपनी वार्षिक रिपोर्ट में भारत के प्रत्येक जीवन बीमाकर्ता का CSR प्रकाशित करता है। 2023-24 रिपोर्ट के अनुसार, शीर्ष बीमाकर्ता लगातार 97% से अधिक CSR बनाए हुए हैं। हालांकि, CSR अकेला एकमात्र कारक नहीं होना चाहिए — क्लेम सेटलमेंट राशि अनुपात, औसत क्लेम सेटलमेंट समय और बीमाकर्ता की ग्राहक सेवा प्रतिष्ठा भी विचार करें।", hinglish: "IRDAI apni annual report mein har life insurer ka CSR publish karta hai. 2023-24 report ke hisaab se, top insurers consistently 97% se zyada CSR maintain karte hain. Lekin, CSR akele hi only factor nahi hona chahiye — claim settlement amount ratio, average claim settlement time aur insurer ki customer service reputation bhi consider karein." },
    tipTitle: { en: "💡 Pro Tip from Paliwal Secure", hi: "💡 Paliwal Secure का प्रो टिप", hinglish: "💡 Paliwal Secure ka Pro Tip" },
    tipDesc: { en: "Always check the CSR for the specific year and not just the average. Some insurers may show a high 5-year average but a declining year-on-year CSR, which could be a red flag. Use our Insurance Reverse Audit™ to get a detailed analysis of your chosen insurer's claim track record.", hi: "हमेशा विशिष्ट वर्ष के लिए CSR जाँचें न कि केवल औसत। कुछ बीमाकर्ता उच्च 5-वर्ष औसत दिखा सकते हैं लेकिन वर्ष-दर-वर्ष CSR में गिरावट, जो एक चेतावनी संकेत हो सकता है। अपने चुने हुए बीमाकर्ता के क्लेम ट्रैक रिकॉर्ड का विस्तृत विश्लेषण प्राप्त करने के लिए हमारे इंश्योरेंस रिवर्स ऑडिट™ का उपयोग करें।", hinglish: "Hamesha specific year ke liye CSR check karein na ki sirf average. Kuch insurers high 5-year average dikhha sakte hain lekin year-on-year CSR mein decline, jo ek red flag ho sakta hai. Apne chosen insurer ke claim track record ka detailed analysis paane ke liye hamare Insurance Reverse Audit™ ka use karein." },
  },
  faq: {
    heading: { en: "Term Insurance", hi: "टर्म इंश्योरेंस", hinglish: "Term Insurance" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: { en: "Frequently asked questions about term life insurance in India. Can't find your answer? Chat with our AI advisor or talk to Himanshu directly on WhatsApp!", hi: "भारत में टर्म लाइफ इंश्योरेंस के बारे में अक्सर पूछे जाने वाले सवाल। अपना जवाब नहीं मिला? हमारे AI सलाहकार से चैट करें या हिमांशु से सीधे WhatsApp पर बात करें!", hinglish: "India mein term life insurance ke baare mein frequently asked questions. Apna answer nahi mila? Hamaare AI advisor se chat karein ya Himanshu se directly WhatsApp pe baat karein!" },
  },
  expert: {
    heading: { en: "Expert", hi: "विशेषज्ञ", hinglish: "Expert" },
    headingHighlight: { en: "Insight", hi: "अंतर्दृष्टि", hinglish: "Insight" },
    name: { en: "Himanshu Paliwal", hi: "हिमांशु पालीवाल", hinglish: "Himanshu Paliwal" },
    role: { en: "IRDAI Certified Insurance Advisor | POSP Code: IP429834", hi: "IRDAI प्रमाणित बीमा सलाहकार | POSP कोड: IP429834", hinglish: "IRDAI Certified Insurance Advisor | POSP Code: IP429834" },
    founder: { en: "Founder, Paliwal Secure", hi: "संस्थापक, पालीवाल सिक्योर", hinglish: "Founder, Paliwal Secure" },
    quote: { en: "\"I've seen too many families struggle because they either had no life insurance or bought the wrong plan. Term insurance is not an expense — it's the cheapest way to buy peace of mind. For less than what you spend on monthly subscriptions, you can ensure your family never faces financial hardship. Don't overthink it — just get covered. And if you're confused about which plan to choose, let our AI do the heavy lifting. It compares 51+ insurers in seconds and finds the plan that fits YOUR life, not a one-size-fits-all recommendation.\"", hi: "\"मैंने बहुत परिवारों को संघर्ष करते देखा है क्योंकि उनके पास या तो कोई जीवन बीमा नहीं था या उन्होंने गलत योजना खरीदी। टर्म इंश्योरेंस खर्चा नहीं है — यह शांति खरीदने का सबसे सस्ता तरीका है। मासिक सदस्यताओं पर जो खर्च करते हो उससे कम में, आप सुनिश्चित कर सकते हैं कि आपके परिवार को कभी वित्तीय कठिनाई का सामना न करना पड़े। ज़्यादा मत सोचो — बस कवर हो जाओ। और अगर कौन सी योजना चुननी है इसमें confused हो, तो हमारे AI को काम करने दो। यह 51+ बीमाकर्ताओं की सेकंड में तुलना करता है और वह योजना ढूंढता है जो आपकी ज़िंदगी के लिए हो, one-size-fits-all सिफारिश नहीं।\"", hinglish: "\"Maine bahut families ko struggle karte dekha hai kyunki unke paas ya toh koi life insurance nahi tha ya galat plan khareedi. Term insurance kharcha nahi hai — yeh peace of mind khareedne ka sabse sasta tareeqa hai. Monthly subscriptions pe jo kharch karte ho usse kam mein, aap ensure kar sakte hain ki aapke family ko kabhi financial hardship face na karna pade. Zyada mat socho — bas cover ho jao. Aur agar kaunsi plan choose karni hai mein confused ho, toh hamare AI ko kaam karne do. Yeh 51+ insurers ko seconds mein compare karta hai aur woh plan dhoondhta hai jo aapki zindagi ke liye fit ho, one-size-fits-all recommendation nahi.\"" },
    ctaWhatsApp: { en: "Chat with Himanshu on WhatsApp", hi: "WhatsApp पर हिमांशु से चैट करें", hinglish: "Himanshu se WhatsApp pe Chat Karein" },
    ctaAudit: { en: "Run Free Audit", hi: "मुफ़्त ऑडिट चलाएँ", hinglish: "Free Audit Run Karein" },
  },
  related: {
    heading: { en: "Related", hi: "संबंधित", hinglish: "Related" },
    headingHighlight: { en: "Guides", hi: "गाइड", hinglish: "Guides" },
    guide1Title: { en: "Health Insurance Guide →", hi: "हेल्थ इंश्योरेंस गाइड →", hinglish: "Health Insurance Guide →" },
    guide1Desc: { en: "Compare best health insurance plans in India. Family floater, senior citizen, critical illness — all covered with AI recommendations.", hi: "भारत में सर्वश्रेष्ठ हेल्थ इंश्योरेंस योजनाओं की तुलना करें। फ़ैमिली फ्लोटर, सीनियर सिटीज़न, क्रिटिकल इलनेस — AI सिफारिशों के साथ सब कवर।", hinglish: "India ke best health insurance plans compare karein. Family floater, senior citizen, critical illness — AI recommendations ke saath sab covered." },
    guide2Title: { en: "Insurance Claim Guide →", hi: "इंश्योरेंस क्लेम गाइड →", hinglish: "Insurance Claim Guide →" },
    guide2Desc: { en: "Step-by-step guide to filing insurance claims in India. Know your rights, documents needed, and how to avoid claim rejection.", hi: "भारत में इंश्योरेंस क्लेम दाखिल करने की चरण-दर-चरण गाइड। अपने अधिकार जानें, आवश्यक दस्तावेज़ और क्लेम अस्वीकृति से बचने के तरीके।", hinglish: "India mein insurance claims file karne ki step-by-step guide. Apne rights jaanein, documents needed, aur claim rejection se kaise bacha jaaye." },
  },
  cta: {
    heading: { en: "Get Your", hi: "अपनी प्राप्त करें", hinglish: "Apni Paayein" },
    headingHighlight: { en: "Personalized Term Plan", hi: "व्यक्तिगत टर्म प्लान", hinglish: "Personalized Term Plan" },
    headingSuffix: { en: "Recommendation", hi: "सिफारिश", hinglish: "Recommendation" },
    desc: { en: "Stop guessing which term plan is right for you. Our AI analyzes 51+ insurers, compares premiums, CSR, and riders — then recommends the best plan for your specific needs. It's free, instant, and unbiased.", hi: "अनुमान लगाना बंद करें कि आपके लिए कौन सी टर्म प्लान सही है। हमारा AI 51+ बीमाकर्ताओं का विश्लेषण करता है, प्रीमियम, CSR और राइडर की तुलना करता है — फिर आपकी विशिष्ट आवश्यकताओं के लिए सर्वोत्तम योजना की सिफारिश करता है। यह मुफ़्त, तत्काल और निष्पक्ष है।", hinglish: "Guess karna band karein ki aapke liye kaunsi term plan sahi hai. Hamaara AI 51+ insurers analyze karta hai, premiums, CSR aur riders compare karta hai — phir aapki specific needs ke liye best plan recommend karta hai. Yeh free, instant aur unbiased hai." },
    ctaWhatsApp: { en: "Get Recommendation on WhatsApp", hi: "WhatsApp पर सिफारिश प्राप्त करें", hinglish: "WhatsApp pe Recommendation Lo" },
    ctaCompare: { en: "Compare Plans Free", hi: "योजनाएँ मुफ़्त तुलना करें", hinglish: "Plans Free Compare Karein" },
    byline: { en: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor | POSP Code: IP429834", hi: "हिमांशु पालीवाल द्वारा — IRDAI प्रमाणित बीमा सलाहकार | POSP कोड: IP429834", hinglish: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor | POSP Code: IP429834" },
  },
};

// ── FAQ data (English for JSON-LD, translated for display) ──────────────────
const faqsEn = [
  { q: "Is term insurance worth it?", a: "Absolutely. Term insurance is the purest and most affordable form of life insurance. For just ₹500-600/month, you get a ₹1 crore safety net for your family. Unlike endowment or ULIP plans, term insurance doesn't mix investment with insurance — you get maximum coverage at minimum cost. Think of it as the financial backbone your family needs if something happens to you." },
  { q: "What happens if I miss a premium payment?", a: "Most term insurance plans offer a grace period of 15-30 days after the due date. If you pay within this period, your policy continues without any penalty. If you miss the grace period, the policy lapses, but you can revive it within 2-5 years by paying overdue premiums plus interest. Some insurers also offer a premium holiday feature for temporary financial difficulties." },
  { q: "How much term insurance cover do I need?", a: "A common rule of thumb is 10-15 times your annual income. So if you earn ₹10 lakhs/year, aim for ₹1-1.5 crore cover. Also consider your outstanding loans (home loan, car loan), future expenses (children's education, marriage), and inflation. Our AI advisor at Paliwal Secure can calculate the exact cover you need based on your specific financial situation." },
  { q: "Can I have more than one term insurance policy?", a: "Yes, you can buy multiple term insurance policies from different insurers. There is no legal restriction. However, you must disclose all existing life insurance policies when applying for a new one. At the time of claim, your family will need to file claims with each insurer separately. Having multiple policies can be useful for diversifying claim risk across insurers." },
  { q: "What is the Claim Settlement Ratio (CSR) and why does it matter?", a: "CSR is the percentage of claims an insurer settles out of the total claims received in a financial year. For example, if an insurer receives 100 claims and settles 98, the CSR is 98%. A higher CSR (above 95%) indicates the insurer is reliable and honors most claims. Always check the latest IRDAI Annual Report for updated CSR data before choosing an insurer." },
  { q: "Is the death benefit from term insurance taxable?", a: "No, the death benefit received by nominees is completely tax-free under Section 10(10D) of the Income Tax Act, provided the premium paid does not exceed 10% of the sum insured (for policies issued after April 1, 2012). This makes term insurance one of the most tax-efficient ways to secure your family's financial future." },
  { q: "Should I buy term insurance online or offline?", a: "Online term insurance is typically 30-50% cheaper than offline plans because there are no agent commissions. You also get the convenience of comparing multiple plans, reading reviews, and completing the process from home. However, if you need personalized guidance on choosing the right plan, riders, or sum assured, consulting an IRDAI-certified advisor like Paliwal Secure ensures you make the right choice." },
];

const faqsTranslated = [
  { q: { en: "Is term insurance worth it?", hi: "क्या टर्म इंश्योरेंस लेना फायदेमंद है?", hinglish: "Kya Term Insurance lene mein fayda hai?" }, a: { en: "Absolutely. Term insurance is the purest and most affordable form of life insurance. For just ₹500-600/month, you get a ₹1 crore safety net for your family. Unlike endowment or ULIP plans, term insurance doesn't mix investment with insurance — you get maximum coverage at minimum cost. Think of it as the financial backbone your family needs if something happens to you.", hi: "बिल्कुल। टर्म इंश्योरेंस जीवन बीमा का सबसे शुद्ध और किफ़ायती रूप है। मात्र ₹500-600/माह में आप अपने परिवार के लिए ₹1 करोड़ का सुरक्षा जाल प्राप्त करते हैं। एंडोमेंट या ULIP योजनाओं के विपरीत, टर्म इंश्योरेंस निवेश को बीमे के साथ नहीं मिलाता — आप कम लागत पर अधिकतम कवरेज प्राप्त करते हैं। इसे अपने परिवार की वित्तीय रीढ़ मानें यदि आपके साथ कुछ होता है।", hinglish: "Bilkul. Term insurance life insurance ka sabse purest aur affordable form hai. Sirf ₹500-600/month mein aap apne family ke liye ₹1 crore ka safety net paate hain. Endowment ya ULIP plans ke ulat, term insurance investment ko insurance ke saath nahi milata — aap minimum cost pe maximum coverage paate hain. Isse apne family ki financial backbone maaniye agar aapke saath kuch hota hai." } },
  { q: { en: "What happens if I miss a premium payment?", hi: "यदि मैं प्रीमियम भुगतान छूट जाए तो क्या होगा?", hinglish: "Agar premium payment miss ho jaye toh kya hoga?" }, a: { en: "Most term insurance plans offer a grace period of 15-30 days after the due date. If you pay within this period, your policy continues without any penalty. If you miss the grace period, the policy lapses, but you can revive it within 2-5 years by paying overdue premiums plus interest. Some insurers also offer a premium holiday feature for temporary financial difficulties.", hi: "अधिकांश टर्म इंश्योरेंस योजनाएँ नियत तिथि के बाद 15-30 दिनों की अनुग्रह अवधि प्रदान करती हैं। यदि आप इस अवधि में भुगतान करते हैं, तो आपकी पॉलिसी बिना किसी दंड के जारी रहती है। यदि आप अनुग्रह अवधि छूट जाती है, तो पॉलिसी समाप्त हो जाती है, लेकिन आप 2-5 वर्षों के भीतर बकाया प्रीमियम और ब्याज देकर इसे पुनर्जीवित कर सकते हैं।", hinglish: "Zyadatar term insurance plans grace period of 15-30 days offer karti hain due date ke baad. Agar aap is period mein pay karte hain, toh aapki policy bina kisi penalty ke continue rehti hai. Agar grace period miss ho jaye, toh policy lapse ho jaati hai, lekin aap 2-5 saal ke andar overdue premiums plus interest dekar revive kar sakte hain." } },
  { q: { en: "How much term insurance cover do I need?", hi: "मुझे कितने का टर्म इंश्योरेंस कवर चाहिए?", hinglish: "Mujhe kitne ka term insurance cover chahiye?" }, a: { en: "A common rule of thumb is 10-15 times your annual income. So if you earn ₹10 lakhs/year, aim for ₹1-1.5 crore cover. Also consider your outstanding loans (home loan, car loan), future expenses (children's education, marriage), and inflation. Our AI advisor at Paliwal Secure can calculate the exact cover you need based on your specific financial situation.", hi: "एक सामान्य नियम आपकी वार्षिक आय का 10-15 गुना है। तो यदि आप ₹10 लाख/वर्ष कमाते हैं, तो ₹1-1.5 करोड़ कवर का लक्ष्य रखें। अपने बकाया ऋण (होम लोन, कार लोन), भविष्य के खर्चे (बच्चों की शिक्षा, विवाह) और मुद्रास्फीति भी विचार करें। Paliwal Secure का AI सलाहकार आपकी विशिष्ट वित्तीय स्थिति के आधार पर सटीक कवर गणना कर सकता है।", hinglish: "Ek common rule of thumb hai aapki annual income ka 10-15 guna. Toh agar aap ₹10 lakhs/year kamate hain, toh ₹1-1.5 crore cover aim karein. Apne outstanding loans (home loan, car loan), future expenses (bachchon ki education, marriage) aur inflation bhi consider karein. Paliwal Secure ka AI advisor aapki specific financial situation ke basis pe exact cover calculate kar sakta hai." } },
  { q: { en: "Can I have more than one term insurance policy?", hi: "क्या मैं एक से अधिक टर्म इंश्योरेंस पॉलिसी रख सकता हूँ?", hinglish: "Kya main ek se zyada term insurance policies rakh sakta hoon?" }, a: { en: "Yes, you can buy multiple term insurance policies from different insurers. There is no legal restriction. However, you must disclose all existing life insurance policies when applying for a new one. At the time of claim, your family will need to file claims with each insurer separately. Having multiple policies can be useful for diversifying claim risk across insurers.", hi: "हाँ, आप विभिन्न बीमाकर्ताओं से कई टर्म इंश्योरेंस पॉलिसियाँ खरीद सकते हैं। कोई कानूनी प्रतिबंध नहीं है। हालांकि, नई पॉलिसी के लिए आवेदन करते समय आपको सभी मौजूदा जीवन बीमा पॉलिसियों का खुलासा करना होगा। क्लेम के समय, आपके परिवार को प्रत्येक बीमाकर्ता के साथ अलग-अलग क्लेम दाखिल करना होगा।", hinglish: "Haan, aap different insurers se multiple term insurance policies khareed sakte hain. Koi legal restriction nahi hai. Lekin, nayi policy ke liye apply karte waqt aapko saari existing life insurance policies disclose karni hogi. Claim ke time, aapke family ko har insurer ke saath alag-alag claim file karna hoga." } },
  { q: { en: "What is the Claim Settlement Ratio (CSR) and why does it matter?", hi: "क्लेम सेटलमेंट रेशियो (CSR) क्या है और यह क्यों मायने रखता है?", hinglish: "Claim Settlement Ratio (CSR) kya hai aur yeh kyun matter karta hai?" }, a: { en: "CSR is the percentage of claims an insurer settles out of the total claims received in a financial year. For example, if an insurer receives 100 claims and settles 98, the CSR is 98%. A higher CSR (above 95%) indicates the insurer is reliable and honors most claims. Always check the latest IRDAI Annual Report for updated CSR data before choosing an insurer.", hi: "CSR एक वित्तीय वर्ष में प्राप्त कुल क्लेम में से बीमाकर्ता द्वारा निपटाए गए क्लेम का प्रतिशत है। उदाहरण के लिए, यदि बीमाकर्ता 100 क्लेम प्राप्त करता है और 98 निपटाता है, तो CSR 98% है। उच्च CSR (95% से अधिक) बीमाकर्ता के विश्वसनीय होने का संकेत देता है। बीमाकर्ता चुनने से पहले हमेशा नवीनतम IRDAI वार्षिक रिपोर्ट जाँचें।", hinglish: "CSR ek financial year mein received total claims mein se insurer dwara settled claims ka percentage hai. Example ke liye, agar insurer 100 claims receive karta hai aur 98 settle karta hai, toh CSR 98% hai. Higher CSR (95% se zyada) indicate karta hai ki insurer reliable hai. Insurer choose karne se pehle hamesha latest IRDAI Annual Report check karein." } },
  { q: { en: "Is the death benefit from term insurance taxable?", hi: "क्या टर्म इंश्योरेंस से मृत्यु लाभ पर कर लगता है?", hinglish: "Kya term insurance se death benefit pe tax lagta hai?" }, a: { en: "No, the death benefit received by nominees is completely tax-free under Section 10(10D) of the Income Tax Act, provided the premium paid does not exceed 10% of the sum insured (for policies issued after April 1, 2012). This makes term insurance one of the most tax-efficient ways to secure your family's financial future.", hi: "नहीं, नामांकित को प्राप्त मृत्यु लाभ आयकर अधिनियम की धारा 10(10D) के तहत पूरी तरह कर-मुक्त है, बशर्ते भुगतान किया गया प्रीमियम बीमित राशि का 10% से अधिक न हो (1 अप्रैल 2012 के बाद जारी पॉलिसियों के लिए)। इससे टर्म इंश्योरेंस आपके परिवार के वित्तीय भविष्य को सुरक्षित करने के सबसे कर-कुशल तरीकों में से एक बनता है।", hinglish: "Nahi, nominees ko milne wala death benefit Section 10(10D) ke under completely tax-free hai, provided premium paid sum insured ka 10% se zyada na ho (1 April 2012 ke baad issued policies ke liye). Isse term insurance aapke family ke financial future ko secure karne ke sabse tax-efficient tariqon mein se ek banta hai." } },
  { q: { en: "Should I buy term insurance online or offline?", hi: "क्या मुझे टर्म इंश्योरेंस ऑनलाइन या ऑफ़लाइन खरीदना चाहिए?", hinglish: "Term insurance online khareedein ya offline?" }, a: { en: "Online term insurance is typically 30-50% cheaper than offline plans because there are no agent commissions. You also get the convenience of comparing multiple plans, reading reviews, and completing the process from home. However, if you need personalized guidance on choosing the right plan, riders, or sum assured, consulting an IRDAI-certified advisor like Paliwal Secure ensures you make the right choice.", hi: "ऑनलाइन टर्म इंश्योरेंस आमतौर पर ऑफ़लाइन योजनाओं से 30-50% सस्ता होता है क्योंकि कोई एजेंट कमीशन नहीं होता। आपको कई योजनाओं की तुलना, समीक्षाएँ पढ़ने और घर से प्रक्रिया पूरी करने की सुविधा भी मिलती है। हालांकि, यदि आपको सही योजना, राइडर या बीमित राशि चुनने में व्यक्तिगत मार्गदर्शन चाहिए, तो IRDAI-प्रमाणित सलाहकार जैसे Paliwal Secure से परामर्श सही चुनाव सुनिश्चित करता है।", hinglish: "Online term insurance typically 30-50% sasta hota hai offline plans se kyunki koi agent commission nahi hota. Aapko multiple plans compare karne, reviews padhne aur ghar se process complete karne ki convenience bhi milti hai. Lekin, agar aapko sahi plan, riders ya sum assured choose karne mein personalized guidance chahiye, toh IRDAI-certified advisor jaise Paliwal Secure se consulting sahi choice ensure karta hai." } },
];

// ── Static data ─────────────────────────────────────────────────────────────
const premiumTable = [
  { age: 25, maleNS: "₹485", maleS: "₹735", femaleNS: "₹420", femaleS: "₹610" },
  { age: 30, maleNS: "₹590", maleS: "₹920", femaleNS: "₹510", femaleS: "₹760" },
  { age: 35, maleNS: "₹780", maleS: "₹1,250", femaleNS: "₹660", femaleS: "₹1,030" },
  { age: 40, maleNS: "₹1,120", maleS: "₹1,860", femaleNS: "₹930", femaleS: "₹1,520" },
  { age: 45, maleNS: "₹1,680", maleS: "₹2,890", femaleNS: "₹1,390", femaleS: "₹2,340" },
];

const topPlans = [
  { insurer: "HDFC Life", plan: "Click 2 Protect Super", csr: "98.66%", premium: "₹549/mo", claimTime: "12 days", aiPick: false },
  { insurer: "ICICI Pru", plan: "iProtect Smart", csr: "98.20%", premium: "₹579/mo", claimTime: "14 days", aiPick: false },
  { insurer: "SBI Life", plan: "eShield Next", csr: "97.88%", premium: "₹529/mo", claimTime: "15 days", aiPick: false },
  { insurer: "TATA AIA", plan: "Sampoorna Raksha Supreme", csr: "98.54%", premium: "₹555/mo", claimTime: "11 days", aiPick: false },
  { insurer: "Max Life", plan: "Smart Secure Plus", csr: "99.34%", premium: "₹595/mo", claimTime: "10 days", aiPick: true },
  { insurer: "Bajaj Allianz", plan: "Smart Protect Goal", csr: "98.46%", premium: "₹569/mo", claimTime: "13 days", aiPick: false },
];

const riderIcons = ["🏥", "⚠️", "🛡️", "💰"];

// ── Section Divider ─────────────────────────────────────────────────────────
function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />;
}

// ── Client Component ────────────────────────────────────────────────────────
export default function LifeInsuranceClientContent() {
  const { language } = useLanguage();
  const t = pageText;

  // JSON-LD (always English for SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqsEn.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{pt(t.hero.badge, language)}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {pt(t.hero.title1, language)}{' '}
            <span className="gradient-text">{pt(t.hero.title2, language)}</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            {pt(t.hero.desc, language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20choosing%20a%20term%20insurance%20plan" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue"><span>{pt(t.hero.ctaRecommend, language)}</span></ShinyButton>
            </a>
            <Link href="/free-audit">
              <ShinyButton variant="secondary"><span>{pt(t.hero.ctaCompare, language)}</span></ShinyButton>
            </Link>
          </div>
          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            {[
              pt(t.hero.trustBadge1, language),
              pt(t.hero.trustBadge2, language),
              pt(t.hero.trustBadge3, language),
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>{badge}</span>
              </div>
            ))}
          </div>
          {/* Stats */}
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

      {/* ── WHAT IS TERM LIFE INSURANCE ──────────────────────────────────── */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            {pt(t.whatIs.heading, language)} <span className="gradient-text">{pt(t.whatIs.headingHighlight, language)}</span>?
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">{pt(t.whatIs.para1, language)}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{pt(t.whatIs.para2, language)}</p>
            <p className="text-muted-foreground leading-relaxed">{pt(t.whatIs.para3, language)}</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── PREMIUM TABLE ────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(t.premiumTable.heading, language)} <span className="gradient-text">{pt(t.premiumTable.headingHighlight, language)}</span> {pt(t.premiumTable.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">{pt(t.premiumTable.desc, language)}</p>
          <div className="glass-card rounded-xl p-6 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(t.premiumTable.thAge, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(t.premiumTable.thMaleNS, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(t.premiumTable.thMaleS, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(t.premiumTable.thFemaleNS, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(t.premiumTable.thFemaleS, language)}</th>
                </tr>
              </thead>
              <tbody>
                {premiumTable.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{row.age} {pt(t.premiumTable.years, language)}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.maleNS}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.maleS}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.femaleNS}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.femaleS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-4">{pt(t.premiumTable.footnote, language)}</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── TOP 6 TERM PLANS ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(t.topPlans.heading, language)} <span className="gradient-text">{pt(t.topPlans.headingHighlight, language)}</span> {pt(t.topPlans.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">{pt(t.topPlans.desc, language)}</p>
          <div className="glass-card rounded-xl p-6 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(t.topPlans.thInsurer, language)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{pt(t.topPlans.thPlan, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(t.topPlans.thCsr, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(t.topPlans.thPremium, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{pt(t.topPlans.thClaimTime, language)}</th>
                </tr>
              </thead>
              <tbody>
                {topPlans.map((plan, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors relative">
                    <td className="py-3 px-4 text-sm font-medium">
                      {plan.insurer}
                      {plan.aiPick && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
                          {pt(t.topPlans.aiPick, language)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{plan.plan}</td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">{plan.csr}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{plan.premium}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{plan.claimTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-4">
              {pt(t.topPlans.footnote, language)}{' '}
              <Link href="/free-audit" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                {pt(t.topPlans.reverseAudit, language)}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── KEY RIDERS ───────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(t.riders.heading, language)} <span className="gradient-text">{pt(t.riders.headingHighlight, language)}</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">{pt(t.riders.desc, language)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: pt(t.riders.rider1Name, language), desc: pt(t.riders.rider1Desc, language), icon: riderIcons[0] },
              { name: pt(t.riders.rider2Name, language), desc: pt(t.riders.rider2Desc, language), icon: riderIcons[1] },
              { name: pt(t.riders.rider3Name, language), desc: pt(t.riders.rider3Desc, language), icon: riderIcons[2] },
              { name: pt(t.riders.rider4Name, language), desc: pt(t.riders.rider4Desc, language), icon: riderIcons[3] },
            ].map((rider, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-3">{rider.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{rider.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{rider.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── TAX BENEFITS ─────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            {pt(t.tax.heading, language)} <span className="gradient-text">{pt(t.tax.headingHighlight, language)}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 80C */}
            <div className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="text-sm font-semibold text-primary">{pt(t.tax.section80c, language)}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{pt(t.tax.sec80cTitle, language)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{pt(t.tax.sec80cDesc, language)}</p>
              <ul className="space-y-2">
                {[pt(t.tax.sec80c_1, language), pt(t.tax.sec80c_2, language), pt(t.tax.sec80c_3, language), pt(t.tax.sec80c_4, language)].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Section 10(10D) */}
            <div className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="text-sm font-semibold text-primary">{pt(t.tax.section1010d, language)}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{pt(t.tax.sec1010dTitle, language)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{pt(t.tax.sec1010dDesc, language)}</p>
              <ul className="space-y-2">
                {[pt(t.tax.sec1010d_1, language), pt(t.tax.sec1010d_2, language), pt(t.tax.sec1010d_3, language), pt(t.tax.sec1010d_4, language)].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 5-STEP GUIDE ─────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(t.steps.heading, language)} <span className="gradient-text">{pt(t.steps.headingHighlight, language)}</span> {pt(t.steps.headingSuffix, language)}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">{pt(t.steps.desc, language)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: "1", title: pt(t.steps.step1Title, language), desc: pt(t.steps.step1Desc, language) },
              { step: "2", title: pt(t.steps.step2Title, language), desc: pt(t.steps.step2Desc, language) },
              { step: "3", title: pt(t.steps.step3Title, language), desc: pt(t.steps.step3Desc, language) },
              { step: "4", title: pt(t.steps.step4Title, language), desc: pt(t.steps.step4Desc, language) },
              { step: "5", title: pt(t.steps.step5Title, language), desc: pt(t.steps.step5Desc, language) },
            ].map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 text-center flex flex-col hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-[#081221] font-bold text-lg mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── CSR IMPORTANCE ───────────────────────────────────────────────── */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            {pt(t.csr.heading, language)} <span className="gradient-text">{pt(t.csr.headingHighlight, language)}</span> {pt(t.csr.headingSuffix, language)}
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">{pt(t.csr.para1, language)}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{pt(t.csr.para2, language)}</p>
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h3 className="text-xl font-semibold mb-2">{pt(t.csr.tipTitle, language)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{pt(t.csr.tipDesc, language)}</p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-card/50" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {pt(t.faq.heading, language)} <span className="gradient-text">{pt(t.faq.headingHighlight, language)}</span>
            </h2>
            <p className="text-muted-foreground">{pt(t.faq.desc, language)}</p>
          </div>
          <div className="space-y-4">
            {faqsTranslated.map((faq, idx) => (
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

      <SectionDivider />

      {/* ── EXPERT INSIGHT ───────────────────────────────────────────────── */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            {pt(t.expert.heading, language)} <span className="gradient-text">{pt(t.expert.headingHighlight, language)}</span>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center text-[#081221] font-bold text-2xl">HP</div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{pt(t.expert.name, language)}</h3>
                <p className="text-sm text-muted-foreground mb-1">{pt(t.expert.role, language)}</p>
                <p className="text-sm text-muted-foreground mb-4">{pt(t.expert.founder, language)}</p>
                <div className="border-l-4 border-cyan-500 pl-4 mb-4">
                  <p className="text-muted-foreground leading-relaxed italic">{pt(t.expert.quote, language)}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20term%20insurance" target="_blank" rel="noopener noreferrer">
                    <ShinyButton variant="blue"><span>{pt(t.expert.ctaWhatsApp, language)}</span></ShinyButton>
                  </a>
                  <Link href="/free-audit">
                    <ShinyButton variant="secondary"><span>{pt(t.expert.ctaAudit, language)}</span></ShinyButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── RELATED GUIDES ───────────────────────────────────────────────── */}
      <section className="py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            {pt(t.related.heading, language)} <span className="gradient-text">{pt(t.related.headingHighlight, language)}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/health-insurance" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{pt(t.related.guide1Title, language)}</h3>
              <p className="text-muted-foreground text-sm">{pt(t.related.guide1Desc, language)}</p>
            </Link>
            <Link href="/claim-guide" className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{pt(t.related.guide2Title, language)}</h3>
              <p className="text-muted-foreground text-sm">{pt(t.related.guide2Desc, language)}</p>
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pt(t.cta.heading, language)} <span className="gradient-text">{pt(t.cta.headingHighlight, language)}</span> {pt(t.cta.headingSuffix, language)}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(t.cta.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20want%20a%20personalized%20term%20insurance%20recommendation" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue"><span>{pt(t.cta.ctaWhatsApp, language)}</span></ShinyButton>
            </a>
            <Link href="/free-audit">
              <ShinyButton variant="secondary"><span>{pt(t.cta.ctaCompare, language)}</span></ShinyButton>
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{pt(t.cta.byline, language)}</p>
        </div>
      </section>
    </div>
  );
}
