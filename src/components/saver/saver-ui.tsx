"use client";

/**
 * Paliwal Saver — shared UI primitives & hooks (dark glass design system).
 * Ink canvas · gold (#D4A853) · emerald (#2DD4A8) · Fraunces display · mono numerals.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { formatINR } from "@/lib/saver/format";

/* ── Count-up hook ─────────────────────────────────────────────────────────── */

export function useCountUp(target: number | null | undefined, duration = 1100): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (target == null || Number.isNaN(target)) return;
    if (reduced) {
      setValue(target);
      prev.current = target;
      return;
    }
    let raf = 0;
    const from = prev.current;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return value;
}

/** Animated ₹ figure with Indian formatting. */
export function CountUpMoney({
  amount,
  className,
  prefix = "",
}: {
  amount: number | null | undefined;
  className?: string;
  prefix?: string;
}) {
  const v = useCountUp(amount);
  if (amount == null) return <span className={className}>—</span>;
  return (
    <span className={className} aria-label={`${prefix}${formatINR(amount)}`}>
      {prefix}
      {formatINR(Math.round(v))}
    </span>
  );
}

/* ── Scroll reveal wrapper ─────────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  className,
  y = 26,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Layout primitives ─────────────────────────────────────────────────────── */

export function SectionShell({
  id,
  children,
  className = "",
  tone = "base",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "base" | "raised";
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-20 sm:py-28 ${tone === "raised" ? "bg-[#12151B]" : ""} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function Eyebrow({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#D4A853]/35 bg-[#D4A853]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8C97E]">
      {icon}
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  sub,
  align = "center",
}: {
  eyebrow?: ReactNode;
  title: string;
  accent?: string;
  sub?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-5 font-display text-3xl leading-[1.12] tracking-tight text-[#FAF7F2] sm:text-4xl lg:text-[2.75rem]">
        {title}{" "}
        {accent ? <em className="saver-gold-text not-italic font-semibold italic">{accent}</em> : null}
      </h2>
      {sub ? (
        <p className="mt-4 text-base leading-relaxed text-[#9BA3AE] sm:text-lg">{sub}</p>
      ) : null}
    </div>
  );
}

/* ── Buttons ───────────────────────────────────────────────────────────────── */

export function GoldButton({
  children,
  onClick,
  type = "button",
  disabled,
  loading,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`saver-gold-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1116] disabled:cursor-not-allowed disabled:opacity-50 ${
        loading ? "saver-shimmer" : ""
      } ${className}`}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#17130A]/30 border-t-[#17130A]" aria-hidden />
      ) : null}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  href,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const cls = `inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-[#FAF7F2] transition-all hover:border-[#2DD4A8]/50 hover:bg-[#2DD4A8]/10 hover:text-[#7CE8C9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4A8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1116] ${className}`;
  if (href) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/* ── Cards & chips ─────────────────────────────────────────────────────────── */

export function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={`saver-glass rounded-2xl ${hover ? "saver-glass-hover" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Chip({
  children,
  tone = "muted",
  className = "",
}: {
  children: ReactNode;
  tone?: "gold" | "emerald" | "red" | "muted" | "sienna";
  className?: string;
}) {
  const tones: Record<string, string> = {
    gold: "border-[#D4A853]/40 bg-[#D4A853]/12 text-[#E8C97E]",
    emerald: "border-[#2DD4A8]/40 bg-[#2DD4A8]/12 text-[#6FDDB9]",
    red: "border-[#E86A5E]/40 bg-[#E86A5E]/12 text-[#F09A91]",
    sienna: "border-[#D4633F]/40 bg-[#D4633F]/12 text-[#E89B82]",
    muted: "border-white/12 bg-white/[0.05] text-[#9BA3AE]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ── Form atoms ────────────────────────────────────────────────────────────── */

export function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-[#C7CCD4]"
    >
      <span>{children}</span>
      {hint ? <span className="text-[11px] text-[#6B7280]">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  className = "",
  ariaLabel,
  min,
  max,
}: {
  id?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  prefix?: string;
  className?: string;
  ariaLabel?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className={`relative ${className}`}>
      {prefix ? (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-[#D4A853]" aria-hidden>
          {prefix}
        </span>
      ) : null}
      <input
        id={id}
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`saver-input h-12 w-full rounded-xl font-mono text-sm tabular-nums placeholder:font-sans ${
          prefix ? "pl-9" : "pl-4"
        } pr-4`}
      />
    </div>
  );
}

/* ── Status chips for engine states ────────────────────────────────────────── */

export function EngineStatusChip({ status }: { status: string }) {
  if (status === "ZERO_MDR") {
    return <Chip tone="emerald">ZERO MDR</Chip>;
  }
  if (status === "APPLIES") {
    return <Chip tone="gold">FEE APPLIES</Chip>;
  }
  return <Chip tone="muted">NO RULE</Chip>;
}

/* ── Shared fetch helper ───────────────────────────────────────────────────── */

export async function postJSON<T = Record<string, unknown>>(
  url: string,
  body: unknown
): Promise<{ ok: boolean; error?: string; data?: T }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !json?.ok) {
      return { ok: false, error: json?.error ?? `Request failed (${res.status})` };
    }
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: "Network error — please check your connection and retry." };
  }
}

/* ── WhatsApp CTA constant ─────────────────────────────────────────────────── */

export const SAVER_WHATSAPP = "https://wa.me/919829070804?text=Hi%20Paliwal%20Secure%20AI%2C%20I%20want%20help%20maximising%20my%20business%20savings";
