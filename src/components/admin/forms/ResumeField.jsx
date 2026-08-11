"use client";

import { useEffect, useState } from "react";
import { LuUpload, LuExternalLink, LuFileText, LuCheck, LuX } from "react-icons/lu";

export default function ResumeField({ value, onChange }) {
  const [resumes, setResumes] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function fetchResumes() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/admin/resumes");
      if (res.ok) {
        const data = await res.json();
        setResumes(data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    fetchResumes();
  }, []);

  async function handleFileUpload(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file (.pdf)");
      return;
    }
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/resumes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload resume PDF");
      }

      const json = await res.json();
      await fetchResumes();
      onChange(json.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileUpload(file);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Drag & Drop Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed py-8 px-4 text-center transition " +
          (dragOver
            ? "border-[var(--st-ink)] bg-[var(--st-accent)]/30"
            : "border-[var(--st-line-2)] bg-[var(--st-bg)]/40")
        }
      >
        <LuFileText className="h-7 w-7 text-[var(--st-ink-2)]" />
        <div className="flex flex-col gap-0.5">
          <span className="st-italic text-[15px] font-medium text-[var(--st-ink)]">
            {uploading ? "Uploading PDF..." : "Drag & drop new Resume PDF here"}
          </span>
          <span className="st-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--st-muted)]">
            or click below to choose a file from your device
          </span>
        </div>

        <label className="st-cta st-cta--ghost st-cta--xs cursor-pointer mt-1">
          <LuUpload className="h-3.5 w-3.5" />
          {uploading ? "Uploading…" : "Choose PDF File"}
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
          />
        </label>
      </div>

      {error && <p className="st-error">{error}</p>}

      {/* Select active resume from available list */}
      <div className="flex flex-col gap-2">
        <label className="st-mono text-[11px] uppercase tracking-[0.2em] text-[var(--st-muted)]">
          Select Active Resume
        </label>
        <div className="flex items-center gap-2">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="st-input flex-1"
          >
            <option value="">-- Select an uploaded resume --</option>
            {resumes.map((r) => (
              <option key={r.url} value={r.url}>
                {r.name} ({r.url})
              </option>
            ))}
            {value && !resumes.some((r) => r.url === value) && (
              <option value={value}>Custom URL: {value}</option>
            )}
          </select>

          {value && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="st-cta st-cta--ghost st-cta--xs shrink-0"
              title="Open currently selected resume in new tab"
            >
              <LuExternalLink className="h-3.5 w-3.5" />
              Preview PDF
            </a>
          )}
        </div>
      </div>

      {/* Or paste custom URL */}
      <div className="flex flex-col gap-1.5">
        <label className="st-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
          Or custom URL / link (e.g. Google Drive)
        </label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/resumes/my-resume.pdf or https://..."
          className="st-input text-[13px]"
        />
      </div>
    </div>
  );
}
