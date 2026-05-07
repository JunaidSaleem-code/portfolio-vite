import { connectDB } from "../mongodb";
import VectorChunk from "@/models/VectorChunk";
import { buildChunks, type ChunkRecord } from "./chunks";
import { embedDocuments, embedQuery, cosineSim } from "./embed";

export type Source = {
  chunkId: string;
  kind: ChunkRecord["kind"];
  refId: string;
  title: string;
  url: string;
  score: number;
};

export type RetrievalResult = {
  sources: Source[];
  contextBlock: string;
  empty: boolean;
};

export type RebuildReport = {
  total: number;
  inserted: number;
  updated: number;
  unchanged: number;
  removed: number;
  embeddingCalls: number;
  duration: number;
};

/**
 * Diff the canonical chunks against what's in the DB and embed only what changed.
 * Returns a report. Idempotent — calling it twice in a row leaves the second run
 * with everything `unchanged` and zero embedding calls.
 */
export async function rebuildIndex(): Promise<RebuildReport> {
  const t0 = Date.now();
  await connectDB();

  const fresh = await buildChunks();
  const existing = await VectorChunk.find({}).lean<any[]>();
  const existingByChunkId = new Map<string, any>(
    existing.map((c) => [c.chunkId, c])
  );

  const toInsert: ChunkRecord[] = [];
  const toUpdate: ChunkRecord[] = [];
  const seenChunkIds = new Set<string>();

  for (const c of fresh) {
    seenChunkIds.add(c.chunkId);
    const prev = existingByChunkId.get(c.chunkId);
    if (!prev) {
      toInsert.push(c);
    } else if (prev.hash !== c.hash || !Array.isArray(prev.embedding) || prev.embedding.length === 0) {
      toUpdate.push(c);
    }
  }

  const stale = existing.filter((c) => !seenChunkIds.has(c.chunkId));

  // Embed only new + changed chunks.
  const embedTargets = [...toInsert, ...toUpdate];
  let embeddings: number[][] = [];
  if (embedTargets.length) {
    embeddings = await embedDocuments(embedTargets.map((c) => c.text));
  }

  const ops: Promise<unknown>[] = [];

  toInsert.forEach((c, i) => {
    ops.push(
      VectorChunk.create({
        chunkId: c.chunkId,
        kind: c.kind,
        refId: c.refId,
        title: c.title,
        url: c.url,
        text: c.text,
        hash: c.hash,
        embedding: embeddings[i],
        tokenEstimate: c.tokenEstimate,
      })
    );
  });

  toUpdate.forEach((c, i) => {
    ops.push(
      VectorChunk.updateOne(
        { chunkId: c.chunkId },
        {
          $set: {
            kind: c.kind,
            refId: c.refId,
            title: c.title,
            url: c.url,
            text: c.text,
            hash: c.hash,
            embedding: embeddings[toInsert.length + i],
            tokenEstimate: c.tokenEstimate,
          },
        }
      )
    );
  });

  for (const s of stale) {
    ops.push(VectorChunk.deleteOne({ _id: s._id }));
  }

  await Promise.all(ops);

  return {
    total: fresh.length,
    inserted: toInsert.length,
    updated: toUpdate.length,
    unchanged: fresh.length - toInsert.length - toUpdate.length,
    removed: stale.length,
    embeddingCalls: embedTargets.length,
    duration: Date.now() - t0,
  };
}

/**
 * Retrieve the top-K chunks by cosine similarity to the query embedding.
 * Loads all chunks into memory and ranks in JS — perfectly fine for
 * portfolio-scale corpora (<1000 chunks). Swap to MongoDB Atlas Vector
 * Search when the corpus grows beyond that.
 */
export async function retrieve(
  query: string,
  k = 4
): Promise<RetrievalResult> {
  await connectDB();

  const docs = await VectorChunk.find({})
    .lean<any[]>();

  if (!docs.length) {
    return { sources: [], contextBlock: "", empty: true };
  }

  const qVec = await embedQuery(query);
  const ranked = docs
    .map((d) => ({
      doc: d,
      score: cosineSim(qVec, d.embedding || []),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  const sources: Source[] = ranked.map((r) => ({
    chunkId: r.doc.chunkId,
    kind: r.doc.kind,
    refId: r.doc.refId,
    title: r.doc.title,
    url: r.doc.url,
    score: Number(r.score.toFixed(4)),
  }));

  const contextBlock = ranked
    .map(
      (r, i) =>
        `<<chunk ${i + 1} · id=${r.doc.chunkId} · score=${r.score.toFixed(3)}>>\n${r.doc.text}`
    )
    .join("\n\n");

  return { sources, contextBlock, empty: false };
}

export async function indexStats(): Promise<{
  chunks: number;
  byKind: Record<string, number>;
}> {
  await connectDB();
  const docs = await VectorChunk.find({}).lean<any[]>();
  const byKind: Record<string, number> = {};
  for (const d of docs) byKind[d.kind] = (byKind[d.kind] || 0) + 1;
  return { chunks: docs.length, byKind };
}
