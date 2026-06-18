'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import {
  Shield, IndianRupee, Heart, FileText, AlertTriangle, CheckCircle2,
  ChevronRight, MessageCircle, Mail, MapPin, ArrowRight, Award,
  Calculator, PiggyBank, Receipt, Users, Clock, Stethoscope,
  BadgeCheck, BookOpen, Banknote, TrendingDown, Info
} from 'lucide-react';

/* ─── Brand colours ─── */
const NAVY = '#071B3B';
const DARK_NAVY = '#2563EB';
const GOLD = '#F4B400';

// ── Translation Maps ──────────────────────────────────────────────────────
type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  hero: {
    badge: { en: "IRDAI Registered POSP — IP429834", hi: "IRDAI पंजीकृत POSP — IP429834", hinglish: "IRDAI Registered POSP — IP429834" },
    title: { en: "Insurance Tax Saving Guide", hi: "बीमा कर बचत गाइड", hinglish: "Insurance Tax Saving Guide" },
    titleHighlight: { en: "Save up to ₹1,50,000+", hi: "₹1,50,000+ तक की बचत करें", hinglish: "₹1,50,000+ tak ki bachat karein" },
    description: {
      en: "Save up to ₹1,50,000+ under Sections 80C, 80D, 80CCC & 80DDB of the Income Tax Act. Complete guide with real examples and calculation tables.",
      hi: "आयकर अधिनियम की धारा 80C, 80D, 80CCC और 80DDB के तहत ₹1,50,000+ तक की बचत करें। वास्तविक उदाहरणों और गणना तालिकाओं के साथ पूर्ण गाइड।",
      hinglish: "Sections 80C, 80D, 80CCC & 80DDB ke tahat ₹1,50,000+ tak ki bachat karein. Real examples aur calculation tables ke saath complete guide."
    },
    lastUpdated: { en: "Last Updated: March 2025", hi: "अंतिम अपडेट: मार्च 2025", hinglish: "Last Updated: March 2025" },
    ctaCompare: { en: "Compare & Save Tax", hi: "तुलना करें और कर बचाएं", hinglish: "Compare & Save Tax" },
    ctaWhatsApp: { en: "Chat on WhatsApp", hi: "WhatsApp पर चैट करें", hinglish: "WhatsApp pe Chat Karein" },
  },
  breadcrumb: {
    home: { en: "Home", hi: "होम", hinglish: "Home" },
    current: { en: "Tax Saving Guide", hi: "कर बचत गाइड", hinglish: "Tax Saving Guide" },
  },
  overview: {
    cards: [
      { section: '80D', amount: '₹75,000', desc: { en: "Health Insurance", hi: "स्वास्थ्य बीमा", hinglish: "Health Insurance" } },
      { section: '80C', amount: '₹1,50,000', desc: { en: "Life Insurance", hi: "जीवन बीमा", hinglish: "Life Insurance" } },
      { section: '80CCC', amount: '₹1,50,000', desc: { en: "Pension Plans", hi: "पेंशन योजनाएं", hinglish: "Pension Plans" } },
      { section: '80DDB', amount: '₹1,00,000', desc: { en: "Medical Treatment", hi: "चिकित्सा उपचार", hinglish: "Medical Treatment" } },
    ],
  },
  toc: {
    title: { en: "Table of Contents", hi: "विषय सूची", hinglish: "Table of Contents" },
    sections: [
      { id: 'section-80d', title: { en: "Section 80D — Health Insurance", hi: "धारा 80D — स्वास्थ्य बीमा", hinglish: "Section 80D — Health Insurance" } },
      { id: 'section-80c', title: { en: "Section 80C — Life Insurance", hi: "धारा 80C — जीवन बीमा", hinglish: "Section 80C — Life Insurance" } },
      { id: 'section-80ccc', title: { en: "Section 80CCC — Pension Plans", hi: "धारा 80CCC — पेंशन योजनाएं", hinglish: "Section 80CCC — Pension Plans" } },
      { id: 'section-80ddb', title: { en: "Section 80DDB — Medical Treatment", hi: "धारा 80DDB — चिकित्सा उपचार", hinglish: "Section 80DDB — Medical Treatment" } },
      { id: 'how-to-claim', title: { en: "How to Claim Deductions", hi: "कटौती का दावा कैसे करें", hinglish: "How to Claim Deductions" } },
      { id: 'tax-calculator', title: { en: "Tax Calculator Examples", hi: "कर गणना उदाहरण", hinglish: "Tax Calculator Examples" } },
      { id: 'disclaimer', title: { en: "Important Disclaimers", hi: "महत्वपूर्ण अस्वीकरण", hinglish: "Important Disclaimers" } },
    ],
  },
  sec80d: {
    heading: { en: "1. Section 80D — Health Insurance Tax Deduction", hi: "1. धारा 80D — स्वास्थ्य बीमा कर कटौती", hinglish: "1. Section 80D — Health Insurance Tax Deduction" },
    description: {
      en: "Section 80D of the Income Tax Act allows you to claim deductions for health insurance premiums paid for yourself, your family, and your parents. This is over and above the Section 80C limit.",
      hi: "आयकर अधिनियम की धारा 80D आपको अपने, अपने परिवार और अपने माता-पिता के लिए चुकाए गए स्वास्थ्य बीमा प्रीमियम की कटौती का दावा करने की अनुमति देती है। यह धारा 80C की सीमा के अतिरिक्त है।",
      hinglish: "Section 80D aapko apne, apne parivaar aur apne maata-pita ke liye chukaye gaye health insurance premium ki katooti ka daava karne ki anumati deta hai. Yeh Section 80C ki seema ke atirikt hai."
    },
    tableHeaders: {
      who: { en: "Who Is Covered", hi: "किसे कवर किया गया", hinglish: "Who Is Covered" },
      age: { en: "Age", hi: "आयु", hinglish: "Age" },
      maxDeduction: { en: "Max Deduction", hi: "अधिकतम कटौती", hinglish: "Max Deduction" },
    },
    tableRows: [
      { who: { en: "Self, Spouse & Children", hi: "स्वयं, पति/पत्नी और बच्चे", hinglish: "Self, Spouse & Children" }, age: { en: "Below 60", hi: "60 से कम", hinglish: "Below 60" }, max: "₹25,000" },
      { who: { en: "Self, Spouse & Children", hi: "स्वयं, पति/पत्नी और बच्चे", hinglish: "Self, Spouse & Children" }, age: { en: "60+ (Senior Citizens)", hi: "60+ (वरिष्ठ नागरिक)", hinglish: "60+ (Senior Citizens)" }, max: "₹50,000" },
      { who: { en: "Parents", hi: "माता-पिता", hinglish: "Parents" }, age: { en: "Below 60", hi: "60 से कम", hinglish: "Below 60" }, max: "₹25,000" },
      { who: { en: "Parents", hi: "माता-पिता", hinglish: "Parents" }, age: { en: "60+ (Senior Citizens)", hi: "60+ (वरिष्ठ नागरिक)", hinglish: "60+ (Senior Citizens)" }, max: "₹50,000" },
      { who: { en: "Preventive Health Check-up", hi: "निवारक स्वास्थ्य जांच", hinglish: "Preventive Health Check-up" }, age: { en: "Any", hi: "कोई भी", hinglish: "Any" }, max: "₹5,000 (within limit)" },
    ],
    maxDeductionTitle: { en: "Maximum Deduction Under 80D", hi: "धारा 80D के तहत अधिकतम कटौती", hinglish: "Maximum Deduction Under 80D" },
    maxDeductionDesc: {
      en: "If you (below 60) pay health insurance for self + family (₹25,000) and for senior citizen parents (₹50,000), your total deduction can be up to ₹75,000.",
      hi: "यदि आप (60 से कम) अपने + परिवार का स्वास्थ्य बीमा (₹25,000) और वरिष्ठ नागरिक माता-पिता का (₹50,000) चुकाते हैं, तो कुल कटौती ₹75,000 तक हो सकती है।",
      hinglish: "Agar aap (60 se kam) apne + parivaar ka health insurance (₹25,000) aur senior citizen maata-pita ka (₹50,000) chukate hain, toh total katooti ₹75,000 tak ho sakti hai."
    },
    keyPoints: [
      { en: "Deduction is available for premium paid by any mode other than cash", hi: "कटौती नकद के अलावा किसी भी माध्यम से चुकाए गए प्रीमियम पर उपलब्ध है", hinglish: "Deduction cash ke alawa kisi bhi madhyam se chukaye gaye premium par uplabdh hai" },
      { en: "Cash payment for preventive health check-up is allowed", hi: "निवारक स्वास्थ्य जांच के लिए नकद भुगतान की अनुमति है", hinglish: "Preventive health check-up ke liye cash payment ki anumati hai" },
      { en: "Premium paid for parents is claimed separately from self/family", hi: "माता-पिता के लिए चुकाया प्रीमियम स्वयं/परिवार से अलग दावा किया जाता है", hinglish: "Parents ke liye chukaya premium self/family se alag daava kiya jaata hai" },
      { en: "Group health insurance premium paid by employee from salary is also eligible", hi: "कर्मचारी द्वारा वेतन से चुकाया गया ग्रुप स्वास्थ्य बीमा प्रीमियम भी पात्र है", hinglish: "Employee dwara vetan se chukaya gaya group health insurance premium bhi paatra hai" },
    ],
  },
  sec80c: {
    heading: { en: "2. Section 80C — Life Insurance Premium Deduction", hi: "2. धारा 80C — जीवन बीमा प्रीमियम कटौती", hinglish: "2. Section 80C — Life Insurance Premium Deduction" },
    description: {
      en: "Section 80C is the most popular tax-saving section. Life insurance premiums paid for yourself, your spouse, and your children qualify for deduction up to ₹1,50,000 per financial year.",
      hi: "धारा 80C सबसे लोकप्रिय कर-बचत धारा है। अपने, पति/पत्नी और बच्चों के लिए चुकाए गए जीवन बीमा प्रीमियम प्रति वित्तीय वर्ष ₹1,50,000 तक की कटौती के लिए पात्र हैं।",
      hinglish: "Section 80C sabse popular tax-saving section hai. Apne, spouse aur bachon ke liye chukaye gaye life insurance premium per financial year ₹1,50,000 tak ki katooti ke liye paatra hain."
    },
    cards: [
      { title: { en: "Maximum Deduction", hi: "अधिकतम कटौती", hinglish: "Maximum Deduction" }, value: "₹1,50,000", desc: { en: "Combined limit for all 80C investments (EPF, PPF, ELSS, LIC, etc.)", hi: "सभी 80C निवेशों के लिए संयुक्त सीमा", hinglish: "Combined limit for all 80C investments" } },
      { title: { en: "Who Can Be Covered", hi: "किसे कवर किया जा सकता है", hinglish: "Who Can Be Covered" }, value: { en: "Self + Spouse + Children", hi: "स्वयं + पति/पत्नी + बच्चे", hinglish: "Self + Spouse + Children" }, desc: { en: "Premium for parents or siblings is NOT eligible under 80C", hi: "माता-पिता या भाई-बहन के लिए प्रीमियम 80C के तहत पात्र नहीं है", hinglish: "Parents ya siblings ke liye premium 80C ke tahat paatra nahi hai" } },
      { title: { en: "Premium Limit Rule", hi: "प्रीमियम सीमा नियम", hinglish: "Premium Limit Rule" }, value: { en: "10% of Sum Assured", hi: "सम एश्योर्ड का 10%", hinglish: "10% of Sum Assured" }, desc: { en: "Deduction is disallowed if premium exceeds 10% of sum assured for policies issued after 1 Apr 2012", hi: "यदि प्रीमियम सम एश्योर्ड का 10% से अधिक है तो कटौती अस्वीकार की जाती है", hinglish: "Agar premium sum assured ka 10% se zyada hai toh katooti asweekar ki jaati hai" } },
      { title: { en: "Lock-in Condition", hi: "लॉक-इन शर्त", hinglish: "Lock-in Condition" }, value: { en: "2+ Years Active", hi: "2+ वर्ष सक्रिय", hinglish: "2+ Years Active" }, desc: { en: "Policy must be active for at least 2 years. If surrendered before, deduction is reversed.", hi: "नीति कम से कम 2 वर्ष सक्रिय होनी चाहिए। पहले समर्पित करने पर कटौती वापस ली जाती है।", hinglish: "Policy kam se kam 2 years active honi chahiye. Pehle surrender karne pe katooti wapas li jaati hai." } },
    ],
    includesTitle: { en: "80C Includes More Than Just Life Insurance", hi: "80C केवल जीवन बीमा से अधिक शामिल करता है", hinglish: "80C Includes More Than Just Life Insurance" },
    includesDesc: {
      en: "The ₹1,50,000 limit is shared across multiple investment options. Life insurance premium competes with:",
      hi: "₹1,50,000 की सीमा कई निवेश विकल्पों में साझा है। जीवन बीमा प्रीमियम इनके साथ साझा करता है:",
      hinglish: "₹1,50,000 ki seema kai investment options mein shared hai. Life insurance premium inke saath share karta hai:"
    },
    includesItems: [
      { en: "EPF / PPF", hi: "EPF / PPF", hinglish: "EPF / PPF" },
      { en: "ELSS Mutual Funds", hi: "ELSS म्यूचुअल फंड", hinglish: "ELSS Mutual Funds" },
      { en: "NSC / KVP", hi: "NSC / KVP", hinglish: "NSC / KVP" },
      { en: "5-Year FD", hi: "5-वर्षीय FD", hinglish: "5-Year FD" },
      { en: "Tuition Fees", hi: "ट्यूशन फीस", hinglish: "Tuition Fees" },
      { en: "Home Loan Principal", hi: "होम लोन मूलधन", hinglish: "Home Loan Principal" },
    ],
  },
  sec80ccc: {
    heading: { en: "3. Section 80CCC — Pension Plan Deductions", hi: "3. धारा 80CCC — पेंशन योजना कटौती", hinglish: "3. Section 80CCC — Pension Plan Deductions" },
    description: {
      en: "Section 80CCC allows deduction for contributions made to pension plans offered by life insurance companies. The maximum deduction is ₹1,50,000, but this limit is inclusive of the Section 80C limit.",
      hi: "धारा 80CCC जीवन बीमा कंपनियों द्वारा दी जाने वाली पेंशन योजनाओं में योगदान के लिए कटौती की अनुमति देती है। अधिकतम कटौती ₹1,50,000 है, लेकिन यह सीमा धारा 80C की सीमा के अंतर्गत है।",
      hinglish: "Section 80CCC life insurance companies dwari di jaane wali pension yojanaon mein yogdaan ke liye katooti ki anumati deta hai. Maximum katooti ₹1,50,000 hai, lekin yeh seema Section 80C ki seema ke antargat hai."
    },
    cards: [
      { title: { en: "Eligible Plans", hi: "पात्र योजनाएं", hinglish: "Eligible Plans" }, desc: { en: "Annuity plans from LIC or other life insurers approved under Section 80CCC. Includes deferred annuity and immediate annuity plans.", hi: "LIC या अन्य जीवन बीमाकर्ताओं से धारा 80CCC के तहत अनुमोदित एन्युइटी योजनाएं। आस्थगित और तत्काल एन्युइटी योजनाएं शामिल।", hinglish: "LIC ya other life insurers se Section 80CCC ke tahat anumodit annuity plans. Deferred aur immediate annuity plans shamil." } },
      { title: { en: "Combined Limit", hi: "संयुक्त सीमा", hinglish: "Combined Limit" }, desc: { en: "Section 80CCC deduction is part of the overall ₹1,50,000 limit under Section 80CCE. You cannot claim ₹1.5L under 80C and another ₹1.5L under 80CCC separately.", hi: "धारा 80CCC कटौती धारा 80CCE के तहत समग्र ₹1,50,000 सीमा का हिस्सा है। आप 80C के तहत ₹1.5L और 80CCC के तहत अलग से ₹1.5L का दावा नहीं कर सकते।", hinglish: "Section 80CCC katooti Section 80CCE ke tahat overall ₹1,50,000 seema ka hissa hai. Aap 80C ke tahat ₹1.5L aur 80CCC ke tahat alag se ₹1.5L ka daava nahi kar sakte." } },
      { title: { en: "Tax on Withdrawal", hi: "निकासी पर कर", hinglish: "Tax on Withdrawal" }, desc: { en: "Pension/annuity received on maturity is taxable as income under \"Income from Other Sources\" in the year of receipt.", hi: "परिपक्वता पर प्राप्त पेंशन/एन्युइटी प्राप्ति के वर्ष में \"अन्य स्रोतों से आय\" के रूप में कर योग्य है।", hinglish: "Maturity pe praapt pension/annuity receipt ke year mein \"Income from Other Sources\" ke roop mein taxable hai." } },
      { title: { en: "Surrender Value", hi: "समर्पण मूल्य", hinglish: "Surrender Value" }, desc: { en: "If the pension plan is surrendered before maturity, the deduction claimed earlier is added back to your income in the year of surrender.", hi: "यदि पेंशन योजना परिपक्वता से पहले समर्पित की जाती है, तो पहले दावा की गई कटौती समर्पण के वर्ष में आपकी आय में जोड़ी जाती है।", hinglish: "Agar pension plan maturity se pehle surrender ki jaati hai, toh pehle daava ki gayi katooti surrender ke year mein aapki aay mein jodi jaati hai." } },
    ],
    importantNoteTitle: { en: "Important Note", hi: "महत्वपूर्ण नोट", hinglish: "Important Note" },
    importantNote: {
      en: "Section 80CCC and Section 80C share the same ₹1,50,000 combined cap under Section 80CCE. Plan your investments accordingly to maximize total tax savings.",
      hi: "धारा 80CCC और धारा 80C धारा 80CCE के तहत समान ₹1,50,000 की संयुक्त सीमा साझा करती हैं। कुल कर बचत को अधिकतम करने के लिए अपने निवेश की योजना बनाएं।",
      hinglish: "Section 80CCC aur Section 80C Section 80CCE ke tahat same ₹1,50,000 ki combined seema share karti hain. Total tax savings maximize karne ke liye apne investments plan karein."
    },
  },
  sec80ddb: {
    heading: { en: "4. Section 80DDB — Medical Treatment Deductions", hi: "4. धारा 80DDB — चिकित्सा उपचार कटौती", hinglish: "4. Section 80DDB — Medical Treatment Deductions" },
    description: {
      en: "Section 80DDB provides deduction for medical expenses incurred for the treatment of specified diseases for yourself or your dependents. This deduction is available even without health insurance.",
      hi: "धारा 80DDB अपने या अपने आश्रितों की निर्दिष्ट बीमारियों के उपचार पर किए गए चिकित्सा खर्चों के लिए कटौती प्रदान करती है। यह कटौती स्वास्थ्य बीमा के बिना भी उपलब्ध है।",
      hinglish: "Section 80DDB apne ya apne aashriton ki nirdisht bimariyon ke upchaar par kiye gaye chikitsa kharchon ke liye katooti pradaan karti hai. Yeh katooti health insurance ke bina bhi uplabdh hai."
    },
    below60: { en: "Below 60 years", hi: "60 वर्ष से कम", hinglish: "Below 60 years" },
    seniorCitizen: { en: "Senior Citizens (60+)", hi: "वरिष्ठ नागरिक (60+)", hinglish: "Senior Citizens (60+)" },
    maxDeductionLabel: { en: "Maximum deduction", hi: "अधिकतम कटौती", hinglish: "Maximum deduction" },
    diseasesTitle: { en: "Specified Diseases", hi: "निर्दिष्ट बीमारियां", hinglish: "Specified Diseases" },
    diseases: [
      { en: "Neurological Diseases", hi: "न्यूरोलॉजिकल बीमारियां", hinglish: "Neurological Diseases" },
      { en: "Malignant Cancers", hi: "घातक कैंसर", hinglish: "Malignant Cancers" },
      { en: "AIDS (HIV+)", hi: "एचआईवी/एड्स", hinglish: "AIDS (HIV+)" },
      { en: "Chronic Renal Failure", hi: "क्रॉनिक रीनल फेल्योर", hinglish: "Chronic Renal Failure" },
      { en: "Hematological Disorders", hi: "हेमेटोलॉजिकल विकार", hinglish: "Hematological Disorders" },
      { en: "Severe Hemophilia", hi: "गंभीर हीमोफीलिया", hinglish: "Severe Hemophilia" },
    ],
    keyPoints: [
      { en: "Prescription from a specialist doctor is mandatory", hi: "विशेषज्ञ डॉक्टर का प्रिस्क्रिप्शन अनिवार्य है", hinglish: "Specialist doctor ka prescription anivaarya hai" },
      { en: "Deduction is reduced by any insurance reimbursement received", hi: "कटौती प्राप्त बीमा प्रतिपूर्ति से कम की जाती है", hinglish: "Katooti praapt insurance pratipurti se kam ki jaati hai" },
      { en: "Available for treatment of self, spouse, children, parents, and siblings", hi: "स्वयं, पति/पत्नी, बच्चों, माता-पिता और भाई-बहनों के उपचार के लिए उपलब्ध", hinglish: "Self, spouse, children, parents aur siblings ke upchaar ke liye uplabdh" },
      { en: "No health insurance required — direct medical expense deduction", hi: "स्वास्थ्य बीमा आवश्यक नहीं — सीधे चिकित्सा व्यय कटौती", hinglish: "Health insurance zaroori nahi — direct medical expense deduction" },
    ],
  },
  howToClaim: {
    heading: { en: "5. How to Claim These Deductions", hi: "5. इन कटौतियों का दावा कैसे करें", hinglish: "5. How to Claim These Deductions" },
    description: {
      en: "Follow these steps to claim your insurance-based tax deductions. The process is similar for both the Old Tax Regime and New Tax Regime (with modifications from Budget 2023 onwards).",
      hi: "अपनी बीमा-आधारित कर कटौतियों का दावा करने के लिए इन चरणों का पालन करें।",
      hinglish: "Apni insurance-based tax deductions ka daava karne ke liye in charon ka palan karein."
    },
    steps: [
      {
        title: { en: "Collect Premium Payment Proofs", hi: "प्रीमियम भुगतान प्रमाण जमा करें", hinglish: "Premium Payment Proofs Collect Karein" },
        desc: { en: "Gather all premium receipts, bank statements showing premium debits, and policy documents. Ensure premiums were paid by cheque, NEFT/RTGS, UPI, or credit/debit card (not cash, except for preventive health check-ups under 80D).", hi: "सभी प्रीमियम रसीदें, बैंक विवरण और नीति दस्तावेज़ इकट्ठा करें। सुनिश्चित करें कि प्रीमियम चेक, NEFT/RTGS, UPI या कार्ड द्वारा चुकाया गया हो।", hinglish: "Saari premium rasieden, bank vivaran aur niti dastaavez ikattha karein. Sunishchit karein ki premium cheque, NEFT/RTGS, UPI ya card dwara chukaya gaya ho." },
      },
      {
        title: { en: "Verify Section-wise Eligibility", hi: "धारा-वार पात्रता सत्यापित करें", hinglish: "Section-wise Eligibility Verify Karein" },
        desc: { en: "Check which sections apply to you: 80D for health insurance, 80C for life insurance, 80CCC for pension plans, 80DDB for medical treatment. Each section has different limits and conditions.", hi: "जांचें कि कौन सी धाराएं आप पर लागू होती हैं। प्रत्येक धारा की अलग सीमा और शर्तें हैं।", hinglish: "Check karein ki kaun si dhaaraein aap par laagu hoti hain. Pratyek dhaara ki alag seema aur shartein hain." },
      },
      {
        title: { en: "Declare in ITR", hi: "ITR में घोषित करें", hinglish: "ITR Mein Declare Karein" },
        desc: { en: "While filing your Income Tax Return (ITR-1 or ITR-2), declare the deductions under the appropriate sections. For ITR-1, report in \"Deductions under VI-A\" section. For ITR-2, fill Schedule VI-A.", hi: "अपना आयकर रिटर्न भरते समय, उपयुक्त धाराओं के तहत कटौती घोषित करें। ITR-1 में \"धारा VI-A के तहत कटौती\" में रिपोर्ट करें।", hinglish: "Apna ITR bharte samay, upayukt dhaaraon ke tahat katooti ghoshit karein. ITR-1 mein \"Deductions under VI-A\" mein report karein." },
      },
      {
        title: { en: "Keep Documents for 7 Years", hi: "दस्तावेज़ 7 वर्ष तक रखें", hinglish: "Documents 7 Years Tak Rakhein" },
        desc: { en: "As per IRDAI and Income Tax rules, retain all premium receipts, policy documents, and medical certificates for at least 7 years. The IT department may ask for verification during assessment.", hi: "IRDAI और आयकर नियमों के अनुसार, सभी प्रीमियम रसीदें और दस्तावेज़ कम से कम 7 वर्ष तक रखें। आयकर विभाग मूल्यांकन के दौरान सत्यापन मांग सकता है।", hinglish: "IRDAI aur Income Tax rules ke anusaar, saari premium rasieden aur dastaavez kam se kam 7 years tak rakhein. IT department moolyaankan ke dauraan satyaapan maang sakta hai." },
      },
    ],
    regimeTitle: { en: "Old vs New Tax Regime", hi: "पुराना vs नया कर व्यवस्था", hinglish: "Old vs New Tax Regime" },
    oldRegime: {
      en: "Old Regime: All deductions under 80C, 80D, 80CCC, 80DDB are fully available. Choose this if your total deductions exceed the standard deduction benefit of the new regime.",
      hi: "पुरानी व्यवस्था: 80C, 80D, 80CCC, 80DDB के तहत सभी कटौतियां पूरी तरह उपलब्ध। यदि आपकी कुल कटौतियां नई व्यवस्था के मानक कटौती लाभ से अधिक हैं तो यह चुनें।",
      hinglish: "Old Regime: 80C, 80D, 80CCC, 80DDB ke tahat saari katootiyan poori tarah uplabdh. Agar aapki total katootiyan nai vyavastha ke standard deduction benefit se zyada hain toh yeh chunein."
    },
    newRegime: {
      en: "New Regime (Default from FY 2023-24): Section 80D deductions for health insurance are now available under the new regime as well (from Budget 2025). However, 80C and 80CCC deductions are NOT available under the new regime.",
      hi: "नई व्यवस्था (FY 2023-24 से डिफ़ॉल्ट): धारा 80D कटौतियां अब नई व्यवस्था में भी उपलब्ध हैं (बजट 2025 से)। हालांकि, 80C और 80CCC कटौतियां नई व्यवस्था में उपलब्ध नहीं हैं।",
      hinglish: "New Regime (FY 2023-24 se default): Section 80D deductions ab nai vyavastha mein bhi uplabdh hain (Budget 2025 se). Lekin, 80C aur 80CCC deductions nai vyavastha mein uplabdh nahi hain."
    },
  },
  taxCalc: {
    heading: { en: "6. Tax Calculator — Real Examples", hi: "6. कर गणना — वास्तविक उदाहरण", hinglish: "6. Tax Calculator — Real Examples" },
    description: {
      en: "See how much tax you can save with insurance under the Old Tax Regime. These are realistic examples based on common Indian family profiles.",
      hi: "पुरानी कर व्यवस्था के तहत बीमा से आप कितना कर बचा सकते हैं। ये सामान्य भारतीय परिवार प्रोफ़ाइल पर आधारित वास्तविक उदाहरण हैं।",
      hinglish: "Old Tax Regime ke tahat insurance se aap kitna tax bacha sakte hain. Yeh common Indian family profiles par aadharit real examples hain."
    },
    example1Title: { en: "Example 1: Young Professional (Age 30)", hi: "उदाहरण 1: युवा पेशेवर (आयु 30)", hinglish: "Example 1: Young Professional (Age 30)" },
    example1Income: { en: "Annual Income: ₹12,00,000 · Tax Slab: 30%", hi: "वार्षिक आय: ₹12,00,000 · कर स्लैब: 30%", hinglish: "Annual Income: ₹12,00,000 · Tax Slab: 30%" },
    example1Items: [
      { section: "80C", desc: { en: "Life Insurance Premium (LIC Term Plan)", hi: "जीवन बीमा प्रीमियम (LIC टर्म प्लान)", hinglish: "Life Insurance Premium (LIC Term Plan)" }, amount: "₹25,000" },
      { section: "80C", desc: { en: "EPF Contribution + PPF", hi: "EPF योगदान + PPF", hinglish: "EPF Contribution + PPF" }, amount: "₹1,25,000" },
      { section: "80D", desc: { en: "Health Insurance (Self + Spouse)", hi: "स्वास्थ्य बीमा (स्वयं + पति/पत्नी)", hinglish: "Health Insurance (Self + Spouse)" }, amount: "₹22,000" },
      { section: "80D", desc: { en: "Health Insurance (Parents, below 60)", hi: "स्वास्थ्य बीमा (माता-पिता, 60 से कम)", hinglish: "Health Insurance (Parents, below 60)" }, amount: "₹18,000" },
    ],
    totalDeductions: { en: "Total Deductions", hi: "कुल कटौती", hinglish: "Total Deductions" },
    example1Total: "₹1,50,000 (80C) + ₹40,000 (80D)",
    taxSaved: { en: "Tax Saved:", hi: "कर बचत:", hinglish: "Tax Saved:" },
    example1Saved: "₹57,000 (at 30% slab)",

    example2Title: { en: "Example 2: Family with Senior Citizen Parents", hi: "उदाहरण 2: वरिष्ठ नागरिक माता-पिता वाला परिवार", hinglish: "Example 2: Family with Senior Citizen Parents" },
    example2Income: { en: "Annual Income: ₹18,00,000 · Tax Slab: 30%", hi: "वार्षिक आय: ₹18,00,000 · कर स्लैब: 30%", hinglish: "Annual Income: ₹18,00,000 · Tax Slab: 30%" },
    example2Items: [
      { section: "80C", desc: { en: "Life Insurance Premium (Term + Endowment)", hi: "जीवन बीमा प्रीमियम (टर्म + एंडोमेंट)", hinglish: "Life Insurance Premium (Term + Endowment)" }, amount: "₹1,20,000" },
      { section: "80C", desc: { en: "ELSS + EPF", hi: "ELSS + EPF", hinglish: "ELSS + EPF" }, amount: "₹30,000" },
      { section: "80D", desc: { en: "Health Insurance (Self + Family)", hi: "स्वास्थ्य बीमा (स्वयं + परिवार)", hinglish: "Health Insurance (Self + Family)" }, amount: "₹25,000" },
      { section: "80D", desc: { en: "Health Insurance (Senior Citizen Parents)", hi: "स्वास्थ्य बीमा (वरिष्ठ नागरिक माता-पिता)", hinglish: "Health Insurance (Senior Citizen Parents)" }, amount: "₹50,000" },
      { section: "80DDB", desc: { en: "Medical Treatment (Parent, Specified Disease)", hi: "चिकित्सा उपचार (माता/पिता, निर्दिष्ट बीमारी)", hinglish: "Medical Treatment (Parent, Specified Disease)" }, amount: "₹60,000" },
    ],
    example2Total: "₹1,50,000 (80C) + ₹75,000 (80D) + ₹60,000 (80DDB)",
    example2Saved: "₹85,500 (at 30% slab)",

    comparisonTitle: { en: "Quick Comparison: No Insurance vs With Insurance", hi: "त्वरित तुलना: बीमा के बिना vs बीमा के साथ", hinglish: "Quick Comparison: No Insurance vs With Insurance" },
    comparisonHeaders: {
      scenario: { en: "Scenario", hi: "परिदृश्य", hinglish: "Scenario" },
      noInsurance: { en: "No Insurance", hi: "बीमा नहीं", hinglish: "No Insurance" },
      withInsurance: { en: "With Insurance", hi: "बीमा के साथ", hinglish: "With Insurance" },
      taxSaved: { en: "Tax Saved", hi: "कर बचत", hinglish: "Tax Saved" },
    },
    comparisonDisclaimer: {
      en: "* Tax savings calculated under Old Regime. Actual savings depend on individual tax slab and applicable surcharge/cess.",
      hi: "* पुरानी व्यवस्था के तहत कर बचत की गणना। वास्तविक बचत व्यक्तिगत कर स्लैब और लागू अधिभार/उपकर पर निर्भर है।",
      hinglish: "* Tax savings Old Regime ke tahat calculate ki gayi. Actual savings individual tax slab aur applicable surcharge/cess par nirbhar hain."
    },
  },
  disclaimer: {
    heading: { en: "7. Important Disclaimers", hi: "7. महत्वपूर्ण अस्वीकरण", hinglish: "7. Important Disclaimers" },
    solicitation: { en: "Insurance is the subject matter of solicitation.", hi: "बीमा प्रार्थना का विषय है।", hinglish: "Insurance is the subject matter of solicitation." },
    items: [
      {
        title: { en: "Tax Laws Are Subject to Change", hi: "कर कानून परिवर्तन के अधीन हैं", hinglish: "Tax Laws Are Subject to Change" },
        desc: { en: "Tax deductions, limits, and conditions mentioned on this page are based on the Income Tax Act, 1961 as amended up to Finance Act 2024. The Government of India may change these provisions in future budgets. Always verify current limits before filing.", hi: "इस पृष्ठ पर उल्लिखित कर कटौती, सीमाएं और शर्तें आयकर अधिनियम, 1961 पर आधारित हैं। भारत सरकार भविष्य के बजट में इन प्रावधानों को बदल सकती है।", hinglish: "Is page par ullikhit tax deductions, limits aur conditions Income Tax Act, 1961 par aadharit hain. Government of India future budgets mein in pradhaavon ko badal sakti hai." },
      },
      {
        title: { en: "Not Professional Tax Advice", hi: "पेशेवर कर सलाह नहीं", hinglish: "Not Professional Tax Advice" },
        desc: { en: "The information provided on this page is for educational and informational purposes only. It does not constitute professional tax, legal, or financial advice. Please consult a qualified Chartered Accountant (CA) or tax advisor for personalized tax planning.", hi: "इस पृष्ठ पर दी गई जानकारी केवल शैक्षिक और सूचनात्मक उद्देश्यों के लिए है। यह पेशेवर कर, कानूनी या वित्तीय सलाह नहीं है। व्यक्तिगत कर नियोजन के लिए योग्य CA से परामर्श करें।", hinglish: "Is page par di gayi jankaari keval shaikshik aur suchanatmak uddeshyon ke liye hai. Yeh professional tax, legal ya financial advice nahi hai. Personalized tax planning ke liye qualified CA se paramarsh karein." },
      },
      {
        title: { en: "Individual Tax Slab Matters", hi: "व्यक्तिगत कर स्लैब मायने रखता है", hinglish: "Individual Tax Slab Matters" },
        desc: { en: "Tax savings depend on your applicable income tax slab rate. A person in the 5% slab saves less than someone in the 30% slab for the same deduction amount. Calculate your actual savings based on your slab.", hi: "कर बचत आपकी लागू आयकर स्लैब दर पर निर्भर है। 5% स्लैब वाला व्यक्ति 30% स्लैब वाले व्यक्ति से कम बचाता है। अपनी स्लैब के आधार पर वास्तविक बचत की गणना करें।", hinglish: "Tax savings aapki laagu income tax slab rate par nirbhar hain. 5% slab wala vyakti 30% slab wale vyakti se kam bachata hai. Apni slab ke aadhar par actual savings calculate karein." },
      },
      {
        title: { en: "Old vs New Tax Regime", hi: "पुरानी vs नई कर व्यवस्था", hinglish: "Old vs New Tax Regime" },
        desc: { en: "Most insurance-based deductions (80C, 80CCC) are available only under the Old Tax Regime. Section 80D deductions for health insurance are available under the New Regime from FY 2025-26. Choose your regime wisely based on your total deductions.", hi: "अधिकांश बीमा-आधारित कटौतियां (80C, 80CCC) केवल पुरानी कर व्यवस्था के तहत उपलब्ध हैं। धारा 80D नई व्यवस्था में FY 2025-26 से उपलब्ध है। अपनी कुल कटौतियों के आधार पर समझदारी से चुनें।", hinglish: "Most insurance-based deductions (80C, 80CCC) keval Old Tax Regime ke tahat uplabdh hain. Section 80D New Regime mein FY 2025-26 se uplabdh hai. Apni total deductions ke aadhar par samjhdari se chunein." },
      },
      {
        title: { en: "Premium Must Be Actually Paid", hi: "प्रीमियम वास्तव में चुकाया जाना चाहिए", hinglish: "Premium Must Be Actually Paid" },
        desc: { en: "Deduction is available only for premiums actually paid during the financial year. Unpaid or pending premiums do not qualify. The payment must be made by the policyholder for the policyholder, spouse, or children.", hi: "कटौती केवल वित्तीय वर्ष के दौरान वास्तव में चुकाए गए प्रीमियम के लिए उपलब्ध है। अवैतनिक या लंबित प्रीमियम पात्र नहीं हैं।", hinglish: "Deduction keval financial year ke dauran vaastav mein chukaye gaye premium ke liye uplabdh hai. Unpaid ya pending premiums paatra nahi hain." },
      },
    ],
    irdaiTitle: { en: "Paliwal Secure AI — IRDAI Registered POSP", hi: "पालीवाल सिक्योर AI — IRDAI पंजीकृत POSP", hinglish: "Paliwal Secure AI — IRDAI Registered POSP" },
    irdaiDesc: {
      en: "All insurance recommendations and tax-saving guidance provided on this platform comply with IRDAI regulations.",
      hi: "इस प्लेटफ़ॉर्म पर दी गई सभी बीमा सिफारिशें और कर-बचत मार्गदर्शन IRDAI विनियमों का पालन करते हैं।",
      hinglish: "Is platform par di gayi saari insurance recommendations aur tax-saving guidance IRDAI regulations ka palan karti hain."
    },
  },
  cta: {
    badge: { en: "Trusted by 500+ Indian Families", hi: "500+ भारतीय परिवारों का भरोसा", hinglish: "Trusted by 500+ Indian Families" },
    heading1: { en: "Save Tax with the", hi: "कर बचाएं", hinglish: "Save Tax with the" },
    headingHighlight: { en: "Right Insurance Plan", hi: "सही बीमा योजना", hinglish: "Right Insurance Plan" },
    description: {
      en: "Get AI-powered recommendations for tax-saving insurance plans. Compare 51+ insurers, maximize your deductions under 80C, 80D, 80CCC & 80DDB.",
      hi: "कर-बचत बीमा योजनाओं के लिए AI-संचालित सिफारिशें प्राप्त करें। 51+ बीमाकर्ताओं की तुलना करें, 80C, 80D, 80CCC और 80DDB के तहत अपनी कटौती को अधिकतम करें।",
      hinglish: "Tax-saving insurance plans ke liye AI-powered recommendations paayein. 51+ insurers compare karein, 80C, 80D, 80CCC & 80DDB ke tahat apni deductions maximize karein."
    },
    ctaCompare: { en: "Compare & Save Tax", hi: "तुलना करें और कर बचाएं", hinglish: "Compare & Save Tax" },
    ctaWhatsApp: { en: "WhatsApp Us", hi: "WhatsApp करें", hinglish: "WhatsApp Us" },
    trustLine: { en: "✓ Free Consultation · ✓ No Obligation · ✓ Same Premium as Insurer · ✓ IRDAI Registered POSP (IP429834)", hi: "✓ मुफ़्त परामर्श · ✓ कोई दायित्व नहीं · ✓ बीमाकर्ता जैसा ही प्रीमियम · ✓ IRDAI पंजीकृत POSP (IP429834)", hinglish: "✓ Free Consultation · ✓ No Obligation · ✓ Same Premium as Insurer · ✓ IRDAI Registered POSP (IP429834)" },
  },
  contact: {
    badge: { en: "Need Help with Tax Planning?", hi: "कर नियोजन में मदद चाहिए?", hinglish: "Need Help with Tax Planning?" },
    heading1: { en: "Talk to Our", hi: "हमसे बात करें", hinglish: "Talk to Our" },
    headingHighlight: { en: "Insurance Advisor", hi: "बीमा सलाहकार", hinglish: "Insurance Advisor" },
    whatsapp: { en: "WhatsApp", hi: "WhatsApp", hinglish: "WhatsApp" },
    whatsappAvail: { en: "24/7 Available", hi: "24/7 उपलब्ध", hinglish: "24/7 Available" },
    email: { en: "Email", hi: "ईमेल", hinglish: "Email" },
    emailAvail: { en: "Response within 24hrs", hi: "24 घंटे में जवाब", hinglish: "Response within 24hrs" },
    location: { en: "Location", hi: "स्थान", hinglish: "Location" },
    irdaiTitle: { en: "IRDAI Registration Details", hi: "IRDAI पंजीकरण विवरण", hinglish: "IRDAI Registration Details" },
    irdaiDesc: {
      en: "Paliwal Secure AI is an IRDAI-registered insurance intermediary.",
      hi: "पालीवाल सिक्योर AI एक IRDAI-पंजीकृत बीमा मध्यस्थ है।",
      hinglish: "Paliwal Secure AI ek IRDAI-registered insurance intermediary hai."
    },
  },
};

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

