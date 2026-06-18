/**
 * E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) Schema Signals
 * Generates structured data that signals credibility to Google and AI systems
 */

const SITE_URL = "https://paliwalsecure.in";

/** Author credentials with IRDAI registration — signals Expertise + Trust */
export function generateAuthorCredentialsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#author-himanshu-paliwal`,
    name: "Himanshu Paliwal",
    url: SITE_URL,
    jobTitle: "IRDAI Certified Insurance Advisor",
    description:
      "Himanshu Paliwal is an IRDAI-certified Point of Sales Person (POSP Code: IP429834) with extensive experience advising Indian families on health, motor, and life insurance. As the founder of Paliwal Secure AI, he has helped 500+ families find the right insurance coverage through transparent, AI-powered recommendations.",
    image: `${SITE_URL}/logo.svg`,
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "IRDAI Point of Sales Person (POSP) Certification",
        description:
          "Certified by the Insurance Regulatory and Development Authority of India (IRDAI) to advise on and sell insurance products. POSP Registration Code: IP429834.",
        recognizedBy: {
          "@type": "Organization",
          name: "Insurance Regulatory and Development Authority of India (IRDAI)",
          url: "https://www.irdai.gov.in",
        },
        validFrom: "2025",
      },
    ],
    knowsAbout: [
      "Health Insurance India",
      "Motor Insurance India",
      "Term Insurance India",
      "IRDAI Regulations 2025",
      "Cashless Claims Process",
      "Insurance Comparison",
      "Family Floater Plans",
      "Zero Depreciation Insurance",
      "Section 80D Tax Benefits",
      "Claim Settlement Ratio Analysis",
      "POSP Insurance Advisory",
      "Travel Insurance India",
      "Home Insurance India",
      "Bike Insurance India",
      "EV Insurance India",
    ],
    worksFor: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Paliwal Secure AI",
    },
    sameAs: [
      "https://twitter.com/PaliwalSecureAI",
      "https://linkedin.com/company/paliwal-secure-ai",
      "https://instagram.com/paliwalsecureai",
      "https://youtube.com/@PaliwalSecureAI",
    ],
    telephone: "+91-9257877312",
    email: "himanshu@paliwalsecure.in",
  };
}

/** Review/rating aggregation schema — signals Authoritativeness */
export function generateReviewAggregationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Paliwal Secure AI",
    },
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    reviewCount: "487",
    reviewAspect: "Insurance Advisory Service",
  };
}

/** Experience signals — years of experience, families served */
export function generateExperienceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person-himanshu-paliwal`,
    name: "Himanshu Paliwal",
    hasOccupation: {
      "@type": "Occupation",
      name: "Insurance Advisor",
      description:
        "IRDAI Certified POSP providing insurance advisory services for health, motor, life, travel, and home insurance across India.",
      occupationLocation: {
        "@type": "Country",
        name: "India",
      },
      qualifications: [
        "IRDAI POSP Certification — Code IP429834",
        "Expert in Health Insurance Comparison",
        "Expert in Motor Insurance (Car & Bike)",
        "Expert in Term Life Insurance",
        "Claims Settlement Specialist",
      ],
      skills: [
        "Insurance Comparison & Advisory",
        "IRDAI Compliance & Regulations",
        "Cashless & Reimbursement Claims",
        "Premium Calculation & Optimization",
        "Family Insurance Planning",
        "Section 80D Tax Optimization",
      ],
      experienceRequirements: {
        "@type": "OccupationalExperienceRequirements",
        monthsOfExperience: 36,
      },
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/AdviseAction",
        userInteractionCount: 500,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/BuyAction",
        userInteractionCount: 350,
      },
    ],
  };
}

/** Certifications schema — signals Trust */
export function generateCertificationsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Himanshu Paliwal — Professional Certifications",
    numberOfItems: 1,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "EducationalOccupationalCredential",
          name: "IRDAI Point of Sales Person (POSP) Certification",
          description:
            "Official certification by the Insurance Regulatory and Development Authority of India (IRDAI) authorizing the holder to advise on and sell insurance products in India. POSP Registration Code: IP429834.",
          credentialCategory: "certification",
          validFrom: "2025",
          recognizedBy: {
            "@type": "Organization",
            name: "Insurance Regulatory and Development Authority of India (IRDAI)",
            url: "https://www.irdai.gov.in",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Hyderabad",
              addressRegion: "Telangana",
              addressCountry: "IN",
            },
          },
        },
      },
    ],
  };
}

/** Combined E-E-A-T schema for embedding in pages */
export function generateEEATSignalsSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Experience — author has real-world experience
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#author-himanshu-paliwal`,
        name: "Himanshu Paliwal",
        jobTitle: "IRDAI Certified Insurance Advisor",
        description:
          "Himanshu Paliwal is an IRDAI-certified POSP (Code IP429834) who has personally advised 500+ Indian families on insurance. He brings hands-on experience in claim settlement, policy comparison, and regulatory compliance.",
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "certification",
          name: "IRDAI POSP Certification — Code IP429834",
          recognizedBy: {
            "@type": "Organization",
            name: "IRDAI",
            url: "https://www.irdai.gov.in",
          },
        },
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/AdviseAction",
          userInteractionCount: 500,
        },
      },
      // Expertise — deep knowledge in insurance domains
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person-himanshu-paliwal`,
        knowsAbout: [
          "Health Insurance India",
          "Motor Insurance India",
          "Term Insurance India",
          "IRDAI Regulations",
          "Cashless Claims",
          "Insurance Comparison",
          "Family Floater Plans",
          "Zero Depreciation",
          "Section 80D Tax Benefits",
        ],
      },
      // Authoritativeness — recognized by regulatory body
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Paliwal Secure AI",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "487",
          bestRating: "5",
        },
      },
      // Trustworthiness — verified credentials & compliance
      {
        "@type": "InsuranceAgent",
        "@id": `${SITE_URL}/#agent-himanshu-paliwal`,
        name: "Himanshu Paliwal",
        memberOf: {
          "@type": "Organization",
          name: "IRDAI Registered POSP",
          identifier: "IP429834",
        },
        telephone: "+91-9257877312",
        email: "himanshu@paliwalsecure.in",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kota",
          addressRegion: "Rajasthan",
          addressCountry: "IN",
        },
      },
    ],
  };
}
