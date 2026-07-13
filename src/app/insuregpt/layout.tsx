import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'InsureGPT — AI Insurance Chatbot | Free 24/7 Insurance Advisor | Paliwal Secure',
  description:
    'Chat with InsureGPT — India\'s first AI-powered insurance chatbot. Get instant, IRDAI-compliant answers about health, life, motor, and travel insurance in English, Hindi, or Hinglish. Free, unbiased, and available 24/7. By Himanshu Paliwal, IRDAI-certified advisor.',
  keywords: [
    'InsureGPT',
    'AI insurance chatbot',
    'insurance chatbot India',
    'AI insurance advisor',
    'free insurance advice',
    'insurance questions',
    'health insurance chatbot',
    'term insurance AI',
    'motor insurance chatbot',
    'IRDAI compliant chatbot',
    'Paliwal Secure AI',
    'insurance help online',
    'insurance chatbot Hindi',
    'insurance chatbot Hinglish',
  ],
  authors: [{ name: 'Himanshu Paliwal', url: 'https://paliwalsecure.in' }],
  openGraph: {
    title: 'InsureGPT — AI Insurance Chatbot | Paliwal Secure',
    description:
      'India\'s first AI-powered insurance chatbot. Ask any insurance question in English, Hindi, or Hinglish and get instant, IRDAI-compliant answers. 100% free.',
    url: 'https://paliwalsecure.in/insuregpt',
    siteName: 'Paliwal Secure AI',
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['hi_IN'],
    images: [{ url: 'https://paliwalsecure.in/api/og?title=InsureGPT%20%E2%80%94%20AI%20Insurance%20Chatbot&type=ai', width: 1200, height: 630, alt: 'InsureGPT — AI Insurance Chatbot by Paliwal Secure' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsureGPT — AI Insurance Chatbot | Paliwal Secure',
    description: 'India\'s first AI-powered insurance chatbot. Ask any insurance question and get instant, IRDAI-compliant answers. Free 24/7.',
    images: ['https://paliwalsecure.in/api/og?title=InsureGPT%20%E2%80%94%20AI%20Insurance%20Chatbot&type=ai'],
    creator: '@paliwalinsure',
    site: '@paliwalinsure',
  },
  alternates: {
    canonical: 'https://paliwalsecure.in/insuregpt',
    languages: {
      'en': 'https://paliwalsecure.in/insuregpt',
      'hi': 'https://paliwalsecure.in/insuregpt',
      'x-default': 'https://paliwalsecure.in/insuregpt',
    },
  },
}

export default function InsureGPTLayout({ children }: { children: React.ReactNode }) {
  return children
}
