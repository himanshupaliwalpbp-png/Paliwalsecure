'use client';

import { useEffect, useRef } from 'react';
import { Flame, Headphones, Plane, ShoppingBag, Footprints, Pill } from 'lucide-react';

/* ── Deal data ─────────────────────────────────────────────────────────── */
const deals = [
  { name: 'GoNoise', discount: '60% OFF', icon: Headphones, link: 'https://track.vcommission.com/click?campaign_id=10320&pub_id=129419' },
  { name: 'Agoda', discount: 'Upto 60% OFF', icon: Plane, link: 'https://bitli.in/oNhm9y9' },
  { name: 'Amazon', discount: 'Upto 80% OFF', icon: ShoppingBag, link: 'https://amzn.to/4cHhgQT' },
  { name: 'Myntra', discount: 'Upto 71% OFF', icon: Footprints, link: 'https://bitli.in/myntra-fashion' },
  { name: 'Nutriburst', discount: 'Buy 2 @ ₹649', icon: Pill, link: '#nutriburst-deal' },
];

/* ── Ticker item ────────────────────────────────────────────────────────── */
function TickerItem({ deal }: { deal: typeof deals[0] }) {
  const Icon = deal.icon;
  return (
    <a
      href={deal.link}
      target={deal.link.startsWith('#') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-5 py-1.5 whitespace-nowrap text-muted-foreground font-mono text-sm hover:text-foreground transition-colors cursor-pointer"
    >
      <Flame className="w-3.5 h-3.5 text-primary" />
      <span>{deal.name}</span>
      <span className="text-primary font-bold">{deal.discount}</span>
      <span className="mx-2 text-border">|</span>
    </a>
  );
}

/* ── Main Ticker Component ──────────────────────────────────────────────── */
export default function DealTicker() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Duplicate content for seamless infinite scroll
    const scroller = scrollerRef.current;
    if (!scroller) return;
    
    const content = scroller.innerHTML;
    scroller.innerHTML = content + content;
    scroller.classList.add('animate-scroll-ticker');
  }, []);

  return (
    <div className="w-full overflow-hidden relative bg-card border-y border-border">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-card to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-card to-transparent" />

      <div
        ref={scrollerRef}
        className="flex items-center py-2"
        style={{ width: 'max-content' }}
      >
        {deals.map((deal, i) => (
          <TickerItem key={i} deal={deal} />
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-ticker {
          animation: scroll-ticker 20s linear infinite;
        }
        .animate-scroll-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
