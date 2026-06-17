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
    title1: { en: "Home Insurance", hi: "होम इंश्योरेंस", hinglish: "Home Insurance" },
    title2: { en: "India", hi: "भारत", hinglish: "India" },
    titleSuffix: { en: "— Protect Your Biggest Asset", hi: "— अपने सबसे बड़ी संपत्ति की सुरक्षा करें", hinglish: "— Apne Sabse Badi Asset ki Security Karein" },
    desc: { en: "Compare home insurance plans from India's top insurers. Coverage from ₹5 lakh to ₹1 Crore. Premiums starting at just ₹100/month. Get AI-powered recommendations from PaliwalSecure.in for your home and belongings.", hi: "भारत के शीर्ष बीमाकर्ताओं से होम इंश्योरेंस योजनाओं की तुलना करें। ₹5 लाख से ₹1 करोड़ तक कवरेज। केवल ₹100/माह से प्रीमियम। PaliwalSecure.in से अपने घर और सामान के लिए AI-संचालित सिफारिशें।", hinglish: "India ke top insurers se home insurance plans compare karein. ₹5 lakh se ₹1 Crore tak coverage. Premiums starting at ₹100/month. PaliwalSecure.in se apne ghar aur samaan ke liye AI-powered recommendations lo." },
    ctaCompare: { en: "Compare & Buy Now", hi: "तुलना करें और अभी खरीदें", hinglish: "Compare & Buy Now" },
    ctaWhatsApp: { en: "💬 Chat on WhatsApp", hi: "💬 WhatsApp पर चैट करें", hinglish: "💬 WhatsApp pe Chat Karein" },
    stat1Val: { en: "₹100", hi: "₹100", hinglish: "₹100" },
    stat1Label: { en: "Premium Starts At/Mo", hi: "प्रीमियम शुरू/माह", hinglish: "Premium Starts At/Mo" },
    stat2Val: { en: "₹1Cr", hi: "₹1Cr", hinglish: "₹1Cr" },
    stat2Label: { en: "Max Coverage", hi: "अधिकतम कवरेज", hinglish: "Max Coverage" },
    stat3Val: { en: "5+", hi: "5+", hinglish: "5+" },
    stat3Label: { en: "Insurers Compared", hi: "बीमाकर्ताओं की तुलना", hinglish: "Insurers Compared" },
    stat4Val: { en: "59%", hi: "59%", hinglish: "59%" },
    stat4Label: { en: "India Earthquake-Prone", hi: "भारत भूकंप-प्रवण", hinglish: "India Earthquake-Prone" },
  },
  breadcrumb: {
    home: { en: "Home", hi: "होम", hinglish: "Home" },
    current: { en: "Home Insurance", hi: "होम इंश्योरेंस", hinglish: "Home Insurance" },
  },
  whatIs: {
    heading: { en: "What is", hi: "क्या है", hinglish: "Kya Hai" },
    headingHighlight: { en: "Home Insurance", hi: "होम इंश्योरेंस", hinglish: "Home Insurance" },
    para1: { en: "Home insurance (also called homeowners insurance or property insurance) is a policy that protects your home — both the physical structure and the contents inside — against damage from fire, natural disasters, theft, and other risks. In India, your home is likely your single largest investment, yet only 1% of Indian homeowners have home insurance. This is alarming considering that fire alone causes property damage worth over ₹1,000 crore annually in India, and floods affect millions of homes every monsoon season.", hi: "होम इंश्योरेंस (होमओनर्स इंश्योरेंस या प्रॉपर्टी इंश्योरेंस भी कहा जाता है) एक पॉलिसी है जो आपके घर — भौतिक संरचना और अंदर की सामग्री दोनों — को आग, प्राकृतिक आपदा, चोरी और अन्य जोखिमों से होने वाली क्षति से सुरक्षित करती है। भारत में, आपका घर संभवतः आपका सबसे बड़ा निवेश है, फिर भी केवल 1% भारतीय होमओनर्स के पास होम इंश्योरेंस है।", hinglish: "Home insurance (homeowners insurance ya property insurance bhi kehte hain) ek policy hai jo aapke ghar — physical structure aur andar ke contents dono — ko fire, natural disasters, theft aur other risks se damage se protect karti hai. India mein, aapka ghar shayad aapka sabse bada investment hai, phir bhi sirf 1% Indian homeowners ke paas home insurance hai." },
    para2: { en: "A comprehensive home insurance policy costs just ₹100-500 per month — less than what most people spend on a single dinner outing. In return, you get protection worth lakhs or crores against events that could otherwise devastate your finances. Whether you own a flat in Mumbai, an independent house in Delhi, or rent an apartment in Bengaluru — PaliwalSecure.in helps you find the right home insurance plan.", hi: "एक व्यापक होम इंश्योरेंस पॉलिसी केवल ₹100-500 प्रति माह की लागत है — ज़्यादातर लोग एक डिनर पर जो खर्च करते हैं उससे भी कम। बदले में, आपको लाखों या करोड़ों की सुरक्षा मिलती है। चाहे आप मुंबई में फ्लैट, दिल्ली में स्वतंत्र घर, या बेंगलुरु में किराए का अपार्टमेंट रखते हों — PaliwalSecure.in आपको सही होम इंश्योरेंस योजना ढूंढने में मदद करता है।", hinglish: "Comprehensive home insurance policy sirf ₹100-500 per month ki lagat hai — jo zyadatar log ek dinner pe kharch karte hain usse bhi kam. Badle mein, aapko lakhs ya crores ki protection milti hai. Chaahe aap Mumbai mein flat, Delhi mein independent house, ya Bengaluru mein rented apartment rakhte hoon — PaliwalSecure.in aapko sahi home insurance plan dhoondhne mein madad karta hai." },
    buildingTitle: { en: "Building / Structure Cover", hi: "बिल्डिंग / संरचना कवर", hinglish: "Building / Structure Cover" },
    building1: { en: "Insures the physical structure — walls, roof, floors, doors, windows", hi: "भौतिक संरचना का बीमा — दीवारें, छत, फ़र्श, दरवाज़े, खिड़कियाँ", hinglish: "Physical structure ka insurance — walls, roof, floors, doors, windows" },
    building2: { en: "Covers fire, flood, storm, earthquake (add-on), landslide", hi: "आग, बाढ़, तूफ़ान, भूकंप (ऐड-ऑन), भूस्खलन कवर करता है", hinglish: "Fire, flood, storm, earthquake (add-on), landslide cover karta hai" },
    building3: { en: "Sum insured = reconstruction cost (not market value)", hi: "बीमित राशि = पुनर्निर्माण लागत (बाज़ार मूल्य नहीं)", hinglish: "Sum insured = reconstruction cost (market value nahi)" },
    building4: { en: "Essential for homeowners and property investors", hi: "होमओनर्स और प्रॉपर्टी निवेशकों के लिए आवश्यक", hinglish: "Homeowners aur property investors ke liye zaroori" },
    building5: { en: "Also covers permanent fixtures like built-in wardrobes, kitchen cabinets", hi: "बिल्ट-इन वार्डरोब, किचन कैबिनेट जैसे स्थायी फ़िक्सचर भी कवर", hinglish: "Built-in wardrobes, kitchen cabinets jaise permanent fixtures bhi cover" },
    contentsTitle: { en: "Contents Cover", hi: "कंटेंट्स कवर", hinglish: "Contents Cover" },
    contents1: { en: "Insures belongings — furniture, appliances, jewellery, electronics", hi: "सामान का बीमा — फ़र्नीचर, उपकरण, आभूषण, इलेक्ट्रॉनिक्स", hinglish: "Belongings ka insurance — furniture, appliances, jewellery, electronics" },
    contents2: { en: "Covers theft, burglary, fire, and accidental damage", hi: "चोरी, सेंधमारी, आग और आकस्मिक क्षति कवर", hinglish: "Theft, burglary, fire aur accidental damage cover" },
    contents3: { en: "Ideal for both homeowners and renters", hi: "होमओनर्स और किराएदार दोनों के लिए आदर्श", hinglish: "Homeowners aur renters dono ke liye ideal" },
    contents4: { en: "High-value items (jewellery, art) must be declared separately", hi: "उच्च मूल्य वाली वस्तुएँ (आभूषण, कला) अलग से घोषित करनी होंगी", hinglish: "High-value items (jewellery, art) alag se declare karne honge" },
    contents5: { en: "Renters only need contents cover — not building insurance", hi: "किराएदारों को केवल कंटेंट्स कवर चाहिए — बिल्डिंग इंश्योरेंस नहीं", hinglish: "Renters ko sirf contents cover chahiye — building insurance nahi" },
  },
  features: {
    heading: { en: "Key", hi: "मुख्य", hinglish: "Key" },
    headingHighlight: { en: "Features & Benefits", hi: "विशेषताएँ और लाभ", hinglish: "Features & Benefits" },
    headingSuffix: { en: "of Home Insurance", hi: "होम इंश्योरेंस की", hinglish: "of Home Insurance" },
    desc: { en: "Home insurance provides comprehensive protection for your most valuable asset. Here are the key benefits you get with a standard home insurance policy in India.", hi: "होम इंश्योरेंस आपकी सबसे मूल्यवान संपत्ति की व्यापक सुरक्षा प्रदान करता है। भारत में एक मानक होम इंश्योरेंस पॉलिसी के साथ आपको मिलने वाले प्रमुख लाभ यहाँ हैं।", hinglish: "Home insurance aapki sabse valuable asset ki comprehensive protection deta hai. India mein standard home insurance policy ke saath aapko milne wale key benefits yahan hain." },
    f1Title: { en: "Fire & Allied Perils", hi: "आग और संबंधित जोखिम", hinglish: "Fire & Allied Perils" },
    f1Desc: { en: "Covers damage from fire, lightning, explosion, implosion, and aircraft damage. Fire is the most common cause of property damage in India — from electrical short-circuits to kitchen accidents. This is the core benefit of every home insurance policy.", hi: "आग, बिजली, विस्फोट, आगे बढ़ने वाले विस्फोट और विमान क्षति से होने वाली क्षति कवर करता है। आग भारत में संपत्ति क्षति का सबसे आम कारण है।", hinglish: "Fire, lightning, explosion, implosion aur aircraft damage se damage cover karta hai. Fire India mein property damage ka sabse common cause hai." },
    f2Title: { en: "Natural Disaster Cover", hi: "प्राकृतिक आपदा कवर", hinglish: "Natural Disaster Cover" },
    f2Desc: { en: "Protection against flood, storm, cyclone, landslide, and earthquake (add-on). India experiences severe monsoon flooding in Mumbai, Chennai, and Assam annually. Earthquakes affect 59% of India's landmass. Don't leave your biggest asset unprotected.", hi: "बाढ़, तूफ़ान, चक्रवात, भूस्खलन और भूकंप (ऐड-ऑन) से सुरक्षा। भारत में मुंबई, चेन्नई और असम में हर साल भारी मानसून बाढ़ आती है। भूकंप भारत के 59% भूभाग को प्रभावित करते हैं।", hinglish: "Flood, storm, cyclone, landslide aur earthquake (add-on) se protection. India mein Mumbai, Chennai aur Assam mein har saal severe monsoon flooding aati hai. Earthquakes 59% India ke landmass ko affect karte hain." },
    f3Title: { en: "Burglary & Theft Protection", hi: "सेंधमारी और चोरी सुरक्षा", hinglish: "Burglary & Theft Protection" },
    f3Desc: { en: "Covers loss of valuables and household items due to break-in and theft. Urban India reports 30,000+ burglary cases annually. Your gold, electronics, and furniture are protected for just ₹50-200/month extra.", hi: "सेंधमारी और चोरी से कीमती सामान और घरेलू वस्तुओं के नुकसान को कवर करता है। शहरी भारत में हर साल 30,000+ सेंधमारी के मामले दर्ज होते हैं।", hinglish: "Break-in aur theft se valuables aur household items ke loss ko cover karta hai. Urban India mein har saal 30,000+ burglary cases report hote hain." },
    f4Title: { en: "Man-Made Disasters", hi: "मानवीय आपदाएँ", hinglish: "Man-Made Disasters" },
    f4Desc: { en: "Covers damage from riots, strikes, terrorist activities, and malicious acts. While rare, these events cause catastrophic property damage. Standard policies include this cover without extra premium.", hi: "दंगे, हड़ताल, आतंकवादी गतिविधियों और दुर्भावनापूर्ण कृत्यों से क्षति कवर करता है। हालांकि ये दुर्लभ हैं, लेकिन ये घटनाएँ विनाशकारी संपत्ति क्षति का कारण बनती हैं।", hinglish: "Riots, strikes, terrorist activities aur malicious acts se damage cover karta hai. Yeh rare hain, lekin catastrophic property damage karte hain." },
    f5Title: { en: "Alternative Accommodation", hi: "वैकल्पिक आवास", hinglish: "Alternative Accommodation" },
    f5Desc: { en: "If your home becomes uninhabitable due to an insured event, the insurer pays for temporary rental accommodation during the repair period. In metro cities where rent can be ₹25,000-75,000/month, this benefit saves you lakhs.", hi: "यदि बीमित घटना के कारण आपका घर रहने लायक नहीं रहता, तो मरम्मत अवधि के दौरान बीमाकर्ता अस्थायी किराए के आवास का भुगतान करता है।", hinglish: "Agar insured event ki wajah se aapka ghar rehne layak nahi rehta, toh repair period ke dauraan insurer temporary rental accommodation pay karta hai." },
    f6Title: { en: "Personal Liability Cover", hi: "व्यक्तिगत देयता कवर", hinglish: "Personal Liability Cover" },
    f6Desc: { en: "Protects against legal claims if someone is injured on your property or your property causes damage to neighbours. Legal costs alone can exceed ₹5 lakh.", hi: "यदि कोई आपकी संपत्ति पर घायल होता है या आपकी संपत्ति पड़ोसियों को नुकसान पहुँचाती है तो कानूनी दावों से सुरक्षा। केवल कानूनी लागत ₹5 लाख से अधिक हो सकती है।", hinglish: "Legal claims se protection agar koi aapki property pe injured hota hai ya aapki property neighbours ko damage karti hai. Legal costs akele ₹5 lakh se zyada ho sakti hain." },
  },
  comparison: {
    heading: { en: "Compare", hi: "तुलना करें", hinglish: "Compare" },
    headingHighlight: { en: "Top Home Insurance", hi: "शीर्ष होम इंश्योरेंस", hinglish: "Top Home Insurance" },
    headingSuffix: { en: "Plans in India", hi: "भारत में योजनाएँ", hinglish: "Plans in India" },
    desc: { en: "Premiums, coverage limits, and claim processes vary across insurers. Our AI-powered comparison engine helps you find the best plan for your home type, location, and budget.", hi: "प्रीमियम, कवरेज सीमा और क्लेम प्रक्रिया बीमाकर्ताओं में भिन्न होती है। हमारा AI-संचालित तुलना इंजन आपके घर के प्रकार, स्थान और बजट के लिए सर्वोत्तम योजना ढूंढने में मदद करता है।", hinglish: "Premiums, coverage limits aur claim processes insurers mein different hoti hain. Hamaara AI-powered comparison engine aapke home type, location aur budget ke liye best plan dhoondhne mein madad karta hai." },
    thInsurer: { en: "Insurer", hi: "बीमाकर्ता", hinglish: "Insurer" },
    thPlan: { en: "Plan Name", hi: "योजना नाम", hinglish: "Plan Name" },
    thPremium: { en: "Premium (Monthly)", hi: "प्रीमियम (मासिक)", hinglish: "Premium (Monthly)" },
    thCoverage: { en: "Coverage", hi: "कवरेज", hinglish: "Coverage" },
    thClaim: { en: "Claim Settlement", hi: "क्लेम सेटलमेंट", hinglish: "Claim Settlement" },
    thHighlight: { en: "Key Highlight", hi: "मुख्य विशेषता", hinglish: "Key Highlight" },
    aiPick: { en: "🤖 AI Pick", hi: "🤖 AI चयन", hinglish: "🤖 AI Pick" },
    footnote: { en: "Premiums are indicative for a 2 BHK flat in a metro city. Actual premiums vary based on location, building age, construction type, and sum insured.", hi: "प्रीमियम मेट्रो शहर में 2 BHK फ्लैट के लिए सांकेतिक हैं। वास्तविक प्रीमियम स्थान, बिल्डिंग आयु, निर्माण प्रकार और बीमित राशि के आधार पर भिन्न होते हैं।", hinglish: "Premiums metro city mein 2 BHK flat ke liye indicative hain. Actual premiums location, building age, construction type aur sum insured ke basis pe different hote hain." },
  },
  premiumEst: {
    heading: { en: "Home Insurance", hi: "होम इंश्योरेंस", hinglish: "Home Insurance" },
    headingHighlight: { en: "Premium Estimates", hi: "प्रीमियम अनुमान", hinglish: "Premium Estimates" },
    desc: { en: "Home insurance is one of the most affordable insurance types in India. Here are indicative monthly premiums based on home type and coverage. Use our AI comparison tool for exact quotes.", hi: "होम इंश्योरेंस भारत में सबसे किफ़ायती बीमा प्रकारों में से एक है। यहाँ घर के प्रकार और कवरेज के आधार पर सांकेतिक मासिक प्रीमियम हैं।", hinglish: "Home insurance India mein sabse affordable insurance types mein se ek hai. Yahan home type aur coverage ke basis pe indicative monthly premiums hain." },
    thHomeType: { en: "Home Type", hi: "घर प्रकार", hinglish: "Home Type" },
    thBuilding: { en: "Building Only", hi: "केवल बिल्डिंग", hinglish: "Building Only" },
    thContents: { en: "Contents Only", hi: "केवल कंटेंट्स", hinglish: "Contents Only" },
    thComprehensive: { en: "Comprehensive", hi: "कॉम्प्रिहेंसिव", hinglish: "Comprehensive" },
    tipTitle: { en: "💡 Expert Tip: Insure for reconstruction cost, not market value!", hi: "💡 विशेषज्ञ सुझाव: पुनर्निर्माण लागत का बीमा करें, बाज़ार मूल्य नहीं!", hinglish: "💡 Expert Tip: Reconstruction cost ka insurance karein, market value nahi!" },
    tipDesc: { en: "Your home's market value includes land cost, which doesn't need insurance. Only insure for the reconstruction cost — what it would take to rebuild the structure. This keeps your premium low while ensuring adequate coverage.", hi: "आपके घर का बाज़ार मूल्य भूमि लागत शामिल है, जिसे बीमा की आवश्यकता नहीं है। केवल पुनर्निर्माण लागत का बीमा करें — संरचना को फिर से बनाने में क्या लगेगा।", hinglish: "Aapke ghar ka market value mein land cost shamil hai, jise insurance ki zaroorat nahi. Sirf reconstruction cost ka insurance karein — structure ko dobara banane mein kya lagega." },
  },
  addOns: {
    heading: { en: "Home Insurance", hi: "होम इंश्योरेंस", hinglish: "Home Insurance" },
    headingHighlight: { en: "Add-on Riders", hi: "ऐड-ऑन राइडर", hinglish: "Add-on Riders" },
    desc: { en: "Base home insurance covers fire and standard perils. Add-on riders extend coverage for specific risks that matter most to you. Choose add-ons based on your location, home type, and the value of your belongings.", hi: "बेस होम इंश्योरेंस आग और मानक जोखिम कवर करता है। ऐड-ऑन राइडर विशिष्ट जोखिमों के लिए कवरेज बढ़ाते हैं। अपने स्थान, घर के प्रकार और सामान के मूल्य के आधार पर ऐड-ऑन चुनें।", hinglish: "Base home insurance fire aur standard perils cover karta hai. Add-on riders specific risks ke liye coverage extend karte hain. Location, home type aur belongings ki value ke basis pe add-ons choose karein." },
    approxCost: { en: "Approx. Cost:", hi: "अनुमानित लागत:", hinglish: "Approx. Cost:" },
  },
  faq: {
    heading: { en: "Home Insurance", hi: "होम इंश्योरेंस", hinglish: "Home Insurance" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
    desc: { en: "Frequently asked questions about home insurance in India. Still have questions? Chat with our AI advisor or talk to Himanshu on WhatsApp.", hi: "भारत में होम इंश्योरेंस के बारे में अक्सर पूछे जाने वाले सवाल। अभी भी सवाल हैं? हमारे AI सलाहकार से चैट करें या हिमांशु से WhatsApp पर बात करें।", hinglish: "India mein home insurance ke baare mein often pooche jaane wale sawaal. Abhi bhi sawaal hain? Hamaare AI advisor se chat karein ya Himanshu se WhatsApp pe baat karein." },
  },
  cta: {
    heading1: { en: "Protect Your Home from Just", hi: "अपने घर की सुरक्षा केवल", hinglish: "Apne Ghar ki Security Sirf" },
    headingHighlight: { en: "₹100/Month", hi: "₹100/माह", hinglish: "₹100/Month" },
    desc: { en: "Your home is your most valuable asset. Don't leave it unprotected. Compare home insurance from 5+ insurers, customize your coverage, and get covered in minutes.", hi: "आपका घर आपकी सबसे मूल्यवान संपत्ति है। इसे असुरक्षित मत छोड़ें। 5+ बीमाकर्ताओं से होम इंश्योरेंस की तुलना करें, कवरेज अनुकूलित करें, और मिनटों में कवर हों।", hinglish: "Aapka ghar aapki sabse valuable asset hai. Ise unprotected mat chhodein. 5+ insurers se home insurance compare karein, coverage customize karein, aur minutes mein cover ho jayein." },
    ctaCompare: { en: "Compare & Buy Now", hi: "तुलना करें और अभी खरीदें", hinglish: "Compare & Buy Now" },
    ctaWhatsApp: { en: "💬 Talk to Himanshu on WhatsApp", hi: "💬 हिमांशु से WhatsApp पर बात करें", hinglish: "💬 Himanshu se WhatsApp pe Baat Karein" },
    byline: { en: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834", hi: "हिमांशु पालीवाल द्वारा — IRDAI प्रमाणित बीमा सलाहकार · POSP कोड: IP429834", hinglish: "By Himanshu Paliwal — IRDAI Certified Insurance Advisor · POSP Code: IP429834" },
  },
};

// ── FAQ data ────────────────────────────────────────────────────────────────
const faqsEn = [
  { q: "Is home insurance mandatory in India?", a: "No, home insurance is not legally mandatory in India. However, if you have taken a home loan, your bank may require you to insure the property as part of the loan agreement. Even when not mandatory, home insurance is highly recommended — your home is likely your most valuable asset." },
  { q: "What does home insurance cover in India?", a: "A standard home insurance policy covers: (1) Fire and allied perils (2) Burglary and theft (3) Man-made disasters (4) Contents cover (5) Personal liability (6) Alternative accommodation (7) Renters can buy contents-only policies." },
  { q: "How much does home insurance cost in India?", a: "Home insurance premiums in India are surprisingly affordable. Building-only cover starts at ₹100-200/month. Contents cover adds ₹50-150/month. A comprehensive policy for a ₹50 lakh home typically costs ₹200-500/month." },
  { q: "What is the difference between building cover and contents cover?", a: "Building cover insures the physical structure of your home. Contents cover insures the items inside your home. Homeowners should buy both. Renters only need contents cover." },
  { q: "Does home insurance cover earthquake and flood damage?", a: "Earthquake cover is available as an add-on. Flood cover is generally included in the standard fire policy. Always check policy wordings for specifics." },
  { q: "How is the sum insured determined for home insurance?", a: "For building cover, the sum insured should equal the reconstruction cost. For contents, it should reflect the replacement value. Under-insuring leads to proportional claim settlement." },
  { q: "Can renters buy home insurance in India?", a: "Yes! Renters can buy contents-only home insurance. A contents-only policy costs just ₹100-300/month and covers theft, fire, flood, and accidental damage to your belongings." },
];

const faqsTranslated = [
  { q: { en: "Is home insurance mandatory in India?", hi: "क्या भारत में होम इंश्योरेंस अनिवार्य है?", hinglish: "Kya India mein home insurance mandatory hai?" }, a: { en: "No, home insurance is not legally mandatory in India. However, if you have taken a home loan, your bank may require you to insure the property as part of the loan agreement. Even when not mandatory, home insurance is highly recommended — your home is likely your most valuable asset. For a premium as low as ₹100-500/month, you get comprehensive protection.", hi: "नहीं, भारत में होम इंश्योरेंस कानूनी रूप से अनिवार्य नहीं है। हालांकि, यदि आपने होम लोन लिया है, तो आपका बैंक लोन समझौते के हिस्से के रूप में संपत्ति का बीमा करने की आवश्यकता कर सकता है। अनिवार्य न होने पर भी, होम इंश्योरेंस की अत्यधिक सिफारिश की जाती है।", hinglish: "Nahi, India mein home insurance legally mandatory nahi hai. Lekin, agar aapne home loan liya hai, toh aapka bank property insure karne ki requirement kar sakta hai. Mandatory na hone pe bhi, home insurance ki strongly recommendation ki jaati hai." } },
  { q: { en: "What does home insurance cover in India?", hi: "भारत में होम इंश्योरेंस क्या कवर करता है?", hinglish: "India mein home insurance kya cover karta hai?" }, a: { en: "A standard home insurance policy covers: Fire and allied perils, Burglary and theft, Man-made disasters, Contents cover, Personal liability, Alternative accommodation, and Renters can buy contents-only policies.", hi: "एक मानक होम इंश्योरेंस पॉलिसी कवर करती है: आग और संबंधित जोखिम, सेंधमारी और चोरी, मानवीय आपदाएँ, कंटेंट्स कवर, व्यक्तिगत देयता, वैकल्पिक आवास। किराएदार केवल कंटेंट्स पॉलिसी खरीद सकते हैं।", hinglish: "Standard home insurance policy cover karti hai: Fire aur allied perils, Burglary aur theft, Man-made disasters, Contents cover, Personal liability, Alternative accommodation. Renters sirf contents-only policy khareed sakte hain." } },
  { q: { en: "How much does home insurance cost in India?", hi: "भारत में होम इंश्योरेंस कितना खर्च होता है?", hinglish: "India mein home insurance kitna kharch hota hai?" }, a: { en: "Home insurance premiums in India are surprisingly affordable. Building-only cover starts at ₹100-200/month. Contents cover adds ₹50-150/month. A comprehensive policy for a ₹50 lakh home typically costs ₹200-500/month.", hi: "भारत में होम इंश्योरेंस प्रीमियम आश्चर्यजनक रूप से किफ़ायती हैं। केवल बिल्डिंग कवर ₹100-200/माह से शुरू होता है। कंटेंट्स कवर ₹50-150/माह जोड़ता है। ₹50 लाख के घर के लिए व्यापक पॉलिसी आमतौर पर ₹200-500/माह।", hinglish: "India mein home insurance premiums surprisingly affordable hain. Building-only cover ₹100-200/month se shuru hota hai. Contents cover ₹50-150/month add karta hai. ₹50 lakh ke ghar ke liye comprehensive policy typically ₹200-500/month." } },
  { q: { en: "What is the difference between building cover and contents cover?", hi: "बिल्डिंग कवर और कंटेंट्स कवर में क्या अंतर है?", hinglish: "Building cover aur contents cover mein kya farq hai?" }, a: { en: "Building cover insures the physical structure of your home — walls, roof, floors, doors, windows, and fixed fixtures. Contents cover insures the items inside your home — furniture, appliances, jewellery, clothing, and personal belongings. Homeowners should buy both. Renters only need contents cover.", hi: "बिल्डिंग कवर आपके घर की भौतिक संरचना का बीमा करता है — दीवारें, छत, फ़र्श, दरवाज़े, खिड़कियाँ। कंटेंट्स कवर घर के अंदर की वस्तुओं का बीमा करता है। होमओनर्स को दोनों खरीदने चाहिए। किराएदारों को केवल कंटेंट्स कवर चाहिए।", hinglish: "Building cover aapke ghar ki physical structure ka insurance karta hai — walls, roof, floors, doors, windows. Contents cover ghar ke andar ki items ka insurance karta hai. Homeowners ko dono khareedne chahiye. Renters ko sirf contents cover chahiye." } },
  { q: { en: "Does home insurance cover earthquake and flood damage?", hi: "क्या होम इंश्योरेंस भूकंप और बाढ़ क्षति कवर करता है?", hinglish: "Kya home insurance earthquake aur flood damage cover karta hai?" }, a: { en: "Earthquake cover is available as an add-on in most home insurance policies — it is not included by default. Given that 59% of India's land area is earthquake-prone, this add-on is strongly recommended. Flood cover is generally included in the standard fire policy. Always check the policy wordings.", hi: "भूकंप कवर अधिकांश होम इंश्योरेंस पॉलिसियों में ऐड-ऑन के रूप में उपलब्ध है — यह डिफ़ॉल्ट रूप से शामिल नहीं है। चूँकि भारत का 59% भूभाग भूकंप-प्रवण है, इस ऐड-ऑन की दृढ़ता से सिफारिश की जाती है। बाढ़ कवर आमतौर पर मानक आग पॉलिसी में शामिल है।", hinglish: "Earthquake cover most home insurance policies mein add-on ke roop mein available hai — yeh default mein shamil nahi hai. Kyunki India ka 59% land area earthquake-prone hai, yeh add-on strongly recommended hai. Flood cover generally standard fire policy mein shamil hai." } },
  { q: { en: "How is the sum insured determined for home insurance?", hi: "होम इंश्योरेंस के लिए बीमित राशि कैसे तय होती है?", hinglish: "Home insurance ke liye sum insured kaise tay hota hai?" }, a: { en: "For building cover, the sum insured should equal the reconstruction cost — not the market value. Reconstruction cost = Area × Current construction rate per sq ft. For contents, it should reflect the replacement value. Under-insuring leads to proportional claim settlement.", hi: "बिल्डिंग कवर के लिए, बीमित राशि पुनर्निर्माण लागत के बराबर होनी चाहिए — बाज़ार मूल्य नहीं। पुनर्निर्माण लागत = क्षेत्रफल × वर्तमान निर्माण दर प्रति वर्ग फ़ुट। कंटेंट्स के लिए, प्रतिस्थापन मूल्य। कम बीमा आनुपातिक क्लेम निपटान का कारण बनता है।", hinglish: "Building cover ke liye, sum insured reconstruction cost ke barabar honi chahiye — market value nahi. Reconstruction cost = Area × Current construction rate per sq ft. Contents ke liye, replacement value. Under-insuring proportional claim settlement ka reason banta hai." } },
  { q: { en: "Can renters buy home insurance in India?", hi: "क्या किराएदार भारत में होम इंश्योरेंस खरीद सकते हैं?", hinglish: "Kya renters India mein home insurance khareed sakte hain?" }, a: { en: "Yes! Renters can and should buy contents-only home insurance. A contents-only policy costs just ₹100-300/month and covers theft, fire, flood, and accidental damage to your belongings. Some insurers offer specialized renter's insurance that also includes personal liability and alternative accommodation.", hi: "हाँ! किराएदार केवल-कंटेंट्स होम इंश्योरेंस खरीद सकते हैं और खरीदना चाहिए। केवल-कंटेंट्स पॉलिसी केवल ₹100-300/माह की लागत है और चोरी, आग, बाढ़ और आकस्मिक क्षति कवर करती है।", hinglish: "Haan! Renters contents-only home insurance khareed sakte hain aur khareedna chahiye. Contents-only policy sirf ₹100-300/month ki lagat hai aur theft, fire, flood aur accidental damage cover karti hai." } },
];

// ── Static data ─────────────────────────────────────────────────────────────
const comparisonPlans = [
  { name: "ICICI Lombard", planName: "Home Insurance", premium: "₹150 – ₹400/mo", coverage: "₹5L – ₹50L", claimSettlement: "91%", highlight: { en: "Instant online policy, burglary included", hi: "तत्काल ऑनलाइन पॉलिसी, सेंधमारी शामिल", hinglish: "Instant online policy, burglary included" }, aiPick: false },
  { name: "Bajaj Allianz", planName: "My Home", premium: "₹200 – ₹500/mo", coverage: "₹10L – ₹1Cr", claimSettlement: "90%", highlight: { en: "Earthquake + terrorism cover built-in", hi: "भूकंप + आतंकवाद कवर बिल्ट-इन", hinglish: "Earthquake + terrorism cover built-in" }, aiPick: true },
  { name: "HDFC ERGO", planName: "Home Shield", premium: "₹120 – ₹450/mo", coverage: "₹5L – ₹75L", claimSettlement: "92%", highlight: { en: "Renters policy available, flexible add-ons", hi: "किराएदार पॉलिसी उपलब्ध, लचीले ऐड-ऑन", hinglish: "Renters policy available, flexible add-ons" }, aiPick: false },
  { name: "SBI General", planName: "Home Insurance", premium: "₹100 – ₹350/mo", coverage: "₹5L – ₹50L", claimSettlement: "88%", highlight: { en: "Lowest premiums, SBI trust", hi: "सबसे कम प्रीमियम, SBI भरोसा", hinglish: "Lowest premiums, SBI trust" }, aiPick: false },
  { name: "New India Assurance", planName: "Householders Policy", premium: "₹130 – ₹400/mo", coverage: "₹5L – ₹1Cr", claimSettlement: "87%", highlight: { en: "Govt-backed, widest acceptance", hi: "सरकार-समर्थित, सबसे व्यापक स्वीकृति", hinglish: "Govt-backed, widest acceptance" }, aiPick: false },
];

const premiumEstimates = [
  { homeType: { en: "1 BHK Flat (₹25L value)", hi: "1 BHK फ्लैट (₹25L मूल्य)", hinglish: "1 BHK Flat (₹25L value)" }, building: "₹100 – ₹180/mo", contents: "₹50 – ₹100/mo", comprehensive: "₹150 – ₹280/mo" },
  { homeType: { en: "2 BHK Flat (₹50L value)", hi: "2 BHK फ्लैट (₹50L मूल्य)", hinglish: "2 BHK Flat (₹50L value)" }, building: "₹180 – ₹300/mo", contents: "₹80 – ₹180/mo", comprehensive: "₹260 – ₹480/mo" },
  { homeType: { en: "3 BHK Flat (₹75L value)", hi: "3 BHK फ्लैट (₹75L मूल्य)", hinglish: "3 BHK Flat (₹75L value)" }, building: "₹250 – ₹400/mo", contents: "₹100 – ₹200/mo", comprehensive: "₹350 – ₹600/mo" },
  { homeType: { en: "Independent House (₹1Cr value)", hi: "स्वतंत्र घर (₹1Cr मूल्य)", hinglish: "Independent House (₹1Cr value)" }, building: "₹350 – ₹500/mo", contents: "₹150 – ₹300/mo", comprehensive: "₹500 – ₹800/mo" },
  { homeType: { en: "Rented Contents Only", hi: "किराए का केवल कंटेंट्स", hinglish: "Rented Contents Only" }, building: "N/A", contents: "₹100 – ₹250/mo", comprehensive: "₹100 – ₹250/mo" },
  { homeType: { en: "Luxury Villa (₹2Cr+ value)", hi: "लक्ज़री विला (₹2Cr+ मूल्य)", hinglish: "Luxury Villa (₹2Cr+ value)" }, building: "₹600 – ₹1,200/mo", contents: "₹300 – ₹600/mo", comprehensive: "₹900 – ₹1,800/mo" },
];

const addOns = [
  { name: { en: "Earthquake Cover", hi: "भूकंप कवर", hinglish: "Earthquake Cover" }, desc: { en: "Covers damage to building and contents caused by earthquakes, tremors, and volcanic eruptions. Essential for homes in Seismic Zones III, IV, and V (Delhi, Mumbai, North-East, Himalayan belt). Without this add-on, earthquake damage is excluded from the base policy.", hi: "भूकंप, झटके और ज्वालामुखी विस्फोट से बिल्डिंग और कंटेंट्स को होने वाली क्षति कवर करता है। सीस्मिक ज़ोन III, IV और V (दिल्ली, मुंबई, उत्तर-पूर्व, हिमालयन बेल्ट) में घरों के लिए आवश्यक।", hinglish: "Earthquakes, tremors aur volcanic eruptions se building aur contents ko damage cover karta hai. Seismic Zones III, IV aur V (Delhi, Mumbai, North-East, Himalayan belt) ke gharon ke liye zaroori." }, cost: "10-15% of base premium", aiPick: true },
  { name: { en: "Burglary & Theft Cover", hi: "सेंधमारी और चोरी कवर", hinglish: "Burglary & Theft Cover" }, desc: { en: "Covers loss of valuables, jewellery, electronics, and household items due to burglary, housebreaking, or theft. Essential for urban homeowners and renters in metro cities.", hi: "सेंधमारी, घर तोड़ चोरी या चोरी के कारण कीमती सामान, आभूषण, इलेक्ट्रॉनिक्स और घरेलू वस्तुओं के नुकसान को कवर करता है।", hinglish: "Burglary, housebreaking ya theft ki wajah se valuables, jewellery, electronics aur household items ke loss ko cover karta hai." }, cost: "₹50 – ₹200/month", aiPick: false },
  { name: { en: "Personal Liability Cover", hi: "व्यक्तिगत देयता कवर", hinglish: "Personal Liability Cover" }, desc: { en: "Covers legal expenses and compensation if a third party suffers injury or property damage due to an event at your home. Crucial for apartment owners.", hi: "यदि किसी तीसरे पक्ष को आपके घर पर किसी घटना के कारण चोट या संपत्ति क्षति होती है तो कानूनी खर्चे और मुआवज़ा कवर करता है।", hinglish: "Legal expenses aur compensation cover karta hai agar koi third party ko aapke ghar pe kisi event ki wajah se injury ya property damage hoti hai." }, cost: "₹30 – ₹100/month", aiPick: false },
  { name: { en: "Alternative Accommodation", hi: "वैकल्पिक आवास", hinglish: "Alternative Accommodation" }, desc: { en: "Pays for temporary rental accommodation if your home becomes uninhabitable due to an insured event. Covers rent for up to 6-12 months while your home is being repaired.", hi: "यदि बीमित घटना के कारण आपका घर रहने लायक नहीं रहता तो अस्थायी किराए के आवास का भुगतान करता है। मरम्मत होने तक 6-12 महीने तक किराया कवर।", hinglish: "Temporary rental accommodation pay karta hai agar aapka ghar insured event ki wajah se uninhabitable ho jata hai. 6-12 months tak rent cover karta hai jab tak ghar repair ho raha hai." }, cost: "₹50 – ₹150/month", aiPick: false },
  { name: { en: "Jewellery & Valuables Cover", hi: "आभूषण और कीमती वस्तुएँ कवर", hinglish: "Jewellery & Valuables Cover" }, desc: { en: "Specific cover for gold, diamonds, watches, and other valuables beyond the standard contents limit. Most base policies cap jewellery cover at ₹1-2 lakh. This add-on extends it to ₹5-25 lakh.", hi: "मानक कंटेंट्स सीमा से परे सोने, हीरे, घड़ियों और अन्य कीमती वस्तुओं के लिए विशिष्ट कवर। अधिकांश बेस पॉलिसी आभूषण कवर ₹1-2 लाख तक सीमित करती हैं।", hinglish: "Standard contents limit se beyond gold, diamonds, watches aur other valuables ke liye specific cover. Most base policies jewellery cover ₹1-2 lakh tak limit karti hain." }, cost: "1-2% of declared value/year", aiPick: false },
  { name: { en: "Appliance & Electronics Cover", hi: "उपकरण और इलेक्ट्रॉनिक्स कवर", hinglish: "Appliance & Electronics Cover" }, desc: { en: "Covers accidental damage, electrical short-circuit, and mechanical breakdown of home appliances — AC, washing machine, refrigerator, TV, microwave, and laptops.", hi: "होम उपकरणों — AC, वॉशिंग मशीन, रेफ़्रिजरेटर, TV, माइक्रोवेव और लैपटॉप की आकस्मिक क्षति, इलेक्ट्रिकल शॉर्ट-सर्किट और मैकेनिकल ब्रेकडाउन कवर करता है।", hinglish: "Home appliances — AC, washing machine, refrigerator, TV, microwave aur laptops ki accidental damage, electrical short-circuit aur mechanical breakdown cover karta hai." }, cost: "₹40 – ₹150/month", aiPick: false },
];

function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />;
}

