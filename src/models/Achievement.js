import mongoose from "mongoose";
import { orderingFields, baseOptions } from "./_helpers.js";

export const ACHIEVEMENT_TYPES = ["education", "recognition"];

const AchievementSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ACHIEVEMENT_TYPES, default: "recognition" },
    title: { type: String, required: true, trim: true },
    organization: { type: String, default: "" },
    period: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    ...orderingFields,
  },
  baseOptions
);

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
