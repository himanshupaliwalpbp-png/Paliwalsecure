export type Language = 'en' | 'hi' | 'hinglish';

// Re-export the React hook from i18n.tsx for components
export { useLanguage, LanguageProvider } from './i18n.tsx';

type TranslationEntry = {
  en: string;
  hi: string;
  hinglish: string;
};

type TranslationMap = Record<string, TranslationEntry>;

// Import the comprehensive translations from i18n-strings
import { translations as extraTranslations } from './i18n-strings';

export const translations: TranslationMap = {
  // ── Navigation ──────────────────────────────────────────────────────────
  'nav.home': {
    en: 'Home',
    hi: 'होम',
    hinglish: 'Home',
  },
  'nav.gyaan': {
    en: 'Knowledge',
    hi: 'ज्ञान',
    hinglish: 'Gyaan',
  },
  'nav.chat': {
    en: 'Chat',
    hi: 'चैट',
    hinglish: 'Chat',
  },
  'nav.plans': {
    en: 'Plans',
    hi: 'योजनाएँ',
    hinglish: 'Plans',
  },
  'nav.call': {
    en: 'Call',
    hi: 'कॉल',
    hinglish: 'Call',
  },
  'nav.getQuote': {
    en: 'Get Quote',
    hi: 'कोटेशन लें',
    hinglish: 'Quote Lo',
  },
  'nav.aiSujhav': {
    en: 'AI Recommendations',
    hi: 'AI सुझाव',
    hinglish: 'AI Sujhav',
  },
  'nav.insureGyaan': {
    en: 'Insurance Knowledge',
    hi: 'बीमा ज्ञान',
    hinglish: 'InsureGyaan',
  },
  'nav.insureGPT': {
    en: 'Insurance Chat',
    hi: 'बीमा चैट',
    hinglish: 'InsureGPT',
  },
  'nav.calculators': {
    en: 'Calculators',
    hi: 'कैलकुलेटर',
    hinglish: 'Calculators',
  },
  'nav.quiz': {
    en: 'Quiz',
    hi: 'क्विज़',
    hinglish: 'Quiz',
  },
  'nav.compare': {
    en: 'Compare',
    hi: 'तुलना',
    hinglish: 'Compare',
  },
  'nav.whatsapp': {
    en: 'WhatsApp',
    hi: 'व्हाट्सएप',
    hinglish: 'WhatsApp',
  },
  'nav.claimsDashboard': {
    en: 'Claims Dashboard',
    hi: 'क्लेम डैशबोर्ड',
    hinglish: 'Claims Dashboard',
  },
  'nav.industryInsights': {
    en: 'Industry Insights',
    hi: 'उद्योग अंतर्दृष्टि',
    hinglish: 'Industry Insights',
  },
  'nav.contact': {
    en: 'Contact',
    hi: 'संपर्क',
    hinglish: 'Contact',
  },
  'nav.coverageScore': {
    en: 'Coverage Score',
    hi: 'कवरेज स्कोर',
    hinglish: 'Coverage Score',
  },
  'nav.rights': {
    en: 'Your Rights',
    hi: 'आपके अधिकार',
    hinglish: 'Your Rights',
  },
  'nav.getBestPlan': {
    en: 'Get Best Plan',
    hi: 'सर्वोत्तम योजना प्राप्त करें',
    hinglish: 'Best Plan Lo',
  },
  'nav.blog': {
    en: 'Blog',
    hi: 'ब्लॉग',
    hinglish: 'Blog',
  },
  'nav.hubs': {
    en: 'Hubs',
    hi: 'हब',
    hinglish: 'Hubs',
  },
  'nav.healthInsurance': {
    en: 'Health',
    hi: 'हेल्थ',
    hinglish: 'Health',
  },
  'nav.lifeInsurance': {
    en: 'Life',
    hi: 'लाइफ',
    hinglish: 'Life',
  },
  'nav.travelInsurance': {
    en: 'Travel',
    hi: 'ट्रैवल',
    hinglish: 'Travel',
  },
  'nav.homeInsurance': {
    en: 'Home',
    hi: 'होम',
    hinglish: 'Home',
  },
  'nav.calculator': {
    en: 'Calculator',
    hi: 'कैलकुलेटर',
    hinglish: 'Calculator',
  },
  'nav.claims': {
    en: 'Claims',
    hi: 'क्लेम',
    hinglish: 'Claims',
  },
  'nav.instagram': {
    en: 'Insta',
    hi: 'इंस्टा',
    hinglish: 'Insta',
  },
  'nav.faq': {
    en: 'FAQ',
    hi: 'सवाल-जवाब',
    hinglish: 'FAQ',
  },

  // ── Hero Section ────────────────────────────────────────────────────────
  'hero.badge': {
    en: "India's Most Trusted Quick Adviser",
    hi: "भारत का सबसे विश्वसनीय Quick Adviser",
    hinglish: "India ka Most Trusted Quick Adviser",
  },
  'hero.title.line1': {
    en: 'AI se Best Plan.',
    hi: 'AI से सर्वोत्तम योजना।',
    hinglish: 'AI se Best Plan.',
  },
  'hero.title.line2': {
    en: 'Humse Easy Claim.',
    hi: 'हमसे आसान क्लेम।',
    hinglish: 'Humse Easy Claim.',
  },
  'hero.subtitle': {
    en: 'Smart Insurance for Every Indian',
    hi: 'हर भारतीय के लिए स्मार्ट बीमा',
    hinglish: 'Smart Insurance for Every Indian',
  },
  'hero.description': {
    en: 'AI-powered recommendations from 51+ insurers — and we make the claim process easy.',
    hi: '51+ बीमाकर्ताओं से AI-संचालित सिफारिशें — और हम क्लेम प्रक्रिया आसान बनाते हैं।',
    hinglish: 'AI-powered recommendations 51+ insurers se — aur claim process hum aasan bana dete hain.',
  },
  'hero.cta.bestPlan': {
    en: 'Get My Best Plan',
    hi: 'मेरी सर्वोत्तम योजना प्राप्त करें',
    hinglish: 'Mera Best Plan Lo',
  },
  'hero.cta.talkExpert': {
    en: 'Talk to Expert',
    hi: 'विशेषज्ञ से बात करें',
    hinglish: 'Expert se Baat Karein',
  },
  'hero.stats.uninsured': {
    en: 'Uninsured',
    hi: 'अबीमित',
    hinglish: 'Uninsured',
  },
  'hero.stats.penetration': {
    en: 'Penetration',
    hi: 'प्रवेश दर',
    hinglish: 'Penetration',
  },
  'hero.stats.claimSettlement': {
    en: 'Claim Settlement',
    hi: 'क्लेम निपटान',
    hinglish: 'Claim Settlement',
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  'footer.tagline': {
    en: 'AI-powered insurance recommendations for every Indian',
    hi: 'हर भारतीय के लिए AI-संचालित बीमा सिफारिशें',
    hinglish: 'AI-powered insurance recommendations har Indian ke liye',
  },
  'footer.poweredBy': {
    en: 'Powered by',
    hi: 'संचालित द्वारा',
    hinglish: 'Powered by',
  },
  'footer.quickLinks': {
    en: 'Quick Links',
    hi: 'त्वरित लिंक',
    hinglish: 'Quick Links',
  },
  'footer.products': {
    en: 'Products',
    hi: 'उत्पाद',
    hinglish: 'Products',
  },
  'footer.compliance': {
    en: 'Compliance',
    hi: 'अनुपालन',
    hinglish: 'Compliance',
  },
  'footer.whatsapp': {
    en: 'Chat on WhatsApp',
    hi: 'व्हाट्सएप पर चैट करें',
    hinglish: 'WhatsApp pe Chat Karein',
  },
  'footer.instagram': {
    en: 'Follow on Instagram',
    hi: 'इंस्टाग्राम पर फ़ॉलो करें',
    hinglish: 'Instagram pe Follow Karein',
  },
  'footer.rights': {
    en: 'All rights reserved.',
    hi: 'सर्वाधिकार सुरक्षित।',
    hinglish: 'All rights reserved.',
  },
  'footer.irdaiDisclaimer': {
    en: 'IRDAI Registered | Insurance is a subject matter of solicitation',
    hi: 'IRDAI पंजीकृत | बीमा एक प्रार्थना का विषय है',
    hinglish: 'IRDAI Registered | Insurance subject matter of solicitation hai',
  },

  // ── Section Headings ────────────────────────────────────────────────────
  'sections.tipOfDay': {
    en: 'Tip of the Day',
    hi: 'आज का सुझाव',
    hinglish: 'Tip of the Day',
  },
  'sections.insuranceQuiz': {
    en: 'Insurance Quiz',
    hi: 'बीमा क्विज़',
    hinglish: 'Insurance Quiz',
  },
  'sections.calculators': {
    en: 'Calculators',
    hi: 'कैलकुलेटर',
    hinglish: 'Calculators',
  },
  'sections.aiRecommendations': {
    en: 'AI Recommendations',
    hi: 'AI सिफारिशें',
    hinglish: 'AI Sujhav',
  },
  'sections.knowledgeBase': {
    en: 'Knowledge Base',
    hi: 'ज्ञानकोष',
    hinglish: 'Knowledge Base',
  },
  'sections.howItWorks': {
    en: 'How It Works',
    hi: 'यह कैसे काम करता है',
    hinglish: 'Kaise Kaam Karta Hai',
  },
  'sections.contactUs': {
    en: 'Contact Us',
    hi: 'हमसे संपर्क करें',
    hinglish: 'Contact Karein',
  },
  'sections.trustBar': {
    en: 'Trusted by families across India',
    hi: 'भारत भर में परिवारों का भरोसा',
    hinglish: 'Families ka bharosa across India',
  },
  'sections.categories': {
    en: 'Insurance Categories',
    hi: 'बीमा श्रेणियाँ',
    hinglish: 'Insurance Categories',
  },
  'sections.chooseProtection': {
    en: 'Choose Your Protection',
    hi: 'अपना संरक्षण चुनें',
    hinglish: 'Apna Protection Choose Karein',
  },
  'sections.claimStatus': {
    en: 'Claim Status',
    hi: 'क्लेम स्थिति',
    hinglish: 'Claim Status',
  },
  'sections.claimSimulator': {
    en: 'Claim Simulator',
    hi: 'क्लेम सिम्युलेटर',
    hinglish: 'Claim Simulator',
  },
  'sections.planComparison': {
    en: 'Plan Comparison',
    hi: 'योजना तुलना',
    hinglish: 'Plan Compare',
  },
  'sections.reviews': {
    en: 'Reviews',
    hi: 'समीक्षाएँ',
    hinglish: 'Reviews',
  },
  'sections.features': {
    en: 'Features',
    hi: 'विशेषताएँ',
    hinglish: 'Features',
  },
  'sections.productDiscovery': {
    en: 'Discover Insurance Products',
    hi: 'बीमा उत्पाद खोजें',
    hinglish: 'Insurance Products Discover Karein',
  },

  // ── Chat / InsureGPT ────────────────────────────────────────────────────
  'chat.onlineStatus': {
    en: 'Online • AI Insurance Advisor',
    hi: 'ऑनलाइन • AI बीमा सलाहकार',
    hinglish: 'Online • AI Insurance Advisor',
  },
  'chat.expertTalk': {
    en: 'Talk to an Expert',
    hi: 'विशेषज्ञ से बात करें',
    hinglish: 'Expert se Baat Karein',
  },
  'chat.irdaiCompliant': {
    en: 'IRDAI Compliant',
    hi: 'IRDAI अनुपालित',
    hinglish: 'IRDAI Compliant',
  },
  'chat.placeholder': {
    en: 'Ask me anything about insurance...',
    hi: 'बीमे के बारे में कुछ भी पूछें...',
    hinglish: 'Insurance ke baare mein kuch bhi poochiye...',
  },
  'chat.welcomeMessage': {
    en: 'Namaste! I am your AI insurance advisor. How can I help you today?',
    hi: 'नमस्ते! मैं आपका AI बीमा सलाहकार हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
    hinglish: 'Namaste! Main aapka AI insurance advisor hoon. Aaj main kaise madad kar sakta hoon?',
  },
  'chat.send': {
    en: 'Send',
    hi: 'भेजें',
    hinglish: 'Send',
  },
  'chat.thinking': {
    en: 'Thinking...',
    hi: 'सोच रहा हूँ...',
    hinglish: 'Soch raha hoon...',
  },

  // ── Common / Buttons ────────────────────────────────────────────────────
  'common.comparePlans': {
    en: 'Compare Plans',
    hi: 'योजनाएँ तुलना करें',
    hinglish: 'Plans Compare Karein',
  },
  'common.getQuote': {
    en: 'Get Quote',
    hi: 'कोटेशन लें',
    hinglish: 'Quote Lo',
  },
  'common.learnMore': {
    en: 'Learn More',
    hi: 'और जानें',
    hinglish: 'Aur Jaaniye',
  },
  'common.readMore': {
    en: 'Read More',
    hi: 'और पढ़ें',
    hinglish: 'Aur Padhiye',
  },
  'common.startNow': {
    en: 'Start Now',
    hi: 'अभी शुरू करें',
    hinglish: 'Abhi Start Karein',
  },
  'common.submit': {
    en: 'Submit',
    hi: 'जमा करें',
    hinglish: 'Submit',
  },
  'common.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें',
    hinglish: 'Cancel',
  },
  'common.loading': {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
    hinglish: 'Loading...',
  },
  'common.error': {
    en: 'Something went wrong',
    hi: 'कुछ गलत हो गया',
    hinglish: 'Kuch galat ho gaya',
  },
  'common.retry': {
    en: 'Retry',
    hi: 'पुनः प्रयास',
    hinglish: 'Retry',
  },
  'common.close': {
    en: 'Close',
    hi: 'बंद करें',
    hinglish: 'Close',
  },
  'common.save': {
    en: 'Save',
    hi: 'सहेजें',
    hinglish: 'Save',
  },
  'common.search': {
    en: 'Search',
    hi: 'खोजें',
    hinglish: 'Search',
  },
  'common.viewAll': {
    en: 'View All',
    hi: 'सभी देखें',
    hinglish: 'Sab Dekhein',
  },

  // ── How It Works Steps ──────────────────────────────────────────────────
  'howItWorks.step1.title': {
    en: 'Tell Your Needs',
    hi: 'अपनी ज़रूरतें बताएँ',
    hinglish: 'Apni Zarooratein Bataiye',
  },
  'howItWorks.step1.description': {
    en: 'Tell us about your family, budget, and needs — we will listen and understand',
    hi: 'अपने परिवार, बजट और ज़रूरतों के बारे में बताएँ — हम सुनेंगे और समझेंगे',
    hinglish: 'Apni family, budget aur zarooratein bataiye — hum sunenge aur samjhenge',
  },
  'howItWorks.step2.title': {
    en: 'Get Top 3 Plans',
    hi: 'शीर्ष 3 योजनाएँ प्राप्त करें',
    hinglish: 'Top 3 Plans Lo',
  },
  'howItWorks.step2.description': {
    en: 'AI compares 51+ insurers — top 3 plans with CSR, score, and price',
    hi: 'AI 51+ बीमाकर्ताओं की तुलना करता है — CSR, स्कोर और मूल्य के साथ शीर्ष 3 योजनाएँ',
    hinglish: 'AI 51+ insurers compare karta hai — CSR, score aur price ke saath top 3 plans',
  },
  'howItWorks.step3.title': {
    en: 'Buy or Consult',
    hi: 'खरीदें या सलाह लें',
    hinglish: 'Khareedein ya Salah Lein',
  },
  'howItWorks.step3.description': {
    en: 'Buy online or talk to an expert — easy claim process in both cases',
    hi: 'ऑनलाइन खरीदें या विशेषज्ञ से बात करें — दोनों में आसान क्लेम प्रक्रिया',
    hinglish: 'Online khareedein ya expert se baat karein — dono mein aasan claim process',
  },

  // ── Feature Cards ───────────────────────────────────────────────────────
  'features.aiSujhav.title': {
    en: 'AI-Powered Recommendations',
    hi: 'AI-संचालित सिफारिशें',
    hinglish: 'AI-Powered Sujhav',
  },
  'features.aiSujhav.description': {
    en: 'AI that understands your needs — personalized recommendations, just for you',
    hi: 'AI जो आपकी ज़रूरतें समझता है — व्यक्तिगत सिफारिशें, बस आपके लिए',
    hinglish: 'AI jo samajhta hai aapki zaroorat — personalized recommendations, bas aapke liye',
  },
  'features.irdai.title': {
    en: 'IRDAI Compliant',
    hi: 'IRDAI अनुपालित',
    hinglish: 'IRDAI Compliant',
  },
  'features.irdai.description': {
    en: 'All recommendations as per IRDAI guidelines — full transparency, no hidden terms',
    hi: 'सभी सिफारिशें IRDAI दिशानिर्देशों के अनुसार — पूर्ण पारदर्शिता, कोई छिपी शर्तें नहीं',
    hinglish: 'Saari recommendations IRDAI guidelines ke according — poori transparency, koi chhupana nahi',
  },
  'features.voiceFirst.title': {
    en: 'Voice-First',
    hi: 'आवाज़-प्रथम',
    hinglish: 'Boliye / Voice-First',
  },
  'features.voiceFirst.description': {
    en: 'Ask in your language — Hindi, English, or Hinglish, we will understand',
    hi: 'अपनी भाषा में पूछें — हिंदी, अंग्रेज़ी या हिंग्लिश, हम समझ लेंगे',
    hinglish: 'Apni bhasha mein poochiye — Hindi, English, ya Hinglish, hum samajh lenge',
  },
  'features.zeroJargon.title': {
    en: 'Zero Jargon / Simple Language',
    hi: 'शून्य पारिभाषिक शब्द / सरल भाषा',
    hinglish: 'Zero Jargon / Aasan Bhasha',
  },
  'features.zeroJargon.description': {
    en: 'Understand complex insurance terms in simple Hindi/Hinglish — no confusion',
    hi: 'जटिल बीमा शब्दावली को सरल हिंदी/हिंग्लिश में समझें — कोई भ्रम नहीं',
    hinglish: 'Insurance ki complex terms ko aasan Hindi/Hinglish mein samjhiye — koi confusion nahi',
  },

  // ── Value Props Grid ────────────────────────────────────────────────────
  'valueProps.aiSujhav.title': {
    en: 'AI-Powered Sujhav',
    hi: 'AI-संचालित सुझाव',
    hinglish: 'AI-Powered Sujhav',
  },
  'valueProps.aiSujhav.description': {
    en: 'AI that understands your needs — personalized recommendations, just for you. Compare 51+ insurers in seconds.',
    hi: 'AI जो आपकी ज़रूरतें समझता है — व्यक्तिगत सिफारिशें, बस आपके लिए। 51+ बीमाकर्ताओं की तुलना सेकंड में।',
    hinglish: 'AI jo samajhta hai aapki zaroorat — personalized recommendations, bas aapke liye. 51+ insurers compare, seconds mein.',
  },
  'valueProps.irdai.title': {
    en: 'IRDAI Compliant',
    hi: 'IRDAI अनुपालित',
    hinglish: 'IRDAI Compliant',
  },
  'valueProps.irdai.description': {
    en: 'All recommendations as per IRDAI guidelines — full transparency, no hidden terms. Registered insurance advisor.',
    hi: 'सभी सिफारिशें IRDAI दिशानिर्देशों के अनुसार — पूर्ण पारदर्शिता, कोई छिपी शर्तें नहीं। पंजीकृत बीमा सलाहकार।',
    hinglish: 'Saari recommendations IRDAI guidelines ke according — poori transparency, koi chhupana nahi. Registered insurance advisor.',
  },
  'valueProps.aasanBhasha.title': {
    en: 'Simple Language',
    hi: 'आसान भाषा',
    hinglish: 'Aasan Bhasha',
  },
  'valueProps.aasanBhasha.description': {
    en: 'Understand complex insurance terms in simple Hindi/Hinglish — no confusion. Voice support available too.',
    hi: 'जटिल बीमा शब्दावली को सरल हिंदी/हिंग्लिश में समझें — कोई भ्रम नहीं। वॉइस सपोर्ट भी है।',
    hinglish: 'Insurance ki complex terms ko aasan Hindi/Hinglish mein samjhiye — koi confusion nahi. Voice support bhi hai.',
  },

  // ── Language Labels (for the toggle itself) ─────────────────────────────
  'language.en': {
    en: 'English',
    hi: 'अंग्रेज़ी',
    hinglish: 'English',
  },
  'language.hi': {
    en: 'Hindi',
    hi: 'हिंदी',
    hinglish: 'Hindi',
  },
  'language.hinglish': {
    en: 'Hinglish',
    hi: 'हिंग्लिश',
    hinglish: 'Hinglish',
  },
  'language.selectLanguage': {
    en: 'Select Language',
    hi: 'भाषा चुनें',
    hinglish: 'Language Choose Karein',
  },

  // ── Product Showcase ──────────────────────────────────────────────────
  'showcase.title': {
    en: 'Featured Insurance Plans',
    hi: 'चुनिंदा बीमा योजनाएँ',
    hinglish: 'Featured Insurance Plans',
  },
  'showcase.subtitle': {
    en: 'Compare top plans from leading insurers',
    hi: 'प्रमुख बीमाकर्ताओं की शीर्ष योजनाओं की तुलना करें',
    hinglish: 'Top insurers ki plans compare karein',
  },
  'showcase.health': {
    en: 'Health',
    hi: 'स्वास्थ्य',
    hinglish: 'Health',
  },
  'showcase.term': {
    en: 'Term',
    hi: 'टर्म',
    hinglish: 'Term',
  },
  'showcase.motor': {
    en: 'Motor',
    hi: 'मोटर',
    hinglish: 'Motor',
  },
  'showcase.travel': {
    en: 'Travel',
    hi: 'यात्रा',
    hinglish: 'Travel',
  },
  'showcase.startingFrom': {
    en: 'Starting from',
    hi: 'से शुरू',
    hinglish: 'Se Shuru',
  },
  'showcase.perMonth': {
    en: '/month',
    hi: '/माह',
    hinglish: '/month',
  },
  'showcase.perYear': {
    en: '/year',
    hi: '/वर्ष',
    hinglish: '/year',
  },
  'showcase.perTrip': {
    en: '/trip',
    hi: '/यात्रा',
    hinglish: '/trip',
  },
  'showcase.csr': {
    en: 'CSR',
    hi: 'CSR',
    hinglish: 'CSR',
  },
  'showcase.compare': {
    en: 'Compare',
    hi: 'तुलना',
    hinglish: 'Compare',
  },
  'showcase.details': {
    en: 'Details',
    hi: 'विवरण',
    hinglish: 'Details',
  },
  'showcase.keyFeatures': {
    en: 'Key Features',
    hi: 'मुख्य विशेषताएँ',
    hinglish: 'Key Features',
  },
  'showcase.viewAllPlans': {
    en: 'View All Plans',
    hi: 'सभी योजनाएँ देखें',
    hinglish: 'Sabhi Plans Dekhein',
  },

  // ── Insurance Story Section ────────────────────────────────────────────
  'stories.badge': { en: '@paliwalinsure', hi: '@paliwalinsure', hinglish: '@paliwalinsure' },
  'stories.heading': { en: '"Baad Mein" — Real Insurance Stories', hi: '"बाद में" — इंश्योरेंस की असली कहानियाँ', hinglish: '"Baad Mein" — Insurance Ki Real Kahaniyaan' },
  'stories.description': { en: 'What happened to those who kept thinking "later"? Learn from real stories — why insurance is essential, what loss occurs without it, and where it helps.', hi: 'जो लोग "बाद में" सोचते रहे, उनका क्या हुआ? असली कहानियों से सीखो — इंश्योरेंस क्यों ज़रूरी है, बिना इंश्योरेंस के क्या नुकसान होता है, और कहाँ काम आता है।', hinglish: 'Jo log "baad mein" sochte rahe, unka kya hua? Real stories se seekho — insurance kyun zaroori hai, bina insurance ke kya loss hota hai, aur kahan kaam aata hai.' },
  'stories.tapToRead': { en: 'Tap to read story', hi: 'कहानी पढ़ने के लिए टैप करें', hinglish: 'Story padhne ke liye tap karein' },
  'stories.stat.mistakes': { en: 'Insurance Mistakes', hi: 'इंश्योरेंस की गलतियाँ', hinglish: 'Insurance Ki Galtiyan' },
  'stories.stat.loss': { en: 'Average Loss', hi: 'औसत नुकसान', hinglish: 'Average Loss' },
  'stories.stat.saved': { en: 'Could Be Saved', hi: 'बचाया जा सकता था', hinglish: 'Bachaya Ja Sakta Tha' },
  'stories.stat.trusted': { en: 'Trusted By', hi: 'भरोसा किया', hinglish: 'Bharosa Kiya' },
  'stories.cta.instagram': { en: 'Follow @paliwalinsure', hi: '@paliwalinsure को फ़ॉलो करें', hinglish: '@paliwalinsure Follow Karein' },
  'stories.cta.whatsapp': { en: 'WhatsApp Expert', hi: 'WhatsApp विशेषज्ञ', hinglish: 'WhatsApp Expert' },
  'stories.modal.whyBuy': { en: 'Kyun Le?', hi: 'क्यों लें?', hinglish: 'Kyun Le?' },
  'stories.modal.lossIfNot': { en: 'Na Le Toh Loss?', hi: 'ना लें तो लॉस?', hinglish: 'Na Le Toh Loss?' },
  'stories.modal.whereUsed': { en: 'Kahan Kaam Aata Hai?', hi: 'कहाँ काम आता है?', hinglish: 'Kahan Kaam Aata Hai?' },
  'stories.modal.storyNarrative': { en: 'Real Story', hi: 'असली कहानी', hinglish: 'Real Kahani' },
  'stories.modal.prev': { en: 'Prev', hi: 'पिछला', hinglish: 'Pichla' },
  'stories.modal.next': { en: 'Next', hi: 'अगला', hinglish: 'Aglā' },

  'story.1.tagline': { en: 'Will Third Party Be Enough?', hi: 'थर्ड पार्टी से काम चल जाएगा?', hinglish: 'Third Party se Kaam Chal Jaayega?' },
  'story.1.subtitle': { en: 'These 5 people kept thinking...', hi: 'ये 5 लोग सोचते रहे...', hinglish: 'Yeh 5 log sochte rahe...' },
  'story.1.title': { en: "Ramesh's Story — The Shortcoming of Third Party", hi: 'रमेश की कहानी — थर्ड पार्टी की कमी', hinglish: 'Ramesh ki Kahani — Third Party Ki Kami' },
  'story.1.content': { en: 'Ramesh bought only third party insurance for his new Swift. He thought — "Accidents will be my fault, I won\'t damage anyone." One day in the rain, his car slipped and hit a divider. ₹85,000 own damage. Third Party policy gives ZERO coverage for own damage. Ramesh had to pay the entire amount from his pocket. If he had comprehensive, zero depreciation cover would have paid ₹75,000 out of ₹85,000 from the insurance company.', hi: 'रमेश ने अपनी नई स्विफ्ट का सिर्फ थर्ड पार्टी इंश्योरेंस लिया। उसे लगा — "एक्सीडेंट तो मेरा ही फॉल्ट होगा, किसी को डैमेज नहीं होगा।" एक दिन बारिश में उसकी गाड़ी स्लिप हो गई और डिवाइडर से टकरा गई। ₹85,000 का ओन डैमेज हुआ। थर्ड पार्टी पॉलिसी में ओन डैमेज का ज़ीरो कवरेज मिलता है। रमेश को पूरा पैसा अपने पॉकेट से देना पड़ा। अगर कॉम्प्रिहेंसिव होता, तो ज़ीरो डेप्रिसिएशन कवर से ₹85,000 में से ₹75,000 इंश्योरेंस कंपनी देती।', hinglish: 'Ramesh ne apni new Swift ka sirf third party insurance liya. Usko laga — "Accident toh mera hi fault hoga, kisi ko damage nahi hoga." Ek din barish mein uski gaadi slip ho gayi aur divider se takra gayi. ₹85,000 ka own damage hua. Third Party policy mein own damage ka ZERO coverage milta hai. Ramesh ko poora paisa apne pocket se dena pada. Agar comprehensive hota, toh zero depreciation cover se ₹85,000 mein se ₹75,000 insurance company deti.' },
  'story.1.whyBuy': { en: 'Third Party insurance only covers damage to others — ZERO coverage for your own vehicle. Comprehensive covers accidents, theft, fire, flood, vandalism.', hi: 'थर्ड पार्टी इंश्योरेंस सिर्फ दूसरे की डैमेज कवर करता है — आपकी अपनी गाड़ी का नुकसान ज़ीरो। कॉम्प्रिहेंसिव में एक्सीडेंट, चोरी, आग, बाढ़, वैंडलिज्म सब कवर्ड।', hinglish: 'Third Party insurance sirf doosre ki damage cover karta hai — aapki apni gaadi ka nuksa ZERO. Comprehensive mein accidents, theft, fire, flood, vandalism sab covered.' },
  'story.1.lossIfNot': { en: 'Without comprehensive insurance: Pay for your own vehicle repairs entirely. If stolen, the entire loss is yours. Natural disaster gives ₹0 from third party.', hi: 'बिना कॉम्प्रिहेंसिव इंश्योरेंस के: अपनी गाड़ी का पूरा रिपेयर खुद पे करो। चोरी हुई तो पूरा लॉस तुम्हारा। प्राकृतिक आपदा में थर्ड पार्टी से ₹0 मिलता है।', hinglish: 'Bina comprehensive insurance ke: Apni gaadi ka poora repair khud pay karo. Theft hui toh poora loss tumhara. Natural disaster mein ₹0 milta hai third party se.' },
  'story.1.whereUsed': { en: 'Car insurance, Bike insurance, Commercial vehicle insurance — comprehensive is essential everywhere. Zero dep add-on gives even better protection.', hi: 'कार इंश्योरेंस, बाइक इंश्योरेंस, कमर्शियल व्हीकल इंश्योरेंस — हर जगह कॉम्प्रिहेंसिव ज़रूरी है। ज़ीरो डेप ऐड-ऑन से और भी बेहतर सुरक्षा मिलती है।', hinglish: 'Car insurance, Bike insurance, Commercial vehicle insurance — har jagah comprehensive zaroori hai. Zero dep add-on se even better protection milta hai.' },
  'story.1.ctaText': { en: 'Get Comprehensive Insurance', hi: 'कॉम्प्रिहेंसिव इंश्योरेंस लो', hinglish: 'Comprehensive Insurance Lo' },

  'story.2.tagline': { en: 'Will Get Comprehensive Later — New Car Now', hi: 'कॉम्प्रिहेंसिव ले लेंगे — अभी नई गाड़ी है', hinglish: 'Comprehensive Le Lenge — Abhi Naye Gaadi Hai' },
  'story.2.subtitle': { en: 'Nothing will happen... really?', hi: 'कुछ नहीं होगा... सच में?', hinglish: 'Kuch nahi hoga... sach me?' },
  'story.2.title': { en: "Priya's Story — Overconfidence in a New Car", hi: 'प्रिया की कहानी — नई गाड़ी का ओवरकॉन्फिडेंस', hinglish: 'Priya ki Kahani — Naye Gaadi Ka Overconfidence' },
  'story.2.content': { en: 'Priya bought a brand new Hyundai Creta. The showroom offered comprehensive — "Will get it later, it\'s a new car nothing will happen" Priya thought. 3 months later, someone scratched it in parking. ₹12,000 repair. Then 6 months later the car drowned in flood — ₹3.5 lakh damage. Since she didn\'t get comprehensive, everything from her pocket. Zero depreciation cover is most important for new cars — no depreciation for first 5 years.', hi: 'प्रिया ने ब्रांड न्यू हुंडई क्रेटा ली। शोरूम वाले ने कॉम्प्रिहेंसिव ऑफर किया — "बाद में ले लेंगे, अभी नई गाड़ी है कुछ नहीं होगा" प्रिया ने सोचा। 3 महीने बाद, पार्किंग में किसी ने स्क्रैच कर दिया। ₹12,000 का रिपेयर। फिर 6 महीने बाद बाढ़ में गाड़ी डूब गई — ₹3.5 लाख का नुकसान। क्योंकि कॉम्प्रिहेंसिव नहीं ली थी, सब अपने पॉकेट से। नई गाड़ी का ज़ीरो डेप्रिसिएशन कवर सबसे ज़रूरी होता है — पहले 5 साल डेप्रिसिएशन नहीं लगती।', hinglish: 'Priya ne brand new Hyundai Creta li. Showroom wale ne comprehensive offer kiya — "Baad Mein le lenge, abhi naye gaadi hai kuch nahi hoga" Priya ne socha. 3 mahine baad, parking mein kisi ne scratch kar diya. ₹12,000 ka repair. Phir 6 mahine baad flood mein gaadi doob gayi — ₹3.5 lakh ka nuksa. Kyunki comprehensive nahi li thi, sab apne pocket se. Naye gaadi ka zero depreciation cover sabse zaroori hota hai — first 5 saal depreciation nahi lagti.' },
  'story.2.whyBuy': { en: 'Zero depreciation + comprehensive combo is best for new cars. Even in the first claim, you get full amount. Engine protect add-on covers flood damage too.', hi: 'नई कार के लिए ज़ीरो डेप्रिसिएशन + कॉम्प्रिहेंसिव कॉम्बो सबसे अच्छा है। पहले क्लेम में भी पूरा अमाउंट मिलता है। इंजन प्रोटेक्ट ऐड-ऑन से फ्लड डैमेज भी कवर होता है।', hinglish: 'New car ke liye zero depreciation + comprehensive combo best hai. First claim mein bhi full amount milta hai. Engine protect add-on se flood damage bhi cover hota hai.' },
  'story.2.lossIfNot': { en: 'Even new cars can have accidents. Scratches on the road, hail damage, tree falling, theft — anything can happen. Without comprehensive, all expenses are yours.', hi: 'नई गाड़ी में भी एक्सीडेंट हो सकता है। रोड पर स्क्रैच, ओलावृष्टि, पेड़ गिरना, चोरी — कुछ भी हो सकता है। कॉम्प्रिहेंसिव के बिना, सब खर्चा अपना।', hinglish: 'Naye gaadi mein bhi accident ho sakta hai. Road pe scratch, hail damage, tree girna, theft — kuch bhi ho sakta hai. Without comprehensive, sab kharcha apna.' },
  'story.2.whereUsed': { en: 'New car owners, Car loan holders (bank mandatory), Metro cities with flood/traffic risk, Highway drivers with high accident risk.', hi: 'नई कार वाले, कार लोन वाले (बैंक अनिवार्य), फ्लड/ट्रैफ़िक रिस्क वाले मेट्रो शहर, हाईवे ड्राइवर जहाँ एक्सीडेंट रिस्क ज़्यादा।', hinglish: 'New car owners, Car loan wale (bank mandatory hai), Metro cities jahan flood/traffic risk zyada, Highway drivers jahan accident risk high.' },
  'story.2.ctaText': { en: 'Get Zero Dep Cover', hi: 'ज़ीरो डेप कवर लो', hinglish: 'Zero Dep Cover Lo' },

  'story.3.tagline': { en: 'Will Upgrade Later — Premium Is Too High', hi: 'अपग्रेड कर लेंगे — प्रीमियम ज़्यादा है', hinglish: 'Upgrade Kar Lenge — Premium Zyada Hai' },
  'story.3.subtitle': { en: 'A little extra premium now', hi: 'अभी थोड़ी प्रीमियम ज़्यादा लगती है', hinglish: 'Abhi thodi premium zyada lagti hai' },
  'story.3.title': { en: "Suresh's Story — Heavy Price of Saving Premium", hi: 'सुरेश की कहानी — प्रीमियम बचाने का भारी ज़ाया', hinglish: 'Suresh ki Kahani — Premium Bachane Ka Bhari Zaaya' },
  'story.3.content': { en: 'Suresh was offered a basic health insurance plan — ₹5,000 premium. Upgrading would cost ₹8,500 premium. He thought — "Save ₹3,500, will upgrade later." 8 months later his wife got dengue. Basic plan had room rent capping of ₹2,000/day, actual was ₹5,000/day. 7 days hospital — ₹1,40,000 bill, insurance gave ₹65,000. Remaining ₹75,000 paid himself. If upgraded plan with no room rent capping, almost ₹1,20,000 would have been covered.', hi: 'सुरेश को हेल्थ इंश्योरेंस का बेसिक प्लान ऑफर हुआ — ₹5,000 प्रीमियम। अपग्रेड करने पर ₹8,500 प्रीमियम लगती थी। उसने सोचा — "₹3,500 बचा लेता हूँ, बाद में अपग्रेड कर लूँगा।" 8 महीने बाद उसकी पत्नी को डेंगू हुआ। बेसिक प्लान में रूम रेंट कैपिंग ₹2,000/दिन थी, एक्चुअल ₹5,000/दिन। 7 दिन अस्पताल — ₹1,40,000 बिल, इंश्योरेंस से ₹65,000 मिला। बाकी ₹75,000 खुद पे किया। अगर अपग्रेडेड प्लान होता with no room rent capping, तो लगभग ₹1,20,000 मिलता।', hinglish: 'Suresh ko health insurance ka basic plan offer hua — ₹5,000 premium. Upgrade karne pe ₹8,500 premium lagti thi. Usne socha — "₹3,500 bacha leta hoon, baad mein upgrade kar lunga." 8 mahine baad uski wife ko dengue hua. Basic plan mein room rent capping ₹2,000/day thi, actual ₹5,000/day. 7 din hospital — ₹1,40,000 bill, insurance se ₹65,000 mila. Baki ₹75,000 khud pay kiya. Agar upgraded plan hota with no room rent capping, toh almost ₹1,20,000 milta.' },
  'story.3.whyBuy': { en: 'Pay a little extra premium, but get maximum coverage at claim time. Room rent capping, co-payment, sub-limits — these are in basic plans that reduce your claim.', hi: 'थोड़ी एक्स्ट्रा प्रीमियम देते हो, लेकिन क्लेम टाइम पे मैक्सिमम कवरेज मिलता है। रूम रेंट कैपिंग, को-पेमेंट, सब-लिमिट्स — ये सब बेसिक प्लान में रहते हैं जो क्लेम कम करते हैं।', hinglish: 'Thodi extra premium dete ho, lekin claim time pe maximum coverage milta hai. Room rent capping, co-payment, sub-limits — yeh sab basic plans mein rehte hain jo claim reduce karte hain.' },
  'story.3.lossIfNot': { en: 'To save premium, you end up paying 40-60% yourself at claim time. Medical inflation is 12-15% annually — plans get more expensive every year, benefits decrease.', hi: 'प्रीमियम बचाने के चक्कर में क्लेम टाइम पे 40-60% खुद पे करना पड़ता है। मेडिकल इंफ्लेशन 12-15% एनुअल है — हर साल प्लान और महंगा होता है, बेनिफिट्स कम।', hinglish: 'Premium bachane ke chakkar mein claim time pe 40-60% khud pay karna padta hai. Medical inflation 12-15% annual hai — har saal plan aur mehenga hota hai, benefits kam.' },
  'story.3.whereUsed': { en: 'Health insurance upgrade, Term insurance riders (critical illness, accidental death), Motor insurance add-ons (zero dep, engine protect, return to invoice).', hi: 'हेल्थ इंश्योरेंस अपग्रेड, टर्म इंश्योरेंस राइडर्स (क्रिटिकल इलनेस, एक्सीडेंटल डेथ), मोटर इंश्योरेंस ऐड-ऑन (ज़ीरो डेप, इंजन प्रोटेक्ट, रिटर्न टू इनवॉइस)।', hinglish: 'Health insurance upgrade, Term insurance riders (critical illness, accidental death), Motor insurance add-ons (zero dep, engine protect, return to invoice).' },
  'story.3.ctaText': { en: 'Compare Best Plans', hi: 'बेस्ट प्लान कंपेयर करो', hinglish: 'Best Plan Compare Karo' },

  'story.4.tagline': { en: 'Will Think Later — I Drive Carefully', hi: 'बाद में सोचेंगे — मैं केयरफुली ड्राइव करता हूँ', hinglish: 'Baad Mein Sochenge — Main Carefully Drive Karta Hoon' },
  'story.4.subtitle': { en: 'Is careful driving enough to stay safe?', hi: 'केयरफुल ड्राइविंग से सब सेफ है?', hinglish: 'Careful driving se sab safe hai?' },
  'story.4.title': { en: "Amit's Story — Even Careful Drivers Can Be Victims", hi: 'अमित की कहानी — केयरफुल ड्राइवर भी विक्टिम बन सकता है', hinglish: 'Amit ki Kahani — Careful Driver Bhi Victim Ban Sakta Hai' },
  'story.4.content': { en: 'Amit has been driving for 15 years — not a single accident. "I drive carefully, no need for insurance" — thinking this, he didn\'t renew comprehensive. One night on the highway, a truck suddenly changed lanes. Amit braked but the car skidded. ₹2.2 lakh damage. His car had third party only. Own damage = ZERO. His "careful driving" couldn\'t save him from the truck driver\'s decision. If comprehensive, insurance company would cover 80-90%.', hi: 'अमित 15 साल से ड्राइव कर रहा है — एक भी एक्सीडेंट नहीं हुआ। "मैं केयरफुली ड्राइव करता हूँ, इंश्योरेंस की ज़रूरत नहीं" — ये सोच कर उसने कॉम्प्रिहेंसिव नहीं रिन्यू किया। एक रात हाईवे पे ट्रक ने सडन लेन चेंज किया। अमित ने ब्रेक मारी लेकिन गाड़ी स्किड हो गई। ₹2.2 लाख का डैमेज। उसकी गाड़ी का थर्ड पार्टी ओनली था। ओन डैमेज = ज़ीरो। उसकी "केयरफुल ड्राइविंग" उसको ट्रक के ड्राइवर के डिसीज़न से नहीं बचा सकती थी। कॉम्प्रिहेंसिव होता तो इंश्योरेंस कंपनी 80-90% कवर करती।', hinglish: 'Amit 15 saal se drive kar raha hai — ek bhi accident nahi hua. "Main carefully drive karta hoon, insurance ki zaroorat nahi" — yeh soch ke usne comprehensive nahi renew kiya. Ek raat highway pe truck ne sudden lane change kiya. Amit ne brake maari but gaadi skidded. ₹2.2 lakh ka damage. Uski gaadi ka third party only tha. Own damage = ZERO. Uska "careful driving" usko truck ke driver ke decision se nahi bacha sakta tha. Comprehensive hota toh insurance company 80-90% cover karti.' },
  'story.4.whyBuy': { en: 'You may drive carefully, but others won\'t. Hit-and-run, uninsured driver, natural disaster — these are not in your control. Comprehensive insurance protects you from others\' mistakes too.', hi: 'तुम केयरफुली ड्राइव करो, पर दूसरे नहीं करेंगे। हिट-एंड-रन, अनइंश्योर्ड ड्राइवर, प्राकृतिक आपदा — ये तुम्हारे कंट्रोल में नहीं। कॉम्प्रिहेंसिव इंश्योरेंस तुम्हें दूसरों की गलती से भी प्रोटेक्ट करता है।', hinglish: 'Tum carefully drive karo, par doosre nahi karenge. Hit-and-run, uninsured driver, natural disaster — yeh tumhare control mein nahi. Comprehensive insurance tumhe doosron ki galti se bhi protect karta hai.' },
  'story.4.lossIfNot': { en: 'Careful driving only reduces your accidents — not others\'. Accident from uninsured motorist, parking damage, vandalism — all costs are yours without comprehensive.', hi: 'केयरफुल ड्राइविंग सिर्फ तुम्हारे एक्सीडेंट कम करती है — दूसरों के नहीं। अनइंश्योर्ड मोटरिस्ट से एक्सीडेंट, पार्किंग डैमेज, वैंडलिज्म — कॉम्प्रिहेंसिव के बिना सब का खर्चा तुम्हारा।', hinglish: 'Careful driving sirf tumhare accidents kam karti hai — doosron ke nahi. Uninsured motorist se accident, parking damage, vandalism — sab ka kharcha tumhara without comprehensive.' },
  'story.4.whereUsed': { en: 'Highway driving, City traffic, Night driving, Parking in public areas, Areas with high theft/vandalism risk.', hi: 'हाईवे ड्राइविंग, सिटी ट्रैफ़िक, नाइट ड्राइविंग, पब्लिक एरिया में पार्किंग, उच्च चोरी/वैंडलिज्म रिस्क वाले क्षेत्र।', hinglish: 'Highway driving, City traffic, Night driving, Parking in public areas, Areas with high theft/vandalism risk.' },
  'story.4.ctaText': { en: 'Get Insurance Now', hi: 'अभी इंश्योरेंस लो', hinglish: 'Abhi Insurance Lo' },

  'story.5.tagline': { en: 'The "Later" Time Has Come!', hi: 'बाद में का वक़्त आ गया!', hinglish: 'Baad Mein Ka Waqt Aa Gaya!' },
  'story.5.subtitle': { en: 'Car drowned in rain — ₹1,50,000 repair bill', hi: 'बारिश में गाड़ी डूब गई — ₹1,50,000 रिपेयर बिल', hinglish: 'Baarish mein gaadi doob gayi — ₹1,50,000 repair bill' },
  'story.5.title': { en: "Vikram's Story — Flood Drowned Car, ₹0 From Third Party", hi: 'विक्रम की कहानी — बाढ़ में डूबी गाड़ी, थर्ड पार्टी से ₹0', hinglish: 'Vikram ki Kahani — Flood Mein Doobi Gaadi, Third Party Se ₹0' },
  'story.5.content': { en: 'Vikram took third party to save ₹4,000 on car insurance renewal. "I only drive in the city, where will flood come from?" In 2024 monsoon, severe flood hit his area. Car was submerged in water for 12 hours. Engine hydro-locked, electrical system damaged, interior ruined. Total repair: ₹1,50,000. From Third Party policy: ₹0. Because flood damage = own damage, third party only covers others\' damage. If comprehensive + engine protect, ₹1,35,000 would come from insurance.', hi: 'विक्रम ने कार इंश्योरेंस रिन्यूअल पे ₹4,000 बचाने के लिए थर्ड पार्टी ले लिया। "मैं सिटी में ही ड्राइव करता हूँ, बाढ़ कहाँ से आएगी?" 2024 मॉनसून में उसके एरिया में सीवियर फ्लड आया। गाड़ी पानी में 12 घंटी डूबी। इंजन हाइड्रो-लॉक्ड, इलेक्ट्रिकल सिस्टम खराब, इंटीरियर रुइन्ड। टोटल रिपेयर: ₹1,50,000। थर्ड पार्टी पॉलिसी से: ₹0। क्योंकि फ्लड डैमेज = ओन डैमेज, थर्ड पार्टी सिर्फ दूसरे की डैमेज कवर करता है। अगर कॉम्प्रिहेंसिव + इंजन प्रोटेक्ट होता, तो ₹1,35,000 इंश्योरेंस से मिलता।', hinglish: 'Vikram ne car insurance renewal pe ₹4,000 bachane ke liye third party le liya. "Main city mein hi drive karta hoon, flood kahan se aayega?" 2024 monsoon mein uske area mein severe flood aaya. Gaadi paani mein 12 ghanti doobi. Engine hydro-locked, electrical system kharab, interior ruined. Total repair: ₹1,50,000. Third Party policy se: ₹0. Kyunki flood damage = own damage, third party sirf doosre ki damage cover karta hai. Agar comprehensive + engine protect hota, toh ₹1,35,000 insurance se milta.' },
  'story.5.whyBuy': { en: 'Flood, cyclone, earthquake — natural disasters can strike anywhere anytime. Comprehensive + Engine Protect add-on fully covers flood damage. Essential for Mumbai, Chennai, Hyderabad like cities.', hi: 'बाढ़, चक्रवात, भूकंप — प्राकृतिक आपदा कभी भी कहीं भी आ सकती है। कॉम्प्रिहेंसिव + इंजन प्रोटेक्ट ऐड-ऑन से फ्लड डैमेज पूरी तरह कवर होता है। मुंबई, चेन्नई, हैदराबाद जैसे शहरों में ये ज़रूरी है।', hinglish: 'Flood, cyclone, earthquake — natural disasters kabhi bhi kahin bhi aa sakti hain. Comprehensive + Engine Protect add-on se flood damage fully covered hota hai. Mumbai, Chennai, Hyderabad jaise cities mein yeh must hai.' },
  'story.5.lossIfNot': { en: 'Flood damage without comprehensive = entire repair bill is yours. Engine replacement alone ₹50,000-2,00,000. Electrical system ₹20,000-80,000. Interior ₹15,000-50,000. From third party ZERO.', hi: 'कॉम्प्रिहेंसिव के बिना फ्लड डैमेज = पूरा रिपेयर बिल तुम्हारा। सिर्फ इंजन रिप्लेसमेंट ₹50,000-2,00,000। इलेक्ट्रिकल सिस्टम ₹20,000-80,000। इंटीरियर ₹15,000-50,000। थर्ड पार्टी से ज़ीरो।', hinglish: 'Flood damage without comprehensive = poora repair bill tumhara. Engine replacement alone ₹50,000-2,00,000. Electrical system ₹20,000-80,000. Interior ₹15,000-50,000. Third party se ZERO.' },
  'story.5.whereUsed': { en: 'Flood-prone areas, Coastal cities, Low-lying areas, Monsoon season preparation, All metro cities with drainage issues.', hi: 'बाढ़-प्रवण क्षेत्र, तटीय शहर, निचले क्षेत्र, मॉनसून सीज़न तैयारी, ड्रेनेज समस्या वाले सभी मेट्रो शहर।', hinglish: 'Flood-prone areas, Coastal cities, Low-lying areas, Monsoon season preparation, All metro cities with drainage issues.' },
  'story.5.ctaText': { en: 'Add Flood Cover', hi: 'फ्लड कवर ऐड करो', hinglish: 'Flood Cover Add Karo' },

  'story.6.tagline': { en: 'Before the "Later" Time Comes — Get Comprehensive!', hi: 'बाद में वाला वक़्त आने से पहले — कॉम्प्रिहेंसिव लो!', hinglish: 'Baad Mein Wala Waqt Aane Se Pehle — Comprehensive Lo!' },
  'story.6.subtitle': { en: 'PaliwalSecure — Complete Protection for Your Vehicle', hi: 'पालीवाल सिक्योर — अपनी गाड़ी की पूरी सुरक्षा', hinglish: 'PaliwalSecure — Apni Gaadi Ki Poori Suraksha' },
  'story.6.title': { en: 'PaliwalSecure — Right Insurance, Right Guidance', hi: 'पालीवाल सिक्योर — सही इंश्योरेंस, सही मार्गदर्शन', hinglish: 'PaliwalSecure — Sahi Insurance, Sahi Guidance' },
  'story.6.content': { en: 'All these stories are real. Every year, lakhs of people suffer ₹50,000 to ₹5,00,000 loss due to insurance mistakes. PaliwalSecure helps you choose the right plan — compare 51+ insurance companies, get personalized advice from InsureGPT AI, and make the right decision with expert guidance. Comprehensive insurance costs ₹3,000-8,000 extra premium, but saves ₹50,000-5,00,000 in one claim. This is an investment, not an expense.', hi: 'ये सारी कहानियाँ असली हैं। हर साल लाखों लोग इंश्योरेंस की गलती से ₹50,000 से ₹5,00,000 तक का नुकसान उठाते हैं। पालीवाल सिक्योर आपको सही प्लान चूज़ करने में हेल्प करता है — 51+ इंश्योरेंस कंपनीज़ कंपेयर करो, InsureGPT AI से पर्सनलाइज़्ड एडवाइस लो, और एक्सपर्ट गाइडेंस के साथ सही डिसीज़न लो। कॉम्प्रिहेंसिव इंश्योरेंस लेने में ₹3,000-8,000 एक्स्ट्रा प्रीमियम लगती है, लेकिन एक क्लेम में ₹50,000-5,00,000 बचा लेती है। ये इन्वेस्टमेंट है, खर्चा नहीं।', hinglish: 'Yeh sab kahaniyaan real hain. Har saath laakhon log insurance ki galti se ₹50,000 se ₹5,00,000 tak ka nuksa uthate hain. PaliwalSecure aapko sahi plan choose karne mein help karta hai — 51+ insurance companies compare karo, InsureGPT AI se personalized advice lo, aur expert guidance ke saath sahi decision lo. Comprehensive insurance lene me ₹3,000-8,000 extra premium lagti hai, lekin ek claim mein ₹50,000-5,00,000 bacha leti hai. Yeh investment hai, kharcha nahi.' },
  'story.6.whyBuy': { en: 'Compare 51+ insurers, get free advice from AI-powered InsureGPT, Zero depreciation, Engine protect, Return to invoice — all add-ons in one place. Expert claim support included.', hi: '51+ इंश्योरर्स कंपेयर करो, AI-पावर्ड InsureGPT से फ्री एडवाइस लो, ज़ीरो डेप्रिसिएशन, इंजन प्रोटेक्ट, रिटर्न टू इनवॉइस — सब ऐड-ऑन एक जगह। एक्सपर्ट क्लेम सपोर्ट भी मिलता है।', hinglish: '51+ insurers compare karo, AI-powered InsureGPT se free advice lo, Zero depreciation, Engine protect, Return to invoice — sab add-ons ek jagah. Expert claim support bhi milta hai.' },
  'story.6.lossIfNot': { en: 'Without insurance or only third party: Every accident, theft, flood — full expense is yours. No insurance agent means complicated claim process too. PaliwalSecure guides at every step.', hi: 'बिना इंश्योरेंस या सिर्फ थर्ड पार्टी के: हर एक्सीडेंट, चोरी, बाढ़ में पूरा खर्चा अपना। इंश्योरेंस एजेंट नहीं है तो क्लेम प्रोसेस भी कॉम्प्लिकेटेड। पालीवाल सिक्योर हर स्टेप पे गाइडेंस देता है।', hinglish: 'Bina insurance ya sirf third party ke: Har accident, theft, flood mein poora kharcha apna. Insurance agent nahi hai toh claim process bhi complicated. PaliwalSecure har step pe guidance deta hai.' },
  'story.6.whereUsed': { en: 'Car insurance, Bike insurance, Health insurance, Term insurance, Travel insurance — PaliwalSecure is a trusted partner for all types of insurance. IRDAI Registered POSP (IP429834).', hi: 'कार इंश्योरेंस, बाइक इंश्योरेंस, हेल्थ इंश्योरेंस, टर्म इंश्योरेंस, ट्रैवल इंश्योरेंस — हर तरह की इंश्योरेंस के लिए पालीवाल सिक्योर ट्रस्टेड पार्टनर है। IRDAI पंजीकृत POSP (IP429834)।', hinglish: 'Car insurance, Bike insurance, Health insurance, Term insurance, Travel insurance — har tarah ki insurance ke liye PaliwalSecure trusted partner hai. IRDAI Registered POSP (IP429834).' },
  'story.6.ctaText': { en: 'Get Free Consultation from PaliwalSecure', hi: 'पालीवाल सिक्योर से फ्री कंसल्टेशन लो', hinglish: 'PaliwalSecure Se Free Consultation Lo' },

  // ── InsureGPT Section ──────────────────────────────────────────────────
  'insureGPT.badge': { en: 'AI-Powered Insurance Advisor', hi: 'AI-संचालित बीमा सलाहकार', hinglish: 'AI-Powered Insurance Advisor' },
  'insureGPT.chatWith': { en: 'Chat with ', hi: 'चैट करें ', hinglish: 'Chat karein ' },
  'insureGPT.subtitle': { en: 'Your personal AI insurance advisor — ask anything about insurance, claims, or tax savings', hi: 'आपका व्यक्तिगत AI बीमा सलाहकार — बीमा, क्लेम, या कर बचत के बारे में कुछ भी पूछें', hinglish: 'Aapka personal AI insurance advisor — insurance, claims, ya tax savings ke baare mein kuch bhi puchiye' },
  'insureGPT.poweredBy': { en: 'Powered by PaliwalSecure', hi: 'PaliwalSecure द्वारा संचालित', hinglish: 'Powered by PaliwalSecure' },
  'insureGPT.byBrand': { en: 'by PaliwalSecure', hi: 'PaliwalSecure द्वारा', hinglish: 'by PaliwalSecure' },
  'insureGPT.brandDesc': { en: 'Powered by advanced AI with IRDAI-compliant knowledge. Get instant, personalized guidance — interact with me below!', hi: 'उन्नत AI द्वारा संचालित, IRDAI-अनुपालित ज्ञान के साथ। तत्काल, व्यक्तिगत मार्गदर्शन प्राप्त करें — नीचे मुझसे बात करें!', hinglish: 'Advanced AI se powered, IRDAI-compliant knowledge ke saath. Turant, personalized guidance paayein — neeche mujhse baat karein!' },
  'insureGPT.trust.irdaiCertified': { en: 'IRDAI Certified', hi: 'IRDAI प्रमाणित', hinglish: 'IRDAI Certified' },
  'insureGPT.trust.insurers': { en: '51+ Insurers', hi: '51+ बीमाकर्ता', hinglish: '51+ Insurers' },
  'insureGPT.trust.free': { en: '100% Free', hi: '100% मुफ्त', hinglish: '100% Free' },
  'insureGPT.trust.aiPowered': { en: 'AI-Powered', hi: 'AI-संचालित', hinglish: 'AI-Powered' },
  'insureGPT.language': { en: 'Language', hi: 'भाषा', hinglish: 'Language' },
  'insureGPT.howItWorks': { en: 'How it works', hi: 'कैसे काम करता है', hinglish: 'Kaise kaam karta hai' },
  'insureGPT.step1': { en: 'Type your insurance question', hi: 'अपना बीमा सवाल टाइप करें', hinglish: 'Apna insurance sawaal type karein' },
  'insureGPT.step2': { en: 'AI analyzes & provides advice', hi: 'AI विश्लेषण करता है और सलाह देता है', hinglish: 'AI analyze karta hai aur advice deta hai' },
  'insureGPT.step3': { en: 'Get IRDAI-compliant answers', hi: 'IRDAI-अनुपालित उत्तर प्राप्त करें', hinglish: 'IRDAI-compliant jawaab paayein' },
  'insureGPT.chatCTA': { en: 'Chat with InsureGPT', hi: 'InsureGPT से चैट करें', hinglish: 'InsureGPT se Chat Karein' },
  'insureGPT.whatsappExpert': { en: 'WhatsApp Expert', hi: 'WhatsApp विशेषज्ञ', hinglish: 'WhatsApp Expert' },
  'insureGPT.online': { en: 'Online', hi: 'ऑनलाइन', hinglish: 'Online' },
  'insureGPT.placeholder': { en: 'Ask about insurance...', hi: 'बीमा के बारे में पूछें...', hinglish: 'Insurance ke baare mein puchiye...' },
  'insureGPT.irdaiDisclaimer': { en: '⚠️ IRDAI Disclaimer: AI tool for general guidance only. Not a substitute for professional advice.', hi: '⚠️ IRDAI अस्वीकरण: केवल सामान्य मार्गदर्शन के लिए AI उपकरण। पेशेवर सलाह का विकल्प नहीं।', hinglish: '⚠️ IRDAI Disclaimer: AI tool sirf general guidance ke liye hai. Professional advice ka substitute nahi hai.' },
  'insureGPT.error': { en: 'Sorry, I encountered an error. Please try again.', hi: 'क्षमा करें, मुझे त्रुटि मिली। कृपया पुनः प्रयास करें।', hinglish: 'Sorry, error aa gayi. Dobara try karein.' },
  'insureGPT.networkError': { en: 'Network error. Please check your connection and try again.', hi: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।', hinglish: 'Network error. Apna connection check karein aur dobara try karein.' },
  'insureGPT.welcome': { en: 'Namaste! 🙏 Welcome to **InsureGPT** by PaliwalSecure — your AI insurance advisor! I can help you with health, life, motor insurance and more. What would you like to know?', hi: 'नमस्ते! 🙏 PaliwalSecure के **InsureGPT** में आपका स्वागत है — आपका AI बीमा सलाहकार! मैं स्वास्थ्य, जीवन, मोटर बीमा और अधिक में आपकी मदद कर सकता हूं। आप क्या जानना चाहेंगे?', hinglish: 'Namaste! 🙏 Welcome to **InsureGPT** by PaliwalSecure — aapka AI insurance advisor! Main health, life, motor insurance aur meer mein madad kar sakta hoon. Aap kya jaanna chahenge?' },
  'insureGPT.langHing': { en: 'HING', hi: 'HING', hinglish: 'HING' },
  'insureGPT.langEn': { en: 'EN', hi: 'EN', hinglish: 'EN' },
  'insureGPT.langHi': { en: 'HI', hi: 'HI', hinglish: 'HI' },

  // ── InsureGPT Quick Actions ────────────────────────────────────────────
  'insureGPT.quickAction.health': { en: 'Health', hi: 'स्वास्थ्य', hinglish: 'Health' },
  'insureGPT.quickAction.term': { en: 'Term', hi: 'टर्म', hinglish: 'Term' },
  'insureGPT.quickAction.motor': { en: 'Motor', hi: 'मोटर', hinglish: 'Motor' },
  'insureGPT.quickAction.travel': { en: 'Travel', hi: 'यात्रा', hinglish: 'Travel' },
  'insureGPT.quickAction.home': { en: 'Home', hi: 'होम', hinglish: 'Home' },
  'insureGPT.quickAction.healthClaim': { en: 'Health Claim', hi: 'स्वास्थ्य क्लेम', hinglish: 'Health Claim' },
  'insureGPT.quickAction.lifeClaim': { en: 'Life Claim', hi: 'जीवन क्लेम', hinglish: 'Life Claim' },
  'insureGPT.quickAction.motorClaim': { en: 'Motor Claim', hi: 'मोटर क्लेम', hinglish: 'Motor Claim' },
  'insureGPT.quickAction.taxSavings': { en: 'Tax Savings', hi: 'कर बचत', hinglish: 'Tax Savings' },
  'insureGPT.quickAction.comparePlans': { en: 'Compare Plans', hi: 'योजनाएँ तुलना करें', hinglish: 'Plans Compare Karein' },

  // ── InsureGPT Suggestions ──────────────────────────────────────────────
  'insureGPT.suggestion.healthPlan': { en: 'Best health plan for family?', hi: 'परिवार के लिए सर्वोत्तम हेल्थ प्लान?', hinglish: 'Family ke liye best health plan?' },
  'insureGPT.suggestion.claim': { en: 'How to file a claim?', hi: 'क्लेम कैसे दायर करें?', hinglish: 'Claim kaise file karein?' },
  'insureGPT.suggestion.tax': { en: 'Tax benefits of insurance', hi: 'बीमा के कर लाभ', hinglish: 'Insurance ke tax benefits' },
  'insureGPT.suggestion.compareTerm': { en: 'Compare term plans', hi: 'टर्म प्लान तुलना करें', hinglish: 'Term plans compare karein' },
};

/**
 * Look up a translation key in the current language.
 * Checks local translations first, then falls back to i18n-strings.
 * Falls back to English if the key or language is missing.
 * Falls back to the key itself if not found at all.
 */
export function t(key: string, lang: Language): string {
  const entry = translations[key] || extraTranslations[key];
  if (!entry) {
    return key;
  }
  return entry[lang] || entry.en || key;
}
