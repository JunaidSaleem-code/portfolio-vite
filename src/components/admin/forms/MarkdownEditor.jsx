"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

const baseInput =
  "w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none transition focus:border-purple-400 placeholder:text-zinc-600 font-mono text-sm";

export default function MarkdownEditor({ value, onChange, placeholder, rows = 12 }) {
  const [tab, setTab] = useState("write");

  return (
    <div className="flex flex-col gap-2">
      <div className="inline-flex w-fit overflow-hidden rounded-md border border-white/10 text-xs">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={
            "px-3 py-1.5 transition " +
            (tab === "write" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white")
          }
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={
            "px-3 py-1.5 transition " +
            (tab === "preview" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white")
          }
        >
          Preview
        </button>
      </div>

      {tab === "write" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={baseInput}
        />
      ) : (
        <div className="min-h-[16rem] rounded-md border border-white/10 bg-zinc-950 px-4 py-3">
          {value ? (
            <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-a:text-purple-400 prose-strong:text-white prose-code:text-purple-300">
              <ReactMarkdown>{value}</ReactMarkdown>
            </article>
          ) : (
            <p className="text-sm italic text-zinc-500">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
