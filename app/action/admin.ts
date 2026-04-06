import { supabaseClient } from "@/utils/supabase/server";

export type AdminRecord = {
  id: number;
  username: string;
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
