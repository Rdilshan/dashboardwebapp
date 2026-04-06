"use client";

import {
  FileText,
  KeyRound,
  LoaderCircle,
  Settings,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { BackgroundParticles } from "../ui/background-particles";
import { AdminLogoutButton } from "../ui/admin-logout-button";

type Toast = {
  message: string;
  type: "success" | "error" | "info";
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/15";

const navButtonClassName =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/45 hover:text-indigo-200";

export function AdminSettingClient() {
  const toastTimeoutRef = useRef<number | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(message: string, type: Toast["type"]) {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 5000);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: typeof errors = {};

    if (!currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required.";
    }

    if (!newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm the new password.";
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showToast("Please fix the password form errors.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      showToast("Password updated successfully.", "success");
    } catch {
      showToast("Failed to update the password.", "error");
    } finally {
      window.setTimeout(() => {
        setIsSubmitting(false);
      }, 200);
    }
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
              <Link href="/dashboard" className={navButtonClassName}>
                <FileText className="h-4 w-4" strokeWidth={1.8} />
                Dashboard
              </Link>
              <AdminLogoutButton className={navButtonClassName} />
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-10 lg:px-8">
          <div className="home-rise mx-auto w-full max-w-2xl">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-200">
                <Settings className="h-4 w-4" strokeWidth={1.8} />
                Admin Settings
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white">
                Manage Your Credentials
              </h1>
              <p className="mt-3 text-base text-slate-400">
                Update your admin password from a single secure panel.
              </p>
            </div>

            <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
              <div className="flex items-start gap-4 border-b border-white/10 pb-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200">
                  <KeyRound className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Change Password
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Manage your admin account credentials.
                  </p>
                </div>
              </div>

              <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
                <FormField
                  label="Current Password"
                  htmlFor="current_password"
                  error={errors.currentPassword}
                  control={
                    <input
                      id="current_password"
                      name="current_password"
                      type="password"
                      value={currentPassword}
                      onChange={(event) => {
                        setCurrentPassword(event.target.value);
                        setErrors((current) => ({
                          ...current,
                          currentPassword: undefined,
                        }));
                      }}
                      className={`${inputClassName} ${
                        errors.currentPassword
                          ? "border-red-400/70 focus:border-red-400 focus:ring-red-500/15"
                          : ""
                      }`}
                    />
                  }
                />

                <FormField
                  label="New Password"
                  htmlFor="new_password"
                  error={errors.newPassword}
                  control={
                    <input
                      id="new_password"
                      name="new_password"
                      type="password"
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        setErrors((current) => ({
                          ...current,
                          newPassword: undefined,
                          confirmPassword:
                            current.confirmPassword &&
                            confirmPassword &&
                            event.target.value !== confirmPassword
                              ? "Passwords do not match."
                              : undefined,
                        }));
                      }}
                      className={`${inputClassName} ${
                        errors.newPassword
                          ? "border-red-400/70 focus:border-red-400 focus:ring-red-500/15"
                          : ""
                      }`}
                    />
                  }
                />

                <FormField
                  label="Confirm New Password"
                  htmlFor="confirm_password"
                  error={errors.confirmPassword}
                  control={
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setConfirmPassword(nextValue);
                        setErrors((current) => ({
                          ...current,
                          confirmPassword:
                            nextValue && newPassword && nextValue !== newPassword
                              ? "Passwords do not match."
                              : undefined,
                        }));
                      }}
                      className={`${inputClassName} ${
                        errors.confirmPassword
                          ? "border-red-400/70 focus:border-red-400 focus:ring-red-500/15"
                          : ""
                      }`}
                    />
                  }
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:translate-y-0 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        className="h-5 w-5 animate-spin"
                        strokeWidth={1.8}
                      />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </section>
          </div>
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

function FormField({
  label,
  htmlFor,
  error,
  control,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-300">
        {label} <span className="text-red-400">*</span>
      </label>
      {control}
      <p className="min-h-5 text-xs text-red-400">{error ?? ""}</p>
    </div>
  );
}



