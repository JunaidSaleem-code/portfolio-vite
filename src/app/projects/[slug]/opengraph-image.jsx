import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/data";

export const alt = "Project · Junaid Saleem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function ProjectOpenGraphImage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  const title = project?.title || "Project";
  const description = project?.description || "Junaid Saleem · Portfolio";
  const techStack = project?.techStack?.slice(0, 5) || [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#050505",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #4c1d95 0%, transparent 55%), radial-gradient(circle at 80% 80%, #1e3a8a 0%, transparent 55%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg, #a78bfa, #6366f1)",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 26, opacity: 0.8, letterSpacing: 1 }}>
            JUNAID SALEEM · CASE STUDY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 80,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -2,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 1000,
              lineHeight: 1.35,
            }}
          >
            {description.length > 180 ? `${description.slice(0, 180)}…` : description}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {techStack.map((t) => (
            <div
              key={t}
              style={{
                fontSize: 22,
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
