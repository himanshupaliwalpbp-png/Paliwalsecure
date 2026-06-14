import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "IDV Calculation — How Your Car's Value is Decided 2026 | Paliwal Secure",
  description:
    "Understand IDV (Insured Declared Value) calculation for car insurance — how it's calculated, why it matters, and how to set the right IDV. Includes IDV calculator and depreciation rates. By Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/idv-calculation",
});

export default function IDVCalculationPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
