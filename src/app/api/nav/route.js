import NavItem from "@/models/NavItem";
import { navItemSchema } from "@/lib/schemas";
import { listCreate } from "@/lib/api-handlers";

export const { GET, POST } = listCreate(NavItem, navItemSchema);
