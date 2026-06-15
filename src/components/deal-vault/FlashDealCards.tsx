'use client';

import { useState, useEffect } from 'react';
import { Flame, Headphones, Plane, ShoppingBag, Footprints, Pill, Zap } from 'lucide-react';

/* ── Deal card data ─────────────────────────────────────────────────────── */
interface DealData {
  id: string;
  icon: React.ElementType;
  title: string;
  badge: string;
  discount: string;
  originalPrice?: string;
  salePrice?: string;
  socialProof: string;
  ctaText: string;
  link: string;
  dealsLeft: number;
  totalDeals: number;
}

const deals: DealData[] = [
  {
    id: 'gonoise',
    icon: Headphones,
    title: 'GoNoise Smartwatches & Earbuds',
    badge: 'HOT DEAL',
    discount: '60% OFF',
    originalPrice: '₹5,999',
    salePrice: '₹2,399',
    socialProof: '127 log dekh rahe hain',
    ctaText: 'Deal Lo',
    link: 'https://track.vcommission.com/click?campaign_id=10320&pub_id=129419',
    dealsLeft: 23,
    totalDeals: 100,
  },
  {
    id: 'agoda',
    icon: Plane,
    title: 'Agoda Flights & Hotels',
    badge: 'TRAVEL DEAL',
    discount: 'Upto 60% OFF',
    socialProof: '89 bookings aaj',
    ctaText: 'Book Karo',
    link: 'https://bitli.in/oNhm9y9',
    dealsLeft: 45,
    totalDeals: 100,
  },
  {
    id: 'amazon',
    icon: ShoppingBag,
    title: 'Amazon India',
    badge: 'MEGA SALE',
    discount: 'Upto 80% OFF',
    socialProof: '234 orders aaj',
    ctaText: 'Shop Karo',
    link: 'https://amzn.to/4cHhgQT',
    dealsLeft: 67,
    totalDeals: 100,
  },
  {
    id: 'myntra',
    icon: Footprints,
    title: 'Myntra Fashion',
    badge: 'FASHION DEAL',
    discount: 'Upto 71% OFF',
    socialProof: '56 purchases aaj',
    ctaText: 'Fashion Dekho',
    link: 'https://bitli.in/myntra-fashion',
    dealsLeft: 31,
    totalDeals: 100,
  },
  {
    id: 'nutriburst',
    icon: Pill,
    title: 'Nutriburst Wellness Gummies',
    badge: 'WELLNESS DEAL',
    discount: 'Buy 2 @ ₹649',
    originalPrice: '₹1,298',
    salePrice: '₹649',
    socialProof: '42 log khareed rahe hain',
    ctaText: 'Order Karo',
    link: 'https://nutriburst.co/?ref=paliwalsecure',
    dealsLeft: 18,
    totalDeals: 60,
  },
];

/* ── Countdown timer hook ───────────────────────────────────────────────── */
function useMidnightCountdown() {
  const calcTime = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    return {
      h: Math.floor(diff / (1000 * 60 * 60)),
      m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      s: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calcTime);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calcTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

/* ── Single Deal Card ───────────────────────────────────────────────────── */
function DealCard({ deal, timeLeft }: { deal: DealData; timeLeft: ReturnType<typeof useMidnightCountdown> }) {
  const [isHovered, setIsHovered] = useState(false);
  const remaining = ((deal.totalDeals - deal.dealsLeft) / deal.totalDeals) * 100;
  const Icon = deal.icon;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className={`relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 cursor-pointer group ${
        isHovered ? '-translate-y-1 shadow-lg' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-primary-foreground uppercase tracking-wider bg-primary">
          {deal.badge}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 pt-12">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground leading-tight mt-1">{deal.title}</h3>
        </div>

        {/* Discount */}
        <div className="mb-3">
          <span className="text-2xl font-extrabold text-primary">
            {deal.discount}
          </span>
        </div>

        {/* Price */}
        {deal.originalPrice && deal.salePrice && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground line-through">{deal.originalPrice}</span>
            <span className="text-lg font-bold text-foreground">{deal.salePrice}</span>
          </div>
        )}

        {/* Countdown Timer */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-[10px] text-muted-foreground font-medium mr-1">Ends in</span>
          <div className="flex items-center gap-0.5">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">{pad(timeLeft.h)}</span>
            <span className="text-primary font-bold text-xs">:</span>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">{pad(timeLeft.m)}</span>
            <span className="text-primary font-bold text-xs">:</span>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">{pad(timeLeft.s)}</span>
          </div>
        </div>

        {/* Scarcity Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-semibold text-primary">
              Sirf {deal.dealsLeft} deals bache!
            </span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 bg-primary"
              style={{ width: `${remaining}%` }}
            />
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] text-muted-foreground">{deal.socialProof}</span>
        </div>

        {/* CTA Button */}
        <a
          href={deal.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="block w-full text-center py-2.5 rounded-full font-bold text-sm bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95"
        >
          {deal.ctaText}
        </a>
      </div>
    </div>
  );
}

/* ── Main Flash Deal Cards Component ────────────────────────────────────── */
export default function FlashDealCards() {
  const timeLeft = useMidnightCountdown();

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          Flash Deals — Aaj Hi Grab Karo!
        </h2>
        <p className="text-sm text-muted-foreground">
          Limited time offers — midnight ke pehle khatam!
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} timeLeft={timeLeft} />
        ))}
      </div>
    </div>
  );
}
