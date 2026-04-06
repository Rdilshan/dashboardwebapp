import { supabaseClient } from "@/utils/supabase/server";

export type AdminRecord = {
  id: number;
  username: string;
};

export type AdminLoginRequest = {
  username: string;
  password: string;
};

export const getAdminById = async (
  adminId: string | number,
): Promise<AdminRecord | null> => {
  const normalizedAdminId = String(adminId).trim();

  if (!normalizedAdminId) {
    return null;
  }

  const supabase = await supabaseClient();
  const { data, error } = await supabase
    .from("admin")
    .select("id, username")
    .eq("id", normalizedAdminId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch admin: ${error.message}`);
  }

  return data satisfies AdminRecord | null;
};

export const getAllAdmins = async (): Promise<AdminRecord[]> => {
  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("admin")
    .select("id, username")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch admins: ${error.message}`);
  }

  return data satisfies AdminRecord[];
};

export const validateAdminCredentials = async (
  credentials: AdminLoginRequest,
): Promise<AdminRecord | null> => {
  const username = credentials.username.trim();

  if (!username || !credentials.password) {
    return null;
  }

  const supabase = await supabaseClient();
  const { data, error } = await supabase
    .from("admin")
    .select("id, username")
    .eq("username", username)
    .eq("password", credentials.password)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate admin credentials: ${error.message}`);
  }

  return data satisfies AdminRecord | null;
};

export const updateAdminPassword = async (
  adminId: string | number,
  password: string,
) => {
  const normalizedAdminId = String(adminId).trim();

  if (!normalizedAdminId) {
    throw new Error("Admin ID is required.");
  }

  const supabase = await supabaseClient();
  const { error } = await supabase
    .from("admin")
    .update({ password })
    .eq("id", normalizedAdminId);

  if (error) {
    throw new Error(`Failed to update admin password: ${error.message}`);
  }
};
