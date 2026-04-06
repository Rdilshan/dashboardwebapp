import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const createClient = (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot persist response cookies directly.
          // The proxy keeps auth cookies refreshed for request-time renders.
        }
      },
    },
  });
};

export const supabaseClient = async ()=> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  return supabase
};
