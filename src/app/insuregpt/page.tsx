import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: 'InsureGPT — AI Insurance Advisor Chatbot | Paliwal Secure AI',
  description: 'Chat with InsureGPT AI for instant insurance advice. Compare plans, understand coverage, get personalized recommendations. Free AI-powered insurance guidance 24/7.',
  slug: '/insuregpt',
});

export default function InsureGPTPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
