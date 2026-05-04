import mongoose from "mongoose";
import { orderingFields, baseOptions } from "./_helpers.js";

export const SECTION_KEYS = ["hero", "grid", "projects", "experience", "achievements", "approach", "footer"];

const SectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, enum: SECTION_KEYS },
    label: { type: String, required: true },
    ...orderingFields,
  },
  baseOptions
);

export default mongoose.models.Section || mongoose.model("Section", SectionSchema);
