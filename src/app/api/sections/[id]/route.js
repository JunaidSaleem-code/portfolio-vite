import Section from "@/models/Section";
import { sectionSchema } from "@/lib/schemas";
import { detail } from "@/lib/api-handlers";

export const { PATCH } = detail(Section, sectionSchema);
