import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";
import { retrieve, rebuildIndex, indexStats } from "@/lib/rag";
import { buildSystemPrompt } from "@/lib/rag/persona";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string().min(1).max(2000),
});

const askSchema = z.object({
  question: z.string().min(1, "Question is required").max(800),
  history: z.array(messageSchema).max(12).default([]),
});

const TOP_K = 4;

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anon";

    const limit = rateLimit({
      key: `ask:${ip}`,
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });
    if (!limit.allowed) {
      return Response.json(
        {
          error:
            "You've hit the chat limit for the next few minutes. Try again shortly.",
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error:
            "Chat isn't configured yet. Set GEMINI_API_KEY in environment to enable.",
        },
        { status: 503 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = askSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "ValidationError", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { question, history } = parsed.data;

    // Lazy-rebuild on first ever call so the chat never appears broken.
    let stats = await indexStats();
    let usedFallback = false;
    if (stats.chunks === 0) {
      try {
        await rebuildIndex();
        stats = await indexStats();
      } catch (err) {
        await logError(err as Error, { path: "/api/ask", phase: "lazy-index" });
        usedFallback = true;
      }
    }

    // Retrieve top-K chunks for this query.
    const { sources, contextBlock } = await retrieve(question, TOP_K);

    const genAI = new GoogleGenerativeAI(apiKey);
    const primary = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const fallback = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite";

    async function startStream(modelId: string) {
      const m = genAI.getGenerativeModel({
        model: modelId,
        systemInstruction: buildSystemPrompt(contextBlock),
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 600,
        },
      });
      const chat = m.startChat({
        history: history.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
      });
      return chat.sendMessageStream(question);
    }

    let stream;
    try {
      stream = await startStream(primary);
    } catch (err: any) {
      const overloaded =
        /\[503\b/.test(err?.message || "") ||
        /high demand/i.test(err?.message || "") ||
        /\[429\b/.test(err?.message || "");
      if (overloaded && fallback && fallback !== primary) {
        await logError(err, {
          path: "/api/ask",
          phase: "primary-failed",
          meta: { primary, fallback },
        });
        stream = await startStream(fallback);
      } else {
        throw err;
      }
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        // Stream protocol: first line is a JSON header with sources,
        // separated by `\n\n`. Everything after is the model's text.
        const header = JSON.stringify({
          sources,
          fallback: usedFallback,
          k: TOP_K,
        });
        controller.enqueue(encoder.encode(`__SOURCES__:${header}\n\n`));

        try {
          for await (const chunk of stream.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          await logError(err as Error, { path: "/api/ask", phase: "stream" });
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    await logError(err as Error, { path: "/api/ask", method: "POST" });
    return Response.json(
      { error: "Couldn't reach the model. Try again in a moment." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const stats = await indexStats();
  return Response.json({
    ok: true,
    configured: Boolean(process.env.GEMINI_API_KEY),
    indexed: stats.chunks > 0,
    chunks: stats.chunks,
    byKind: stats.byKind,
  });
}
