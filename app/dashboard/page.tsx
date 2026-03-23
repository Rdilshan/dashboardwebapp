import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Admin Dashboard | CV Portal",
  description:
    "Admin dashboard for managing industrial training CV submissions.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
