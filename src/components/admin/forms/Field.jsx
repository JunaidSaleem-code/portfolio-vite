"use client";

import ImageField from "./ImageField";
import ListField from "./ListField";
import MarkdownEditor from "./MarkdownEditor";

export default function Field({ field, register, control, errors, watch, setValue }) {
  const error = errors?.[field.name]?.message;

  if (field.type === "textarea") {
    return (
      <Wrapper field={field} error={error}>
        <textarea
          {...register(field.name)}
          rows={field.rows || 3}
          placeholder={field.placeholder}
          className="st-input resize-y"
        />
      </Wrapper>
    );
  }

  if (field.type === "select") {
    return (
      <Wrapper field={field} error={error}>
        <div className="relative">
          <select {...register(field.name)} className="st-input appearance-none pr-9">
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--st-muted)]"
          >
            ▾
          </span>
        </div>
      </Wrapper>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--st-line)] bg-[var(--st-paper)] px-4 py-3 transition hover:border-[var(--st-line-2)] has-[:checked]:border-[var(--st-ink)]">
        <input
          type="checkbox"
          {...register(field.name)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] border-[var(--st-ink)] bg-[var(--st-bg)] transition-colors peer-checked:bg-[var(--st-accent)]"
        >
          <svg
            viewBox="0 0 12 12"
            className="h-3 w-3 scale-0 text-[var(--st-ink)] transition-transform group-has-[:checked]:scale-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 6.5l2.5 2.5 4.5-5" />
          </svg>
        </span>
        <span className="text-[14px] text-[var(--st-ink)]">{field.label}</span>
        {field.help && (
          <span className="ml-auto text-[12px] text-[var(--st-muted)]">{field.help}</span>
        )}
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
        className="st-input"
      />
    </Wrapper>
  );
}

function Wrapper({ field, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={"st-label " + (field.required ? "st-label--req" : "")}>
        {field.label}
      </label>
      {children}
      {field.help && <p className="st-help">{field.help}</p>}
      {error && <p className="st-error">{error}</p>}
    </div>
  );
}
