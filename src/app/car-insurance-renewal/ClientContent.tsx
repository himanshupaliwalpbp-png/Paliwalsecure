'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import type { Language } from '@/lib/i18n';

// ── Inline Translation Map ─────────────────────────────────────────────
type T = { en: string; hi: string; hinglish: string };
const pt = (obj: T, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "Save Up to 50%", hi: "50% तक बचत करें", hinglish: "50% tak Bachat karein" },
    title: { en: "Car Insurance Renewal Guide", hi: "कार बीमा नवीनीकरण गाइड", hinglish: "Car Insurance Renewal Guide" },
    titleHighlight: { en: "Save Up to 50% with NCB", hi: "NCB से 50% तक बचत करें", hinglish: "NCB se 50% tak Bachat karein" },
    description: {
      en: "Your complete guide to car insurance renewal in India. Learn the 5-step renewal process, understand NCB discounts, reduce your premium, and avoid common mistakes that cost you thousands.",
      hi: "भारत में कार बीमा नवीनीकरण की पूरी गाइड। 5-स्टेप नवीनीकरण प्रक्रिया सीखें, NCB छूट समझें, प्रीमियम कम करें, और आम गलतियों से बचें जो आपको हज़ारों का नुकसान दिलाती हैं।",
      hinglish: "India mein car insurance renewal ki complete guide. 5-step renewal process seekhein, NCB discount samjhein, premium kam karein, aur aam galtiyon se bachein jo aapko hazaron ka nuksaan dilati hain."
    },
    ctaWhatsApp: { en: "Get Renewal Help on WhatsApp", hi: "WhatsApp पर नवीनीकरण सहायता प्राप्त करें", hinglish: "WhatsApp pe Renewal Help Lo" },
    ctaAudit: { en: "AI Audit My Car Policy", hi: "AI मेरी कार पॉलिसी ऑडिट करे", hinglish: "AI Mera Car Policy Audit Kare" },
  },

  steps: {
    heading: { en: "Car Insurance Renewal", hi: "कार बीमा नवीनीकरण", hinglish: "Car Insurance Renewal" },
    headingHighlight: { en: "5 Simple Steps", hi: "5 आसान स्टेप्स", hinglish: "5 Simple Steps" },
    step1: {
      title: { en: "Check Your Current Policy Details", hi: "अपनी वर्तमान पॉलिसी विवरण जांचें", hinglish: "Apni Current Policy Details Check Karein" },
      description: {
        en: "Before renewal, review your existing policy: sum insured (IDV), add-ons, NCB slab, and any pending claims. Your IDV depreciates each year — ensure it is calculated correctly. A higher IDV means better payout but slightly higher premium; a lower IDV saves premium but reduces claim amount.",
        hi: "नवीनीकरण से पहले, अपनी मौजूदा पॉलिसी की समीक्षा करें: बीमा राशि (IDV), ऐड-ऑन, NCB स्लैब, और कोई लंबित क्लेम। आपका IDV हर साल कम होता है — सुनिश्चित करें कि यह सही गणना किया गया है। अधिक IDV का मतलब बेहतर भुगतान लेकिन थोड़ी अधिक प्रीमियम; कम IDV प्रीमियम बचाता है लेकिन क्लेम राशि कम करता है।",
        hinglish: "Renewal se pehle, apni existing policy review karein: sum insured (IDV), add-ons, NCB slab, aur koi pending claims. Aapka IDV har saal kam hota hai — ensure karein ki yeh sahi calculate hua ho. Zyada IDV ka matlab better payout lekin thodi zyada premium; kam IDV premium bachata hai lekin claim amount reduce karta hai."
      },
      tips: [
        { en: "Verify your car's current IDV using the IRDAI depreciation schedule", hi: "IRDAI मूल्यह्रास अनुसूची का उपयोग करके अपनी कार का वर्तमान IDV सत्यापित करें", hinglish: "IRDAI depreciation schedule use karke apni car ka current IDV verify karein" },
        { en: "Check if your NCB certificate is valid and at the correct slab", hi: "जांचें कि आपका NCB प्रमाणपत्र मान्य है और सही स्लैब पर है", hinglish: "Check karein ki aapka NCB certificate valid hai aur sahi slab pe hai" },
        { en: "Review which add-ons you actually used in the past year", hi: "समीक्षा करें कि आपने पिछले वर्ष कौन से ऐड-ऑन वास्तव में उपयोग किए", hinglish: "Review karein ki aapne pichle saal kaun se add-ons actually use kiye" },
        { en: "Compare your current insurer's renewal quote with competitors", hi: "अपने वर्तमान बीमाकर्ता के नवीनीकरण कोट की प्रतिस्पर्धियों से तुलना करें", hinglish: "Apne current insurer ke renewal quote ko competitors se compare karein" },
      ],
    },
    step2: {
      title: { en: "Compare Quotes from Multiple Insurers", hi: "कई बीमाकर्ताओं से कोट तुलना करें", hinglish: "Multiple Insurers se Quotes Compare Karein" },
      description: {
        en: "Do not auto-renew without comparing. Premiums for the same car can vary by 30-50% across insurers. Use our AI-powered comparison tool to get instant quotes from 20+ insurers. You can port to a new insurer while retaining your NCB — the process is seamless and IRDAI-regulated.",
        hi: "तुलना किए बिना ऑटो-नवीनीकरण न करें। एक ही कार के लिए प्रीमियम बीमाकर्ताओं में 30-50% तक भिन्न हो सकती है। हमारे AI-संचालित तुलना टूल का उपयोग करके 20+ बीमाकर्ताओं से तुरंत कोट प्राप्त करें। आप अपना NCB बनाए रखते हुए नए बीमाकर्ता के पास पोर्ट कर सकते हैं — प्रक्रिया निर्बाध और IRDAI-विनियमित है।",
        hinglish: "Compare kiye bina auto-renew mat karein. Same car ke liye premiums insurers mein 30-50% tak different ho sakti hain. Humare AI-powered comparison tool use karke 20+ insurers se instant quotes lo. Aap apna NCB retain karte hue naye insurer ke paas port kar sakte hain — process seamless aur IRDAI-regulated hai."
      },
      tips: [
        { en: "Get at least 3-4 quotes before deciding", hi: "निर्णय लेने से पहले कम से कम 3-4 कोट प्राप्त करें", hinglish: "Decide karne se pehle kam se kam 3-4 quotes lo" },
        { en: "Compare on IDV, not just premium — a cheaper quote may have a lower IDV", hi: "केवल प्रीमियम नहीं, IDV पर तुलना करें — सस्ता कोट में कम IDV हो सकता है", hinglish: "Sirf premium nahi, IDV pe compare karein — sasta quote mein kam IDV ho sakta hai" },
        { en: "Check claim settlement ratio and network garage count", hi: "क्लेम निपटान अनुपात और नेटवर्क गैराज की संख्या जांचें", hinglish: "Claim settlement ratio aur network garage count check karein" },
        { en: "Look for discounts: anti-theft device, AAI membership, voluntary deductible", hi: "छूट खोजें: एंटी-थेफ्ट डिवाइस, AAI सदस्यता, स्वैच्छिक डिडक्टिबल", hinglish: "Discounts dhoondhein: anti-theft device, AAI membership, voluntary deductible" },
      ],
    },
    step3: {
      title: { en: "Choose the Right Add-Ons", hi: "सही ऐड-ऑन चुनें", hinglish: "Sahi Add-Ons Choose Karein" },
      description: {
        en: "Add-ons enhance your coverage but increase premium. Select only what you need. Zero Depreciation is the most valuable add-on — it covers full repair cost without depreciation deduction. Engine Protect is essential if you live in a flood-prone area. Roadside Assistance is useful for highway travelers.",
        hi: "ऐड-ऑन आपके कवरेज को बढ़ाते हैं लेकिन प्रीमियम बढ़ाते हैं। केवल आवश्यक चुनें। ज़ीरो डेप्रिसिएशन सबसे मूल्यवान ऐड-ऑन है — यह मूल्यह्रास कटौती के बिना पूरी मरम्मत लागत कवर करता है। इंजन प्रोटेक्ट आवश्यक है यदि आप बाढ़-प्रवण क्षेत्र में रहते हैं। रोडसाइड असिस्टेंस हाईवे यात्रियों के लिए उपयोगी है।",
        hinglish: "Add-ons aapka coverage badhate hain lekin premium increase karte hain. Sirf zaroori wale choose karein. Zero Depreciation sabse valuable add-on hai — yeh depreciation deduction ke bina full repair cost cover karta hai. Engine Protect zaroori hai agar aap flood-prone area mein rehte hain. Roadside Assistance highway travelers ke liye useful hai."
      },
      tips: [
        { en: "Zero Depreciation: Must-have for cars under 5 years old", hi: "ज़ीरो डेप्रिसिएशन: 5 साल से कम उम्र की कारों के लिए ज़रूरी", hinglish: "Zero Depreciation: 5 saal se kam umar ki gaadiyon ke liye must-have" },
        { en: "Engine Protect: Essential if your area gets waterlogged", hi: "इंजन प्रोटेक्ट: यदि आपके क्षेत्र में पानी भर जाता है तो आवश्यक", hinglish: "Engine Protect: Zaroori agar aapke area mein paani bhhar jaata hai" },
        { en: "Roadside Assistance: Useful for long-distance drivers", hi: "रोडसाइड असिस्टेंस: लंबी दूरी के ड्राइवरों के लिए उपयोगी", hinglish: "Roadside Assistance: Long-distance drivers ke liye useful" },
        { en: "Return to Invoice: Important for new cars (first 3 years)", hi: "रिटर्न टू इनवॉइस: नई कारों के लिए महत्वपूर्ण (पहले 3 साल)", hinglish: "Return to Invoice: Naye gaadiyon ke liye important (pehle 3 saal)" },
        { en: "Skip add-ons you did not use in previous years to save premium", hi: "पिछले वर्षों में जो ऐड-ऑन उपयोग नहीं किए, उन्हें छोड़कर प्रीमियम बचाएं", hinglish: "Jin add-ons ko pichle saalon mein use nahi kiya, unhe skip karke premium bachayein" },
      ],
    },
    step4: {
      title: { en: "Apply Your NCB Discount", hi: "अपनी NCB छूट लागू करें", hinglish: "Apni NCB Discount Apply Karein" },
      description: {
        en: "No Claim Bonus (NCB) is the single biggest discount on your car insurance renewal. It rewards you for claim-free years with discounts from 20% to 50% on own damage premium. Your NCB slab increases every claim-free year. Even if you switch insurers, your NCB travels with you via the NCB certificate.",
        hi: "नो क्लेम बोनस (NCB) आपके कार बीमा नवीनीकरण पर सबसे बड़ी छूट है। यह आपको क्लेम-मुक्त वर्षों के लिए ओन डैमेज प्रीमियम पर 20% से 50% तक की छूट देता है। आपका NCB स्लैब हर क्लेम-मुक्त वर्ष बढ़ता है। यदि आप बीमाकर्ता बदलते भी हैं, तो आपका NCB NCB प्रमाणपत्र के माध्यम से आपके साथ चलता है।",
        hinglish: "No Claim Bonus (NCB) aapke car insurance renewal pe sabse badi discount hai. Yeh aapko claim-free saalon ke liye own damage premium pe 20% se 50% tak discount deta hai. Aapka NCB slab har claim-free saal badhta hai. Agar aap insurer badalte bhi hain, toh aapka NCB NCB certificate ke through aapke saath chalta hai."
      },
      tips: [
        { en: "Never make small claims — you will lose your NCB slab", hi: "कभी छोटे क्लेम न करें — आप अपना NCB स्लैब खो देंगे", hinglish: "Kabhi chhote claims mat karein — aap apna NCB slab khoyenge" },
        { en: "NCB is linked to the owner, not the car — it transfers when you sell", hi: "NCB मालिक से जुड़ा है, कार से नहीं — बेचने पर यह स्थानांतरित होता है", hinglish: "NCB owner se juda hai, car se nahi — bechne pe yeh transfer hota hai" },
        { en: "Get an NCB retention letter if selling your car (valid for 3 years)", hi: "कार बेचने पर NCB रिटेंशन लेटर प्राप्त करें (3 साल तक मान्य)", hinglish: "Car bechne pe NCB retention letter lo (3 saal tak valid)" },
        { en: "NCB applies only to own damage premium, not third-party premium", hi: "NCB केवल ओन डैमेज प्रीमियम पर लागू होता है, थर्ड-पार्टी प्रीमियम पर नहीं", hinglish: "NCB sirf own damage premium pe lagu hota hai, third-party premium pe nahi" },
      ],
    },
    step5: {
      title: { en: "Pay & Download Your New Policy", hi: "भुगतान करें और नई पॉलिसी डाउनलोड करें", hinglish: "Pay Karein aur Naye Policy Download Karein" },
      description: {
        en: "Once you have compared, selected add-ons, and applied NCB, make the payment online. Your new policy PDF is generated instantly and emailed to you. Keep both digital and print copies in your car. IRDAI mandates that the new policy starts from the day the old one expires — no gap in coverage.",
        hi: "एक बार जब आपने तुलना कर ली, ऐड-ऑन चुन लिए, और NCB लागू कर लिया, तो ऑनलाइन भुगतान करें। आपकी नई पॉलिसी PDF तुरंत बनकर आपको ईमेल होती है। डिजिटल और प्रिंट दोनों कॉपी अपनी कार में रखें। IRDAI अनिवार्य करता है कि नई पॉलिसी पुरानी पॉलिसी की समाप्ति के दिन से शुरू हो — कवरेज में कोई अंतर नहीं।",
        hinglish: "Ek baar jab aapne compare kar liya, add-ons chun liye, aur NCB apply kar liya, toh online payment karein. Aapki nayi policy PDF turant ban kar aapko email hoti hai. Digital aur print dono copy apni car mein rakhein. IRDAI mandate karta hai ki nayi policy purani policy ke expiry din se shuru ho — coverage mein koi gap nahi."
      },
      tips: [
        { en: "Renew at least 7 days before expiry to avoid any coverage gap", hi: "किसी भी कवरेज अंतर से बचने के लिए समाप्ति से कम से कम 7 दिन पहले नवीनीकरण करें", hinglish: "Kisi bhi coverage gap se bachne ke liye expiry se kam se kam 7 din pehle renew karein" },
        { en: "Save the policy PDF on your phone for easy access during claims", hi: "क्लेम के दौरान आसान पहुंच के लिए पॉलिसी PDF अपने फ़ोन पर सेव करें", hinglish: "Claim ke dauraan aasan pahunch ke liye policy PDF apne phone pe save karein" },
        { en: "Keep the old policy document for NCB reference", hi: "NCB संदर्भ के लिए पुराना पॉलिसी दस्तावेज़ रखें", hinglish: "NCB reference ke liye purana policy document rakhein" },
        { en: "Update your car's fitness certificate and PUC if they are also expiring", hi: "यदि आपका फिटनेस प्रमाणपत्र और PUC भी समाप्त हो रहे हैं तो उन्हें अपडेट करें", hinglish: "Agar aapka fitness certificate aur PUC bhi expire ho rahe hain toh update karein" },
      ],
    },
  },

  ncb: {
    heading: { en: "NCB (No Claim Bonus)", hi: "NCB (नो क्लेम बोनस)", hinglish: "NCB (No Claim Bonus)" },
    headingHighlight: { en: "How It Saves You 50%", hi: "यह 50% कैसे बचाता है", hinglish: "Yeh 50% Kaise Bachata Hai" },
    description: {
      en: "NCB is the biggest discount available on car insurance renewal. It rewards you for not making claims — the longer you go claim-free, the bigger the discount on your own damage premium. Here is the IRDAI-mandated NCB slab:",
      hi: "NCB कार बीमा नवीनीकरण पर उपलब्ध सबसे बड़ी छूट है। यह आपको क्लेम न करने के लिए पुरस्कृत करता है — जितने अधिक क्लेम-मुक्त वर्ष, ओन डैमेज प्रीमियम पर उतनी बड़ी छूट। यहाँ IRDAI-अनिवार्य NCB स्लैब है:",
      hinglish: "NCB car insurance renewal pe available sabse badi discount hai. Yeh aapko claim na karne ke liye reward karta hai — jitne zyada claim-free saal, utni badi discount own damage premium pe. Yahan IRDAI-mandated NCB slab hai:"
    },
    thClaimFree: { en: "Claim-Free Years", hi: "क्लेम-मुक्त वर्ष", hinglish: "Claim-Free Saal" },
    thDiscount: { en: "NCB Discount", hi: "NCB छूट", hinglish: "NCB Discount" },
    thSaving: { en: "Example Saving on OD Premium", hi: "OD प्रीमियम पर उदाहरण बचत", hinglish: "OD Premium pe Example Saving" },
    year: { en: "year", hi: "साल", hinglish: "saal" },
    years: { en: "years", hi: "साल", hinglish: "saal" },
    importantRules: { en: "Important NCB Rules:", hi: "महत्वपूर्ण NCB नियम:", hinglish: "Important NCB Rules:" },
    rules: [
      { en: "NCB applies only to Own Damage (OD) premium, not Third-Party (TP) premium", hi: "NCB केवल ओन डैमेज (OD) प्रीमियम पर लागू होता है, थर्ड-पार्टी (TP) प्रीमियम पर नहीं", hinglish: "NCB sirf Own Damage (OD) premium pe lagu hota hai, Third-Party (TP) premium pe nahi" },
      { en: "NCB is linked to the vehicle owner, not the vehicle — it transfers when you sell your car", hi: "NCB वाहन मालिक से जुड़ा है, वाहन से नहीं — कार बेचने पर यह स्थानांतरित होता है", hinglish: "NCB vehicle owner se juda hai, vehicle se nahi — car bechne pe yeh transfer hota hai" },
      { en: "A single claim resets your NCB to 0% — think twice before making small claims", hi: "एक ही क्लेम आपका NCB 0% पर रीसेट कर देता है — छोटे क्लेम करने से पहले दो बार सोचें", hinglish: "Ek hi claim aapka NCB 0% pe reset kar deta hai — chhote claim karne se pehle do baar sochein" },
      { en: "NCB retention certificate is valid for 3 years from the date of policy expiry", hi: "NCB रिटेंशन प्रमाणपत्र पॉलिसी समाप्ति की तारीख से 3 साल तक मान्य है", hinglish: "NCB retention certificate policy expiry date se 3 saal tak valid hai" },
      { en: "NCB travels with you when you switch insurers at renewal time", hi: "नवीनीकरण के समय बीमाकर्ता बदलने पर NCB आपके साथ चलता है", hinglish: "Renewal ke time insurer badalne pe NCB aapke saath chalta hai" },
    ],
    calculatorTitle: { en: "NCB Savings Calculator", hi: "NCB बचत कैलकुलेटर", hinglish: "NCB Savings Calculator" },
    calculatorDesc: { en: "See how much you can save on your car insurance renewal with NCB", hi: "देखें कि NCB के साथ आप अपने कार बीमा नवीनीकरण पर कितनी बचत कर सकते हैं", hinglish: "Dekhein ki NCB ke saath aap apne car insurance renewal pe kitni bachat kar sakte hain" },
    odPremiumLabel: { en: "Your OD Premium (₹)", hi: "आपका OD प्रीमियम (₹)", hinglish: "Aapka OD Premium (₹)" },
    ncbSlabLabel: { en: "Your NCB Slab", hi: "आपका NCB स्लैब", hinglish: "Aapka NCB Slab" },
    youSave: { en: "You Save", hi: "आपकी बचत", hinglish: "Aapki Bachat" },
    youPay: { en: "You Pay (OD)", hi: "आप भुगतान करें (OD)", hinglish: "Aap Pay Karein (OD)" },
  },

  tips: {
    heading: { en: "Tips to", hi: "टिप्स", hinglish: "Tips" },
    headingHighlight: { en: "Reduce Premium", hi: "प्रीमियम कम करें", hinglish: "Premium Kam Karein" },
    headingSuffix: { en: "on Renewal", hi: "नवीनीकरण पर", hinglish: "Renewal pe" },
    items: [
      {
        title: { en: "Increase Voluntary Deductible", hi: "स्वैच्छिक डिडक्टिबल बढ़ाएं", hinglish: "Voluntary Deductible Badhayein" },
        desc: {
          en: "A voluntary deductible is the amount you agree to pay out-of-pocket during a claim. Opting for ₹5,000 – ₹15,000 voluntary deductible can reduce your premium by 15-25%. Only choose this if you can afford the upfront amount during claims.",
          hi: "स्वैच्छिक डिडक्टिबल वह राशि है जो आप क्लेम के दौरान अपनी जेब से भुगतान करने के लिए सहमत होते हैं। ₹5,000 – ₹15,000 स्वैच्छिक डिडक्टिबल चुनने से आपकी प्रीमियम 15-25% कम हो सकती है। केवल तभी चुनें जब आप क्लेम के दौरान अग्रिम राशि का भुगतान कर सकें।",
          hinglish: "Voluntary deductible woh rakam hai jo aap claim ke dauraan apni jeb se bhugtan karne ke liye sehmate hain. ₹5,000 – ₹15,000 voluntary deductible chunne se aapki premium 15-25% kam ho sakti hai. Sirf tabhi chunein jab aap claim ke dauraan upfront amount ka bhugtan kar sakein."
        },
        aiRecommended: true,
      },
      {
        title: { en: "Install Anti-Theft Devices", hi: "एंटी-थेफ्ट डिवाइस लगाएं", hinglish: "Anti-Theft Devices Lagayein" },
        desc: {
          en: "IRDAI mandates a discount of 2.5% on own damage premium if your car has an ARAI-approved anti-theft device. Most modern cars come with factory-fitted immobilizers that qualify. Submit the ARAI certificate to your insurer.",
          hi: "IRDAI अनिवार्य करता है कि यदि आपकी कार में ARAI-अनुमोदित एंटी-थेफ्ट डिवाइस है तो ओन डैमेज प्रीमियम पर 2.5% छूट। अधिकांश आधुनिक कारों में फैक्ट्री-फिटेड इमोबिलाइज़र होते हैं जो योग्य हैं। अपने बीमाकर्ता को ARAI प्रमाणपत्र जमा करें।",
          hinglish: "IRDAI mandate karta hai ki agar aapki car mein ARAI-approved anti-theft device hai toh own damage premium pe 2.5% discount. Aksar modern cars mein factory-fitted immobilizers hote hain jo qualify karte hain. Apne insurer ko ARAI certificate submit karein."
        },
        aiRecommended: false,
      },
      {
        title: { en: "Become an AAI Member", hi: "AAI सदस्य बनें", hinglish: "AAI Member Banein" },
        desc: {
          en: "Membership in the Automobile Association of India (AAI) gives you a discount on own damage premium. The discount is small (typically ₹200-500) but it adds up over the years along with other discounts.",
          hi: "ऑटोमोबाइल एसोसिएशन ऑफ इंडिया (AAI) की सदस्यता आपको ओन डैमेज प्रीमियम पर छूट देती है। छूट छोटी है (आमतौर पर ₹200-500) लेकिन यह अन्य छूटों के साथ सालों में जुड़ जाती है।",
          hinglish: "Automobile Association of India (AAI) ki membership aapko own damage premium pe discount deti hai. Discount chhoti hai (usually ₹200-500) lekin yeh dusri discounts ke saath saalon mein jud jaati hai."
        },
        aiRecommended: false,
      },
      {
        title: { en: "Avoid Small Claims", hi: "छोटे क्लेम से बचें", hinglish: "Chhote Claims se Bachein" },
        desc: {
          en: "Making a claim for minor dents and scratches resets your NCB to zero. A ₹3,000 claim can cost you ₹5,000+ in lost NCB discount over the next renewal. Pay for small repairs yourself and preserve your NCB slab.",
          hi: "मामूली डेंट और खरोंच के लिए क्लेम करने से आपका NCB शून्य पर रीसेट हो जाता है। ₹3,000 का क्लेम अगले नवीनीकरण में खोई हुई NCB छूट में ₹5,000+ का खर्च करा सकता है। छोटी मरम्मत स्वयं कराएं और अपना NCB स्लैब बनाए रखें।",
          hinglish: "Minor dents aur scratches ke liye claim karne se aapka NCB zero pe reset ho jaata hai. ₹3,000 ka claim agle renewal mein khoi hui NCB discount mein ₹5,000+ ka kharcha kara sakta hai. Chhoti repair khud karayein aur apna NCB slab bachayein."
        },
        aiRecommended: true,
      },
      {
        title: { en: "Opt for Long-Term Third-Party Cover", hi: "दीर्घकालिक थर्ड-पार्टी कवर चुनें", hinglish: "Long-Term Third-Party Cover Choose Karein" },
        desc: {
          en: "IRDAI offers 3-year third-party policies for private cars. Locking in the TP rate for 3 years protects you from annual TP premium hikes. The savings can be significant, especially with IRDAI increasing TP rates regularly.",
          hi: "IRDAI निजी कारों के लिए 3-साल की थर्ड-पार्टी पॉलिसी प्रदान करता है। 3 साल के लिए TP दर लॉक करने से आप वार्षिक TP प्रीमियम वृद्धि से सुरक्षित रहते हैं। बचत महत्वपूर्ण हो सकती है, विशेषकर जब IRDAI नियमित रूप से TP दरें बढ़ाता है।",
          hinglish: "IRDAI private cars ke liye 3-saal ki third-party policy provide karta hai. 3 saal ke liye TP rate lock karne se aap annual TP premium hike se surakshit rehte hain. Savings significant ho sakti hai, especially jab IRDAI regularly TP rates badhata hai."
        },
        aiRecommended: false,
      },
      {
        title: { en: "Compare & Port Every Year", hi: "हर साल तुलना करें और पोर्ट करें", hinglish: "Har Saal Compare aur Port Karein" },
        desc: {
          en: "Loyalty does not pay in car insurance. New customers often get better rates than renewals. Compare quotes every year and port to the insurer offering the best value. Your NCB travels with you — do not let it go unused.",
          hi: "कार बीमा में वफ़ादारी लाभदायक नहीं है। नए ग्राहकों को अक्सर नवीनीकरण से बेहतर दरें मिलती हैं। हर साल कोट की तुलना करें और सर्वोत्तम मूल्य देने वाले बीमाकर्ता के पास पोर्ट करें। आपका NCB आपके साथ चलता है — इसे अप्रयुक्त मत छोड़ें।",
          hinglish: "Car insurance mein loyalty faydemand nahi hai. Naye customers ko aksar renewals se better rates milti hain. Har saal quotes compare karein aur best value dene wale insurer ke paas port karein. Aapka NCB aapke saath chalta hai — ise unused mat chodiye."
        },
        aiRecommended: true,
      },
    ],
  },

  missRenewal: {
    heading: { en: "What Happens If You", hi: "क्या होता है यदि आप", hinglish: "Kya Hota Hai Agar Aap" },
    headingHighlight: { en: "Miss the Renewal Date?", hi: "नवीनीकरण तिथि छूट जाए?", hinglish: "Renewal Date Miss Kar Dein?" },
    grace: {
      title: { en: "Within Grace Period (0-30 days after expiry)", hi: "ग्रेस पीरियड के भीतर (समाप्ति के बाद 0-30 दिन)", hinglish: "Grace Period ke Andar (expiry ke baad 0-30 din)" },
      desc: {
        en: "Most insurers offer a 30-day grace period. You can renew with your NCB intact. No inspection required. Coverage is continuous. However, your car is uninsured during this period — any accident will not be covered.",
        hi: "अधिकांश बीमाकर्ता 30 दिन की ग्रेस पीरियड देते हैं। आप अपना NCB बरकरार रखते हुए नवीनीकरण कर सकते हैं। निरीक्षण आवश्यक नहीं। कवरेज निरंतर है। हालांकि, इस अवधि में आपकी कार अबीमित है — कोई भी दुर्घटना कवर नहीं होगी।",
        hinglish: "Aksar insurers 30 din ki grace period dete hain. Aap apna NCB intact rakhte hue renew kar sakte hain. Inspection zaroori nahi. Coverage continuous hai. Lekin, is period mein aapki car uninsured hai — koi bhi accident cover nahi hoga."
      },
    },
    lapse: {
      title: { en: "After Grace Period (30-90 days)", hi: "ग्रेस पीरियड के बाद (30-90 दिन)", hinglish: "Grace Period ke Baad (30-90 din)" },
      desc: {
        en: "Your policy has lapsed. You lose your accumulated NCB. A vehicle inspection is mandatory before a new policy is issued. Some insurers may offer reduced NCB (slab drops by one level) if you renew within 90 days, but this varies.",
        hi: "आपकी पॉलिसी समाप्त हो गई है। आप अपना संचित NCB खो देते हैं। नई पॉलिसी जारी होने से पहले वाहन निरीक्षण अनिवार्य है। कुछ बीमाकर्ता 90 दिनों के भीतर नवीनीकरण पर कम NCB (स्लैब एक स्तर गिरता है) दे सकते हैं, लेकिन यह भिन्न होता है।",
        hinglish: "Aapki policy lapse ho gayi hai. Aap apna accumulated NCB kho dete hain. Nayi policy issue hone se pehle vehicle inspection mandatory hai. Kuch insurers 90 dino ke andar renewal pe reduced NCB (slab ek level girta hai) de sakte hain, lekin yeh vary karta hai."
      },
    },
    expired: {
      title: { en: "Beyond 90 Days", hi: "90 दिनों के बाद", hinglish: "90 Dino ke Baad" },
      desc: {
        en: "Complete lapse. NCB is lost entirely. You need a fresh policy with vehicle inspection. Driving without insurance attracts fines of ₹2,000 – ₹4,000 under the Motor Vehicles Act (2019 amendment). Repeat offenders face imprisonment up to 3 months.",
        hi: "पूर्ण समाप्ति। NCB पूरी तरह खो जाता है। आपको वाहन निरीक्षण के साथ नई पॉलिसी चाहिए। बिना बीमा ड्राइव करने पर मोटर वाहन अधिनियम (2019 संशोधन) के तहत ₹2,000 – ₹4,000 जुर्माना होता है। दोहराने वाले अपराधियों को 3 महीने तक कारावास का सामना करना पड़ता है।",
        hinglish: "Complete lapse. NCB poora kho jaata hai. Aapko vehicle inspection ke saath fresh policy chahiye. Bina insurance drive karne pe Motor Vehicles Act (2019 amendment) ke tahat ₹2,000 – ₹4,000 jurmana hota hai. Repeat offenders ko 3 mahine tak imprisonment ka samna karna padta hai."
      },
    },
  },

  related: {
    heading: { en: "Related", hi: "संबंधित", hinglish: "Related" },
    headingHighlight: { en: "Guides", hi: "गाइड", hinglish: "Guides" },
    carInsurance: { en: "Car Insurance Guide →", hi: "कार बीमा गाइड →", hinglish: "Car Insurance Guide →" },
    carInsuranceDesc: {
      en: "Complete guide to car insurance in India — types, coverage, claims, and how to choose the right plan.",
      hi: "भारत में कार बीमे की पूरी गाइड — प्रकार, कवरेज, क्लेम, और सही योजना कैसे चुनें।",
      hinglish: "India mein car insurance ki complete guide — types, coverage, claims, aur sahi plan kaise choose karein."
    },
    zeroDep: { en: "Zero Dep Car Insurance →", hi: "ज़ीरो डेप कार बीमा →", hinglish: "Zero Dep Car Insurance →" },
    zeroDepDesc: {
      en: "Understand zero depreciation cover — how it works, who should buy it, and how much it saves during claims.",
      hi: "ज़ीरो डेप्रिसिएशन कवर समझें — यह कैसे काम करता है, किसे खरीदना चाहिए, और क्लेम के दौरान कितनी बचत होती है।",
      hinglish: "Zero depreciation cover samjhein — yeh kaise kaam karta hai, kise khareedna chahiye, aur claim ke dauraan kitni bachat hoti hai."
    },
  },

  faq: {
    heading: { en: "Car Insurance Renewal", hi: "कार बीमा नवीनीकरण", hinglish: "Car Insurance Renewal" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    description: {
      en: "Frequently asked questions about car insurance renewal in India.",
      hi: "भारत में कार बीमा नवीनीकरण के बारे में अक्सर पूछे जाने वाले सवाल।",
      hinglish: "India mein car insurance renewal ke baare mein aksar puche jaane wale sawaal."
    },
    items: [
      {
        q: { en: "What happens if I miss my car insurance renewal date?", hi: "यदि मैं अपनी कार बीमा नवीनीकरण तिथि छूट जाऊं तो क्या होता है?", hinglish: "Agar main apni car insurance renewal date miss kar doon toh kya hota hai?" },
        a: { en: "If you miss the renewal date, you get a 30-day grace period (varies by insurer) during which you can renew with your NCB intact. After the grace period, your policy lapses, you lose your NCB, and your car must be inspected before a new policy is issued. Driving without insurance is illegal under the Motor Vehicles Act — fines range from ₹2,000 to ₹4,000.", hi: "यदि आप नवीनीकरण तिथि छूट जाती है, तो आपको 30 दिन की ग्रेस पीरियड मिलती है (बीमाकर्ता अनुसार भिन्न) जिसमें आप अपना NCB बरकरार रखते हुए नवीनीकरण कर सकते हैं। ग्रेस पीरियड के बाद, आपकी पॉलिसी समाप्त हो जाती है, आप अपना NCB खो देते हैं, और नई पॉलिसी जारी होने से पहले आपकी कार का निरीक्षण करना पड़ता है। बिना बीमा ड्राइव करना मोटर वाहन अधिनियम के तहत अवैध है — जुर्माना ₹2,000 से ₹4,000 तक।", hinglish: "Agar aap renewal date miss kar dete hain, toh aapko 30 din ki grace period milti hai (insurer ke anusaar bhinn) jismein aap apna NCB intact rakhte hue renew kar sakte hain. Grace period ke baad, aapki policy lapse ho jaati hai, aap apna NCB kho dete hain, aur nayi policy issue hone se pehle aapki car ka inspection karna padta hai. Bina insurance drive karna Motor Vehicles Act ke tahat illegal hai — jurmana ₹2,000 se ₹4,000 tak." },
      },
      {
        q: { en: "Can I switch insurers at the time of renewal?", hi: "क्या मैं नवीनीकरण के समय बीमाकर्ता बदल सकता हूं?", hinglish: "Kya main renewal ke time insurer badal sakta hoon?" },
        a: { en: "Yes, absolutely. IRDAI allows you to port your car insurance to a new insurer at renewal time. Your NCB travels with you — just provide the NCB certificate from your current insurer. The new insurer will honor your NCB slab. Compare quotes from multiple insurers before renewing.", hi: "हां, बिल्कुल। IRDAI आपको नवीनीकरण के समय अपनी कार बीमा नए बीमाकर्ता के पास पोर्ट करने की अनुमति देता है। आपका NCB आपके साथ चलता है — बस अपने वर्तमान बीमाकर्ता से NCB प्रमाणपत्र प्रदान करें। नया बीमाकर्ता आपके NCB स्लैब को मानेगा। नवीनीकरण से पहले कई बीमाकर्ताओं से कोट की तुलना करें।", hinglish: "Haan, bilkul. IRDAI aapko renewal ke time apni car insurance naye insurer ke paas port karne ki anumati deta hai. Aapka NCB aapke saath chalta hai — bas apne current insurer se NCB certificate provide karein. Naya insurer aapke NCB slab ko manega. Renewal se pehle multiple insurers se quotes compare karein." },
      },
      {
        q: { en: "How is NCB calculated on car insurance renewal?", hi: "कार बीमा नवीनीकरण पर NCB की गणना कैसे होती है?", hinglish: "Car insurance renewal pe NCB ki ganana kaise hoti hai?" },
        a: { en: "NCB is calculated as a percentage discount on your own damage (OD) premium. It starts at 20% for 1 claim-free year and goes up to 50% for 5+ claim-free years. NCB applies only to the OD component, not the third-party premium. For example, if your OD premium is ₹10,000 and you have 50% NCB, you pay only ₹5,000 for OD.", hi: "NCB आपके ओन डैमेज (OD) प्रीमियम पर प्रतिशत छूट के रूप में गणना किया जाता है। यह 1 क्लेम-मुक्त वर्ष के लिए 20% से शुरू होकर 5+ क्लेम-मुक्त वर्षों के लिए 50% तक जाता है। NCB केवल OD घटक पर लागू होता है, थर्ड-पार्टी प्रीमियम पर नहीं। उदाहरण के लिए, यदि आपका OD प्रीमियम ₹10,000 है और आपके पास 50% NCB है, तो आप OD के लिए केवल ₹5,000 का भुगतान करते हैं।", hinglish: "NCB aapke own damage (OD) premium pe percentage discount ke roop mein calculate hota hai. Yeh 1 claim-free saal ke liye 20% se shuru hokar 5+ claim-free saalon ke liye 50% tak jaata hai. NCB sirf OD component pe lagu hota hai, third-party premium pe nahi. Example ke liye, agar aapka OD premium ₹10,000 hai aur aapke paas 50% NCB hai, toh aap OD ke liye sirf ₹5,000 pay karte hain." },
      },
      {
        q: { en: "Should I make a claim or pay out of pocket?", hi: "क्या मुझे क्लेम करना चाहिए या अपनी जेब से भुगतान करना चाहिए?", hinglish: "Kya mujhe claim karna chahiye ya apni jeb se bhugtan karna chahiye?" },
        a: { en: "If the repair cost is less than your NCB discount for the next year, pay out of pocket. For example, if a ₹3,000 scratch repair will cost you ₹5,000+ in lost NCB discount next year, it is smarter to pay for the repair yourself. Always calculate the NCB impact before filing small claims.", hi: "यदि मरम्मत लागत अगले वर्ष आपकी NCB छूट से कम है, तो अपनी जेब से भुगतान करें। उदाहरण के लिए, यदि ₹3,000 का स्क्रैच रिपेयर अगले वर्ष खोई हुई NCB छूट में ₹5,000+ का खर्च कराएगा, तो स्मार्ट तरीका खुद मरम्मत का भुगतान करना है। छोटे क्लेम दाखिल करने से पहले हमेशा NCB प्रभाव की गणना करें।", hinglish: "Agar repair cost agle saal aapki NCB discount se kam hai, toh apni jeb se bhugtan karein. Example ke liye, agar ₹3,000 ka scratch repair agle saal khoi hui NCB discount mein ₹5,000+ ka kharcha karayega, toh smart tareeqa khud repair ka bhugtan karna hai. Chhote claims file karne se pehle hamesha NCB impact calculate karein." },
      },
      {
        q: { en: "Is Zero Depreciation cover worth it on renewal?", hi: "क्या नवीनीकरण पर ज़ीरो डेप्रिसिएशन कवर लायक है?", hinglish: "Kya renewal pe Zero Depreciation cover laayak hai?" },
        a: { en: "Yes, Zero Depreciation (Zero Dep) cover is worth it for cars up to 5 years old (some insurers extend to 7 years). Without Zero Dep, you pay 30-50% of plastic, rubber, and metal parts cost during claims. With Zero Dep, the insurer covers 100% of part costs. The add-on costs 15-20% extra premium but saves significantly during claims.", hi: "हां, ज़ीरो डेप्रिसिएशन (ज़ीरो डेप) कवर 5 साल तक की कारों के लिए लायक है (कुछ बीमाकर्ता 7 साल तक बढ़ाते हैं)। ज़ीरो डेप के बिना, आप क्लेम के दौरान प्लास्टिक, रबर और धातु पुर्जों की लागत का 30-50% भुगतान करते हैं। ज़ीरो डेप के साथ, बीमाकर्ता 100% पुर्जों की लागत कवर करता है। यह ऐड-ऑन 15-20% अतिरिक्त प्रीमियम लेकिन क्लेम के दौरान महत्वपूर्ण बचत करता है।", hinglish: "Haan, Zero Depreciation (Zero Dep) cover 5 saal tak ki gaadiyon ke liye laayak hai (kuch insurers 7 saal tak extend karte hain). Zero Dep ke bina, aap claim ke dauraan plastic, rubber aur metal parts ki cost ka 30-50% bhugtan karte hain. Zero Dep ke saath, insurer 100% parts ki cost cover karta hai. Yeh add-on 15-20% extra premium leta hai lekin claim ke dauraan significantly bachat karta hai." },
      },
      {
        q: { en: "What documents do I need for car insurance renewal?", hi: "कार बीमा नवीनीकरण के लिए मुझे कौन से दस्तावेज़ चाहिए?", hinglish: "Car insurance renewal ke liye mujhe kaun se documents chahiye?" },
        a: { en: "You need: (1) Previous year's policy document, (2) Registration Certificate (RC) of the car, (3) NCB certificate (if switching insurers), (4) Identity proof, (5) Inspection photos (if policy has lapsed). Online renewal requires only your previous policy number and car registration number in most cases.", hi: "आपको चाहिए: (1) पिछले वर्ष का पॉलिसी दस्तावेज़, (2) कार का पंजीकरण प्रमाणपत्र (RC), (3) NCB प्रमाणपत्र (यदि बीमाकर्ता बदल रहे हैं), (4) पहचान प्रमाण, (5) निरीक्षण फ़ोटो (यदि पॉलिसी समाप्त हो गई है)। ऑनलाइन नवीनीकरण में अधिकांश मामलों में केवल पिछली पॉलिसी संख्या और कार पंजीकरण संख्या चाहिए।", hinglish: "Aapko chahiye: (1) Pichle saal ka policy document, (2) Car ka Registration Certificate (RC), (3) NCB certificate (agar insurer badal rahe hain), (4) Identity proof, (5) Inspection photos (agar policy lapse ho gayi hai). Online renewal mein aksar cases mein sirf pichli policy number aur car registration number chahiye." },
      },
      {
        q: { en: "How does IDV affect my car insurance premium?", hi: "IDV मेरी कार बीमा प्रीमियम को कैसे प्रभावित करता है?", hinglish: "IDV meri car insurance premium ko kaise prabhavit karta hai?" },
        a: { en: "IDV (Insured Declared Value) is the maximum amount your insurer pays if your car is stolen or totally damaged. Higher IDV means higher premium but better payout. Lower IDV saves premium but reduces your claim amount. IDV is calculated as manufacturer's ex-showroom price minus depreciation (5% per year for cars under 5 years).", hi: "IDV (इंश्योर्ड डिक्लेयर्ड वैल्यू) अधिकतम राशि है जो बीमाकर्ता तब देता है जब आपकी कार चोरी हो जाए या पूरी तरह नष्ट हो जाए। अधिक IDV का मतलब अधिक प्रीमियम लेकिन बेहतर भुगतान। कम IDV प्रीमियम बचाता है लेकिन क्लेम राशि कम करता है। IDV निर्माता की एक्स-शोरूम कीमत माइनस मूल्यह्रास (5 साल से कम कारों के लिए प्रति वर्ष 5%) के रूप में गणना किया जाता है।", hinglish: "IDV (Insured Declared Value) maximum rakam hai jo insurer tab deta hai jab aapki car chori ho jaaye ya poori tarah nasht ho jaaye. Zyada IDV ka matlab zyada premium lekin better payout. Kam IDV premium bachata hai lekin claim amount reduce karta hai. IDV manufacturer ki ex-showroom price minus depreciation (5 saal se kam gaadiyon ke liye per saal 5%) ke roop mein calculate hota hai." },
      },
    ],
  },

  cta: {
    heading: { en: "Need Help with", hi: "मदद चाहिए", hinglish: "Madad Chahiye" },
    headingHighlight: { en: "Car Insurance Renewal?", hi: "कार बीमा नवीनीकरण में?", hinglish: "Car Insurance Renewal mein?" },
    description: {
      en: "Chat with Himanshu Paliwal on WhatsApp — IRDAI Certified Insurance Advisor. Compare 20+ insurers, apply maximum NCB discount, and save up to 50% on your car insurance renewal.",
      hi: "WhatsApp पर हिमांशु पालीवाल से चैट करें — IRDAI प्रमाणित बीमा सलाहकार। 20+ बीमाकर्ताओं की तुलना करें, अधिकतम NCB छूट लागू करें, और अपने कार बीमा नवीनीकरण पर 50% तक बचत करें।",
      hinglish: "WhatsApp pe Himanshu Paliwal se chat karein — IRDAI Certified Insurance Advisor. 20+ insurers compare karein, maximum NCB discount apply karein, aur apne car insurance renewal pe 50% tak bachat karein."
    },
    ctaButton: { en: "Chat on WhatsApp Now", hi: "अभी WhatsApp पर चैट करें", hinglish: "Abhi WhatsApp pe Chat Karein" },
    advisorName: { en: "Himanshu Paliwal", hi: "हिमांशु पालीवाल", hinglish: "Himanshu Paliwal" },
    advisorPOSP: { en: "POSP Code: IP429834", hi: "POSP कोड: IP429834", hinglish: "POSP Code: IP429834" },
    advisorCert: { en: "IRDAI Certified Insurance Advisor", hi: "IRDAI प्रमाणित बीमा सलाहकार", hinglish: "IRDAI Certified Insurance Advisor" },
    advisorWebsite: { en: "PaliwalSecure.in", hi: "PaliwalSecure.in", hinglish: "PaliwalSecure.in" },
  },
};

