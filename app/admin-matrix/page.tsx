import type { Metadata } from "next";
import { AdminMatrixClient } from "./admin-matrix-client";

export const metadata: Metadata = {
  title: "Admin Submission Matrix | Industrial Training Portal",
  description:
    "Comprehensive tracking of all student document submissions with CSV export.",
};

export default function AdminMatrixPage() {
  return <AdminMatrixClient />;
}
