import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Co-Pay Meaning in Health Insurance — Complete Guide 2026 | Paliwal Secure",
  description:
    "What is co-pay in health insurance? Understand how co-payment works, its impact on premiums and claims, and which plans have the lowest co-pay. Expert guide by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/co-pay-meaning-health-insurance",
});

export default function CoPayPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
