import Router from "next/router";
import { authResource } from "resources/AuthResource";

import { useEffect } from "react";
import useResource from "hooks/useResource";

export default function useAuthRedirect(predicate, to) {
  const auth = useResource(authResource);

  useEffect(() => {
    if (predicate(auth)) {
      Router.push(to);
    }
  }, [predicate, auth, to]);
}
