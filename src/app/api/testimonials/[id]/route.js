import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/schemas";
import { detail } from "@/lib/api-handlers";

export const { PATCH, DELETE } = detail(Testimonial, testimonialSchema);
