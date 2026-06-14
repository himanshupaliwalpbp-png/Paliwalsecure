import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Home,
  Heart,
  Car,
  GitCompare,
  BookOpen,
  MessageCircle,
  Phone,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Paliwal Secure',
  description:
    'यह पेज मौजूद नहीं है। Paliwal Secure पर वापस जाएं — Health Insurance, Car Insurance, Compare Plans, और InsureGPT AI के साथ सही प्लान खोजें।',
  robots: { index: false, follow: false },
}

const quickLinks = [
  {
    href: '/#health-insurance',
    label: 'Health Insurance',
    labelHi: 'हेल्थ इंश्योरेंस',
    icon: Heart,
    color: 'text-rose-500',
  },
  {
    href: '/#motor-insurance',
    label: 'Car Insurance',
    labelHi: 'कार इंश्योरेंस',
    icon: Car,
    color: 'text-sky-500',
  },
  {
    href: '/#compare',
    label: 'Compare Plans',
    labelHi: 'प्लान तुलना करें',
    icon: GitCompare,
    color: 'text-amber-500',
  },
  {
    href: '/blog',
    label: 'Blog',
    labelHi: 'ब्लॉग',
    icon: BookOpen,
    color: 'text-emerald-500',
  },
  {
    href: '/#insuregpt',
    label: 'InsureGPT AI',
    labelHi: 'इंश्योरजीपीटी',
    icon: MessageCircle,
    color: 'text-violet-500',
  },
]

export default function NotFound() {
  const whatsappUrl =
    'https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20finding%20the%20right%20insurance%20plan'

  return (
    <>
      {/* JSON-LD BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://paliwalsecure.in',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Page Not Found',
              },
            ],
          }),
        }}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-2xl space-y-8">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Page Not Found</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* 404 Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/10">
              <ShieldCheck className="size-10 text-primary" />
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-primary">
              404
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              Page Not Found / पेज नहीं मिला
            </p>
            <p className="text-muted-foreground max-w-md mx-auto">
              यह पेज मौजूद नहीं है या हटा दिया गया है। कृपया नीचे दिए गए लिंक्स
              से सही पेज पर जाएं।
            </p>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              This page doesn&apos;t exist or has been moved. Use the links below
              to find what you need.
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Card
                key={link.href}
                className="group hover:shadow-md transition-shadow"
              >
                <Link href={link.href} className="block h-full">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className={`shrink-0 size-10 rounded-lg bg-muted flex items-center justify-center ${link.color}`}
                    >
                      <link.icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {link.label}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {link.labelHi}
                      </p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="size-5 text-green-600" />
                Need Help? / मदद चाहिए?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                सही इंश्योरेंस प्लान खोजने में मदद चाहिए? Himanshu Paliwal से
                सीधे WhatsApp पर बात करें — फ्री कंसल्टेशन!
              </p>
              <p className="text-sm text-muted-foreground">
                Need help finding the right plan? Chat directly with Himanshu
                Paliwal on WhatsApp — free consultation!
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" />
                    WhatsApp Now
                  </a>
                </Button>
                <Badge variant="secondary" className="text-xs">
                  +91 9257877312
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Back Home */}
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to Home / होम पेज पर वापस जाएं
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
