'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import {
  BookOpen, Search, ArrowRight, MessageCircle, ChevronRight,
  ShieldCheck, IndianRupee, Heart, Car, Zap, FileText,
} from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "25+ Terms Explained", hi: "25+ शब्द समझाए गए", hinglish: "25+ Terms Explained" },
    title1: { en: "Insurance Glossary Hub", hi: "इंश्योरेंस शब्दावली हब", hinglish: "Insurance Glossary Hub" },
    title2: { en: "Hindi/English/Hinglish Guide", hi: "हिंदी/अंग्रेज़ी/हिंग्लिश गाइड", hinglish: "Hindi/English/Hinglish Guide" },
    desc: { en: "Insurance terminology explained in Hindi, English, and Hinglish. IDV, NCB, PED, CSR — every term you need to know before buying insurance.", hi: "हिंदी, अंग्रेज़ी और हिंग्लिश में बीमा शब्दावली। IDV, NCB, PED, CSR — बीमा खरीदने से पहले हर शब्द जो आपको जानना चाहिए।", hinglish: "Insurance terminology explained Hindi, English, aur Hinglish mein. IDV, NCB, PED, CSR — har term jo aapko insurance khareedne se pehle jaana chahiye." },
    ctaWhatsApp: { en: "💬 Ask Insurance Terms", hi: "💬 बीमा शब्द पूछें", hinglish: "💬 Insurance Terms Poochiye" },
    ctaFullGlossary: { en: "Full Glossary Page →", hi: "पूर्ण शब्दावली पृष्ठ →", hinglish: "Full Glossary Page →" },
  },
  quickRef: {
    heading: { en: "Quick Reference — Most Searched Insurance Abbreviations", hi: "त्वरित संदर्भ — सबसे अधिक खोजे गए बीमा संक्षेपाक्षर", hinglish: "Quick Reference — Most Searched Insurance Abbreviations" },
    desc: { en: "The most commonly searched insurance terms in India. Know these before buying any policy.", hi: "भारत में सबसे अधिक खोजे जाने वाले बीमा शब्द। कोई भी पॉलिसी खरीदने से पहले ये जानें।", hinglish: "India mein sabse zyada searched insurance terms. Koi bhi policy khareedne se pehle yeh jaanein." },
    thAbbr: { en: "Abbr.", hi: "संक्षेप", hinglish: "Abbr." },
    thFull: { en: "Full Form", hi: "पूर्ण रूप", hinglish: "Full Form" },
    thHindi: { en: "Hindi", hi: "हिंदी", hinglish: "Hindi" },
    thHinglish: { en: "Hinglish", hi: "हिंग्लिश", hinglish: "Hinglish" },
    thWhy: { en: "Why It Matters", hi: "महत्व", hinglish: "Why It Matters" },
  },
  mustKnow: {
    heading: { en: "Must-Know Terms Before Buying Insurance", hi: "बीमा खरीदने से पहले जानने वाले शब्द", hinglish: "Must-Know Terms Before Buying Insurance" },
    desc: { en: "These terms directly affect your premium, claim payout, and policy selection. Don't buy insurance without understanding them.", hi: "ये शब्द सीधे आपके प्रीमियम, क्लेम भुगतान और पॉलिसी चयन को प्रभावित करते हैं। बिना समझे बीमा मत खरीदें।", hinglish: "Yeh terms directly aapke premium, claim payout, aur policy selection ko affect karte hain. Bina samjhe insurance mat khareedein." },
  },
  category: {
    motor: { en: "Motor Insurance Terms", hi: "मोटर बीमा शब्द", hinglish: "Motor Insurance Terms" },
    health: { en: "Health Insurance Terms", hi: "हेल्थ बीमा शब्द", hinglish: "Health Insurance Terms" },
    life: { en: "Life Insurance Terms", hi: "लाइफ बीमा शब्द", hinglish: "Life Insurance Terms" },
    general: { en: "General Insurance Terms", hi: "सामान्य बीमा शब्द", hinglish: "General Insurance Terms" },
    motorDesc: { en: "Vehicle insurance terminology — IDV, NCB, TP, OD, Zero Dep, and more.", hi: "वाहन बीमा शब्दावली — IDV, NCB, TP, OD, ज़ीरो डेप और अधिक।", hinglish: "Vehicle insurance terminology — IDV, NCB, TP, OD, Zero Dep, aur more." },
    healthDesc: { en: "Health insurance terminology — PED, copay, waiting period, cashless, and more.", hi: "हेल्थ बीमा शब्दावली — PED, कोपे, प्रतीक्षा अवधि, कैशलेस और अधिक।", hinglish: "Health insurance terminology — PED, copay, waiting period, cashless, aur more." },
    lifeDesc: { en: "Life insurance terminology — riders, surrender value, bonus, and more.", hi: "लाइफ बीमा शब्दावली — राइडर, सरेंडर वैल्यू, बोनस और अधिक।", hinglish: "Life insurance terminology — riders, surrender value, bonus, aur more." },
    generalDesc: { en: "General insurance terms — premium, CSR, ICR, solvency ratio, and more.", hi: "सामान्य बीमा शब्द — प्रीमियम, CSR, ICR, सॉल्वेंसी रेश्यो और अधिक।", hinglish: "General insurance terms — premium, CSR, ICR, solvency ratio, aur more." },
    example: { en: "Example:", hi: "उदाहरण:", hinglish: "Example:" },
  },
  cta: {
    heading: { en: "Confused by Insurance Jargon?", hi: "बीमा शब्दावली से उलझन में हैं?", hinglish: "Insurance Jargon se Confused?" },
    desc: { en: "Get personalized explanations in Hindi, English, or Hinglish from IRDAI-certified advisor Himanshu Paliwal (POSP Code: IP429834). Free consultation on WhatsApp.", hi: "IRDAI-प्रमाणित सलाहकार हिमांशु पालीवाल से हिंदी, अंग्रेज़ी या हिंग्लिश में व्यक्तिगत स्पष्टीकरण प्राप्त करें। WhatsApp पर मुफ़्त परामर्श।", hinglish: "IRDAI-certified advisor Himanshu Paliwal se Hindi, English, ya Hinglish mein personalized explanations lo. WhatsApp pe free consultation." },
    ctaWhatsApp: { en: "💬 Ask on WhatsApp", hi: "💬 WhatsApp पर पूछें", hinglish: "💬 WhatsApp pe Poochiye" },
    ctaFullPage: { en: "Full Glossary Page →", hi: "पूर्ण शब्दावली पृष्ठ →", hinglish: "Full Glossary Page →" },
  },
};

