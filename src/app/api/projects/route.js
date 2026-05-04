import Project from "@/models/Project";
import { projectSchema } from "@/lib/schemas";
import { listCreate } from "@/lib/api-handlers";

export const { GET, POST } = listCreate(Project, projectSchema);
