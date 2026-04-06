"use client";

import {
  CheckCircle2,
  FileText,
  GraduationCap,
  Link2,
  LoaderCircle,
  PlayCircle,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import type { FormEvent } from "react";
import { useRef, useState } from "react";
import {
  removeStudentDashboardFormAction,
  submitStudentDashboardFormAction,
  type StudentDashboardFormActionState,
} from "../action/student";
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
  fileUrl: string | null;
  videoLink: string | null;
};

type StudentDashboardClientProps = {
  initialProfile: StudentProfile;
  initialDocuments: DocumentItem[];
};

type PendingActionKind = "submit-file" | "submit-video" | "remove";

type DocumentCardProps = {
  actionState: StudentDashboardFormActionState;
  document: DocumentItem;
  fileInputKey: number;
  pendingActionKind: PendingActionKind | null;
  onFileChange: (reportTypeId: number, fileName: string) => void;
  onRemove: (document: DocumentItem) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>, document: DocumentItem) => void;
  onVideoDraftChange: (reportTypeId: number, value: string) => void;
  selectedFileName: string;
  videoDraft: string;
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

const fileInputClassName =
  "w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-500/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-200 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

const initialDocumentActionState: StudentDashboardFormActionState = {
  success: false,
  error: null,
  responseId: "",
  reportTypeId: null,
  submissionKind: null,
  submission: null,
};

function DocumentSubmitButton({
  kind,
  isUploaded,
  isPending,
}: {
  kind: "file" | "video";
  isUploaded: boolean;
  isPending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
    >
      {isPending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8} />
          {kind === "video" ? "Saving..." : "Uploading..."}
        </>
      ) : kind === "video" ? (
        <>
          <Link2 className="h-4 w-4" strokeWidth={1.8} />
          {isUploaded ? "Update Link" : "Submit Link"}
        </>
      ) : (
        <>
          <Upload className="h-4 w-4" strokeWidth={1.8} />
          {isUploaded ? "Replace File" : "Upload File"}
        </>
      )}
    </button>
  );
}

function DocumentRemoveButton({ isPending, onClick }: { isPending: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={onClick}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15 disabled:opacity-70"
    >
      {isPending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8} />
          Removing...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" strokeWidth={1.8} />
          Remove Submission
        </>
      )}
    </button>
  );
}

function fieldClassName(error?: string) {
  return `${inputClassName} ${
    error
      ? "border-red-400/70 focus:border-red-400 focus:ring-red-500/15"
      : ""
  }`;
}

function documentFileFieldClassName(error?: string) {
  return `${fileInputClassName} ${
    error
      ? "border-red-400/70 focus:border-red-400 focus:ring-red-500/15"
      : ""
  }`;
}

