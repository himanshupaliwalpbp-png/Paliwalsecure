import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Insurance FAQ Hub — 50+ Most Asked Questions Answered | Paliwal Secure',
  description: 'Answers to 50+ most asked insurance questions in India. Health, motor, life, claims, tax, and IRDAI FAQs in Hindi/English. By IRDAI-certified advisor Himanshu Paliwal (POSP IP429834).',
  keywords: ['insurance faq', 'insurance questions india', 'health insurance faq', 'car insurance faq', 'life insurance faq'],
  alternates: { canonical: 'https://paliwalsecure.in/hub/faq' },
  openGraph: { title: 'Insurance FAQ Hub — 50+ Most Asked Questions Answered', description: 'Answers to 50+ most asked insurance questions. Health, motor, life, claims, tax, and IRDAI FAQs.', url: 'https://paliwalsecure.in/hub/faq', type: 'website' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Article', '@id': 'https://paliwalsecure.in/hub/faq#article', headline: 'Insurance FAQ Hub — 50+ Most Asked Questions Answered', description: 'Answers to 50+ most asked insurance questions in India.', author: { '@type': 'Person', name: 'Himanshu Paliwal' }, publisher: { '@type': 'Organization', name: 'Paliwal Secure AI' }, dateModified: '2025-07-01', mainEntityOfPage: 'https://paliwalsecure.in/hub/faq' },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' }, { '@type': 'ListItem', position: 2, name: 'Insurance FAQ Hub', item: 'https://paliwalsecure.in/hub/faq' }] },
  ],
};

export default function FAQHubPage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ClientContent />
    </PageLayout>
  );
}
