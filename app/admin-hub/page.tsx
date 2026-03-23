import type { Metadata } from "next";
import { AdminHubClient } from "./admin-hub-client";

export const metadata: Metadata = {
  title: "Admin Hub | Industrial Training Portal",
  description:
    "Coordinator hub for managing industrial training dashboards and admin tools.",
};

export default function AdminHubPage() {
  return <AdminHubClient />;
}
