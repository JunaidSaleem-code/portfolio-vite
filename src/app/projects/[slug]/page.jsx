import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { LuArrowLeft, LuArrowUpRight, LuExternalLink, LuGithub } from "react-icons/lu";
import { getProjectBySlug } from "@/lib/data";
import { siteUrl } from "@/lib/env";
import StudioShell from "@/components/studio/StudioShell";
import StudioNav from "@/components/studio/StudioNav";
import ProjectGallery from "@/components/studio/ProjectGallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const canonical = `/projects/${slug}`;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: project.title,
      description: project.description,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const base = siteUrl();
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${base}/projects/${project.slug}`,
    image: project.image || undefined,
    keywords: [...(project.tags || []), ...(project.techStack || [])].join(", ") || undefined,
    author: { "@type": "Person", name: "Junaid Saleem", url: base },
    creator: { "@type": "Person", name: "Junaid Saleem", url: base },
  };

  const gallery = Array.isArray(project.gallery) ? project.gallery.filter(Boolean) : [];

  return (
    <StudioShell>
      <StudioNav />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      {/* Header */}
      <section className="relative px-4 pt-24 sm:px-6 sm:pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#projects"
            className="st-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)] transition hover:text-[var(--st-ink)]"
          >
            <LuArrowLeft className="h-3.5 w-3.5" /> Back to selected work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
            <span className="st-mono text-[11px] uppercase tracking-[0.3em] text-[var(--st-ink)]">
              ② Case study
            </span>
            <span className="h-px w-8 bg-[var(--st-line-2)]" />
            <span className="st-mono break-all text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
              /projects/{project.slug}
            </span>
          </div>

          <h1 className="st-display mt-6 max-w-4xl text-[clamp(2.25rem,9vw,7rem)] leading-[0.95] text-[var(--st-ink)] sm:text-[clamp(2.75rem,8vw,7rem)] sm:leading-[0.92]">
            {project.title}
            <span className="st-italic font-normal">.</span>
          </h1>

          {project.description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--st-ink-2)] sm:mt-7 sm:text-lg md:text-xl">
              {project.description}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:mt-9 sm:gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="st-cta st-cta--dark"
              >
                <LuExternalLink className="h-4 w-4" />
                Visit live site
              </a>
            )}
            {project.repoLink && (
              <a
                href={project.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="st-cta st-cta--ghost"
              >
                <LuGithub className="h-4 w-4" />
                Source code
              </a>
            )}
          </div>

          {project.techStack?.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-1.5 border-t border-[var(--st-line-2)] pt-5 sm:mt-10 sm:gap-2 sm:pt-6">
              <span className="st-mono mr-1.5 text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)] sm:mr-2">
                Stack
              </span>
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="st-mono rounded-full border border-[var(--st-line-2)] bg-[var(--st-paper)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[var(--st-ink-2)] sm:px-3 sm:py-1 sm:text-[11px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product-style gallery (cover + screenshots) */}
      <ProjectGallery
        cover={project.image}
        gallery={gallery}
        title={project.title}
      />

      {/* Body */}
      {project.body && (
        <section className="relative px-4 pb-12 sm:px-6 sm:pb-16 md:pb-24">
          <div className="mx-auto grid max-w-6xl gap-8 sm:gap-10 md:grid-cols-12">
            <aside className="md:col-span-4">
              <div className="rounded-2xl border border-[var(--st-line-2)] bg-[var(--st-paper)] p-5 sm:rounded-3xl sm:p-7 md:sticky md:top-28">
                <p className="st-mono text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
                  ↳ Project notes
                </p>
                <p className="st-italic mt-3 text-xl leading-tight text-[var(--st-ink)] sm:text-2xl">
                  Why this exists, what shipped, what I learned.
                </p>
                {project.tags?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="st-mono rounded-full border border-[var(--st-line-2)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--st-ink-2)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            <article
              className="prose prose-zinc max-w-none md:col-span-8
                prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--st-ink)]
                prose-h2:mt-12 prose-h2:text-3xl md:prose-h2:text-4xl
                prose-h3:mt-8 prose-h3:text-xl
                prose-p:text-[var(--st-ink-2)] prose-p:leading-relaxed
                prose-li:text-[var(--st-ink-2)]
                prose-strong:text-[var(--st-ink)]
                prose-a:text-[var(--st-ink)] prose-a:underline prose-a:decoration-[var(--st-accent)] prose-a:decoration-2 prose-a:underline-offset-4
                prose-blockquote:border-l-4 prose-blockquote:border-[var(--st-accent)] prose-blockquote:bg-[var(--st-paper)] prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-[var(--st-ink-2)]
                prose-code:rounded prose-code:bg-[var(--st-paper)] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[var(--st-ink)] prose-code:text-[0.92em] prose-code:font-medium
                prose-pre:bg-[var(--st-ink)] prose-pre:text-[var(--st-paper)] prose-pre:rounded-2xl
                prose-hr:border-[var(--st-line-2)]"
            >
              <ReactMarkdown>{project.body}</ReactMarkdown>
            </article>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="relative px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 md:pb-28">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 rounded-2xl border border-[var(--st-line-2)] bg-[var(--st-paper)] p-6 sm:gap-6 sm:rounded-3xl sm:p-8 md:flex-row md:items-center md:p-10">
          <div>
            <p className="st-mono text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
              ↳ Keep browsing
            </p>
            <p className="st-display mt-3 text-2xl leading-[1.05] text-[var(--st-ink)] sm:text-3xl md:text-4xl">
              See more <span className="st-italic font-normal">recent runs.</span>
            </p>
          </div>
          <Link href="/#projects" className="st-cta st-cta--dark">
            All projects
            <LuArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </StudioShell>
  );
}
