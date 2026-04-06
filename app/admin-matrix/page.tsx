import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { supabaseClient } from "@/utils/supabase/server";
import { AdminMatrixClient } from "./admin-matrix-client";

export const metadata: Metadata = {
  title: "Admin Submission Matrix | Industrial Training Portal",
  description:
    "Comprehensive tracking of all student document submissions with CSV export.",
};

type DocumentStatus = {
  isUploaded: boolean;
  fileName: string | null;
  fileUrl: string | null;
  videoLink: string | null;
};

type MatrixRow = {
  studentId: number;
  indexNumber: string;
  fullName: string;
  documents: Record<string, DocumentStatus>;
};

const studentDocumentBucketName =
  process.env.SUPABASE_STUDENT_DOCUMENTS_BUCKET?.trim() ||
  "student-documents";

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

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const getMissingDocument = (): DocumentStatus => ({
  isUploaded: false,
  fileName: null,
  fileUrl: null,
  videoLink: null,
});

export default async function AdminMatrixPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect(getRedirectPathForRole(user.role));
  }

  const supabase = await supabaseClient();
  const [studentsResponse, formTypesResponse, formsResponse] = await Promise.all([
    supabase.from("student").select("id, index_number, name").order("index_number"),
    supabase.from("formtype").select("id, name").order("id"),
    supabase.from("form").select("studentid, formtypeid, url, data"),
  ]);

  if (studentsResponse.error) {
    throw new Error(`Failed to fetch students: ${studentsResponse.error.message}`);
  }

  if (formTypesResponse.error) {
    throw new Error(`Failed to fetch form types: ${formTypesResponse.error.message}`);
  }

  if (formsResponse.error) {
    throw new Error(`Failed to fetch form submissions: ${formsResponse.error.message}`);
  }

  const students = studentsResponse.data ?? [];
  const formTypes = formTypesResponse.data ?? [];
  const forms = formsResponse.data ?? [];
  const formTypeById = new Map(formTypes.map((formType) => [formType.id, formType]));
  const documentByStudentAndType = new Map<string, DocumentStatus>();

  forms.forEach((form) => {
    const formType = formTypeById.get(form.formtypeid);

    if (!formType || !form.url) {
      return;
    }

    const submissionData = asRecord(form.data);
    const storedSubmissionKind =
      typeof submissionData?.submissionKind === "string"
        ? submissionData.submissionKind
        : null;
    const isVideo =
      storedSubmissionKind === "video" ||
      formType.name.toLowerCase().includes("presentation");

    if (isVideo) {
      documentByStudentAndType.set(`${form.studentid}:${form.formtypeid}`, {
        isUploaded: true,
        fileName: null,
        fileUrl: null,
        videoLink: form.url,
      });
      return;
    }

    const storedStoragePath =
      typeof submissionData?.storagePath === "string"
        ? submissionData.storagePath
        : form.url;
    const storedStorageBucket =
      typeof submissionData?.storageBucket === "string"
        ? submissionData.storageBucket
        : studentDocumentBucketName;
    const storedFileName =
      typeof submissionData?.fileName === "string"
        ? submissionData.fileName
        : null;

    const fileUrl = isAbsoluteUrl(form.url)
      ? form.url
      : supabase.storage.from(storedStorageBucket).getPublicUrl(storedStoragePath)
          .data.publicUrl;

    let fileName = storedFileName;

    if (!fileName) {
      try {
        const pathname = new URL(fileUrl).pathname;
        fileName = decodeURIComponent(pathname.split("/").pop() ?? "") || null;
      } catch {
        fileName = storedStoragePath.split("/").pop() ?? storedStoragePath;
      }
    }

    documentByStudentAndType.set(`${form.studentid}:${form.formtypeid}`, {
      isUploaded: true,
      fileName,
      fileUrl,
      videoLink: null,
    });
  });

  const reportTypes = formTypes.map((formType) => formType.name);
  const matrixRows: MatrixRow[] = students.map((student) => ({
    studentId: student.id,
    indexNumber: student.index_number,
    fullName: student.name,
    documents: formTypes.reduce(
      (documents, formType) => {
        documents[formType.name] =
          documentByStudentAndType.get(`${student.id}:${formType.id}`) ??
          getMissingDocument();
        return documents;
      },
      {} as Record<string, DocumentStatus>,
    ),
  }));

  return <AdminMatrixClient reportTypes={reportTypes} rows={matrixRows} />;
}