const glossaryTerms = [
  { term: 'Add-on Cover', hindi: 'अतिरिक्त कवर', hinglish: 'Extra cover jo base policy ke saath khareed sakte hain', definition: 'Optional extra cover that enhances your base insurance policy. Add-ons increase your premium but provide additional benefits.', example: 'Zero Depreciation, Engine Protection, and Roadside Assistance are popular add-ons.', category: 'Motor' },
  { term: 'Cashless Claim', hindi: 'कैशलेस क्लेम', hinglish: 'Bina paishe diye claim — insurer directly pays hospital/garage', definition: 'A claim where the insurer settles the bill directly with the hospital or garage. You don\'t pay upfront except for deductibles/co-pay.', example: 'You get treated at a network hospital and the insurer pays the hospital directly.', category: 'Health' },
  { term: 'Co-payment (Co pay)', hindi: 'सह-भुगतान', hinglish: 'Claim ka ek hissa aapko khud dena padta hai', definition: 'The fixed percentage of the claim amount that you must pay from your own pocket. Policies with co-pay have lower premiums.', example: 'With 20% co-pay on ₹2L bill, you pay ₹40,000 and insurer pays ₹1,60,000.', category: 'Health' },
  { term: 'CSR (Claims Settlement Ratio)', hindi: 'क्लेम निपटान अनुपात', hinglish: 'Kitne percent claims insurer ne settle kiye', definition: 'The percentage of insurance claims an insurer settles out of the total claims received in a year. Higher CSR = more reliable insurer.', example: 'If an insurer received 1,000 claims and settled 970, the CSR is 97%.', category: 'General' },
  { term: 'Deductible', hindi: 'कटौती राशि', hinglish: 'Amount jo aapko khud pay karni padti hai before insurer pays', definition: 'The amount you must pay out of pocket before the insurer starts paying. Higher voluntary deductible = lower premium.', example: '₹5,000 deductible on ₹50,000 claim → you pay ₹5,000, insurer pays ₹45,000.', category: 'General' },
  { term: 'IDV (Insured Declared Value)', hindi: 'बीमित घोषित मूल्य', hinglish: 'Aapki gaadi ki current market value — max claim amount', definition: 'The current market value of your vehicle — the maximum amount your insurer will pay if stolen or totalled. IDV = Ex-showroom price minus depreciation.', example: '₹10L ex-showroom car after 2 years → IDV ≈ ₹8L (after 20% depreciation).', category: 'Motor' },
  { term: 'NCB (No Claim Bonus)', hindi: 'बिना क्लेम बोनस', hinglish: 'Claim-free year pe discount — 20% se 50% tak', definition: 'A discount on Own Damage premium for every claim-free year: 20% after 1 year, up to 50% after 5+ years. NCB belongs to you, not the vehicle.', example: 'After 5 claim-free years, 50% discount on ₹15,000 OD premium = saving ₹7,500.', category: 'Motor' },
  { term: 'OD (Own Damage)', hindi: 'स्वयं की क्षति', hinglish: 'Aapki apni gaadi ka nuksan cover', definition: 'The component of motor insurance that covers damage to your own vehicle from accidents, theft, fire, and natural calamities.', example: 'A tree falls on your parked car — OD cover pays for the repair.', category: 'Motor' },
  { term: 'PED (Pre-existing Disease)', hindi: 'पूर्व-मौजूदा बीमारी', hinglish: 'Policy se pehle se maujood bimari — diabetes, BP, etc.', definition: 'Any health condition that existed before the insurance policy start date. Most insurers cover PEDs after a waiting period of 1-4 years.', example: 'You have diabetes before buying health insurance. After 2-year waiting period, diabetes treatment is covered.', category: 'Health' },
  { term: 'Portability', hindi: 'पोर्टेबिलिटी', hinglish: 'Insurer change karo bina waiting period lose kiye', definition: 'The right to switch health insurance from one insurer to another while retaining accumulated benefits like waiting period credits.', example: 'Switch after 3 years — your 3-year waiting period credit carries over to new insurer.', category: 'Health' },
  { term: 'Premium', hindi: 'प्रीमियम', hinglish: 'Insurance ke liye har saal/joar dena wala amount', definition: 'The amount you pay annually, half-yearly, quarterly, or monthly to keep your insurance policy active.', example: 'You pay ₹12,000/year for a ₹5 lakh health insurance policy.', category: 'General' },
  { term: 'Room Rent Cap', hindi: 'कमरा किराया सीमा', hinglish: 'Maximum room rent jo insurance cover karega per day', definition: 'The maximum daily room charge your health insurance will cover, usually 1-2% of sum insured.', example: '₹5L policy with 1% cap → insurer covers up to ₹5,000/day room charges.', category: 'Health' },
  { term: 'TP (Third-Party Insurance)', hindi: 'थर्ड-पार्टी बीमा', hinglish: 'Dusre ko nuksan hone pe cover — mandatory by law', definition: 'Mandatory motor insurance covering your legal liability for injury, death, or property damage to third parties. TP rates are fixed by IRDAI.', example: 'Your car hits a pedestrian — TP covers the pedestrian\'s medical expenses.', category: 'Motor' },
  { term: 'Waiting Period', hindi: 'प्रतीक्षा अवधि', hinglish: 'Wo time jab certain benefits available nahi hote', definition: 'The time period during which certain benefits are not available. Common: Initial 30 days, PED 1-4 years, Specific diseases 1-2 years.', example: '2-year PED waiting period → diabetes treatment not covered for first 2 years.', category: 'Health' },
  { term: 'Zero Depreciation', hindi: 'ज़ीरो डेप्रिसिएशन', hinglish: 'Claim pe koi depreciation cut nahi — full payment', definition: 'An add-on where the insurer pays full cost of parts replacement without deducting depreciation. Available for vehicles up to 5-7 years old.', example: 'Without Zero Dep: ₹30K bumper → you pay ₹15K. With Zero Dep → you pay ₹0 (only compulsory deductible).', category: 'Motor' },
  { term: 'Solvency Ratio', hindi: 'देयता पर्याप्तता अनुपात', hinglish: 'Insurer kitna financially strong hai claims pay karne ke liye', definition: 'A measure of an insurer\'s financial health. IRDAI mandates minimum 1.5 (150%). Higher solvency = more financially stable insurer.', example: '₹150Cr assets, ₹100Cr liabilities → Solvency ratio 1.5 (150%).', category: 'General' },
  { term: 'Rider', hindi: 'राइडर', hinglish: 'Life insurance ke saath extra benefit add karna', definition: 'An optional add-on to a life insurance policy providing additional benefits like Critical Illness, Accidental Death, Waiver of Premium.', example: 'Add Critical Illness Rider of ₹25L to ₹1 crore term plan for just ₹1,500/year.', category: 'Life' },
  { term: 'Exclusion', hindi: 'अपवर्जन', hinglish: 'Wo conditions jo policy cover NAHI karti', definition: 'Specific conditions, treatments, or situations NOT covered by your insurance policy. Claims for excluded items will be rejected.', example: 'Cosmetic surgery, self-inflicted injuries, and war are common exclusions.', category: 'General' },
  { term: 'ICR (Incurred Claims Ratio)', hindi: 'व्यय क्लेम अनुपात', hinglish: 'Premium collection vs claims paid ka ratio', definition: 'The ratio of total claims paid to total premium collected. ICR between 60-90% is healthy. Above 100% means insurer is paying more than earning.', example: '₹100Cr premiums collected, ₹75Cr claims paid → ICR is 75%.', category: 'General' },
  { term: 'Free-look Period', hindi: 'मुफ्त देखने की अवधि', hinglish: '15-30 din policy return karne ka right — full refund', definition: 'A 15-30 day window after receiving your policy document during which you can return the policy for a full refund.', example: 'Buy policy online, read terms, cancel within 15-30 days for full refund.', category: 'General' },
  { term: 'Endorsement', hindi: 'अनुमोदन', hinglish: 'Policy mein changes ka official document', definition: 'A written amendment to an insurance policy that changes its terms, conditions, or coverage. Legally binding once issued by the insurer.', example: 'Adding your newborn baby to your health insurance through an endorsement.', category: 'General' },
  { term: 'Reimbursement Claim', hindi: 'प्रतिपूर्ति क्लेम', hinglish: 'Pehle aap pay karo, baad mein insurer refund kare', definition: 'A claim where you pay the hospital first, then submit bills to the insurer for repayment. Works at any hospital.', example: 'Pay ₹2L at non-network hospital. Submit bills. Get ₹1.8L reimbursed (after co-pay).', category: 'Health' },
  { term: 'Restore Benefit', hindi: 'रिस्टोर लाभ', hinglish: 'Sum insured khatam hone pe dobara restore hota hai', definition: 'A feature in health insurance that automatically reinstates your sum insured if it gets exhausted during the policy year.', example: '₹10L family floater fully used → Restore benefit adds another ₹10L for future claims.', category: 'Health' },
  { term: 'Grace Period', hindi: 'अनुग्रह अवधि', hinglish: 'Premium due date ke baad extra time — policy lapse nahi hoti', definition: 'The extra time (15-30 days) after the premium due date during which you can pay without the policy lapsing.', example: 'Premium due Jan 1st — you have until Jan 31st to pay without losing coverage.', category: 'General' },
  { term: 'Sum Insured', hindi: 'बीमित राशि', hinglish: 'Maximum amount insurer claim pe pay karega', definition: 'The maximum amount the insurer will pay in case of a claim. For health = total medical coverage. For motor = IDV.', example: '₹10L sum insured health policy → maximum claim payout is ₹10L per year.', category: 'General' },
  { term: 'Underwriting', hindi: 'अंडरराइटिंग', hinglish: 'Insurer aapka risk assess karta hai — premium decide karta hai', definition: 'The process by which an insurer evaluates your risk profile to decide whether to offer coverage and at what premium.', example: '30-year-old non-smoker gets preferred rates. 50-year-old smoker pays 50-100% more.', category: 'General' },
];

