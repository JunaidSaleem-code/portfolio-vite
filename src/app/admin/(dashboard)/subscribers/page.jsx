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
        eyebrow="newsletter"
        title="Subscribers"
        description={`${subs.length} ${subs.length === 1 ? "person has" : "people have"} subscribed.`}
        action={
          subs.length > 0 && (
            <a
              href="/api/subscribers/export"
              className="st-cta st-cta--ghost st-cta--sm"
            >
              <LuDownload className="h-4 w-4" /> Export CSV
            </a>
          )
        }
      />

      {subs.length > 0 && (
        <div className="relative mb-5 max-w-sm">
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--st-muted)]" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by email, name, source"
            className="st-input pl-9 text-[13.5px]"
          />
        </div>
      )}

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : isError ? (
        <p className="st-error-banner">{error.message}</p>
      ) : filtered.length === 0 ? (
        <div className="st-card--dashed flex flex-col items-center gap-2 px-6 py-12 text-center">
          <span className="st-eyebrow">— empty</span>
          <p className="st-italic text-[18px] text-[var(--st-ink)]">
            {subs.length === 0
              ? "No subscribers yet."
              : "No matches for that filter."}
          </p>
          {subs.length === 0 && (
            <p className="text-[13px] text-[var(--st-muted)]">
              Visitors who opt in via the footer form will appear here.
            </p>
          )}
        </div>
      ) : (
        <div className="st-card overflow-hidden p-0">
          <div className="-mx-px overflow-x-auto">
            <table className="st-table min-w-[640px]">
              <thead>
                <tr>
                  <th>Email</th>
                  <th className="hidden sm:table-cell">Name</th>
                  <th className="hidden md:table-cell">Source</th>
                  <th>Subscribed</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="truncate font-medium text-[var(--st-ink)]">
                          {s.email}
                        </span>
                        {s.name && (
                          <span className="truncate text-[12px] text-[var(--st-muted)] sm:hidden">
                            {s.name}
                          </span>
                        )}
                        {s.source && (
                          <span className="st-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--st-muted)] md:hidden">
                            via {s.source}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">{s.name || "—"}</td>
                    <td className="hidden md:table-cell">
                      <span className="st-pill">{s.source || "unknown"}</span>
                    </td>
                    <td>
                      <span className="st-mono whitespace-nowrap text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(s)}
                        className="st-icon-btn st-icon-btn--danger"
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
        </div>
      )}
    </>
  );
}
