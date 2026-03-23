import type { Metadata } from "next";
import { ForgotPasswordClient } from "./forgot-password-client";

export const metadata: Metadata = {
  title: "Forgot Password | Industrial Training Portal",
  description: "Reset a student account password via recovery email.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
