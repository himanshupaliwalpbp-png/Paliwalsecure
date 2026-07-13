import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: "Home Insurance India – Protect Your Home & Belongings from ₹100/Month",
  description:
    "Compare home insurance plans from ICICI Lombard, Bajaj Allianz, HDFC ERGO, SBI General & New India Assurance. Premiums from ₹100/month. Coverage up to ₹1 Cr. Get AI-powered recommendations from PaliwalSecure.in.",
  slug: "/home-insurance",
});

export default function HomeInsurancePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
