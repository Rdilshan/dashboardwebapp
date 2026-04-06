"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { adminLoginFormAction } from "../action/auth";
import type { LoginActionState } from "../action/auth";

const initialLoginActionState: LoginActionState = {
  success: false,
  error: null,
  redirectTo: null,
  username: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Signing In..." : "Sign In"}
    </button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(
    adminLoginFormAction,
    initialLoginActionState,
  );

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [router, state.redirectTo, state.success]);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-slate-300">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          defaultValue={state.username}
          required
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15"
        />
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
  );
}
