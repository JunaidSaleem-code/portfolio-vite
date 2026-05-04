import Experience from "@/models/Experience";
import { experienceSchema } from "@/lib/schemas";
import { listCreate } from "@/lib/api-handlers";

export const { GET, POST } = listCreate(Experience, experienceSchema);
