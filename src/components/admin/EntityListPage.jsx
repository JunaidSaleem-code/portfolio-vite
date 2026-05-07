"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuPlus, LuPencil, LuTrash2, LuEye, LuEyeOff } from "react-icons/lu";
import PageHeader from "./PageHeader";
import SortableList from "./SortableList";
import EntityFormDialog from "./EntityFormDialog";
import { ListSkeleton } from "./Skeleton";
import { apiList, apiCreate, apiUpdate, apiDelete, apiReorder } from "@/lib/api-client";

export default function EntityListPage({
  resource,
  title,
  description,
  fields,
  defaultValues = {},
  renderSummary,
  allowAdd = true,
  allowDelete = true,
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const { data: items = [], isLoading, isError, error: fetchError } = useQuery({
    queryKey: [resource],
    queryFn: () => apiList(resource),
  });

  const createMut = useMutation({
    mutationFn: (data) => apiCreate(resource, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] });
      setCreating(false);
      setError("");
    },
    onError: (e) => setError(e.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => apiUpdate(resource, id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] });
      setEditing(null);
      setError("");
    },
    onError: (e) => setError(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => apiDelete(resource, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
  });

  const reorderMut = useMutation({
    mutationFn: (ids) => apiReorder(resource, ids),
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: [resource] });
      const previous = qc.getQueryData([resource]);
      const idToItem = new Map(previous.map((i) => [i._id, i]));
      qc.setQueryData(
        [resource],
        ids.map((id) => idToItem.get(id)).filter(Boolean)
      );
      return { previous };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData([resource], ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [resource] }),
  });

  function handleVisibilityToggle(item) {
    updateMut.mutate({ id: item._id, data: { visible: !item.visible } });
  }

  function handleDelete(item) {
    if (!confirm(`Delete "${item.title || item.name || item.label || "this item"}"?`)) return;
    deleteMut.mutate(item._id);
  }

  return (
    <>
      <PageHeader
        eyebrow={resource}
        title={title}
        description={description}
        action={
          allowAdd && (
            <button
              onClick={() => {
                setError("");
                setCreating(true);
              }}
              className="st-cta st-cta--sm"
            >
              <LuPlus className="h-4 w-4" /> Add new
            </button>
          )
        }
      />

      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : isError ? (
        <p className="st-error-banner">{fetchError.message}</p>
      ) : items.length === 0 ? (
        <div className="st-card--dashed flex flex-col items-center gap-3 px-6 py-12 text-center">
          <span className="st-eyebrow">— empty</span>
          <p className="st-italic max-w-sm text-[20px] leading-snug text-[var(--st-ink)]">
            Nothing here yet.
          </p>
          {allowAdd && (
            <p className="text-[13px] text-[var(--st-muted)]">
              Tap{" "}
              <span className="st-mono rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--st-ink)]">
                Add new
              </span>{" "}
              to create the first one.
            </p>
          )}
        </div>
      ) : (
        <SortableList
          items={items}
          getId={(item) => item._id}
          onReorder={(next) => reorderMut.mutate(next.map((i) => i._id))}
          renderItem={(item, handleProps, index) => (
            <div className="group st-card--flat flex items-center gap-2 px-2.5 py-2.5 transition-shadow hover:shadow-[0_18px_36px_-26px_rgba(15,27,34,0.22)] sm:gap-3 sm:px-3 sm:py-3">
              <button {...handleProps} />
              <span className="st-mono hidden w-9 shrink-0 text-center text-[10px] uppercase tracking-[0.16em] text-[var(--st-muted-2)] md:block">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">{renderSummary(item)}</div>
              <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                <button
                  type="button"
                  onClick={() => handleVisibilityToggle(item)}
                  className={
                    "st-icon-btn " +
                    (item.visible ? "st-icon-btn--accent" : "")
                  }
                  aria-label={item.visible ? "Hide" : "Show"}
                  title={item.visible ? "Visible — click to hide" : "Hidden — click to show"}
                >
                  {item.visible ? (
                    <LuEye className="h-4 w-4" />
                  ) : (
                    <LuEyeOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setEditing(item);
                  }}
                  className="st-icon-btn"
                  aria-label="Edit"
                >
                  <LuPencil className="h-4 w-4" />
                </button>
                {allowDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="st-icon-btn st-icon-btn--danger"
                    aria-label="Delete"
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        />
      )}

      <EntityFormDialog
        open={creating}
        onClose={() => setCreating(false)}
        title={`Add ${title}`}
        fields={fields}
        initialValues={defaultValues}
        submitting={createMut.isPending}
        error={error}
        onSubmit={(data) => createMut.mutate(data)}
      />

      <EntityFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={`Edit ${title}`}
        fields={fields}
        initialValues={editing || {}}
        submitting={updateMut.isPending}
        error={error}
        onSubmit={(data) => updateMut.mutate({ id: editing._id, data })}
      />
    </>
  );
}
