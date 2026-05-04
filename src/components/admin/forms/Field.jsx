"use client";

import ImageField from "./ImageField";
import ListField from "./ListField";
import MarkdownEditor from "./MarkdownEditor";

const baseInput =
  "w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none transition focus:border-purple-400 placeholder:text-zinc-600";

export default function Field({ field, register, control, errors, watch, setValue }) {
  const error = errors?.[field.name]?.message;

  if (field.type === "textarea") {
    return (
      <Wrapper field={field} error={error}>
        <textarea
          {...register(field.name)}
          rows={field.rows || 3}
          placeholder={field.placeholder}
          className={baseInput}
        />
      </Wrapper>
    );
  }

  if (field.type === "select") {
    return (
      <Wrapper field={field} error={error}>
        <select {...register(field.name)} className={baseInput}>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Wrapper>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" {...register(field.name)} className="h-4 w-4" />
        {field.label}
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <Wrapper field={field} error={error}>
        <ImageField
          value={watch(field.name)}
          onChange={(v) => setValue(field.name, v, { shouldDirty: true })}
          folder={field.folder}
        />
      </Wrapper>
    );
  }

  if (field.type === "markdown") {
    return (
      <Wrapper field={field} error={error}>
        <MarkdownEditor
          value={watch(field.name)}
          onChange={(v) => setValue(field.name, v, { shouldDirty: true })}
          placeholder={field.placeholder}
          rows={field.rows || 12}
        />
      </Wrapper>
    );
  }

  if (field.type === "imageList" || field.type === "stringList") {
    return (
      <Wrapper field={field} error={error}>
        <ListField
          value={watch(field.name) || []}
          onChange={(v) => setValue(field.name, v, { shouldDirty: true })}
          variant={field.type === "imageList" ? "image" : "string"}
          placeholder={field.placeholder}
          folder={field.folder}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper field={field} error={error}>
      <input
        type={field.type || "text"}
        {...register(field.name)}
        placeholder={field.placeholder}
        className={baseInput}
      />
    </Wrapper>
  );
}

function Wrapper({ field, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-zinc-300">
        {field.label}
        {field.required && <span className="text-red-400"> *</span>}
      </label>
      {children}
      {field.help && <p className="text-xs text-zinc-500">{field.help}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