// ── NCB Slabs Data ─────────────────────────────────────────────────────
const ncbSlabs = [
  { claimFreeYears: 1, discount: "20%", exampleSaving: "₹1,200 – ₹2,000" },
  { claimFreeYears: 2, discount: "25%", exampleSaving: "₹1,500 – ₹2,500" },
  { claimFreeYears: 3, discount: "35%", exampleSaving: "₹2,100 – ₹3,500" },
  { claimFreeYears: 4, discount: "45%", exampleSaving: "₹2,700 – ₹4,500" },
  { claimFreeYears: "5+", discount: "50%", exampleSaving: "₹3,000 – ₹5,000" },
];

// ── Client Component ───────────────────────────────────────────────────
export default function ClientContent() {
  const { language } = useLanguage();
  const t = (obj: T) => pt(obj, language);

  // NCB Calculator state
  const [odPremium, setOdPremium] = useState(10000);
  const [ncbPercent, setNcbPercent] = useState(20);

  const savingsAmount = Math.round((odPremium * ncbPercent) / 100);
  const payAmount = odPremium - savingsAmount;

  // JSON-LD for FAQ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pageText.faq.items.map((faq) => ({
      "@type": "Question",
      name: t(faq.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(faq.a),
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Floating gradient orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">{t(pageText.hero.badge)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {t(pageText.hero.title)} – <span className="gradient-text">{t(pageText.hero.titleHighlight)}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              {t(pageText.hero.description)}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20car%20insurance%20renewal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShinyButton variant="blue" className="text-sm sm:text-base">
                  <span>{t(pageText.hero.ctaWhatsApp)}</span>
                </ShinyButton>
              </a>
              <Link href="/free-audit">
                <ShinyButton variant="secondary" className="text-sm sm:text-base">
                  <span>{t(pageText.hero.ctaAudit)}</span>
                </ShinyButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ═══ 5-Step Renewal Process ═══ */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            {t(pageText.steps.heading)} – <span className="gradient-text">{t(pageText.steps.headingHighlight)}</span>
          </h2>
          <div className="space-y-6">
            {(
              [
                pageText.steps.step1,
                pageText.steps.step2,
                pageText.steps.step3,
                pageText.steps.step4,
                pageText.steps.step5,
              ] as const
            ).map((step, idx) => (
              <div
                key={idx}
                className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center text-[#081221] font-bold text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{t(step.title)}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{t(step.description)}</p>
                    <ul className="space-y-2">
                      {step.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-muted-foreground">{t(tip)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ═══ NCB Section ═══ */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {t(pageText.ncb.heading)} – <span className="gradient-text">{t(pageText.ncb.headingHighlight)}</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">
            {t(pageText.ncb.description)}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t(pageText.ncb.thClaimFree)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{t(pageText.ncb.thDiscount)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{t(pageText.ncb.thSaving)}</th>
                </tr>
              </thead>
              <tbody>
                {ncbSlabs.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">
                      {row.claimFreeYears} {String(row.claimFreeYears) === "1" ? t(pageText.ncb.year) : t(pageText.ncb.years)}
                    </td>
                    <td className="py-3 px-4 text-sm text-center font-semibold text-primary">{row.discount}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.exampleSaving}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NCB Important Rules */}
          <div className="mt-6 glass-card rounded-xl p-6 max-w-2xl mx-auto hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <h3 className="font-bold text-sm mb-2">{t(pageText.ncb.importantRules)}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {pageText.ncb.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{t(rule)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NCB Savings Calculator Card */}
          <div className="mt-8 max-w-lg mx-auto">
            <div className="gradient-border p-6">
              <h3 className="font-bold text-base mb-1 gradient-text">{t(pageText.ncb.calculatorTitle)}</h3>
              <p className="text-muted-foreground text-sm mb-4">{t(pageText.ncb.calculatorDesc)}</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t(pageText.ncb.odPremiumLabel)}</label>
                  <input
                    type="range"
                    min={2000}
                    max={50000}
                    step={500}
                    value={odPremium}
                    onChange={(e) => setOdPremium(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="text-right text-sm font-mono text-primary">₹{odPremium.toLocaleString()}</div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">{t(pageText.ncb.ncbSlabLabel)}</label>
                  <div className="flex gap-2 flex-wrap">
                    {[20, 25, 35, 45, 50].map((slab) => (
                      <button
                        key={slab}
                        onClick={() => setNcbPercent(slab)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          ncbPercent === slab
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent/30 text-muted-foreground hover:bg-accent/50'
                        }`}
                      >
                        {slab}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">{t(pageText.ncb.youSave)}</div>
                    <div className="text-xl font-bold font-mono text-success">₹{savingsAmount.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{t(pageText.ncb.youPay)}</div>
                    <div className="text-xl font-bold font-mono">₹{payAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ═══ Tips to Reduce Premium ═══ */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            {t(pageText.tips.heading)} <span className="gradient-text">{t(pageText.tips.headingHighlight)}</span> {t(pageText.tips.headingSuffix)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageText.tips.items.map((tip, idx) => (
              <div
                key={idx}
                className="card-premium rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base">{t(tip.title)}</h3>
                  {tip.aiRecommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" /></svg>
                      AI Recommended
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{t(tip.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ═══ What Happens If You Miss Renewal Date ═══ */}
      <section className="py-8 md:py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {t(pageText.missRenewal.heading)} <span className="gradient-text">{t(pageText.missRenewal.headingHighlight)}</span>
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {/* 0-30 days */}
            <div className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-sm">0-30</div>
                <div>
                  <h3 className="font-bold text-sm">{t(pageText.missRenewal.grace.title)}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{t(pageText.missRenewal.grace.desc)}</p>
                </div>
              </div>
            </div>
            {/* 30-90 days */}
            <div className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm">30-90</div>
                <div>
                  <h3 className="font-bold text-sm">{t(pageText.missRenewal.lapse.title)}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{t(pageText.missRenewal.lapse.desc)}</p>
                </div>
              </div>
            </div>
            {/* 90+ days */}
            <div className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-sm">90+</div>
                <div>
                  <h3 className="font-bold text-sm">{t(pageText.missRenewal.expired.title)}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{t(pageText.missRenewal.expired.desc)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ═══ Related Pages ═══ */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            {t(pageText.related.heading)} <span className="gradient-text">{t(pageText.related.headingHighlight)}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link href="/car-insurance" className="card-premium rounded-xl p-6 group">
              <h3 className="font-bold text-base mb-2 group-hover:text-primary transition">{t(pageText.related.carInsurance)}</h3>
              <p className="text-muted-foreground text-sm">{t(pageText.related.carInsuranceDesc)}</p>
            </Link>
            <Link href="/zero-dep-car-insurance" className="card-premium rounded-xl p-6 group">
              <h3 className="font-bold text-base mb-2 group-hover:text-primary transition">{t(pageText.related.zeroDep)}</h3>
              <p className="text-muted-foreground text-sm">{t(pageText.related.zeroDepDesc)}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ═══ FAQ Section ═══ */}
      <section className="py-8 md:py-12 bg-card/50" id="faq">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {t(pageText.faq.heading)} <span className="gradient-text">{t(pageText.faq.headingHighlight)}</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            {t(pageText.faq.description)}
          </p>
          <div className="space-y-4">
            {pageText.faq.items.map((faq, idx) => (
              <details key={idx} className="glass-card rounded-xl p-5 group cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <summary className="flex items-center justify-between font-semibold text-base list-none">
                  <span>{t(faq.q)}</span>
                  <svg
                    className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t(faq.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ═══ CTA Section ═══ */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {t(pageText.cta.heading)} <span className="gradient-text">{t(pageText.cta.headingHighlight)}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t(pageText.cta.description)}
          </p>
          <a
            href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20car%20insurance%20renewal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShinyButton variant="blue" className="text-base">
              <span>{t(pageText.cta.ctaButton)}</span>
            </ShinyButton>
          </a>

          {/* Himanshu Paliwal Advisor Card */}
          <div className="mt-8 gradient-border max-w-sm mx-auto p-5">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold-400 flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">HP</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-base">{t(pageText.cta.advisorName)}</p>
                <p className="text-xs text-muted-foreground">{t(pageText.cta.advisorPOSP)}</p>
                <p className="text-xs text-muted-foreground">{t(pageText.cta.advisorCert)}</p>
                <p className="text-xs text-primary font-medium">{t(pageText.cta.advisorWebsite)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
