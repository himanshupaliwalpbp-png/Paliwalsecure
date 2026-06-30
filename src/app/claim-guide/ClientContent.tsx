'use client';

import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import Link from 'next/link';

// ── Translation helper ──────────────────────────────────────────────────────
type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

// ── Inline page translations ────────────────────────────────────────────────
const pageText = {
  hero: {
    badge: { en: "Poora Claim Guide", hi: "पूर्ण क्लेम गाइड", hinglish: "Poora Claim Guide" },
    title1: { en: "Insurance Claim Guide –", hi: "इंश्योरेंस क्लेम गाइड –", hinglish: "Insurance Claim Guide –" },
    titleHighlight: { en: "Cashless & Reimbursement", hi: "कैशलेस और प्रतिपूर्ति", hinglish: "Cashless & Reimbursement" },
    titleSuffix: { en: "Process", hi: "प्रक्रिया", hinglish: "Process" },
    desc: {
      en: "Step-by-step guide to filing health and car insurance claims in India. Cashless vs reimbursement process, documents needed, IRDAI timelines, rejection reasons, and appeal process.",
      hi: "भारत में हेल्थ और कार इंश्योरेंस क्लेम दर्ज करने की चरण-दर-चरण गाइड। कैशलेस बनाम प्रतिपूर्ति प्रक्रिया, आवश्यक दस्तावेज़, IRDAI समयसीमा, अस्वीकृति कारण और अपील प्रक्रिया।",
      hinglish: "India mein health aur car insurance claims file karne ki step-by-step guide. Cashless vs reimbursement process, zaroori documents, IRDAI timelines, rejection reasons, aur appeal process."
    },
    ctaHelp: { en: "Free Claim Help Lo", hi: "मुफ़्त क्लेम मदद लें", hinglish: "Free Claim Help Lo" },
    ctaHealth: { en: "Health Plans Dekhein", hi: "हेल्थ प्लान देखें", hinglish: "Health Plans Dekhein" },
  },
  toc: {
    heading: { en: "📋 Is Guide Mein", hi: "📋 इस गाइड में", hinglish: "📋 Is Guide Mein" },
    items: [
      { en: "Insurance Claims Kaise Kaam Karti Hain", hi: "इंश्योरेंस क्लेम कैसे काम करती हैं", hinglish: "Insurance Claims Kaise Kaam Karti Hain" },
      { en: "Health Insurance Claims", hi: "हेल्थ इंश्योरेंस क्लेम", hinglish: "Health Insurance Claims" },
      { en: "Car Insurance Claims", hi: "कार इंश्योरेंस क्लेम", hinglish: "Car Insurance Claims" },
      { en: "Top 10 Rejection Reasons", hi: "शीर्ष 10 अस्वीकृति कारण", hinglish: "Top 10 Rejection Reasons" },
      { en: "Claim Appeal Kaise Karein", hi: "क्लेम अपील कैसे करें", hinglish: "Claim Appeal Kaise Karein" },
      { en: "IRDAI Timelines", hi: "IRDAI समयसीमा", hinglish: "IRDAI Timelines" },
      { en: "FAQs", hi: "सवाल-जवाब", hinglish: "FAQs" },
      { en: "Expert Ki Advice", hi: "विशेषज्ञ की सलाह", hinglish: "Expert Ki Advice" },
    ],
  },
  howClaimsWork: {
    heading: { en: "India Mein Insurance Claims Kaise Kaam Karti Hain", hi: "भारत में इंश्योरेंस क्लेम कैसे काम करती हैं", hinglish: "India Mein Insurance Claims Kaise Kaam Karti Hain" },
    paragraphs: [
      { en: "Insurance claim ek formal request hoti hai jo policyholder insurance company ko deta hai — policy ke terms ke hisaab se paise maangne ke liye. Jab aap insurance policy kharidte hain, aap aur insurer ke beech ek contract hota hai jismein insurer wada karta hai ki specific financial losses cover karega.", hi: "इंश्योरेंस क्लेम एक औपचारिक अनुरोध है जो पॉलिसीधारक बीमा कंपनी को देता है — पॉलिसी की शर्तों के अनुसार पैसे माँगने के लिए। जब आप बीमा पॉलिसी खरीदते हैं, तो आप और बीमाकर्ता के बीच एक अनुबंध होता है।", hinglish: "Insurance claim ek formal request hoti hai jo policyholder insurance company ko deta hai — policy ke terms ke hisaab se paise maangne ke liye. Jab aap insurance policy khareedte hain, aap aur insurer ke beech ek contract hota hai." },
      { en: "Claim process tab shuru hota hai jab koi insured event ho — hospitalization, car accident, theft, ya koi bhi covered incident. Aapko insurer ko jaldi batana padta hai, zaroori documents submit karne hote hain, aur prescribed process follow karni padti hai.", hi: "क्लेम प्रक्रिया तब शुरू होती है जब कोई बीमित घटना हो — अस्पताल में भर्ती, कार दुर्घटना, चोरी, या कोई भी कवर की गई घटना। आपको बीमाकर्ता को जल्दी बताना पड़ता है।", hinglish: "Claim process tab shuru hota hai jab koi insured event ho — hospitalization, car accident, theft, ya koi bhi covered incident. Aapko insurer ko jaldi batana padta hai." },
      { en: "India mein, IRDAI claim settlement process ko govern karta hai aur policyholders ki protection ke liye strict timelines aur guidelines banayi hain. India mein mainly do tarah ke claim settlement methods hain: cashless claims aur reimbursement claims.", hi: "भारत में, IRDAI क्लेम निपटान प्रक्रिया को नियंत्रित करता है और पॉलिसीधारकों की सुरक्षा के लिए सख्त समयसीमा और दिशानिर्देश बनाए हैं। भारत में मुख्य रूप से दो प्रकार के क्लेम निपटान विधियाँ हैं: कैशलेस और प्रतिपूर्ति।", hinglish: "India mein, IRDAI claim settlement process ko govern karta hai aur policyholders ki protection ke liye strict timelines aur guidelines banayi hain. India mein mainly do tarah ke claim settlement methods hain: cashless aur reimbursement." },
    ],
  },
  healthClaims: {
    heading: { en: "Health Insurance Claims", hi: "हेल्थ इंश्योरेंस क्लेम", hinglish: "Health Insurance Claims" },
    cashlessTitle: { en: "Cashless Claim Process", hi: "कैशलेस क्लेम प्रक्रिया", hinglish: "Cashless Claim Process" },
    cashlessSteps: [
      { en: "Network hospital mein jaayein — Health card aur valid ID proof saath le kar jaayein.", hi: "नेटवर्क अस्पताल में जाएँ — हेल्थ कार्ड और वैध ID प्रमाण साथ ले कर जाएँ।", hinglish: "Network hospital mein jaayein — Health card aur valid ID proof saath le kar jaayein." },
      { en: "Pre-auth form submit karein — Hospital ki insurance desk yeh form fill karke TPA/insurer ko bhejti hai. IRDAI ka rule hai — 1 ghante mein approval aana chahiye.", hi: "प्री-ऑथ फॉर्म जमा करें — अस्पताल की बीमा डेस्क यह फॉर्म भरकर TPA/बीमाकर्ता को भेजती है। IRDAI का नियम है — 1 घंटे में अनुमोदन आना चाहिए।", hinglish: "Pre-auth form submit karein — Hospital ki insurance desk yeh form fill karke TPA/insurer ko bhejti hai. IRDAI ka rule hai — 1 ghante mein approval aana chahiye." },
      { en: "Approval lein — Insurer covered amount confirm karta hai. Aapko bas non-covered expenses dene hote hain.", hi: "अनुमोदन लें — बीमाकर्ता कवर की गई राशि की पुष्टि करता है। आपको केवल गैर-कवर खर्चे देने होते हैं।", hinglish: "Approval lein — Insurer covered amount confirm karta hai. Aapko bas non-covered expenses dene hote hain." },
      { en: "Treatment karein — Doctor ki advice ke hisaab se treatment lein.", hi: "उपचार करें — डॉक्टर की सलाह के अनुसार उपचार लें।", hinglish: "Treatment karein — Doctor ki advice ke hisaab se treatment lein." },
      { en: "Discharge lein — Hospital final bill insurer ko submit karta hai. 3 ghante mein discharge clearance milni chahiye.", hi: "डिस्चार्ज लें — अस्पताल अंतिम बिल बीमाकर्ता को जमा करता है। 3 घंटे में डिस्चार्ज क्लीयरेंस मिलनी चाहिए।", hinglish: "Discharge lein — Hospital final bill insurer ko submit karta hai. 3 ghante mein discharge clearance milni chahiye." },
    ],
    reimbTitle: { en: "Reimbursement Claim Process", hi: "प्रतिपूर्ति क्लेम प्रक्रिया", hinglish: "Reimbursement Claim Process" },
    reimbSteps: [
      { en: "Insurer ko batayein — Hospitalization ke 24-48 ghante ke andar insurer ko inform karein.", hi: "बीमाकर्ता को बताएं — अस्पताल में भर्ती के 24-48 घंटे के भीतर बीमाकर्ता को सूचित करें।", hinglish: "Insurer ko batayein — Hospitalization ke 24-48 ghante ke andar insurer ko inform karein." },
      { en: "Hospital ka bill pay karein — Discharge ke waqt saare bills clear karein aur original bills collect karein.", hi: "अस्पताल का बिल भुगतान करें — डिस्चार्ज के समय सभी बिल साफ़ करें और मूल बिल एकत्र करें।", hinglish: "Hospital ka bill pay karein — Discharge ke waqt saare bills clear karein aur original bills collect karein." },
      { en: "Saare documents collect karein — Discharge summary, original bills, prescriptions, diagnostic reports, pharmacy bills, FIR (agar accident se related hai).", hi: "सभी दस्तावेज़ एकत्र करें — डिस्चार्ज सारांश, मूल बिल, प्रिस्क्रिप्शन, डायग्नोस्टिक रिपोर्ट, फार्मेसी बिल, FIR (यदि दुर्घटना से संबंधित)।", hinglish: "Saare documents collect karein — Discharge summary, original bills, prescriptions, diagnostic reports, pharmacy bills, FIR (agar accident se related hai)." },
      { en: "Claim form submit karein — Claim form bharein, saare original documents attach karein, aur insurer ya TPA ko submit karein.", hi: "क्लेम फॉर्म जमा करें — क्लेम फॉर्म भरें, सभी मूल दस्तावेज़ संलग्न करें, और बीमाकर्ता या TPA को जमा करें।", hinglish: "Claim form submit karein — Claim form bharein, saare original documents attach karein, aur insurer ya TPA ko submit karein." },
      { en: "Reimbursement lein — Verification ke baad, insurer approved amount aapke bank account mein 30 din ke andar transfer kar deta hai.", hi: "प्रतिपूर्ति लें — सत्यापन के बाद, बीमाकर्ता अनुमोदित राशि आपके बैंक खाते में 30 दिन के भीतर ट्रांसफर कर देता है।", hinglish: "Reimbursement lein — Verification ke baad, insurer approved amount aapke bank account mein 30 din ke andar transfer kar deta hai." },
    ],
    docsTitle: { en: "📄 Health Insurance Claims Ke Liye Zaroori Documents", hi: "📄 हेल्थ इंश्योरेंस क्लेम के लिए ज़रूरी दस्तावेज़", hinglish: "📄 Health Insurance Claims Ke Liye Zaroori Documents" },
    cashlessDocsTitle: { en: "Cashless Claim Documents", hi: "कैशलेस क्लेम दस्तावेज़", hinglish: "Cashless Claim Documents" },
    cashlessDocs: [
      { en: "Health card / E-card", hi: "हेल्थ कार्ड / ई-कार्ड", hinglish: "Health card / E-card" },
      { en: "Valid ID proof (Aadhaar / PAN / DL)", hi: "वैध ID प्रमाण (आधार / PAN / DL)", hinglish: "Valid ID proof (Aadhaar / PAN / DL)" },
      { en: "Pre-auth form (hospital dwara bhara hua)", hi: "प्री-ऑथ फॉर्म (अस्पताल द्वारा भरा हुआ)", hinglish: "Pre-auth form (hospital dwara bhara hua)" },
      { en: "Doctor ki prescription / recommendation", hi: "डॉक्टर की प्रिस्क्रिप्शन / सिफारिश", hinglish: "Doctor ki prescription / recommendation" },
      { en: "Co-pay policy terms ke hisaab se", hi: "को-पे पॉलिसी शर्तों के अनुसार", hinglish: "Co-pay policy terms ke hisaab se" },
    ],
    reimbDocsTitle: { en: "Reimbursement Claim Documents", hi: "प्रतिपूर्ति क्लेम दस्तावेज़", hinglish: "Reimbursement Claim Documents" },
    reimbDocs: [
      { en: "Bhara hua claim form", hi: "भरा हुआ क्लेम फॉर्म", hinglish: "Bhara hua claim form" },
      { en: "Original hospital bills & payment receipts", hi: "मूल अस्पताल बिल और भुगतान रसीदें", hinglish: "Original hospital bills & payment receipts" },
      { en: "Hospital ki discharge summary", hi: "अस्पताल की डिस्चार्ज सारांश", hinglish: "Hospital ki discharge summary" },
      { en: "Doctor ki prescription & consultation notes", hi: "डॉक्टर की प्रिस्क्रिप्शन और परामर्श नोट्स", hinglish: "Doctor ki prescription & consultation notes" },
      { en: "Diagnostic reports (blood, X-ray, MRI, etc.)", hi: "डायग्नोस्टिक रिपोर्ट (ब्लड, एक्स-रे, MRI, आदि)", hinglish: "Diagnostic reports (blood, X-ray, MRI, etc.)" },
      { en: "Pharmacy bills with prescriptions", hi: "फार्मेसी बिल प्रिस्क्रिप्शन के साथ", hinglish: "Pharmacy bills with prescriptions" },
      { en: "FIR copy (agar accident se related treatment hai)", hi: "FIR कॉपी (यदि दुर्घटना से संबंधित उपचार है)", hinglish: "FIR copy (agar accident se related treatment hai)" },
      { en: "Cancelled cheque / bank details NEFT ke liye", hi: "रद्द चेक / NEFT के लिए बैंक विवरण", hinglish: "Cancelled cheque / bank details NEFT ke liye" },
      { en: "ID proof & health card copy", hi: "ID प्रमाण और हेल्थ कार्ड कॉपी", hinglish: "ID proof & health card copy" },
    ],
    readCashlessGuide: { en: "Detail mein jaanne ke liye humara Cashless Claim Guide padhein.", hi: "विस्तार में जानने के लिए हमारा कैशलेस क्लेम गाइड पढ़ें।", hinglish: "Detail mein jaanne ke liye hamaara Cashless Claim Guide padhein." },
  },
  carClaims: {
    heading: { en: "Car Insurance Claims", hi: "कार इंश्योरेंस क्लेम", hinglish: "Car Insurance Claims" },
    accidentTitle: { en: "🚗 Accident Claim Process", hi: "🚗 दुर्घटना क्लेम प्रक्रिया", hinglish: "🚗 Accident Claim Process" },
    accidentSteps: [
      { en: "Pehle safety ensure karein — Safe location pe jaayein, chot ka check karein.", hi: "पहले सुरक्षा सुनिश्चित करें — सुरक्षित स्थान पर जाएँ, चोट की जाँच करें।", hinglish: "Pehle safety ensure karein — Safe location pe jaayein, chot ka check karein." },
      { en: "FIR file karein — Third Party claims aur theft ke liye zaroori hai.", hi: "FIR दर्ज करें — थर्ड पार्टी क्लेम और चोरी के लिए ज़रूरी है।", hinglish: "FIR file karein — Third Party claims aur theft ke liye zaroori hai." },
      { en: "Insurer ko batayein — 48 ghante ke andar insurer ki helpline call karein.", hi: "बीमाकर्ता को बताएं — 48 घंटे के भीतर बीमाकर्ता की हेल्पलाइन कॉल करें।", hinglish: "Insurer ko batayein — 48 ghante ke andar insurer ki helpline call karein." },
      { en: "Surveyor inspection — Insurer ek surveyor appoint karta hai jo gaadi ka nuksan check karta hai.", hi: "सर्वेयर निरीक्षण — बीमाकर्ता एक सर्वेयर नियुक्त करता है जो गाड़ी का नुकसान जाँचता है।", hinglish: "Surveyor inspection — Insurer ek surveyor appoint karta hai jo gaadi ka nuksan check karta hai." },
      { en: "Gaadi repair karayein — Network garage pe cashless ya apni marzi ki garage pe reimbursement ke liye.", hi: "गाड़ी मरम्मत कराएँ — नेटवर्क गैराज पर कैशलेस या अपनी मर्ज़ी की गैराज पर प्रतिपूर्ति के लिए।", hinglish: "Gaadi repair karayein — Network garage pe cashless ya apni marzi ki garage pe reimbursement ke liye." },
      { en: "Claim settlement — Repair complete hone aur surveyor verification ke baad, insurer bill settle karta hai.", hi: "क्लेम निपटान — मरम्मत पूरी होने और सर्वेयर सत्यापन के बाद, बीमाकर्ता बिल निपटान करता है।", hinglish: "Claim settlement — Repair complete hone aur surveyor verification ke baad, insurer bill settle karta hai." },
    ],
    theftTitle: { en: "🔓 Theft Claim Process", hi: "🔓 चोरी क्लेम प्रक्रिया", hinglish: "🔓 Theft Claim Process" },
    theftSteps: [
      { en: "Turant FIR file karein — Sabse nazdeeki police station mein theft ki report karein.", hi: "तुरंत FIR दर्ज करें — सबसे नज़दीकी पुलिस स्टेशन में चोरी की रिपोर्ट करें।", hinglish: "Turant FIR file karein — Sabse nazdeeki police station mein theft ki report karein." },
      { en: "Insurer ko batayein — 24-48 ghante ke andar theft claim file karein.", hi: "बीमाकर्ता को बताएं — 24-48 घंटे के भीतर चोरी क्लेम दर्ज करें।", hinglish: "Insurer ko batayein — 24-48 ghante ke andar theft claim file karein." },
      { en: "Zaroori documents submit karein — Original RC, car keys, insurance policy, FIR copy, indemnity bond.", hi: "आवश्यक दस्तावेज़ जमा करें — मूल RC, कार चाबी, बीमा पॉलिसी, FIR कॉपी, इंडेम्निटी बॉण्ड।", hinglish: "Zaroori documents submit karein — Original RC, car keys, insurance policy, FIR copy, indemnity bond." },
      { en: "Untraced report ka wait karein — Police final untraced report issue karti hai (30-60 din).", hi: "अनट्रेस्ड रिपोर्ट का इंतज़ार करें — पुलिस अंतिम अनट्रेस्ड रिपोर्ट जारी करती है (30-60 दिन)।", hinglish: "Untraced report ka wait karein — Police final untraced report issue karti hai (30-60 din)." },
      { en: "IDV payout lein — Untraced report milte hi, insurer IDV pay karta hai.", hi: "IDV भुगतान लें — अनट्रेस्ड रिपोर्ट मिलते ही, बीमाकर्ता IDV का भुगतान करता है।", hinglish: "IDV payout lein — Untraced report milte hi, insurer IDV pay karta hai." },
    ],
  },
  rejections: {
    heading: { en: "Top 10 Common Claim Rejection Reasons", hi: "शीर्ष 10 सामान्य क्लेम अस्वीकृति कारण", hinglish: "Top 10 Common Claim Rejection Reasons" },
    desc: { en: "India mein insurance claims aise reasons se reject hoti hain jo avoid kiye ja sakte hain. In common galtiyon ko jaanne se aap strong claim file kar sakte hain.", hi: "भारत में इंश्योरेंस क्लेम ऐसे कारणों से अस्वीकृत होती हैं जिनसे बचा जा सकता है। इन सामान्य गलतियों को जानने से आप मजबूत क्लेम दर्ज कर सकते हैं।", hinglish: "India mein insurance claims aise reasons se reject hoti hain jo avoid kiye ja sakte hain. In common galtiyon ko jaanne se aap strong claim file kar sakte hain." },
    items: [
      { en: "PED chhupana — Non-disclosure of pre-existing diseases", hi: "PED छुपाना — पूर्व-मौजूदा बीमारियों का गैर-प्रकटीकरण", hinglish: "PED chhupana — Non-disclosure of pre-existing diseases" },
      { en: "Waiting period poora nahi hui", hi: "प्रतीक्षा अवधि पूरी नहीं हुई", hinglish: "Waiting period poora nahi hui" },
      { en: "Policy lapse ya renew nahi ki", hi: "पॉलिसी लैप्स या नवीनीकरण नहीं किया", hinglish: "Policy lapse ya renew nahi ki" },
      { en: "Excluded treatments — jo cover nahi hote", hi: "अपवर्जित उपचार — जो कवर नहीं होते", hinglish: "Excluded treatments — jo cover nahi hote" },
      { en: "Documents galat ya adhoore", hi: "दस्तावेज़ गलत या अधूरे", hinglish: "Documents galat ya adhoore" },
      { en: "Insurer ko late bataya", hi: "बीमाकर्ता को देर से बताया", hinglish: "Insurer ko late bataya" },
      { en: "Treatment medically zaroori nahi thi", hi: "उपचार चिकित्सा रूप से आवश्यक नहीं था", hinglish: "Treatment medically zaroori nahi thi" },
      { en: "Room rent sub-limit se zyada hai", hi: "कमरा किराया उप-सीमा से अधिक है", hinglish: "Room rent sub-limit se zyada hai" },
      { en: "Drunk driving ya nasha", hi: "नशे में गाड़ी चलाना", hinglish: "Drunk driving ya nasha" },
      { en: "Claim Sum Insured se zyada hai", hi: "क्लेम बीमित राशि से अधिक है", hinglish: "Claim Sum Insured se zyada hai" },
    ],
    details: [
      { en: "Policy kharidte waqt medical conditions chhupana claim rejection ka #1 reason hai. Apni poori medical history hamesha declare karein.", hi: "पॉलिसी खरीदते समय चिकित्सा स्थितियाँ छुपाना क्लेम अस्वीकृति का #1 कारण है। अपनी पूरी चिकित्सा इतिहास हमेशा घोषित करें।", hinglish: "Policy kharidte waqt medical conditions chhupana claim rejection ka #1 reason hai. Apni poori medical history hamesha declare karein." },
      { en: "Shuru ke 30 din ki waiting period mein ya PED ke liye 1-4 saal ki waiting period mein claim karne pe automatically reject.", hi: "शुरू के 30 दिन की प्रतीक्षा अवधि में या PED के लिए 1-4 वर्ष की प्रतीक्षा अवधि में क्लेम करने पर स्वचालित रूप से अस्वीकृत।", hinglish: "Shuru ke 30 din ki waiting period mein ya PED ke liye 1-4 saal ki waiting period mein claim karne pe automatically reject." },
      { en: "Agar premium time pe pay nahi ki aur policy lapse ho gayi, to lapse period mein koi bhi claim invalid hai.", hi: "यदि प्रीमियम समय पर भुगतान नहीं किया और पॉलिसी लैप्स हो गई, तो लैप्स अवधि में कोई भी क्लेम अमान्य है।", hinglish: "Agar premium time pe pay nahi ki aur policy lapse ho gayi, to lapse period mein koi bhi claim invalid hai." },
      { en: "Cosmetic surgery, dental treatment, khud ko nuksan, aur experimental treatments standard exclusions hain.", hi: "कॉस्मेटिक सर्जरी, डेंटल ट्रीटमेंट, खुद को नुकसान, और प्रायोगिक उपचार मानक अपवर्जन हैं।", hinglish: "Cosmetic surgery, dental treatment, khud ko nuksan, aur experimental treatments standard exclusions hain." },
      { en: "Discharge summary, original bills, ya doctor ki prescription missing hona rejection ka reason ban sakta hai.", hi: "डिस्चार्ज सारांश, मूल बिल, या डॉक्टर की प्रिस्क्रिप्शन का अभाव अस्वीकृति का कारण बन सकता है।", hinglish: "Discharge summary, original bills, ya doctor ki prescription missing hona rejection ka reason ban sakta hai." },
      { en: "Zyaadatar policies mein 24-48 ghante ke andar insurer ko inform karna zaroori hai. Late intimation rejection ka reason.", hi: "अधिकांश पॉलिसियों में 24-48 घंटे के भीतर बीमाकर्ता को सूचित करना ज़रूरी है। देर से सूचना अस्वीकृति का कारण।", hinglish: "Zyaadatar policies mein 24-48 ghante ke andar insurer ko inform karna zaroori hai. Late intimation rejection ka reason." },
      { en: "Agar insurer ki medical team ko lagta hai ki hospitalization ya procedure medically zaroori nahi tha, to claim reject ho sakta hai.", hi: "यदि बीमाकर्ता की चिकित्सा टीम को लगता है कि अस्पताल में भर्ती या प्रक्रिया चिकित्सा रूप से आवश्यक नहीं थी, तो क्लेम अस्वीकृत हो सकता है।", hinglish: "Agar insurer ki medical team ko lagta hai ki hospitalization ya procedure medically zaroori nahi tha, to claim reject ho sakta hai." },
      { en: "Agar aap apni policy ki room rent limit se upar ka room lete hain, to poora bill proportionally kam ho jaata hai.", hi: "यदि आप अपनी पॉलिसी की कमरा किराया सीमा से ऊपर का कमरा लेते हैं, तो पूरा बिल अनुपातिक रूप से कम हो जाता है।", hinglish: "Agar aap apni policy ki room rent limit se upar ka room lete hain, to poora bill proportionally kam ho jaata hai." },
      { en: "Sharab ya nashe mein huye accidents health aur motor insurance dono se exclude hain — claim nahi milega.", hi: "शराब या नशे में हुए दुर्घटना हेल्थ और मोटर बीमे दोनों से अपवर्जित हैं — क्लेम नहीं मिलेगा।", hinglish: "Sharab ya nashe mein huye accidents health aur motor insurance dono se exclude hain — claim nahi milega." },
      { en: "Agar treatment ka kharcha Sum Insured se zyada hai aur aapke paas super top-up nahi hai, to extra amount aapko khud deni padegi.", hi: "यदि उपचार का खर्च बीमित राशि से अधिक है और आपके पास सुपर टॉप-अप नहीं है, तो अतिरिक्त राशि आपको स्वयं देनी पड़ेगी।", hinglish: "Agar treatment ka kharcha Sum Insured se zyada hai aur aapke paas super top-up nahi hai, to extra amount aapko khud deni padegi." },
    ],
  },
  appeal: {
    heading: { en: "Rejected Insurance Claim Ko Kaise Appeal Karein", hi: "अस्वीकृत इंश्योरेंस क्लेम की अपील कैसे करें", hinglish: "Rejected Insurance Claim Ko Kaise Appeal Karein" },
    desc: { en: "Rejected claim ka matlab yeh nahi ki sab khatam. IRDAI ne policyholders ki protection ke liye ek structured grievance redressal system banaya hai.", hi: "अस्वीकृत क्लेम का मतलब यह नहीं कि सब ख़त्म। IRDAI ने पॉलिसीधारकों की सुरक्षा के लिए एक संरचित शिकायत निवारण प्रणाली बनाई है।", hinglish: "Rejected claim ka matlab yeh nahi ki sab khatam. IRDAI ne policyholders ki protection ke liye ek structured grievance redressal system banaya hai." },
    steps: [
      { title: { en: "Step 1: Grievance Redressal", hi: "चरण 1: शिकायत निवारण", hinglish: "Step 1: Grievance Redressal" }, desc: { en: "Apni insurance company ki grievance redressal cell mein complaint daalein. Insurer ko 30 din ke andar response dena zaroori hai.", hi: "अपनी बीमा कंपनी की शिकायत निवारण सेल में शिकायत दर्ज करें। बीमाकर्ता को 30 दिन के भीतर जवाब देना ज़रूरी है।", hinglish: "Apni insurance company ki grievance redressal cell mein complaint daalein. Insurer ko 30 din ke andar response dena zaroori hai." }, timeline: { en: "Timeline: 30 days", hi: "समयसीमा: 30 दिन", hinglish: "Timeline: 30 din" } },
      { title: { en: "Step 2: Bima Bharoso (IRDAI)", hi: "चरण 2: बीमा भरोसा (IRDAI)", hinglish: "Step 2: Bima Bharoso (IRDAI)" }, desc: { en: "Agar insurer 30 din mein complaint solve nahi karta, to Bima Bharoso portal pe complaint daalein — bimabharoso.irda.gov.in ya call 155255.", hi: "यदि बीमाकर्ता 30 दिन में शिकायत सुलझाता नहीं, तो बीमा भरोसा पोर्टल पर शिकायत दर्ज करें।", hinglish: "Agar insurer 30 din mein complaint solve nahi karta, to Bima Bharoso portal pe complaint daalein." }, timeline: { en: "Timeline: 15 days resolution", hi: "समयसीमा: 15 दिन समाधान", hinglish: "Timeline: 15 din resolution" } },
      { title: { en: "Step 3: Insurance Ombudsman", hi: "चरण 3: बीमा लोकपाल", hinglish: "Step 3: Insurance Ombudsman" }, desc: { en: "Agar issue fir bhi solve nahi hota, to Insurance Ombudsman ke paas jaayein. ₹50 lakh tak award de sakta hai. Yeh process free hai.", hi: "यदि मुद्दा अभी भी हल नहीं होता, तो बीमा लोकपाल के पास जाएँ। ₹50 लाख तक पुरस्कार दे सकता है। यह प्रक्रिया मुफ़्त है।", hinglish: "Agar issue fir bhi solve nahi hota, to Insurance Ombudsman ke paas jaayein. ₹50 lakh tak award de sakta hai. Yeh process free hai." }, timeline: { en: "Timeline: 1 year from final rejection", hi: "समयसीमा: अंतिम अस्वीकृति से 1 वर्ष", hinglish: "Timeline: 1 saal final rejection se" } },
    ],
    proTip: { en: "Pro Tip: Aap Consumer Court ja sakte hain agar ombudsman bhi fail ho jaaye. Document sab kuch rakhein — rejection letter, medical reports, correspondence.", hi: "प्रो टिप: यदि लोकपाल भी विफल हो जाए तो आप उपभोक्ता न्यायालय जा सकते हैं। सब कुछ दस्तावेज़ीकरण करें।", hinglish: "Pro Tip: Aap Consumer Court ja sakte hain agar ombudsman bhi fail ho jaaye. Document sab kuch rakhein." },
  },
  faq: {
    heading: { en: "Insurance Claim", hi: "इंश्योरेंस क्लेम", hinglish: "Insurance Claim" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
  },
  cta: {
    heading1: { en: "Need Help with", hi: "मदद चाहिए", hinglish: "Madad Chahiye" },
    headingHighlight: { en: "Your Claim?", hi: "क्लेम में?", hinglish: "Your Claim Mein?" },
    desc: { en: "Chat with Himanshu Paliwal on WhatsApp — IRDAI Certified Insurance Advisor. Free claim assistance and escalation support. No charge, no spam.", hi: "हिमांशु पालीवाल से WhatsApp पर चैट करें — IRDAI प्रमाणित बीमा सलाहकार। मुफ़्त क्लेम सहायता और एस्कलेशन समर्थन।", hinglish: "Himanshu Paliwal se WhatsApp pe chat karein — IRDAI Certified Insurance Advisor. Free claim assistance aur escalation support. No charge, no spam." },
    ctaWhatsApp: { en: "💬 Free Claim Help", hi: "💬 मुफ़्त क्लेम मदद", hinglish: "💬 Free Claim Help" },
    byline: { en: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834", hi: "हिमांशु पालीवाल द्वारा — IRDAI प्रमाणित बीमा सलाहकार · POSP कोड: IP429834", hinglish: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834" },
  },
};

// ── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  { q: { en: "Cashless aur Reimbursement mein kya farak hai?", hi: "कैशलेस और प्रतिपूर्ति में क्या फर्क है?", hinglish: "Cashless aur Reimbursement mein kya farak hai?" }, a: { en: "Cashless claim mein hospital bill directly insurance company pay karti hai — aapko bas non-covered expenses dene hote hain. Reimbursement mein aap pehle hospital ka bill khud pay karte hain, phir bills insurer ko submit karke paise wapas lete hain. Cashless fast aur tension-free hai; Reimbursement mein 15-30 din lagte hain.", hi: "कैशलेस क्लेम में अस्पताल बिल सीधे बीमा कंपनी भुगतान करती है — आपको केवल गैर-कवर खर्चे देने होते हैं। प्रतिपूर्ति में आप पहले अस्पताल का बिल स्वयं भुगतान करते हैं, फिर बिल बीमाकर्ता को जमा करके पैसे वापस लेते हैं।", hinglish: "Cashless claim mein hospital bill directly insurance company pay karti hai — aapko bas non-covered expenses dene hote hain. Reimbursement mein aap pehle hospital ka bill khud pay karte hain, phir bills insurer ko submit karke paise wapas lete hain." } },
  { q: { en: "Insurance company claim settle karne mein kitna time leti hai?", hi: "बीमा कंपनी क्लेम निपटान में कितना समय लेती है?", hinglish: "Insurance company claim settle karne mein kitna time leti hai?" }, a: { en: "IRDAI ke rules ke hisaab se, health insurance claims 30 din ke andar settle hone chahiye. Cashless mein pre-auth 1 ghante ke andar approve honi chahiye aur discharge clearance 3 ghante mein. Motor accident claims 30 din mein, theft claims 60 din mein.", hi: "IRDAI के नियमों के अनुसार, हेल्थ इंश्योरेंस क्लेम 30 दिन के भीतर निपटान होने चाहिए। कैशलेस में प्री-ऑथ 1 घंटे में और डिस्चार्ज क्लीयरेंस 3 घंटे में।", hinglish: "IRDAI ke rules ke hisaab se, health insurance claims 30 din ke andar settle hone chahiye. Cashless mein pre-auth 1 ghante ke andar aur discharge clearance 3 ghante mein." } },
  { q: { en: "Health insurance claim ke liye kaun kaun se documents chahiye?", hi: "हेल्थ इंश्योरेंस क्लेम के लिए कौन-कौन से दस्तावेज़ चाहिए?", hinglish: "Health insurance claim ke liye kaun kaun se documents chahiye?" }, a: { en: "Cashless ke liye: health card, valid ID proof, pre-auth form. Reimbursement ke liye: claim form, original hospital bills, discharge summary, doctor ki prescription, diagnostic reports, pharmacy bills, FIR (agar accident se related), aur bank details NEFT ke liye.", hi: "कैशलेस के लिए: हेल्थ कार्ड, वैध ID प्रमाण, प्री-ऑथ फॉर्म। प्रतिपूर्ति के लिए: क्लेम फॉर्म, मूल अस्पताल बिल, डिस्चार्ज सारांश, डॉक्टर की प्रिस्क्रिप्शन, डायग्नोस्टिक रिपोर्ट, फार्मेसी बिल, FIR, और NEFT के लिए बैंक विवरण।", hinglish: "Cashless ke liye: health card, valid ID proof, pre-auth form. Reimbursement ke liye: claim form, original hospital bills, discharge summary, doctor ki prescription, diagnostic reports, pharmacy bills, FIR, aur bank details NEFT ke liye." } },
  { q: { en: "Pre-auth approve hone ke baad bhi claim reject ho sakta hai?", hi: "प्री-ऑथ अनुमोदन के बाद भी क्लेम अस्वीकृत हो सकता है?", hinglish: "Pre-auth approve hone ke baad bhi claim reject ho sakta hai?" }, a: { en: "Haan, pre-auth approval ka matlab yeh nahi ki final claim zaroor settle hoga. Insurer final assessment mein claim reject kar sakta hai agar treatment medically zaroori nahi thi, bimari waiting period mein thi, ya PED disclose nahi ki gayi thi.", hi: "हाँ, प्री-ऑथ अनुमोदन का मतलब यह नहीं कि अंतिम क्लेम ज़रूर निपटान होगा। बीमाकर्ता अंतिम मूल्यांकन में क्लेम अस्वीकृत कर सकता है।", hinglish: "Haan, pre-auth approval ka matlab yeh nahi ki final claim zaroor settle hoga. Insurer final assessment mein claim reject kar sakta hai." } },
  { q: { en: "Agar meri insurance claim reject ho jaaye to kya karoon?", hi: "यदि मेरी इंश्योरेंस क्लेम अस्वीकृत हो जाए तो क्या करूँ?", hinglish: "Agar meri insurance claim reject ho jaaye to kya karoon?" }, a: { en: "Pehle rejection letter lein. Phir: (1) 30 din ke andar insurer ki grievance cell mein complaint daalein, (2) Agar solve nahi hua to Bima Bharoso pe complaint daalein, (3) 1 saal ke andar Insurance Ombudsman ke paas jaayein. Paliwal Secure se WhatsApp pe free claim assistance bhi le sakte hain.", hi: "पहले अस्वीकृति पत्र लें। फिर: (1) 30 दिन के भीतर बीमाकर्ता की शिकायत सेल में शिकायत दर्ज करें, (2) यदि हल नहीं होता तो बीमा भरोसा पर शिकायत करें, (3) 1 वर्ष के भीतर बीमा लोकपाल के पास जाएँ।", hinglish: "Pehle rejection letter lein. Phir: (1) 30 din ke andar insurer ki grievance cell mein complaint daalein, (2) Agar solve nahi hua to Bima Bharoso pe complaint daalein, (3) 1 saal ke andar Insurance Ombudsman ke paas jaayein." } },
  { q: { en: "Car insurance claim ke liye FIR zaroori hai kya?", hi: "कार इंश्योरेंस क्लेम के लिए FIR ज़रूरी है क्या?", hinglish: "Car insurance claim ke liye FIR zaroori hai kya?" }, a: { en: "FIR zaroori hai theft claims aur third-party injury/death claims ke liye. Own Damage ke liye, jab koi third party involved nahi hai, FIR usually zaroori nahi hoti lekin 48 ghante ke andar insurer ko inform karna padta hai.", hi: "FIR ज़रूरी है चोरी क्लेम और थर्ड-पार्टी चोट/मृत्यु क्लेम के लिए। ओन डैमेज के लिए, जब कोई थर्ड पार्टी शामिल नहीं है, FIR आमतौर पर ज़रूरी नहीं लेकिन 48 घंटे में बीमाकर्ता को सूचित करना पड़ता है।", hinglish: "FIR zaroori hai theft claims aur third-party injury/death claims ke liye. Own Damage ke liye, jab koi third party involved nahi hai, FIR usually zaroori nahi hoti lekin 48 ghante ke andar insurer ko inform karna padta hai." } },
  { q: { en: "Kya main non-network hospital pe claim kar sakti/sakta hoon?", hi: "क्या मैं नॉन-नेटवर्क अस्पताल पर क्लेम कर सकता/सकती हूँ?", hinglish: "Kya main non-network hospital pe claim kar sakti/sakta hoon?" }, a: { en: "Haan, aap kisi bhi hospital mein treatment le sakte hain. Lekin cashless facility sirf network hospitals mein milti hai. Non-network hospital mein aapko pehle bill khud bharna padega aur baad mein reimbursement claim file karni padegi.", hi: "हाँ, आप किसी भी अस्पताल में उपचार ले सकते हैं। लेकिन कैशलेस सुविधा केवल नेटवर्क अस्पतालों में मिलती है। नॉन-नेटवर्क अस्पताल में आपको पहले बिल स्वयं भरना पड़ेगा।", hinglish: "Haan, aap kisi bhi hospital mein treatment le sakte hain. Lekin cashless facility sirf network hospitals mein milti hai. Non-network hospital mein aapko pehle bill khud bharna padega aur baad mein reimbursement claim file karni padegi." } },
];

