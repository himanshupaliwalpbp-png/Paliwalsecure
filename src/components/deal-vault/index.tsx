'use client';

import { Flame } from 'lucide-react';
import DealTicker from './DealTicker';
import FlashDealCards from './FlashDealCards';
import SpinTheWheel from './SpinTheWheel';

export default function DealVault() {
  return (
    <section className="relative w-full" id="deal-vault">
      {/* ── Component 1: Scrolling Deal Ticker (Fixed at top) ── */}
      <DealTicker />

      {/* ── Main Content Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12 md:space-y-20">
        {/* Section Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs font-bold uppercase tracking-wider">
              Affiliate Deals
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-3"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Deal Vault
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Best deals from top brands — sirf Paliwal Secure ke liye!
          </p>
        </div>

        {/* ── Component 2: Flash Deal Cards with Timer ── */}
        <FlashDealCards />

        {/* ── Component 3: Spin The Wheel ── */}
        <SpinTheWheel />
      </div>

      {/* ── Affiliate Disclosure ── */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
          *Affiliate links — aapki koi extra cost nahi. Hum small commission kamaate hain jo humein website chalaane mein madad karta hai. 
          Transparency hamari policy hai
        </p>
      </div>
    </section>
  );
}
