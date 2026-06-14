import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Insurance Glossary – Terms Explained (IDV, NCB, PED, etc.)",
  description:
    "Understand insurance terminology in simple Hindi/English. Complete glossary of IDV, NCB, PED, CSR, ICR, and 30+ terms explained.",
  slug: "/insurance-glossary",
});

export default function InsuranceGlossaryPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
