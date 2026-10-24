"use client";

/**
 * Paliwal Saver — shared UI primitives for the dark module.
 * Glass cards, reveal choreography, section headings, status chips.
 */

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────── smooth scrolling ─────────────────────────── */

export function smoothScrollTo(hash: string): void {
  const el = document.querySelector(hash);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/* ─────────────────────────── reveal choreography ─────────────────────────── */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.6, ease: EASE },
  }),
};

/** Scroll-reveal wrapper — children stagger in when the block enters the viewport. */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUpVariants}
      custom={reduce ? 0 : index}
      initial="hidden"
      animate={inView || reduce ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── typography helpers ─────────────────────────── */

/** Italic gold-gradient accent word inside a display heading. */
export function GoldWord({ children }: { children: React.ReactNode }) {
  return (
    <em className="saver-gold-text font-display italic" style={{ fontStyle: "italic" }}>
      {children}
    </em>
  );
}

/** Section eyebrow + display heading + sub-copy, consistent rhythm. */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <Reveal>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A853]/30 bg-[#D4A853]/[0.07] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8C97E]">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal index={1}>
        <h2 className="font-display text-3xl font-medium leading-[1.08] tracking-tight text-[#FAF7F2] sm:text-4xl md:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal index={2}>
          <p className="mt-4 text-base leading-relaxed text-[#9BA3AE] sm:text-lg">{sub}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ─────────────────────────── chips + cards ─────────────────────────── */

export function GlassCard({
  children,
  className,
  hover = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "aside" | "section";
}) {
  return (
    <Tag
      className={cn(
        "saver-glass rounded-2xl",
        hover && "saver-glass-hover",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export type ChipTone = "gold" | "emerald" | "red" | "muted";

const CHIP_TONES: Record<ChipTone, string> = {
  gold: "border-[#D4A853]/35 bg-[#D4A853]/10 text-[#E8C97E]",
  emerald: "border-[#2DD4A8]/35 bg-[#2DD4A8]/10 text-[#6FF0C8]",
  red: "border-[#E86A5E]/35 bg-[#E86A5E]/10 text-[#F1998F]",
  muted: "border-white/12 bg-white/[0.05] text-[#9BA3AE]",
};

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: ChipTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        CHIP_TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Field label used across calculator forms. */
export function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9BA3AE]"
    >
      {children}
      {hint ? (
        <span className="ml-2 font-normal normal-case tracking-normal text-[#6B7280]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/** Micro disclaimer line with shield icon. */
export function DisclaimerNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-[#7A828E]">
      <span aria-hidden className="mt-0.5 text-[#D4A853]/60">※</span>
      <span>{children}</span>
    </p>
  );
}
