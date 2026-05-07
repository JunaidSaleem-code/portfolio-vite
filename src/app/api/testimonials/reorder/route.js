import Testimonial from "@/models/Testimonial";
import { reorder } from "@/lib/api-handlers";

export const { PATCH } = reorder(Testimonial);
