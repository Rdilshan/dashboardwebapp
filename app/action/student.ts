"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getStudentById } from "@/lib/auth/student";
import { supabaseClient } from "@/utils/supabase/server";

export type StudentSignupRequest = {
  fullName: string;
  indexNumber: string;
  email: string;
  password: string;
};

export type StudentSignupFieldErrors = Partial<
  Record<keyof StudentSignupRequest, string>
>;

export type StudentSignupResult = {
  success: boolean;
  error: string | null;
  fieldErrors?: StudentSignupFieldErrors;
};

export type SubmitCvValues = {
  preferredRoleId: string;
  contactNumber: string;
  linkedinUrl: string;
  githubUrl: string;
};

export type SubmitCvFieldErrors = Partial<
  Record<keyof SubmitCvValues | "cvFile", string>
>;

export type SubmitCvActionState = {
  success: boolean;
  error: string | null;
  redirectTo: string | null;
  values: SubmitCvValues;
  fieldErrors?: SubmitCvFieldErrors;
};

export type StudentDashboardFormFieldErrors = Partial<
  Record<"documentFile" | "videoLink", string>
>;

export type StudentDashboardFormSubmission = {
  reportTypeId: number;
  isUploaded: boolean;
  fileName: string | null;
  videoLink: string | null;
};

export type StudentDashboardFormActionState = {
  success: boolean;
  error: string | null;
  responseId: string;
  reportTypeId: number | null;
  submissionKind: "file" | "video" | null;
  fieldErrors?: StudentDashboardFormFieldErrors;
  submission: StudentDashboardFormSubmission | null;
};

const emailPattern = /^\S+@\S+\.\S+$/;
const cvBucketName = process.env.SUPABASE_CV_BUCKET?.trim() || "cv";
const studentDocumentBucketName ="student-documents";
const maxUploadFileSize = 10 * 1024 * 1024;
const allowedDocumentExtensions = new Set(["pdf", "doc", "docx"]);

const contentTypeByExtension: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const emptySubmitCvValues = (): SubmitCvValues => ({
  preferredRoleId: "",
  contactNumber: "",
  linkedinUrl: "",
  githubUrl: "",
});

const createResponseId = () => crypto.randomUUID();

const createStudentDashboardFormState = (
  overrides: Partial<StudentDashboardFormActionState> = {},
): StudentDashboardFormActionState => ({
  success: false,
  error: null,
  responseId: createResponseId(),
  reportTypeId: null,
  submissionKind: null,
  submission: null,
  ...overrides,
});

const getDuplicateFieldErrors = (
  message: string,
  details?: string,
): StudentSignupFieldErrors => {
  const combined = `${message} ${details ?? ""}`.toLowerCase();
  const fieldErrors: StudentSignupFieldErrors = {};

  if (combined.includes("email")) {
    fieldErrors.email = "This email is already registered.";
  }

  if (
    combined.includes("index_number") ||
    combined.includes("index number") ||
    combined.includes("student_index_number_key")
  ) {
    fieldErrors.indexNumber = "This index number is already registered.";
  }

  return fieldErrors;
};

const normalizeOptionalUrl = (value: string) => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return { value: null, error: null };
  }

  try {
    const parsedUrl = new URL(normalizedValue);
    return { value: parsedUrl.toString(), error: null };
  } catch {
    return {
      value: normalizedValue,
      error: "Enter a valid URL including http:// or https://.",
    };
  }
};

const getFileExtension = (fileName: string) => {
  const extension = fileName.split(".").pop()?.trim().toLowerCase();
  return extension || "";
};