const quickRefTerms = [
  { abbr: 'IDV', full: 'Insured Declared Value', hindi: 'बीमित घोषित मूल्य', hinglish: 'Gaadi ki current value — max claim payout', why: "Decides your car's claim payout" },
  { abbr: 'NCB', full: 'No Claim Bonus', hindi: 'बिना क्लेम बोनस', hinglish: 'Claim-free year pe discount 20-50%', why: 'Up to 50% discount on OD premium' },
  { abbr: 'PED', full: 'Pre-existing Disease', hindi: 'पूर्व-मौजूदा बीमारी', hinglish: 'Policy se pehle ki bimari', why: 'Must declare — else claim rejection' },
  { abbr: 'CSR', full: 'Claims Settlement Ratio', hindi: 'क्लेम निपटान अनुपात', hinglish: 'Kitne percent claims settle hue', why: 'Higher = more reliable insurer' },
  { abbr: 'ICR', full: 'Incurred Claims Ratio', hindi: 'व्यय क्लेम अनुपात', hinglish: 'Claims paid vs premium collected', why: '60-90% = healthy insurer' },
  { abbr: 'TP', full: 'Third-Party Insurance', hindi: 'थर्ड-पार्टी बीमा', hinglish: 'Dusre ko nuksan cover — mandatory', why: 'Mandatory by law for all vehicles' },
  { abbr: 'OD', full: 'Own Damage', hindi: 'स्वयं की क्षति', hinglish: 'Apni gaadi ka nuksan cover', why: 'Covers your own vehicle damage' },
  { abbr: 'Zero Dep', full: 'Zero Depreciation', hindi: 'शून्य मूल्यह्रास', hinglish: 'No depreciation cut on parts', why: 'Full claim without depreciation cut' },
  { abbr: 'Copay', full: 'Co-payment', hindi: 'सह-भुगतान', hinglish: 'Claim ka % aapko khud dena', why: 'Reduces premium but increases out-of-pocket' },
  { abbr: 'RTI', full: 'Return to Invoice', hindi: 'इनवॉइस वापसी', hinglish: 'Chori/total loss pe full invoice value', why: 'Get full car price if stolen/totalled' },
];

