import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Car Insurance Renewal & Comparison – Save with NCB",
  description:
    "Compare car insurance plans from top insurers. Understand IDV, NCB, zero dep, TP vs comprehensive. Save up to 50% on renewal with AI-powered recommendations.",
  slug: "/car-insurance",
});

export default function CarInsurancePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
