import Project from "@/models/Project";
import { projectSchema } from "@/lib/schemas";
import { detail } from "@/lib/api-handlers";

export const { PATCH, DELETE } = detail(Project, projectSchema);
