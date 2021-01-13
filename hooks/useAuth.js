import { noop } from "utils/functions";

import { authResource } from "resources/AuthResource";

import useResource from "hooks/useResource";

export default function useAuth(fn = noop) {
  const auth = useResource(authResource);
  fn(auth);
  return auth;
}
