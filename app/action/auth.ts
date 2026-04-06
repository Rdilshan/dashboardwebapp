"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginActionState = {
  success: boolean;
  error: string | null;
  redirectTo: string | null;
  username: string;
};

export type StudentLoginRequest = {
  indexNumber: string;
  password: string;
};

export type StudentLoginActionState = {
  success: boolean;
  error: string | null;
  redirectTo: string | null;
  indexNumber: string;
};

const toRelativeUrl = (value: string) => {
  const url = new URL(value, "http://localhost");
  return `${url.pathname}${url.search}${url.hash}`;
};

export async function AuthLoginAction(
  credentials: LoginRequest,
): Promise<LoginActionState> {
  const username = credentials.username.trim();
  const password = credentials.password;

  if (!username || !password) {
    return {
      success: false,
      error: "Username and password are required.",
      redirectTo: null,
      username,
    };
  }

  try {
    const result = await signIn("admin-credentials", {
      username,
      password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    const redirectTo = toRelativeUrl(String(result ?? "/dashboard"));
    const redirectUrl = new URL(redirectTo, "http://localhost");
    const authError = redirectUrl.searchParams.get("error");

    if (authError) {
      return {
        success: false,
        error: "Invalid username or password.",
        redirectTo: null,
        username,
      };
    }

    return {
      success: true,
      error: null,
      redirectTo,
      username,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Unable to sign in with those credentials.",
        redirectTo: null,
        username,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Server error",
      redirectTo: null,
      username,
    };
  }
}

export async function studentLoginAction(
  credentials: StudentLoginRequest,
): Promise<StudentLoginActionState> {
  const indexNumber = credentials.indexNumber.trim();
  const password = credentials.password;

  if (!indexNumber || !password) {
    return {
      success: false,
      error: "Index number and password are required.",
      redirectTo: null,
      indexNumber,
    };
  }

  try {
    const result = await signIn("student-credentials", {
      indexNumber,
      password,
      redirect: false,
      redirectTo: "/student-dashboard",
    });

    const redirectTo = toRelativeUrl(String(result ?? "/student-dashboard"));
    const redirectUrl = new URL(redirectTo, "http://localhost");
    const authError = redirectUrl.searchParams.get("error");

    if (authError) {
      return {
        success: false,
        error: "Invalid index number or password.",
        redirectTo: null,
        indexNumber,
      };
    }

    return {
      success: true,
      error: null,
      redirectTo,
      indexNumber,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Unable to sign in with those credentials.",
        redirectTo: null,
        indexNumber,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Server error",
      redirectTo: null,
      indexNumber,
    };
  }
}

export async function adminLoginFormAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  return AuthLoginAction({
    username: String(formData.get("username") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
}

export async function studentLoginFormAction(
  _previousState: StudentLoginActionState,
  formData: FormData,
): Promise<StudentLoginActionState> {
  return studentLoginAction({
    indexNumber: String(formData.get("index_number") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
}

export async function adminLogoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function studentLogoutAction() {
  await signOut({ redirectTo: "/student-login" });
}
