import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: "Bike Insurance India – Compare Two-Wheeler Plans & Premiums from ₹799/Year",
  description:
    "Compare bike insurance from Acko, Digit, Bajaj Allianz, ICICI Lombard & New India Assurance. IRDAI TP rates ₹538-₹2,023. Comprehensive from ₹799/yr. Get AI-powered recommendations from PaliwalSecure.in.",
  slug: "/bike-insurance",
});

export default function BikeInsurancePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
