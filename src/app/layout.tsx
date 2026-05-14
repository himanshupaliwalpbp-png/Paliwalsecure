import type { Metadata } from "next";
import { Inter, Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { ScrollProgress } from "@/components/ScrollProgress";

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paliwal Secure — AI se Best Plan, Humse Easy Claim",
  description:
    "India's most trusted AI-powered insurance advisor. Compare 51+ insurers, get personalized recommendations with InsureGPT, and enjoy hassle-free claims support. By Himanshu Paliwal.",
  keywords: [
    "insurance",
    "India",
    "health insurance",
    "life insurance",
    "motor insurance",
    "AI",
    "Paliwal Secure",
    "InsureGPT",
    "IRDAI",
    "claim settlement",
    "tax saving",
    "term insurance",
  ],
  authors: [{ name: "Himanshu Paliwal" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Paliwal Secure — AI se Best Plan, Humse Easy Claim",
    description:
      "AI-powered recommendations from 51+ insurers. Smart insurance for every Indian family. By Himanshu Paliwal.",
    url: "https://paliwalsecure.in",
    siteName: "Paliwal Secure",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paliwal Secure — AI se Best Plan, Humse Easy Claim",
    description:
      "AI-powered recommendations from 51+ insurers. Smart insurance for every Indian family. By Himanshu Paliwal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} ${ibmPlexMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollProgress />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
