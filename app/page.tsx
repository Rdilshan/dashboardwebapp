import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Course Portal | Industrial Training",
  description: "Central hub for the industrial training course module.",
};

const overviewCards = [
  {
    title: "Objectives",
    description:
      "Gain practical industry experience, apply theoretical knowledge to real-world problems, and build professional networks.",
    icon: <TargetIcon />,
  },
  {
    title: "Prerequisites",
    description:
      "Complete all Year 2 core modules, maintain a cumulative GPA of 2.0 or higher, and secure departmental approval.",
    icon: <CheckBadgeIcon />,
  },
  {
    title: "Key Dates",
    icon: <CalendarIcon />,
    dates: [
      ["CV Submission", "Oct 15 - Oct 30"],
      ["Interviews", "November"],
      ["Placement Start", "January 1"],
    ],
  },
] as const;

const portalCards = [
  {
    title: "Apply for Internship",
    description:
      "Submit your student details and upload your CV to the placement database.",
    href: "/submit-cv",
    icon: <DocumentIcon />,
  },
  {
    title: "Student Login",
    description:
      "Sign in to track weekly progress and submit monthly industry reports.",
    href: "/student-login",
    icon: <MonitorUserIcon />,
  },
  {
    title: "Coordinator Portal",
    description:
      "Secure admin access to manage submissions and review student document progress.",
    href: "/login",
    icon: <ShieldIcon />,
  },
] as const;

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

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen flex-1 flex-col overflow-hidden bg-[#0a0e1a] font-sans text-slate-50">
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
                <CapIcon />
              </span>
              <span>
                Course<span className="text-indigo-400">Module</span>
              </span>
            </Link>

            <Link
              href="/login"
              prefetch={false}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/50 hover:text-indigo-200"
            >
              Coordinator DB
            </Link>
          </div>
        </header>

        <section className="px-6 pb-20 pt-24 sm:pb-24 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="home-rise mx-auto flex max-w-4xl flex-col items-center text-center">
              <span className="mb-6 inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-1.5 text-sm font-semibold text-indigo-200">
                Academic Year 2026/2027
              </span>
              <h1 className="max-w-4xl text-5xl font-black tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
                Industrial Training
                <br />
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Program Portal
                </span>
              </h1>
              <p
                className="home-rise mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl"
                style={{ animationDelay: "0.2s" }}
              >
                Welcome to the central hub for your industrial training module.
                Access course guidelines, submit your CV for placement, or log
                in to the dedicated portals below.
              </p>
              <div
                className="home-rise mt-10 flex flex-wrap items-center justify-center gap-4"
                style={{ animationDelay: "0.4s" }}
              >
                <a
                  href="#portals"
                  className="inline-flex min-w-44 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(99,102,241,0.42)]"
                >
                  Access Portals
                </a>
                <a
                  href="#overview"
                  className="inline-flex min-w-44 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-base font-semibold text-slate-200 transition hover:border-indigo-400/40 hover:bg-white/[0.05]"
                >
                  View Objectives
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="overview"
          className="scroll-mt-24 px-6 py-20 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Module <span className="text-indigo-400">Overview</span>
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Key information regarding your 6-month industrial placement.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {overviewCards.map((card) => (
                <article
                  key={card.title}
                  className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-400/40"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-indigo-200">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{card.title}</h3>

                  {"description" in card ? (
                    <p className="mt-4 text-base leading-7 text-slate-300">
                      {card.description}
                    </p>
                  ) : (
                    <ul className="mt-5 space-y-4 text-sm text-slate-300 sm:text-base">
                      {card.dates.map(([label, value]) => (
                        <li
                          key={label}
                          className="flex flex-col gap-1 border-b border-white/6 pb-4 last:border-b-0 last:pb-0"
                        >
                          <span className="font-medium text-slate-400">
                            {label}
                          </span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="portals"
          className="scroll-mt-24 px-6 pb-24 pt-8 sm:pb-28 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Access{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Portals
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Select your destination to proceed.
              </p>
            </div>

            <div className="mx-auto mt-14 flex max-w-4xl flex-col gap-5">
              {portalCards.map((portal) => (
                <Link
                  key={portal.title}
                  href={portal.href}
                  prefetch={false}
                  className="group flex flex-col gap-6 rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-8 py-7 shadow-2xl shadow-black/25 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-violet-400/45 hover:bg-white/[0.06] sm:flex-row sm:items-center sm:gap-8"
                >
                  <span className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200">
                    {portal.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-2xl font-bold text-white transition group-hover:text-indigo-200">
                      {portal.title}
                    </span>
                    <span className="mt-2 block text-base leading-7 text-slate-300">
                      {portal.description}
                    </span>
                  </span>
                  <span className="hidden text-3xl text-slate-500 transition group-hover:translate-x-2 group-hover:text-indigo-300 sm:inline-block">
                    -&gt;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-auto border-t border-white/10 bg-[#09111e]/90 px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-indigo-200 shadow-lg shadow-indigo-950/40">
                    <CapIcon />
                  </span>
                  <span>
                    Course<span className="text-indigo-400">Module</span>
                  </span>
                </div>
                <p className="mt-5 max-w-sm text-base leading-7 text-slate-400">
                  Empowering students through practical industry experience and
                  connecting academic learning with the profession.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                <ul className="mt-5 space-y-3 text-slate-400">
                  <li>
                    <Link
                      href="/submit-cv"
                      prefetch={false}
                      className="transition hover:text-indigo-300"
                    >
                      Submit CV
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/student-login"
                      prefetch={false}
                      className="transition hover:text-indigo-300"
                    >
                      Student Login
                    </Link>
                  </li>
                  <li>
                    <a href="#overview" className="transition hover:text-indigo-300">
                      Module Syllabus
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Contact &amp; Support
                </h3>
                <p className="mt-5 text-base leading-7 text-slate-400">
                  For inquiries regarding placements:
                </p>
                <a
                  href="mailto:training@university.edu"
                  className="mt-3 inline-block text-base font-semibold text-indigo-300 transition hover:text-indigo-200"
                >
                  training@university.edu
                </a>
                <p className="mt-3 text-base leading-7 text-slate-400">
                  Office: Room 402, IT Building
                </p>
              </div>
            </div>

            <div className="mt-12 border-t border-white/6 pt-8 text-center text-sm text-slate-500">
              <p>Copyright 2026 Faculty of Computing. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function CapIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
      <path d="M7 11.5v4.25C7 17.55 9.24 19 12 19s5-1.45 5-3.25V11.5" />
      <path d="M21 10v5" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v6c0 5 3.5 7.5 7 9 3.5-1.5 7-4 7-9V6l-7-3Z" />
      <path d="m9.5 12 1.75 1.75L15 10" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
      <path d="M8 14h3" />
      <path d="M13 14h3" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

function MonitorUserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
      <circle cx="12" cy="10" r="2.2" />
      <path d="M8.75 14a3.8 3.8 0 0 1 6.5 0" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v6c0 5 3.5 7.5 7 9 3.5-1.5 7-4 7-9V6l-7-3Z" />
      <path d="M12 8v8" />
      <path d="M9 11.5h6" />
    </svg>
  );
}
