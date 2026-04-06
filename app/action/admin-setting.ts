"use server";

import { auth } from "@/auth";
import {
  getAdminById,
  updateAdminPassword,
  validateAdminCredentials,
} from "./admin";

export type AdminPasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type AdminPasswordFieldErrors = Partial<
  Record<keyof AdminPasswordRequest, string>
>;

export type AdminPasswordActionState = {
  success: boolean;
  error: string | null;
  fieldErrors?: AdminPasswordFieldErrors;
};

export async function changeAdminPasswordAction(
  values: AdminPasswordRequest,
): Promise<AdminPasswordActionState> {
  const currentPassword = values.currentPassword;
  const newPassword = values.newPassword;
  const confirmPassword = values.confirmPassword;
  const fieldErrors: AdminPasswordFieldErrors = {};

  if (!currentPassword) {
    fieldErrors.currentPassword = "Current password is required.";
  }

  if (!newPassword) {
    fieldErrors.newPassword = "New password is required.";
  } else if (newPassword.length < 6) {
    fieldErrors.newPassword = "New password must be at least 6 characters.";
  } else if (newPassword === currentPassword) {
    fieldErrors.newPassword =
      "New password must be different from the current password.";
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = "Please confirm the new password.";
  } else if (confirmPassword !== newPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please fix the password form errors.",
      fieldErrors,
    };
  }

  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== "admin") {
    return {
      success: false,
      error: "Unauthorized. Please sign in again.",
    };
  }

  const admin = await getAdminById(user.id);

  if (!admin) {
    return {
      success: false,
      error: "Admin account was not found.",
    };
  }

  const validAdmin = await validateAdminCredentials({
    username: admin.username,
    password: currentPassword,
  });

  if (!validAdmin || validAdmin.id !== admin.id) {
    return {
      success: false,
      error: "Current password is incorrect.",
      fieldErrors: {
        currentPassword: "Current password is incorrect.",
      },
    };
  }

  await updateAdminPassword(admin.id, newPassword);

  return {
    success: true,
    error: null,
  };
}
