// Helpers for parsing visit metadata server-side without external deps.

const BOT_REGEX = /bot|crawl|spider|crawler|preview|prerender|headless|lighthouse|monitor|fetch|curl|wget|axios|http-/i;
const MOBILE_REGEX = /Mobi|Android.*Mobile|iPhone|iPod|Windows Phone/i;
const TABLET_REGEX = /Tablet|iPad|Android(?!.*Mobile)/i;

export function classifyDevice(userAgent = "") {
  if (!userAgent) return "unknown";
  if (BOT_REGEX.test(userAgent)) return "bot";
  if (TABLET_REGEX.test(userAgent)) return "tablet";
  if (MOBILE_REGEX.test(userAgent)) return "mobile";
  return "desktop";
}

export function pickCountry(headers) {
  // Vercel
  const vercel = headers.get("x-vercel-ip-country");
  if (vercel) return vercel;
  // Cloudflare
  const cf = headers.get("cf-ipcountry");
  if (cf && cf !== "XX") return cf;
  return "unknown";
}

export function isBot(userAgent = "") {
  return BOT_REGEX.test(userAgent);
}

// Defensive sanitize — keep query strings out, cap length
export function cleanPath(rawPath = "/") {
  try {
    const url = new URL(rawPath, "http://x");
    return url.pathname.slice(0, 256);
  } catch {
    return String(rawPath).split("?")[0].slice(0, 256);
  }
}

export function cleanReferrer(rawRef = "") {
  if (!rawRef) return "";
  try {
    const url = new URL(rawRef);
    return `${url.hostname}${url.pathname}`.slice(0, 256);
  } catch {
    return String(rawRef).slice(0, 256);
  }
}