const mustKnowItems = [
  { term: 'IDV', desc: { en: "Your vehicle's market value. Higher IDV = higher premium but better theft/total loss payout.", hi: "आपके वाहन का बाज़ार मूल्य। अधिक IDV = अधिक प्रीमियम लेकिन बेहतर क्लेम भुगतान।", hinglish: "Vehicle ki market value. Higher IDV = higher premium lekin better claim payout." }, action: { en: "Always ensure fair IDV — don't let insurers lower it.", hi: "हमेशा सही IDV सुनिश्चित करें — बीमाकर्ताओं को इसे कम न करने दें।", hinglish: "Always ensure fair IDV — insurers ko lower karne mat dein." } },
  { term: 'NCB', desc: { en: "Discount on OD premium for claim-free years (20-50%). Belongs to you, not the car.", hi: "क्लेम-मुक्त वर्षों पर OD प्रीमियम पर छूट (20-50%)। आपका है, कार का नहीं।", hinglish: "Discount on OD premium for claim-free years (20-50%). Belongs to you, not the car." }, action: { en: "Protect your NCB — consider NCB Protection add-on.", hi: "अपना NCB बचाएँ — NCB प्रोटेक्शन ऐड-ऑन पर विचार करें।", hinglish: "Protect your NCB — NCB Protection add-on consider karein." } },
  { term: 'PED', desc: { en: "Pre-existing diseases. Must declare honestly — non-disclosure = claim rejection.", hi: "पूर्व-मौजूदा बीमारियाँ। ईमानदारी से घोषित करना ज़रूरी — छिपाने पर क्लेम अस्वीकृति।", hinglish: "Pre-existing diseases. Honestly declare karna zaroori — chhupane pe claim rejection." }, action: { en: "Declare ALL medical history. IRDAI caps PED wait at 3 years.", hi: "सारा चिकित्सा इतिहास घोषित करें। IRDAI PED प्रतीक्षा अधिकतम 3 वर्ष।", hinglish: "Declare ALL medical history. IRDAI caps PED wait at 3 years." } },
  { term: 'CSR', desc: { en: "Claims Settlement Ratio. Higher CSR = insurer more likely to approve your claim.", hi: "क्लेम निपटान अनुपात। अधिक CSR = बीमाकर्ता आपका क्लेम स्वीकार करने की अधिक संभावना।", hinglish: "Claims Settlement Ratio. Higher CSR = insurer more likely to approve your claim." }, action: { en: "Choose insurers with CSR above 95% (life) or 87%+ (health).", hi: "95% से अधिक CSR (जीवन) या 87%+ (स्वास्थ्य) वाले बीमाकर्ता चुनें।", hinglish: "CSR above 95% (life) ya 87%+ (health) wale insurers choose karein." } },
  { term: 'Zero Dep', desc: { en: "No depreciation deduction on parts. Saves 30-50% on claim amount.", hi: "पुर्जों पर कोई ह्रास कटौती नहीं। क्लेम राशि पर 30-50% बचत।", hinglish: "No depreciation cut on parts. Saves 30-50% on claim amount." }, action: { en: "Must-have for cars under 5 years. Costs 15-20% extra premium.", hi: "5 वर्ष से कम की कारों के लिए ज़रूरी। 15-20% अतिरिक्त प्रीमियम।", hinglish: "Must-have for cars under 5 years. Costs 15-20% extra premium." } },
  { term: 'Copay', desc: { en: "Fixed % you pay during claims. Lower copay = higher premium.", hi: "क्लेम के दौरान आपके द्वारा भुगतान किया गया निश्चित %। कम कोपे = अधिक प्रीमियम।", hinglish: "Fixed % you pay during claims. Lower copay = higher premium." }, action: { en: "Avoid copay if possible, especially if under 60.", hi: "संभव हो तो कोपे से बचें, विशेषकर यदि 60 वर्ष से कम हैं।", hinglish: "Avoid copay if possible, especially if under 60." } },
];