const sanitizeFileNameStem = (fileName: string) => {
  const stem = fileName.replace(/\.[^.]+$/, "").trim().toLowerCase();
  const sanitizedStem = stem.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return sanitizedStem || "file";
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const removeUploadedObject = async (bucketName: string, filePath: string) => {
  try {
    const supabase = await supabaseClient();
    await supabase.storage.from(bucketName).remove([filePath]);
  } catch {
    // Best-effort cleanup only.
  }
};

const removeUploadedCv = async (filePath: string) => {
  await removeUploadedObject(cvBucketName, filePath);
};

export async function registerStudentAction(
  values: StudentSignupRequest,
): Promise<StudentSignupResult> {
  const fullName = values.fullName.trim();
  const indexNumber = values.indexNumber.trim();
  const email = values.email.trim().toLowerCase();
  const password = values.password;

  const fieldErrors: StudentSignupFieldErrors = {};

  if (!fullName) {
    fieldErrors.fullName = "Full name is required.";
  }

  if (!indexNumber) {
    fieldErrors.indexNumber = "Index number is required.";
  }

  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (!emailPattern.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    fieldErrors.password = "Password is required.";
  } else if (password.length < 6) {
    fieldErrors.password = "Password must be at least 6 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const supabase = await supabaseClient();
  const { error } = await supabase.from("student").insert({
    name: fullName,
    index_number: indexNumber,
    email,
    password,
  });

  if (error) {
    if (error.code === "23505") {
      const duplicateFieldErrors = getDuplicateFieldErrors(
        error.message,
        error.details,
      );

      return {
        success: false,
        error:
          duplicateFieldErrors.email || duplicateFieldErrors.indexNumber
            ? "A student account already exists with those details."
            : "Student account already exists.",
        fieldErrors: duplicateFieldErrors,
      };
    }

    return {
      success: false,
      error: `Registration failed: ${error.message}`,
    };
  }

  return {
    success: true,
    error: null,
  };
}

export async function submitStudentCvFormAction(
  _previousState: SubmitCvActionState,
  formData: FormData,
): Promise<SubmitCvActionState> {
  const values: SubmitCvValues = {
    preferredRoleId: String(formData.get("preferred_role") ?? "").trim(),
    contactNumber: String(formData.get("contact_number") ?? "").trim(),
    linkedinUrl: String(formData.get("linkedin_url") ?? "").trim(),
    githubUrl: String(formData.get("github_url") ?? "").trim(),
  };

  const fieldErrors: SubmitCvFieldErrors = {};
  const linkedinUrl = normalizeOptionalUrl(values.linkedinUrl);
  const githubUrl = normalizeOptionalUrl(values.githubUrl);
  const fileEntry = formData.get("cv_file");
  const cvFile = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  if (!values.preferredRoleId) {
    fieldErrors.preferredRoleId = "Preferred job role is required.";
  }

  if (!values.contactNumber) {
    fieldErrors.contactNumber = "Contact number is required.";
  }

  if (linkedinUrl.error) {
    fieldErrors.linkedinUrl = linkedinUrl.error;
  }

  if (githubUrl.error) {
    fieldErrors.githubUrl = githubUrl.error;
  }

  if (!cvFile) {
    fieldErrors.cvFile = "CV file is required.";
  }

  const fileExtension = cvFile ? getFileExtension(cvFile.name) : "";

  if (cvFile && cvFile.size > maxUploadFileSize) {
    fieldErrors.cvFile = "CV must be 10 MB or smaller.";
  }

  if (cvFile && !allowedDocumentExtensions.has(fileExtension)) {
    fieldErrors.cvFile = "Only .pdf, .doc, and .docx files are allowed.";
  }

  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== "student") {
    return {
      success: false,
      error: "Unauthorized. Please sign in again.",
      redirectTo: null,
      values,
    };
  }

  const student = await getStudentById(user.id);

  if (!student) {
    return {
      success: false,
      error: "Student account was not found.",
      redirectTo: null,
      values,
    };
  }

  if (student.hasCv) {
    return {
      success: true,
      error: null,
      redirectTo: "/student-dashboard",
      values,
    };
  }

  const preferredRoleId = Number.parseInt(values.preferredRoleId, 10);

  if (!Number.isInteger(preferredRoleId) || preferredRoleId < 1) {
    fieldErrors.preferredRoleId = "Select a valid preferred job role.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      redirectTo: null,
      values,
      fieldErrors,
    };
  }

  const supabase = await supabaseClient();
  const { data: role, error: roleError } = await supabase
    .from("role")
    .select("id")
    .eq("id", preferredRoleId)
    .limit(1)
    .maybeSingle();

  if (roleError) {
    return {
      success: false,
      error: `Failed to validate selected role: ${roleError.message}`,
      redirectTo: null,
      values,
    };
  }

  if (!role) {
    return {
      success: false,
      error: "Please select a valid preferred job role.",
      redirectTo: null,
      values,
      fieldErrors: {
        preferredRoleId: "Select a valid preferred job role.",
      },
    };
  }

  if (!cvFile) {
    return {
      success: false,
      error: "CV file is required.",
      redirectTo: null,
      values,
      fieldErrors: {
        cvFile: "CV file is required.",
      },
    };
  }

  const safeFileNameStem = sanitizeFileNameStem(cvFile.name);
  const filePath = `students/${student.id}/${Date.now()}-${safeFileNameStem}.${fileExtension}`;
  const contentType = cvFile.type || contentTypeByExtension[fileExtension];

  const { error: uploadError } = await supabase.storage
    .from(cvBucketName)
    .upload(filePath, cvFile, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    return {
      success: false,
      error: `CV upload failed: ${uploadError.message}`,
      redirectTo: null,
      values,
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from(cvBucketName)
    .getPublicUrl(filePath);

  const { error: cvError } = await supabase.from("cv").upsert(
    {
      studentid: student.id,
      url: publicUrlData.publicUrl,
      roleid: role.id,
    },
    { onConflict: "studentid" },
  );

  if (cvError) {
    await removeUploadedCv(filePath);

    return {
      success: false,
      error: `Failed to save CV details: ${cvError.message}`,
      redirectTo: null,
      values,
    };
  }

  const { error: studentError } = await supabase
    .from("student")
    .update({
      contact_number: values.contactNumber,
      linkedin_url: linkedinUrl.value,
      github_url: githubUrl.value,
      ishascv: true,
    })
    .eq("id", student.id);

  if (studentError) {
    await supabase.from("cv").delete().eq("studentid", student.id);
    await removeUploadedCv(filePath);

    return {
      success: false,
      error: `Failed to update student details: ${studentError.message}`,
      redirectTo: null,
      values,
    };
  }

  revalidatePath("/student-dashboard");
  revalidatePath("/submit-cv");

  return {
    success: true,
    error: null,
    redirectTo: "/student-dashboard",
    values: emptySubmitCvValues(),
  };
}

export async function submitStudentDashboardFormAction(
  _previousState: StudentDashboardFormActionState,
  formData: FormData,
): Promise<StudentDashboardFormActionState> {
  const reportTypeIdValue = String(formData.get("report_type_id") ?? "").trim();
  const reportTypeId = Number.parseInt(reportTypeIdValue, 10);

  if (!Number.isInteger(reportTypeId) || reportTypeId < 1) {
    return createStudentDashboardFormState({
      error: "Please choose a valid form type.",
    });
  }

  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== "student") {
    return createStudentDashboardFormState({
      error: "Unauthorized. Please sign in again.",
      reportTypeId,
    });
  }

  const student = await getStudentById(user.id);

  if (!student) {
    return createStudentDashboardFormState({
      error: "Student account was not found.",
      reportTypeId,
    });
  }

  if (!student.hasCv) {
    return createStudentDashboardFormState({
      error: "Upload your CV before submitting dashboard documents.",
      reportTypeId,
    });
  }

  const supabase = await supabaseClient();
  const { data: formType, error: formTypeError } = await supabase
    .from("formtype")
    .select("id, name")
    .eq("id", reportTypeId)
    .limit(1)
    .maybeSingle();

  if (formTypeError) {
    return createStudentDashboardFormState({
      error: `Failed to validate form type: ${formTypeError.message}`,
      reportTypeId,
    });
  }

  if (!formType) {
    return createStudentDashboardFormState({
      error: "The selected form type does not exist.",
      reportTypeId,
    });
  }

  const { data: existingSubmission, error: existingSubmissionError } = await supabase
    .from("form")
    .select("id, url, data")
    .eq("studentid", student.id)
    .eq("formtypeid", formType.id)
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingSubmissionError) {
    return createStudentDashboardFormState({
      error: `Failed to load the current submission: ${existingSubmissionError.message}`,
      reportTypeId: formType.id,
    });
  }

  const isVideoSubmission = formType.name.toLowerCase().includes("presentation");

  if (isVideoSubmission) {
    const rawVideoLink = String(formData.get("video_link") ?? "").trim();

    if (!rawVideoLink) {
      return createStudentDashboardFormState({
        error: "Please fix the highlighted fields.",
        reportTypeId: formType.id,
        submissionKind: "video",
        fieldErrors: {
          videoLink: "Presentation link is required.",
        },
      });
    }

    let normalizedVideoLink: string;

    try {
      normalizedVideoLink = new URL(rawVideoLink).toString();
    } catch {
      return createStudentDashboardFormState({
        error: "Please fix the highlighted fields.",
        reportTypeId: formType.id,
        submissionKind: "video",
        fieldErrors: {
          videoLink: "Enter a valid URL including http:// or https://.",
        },
      });
    }

    const submissionPayload = {
      studentid: student.id,
      formtypeid: formType.id,
      url: normalizedVideoLink,
      data: {
        submissionKind: "video",
        submittedAt: new Date().toISOString(),
      },
    };

    const submissionError = existingSubmission
      ? (
          await supabase
            .from("form")
            .update(submissionPayload)
            .eq("id", existingSubmission.id)
        ).error
      : (await supabase.from("form").insert(submissionPayload)).error;

    if (submissionError) {
      return createStudentDashboardFormState({
        error: `Failed to save ${formType.name}: ${submissionError.message}`,
        reportTypeId: formType.id,
        submissionKind: "video",
      });
    }

    revalidatePath("/student-dashboard");

    return createStudentDashboardFormState({
      success: true,
      error: null,
      reportTypeId: formType.id,
      submissionKind: "video",
      submission: {
        reportTypeId: formType.id,
        isUploaded: true,
        fileName: null,
        videoLink: normalizedVideoLink,
      },
    });
  }

  const fileEntry = formData.get("document_file");
  const documentFile =
    fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;
  const fieldErrors: StudentDashboardFormFieldErrors = {};

  if (!documentFile) {
    fieldErrors.documentFile = `${formType.name} file is required.`;
  }

  const fileExtension = documentFile ? getFileExtension(documentFile.name) : "";

  if (documentFile && documentFile.size > maxUploadFileSize) {
    fieldErrors.documentFile = `${formType.name} must be 10 MB or smaller.`;
  }

  if (documentFile && !allowedDocumentExtensions.has(fileExtension)) {
    fieldErrors.documentFile = "Only .pdf, .doc, and .docx files are allowed.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return createStudentDashboardFormState({
      error: "Please fix the highlighted fields.",
      reportTypeId: formType.id,
      submissionKind: "file",
      fieldErrors,
    });
  }

  if (!documentFile) {
    return createStudentDashboardFormState({
      error: `${formType.name} file is required.`,
      reportTypeId: formType.id,
      submissionKind: "file",
      fieldErrors: {
        documentFile: `${formType.name} file is required.`,
      },
    });
  }

  const safeFileNameStem = sanitizeFileNameStem(documentFile.name);
  const filePath = `students/${student.id}/forms/${formType.id}/${Date.now()}-${safeFileNameStem}.${fileExtension}`;
  const contentType = documentFile.type || contentTypeByExtension[fileExtension];

  const { error: uploadError } = await supabase.storage
    .from(studentDocumentBucketName)
    .upload(filePath, documentFile, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    return createStudentDashboardFormState({
      error: `Failed to upload ${formType.name}: ${uploadError.message}`,
      reportTypeId: formType.id,
      submissionKind: "file",
    });
  }

  const existingSubmissionData = asRecord(existingSubmission?.data);
  const previousStoragePath =
    typeof existingSubmissionData?.storagePath === "string"
      ? existingSubmissionData.storagePath
      : typeof existingSubmission?.url === "string" &&
          existingSubmission.url &&
          !isAbsoluteUrl(existingSubmission.url)
        ? existingSubmission.url
      : null;
  const previousStorageBucket =
    typeof existingSubmissionData?.storageBucket === "string"
      ? existingSubmissionData.storageBucket
      : studentDocumentBucketName;
  const { data: publicUrlData } = supabase.storage
    .from(studentDocumentBucketName)
    .getPublicUrl(filePath);

  const submissionPayload = {
    studentid: student.id,
    formtypeid: formType.id,
    url: publicUrlData.publicUrl,
    data: {
      submissionKind: "file",
      storageBucket: studentDocumentBucketName,
      storagePath: filePath,
      fileName: documentFile.name,
      contentType,
      submittedAt: new Date().toISOString(),
    },
  };

  const submissionError = existingSubmission
    ? (
        await supabase
          .from("form")
          .update(submissionPayload)
          .eq("id", existingSubmission.id)
      ).error
    : (await supabase.from("form").insert(submissionPayload)).error;

  if (submissionError) {
    await removeUploadedObject(studentDocumentBucketName, filePath);

    return createStudentDashboardFormState({
      error: `Failed to save ${formType.name}: ${submissionError.message}`,
      reportTypeId: formType.id,
      submissionKind: "file",
    });
  }

  if (previousStoragePath && previousStoragePath !== filePath) {
    await removeUploadedObject(previousStorageBucket, previousStoragePath);
  }

  revalidatePath("/student-dashboard");

  return createStudentDashboardFormState({
    success: true,
    error: null,
    reportTypeId: formType.id,
    submissionKind: "file",
    submission: {
      reportTypeId: formType.id,
      isUploaded: true,
      fileName: documentFile.name,
      videoLink: null,
    },
  });
}

