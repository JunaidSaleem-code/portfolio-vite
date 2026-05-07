"use client";

import { useEffect, useState } from "react";
import { LuRefreshCw, LuDatabase, LuCheck, LuTriangleAlert } from "react-icons/lu";

export default function RagRebuildCard() {
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  async function loadStats() {
    try {
      const res = await fetch("/api/admin/rag-rebuild", { method: "GET" });
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch {}
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function rebuild() {
    if (busy) return;
    setBusy(true);
    setError("");
    setReport(null);
    try {
      const res = await fetch("/api/admin/rag-rebuild", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Rebuild failed");
      } else {
        setReport(data.report);
        await loadStats();
      }
    } catch (e) {
      setError(e?.message || "Rebuild failed");
    } finally {
      setBusy(false);
    }
  }

  const total = stats?.chunks ?? 0;
  const byKind = stats?.byKind || {};

  return (
    <div className="st-card relative overflow-hidden p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="st-mono text-[9.5px] uppercase tracking-[0.24em] text-[var(--st-muted)]">
            — Ask Junaid · RAG index
          </p>
          <h2 className="st-italic mt-2 text-[18px] text-[var(--st-ink)] sm:text-[20px]">
            Vector index{" "}
            <span className="st-mono not-italic text-[12px] tracking-[0.2em] text-[var(--st-muted)]">
              ({total} chunks)
            </span>
          </h2>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--st-ink)] text-[var(--st-accent)]">
          <LuDatabase className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {Object.entries(byKind).map(([k, n]) => (
          <span
            key={k}
            className="st-mono rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[var(--st-ink-2)]"
          >
            {k} · {n}
          </span>
        ))}
        {!Object.keys(byKind).length && (
          <span className="st-mono rounded-full border border-dashed border-[var(--st-line-2)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[var(--st-muted)]">
            empty — first request will index
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={rebuild}
        disabled={busy}
        className="st-cta st-cta--sm mt-5"
      >
        <LuRefreshCw className={"h-4 w-4 " + (busy ? "animate-spin" : "")} />
        {busy ? "Rebuilding…" : "Rebuild index"}
      </button>

      {report && (
        <div className="st-mono mt-4 grid grid-cols-2 gap-x-4 gap-y-1 rounded-xl border border-[var(--st-line-2)] bg-[var(--st-bg)] p-3 text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-ink-2)] sm:grid-cols-3">
          <Stat label="Total" v={report.total} />
          <Stat label="Inserted" v={report.inserted} good={report.inserted > 0} />
          <Stat label="Updated" v={report.updated} good={report.updated > 0} />
          <Stat label="Unchanged" v={report.unchanged} />
          <Stat label="Removed" v={report.removed} />
          <Stat label="Embed calls" v={report.embeddingCalls} />
          <Stat label="Took" v={`${report.duration}ms`} />
        </div>
      )}

      {!error && report && (
        <p className="st-mono mt-3 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-ink-2)]">
          <LuCheck className="h-3.5 w-3.5 text-[var(--st-accent-2)]" />
          Index up to date
        </p>
      )}

      {error && (
        <p className="st-mono mt-3 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-ink)]">
          <LuTriangleAlert className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function Stat({ label, v, good = false }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[var(--st-muted)]">{label}</span>
      <span className={good ? "text-[var(--st-ink)]" : "text-[var(--st-ink-2)]"}>{v}</span>
    </div>
  );
}
