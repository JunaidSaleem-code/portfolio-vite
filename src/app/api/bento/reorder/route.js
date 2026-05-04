import BentoItem from "@/models/BentoItem";
import { reorder } from "@/lib/api-handlers";

export const { PATCH } = reorder(BentoItem);
