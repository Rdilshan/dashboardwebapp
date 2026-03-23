import type { Metadata } from "next";
import { StudentDashboardClient } from "./student-dashboard-client";

export const metadata: Metadata = {
  title: "Student Dashboard | Industrial Training Portal",
  description:
    "Track industrial training submissions and upload required student documents.",
};

export default function StudentDashboardPage() {
  return <StudentDashboardClient />;
}
