'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { siteConfig } from '@/config/site';

// ── Translation Maps ──────────────────────────────────────────────────────
type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  hero: {
    badge: { en: "Bumper-to-Bumper Cover", hi: "बम्पर-टू-बम्पर कवर", hinglish: "Bumper-to-Bumper Cover" },
    title1: { en: "Zero Depreciation", hi: "ज़ीरो डेप्रिसिएशन", hinglish: "Zero Depreciation" },
    title2: { en: "Car Insurance", hi: "कार बीमा", hinglish: "Car Insurance" },
    description: {
      en: "Save ₹50,000+ on every claim with zero depreciation car insurance. No depreciation deduction on parts — the insurer pays the full repair cost. Compare top insurers and get the best deal today.",
      hi: "ज़ीरो डेप्रिसिएशन कार बीमा से हर क्लेम पर ₹50,000+ बचाएँ। पार्ट्स पर कोई डेप्रिसिएशन कटौती नहीं — बीमाकर्ता पूरी रिपेयर लागत चुकाता है। शीर्ष बीमाकर्ताओं की तुलना करें और आज ही सर्वोत्तम डील पाएँ।",
      hinglish: "Har claim pe ₹50,000+ bachao with zero dep car insurance. Parts pe koi depreciation cut nahi — insurer poora repair cost pay karta hai. Top insurers compare karo aur aaj hi best deal pao."
    },
    ctaCompare: { en: "Compare Zero Dep Plans", hi: "ज़ीरो डेप योजनाएँ तुलना करें", hinglish: "Zero Dep Plans Compare Karein" },
    ctaPremium: { en: "Calculate Premium", hi: "प्रीमियम कैलकुलेट करें", hinglish: "Premium Calculate Karein" },
    stat1Value: { en: "₹50K+", hi: "₹50K+", hinglish: "₹50K+" },
    stat1Label: { en: "Saved per claim", hi: "प्रति क्लेम बचत", hinglish: "Per claim bachat" },
    stat2Value: { en: "0%", hi: "0%", hinglish: "0%" },
    stat2Label: { en: "Depreciation", hi: "डेप्रिसिएशन", hinglish: "Depreciation" },
    stat3Value: { en: "51+", hi: "51+", hinglish: "51+" },
    stat3Label: { en: "Insurers compared", hi: "बीमाकर्ताओं की तुलना", hinglish: "Insurers compare kiye" },
    stat4Value: { en: "10K+", hi: "10K+", hinglish: "10K+" },
    stat4Label: { en: "Network garages", hi: "नेटवर्क गैराज", hinglish: "Network garages" },
  },
  howItWorks: {
    heading1: { en: "How", hi: "कैसे काम करता है", hinglish: "Kaise Kaam Karta Hai" },
    heading2: { en: "Zero Dep", hi: "ज़ीरो डेप", hinglish: "Zero Dep" },
    heading3: { en: "Works", hi: "", hinglish: "Works" },
    description: {
      en: "Without zero dep, the insurer deducts depreciation on replaced parts. With zero dep, you get the full claim amount — zero depreciation, zero out-of-pocket.",
      hi: "ज़ीरो डेप के बिना, बीमाकर्ता बदले गए पार्ट्स पर डेप्रिसिएशन काटता है। ज़ीरो डेप के साथ, आपको पूरी क्लेम राशि मिलती है — शून्य डेप्रिसिएशन, शून्य अपनी जेब से भुगतान।",
      hinglish: "Bina zero dep ke, insurer replaced parts pe depreciation kaat ta hai. Zero dep ke saath, tumhe poora claim amount milta hai — zero depreciation, zero apni jeb se payment."
    },
    withoutTitle: { en: "Without Zero Dep", hi: "ज़ीरो डेप के बिना", hinglish: "Bina Zero Dep Ke" },
    withTitle: { en: "With Zero Dep", hi: "ज़ीरो डेप के साथ", hinglish: "Zero Dep Ke Saath" },
    totalRepair: { en: "Total repair bill", hi: "कुल रिपेयर बिल", hinglish: "Total repair bill" },
    depOnParts: { en: "Depreciation on parts", hi: "पार्ट्स पर डेप्रिसिएशन", hinglish: "Parts pe depreciation" },
    compDeductible: { en: "Compulsory deductible", hi: "अनिवार्य डिडक्टिबल", hinglish: "Compulsory deductible" },
    youPay: { en: "You pay from pocket", hi: "आप अपनी जेब से चुकाते हैं", hinglish: "Tum apni jeb se pay karte ho" },
    waived: { en: "₹0 (Waived)", hi: "₹0 (माफ)", hinglish: "₹0 (Waived)" },
    disclaimer: {
      en: "*Illustrative example for a 3-year-old car with ₹1L repair bill. Actual savings may vary.",
      hi: "*3 साल पुरानी कार के ₹1L रिपेयर बिल का उदाहरण। वास्तविक बचत भिन्न हो सकती है।",
      hinglish: "*3 saal purani car ka ₹1L repair bill ka example. Actual savings alag ho sakti hain."
    },
  },
  savings: {
    heading1: { en: "Savings", hi: "बचत", hinglish: "Bachat" },
    heading2: { en: "Calculator", hi: "कैलकुलेटर", hinglish: "Calculator" },
    description: {
      en: "See how much you save with zero dep on your next claim. Enter your estimated repair bill.",
      hi: "अपने अगले क्लेम पर ज़ीरो डेप से कितनी बचत होगी देखें। अपना अनुमानित रिपेयर बिल दर्ज करें।",
      hinglish: "Apne agle claim pe zero dep se kitni bachat hogi dekho. Apna estimated repair bill enter karo."
    },
    repairLabel: { en: "Repair Bill (₹)", hi: "रिपेयर बिल (₹)", hinglish: "Repair Bill (₹)" },
    carAgeLabel: { en: "Car Age", hi: "कार की उम्र", hinglish: "Car Age" },
    withoutZeroDep: { en: "Without Zero Dep", hi: "ज़ीरो डेप के बिना", hinglish: "Bina Zero Dep" },
    withZeroDep: { en: "With Zero Dep", hi: "ज़ीरो डेप के साथ", hinglish: "Zero Dep Ke Saath" },
    youSave: { en: "You Save", hi: "आपकी बचत", hinglish: "Tumhari Bachat" },
    yourShare: { en: "Your share", hi: "आपका हिस्सा", hinglish: "Tumhara share" },
    insurerShare: { en: "Insurer pays", hi: "बीमाकर्ता चुकाता है", hinglish: "Insurer pay karta hai" },
  },
  depRates: {
    heading1: { en: "Depreciation", hi: "डेप्रिसिएशन", hinglish: "Depreciation" },
    heading2: { en: "Rates", hi: "दरें", hinglish: "Rates" },
    heading3: { en: "Comparison", hi: "तुलना", hinglish: "Compare" },
    description: {
      en: "See how much depreciation is deducted for different car parts with and without zero dep coverage.",
      hi: "ज़ीरो डेप कवरेज के साथ और बिना विभिन्न कार पार्ट्स पर कितनी डेप्रिसिएशन कटती है देखें।",
      hinglish: "Zero dep coverage ke saath aur bina alag-alag car parts pe kitni depreciation kutti hai dekho."
    },
    colPart: { en: "Car Part", hi: "कार पार्ट", hinglish: "Car Part" },
    colNormal: { en: "Normal Dep.", hi: "सामान्य डेप.", hinglish: "Normal Dep." },
    colZeroDep: { en: "Zero Dep", hi: "ज़ीरो डेप", hinglish: "Zero Dep" },
    parts: [
      { part: { en: "Rubber / Plastic / Nylon", hi: "रबर / प्लास्टिक / नायलॉन", hinglish: "Rubber / Plastic / Nylon" }, normal: "50%", zero: "0%" },
      { part: { en: "Fiber Glass", hi: "फाइबर ग्लास", hinglish: "Fiber Glass" }, normal: "30%", zero: "0%" },
      { part: { en: "Metal Parts (0-6 months)", hi: "मेटल पार्ट्स (0-6 महीने)", hinglish: "Metal Parts (0-6 months)" }, normal: "5%", zero: "0%" },
      { part: { en: "Metal Parts (6 months - 1 year)", hi: "मेटल पार्ट्स (6 महीने - 1 साल)", hinglish: "Metal Parts (6 months - 1 year)" }, normal: "10%", zero: "0%" },
      { part: { en: "Metal Parts (1-2 years)", hi: "मेटल पार्ट्स (1-2 साल)", hinglish: "Metal Parts (1-2 saal)" }, normal: "15%", zero: "0%" },
      { part: { en: "Metal Parts (2-3 years)", hi: "मेटल पार्ट्स (2-3 साल)", hinglish: "Metal Parts (2-3 saal)" }, normal: "25%", zero: "0%" },
      { part: { en: "Metal Parts (3-4 years)", hi: "मेटल पार्ट्स (3-4 साल)", hinglish: "Metal Parts (3-4 saal)" }, normal: "35%", zero: "0%" },
      { part: { en: "Metal Parts (4-5 years)", hi: "मेटल पार्ट्स (4-5 साल)", hinglish: "Metal Parts (4-5 saal)" }, normal: "40%", zero: "0%" },
      { part: { en: "Wooden Parts", hi: "लकड़ी के पार्ट्स", hinglish: "Wooden Parts" }, normal: "5-10% per year", zero: "0%" },
    ],
  },
  insurers: {
    heading1: { en: "Top", hi: "शीर्ष", hinglish: "Top" },
    heading2: { en: "Zero Dep", hi: "ज़ीरो डेप", hinglish: "Zero Dep" },
    heading3: { en: "Insurers", hi: "बीमाकर्ता", hinglish: "Insurers" },
    description: {
      en: "Compare zero depreciation car insurance from India's leading insurers.",
      hi: "भारत के प्रमुख बीमाकर्ताओं से ज़ीरो डेप्रिसिएशन कार बीमा की तुलना करें।",
      hinglish: "India ke leading insurers se zero depreciation car insurance compare karo."
    },
    maxAge: { en: "Max vehicle age", hi: "अधिकतम वाहन आयु", hinglish: "Max vehicle age" },
    claimsLimit: { en: "Claims limit", hi: "क्लेम सीमा", hinglish: "Claims limit" },
    highlightLabel: { en: "Highlight", hi: "विशेषता", hinglish: "Highlight" },
    aiRecommended: { en: "AI Recommended", hi: "AI सिफ़ारिश", hinglish: "AI Recommended" },
    list: [
      { name: "Bajaj Allianz", maxAge: { en: "5 years", hi: "5 साल", hinglish: "5 saal" }, claimsLimit: { en: "2 per year", hi: "प्रति वर्ष 2", hinglish: "2 per year" }, highlight: { en: "Quick claim settlement", hi: "तेज़ क्लेम निपटान", hinglish: "Quick claim settlement" }, aiPick: true },
      { name: "HDFC Ergo", maxAge: { en: "5 years", hi: "5 साल", hinglish: "5 saal" }, claimsLimit: { en: "2 per year", hi: "प्रति वर्ष 2", hinglish: "2 per year" }, highlight: { en: "Wide network garages", hi: "व्यापक नेटवर्क गैराज", hinglish: "Wide network garages" }, aiPick: false },
      { name: "ICICI Lombard", maxAge: { en: "5 years", hi: "5 साल", hinglish: "5 saal" }, claimsLimit: { en: "2 per year", hi: "प्रति वर्ष 2", hinglish: "2 per year" }, highlight: { en: "Instant policy issuance", hi: "तत्काल पॉलिसी जारी", hinglish: "Instant policy issuance" }, aiPick: false },
      { name: "New India Assurance", maxAge: { en: "5 years", hi: "5 साल", hinglish: "5 saal" }, claimsLimit: { en: "Unlimited", hi: "असीमित", hinglish: "Unlimited" }, highlight: { en: "Government-backed trust", hi: "सरकारी बैकिंग वाला भरोसा", hinglish: "Government-backed trust" }, aiPick: false },
      { name: "ACKO", maxAge: { en: "5 years", hi: "5 साल", hinglish: "5 saal" }, claimsLimit: { en: "3 per year", hi: "प्रति वर्ष 3", hinglish: "3 per year" }, highlight: { en: "Digital-first claims", hi: "डिजिटल-फर्स्ट क्लेम", hinglish: "Digital-first claims" }, aiPick: false },
      { name: "Digit", maxAge: { en: "7 years", hi: "7 साल", hinglish: "7 saal" }, claimsLimit: { en: "Unlimited", hi: "असीमित", hinglish: "Unlimited" }, highlight: { en: "Smartphone self-inspection", hi: "स्मार्टफ़ोन सेल्फ-इंस्पेक्शन", hinglish: "Smartphone self-inspection" }, aiPick: true },
    ],
  },
  whoShould: {
    heading1: { en: "Who Should Get", hi: "किसे लेना चाहिए", hinglish: "Kisko Leni Chahiye" },
    heading2: { en: "Zero Dep", hi: "ज़ीरो डेप", hinglish: "Zero Dep" },
    heading3: { en: "?", hi: "?", hinglish: "?" },
    personas: [
      { emoji: "🚗", title: { en: "New Car Owners", hi: "नई कार वाले", hinglish: "New Car Owners" }, desc: { en: "Cars less than 5 years old benefit the most. Maximum savings on claims during the initial years.", hi: "5 साल से कम उम्र की कार को सबसे ज़्यादा फ़ायदा होता है। शुरुआती सालों में क्लेम पर अधिकतम बचत।", hinglish: "5 saal se kam umar ki car ko sabse zyada fayda hota hai. Shuruaati saalon mein claim pe maximum bachat." } },
      { emoji: "🏎️", title: { en: "Luxury Car Owners", hi: "लक्ज़री कार वाले", hinglish: "Luxury Car Owners" }, desc: { en: "Expensive spare parts mean higher depreciation. Zero dep saves ₹50,000+ per claim on premium vehicles.", hi: "महंगे स्पेयर पार्ट्स का मतलब ज़्यादा डेप्रिसिएशन। ज़ीरो डेप प्रीमियम वाहनों पर प्रति क्लेम ₹50,000+ बचाता है।", hinglish: "Mehenge spare parts ka matlab zyada depreciation. Zero dep premium vehicles pe per claim ₹50,000+ bachata hai." } },
      { emoji: "🌆", title: { en: "City Drivers", hi: "शहरी ड्राइवर", hinglish: "City Drivers" }, desc: { en: "High traffic areas mean higher accident risk. Zero dep ensures you don't pay from pocket for repairs.", hi: "ज़्यादा ट्रैफ़िक वाले इलाकों में एक्सीडेंट का ख़तरा ज़्यादा। ज़ीरो डेप सुनिश्चित करता है कि आप रिपेयर के लिए जेब से न चुकाएँ।", hinglish: "Zyada traffic wale ilakon mein accident ka khatra zyada. Zero dep ensure karta hai ki tum repair ke liye jeb se na pay karo." } },
      { emoji: "🆕", title: { en: "First-Time Owners", hi: "पहली बार कार वाले", hinglish: "First-Time Owners" }, desc: { en: "New to driving? Zero dep gives you peace of mind with full coverage and no depreciation worry.", hi: "ड्राइविंग में नए? ज़ीरो डेप पूर्ण कवरेज और डेप्रिसिएशन की चिंता के बिना मन की शांति देता है।", hinglish: "Driving mein naye? Zero dep full coverage aur depreciation ki chinta ke bina peace of mind deta hai." } },
      { emoji: "🤝", title: { en: "Leased/Financed Cars", hi: "लीज़/फ़ाइनेंस की कार", hinglish: "Leased/Financed Cars" }, desc: { en: "Most lease agreements require zero dep. Protect your investment with bumper-to-bumper coverage.", hi: "ज़्यादातर लीज़ अनुबंधों में ज़ीरो डेप ज़रूरी है। बम्पर-टू-बम्पर कवरेज से अपने निवेश की सुरक्षा करें।", hinglish: "Zyadaatar lease agreements mein zero dep zaroori hai. Bumper-to-bumper coverage se apne investment ki suraksha karo." } },
      { emoji: "⚠️", title: { en: "Accident-Prone Areas", hi: "एक्सीडेंट-प्रोन इलाके", hinglish: "Accident-Prone Areas" }, desc: { en: "Living in areas with high accident rates? Zero dep significantly reduces your out-of-pocket expenses.", hi: "ज़्यादा एक्सीडेंट वाले इलाकों में रहते हैं? ज़ीरो डेप आपके खुद के खर्चे काफ़ी कम करता है।", hinglish: "Zyada accident wale ilakon mein rehte hain? Zero dep tumhare out-of-pocket expenses kaafi kam karta hai." } },
    ],
  },
  faq: {
    heading1: { en: "Zero Dep Car Insurance", hi: "ज़ीरो डेप कार बीमा", hinglish: "Zero Dep Car Insurance" },
    heading2: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    description: {
      en: "Everything you need to know about zero depreciation car insurance. Still have questions? Ask InsureGPT!",
      hi: "ज़ीरो डेप्रिसिएशन कार बीमे के बारे में सब कुछ जानें। अभी भी सवाल हैं? InsureGPT से पूछें!",
      hinglish: "Zero depreciation car insurance ke baare mein sab kuch jaano. Abhi bhi sawaal hain? InsureGPT se poochiye!"
    },
    list: [
      {
        q: { en: "What is zero depreciation car insurance?", hi: "ज़ीरो डेप्रिसिएशन कार बीमा क्या है?", hinglish: "Zero Dep Car Insurance kya hai?" },
        a: { en: "Zero depreciation (also called bumper-to-bumper or nil depreciation) car insurance ensures that during a claim, the insurer pays the full cost of repairs without deducting depreciation on parts. This means you get the complete claim amount without bearing any depreciation cost for replaced parts like fiber, rubber, plastic, or metal components.", hi: "ज़ीरो डेप्रिसिएशन (जिसे बम्पर-टू-बम्पर या निल डेप्रिसिएशन भी कहते हैं) कार बीमा सुनिश्चित करता है कि क्लेम के दौरान, बीमाकर्ता पार्ट्स पर डेप्रिसिएशन काटे बिना पूरी रिपेयर लागत चुकाता है। इसका मतलब है कि आपको बदले गए पार्ट्स जैसे फाइबर, रबर, प्लास्टिक या मेटल के लिए कोई डेप्रिसिएशन ख़र्च नहीं उठाना पड़ता।", hinglish: "Zero depreciation (jise bumper-to-bumper ya nil depreciation bhi kehte hain) car insurance ensure karta hai ki claim ke dauran, insurer parts pe depreciation kaate bina poora repair cost pay karta hai. Iska matlab hai ki tumhe replaced parts jaise fiber, rubber, plastic ya metal ke liye koi depreciation expense nahi uthana padta." }
      },
      {
        q: { en: "How much can I save with zero dep car insurance?", hi: "ज़ीरो डेप कार बीमे से कितना बचा सकते हैं?", hinglish: "Zero dep car insurance se kitna bacha sakte hain?" },
        a: { en: "On average, zero dep cover saves you ₹15,000-₹50,000 per claim depending on your car's age and damage. For a 3-year-old car with ₹1 lakh repair bill, without zero dep you'd pay ₹30,000-₹40,000 as depreciation. With zero dep, the insurer covers the entire amount.", hi: "औसतन, ज़ीरो डेप कवर आपकी कार की उम्र और नुकसान के आधार पर प्रति क्लेम ₹15,000-₹50,000 बचाता है। 3 साल पुरानी कार के ₹1 लाख के रिपेयर बिल पर, ज़ीरो डेप के बिना आपको ₹30,000-₹40,000 डेप्रिसिएशन के रूप में चुकाना होगा। ज़ीरो डेप के साथ, बीमाकर्ता पूरी राशि कवर करता है।", hinglish: "Average pe, zero dep cover tumhari car ki umar aur nuksaan ke hisaab se per claim ₹15,000-₹50,000 bachata hai. 3 saal purani car ke ₹1 lakh repair bill pe, bina zero dep ke tumhe ₹30,000-₹40,000 depreciation ke roop mein pay karna hoga. Zero dep ke saath, insurer poora amount cover karta hai." }
      },
      {
        q: { en: "Is zero dep car insurance worth it?", hi: "क्या ज़ीरो डेप कार बीमा लेना फ़ायदेमंद है?", hinglish: "Kya zero dep car insurance lena faydemand hai?" },
        a: { en: "Absolutely! Zero dep is highly recommended for: (1) New cars (0-5 years old), (2) Luxury cars with expensive parts, (3) Cars driven in high-traffic areas prone to accidents, (4) First-time car owners. The additional premium (15-20% of base) is far less than the depreciation you'd pay during claims.", hi: "बिलकुल! ज़ीरो डेप इनके लिए बहुत अनुशंसित है: (1) नई कारें (0-5 साल पुरानी), (2) महंगे पार्ट्स वाली लक्ज़री कारें, (3) हाई-ट्रैफ़िक वाले इलाकों में चलने वाली कारें, (4) पहली बार कार वाले मालिक। अतिरिक्त प्रीमियम (बेस का 15-20%) क्लेम के दौरान चुकाने वाली डेप्रिसिएशन से बहुत कम है।", hinglish: "Bilkul! Zero dep inke liye bahut recommended hai: (1) Naye cars (0-5 saal purani), (2) Mehenge parts wali luxury cars, (3) High-traffic wale ilakon mein chalne wali cars, (4) Pehli baar car wale malik. Extra premium (base ka 15-20%) claim ke dauran pay karne wali depreciation se bahut kam hai." }
      },
      {
        q: { en: "Can I get zero dep for cars older than 5 years?", hi: "क्या 5 साल से पुरानी कार के लिए ज़ीरो डेप मिल सकता है?", hinglish: "Kya 5 saal se purani car ke liye zero dep mil sakta hai?" },
        a: { en: "Most insurers offer zero dep only for cars up to 5 years old. However, some insurers like Bajaj Allianz, HDFC Ergo, and ICICI Lombard offer zero dep for cars up to 7 years. Our AI advisor can help you find insurers offering zero dep for older vehicles.", hi: "ज़्यादातर बीमाकर्ता केवल 5 साल तक की कारों के लिए ज़ीरो डेप देते हैं। हालांकि, कुछ बीमाकर्ता जैसे बजाज अलियांज़, HDFC एर्गो और ICICI लोम्बार्ड 7 साल तक की कारों के लिए ज़ीरो डेप देते हैं। हमारे AI सलाहकार पुरानी गाड़ियों के लिए ज़ीरो डेप देने वाले बीमाकर्ता ढूंढने में मदद कर सकते हैं।", hinglish: "Zyadaatar insurers sirf 5 saal tak ki cars ke liye zero dep dete hain. Lekin, kuch insurers jaise Bajaj Allianz, HDFC Ergo aur ICICI Lombard 7 saal tak ki cars ke liye zero dep dete hain. Humara AI advisor purani gaadiyon ke liye zero dep dene wale insurers dhoondhne mein madad kar sakta hai." }
      },
      {
        q: { en: "How many zero dep claims can I make in a year?", hi: "एक साल में कितने ज़ीरो डेप क्लेम कर सकते हैं?", hinglish: "Ek saal mein kitne zero dep claims kar sakte hain?" },
        a: { en: "Most insurers allow 2 zero depreciation claims per policy year. Some premium plans offer unlimited zero dep claims. Always check the policy wordings for claim limits. Our comparison tool shows this information for all plans side by side.", hi: "ज़्यादातर बीमाकर्ता प्रति पॉलिसी वर्ष 2 ज़ीरो डेप्रिसिएशन क्लेम की अनुमति देते हैं। कुछ प्रीमियम योजनाएँ असीमित ज़ीरो डेप क्लेम देती हैं। हमेशा क्लेम सीमा के लिए पॉलिसी शर्तें जांचें। हमारा तुलना टूल सभी योजनाओं की यह जानकारी साथ-साथ दिखाता है।", hinglish: "Zyadaatar insurers per policy year 2 zero depreciation claims ki anumati dete hain. Kuch premium plans unlimited zero dep claims dete hain. Hamesha claim limit ke liye policy wordings check karo. Hamara comparison tool sabhi plans ki yeh info side by side dikhata hai." }
      },
      {
        q: { en: "What is NOT covered in zero dep car insurance?", hi: "ज़ीरो डेप कार बीमे में क्या कवर नहीं होता?", hinglish: "Zero dep car insurance mein kya cover nahi hota?" },
        a: { en: "Zero dep does NOT cover: (1) Engine damage due to waterlogging, (2) Tyre and tube replacement (unless vehicle is also damaged), (3) Battery replacement, (4) Mechanical or electrical breakdown, (5) Wear and tear, (6) Consumables like oil, coolant, and nuts/bolts. For complete coverage, add engine protect and consumables add-ons.", hi: "ज़ीरो डेप कवर नहीं करता: (1) जलभराव से इंजन क्षति, (2) टायर और ट्यूब बदलना (जब तक वाहन भी क्षतिग्रस्त न हो), (3) बैटरी बदलना, (4) मैकेनिकल या इलेक्ट्रिकल ब्रेकडाउन, (5) घिसाव और टूट-फूट, (6) कंज़्यूमेबल्स जैसे तेल, कूलेंट और नट/बोल्ट। पूर्ण कवरेज के लिए, इंजन प्रोटेक्ट और कंज़्यूमेबल्स ऐड-ऑन जोड़ें।", hinglish: "Zero dep cover nahi karta: (1) Waterlogging se engine damage, (2) Tyre aur tube replacement (jab tak vehicle bhi damaged na ho), (3) Battery replacement, (4) Mechanical ya electrical breakdown, (5) Wear and tear, (6) Consumables jaise oil, coolant aur nuts/bolts. Complete coverage ke liye, engine protect aur consumables add-ons jodein." }
      },
      {
        q: { en: "Zero dep vs comprehensive insurance — what's the difference?", hi: "ज़ीरो डेप बनाम कॉम्प्रिहेंसिव बीमा — अंतर क्या है?", hinglish: "Zero dep vs comprehensive insurance — difference kya hai?" },
        a: { en: "Comprehensive insurance covers third-party liability and own damage but deducts depreciation during claims. Zero dep is an add-on to comprehensive insurance that removes the depreciation deduction. Zero dep = comprehensive + no depreciation on parts. Think of it as an upgrade to your comprehensive plan.", hi: "कॉम्प्रिहेंसिव बीमा थर्ड-पार्टी देनदारी और ओन डैमेज कवर करता है लेकिन क्लेम के दौरान डेप्रिसिएशन काटता है। ज़ीरो डेप कॉम्प्रिहेंसिव बीमे का ऐड-ऑन है जो डेप्रिसिएशन कटौती हटा देता है। ज़ीरो डेप = कॉम्प्रिहेंसिव + पार्ट्स पर कोई डेप्रिसिएशन नहीं। इसे अपनी कॉम्प्रिहेंसिव योजना का अपग्रेड समझें।", hinglish: "Comprehensive insurance third-party liability aur own damage cover karta hai lekin claim ke dauran depreciation kaat ta hai. Zero dep comprehensive insurance ka add-on hai jo depreciation cut hata deta hai. Zero dep = comprehensive + parts pe koi depreciation nahi. Isse apni comprehensive plan ka upgrade samjho." }
      },
      {
        q: { en: "How much does zero dep add to my car insurance premium?", hi: "ज़ीरो डेप मेरी कार बीमा प्रीमियम में कितना जोड़ता है?", hinglish: "Zero dep meri car insurance premium mein kitna add karta hai?" },
        a: { en: "Zero dep typically adds 15-20% to your base comprehensive premium. For a car with ₹15,000 comprehensive premium, zero dep would cost an additional ₹2,250-₹3,000. This small increase can save you ₹30,000-₹50,000 during a single claim.", hi: "ज़ीरो डेप आमतौर पर आपकी बेस कॉम्प्रिहेंसिव प्रीमियम में 15-20% जोड़ता है। ₹15,000 कॉम्प्रिहेंसिव प्रीमियम वाली कार के लिए, ज़ीरो डेप की अतिरिक्त लागत ₹2,250-₹3,000 होगी। यह छोटी बढ़ोतरी एक ही क्लेम में ₹30,000-₹50,000 बचा सकती है।", hinglish: "Zero dep aam taur pe aapki base comprehensive premium mein 15-20% add karta hai. ₹15,000 comprehensive premium wali car ke liye, zero dep ki extra cost ₹2,250-₹3,000 hogi. Yeh chhoti badhotri ek hi claim mein ₹30,000-₹50,000 baca sakti hai." }
      },
    ],
  },
  cta: {
    heading1: { en: "Get", hi: "लें", hinglish: "Lo" },
    heading2: { en: "Zero Dep", hi: "ज़ीरो डेप", hinglish: "Zero Dep" },
    heading3: { en: "Car Insurance Today", hi: "कार बीमा आज ही", hinglish: "Car Insurance Aaj Hi" },
    description: {
      en: "Don't pay depreciation on claims. Compare zero dep plans from 51+ insurers and save ₹50,000+ on your next claim.",
      hi: "क्लेम पर डेप्रिसिएशन न चुकाएँ। 51+ बीमाकर्ताओं की ज़ीरो डेप योजनाओं की तुलना करें और अपने अगले क्लेम पर ₹50,000+ बचाएँ।",
      hinglish: "Claim pe depreciation na pay karo. 51+ insurers ki zero dep plans compare karo aur apne agle claim pe ₹50,000+ bachao."
    },
    ctaCompare: { en: "Compare Zero Dep Plans", hi: "ज़ीरो डेप योजनाएँ तुलना करें", hinglish: "Zero Dep Plans Compare Karein" },
    ctaExpert: { en: "Talk to an Expert", hi: "विशेषज्ञ से बात करें", hinglish: "Expert se Baat Karein" },
    byLine: {
      en: `By ${siteConfig.author.name} — IRDAI Certified Insurance Advisor`,
      hi: `${siteConfig.author.name} द्वारा — IRDAI प्रमाणित बीमा सलाहकार`,
      hinglish: `${siteConfig.author.name} dwara — IRDAI Certified Insurance Advisor`,
    },
  },
};

