"use client";

/**
 * SaverFaq — Radix accordion over the saver rulebook FAQs
 * (+ 2 custom trust questions).
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BadgeCheck, Ban, HelpCircle } from "lucide-react";
import { SAVER_FAQS } from "@/lib/saver/constants";
import { Reveal, SectionHeading } from "./saver-ui";

const EXTRA_FAQS = [
  {
    q: "Is this tax evasion in disguise?",
    a: "No — categorically. Paliwal Saver only surfaces reliefs and allowances the law already gives you: zero-MDR categories RBI/NPCI defined, presumptive taxation the Income-tax Act offers, and input credits GST rules allow. We refuse splitting, suppression and off-book tricks — the AI literally declines them and explains which rule you would breach.",
  },
  {
    q: "How is all of this free?",
    a: "The calculators and Saver AI are free because they run on a curated public rulebook — no paid data, no lock-in. Paliwal Secure AI earns separately, from insurance advisory (IRDAI Registered POSP IP429834), which we will only ever offer if you ask for it.",
  },
];

export default function SaverFaq() {
  const faqs = [...SAVER_FAQS.slice(0, 6), ...EXTRA_FAQS];
  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="saver-faq">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={
              <>
                <HelpCircle className="h-3.5 w-3.5" aria-hidden /> FAQ
              </>
            }
            title="Straight answers,"
            accent="no fine print."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="saver-glass rounded-2xl border-white/[0.08] px-5 transition-colors data-[state=open]:border-[#D4A853]/35"
              >
                <AccordionTrigger className="py-4 text-left text-[15px] font-semibold text-[#FAF7F2] hover:text-[#E8C97E] hover:no-underline [&[data-state=open]>svg]:text-[#D4A853]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-0 text-[13px] leading-relaxed text-[#9BA3AE]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-[#2DD4A8]/25 bg-[#2DD4A8]/8 px-4 py-3">
              <BadgeCheck className="h-5 w-5 shrink-0 text-[#2DD4A8]" aria-hidden />
              <p className="text-[12px] leading-relaxed text-[#9BA3AE]">
                <span className="font-semibold text-[#6FDDB9]">We do:</span> rule-matched legal savings with sources.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[#E86A5E]/25 bg-[#E86A5E]/8 px-4 py-3">
              <Ban className="h-5 w-5 shrink-0 text-[#E86A5E]" aria-hidden />
              <p className="text-[12px] leading-relaxed text-[#9BA3AE]">
                <span className="font-semibold text-[#F09A91]">We never:</span> splitting, suppression, off-books — refused on the spot.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
