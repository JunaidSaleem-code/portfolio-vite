import mongoose from "mongoose";
import { orderingFields, baseOptions } from "./_helpers.js";

const ApproachPhaseSchema = new mongoose.Schema(
  {
    phaseLabel: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    backgroundClass: { type: String, default: "bg-emerald-900" },
    animationSpeed: { type: Number, default: 3 },
    colors: { type: [[Number]], default: undefined },
    dotSize: { type: Number, default: undefined },
    overlay: { type: Boolean, default: false },
    ...orderingFields,
  },
  baseOptions
);

export default mongoose.models.ApproachPhase || mongoose.model("ApproachPhase", ApproachPhaseSchema);
