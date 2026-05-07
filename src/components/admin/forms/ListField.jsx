"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  LuPlus,
  LuX,
  LuLibrary,
  LuUpload,
  LuLink,
  LuGripVertical,
} from "react-icons/lu";
import { apiSignUpload } from "@/lib/api-client";
import ImageLibraryDialog from "../ImageLibraryDialog";

async function uploadOne(file, folder) {
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

export default function ListField({
  value = [],
  onChange,
  variant = "string",
  placeholder,
  folder,
}) {
  const items = Array.isArray(value) ? value : [];

  if (variant === "image") {
    return <ImageGridList items={items} onChange={onChange} folder={folder} />;
  }

  function update(index, newItem) {
    const next = [...items];
    next[index] = newItem;
    onChange(next);
  }
  function remove(index) {
    onChange(items.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...items, ""]);
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="st-mono w-7 shrink-0 text-center text-[10px] uppercase tracking-[0.16em] text-[var(--st-muted-2)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className="st-input flex-1"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="st-icon-btn st-icon-btn--danger"
            aria-label="Remove"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-dashed border-[var(--st-line-2)] px-4 py-1.5 text-[12px] font-medium text-[var(--st-ink-2)] transition hover:border-[var(--st-ink)] hover:bg-[var(--st-bg-2)] hover:text-[var(--st-ink)]"
      >
        <LuPlus className="h-3.5 w-3.5" /> Add row
      </button>
    </div>
  );
}

function ImageGridList({ items, onChange, folder }) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
  const [bulkError, setBulkError] = useState("");
  const [urlInputOpen, setUrlInputOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");

  const tiles = items.filter((u) => typeof u === "string" && u.trim().length > 0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function appendMany(urls) {
    const merged = [...tiles];
    urls.forEach((u) => {
      if (u && !merged.includes(u)) merged.push(u);
    });
    onChange(merged);
    setLibraryOpen(false);
  }

  function removeAt(index) {
    const next = tiles.filter((_, i) => i !== index);
    onChange(next);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(tiles, oldIndex, newIndex));
  }

  async function handleBulkFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) =>
      f.type?.startsWith("image/"),
    );
    if (files.length === 0) {
      setBulkError("Please choose image files.");
      return;
    }
    setBulkError("");
    setBulkUploading(true);
    setBulkProgress({ done: 0, total: files.length });

    const urls = [];
    let firstError = null;
    for (const file of files) {
      try {
        const url = await uploadOne(file, folder);
        urls.push(url);
      } catch (err) {
        firstError = firstError || err.message;
      } finally {
        setBulkProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }

    if (urls.length > 0) appendMany(urls);
    if (firstError) {
      setBulkError(
        urls.length > 0
          ? `${urls.length}/${files.length} uploaded. Error: ${firstError}`
          : firstError,
      );
    }
    setBulkUploading(false);
  }

  function commitUrl() {
    const u = pendingUrl.trim();
    if (!u) return;
    if (!tiles.includes(u)) onChange([...tiles, u]);
    setPendingUrl("");
    setUrlInputOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {tiles.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tiles.map((_, i) => String(i))}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-5">
              {tiles.map((url, i) => (
                <SortableTile
                  key={`${url}-${i}`}
                  id={String(i)}
                  index={i}
                  url={url}
                  total={tiles.length}
                  onRemove={() => removeAt(i)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="rounded-2xl border-[1.5px] border-dashed border-[var(--st-line-2)] bg-[var(--st-bg)]/40 px-4 py-8 text-center">
          <p className="st-italic text-[16px] text-[var(--st-ink)]">No images yet.</p>
          <p className="st-mono mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--st-muted)]">
            upload · library · paste url
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label
          className={
            "st-cta st-cta--ghost st-cta--xs cursor-pointer " +
            (bulkUploading ? "pointer-events-none opacity-60" : "")
          }
        >
          <LuUpload className="h-3.5 w-3.5" />
          {bulkUploading
            ? `Uploading ${bulkProgress.done}/${bulkProgress.total}…`
            : "Upload"}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={bulkUploading}
            className="hidden"
            onChange={(e) => {
              handleBulkFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>

        {folder && (
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="st-cta st-cta--ghost st-cta--xs"
          >
            <LuLibrary className="h-3.5 w-3.5" /> Library
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setUrlInputOpen((v) => !v);
            setPendingUrl("");
          }}
          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-[var(--st-line-2)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--st-ink-2)] transition hover:border-[var(--st-ink)] hover:bg-[var(--st-bg-2)] hover:text-[var(--st-ink)]"
        >
          <LuLink className="h-3.5 w-3.5" /> Paste URL
        </button>
      </div>

      {urlInputOpen && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={pendingUrl}
            onChange={(e) => setPendingUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitUrl();
              }
              if (e.key === "Escape") {
                setUrlInputOpen(false);
                setPendingUrl("");
              }
            }}
            placeholder="https://…"
            className="st-input flex-1 text-[13px]"
          />
          <button
            type="button"
            onClick={commitUrl}
            className="st-cta st-cta--xs"
          >
            Add
          </button>
        </div>
      )}

      {bulkError && <p className="st-error">{bulkError}</p>}

      {tiles.length > 1 && (
        <p className="st-help">
          Drag tiles to rearrange — order shown here is the order they&apos;ll appear
          on the project page.
        </p>
      )}

      {folder && (
        <ImageLibraryDialog
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          folder={folder}
          multiple
          onPickMany={appendMany}
        />
      )}
    </div>
  );
}

function SortableTile({ id, index, url, total, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        "group relative aspect-square overflow-hidden rounded-xl border border-[var(--st-line-2)] bg-[var(--st-bg-2)] " +
        (isDragging
          ? "z-10 shadow-[0_24px_48px_-18px_rgba(15,27,34,0.45)]"
          : "")
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="absolute left-1.5 top-1.5 flex h-7 w-7 cursor-grab touch-none items-center justify-center rounded-full bg-[var(--st-ink)]/85 text-[var(--st-paper)] backdrop-blur-sm opacity-100 transition active:cursor-grabbing md:h-6 md:w-6 md:opacity-0 md:group-hover:opacity-100"
      >
        <LuGripVertical className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--st-paper)] text-[var(--st-ink)] shadow-md opacity-100 transition hover:bg-[var(--st-ink)] hover:text-[var(--st-accent)] md:h-6 md:w-6 md:opacity-0 md:group-hover:opacity-100"
      >
        <LuX className="h-3 w-3" />
      </button>

      <span className="st-mono pointer-events-none absolute bottom-1.5 left-1.5 rounded-full bg-[var(--st-ink)]/85 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-[var(--st-paper)]">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
