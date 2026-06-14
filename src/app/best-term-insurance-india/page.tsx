import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Best Term Insurance Plans in India 2026 | Paliwal Secure",
  description:
    "Compare the best term insurance plans in India for 2026. Top 10 plans ranked by claim settlement ratio, premium, riders, and Paliwal Secure Score™. Expert analysis by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/best-term-insurance-india",
});

export default function BestTermInsurancePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
