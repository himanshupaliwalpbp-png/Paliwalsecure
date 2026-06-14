import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Cashless vs Reimbursement Claim — Which is Better? 2026 | Paliwal Secure",
  description:
    "Understand the difference between cashless and reimbursement health insurance claims. Step-by-step process, pros and cons, and expert recommendation on which claim type to choose. By Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/cashless-vs-reimbursement-claim",
});

export default function CashlessVsReimbursementPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
