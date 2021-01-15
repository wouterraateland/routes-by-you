import { supabase } from "utils/supabase";
import { useEffect } from "react";
import Router from "next/router";

export default function Logout() {
  useEffect(() => {
    supabase.auth.signOut().then(() => Router.replace("/auth/login"));
  }, []);

  return null;
}
