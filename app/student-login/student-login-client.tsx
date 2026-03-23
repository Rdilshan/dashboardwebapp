"use client";

import { LoaderCircle, MonitorCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Toast = {
  message: string;
  type: "success" | "error" | "info";
};

type FormValues = {
  indexNumber: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const particles = [
  "left-[-5%] top-[-10%] h-[25rem] w-[25rem] bg-indigo-500/10",
  "right-[-8%] top-[50%] h-[19rem] w-[19rem] bg-violet-500/10",
  "bottom-[-5%] left-[30%] h-[16rem] w-[16rem] bg-indigo-400/10",
  "left-[60%] top-[20%] h-[13rem] w-[13rem] bg-fuchsia-500/8",
  "bottom-[20%] right-[20%] h-[22rem] w-[22rem] bg-violet-400/8",
  "left-[10%] top-[70%] h-[11rem] w-[11rem] bg-indigo-300/10",
] as const;

const particleDelays = ["0s", "-5s", "-10s", "-3s", "-7s", "-12s"] as const;

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

export function StudentLoginClient() {
  const router = useRouter();
  const toastTimeoutRef = useRef<number | null>(null);
  const [values, setValues] = useState<FormValues>({
    indexNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(message: string, type: Toast["type"]) {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 4000);
  }

  function updateField<Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!values.indexNumber.trim()) {
      nextErrors.indexNumber = "Index number is required.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 800));
      showToast("Login successful. Redirecting...", "success");
      window.setTimeout(() => {
        router.push("/student-dashboard");
      }, 900);
    } catch {
      showToast("Login failed. Please try again.", "error");
    } finally {
      window.setTimeout(() => {
        setIsSubmitting(false);
      }, 200);
    }
  }

  return (
    <main className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#0a0e1a] px-6 py-8 text-slate-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.16),_transparent_28%),linear-gradient(180deg,_rgba(10,14,26,0.96)_0%,_rgba(10,14,26,1)_100%)]" />
        {particles.map((particle, index) => (
          <span
            key={particle}
            className={`home-float absolute rounded-full blur-3xl ${particle}`}
            style={{ animationDelay: particleDelays[index] }}
          />
        ))}
      </div>

      <div className="home-rise relative z-10 w-full max-w-[28rem] rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-6 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-10 sm:py-12">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200 shadow-lg shadow-indigo-950/40">
            <MonitorCheck className="h-9 w-9" strokeWidth={1.8} />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Student Access
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Log in to track your weekly progress reports.
          </p>
        </div>

        <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
          <Field
            label="Index Number"
            htmlFor="index_number"
            error={errors.indexNumber}
            input={
              <input
                id="index_number"
                name="index_number"
                type="text"
                autoComplete="username"
                value={values.indexNumber}
                onChange={(event) =>
                  updateField("indexNumber", event.target.value)
                }
                placeholder="e.g. 22CSE0000"
                className={fieldClassName(errors.indexNumber)}
              />
            }
          />

          <div className="space-y-2">
            <Field
              label="Password"
              htmlFor="password"
              error={errors.password}
              input={
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  className={fieldClassName(errors.password)}
                />
              }
            />
            <div className="pt-1 text-right">
              <Link
                href="/forgot-password"
                prefetch={false}
                className="text-sm text-slate-400 transition hover:text-indigo-300"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:translate-y-0 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={1.8} />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between gap-4 text-sm">
          <Link
            href="/"
            className="text-slate-500 transition hover:text-indigo-300"
          >
            {"<-"} Homepage
          </Link>
          <Link
            href="/student-signup"
            prefetch={false}
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            Create an Account
          </Link>
        </div>
      </div>

      {toast ? (
        <div className="fixed right-6 top-20 z-40">
          <div
            className={`rounded-2xl px-5 py-4 text-sm font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
              toast.type === "success" ? "bg-emerald-500/90" : toast.type === "error" ? "bg-red-500/90" : "bg-blue-500/90"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Field({
  label,
  htmlFor,
  input,
  error,
}: {
  label: string;
  htmlFor: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      {input}
      <p className="min-h-5 text-xs text-red-400">{error ?? ""}</p>
    </div>
  );
}

function fieldClassName(error?: string) {
  return `${inputClassName} ${
    error
      ? "border-red-400/70 focus:border-red-400 focus:ring-red-500/15"
      : ""
  }`;
}
