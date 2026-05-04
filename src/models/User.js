import mongoose from "mongoose";
import { baseOptions } from "./_helpers.js";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
  },
  baseOptions
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
