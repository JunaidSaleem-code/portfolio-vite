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
        title={title}
        description={description}
        action={
          allowAdd && (
            <button
              onClick={() => {
                setError("");
                setCreating(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-purple-500 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-purple-400"
            >
              <LuPlus className="h-4 w-4" /> Add new
            </button>
          )
        }
      />

      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : isError ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {fetchError.message}
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/10 bg-zinc-950 px-4 py-8 text-center text-sm text-zinc-500">
          No items yet. {allowAdd && "Click “Add new” to create one."}
        </p>
      ) : (
        <SortableList
          items={items}
          getId={(item) => item._id}
          onReorder={(next) => reorderMut.mutate(next.map((i) => i._id))}
          renderItem={(item, handleProps) => (
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-950 p-3">
              <button {...handleProps} />
              <div className="min-w-0 flex-1">{renderSummary(item)}</div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleVisibilityToggle(item)}
                  className="rounded-md p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                  aria-label={item.visible ? "Hide" : "Show"}
                  title={item.visible ? "Visible" : "Hidden"}
                >
                  {item.visible ? <LuEye className="h-4 w-4" /> : <LuEyeOff className="h-4 w-4 text-zinc-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setEditing(item);
                  }}
                  className="rounded-md p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                  aria-label="Edit"
                >
                  <LuPencil className="h-4 w-4" />
                </button>
                {allowDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="rounded-md p-2 text-zinc-400 transition hover:bg-white/5 hover:text-red-400"
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
