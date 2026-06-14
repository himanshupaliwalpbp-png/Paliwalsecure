/**
 * Performance Utilities — Paliwal Secure
 *
 * Core Web Vitals tracking, resource hints, and image optimization helpers.
 * Used client-side to monitor and improve page performance.
 *
 * Web Vitals Reference:
 * - LCP (Largest Contentful Paint): < 2.5s = good
 * - FID (First Input Delay): < 100ms = good
 * - CLS (Cumulative Layout Shift): < 0.1 = good
 * - INP (Interaction to Next Paint): < 200ms = good
 * - TTFB (Time to First Byte): < 800ms = good
 */

// ============================================================================
// Core Web Vitals Types
// ============================================================================

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
  timestamp: number;
}

export interface WebVitalsReport {
  lcp?: WebVitalMetric;
  fid?: WebVitalMetric;
  cls?: WebVitalMetric;
  inp?: WebVitalMetric;
  ttfb?: WebVitalMetric;
  fcpx?: WebVitalMetric;
}

// ============================================================================
// Rating Thresholds
// ============================================================================

const THRESHOLDS: Record<string, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (!threshold) return 'good';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// ============================================================================
// Web Vitals Observer & Reporter
// ============================================================================

let vitalsReport: WebVitalsReport = {};

/**
 * Initializes Core Web Vitals observation.
 * Uses PerformanceObserver API to track LCP, FID, CLS, INP, TTFB, FCP.
 */
export function initWebVitalsTracking(): void {
  if (typeof window === 'undefined') return;

  // LCP — Largest Contentful Paint
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      const metric: WebVitalMetric = {
        name: 'LCP',
        value: lastEntry.startTime,
        rating: getRating('LCP', lastEntry.startTime),
        delta: lastEntry.startTime,
        navigationType: getNavigationType(),
        timestamp: Date.now(),
      };
      vitalsReport.lcp = metric;
      reportVital(metric);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // Observer not supported
  }

  // FID — First Input Delay
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as PerformanceEventTiming;
      const value = firstEntry.processingStart - firstEntry.startTime;
      const metric: WebVitalMetric = {
        name: 'FID',
        value,
        rating: getRating('FID', value),
        delta: value,
        navigationType: getNavigationType(),
        timestamp: Date.now(),
      };
      vitalsReport.fid = metric;
      reportVital(metric);
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch {
    // Observer not supported
  }

  // CLS — Cumulative Layout Shift
  try {
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];

    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as LayoutShift;
        if (!layoutShiftEntry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (
            sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += layoutShiftEntry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = layoutShiftEntry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            clsEntries = [...sessionEntries];
            const metric: WebVitalMetric = {
              name: 'CLS',
              value: clsValue,
              rating: getRating('CLS', clsValue),
              delta: layoutShiftEntry.value,
              navigationType: getNavigationType(),
              timestamp: Date.now(),
            };
            vitalsReport.cls = metric;
          }
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Observer not supported
  }

  // INP — Interaction to Next Paint
  try {
    let worstInp = 0;
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const eventEntry = entry as PerformanceEventTiming;
        if (eventEntry.interactionId && eventEntry.processingStart) {
          const duration = eventEntry.duration;
          if (duration > worstInp) {
            worstInp = duration;
            const metric: WebVitalMetric = {
              name: 'INP',
              value: duration,
              rating: getRating('INP', duration),
              delta: duration,
              navigationType: getNavigationType(),
              timestamp: Date.now(),
            };
            vitalsReport.inp = metric;
          }
        }
      }
    });
    inpObserver.observe({ type: 'event', buffered: true });
  } catch {
    // Observer not supported
  }

  // TTFB — Time to First Byte
  try {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      const ttfbValue = navEntry.responseStart;
      const metric: WebVitalMetric = {
        name: 'TTFB',
        value: ttfbValue,
        rating: getRating('TTFB', ttfbValue),
        delta: ttfbValue,
        navigationType: getNavigationType(),
        timestamp: Date.now(),
      };
      vitalsReport.ttfb = metric;
      reportVital(metric);
    }
  } catch {
    // Not available
  }

  // FCP — First Contentful Paint
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];
      const metric: WebVitalMetric = {
        name: 'FCP',
        value: firstEntry.startTime,
        rating: getRating('FCP', firstEntry.startTime),
        delta: firstEntry.startTime,
        navigationType: getNavigationType(),
        timestamp: Date.now(),
      };
      vitalsReport.fcpx = metric;
      reportVital(metric);
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch {
    // Observer not supported
  }

  // Report all vitals on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      reportAllVitals();
    }
  });
}

// ============================================================================
// Type Helpers
// ============================================================================

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  interactionId: number;
  duration: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

function getNavigationType(): string {
  if (typeof document === 'undefined') return 'unknown';
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (!nav) return 'unknown';
  const type = nav.type;
  if (type === 'navigate') return 'navigation';
  if (type === 'reload') return 'reload';
  if (type === 'back_forward') return 'back-forward';
  if (type === 'prerender') return 'prerender';
  return type;
}

// ============================================================================
// Reporting Functions
// ============================================================================

/**
 * Reports a single vital metric.
 * In production, this would send to an analytics endpoint.
 */
