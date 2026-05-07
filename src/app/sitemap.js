import { getAllProjectSlugs } from "@/lib/data";
import { siteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = siteUrl();
  const now = new Date();

  const slugs = await getAllProjectSlugs();
  const projects = slugs.map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projects,
  ];
}
