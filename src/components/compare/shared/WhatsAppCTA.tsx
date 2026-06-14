'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WhatsAppCTAProps {
  quote?: any;
  userDetails?: any;
  category: string;
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  motor: 'मोटर बीमा',
  health: 'स्वास्थ्य बीमा',
  life: 'जीवन बीमा',
  travel: 'यात्रा बीमा',
  home: 'गृह बीमा',
};

const CATEGORY_ENGLISH: Record<string, string> = {
  motor: 'Motor Insurance',
  health: 'Health Insurance',
  life: 'Life Insurance',
  travel: 'Travel Insurance',
  home: 'Home Insurance',
};

const generateMessage = (category: string, quote: any, userDetails: any) => {
  const catHindi = CATEGORY_LABELS[category] ?? category;
  const catEnglish = CATEGORY_ENGLISH[category] ?? category;
  const baseMsg = `नमस्ते! 🙏 PaliwalSecure पर ${catHindi} तुलना की।`;

  // Add user details if available
  let userDetailsStr = '';
  if (userDetails) {
    if (userDetails.name) userDetailsStr += `\n👤 नाम: ${userDetails.name}`;
    if (userDetails.age) userDetailsStr += `\n🎂 उम्र: ${userDetails.age}`;
    if (userDetails.city) userDetailsStr += `\n📍 शहर: ${userDetails.city}`;
  }

  let categoryMsg = '';
  switch (category) {
    case 'motor':
      categoryMsg = `सबसे अच्छा कोटेशन ${quote?.insurerName || quote?.insurer || ''} का ₹${quote?.totalPremium?.toLocaleString('en-IN') || ''} है। क्या आप इस पॉलिसी में मेरी मदद कर सकते हैं?`;
      break;
    case 'health':
      categoryMsg = `सबसे अच्छा ${quote?.insurerName || quote?.insurer || ''} ₹${quote?.totalPremium?.toLocaleString('en-IN') || ''}/वर्ष। मार्गदर्शन चाहिए!`;
      break;
    case 'life':
      categoryMsg = `टर्म प्लान ${quote?.insurerName || quote?.insurer || ''} ₹${quote?.totalPremium?.toLocaleString('en-IN') || ''}/वर्ष। कृपया सलाह दें!`;
      break;
    case 'travel':
      categoryMsg = `ट्रैवल इंश्योरेंस ${quote?.insurerName || quote?.insurer || ''} ₹${quote?.totalPremium?.toLocaleString('en-IN') || ''}। बुकिंग मदद चाहिए!`;
      break;
    case 'home':
      categoryMsg = `होम इंश्योरेंस ${quote?.insurerName || quote?.insurer || ''} ₹${quote?.totalPremium?.toLocaleString('en-IN') || ''}/वर्ष। विवरण चाहिए!`;
      break;
    default:
      categoryMsg = `कृपया सबसे अच्छे विकल्प के बारे में बताएं।`;
  }

  const fullMessage = `${baseMsg} ${categoryMsg}${userDetailsStr}\n\n📞 Call/WhatsApp: +91 9257877312\n— Sent from PaliwalSecure Compare Tool`;
  return encodeURIComponent(fullMessage);
};

export function WhatsAppCTA({ quote, userDetails, category, className }: WhatsAppCTAProps) {
  const message = generateMessage(category, quote, userDetails);
  const whatsappUrl = `https://wa.me/919257877312?text=${message}`;

  const catEnglish = CATEGORY_ENGLISH[category] ?? 'Insurance';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Button
        asChild
        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg gap-2 h-12 text-sm font-semibold dark:bg-green-700 dark:hover:bg-green-800"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp for insurance quote"
        >
          <MessageCircle className="h-5 w-5" />
          <span>WhatsApp पर चर्चा करें</span>
          <span className="text-green-200">•</span>
          <span className="text-green-100 text-xs">{catEnglish} Expert Help</span>
        </a>
      </Button>
    </motion.div>
  );
}
