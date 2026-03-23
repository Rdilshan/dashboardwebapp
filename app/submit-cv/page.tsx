import type { Metadata } from "next";
import { FileText } from "lucide-react";
import Link from "next/link";
import { SubmitCvForm } from "./submit-cv-form";

export const metadata: Metadata = {
  title: "Submit Your CV | Industrial Training Portal",
  description:
    "Submit your CV and details for industrial training internship placements.",
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

export default function SubmitCvPage() {
  return (
    <main className="relative isolate flex min-h-screen flex-1 flex-col overflow-hidden bg-[#0a0e1a] text-slate-50">
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

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-indigo-200 shadow-lg shadow-indigo-950/40">
                <FileText className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <span>
                CV<span className="text-indigo-400">Portal</span>
              </span>
            </Link>

            <div className="text-sm text-slate-500">Placement Submission</div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-12 pt-10 lg:px-8">
          <section className="mx-auto max-w-3xl text-center">
            <h1 className="home-rise text-5xl font-black tracking-[-0.04em] text-balance sm:text-6xl">
              Industrial Training
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                CV Submission
              </span>
            </h1>
            <p
              className="home-rise mt-5 text-lg leading-8 text-slate-300"
              style={{ animationDelay: "0.15s" }}
            >
              Fill out the form below to submit your CV for internship
              placement. Your CV will be sorted based on your preferred job
              role.
            </p>
          </section>

          <div
            className="home-rise mt-10"
            style={{ animationDelay: "0.3s" }}
          >
            <SubmitCvForm />
          </div>
        </div>

        <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500 lg:px-8">
          <p>Copyright 2026 Industrial Training Portal. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
