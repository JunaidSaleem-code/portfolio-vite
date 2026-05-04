import NavItem from "@/models/NavItem";
import { navItemSchema } from "@/lib/schemas";
import { detail } from "@/lib/api-handlers";

export const { PATCH, DELETE } = detail(NavItem, navItemSchema);
