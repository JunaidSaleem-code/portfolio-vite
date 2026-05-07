"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuCheck } from "react-icons/lu";
import Field from "./forms/Field";
import { FormSkeleton } from "./Skeleton";
import { apiGetSetting, apiSaveSetting } from "@/lib/api-client";

export default function SettingForm({ settingKey, fields, defaultValues = {} }) {
  const qc = useQueryClient();
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["setting", settingKey],
    queryFn: () => apiGetSetting(settingKey),
  });

  const { register, handleSubmit, reset, formState, watch, setValue } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (data) reset({ ...defaultValues, ...data });
  }, [data, reset, defaultValues]);

  const mut = useMutation({
    mutationFn: (values) => apiSaveSetting(settingKey, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["setting", settingKey] });
      setError("");
      setSavedAt(Date.now());
    },
    onError: (e) => setError(e.message),
  });

  if (isLoading) return <FormSkeleton rows={fields.length} />;

  return (
    <form
      onSubmit={handleSubmit((v) => mut.mutate(v))}
      className="flex flex-col gap-6"
    >
      <div className="st-card p-5 sm:p-6 md:p-8">
        <div className="flex flex-col gap-5">
          {fields.map((field) => (
            <Field
              key={field.name}
              field={field}
              register={register}
              errors={formState.errors}
              watch={watch}
              setValue={setValue}
            />
          ))}
        </div>
      </div>

      {error && <p className="st-error-banner">{error}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={mut.isPending}
          className="st-cta st-cta--sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mut.isPending ? "Saving…" : "Save changes"}
        </button>
        {savedAt && !mut.isPending && (
          <span className="inline-flex items-center gap-2 text-[12.5px] text-[var(--st-ink-2)]">
            <LuCheck className="h-3.5 w-3.5 text-[var(--st-ink)]" />
            <span className="st-italic">Saved.</span>
          </span>
        )}
      </div>
    </form>
  );
}
