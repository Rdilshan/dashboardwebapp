"use client";

import {
  Download,
  ExternalLink,
  FileText,
  LogOut,
  Pencil,
  Search,
  Settings,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { BackgroundParticles } from "../ui/background-particles";

type Role =
  | "Software Engineer"
  | "QA Engineer"
  | "Business Analyst"
  | "UI/UX Designer"
  | "Network Engineer"
  | "Data Scientist"
  | "Other";

type FilterRole = "All" | Role;
type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };

type Submission = {
  id: number;
  fullName: string;
  indexNumber: string;
  preferredRole: Role;
  email: string;
  contactNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  cvFilename: string;
  submittedAt: string;
};

const roles: Role[] = [
  "Software Engineer",
  "QA Engineer",
  "Business Analyst",
  "UI/UX Designer",
  "Network Engineer",
  "Data Scientist",
  "Other",
];

const initialSubmissions: Submission[] = [
  {
    id: 1,
    fullName: "Ayesha Fernando",
    indexNumber: "22CSE0001",
    preferredRole: "Software Engineer",
    email: "ayesha.fernando@example.com",
    contactNumber: "+94 71 345 6721",
    linkedinUrl: "https://linkedin.com/in/ayesha-fernando",
    githubUrl: "https://github.com/ayeshaf",
    cvFilename: "ayesha-fernando-cv.pdf",
    submittedAt: "2026-10-18T08:45:00.000Z",
  },
  {
    id: 2,
    fullName: "Kavindu Perera",
    indexNumber: "22CSE0007",
    preferredRole: "QA Engineer",
    email: "kavindu.perera@example.com",
    contactNumber: "+94 77 881 1024",
    linkedinUrl: "https://linkedin.com/in/kavindu-perera",
    githubUrl: "",
    cvFilename: "kavindu-perera-cv.pdf",
    submittedAt: "2026-10-19T11:20:00.000Z",
  },
  {
    id: 3,
    fullName: "Nethmi Jayasuriya",
    indexNumber: "22CSE0012",
    preferredRole: "Business Analyst",
    email: "nethmi.j@example.com",
    contactNumber: "+94 75 210 4567",
    linkedinUrl: "https://linkedin.com/in/nethmij",
    githubUrl: "",
    cvFilename: "nethmi-jayasuriya-cv.pdf",
    submittedAt: "2026-10-19T14:12:00.000Z",
  },
  {
    id: 4,
    fullName: "Dineth Silva",
    indexNumber: "22CSE0020",
    preferredRole: "UI/UX Designer",
    email: "dineth.silva@example.com",
    contactNumber: "+94 70 998 2201",
    linkedinUrl: "https://linkedin.com/in/dinethsilva",
    githubUrl: "https://github.com/dineth-ui",
    cvFilename: "dineth-silva-portfolio.pdf",
    submittedAt: "2026-10-20T09:05:00.000Z",
  },
  {
    id: 5,
    fullName: "Isuru Wickramasinghe",
    indexNumber: "22CSE0025",
    preferredRole: "Network Engineer",
    email: "isuru.w@example.com",
    contactNumber: "+94 76 301 8181",
    linkedinUrl: "",
    githubUrl: "",
    cvFilename: "isuru-wickramasinghe-cv.pdf",
    submittedAt: "2026-10-20T10:55:00.000Z",
  },
  {
    id: 6,
    fullName: "Pasindu Hettiarachchi",
    indexNumber: "22CSE0032",
    preferredRole: "Data Scientist",
    email: "pasindu.h@example.com",
    contactNumber: "+94 78 445 9912",
    linkedinUrl: "https://linkedin.com/in/pasindu-h",
    githubUrl: "https://github.com/pasinduh",
    cvFilename: "pasindu-hettiarachchi-cv.pdf",
    submittedAt: "2026-10-21T07:30:00.000Z",
  },
  {
    id: 7,
    fullName: "Senuri De Alwis",
    indexNumber: "22CSE0039",
    preferredRole: "Other",
    email: "senuri.d@example.com",
    contactNumber: "+94 74 602 2144",
    linkedinUrl: "https://linkedin.com/in/senuri-alwis",
    githubUrl: "",
    cvFilename: "senuri-de-alwis-cv.pdf",
    submittedAt: "2026-10-21T12:10:00.000Z",
  },
];

const tableInputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

const navButtonClassName =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/45 hover:text-indigo-200";

const iconButtonClassName =
  "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-transparent text-slate-400 transition hover:border-indigo-400/45 hover:text-indigo-200";

const secondaryButtonClassName =
  "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-indigo-400/45 hover:text-indigo-200";

const primaryButtonClassName =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]";

export function DashboardClient() {
  const [submissions, setSubmissions] = useState<Submission[]>([
    ...initialSubmissions,
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("All");
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
    null,
  );
  const [replacementCvName, setReplacementCvName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const filteredSubmissions = submissions.filter((submission) => {
    const roleMatch =
      roleFilter === "All" || submission.preferredRole === roleFilter;
    const searchValue = searchTerm.trim().toLowerCase();

    if (!searchValue) {
      return roleMatch;
    }

    const haystack = [
      submission.fullName,
      submission.indexNumber,
      submission.email,
      submission.contactNumber,
      submission.preferredRole,
    ]
      .join(" ")
      .toLowerCase();

    return roleMatch && haystack.includes(searchValue);
  });

  function addToast(message: string, type: ToastType = "info") {
    toastIdRef.current += 1;
    const id = toastIdRef.current;
    setToasts((current) => [...current, { id, message, type }]);

    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }

  function updateSubmissionField<Key extends keyof Submission>(
    key: Key,
    value: Submission[Key],
  ) {
    setEditingSubmission((current) =>
      current ? { ...current, [key]: value } : current,
    );
  }

  function handleDownload(role: Role) {
    setRoleFilter(role);
    addToast(`Showing ${role} submissions. Download integration is not connected yet.`);
  }

  function handleSaveChanges() {
    if (!editingSubmission) {
      return;
    }

    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === editingSubmission.id
          ? {
              ...editingSubmission,
              cvFilename: replacementCvName || editingSubmission.cvFilename,
            }
          : submission,
      ),
    );

    setEditingSubmission(null);
    setReplacementCvName("");
    addToast("Updated successfully.", "success");
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setSubmissions((current) =>
      current.filter((submission) => submission.id !== deleteTarget.id),
    );
    addToast(`Deleted ${deleteTarget.fullName}.`, "success");
    setDeleteTarget(null);
  }

  return (
    <main className="relative isolate flex min-h-screen flex-1 flex-col overflow-hidden bg-[#0a0e1a] text-slate-50">
      <BackgroundParticles />

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
                <FileText className="h-4 w-4" strokeWidth={1.8} />
                Hub
              </Link>
              <Link href="/admin-setting" className={navButtonClassName}>
                <Settings className="h-4 w-4" strokeWidth={1.8} />
                Settings
              </Link>
              <Link href="/login" className={navButtonClassName}>
                <LogOut className="h-4 w-4" strokeWidth={1.8} />
                Logout
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-8 lg:px-8">
          <section className="home-rise flex flex-wrap gap-4">
            <StatCard count={submissions.length} label="Total Submissions" />
            {roles.map((role) => (
              <StatCard
                key={role}
                count={
                  submissions.filter(
                    (submission) => submission.preferredRole === role,
                  ).length
                }
                label={role}
              />
            ))}
          </section>

          <section className="home-rise mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  All Submissions
                </h2>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative min-w-0 md:w-72">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">
                    <Search className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search name, index, email..."
                    className={`${tableInputClassName} pl-10`}
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value as FilterRole)
                  }
                  className={`${tableInputClassName} md:w-60 text-slate-300`}
                >
                  <option value="All" className="bg-slate-900">
                    All Roles
                  </option>
                  {roles.map((role) => (
                    <option key={role} value={role} className="bg-slate-900">
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="home-rise mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Bulk Download CVs by Role
            </h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleDownload(role)}
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200 transition hover:border-indigo-400/45 hover:bg-indigo-500/16"
                >
                  <Download className="h-4 w-4" strokeWidth={1.8} />
                  {role}
                </button>
              ))}
            </div>
          </section>

          <section className="home-rise mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                    {[
                      "#",
                      "Full Name",
                      "Index No.",
                      "Role",
                      "Email",
                      "Contact",
                      "LinkedIn",
                      "GitHub",
                      "CV",
                      "Submitted",
                      "Actions",
                    ].map((heading) => (
                      <th key={heading} className="px-4 py-4 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        className="px-4 py-12 text-center text-base text-slate-500"
                      >
                        No submissions found.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((submission, index) => (
                      <tr
                        key={submission.id}
                        className="border-b border-white/[0.03] align-top text-slate-200 transition hover:bg-white/[0.03]"
                      >
                        <td className="px-4 py-4">{index + 1}</td>
                        <td className="px-4 py-4 font-medium text-white">
                          {submission.fullName}
                        </td>
                        <td className="px-4 py-4">{submission.indexNumber}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-indigo-500/12 px-3 py-1 text-xs font-semibold text-indigo-200">
                            {submission.preferredRole}
                          </span>
                        </td>
                        <td className="px-4 py-4">{submission.email}</td>
                        <td className="px-4 py-4">{submission.contactNumber}</td>
                        <td className="px-4 py-4">
                          {submission.linkedinUrl ? (
                            <a
                              href={submission.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-300 transition hover:text-indigo-200"
                            >
                              View
                              <ExternalLink
                                className="h-3.5 w-3.5"
                                strokeWidth={1.8}
                              />
                            </a>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {submission.githubUrl ? (
                            <a
                              href={submission.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-300 transition hover:text-indigo-200"
                            >
                              View
                              <ExternalLink
                                className="h-3.5 w-3.5"
                                strokeWidth={1.8}
                              />
                            </a>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              addToast(
                                `Download for ${submission.cvFilename} is not connected yet.`,
                              )
                            }
                            className="inline-flex items-center gap-2 text-indigo-300 transition hover:text-indigo-200"
                          >
                            <Download className="h-4 w-4" strokeWidth={1.8} />
                            <span className="max-w-44 truncate">
                              {submission.cvFilename}
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatDate(submission.submittedAt)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSubmission(submission);
                                setReplacementCvName("");
                              }}
                              className={iconButtonClassName}
                              aria-label={`Edit ${submission.fullName}`}
                            >
                              <Pencil className="h-4 w-4" strokeWidth={1.8} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(submission)}
                              className={`${iconButtonClassName} hover:border-red-400/50 hover:text-red-300`}
                              aria-label={`Delete ${submission.fullName}`}
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                            </button>
                          </div>
                        </td>
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

      {editingSubmission ? (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-6 py-8 backdrop-blur-sm"
          onClick={() => {
            setEditingSubmission(null);
            setReplacementCvName("");
          }}
        >
          <div
            className="w-full max-w-4xl rounded-[1.75rem] border border-white/10 bg-[#101827]/90 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pb-0 pt-6 sm:px-8">
              <h2 className="text-2xl font-bold text-white">
                Edit Submission
              </h2>
              <button
                type="button"
                className={iconButtonClassName}
                onClick={() => {
                  setEditingSubmission(null);
                  setReplacementCvName("");
                }}
                aria-label="Close edit modal"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <div className="px-6 pb-8 pt-6 sm:px-8">
              <div className="grid gap-5 md:grid-cols-2">
                <FormControl
                  label="Full Name"
                  htmlFor="edit_full_name"
                  control={
                    <input
                      id="edit_full_name"
                      type="text"
                      value={editingSubmission.fullName}
                      onChange={(event) =>
                        updateSubmissionField("fullName", event.target.value)
                      }
                      className={tableInputClassName}
                    />
                  }
                />
                <FormControl
                  label="Index Number"
                  htmlFor="edit_index_number"
                  control={
                    <input
                      id="edit_index_number"
                      type="text"
                      value={editingSubmission.indexNumber}
                      onChange={(event) =>
                        updateSubmissionField("indexNumber", event.target.value)
                      }
                      className={tableInputClassName}
                    />
                  }
                />
                <FormControl
                  label="Preferred Role"
                  htmlFor="edit_preferred_role"
                  control={
                    <select
                      id="edit_preferred_role"
                      value={editingSubmission.preferredRole}
                      onChange={(event) =>
                        updateSubmissionField(
                          "preferredRole",
                          event.target.value as Role,
                        )
                      }
                      className={`${tableInputClassName} text-slate-300`}
                    >
                      {roles.map((role) => (
                        <option
                          key={role}
                          value={role}
                          className="bg-slate-900"
                        >
                          {role}
                        </option>
                      ))}
                    </select>
                  }
                />
                <FormControl
                  label="Contact Number"
                  htmlFor="edit_contact_number"
                  control={
                    <input
                      id="edit_contact_number"
                      type="tel"
                      value={editingSubmission.contactNumber}
                      onChange={(event) =>
                        updateSubmissionField(
                          "contactNumber",
                          event.target.value,
                        )
                      }
                      className={tableInputClassName}
                    />
                  }
                />
                <FormControl
                  label="Email"
                  htmlFor="edit_email"
                  control={
                    <input
                      id="edit_email"
                      type="email"
                      value={editingSubmission.email}
                      onChange={(event) =>
                        updateSubmissionField("email", event.target.value)
                      }
                      className={tableInputClassName}
                    />
                  }
                />
                <FormControl
                  label="LinkedIn URL"
                  htmlFor="edit_linkedin_url"
                  control={
                    <input
                      id="edit_linkedin_url"
                      type="url"
                      value={editingSubmission.linkedinUrl}
                      onChange={(event) =>
                        updateSubmissionField("linkedinUrl", event.target.value)
                      }
                      className={tableInputClassName}
                    />
                  }
                />
                <FormControl
                  label="GitHub URL"
                  htmlFor="edit_github_url"
                  control={
                    <input
                      id="edit_github_url"
                      type="url"
                      value={editingSubmission.githubUrl}
                      onChange={(event) =>
                        updateSubmissionField("githubUrl", event.target.value)
                      }
                      className={tableInputClassName}
                    />
                  }
                />
                <FormControl
                  label="Replace CV (optional)"
                  htmlFor="edit_cv_file"
                  control={
                    <div className="space-y-2">
                      <input
                        id="edit_cv_file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className={`${tableInputClassName} file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-500/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-200`}
                        onChange={(event) =>
                          setReplacementCvName(
                            event.target.files?.[0]?.name ?? "",
                          )
                        }
                      />
                      <p className="text-sm text-slate-500">
                        {replacementCvName ||
                          `Current file: ${editingSubmission.cvFilename}`}
                      </p>
                    </div>
                  }
                />
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  onClick={() => {
                    setEditingSubmission(null);
                    setReplacementCvName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={primaryButtonClassName}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-6 py-8 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-lg rounded-[1.75rem] border border-white/10 bg-[#101827]/90 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pb-0 pt-6">
              <h2 className="text-2xl font-bold text-white">
                Confirm Delete
              </h2>
              <button
                type="button"
                className={iconButtonClassName}
                onClick={() => setDeleteTarget(null)}
                aria-label="Close delete modal"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <div className="px-6 pb-8 pt-6">
              <p className="text-base leading-7 text-slate-300">
                Are you sure you want to delete the submission for{" "}
                <strong className="text-white">{deleteTarget.fullName}</strong>?
                This action cannot be undone.
              </p>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="fixed right-6 top-20 z-40 flex max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
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
        ))}
      </div>
    </main>
  );
}

function StatCard({ count, label }: { count: number; label: string }) {
  return (
    <div className="min-w-[10rem] flex-1 rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-6 py-5 text-center shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-4xl font-black text-transparent">
        {count}
      </div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function FormControl({
  label,
  htmlFor,
  control,
}: {
  label: string;
  htmlFor: string;
  control: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      {control}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
