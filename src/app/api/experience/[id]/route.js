import Experience from "@/models/Experience";
import { experienceSchema } from "@/lib/schemas";
import { detail } from "@/lib/api-handlers";

export const { PATCH, DELETE } = detail(Experience, experienceSchema);
