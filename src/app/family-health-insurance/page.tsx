import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: "Family Health Insurance Guide – Best Floater Plans 2026",
  description:
    "Compare the best family health insurance floater plans in India for 2026. Family floater vs individual plans, best plans for 2A+2C, premium estimates for ₹10L, ₹25L, ₹50L cover. By Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/family-health-insurance",
});

export default function FamilyHealthInsurancePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
