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

  const isEdit = (title || "").toLowerCase().startsWith("edit");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      eyebrow={isEdit ? "Edit entry" : "New entry"}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="st-cta st-cta--ghost st-cta--sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="entity-form"
            disabled={submitting}
            className="st-cta st-cta--sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save changes"}
          </button>
        </>
      }
    >
      <form id="entity-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
        {error && <p className="st-error-banner">{error}</p>}
      </form>
    </Modal>
  );
}
