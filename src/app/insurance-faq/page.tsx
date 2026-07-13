import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: "Insurance FAQs – Answers to 50+ Common Questions",
  description:
    "Get answers to 50+ frequently asked questions about health, car, and life insurance in India. IRDAI-compliant answers by Paliwal Secure AI.",
  slug: "/insurance-faq",
});

export default function InsuranceFAQPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
