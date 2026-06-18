/**
 * Knowledge Graph Schema Generators for Entity SEO
 * Generates Organization + Person structured data for LLM/Google entity recognition
 */

const SITE_URL = "https://paliwalsecure.in";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "InsuranceAgency", "FinancialService"],
    "@id": `${SITE_URL}/#organization`,
    name: "Paliwal Secure AI",
    alternateName: [
      "Paliwal Secure",
      "Paliwal Insurance Advisor",
      "InsureGPT",
      "पालीवाल सिक्योर एआई",
    ],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.svg`,
      width: 512,
      height: 512,
    },
    description:
      "India's AI-powered insurance advisor. Compare 51+ IRDAI-registered insurers for health, motor, life, travel, and home insurance. Get personalized recommendations with InsureGPT AI. Trusted by 500+ families. Founded by Himanshu Paliwal — IRDAI Certified POSP Code IP429834.",
    foundingDate: "2025",
    founders: [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person-himanshu-paliwal`,
        name: "Himanshu Paliwal",
        jobTitle: "IRDAI Certified Insurance Advisor",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-9257877312",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
        areaServed: {
          "@type": "Country",
          name: "India",
        },
      },
      {
        "@type": "ContactPoint",
        telephone: "+91-9257877312",
        contactType: "sales",
        availableLanguage: ["English", "Hindi"],
        areaServed: {
          "@type": "Country",
          name: "India",
        },
      },
    ],
    sameAs: [
      "https://twitter.com/PaliwalSecureAI",
      "https://linkedin.com/company/paliwal-secure-ai",
      "https://instagram.com/paliwalsecureai",
      "https://youtube.com/@PaliwalSecureAI",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kota",
      addressLocality: "Kota",
      addressRegion: "Rajasthan",
      postalCode: "324001",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    knowsAbout: [
      "Health Insurance India",
      "Motor Insurance India",
      "Car Insurance India",
      "Bike Insurance India",
      "Term Life Insurance India",
      "Travel Insurance India",
      "Home Insurance India",
      "Zero Depreciation Insurance",
      "EV Insurance India",
      "Cashless Claims Process",
      "Insurance Comparison",
      "IRDAI Regulations",
      "Mediclaim Policy",
      "Third Party Insurance",
      "Family Floater Health Insurance",
      "Section 80D Tax Benefits",
      "Claim Settlement Ratio",
      "Insurance Premium Calculator",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Insurance Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Health Insurance Comparison",
            description: "Compare health insurance plans from 51+ IRDAI-registered insurers",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Motor Insurance Comparison",
            description: "Compare car and bike insurance with IRDAI TP rates and comprehensive plans",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Life Insurance Advisory",
            description: "Term life insurance recommendations based on age, income, and coverage needs",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "InsureGPT AI Advisor",
            description: "AI-powered insurance chatbot answering questions in English, Hindi, and Hinglish",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Claims Support",
            description: "End-to-end claims assistance for cashless and reimbursement processes",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "487",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "InsuranceAgent"],
    "@id": `${SITE_URL}/#person-himanshu-paliwal`,
    name: "Himanshu Paliwal",
    url: SITE_URL,
    image: `${SITE_URL}/logo.svg`,
    jobTitle: "IRDAI Certified Insurance Advisor",
    description:
      "Himanshu Paliwal is an IRDAI Certified Point of Sales Person (POSP) with code IP429834, specializing in health, motor, and life insurance advisory for Indian families. Founder of Paliwal Secure AI — India's AI-powered insurance comparison platform serving 500+ families.",
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
    knowsAbout: [
      "Health Insurance India",
      "Motor Insurance India",
      "Term Insurance India",
      "IRDAI Regulations",
      "Insurance Comparison",
      "Cashless Claims Process",
      "Family Floater Plans",
      "Zero Depreciation Insurance",
      "Section 80D Tax Benefits",
      "Claim Settlement",
      "Insurance Premium Calculation",
      "POSP Insurance Advisory",
    ],
    alumniOf: {
      "@type": "Organization",
      name: "IRDAI",
      description: "Insurance Regulatory and Development Authority of India — POSP Certification",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "IRDAI Point of Sales Person (POSP)",
        description: "Certified by IRDAI to sell insurance products — POSP Code IP429834",
        recognizedBy: {
          "@type": "Organization",
          name: "Insurance Regulatory and Development Authority of India (IRDAI)",
          url: "https://www.irdai.gov.in",
        },
      },
    ],
    sameAs: [
      "https://twitter.com/PaliwalSecureAI",
      "https://linkedin.com/company/paliwal-secure-ai",
      "https://instagram.com/paliwalsecureai",
      "https://youtube.com/@PaliwalSecureAI",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kota",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    telephone: "+91-9257877312",
    email: "himanshu@paliwalsecure.in",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    award: [
      "IRDAI Certified POSP — Code IP429834",
      "Trusted by 500+ Indian Families",
    ],
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/AdviseAction",
      userInteractionCount: 500,
    },
  };
}
