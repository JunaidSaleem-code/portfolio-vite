import ApproachPhase from "@/models/ApproachPhase";
import { approachPhaseSchema } from "@/lib/schemas";
import { listCreate } from "@/lib/api-handlers";

export const { GET, POST } = listCreate(ApproachPhase, approachPhaseSchema);
