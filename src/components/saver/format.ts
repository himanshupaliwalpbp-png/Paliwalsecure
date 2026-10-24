/**
 * Paliwal Saver — Indian number formatting helpers (client-safe, pure).
 * Local mirror of the shared engine helper so this module is self-contained.
 */

export function formatINR(
  n: number | null | undefined,
  opts?: { decimals?: number }
): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const decimals = opts?.decimals ?? 0;
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatINRPlain(
  n: number | null | undefined,
  decimals = 0
): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(p: number | null | undefined, decimals = 1): string {
  if (p === null || p === undefined || Number.isNaN(p)) return "—";
  return `${p.toFixed(decimals)}%`;
}

/** Shared POST helper for the /api/saver/* endpoints (relative paths only). */
export async function postSaver<T>(
  path: string,
  body: unknown
): Promise<{ ok: true; result: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON body */
    }
    const env = data as { ok?: boolean; result?: T; error?: string } | null;
    if (res.ok && env?.ok && env.result !== undefined) {
      return { ok: true, result: env.result as T };
    }
    const message =
      env?.error ??
      (res.status === 404
        ? "This calculator's engine is coming online — retry in a moment."
        : res.status === 429
          ? "Too many requests — slow down a little."
          : "Calculation failed — please retry.");
    return { ok: false, error: message };
  } catch {
    return { ok: false, error: "Network hiccup — check your connection and retry." };
  }
}
