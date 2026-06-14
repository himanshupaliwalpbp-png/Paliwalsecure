import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Motor Insurance Hub — Car, Bike & EV Insurance Guide 2025 | Paliwal Secure',
  description: 'Complete motor insurance guide for India 2025. Car, bike, scooter & EV insurance rates, add-ons, claim process, and comparisons. IRDAI-certified advisor Himanshu Paliwal (POSP IP429834).',
  keywords: ['motor insurance hub', 'car insurance india', 'bike insurance', 'ev insurance', 'motor insurance guide 2025'],
  alternates: { canonical: 'https://paliwalsecure.in/hub/motor-insurance' },
  openGraph: {
    title: 'Motor Insurance Hub — Car, Bike & EV Insurance Guide 2025',
    description: 'Complete motor insurance guide for India 2025. Car, bike, scooter & EV insurance rates and comparisons.',
    url: 'https://paliwalsecure.in/hub/motor-insurance',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://paliwalsecure.in/hub/motor-insurance#article',
      headline: 'Motor Insurance Hub — Car, Bike & EV Insurance Guide 2025',
      description: 'Complete motor insurance guide for India 2025. Car, bike, scooter & EV insurance rates, add-ons, and comparisons.',
      author: { '@type': 'Person', name: 'Himanshu Paliwal' },
      publisher: { '@type': 'Organization', name: 'Paliwal Secure AI' },
      dateModified: '2025-07-01',
      mainEntityOfPage: 'https://paliwalsecure.in/hub/motor-insurance',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' },
        { '@type': 'ListItem', position: 2, name: 'Motor Insurance Hub', item: 'https://paliwalsecure.in/hub/motor-insurance' },
      ],
    },
  ],
};

export default function MotorInsuranceHubPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientContent />
    </PageLayout>
  );
}
