import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export async function POST(req) {
  try {
    // Per-IP rate limit: 5 messages per 10 min
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anon";
    const limit = rateLimit({ key: `contact:${ip}`, limit: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.allowed) {
      return Response.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "ValidationError", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

    if (!apiKey || !toEmail) {
      // Soft-fail in dev: log message instead of sending.
      console.warn("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL missing — message logged, not sent.");
      console.log({ name, email, message });
      return Response.json({
        ok: true,
        delivered: false,
        note: "Email not configured — message logged on the server.",
      });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      await logError(new Error(error.message || "Resend error"), { path: "/api/contact" });
      return Response.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return Response.json({ ok: true, delivered: true });
  } catch (err) {
    await logError(err, { path: "/api/contact", method: "POST" });
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
