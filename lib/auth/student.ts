import { supabaseClient } from "@/utils/supabase/server";

export type StudentRecord = {
  id: number;
  name: string;
  email: string;
  indexNumber: string;
};

export type StudentLoginRequest = {
  indexNumber: string;
  password: string;
};

export const validateStudentCredentials = async (
  credentials: StudentLoginRequest,
): Promise<StudentRecord | null> => {
  const indexNumber = credentials.indexNumber.trim();

  if (!indexNumber || !credentials.password) {
    return null;
  }

  const supabase = await supabaseClient();
  const { data, error } = await supabase
    .from("student")
    .select("id, name, email, index_number")
    .eq("index_number", indexNumber)
    .eq("password", credentials.password)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate student credentials: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    indexNumber: data.index_number,
  };
};
