import type { Metadata } from "next";
import { FileText } from "lucide-react";
import Link from "next/link";
import { BackgroundParticles } from "../ui/background-particles";
import { SubmitCvForm } from "./submit-cv-form";

export const metadata: Metadata = {
  title: "Submit Your CV | Industrial Training Portal",
  description:
    "Submit your CV and details for industrial training internship placements.",
};

export default function SubmitCvPage() {
  return (
    <main className="relative isolate flex min-h-screen flex-1 flex-col overflow-hidden bg-[#0a0e1a] text-slate-50">
      <BackgroundParticles />

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
