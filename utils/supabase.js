import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_API_URL,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY
);

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  window.supabase = supabase;
}
