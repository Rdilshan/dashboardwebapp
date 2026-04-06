"use server";

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

const emailPattern = /^\S+@\S+\.\S+$/;
const cvBucketName = process.env.SUPABASE_CV_BUCKET?.trim() || "cv";
const maxCvFileSize = 10 * 1024 * 1024;
const allowedCvExtensions = new Set(["pdf", "doc", "docx"]);

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

  return sanitizedStem || "cv";
};

const removeUploadedCv = async (filePath: string) => {
  const supabase = await supabaseClient();
  await supabase.storage.from(cvBucketName).remove([filePath]);
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

  if (cvFile && cvFile.size > maxCvFileSize) {
    fieldErrors.cvFile = "CV must be 10 MB or smaller.";
  }

  if (cvFile && !allowedCvExtensions.has(fileExtension)) {
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

  console.log("filepath -->",filePath)
  console.log("cvFile -->",cvFile)


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

  return {
    success: true,
    error: null,
    redirectTo: "/student-dashboard",
    values: emptySubmitCvValues(),
  };
}

