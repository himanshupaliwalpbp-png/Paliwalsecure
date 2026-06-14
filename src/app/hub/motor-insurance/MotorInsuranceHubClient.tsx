'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { vehicles } from '@/data/vehicles';
import { motorInsurers } from '@/data/insurers';
import { useLanguage } from '@/lib/i18n';
import {
  Car, Bike, Zap, Shield, IndianRupee, Wrench,
  ArrowRight, MessageCircle, ChevronRight, Star,
  FileCheck, RotateCcw, Gauge, Lock, Siren,
} from 'lucide-react';

function getLocalizedFaqs(t: (key: string) => string) {
  return [
    { question: t('motorHub.faq.q1'), answer: t('motorHub.faq.a1') },
    { question: t('motorHub.faq.q2'), answer: t('motorHub.faq.a2') },
    { question: t('motorHub.faq.q3'), answer: t('motorHub.faq.a3') },
    { question: t('motorHub.faq.q4'), answer: t('motorHub.faq.a4') },
    { question: t('motorHub.faq.q5'), answer: t('motorHub.faq.a5') },
    { question: t('motorHub.faq.q6'), answer: t('motorHub.faq.a6') },
    { question: t('motorHub.faq.q7'), answer: t('motorHub.faq.a7') },
  ];
}