function DocumentCard({
  actionState,
  document,
  fileInputKey,
  pendingActionKind,
  onFileChange,
  onRemove,
  onSubmit,
  onVideoDraftChange,
  selectedFileName,
  videoDraft,
}: DocumentCardProps) {
  const isVideo = document.reportName.toLowerCase().includes("presentation");
  const cardFieldErrors =
    actionState.reportTypeId === document.reportTypeId
      ? actionState.fieldErrors
      : undefined;
  const cardError =
    actionState.reportTypeId === document.reportTypeId ? actionState.error : null;
  const isRemoving = pendingActionKind === "remove";
  const isSubmitting =
    pendingActionKind === "submit-file" || pendingActionKind === "submit-video";

  return (
    <article className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:-translate-y-1.5 hover:border-indigo-400/35">
      <div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            document.isUploaded
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-red-500/15 text-red-300"
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
          document.fileUrl ? (
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex max-w-full items-center gap-2 text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
            >
              <FileText className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span className="truncate">{document.fileName}</span>
            </a>
          ) : (
            <p className="mt-3 inline-flex max-w-full items-center gap-2 text-sm text-slate-400">
              <FileText className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span className="truncate">{document.fileName}</span>
            </p>
          )
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

      <form
        noValidate
        encType="multipart/form-data"
        onSubmit={(event) => onSubmit(event, document)}
        className="mt-6 border-t border-white/10 pt-5"
      >
        <input type="hidden" name="report_type_id" value={document.reportTypeId} />

        {document.isUploaded ? (
          <>
            <p className="text-sm text-slate-400">
              {isVideo
                ? "Your presentation link is already submitted. Remove it if you want to add a new one."
                : "Your file is already uploaded. Remove it if you want to upload a new one."}
            </p>
            {cardError ? (
              <p className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {cardError}
              </p>
            ) : null}
            <DocumentRemoveButton
              isPending={isRemoving}
              onClick={() => onRemove(document)}
            />
          </>
        ) : isVideo ? (
          <>
            <input
              type="url"
              name="video_link"
              value={videoDraft}
              onChange={(event) =>
                onVideoDraftChange(document.reportTypeId, event.target.value)
              }
              placeholder="Paste Google Drive or YouTube URL"
              className={fieldClassName(cardFieldErrors?.videoLink)}
            />
            <p className="mt-2 min-h-5 text-xs text-red-400">
              {cardFieldErrors?.videoLink ?? ""}
            </p>
            {cardError && !cardFieldErrors?.videoLink ? (
              <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {cardError}
              </p>
            ) : null}
            <DocumentSubmitButton
              kind="video"
              isUploaded={document.isUploaded}
              isPending={isSubmitting}
            />
          </>
        ) : (
          <>
            <input
              key={fileInputKey}
              name="document_file"
              type="file"
              accept=".pdf,.doc,.docx"
              className={documentFileFieldClassName(cardFieldErrors?.documentFile)}
              onChange={(event) =>
                onFileChange(
                  document.reportTypeId,
                  event.target.files?.[0]?.name ?? "",
                )
              }
            />
            <p className="mt-2 min-h-5 text-xs text-slate-500">
              {selectedFileName
                ? `Selected: ${selectedFileName}`
                : "Accepted formats: .pdf, .doc, .docx"}
            </p>
            <p className="min-h-5 text-xs text-red-400">
              {cardFieldErrors?.documentFile ?? ""}
            </p>
            {cardError && !cardFieldErrors?.documentFile ? (
              <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {cardError}
              </p>
            ) : null}
            <DocumentSubmitButton
              kind="file"
              isUploaded={document.isUploaded}
              isPending={isSubmitting}
            />
          </>
        )}
      </form>
    </article>
  );
}

