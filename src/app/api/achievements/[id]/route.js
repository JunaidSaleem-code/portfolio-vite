import Achievement from "@/models/Achievement";
import { achievementSchema } from "@/lib/schemas";
import { detail } from "@/lib/api-handlers";

export const { PATCH, DELETE } = detail(Achievement, achievementSchema);