// ── FAQ data for JSON-LD (always in English for SEO) ──────────────────────
const faqJsonLd = [
  {
    q: "What is zero depreciation car insurance?",
    a: "Zero depreciation (also called bumper-to-bumper or nil depreciation) car insurance ensures that during a claim, the insurer pays the full cost of repairs without deducting depreciation on parts. This means you get the complete claim amount without bearing any depreciation cost for replaced parts like fiber, rubber, plastic, or metal components.",
  },
  {
    q: "How much can I save with zero dep car insurance?",
    a: "On average, zero dep cover saves you ₹15,000-₹50,000 per claim depending on your car's age and damage. For a 3-year-old car with ₹1 lakh repair bill, without zero dep you'd pay ₹30,000-₹40,000 as depreciation. With zero dep, the insurer covers the entire amount.",
  },
  {
    q: "Is zero dep car insurance worth it?",
    a: "Absolutely! Zero dep is highly recommended for: (1) New cars (0-5 years old), (2) Luxury cars with expensive parts, (3) Cars driven in high-traffic areas prone to accidents, (4) First-time car owners. The additional premium (15-20% of base) is far less than the depreciation you'd pay during claims.",
  },
  {
    q: "Can I get zero dep for cars older than 5 years?",
    a: "Most insurers offer zero dep only for cars up to 5 years old. However, some insurers like Bajaj Allianz, HDFC Ergo, and ICICI Lombard offer zero dep for cars up to 7 years. Our AI advisor can help you find insurers offering zero dep for older vehicles.",
  },
  {
    q: "How many zero dep claims can I make in a year?",
    a: "Most insurers allow 2 zero depreciation claims per policy year. Some premium plans offer unlimited zero dep claims. Always check the policy wordings for claim limits. Our comparison tool shows this information for all plans side by side.",
  },
  {
    q: "What is NOT covered in zero dep car insurance?",
    a: "Zero dep does NOT cover: (1) Engine damage due to waterlogging, (2) Tyre and tube replacement (unless vehicle is also damaged), (3) Battery replacement, (4) Mechanical or electrical breakdown, (5) Wear and tear, (6) Consumables like oil, coolant, and nuts/bolts. For complete coverage, add engine protect and consumables add-ons.",
  },
  {
    q: "Zero dep vs comprehensive insurance — what's the difference?",
    a: "Comprehensive insurance covers third-party liability and own damage but deducts depreciation during claims. Zero dep is an add-on to comprehensive insurance that removes the depreciation deduction. Zero dep = comprehensive + no depreciation on parts. Think of it as an upgrade to your comprehensive plan.",
  },
  {
    q: "How much does zero dep add to my car insurance premium?",
    a: "Zero dep typically adds 15-20% to your base comprehensive premium. For a car with ₹15,000 comprehensive premium, zero dep would cost an additional ₹2,250-₹3,000. This small increase can save you ₹30,000-₹50,000 during a single claim.",
  },
];

