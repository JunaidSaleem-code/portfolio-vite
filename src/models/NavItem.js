import mongoose from "mongoose";
import { orderingFields, baseOptions } from "./_helpers.js";

const NavItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
    ...orderingFields,
  },
  baseOptions
);

export default mongoose.models.NavItem || mongoose.model("NavItem", NavItemSchema);
