import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "How to File Health Insurance Claim — Step by Step 2026 | Paliwal Secure",
  description: "Step-by-step guide to filing health insurance claims — both cashless and reimbursement. Required documents, common mistakes, and tips for smooth claim settlement. By Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/how-to-file-health-insurance-claim",
});

export default function HowToFileClaimPage() {
  return (<PageLayout><ClientContent /></PageLayout>);
}