// ── FAQ JSON-LD ───────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q.en,
    acceptedAnswer: { "@type": "Answer", text: faq.a.en },
  })),
};

// ── Client Component ────────────────────────────────────────────────────────
export default function ClientContent() {
  const { language } = useLanguage();

  return (
    <div>
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{pt(pageText.hero.badge, language)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-6">
            {pt(pageText.hero.title1, language)} <span className="gradient-text">{pt(pageText.hero.titleHighlight, language)}</span> {pt(pageText.hero.titleSuffix, language)}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8">{pt(pageText.hero.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/919257877312?text=Hi%2C%20I%20need%20help%20with%20my%20insurance%20claim" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue"><span>{pt(pageText.hero.ctaHelp, language)}</span></ShinyButton>
            </a>
            <Link href="/health-insurance">
              <ShinyButton variant="secondary"><span>{pt(pageText.hero.ctaHealth, language)}</span></ShinyButton>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Table of Contents */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">{pt(pageText.toc.heading, language)}</h2>
            <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pageText.toc.items.map((item, i) => (
                <a key={i} href={`#section-${i}`} className="text-primary hover:underline text-sm font-medium">→ {pt(item, language)}</a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* How Claims Work */}
      <section id="section-0" className="py-12 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 gradient-text">{pt(pageText.howClaimsWork.heading, language)}</h2>
          <div className="glass-card rounded-xl p-6 max-w-none">
            {pageText.howClaimsWork.paragraphs.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">{pt(p, language)}</p>
            ))}
          </div>

          {/* Car Insurance Claim Process Infographic */}
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center">Car Insurance Claim Process — Complete Guide</h3>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] max-w-2xl w-full">
              <picture>
                <source srcSet="/images/car-insurance-claim-process.webp" type="image/webp" />
                <img
                  src="/images/car-insurance-claim-process.jpg"
                  alt="Car Insurance Claim Process Infographic India — Step by step guide from accident to settlement. Cashless vs reimbursement claims, documents needed, IRDAI timelines."
                  className="w-full h-auto block"
                  loading="lazy"
                  width={1200}
                  height={2527}
                />
              </picture>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center max-w-lg">
              Car insurance claim process in India — from reporting accident to getting settlement. 
              Covers cashless claims, reimbursement claims, documents required, and IRDAI grievance escalation.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Health Claims */}
      <section id="section-1" className="py-12 bg-card/50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 gradient-text">{pt(pageText.healthClaims.heading, language)}</h2>

          {/* Cashless */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">1</span>
              {pt(pageText.healthClaims.cashlessTitle, language)}
            </h3>
            <ol className="space-y-3 text-muted-foreground">
              {pageText.healthClaims.cashlessSteps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span>{pt(s, language)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">{pt(pageText.healthClaims.readCashlessGuide, language)} <Link href="/cashless-claim-guide" className="text-primary hover:underline">Cashless Claim Guide</Link></p>
          </div>

          {/* Reimbursement */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">2</span>
              {pt(pageText.healthClaims.reimbTitle, language)}
            </h3>
            <ol className="space-y-3 text-muted-foreground">
              {pageText.healthClaims.reimbSteps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span>{pt(s, language)}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Documents */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">{pt(pageText.healthClaims.docsTitle, language)}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-primary">{pt(pageText.healthClaims.cashlessDocsTitle, language)}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {pageText.healthClaims.cashlessDocs.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>{pt(d, language)}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-primary">{pt(pageText.healthClaims.reimbDocsTitle, language)}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {pageText.healthClaims.reimbDocs.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>{pt(d, language)}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Car Claims */}
      <section id="section-2" className="py-12 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 gradient-text">{pt(pageText.carClaims.heading, language)}</h2>
          <div className="glass-card rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">{pt(pageText.carClaims.accidentTitle, language)}</h3>
            <ol className="space-y-3 text-muted-foreground">
              {pageText.carClaims.accidentSteps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span>{pt(s, language)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">{pt(pageText.carClaims.theftTitle, language)}</h3>
            <ol className="space-y-3 text-muted-foreground">
              {pageText.carClaims.theftSteps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span>{pt(s, language)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Rejection Reasons */}
      <section id="section-3" className="py-12 bg-card/50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 gradient-text">{pt(pageText.rejections.heading, language)}</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">{pt(pageText.rejections.desc, language)}</p>
          <div className="space-y-4">
            {pageText.rejections.items.map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 flex gap-4 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{pt(item, language)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pt(pageText.rejections.details[idx], language)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Appeal Process */}
      <section id="section-4" className="py-12 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 gradient-text">{pt(pageText.appeal.heading, language)}</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">{pt(pageText.appeal.desc, language)}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {pageText.appeal.steps.map((step, idx) => {
              const borderColors = ['border-cyan-500', 'border-teal-400', 'border-emerald-400'];
              return (
                <div key={idx} className={`glass-card rounded-xl p-6 border-t-4 ${borderColors[idx]} hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300`}>
                  <h3 className="text-xl font-semibold mb-3">{pt(step.title, language)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{pt(step.desc, language)}</p>
                  <p className="text-sm text-muted-foreground"><strong>Timeline:</strong> {pt(step.timeline, language)}</p>
                </div>
              );
            })}
          </div>
          <div className="glass-card rounded-xl p-6">
            <p className="text-muted-foreground leading-relaxed"><strong className="text-primary">{pt(pageText.appeal.proTip, language)}</strong></p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* FAQ */}
      <section id="section-5" className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            {pt(pageText.faq.heading, language)} <span className="gradient-text">{pt(pageText.faq.headingHighlight, language)}</span>
          </h2>
          <div className="space-y-4 mt-8">
            {faqs.map((faq, idx) => (
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

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* CTA */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {pt(pageText.cta.heading1, language)} <span className="gradient-text">{pt(pageText.cta.headingHighlight, language)}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(pageText.cta.desc, language)}</p>
            <a href="https://wa.me/919257877312?text=Hi%2C%20I%20need%20help%20with%20my%20insurance%20claim" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="blue"><span>{pt(pageText.cta.ctaWhatsApp, language)}</span></ShinyButton>
            </a>
            <p className="mt-6 text-xs text-muted-foreground">{pt(pageText.cta.byline, language)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
