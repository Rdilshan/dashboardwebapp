"use client";

import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  LogOut,
  PlayCircle,
  Search,
  Shield,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

type Toast = {
  message: string;
  type: "success" | "error" | "info";
};

type DocumentStatus = {
  isUploaded: boolean;
  fileName: string | null;
  videoLink: string | null;
};

const reportTypes = [
  "Form A",
  "Form B",
  "Form C1",
  "Form C2",
  "Form C3",
  "Form C4",
  "Form D",
  "Form E",
  "Weekly Journal",
  "Final Presentation",
  "Final Report",
] as const;

type ReportType = (typeof reportTypes)[number];

type MatrixRow = {
  studentId: number;
  indexNumber: string;
  fullName: string;
  documents: Record<ReportType, DocumentStatus>;
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

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

const navButtonClassName =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/45 hover:text-indigo-200";

const uploadedFile = (fileName: string): DocumentStatus => ({
  isUploaded: true,
  fileName,
  videoLink: null,
});

const uploadedVideo = (videoLink: string): DocumentStatus => ({
  isUploaded: true,
  fileName: null,
  videoLink,
});

const missingDocument: DocumentStatus = {
  isUploaded: false,
  fileName: null,
  videoLink: null,
};

function buildDocuments(
  overrides: Partial<Record<ReportType, DocumentStatus>>,
): Record<ReportType, DocumentStatus> {
  return reportTypes.reduce(
    (documents, reportType) => {
      documents[reportType] = overrides[reportType] ?? missingDocument;
      return documents;
    },
    {} as Record<ReportType, DocumentStatus>,
  );
}

const matrixRows: MatrixRow[] = [
  {
    studentId: 1,
    indexNumber: "22CSE0001",
    fullName: "Ayesha Fernando",
    documents: buildDocuments({
      "Form A": uploadedFile("22CSE0001-form-a.pdf"),
      "Form B": uploadedFile("22CSE0001-form-b.pdf"),
      "Form C1": uploadedFile("22CSE0001-form-c1.pdf"),
      "Form C2": uploadedFile("22CSE0001-form-c2.pdf"),
      "Form D": uploadedFile("22CSE0001-form-d.pdf"),
      "Form E": uploadedFile("22CSE0001-form-e.pdf"),
      "Weekly Journal": uploadedFile("22CSE0001-weekly-journal.pdf"),
      "Final Presentation": uploadedVideo("https://youtu.be/ayesha-demo"),
      "Final Report": uploadedFile("22CSE0001-final-report.pdf"),
    }),
  },
  {
    studentId: 2,
    indexNumber: "22CSE0007",
    fullName: "Kavindu Perera",
    documents: buildDocuments({
      "Form A": uploadedFile("22CSE0007-form-a.pdf"),
      "Form B": uploadedFile("22CSE0007-form-b.pdf"),
      "Form C2": uploadedFile("22CSE0007-form-c2.pdf"),
      "Form D": uploadedFile("22CSE0007-form-d.pdf"),
      "Weekly Journal": uploadedFile("22CSE0007-weekly-journal.pdf"),
      "Final Presentation": uploadedVideo("https://drive.google.com/file/d/kavindu-presentation"),
      "Final Report": uploadedFile("22CSE0007-final-report.pdf"),
    }),
  },
  {
    studentId: 3,
    indexNumber: "22CSE0012",
    fullName: "Nethmi Jayasuriya",
    documents: buildDocuments({
      "Form A": uploadedFile("22CSE0012-form-a.pdf"),
      "Form B": uploadedFile("22CSE0012-form-b.pdf"),
      "Form C1": uploadedFile("22CSE0012-form-c1.pdf"),
      "Form C2": uploadedFile("22CSE0012-form-c2.pdf"),
      "Form C3": uploadedFile("22CSE0012-form-c3.pdf"),
      "Form C4": uploadedFile("22CSE0012-form-c4.pdf"),
      "Form D": uploadedFile("22CSE0012-form-d.pdf"),
      "Form E": uploadedFile("22CSE0012-form-e.pdf"),
      "Weekly Journal": uploadedFile("22CSE0012-weekly-journal.pdf"),
    }),
  },
  {
    studentId: 4,
    indexNumber: "22CSE0020",
    fullName: "Dineth Silva",
    documents: buildDocuments({
      "Form A": uploadedFile("22CSE0020-form-a.pdf"),
      "Form B": uploadedFile("22CSE0020-form-b.pdf"),
      "Form C1": uploadedFile("22CSE0020-form-c1.pdf"),
      "Form C2": uploadedFile("22CSE0020-form-c2.pdf"),
      "Form C3": uploadedFile("22CSE0020-form-c3.pdf"),
      "Weekly Journal": uploadedFile("22CSE0020-weekly-journal.pdf"),
      "Final Presentation": uploadedVideo("https://youtu.be/dineth-ui-showcase"),
    }),
  },
  {
    studentId: 5,
    indexNumber: "22CSE0025",
    fullName: "Isuru Wickramasinghe",
    documents: buildDocuments({
      "Form A": uploadedFile("22CSE0025-form-a.pdf"),
      "Form B": uploadedFile("22CSE0025-form-b.pdf"),
      "Form C1": uploadedFile("22CSE0025-form-c1.pdf"),
      "Form D": uploadedFile("22CSE0025-form-d.pdf"),
      "Form E": uploadedFile("22CSE0025-form-e.pdf"),
      "Weekly Journal": uploadedFile("22CSE0025-weekly-journal.pdf"),
      "Final Report": uploadedFile("22CSE0025-final-report.pdf"),
    }),
  },
  {
    studentId: 6,
    indexNumber: "22CSE0032",
    fullName: "Pasindu Hettiarachchi",
    documents: buildDocuments({
      "Form A": uploadedFile("22CSE0032-form-a.pdf"),
      "Form B": uploadedFile("22CSE0032-form-b.pdf"),
      "Form C1": uploadedFile("22CSE0032-form-c1.pdf"),
      "Form C2": uploadedFile("22CSE0032-form-c2.pdf"),
      "Form C3": uploadedFile("22CSE0032-form-c3.pdf"),
      "Form C4": uploadedFile("22CSE0032-form-c4.pdf"),
      "Form D": uploadedFile("22CSE0032-form-d.pdf"),
      "Form E": uploadedFile("22CSE0032-form-e.pdf"),
      "Weekly Journal": uploadedFile("22CSE0032-weekly-journal.pdf"),
      "Final Presentation": uploadedVideo("https://youtu.be/pasindu-data-demo"),
      "Final Report": uploadedFile("22CSE0032-final-report.pdf"),
    }),
  },
  {
    studentId: 7,
    indexNumber: "22CSE0039",
    fullName: "Senuri De Alwis",
    documents: buildDocuments({
      "Form A": uploadedFile("22CSE0039-form-a.pdf"),
      "Form B": uploadedFile("22CSE0039-form-b.pdf"),
      "Form D": uploadedFile("22CSE0039-form-d.pdf"),
      "Weekly Journal": uploadedFile("22CSE0039-weekly-journal.pdf"),
    }),
  },
];

export function AdminMatrixClient() {
  const toastTimeoutRef = useRef<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const filteredRows = matrixRows.filter((row) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      row.fullName.toLowerCase().includes(query) ||
      row.indexNumber.toLowerCase().includes(query)
    );
  });

  const uploadedCount = matrixRows.reduce((count, row) => {
    return (
      count +
      reportTypes.filter((reportType) => row.documents[reportType].isUploaded)
        .length
    );
  }, 0);

  function showToast(message: string, type: Toast["type"] = "info") {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 4000);
  }

  function handleExportCsv() {
    const header = ["Index Number", "Full Name", ...reportTypes];
    const rows = matrixRows.map((row) => [
      row.indexNumber,
      row.fullName,
      ...reportTypes.map((reportType) => {
        const document = row.documents[reportType];

        if (!document.isUploaded) {
          return "Missing";
        }

        if (document.videoLink) {
          return `Video: ${document.videoLink}`;
        }

        return "Uploaded";
      }),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student_submissions_matrix.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("CSV export generated successfully.", "success");
  }

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
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
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

            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                <Shield className="h-3.5 w-3.5" strokeWidth={2} />
                Admin
              </span>
              <Link href="/admin-hub" className={navButtonClassName}>
                <BarChart3 className="h-4 w-4" strokeWidth={1.8} />
                Hub
              </Link>
              <Link href="/login" className={navButtonClassName}>
                <LogOut className="h-4 w-4" strokeWidth={1.8} />
                Logout
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[96rem] flex-1 flex-col px-6 pb-12 pt-8 lg:px-8">
          <section className="home-rise flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-200">
                <BarChart3 className="h-4 w-4" strokeWidth={1.8} />
                Admin Matrix
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white">
                Submission Matrix
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                Comprehensive tracking of all student documents across the
                industrial training workflow.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[22rem] xl:items-end">
              <div className="flex w-full flex-col gap-3 md:flex-row xl:justify-end">
                <div className="relative min-w-0 flex-1 md:min-w-[18rem]">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">
                    <Search className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by name or index..."
                    className={`${inputClassName} pl-10`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                >
                  <Download className="h-4 w-4" strokeWidth={1.8} />
                  Export CSV
                </button>
                <Link
                  href="/admin-hub"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-indigo-400/45 hover:text-indigo-200"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
                  Back to Hub
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  {matrixRows.length} Students
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  {reportTypes.length} Report Types
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  {uploadedCount} Uploaded Items
                </span>
              </div>
            </div>
          </section>

          <section className="home-rise mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="min-w-[78rem] w-full border-collapse text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-400">
                    <th className="sticky top-0 bg-[#121a2b]/95 px-4 py-4 font-semibold backdrop-blur">
                      Index Number
                    </th>
                    <th className="sticky top-0 bg-[#121a2b]/95 px-4 py-4 font-semibold backdrop-blur">
                      Student Name
                    </th>
                    {reportTypes.map((reportType) => (
                      <th
                        key={reportType}
                        className="sticky top-0 bg-[#121a2b]/95 px-4 py-4 font-semibold whitespace-nowrap backdrop-blur"
                      >
                        {reportType}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={reportTypes.length + 2}
                        className="px-4 py-16 text-center text-base text-slate-500"
                      >
                        No students found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr
                        key={row.studentId}
                        className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                      >
                        <td className="px-4 py-4 font-semibold text-indigo-300">
                          {row.indexNumber}
                        </td>
                        <td className="px-4 py-4 font-medium text-white">
                          {row.fullName}
                        </td>
                        {reportTypes.map((reportType) => {
                          const document = row.documents[reportType];

                          return (
                            <td
                              key={`${row.studentId}-${reportType}`}
                              className="px-4 py-4 text-center"
                            >
                              {document.isUploaded ? (
                                document.videoLink ? (
                                  <a
                                    href={document.videoLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/45 hover:text-emerald-200"
                                    title="Watch video"
                                  >
                                    <PlayCircle
                                      className="h-4 w-4"
                                      strokeWidth={1.8}
                                    />
                                    Video
                                  </a>
                                ) : (
                                  <span
                                    className="inline-flex items-center justify-center text-emerald-400"
                                    title={document.fileName ?? "Uploaded"}
                                  >
                                    <CheckCircle2
                                      className="h-5 w-5"
                                      strokeWidth={1.8}
                                    />
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center justify-center text-red-400/50">
                                  <XCircle
                                    className="h-5 w-5"
                                    strokeWidth={1.8}
                                  />
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500 lg:px-8">
          <p>Copyright 2026 Industrial Training Portal. All rights reserved.</p>
        </footer>
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

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
