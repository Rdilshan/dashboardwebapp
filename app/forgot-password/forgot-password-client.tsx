"use client";

import { KeyRound, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { BackgroundParticles } from "../ui/background-particles";

type Toast = {
  message: string;
  type: "success" | "error" | "info";
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

export function ForgotPasswordClient() {
  const toastTimeoutRef = useRef<number | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
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
    }, 5000);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      showToast("Please enter your student email.", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      showToast("Email format is invalid.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      showToast("Recovery email sent successfully.", "success");
      setEmail("");
    } catch {
      showToast("Failed to send recovery email.", "error");
    } finally {
      window.setTimeout(() => {
        setIsSubmitting(false);
      }, 200);
    }
  }

  return (
    <main className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#0a0e1a] px-6 py-8 text-slate-50">
      <BackgroundParticles />

      <div className="home-rise relative z-10 w-full max-w-[26rem] rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-6 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-10 sm:py-12">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200 shadow-lg shadow-indigo-950/40">
            <KeyRound className="h-9 w-9" strokeWidth={1.8} />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your student email to receive a recovery link.
          </p>
        </div>

        <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">
              Student Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="e.g. jane@student.uni.edu"
              className={`${inputClassName} ${
                error
                  ? "border-red-400/70 focus:border-red-400 focus:ring-red-500/15"
                  : ""
              }`}
            />
            <p className="min-h-5 text-xs text-red-400">{error}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:translate-y-0 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={1.8} />
                Sending...
              </>
            ) : (
              "Send Recovery Email"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/student-login"
            className="text-sm text-slate-500 transition hover:text-indigo-300"
          >
            {"<-"} Back to Login
          </Link>
        </div>
      </div>

      {toast ? (
        <div className="fixed right-6 top-20 z-40">
          <div
            className={`rounded-2xl px-5 py-4 text-sm font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-emerald-500/90"
                : toast.type === "error"
                  ? "bg-red-500/90"
                  : "bg-blue-500/90"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
    </main>
  );
}
