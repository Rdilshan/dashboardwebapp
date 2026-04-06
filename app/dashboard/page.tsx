import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { supabaseClient } from "@/utils/supabase/server";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Admin Dashboard | CV Portal",
  description:
    "Admin dashboard for managing industrial training CV submissions.",
};

type DashboardSubmission = {
  id: number;
  fullName: string;
  indexNumber: string;
  preferredRole: string;
  email: string;
  contactNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  cvFilename: string;
  cvUrl: string;
  submittedAt: string | null;
};

const getRedirectPathForRole = (role?: string) => {
  if (role === "student") {
    return "/student-dashboard";
  }

  return "/login";
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const asSingleRelation = (value: unknown) => {
  if (Array.isArray(value)) {
    return asRecord(value[0]);
  }

  return asRecord(value);
};

const getFileNameFromUrl = (url: string) => {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop() ?? "") || "CV File";
  } catch {
    return url.split("/").pop() ?? "CV File";
  }
};

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect(getRedirectPathForRole(user.role));
  }

  const supabase = await supabaseClient();
  const [rolesResponse, submissionsResponse] = await Promise.all([
    supabase.from("role").select("name").order("id", { ascending: true }),
    supabase
      .from("cv")
      .select(
        "id, url, role:roleid(name), student:studentid(id, name, email, index_number, contact_number, linkedin_url, github_url)",
      )
      .order("id", { ascending: false }),
  ]);

  if (rolesResponse.error) {
    throw new Error(`Failed to fetch roles: ${rolesResponse.error.message}`);
  }

  if (submissionsResponse.error) {
    throw new Error(
      `Failed to fetch CV submissions: ${submissionsResponse.error.message}`,
    );
  }

  const roles = (rolesResponse.data ?? [])
    .map((role) => role.name)
    .filter((roleName): roleName is string => Boolean(roleName));

  const normalizedSubmissions = (submissionsResponse.data ?? []).reduce<
    DashboardSubmission[]
  >((items, submission) => {
    const student = asSingleRelation(submission.student);
    const role = asSingleRelation(submission.role);
    const cvUrl = typeof submission.url === "string" ? submission.url : "";

    if (!student || !role || !cvUrl) {
      return items;
    }

    items.push({
      id: Number(submission.id),
      fullName: String(student.name ?? ""),
      indexNumber: String(student.index_number ?? ""),
      preferredRole: String(role.name ?? ""),
      email: String(student.email ?? ""),
      contactNumber: String(student.contact_number ?? ""),
      linkedinUrl: String(student.linkedin_url ?? ""),
      githubUrl: String(student.github_url ?? ""),
      cvFilename: getFileNameFromUrl(cvUrl),
      cvUrl,
      submittedAt: null,
    });

    return items;
  }, []);

  return (
    <DashboardClient roles={roles} initialSubmissions={normalizedSubmissions} />
  );
}
