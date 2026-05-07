import { ImageResponse } from "next/og";

export const alt = "Junaid Saleem — AI-focused Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #a78bfa, #6366f1)",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 28, opacity: 0.85, letterSpacing: 1 }}>
            JUNAID SALEEM
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 32, color: "#a78bfa", letterSpacing: 2 }}>
            AI · FULL-STACK · LLM INTEGRATION
          </div>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            Building AI-powered products that ship.
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)", maxWidth: 900 }}>
            RAG pipelines, LLM integration, and end-to-end product delivery.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
