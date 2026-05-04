import mongoose from "mongoose";
import { baseOptions } from "./_helpers.js";

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  baseOptions
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
