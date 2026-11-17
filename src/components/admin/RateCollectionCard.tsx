'use client';

import { useEffect, useState } from 'react';
import { Star, Copy, Check, MessageCircle, TrendingUp, Users, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RATE_URL = 'https://paliwalsecure.in/rate';
const WA_SHARE_MSG = `Namaste! Aapka Paliwal Secure ke saath experience kaisa raha? Please apni rating dein — sirf 30 second me: ${RATE_URL}`;

type Stats = {
  averageRating: number;
  totalReviews: number;
  verifiedCount: number;
};

/**
 * RateCollectionCard — the owner's daily driver.
 * Shown at the top of the Reviews moderation page: live stats + one-tap
 * copy tools for the /rate link and the ready-made WhatsApp share message.
 */
export function RateCollectionCard({ pendingCount = 0 }: { pendingCount?: number }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<'link' | 'msg' | null>(null);

  useEffect(() => {
    fetch('/api/reviews/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.totalReviews === 'number') setStats(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copy = async (text: string, which: 'link' | 'msg') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const avg = stats?.averageRating ? stats.averageRating.toFixed(1) : '—';

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          {/* Header + stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8C97E] to-[#C98A1C] flex items-center justify-center shadow-[0_6px_18px_-6px_rgba(201,138,28,0.6)]">
                <Star className="w-5 h-5 text-[#1A130C] fill-[#1A130C]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">
                  Collect 5-Star Ratings
                </h3>
                <p className="text-xs text-slate-500">
                  Customer ko link WhatsApp par bhejein — 5 taps me rating mil jayegi.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C98A1C]" />
                  {loading ? '…' : avg}
                  <Star className="w-3 h-3 text-[#C98A1C] fill-[#C98A1C]" />
                </div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                  Avg Rating
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                  <Users className="w-3.5 h-3.5 text-[#C98A1C]" />
                  {loading ? '…' : stats?.totalReviews ?? 0}
                </div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                  Approved
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5">
                <div className="flex items-center gap-1 text-sm font-bold text-amber-700">
                  <Clock className="w-3.5 h-3.5" />
                  {pendingCount}
                </div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-amber-600/70 mt-0.5">
                  Pending
                </p>
              </div>
            </div>
          </div>

          {/* Share tools */}
          <div className="lg:w-[340px] shrink-0 rounded-xl border border-amber-200/70 bg-amber-50/60 p-3.5">
            <p className="text-[0.62rem] font-bold uppercase tracking-wider text-amber-700 mb-1.5">
              Rating page link
            </p>
            <div className="flex items-center gap-1.5">
              <a
                href={RATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 truncate font-mono text-xs font-semibold text-[#8B3520] hover:underline"
                title={RATE_URL}
              >
                {RATE_URL}
                <ExternalLink className="inline w-3 h-3 ml-1 -mt-0.5" />
              </a>
              <Button
                size="sm"
                className="h-9 bg-gradient-to-r from-[#E8C97E] to-[#C98A1C] hover:from-[#F0D48A] hover:to-[#B8482C] text-[#1A130C] font-bold"
                onClick={() => copy(RATE_URL, 'link')}
              >
                {copied === 'link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-200/70">
              <Button
                size="sm"
                variant="outline"
                className="w-full h-9 border-[#1FA855]/40 text-[#148A43] hover:bg-[#1FA855]/10 font-semibold"
                onClick={() => copy(WA_SHARE_MSG, 'msg')}
              >
                {copied === 'msg' ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Message Copied
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-3.5 h-3.5 mr-1" />
                    Copy WhatsApp Message
                  </>
                )}
              </Button>
              <p className="mt-1.5 text-[0.62rem] text-slate-500 leading-snug">
                Pehle message copy karein, phir customer chat me paste karke bhejein.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
