import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Best Health Insurance Plans in India 2025 | Compare & Save",
  description:
    "Compare top health insurance plans in India. AI-powered recommendations for family floater, senior citizen, critical illness & cashless hospitalization. Save up to ₹75,000 under Section 80D.",
  slug: "/health-insurance",
});

export default function HealthInsurancePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
