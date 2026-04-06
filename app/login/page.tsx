import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { BackgroundParticles } from "../ui/background-particles";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login | Industrial Training Portal",
  description: "Secure coordinator access for the industrial training portal.",
};

export default function LoginPage() {
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

        <LoginForm />

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
