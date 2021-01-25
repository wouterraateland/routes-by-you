import Router from "next/router";

import { supabase, getSupabaseResource } from "utils/supabase";
import { api } from "utils/api";
import { routesCache } from "utils/routes";

import { useEffect, useMemo, useRef, useState } from "react";
import useResource from "hooks/useResource";
import PagedResource from "resources/PagedResource";

import Head from "next/head";
import Loader from "components/ui/Loader";
import Shell from "components/Shell";
import RouteFilters from "components/RouteFilters";
import FilteredRoutes from "components/FilteredRoutes";
import SSRSuspense from "containers/SSRSuspense";
import ErrorBoundary from "containers/ErrorBoundary";

export default function Feed({ auth }) {
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

  const freshRef = useRef(false);
  const [params, setParams] = useState({
    max_date: routesCache.maxDate,
    min_grade: undefined,
    max_grade: undefined,
    setter_id: undefined,
    location_id: undefined,
    show_repeated: true,
    show_not_repeated: true,
    q: "",
  });
  const filter = Object.keys(params)
    .filter((key) => Boolean(params[key]))
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const routesResource = routesCache.read(filter, () => {
    freshRef.current = true;
    return new PagedResource((page) =>
      api
        .get(`routes?${filter}&page=${page}&limit=10`)
        .then((data) => ({ data, hasNext: data.length > 0 }))
    );
  });

  useEffect(() => {
    if (!freshRef.current) {
      routesResource.refresh();
    }
  }, []);

  return (
    <Shell>
      <Head>
        <title>My feed | Routes by You</title>
      </Head>
      <div className="max-w-xl mx-auto sm:py-4 sm:space-y-4">
        <RouteFilters filters={params} setFilters={setParams} />
        <ErrorBoundary>
          <SSRSuspense fallback={<Loader className="text-blue" />}>
            <FilteredRoutes routesResource={routesResource} filters={params} />
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
