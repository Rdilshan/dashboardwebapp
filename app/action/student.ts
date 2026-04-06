"use server";

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

const emailPattern = /^\S+@\S+\.\S+$/;

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