function reportVital(metric: WebVitalMetric): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[WebVitals] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }
  // In production, send to analytics:
  // fetch('/api/vitals', { method: 'POST', body: JSON.stringify(metric) });
}

/**
 * Reports all collected vitals.
 * Called on page visibility change to hidden.
 */
function reportAllVitals(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[WebVitals] Full Report:', vitalsReport);
  }
}

/**
 * Gets the current vitals report.
 */
export function getVitalsReport(): WebVitalsReport {
  return { ...vitalsReport };
}

// ============================================================================
// Resource Hints Helpers
// ============================================================================

/**
 * Adds a resource hint to the document head.
 * Types: preconnect, prefetch, preload, dns-prefetch, prerender
 */
export function addResourceHint(
  href: string,
  rel: 'preconnect' | 'prefetch' | 'preload' | 'dns-prefetch' | 'prerender',
  options?: { as?: string; crossOrigin?: string; type?: string }
): void {
  if (typeof document === 'undefined') return;

  // Check if already exists
  const existing = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (options?.as) link.setAttribute('as', options.as);
  if (options?.crossOrigin) link.crossOrigin = options.crossOrigin;
  if (options?.type) link.type = options.type;
  document.head.appendChild(link);
}

/**
 * Preconnects to essential third-party origins.
 * Call this early in the app lifecycle.
 */
export function preconnectEssentialOrigins(): void {
  const origins = [
    'https://paliwalsecure.in',
    'https://wa.me',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  for (const origin of origins) {
    addResourceHint(origin, 'preconnect', { crossOrigin: 'anonymous' });
  }
}

// ============================================================================
// Image Optimization Utilities
// ============================================================================

export interface ImageSrcsetOptions {
  src: string;
  widths: number[];
  baseWidth?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
}

/**
 * Generates a srcset string for responsive images.
 *
 * Example output:
 * "image-400w.webp 400w, image-800w.webp 800w, image-1200w.webp 1200w"
 *
 * Usage:
 * ```tsx
 * <img
 *   src={img.src}
 *   srcSet={generateSrcset(img)}
 *   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
 * />
 * ```
 */
export function generateSrcset(options: ImageSrcsetOptions): string {
  const { src, widths, format } = options;

  return widths
    .map((w) => {
      // For Next.js Image, we rely on the built-in optimizer
      // This generates standard URL patterns
      const ext = format || src.split('.').pop() || 'webp';
      const baseName = src.replace(/\.[^.]+$/, '');
      return `${baseName}-${w}w.${ext} ${w}w`;
    })
    .join(', ');
}

/**
 * Generates a sizes attribute for responsive images.
 */
export function generateSizes(breakpoints: { maxWidth?: number; width: string }[]): string {
  return breakpoints
    .map((bp) => (bp.maxWidth ? `(max-width: ${bp.maxWidth}px) ${bp.width}` : bp.width))
    .join(', ');
}

/**
 * Preloads a critical image.
 */
export function preloadCriticalImage(src: string, as: string = 'image'): void {
  addResourceHint(src, 'preload', { as });
}

// ============================================================================
// Performance Budget Checker
// ============================================================================

export interface PerformanceBudget {
  maxLCP?: number;
  maxFID?: number;
  maxCLS?: number;
  maxINP?: number;
  maxTTFB?: number;
  maxFCP?: number;
}

const DEFAULT_BUDGET: PerformanceBudget = {
  maxLCP: 2500,
  maxFID: 100,
  maxCLS: 0.1,
  maxINP: 200,
  maxTTFB: 800,
  maxFCP: 1800,
};

/**
 * Checks current vitals against a performance budget.
 * Returns violations (metrics exceeding budget).
 */
export function checkPerformanceBudget(
  budget: PerformanceBudget = DEFAULT_BUDGET
): { metric: string; value: number; budget: number }[] {
  const violations: { metric: string; value: number; budget: number }[] = [];

  if (vitalsReport.lcp && budget.maxLCP && vitalsReport.lcp.value > budget.maxLCP) {
    violations.push({ metric: 'LCP', value: vitalsReport.lcp.value, budget: budget.maxLCP });
  }
  if (vitalsReport.fid && budget.maxFID && vitalsReport.fid.value > budget.maxFID) {
    violations.push({ metric: 'FID', value: vitalsReport.fid.value, budget: budget.maxFID });
  }
  if (vitalsReport.cls && budget.maxCLS && vitalsReport.cls.value > budget.maxCLS) {
    violations.push({ metric: 'CLS', value: vitalsReport.cls.value, budget: budget.maxCLS });
  }
  if (vitalsReport.inp && budget.maxINP && vitalsReport.inp.value > budget.maxINP) {
    violations.push({ metric: 'INP', value: vitalsReport.inp.value, budget: budget.maxINP });
  }
  if (vitalsReport.ttfb && budget.maxTTFB && vitalsReport.ttfb.value > budget.maxTTFB) {
    violations.push({ metric: 'TTFB', value: vitalsReport.ttfb.value, budget: budget.maxTTFB });
  }
  if (vitalsReport.fcpx && budget.maxFCP && vitalsReport.fcpx.value > budget.maxFCP) {
    violations.push({ metric: 'FCP', value: vitalsReport.fcpx.value, budget: budget.maxFCP });
  }

  if (violations.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('[Performance Budget Violations]', violations);
  }

  return violations;
}
