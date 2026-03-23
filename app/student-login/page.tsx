import type { Metadata } from "next";
import { MonitorCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Student Login | Industrial Training Portal",
  description: "Student access portal for tracking industrial training progress.",
};

const particles = [
  {
    className: "left-[-5%] top-[-10%] h-[25rem] w-[25rem] bg-indigo-500/10",
    delay: "0s",
  },
  {
    className: "right-[-8%] top-[50%] h-[19rem] w-[19rem] bg-violet-500/10",
    delay: "-5s",
  },
  {
    className: "bottom-[-5%] left-[30%] h-[16rem] w-[16rem] bg-indigo-400/10",
    delay: "-10s",
  },
  {
    className: "left-[60%] top-[20%] h-[13rem] w-[13rem] bg-fuchsia-500/8",
    delay: "-3s",
  },
  {
    className: "bottom-[20%] right-[20%] h-[22rem] w-[22rem] bg-violet-400/8",
    delay: "-7s",
  },
  {
    className: "left-[10%] top-[70%] h-[11rem] w-[11rem] bg-indigo-300/10",
    delay: "-12s",
  },
] as const;

export default function StudentLoginPage() {
  return (
    <main className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#0a0e1a] px-6 py-8 text-slate-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.16),_transparent_28%),linear-gradient(180deg,_rgba(10,14,26,0.96)_0%,_rgba(10,14,26,1)_100%)]" />
        {particles.map((particle) => (
          <span
            key={particle.className}
            className={`home-float absolute rounded-full blur-3xl ${particle.className}`}
            style={{ animationDelay: particle.delay }}
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

        <form className="mt-8 space-y-5" noValidate>
          <div className="space-y-2">
            <label
              htmlFor="index_number"
              className="text-sm font-medium text-slate-300"
            >
              Index Number
            </label>
            <input
              id="index_number"
              name="index_number"
              type="text"
              autoComplete="username"
              placeholder="e.g. 22CSE0000"
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-300"
            >
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
            type="button"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          >
            Sign In
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
    </main>
  );
}
