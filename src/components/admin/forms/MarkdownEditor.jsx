"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownEditor({ value, onChange, placeholder, rows = 12 }) {
  const [tab, setTab] = useState("write");

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex w-fit items-center gap-1 rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] p-1">
        {["write", "preview"].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              "px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition rounded-full " +
              (tab === key
                ? "bg-[var(--st-ink)] text-[var(--st-paper)]"
                : "text-[var(--st-muted)] hover:text-[var(--st-ink)]")
            }
          >
            {key}
          </button>
        ))}
      </div>

      {tab === "write" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="st-input st-mono resize-y text-[13px] leading-relaxed"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        />
      ) : (
        <div className="min-h-[16rem] rounded-2xl border border-[var(--st-line-2)] bg-[var(--st-paper)] px-6 py-5">
          {value ? (
            <article className="st-prose">
              <ReactMarkdown>{value}</ReactMarkdown>
            </article>
          ) : (
            <p className="st-italic text-[16px] text-[var(--st-muted)]">
              Nothing to preview yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
