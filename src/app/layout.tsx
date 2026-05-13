import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InsureGPT - Smart Insurance for Every Indian",
  description:
    "AI-powered insurance recommendations tailored for India. Compare health, life, motor, travel and home insurance plans with InsureGPT.",
  keywords: [
    "insurance",
    "India",
    "health insurance",
    "life insurance",
    "AI",
    "InsureGPT",
    "IRDAI",
  ],
  authors: [{ name: "InsureGPT" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "InsureGPT - Smart Insurance for Every Indian",
    description:
      "AI-powered insurance recommendations tailored for India. Compare health, life, motor, travel and home insurance plans with InsureGPT.",
    url: "https://insuregpt.in",
    siteName: "InsureGPT",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "InsureGPT - Smart Insurance for Every Indian",
    description:
      "AI-powered insurance recommendations tailored for India. Compare health, life, motor, travel and home insurance plans with InsureGPT.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
