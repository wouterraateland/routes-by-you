import { supabase, getSupabaseResource } from "utils/supabase";
import { redirectIfNotAuthenticated } from "utils/auth";
import Router from "next/router";

import { useMemo } from "react";
import useAuth from "hooks/useAuth";
import useResource from "hooks/useResource";

import Head from "next/head";
import Shell from "components/Shell";
import Route from "components/Route";

export default function Dashboard({ routes, error }) {
  const { user } = useAuth(redirectIfNotAuthenticated);
  const userId = user?.id;
  const profileResource = useMemo(
    () =>
      getSupabaseResource(supabase.from("users").select("*").eq("id", userId), {
        single: true,
      }),
    [userId]
  );
  const profile = useResource(profileResource);
  if (!profile.display_name) {
    Router.replace("/profile");
  }

  return (
    <Shell>
      <Head>
        <title>Dashboard | Routes by You</title>
      </Head>
      <div className="max-w-xl mx-auto sm:py-4 sm:space-y-4">
        {error ? (
          <p className="px-4 py-2 rounded-md bg-red-100 text-red-600">
            {error.message}
          </p>
        ) : (
          routes.map((route) => <Route key={route.id} route={route} />)
        )}
      </div>
    </Shell>
  );
}

export async function getServerSideProps() {
  const { data, error } = await supabase
    .from("routes")
    .select(
      `
      *,
      setter: setter_id (*),
      repeats (*),
      location: location_id (*),
      comments: route_comments (*)
    `
    )
    .order("created_at", { ascending: false });

  return { props: { error, routes: data } };
}
