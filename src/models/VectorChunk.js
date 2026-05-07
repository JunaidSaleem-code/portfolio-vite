import mongoose from "mongoose";

const VectorChunkSchema = new mongoose.Schema(
  {
    // Stable id, e.g. "project:ai-tool-hub", "experience:01", "testimonial:abc123"
    chunkId: { type: String, required: true, unique: true, index: true },
    // Logical kind — drives UI rendering and citation linking.
    kind: {
      type: String,
      enum: ["project", "experience", "achievement", "testimonial", "identity", "contact"],
      required: true,
      index: true,
    },
    // Reference back to the source row (slug for projects, _id for others).
    refId: { type: String, default: "" },
    // Display label used in source chips.
    title: { type: String, default: "" },
    // Optional URL for clickable sources (e.g. /projects/[slug]).
    url: { type: String, default: "" },
    // The text that was embedded.
    text: { type: String, required: true },
    // SHA-256 of `text` — used to skip re-embedding unchanged chunks.
    hash: { type: String, required: true, index: true },
    // 768-dim vector for text-embedding-004.
    embedding: { type: [Number], default: [] },
    // Token count is approximate; useful for diagnostics.
    tokenEstimate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.VectorChunk ||
  mongoose.model("VectorChunk", VectorChunkSchema);
