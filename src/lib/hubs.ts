import { HubConfig } from './content-types';

export const hubs: HubConfig[] = [
  {
    id: 'health-hub',
    name: 'Health Insurance Hub',
    hindiName: 'स्वास्थ्य बीमा हब',
    description: 'Complete health insurance guides, plan comparisons, claim tips, and medical coverage advice for Indian families.',
    hindiDescription: 'भारतीय परिवारों के लिए संपूर्ण स्वास्थ्य बीमा गाइड, प्लान तुलना, क्लेम टिप्स और मेडिकल कवरेज सलाह।',
    icon: 'Heart',
    color: 'rose',
    slug: 'health-hub',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 'motor-hub',
    name: 'Motor Insurance Hub',
    hindiName: 'मोटर बीमा हब',
    description: 'Car insurance, bike insurance, EV insurance guides, IDV calculators, NCB tips, and add-on covers explained.',
    hindiDescription: 'कार बीमा, बाइक बीमा, EV बीमा गाइड, IDV कैलकुलेटर, NCB टिप्स और ऐड-ऑन कवर समझाए गए।',
    icon: 'Car',
    color: 'amber',
    slug: 'motor-hub',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'claims-hub',
    name: 'Claims Hub',
    hindiName: 'क्लेम हब',
    description: 'Step-by-step claim guides, cashless vs reimbursement, documents checklist, and claim rejection prevention tips.',
    hindiDescription: 'स्टेप-बाय-स्टेप क्लेम गाइड, कैशलेस बनाम रीम्बर्समेंट, डॉक्यूमेंट्स चेकलिस्ट और क्लेम रिजेक्शन रोकथाम टिप्स।',
    icon: 'FileCheck',
    color: 'teal',
    slug: 'claims-hub',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'vehicle-launch-hub',
    name: 'Vehicle Launch Hub',
    hindiName: 'वाहन लॉन्च हब',
    description: 'Insurance guides for new car launches, EV launches, Tata, Hyundai, Mahindra insurance costs and comparisons.',
    hindiDescription: 'नई कार लॉन्च, EV लॉन्च, टाटा, हुंडई, महिंद्रा बीमा लागत और तुलना के लिए बीमा गाइड।',
    icon: 'Rocket',
    color: 'violet',
    slug: 'vehicle-launch-hub',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 'news-hub',
    name: 'Insurance News Hub',
    hindiName: 'बीमा समाचार हब',
    description: 'Latest IRDAI updates, medical inflation news, insurance regulation changes, and industry insights.',
    hindiDescription: 'नवीनतम IRDAI अपडेट, मेडिकल मुद्रास्फीति समाचार, बीमा नियमन परिवर्तन और उद्योग अंतर्दृष्टि।',
    icon: 'Newspaper',
    color: 'sky',
    slug: 'news-hub',
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    id: 'glossary-hub',
    name: 'Glossary Hub',
    hindiName: 'शब्दावली हब',
    description: 'Insurance terms explained in Hindi, English & Hinglish. From IDV to NCB, CSR to copay — every term decoded.',
    hindiDescription: 'हिंदी, अंग्रेजी और हिंगलिश में बीमा शब्द समझाए गए। IDV से NCB, CSR से copay — हर शब्द डिकोड।',
    icon: 'BookOpen',
    color: 'emerald',
    slug: 'glossary-hub',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    id: 'faq-hub',
    name: 'FAQ Hub',
    hindiName: 'FAQ हब',
    description: 'Most asked insurance questions answered — health, motor, life, claims, tax saving, and IRDAI FAQs.',
    hindiDescription: 'सबसे ज्यादा पूछे जाने वाले बीमा सवालों के जवाब — स्वास्थ्य, मोटर, जीवन, क्लेम, कर बचत और IRDAI FAQ।',
    icon: 'HelpCircle',
    color: 'cyan',
    slug: 'faq-hub',
    gradient: 'from-cyan-500 to-teal-400',
  },
];

export function getHubById(id: string): HubConfig | undefined {
  return hubs.find(h => h.id === id);
}

export function getHubBySlug(slug: string): HubConfig | undefined {
  return hubs.find(h => h.slug === slug);
}
