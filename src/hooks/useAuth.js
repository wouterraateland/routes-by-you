import { noop } from "utils/functions";

import { authResource } from "resources/AuthResource";

import useResource from "hooks/useResource";

export default function useAuth(fn = noop) {
  const auth = useResource(authResource);
  if (typeof window !== "undefined") {
    fn(auth);
  }
  return auth;
}
