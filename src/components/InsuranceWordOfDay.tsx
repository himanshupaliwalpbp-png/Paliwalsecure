'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Share2, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage, type Language } from '@/lib/i18n';

// ── Insurance Term Type ──────────────────────────────────────────────────────
interface InsuranceTerm {
  term: string;
  short: string;
  hinglish: string;
  hindi: string;
  example: string;
}

// ── 35+ Insurance Terms ──────────────────────────────────────────────────────
const insuranceTerms: InsuranceTerm[] = [
  {
    term: 'CSR (Claim Settlement Ratio)',
    short: 'Percentage of claims an insurer settles out of total claims received.',
    hinglish: 'CSR matlab Claim Settlement Ratio — yeh batata hai ki insurance company kitne percent claims accept karti hai. Jitna zyada CSR, utna reliable company. 95%+ CSR wali company choose karein.',
    hindi: 'CSR का अर्थ है क्लेम सेटलमेंट रेश्यो — यह बताता है कि बीमा कंपनी कितने प्रतिशत क्लेम स्वीकार करती है। जितना अधिक CSR, उतनी विश्वसनीय कंपनी। 95%+ CSR वाली कंपनी चुनें।',
    example: 'HDFC ERGO ki CSR 99.16% hai — matlab 100 mein se 99 claims settle hoti hain.',
  },
  {
    term: 'IDV (Insured Declared Value)',
    short: 'The current market value of your vehicle as declared in the policy.',
    hinglish: 'IDV aapki gaadi ki current market value hai — yeh maximum amount hai jo theft ya total loss mein aapko milega. IDV zyada hona achha hai, premium thoda badhta hai lekin claim mein zyada paisa milta hai.',
    hindi: 'IDV आपकी गाड़ी की वर्तमान बाज़ार मूल्य है — यह अधिकतम राशि है जो चोरी या कुल नुकसान में आपको मिलेगी। IDV अधिक होना अच्छा है, प्रीमियम थोड़ा बढ़ता है लेकिन क्लेम में अधिक पैसा मिलता है।',
    example: 'Agar aapki Swift ka IDV ₹5 lakh hai aur gaadi chori ho jaye, toh ₹5 lakh tak claim mil sakta hai.',
  },
  {
    term: 'NCB (No Claim Bonus)',
    short: 'Discount on premium for every claim-free year.',
    hinglish: 'NCB woh discount hai jo aapko milta hai jab aap koi claim nahi karte. Har claim-free saal ke baad premium mein 20% se 50% tak discount badhta hai. Yeh accumulate hota hai — 5 saal tak no claim means 50% discount!',
    hindi: 'NCB वह छूट है जो आपको मिलती है जब आप कोई क्लेम नहीं करते। हर क्लेम-मुक्त वर्ष के बाद प्रीमियम में 20% से 50% तक छूट बढ़ती है। यह संचित होता है — 5 साल तक कोई क्लेम नहीं तो 50% छूट!',
    example: '₹10,000 premium par 50% NCB = sirf ₹5,000 pay karna padega next year.',
  },
  {
    term: 'Zero Depreciation',
    short: 'Cover that pays full claim without deducting depreciation on parts.',
    hinglish: 'Normal policy mein plastic parts par 50% aur metal parts par 5-10% depreciation cut hota hai. Zero Dep cover mein yeh cut nahi hota — company full amount pay karti hai. New car ke liye must-have add-on hai.',
    hindi: 'सामान्य पॉलिसी में प्लास्टिक पार्ट्स पर 50% और मेटल पार्ट्स पर 5-10% मूल्यह्रास कटता है। ज़ीरो डेप कवर में यह कट नहीं होता — कंपनी पूरी राशि देती है। नई कार के लिए ज़रूरी ऐड-ऑन।',
    example: 'Bumper change ₹15,000 ka hai — Zero Dep mein poora milega, normal mein sirf ₹7,500.',
  },
  {
    term: 'Premium',
    short: 'The amount you pay to the insurer to keep your policy active.',
    hinglish: 'Premium woh paisa hai jo aap insurance company ko dete hain policy active rakhne ke liye. Yeh monthly, quarterly, ya yearly pay kar sakte hain. Premium kam hona achha hai, lekin coverage bhi check karna zaroori hai.',
    hindi: 'प्रीमियम वह पैसा है जो आप बीमा कंपनी को देते हैं पॉलिसी एक्टिव रखने के लिए। यह मासिक, त्रैमासिक या वार्षिक भुगतान कर सकते हैं। प्रीमियम कम होना अच्छा है, लेकिन कवरेज भी जांचना ज़रूरी।',
    example: 'Health insurance ₹2,000/month premium pe ₹10 lakh ka cover mil sakta hai.',
  },
  {
    term: 'Deductible',
    short: 'The fixed amount you pay from your pocket before insurer pays the rest.',
    hinglish: 'Deductible woh amount hai jo claim ke time aapko khud pay karna padta hai, baaki company pay karti hai. Compulsory deductible IRDAI fix karti hai, voluntary deductible aap choose karte hain — zyada deductible = kam premium.',
    hindi: 'डिडक्टिबल वह राशि है जो क्लेम के समय आपको खुद चुकानी पड़ती है, बाकी कंपनी देती है। अनिवार्य डिडक्टिबल IRDAI तय करती है, स्वैच्छिक आप चुनते हैं — अधिक डिडक्टिबल = कम प्रीमियम।',
    example: '₹5,000 deductible hai aur bill ₹25,000 ka hai — aap ₹5,000, company ₹20,000 pay karegi.',
  },
  {
    term: 'Copay',
    short: 'A fixed percentage of the claim amount you must pay.',
    hinglish: 'Copay matlab claim ka ek fixed percent aapko pay karna padta hai. Agar 20% copay hai aur bill ₹50,000 ka hai, toh aap ₹10,000 denge aur company ₹40,000. Senior citizen policies mein zyada copay hota hai.',
    hindi: 'कोपे का अर्थ है क्लेम का एक निश्चित प्रतिशत आपको चुकाना पड़ता है। यदि 20% कोपे है और बिल ₹50,000 का है, तो आप ₹10,000 देंगे और कंपनी ₹40,000। वरिष्ठ नागरिक पॉलिसी में अधिक कोपे होता है।',
    example: '10% copay with ₹5 lakh cover — ₹50,000 bill pe aap ₹5,000 pay karein.',
  },
  {
    term: 'Sum Insured',
    short: 'The maximum amount the insurer will pay for a covered claim.',
    hinglish: 'Sum Insured woh maximum amount hai jo insurance company ek claim mein pay kar sakti hai. Yeh aapka coverage limit hai. Health mein ₹5 lakh ya ₹10 lakh, car mein IDV, life mein sum assured — sab same concept hai.',
    hindi: 'सम इंश्योर्ड वह अधिकतम राशि है जो बीमा कंपनी एक क्लेम में दे सकती है। यह आपकी कवरेज सीमा है। हेल्थ में ₹5 लाख या ₹10 लाख, कार में IDV, लाइफ में सम एश्योर्ड — सब एक ही कॉन्सेप्ट।',
    example: '₹10 lakh sum insured hai aur hospital bill ₹8 lakh ka hai — poora cover hoga.',
  },
  {
    term: 'Riders',
    short: 'Optional add-on benefits that enhance your base insurance policy.',
    hinglish: 'Riders woh extra benefits hain jo aap apni base policy mein add kar sakte hain. Jaise critical illness rider, accident cover, hospital cash — yeh alag se premium lagti hai lekin extra protection milti hai.',
    hindi: 'राइडर्स वह अतिरिक्त लाभ हैं जो आप अपनी बेस पॉलिसी में जोड़ सकते हैं। जैसे क्रिटिकल इलनेस राइडर, एक्सीडेंट कवर, हॉस्पिटल कैश — यह अलग प्रीमियम लगती है लेकिन अतिरिक्त सुरक्षा मिलती है।',
    example: '₹500/month extra for Critical Illness Rider — 40 diseases ka ₹10 lakh cover mil jayega.',
  },
  {
    term: 'Floater Plan',
    short: 'A single policy covering the entire family under one sum insured.',
    hinglish: 'Floater plan mein ek hi policy poore family ko cover karti hai. Sum insured sab share karte hain — agar papa ne ₹3 lakh use kiya toh bacha hua ₹7 lakh baaki family ke liye. Individual se sasta hota hai.',
    hindi: 'फ्लोटर प्लान में एक ही पॉलिसी पूरे परिवार को कवर करती है। सम इंश्योर्ड सब शेयर करते हैं — अगर पापा ने ₹3 लाख इस्तेमाल किया तो बचा हुआ ₹7 लाख बाकी परिवार के लिए। इंडिविजुअल से सस्ता होता है।',
    example: '₹10 lakh family floater — Papa, Mamma, 2 bacche sab covered ek premium mein.',
  },
  {
    term: 'Waiting Period',
    short: 'The initial period during which certain claims are not payable.',
    hinglish: 'Waiting period woh time hai jab aapki policy active hai lekin kuch claims nahi milte. Initial 30 days general waiting, 2-4 saal pre-existing diseases ke liye. Policy lene se pehle yeh check karna bahut zaroori hai.',
    hindi: 'वेटिंग पीरियड वह समय है जब आपकी पॉलिसी एक्टिव है लेकिन कुछ क्लेम नहीं मिलते। प्रारंभिक 30 दिन सामान्य वेटिंग, 2-4 साल पूर्व-मौजूदा बीमारियों के लिए। पॉलिसी लेने से पहले यह जांचना बहुत ज़रूरी।',
    example: 'Diabetes hai aur 3 saal ki waiting period — pehle 3 saal diabetes ka claim nahi milega.',
  },
  {
    term: 'Pre-existing Disease',
    short: 'A medical condition that existed before the insurance policy started.',
    hinglish: 'Pre-existing disease woh bimari hai jo policy lene se pehle se hai — jaise diabetes, BP, thyroid. Inka cover 2-4 saal ki waiting period ke baad hi start hota hai. Achhi policy kam waiting period deti hai.',
    hindi: 'प्री-एग्जिस्टिंग डिजीज़ वह बीमारी है जो पॉलिसी लेने से पहले से है — जैसे डायबिटीज़, बीपी, थायरॉइड। इनका कवर 2-4 साल की वेटिंग पीरियड के बाद ही शुरू होता है। अच्छी पॉलिसी कम वेटिंग देती है।',
    example: 'Policy lene se pehle se BP hai — 2 saal tak BP ka claim nahi milega.',
  },
  {
    term: 'Network Hospital',
    short: 'Hospitals empanelled with the insurer for cashless treatment.',
    hinglish: 'Network hospital woh hospitals hain jo insurance company se tied up hain. Yahan cashless treatment hota hai — aapko paisa pay nahi karna padta, company directly bill pay karti hai. Zyada network hospitals = zyada convenient.',
    hindi: 'नेटवर्क हॉस्पिटल वह अस्पताल हैं जो बीमा कंपनी से जुड़े हैं। यहाँ कैशलेस ट्रीटमेंट होता है — आपको पैसा चुकाना नहीं पड़ता, कंपनी सीधे बिल देती है। अधिक नेटवर्क = अधिक सुविधा।',
    example: 'Apollo Hospital network mein hai — ₹3 lakh ka treatment bina paisa diye ho jayega.',
  },
  {
    term: 'Cashless Claim',
    short: 'Claim where insurer pays the hospital directly — you pay nothing.',
    hinglish: 'Cashless claim mein aapko hospital ko paisa pay nahi karna padta — insurance company directly hospital ko pay karti hai. Sirf network hospitals mein yeh facility milti hai. Pre-approval lena zaroori hai emergency ke alawa.',
    hindi: 'कैशलेस क्लेम में आपको अस्पताल को पैसा चुकाना नहीं पड़ता — बीमा कंपनी सीधे अस्पताल को भुगतान करती है। केवल नेटवर्क हॉस्पिटल में यह सुविधा मिलती है। इमरजेंसी के अलावा प्री-अप्रूवल लेना ज़रूरी।',
    example: 'Planned surgery ke liye 3 din pehle pre-approval lein — cashless treatment ho jayega.',
  },
  {
    term: 'Reimbursement',
    short: 'You pay the hospital first, then insurer pays you back.',
    hinglish: 'Reimbursement mein pehle aap hospital ko pay karte hain, phir insurance company se paisa wapas lete hain. Non-network hospital mein yeh process hota hai. Bills aur documents submit karne padte hain — 15-30 din mein paisa milta hai.',
    hindi: 'रीम्बर्समेंट में पहले आप अस्पताल को भुगतान करते हैं, फिर बीमा कंपनी से पैसा वापस लेते हैं। नॉन-नेटवर्क हॉस्पिटल में यह प्रक्रिया होती है। बिल और दस्तावेज़ जमा करने पड़ते हैं — 15-30 दिन में पैसा मिलता है।',
    example: '₹2 lakh ka bill pay kiya — 20 din mein company se ₹2 lakh reimbursement mil gaya.',
  },
  {
    term: 'Free Look Period',
    short: '15-day window to cancel a new policy with full refund if terms are unsatisfactory.',
    hinglish: 'Free Look Period woh 15 din hain jab aap nayi policy cancel kar sakte hain bina kisi penalty ke. Policy document milne ke baad agar terms pasand na aayein toh refund le sakte hain. Sirf medical deduction hoga, baaki poora paisa wapas.',
    hindi: 'फ्री लुक पीरियड वह 15 दिन हैं जब आप नई पॉलिसी किसी जुर्माने के बिना रद्द कर सकते हैं। पॉलिसी दस्तावेज़ मिलने के बाद अगर शर्तें पसंद न आएं तो रिफंड ले सकते हैं। केवल मेडिकल कटेगा, बाकी पूरा पैसा वापस।',
    example: 'Policy li Thursday ko — agle 15 din mein cancel kiya toh full refund milega.',
  },
  {
    term: 'Portability',
    short: 'Right to switch insurers without losing waiting period benefits.',
    hinglish: 'Portability ka matlab hai aap apni insurance company change kar sakte hain bina waiting period lose kiye. Naya insurer aapki purani company ka credit transfer karega. Apply karein renewal se 45 din pehle.',
    hindi: 'पोर्टेबिलिटी का अर्थ है आप बीमा कंपनी बदल सकते हैं बिना वेटिंग पीरियड खोए। नया इंश्योरर पुरानी कंपनी का क्रेडिट ट्रांसफर करेगा। रिन्यूअल से 45 दिन पहले अप्लाई करें।',
    example: '2 saal XYZ company mein the — ABC company shift kiya toh 2 saal ki waiting period bhi saath chale jayegi.',
  },
  {
    term: 'Endorsement',
    short: 'A written amendment to modify terms of an existing insurance policy.',
    hinglish: 'Endorsement woh change hai jo aap apni existing policy mein karwate hain — jaise naam change, address update, sum insured badhana, car ka CNG fit karwana. Yeh written amendment hota hai policy document mein.',
    hindi: 'एंडोर्समेंट वह परिवर्तन है जो आप अपनी मौजूदा पॉलिसी में करवाते हैं — जैसे नाम बदलना, पता अपडेट, सम इंश्योर्ड बढ़ाना, कार में CNG लगवाना। यह पॉलिसी दस्तावेज़ में लिखित संशोधन होता है।',
    example: 'Shaadi ke baad wife ka naam add karwana — yeh endorsement hai, premium thodi badh jayegi.',
  },
  {
    term: 'Third-Party Insurance',
    short: 'Mandatory insurance covering damage/injury to others caused by your vehicle.',
    hinglish: 'Third-Party Insurance legally mandatory hai India mein. Yeh cover karta hai agar aapki gaadi se kisi doosre ko nuksan ho — injury ya property damage. Aapki gaadi ka nuksan isme cover nahi hota, sirf dusre ka nuksan cover hota hai.',
    hindi: 'थर्ड-पार्टी इंश्योरेंस कानूनी रूप से अनिवार्य है भारत में। यह कवर करता है अगर आपकी गाड़ी से किसी दूसरे को नुकसान हो — चोट या संपत्ति क्षति। आपकी गाड़ी का नुकसान इसमें कवर नहीं होता।',
    example: 'Aapki gaadi se kisi ki gaadi takkar — uski repair cost third-party insurance dega.',
  },
  {
    term: 'Comprehensive Insurance',
    short: 'Full coverage including third-party liability and own vehicle damage.',
    hinglish: 'Comprehensive Insurance sabse complete cover hai — third-party + aapki gaadi ka nuksan dono covered. Theft, fire, natural disaster, accident — sab cover hota hai. Third-party se zyada premium lekin poora protection.',
    hindi: 'कॉम्प्रिहेंसिव इंश्योरेंस सबसे पूर्ण कवर है — थर्ड-पार्टी + आपकी गाड़ी का नुकसान दोनों कवर्ड। चोरी, आग, प्राकृतिक आपदा, दुर्घटना — सब कवर होता है। थर्ड-पार्टी से अधिक प्रीमियम लेकिन पूरा सुरक्षा।',
    example: 'Badi aayi gaadi khharab — comprehensive policy se repair ka paisa mil jayega.',
  },
  {
    term: 'Grace Period',
    short: 'Extra time after premium due date to pay without losing coverage.',
    hinglish: 'Grace Period woh extra time hai jo insurance company deti hai premium pay karne ke liye. Health insurance mein 30 din, life insurance mein 30-31 din. Iske andar pay karne par policy continue rehti hai, lekin iske baad lapse ho jayegi.',
    hindi: 'ग्रेस पीरियड वह अतिरिक्त समय है जो बीमा कंपनी प्रीमियम भुगतान के लिए देती है। हेल्थ इंश्योरेंस में 30 दिन, लाइफ इंश्योरेंस में 30-31 दिन। इसके भीतर भुगतान पर पॉलिसी जारी रहती है, लेकिन इसके बाद लैप्स हो जाएगी।',
    example: 'Premium 5th due tha, 25th tak pay kiya — grace period mein tha, policy active hai.',
  },
  {
    term: 'Surrender Value',
    short: 'Amount received when you surrender a life insurance policy before maturity.',
    hinglish: 'Surrender Value woh paisa hai jo aapko milta hai agar aap life insurance policy maturity se pehle band kar dete hain. Kam se kam 3 saal premium pay karne ke baad hi surrender value milti hai. Early withdrawal mein loss hota hai.',
    hindi: 'सरेंडर वैल्यू वह पैसा है जो आपको मिलता है अगर आप लाइफ इंश्योरेंस पॉलिसी परिपक्वता से पहले बंद कर देते हैं। कम से कम 3 साल प्रीमियम भुगतान के बाद ही सरेंडर वैल्यू मिलती है। जल्दी निकासी में नुकसान होता है।',
    example: '₹5 lakh policy, 3 saal premium pay ki — surrender value sirf ₹1.5 lakh milegi.',
  },
  {
    term: 'Maturity Benefit',
    short: 'Lump sum amount received when a life insurance policy completes its term.',
    hinglish: 'Maturity Benefit woh lump sum amount hai jo policy ke term complete hone par milti hai. Endowment aur money-back plans mein yeh hota hai. Term insurance mein maturity benefit nahi hota — sirf death benefit hota hai.',
    hindi: 'मैच्योरिटी बेनिफिट वह एकमुश्त राशि है जो पॉलिसी की अवधि पूरी होने पर मिलती है। एंडोमेंट और मनी-बैक प्लान में यह होता है। टर्म इंश्योरेंस में मैच्योरिटी बेनिफिट नहीं होता — केवल डेथ बेनिफिट।',
    example: '₹10 lakh endowment policy 20 saal ki — maturity pe ₹10 lakh + bonus milega.',
  },
  {
    term: 'Death Benefit',
    short: 'Amount paid to the nominee when the insured person passes away.',
    hinglish: 'Death Benefit woh amount hai jo insured ki maut ke baad nominee ko milti hai. Term insurance mein yeh sum assured hota hai, endowment mein sum assured + bonus. Nominee ka naam saath mein rakhna zaroori hai.',
    hindi: 'डेथ बेनिफिट वह राशि है जो बीमित की मृत्यु के बाद नॉमिनी को मिलती है। टर्म इंश्योरेंस में यह सम एश्योर्ड होता है, एंडोमेंट में सम एश्योर्ड + बोनस। नॉमिनी का नाम साथ रखना ज़रूरी।',
    example: '₹1 crore term insurance — insured ki death par nominee ko ₹1 crore milega.',
  },
  {
    term: 'Critical Illness Rider',
    short: 'Add-on that pays a lump sum on diagnosis of specified critical diseases.',
    hinglish: 'Critical Illness Rider ek add-on hai jo diagnosis par lump sum deta hai — hospitalization zaroori nahi. Cancer, heart attack, kidney failure jaisi 40+ diseases covered. Health insurance se alag hai — yeh income replacement ke liye hai.',
    hindi: 'क्रिटिकल इलनेस राइडर एक ऐड-ऑन है जो निदान पर एकमुश्त देता है — अस्पताल में भर्ती ज़रूरी नहीं। कैंसर, हार्ट अटैक, किडनी फेल जैसी 40+ बीमारियाँ कवर्ड। हेल्थ इंश्योरेंस से अलग — यह आय प्रतिस्थापन के लिए।',
    example: 'Cancer diagnose hua — rider se ₹10 lakh lump sum mila, health insurance bhi separately claim hoga.',
  },
  {
    term: 'Personal Accident Cover',
    short: 'Insurance covering death, disability, or injury due to an accident.',
    hinglish: 'Personal Accident Cover accident se hone wali death, disability ya injury ke liye compensation deta hai. Death mein full sum insured, disability mein percentage ke hisaab se. Two-wheeler waalon ke liye bahut zaroori hai — ₹15 lakh cover kam premium mein.',
    hindi: 'पर्सनल एक्सीडेंट कवर दुर्घटना से होने वाली मृत्यु, विकलांगता या चोट के लिए मुआवज़ा देता है। मृत्यु में पूरा सम इंश्योर्ड, विकलांगता में प्रतिशत के अनुसार। टू-व्हीलर वालों के लिए बहुत ज़रूरी।',
    example: 'Bike accident mein leg fracture — ₹5 lakh accident cover se lump sum payment mila.',
  },
  {
    term: 'Return to Invoice',
    short: 'Add-on that pays the original invoice price of the vehicle on total loss/theft.',
    hinglish: 'Return to Invoice add-on aapko gaadi ke original invoice price deta hai — IDV se zyada. Agar nayi gaadi chori ho jaye ya total loss ho, toh showroom price + registration + insurance sab mil jayega. New car ke liye best add-on hai.',
    hindi: 'रिटर्न टू इनवॉइस ऐड-ऑन आपको गाड़ी की मूल इनवॉइस कीमत देता है — IDV से अधिक। अगर नई गाड़ी चोरी हो या कुल नुकसान, तो शोरूम प्राइस + रजिस्ट्रेशन + इंश्योरेंस सब मिल जाएगा। नई कार के लिए सर्वोत्तम।',
    example: '₹8 lakh ki nayi gaadi chori — IDV ₹7 lakh, lekin Return to Invoice se poore ₹8 lakh milega.',
  },
  {
    term: 'Roadside Assistance',
    short: 'Add-on providing help during vehicle breakdowns — towing, fuel, flat tire, etc.',
    hinglish: 'Roadside Assistance add-on breakdown mein help karta hai — towing, flat tire change, fuel delivery, battery jumpstart, lost key assistance. Highway pe stuck ho toh ek call pe help aati hai. Frequent travelers ke liye must hai.',
    hindi: 'रोडसाइड असिस्टेंस ऐड-ऑन ब्रेकडाउन में मदद करता है — टोइंग, फ्लैट टायर, फ्यूल डिलीवरी, बैटरी जंपस्टार्ट। हाईवे पर फंसे तो एक कॉल पर मदद आती है। बार-बार यात्रा करने वालों के लिए ज़रूरी।',
    example: 'Highway pe tire puncture — ek call pe RSA team aa kar change kar dega, free mein.',
  },
  {
    term: 'Engine Protect',
    short: 'Add-on covering engine damage due to water ingression, lubricant leakage, etc.',
    hinglish: 'Engine Protect add-on standard policy mein excluded engine damage cover karta hai — water se engine mein ghusna, hydrostatic lock, lubricant leakage. Baarish mein waterlogging common hai India mein — yeh add-on bahut useful hai.',
    hindi: 'इंजन प्रोटेक्ट ऐड-ऑन स्टैंडर्ड पॉलिसी में बाहर इंजन डैमेज कवर करता है — पानी से इंजन में घुसना, हाइड्रोस्टैटिक लॉक, लुब्रिकेंट लीकेज। बारिश में वॉटरलॉगिंग भारत में आम है — यह बहुत उपयोगी।',
    example: 'Barish mein waterlogging mein gaadi chalayi — engine kharab, ₹80,000 repair Engine Protect se cover hoga.',
  },
  {
    term: 'Consumables Cover',
    short: 'Add-on paying for consumable items used during vehicle repair (oil, nuts, bolts, etc.).',
    hinglish: 'Consumables Cover woh add-on hai jo repair ke time use hone wale chhote items cover karta hai — engine oil, coolant, nuts-bolts, washer, AC gas. Standard policy mein yeh excluded hote hain aur khud pay karna padta hai.',
    hindi: 'कंस्यूमेबल्स कवर वह ऐड-ऑन है जो रिपेयर में इस्तेमाल होने वाली छोटी चीज़ें कवर करता है — इंजन ऑयल, कूलेंट, नट-बोल्ट। स्टैंडर्ड पॉलिसी में यह बाहर होते हैं और खुद चुकाना पड़ता है।',
    example: '₹20,000 repair mein ₹3,000 consumables the — yeh add-on cover karega.',
  },
  {
    term: 'AYUSH Treatment',
    short: 'Coverage for Ayurveda, Yoga, Unani, Siddha, and Homeopathy treatments.',
    hinglish: 'AYUSH cover karta hai Ayurveda, Yoga, Unani, Siddha, aur Homeopathy treatments. IRDAI ke rules ke mutabiq yeh sab health insurance mein cover hona chahiye. Kai log allopathy prefer nahi karte — unke liye yeh option available hai.',
    hindi: 'AYUSH कवर करता है आयुर्वेद, योग, यूनानी, सिद्ध और होम्योपैथी ट्रीटमेंट। IRDAI के नियमों के अनुसार यह सभी हेल्थ इंश्योरेंस में कवर होना चाहिए। कई लोग एलोपैथी पसंद नहीं करते — उनके लिए यह विकल्प उपलब्ध।',
    example: 'Ayurvedic hospital mein ₹50,000 ka treatment — AYUSH cover se claim mil jayega.',
  },
  {
    term: 'Room Rent Limit',
    short: 'Maximum daily room rent the insurer will cover during hospitalization.',
    hinglish: 'Room Rent Limit woh capping hai jo insurance company room rent ke liye deti hai. Agar limit ₹5,000/day hai aur aap ₹8,000 ka room lete hain, toh ₹3,000 khud pay karna padega. Best hai jo policy no room rent limit de.',
    hindi: 'रूम रेंट लिमिट वह सीमा है जो बीमा कंपनी कमरा किराये के लिए देती है। अगर सीमा ₹5,000/दिन है और आप ₹8,000 का कमरा लेते हैं, तो ₹3,000 खुद चुकाने पड़ेंगे। सबसे अच्छी वो पॉलिसी जिसमें कोई लिमिट न हो।',
    example: '₹5,000/day limit — private room ₹8,000/day liya toh har din ₹3,000 aapko dena padega.',
  },
  {
    term: 'Sub-limit',
    short: 'Internal capping on specific medical treatments within the overall sum insured.',
    hinglish: 'Sub-limit woh chhoti capping hai jo specific treatments par lagti hai — jaise cataract ₹40,000, knee replacement ₹2 lakh. Overall sum insured ₹10 lakh ho, lekin particular treatment ka alag limit hoga. Policy document mein chhupa hota hai — dhyan se padhein.',
    hindi: 'सब-लिमिट वह छोटी सीमा है जो विशिष्ट ट्रीटमेंट पर लगती है — जैसे मोतियाबिंद ₹40,000, घुटना ₹2 लाख। कुल सम इंश्योर्ड ₹10 लाख हो, लेकिन विशेष ट्रीटमेंट की अलग सीमा। पॉलिसी दस्तावेज़ में छिपा — ध्यान से पढ़ें।',
    example: '₹10 lakh cover hai lekin cataract ka sub-limit sirf ₹40,000 — baaki aapko pay karna padega.',
  },
  {
    term: 'Restore Benefit',
    short: 'Automatically restores the sum insured if exhausted during the policy year.',
    hinglish: 'Restore Benefit tab kaam aata hai jab aapka sum insured same year mein khatam ho jaye. Company automatically same amount restore kar deti hai — bina extra premium ke. Lekin generally same illness ke liye nahi, dusri illness ke liye.',
    hindi: 'रिस्टोर बेनिफिट तब काम आता है जब आपका सम इंश्योर्ड उसी वर्ष में खत्म हो जाए। कंपनी स्वचालित वही राशि रिस्टोर कर देती है — बिना अतिरिक्त प्रीमियम। लेकिन आमतौर पर उसी बीमारी के लिए नहीं, दूसरी के लिए।',
    example: '₹10 lakh use ho gaya — restore se phir ₹10 lakh mil gaya dusri illness ke liye.',
  },
  {
    term: 'Super Top-up',
    short: 'Covers total of all claims above the deductible in a policy year.',
    hinglish: 'Super Top-up ek aisa plan hai jo aggregate deductible ke upar saare claims cover karta hai. Jaise agar ₹5 lakh deductible hai aur saal mein total ₹8 lakh ke bills aaye, toh ₹3 lakh super top-up se milega. Regular top-up se better kyunki yeh cumulative hai.',
    hindi: 'सुपर टॉप-अप एक ऐसा प्लान है जो एग्रीगेट डिडक्टिबल के ऊपर सभी क्लेम कवर करता है। जैसे ₹5 लाख डिडक्टिबल और साल में कुल ₹8 लाख बिल, तो ₹3 लाख सुपर टॉप-अप से। रेगुलर टॉप-अप से बेहतर क्योंकि यह संचयी है।',
    example: '₹5 lakh base + ₹15 lakh super top-up = ₹20 lakh total protection ₹3,000/year mein.',
  },
  {
    term: 'Top-up Plan',
    short: 'Extra coverage that activates when a single claim exceeds the deductible.',
    hinglish: 'Top-up Plan extra coverage deta hai jab ek hi claim deductible se zyada ho. Jaise ₹5 lakh deductible ke upar top-up laga hai — ek hi hospitalization mein ₹7 lakh ka bill aaye toh ₹2 lakh top-up se milega. Super top-up se alag hai kyunki yeh per-claim basis par kaam karta hai.',
    hindi: 'टॉप-अप प्लान अतिरिक्त कवरेज देता है जब एक ही क्लेम डिडक्टिबल से अधिक हो। जैसे ₹5 लाख डिडक्टिबल — एक ही अस्पताल में ₹7 लाख बिल तो ₹2 लाख टॉप-अप से। सुपर टॉप-अप से अलग क्योंकि यह प्रति-क्लेम आधार पर काम करता है।',
    example: '₹3 lakh base plan + ₹10 lakh top-up @ ₹2,000/year = better coverage kam price mein.',
  },
];

