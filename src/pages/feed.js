import { supabase, getSupabaseResource } from "utils/supabase";
import Router from "next/router";

import { useMemo } from "react";
import useResource from "hooks/useResource";

import Head from "next/head";
import Shell from "components/Shell";
import Route from "components/Route";

export default function Feed({ auth, routes, error }) {
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
Feed.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};

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
