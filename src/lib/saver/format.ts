/** Paliwal Saver — Indian number formatting helpers — shared client/server (pure). */

export function formatINR(n: number | null | undefined, opts?: { decimals?: number }): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const decimals = opts?.decimals ?? 0;
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** ₹1,23,45,678 style with Indian grouping, without symbol */
export function formatINRPlain(n: number | null | undefined, decimals = 0): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Compact Indian style: ₹1.2 L / ₹3.4 Cr */
export function formatINRCompact(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (abs >= 1e3) return `₹${(n / 1e3).toFixed(1)} K`;
  return `₹${n.toFixed(0)}`;
}

export function formatPercent(p: number | null | undefined, decimals = 1): string {
  if (p === null || p === undefined || Number.isNaN(p)) return "—";
  return `${p.toFixed(decimals)}%`;
}

export function formatDateIN(d: string | Date | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateShortIN(d: string | Date | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
