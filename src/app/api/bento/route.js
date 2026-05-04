import BentoItem from "@/models/BentoItem";
import { bentoItemSchema } from "@/lib/schemas";
import { listCreate } from "@/lib/api-handlers";

export const { GET, POST } = listCreate(BentoItem, bentoItemSchema);
