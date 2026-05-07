"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuCheck } from "react-icons/lu";
import Modal from "./Modal";
import { Skeleton } from "./Skeleton";
import { apiListCloudinary } from "@/lib/api-client";

export default function ImageLibraryDialog({
  open,
  onClose,
  folder,
  onPick,
  onPickMany,
  multiple = false,
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cloudinary-library", folder],
    queryFn: () => apiListCloudinary(folder),
    enabled: open,
    staleTime: 60_000,
  });

  const items = data?.items || [];
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!open) setSelected([]);
  }, [open]);

  const toggle = (url) =>
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );

  const confirmMany = () => {
    if (selected.length === 0) return;
    onPickMany?.(selected);
    setSelected([]);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Image library"
      title={folder?.split("/").pop() || folder}
    >
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="st-error-banner">{error.message}</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border-[1.5px] border-dashed border-[var(--st-line-2)] px-6 py-12 text-center">
          <p className="st-italic text-[18px] text-[var(--st-ink)]">
            No images in this folder yet.
          </p>
          <p className="st-mono mt-2 text-[10px] uppercase tracking-[0.2em] text-[var(--st-muted)]">
            {folder}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => {
              const isSelected = selected.includes(item.url);
              const handleClick = () =>
                multiple ? toggle(item.url) : onPick?.(item.url);
              return (
                <button
                  key={item.publicId}
                  type="button"
                  onClick={handleClick}
                  className={
                    "group relative aspect-square overflow-hidden rounded-xl border-[1.5px] transition " +
                    (isSelected
                      ? "border-[var(--st-ink)] shadow-[0_0_0_3px_var(--st-accent-glow)]"
                      : "border-[var(--st-line-2)] hover:border-[var(--st-ink)]")
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  {multiple && isSelected && (
                    <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--st-ink)] bg-[var(--st-accent)] text-[var(--st-ink)]">
                      <LuCheck className="h-3 w-3" />
                    </span>
                  )}
                  <span className="st-mono pointer-events-none absolute inset-x-0 bottom-0 truncate bg-[var(--st-ink)]/85 px-2 py-1.5 text-[9px] uppercase tracking-[0.16em] text-[var(--st-paper)]">
                    {item.publicId.split("/").pop()}
                  </span>
                </button>
              );
            })}
          </div>

          {multiple && (
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--st-line)] pt-4">
              <p className="st-mono text-[11px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
                {selected.length} selected
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  disabled={selected.length === 0}
                  className="st-cta st-cta--ghost st-cta--xs disabled:opacity-40"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={confirmMany}
                  disabled={selected.length === 0}
                  className="st-cta st-cta--xs disabled:opacity-40"
                >
                  Add {selected.length || ""}{" "}
                  {selected.length === 1 ? "image" : "images"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
