import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Insurance Claims Hub — Step-by-Step Claim Guide 2025 | Paliwal Secure',
  description: 'Complete insurance claim guide for India 2025. Cashless and reimbursement claim process, documents needed, timelines, and IRDAI rights. IRDAI-certified advisor Himanshu Paliwal (POSP IP429834).',
  keywords: ['insurance claims hub', 'claim guide india', 'cashless claim', 'reimbursement claim', 'irdai claim rules'],
  alternates: { canonical: 'https://paliwalsecure.in/hub/claims' },
  openGraph: { title: 'Insurance Claims Hub — Step-by-Step Claim Guide 2025', description: 'Complete insurance claim guide for India 2025. Cashless, reimbursement, documents, and IRDAI rights.', url: 'https://paliwalsecure.in/hub/claims', type: 'website' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'HowTo', '@id': 'https://paliwalsecure.in/hub/claims#howto', name: 'How to File an Insurance Claim in India', description: 'Step-by-step guide to filing health and motor insurance claims in India.', totalTime: 'PT2H', step: [{ '@type': 'HowToStep', name: 'Inform Insurer', text: 'Call your insurer helpline or use their app to register the claim within 24-48 hours.' }, { '@type': 'HowToStep', name: 'Submit Documents', text: 'Provide policy copy, ID proof, hospital bills/discharge summary (health) or FIR/survey report (motor).' }, { '@type': 'HowToStep', name: 'Claim Assessment', text: 'Insurer assesses the claim. Cashless: 1-hour approval. Reimbursement: 15-30 day processing.' }, { '@type': 'HowToStep', name: 'Receive Settlement', text: 'Cashless: Insurer pays hospital directly. Reimbursement: Amount credited to your bank account.' }] },
    { '@type': 'FAQPage', '@id': 'https://paliwalsecure.in/hub/claims#faq', mainEntity: [{ '@type': 'Question', name: 'How long does a cashless claim take?', acceptedAnswer: { '@type': 'Answer', text: 'IRDAI mandates 1-hour approval for cashless requests and 3-hour discharge authorization at network hospitals.' } }, { '@type': 'Question', name: 'What documents are needed for a claim?', acceptedAnswer: { '@type': 'Answer', text: 'Health: Policy copy, ID proof, hospital bills, discharge summary, medical reports. Motor: Policy copy, FIR, driving license, RC, survey report, repair bills.' } }] },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' }, { '@type': 'ListItem', position: 2, name: 'Claims Hub', item: 'https://paliwalsecure.in/hub/claims' }] },
  ],
};

export default function ClaimsHubPage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ClientContent />
    </PageLayout>
  );
}
