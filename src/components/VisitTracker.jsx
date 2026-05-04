"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "_pf_sid";
const SENT_KEY_PREFIX = "_pf_t:";

function getOrCreateSessionId() {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export default function VisitTracker() {
  const pathname = usePathname();
  const lastSent = useRef(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    // Dedupe: don't fire twice for the same path within the same session
    const dedupeKey = `${SENT_KEY_PREFIX}${pathname}`;
    try {
      if (sessionStorage.getItem(dedupeKey)) return;
      sessionStorage.setItem(dedupeKey, "1");
    } catch {}

    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const payload = {
      path: pathname,
      referrer: document.referrer || "",
      sessionId: getOrCreateSessionId(),
    };

    // Fire-and-forget; never block the page on this
    try {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      if (navigator.sendBeacon?.("/api/track", blob)) return;
    } catch {}

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
