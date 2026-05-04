import Project from "@/models/Project";
import { reorder } from "@/lib/api-handlers";

export const { PATCH } = reorder(Project);
