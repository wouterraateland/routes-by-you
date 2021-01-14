import { setCookie } from "utils/cookies";
import { supabase } from "utils/supabase";
import ObservableResource from "./ObservableResource";

export default class AuthResource extends ObservableResource {
  constructor() {
    super(
      new Promise((resolve) => {
        supabase.auth.refreshSession().then(({ data: session, user }) => {
          this.persistSession(session);
          resolve({ session, user });
        });
      })
    );
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event, session);
      this.persistSession(session);
      this.onNext({ session, user: session?.user ?? null });
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
