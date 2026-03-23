import type { Metadata } from "next";
import { StudentSignupClient } from "./student-signup-client";

export const metadata: Metadata = {
  title: "Student Registration | Industrial Training Portal",
  description: "Register an account for the student dashboard.",
};

export default function StudentSignupPage() {
  return <StudentSignupClient />;
}
