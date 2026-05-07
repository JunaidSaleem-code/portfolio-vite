import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Embed many documents in a single request when possible.
 * Falls back to sequential calls if batch isn't supported.
 */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  if (!texts.length) return [];

  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: EMBED_MODEL });

  try {
    const res = await model.batchEmbedContents({
      requests: texts.map((text) => ({
        content: { role: "user", parts: [{ text }] },
        taskType: TaskType.RETRIEVAL_DOCUMENT,
      })),
    });
    return res.embeddings.map((e) => e.values);
  } catch {
    // Fall back to sequential calls — slower but resilient.
    const out: number[][] = [];
    for (const text of texts) {
      const r = await model.embedContent({
        content: { role: "user", parts: [{ text }] },
        taskType: TaskType.RETRIEVAL_DOCUMENT,
      });
      out.push(r.embedding.values);
    }
    return out;
  }
}

/**
 * Embed a query string. Uses the RETRIEVAL_QUERY task type so the
 * embedding lives in the same space as the documents but is optimized
 * for asymmetric search.
 */
export async function embedQuery(text: string): Promise<number[]> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: EMBED_MODEL });
  const r = await model.embedContent({
    content: { role: "user", parts: [{ text }] },
    taskType: TaskType.RETRIEVAL_QUERY,
  });
  return r.embedding.values;
}

/** Cosine similarity for equal-length vectors. Returns NaN if either is zero. */
export function cosineSim(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
