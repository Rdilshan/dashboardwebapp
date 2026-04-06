import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { StudentDashboardClient } from "./student-dashboard-client";
import { auth } from "@/auth";
import { getStudentById } from "@/lib/auth/student";

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

  return <StudentDashboardClient />;
}
