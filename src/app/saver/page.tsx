import type { Metadata } from "next";
import SaverApp from "@/components/saver/SaverApp";

export const metadata: Metadata = {
  title: "Paliwal Saver — Legally Save ₹1L+ Every Year on UPI Fees, GST & Income Tax | Paliwal Secure AI",
  description:
    "How much business money can you legally save? Decode RBI UPI MDR rules, Section 44AD presumptive tax, new vs old regime and GST input tax credit — free calculators with official government sources. Zero tax evasion, only rule-based savings for Indian small businesses. By Paliwal Secure AI (Himanshu Paliwal, IRDAI Registered POSP IP429834).",
  keywords: [
    "Paliwal Saver",
    "UPI MDR calculator",
    "UPI charges above 2000",
    "merchant MDR fees India",
    "Section 44AD calculator",
    "44ADA presumptive taxation",
    "new vs old tax regime India",
    "GST input tax credit checker",
    "ITC eligibility India",
    "legal tax saving small business India",
    "zero MDR UPI merchant",
    "small merchant QR limit",
    "business savings calculator India",
  ],
  alternates: { canonical: "https://paliwalsecure.in/saver" },
  openGraph: {
    title: "Paliwal Saver — Legally Save ₹1L+ Every Year",
    description:
      "RBI, NPCI & Income-Tax rules decoded for Indian small businesses. Free calculators for UPI MDR fees, Section 44AD presumptive tax and GST ITC — with official sources. 100% legal, zero evasion.",
    url: "https://paliwalsecure.in/saver",
    siteName: "Paliwal Secure AI",
    type: "website",
    locale: "en_IN",
  },
};

export default function SaverPage() {
  return (
    <div className="saver-canvas relative -mt-px text-[#FAF7F2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Paliwal Saver",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://paliwalsecure.in/saver",
            description:
              "Legal business savings calculators: UPI MDR fees, Section 44AD/44ADA presumptive taxation, new vs old regime and GST input tax credit — with official government sources.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
            publisher: {
              "@type": "Organization",
              name: "Paliwal Secure AI",
              url: "https://paliwalsecure.in",
            },
          }),
        }}
      />
      <SaverApp />
    </div>
  );
}
