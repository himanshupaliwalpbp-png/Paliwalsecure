import { siteConfig } from "@/config/site";

interface SchemaProps {
  type?: "Organization" | "LocalBusiness" | "WebPage" | "FAQPage" | "Article" | "Product" | "HowTo" | "BreadcrumbList" | "WebSite" | "NewsArticle";
  data?: Record<string, unknown>;
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "InsuranceAgency", "FinancialService"],
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  alternateName: [siteConfig.alternateName, "Paliwal Insurance Advisor", "पालीवाल सिक्योर एआई"],
  url: siteConfig.url,
  sameAs: Object.values(siteConfig.links),
  description: siteConfig.description,
  knowsAbout: [
    "Health Insurance India",
    "Motor Insurance",
    "Zero Depreciation Insurance",
    "EV Insurance India",
    "Term Life Insurance",
    "Cashless Claims",
    "Insurance Comparison",
    "IRDAI Regulations",
    "Mediclaim Policy",
    "Third Party Insurance",
    "स्वास्थ्य बीमा",
    "मोटर बीमा",
  ],
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  foundingDate: "2025",
  logo: {
    "@type": "ImageObject",
    url: `${siteConfig.url}/logo.svg`,
    width: 512,
    height: 512,
  },
  founder: {
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    jobTitle: "IRDAI Certified Insurance Advisor",
    knowsAbout: ["Insurance India", "Health Insurance", "Motor Insurance", "Financial Planning"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: ["en-IN", "hi-IN"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Schema({ type = "Organization", data }: SchemaProps) {
  let schemaData: Record<string, unknown>;

  switch (type) {
    case "Organization":
      schemaData = organizationSchema;
      break;
    case "WebSite":
      schemaData = websiteSchema;
      break;
    default:
      schemaData = {
        "@context": "https://schema.org",
        "@type": type,
        ...data,
      };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// Helper functions for generating schemas in page components
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
  keywords?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.imageUrl ? {
      "@type": "ImageObject",
      url: article.imageUrl,
      width: 1200,
      height: 630,
    } : undefined,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    about: [
      { "@type": "Thing", name: "Insurance India" },
    ],
    inLanguage: "en-IN",
    keywords: article.keywords,
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToSchema(howTo: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
