'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import {
  Shield, MapPin, Phone, MessageCircle, CheckCircle2, Users,
  Heart, Car, Plane, Home, Umbrella, Star, Award, Clock,
  ChevronRight, ArrowRight, BadgeCheck, Headphones, TrendingDown,
  Stethoscope, Baby, Building2, Globe, Navigation, IndianRupee
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
    title1: { en: "Insurance Agent in", hi: "बीमा एजेंट", hinglish: "Insurance Agent in" },
    titleHighlight: { en: "Kota", hi: "कोटा", hinglish: "Kota" },
    titleSuffix: { en: "Rajasthan", hi: "राजस्थान", hinglish: "Rajasthan" },
    description: {
      en: "Trusted insurance advisor in Kota, Rajasthan. Compare 51+ insurers, get free consultation for health, motor, life & travel insurance. By Himanshu Paliwal — IRDAI Registered POSP (IP429834). Near MBS Hospital, Kota.",
      hi: "कोटा, राजस्थान में विश्वसनीय बीमा सलाहकार। 51+ बीमाकर्ताओं की तुलना करें, स्वास्थ्य, मोटर, जीवन और यात्रा बीमे के लिए मुफ़्त परामर्श प्राप्त करें। हिमांशु पालीवाल द्वारा — IRDAI पंजीकृत POSP (IP429834)। MBS अस्पताल के पास, कोटा।",
      hinglish: "Kota, Rajasthan mein trusted insurance advisor. 51+ insurers compare karein, health, motor, life aur travel insurance ke liye free consultation paayein. By Himanshu Paliwal — IRDAI Registered POSP (IP429834). Near MBS Hospital, Kota."
    },
    ctaCompare: { en: "Compare Insurance Plans", hi: "बीमा योजनाएं तुलना करें", hinglish: "Insurance Plans Compare Karein" },
    ctaWhatsApp: { en: "Chat on WhatsApp", hi: "WhatsApp पर चैट करें", hinglish: "WhatsApp pe Chat Karein" },
    stat1Value: { en: "51+", hi: "51+", hinglish: "51+" },
    stat1Label: { en: "Insurers Compared", hi: "बीमाकर्ताओं की तुलना", hinglish: "Insurers Compared" },
    stat2Value: { en: "500+", hi: "500+", hinglish: "500+" },
    stat2Label: { en: "Families Served", hi: "परिवार सेवित", hinglish: "Families Served" },
    stat3Value: { en: "24/7", hi: "24/7", hinglish: "24/7" },
    stat3Label: { en: "Support Available", hi: "सहायता उपलब्ध", hinglish: "Support Available" },
    stat4Value: { en: "₹0", hi: "₹0", hinglish: "₹0" },
    stat4Label: { en: "Consultation Fee", hi: "परामर्श शुल्क", hinglish: "Consultation Fee" },
  },
  breadcrumb: {
    home: { en: "Home", hi: "होम", hinglish: "Home" },
    current: { en: "Insurance Agent Kota", hi: "बीमा एजेंट कोटा", hinglish: "Insurance Agent Kota" },
  },
  insuranceTypes: {
    heading1: { en: "Insurance Services in", hi: "बीमा सेवाएं", hinglish: "Insurance Services in" },
    headingHighlight: { en: "Kota", hi: "कोटा", hinglish: "Kota" },
    description: {
      en: "Complete insurance solutions for Kota residents. From health to motor, life to travel — we compare 51+ insurers to find you the best plan at the lowest premium.",
      hi: "कोटा निवासियों के लिए संपूर्ण बीमा समाधान। स्वास्थ्य से मोटर, जीवन से यात्रा — हम 51+ बीमाकर्ताओं की तुलना करके आपको सबसे अच्छी योजना सबसे कम प्रीमियम पर ढूंढते हैं।",
      hinglish: "Kota residents ke liye complete insurance solutions. Health se motor, life se travel — hum 51+ insurers compare karke aapko best plan lowest premium pe dhoondhte hain."
    },
    types: [
      { name: { en: "Health Insurance", hi: "स्वास्थ्य बीमा", hinglish: "Health Insurance" }, desc: { en: "Cashless treatment at Kota hospitals. Coverage from ₹3L to ₹1Cr.", hi: "कोटा अस्पतालों में कैशलेस उपचार। ₹3L से ₹1Cr तक कवरेज।", hinglish: "Kota hospitals mein cashless treatment. Coverage from ₹3L to ₹1Cr." } },
      { name: { en: "Car Insurance", hi: "कार बीमा", hinglish: "Car Insurance" }, desc: { en: "Comprehensive & third-party cover. Zero dep, roadside assistance included.", hi: "कॉम्प्रिहेंसिव और थर्ड-पार्टी कवर। ज़ीरो डेप, रोडसाइड असिस्टेंस शामिल।", hinglish: "Comprehensive & third-party cover. Zero dep, roadside assistance included." } },
      { name: { en: "Bike Insurance", hi: "बाइक बीमा", hinglish: "Bike Insurance" }, desc: { en: "Instant policy for bikes & scooters. Lowest premiums guaranteed.", hi: "बाइक और स्कूटर के लिए तत्काल पॉलिसी। सबसे कम प्रीमियम की गारंटी।", hinglish: "Bikes & scooters ke liye instant policy. Lowest premiums guaranteed." } },
      { name: { en: "Life Insurance", hi: "जीवन बीमा", hinglish: "Life Insurance" }, desc: { en: "Term plans starting ₹500/month. Secure your family's future today.", hi: "₹500/माह से शुरू होने वाली टर्म योजनाएं। आज ही अपने परिवार का भविष्य सुरक्षित करें।", hinglish: "Term plans starting ₹500/month. Aaj hi apne parivaar ka bhavishya secure karein." } },
      { name: { en: "Travel Insurance", hi: "यात्रा बीमा", hinglish: "Travel Insurance" }, desc: { en: "Domestic & international travel cover. Trip cancellation, baggage loss covered.", hi: "घरेलू और अंतरराष्ट्रीय यात्रा कवर। ट्रिप रद्दीकरण, सामान हानि कवर।", hinglish: "Domestic & international travel cover. Trip cancellation, baggage loss covered." } },
      { name: { en: "Home Insurance", hi: "गृह बीमा", hinglish: "Home Insurance" }, desc: { en: "Protect your home from fire, theft, natural disasters. Complete property cover.", hi: "आग, चोरी, प्राकृतिक आपदा से अपने घर की रक्षा करें। पूर्ण संपत्ति कवर।", hinglish: "Aag, chori, natural disaster se apne ghar ki raksha karein. Complete property cover." } },
    ],
  },
  whyChoose: {
    heading1: { en: "Why Choose", hi: "क्यों चुनें", hinglish: "Why Choose" },
    headingHighlight: { en: "Paliwal Secure AI", hi: "पालीवाल सिक्योर AI", hinglish: "Paliwal Secure AI" },
    headingSuffix: { en: "in Kota?", hi: "कोटा में?", hinglish: "in Kota?" },
    description: {
      en: "We are Kota's most trusted insurance advisory. Here's why 500+ families choose us for their insurance needs.",
      hi: "हम कोटा के सबसे विश्वसनीय बीमा सलाहकार हैं। यहां बताया गया है कि 500+ परिवार हमें क्यों चुनते हैं।",
      hinglish: "Hum Kota ke most trusted insurance advisor hain. Yahan bataya gaya hai ki 500+ families humein kyun chunte hain."
    },
    reasons: [
      { title: { en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" }, desc: { en: "Registered POSP with code IP429834. All transactions comply with IRDAI regulations.", hi: "कोड IP429834 के साथ पंजीकृत POSP। सभी लेनदेन IRDAI विनियमों का पालन करते हैं।", hinglish: "Registered POSP with code IP429834. All transactions IRDAI regulations ke comply hain." } },
      { title: { en: "51+ Insurers Compared", hi: "51+ बीमाकर्ताओं की तुलना", hinglish: "51+ Insurers Compared" }, desc: { en: "We compare plans from all major insurers so you get the best coverage at the lowest premium.", hi: "हम सभी प्रमुख बीमाकर्ताओं की योजनाओं की तुलना करते हैं ताकि आपको सबसे अच्छा कवरेज सबसे कम प्रीमियम पर मिले।", hinglish: "Hum sabhi major insurers ki plans compare karte hain taaki aapko best coverage lowest premium pe mile." } },
      { title: { en: "Free Consultation", hi: "मुफ़्त परामर्श", hinglish: "Free Consultation" }, desc: { en: "No fees, no obligation. Get expert advice on choosing the right insurance plan for your needs.", hi: "कोई शुल्क नहीं, कोई दायित्व नहीं। अपनी ज़रूरतों के लिए सही बीमा योजना चुनने पर विशेषज्ञ सलाह प्राप्त करें।", hinglish: "No fees, no obligation. Apni zarooraton ke liye sahi insurance plan chune par expert advice paayein." } },
      { title: { en: "Same Premium as Insurer", hi: "बीमाकर्ता जैसा ही प्रीमियम", hinglish: "Same Premium as Insurer" }, desc: { en: "You pay the same premium as buying directly from the insurer. Our service is free for you.", hi: "आप वही प्रीमियम चुकाते हैं जो सीधे बीमाकर्ता से खरीदने पर। हमारी सेवा आपके लिए मुफ़्त है।", hinglish: "Aap wahi premium chukate hain jo seedha insurer se khareedne par. Hamari service aapke liye free hai." } },
      { title: { en: "Claim Assistance", hi: "क्लेम सहायता", hinglish: "Claim Assistance" }, desc: { en: "End-to-end claim support. We help you file, track, and settle claims smoothly.", hi: "अंत-से-अंत क्लेम सहायता। हम आपको क्लेम दाखिल करने, ट्रैक करने और निपटाने में मदद करते हैं।", hinglish: "End-to-end claim support. Hum aapko claim file karne, track karne aur settle karne mein madad karte hain." } },
      { title: { en: "Kota Local Expert", hi: "कोटा स्थानीय विशेषज्ञ", hinglish: "Kota Local Expert" }, desc: { en: "We know Kota's hospitals, garages, and local needs. Personalized service for Kota residents.", hi: "हम कोटा के अस्पतालों, गैराज और स्थानीय ज़रूरतों को जानते हैं। कोटा निवासियों के लिए व्यक्तिगत सेवा।", hinglish: "Hum Kota ke hospitals, garages aur local needs jaante hain. Kota residents ke liye personalized service." } },
    ],
  },
  kotaHospitals: {
    heading1: { en: "Cashless Network in", hi: "कैशलेस नेटवर्क", hinglish: "Cashless Network in" },
    headingHighlight: { en: "Kota", hi: "कोटा", hinglish: "Kota" },
    description: {
      en: "Get cashless treatment at these major hospitals in Kota. Our health insurance plans cover network hospitals across the city.",
      hi: "कोटा के इन प्रमुख अस्पतालों में कैशलेस उपचार प्राप्त करें। हमारी स्वास्थ्य बीमा योजनाएं शहर भर के नेटवर्क अस्पतालों को कवर करती हैं।",
      hinglish: "Kota ke in pramukh aspatalon mein cashless upchaar paayein. Hamari health insurance plans shehar bhar ke network hospitals ko cover karti hain."
    },
    hospitals: [
      { name: "MBS Hospital", type: { en: "Government Hospital", hi: "सरकारी अस्पताल", hinglish: "Government Hospital" } },
      { name: "JK Lone Hospital", type: { en: "Multi-specialty", hi: "बहु-विशेषता", hinglish: "Multi-specialty" } },
      { name: "Kota Heart Hospital", type: { en: "Cardiac Care", hi: "हृदय देखभाल", hinglish: "Cardiac Care" } },
      { name: "Sudha Hospital", type: { en: "General & Maternity", hi: "सामान्य और प्रसूति", hinglish: "General & Maternity" } },
      { name: "Bhagwan Mahavir Hospital", type: { en: "Multi-specialty", hi: "बहु-विशेषता", hinglish: "Multi-specialty" } },
      { name: "Kota Cancer Hospital", type: { en: "Oncology Center", hi: "कैंसर केंद्र", hinglish: "Oncology Center" } },
    ],
  },
  process: {
    heading1: { en: "How to Get", hi: "कैसे प्राप्त करें", hinglish: "How to Get" },
    headingHighlight: { en: "Insurance in Kota", hi: "कोटा में बीमा", hinglish: "Insurance in Kota" },
    steps: [
      { step: 1, title: { en: "Tell Us Your Needs", hi: "अपनी ज़रूरतें बताएं", hinglish: "Apni Zarooratein Batayein" }, desc: { en: "Call us or chat on WhatsApp. Tell us what insurance you need — health, motor, life, or travel.", hi: "हमें कॉल करें या WhatsApp पर चैट करें। बताएं आपको कौन सा बीमा चाहिए।", hinglish: "Hummein call karein ya WhatsApp pe chat karein. Batayein aapko kaun sa insurance chahiye." } },
      { step: 2, title: { en: "Get AI-Powered Comparison", hi: "AI-संचालित तुलना प्राप्त करें", hinglish: "AI-Powered Comparison Paayein" }, desc: { en: "Our AI compares 51+ insurers instantly. Get personalized recommendations based on your needs and budget.", hi: "हमारा AI तुरंत 51+ बीमाकर्ताओं की तुलना करता है। अपनी ज़रूरतों और बजट के आधार पर व्यक्तिगत सिफारिशें प्राप्त करें।", hinglish: "Hamara AI turant 51+ insurers compare karta hai. Apni zarooraton aur budget ke aadhar par personalized recommendations paayein." } },
      { step: 3, title: { en: "Choose & Buy Online", hi: "चुनें और ऑनलाइन खरीदें", hinglish: "Choose & Buy Online" }, desc: { en: "Select the best plan, pay securely, and get your policy instantly via email. No paperwork needed.", hi: "सबसे अच्छी योजना चुनें, सुरक्षित भुगतान करें, और ईमेल से तुरंत अपनी पॉलिसी प्राप्त करें। कोई कागज़ी कार्रवाई नहीं।", hinglish: "Best plan chunein, secure payment karein, aur email se turant apni policy paayein. No paperwork needed." } },
      { step: 4, title: { en: "Lifetime Claim Support", hi: "जीवनभर क्लेम सहायता", hinglish: "Lifetime Claim Support" }, desc: { en: "We assist with claim filing, documentation, and follow-up. You're never alone during claims.", hi: "हम क्लेम दाखिल करने, दस्तावेज़ीकरण और फॉलो-अप में सहायता करते हैं। क्लेम के दौरान आप कभी अकेले नहीं हैं।", hinglish: "Hum claim filing, documentation aur follow-up mein madad karte hain. Claim ke dauran aap kabhi akele nahi hain." } },
    ],
  },
  advisor: {
    heading1: { en: "Your Insurance Advisor in", hi: "आपके बीमा सलाहकार", hinglish: "Your Insurance Advisor in" },
    headingHighlight: { en: "Kota", hi: "कोटा", hinglish: "Kota" },
    name: { en: "Himanshu Paliwal", hi: "हिमांशु पालीवाल", hinglish: "Himanshu Paliwal" },
    title: { en: "IRDAI Registered POSP", hi: "IRDAI पंजीकृत POSP", hinglish: "IRDAI Registered POSP" },
    pospCode: "IP429834",
    location: { en: "Near MBS Hospital, Kota, Rajasthan", hi: "MBS अस्पताल के पास, कोटा, राजस्थान", hinglish: "Near MBS Hospital, Kota, Rajasthan" },
    phone: "+91 9257877312",
    email: "himanshupaliwalpbp@gmail.com",
    certifications: [
      { en: "IRDAI Registered POSP", hi: "IRDAI पंजीकृत POSP", hinglish: "IRDAI Registered POSP" },
      { en: "Insurance Comparison Expert", hi: "बीमा तुलना विशेषज्ञ", hinglish: "Insurance Comparison Expert" },
      { en: "Claim Settlement Specialist", hi: "क्लेम निपटान विशेषज्ञ", hinglish: "Claim Settlement Specialist" },
    ],
  },
  faq: {
    heading1: { en: "Frequently Asked", hi: "अक्सर पूछे जाने वाले", hinglish: "Frequently Asked" },
    headingHighlight: { en: "Questions", hi: "सवाल", hinglish: "Questions" },
    list: [
      {
        q: { en: "Why should I buy insurance through an agent in Kota?", hi: "कोटा में एजेंट के माध्यम से बीमा क्यों खरीदना चाहिए?", hinglish: "Kota mein agent ke madhyam se insurance kyun khareedna chahiye?" },
        a: { en: "Buying through a local agent gives you personalized service, claim support, and expert advice — at the same premium as buying directly. You get local knowledge of hospitals, garages, and network coverage that online platforms can't provide.", hi: "स्थानीय एजेंट के माध्यम से खरीदने पर आपको व्यक्तिगत सेवा, क्लेम सहायता और विशेषज्ञ सलाह मिलती है — सीधे खरीदने जैसा ही प्रीमियम। आपको अस्पतालों, गैराज और नेटवर्क कवरेज का स्थानीय ज्ञान मिलता है।", hinglish: "Local agent ke through khareedne par aapko personalized service, claim support aur expert advice milti hai — same premium as buying directly. Aapko hospitals, garages aur network coverage ka local knowledge milta hai." }
      },
      {
        q: { en: "Is there any extra charge for using your service?", hi: "आपकी सेवा का उपयोग करने के लिए कोई अतिरिक्त शुल्क है?", hinglish: "Kya aapki service use karne ke liye koi extra charge hai?" },
        a: { en: "No! Our consultation and comparison service is completely free. You pay the same premium as you would pay directly to the insurance company. The insurer pays us a commission — it doesn't affect your premium at all.", hi: "नहीं! हमारी परामर्श और तुलना सेवा पूरी तरह मुफ़्त है। आप वही प्रीमियम चुकाते हैं जो सीधे बीमा कंपनी को चुकाते। बीमाकर्ता हमें कमीशन देता है — इससे आपके प्रीमियम पर कोई प्रभाव नहीं पड़ता।", hinglish: "Nahi! Hamari consultation aur comparison service poori tarah free hai. Aap wahi premium chukate hain jo seedha insurance company ko. Insurer humein commission deta hai — isse aapke premium par koi prabhav nahi padta." }
      },
      {
        q: { en: "Which hospitals in Kota offer cashless treatment?", hi: "कोटा के कौन से अस्पताल कैशलेस उपचार देते हैं?", hinglish: "Kota ke kaun se hospitals cashless treatment dete hain?" },
        a: { en: "Most major hospitals in Kota are part of insurer networks — including MBS Hospital, JK Lone Hospital, Kota Heart Hospital, Sudha Hospital, and many more. We help you choose plans with the widest network in Kota for maximum cashless coverage.", hi: "कोटा के अधिकांश प्रमुख अस्पताल बीमाकर्ता नेटवर्क का हिस्सा हैं — MBS अस्पताल, JK Lone अस्पताल, कोटा हार्ट अस्पताल, सुधा अस्पताल और कई अन्य शामिल हैं। हम अधिकतम कैशलेस कवरेज के लिए कोटा में सबसे व्यापक नेटवर्क वाली योजनाएं चुनने में मदद करते हैं।", hinglish: "Most major hospitals Kota mein insurer networks ka hissa hain — MBS Hospital, JK Lone Hospital, Kota Heart Hospital, Sudha Hospital aur kai aur shamil hain. Hum maximum cashless coverage ke liye Kota mein widest network wali plans chune mein madad karte hain." }
      },
      {
        q: { en: "Do you help with insurance claims in Kota?", hi: "क्या आप कोटा में बीमा क्लेम में मदद करते हैं?", hinglish: "Kya aap Kota mein insurance claims mein madad karte hain?" },
        a: { en: "Yes! We provide end-to-end claim assistance. From documentation to filing, hospital coordination to follow-up — we're with you throughout the entire claim process. This service is free for all our customers.", hi: "हां! हम अंत-से-अंत क्लेम सहायता प्रदान करते हैं। दस्तावेज़ीकरण से दाखिल करने, अस्पताल समन्वय से फॉलो-अप तक — हम पूरी क्लेम प्रक्रिया में आपके साथ हैं। यह सेवा हमारे सभी ग्राहकों के लिए मुफ़्त है।", hinglish: "Haan! Hum end-to-end claim assistance pradaan karte hain. Documentation se filing, hospital coordination se follow-up tak — hum poori claim process mein aapke saath hain. Yeh service hamare saari customers ke liye free hai." }
      },
      {
        q: { en: "Can I compare car insurance plans for my Kota-registered vehicle?", hi: "क्या मैं अपने कोटा-पंजीकृत वाहन के लिए कार बीमा योजनाओं की तुलना कर सकता हूं?", hinglish: "Kya main apne Kota-registered vehicle ke liye car insurance plans compare kar sakta hoon?" },
        a: { en: "Absolutely! We compare car insurance from 51+ insurers for vehicles registered in Kota (RJ-27). Whether it's comprehensive, third-party, or zero dep — we find you the best deal with maximum coverage.", hi: "बिलकुल! हम कोटा (RJ-27) में पंजीकृत वाहनों के लिए 51+ बीमाकर्ताओं से कार बीमा की तुलना करते हैं। चाहे कॉम्प्रिहेंसिव, थर्ड-पार्टी या ज़ीरो डेप हो — हम आपको अधिकतम कवरेज के साथ सबसे अच्छा डील ढूंढते हैं।", hinglish: "Bilkul! Hum Kota (RJ-27) mein registered vehicles ke liye 51+ insurers se car insurance compare karte hain. Chahe comprehensive, third-party ya zero dep ho — hum aapko maximum coverage ke saath best deal dhoondhte hain." }
      },
      {
        q: { en: "What insurance is mandatory in Kota, Rajasthan?", hi: "कोटा, राजस्थान में कौन सा बीमा अनिवार्य है?", hinglish: "Kota, Rajasthan mein kaun sa insurance mandatory hai?" },
        a: { en: "In Kota (and all of India), third-party motor insurance is legally mandatory for all vehicles. Health insurance is highly recommended. For employers with 20+ employees, ESI coverage may apply. We can advise you on all mandatory and recommended insurance for Kota residents.", hi: "कोटा (और पूरे भारत में), सभी वाहनों के लिए थर्ड-पार्टी मोटर बीमा कानूनी रूप से अनिवार्य है। स्वास्थ्य बीमा अत्यधिक अनुशंसित है। 20+ कर्मचारियों वाले नियोक्ताओं के लिए ESI कवरेज लागू हो सकता है। हम कोटा निवासियों के लिए सभी अनिवार्य और अनुशंसित बीमे पर सलाह दे सकते हैं।", hinglish: "Kota (aur poore India mein), third-party motor insurance legally mandatory hai sabhi vehicles ke liye. Health insurance highly recommended hai. 20+ employees wale employers ke liye ESI coverage laga ho sakta hai. Hum Kota residents ke liye sabhi mandatory aur recommended insurance par advice de sakte hain." }
      },
      {
        q: { en: "How quickly can I get insurance in Kota?", hi: "कोटा में मुझे कितनी जल्दी बीमा मिल सकता है?", hinglish: "Kota mein mujhe kitni jaldi insurance mil sakta hai?" },
        a: { en: "Instantly! Most policies are issued within minutes of payment. Car and bike insurance can be purchased and activated immediately. Health insurance typically activates after a waiting period of 30-90 days for pre-existing conditions. We ensure the fastest processing for all Kota customers.", hi: "तुरंत! अधिकांश पॉलिसी भुगतान के कुछ ही मिनटों में जारी की जाती हैं। कार और बाइक बीमा तुरंत खरीदा और सक्रिय किया जा सकता है। स्वास्थ्य बीमा आमतौर पर पहले से मौजूद बीमारियों के लिए 30-90 दिनों की प्रतीक्षा अवधि के बाद सक्रिय होता है।", hinglish: "Turant! Most policies payment ke kuch hi minutes mein issue hoti hain. Car aur bike insurance turant khareeda aur activate kiya ja sakta hai. Health insurance aam taur pe pre-existing conditions ke liye 30-90 days ki waiting period ke baad activate hota hai." }
      },
    ],
  },
  cta: {
    heading1: { en: "Get the Best Insurance in", hi: "सबसे अच्छा बीमा प्राप्त करें", hinglish: "Get the Best Insurance in" },
    headingHighlight: { en: "Kota", hi: "कोटा", hinglish: "Kota" },
    description: {
      en: "Compare 51+ insurers, get AI-powered recommendations, and buy insurance at the same premium as the insurer. Free consultation for all Kota residents.",
      hi: "51+ बीमाकर्ताओं की तुलना करें, AI-संचालित सिफारिशें प्राप्त करें, और बीमाकर्ता जैसा ही प्रीमियम पर बीमा खरीदें। सभी कोटा निवासियों के लिए मुफ़्त परामर्श।",
      hinglish: "51+ insurers compare karein, AI-powered recommendations paayein, aur insurer jaisa hi premium pe insurance khareedein. Free consultation for all Kota residents."
    },
    ctaCompare: { en: "Compare Insurance Plans", hi: "बीमा योजनाएं तुलना करें", hinglish: "Insurance Plans Compare Karein" },
    ctaWhatsApp: { en: "WhatsApp: 9257877312", hi: "WhatsApp: 9257877312", hinglish: "WhatsApp: 9257877312" },
    trustLine: { en: "✓ Free Consultation · ✓ Same Premium as Insurer · ✓ IRDAI Registered POSP (IP429834) · ✓ Kota Local Expert", hi: "✓ मुफ़्त परामर्श · ✓ बीमाकर्ता जैसा ही प्रीमियम · ✓ IRDAI पंजीकृत POSP (IP429834) · ✓ कोटा स्थानीय विशेषज्ञ", hinglish: "✓ Free Consultation · ✓ Same Premium as Insurer · ✓ IRDAI Registered POSP (IP429834) · ✓ Kota Local Expert" },
  },
};

// ── FAQ data for JSON-LD (always in English for SEO) ──────────────────────
const faqJsonLd = pageText.faq.list.map((faq) => ({
  q: faq.q.en,
  a: faq.a.en,
}));

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

  const insuranceIcons = [Heart, Car, Umbrella, Shield, Globe, Home];

  return (
    <div>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════ Hero Section ═══════════ */}
      <section className="relative overflow-hidden py-16 md:py-24"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${DARK_NAVY} 50%, #082247 100%)` }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-white/50 mb-5">
            <Link href="/" className="hover:text-white transition-colors">{tr(pageText.hero.badge) !== pageText.hero.badge.en ? tr(pageText.breadcrumb.home) : "Home"}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80">{tr(pageText.breadcrumb.current)}</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{tr(pageText.hero.badge)}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {tr(pageText.hero.title1)}{' '}
            <span className="gradient-text">{tr(pageText.hero.titleHighlight)}</span>
            {' '}{tr(pageText.hero.titleSuffix)}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto mb-8">
            {tr(pageText.hero.description)}
          </p>

          {/* CTAs with ShinyButton */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/compare">
              <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span>{tr(pageText.hero.ctaCompare)}</span>
              </ShinyButton>
            </Link>
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> {tr(pageText.hero.ctaWhatsApp)}</span>
              </ShinyButton>
            </a>
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
                <div className="text-xs md:text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ Insurance Types ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.insuranceTypes.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.insuranceTypes.headingHighlight)}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              {tr(pageText.insuranceTypes.description)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageText.insuranceTypes.types.map((item, i) => {
              const Icon = insuranceIcons[i];
              return (
                <div key={i} className="glass-card p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                    <Icon className="w-6 h-6" style={{ color: GOLD }} />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{tr(item.name)}</h3>
                  <p className="text-sm text-muted-foreground">{tr(item.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ Why Choose Us ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.whyChoose.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.whyChoose.headingHighlight)}</span>{' '}
              {tr(pageText.whyChoose.headingSuffix)}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              {tr(pageText.whyChoose.description)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageText.whyChoose.reasons.map((item, i) => {
              const reasonIcons = [BadgeCheck, TrendingDown, CheckCircle2, IndianRupee, Headphones, Navigation];
              const Icon = reasonIcons[i];
              return (
                <div key={i} className="glass-card p-6 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(201,138,28,0.1)' }}>
                      <Icon className="w-5 h-5" style={{ color: GOLD }} />
                    </div>
                    <h3 className="font-bold text-foreground">{tr(item.title)}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{tr(item.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ Cashless Hospitals in Kota ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.kotaHospitals.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.kotaHospitals.headingHighlight)}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              {tr(pageText.kotaHospitals.description)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageText.kotaHospitals.hospitals.map((h, i) => (
              <div key={i} className="glass-card p-5 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(14,124,123,0.1)' }}>
                  <Stethoscope className="w-5 h-5" style={{ color: '#0E7C7B' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{h.name}</h3>
                  <p className="text-xs text-muted-foreground">{tr(h.type)}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 ml-auto shrink-0 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ How to Get Insurance ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.process.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.process.headingHighlight)}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pageText.process.steps.map((item, i) => (
              <div key={i} className="glass-card p-6 text-center hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 relative">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white font-bold mb-4"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                  {item.step}
                </span>
                <h3 className="font-bold text-foreground mb-2">{tr(item.title)}</h3>
                <p className="text-sm text-muted-foreground">{tr(item.desc)}</p>
                {i < 3 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ Advisor Section ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.advisor.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.advisor.headingHighlight)}</span>
            </h2>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                <span className="text-3xl font-bold text-white">HP</span>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-foreground">{tr(pageText.advisor.name)}</h3>
                <p className="text-sm" style={{ color: GOLD }}>{tr(pageText.advisor.title)}</p>
                <p className="text-xs font-mono font-bold mt-1" style={{ color: NAVY }}>
                  POSP Code: {pageText.advisor.pospCode}
                </p>
                <div className="flex items-center gap-1 mt-2 justify-center sm:justify-start">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{tr(pageText.advisor.location)}</span>
                </div>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer" className="flex-1">
                <ShinyButton variant="blue" className="w-full rounded-xl py-3 text-sm">
                  <span className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" /> {pageText.advisor.phone}
                  </span>
                </ShinyButton>
              </a>
              <a href="mailto:himanshupaliwalpbp@gmail.com" className="flex-1">
                <ShinyButton variant="secondary" className="w-full rounded-xl py-3 text-sm">
                  <span className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> {tr(pageText.advisor.email)}
                  </span>
                </ShinyButton>
              </a>
            </div>

            {/* Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pageText.advisor.certifications.map((cert, i) => (
                <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'rgba(11,43,91,0.04)' }}>
                  <BadgeCheck className="w-5 h-5 mx-auto mb-1" style={{ color: GOLD }} />
                  <p className="text-xs font-medium text-foreground">{tr(cert)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ FAQ Section ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {tr(pageText.faq.heading1)}{' '}
              <span className="gradient-text">{tr(pageText.faq.headingHighlight)}</span>
            </h2>
          </div>
          <div className="space-y-4">
            {pageText.faq.list.map((faq, i) => (
              <div key={i} className="glass-card p-5 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-2 flex items-start gap-2">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 text-white"
                    style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK_NAVY})` }}>
                    {i + 1}
                  </span>
                  {tr(faq.q)}
                </h3>
                <p className="text-sm text-muted-foreground ml-8">{tr(faq.a)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ CTA Section ═══════════ */}
      <section className="relative py-16 md:py-20 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${DARK_NAVY} 50%, #082247 100%)` }}>
        <div className="absolute top-5 right-[20%] w-40 h-40 rounded-full opacity-10" style={{ background: GOLD, filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
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
    </div>
  );
}
