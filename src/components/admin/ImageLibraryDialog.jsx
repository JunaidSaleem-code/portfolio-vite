"use client";

import { useQuery } from "@tanstack/react-query";
import Modal from "./Modal";
import { Skeleton } from "./Skeleton";
import { apiListCloudinary } from "@/lib/api-client";

export default function ImageLibraryDialog({ open, onClose, folder, onPick }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cloudinary-library", folder],
    queryFn: () => apiListCloudinary(folder),
    enabled: open,
    staleTime: 60_000,
  });

  const items = data?.items || [];

  return (
    <Modal open={open} onClose={onClose} title={`Library — ${folder}`}>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>
      ) : isError ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error.message}
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-500">
          No images uploaded to <code>{folder}</code> yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.publicId}
              type="button"
              onClick={() => onPick(item.url)}
              className="group relative aspect-square overflow-hidden rounded-md border border-white/10 transition hover:border-purple-400"
            >
              <img
                src={item.url}
                alt=""
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-2 py-1 text-[10px] text-zinc-300">
                {item.publicId.split("/").pop()}
              </span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
