import type { Metadata } from "next";
import { StudentLoginClient } from "./student-login-client";

export const metadata: Metadata = {
  title: "Student Login | Industrial Training Portal",
  description: "Student access portal for tracking industrial training progress.",
};

export default function StudentLoginPage() {
  return <StudentLoginClient />;
}
