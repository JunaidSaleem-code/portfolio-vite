"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    <form onSubmit={handleSubmit((v) => mut.mutate(v))} className="flex flex-col gap-5">
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

      {error && (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={mut.isPending}
          className="rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mut.isPending ? "Saving…" : "Save changes"}
        </button>
        {savedAt && !mut.isPending && (
          <span className="text-xs text-emerald-400">Saved.</span>
        )}
      </div>
    </form>
  );
}
