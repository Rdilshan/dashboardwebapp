import type { Metadata } from "next";
import { AdminSettingClient } from "./admin-setting-client";

export const metadata: Metadata = {
  title: "Admin Settings | Industrial Training Portal",
  description: "Admin settings and password management.",
};

export default function AdminSettingPage() {
  return <AdminSettingClient />;
}
