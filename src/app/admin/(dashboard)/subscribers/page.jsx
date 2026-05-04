"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuDownload, LuTrash2, LuSearch } from "react-icons/lu";
import PageHeader from "@/components/admin/PageHeader";
import { ListSkeleton } from "@/components/admin/Skeleton";

async function fetchSubscribers() {
  const res = await fetch("/api/subscribers");
  if (!res.ok) throw new Error("Failed to load subscribers");
  return res.json();
}

async function deleteSubscriber(id) {
  const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}

export default function SubscribersPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("");

  const { data: subs = [], isLoading, isError, error } = useQuery({
    queryKey: ["subscribers"],
    queryFn: fetchSubscribers,
  });

  const deleteMut = useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscribers"] }),
  });

  const filtered = useMemo(() => {
    if (!filter) return subs;
    const q = filter.toLowerCase();
    return subs.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        s.name?.toLowerCase().includes(q) ||
        s.source?.toLowerCase().includes(q)
    );
  }, [subs, filter]);

  function handleDelete(sub) {
    if (!confirm(`Remove ${sub.email}?`)) return;
    deleteMut.mutate(sub._id);
  }

  return (
    <>
      <PageHeader
        title="Subscribers"
        description={`${subs.length} ${subs.length === 1 ? "person has" : "people have"} subscribed.`}
        action={
          subs.length > 0 && (
            <a
              href="/api/subscribers/export"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <LuDownload className="h-4 w-4" /> Export CSV
            </a>
          )
        }
      />

      {subs.length > 0 && (
        <div className="mb-4 relative max-w-sm">
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by email, name, source"
            className="w-full rounded-md border border-white/10 bg-black py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-purple-400 placeholder:text-zinc-600"
          />
        </div>
      )}

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : isError ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error.message}
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/10 bg-zinc-950 px-4 py-8 text-center text-sm text-zinc-500">
          {subs.length === 0
            ? "No subscribers yet. Once visitors opt in via the footer form, they'll appear here."
            : "No matches for that filter."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-zinc-900 text-xs uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Subscribed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-b border-white/5 last:border-b-0">
                  <td className="px-4 py-3 font-medium text-white">{s.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{s.name || "—"}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    <span className="rounded bg-white/5 px-2 py-0.5 text-xs">{s.source || "unknown"}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      className="rounded-md p-2 text-zinc-400 transition hover:bg-white/5 hover:text-red-400"
                      aria-label="Delete subscriber"
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
