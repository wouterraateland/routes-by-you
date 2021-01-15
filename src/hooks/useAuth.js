import { authResource } from "resources/AuthResource";

import useResource from "hooks/useResource";

export default function useAuth() {
  return useResource(authResource);
}
