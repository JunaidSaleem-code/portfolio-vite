"use client";

import { useState } from "react";
import { LuUpload, LuX, LuLibrary, LuLink } from "react-icons/lu";
import { apiSignUpload } from "@/lib/api-client";
import ImageLibraryDialog from "../ImageLibraryDialog";

async function uploadToCloudinary(file, folder) {
  const { signature, timestamp, apiKey, cloudName } = await apiSignUpload(folder);
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Cloudinary upload failed");
  }
  const json = await res.json();
  return json.secure_url;
}

export default function ImageField({ value, onChange, folder = "portfolio" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, folder);
      onChange(url);
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
    handleFile(file);
  }

  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-36 w-36 rounded-2xl border border-[var(--st-line-2)] object-cover shadow-[0_18px_36px_-22px_rgba(15,27,34,0.35)]"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--st-ink)] bg-[var(--st-paper)] text-[var(--st-ink)] transition hover:bg-[var(--st-ink)] hover:text-[var(--st-accent)]"
            aria-label="Remove image"
          >
            <LuX className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={
            "flex flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed py-10 text-center transition " +
            (dragOver
              ? "border-[var(--st-ink)] bg-[var(--st-accent)]/30"
              : "border-[var(--st-line-2)] bg-[var(--st-bg)]/40")
          }
        >
          <LuUpload className="h-5 w-5 text-[var(--st-ink-2)]" />
          <span className="st-italic text-[16px] text-[var(--st-ink)]">
            Drop image here
          </span>
          <span className="st-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--st-muted)]">
            or use the buttons below
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className="st-cta st-cta--ghost st-cta--xs cursor-pointer">
          <LuUpload className="h-3.5 w-3.5" />
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="st-cta st-cta--ghost st-cta--xs"
        >
          <LuLibrary className="h-3.5 w-3.5" />
          Library
        </button>

        <div className="relative flex-1 min-w-[12rem]">
          <LuLink className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--st-muted)]" />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste URL / path"
            className="st-input pl-9 text-[13px]"
          />
        </div>
      </div>

      {error && <p className="st-error">{error}</p>}

      <ImageLibraryDialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        folder={folder}
        onPick={(url) => {
          onChange(url);
          setLibraryOpen(false);
        }}
      />
    </div>
  );
}
