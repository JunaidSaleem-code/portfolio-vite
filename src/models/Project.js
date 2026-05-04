import mongoose from "mongoose";
import { orderingFields, baseOptions } from "./_helpers.js";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    techIcons: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    link: { type: String, required: true },
    repoLink: { type: String, default: "" },
    body: { type: String, default: "" },
    ...orderingFields,
  },
  baseOptions
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