export default function HomeInsuranceClientContent() {
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
            <Link href="/free-audit">
              <ShinyButton variant="blue"><span>{pt(t.hero.ctaCompare, language)}</span></ShinyButton>
            </Link>
            <a href="https://wa.me/919257877312?text=Hi%2C%20I%20need%20help%20with%20home%20insurance" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary"><span>{pt(t.hero.ctaWhatsApp, language)}</span></ShinyButton>
            </a>
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

      {/* WHAT IS HOME INSURANCE */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">{pt(t.whatIs.heading, language)} <span className="gradient-text">{pt(t.whatIs.headingHighlight, language)}</span>?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(t.whatIs.para1, language)}</p>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-4xl">{pt(t.whatIs.para2, language)}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">🏠 {pt(t.whatIs.buildingTitle, language)}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[pt(t.whatIs.building1, language), pt(t.whatIs.building2, language), pt(t.whatIs.building3, language), pt(t.whatIs.building4, language), pt(t.whatIs.building5, language)].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">📦 {pt(t.whatIs.contentsTitle, language)}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[pt(t.whatIs.contents1, language), pt(t.whatIs.contents2, language), pt(t.whatIs.contents3, language), pt(t.whatIs.contents4, language), pt(t.whatIs.contents5, language)].map((item, i) => (
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
              { title: pt(t.features.f1Title, language), desc: pt(t.features.f1Desc, language), icon: "🔥" },
              { title: pt(t.features.f2Title, language), desc: pt(t.features.f2Desc, language), icon: "🌊" },
              { title: pt(t.features.f3Title, language), desc: pt(t.features.f3Desc, language), icon: "🔒" },
              { title: pt(t.features.f4Title, language), desc: pt(t.features.f4Desc, language), icon: "🏗️" },
              { title: pt(t.features.f5Title, language), desc: pt(t.features.f5Desc, language), icon: "🏨" },
              { title: pt(t.features.f6Title, language), desc: pt(t.features.f6Desc, language), icon: "⚖️" },
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
                  <th className="text-left py-3 px-4 font-semibold">{pt(t.premiumEst.thHomeType, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.premiumEst.thBuilding, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.premiumEst.thContents, language)}</th>
                  <th className="text-center py-3 px-4 font-semibold">{pt(t.premiumEst.thComprehensive, language)}</th>
                </tr>
              </thead>
              <tbody>
                {premiumEstimates.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{pt(row.homeType, language)}</td>
                    <td className="py-3 px-4 text-center gradient-text font-semibold">{row.building}</td>
                    <td className="py-3 px-4 text-center gradient-text font-semibold">{row.contents}</td>
                    <td className="py-3 px-4 text-center font-bold text-primary">{row.comprehensive}</td>
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
              <div key={idx} className="glass-card rounded-xl p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 relative">
                {addon.aiPick && <span className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">{pt(t.comparison.aiPick, language)}</span>}
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
            <a href="https://wa.me/919257877312?text=Hi%2C%20I%20want%20to%20buy%20home%20insurance" target="_blank" rel="noopener noreferrer"><ShinyButton variant="secondary"><span>{pt(t.cta.ctaWhatsApp, language)}</span></ShinyButton></a>
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
