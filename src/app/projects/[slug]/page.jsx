import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { LuArrowLeft, LuExternalLink, LuGithub } from "react-icons/lu";
import { getProjectBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} · Junaid Saleem`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        <Link
          href="/#projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <LuArrowLeft className="h-4 w-4" /> Back to all projects
        </Link>

        <h1 className="text-4xl font-bold md:text-5xl">{project.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400"
            >
              <LuExternalLink className="h-4 w-4" /> Visit live site
            </a>
          )}
          {project.repoLink && (
            <a
              href={project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <LuGithub className="h-4 w-4" /> Source code
            </a>
          )}
        </div>

        {project.techStack?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.image && (
          <div className="relative mt-12 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        {project.body && (
          <article className="prose prose-invert mt-12 max-w-none prose-headings:text-white prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-6 prose-h3:text-xl prose-p:text-zinc-300 prose-li:text-zinc-300 prose-a:text-purple-400 prose-strong:text-white prose-code:text-purple-300">
            <ReactMarkdown>{project.body}</ReactMarkdown>
          </article>
        )}

        {project.gallery?.length > 0 && (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div
                key={i}
                className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
