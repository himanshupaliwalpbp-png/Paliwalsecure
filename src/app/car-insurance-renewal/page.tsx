import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Car Insurance Renewal Guide – Save Up to 50% with NCB",
  description:
    "Step-by-step car insurance renewal guide for India. Learn how NCB (No Claim Bonus) can save you up to 50% on premium. Tips to reduce renewal cost, what happens if you miss the date, and how to renew online. By Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/car-insurance-renewal",
});

export default function CarInsuranceRenewalPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
