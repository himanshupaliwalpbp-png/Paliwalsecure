'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/lib/i18n';

/* ── FAQ data with trilingual support ────────────────────────── */
interface FAQItem {
  question: { en: string; hi: string; hg: string };
  answer: { en: string; hi: string; hg: string };
}

const faqs: FAQItem[] = [
  {
    question: {
      en: 'How is the Protection Score calculated?',
      hi: 'सुरक्षा स्कोर की गणना कैसे की जाती है?',
      hg: 'Protection Score ki calculation kaise hoti hai?',
    },
    answer: {
      en: 'Your Protection Score is calculated based on multiple factors including your current coverage amount, family size, income, existing liabilities, age, and health status. Our AI algorithm compares your coverage with recommended levels for someone in your situation and provides a score out of 100.',
      hi: 'आपका सुरक्षा स्कोर कई कारकों के आधार पर गणना किया जाता है जिसमें आपकी वर्तमान कवरेज राशि, परिवार का आकार, आय, मौजूदा देनदारियां, उम्र और स्वास्थ्य स्थिति शामिल हैं। हमारा AI एल्गोरिथम आपकी कवरेज की तुलना आपकी स्थिति में किसी के लिए अनुशंसित स्तरों से करता है।',
      hg: 'Aapka Protection Score multiple factors pe calculate hota hai — current coverage amount, family size, income, liabilities, age, aur health status. Humara AI algorithm aapki coverage ko recommended levels se compare karta hai aur 100 mein se score deta hai.',
    },
  },
  {
    question: {
      en: 'Do I need to pay for the Protection Score analysis?',
      hi: 'क्या सुरक्षा स्कोर विश्लेषण के लिए भुगतान करना है?',
      hg: 'Kya Protection Score analysis ke liye payment karna hai?',
    },
    answer: {
      en: 'No, the Protection Score analysis is completely free. We believe everyone deserves to know their insurance gaps. Our revenue comes from helping you find the right policies when you\'re ready, not from the analysis itself.',
      hi: 'नहीं, सुरक्षा स्कोर विश्लेषण पूरी तरह से मुफ्त है। हम मानते हैं कि हर किसी को अपने बीमा अंतराल को जानने का अधिकार है।',
      hg: 'Nahi, Protection Score analysis bilkul free hai. Hum maante hain sabko apne insurance gaps jaanne ka adhikar hai. Humari revenue aapke liye sahi policy dhoondhne se aati hai, analysis se nahi.',
    },
  },
  {
    question: {
      en: 'How do you compare policies from different insurers?',
      hi: 'आप विभिन्न बीमाकर्ताओं की नीतियों की तुलना कैसे करते हैं?',
      hg: 'Aap alag-alag insurers ki policies ki comparison kaise karte hain?',
    },
    answer: {
      en: 'We partner with all major insurance providers in India and have access to their complete product portfolios. Our platform compares policies based on coverage benefits, premium costs, claim settlement ratio, exclusions, waiting periods, and additional riders to give you an unbiased recommendation.',
      hi: 'हम भारत के सभी प्रमुख बीमा प्रदाताओं के साथ साझेदारी करते हैं। हमारा प्लेटफॉर्म कवरेज लाभ, प्रीमियम लागत, क्लेम सेटलमेंट अनुपात, बहिष्करण, प्रतीक्षा अवधि और अतिरिक्त राइडर के आधार पर नीतियों की तुलना करता है।',
      hg: 'Hum India ke sabhi major insurance providers ke saath partner hain. Humara platform coverage benefits, premium costs, claim settlement ratio, exclusions, waiting periods, aur additional riders ke basis par policies compare karta hai unbiased recommendation dene ke liye.',
    },
  },
  {
    question: {
      en: 'What makes Paliwal Secure different from other insurance advisors?',
      hi: 'Paliwal Secure को अन्य बीमा सलाहकारों से अलग क्या बनाता है?',
      hg: 'Paliwal Secure ko doosre insurance advisors se alag kya banata hai?',
    },
    answer: {
      en: 'We combine AI-powered insights with human expertise. Our platform provides data-driven recommendations 24/7, while our certified advisors are available for personalized consultations. We focus on long-term protection strategies rather than just selling policies.',
      hi: 'हम AI-संचालित अंतर्दृष्टि को मानव विशेषज्ञता के साथ जोड़ते हैं। हमारा प्लेटफॉर्म 24/7 डेटा-संचालित सिफारिशें प्रदान करता है, जबकि हमारे प्रमाणित सलाहकार व्यक्तिगत परामर्श के लिए उपलब्ध हैं।',
      hg: 'Hum AI-powered insights ko human expertise ke saath jodte hain. Humara platform 24/7 data-driven recommendations deta hai, aur humare certified advisors personalized consultations ke liye available hain. Hum long-term protection strategies pe focus karte hain.',
    },
  },
  {
    question: {
      en: 'How long does it take to get a policy recommendation?',
      hi: 'पॉलिसी सिफारिश पाने में कितना समय लगता है?',
      hg: 'Policy recommendation paane mein kitna time lagta hai?',
    },
    answer: {
      en: 'Our AI can provide initial recommendations in under 2 minutes. For a detailed consultation with one of our advisors, you can schedule a call at your convenience. Most consultations are completed within 30 minutes.',
      hi: 'हमारा AI 2 मिनट से कम समय में प्रारंभिक सिफारिशें दे सकता है। हमारे सलाहकारों में से किसी एक के साथ विस्तृत परामर्श के लिए, आप अपनी सुविधानुसार कॉल शेड्यूल कर सकते हैं। अधिकांश परामर्श 30 मिनट के भीतर पूरे हो जाते हैं।',
      hg: 'Humara AI 2 minute se kam mein initial recommendations de sakta hai. Detailed consultation ke liye aap apni suvidha anusaar call schedule kar sakte hain. Zyaadatar consultations 30 minute ke andar complete ho jaate hain.',
    },
  },
  {
    question: {
      en: 'Can you help with existing policy reviews?',
      hi: 'क्या आप मौजूदा पॉलिसी समीक्षा में मदद कर सकते हैं?',
      hg: 'Kya aap existing policy review mein madad kar sakte hain?',
    },
    answer: {
      en: 'Absolutely! We offer free reviews of your existing policies to identify gaps, overlaps, or opportunities to optimize your coverage. Many of our clients discover they\'re either over-insured or under-protected.',
      hi: 'बिल्कुल! हम आपकी मौजूदा पॉलिसियों की मुफ्त समीक्षा प्रदान करते हैं ताकि अंतराल, ओवरलैप या कवरेज अनुकूलन के अवसरों की पहचान की जा सके।',
      hg: 'Bilkul! Hum aapki existing policies ki free review provide karte hain taaki gaps, overlaps, ya coverage optimize karne ke opportunities identify ki ja sakein.',
    },
  },
  {
    question: {
      en: 'What is the claim settlement process?',
      hi: 'क्लेम निपटान प्रक्रिया क्या है?',
      hg: 'Claim settlement process kya hai?',
    },
    answer: {
      en: 'We provide end-to-end claim support. When you need to file a claim, our team guides you through documentation, liaisons with the insurance company, and follows up until settlement. Our 100% claim success rate means we don\'t rest until you get what you\'re entitled to.',
      hi: 'हम एंड-टू-एंड क्लेम सहायता प्रदान करते हैं। जब आपको क्लेम दाखिल करने की आवश्यकता होती है, तो हमारी टीम आपको दस्तावेज़ीकरण के माध्यम से मार्गदर्शन करती है और निपटान तक फॉलो-अप करती है।',
      hg: 'Hum end-to-end claim support provide karte hain. Jab aapko claim file karni hoti hai, humari team aapko documentation mein guide karti hai, insurance company ke saath liaison karti hai, aur settlement tak follow-up karti hai. Humara 100% claim success rate hai.',
    },
  },
  {
    question: {
      en: 'Do you charge any fees for your advisory services?',
      hi: 'क्या आप अपनी सलाहकार सेवाओं के लिए कोई शुल्क लेते हैं?',
      hg: 'Kya aap apni advisory services ke liye koi fees lete hain?',
    },
    answer: {
      en: 'Our advisory services are free for retail customers. We earn a commission from insurance companies when you purchase a policy through us, but this doesn\'t affect your premium — you pay the same price as buying directly.',
      hi: 'हमारी सलाहकार सेवाएं खुदरा ग्राहकों के लिए मुफ्त हैं। जब आप हमारे माध्यम से पॉलिसी खरीदते हैं तो हमें बीमा कंपनियों से कमीशन मिलता है, लेकिन इससे आपके प्रीमियम पर कोई प्रभाव नहीं पड़ता।',
      hg: 'Humari advisory services retail customers ke liye free hain. Jab aap humare through policy kharidte hain toh humein insurance companies se commission milta hai, lekin isse aapke premium par koi asar nahi padta — aap same price pay karte hain.',
    },
  },
];

