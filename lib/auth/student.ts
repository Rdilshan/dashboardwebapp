import { supabaseClient } from "@/utils/supabase/server";

export type StudentRecord = {
  id: number;
  name: string;
  email: string;
  indexNumber: string;
  hasCv: boolean;
};

export type StudentLoginRequest = {
  indexNumber: string;
  password: string;
};

type StudentRow = {
  id: number;
  name: string;
  email: string;
  index_number: string;
  ishascv: boolean;
};

const mapStudentRecord = (student: StudentRow): StudentRecord => {
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    indexNumber: student.index_number,
    hasCv: student.ishascv,
  };
};

export const getStudentRedirectPath = (
  student: Pick<StudentRecord, "hasCv">,
) => {
  return student.hasCv ? "/student-dashboard" : "/submit-cv";
};

export const getStudentById = async (
  studentId: string | number,
): Promise<StudentRecord | null> => {
  const normalizedStudentId = String(studentId).trim();

  if (!normalizedStudentId) {
    return null;
  }

  const supabase = await supabaseClient();
  const { data, error } = await supabase
    .from("student")
    .select("id, name, email, index_number, ishascv")
    .eq("id", normalizedStudentId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch student: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapStudentRecord(data);
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
    .select("id, name, email, index_number, ishascv")
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

  return mapStudentRecord(data);
};
