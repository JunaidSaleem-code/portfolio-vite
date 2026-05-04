import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { subscribeSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anon";
    const limit = rateLimit({ key: `subscribe:${ip}`, limit: 5, windowMs: 60 * 60 * 1000 });
    if (!limit.allowed) {
      return Response.json({ error: "Too many subscriptions. Try again later." }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "ValidationError", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, name, source } = parsed.data;
    await connectDB();

    // Idempotent: re-subscribing an existing email just unsets `unsubscribed`
    await Subscriber.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          email: email.toLowerCase(),
          name,
          source,
          unsubscribed: false,
        },
      },
      { upsert: true }
    );

    return Response.json({ ok: true });
  } catch (err) {
    await logError(err, { path: "/api/subscribe", method: "POST" });
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
