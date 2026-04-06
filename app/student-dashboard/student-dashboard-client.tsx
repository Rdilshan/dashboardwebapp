"use client";

import {
  CheckCircle2,
  FileText,
  GraduationCap,
  Link2,
  LoaderCircle,
  PlayCircle,
  Upload,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BackgroundParticles } from "../ui/background-particles";
import { StudentLogoutButton } from "../ui/student-logout-button";

type Toast = {
  message: string;
  type: "success" | "error" | "info";
};

type StudentProfile = {
  fullName: string;
  indexNumber: string;
};

type DocumentItem = {
  reportTypeId: number;
  reportName: string;
  isUploaded: boolean;
  fileName: string | null;
  videoLink: string | null;
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

const initialProfile: StudentProfile = {
  fullName: "Ayesha Fernando",
  indexNumber: "22CSE0001",
};

const initialDocuments: DocumentItem[] = [
  { reportTypeId: 1, reportName: "Form A", isUploaded: true, fileName: "22CSE0001-form-a.pdf", videoLink: null },
  { reportTypeId: 2, reportName: "Form B", isUploaded: true, fileName: "22CSE0001-form-b.pdf", videoLink: null },
  { reportTypeId: 3, reportName: "Form C1", isUploaded: true, fileName: "22CSE0001-form-c1.pdf", videoLink: null },
  { reportTypeId: 4, reportName: "Form C2", isUploaded: false, fileName: null, videoLink: null },
  { reportTypeId: 5, reportName: "Form C3", isUploaded: false, fileName: null, videoLink: null },
  { reportTypeId: 6, reportName: "Form C4", isUploaded: false, fileName: null, videoLink: null },
  { reportTypeId: 7, reportName: "Form D", isUploaded: true, fileName: "22CSE0001-form-d.pdf", videoLink: null },
  { reportTypeId: 8, reportName: "Form E", isUploaded: true, fileName: "22CSE0001-form-e.pdf", videoLink: null },
  { reportTypeId: 9, reportName: "Weekly Journal", isUploaded: true, fileName: "22CSE0001-weekly-journal.pdf", videoLink: null },
  { reportTypeId: 10, reportName: "Final Presentation", isUploaded: false, fileName: null, videoLink: null },
  { reportTypeId: 11, reportName: "Final Report", isUploaded: false, fileName: null, videoLink: null },
];

export function StudentDashboardClient() {
  const toastTimeoutRef = useRef<number | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [videoDrafts, setVideoDrafts] = useState<Record<number, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<number, File | null>>({});
  const [fileInputKeys, setFileInputKeys] = useState<Record<number, number>>({});
  const [pendingAction, setPendingAction] = useState<{ id: number; kind: "file" | "video" } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProfile(initialProfile);
      setDocuments(initialDocuments);
      setVideoDrafts(
        initialDocuments.reduce(
          (drafts, document) => ({ ...drafts, [document.reportTypeId]: document.videoLink ?? "" }),
          {} as Record<number, string>,
        ),
      );
      setIsLoading(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  function showToast(message: string, type: Toast["type"]) {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 4000);
  }

  async function handleFileUpload(reportTypeId: number) {
    const selectedFile = selectedFiles[reportTypeId];
    const extension = selectedFile?.name.split(".").pop()?.toLowerCase();

    if (!selectedFile) {
      showToast("Please select a file first.", "error");
      return;
    }

    if (!extension || !["pdf", "doc", "docx"].includes(extension)) {
      showToast("Only .pdf, .doc, and .docx files are allowed.", "error");
      return;
    }

    setPendingAction({ id: reportTypeId, kind: "file" });

    await new Promise((resolve) => window.setTimeout(resolve, 700));

    setDocuments((current) =>
      current.map((document) =>
        document.reportTypeId === reportTypeId
          ? { ...document, isUploaded: true, fileName: selectedFile.name, videoLink: null }
          : document,
      ),
    );
    setSelectedFiles((current) => ({ ...current, [reportTypeId]: null }));
    setFileInputKeys((current) => ({
      ...current,
      [reportTypeId]: (current[reportTypeId] ?? 0) + 1,
    }));
    setPendingAction(null);
    showToast("Document uploaded successfully.", "success");
  }

  async function handleVideoSubmit(reportTypeId: number) {
    const videoLink = (videoDrafts[reportTypeId] ?? "").trim();

    if (!videoLink) {
      showToast("Please enter a video link.", "error");
      return;
    }

    try {
      new URL(videoLink);
    } catch {
      showToast("Please enter a valid URL.", "error");
      return;
    }

    setPendingAction({ id: reportTypeId, kind: "video" });

    await new Promise((resolve) => window.setTimeout(resolve, 700));

    setDocuments((current) =>
      current.map((document) =>
        document.reportTypeId === reportTypeId
          ? { ...document, isUploaded: true, fileName: null, videoLink }
          : document,
      ),
    );
    setPendingAction(null);
    showToast("Video link submitted successfully.", "success");
  }

  const uploadedCount = documents.filter((document) => document.isUploaded).length;
  const progress = documents.length ? Math.round((uploadedCount / documents.length) * 100) : 0;

  return (
    <main className="relative isolate flex min-h-screen flex-1 flex-col overflow-hidden bg-[#0a0e1a] text-slate-50">
      <BackgroundParticles />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[92rem] flex-col px-6 pb-12 pt-8 lg:px-8">
        <header className="home-rise flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-white">
              Student Portal
            </h1>
            <p className="mt-2 text-base text-slate-400">
              Track each required report and upload missing documents directly from your dashboard.
            </p>
          </div>
          <StudentLogoutButton className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-indigo-400/45 hover:text-indigo-200 sm:self-auto" />
        </header>

        <section className="home-rise mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200 shadow-lg shadow-indigo-950/40">
                <GraduationCap className="h-8 w-8" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {profile?.fullName ?? "Loading..."}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Index: {profile?.indexNumber ?? "---"}
                </p>
              </div>
            </div>

            <div className="min-w-[18rem]">
              <div className="flex items-center justify-between text-sm font-medium text-slate-300">
                <span>Document Submission Progress</span>
                <span className="text-indigo-300">
                  {uploadedCount}/{documents.length || 11} Completed
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="home-rise mt-8">
          {isLoading ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-6 py-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-indigo-300" strokeWidth={1.8} />
              <p className="mt-4 text-base text-slate-300">Fetching document status...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {documents.map((document) => {
                const isVideo = document.reportName.toLowerCase().includes("presentation");
                const isPending = pendingAction?.id === document.reportTypeId;

                return (
                  <article
                    key={document.reportTypeId}
                    className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:-translate-y-1.5 hover:border-indigo-400/35"
                  >
                    <div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          document.isUploaded ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"
                        }`}
                      >
                        {document.isUploaded ? (
                          <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />
                        ) : (
                          <XCircle className="h-4 w-4" strokeWidth={1.8} />
                        )}
                        {document.isUploaded ? "Uploaded" : "Missing"}
                      </span>

                      <h3 className="mt-4 text-xl font-bold text-white">{document.reportName}</h3>

                      {document.fileName ? (
                        <p className="mt-3 inline-flex max-w-full items-center gap-2 text-sm text-slate-400">
                          <FileText className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                          <span className="truncate">{document.fileName}</span>
                        </p>
                      ) : null}

                      {document.videoLink ? (
                        <a
                          href={document.videoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
                        >
                          <PlayCircle className="h-4 w-4" strokeWidth={1.8} />
                          Watch Video
                        </a>
                      ) : null}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      {isVideo ? (
                        <>
                          <input
                            type="url"
                            value={videoDrafts[document.reportTypeId] ?? ""}
                            onChange={(event) =>
                              setVideoDrafts((current) => ({
                                ...current,
                                [document.reportTypeId]: event.target.value,
                              }))
                            }
                            placeholder="Paste Google Drive or YouTube URL"
                            className={inputClassName}
                          />
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleVideoSubmit(document.reportTypeId)}
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
                          >
                            {isPending && pendingAction?.kind === "video" ? (
                              <>
                                <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Link2 className="h-4 w-4" strokeWidth={1.8} />
                                {document.isUploaded ? "Update Link" : "Submit Link"}
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            key={fileInputKeys[document.reportTypeId] ?? 0}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className={`${inputClassName} cursor-pointer border-dashed file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-500/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-200`}
                            onChange={(event) =>
                              setSelectedFiles((current) => ({
                                ...current,
                                [document.reportTypeId]: event.target.files?.[0] ?? null,
                              }))
                            }
                          />
                          <p className="mt-2 min-h-5 text-xs text-slate-500">
                            {selectedFiles[document.reportTypeId]?.name
                              ? `Selected: ${selectedFiles[document.reportTypeId]?.name}`
                              : document.fileName
                                ? `Current: ${document.fileName}`
                                : "Accepted formats: .pdf, .doc, .docx"}
                          </p>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleFileUpload(document.reportTypeId)}
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
                          >
                            {isPending && pendingAction?.kind === "file" ? (
                              <>
                                <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4" strokeWidth={1.8} />
                                {document.isUploaded ? "Replace File" : "Upload File"}
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {toast ? (
        <div className="fixed right-6 top-20 z-40">
          <div
            className={`rounded-2xl px-5 py-4 text-sm font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
              toast.type === "success" ? "bg-emerald-500/90" : toast.type === "error" ? "bg-red-500/90" : "bg-blue-500/90"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
    </main>
  );
}
