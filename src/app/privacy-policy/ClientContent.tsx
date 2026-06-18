'use client';

import Link from 'next/link';
import {
  Shield, Eye, Database, Lock, Share2, Cookie, UserCheck,
  Clock, Baby, FileText, Phone, ChevronRight, Mail, MapPin,
  MessageCircle, Server, KeyRound, HardDrive, Globe, Fingerprint,
  AlertTriangle, CheckCircle2, ArrowRight, Scale
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';

/* ── Design tokens ─────────────────────────────────────────────────────── */
const NAVY_800 = '#0A1330';
const NAVY_600 = '#162D5A';
const GOLD = '#C98A1C';

/* ── Translation type ──────────────────────────────────────────────────── */
type Tr = { en: string; hi: string; hinglish: string };

/* ── Inline page text ──────────────────────────────────────────────────── */
const pageText = {
  hero: {
    title: { en: 'Privacy Policy', hi: 'गोपनीयता नीति', hinglish: 'Privacy Policy' },
    subtitle: { en: 'Your privacy matters to us. This policy explains how Paliwal Secure AI collects, uses, and protects your personal information.', hi: 'आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह नीति बताती है कि Paliwal Secure AI आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग और सुरक्षित करता है।', hinglish: 'Aapki privacy humare liye important hai. Yeh policy batati hai ki Paliwal Secure AI aapki personal info kaise collect, use aur protect karta hai.' },
    lastUpdated: { en: 'Last Updated: March 2025', hi: 'अंतिम अपडेट: मार्च 2025', hinglish: 'Last Updated: March 2025' },
  },
  toc: { en: 'Table of Contents', hi: 'विषय सूची', hinglish: 'Table of Contents' },
  sections: [
    {
      heading: { en: '1. Information We Collect', hi: '1. हम जो जानकारी एकत्र करते हैं', hinglish: '1. Information We Collect' },
      subsections: [
        { title: { en: 'Personal Information', hi: 'व्यक्तिगत जानकारी', hinglish: 'Personal Information' }, desc: { en: 'When you request a quote, use InsureGPT, or contact us, we may collect: name, email address, phone number, date of birth, gender, city/state, and insurance preferences.', hi: 'जब आप कोटेशन मांगते हैं, InsureGPT उपयोग करते हैं, या हमसे संपर्क करते हैं, तो हम एकत्र कर सकते हैं: नाम, ईमेल, फ़ोन, जन्मतिथि, लिंग, शहर/राज्य, और बीमा प्राथमिकताएं।', hinglish: 'Jab aap quote maangte hain, InsureGPT use karte hain, ya humse contact karte hain, toh hum collect kar sakte hain: naam, email, phone, DOB, gender, city/state, aur insurance preferences.' } },
        { title: { en: 'Technical Information', hi: 'तकनीकी जानकारी', hinglish: 'Technical Information' }, desc: { en: 'We automatically collect: IP address, browser type, device type, operating system, referring URL, pages visited, and time spent on pages.', hi: 'हम स्वचालित रूप से एकत्र करते हैं: IP पता, ब्राउज़र प्रकार, डिवाइस प्रकार, ऑपरेटिंग सिस्टम, संदर्भ URL, देखे गए पृष्ठ, और पृष्ठों पर बिताया गया समय।', hinglish: 'Hum automatically collect karte hain: IP address, browser type, device type, OS, referring URL, pages visited, aur time spent on pages.' } },
        { title: { en: 'Usage Information', hi: 'उपयोग जानकारी', hinglish: 'Usage Information' }, desc: { en: 'We track how you interact with our platform: features used, insurance categories browsed, comparison results viewed, chat conversations with InsureGPT.', hi: 'हम ट्रैक करते हैं कि आप हमारे प्लेटफ़ॉर्म के साथ कैसे इंटरैक्ट करते हैं: उपयोग की गई सुविधाएँ, ब्राउज़ की गई श्रेणियाँ, देखे गए तुलना परिणाम, InsureGPT के साथ चैट।', hinglish: 'Hum track karte hain ki aap hamare platform ke saath kaise interact karte hain: features used, categories browsed, comparison results viewed, InsureGPT chats.' } },
      ],
    },
    {
      heading: { en: '2. How We Use Your Data', hi: '2. हम आपके डेटा का उपयोग कैसे करते हैं', hinglish: '2. How We Use Your Data' },
      items: [
        { title: { en: 'Provide Insurance Quotes & Recommendations', hi: 'बीमा कोटेशन और सिफारिशें प्रदान करना', hinglish: 'Insurance Quotes & Recommendations Provide Karna' }, desc: { en: 'To generate personalized insurance comparisons and AI-powered recommendations from 51+ insurers.', hi: '51+ बीमाकर्ताओं से व्यक्तिगत बीमा तुलना और AI-संचालित सिफारिशें उत्पन्न करने के लिए।', hinglish: '51+ insurers se personalized insurance comparisons aur AI-powered recommendations generate karne ke liye.' } },
        { title: { en: 'Claims Assistance', hi: 'क्लेम सहायता', hinglish: 'Claims Assistance' }, desc: { en: 'To help you with insurance claims documentation and follow-up with insurers.', hi: 'बीमा क्लेम दस्तावेज़ीकरण और बीमाकर्ताओं के साथ फ़ॉलो-अप में मदद करने के लिए।', hinglish: 'Insurance claims documentation aur insurers ke saath follow-up mein madad karne ke liye.' } },
        { title: { en: 'Platform Improvement', hi: 'प्लेटफ़ॉर्म सुधार', hinglish: 'Platform Improvement' }, desc: { en: 'To improve InsureGPT responses, fix bugs, and enhance user experience based on usage patterns.', hi: 'InsureGPT प्रतिक्रियाओं को सुधारने, बग ठीक करने, और उपयोग पैटर्न के आधार पर उपयोगकर्ता अनुभव को बढ़ाने के लिए।', hinglish: 'InsureGPT responses improve karne, bugs fix karne, aur usage patterns ke basis pe UX enhance karne ke liye.' } },
        { title: { en: 'Communication', hi: 'संचार', hinglish: 'Communication' }, desc: { en: 'To send policy renewal reminders, claim updates, and respond to your queries via WhatsApp or email.', hi: 'पॉलिसी नवीनीकरण रिमाइंडर भेजने, क्लेम अपडेट, और WhatsApp या ईमेल के माध्यम से आपके प्रश्नों का उत्तर देने के लिए।', hinglish: 'Policy renewal reminders bhejne, claim updates, aur WhatsApp ya email ke through aapke queries ka jawab dene ke liye.' } },
        { title: { en: 'Regulatory Compliance', hi: 'नियामक अनुपालन', hinglish: 'Regulatory Compliance' }, desc: { en: 'To comply with IRDAI regulations, including record-keeping requirements for insurance transactions.', hi: 'IRDAI विनियमों का पालन करने के लिए, जिसमें बीमा लेनदेन के लिए रिकॉर्ड-रखने की आवश्यकताएं शामिल हैं।', hinglish: 'IRDAI regulations comply karne ke liye, including record-keeping requirements for insurance transactions.' } },
        { title: { en: 'Fraud Prevention', hi: 'धोखाधड़ी रोकथाम', hinglish: 'Fraud Prevention' }, desc: { en: 'To detect and prevent fraudulent activities on our platform.', hi: 'हमारे प्लेटफ़ॉर्म पर धोखाधड़ी गतिविधियों का पता लगाने और रोकने के लिए।', hinglish: 'Hamare platform pe fraudulent activities detect aur prevent karne ke liye.' } },
      ],
      important: { en: 'We never sell your personal data to third parties for marketing purposes.', hi: 'हम आपके व्यक्तिगत डेटा को विपणन उद्देश्यों के लिए कभी तीसरे पक्ष को नहीं बेचते।', hinglish: 'Hum aapka personal data marketing ke liye kabhi third parties ko nahi bechte.' },
    },
    {
      heading: { en: '3. Data Storage & Security', hi: '3. डेटा भंडारण और सुरक्षा', hinglish: '3. Data Storage & Security' },
      intro: { en: 'We implement industry-standard measures to protect your personal information.', hi: 'हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उद्योग-मानक उपाय लागू करते हैं।', hinglish: 'Hum aapki personal info ki suraksha ke liye industry-standard measures lagate hain.' },
      items: [
        { title: { en: '256-bit SSL Encryption', hi: '256-बिट SSL एन्क्रिप्शन', hinglish: '256-bit SSL Encryption' }, desc: { en: 'All data transmitted between your browser and our servers is encrypted using TLS 1.3 with 256-bit SSL certificates.', hi: 'आपके ब्राउज़र और हमारे सर्वर के बीच संचारित सभी डेटा TLS 1.3 के साथ 256-बिट SSL प्रमाणपत्रों का उपयोग करके एन्क्रिप्ट किया जाता है।', hinglish: 'Aapke browser aur hamare servers ke beech transmitted sab data TLS 1.3 ke saath 256-bit SSL certificates use karke encrypt hota hai.' } },
        { title: { en: 'AES-256 Data Encryption', hi: 'AES-256 डेटा एन्क्रिप्शन', hinglish: 'AES-256 Data Encryption' }, desc: { en: 'Personal data at rest is encrypted using AES-256 encryption standard — the same used by banks.', hi: 'आराम पर व्यक्तिगत डेटा AES-256 एन्क्रिप्शन मानक का उपयोग करके एन्क्रिप्ट किया जाता है — बैंकों द्वारा उपयोग किया जाने वाला समान।', hinglish: 'Personal data at rest AES-256 encryption standard use karke encrypt hota hai — same as banks use.' } },
        { title: { en: 'Secure Cloud Infrastructure', hi: 'सुरक्षित क्लाउड बुनियादी ढांचा', hinglish: 'Secure Cloud Infrastructure' }, desc: { en: 'Data is stored on secure, SOC 2 Type II certified cloud servers with regular security audits.', hi: 'डेटा सुरक्षित, SOC 2 Type II प्रमाणित क्लाउड सर्वर पर नियमित सुरक्षा ऑडिट के साथ संग्रहीत किया जाता है।', hinglish: 'Data secure, SOC 2 Type II certified cloud servers pe regular security audits ke saath stored hota hai.' } },
        { title: { en: 'Access Controls', hi: 'पहुंच नियंत्रण', hinglish: 'Access Controls' }, desc: { en: 'Strict role-based access controls (RBAC) ensure only authorized personnel can access your data.', hi: 'सख्त भूमिका-आधारित पहुंच नियंत्रण (RBAC) सुनिश्चित करते हैं कि केवल अधिकृत कर्मचारी ही आपके डेटा तक पहुंच सकें।', hinglish: 'Strict role-based access controls (RBAC) ensure karte hain ki sirf authorized personnel hi aapke data tak pahunch sake.' } },
      ],
    },
    {
      heading: { en: '4. Third-Party Sharing', hi: '4. तृतीय-पक्ष साझाकरण', hinglish: '4. Third-Party Sharing' },
      items: [
        { title: { en: 'Insurance Companies', hi: 'बीमा कंपनियाँ', hinglish: 'Insurance Companies' }, desc: { en: 'When you purchase a policy, your details are shared with the selected insurer to process your application.', hi: 'जब आप नीति खरीदते हैं, तो आपका विवरण चुनी हुई बीमा कंपनी के साथ साझा किया जाता है।', hinglish: 'Jab aap policy khareedte hain, toh aapka details selected insurer ke saath share kiya jata hai.' } },
        { title: { en: 'IRDAI', hi: 'आईआरडीएआई', hinglish: 'IRDAI' }, desc: { en: 'As required by IRDAI regulations, we maintain records that may be shared for compliance audits.', hi: 'IRDAI नियमों के अनुसार, हम रिकॉर्ड रखते हैं जो अनुपालन ऑडिट के लिए साझा किए जा सकते हैं।', hinglish: 'IRDAI regulations ke anusaar, hum records rakhte hain jo compliance audits ke liye share kiye ja sakte hain.' } },
        { title: { en: 'Service Providers', hi: 'सेवा प्रदाता', hinglish: 'Service Providers' }, desc: { en: 'We may use third-party services that process data on our behalf under strict data processing agreements.', hi: 'हम तृतीय-पक्ष सेवाओं का उपयोग कर सकते हैं जो सख्त डेटा प्रोसेसिंग समझौतों के तहत डेटा प्रोसेस करती हैं।', hinglish: 'Hum third-party services use kar sakte hain jo strict data processing agreements ke tahat data process karti hain.' } },
        { title: { en: 'Legal Requirements', hi: 'कानूनी आवश्यकताएं', hinglish: 'Legal Requirements' }, desc: { en: 'When required by law, court order, or government regulation, we may disclose information to the relevant authorities.', hi: 'जब कानून द्वारा आवश्यक हो, हम संबंधित अधिकारियों को जानकारी प्रकट कर सकते हैं।', hinglish: 'Jab law dwara zaroori ho, hum relevant authorities ko information disclose kar sakte hain.' } },
      ],
      neverSell: { en: 'We never sell your data to advertisers, data brokers, or any entity for marketing purposes.', hi: 'हम आपका डेटा कभी विज्ञापनदाताओं या डेटा दलालों को नहीं बेचते।', hinglish: 'Hum aapka data kabhi advertisers ya data brokers ko nahi bechte.' },
    },
    {
      heading: { en: '5. Cookies & Analytics', hi: '5. कुकीज़ और एनालिटिक्स', hinglish: '5. Cookies & Analytics' },
      intro: { en: 'We use cookies and similar technologies to improve your experience, analyze platform usage, and remember your preferences.', hi: 'हम आपके अनुभव को बेहतर बनाने, प्लेटफ़ॉर्म उपयोग का विश्लेषण करने, और आपकी प्राथमिकताएं याद रखने के लिए कुकीज़ और समान तकनीकों का उपयोग करते हैं।', hinglish: 'Hum aapke experience ko better banane, platform usage analyze karne, aur aapki preferences yaad rakhne ke liye cookies aur similar technologies use karte hain.' },
      items: [
        { title: { en: 'Essential Cookies', hi: 'आवश्यक कुकीज़', hinglish: 'Essential Cookies' }, desc: { en: 'Required for the platform to function properly — session management, security, and load balancing. Cannot be disabled.', hi: 'प्लेटफ़ॉर्म के ठीक से काम करने के लिए आवश्यक — सेशन प्रबंधन, सुरक्षा, और लोड बैलेंसिंग। अक्षम नहीं किया जा सकता।', hinglish: 'Platform ke properly kaam karne ke liye zaroori — session management, security, aur load balancing. Disable nahi kiya ja sakta.' } },
        { title: { en: 'Analytics Cookies', hi: 'एनालिटिक्स कुकीज़', hinglish: 'Analytics Cookies' }, desc: { en: 'Help us understand how users interact with our platform. We use anonymized data only.', hi: 'हमें समझने में मदद करते हैं कि उपयोगकर्ता हमारे प्लेटफ़ॉर्म के साथ कैसे इंटरैक्ट करते हैं। हम केवल गुमनाम डेटा का उपयोग करते हैं।', hinglish: 'Humey samajhne mein madad karte hain ki users hamare platform ke saath kaise interact karte hain. Hum sirf anonymized data use karte hain.' } },
        { title: { en: 'Preference Cookies', hi: 'प्राथमिकता कुकीज़', hinglish: 'Preference Cookies' }, desc: { en: 'Remember your settings — language preference, insurance category, and customization options.', hi: 'आपकी सेटिंग्स याद रखते हैं — भाषा वरीयता, बीमा श्रेणी, और अनुकूलन विकल्प।', hinglish: 'Aapki settings yaad rakhte hain — language preference, insurance category, aur customization options.' } },
      ],
    },
    {
      heading: { en: '6. Your Rights', hi: '6. आपके अधिकार', hinglish: '6. Your Rights' },
      intro: { en: 'Under the Information Technology Act, 2000 and applicable data protection regulations, you have the following rights:', hi: 'सूचना प्रौद्योगिकी अधिनियम, 2000 और लागू डेटा सुरक्षा विनियमों के तहत, आपके निम्नलिखित अधिकार हैं:', hinglish: 'Information Technology Act, 2000 aur applicable data protection regulations ke tahat, aapke following rights hain:' },
      items: [
        { title: { en: 'Right to Access', hi: 'पहुंच का अधिकार', hinglish: 'Right to Access' }, desc: { en: 'Request a copy of all personal data we hold about you.', hi: 'हमारे पास आपके बारे में मौजूद सभी व्यक्तिगत डेटा की प्रति का अनुरोध करें।', hinglish: 'Hamare paas aapke baare mein maujood sabhi personal data ki copy ka request karein.' } },
        { title: { en: 'Right to Correction', hi: 'सुधार का अधिकार', hinglish: 'Right to Correction' }, desc: { en: 'Request correction of any inaccurate or incomplete personal data.', hi: 'किसी भी गलत या अपूर्ण व्यक्तिगत डेटा के सुधार का अनुरोध करें।', hinglish: 'Kisi bhi galat ya incomplete personal data ke correction ka request karein.' } },
        { title: { en: 'Right to Deletion', hi: 'हटाने का अधिकार', hinglish: 'Right to Deletion' }, desc: { en: 'Request deletion of your personal data, subject to regulatory requirements.', hi: 'नियामक आवश्यकताओं के अधीन, अपने व्यक्तिगत डेटा को हटाने का अनुरोध करें।', hinglish: 'Regulatory requirements ke adheen, apne personal data ko delete karne ka request karein.' } },
        { title: { en: 'Right to Data Portability', hi: 'डेटा पोर्टेबिलिटी का अधिकार', hinglish: 'Right to Data Portability' }, desc: { en: 'Receive your data in a structured, machine-readable format.', hi: 'अपना डेटा संरचित, मशीन-पठनीय प्रारूप में प्राप्त करें।', hinglish: 'Apna data structured, machine-readable format mein receive karein.' } },
        { title: { en: 'Right to Withdraw Consent', hi: 'सहमति वापस लेने का अधिकार', hinglish: 'Right to Withdraw Consent' }, desc: { en: 'Withdraw consent at any time for data processing not required by law.', hi: 'कानून द्वारा आवश्यक न होने वाली डेटा प्रोसेसिंग के लिए किसी भी समय सहमति वापस लें।', hinglish: 'Law dwara zaroori na hone wali data processing ke liye kisi bhi time consent withdraw karein.' } },
        { title: { en: 'Right to Grievance Redressal', hi: 'शिकायत निवारण का अधिकार', hinglish: 'Right to Grievance Redressal' }, desc: { en: "File a complaint with our Grievance Officer or IRDAI's Bima Bharosa Portal.", hi: 'हमारे शिकायत अधिकारी या IRDAI के बीमा भरोसा पोर्टल पर शिकायत दर्ज करें।', hinglish: "Humara Grievance Officer ya IRDAI ke Bima Bharosa Portal pe complaint file karein." } },
      ],
      contactText: { en: 'To exercise any of these rights, contact us at', hi: 'इनमें से कोई भी अधिकार उपयोग करने के लिए, हमसे संपर्क करें', hinglish: 'Inme se koi bhi right use karne ke liye, humse contact karein' },
    },
    {
      heading: { en: '7. Data Retention Period', hi: '7. डेटा प्रतिधारण अवधि', hinglish: '7. Data Retention Period' },
      items: [
        { title: { en: 'Insurance Transaction Records', hi: 'बीमा लेनदेन रिकॉर्ड', hinglish: 'Insurance Transaction Records' }, period: '7 years', desc: { en: 'As required by IRDAI regulations, all insurance transaction records are maintained for a minimum of 7 years.', hi: 'IRDAI विनियमों के अनुसार, सभी बीमा लेनदेन रिकॉर्ड न्यूनतम 7 वर्षों के लिए बनाए रखे जाते हैं।', hinglish: 'IRDAI regulations ke anusaar, sabhi insurance transaction records minimum 7 saal ke liye maintain kiye jate hain.' } },
        { title: { en: 'Active Account Data', hi: 'सक्रिय खाता डेटा', hinglish: 'Active Account Data' }, period: 'Duration + 2 years', desc: { en: 'Personal data associated with an active account is retained while the account is active and for 2 years after last activity.', hi: 'सक्रिय खाते से जुड़ा व्यक्तिगत डेटा खाते के सक्रिय रहने तक और अंतिम गतिविधि के 2 वर्ष बाद तक बनाए रखा जाता है।', hinglish: 'Active account se juda personal data account ke active rahne tak aur last activity ke 2 saal baad tak retain kiya jata hai.' } },
        { title: { en: 'Chat & Query Data', hi: 'चैट और क्वेरी डेटा', hinglish: 'Chat & Query Data' }, period: '2 years', desc: { en: 'InsureGPT chat transcripts and query data are retained for 2 years for quality improvement and dispute resolution.', hi: 'InsureGPT चैट प्रतिलेख और क्वेरी डेटा गुणवत्ता सुधार और विवाद समाधान के लिए 2 वर्षों तक बनाए रखे जाते हैं।', hinglish: 'InsureGPT chat transcripts aur query data quality improvement aur dispute resolution ke liye 2 saal tak retain kiye jate hain.' } },
        { title: { en: 'Analytics Data', hi: 'एनालिटिक्स डेटा', hinglish: 'Analytics Data' }, period: '18 months', desc: { en: 'Anonymized analytics data is retained for 18 months for platform improvement purposes.', hi: 'गुमनाम एनालिटिक्स डेटा प्लेटफ़ॉर्म सुधार उद्देश्यों के लिए 18 महीने तक बनाए रखा जाता है।', hinglish: 'Anonymized analytics data platform improvement ke liye 18 months tak retain kiya jata hai.' } },
      ],
    },
    {
      heading: { en: "8. Children's Privacy", hi: '8. बच्चों की गोपनीयता', hinglish: "8. Children's Privacy" },
      text: { en: 'Our services are not directed at individuals under the age of 18. We do not knowingly collect personal information from children. If we discover that we have inadvertently collected personal data from a person under 18, we will take steps to delete such information promptly.', hi: 'हमारी सेवाएँ 18 वर्ष से कम आयु के व्यक्तियों के लिए निर्देशित नहीं हैं। हम जानबूझकर बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते। यदि हमें पता चलता है कि हमने अनजाने में 18 वर्ष से कम आयु के व्यक्ति से व्यक्तिगत डेटा एकत्र किया है, तो हम तुरंत ऐसी जानकारी हटाने के कदम उठाएंगे।', hinglish: 'Hamari services 18 saal se kam age ke individuals ke liye directed nahi hain. Hum jaan-boojh kar bachchon se personal info collect nahi karte. Agar humein pata chale ki humne anjaane mein 18 saal se kam age ke person se personal data collect kiya hai, toh hum turant aisi info delete karne ke kadam uthayenge.' },
    },
    {
      heading: { en: '9. Changes to This Policy', hi: '9. इस नीति में परिवर्तन', hinglish: '9. Changes to This Policy' },
      intro: { en: 'We may update this Privacy Policy from time to time. When we make material changes, we will:', hi: 'हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। जब हम महत्वपूर्ण परिवर्तन करते हैं, तो हम:', hinglish: 'Hum time-to-time is Privacy Policy ko update kar sakte hain. Jab hum material changes karte hain, toh hum:' },
      items: [
        { en: 'Update the "Last Updated" date at the top of this page', hi: 'इस पृष्ठ के शीर्ष पर "अंतिम अपडेट" तिथि अपडेट करेंगे', hinglish: '"Last Updated" date update karenge page ke top pe' },
        { en: 'Notify you via email or WhatsApp for significant changes', hi: 'महत्वपूर्ण परिवर्तनों के लिए ईमेल या WhatsApp द्वारा सूचित करेंगे', hinglish: 'Significant changes ke liye email ya WhatsApp pe notify karenge' },
        { en: 'Provide a summary of key changes on our website', hi: 'हमारी वेबसाइट पर मुख्य परिवर्तनों का सारांश प्रदान करेंगे', hinglish: 'Hamari website pe key changes ka summary provide karenge' },
      ],
      continuedUse: { en: 'Your continued use of our platform after changes are posted constitutes your acceptance of the updated policy.', hi: 'परिवर्तन पोस्ट होने के बाद हमारे प्लेटफ़ॉर्म का आपका निरंतर उपयोग अद्यतन नीति की आपकी स्वीकृति माना जाता है।', hinglish: 'Changes post hone ke baad hamare platform ka aapka continued use updated policy ki aapki acceptance maana jata hai.' },
    },
    {
      heading: { en: '10. Contact Information', hi: '10. संपर्क जानकारी', hinglish: '10. Contact Information' },
      intro: { en: 'If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:', hi: 'यदि आपको इस गोपनीयता नीति के बारे में कोई प्रश्न, चिंता या अनुरोध है, तो कृपया हमसे संपर्क करें:', hinglish: 'Agar aapko is Privacy Policy ke baare mein koi question, concern ya request hai, toh kripya humse contact karein:' },
      irdaiTitle: { en: 'IRDAI Grievance Redressal', hi: 'IRDAI शिकायत निवारण', hinglish: 'IRDAI Grievance Redressal' },
      irdaiText: { en: "For unresolved privacy complaints, contact IRDAI's Bima Bharosa Portal or call 1800-258-1111 (Toll Free).", hi: 'अनसुलझी गोपनीयता शिकायतों के लिए, IRDAI के बीमा भरोसा पोर्टल से संपर्क करें या 1800-258-1111 (टोल फ्री) पर कॉल करें।', hinglish: "Unresolved privacy complaints ke liye, IRDAI ke Bima Bharosa Portal se contact karein ya 1800-258-1111 (Toll Free) pe call karein." },
    },
  ],
  cta: {
    backToHome: { en: 'Back to Home', hi: 'होम पेज वापस', hinglish: 'Back to Home' },
    chatLabel: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें', hinglish: 'WhatsApp pe Chat Karein' },
  },
};

/* ── Section Icons mapping ─────────────────────────────────────────────── */
const sectionIcons = [Database, Eye, Lock, Share2, Cookie, UserCheck, Clock, Baby, FileText, Phone];

/* ── Section Divider ─────────────────────────────────────────────────────── */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="mx-3 h-1.5 w-1.5 rounded-full bg-primary/40" />
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

export default function PrivacyPolicyClientContent() {
  const { language } = useLanguage();
  const pt = (obj: Tr) => obj[language] || obj.en;

  return (
    <>
      {/* ═══════════════════ PAGE HEADER ═══════════════════ */}
      <section
        className="relative overflow-hidden py-14 md:py-20"
        style={{ background: `linear-gradient(135deg, ${NAVY_800} 0%, ${NAVY_600} 50%, #082247 100%)` }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-white/50 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80">{pt(pageText.hero.title)}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {pt(pageText.hero.title)}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto mb-4">
            {pt(pageText.hero.subtitle)}
          </p>
          <p className="text-xs font-medium text-white/50">
            {pt(pageText.hero.lastUpdated)}
          </p>
        </div>
      </section>

      {/* ═══════════════════ MAIN CONTENT + SIDEBAR ═══════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Table of Contents */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="glass-card p-5" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
                <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: GOLD }} /> {pt(pageText.toc)}
                </h3>
                <nav className="space-y-1">
                  {pageText.sections.map((s, i) => (
                    <a key={i} href={`#section-${i}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground/80 hover:text-foreground hover:bg-primary/5 transition-colors group">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 group-hover:text-foreground transition-colors"
                        style={{ background: 'rgba(201,138,28,0.1)', color: GOLD }}
                      >
                        {i + 1}
                      </span>
                      <span className="truncate">{pt(s.heading)}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Content Sections */}
          <div className="flex-1 min-w-0 space-y-6">
            {pageText.sections.map((section, sIdx) => {
              const SIcon = sectionIcons[sIdx];
              return (
                <div key={sIdx} id={`section-${sIdx}`} className="glass-card p-6 sm:p-8 scroll-mt-24 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})` }}>
                      <SIcon className="w-5 h-5" style={{ color: GOLD }} />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{pt(section.heading)}</h2>
                  </div>

                  {/* Section 1: Info Collection - subsections */}
                  {'subsections' in section && section.subsections && (
                    <div className="space-y-5">
                      {section.subsections.map((sub: { title: Tr; desc: Tr }, i: number) => (
                        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.04)' }}>
                          <h3 className="font-semibold text-foreground mb-2">{pt(sub.title)}</h3>
                          <p className="text-sm text-foreground/85">{pt(sub.desc)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sections with items list */}
                  {'items' in section && section.items && (
                    <div className="space-y-3">
                      {'intro' in section && section.intro && (
                        <p className="text-sm text-foreground/85 mb-4">{pt(section.intro as Tr)}</p>
                      )}
                      {section.items.map((item: Record<string, Tr>, i: number) => (
                        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.04)' }}>
                          {'title' in item && <h3 className="text-sm font-semibold text-foreground mb-1">{pt(item.title)}</h3>}
                          {'desc' in item && <p className="text-sm text-foreground/85">{pt(item.desc)}</p>}
                          {'period' in item && (
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md inline-block mt-2"
                              style={{ background: 'rgba(201,138,28,0.12)', color: GOLD }}>
                              {(item as Record<string, unknown>).period as string}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Important/never sell notice */}
                  {'important' in section && (
                    <div className="mt-5 rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.08)', border: '1px solid rgba(201,138,28,0.2)' }}>
                      <p className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <AlertTriangle className="w-4 h-4" style={{ color: GOLD }} /> {pt(section.important as Tr)}
                      </p>
                    </div>
                  )}
                  {'neverSell' in section && (
                    <div className="mt-5 rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.08)', border: '1px solid rgba(201,138,28,0.2)' }}>
                      <p className="text-sm font-medium text-foreground">{pt(section.neverSell as Tr)}</p>
                    </div>
                  )}

                  {/* Text-only sections (Children's Privacy, Changes) */}
                  {'text' in section && (
                    <p className="text-sm text-foreground/85">{pt(section.text as Tr)}</p>
                  )}

                  {/* Continued use text */}
                  {'continuedUse' in section && (
                    <p className="text-sm text-foreground/85 mt-4">{pt(section.continuedUse as Tr)}</p>
                  )}

                  {/* Contact section specifics */}
                  {sIdx === 9 && (
                    <>
                      <p className="text-sm text-foreground/85 mb-5">{pt(pageText.sections[9].intro as Tr)}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                        <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"
                          className="rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-md"
                          style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                          <MessageCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
                          <h3 className="text-sm font-bold text-foreground">WhatsApp</h3>
                          <p className="text-xs" style={{ color: GOLD }}>+91 9257877312</p>
                        </a>
                        <a href="mailto:himanshupaliwalpbp@gmail.com"
                          className="rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-md"
                          style={{ background: 'rgba(201,138,28,0.06)', border: '1px solid rgba(201,138,28,0.15)' }}>
                          <Mail className="w-6 h-6 mx-auto mb-2" style={{ color: GOLD }} />
                          <h3 className="text-sm font-bold text-foreground">Email</h3>
                          <p className="text-xs" style={{ color: GOLD }}>himanshupaliwalpbp@gmail.com</p>
                        </a>
                        <div className="rounded-xl p-4 text-center"
                          style={{ background: 'rgba(201,138,28,0.06)', border: '1px solid rgba(201,138,28,0.15)' }}>
                          <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: GOLD }} />
                          <h3 className="text-sm font-bold text-foreground">Location</h3>
                          <p className="text-xs" style={{ color: GOLD }}>Kota, Rajasthan, India</p>
                        </div>
                      </div>
                      <div className="rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.06)' }}>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Shield className="w-4 h-4" style={{ color: GOLD }} /> {pt(pageText.sections[9].irdaiTitle as Tr)}
                        </p>
                        <p className="text-sm text-foreground/85 mt-1">{pt(pageText.sections[9].irdaiText as Tr)}</p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ BACK TO HOME ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm">
              <span>{pt(pageText.cta.backToHome)}</span>
            </ShinyButton>
          </Link>
          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
            <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm">
              <span>{pt(pageText.cta.chatLabel)}</span>
            </ShinyButton>
          </a>
        </div>
      </section>
    </>
  );
}