// ── Helper: Get deterministic index based on date ────────────────────────────
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// ── Helper: Share to WhatsApp ────────────────────────────────────────────────
function shareToWhatsApp(term: InsuranceTerm, lang: Language) {
  const explanation = lang === 'hinglish' ? term.hinglish : lang === 'hi' ? term.hindi : term.short;
  const text = `📖 *Insurance Word of the Day*\n\n📌 *${term.term}*\n${explanation}\n\n💡 ${term.example}\n\n— Shared from PaliwalSecure.in`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// ── Component ────────────────────────────────────────────────────────────────
export default function InsuranceWordOfDay() {
  const { language } = useLanguage();
  const dayIndex = getDayOfYear() % insuranceTerms.length;
  const [currentIndex, setCurrentIndex] = useState(dayIndex);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Auto-update on day change
  useEffect(() => {
    const currentDayRef = getDayOfYear();
    const interval = setInterval(() => {
      const newDay = getDayOfYear();
      if (newDay !== currentDayRef) {
        setCurrentIndex(newDay % insuranceTerms.length);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % insuranceTerms.length);
  }, []);

  const currentTerm = insuranceTerms[currentIndex];

  // Language-specific explanation
  const explanation =
    language === 'hinglish'
      ? currentTerm.hinglish
      : language === 'hi'
        ? currentTerm.hindi
        : currentTerm.short;

  const labelWordOfDay =
    language === 'hi'
      ? 'आज का बीमा शब्द'
      : language === 'hinglish'
        ? 'Aaj ka Insurance Shabd'
        : 'Insurance Word of the Day';

  const labelNext =
    language === 'hi'
      ? 'अगला →'
      : language === 'hinglish'
        ? 'Next →'
        : 'Next →';

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/40 shadow-sm">
      {/* Gradient left border */}
      <div className="flex">
        {/* Left accent bar */}
        <div className="hidden sm:block w-1.5 shrink-0 bg-gradient-to-b from-cyan-500 via-teal-400 to-emerald-500" />

        <div className="flex-1 p-4 sm:p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="space-y-2"
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex size-7 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/50 shrink-0">
                    <BookOpen className="size-3.5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <Badge className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800">
                    📖 {labelWordOfDay}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* WhatsApp share */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareToWhatsApp(currentTerm, language)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
                    aria-label="Share on WhatsApp"
                  >
                    <Share2 className="size-3.5" />
                  </Button>

                  {/* Next Word */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    className="h-7 gap-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                    aria-label="Next word"
                  >
                    {labelNext}
                    <ChevronRight className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Term name */}
              <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                {currentTerm.term}
              </h3>

              {/* Language-specific explanation — compact, max 2 lines visible */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {explanation}
              </p>

              {/* Example line */}
              <p className="text-[11px] sm:text-xs text-cyan-700 dark:text-cyan-400 leading-snug">
                💡 {currentTerm.example}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