const faqs = [
  { question: 'What is IDV in car insurance and why does it matter?', answer: 'IDV (Insured Declared Value) is your vehicle\'s current market value — the maximum amount your insurer will pay if the vehicle is stolen or totally damaged. IDV = Ex-showroom price minus depreciation. Always ensure your IDV is fair — don\'t let insurers lower it to reduce premium.' },
  { question: 'What is NCB and how much can I save?', answer: 'NCB (No Claim Bonus) is a discount on your Own Damage premium for claim-free years: 20% after 1 year, up to 50% after 5+ years. On a ₹15,000 OD premium, 50% NCB saves ₹7,500/year. NCB belongs to you, not the vehicle — it transfers when you switch insurers or buy a new car.' },
  { question: 'What is PED in health insurance?', answer: 'PED (Pre-existing Disease) is any health condition that existed before your insurance policy start date — like diabetes, hypertension, thyroid. Most insurers cover PEDs after a waiting period of 1-4 years. IRDAI has capped the maximum PED waiting period at 3 years.' },
  { question: 'What is the difference between CSR and ICR?', answer: 'CSR (Claims Settlement Ratio) = Claims settled ÷ Claims received × 100. It shows what percentage of claims an insurer approves. ICR (Incurred Claims Ratio) = Claims paid ÷ Premium collected × 100. ICR 60-90% is healthy.' },
  { question: 'What does copay mean in health insurance?', answer: 'Co-pay is the fixed percentage of the claim you must pay from your own pocket. If your policy has 20% co-pay and your hospital bill is ₹2 Lakh, you pay ₹40,000 and the insurer pays ₹1,60,000.' },
  { question: 'What is Zero Depreciation in car insurance?', answer: 'Zero Depreciation (Zero Dep) is an add-on that ensures the insurer pays the full cost of parts replacement without deducting depreciation. Without it, you bear 30-50% of plastic, rubber, and fibre part costs during claims. Highly recommended for new cars.' },
];

