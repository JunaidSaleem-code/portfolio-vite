import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/schemas";
import { listCreate } from "@/lib/api-handlers";

export const { GET, POST } = listCreate(Testimonial, testimonialSchema);
