import { supabase } from "utils/supabase";

export async function getUser(req) {
  if (!req.cookies["sb:token"]) {
    return { user: null, error: "No auth token" };
  }

  const { data: user, error } = await supabase.auth.api.getUser(
    req.cookies["sb:token"]
  );
  if (error) {
    return { user: null, error };
  }
  if (user?.id?.length < 1) {
    return { user: null, error: "Unknown user" };
  }

  return { user, error: null };
}
