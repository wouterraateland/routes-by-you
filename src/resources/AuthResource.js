import { setCookie } from "utils/cookies";
import { supabase } from "utils/supabase";
import ObservableResource from "./ObservableResource";

import Router from "next/router";

export default class AuthResource extends ObservableResource {
  constructor() {
    super(
      new Promise((resolve) => {
        supabase.auth.refreshSession().then(() => {
          const session = supabase.auth.session();
          this.persistSession(session);
          resolve({ session, user: session?.user ?? null });
        });
      })
    );
    supabase.auth.onAuthStateChange(async (event, session) => {
      this.persistSession(session);
      this.onNext({ session, user: session?.user ?? null });
      if (event === "PASSWORD_RECOVERY") {
        Router.push("/auth/reset-password");
      }
    });
  }

  persistSession(session) {
    setCookie(
      "sb:token",
      session?.access_token ?? null,
      session?.expires_in ?? null
    );
  }
}

export const authResource = new AuthResource();
