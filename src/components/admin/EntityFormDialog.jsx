"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Field from "./forms/Field";

export default function EntityFormDialog({
  open,
  onClose,
  title,
  fields,
  initialValues,
  onSubmit,
  submitting,
  error,
}) {
  const { register, handleSubmit, reset, formState, watch, setValue } = useForm({
    defaultValues: initialValues || {},
  });

  useEffect(() => {
    if (open) reset(initialValues || {});
  }, [open, initialValues, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="entity-form"
            disabled={submitting}
            className="rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save"}
          </button>
        </>
      }
    >
      <form id="entity-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
      </form>
    </Modal>
  );
}
