import { NextResponse } from "next/server";
import { auth } from "@/auth";

type AppRole = "admin" | "student";

const adminRoutePrefixes = [
  "/dashboard",
  "/admin-hub",
  "/admin-matrix",
  "/admin-setting",
  "/logout",
];

const studentRoutePrefixes = ["/student-dashboard"];

const matchesRoutePrefix = (pathname: string, prefixes: string[]) => {
  return prefixes.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
};

const getDefaultPathForRole = (role?: AppRole) => {
  if (role === "admin") {
    return "/dashboard";
  }

  if (role === "student") {
    return "/student-dashboard";
  }

  return "/";
};

export default auth((request) => {
  const { pathname, origin } = request.nextUrl;
  const user = request.auth?.user;
  const isAuthenticated = Boolean(user);
  const role = user?.role;

  if ((pathname === "/login" || pathname === "/student-login") && isAuthenticated) {
    return NextResponse.redirect(new URL(getDefaultPathForRole(role), origin));
  }

  if (matchesRoutePrefix(pathname, adminRoutePrefixes)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL(getDefaultPathForRole(role), origin));
    }
  }

  if (matchesRoutePrefix(pathname, studentRoutePrefixes)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/student-login", origin));
    }

    if (role !== "student") {
      return NextResponse.redirect(new URL(getDefaultPathForRole(role), origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|json|woff|woff2|ttf|otf|eot|wasm)$).*)",
  ],
};
