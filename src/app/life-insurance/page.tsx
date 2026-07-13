import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: "Term Life Insurance India – ₹1 Crore Cover from ₹500/month",
  description:
    "Compare best term insurance plans in India. Premium tables for age 25-45, CSR ratios, riders, tax benefits under 80C. AI-powered recommendations by Paliwal Secure.",
  slug: "/life-insurance",
});

export default function LifeInsurancePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
