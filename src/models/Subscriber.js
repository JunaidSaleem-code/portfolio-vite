import mongoose from "mongoose";
import { baseOptions } from "./_helpers.js";

const SubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, default: "" },
    source: { type: String, default: "footer" },
    unsubscribed: { type: Boolean, default: false, index: true },
  },
  baseOptions
);

export default mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
