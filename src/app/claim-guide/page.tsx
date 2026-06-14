import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Insurance Claim Guide – Cashless & Reimbursement Process",
  description:
    "Step-by-step insurance claim guide for health and car insurance. Cashless vs reimbursement process, documents needed, timelines, common rejection reasons, and how to appeal.",
  slug: "/claim-guide",
});

export default function ClaimGuidePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
