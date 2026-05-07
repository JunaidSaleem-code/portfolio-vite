import crypto from "crypto";
import { connectDB } from "../mongodb";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Achievement from "@/models/Achievement";
import Testimonial from "@/models/Testimonial";
import Setting from "@/models/Setting";

export type ChunkKind =
  | "project"
  | "experience"
  | "achievement"
  | "testimonial"
  | "identity"
  | "contact";

export type ChunkRecord = {
  chunkId: string;
  kind: ChunkKind;
  refId: string;
  title: string;
  url: string;
  text: string;
  hash: string;
  tokenEstimate: number;
};

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function approxTokens(s: string): number {
  // Rough: 1 token ≈ 4 characters for English.
  return Math.max(1, Math.round(s.length / 4));
}

function clean(...parts: (string | undefined | null)[]): string {
  return parts
    .map((p) => (p == null ? "" : String(p)))
    .filter((p) => p.trim().length)
    .join("\n")
    .trim();
}

function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}

/**
 * Build the canonical list of chunks from the live MongoDB content.
 * One chunk per logical unit — projects, roles, awards, testimonials,
 * plus a couple of meta chunks for identity and contact.
 */
export async function buildChunks(): Promise<ChunkRecord[]> {
  await connectDB();

  const [projects, experiences, achievements, testimonials, hero, footer] =
    await Promise.all([
      Project.find({ visible: true })
        .sort({ order: 1, createdAt: 1 })
        .lean<any[]>(),
      Experience.find({ visible: true })
        .sort({ order: 1, createdAt: 1 })
        .lean<any[]>(),
      Achievement.find({ visible: true })
        .sort({ order: 1, createdAt: 1 })
        .lean<any[]>(),
      Testimonial.find({ visible: true })
        .sort({ order: 1, createdAt: 1 })
        .lean<any[]>(),
      Setting.findOne({ key: "hero" }).lean<{ data: any } | null>(),
      Setting.findOne({ key: "footer" }).lean<{ data: any } | null>(),
    ]);

  const chunks: ChunkRecord[] = [];

  // ── Identity (one chunk from hero settings) ──
  if (hero?.data) {
    const h = hero.data;
    const text = clean(
      `# Identity`,
      h.headline,
      h.subheadline,
      h.tagline ? `Tagline: ${h.tagline}` : "",
      `Based in Lahore, Pakistan (GMT+5).`
    );
    if (text) {
      chunks.push({
        chunkId: "identity:hero",
        kind: "identity",
        refId: "hero",
        title: "About me",
        url: "",
        text,
        hash: sha256(text),
        tokenEstimate: approxTokens(text),
      });
    }
  }

  // ── Contact ──
  if (footer?.data?.contactEmail) {
    const f = footer.data;
    const text = clean(
      `# Contact`,
      f.headline,
      f.paragraph,
      `Email: ${f.contactEmail}`
    );
    chunks.push({
      chunkId: "contact:footer",
      kind: "contact",
      refId: "footer",
      title: "Contact",
      url: "#footer",
      text,
      hash: sha256(text),
      tokenEstimate: approxTokens(text),
    });
  }

  // ── Projects (one chunk each) ──
  for (const p of projects) {
    const text = clean(
      `# Project — ${p.title}`,
      p.description ? `Summary: ${p.description}` : "",
      Array.isArray(p.techStack) && p.techStack.length
        ? `Stack: ${p.techStack.join(", ")}`
        : "",
      Array.isArray(p.tags) && p.tags.length ? `Tags: ${p.tags.join(", ")}` : "",
      p.link ? `Link: ${p.link}` : "",
      p.body ? `Detail: ${p.body}` : ""
    );
    chunks.push({
      chunkId: `project:${p.slug}`,
      kind: "project",
      refId: p.slug,
      title: p.title,
      url: `/projects/${p.slug}`,
      text,
      hash: sha256(text),
      tokenEstimate: approxTokens(text),
    });
  }

  // ── Experience (one chunk per role) ──
  experiences.forEach((e: any, i: number) => {
    const text = clean(
      `# Role ${pad(i + 1)} — ${e.title}`,
      e.description
    );
    chunks.push({
      chunkId: `experience:${pad(i + 1)}`,
      kind: "experience",
      refId: String(e._id),
      title: e.title,
      url: "#experience",
      text,
      hash: sha256(text),
      tokenEstimate: approxTokens(text),
    });
  });

  // ── Achievements ──
  for (const a of achievements as any[]) {
    const meta = [a.organization, a.period].filter(Boolean).join(" · ");
    const text = clean(
      `# ${a.type === "education" ? "Education" : "Recognition"} — ${a.title}`,
      meta,
      a.description
    );
    chunks.push({
      chunkId: `achievement:${a._id}`,
      kind: "achievement",
      refId: String(a._id),
      title: a.title,
      url: "#achievements",
      text,
      hash: sha256(text),
      tokenEstimate: approxTokens(text),
    });
  }

  // ── Testimonials ──
  testimonials.forEach((t: any, i: number) => {
    const attrib = [t.name, t.role, t.company].filter(Boolean).join(" · ");
    const text = clean(
      `# Testimonial ${pad(i + 1)} — ${t.name}`,
      `"${t.quote}"`,
      `— ${attrib}`
    );
    chunks.push({
      chunkId: `testimonial:${pad(i + 1)}`,
      kind: "testimonial",
      refId: String(t._id),
      title: t.name,
      url: "#testimonials",
      text,
      hash: sha256(text),
      tokenEstimate: approxTokens(text),
    });
  });

  return chunks;
}