export default function ClientContent() {
  const { language } = useLanguage();

  const categories = ['Motor', 'Health', 'Life', 'General'] as const;
  const categoryIcons: Record<string, React.ElementType> = { Motor: Car, Health: Heart, Life: ShieldCheck, General: FileText };
  const categoryColors: Record<string, string> = { Motor: 'text-sky-600', Health: 'text-rose-600', Life: 'text-emerald-600', General: 'text-primary' };
  const categoryNames: Record<string, TEntry> = { Motor: pageText.category.motor, Health: pageText.category.health, Life: pageText.category.life, General: pageText.category.general };
  const categoryDescs: Record<string, TEntry> = { Motor: pageText.category.motorDesc, Health: pageText.category.healthDesc, Life: pageText.category.lifeDesc, General: pageText.category.generalDesc };

  return (
    <div className="min-h-screen">
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        <div className="orb-1 absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="orb-2 absolute bottom-10 right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">{pt({ en: "Home", hi: "होम", hinglish: "Home" }, language)}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{pt(pageText.hero.title1, language)}</span>
          </nav>
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><BookOpen className="h-3.5 w-3.5 mr-1" />{pt(pageText.hero.badge, language)}</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{pt(pageText.hero.title1, language)}{' '}<span className="gradient-text">{pt(pageText.hero.title2, language)}</span></h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(pageText.hero.desc, language)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: BookOpen, label: pt({ en: "Terms Explained", hi: "शब्द समझाए गए", hinglish: "Terms Explained" }, language), value: `${glossaryTerms.length}+` },
                { icon: Search, label: pt({ en: "Quick Reference", hi: "त्वरित संदर्भ", hinglish: "Quick Reference" }, language), value: `${quickRefTerms.length} Abbr.` },
                { icon: ShieldCheck, label: pt({ en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" }, language), value: 'POSP IP429834' },
                { icon: Heart, label: pt({ en: "Categories", hi: "श्रेणियाँ", hinglish: "Categories" }, language), value: '4' },
              ].map((stat, i) => (<Card key={i} className="glass-card bg-background/80"><CardContent className="p-3 text-center"><stat.icon className="h-5 w-5 text-primary mx-auto mb-1" /><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-sm font-bold">{stat.value}</p></CardContent></Card>))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"><ShinyButton variant="blue"><span>{pt(pageText.hero.ctaWhatsApp, language)}</span></ShinyButton></a>
              <Link href="/insurance-glossary"><ShinyButton variant="secondary"><span>{pt(pageText.hero.ctaFullGlossary, language)}</span></ShinyButton></Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Quick Reference */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Search className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.quickRef.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.quickRef.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-3 font-semibold">{pt(pageText.quickRef.thAbbr, language)}</th><th className="text-left p-3 font-semibold">{pt(pageText.quickRef.thFull, language)}</th><th className="text-left p-3 font-semibold">{pt(pageText.quickRef.thHindi, language)}</th><th className="text-left p-3 font-semibold">{pt(pageText.quickRef.thHinglish, language)}</th><th className="text-left p-3 font-semibold">{pt(pageText.quickRef.thWhy, language)}</th></tr></thead>
              <tbody>{quickRefTerms.map((row, i) => (<tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}><td className="p-3 font-bold text-primary">{row.abbr}</td><td className="p-3 font-medium">{row.full}</td><td className="p-3 text-primary/80">{row.hindi}</td><td className="p-3 text-muted-foreground italic">{row.hinglish}</td><td className="p-3 text-muted-foreground">{row.why}</td></tr>))}</tbody>
            </table>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Category-wise Glossary */}
        {categories.map(category => {
          const Icon = categoryIcons[category];
          const color = categoryColors[category];
          const terms = glossaryTerms.filter(t => t.category === category);
          if (terms.length === 0) return null;
          return (
            <section key={category}>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Icon className={`h-6 w-6 ${color}`} /><span className="gradient-text">{pt(categoryNames[category], language)}</span></h2>
              <p className="text-muted-foreground mb-6">{pt(categoryDescs[category], language)}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {terms.map((item, i) => (
                  <Card key={i} className="glass-card hover:translate-y-[-2px] hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2"><h3 className="font-bold text-sm">{item.term}</h3><Badge variant="secondary" className="text-[10px] shrink-0">{item.hindi}</Badge></div>
                      <p className="text-xs text-primary/80 italic mb-2">🗣 {item.hinglish}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.definition}</p>
                      {item.example && (<div className="bg-muted/50 rounded-lg p-2"><p className="text-[10px] font-semibold text-primary mb-0.5">{pt(pageText.category.example, language)}</p><p className="text-[10px] text-muted-foreground">{item.example}</p></div>)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Must-Know Terms */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.mustKnow.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.mustKnow.desc, language)}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {mustKnowItems.map((item, i) => (
              <Card key={i} className="glass-card border-primary/20 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2"><span className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">{item.term.charAt(0)}</span><h3 className="font-bold text-sm">{item.term}</h3></div>
                  <p className="text-xs text-muted-foreground mb-2">{pt(item.desc, language)}</p>
                  <p className="text-xs text-primary font-medium">💡 {pt(item.action, language)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <ExpertInsight insight={pt({ en: "Understanding insurance terms is the difference between buying the right policy and wasting money. The 5 most impactful terms are: IDV (sets your max payout), NCB (saves up to 50% on premium), PED (non-disclosure causes claim rejection), CSR (tells you if insurer is reliable), and Zero Dep (saves lakhs during car claims). If you understand just these 5 terms, you'll make better insurance decisions than 90% of policyholders.", hi: "बीमा शब्दों को समझना सही पॉलिसी खरीदने और पैसे बर्बाद करने के बीच का अंतर है। 5 सबसे प्रभावशाली शब्द हैं: IDV (अधिकतम भुगतान तय करता है), NCB (प्रीमियम पर 50% तक बचत), PED (छिपाने पर क्लेम अस्वीकृति), CSR (बीमाकर्ता विश्वसनीय है या नहीं), और ज़ीरो डेप (कार क्लेम में लाखों बचाता है)।", hinglish: "Insurance terms samajhna is the difference between buying right policy aur paisa waste karne mein. 5 most impactful terms: IDV (max payout set karta hai), NCB (up to 50% premium savings), PED (non-disclosure = claim rejection), CSR (insurer reliable hai ya nahi), aur Zero Dep (car claims mein lakhs bachata hai). Agar yeh 5 terms samajh liye, toh 90% policyholders se better decisions loge." }, language)} topic={pt({ en: "Insurance Terminology Strategy", hi: "बीमा शब्दावली रणनीति", hinglish: "Insurance Terminology Strategy" }, language)} />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <FAQSection faqs={faqs} title={pt({ en: "Insurance Glossary FAQ — Most Asked Questions", hi: "बीमा शब्दावली सवाल-जवाब", hinglish: "Insurance Glossary FAQ — Most Asked Questions" }, language)} />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <section className="text-center py-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
          <h2 className="text-2xl font-bold mb-3 gradient-text">{pt(pageText.cta.heading, language)}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{pt(pageText.cta.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"><ShinyButton variant="blue"><span>{pt(pageText.cta.ctaWhatsApp, language)}</span></ShinyButton></a>
            <Link href="/insurance-glossary"><ShinyButton variant="secondary"><span>{pt(pageText.cta.ctaFullPage, language)}</span></ShinyButton></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
