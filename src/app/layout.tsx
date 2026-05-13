import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paliwal Secure - Smart Insurance for Every Indian",
  description:
    "AI-powered insurance recommendations tailored for India. Compare health, life, motor, travel and home insurance plans with Paliwal Secure.",
  keywords: [
    "insurance",
    "India",
    "health insurance",
    "life insurance",
    "AI",
    "Paliwal Secure",
    "InsureGPT",
    "IRDAI",
  ],
  authors: [{ name: "Himanshu Paliwal" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Paliwal Secure - Smart Insurance for Every Indian",
    description:
      "AI-powered insurance recommendations tailored for India. Compare health, life, motor, travel and home insurance plans with Paliwal Secure.",
    url: "https://paliwalsecure.in",
    siteName: "Paliwal Secure",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paliwal Secure - Smart Insurance for Every Indian",
    description:
      "AI-powered insurance recommendations tailored for India. Compare health, life, motor, travel and home insurance plans with Paliwal Secure.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
