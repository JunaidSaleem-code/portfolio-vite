import BentoItem from "@/models/BentoItem";
import { bentoItemSchema } from "@/lib/schemas";
import { detail } from "@/lib/api-handlers";

export const { PATCH, DELETE } = detail(BentoItem, bentoItemSchema);
