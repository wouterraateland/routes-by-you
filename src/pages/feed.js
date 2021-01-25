import { supabase, getSupabaseResource } from "utils/supabase";
import { Cache } from "utils/caching";
import Router from "next/router";

import { useMemo } from "react";
import useResource from "hooks/useResource";

import Head from "next/head";
import Loader from "components/ui/Loader";
import Shell from "components/Shell";
import FilteredRoutes from "components/FilteredRoutes";
import SSRSuspense from "containers/SSRSuspense";
import ErrorBoundary from "containers/ErrorBoundary";

export default function Feed({ auth }) {
  const cache = useMemo(() => new Cache(), []);
  const profileResource = useMemo(
    () =>
      getSupabaseResource(
        supabase.from("users").select("*").eq("id", auth.user.id),
        {
          single: true,
        }
      ),
    [auth.user.id]
  );
  const profile = useResource(profileResource);
  if (!profile.display_name) {
    Router.replace("/profile");
  }

  return (
    <Shell>
      <Head>
        <title>My feed | Routes by You</title>
      </Head>
      <div className="max-w-xl mx-auto sm:py-4 sm:space-y-4">
        <ErrorBoundary>
          <SSRSuspense fallback={<Loader className="text-blue" />}>
            <FilteredRoutes cache={cache} />
          </SSRSuspense>
        </ErrorBoundary>
      </div>
    </Shell>
  );
}
Feed.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};