export default function MotorInsuranceHubClient() {
  const { t } = useLanguage();

  const cars = vehicles.filter(v => v.category === 'car').slice(0, 8);
  const bikes = vehicles.filter(v => v.category === 'bike').slice(0, 6);
  const evs = vehicles.filter(v => v.isEV).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">{t('nav.home')}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{t('motorHub.title').split('—')[0].trim()}</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Car className="h-3.5 w-3.5 mr-1" />
              {t('motorHub.badge')}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {t('motorHub.title').split('—')[0].trim()}{' '}
              <span className="text-primary">{t('motorHub.title').split('—')[1]?.trim() || 'Car, Bike & EV Insurance Guide 2025'}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('motorHub.description')}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: IndianRupee, label: t('motorHub.quickStats.tpRate'), value: '₹3,416/yr' },
                { icon: Gauge, label: t('motorHub.quickStats.avgComp'), value: '₹20,000/yr' },
                { icon: Zap, label: t('motorHub.quickStats.evDiscount'), value: '15%' },
                { icon: Shield, label: t('motorHub.quickStats.irdaiCert'), value: 'POSP IP429834' },
              ].map((stat, i) => (
                <Card key={i} className="bg-background/80 backdrop-blur">
                  <CardContent className="p-3 text-center">
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-sm font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                <MessageCircle className="h-5 w-5" />
                {t('motorHub.getQuote')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">

        {/* Vehicle Insurance Section */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            {t('motorHub.popularCar')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('motorHub.popularCarDesc')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cars.map(car => (
              <Link key={car.slug} href={`/insurance/${car.slug}`}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <Car className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-sm font-semibold">{car.brand} {car.name}</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(car.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                    <p className="text-[10px] text-muted-foreground">IDV: ₹{(car.idv / 100000).toFixed(1)}L</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* Bike Insurance */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            {t('motorHub.popularBike')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('motorHub.popularBikeDesc')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {bikes.map(bike => (
              <Link key={bike.slug} href={`/insurance/${bike.slug}`}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <Bike className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-sm font-semibold">{bike.brand} {bike.name}</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(bike.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* EV Insurance */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            {t('motorHub.evInsurance')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('motorHub.evDesc')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {evs.map(ev => (
              <Link key={ev.slug} href={`/insurance/${ev.slug}`}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
                  <CardContent className="p-3 text-center">
                    <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                    <p className="text-sm font-semibold">{ev.brand} {ev.name}</p>
                    <p className="text-xs text-muted-foreground">TP: ₹{(ev.tp_base ?? 0).toLocaleString('en-IN')}/yr</p>
                    <Badge className="mt-1 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" variant="secondary">
                      {t('motorHub.evDiscount')}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/bike-insurance">
              <Button variant="outline" className="gap-2">
                {t('motorHub.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <Separator />

        {/* IRDAI TP Rates Table */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <IndianRupee className="h-6 w-6 text-primary" />
            {t('motorHub.irdaiRates')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('motorHub.irdaiRatesDesc')}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">{t('motorHub.vehicleType')}</th>
                  <th className="text-center p-3 font-semibold">{t('motorHub.oneYearTP')}</th>
                  <th className="text-center p-3 font-semibold">{t('motorHub.threeYearTP')}</th>
                  <th className="text-center p-3 font-semibold">{t('motorHub.fiveYearTP')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: t('motorHub.tpRate.carUpTo1000'), one: '₹2,861', three: '₹8,583', five: '—' },
                  { type: t('motorHub.tpRate.car1000To1500'), one: '₹3,416', three: '₹10,248', five: '—' },
                  { type: t('motorHub.tpRate.carAbove1500'), one: '₹7,890', three: '₹23,670', five: '—' },
                  { type: t('motorHub.tpRate.bikeUpTo75'), one: '₹538', three: '—', five: '₹2,690' },
                  { type: t('motorHub.tpRate.bike75to150'), one: '₹1,194', three: '—', five: '₹5,970' },
                  { type: t('motorHub.tpRate.bike150to350'), one: '₹1,366', three: '—', five: '₹6,830' },
                  { type: t('motorHub.tpRate.bikeAbove350'), one: '₹3,443', three: '—', five: '₹17,215' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                    <td className="p-3 font-medium">{row.type}</td>
                    <td className="p-3 text-center">{row.one}</td>
                    <td className="p-3 text-center">{row.three}</td>
                    <td className="p-3 text-center">{row.five}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Separator />

        {/* Motor Comparisons */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            {t('motorHub.comparison')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('motorHub.comparisonDesc')}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">{t('motorHub.insurer')}</th>
                  <th className="text-center p-3 font-semibold">CSR</th>
                  <th className="text-center p-3 font-semibold">{t('motorHub.garageNetwork')}</th>
                  <th className="text-center p-3 font-semibold">{t('motorHub.odRate')}</th>
                  <th className="text-center p-3 font-semibold">{t('motorHub.claimRating')}</th>
                </tr>
              </thead>
              <tbody>
                {motorInsurers.map((ins, i) => (
                  <tr key={ins.slug} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                    <td className="p-3 font-medium">{ins.name}</td>
                    <td className="p-3 text-center">{ins.csr}%</td>
                    <td className="p-3 text-center">{(ins.networkGarages ?? 0).toLocaleString()}+</td>
                    <td className="p-3 text-center">{ins.odRatePercent}%</td>
                    <td className="p-3 text-center">
                      {'⭐'.repeat(ins.claimProcessRating)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Separator />

        {/* Add-ons Section */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            {t('motorHub.addons')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('motorHub.addonsDesc')}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: t('motorHub.addon.zeroDep'), desc: t('motorHub.addon.zeroDepDesc'), icon: Shield, cost: '~15-20% of OD' },
              { name: t('motorHub.addon.engineProtect'), desc: t('motorHub.addon.engineProtectDesc'), icon: Wrench, cost: '~₹1,500-3,000/yr' },
              { name: t('motorHub.addon.rsa'), desc: t('motorHub.addon.rsaDesc'), icon: Siren, cost: '~₹500-1,500/yr' },
              { name: t('motorHub.addon.rti'), desc: t('motorHub.addon.rtiDesc'), icon: FileCheck, cost: '~₹2,000-4,000/yr' },
              { name: t('motorHub.addon.consumables'), desc: t('motorHub.addon.consumablesDesc'), icon: Lock, cost: '~₹800-1,500/yr' },
              { name: t('motorHub.addon.ncbProtection'), desc: t('motorHub.addon.ncbProtectionDesc'), icon: RotateCcw, cost: '~₹1,000-2,000/yr' },
            ].map((addon, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <addon.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-sm">{addon.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{addon.desc}</p>
                  <Badge variant="secondary" className="text-[10px]">{addon.cost}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Claim Process */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            {t('motorHub.claimProcess')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: t('motorHub.claim.step1'), desc: t('motorHub.claim.step1Desc') },
              { step: 2, title: t('motorHub.claim.step2'), desc: t('motorHub.claim.step2Desc') },
              { step: 3, title: t('motorHub.claim.step3'), desc: t('motorHub.claim.step3Desc') },
              { step: 4, title: t('motorHub.claim.step4'), desc: t('motorHub.claim.step4Desc') },
            ].map(s => (
              <Card key={s.step}>
                <CardContent className="p-4">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-2">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/claim-guide">
              <Button variant="outline" className="gap-2">
                {t('motorHub.detailedClaimGuide')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <Separator />

        {/* Expert Insight */}
        <ExpertInsight
          insight={t('motorHub.expertInsight')}
          topic={t('motorHub.expertTopic')}
        />

        <Separator />

        {/* FAQ Section */}
        <FAQSection faqs={getLocalizedFaqs(t)} title={t('motorHub.faqTitle')} />

        <Separator />

        {/* CTA Section */}
        <section className="text-center py-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
          <h2 className="text-2xl font-bold mb-3">{t('motorHub.bestQuote')}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t('motorHub.bestQuoteDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                <MessageCircle className="h-5 w-5" />
                {t('motorHub.quoteWhatsApp')}
              </Button>
            </a>
            <Link href="/compare">
              <Button size="lg" variant="outline" className="gap-2">
                {t('motorHub.compareInsurers')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
