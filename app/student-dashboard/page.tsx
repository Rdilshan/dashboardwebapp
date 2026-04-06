import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { StudentDashboardClient } from "./student-dashboard-client";
import { auth } from "@/auth";
import { getStudentById } from "@/lib/auth/student";
import { supabaseClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Student Dashboard | Industrial Training Portal",
  description:
    "Track industrial training submissions and upload required student documents.",
};

const getRedirectPathForRole = (role?: string) => {
  if (role === "admin") {
    return "/dashboard";
  }

  return "/student-login";
};

export default async function StudentDashboardPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/student-login");
  }

  if (user.role !== "student") {
    redirect(getRedirectPathForRole(user.role));
  }

  const student = await getStudentById(user.id);

  if (!student) {
    redirect("/student-login");
  }

  if (!student.hasCv) {
    redirect("/submit-cv");
  }

  const supabase = await supabaseClient();
  const [formTypesResponse, submittedFormsResponse] = await Promise.all([
    supabase.from("formtype").select("id, name").order("id", { ascending: true }),
    supabase.from("form").select("formtypeid, url").eq("studentid", student.id),
  ]);

  if (formTypesResponse.error) {
    throw new Error(`Failed to fetch form types: ${formTypesResponse.error.message}`);
  }

  if (submittedFormsResponse.error) {
    throw new Error(
      `Failed to fetch student form submissions: ${submittedFormsResponse.error.message}`,
    );
  }

  const formTypes = formTypesResponse.data ?? [];
  const submittedForms = submittedFormsResponse.data ?? [];
  const submissionUrlByFormTypeId = new Map<number, string>();

  submittedForms.forEach((submission) => {
    if (submission.url) {
      submissionUrlByFormTypeId.set(submission.formtypeid, submission.url);
    }
  });

  const initialDocuments = formTypes.map((formType) => {
    const formUrl = submissionUrlByFormTypeId.get(formType.id) ?? null;
    const isVideo = formType.name.toLowerCase().includes("presentation");

    let fileName: string | null = null;
    let videoLink: string | null = null;

    if (formUrl) {
      if (isVideo) {
        videoLink = formUrl;
      } else {
        try {
          const pathname = new URL(formUrl).pathname;
          fileName = decodeURIComponent(pathname.split("/").pop() ?? "");
        } catch {
          fileName = formUrl.split("/").pop() ?? formUrl;
        }
      }
    }

    return {
      reportTypeId: formType.id,
      reportName: formType.name,
      isUploaded: Boolean(formUrl),
      fileName,
      videoLink,
    };
  });

  return (
    <StudentDashboardClient
      initialDocuments={initialDocuments}
      initialProfile={{
        fullName: student.name,
        indexNumber: student.indexNumber,
      }}
    />
  );
}
