import ApproachPhase from "@/models/ApproachPhase";
import { approachPhaseSchema } from "@/lib/schemas";
import { detail } from "@/lib/api-handlers";

export const { PATCH, DELETE } = detail(ApproachPhase, approachPhaseSchema);