// ── Helper ────────────────────────────────────────────────────────────────
const pt = (obj: Tr) => obj.en; // will be overridden with language-aware version

// ── Animated number hook ──────────────────────────────────────────────────
function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    return () => { setValue(0); };
  }, [target, duration]);
  return value;
}

// ── Savings Calculator Component ──────────────────────────────────────────
function SavingsCalculator({ language }: { language: string }) {
  const tr = useCallback((obj: Tr) => obj[language as keyof Tr] || obj.en, [language]);
  const [repairBill, setRepairBill] = useState(100000);
  const [carAge, setCarAge] = useState(3);

  // Depreciation % based on car age for metal parts (biggest component)
  const depPercent = carAge <= 0.5 ? 5 : carAge <= 1 ? 10 : carAge <= 2 ? 15 : carAge <= 3 ? 25 : carAge <= 4 ? 35 : 40;
  // Rough: ~70% of bill is metal, ~30% is plastic/rubber (50% dep)
  const metalPortion = repairBill * 0.7;
  const plasticPortion = repairBill * 0.3;
  const depAmount = Math.round(metalPortion * (depPercent / 100) + plasticPortion * 0.5);
  const deductible = 1000;
  const withoutZeroDep = depAmount + deductible;
  const withZeroDep = deductible;
  const savings = withoutZeroDep - withZeroDep;

  const animatedSavings = useAnimatedNumber(savings, 800);

  return (
    <div className="glass-card p-6 max-w-xl mx-auto">
      <h3 className="text-xl font-bold mb-2 gradient-text">{tr(pageText.savings.heading1)} {tr(pageText.savings.heading2)}</h3>
      <p className="text-sm text-muted-foreground mb-5">{tr(pageText.savings.description)}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">{tr(pageText.savings.repairLabel)}</label>
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={repairBill}
            onChange={e => setRepairBill(Number(e.target.value))}
            className="w-full accent-[#C98A1C]"
          />
          <div className="text-sm font-bold mt-1">₹{repairBill.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">{tr(pageText.savings.carAgeLabel)}</label>
          <select
            value={carAge}
            onChange={e => setCarAge(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value={0.25}>0-6 months</option>
            <option value={1}>6 months - 1 year</option>
            <option value={2}>1-2 years</option>
            <option value={3}>2-3 years</option>
            <option value={4}>3-4 years</option>
            <option value={5}>4-5 years</option>
          </select>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-destructive font-medium">{tr(pageText.savings.withoutZeroDep)}</span>
            <span className="font-bold text-destructive">₹{withoutZeroDep.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-destructive/70 transition-all duration-700"
              style={{ width: `${Math.min((withoutZeroDep / repairBill) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{tr(pageText.savings.yourShare)}</p>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-primary font-medium">{tr(pageText.savings.withZeroDep)}</span>
            <span className="font-bold text-primary">₹{withZeroDep.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/70 transition-all duration-700"
              style={{ width: `${Math.min((withZeroDep / repairBill) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{tr(pageText.savings.insurerShare)}</p>
        </div>
      </div>

      {/* Savings badge */}
      <div className="mt-5 text-center py-3 rounded-xl bg-primary/10 border border-primary/20">
        <span className="text-sm text-muted-foreground">{tr(pageText.savings.youSave)}</span>
        <div className="text-2xl md:text-3xl font-bold gradient-text">₹{animatedSavings.toLocaleString('en-IN')}</div>
      </div>
    </div>
  );
}

// ── Section Divider ───────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="mx-3 h-1.5 w-1.5 rounded-full bg-primary/40" />
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

// ── Main ClientContent ───────────────────────────────────────────────────
export default function ClientContent() {
  const { language } = useLanguage();
  const tr = useCallback((obj: Tr) => obj[language as keyof Tr] || obj.en, [language]);

  // JSON-LD Schema (always English for SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqJsonLd.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════ Hero Section ═══════════ */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{tr(pageText.hero.badge)}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {tr(pageText.hero.title1)}{' '}
            <span className="gradient-text">{tr(pageText.hero.title2)}</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            {tr(pageText.hero.description)}
          </p>

          {/* CTAs with ShinyButton */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#compare">
              <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span>{tr(pageText.hero.ctaCompare)}</span>
              </ShinyButton>
            </Link>
            <Link href="/#calculators">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span>{tr(pageText.hero.ctaPremium)}</span>
              </ShinyButton>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { value: tr(pageText.hero.stat1Value), label: tr(pageText.hero.stat1Label) },
              { value: tr(pageText.hero.stat2Value), label: tr(pageText.hero.stat2Label) },
              { value: tr(pageText.hero.stat3Value), label: tr(pageText.hero.stat3Label) },
              { value: tr(pageText.hero.stat4Value), label: tr(pageText.hero.stat4Label) },
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

      {/* ═══════════ How Zero Dep Works ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.howItWorks.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.howItWorks.heading2)}</span>{' '}
              {tr(pageText.howItWorks.heading3)}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              {tr(pageText.howItWorks.description)}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Without Zero Dep */}
            <div className="glass-card p-6 border-destructive/20 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <h3 className="text-lg font-semibold">{tr(pageText.howItWorks.withoutTitle)}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{tr(pageText.howItWorks.totalRepair)}</span>
                  <span className="font-medium">₹1,00,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{tr(pageText.howItWorks.depOnParts)}</span>
                  <span className="font-medium text-destructive">- ₹35,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{tr(pageText.howItWorks.compDeductible)}</span>
                  <span className="font-medium text-destructive">- ₹1,000</span>
                </div>
                <div className="flex justify-between py-3 bg-destructive/5 rounded-lg px-3">
                  <span className="font-semibold">{tr(pageText.howItWorks.youPay)}</span>
                  <span className="font-bold text-destructive">₹36,000</span>
                </div>
              </div>
            </div>
            {/* With Zero Dep */}
            <div className="glass-card p-6 border-primary/30 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <h3 className="text-lg font-semibold">{tr(pageText.howItWorks.withTitle)}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{tr(pageText.howItWorks.totalRepair)}</span>
                  <span className="font-medium">₹1,00,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{tr(pageText.howItWorks.depOnParts)}</span>
                  <span className="font-medium text-primary">{tr(pageText.howItWorks.waived)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{tr(pageText.howItWorks.compDeductible)}</span>
                  <span className="font-medium text-destructive">- ₹1,000</span>
                </div>
                <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-3">
                  <span className="font-semibold">{tr(pageText.howItWorks.youPay)}</span>
                  <span className="font-bold text-primary">₹1,000</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs md:text-sm text-muted-foreground mt-6">
            {tr(pageText.howItWorks.disclaimer)}
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ Savings Calculator ═══════════ */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SavingsCalculator language={language} />
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ Depreciation Rates Table ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.depRates.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.depRates.heading2)}</span>{' '}
              {tr(pageText.depRates.heading3)}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              {tr(pageText.depRates.description)}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">{tr(pageText.depRates.colPart)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-destructive">{tr(pageText.depRates.colNormal)}</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm gradient-text">{tr(pageText.depRates.colZeroDep)}</th>
                </tr>
              </thead>
              <tbody>
                {pageText.depRates.parts.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{tr(row.part)}</td>
                    <td className="py-3 px-4 text-sm text-center text-destructive font-medium">{row.normal}</td>
                    <td className="py-3 px-4 text-sm text-center text-primary font-bold">{row.zero}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ Top Insurers ═══════════ */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.insurers.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.insurers.heading2)}</span>{' '}
              {tr(pageText.insurers.heading3)}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              {tr(pageText.insurers.description)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageText.insurers.list.map((insurer, idx) => (
              <div key={idx} className="glass-card p-6 relative hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                {/* AI Recommended Badge */}
                {insurer.aiPick && (
                  <div className="absolute -top-3 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" /></svg>
                      {tr(pageText.insurers.aiRecommended)}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-3">{insurer.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{tr(pageText.insurers.maxAge)}</span>
                    <span className="font-medium">{tr(insurer.maxAge)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{tr(pageText.insurers.claimsLimit)}</span>
                    <span className="font-medium">{tr(insurer.claimsLimit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{tr(pageText.insurers.highlightLabel)}</span>
                    <span className="font-medium text-primary">{tr(insurer.highlight)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ Who Should Get Zero Dep ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.whoShould.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.whoShould.heading2)}</span>
              {tr(pageText.whoShould.heading3)}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageText.whoShould.personas.map((item, idx) => (
              <div key={idx} className="glass-card p-6 text-center hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-semibold mb-2">{tr(item.title)}</h3>
                <p className="text-sm text-muted-foreground">{tr(item.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ FAQ Section ═══════════ */}
      <section className="py-12 md:py-20 bg-card/50" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.faq.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.faq.heading2)}</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {tr(pageText.faq.description)}
            </p>
          </div>
          <div className="space-y-4">
            {pageText.faq.list.map((faq, idx) => (
              <details key={idx} className="glass-card p-5 group cursor-pointer hover:translate-y-[-1px] hover:shadow-md transition-all duration-300">
                <summary className="flex items-center justify-between font-semibold text-sm md:text-base list-none">
                  <span>{tr(faq.q)}</span>
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
                <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">{tr(faq.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ CTA Section ═══════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {tr(pageText.cta.heading1)}{' '}
            <span className="gradient-text">{tr(pageText.cta.heading2)}</span>{' '}
            {tr(pageText.cta.heading3)}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {tr(pageText.cta.description)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#compare">
              <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span>{tr(pageText.cta.ctaCompare)}</span>
              </ShinyButton>
            </Link>
            <Link href="/#contact">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span>{tr(pageText.cta.ctaExpert)}</span>
              </ShinyButton>
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {tr(pageText.cta.byLine)}
          </p>
        </div>
      </section>
    </div>
  );
}
