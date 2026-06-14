import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Health Insurance Hub — Complete Guide for India 2025 | Paliwal Secure',
  description: 'Your complete health insurance guide for India 2025. Compare plans by city, age, profession, and condition. Expert advice from IRDAI-certified advisor Himanshu Paliwal (POSP IP429834).',
  keywords: ['health insurance hub', 'health insurance india 2025', 'compare health plans', 'best health insurance', 'medical insurance guide'],
  alternates: { canonical: 'https://paliwalsecure.in/hub/health-insurance' },
  openGraph: {
    title: 'Health Insurance Hub — Complete Guide for India 2025',
    description: 'Compare health insurance plans by city, age, profession, and condition. Expert advice from IRDAI-certified advisor.',
    url: 'https://paliwalsecure.in/hub/health-insurance',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://paliwalsecure.in/hub/health-insurance#article',
      headline: 'Health Insurance Hub — Complete Guide for India 2025',
      description: 'Your complete health insurance guide for India 2025. Compare plans by city, age, profession, and condition.',
      author: { '@type': 'Person', name: 'Himanshu Paliwal' },
      publisher: { '@type': 'Organization', name: 'Paliwal Secure AI' },
      dateModified: '2025-07-01',
      mainEntityOfPage: 'https://paliwalsecure.in/hub/health-insurance',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' },
        { '@type': 'ListItem', position: 2, name: 'Health Insurance Hub', item: 'https://paliwalsecure.in/hub/health-insurance' },
      ],
    },
  ],
};

export default function HealthInsuranceHubPage() {
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
