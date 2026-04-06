"use client";

import { LoaderCircle, MonitorCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { studentLoginFormAction } from "../action/auth";
import type { StudentLoginActionState } from "../action/auth";
import { BackgroundParticles } from "../ui/background-particles";

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

const initialStudentLoginActionState: StudentLoginActionState = {
  success: false,
  error: null,
  redirectTo: null,
  indexNumber: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:translate-y-0 disabled:opacity-70"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={1.8} />
          Signing In...
        </>
      ) : (
        "Sign In"
      )}
    </button>
  );
}

export function StudentLoginClient() {
  const router = useRouter();
  const [state, formAction] = useActionState(
    studentLoginFormAction,
    initialStudentLoginActionState,
  );

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [router, state.redirectTo, state.success]);

  return (
    <main className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#0a0e1a] px-6 py-8 text-slate-50">
      <BackgroundParticles />

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

        <form action={formAction} className="mt-8 space-y-5" noValidate>
          <Field
            label="Index Number"
            htmlFor="index_number"
            input={
              <input
                id="index_number"
                name="index_number"
                type="text"
                autoComplete="username"
                defaultValue={state.indexNumber}
                required
                placeholder="e.g. 22CSE0000"
                className={inputClassName}
              />
            }
          />

          <div className="space-y-2">
            <Field
              label="Password"
              htmlFor="password"
              input={
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={inputClassName}
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

          {state.error ? (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
            >
              {state.error}
            </p>
          ) : null}

          <SubmitButton />
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
    </main>
  );
}

function Field({
  label,
  htmlFor,
  input,
}: {
  label: string;
  htmlFor: string;
  input: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      {input}
    </div>
  );
}
