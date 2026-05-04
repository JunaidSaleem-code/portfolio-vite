"use client";

import { useState } from "react";
import { LuUpload, LuX, LuLibrary } from "react-icons/lu";
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
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt=""
            className="h-32 w-32 rounded-md border border-white/10 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-400"
            aria-label="Remove image"
          >
            <LuX className="h-3 w-3" />
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
            "flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed py-6 text-sm transition " +
            (dragOver
              ? "border-purple-400 bg-purple-500/10 text-purple-200"
              : "border-white/10 bg-zinc-950 text-zinc-500")
          }
        >
          <LuUpload className="h-5 w-5" />
          <span>Drag an image here, or use the buttons below</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800">
          <LuUpload className="h-4 w-4" />
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
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
        >
          <LuLibrary className="h-4 w-4" />
          Library
        </button>

        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste URL / path"
          className="min-w-[12rem] flex-1 rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-purple-400"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

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
