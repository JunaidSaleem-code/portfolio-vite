import Achievement from "@/models/Achievement";
import { achievementSchema } from "@/lib/schemas";
import { listCreate } from "@/lib/api-handlers";

export const { GET, POST } = listCreate(Achievement, achievementSchema);