// ── TOC icons mapping ─────────────────────────────────────────────────────
const tocIcons = [Heart, Shield, PiggyBank, Stethoscope, FileText, Calculator, AlertTriangle];

export default function TaxSavingPage() {
  const { language } = useLanguage();
  const tr = useCallback((obj: Tr) => obj[language as keyof Tr] || obj.en, [language]);

  return (
    <>
      {/* ═══════════════════ PAGE HEADER ═══════════════════ */}
      <section
        className="relative overflow-hidden py-14 md:py-20"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${DARK_NAVY} 50%, #082247 100%)` }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-white/50 mb-5">
            <Link href="/" className="hover:text-white transition-colors">{tr(pageText.breadcrumb.home)}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80">{tr(pageText.breadcrumb.current)}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 badge-shimmer"
            style={{ background: 'rgba(212,160,23,0.15)', color: GOLD, border: `1px solid rgba(212,160,23,0.3)` }}>
            <Shield className="w-3.5 h-3.5" />
            {tr(pageText.hero.badge)}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {tr(pageText.hero.title)}
          </h1>
          <p className="text-xl sm:text-2xl font-bold mb-3" style={{ color: GOLD }}>
            {tr(pageText.hero.titleHighlight)}
          </p>
          <p className="text-white/60 max-w-2xl mx-auto mb-4">
            {tr(pageText.hero.description)}
          </p>
          <p className="text-xs font-medium text-white/50">
            {tr(pageText.hero.lastUpdated)}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/compare">
              <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span>{tr(pageText.hero.ctaCompare)}</span>
              </ShinyButton>
            </Link>
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span>{tr(pageText.hero.ctaWhatsApp)}</span>
              </ShinyButton>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════ QUICK SAVINGS OVERVIEW ═══════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {pageText.overview.cards.map((item, i) => {
            const colors = ['#0E7C7B', NAVY, DARK_NAVY, '#8B6914'];
            return (
              <div key={i} className="glass-card p-4 sm:p-5 text-center hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white text-xs font-bold mb-2"
                  style={{ background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}cc)` }}>
                  {item.section}
                </span>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{item.amount}</p>
                <p className="text-xs text-muted-foreground">{tr(item.desc)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ MAIN CONTENT + SIDEBAR ═══════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sticky Table of Contents ── */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="glass-card p-5">
                <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" style={{ color: GOLD }} /> {tr(pageText.toc.title)}
                </h3>
                <nav className="space-y-1">
                  {pageText.toc.sections.map((s, i) => {
                    const Icon = tocIcons[i];
                    return (
                      <a key={s.id} href={`#${s.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group">
                        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 group-hover:text-white transition-colors"
                          style={{ background: 'rgba(11,43,91,0.08)', color: NAVY }}>
                          {i + 1}
                        </span>
                        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD, opacity: 0.6 }} />
                        <span className="truncate">{tr(s.title)}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* ── Content Sections ── */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* ═══ Section 1: Section 80D — Health Insurance ═══ */}
            <div id="section-80d" className="glass-card p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, #0E7C7B, #0B5E5D)` }}>
                  <Heart className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text">{tr(pageText.sec80d.heading)}</h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {tr(pageText.sec80d.description)}
              </p>

              {/* 80D Deduction Limits Table */}
              <div className="rounded-xl overflow-hidden mb-5" style={{ border: `1px solid rgba(11,43,91,0.1)` }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                        <th className="px-4 py-3 text-left text-white font-semibold">{tr(pageText.sec80d.tableHeaders.who)}</th>
                        <th className="px-4 py-3 text-center text-white font-semibold">{tr(pageText.sec80d.tableHeaders.age)}</th>
                        <th className="px-4 py-3 text-center text-white font-semibold">{tr(pageText.sec80d.tableHeaders.maxDeduction)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'rgba(11,43,91,0.08)' }}>
                      {pageText.sec80d.tableRows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-background' : ''} style={i % 2 !== 0 ? { background: 'rgba(11,43,91,0.03)' } : {}}>
                          <td className="px-4 py-3 text-foreground font-medium">{tr(row.who)}</td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{tr(row.age)}</td>
                          <td className="px-4 py-3 text-center font-bold" style={{ color: NAVY }}>{row.max}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Maximum combined example */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.2)' }}>
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color: '#0E7C7B' }}>
                  <TrendingDown className="w-4 h-4" style={{ color: GOLD }} />
                  {tr(pageText.sec80d.maxDeductionTitle)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {tr(pageText.sec80d.maxDeductionDesc)}
                </p>
              </div>

              {/* Key Points */}
              <div className="mt-5 space-y-2">
                {pageText.sec80d.keyPoints.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                    <p className="text-sm text-muted-foreground">{tr(item)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ Section 2: Section 80C — Life Insurance ═══ */}
            <div id="section-80c" className="glass-card p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                  <Shield className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text">{tr(pageText.sec80c.heading)}</h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {tr(pageText.sec80c.description)}
              </p>

              {/* Key details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {pageText.sec80c.cards.map((item, i) => {
                  const icons = [IndianRupee, Users, Receipt, Clock];
                  const Icon = icons[i];
                  return (
                    <div key={i} className="rounded-xl p-4 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ background: 'rgba(11,43,91,0.04)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" style={{ color: GOLD }} />
                        <h3 className="text-sm font-semibold text-foreground">{tr(item.title)}</h3>
                      </div>
                      <p className="text-lg font-bold mb-1" style={{ color: NAVY }}>
                        {typeof item.value === 'string' ? item.value : tr(item.value as Tr)}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">{tr(item.desc)}</p>
                    </div>
                  );
                })}
              </div>

              {/* What qualifies under 80C */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.08)', border: `1px solid rgba(212,160,23,0.2)` }}>
                <p className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: NAVY }}>
                  <Info className="w-4 h-4" style={{ color: GOLD }} />
                  {tr(pageText.sec80c.includesTitle)}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {tr(pageText.sec80c.includesDesc)}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pageText.sec80c.includesItems.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
                      style={{ background: 'rgba(11,43,91,0.06)', color: NAVY }}>
                      <CheckCircle2 className="w-3 h-3" style={{ color: GOLD }} /> {tr(item)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ Section 3: Section 80CCC — Pension Plans ═══ */}
            <div id="section-80ccc" className="glass-card p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${DARK_NAVY}, #1E3A5F)` }}>
                  <PiggyBank className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text">{tr(pageText.sec80ccc.heading)}</h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {tr(pageText.sec80ccc.description)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {pageText.sec80ccc.cards.map((item, i) => {
                  const icons = [Banknote, Calculator, IndianRupee, AlertTriangle];
                  const Icon = icons[i];
                  return (
                    <div key={i} className="rounded-xl p-4 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ background: 'rgba(11,43,91,0.04)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" style={{ color: GOLD }} />
                        <h3 className="text-sm font-semibold text-foreground">{tr(item.title)}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{tr(item.desc)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.08)', border: `1px solid rgba(212,160,23,0.2)` }}>
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color: NAVY }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: GOLD }} /> {tr(pageText.sec80ccc.importantNoteTitle)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {tr(pageText.sec80ccc.importantNote)}
                </p>
              </div>
            </div>

            {/* ═══ Section 4: Section 80DDB — Medical Treatment ═══ */}
            <div id="section-80ddb" className="glass-card p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, #8B6914, #6B4F10)` }}>
                  <Stethoscope className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text">{tr(pageText.sec80ddb.heading)}</h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {tr(pageText.sec80ddb.description)}
              </p>

              {/* Deduction limits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="rounded-xl p-5" style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                  <p className="text-xs text-white/60 mb-1">{tr(pageText.sec80ddb.below60)}</p>
                  <p className="text-3xl font-bold text-white mb-1">₹40,000</p>
                  <p className="text-xs" style={{ color: GOLD }}>{tr(pageText.sec80ddb.maxDeductionLabel)}</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: 'rgba(212,160,23,0.12)', border: `1px solid rgba(212,160,23,0.3)` }}>
                  <p className="text-xs text-muted-foreground mb-1">{tr(pageText.sec80ddb.seniorCitizen)}</p>
                  <p className="text-3xl font-bold" style={{ color: NAVY }}>₹1,00,000</p>
                  <p className="text-xs" style={{ color: GOLD }}>{tr(pageText.sec80ddb.maxDeductionLabel)}</p>
                </div>
              </div>

              {/* Specified diseases */}
              <div className="rounded-xl p-5 mb-5" style={{ background: 'rgba(11,43,91,0.04)' }}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" style={{ color: GOLD }} />
                  {tr(pageText.sec80ddb.diseasesTitle)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pageText.sec80ddb.diseases.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.5)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
                      <span className="text-sm text-foreground">{tr(d)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important points */}
              <div className="space-y-2">
                {pageText.sec80ddb.keyPoints.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                    <p className="text-sm text-muted-foreground">{tr(item)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ Section 5: How to Claim Deductions ═══ */}
            <div id="how-to-claim" className="glass-card p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                  <FileText className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text">{tr(pageText.howToClaim.heading)}</h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-5">
                {tr(pageText.howToClaim.description)}
              </p>

              {/* Steps */}
              <div className="space-y-4 mb-5">
                {pageText.howToClaim.steps.map((item, i) => {
                  const icons = [Receipt, CheckCircle2, FileText, Clock];
                  return (
                    <div key={i} className="rounded-xl p-4 sm:p-5 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ background: 'rgba(11,43,91,0.04)', border: '1px solid rgba(11,43,91,0.08)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                          {i + 1}
                        </span>
                        <h3 className="font-bold text-foreground text-sm sm:text-base">{tr(item.title)}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 ml-11">{tr(item.desc)}</p>
                    </div>
                  );
                })}
              </div>

              {/* New vs Old Tax Regime */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(212,160,23,0.08)', border: `1px solid rgba(212,160,23,0.25)` }}>
                <p className="text-sm font-semibold flex items-center gap-2 mb-2" style={{ color: NAVY }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: GOLD }} />
                  {tr(pageText.howToClaim.regimeTitle)}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {tr(pageText.howToClaim.oldRegime)}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {tr(pageText.howToClaim.newRegime)}
                </p>
              </div>
            </div>

            {/* ═══ Section 6: Tax Calculator Examples ═══ */}
            <div id="tax-calculator" className="glass-card p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                  <Calculator className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text">{tr(pageText.taxCalc.heading)}</h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-5">
                {tr(pageText.taxCalc.description)}
              </p>

              {/* Example 1 */}
              <div className="rounded-xl p-5 mb-5" style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5" style={{ color: GOLD }} />
                  <h3 className="font-bold text-white">{tr(pageText.taxCalc.example1Title)}</h3>
                </div>
                <p className="text-xs text-white/60 mb-4">{tr(pageText.taxCalc.example1Income)}</p>

                <div className="space-y-2 mb-4">
                  {pageText.taxCalc.example1Items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[10px] font-bold text-white"
                          style={{ background: item.section === '80C' ? 'rgba(11,43,91,0.5)' : 'rgba(14,124,123,0.5)' }}>
                          {item.section}
                        </span>
                        <span className="text-sm text-white/80">{tr(item.desc)}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{item.amount}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(212,160,23,0.15)', border: `1px solid rgba(212,160,23,0.3)` }}>
                  <div>
                    <p className="text-sm font-bold text-white">{tr(pageText.taxCalc.totalDeductions)}</p>
                    <p className="text-xs text-white/60">{pageText.taxCalc.example1Total}</p>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: GOLD }}>₹1,90,000</span>
                </div>

                <div className="mt-3 px-4 py-2 rounded-lg" style={{ background: 'rgba(37,211,102,0.1)' }}>
                  <p className="text-sm text-white">
                    <strong>{tr(pageText.taxCalc.taxSaved)}</strong> {pageText.taxCalc.example1Saved}
                  </p>
                </div>
              </div>

              {/* Example 2 */}
              <div className="rounded-xl p-5 mb-5" style={{ background: 'rgba(212,160,23,0.06)', border: `1px solid rgba(212,160,23,0.2)` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5" style={{ color: GOLD }} />
                  <h3 className="font-bold text-foreground">{tr(pageText.taxCalc.example2Title)}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{tr(pageText.taxCalc.example2Income)}</p>

                <div className="space-y-2 mb-4">
                  {pageText.taxCalc.example2Items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.6)' }}>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[10px] font-bold text-white"
                          style={{ background: item.section === '80C' ? NAVY : item.section === '80D' ? '#0E7C7B' : '#8B6914' }}>
                          {item.section}
                        </span>
                        <span className="text-sm text-foreground">{tr(item.desc)}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: NAVY }}>{item.amount}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                  <div>
                    <p className="text-sm font-bold text-white">{tr(pageText.taxCalc.totalDeductions)}</p>
                    <p className="text-xs text-white/60">{pageText.taxCalc.example2Total}</p>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: GOLD }}>₹2,85,000</span>
                </div>

                <div className="mt-3 px-4 py-2 rounded-lg" style={{ background: 'rgba(37,211,102,0.08)' }}>
                  <p className="text-sm text-foreground">
                    <strong>{tr(pageText.taxCalc.taxSaved)}</strong> {pageText.taxCalc.example2Saved}
                  </p>
                </div>
              </div>

              {/* Example 3 - Quick comparison */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(11,43,91,0.04)' }}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" style={{ color: GOLD }} />
                  {tr(pageText.taxCalc.comparisonTitle)}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                        <th className="px-4 py-2 text-left text-white font-semibold text-xs">{tr(pageText.taxCalc.comparisonHeaders.scenario)}</th>
                        <th className="px-4 py-2 text-center text-white font-semibold text-xs">{tr(pageText.taxCalc.comparisonHeaders.noInsurance)}</th>
                        <th className="px-4 py-2 text-center text-white font-semibold text-xs">{tr(pageText.taxCalc.comparisonHeaders.withInsurance)}</th>
                        <th className="px-4 py-2 text-center text-white font-semibold text-xs">{tr(pageText.taxCalc.comparisonHeaders.taxSaved)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'rgba(11,43,91,0.08)' }}>
                      {[
                        { scenario: '₹8L Income (10% slab)', no: '₹0', yes: '₹25,000', saved: '₹2,500' },
                        { scenario: '₹12L Income (15-20% slab)', no: '₹0', yes: '₹1,50,000', saved: '₹22,500' },
                        { scenario: '₹18L Income (30% slab)', no: '₹0', yes: '₹2,85,000', saved: '₹85,500' },
                        { scenario: '₹25L Income (30% slab + cess)', no: '₹0', yes: '₹2,85,000', saved: '₹88,920' },
                      ].map((row, i) => (
                        <tr key={i} style={i % 2 !== 0 ? { background: 'rgba(11,43,91,0.03)' } : {}}>
                          <td className="px-4 py-2 text-foreground font-medium text-xs">{row.scenario}</td>
                          <td className="px-4 py-2 text-center text-muted-foreground text-xs">{row.no}</td>
                          <td className="px-4 py-2 text-center font-bold text-xs" style={{ color: '#0E7C7B' }}>{row.yes}</td>
                          <td className="px-4 py-2 text-center font-bold text-xs" style={{ color: NAVY }}>{row.saved}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs italic mt-2" style={{ color: GOLD }}>
                  {tr(pageText.taxCalc.comparisonDisclaimer)}
                </p>
              </div>
            </div>

            {/* ═══ Section 7: Important Disclaimers ═══ */}
            <div id="disclaimer" className="glass-card p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text">{tr(pageText.disclaimer.heading)}</h2>
                </div>
              </div>

              {/* Prominent disclaimer box */}
              <div className="rounded-xl p-5 mb-5 text-center"
                style={{
                  background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})`,
                  border: `2px solid ${GOLD}`,
                  boxShadow: `0 0 30px rgba(212,160,23,0.1)`,
                }}>
                <Shield className="w-10 h-10 mx-auto mb-3" style={{ color: GOLD }} />
                <p className="text-lg sm:text-xl font-bold text-white mb-2">
                  &ldquo;{tr(pageText.disclaimer.solicitation)}&rdquo;
                </p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(212,160,23,0.2)', color: GOLD, border: `1px solid rgba(212,160,23,0.4)` }}>
                  <BadgeCheck className="w-3.5 h-3.5" /> POSP Code: IP429834
                </span>
              </div>

              <div className="space-y-4">
                {pageText.disclaimer.items.map((item, i) => (
                  <div key={i} className="rounded-xl p-4 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ background: 'rgba(11,43,91,0.04)' }}>
                    <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                      {tr(item.title)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">{tr(item.desc)}</p>
                  </div>
                ))}
              </div>

              {/* IRDAI Registration */}
              <div className="mt-5 rounded-xl p-5 text-center" style={{ background: 'rgba(11,43,91,0.04)' }}>
                <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: GOLD }} />
                <p className="text-sm font-semibold text-foreground mb-1">
                  {tr(pageText.disclaimer.irdaiTitle)}
                </p>
                <p className="text-xs font-mono font-bold mb-2" style={{ color: NAVY }}>
                  POSP Code: IP429834
                </p>
                <p className="text-xs text-muted-foreground">
                  {tr(pageText.disclaimer.irdaiDesc)}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section className="relative py-16 md:py-20 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${DARK_NAVY} 50%, #082247 100%)` }}>
        <div className="absolute top-5 right-[20%] w-40 h-40 rounded-full opacity-10" style={{ background: GOLD, filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 badge-shimmer"
            style={{ background: 'rgba(212,160,23,0.15)', color: GOLD, border: `1px solid rgba(212,160,23,0.3)` }}>
            <Award className="w-3.5 h-3.5" /> {tr(pageText.cta.badge)}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
            {tr(pageText.cta.heading1)} <span style={{ color: GOLD }}>{tr(pageText.cta.headingHighlight)}</span>
          </h2>
          <p className="text-white/60 mb-8">
            {tr(pageText.cta.description)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/compare">
              <ShinyButton variant="blue" className="rounded-xl px-8 py-4 text-lg">
                <span>{tr(pageText.cta.ctaCompare)}</span>
              </ShinyButton>
            </Link>
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary" className="rounded-xl px-8 py-4 text-lg">
                <span className="flex items-center gap-2"><MessageCircle className="w-5 h-5" /> {tr(pageText.cta.ctaWhatsApp)}</span>
              </ShinyButton>
            </a>
          </div>

          <p className="text-xs text-white/55 mt-6">
            {tr(pageText.cta.trustLine)}
          </p>
        </div>
      </section>

      {/* ═══════════════════ CONTACT SECTION ═══════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 badge-shimmer"
            style={{ background: 'rgba(11,43,91,0.08)', color: NAVY }}>
            <MessageCircle className="w-3.5 h-3.5" /> {tr(pageText.contact.badge)}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {tr(pageText.contact.heading1)} <span className="gradient-text">{tr(pageText.contact.headingHighlight)}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {/* WhatsApp */}
          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"
            className="glass-card p-6 text-center group cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-foreground mb-1">{tr(pageText.contact.whatsapp)}</h3>
            <p className="text-sm" style={{ color: GOLD }}>+91 9257877312</p>
            <p className="text-xs text-muted-foreground mt-1">{tr(pageText.contact.whatsappAvail)}</p>
          </a>

          {/* Email */}
          <a href="mailto:himanshupaliwalpbp@gmail.com"
            className="glass-card p-6 text-center group cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-foreground mb-1">{tr(pageText.contact.email)}</h3>
            <p className="text-sm" style={{ color: GOLD }}>himanshupaliwalpbp@gmail.com</p>
            <p className="text-xs text-muted-foreground mt-1">{tr(pageText.contact.emailAvail)}</p>
          </a>

          {/* Location */}
          <div className="glass-card p-6 text-center group hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${DARK_NAVY}, #1E3A5F)` }}>
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-foreground mb-1">{tr(pageText.contact.location)}</h3>
            <p className="text-sm" style={{ color: GOLD }}>Kota, Rajasthan</p>
            <p className="text-xs text-muted-foreground mt-1">India</p>
          </div>
        </div>

        {/* IRDAI Registration Notice */}
        <div className="mt-8 max-w-3xl mx-auto rounded-2xl p-5 text-center"
          style={{ background: 'rgba(212,160,23,0.08)', border: `1px solid rgba(212,160,23,0.25)` }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5" style={{ color: GOLD }} />
            <span className="font-bold text-foreground">{tr(pageText.contact.irdaiTitle)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {tr(pageText.contact.irdaiDesc)}
          </p>
          <p className="text-xs font-mono font-semibold mt-2" style={{ color: NAVY }}>
            POSP Code: IP429834
          </p>
        </div>
      </section>
    </>
  );
}
