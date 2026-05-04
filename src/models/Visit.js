import mongoose from "mongoose";
import { baseOptions } from "./_helpers.js";

const VisitSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true },
    referrer: { type: String, default: "" },
    country: { type: String, default: "unknown", index: true },
    device: { type: String, enum: ["mobile", "tablet", "desktop", "bot", "unknown"], default: "unknown", index: true },
    sessionId: { type: String, default: "", index: true },
  },
  baseOptions
);

VisitSchema.index({ createdAt: -1 });
// Auto-prune entries older than 90 days
VisitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default mongoose.models.Visit || mongoose.model("Visit", VisitSchema);
