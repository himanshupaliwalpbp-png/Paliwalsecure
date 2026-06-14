import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Grievance Policy | Paliwal Secure AI — Grievance Redressal Mechanism',
  description: 'Paliwal Secure AI grievance redressal policy. How to file a complaint, escalation process, DPDP Act 2023 compliance, and contact information for Grievance Officer Himanshu Paliwal.',
  slug: '/grievance-policy',
});

export default function GrievancePolicyPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
