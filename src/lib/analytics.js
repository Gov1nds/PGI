/**
 * Analytics instrumentation wrapper.
 * Uses sendTelemetry from the existing API layer for event tracking.
 * PostHog/Amplitude are loaded lazily via CDN script tags if keys are present.
 */

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const AMPLITUDE_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

let _posthog = null;
let _amplitude = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export async function initAnalytics() {
  if (POSTHOG_KEY) {
    try {
      await loadScript("https://cdn.jsdelivr.net/npm/posthog-js@1/dist/web/array.full.js");
      if (window.posthog) {
        window.posthog.init(POSTHOG_KEY, {
          api_host: import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com",
          autocapture: false,
          capture_pageview: false,
        });
        _posthog = window.posthog;
      }
    } catch {}
  }
}

export function identifyUser(userId, traits = {}) {
  _posthog?.identify(userId, traits);
}

export function trackAnalyticsEvent(event, properties = {}) {
  _posthog?.capture(event, properties);
}

export function trackPageView(path) {
  _posthog?.capture("$pageview", { $current_url: path });
}

// Pre-defined event names for instrumentation
export const EVENTS = {
  GUEST_SEARCH: "guest_search",
  SIGN_IN: "sign_in",
  SIGN_UP: "sign_up",
  BOM_UPLOADED: "bom_uploaded",
  RFQ_SENT: "rfq_sent",
  QUOTE_ACCEPTED: "quote_accepted",
  ORDER_PLACED: "order_placed",
  CHAT_MESSAGE_SENT: "chat_message_sent",
  OFFER_MADE: "offer_made",
  OFFER_ACCEPTED: "offer_accepted",
  REPORT_VIEWED: "report_viewed",
  EXPORT_DOWNLOADED: "export_downloaded",
};
