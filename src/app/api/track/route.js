import { connectDB } from "@/lib/mongodb";
import Visit from "@/models/Visit";
import { rateLimit } from "@/lib/rate-limit";
import {
  classifyDevice,
  pickCountry,
  isBot,
  cleanPath,
  cleanReferrer,
} from "@/lib/visit-tracker";

export async function POST(req) {
  try {
    const userAgent = req.headers.get("user-agent") || "";
    if (isBot(userAgent)) {
      // Don't pollute analytics with crawler traffic.
      return Response.json({ ok: true, ignored: "bot" });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anon";
    // Soft anti-spam: cap at 60 events / IP / hour
    const limit = rateLimit({ key: `track:${ip}`, limit: 60, windowMs: 60 * 60 * 1000 });
    if (!limit.allowed) {
      return Response.json({ ok: true, ignored: "rate-limited" });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const path = cleanPath(body.path || "/");
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      // Don't log admin / API hits
      return Response.json({ ok: true, ignored: "private-path" });
    }

    const data = {
      path,
      referrer: cleanReferrer(body.referrer || ""),
      country: pickCountry(req.headers),
      device: classifyDevice(userAgent),
      sessionId: String(body.sessionId || "").slice(0, 64),
    };

    await connectDB();
    await Visit.create(data);
    return Response.json({ ok: true });
  } catch (err) {
    // Tracking must never crash the request — return 200 anyway, log server-side.
    console.error("[track] failed:", err.message);
    return Response.json({ ok: true, ignored: "error" });
  }
}
