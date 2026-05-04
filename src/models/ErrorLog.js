import mongoose from "mongoose";
import { baseOptions } from "./_helpers.js";

const ErrorLogSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    stack: { type: String, default: "" },
    path: { type: String, default: "" },
    method: { type: String, default: "" },
    userId: { type: String, default: "" },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  baseOptions
);

ErrorLogSchema.index({ createdAt: -1 });
// Auto-prune logs older than 30 days so the collection doesn't grow forever.
ErrorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export default mongoose.models.ErrorLog || mongoose.model("ErrorLog", ErrorLogSchema);
