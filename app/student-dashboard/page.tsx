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

const studentDocumentBucketName =
  process.env.SUPABASE_STUDENT_DOCUMENTS_BUCKET?.trim() ||
  "student-documents";

const asSubmissionMetadata = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

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
    supabase.from("form").select("formtypeid, url, data").eq("studentid", student.id),
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
  const submissionByFormTypeId = new Map<
    number,
    {
      url: string | null;
      data: Record<string, unknown> | null;
    }
  >();

  submittedForms.forEach((submission) => {
    submissionByFormTypeId.set(submission.formtypeid, {
      url: submission.url,
      data: asSubmissionMetadata(submission.data),
    });
  });

  const initialDocuments = formTypes.map((formType) => {
    const submission = submissionByFormTypeId.get(formType.id);
    const formLocation = submission?.url ?? null;
    const submissionData = submission?.data;
    const submissionKind =
      typeof submissionData?.submissionKind === "string"
        ? submissionData.submissionKind
        : null;
    const isVideo =
      submissionKind === "video" ||
      formType.name.toLowerCase().includes("presentation");

    let fileName: string | null = null;
    let fileUrl: string | null = null;
    let videoLink: string | null = null;

    if (formLocation) {
      if (isVideo) {
        videoLink = formLocation;
      } else {
        const storedStoragePath =
          typeof submissionData?.storagePath === "string"
            ? submissionData.storagePath
            : formLocation;
        const storedStorageBucket =
          typeof submissionData?.storageBucket === "string"
            ? submissionData.storageBucket
            : studentDocumentBucketName;
        const storedFileName =
          typeof submissionData?.fileName === "string"
            ? submissionData.fileName
            : null;

        if (isAbsoluteUrl(formLocation)) {
          fileUrl = formLocation;
        } else if (storedStoragePath) {
          const { data: publicUrlData } = supabase.storage
            .from(storedStorageBucket)
            .getPublicUrl(storedStoragePath);

          fileUrl = publicUrlData.publicUrl;
        }

        if (storedFileName) {
          fileName = storedFileName;
        } else {
          try {
            const pathname = new URL(fileUrl ?? formLocation).pathname;
            fileName = decodeURIComponent(pathname.split("/").pop() ?? "");
          } catch {
            fileName = storedStoragePath.split("/").pop() ?? storedStoragePath;
          }
        }
      }
    }

    return {
      reportTypeId: formType.id,
      reportName: formType.name,
      isUploaded: Boolean(formLocation),
      fileName,
      fileUrl,
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
