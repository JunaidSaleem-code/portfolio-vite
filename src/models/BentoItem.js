import mongoose from "mongoose";
import { orderingFields, baseOptions } from "./_helpers.js";

export const BENTO_CARD_TYPES = ["default", "globe", "techStack", "emailCta"];

const BentoItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    spareImage: { type: String, default: "" },
    className: { type: String, default: "" },
    imgClassName: { type: String, default: "" },
    spareImageClassName: { type: String, default: "" },
    titleClassName: { type: String, default: "" },
    cardType: { type: String, enum: BENTO_CARD_TYPES, default: "default" },
    techStackLeft: { type: [String], default: [] },
    techStackRight: { type: [String], default: [] },
    emailAddress: { type: String, default: "" },
    ...orderingFields,
  },
  baseOptions
);

export default mongoose.models.BentoItem || mongoose.model("BentoItem", BentoItemSchema);
