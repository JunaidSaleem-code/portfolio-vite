import mongoose from "mongoose";
import { orderingFields, baseOptions } from "./_helpers.js";

const TestimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    avatar: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    link: { type: String, default: "" },
    ...orderingFields,
  },
  baseOptions
);

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
