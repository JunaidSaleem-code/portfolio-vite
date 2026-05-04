import mongoose from "mongoose";
import { orderingFields, baseOptions } from "./_helpers.js";

const SocialLinkSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    icon: { type: String, required: true },
    link: { type: String, required: true },
    ...orderingFields,
  },
  baseOptions
);

export default mongoose.models.SocialLink || mongoose.model("SocialLink", SocialLinkSchema);
