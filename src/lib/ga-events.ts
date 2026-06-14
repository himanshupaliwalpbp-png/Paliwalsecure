// ============================================================================
// Google Analytics 4 — Custom Event Tracking Utility
// ============================================================================
// Usage: import { trackEvent } from '@/lib/ga-events';
//        trackEvent('button_click', { event_category: 'engagement', event_label: 'get_quote' });
// ============================================================================

// ── Event Parameters Type ────────────────────────────────────────────────────
export interface GAEventParams {
  event_category?: string;   // e.g. 'engagement', 'conversion', 'navigation'
  event_label?: string;      // e.g. 'get_quote', 'whatsapp_chat', 'health_plan'
  value?: number;            // Numeric value (e.g. price, rating)
  [key: string]: string | number | boolean | undefined;
}

// ── Track Event ──────────────────────────────────────────────────────────────
export function trackEvent(eventName: string, params?: GAEventParams) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  try {
    window.gtag('event', eventName, {
      event_category: 'general',
      event_label: eventName,
      ...params,
    });
  } catch {
    // Silently fail — GA is non-critical
  }
}

// ── Track Page View (manual) ────────────────────────────────────────────────
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  try {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  } catch {
    // Silently fail
  }
}

// ============================================================================
// Pre-built event trackers for common Paliwal Secure actions
// ============================================================================

// ── CTA / Engagement Events ─────────────────────────────────────────────────
export const GAEvents = {
  // Hero & CTA buttons
  getStarted: () => trackEvent('button_click', { event_category: 'engagement', event_label: 'get_started' }),
  getMyBestPlan: () => trackEvent('button_click', { event_category: 'engagement', event_label: 'get_my_best_plan' }),
  talkToExpert: () => trackEvent('button_click', { event_category: 'engagement', event_label: 'talk_to_expert' }),
  getQuote: (insuranceType?: string) => trackEvent('button_click', {
    event_category: 'engagement',
    event_label: 'get_quote',
    insurance_type: insuranceType || 'unknown',
  }),

  // WhatsApp interactions
  whatsappClick: (source?: string) => trackEvent('button_click', {
    event_category: 'engagement',
    event_label: 'whatsapp_click',
    source: source || 'unknown',
  }),

  // Insurance category selection
  categorySelect: (category: string) => trackEvent('category_select', {
    event_category: 'navigation',
    event_label: category,
  }),

  // Product interactions
  productView: (productName: string, category: string) => trackEvent('product_view', {
    event_category: 'engagement',
    event_label: productName,
    insurance_type: category,
  }),
  productCompare: (productName: string) => trackEvent('product_compare', {
    event_category: 'engagement',
    event_label: productName,
  }),

  // Review interactions
  reviewSubmit: (rating: number, insuranceType: string) => trackEvent('review_submit', {
    event_category: 'conversion',
    event_label: 'submit_review',
    value: rating,
    insurance_type: insuranceType,
  }),
  reviewVote: (voteType: string, reviewId: string) => trackEvent('review_vote', {
    event_category: 'engagement',
    event_label: voteType,
    review_id: reviewId,
  }),
  reviewFilter: (filterType: string, filterValue: string) => trackEvent('review_filter', {
    event_category: 'engagement',
    event_label: filterValue,
    filter_type: filterType,
  }),

  // Contact form
  contactFormSubmit: (insuranceType?: string) => trackEvent('form_submit', {
    event_category: 'conversion',
    event_label: 'contact_form',
    insurance_type: insuranceType || 'unknown',
  }),

  // ChatBot interactions
  chatOpen: () => trackEvent('chat_open', { event_category: 'engagement', event_label: 'insuregpt_chat' }),
  chatMessage: (messageLength: number) => trackEvent('chat_message', {
    event_category: 'engagement',
    event_label: 'insuregpt_message',
    value: messageLength,
  }),

  // Onboarding flow
  onboardingStart: () => trackEvent('onboarding_start', { event_category: 'conversion', event_label: 'onboarding_started' }),
  onboardingComplete: (category?: string) => trackEvent('onboarding_complete', {
    event_category: 'conversion',
    event_label: 'onboarding_completed',
    insurance_type: category || 'unknown',
  }),
  onboardingSkip: () => trackEvent('onboarding_skip', { event_category: 'engagement', event_label: 'onboarding_skipped' }),

  // Calculator usage
  calculatorUse: (calculatorType: string) => trackEvent('calculator_use', {
    event_category: 'engagement',
    event_label: calculatorType,
  }),

  // PWA install
  pwaInstallPrompt: () => trackEvent('pwa_install_prompt', { event_category: 'engagement', event_label: 'install_prompt_shown' }),
  pwaInstallAccept: () => trackEvent('pwa_install_accept', { event_category: 'conversion', event_label: 'app_installed' }),
  pwaInstallDismiss: () => trackEvent('pwa_install_dismiss', { event_category: 'engagement', event_label: 'install_dismissed' }),

  // Knowledge base
  knowledgeSearch: (query: string) => trackEvent('knowledge_search', {
    event_category: 'engagement',
    event_label: 'insure_gyaan_search',
    search_query: query.substring(0, 100),
  }),
  glossaryView: (term: string) => trackEvent('glossary_view', {
    event_category: 'engagement',
    event_label: term,
  }),

  // Scroll depth
  scrollDepth: (percentage: number) => trackEvent('scroll_depth', {
    event_category: 'engagement',
    event_label: `${percentage}%`,
    value: percentage,
  }),

  // Navigation
  navClick: (section: string) => trackEvent('nav_click', {
    event_category: 'navigation',
    event_label: section,
  }),

  // Insurance plan interaction
  planCompare: (planName: string) => trackEvent('plan_compare', {
    event_category: 'engagement',
    event_label: planName,
  }),
} as const;

// ── Window type extension (shared) ───────────────────────────────────────────
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
