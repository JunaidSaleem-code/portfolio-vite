import SocialLink from "@/models/SocialLink";
import { socialLinkSchema } from "@/lib/schemas";
import { detail } from "@/lib/api-handlers";

export const { PATCH, DELETE } = detail(SocialLink, socialLinkSchema);