export function StudentDashboardClient({
  initialProfile,
  initialDocuments,
}: StudentDashboardClientProps) {
  const toastTimeoutRef = useRef<number | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [videoDrafts, setVideoDrafts] = useState<Record<number, string>>(() =>
    initialDocuments.reduce(
      (drafts, document) => ({
        ...drafts,
        [document.reportTypeId]: document.videoLink ?? "",
      }),
      {} as Record<number, string>,
    ),
  );
  const [selectedFileNames, setSelectedFileNames] = useState<Record<number, string>>({});
  const [fileInputKeys, setFileInputKeys] = useState<Record<number, number>>({});
  const [pendingAction, setPendingAction] = useState<{
    id: number;
    kind: PendingActionKind;
  } | null>(null);
  const [actionState, setActionState] = useState<StudentDashboardFormActionState>(
    initialDocumentActionState,
  );
  const [toast, setToast] = useState<Toast | null>(null);

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

  async function handleDocumentSubmit(
    event: FormEvent<HTMLFormElement>,
    document: DocumentItem,
  ) {
    event.preventDefault();

    const pendingKind: PendingActionKind = document.reportName
      .toLowerCase()
      .includes("presentation")
      ? "submit-video"
      : "submit-file";

    setPendingAction({ id: document.reportTypeId, kind: pendingKind });

    try {
      const formData = new FormData(event.currentTarget);
      const result = await submitStudentDashboardFormAction(
        initialDocumentActionState,
        formData,
      );

      setActionState(result);

      if (result.success && result.submission) {
        const { reportTypeId, isUploaded, fileName, videoLink } = result.submission;

        setDocuments((current) =>
          current.map((currentDocument) =>
            currentDocument.reportTypeId === reportTypeId
              ? {
                  ...currentDocument,
                  isUploaded,
                  fileName,
                  fileUrl:
                    currentDocument.fileUrl && fileName === currentDocument.fileName
                      ? currentDocument.fileUrl
                      : currentDocument.fileUrl,
                  videoLink,
                }
              : currentDocument,
          ),
        );

        if (result.submissionKind === "video") {
          setVideoDrafts((current) => ({
            ...current,
            [reportTypeId]: videoLink ?? "",
          }));
          showToast("Presentation link saved successfully.", "success");
        } else {
          setSelectedFileNames((current) => ({
            ...current,
            [reportTypeId]: "",
          }));
          setFileInputKeys((current) => ({
            ...current,
            [reportTypeId]: (current[reportTypeId] ?? 0) + 1,
          }));
          showToast("Form uploaded successfully.", "success");
        }

        return;
      }

      if (result.error) {
        showToast(result.error, "error");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Submission failed. Please try again.";
      const failedState: StudentDashboardFormActionState = {
        success: false,
        error: message,
        responseId: `${Date.now()}`,
        reportTypeId: document.reportTypeId,
        submissionKind: pendingKind === "submit-video" ? "video" : "file",
        submission: null,
      };

      setActionState(failedState);
      showToast(message, "error");
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDocumentRemove(document: DocumentItem) {
    setPendingAction({ id: document.reportTypeId, kind: "remove" });

    try {
      const result = await removeStudentDashboardFormAction(document.reportTypeId);

      setActionState(result);

      if (result.success && result.submission) {
        const { reportTypeId, isUploaded, fileName, videoLink } = result.submission;

        setDocuments((current) =>
          current.map((currentDocument) =>
            currentDocument.reportTypeId === reportTypeId
              ? {
                  ...currentDocument,
                  isUploaded,
                  fileName,
                  fileUrl: null,
                  videoLink,
                }
              : currentDocument,
          ),
        );
        setSelectedFileNames((current) => ({
          ...current,
          [reportTypeId]: "",
        }));
        setVideoDrafts((current) => ({
          ...current,
          [reportTypeId]: "",
        }));
        setFileInputKeys((current) => ({
          ...current,
          [reportTypeId]: (current[reportTypeId] ?? 0) + 1,
        }));
        showToast("Submission removed successfully.", "success");
        return;
      }

      if (result.error) {
        showToast(result.error, "error");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Remove failed. Please try again.";
      const failedState: StudentDashboardFormActionState = {
        success: false,
        error: message,
        responseId: `${Date.now()}`,
        reportTypeId: document.reportTypeId,
        submissionKind: document.reportName.toLowerCase().includes("presentation")
          ? "video"
          : "file",
        submission: null,
      };

      setActionState(failedState);
      showToast(message, "error");
    } finally {
      setPendingAction(null);
    }
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
                  {initialProfile.fullName}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Index: {initialProfile.indexNumber}
                </p>
              </div>
            </div>

            <div className="min-w-[18rem]">
              <div className="flex items-center justify-between text-sm font-medium text-slate-300">
                <span>Document Submission Progress</span>
                <span className="text-indigo-300">
                  {uploadedCount}/{documents.length} Completed
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
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {documents.map((document) => {
              const pendingActionKind =
                pendingAction?.id === document.reportTypeId ? pendingAction.kind : null;

              return (
                <DocumentCard
                  key={document.reportTypeId}
                  actionState={actionState}
                  document={document}
                  fileInputKey={fileInputKeys[document.reportTypeId] ?? 0}
                  pendingActionKind={pendingActionKind}
                  onFileChange={(reportTypeId, fileName) =>
                    setSelectedFileNames((current) => ({
                      ...current,
                      [reportTypeId]: fileName,
                    }))
                  }
                  onRemove={(currentDocument) =>
                    void handleDocumentRemove(currentDocument)
                  }
                  onSubmit={(event, currentDocument) =>
                    void handleDocumentSubmit(event, currentDocument)
                  }
                  onVideoDraftChange={(reportTypeId, value) =>
                    setVideoDrafts((current) => ({
                      ...current,
                      [reportTypeId]: value,
                    }))
                  }
                  selectedFileName={selectedFileNames[document.reportTypeId] ?? ""}
                  videoDraft={videoDrafts[document.reportTypeId] ?? ""}
                />
              );
            })}
          </div>
        </section>
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
