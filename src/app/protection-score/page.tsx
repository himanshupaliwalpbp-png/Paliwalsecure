import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Protection Score™ Calculator — Free 2-Minute Family Security Audit | Paliwal Secure',
  description:
    'Answer 7 quick questions and get your free Protection Score™ — find out if your family is under-insured, over-insured, or perfectly protected. Instant analysis, personalized roadmap. IRDAI Registered POSP IP429834.',
  slug: '/protection-score',
});

export default function ProtectionScorePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
