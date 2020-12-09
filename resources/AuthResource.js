import { supabase } from "utils/supabase";
import ObservableResource from "./ObservableResource";

export default class AuthResource extends ObservableResource {
  constructor() {
    super(
      new Promise((resolve) => {
        supabase.auth.refreshSession().then(() => {
          resolve({
            session: supabase.auth.session(),
            user: supabase.auth.user(),
          });
        });
      })
    );
    supabase.auth.onAuthStateChange((event, session) => {
      this.onNext({ session, user: session?.user ?? null });
    });
  }
}

export const authResource = new AuthResource();
