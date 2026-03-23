"use client";

import { BarChart3, Home, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";

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

const hubCardClassName =
  "group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-400/45 hover:shadow-[0_0_24px_rgba(99,102,241,0.22)]";

export function AdminHubClient() {
  return (
    <main className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#0a0e1a] px-6 py-10 text-slate-50">
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

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
        <div className="home-rise text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-200">
            <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
            Authenticated Admin
          </div>
          <h1 className="text-4xl font-black tracking-[-0.04em] text-balance sm:text-5xl">
            Coordinator{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Hub
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Select a dashboard to manage your industrial training programme.
          </p>
        </div>

        <div
          className="home-rise mt-12 grid w-full max-w-4xl gap-6 md:grid-cols-2"
          style={{ animationDelay: "0.18s" }}
        >
          <Link href="/dashboard" className={hubCardClassName}>
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200">
              <LayoutDashboard className="h-9 w-9" strokeWidth={1.8} />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-white transition group-hover:text-indigo-200">
              CV Submission Dashboard
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              View, filter, edit, and bulk-download all student CV applications.
            </p>
          </Link>

          <Link href="/admin-matrix" className={hubCardClassName}>
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200">
              <BarChart3 className="h-9 w-9" strokeWidth={1.8} />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-white transition group-hover:text-indigo-200">
              Form Submission Matrix
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Track document uploads across all students with a comprehensive
              status grid and CSV export.
            </p>
          </Link>
        </div>

        <div
          className="home-rise mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/45 hover:text-indigo-200"
          >
            <Home className="h-4 w-4" strokeWidth={1.8} />
            Homepage
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/45 hover:text-indigo-200"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
            Logout
          </Link>
        </div>
      </div>

    </main>
  );
}
