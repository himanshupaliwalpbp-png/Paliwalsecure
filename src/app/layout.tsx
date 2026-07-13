import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono, Noto_Serif_Devanagari, Plus_Jakarta_Sans, Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SafeThemeProvider } from "@/lib/safe-theme-provider";
import { ScrollProgress } from "@/components/ScrollProgress";
import { LanguageProvider } from "@/lib/i18n";
import FloatingChatBot from "@/components/FloatingChatBot";
import { WhatsAppFAB } from "@/components/WhatsAppBot";
import { PublicOnly } from "@/components/PublicOnly";
import FooterWrapper from "@/components/FooterWrapper";
import SiteHeader from "@/components/SiteHeader";
import StructuredData from "@/components/StructuredData";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { PWARegistrar } from "@/components/PWARegistrar";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import ConsentModal from "@/components/ConsentModal";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SafeRender } from "@/components/SafeRender";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { WebMCPProvider } from "@/components/WebMCPProvider";

// ── Premium Editorial Typography — "Editorial Engineering" pairing ──
// Fraunces: variable serif with optical sizing — has SOUL, feels human + premium
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

// Inter Tight: tighter than regular Inter, more editorial
const interTight = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-devanagari",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// DM Sans: Premium UI font for buttons, labels, stats — clean and modern
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// ── Dynamic metadata (async) — pulls Google verification code from DB if set
//    via admin Settings page. Falls back to default 'google8fc09a8ee177a7d9'.
async function getGoogleVerification(): Promise<string> {
  try {
    const { db } = await import('@/lib/db');
    const setting = await db.siteSetting.findUnique({
      where: { key: 'google_site_verification' },
    });
    return setting?.value || 'google8fc09a8ee177a7d9';
  } catch {
    return 'google8fc09a8ee177a7d9';
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const googleVerification = await getGoogleVerification();
  return {
  metadataBase: new URL('https://paliwalsecure.in'),
  title: {
    default: "Paliwal Secure AI — India's #1 AI Insurance Advisor | Compare 51+ Insurers",
    template: "%s | Paliwal Secure AI — Insurance Advisor India",
  },
  description:
    "India's #1 AI-powered insurance advisor. Compare 51+ IRDAI-registered insurers, get personalized recommendations with InsureGPT AI, enjoy hassle-free claims support & save up to ₹75,000 under Section 80D. Trusted by 500+ families. By Himanshu Paliwal — IRDAI Registered POSP (IP429834). Free consultation!",
  keywords: [
    // Core insurance terms
    "insurance",
    "insurance India",
    "best insurance India",
    "insurance advisor",
    "insurance agent",
    "insurance comparison",
    "insurance comparison tool India",
    "online insurance India",
    "insurance POSP",
    "IRDAI POSP",
    // Health Insurance
    "health insurance",
    "health insurance India",
    "best health insurance India",
    "health insurance plans India",
    "family floater health insurance",
    "cashless health insurance",
    "senior citizen health insurance",
    "critical illness insurance India",
    "health insurance premium calculator",
    "health insurance waiting period",
    "pre-existing disease insurance",
    "health insurance for diabetes",
    "health insurance for heart disease",
    "health insurance for cancer",
    "maternity insurance India",
    "group health insurance",
    "OPD cover health insurance",
    "room rent capping insurance",
    "health insurance portability",
    "top-up health insurance",
    "family health insurance India",
    // Term / Life Insurance
    "term insurance",
    "life insurance",
    "term insurance India",
    "best term insurance India",
    "cheapest term insurance India",
    "term insurance plan comparison",
    "term insurance riders",
    "term insurance tax benefits 80C",
    "term insurance vs ULIP",
    "term insurance for non-smokers",
    "monthly income term plans",
    "free look period life insurance",
    "term insurance claim rejection reasons",
    "whole life insurance India",
    // Motor Insurance
    "motor insurance",
    "car insurance",
    "bike insurance",
    "car insurance India",
    "bike insurance India",
    "comprehensive car insurance",
    "third-party car insurance",
    "zero depreciation car insurance",
    "no claim bonus car insurance",
    "IDV car insurance",
    "own damage car insurance",
    "car insurance add-ons",
    "motor insurance renewal",
    "best bike insurance India 2025",
    "car insurance renewal online",
    "zero dep car insurance",
    // Claims & Support
    "insurance claim process India",
    "claim settlement ratio",
    "insurance CSR comparison",
    "cashless claim process",
    "reimbursement claim process",
    "insurance claim documents",
    "insurance ombudsman India",
    "Bima Bharosa portal",
    "Insurance Samadhan",
    "insurance grievance redressal",
    "IRDAI complaint",
    // Tax & Legal
    "insurance tax benefits 80D 80C",
    "Section 80D health insurance",
    "IRDAI guidelines 2025",
    "IRDAI certified insurance advisor",
    "policyholder rights India",
    "IRDAI new rules 2025",
    // Brand & Local
    "Paliwal Secure",
    "Paliwal Secure AI",
    "InsureGPT",
    "Paliwal insurance",
    "Himanshu Paliwal insurance",
    "insurance agent Kota",
    "insurance advisor Rajasthan",
    "insurance agent Kota Rajasthan",
    "insurance agent Kota",
    "insurance advisor Kota Rajasthan",
    "insurance near me",
    "insurance agent near me",
    "insurance advisor Kota",
    "Paliwal Insure",
    "paliwalinsure.com",
    "@paliwalinsure",
    // Calculators & Tools
    "insurance premium calculator India",
    "term insurance calculator",
    "car insurance calculator",
    "health insurance premium estimator",
    "insurance comparison tool",
    // Travel & Home
    "travel insurance India",
    "home insurance India",
    "travel insurance plans",
    // Voice search queries
    "best insurance plan for family",
    "how to file insurance claim",
    "which health insurance is best",
    "cheapest car insurance near me",
    "insurance for senior citizens",
    "what is claim settlement ratio",
    "how to compare insurance plans",
    "is term insurance worth it",
    "Ok Google best insurance advisor near me",
    "insurance agent Kota Rajasthan",
    "IRDAI certified insurance advisor near me",
    "best health insurance for family India 2025",
    "car insurance renewal online kaise karein",
    "health insurance kya hota hai",
    "term insurance kitna lena chahiye",
    // EV Insurance
    "EV insurance India",
    "electric vehicle insurance",
    "electric car insurance India",
    "electric scooter insurance",
    "battery insurance cover",
    "EV bike insurance India",
    // Additional GEO keywords
    "IRDAI POSP IP429834",
    "insurance POSP Kota",
    "AI insurance advisor India",
  ],
  authors: [{ name: "Himanshu Paliwal", url: "https://paliwalsecure.in" }],
  creator: "Himanshu Paliwal",
  publisher: "Paliwal Secure AI",
  category: "Finance > Insurance",
  classification: "Insurance Advisory",
  alternates: {
    canonical: 'https://paliwalsecure.in',
    languages: {
      'en-IN': 'https://paliwalsecure.in',
      'hi-IN': 'https://paliwalsecure.in',
      'x-default': 'https://paliwalsecure.in',
    },
  },
  verification: {
    google: googleVerification,
    other: {
      // Also expose as raw meta — some verification tools need this exact form
      'google-site-verification': googleVerification,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/logo-ps-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Paliwal Secure AI — India's #1 AI Insurance Advisor | Compare 51+ Insurers",
    description:
      "India's #1 AI-powered insurance advisor. Compare 51+ IRDAI-registered insurers instantly with InsureGPT AI. Get personalized health, term & motor insurance recommendations. Hassle-free claims support by IRDAI Registered POSP (IP429834). Trusted by 500+ Indian families. Free consultation!",
    url: "https://paliwalsecure.in",
    siteName: "Paliwal Secure AI",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://paliwalsecure.in/api/og?title=Paliwal+Secure+AI+%E2%80%94+India%27s+%231+AI+Insurance+Advisor&type=default",
        width: 1200,
        height: 630,
        alt: "Paliwal Secure AI — India's #1 AI-Powered Insurance Advisor | Compare 51+ Insurers",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@paliwalinsure",
    title: "Paliwal Secure AI — India's #1 AI Insurance Advisor",
    description:
      "Compare 51+ insurers with AI-powered InsureGPT. Best health, term & motor insurance plans for Indian families. IRDAI Registered POSP (IP429834). Hassle-free claim support by Himanshu Paliwal. Free consultation!",
    images: [
      {
        url: "https://paliwalsecure.in/api/og?title=Paliwal+Secure+AI+%E2%80%94+India%27s+%231+AI+Insurance+Advisor&type=default",
        alt: "Paliwal Secure AI — AI Insurance Advisor India",
      },
    ],
    creator: "@paliwalinsure",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
    "theme-color": "#0A1330",
    "format-detection": "telephone=yes",
    "application-name": "Paliwal Secure AI — Insurance Advisor",
    "apple-mobile-web-app-title": "Paliwal Secure AI",
    "referrer": "origin-when-cross-origin",
    "msapplication-TileColor": "#0A1330",
    "msapplication-navbutton-color": "#0A1330",
    "geo.region": "IN-RJ",
    "geo.placename": "Kota, Rajasthan, India",
    "geo.position": "25.18;75.8648",
    "ICBM": "25.18, 75.8648",
  },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P47L386Z');`,
          }}
        />
        {/* Blocking script: read language & theme from localStorage BEFORE React hydrates to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var lang = localStorage.getItem('paliwal-language');
                if (lang === 'hi') {
                  document.documentElement.lang = 'hi';
                  document.documentElement.classList.add('hindi-active');
                } else if (lang === 'hinglish') {
                  document.documentElement.lang = 'hi';
                }
              } catch(e) {}
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
                // Light mode is default — no class needed
              } catch(e) {
                // Default to light mode (no class)
              }
            `,
          }}
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Preconnect hints for performance — DNS resolve & TCP handshake early */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Prefetch critical fonts */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Canonical & hreflang — verified via metadata alternates */}
        <link rel="alternate" hrefLang="en" href="https://paliwalsecure.in" />
        <link rel="alternate" hrefLang="hi" href="https://paliwalsecure.in" />
        <link rel="alternate" hrefLang="x-default" href="https://paliwalsecure.in" />
        {/* JSON-LD Structured Data for SEO */}
        <StructuredData type="website" />
        <StructuredData type="organization" />
        <StructuredData type="localBusiness" />
        <StructuredData type="faq" />
        <StructuredData type="breadcrumb" />
      </head>
      <body
        className={`${fraunces.variable} ${interTight.variable} ${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoSerifDevanagari.variable} ${dmSans.variable} min-h-screen flex flex-col overflow-x-clip antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P47L386Z"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <GoogleAnalytics gaId="G-TKQ9X6G5HX" />
        <SafeThemeProvider>
          <StyledComponentsRegistry>
            <WebMCPProvider>
            <SafeRender name="AnimatedBackground">
              <AnimatedBackground />
            </SafeRender>
            <LanguageProvider>
              <SafeRender name="SiteHeader">
                <SiteHeader />
              </SafeRender>
              <main className="flex-1 relative z-10">{children}</main>
              <SafeRender name="FooterWrapper">
                <FooterWrapper />
              </SafeRender>
              <SafeRender name="FloatingChatBot">
                <PublicOnly>
                  <FloatingChatBot />
                </PublicOnly>
              </SafeRender>
              <SafeRender name="WhatsAppFAB">
                <PublicOnly>
                  <WhatsAppFAB />
                </PublicOnly>
              </SafeRender>
              <SafeRender name="ScrollProgress">
                <ScrollProgress />
              </SafeRender>
              <SafeRender name="PWARegistrar">
                <PWARegistrar />
              </SafeRender>
              <SafeRender name="PWAInstallPrompt">
                <PWAInstallPrompt />
              </SafeRender>
              <SafeRender name="ConsentModal">
                <ConsentModal />
              </SafeRender>
              <Toaster />
            </LanguageProvider>
            </WebMCPProvider>
          </StyledComponentsRegistry>
        </SafeThemeProvider>
      </body>
    </html>
  );
}
