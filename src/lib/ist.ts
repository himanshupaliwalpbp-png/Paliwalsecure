/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INDIAN STANDARD TIME (IST) UTILITIES — single source of truth
 * ═══════════════════════════════════════════════════════════════════════════
 * Owner directive: "Is me indian time zone add karo — Get Free Consultation
 * me aur jahan bhi time/date hai wahan bhi Indian time."
 *
 * ALL date/time formatting across the site MUST go through these helpers so
 * that every surface (server-rendered pages, admin dashboards, client
 * widgets) shows Indian Standard Time (UTC+5:30) — never server-local time.
 *
 * Business hours (IST): Mon–Sat 9:30 AM – 8:00 PM. Sunday: 10 AM – 2 PM.
 */

export const IST_TIMEZONE = 'Asia/Kolkata' as const;

/** Indian-locale date formatting pinned to IST. */
export function formatISTDate(
  date: Date = new Date(),
  opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string {
  return new Intl.DateTimeFormat('en-IN', { ...opts, timeZone: IST_TIMEZONE }).format(date);
}

/** Full weekday + date, e.g. "Friday, 24 October 2025" (IST). */
export function formatISTFullDate(date: Date = new Date()): string {
  return formatISTDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/** Time-only, e.g. "10:42 am" (IST, en-IN lower-case am/pm). */
export function formatISTTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: IST_TIMEZONE,
  }).format(date);
}

/** Date + time, e.g. "24 Oct 2025, 10:42 am" (IST). */
export function formatISTDateTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: IST_TIMEZONE,
  }).format(date);
}

/** Hindi-locale long date, e.g. "शुक्रवार, 24 अक्तूबर 2025" (IST). */
export function formatISTDateHindi(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: IST_TIMEZONE,
  }).format(date);
}

// ── Business-hours logic (IST) ─────────────────────────────────────────────

export interface BusinessHoursStatus {
  isOpen: boolean;
  /** e.g. "Open now · closes 8:00 pm IST" */
  label: string;
  /** Hindi label, e.g. "अभी खुला है · शाम 8:00 बजे बंद" */
  labelHi: string;
  istTime: string;
  istDate: string;
}

/** Get IST clock parts from any Date (works on server + client). */
function getISTParts(date: Date): { hours: number; minutes: number; dayOfWeek: number } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    weekday: 'short',
    timeZone: IST_TIMEZONE,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPart['type']) =>
    parts.find((p) => p.type === type)?.value ?? '0';
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    hours: parseInt(get('hour'), 10) % 24,
    minutes: parseInt(get('minute'), 10),
    dayOfWeek: dayMap[get('weekday')] ?? 1,
  };
}

/** Mon–Sat 9:30–20:00 IST; Sun 10:00–14:00 IST. */
export function getBusinessHoursStatus(now: Date = new Date()): BusinessHoursStatus {
  const { hours, minutes, dayOfWeek } = getISTParts(now);
  const istTime = formatISTTime(now);
  const istDate = formatISTDate(now);

  const decimal = hours + minutes / 60;
  const isSunday = dayOfWeek === 0;

  // Sunday: 10:00 – 14:00
  const open = isSunday ? decimal >= 10 && decimal < 14 : decimal >= 9.5 && decimal < 20;

  if (open) {
    const closesAt = isSunday ? '2:00 pm' : '8:00 pm';
    const closesHi = isSunday ? 'दोपहर 2:00 बजे' : 'शाम 8:00 बजे';
    return {
      isOpen: true,
      label: `Open now · closes ${closesAt} IST`,
      labelHi: `अभी खुला है · ${closesHi} बंद`,
      istTime,
      istDate,
    };
  }

  return {
    isOpen: false,
    label: isSunday ? 'Opens Mon 9:30 am IST' : 'Opens 9:30 am IST',
    labelHi: isSunday ? 'सोमवार सुबह 9:30 बजे खुलेगा' : 'सुबह 9:30 बजे खुलेगा',
    istTime,
    istDate,
  };
}