export async function removeStudentDashboardFormAction(
  reportTypeId: number,
): Promise<StudentDashboardFormActionState> {
  if (!Number.isInteger(reportTypeId) || reportTypeId < 1) {
    return createStudentDashboardFormState({
      error: "Please choose a valid form type.",
    });
  }

  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== "student") {
    return createStudentDashboardFormState({
      error: "Unauthorized. Please sign in again.",
      reportTypeId,
    });
  }

  const student = await getStudentById(user.id);

  if (!student) {
    return createStudentDashboardFormState({
      error: "Student account was not found.",
      reportTypeId,
    });
  }

  const supabase = await supabaseClient();
  const { data: formType, error: formTypeError } = await supabase
    .from("formtype")
    .select("id, name")
    .eq("id", reportTypeId)
    .limit(1)
    .maybeSingle();

  if (formTypeError) {
    return createStudentDashboardFormState({
      error: `Failed to validate form type: ${formTypeError.message}`,
      reportTypeId,
    });
  }

  if (!formType) {
    return createStudentDashboardFormState({
      error: "The selected form type does not exist.",
      reportTypeId,
    });
  }

  const { data: existingSubmission, error: existingSubmissionError } =
    await supabase
      .from("form")
      .select("id, url, data")
      .eq("studentid", student.id)
      .eq("formtypeid", formType.id)
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

  if (existingSubmissionError) {
    return createStudentDashboardFormState({
      error: `Failed to load the current submission: ${existingSubmissionError.message}`,
      reportTypeId: formType.id,
    });
  }

  const submissionData = asRecord(existingSubmission?.data);
  const submissionKind =
    typeof submissionData?.submissionKind === "string" &&
    submissionData.submissionKind === "video"
      ? "video"
      : formType.name.toLowerCase().includes("presentation")
        ? "video"
        : "file";

  if (!existingSubmission) {
    return createStudentDashboardFormState({
      success: true,
      error: null,
      reportTypeId: formType.id,
      submissionKind,
      submission: {
        reportTypeId: formType.id,
        isUploaded: false,
        fileName: null,
        videoLink: null,
      },
    });
  }

  const previousStoragePath =
    typeof submissionData?.storagePath === "string"
      ? submissionData.storagePath
      : typeof existingSubmission.url === "string" &&
          existingSubmission.url &&
          !isAbsoluteUrl(existingSubmission.url)
        ? existingSubmission.url
        : null;
  const previousStorageBucket =
    typeof submissionData?.storageBucket === "string"
      ? submissionData.storageBucket
      : studentDocumentBucketName;

  const { error: deleteError } = await supabase
    .from("form")
    .delete()
    .eq("id", existingSubmission.id);

  if (deleteError) {
    return createStudentDashboardFormState({
      error: `Failed to remove ${formType.name}: ${deleteError.message}`,
      reportTypeId: formType.id,
      submissionKind,
    });
  }

  if (submissionKind === "file" && previousStoragePath) {
    await removeUploadedObject(previousStorageBucket, previousStoragePath);
  }

  revalidatePath("/student-dashboard");

  return createStudentDashboardFormState({
    success: true,
    error: null,
    reportTypeId: formType.id,
    submissionKind,
    submission: {
      reportTypeId: formType.id,
      isUploaded: false,
      fileName: null,
      videoLink: null,
    },
  });
}
