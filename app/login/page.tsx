import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { BackgroundParticles } from "../ui/background-particles";
import { getAllAdmins } from "../action/admin";

export const metadata: Metadata = {
  title: "Admin Login | Industrial Training Portal",
  description: "Secure coordinator access for the industrial training portal.",
};

export default async function LoginPage() {

  const data = await getAllAdmins();

  console.log(data)
  return (
    <main className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#0a0e1a] px-6 py-8 text-slate-50">
      <BackgroundParticles />

      <div className="home-rise relative z-10 w-full max-w-[26rem] rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-6 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-10 sm:py-12">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200 shadow-lg shadow-indigo-950/40">
            <LockKeyhole className="h-9 w-9" strokeWidth={1.8} />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Admin Access
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Secure coordinator portal
          </p>
        </div>

        <form className="mt-8 space-y-5" noValidate>
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
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
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 transition hover:text-indigo-300"
          >
            {"<-"} Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
