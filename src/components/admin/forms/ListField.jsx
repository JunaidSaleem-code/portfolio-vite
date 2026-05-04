"use client";

import { LuPlus, LuX } from "react-icons/lu";
import ImageField from "./ImageField";

export default function ListField({ value = [], onChange, variant = "string", placeholder, folder }) {
  const items = Array.isArray(value) ? value : [];

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
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            {variant === "image" ? (
              <ImageField value={item} onChange={(v) => update(i, v)} folder={folder} />
            ) : (
              <input
                type="text"
                value={item}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none placeholder:text-zinc-600 focus:border-purple-400"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="mt-1 rounded-md border border-white/10 bg-zinc-900 p-2 text-zinc-400 transition hover:text-red-400"
            aria-label="Remove"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-dashed border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-white/30 hover:text-white"
      >
        <LuPlus className="h-4 w-4" /> Add
      </button>
    </div>
  );
}
