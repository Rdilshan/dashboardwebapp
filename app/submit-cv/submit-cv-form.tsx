"use client";

import { ChevronDown, LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitStudentCvFormAction } from "../action/student";
import type { SubmitCvActionState } from "../action/student";

type SubmitCvStudentDetails = {
  fullName: string;
  indexNumber: string;
  email: string;
};

type SubmitCvRoleOption = {
  id: number;
  name: string;
};

type SubmitCvFormProps = {
  preferredRoles: SubmitCvRoleOption[];
  student: SubmitCvStudentDetails;
};

const initialSubmitCvActionState: SubmitCvActionState = {
  success: false,
  error: null,
  redirectTo: null,
  values: {
    preferredRoleId: "",
    contactNumber: "",
    linkedinUrl: "",
    githubUrl: "",
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:translate-y-0 disabled:opacity-70"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={1.8} />
          Submitting...
        </>
      ) : (
        "Submit Application"
      )}
    </button>
  );
}

export function SubmitCvForm({
  preferredRoles,
  student,
}: SubmitCvFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [state, formAction] = useActionState(
    submitStudentCvFormAction,
    initialSubmitCvActionState,
  );

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [router, state.redirectTo, state.success]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelectedFileName(file?.name ?? "");
  }

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    if (inputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      inputRef.current.files = transfer.files;
    }

    setSelectedFileName(file.name);
  }

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:p-10"
    >
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-slate-300">
        Full name, index number, and email are pulled from your student account
        and cannot be changed here.
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-x-7 lg:gap-y-6">
        <FormField
          label="Full Name"
          htmlFor="full_name"
          required
          input={
            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={student.fullName}
              readOnly
              required
              className={readOnlyInputClassName}
            />
          }
        />

        <FormField
          label="Index Number"
          htmlFor="index_number"
          required
          input={
            <input
              id="index_number"
              name="index_number"
              type="text"
              defaultValue={student.indexNumber}
              readOnly
              required
              className={readOnlyInputClassName}
            />
          }
        />

        <FormField
          label="Preferred Job Role"
          htmlFor="preferred_role"
          required
          error={state.fieldErrors?.preferredRoleId}
          input={
            <div className="relative">
              <select
                id="preferred_role"
                name="preferred_role"
                defaultValue={state.values.preferredRoleId}
                required
                className={`${inputClassName} appearance-none pr-12 text-slate-300`}
              >
                <option value="" disabled>
                  Select a role...
                </option>
                {preferredRoles.map((role) => (
                  <option
                    key={role.id}
                    value={String(role.id)}
                    className="bg-slate-900"
                  >
                    {role.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </div>
          }
        />

        <FormField
          label="Contact Number"
          htmlFor="contact_number"
          required
          error={state.fieldErrors?.contactNumber}
          input={
            <input
              id="contact_number"
              name="contact_number"
              type="tel"
              placeholder="e.g. +94 71 234 5678"
              defaultValue={state.values.contactNumber}
              required
              className={fieldClassName(state.fieldErrors?.contactNumber)}
            />
          }
        />

        <FormField
          label="Email Address"
          htmlFor="email"
          required
          input={
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={student.email}
              readOnly
              required
              className={readOnlyInputClassName}
            />
          }
        />

        <FormField
          label="LinkedIn Profile URL"
          htmlFor="linkedin_url"
          error={state.fieldErrors?.linkedinUrl}
          input={
            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              defaultValue={state.values.linkedinUrl}
              className={fieldClassName(state.fieldErrors?.linkedinUrl)}
            />
          }
        />

        <FormField
          label="GitHub Profile URL"
          htmlFor="github_url"
          error={state.fieldErrors?.githubUrl}
          input={
            <input
              id="github_url"
              name="github_url"
              type="url"
              placeholder="https://github.com/your-username"
              defaultValue={state.values.githubUrl}
              className={fieldClassName(state.fieldErrors?.githubUrl)}
            />
          }
        />

        <div className="space-y-2 lg:col-span-2">
          <label
            htmlFor="cv_file"
            className="text-sm font-medium text-slate-300"
          >
            Upload CV <span className="text-red-400">*</span>
          </label>

          <label
            htmlFor="cv_file"
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`block cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
              isDragging
                ? "border-indigo-400 bg-indigo-500/8"
                : state.fieldErrors?.cvFile
                  ? "border-red-400/70 bg-red-500/5"
                  : "border-white/10 bg-white/[0.02] hover:border-indigo-400/50 hover:bg-indigo-500/5"
            }`}
          >
            <input
              ref={inputRef}
              id="cv_file"
              name="cv_file"
              type="file"
              accept=".pdf,.doc,.docx"
              required
              className="sr-only"
              onChange={handleFileChange}
            />
            <div className="pointer-events-none flex flex-col items-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-indigo-200">
                <Upload className="h-8 w-8" strokeWidth={1.8} />
              </span>
              <p className="mt-4 text-base text-slate-200">
                Drag and drop your CV here or{" "}
                <span className="font-semibold text-indigo-300">browse</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Accepted: .pdf, .doc, .docx - Max 10 MB
              </p>
              <p
                className={`mt-3 text-sm font-medium ${
                  selectedFileName ? "text-indigo-300" : "text-slate-500"
                }`}
                aria-live="polite"
              >
                {selectedFileName || "No file selected"}
              </p>
            </div>
          </label>
          <p className="min-h-5 text-xs text-red-400">
            {state.fieldErrors?.cvFile ?? ""}
          </p>
        </div>
      </div>

      {state.error ? (
        <p
          role="alert"
          aria-live="polite"
          className="mt-6 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
        >
          {state.error}
        </p>
      ) : null}

      <div className="mt-8">
        <SubmitButton />
      </div>
    </form>
  );
}

function FormField({
  htmlFor,
  label,
  required,
  input,
  error,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-300">
        {label} {required ? <span className="text-red-400">*</span> : null}
      </label>
      {input}
      <p className="min-h-5 text-xs text-red-400">{error ?? ""}</p>
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

const readOnlyInputClassName = `${inputClassName} cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-300 focus:border-white/5 focus:bg-white/[0.02] focus:ring-0`;

function fieldClassName(error?: string) {
  return `${inputClassName} ${
    error
      ? "border-red-400/70 focus:border-red-400 focus:ring-red-500/15"
      : ""
  }`;
}
