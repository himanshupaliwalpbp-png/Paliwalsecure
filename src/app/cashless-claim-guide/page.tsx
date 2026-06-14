import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Cashless Claim Guide – Process, Network Hospitals & IRDAI Timelines",
  description:
    "Complete guide to cashless health insurance claims in India. Step-by-step process at network hospitals, IRDAI mandated timelines (pre-auth 1hr, discharge 3hr), major hospital chains. By Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/cashless-claim-guide",
});

export default function CashlessClaimGuidePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