/* ── Component ──────────────────────────────────────────────────── */
export default function HomeFAQSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const heading = isHindi ? 'अक्सर पूछे जाने वाले' : isEnglish ? 'Frequently Asked' : 'Frequently Asked';
  const headingAccent = isHindi ? 'प्रश्न' : isEnglish ? 'Questions' : 'Questions';
  const subtitle = isHindi
    ? 'Paliwal Secure और हमारी सेवाओं के बारे में आपको जानने की ज़रूरत है।'
    : isEnglish
      ? 'Everything you need to know about Paliwal Secure and our services.'
      : 'Paliwal Secure aur humari services ke baare mein aapko jaanne ki zaroorat hai.';
  const stillQuestions = isHindi ? 'अभी भी सवाल हैं?' : isEnglish ? 'Still have questions?' : 'Abhi bhi sawaal hain?';
  const chatWithUs = isHindi ? 'WhatsApp पर चैट करें' : isEnglish ? 'Chat with Us on WhatsApp' : 'WhatsApp par chat karein';

  return (
    <section className="section-luxury section-luxury-alt">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] dark:text-[#F8F6F0] mb-4 font-heading tracking-tight">
            {heading} <span className="gradient-text-blue-emerald">{headingAccent}</span>
          </h2>
          <p className="text-lg text-[#64748B] dark:text-[#94A3B8] font-sans max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="premium-card border border-[#E2E8F0]/60 dark:border-white/[0.06] rounded-xl px-6 !p-0 data-[state=open]:border-[#2563EB]/20 dark:data-[state=open]:border-[#3B82F6]/30 data-[state=open]:shadow-premium transition-all duration-300 group"
              >
                <AccordionTrigger className="text-left font-heading text-[0.9375rem] font-semibold text-[#0F172A] dark:text-[#F8F6F0] hover:no-underline py-5 [&>svg]:text-[#94A3B8] dark:[&>svg]:text-[#64748B] [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-200">
                  {isHindi ? faq.question.hi : isEnglish ? faq.question.en : faq.question.hg}
                </AccordionTrigger>
                <AccordionContent className="text-[0.875rem] text-[#64748B] dark:text-[#94A3B8] leading-[1.7] font-sans pb-5">
                  {isHindi ? faq.answer.hi : isEnglish ? faq.answer.en : faq.answer.hg}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-14"
        >
          <p className="text-[#64748B] dark:text-[#94A3B8] mb-5 font-sans text-sm">{stillQuestions}</p>
          <a
            href="https://wa.me/919257877312"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury-secondary inline-flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {chatWithUs}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
