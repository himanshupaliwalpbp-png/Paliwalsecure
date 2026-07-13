import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: "Claim Settlement Ratio Explained — IRDAI Data 2026 | Paliwal Secure",
  description:
    "What is claim settlement ratio (CSR)? How IRDAI measures it, why it matters, latest CSR data for all Indian insurers, and how to use it when choosing insurance. Expert analysis by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/claim-settlement-ratio",
});

export default function ClaimSettlementRatioPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
