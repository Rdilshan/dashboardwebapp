import { NextResponse } from "next/server";
import { auth } from "@/auth";

const protectedRoutePrefixes = [
  "/dashboard",
  "/admin-hub",
  "/admin-matrix",
  "/admin-setting",
  "/logout",
];

const isProtectedRoute = (pathname: string) => {
  return protectedRoutePrefixes.some((route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });
};

export default auth((request) => {
  const { pathname, origin } = request.nextUrl;
  const isAuthenticated = Boolean(request.auth?.user);

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|json|woff|woff2|ttf|otf|eot|wasm)$).*)",
  ],
};
