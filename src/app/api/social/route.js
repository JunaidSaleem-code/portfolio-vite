import SocialLink from "@/models/SocialLink";
import { socialLinkSchema } from "@/lib/schemas";
import { listCreate } from "@/lib/api-handlers";

export const { GET, POST } = listCreate(SocialLink, socialLinkSchema);
