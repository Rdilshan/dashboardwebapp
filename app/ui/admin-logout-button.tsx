"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { adminLogoutAction } from "../action/auth";

type AdminLogoutButtonProps = {
  className: string;
};

function LogoutSubmitButton({ className }: AdminLogoutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
    >
      <LogOut className="h-4 w-4" strokeWidth={1.8} />
      {pending ? "Logging Out..." : "Logout"}
    </button>
  );
}

export function AdminLogoutButton({ className }: AdminLogoutButtonProps) {
  return (
    <form action={adminLogoutAction} className="inline-flex">
      <LogoutSubmitButton className={className} />
    </form>
  );
}
