import { supabase, getSupabaseResource } from "utils/supabase";
import { api } from "utils/api";
import { routesCache } from "utils/routes";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import useResource from "hooks/useResource";
import PagedResource from "resources/PagedResource";

import SSRSuspense from "containers/SSRSuspense";
import ErrorBoundary from "containers/ErrorBoundary";

import Head from "next/head";
import Loader from "components/ui/Loader";
import Shell from "components/Shell";
import RouteFilters from "components/RouteFilters";
import RouteList from "components/RouteList";

export default function Feed({ auth }) {
  const router = useRouter();
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
    router.replace("/profile");
  }

  const freshRef = useRef(false);
  const params = useMemo(() => {
    const status = (
      router.query.status || "repeated,not_repeated,official,user_set,active"
    ).split(",");

    return {
      max_date: routesCache.maxDate,
      min_grade: router.query.min_grade,
      max_grade: router.query.max_grade,
      setter_id: router.query.setter_id,
      location_id: router.query.location_id,
      show_repeated: status.includes("repeated"),
      show_not_repeated: status.includes("not_repeated"),
      hide_active: !status.includes("active"),
      hide_archived: !status.includes("archived"),
      hide_official: !status.includes("official"),
      hide_not_official: !status.includes("user_set"),
      q: "",
    };
  }, [router.query, routesCache.maxDate]);
  const filter = Object.keys(params)
    .filter((key) => Boolean(params[key]))
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const routesResource = routesCache.read(filter, () => {
    freshRef.current = true;
    return new PagedResource(10, (offset, limit) =>
      api
        .get(`routes?${filter}&offset=${offset}&limit=${limit}`)
        .then((data) => ({ data, hasNext: data.length > 0 }))
    );
  });

  useEffect(() => {
    if (!freshRef.current) {
      routesResource.refresh();
    }
  }, [routesResource]);

  return (
    <Shell>
      <Head>
        <title>My feed | Routes by You</title>
      </Head>
      <div className="max-w-xl mx-auto sm:py-4 sm:space-y-4">
        <RouteFilters />
        <ErrorBoundary>
          <SSRSuspense fallback={<Loader className="text-blue" />}>
            <RouteList filters={params} />
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
