"use client";

import { BarChart3, Home, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BackgroundParticles } from "../ui/background-particles";
import { AdminLogoutButton } from "../ui/admin-logout-button";

const hubCardClassName =
  "group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-400/45 hover:shadow-[0_0_24px_rgba(99,102,241,0.22)]";

export function AdminHubClient() {
  return (
    <main className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#0a0e1a] px-6 py-10 text-slate-50">
      <BackgroundParticles />

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
          <AdminLogoutButton
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/45 hover:text-indigo-200"
          />
        </div>
      </div>

    </main>
  );
}




