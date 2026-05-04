import mongoose from "mongoose";
import { orderingFields, baseOptions } from "./_helpers.js";

const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    ...orderingFields,
  },
  baseOptions
);

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
