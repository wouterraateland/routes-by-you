import { supabase } from "utils/supabase";

import Head from "next/head";
import Repeat from "components/icons/Repeat";
import Flash from "components/icons/Flash";
import Card from "components/ui/Card";
import Shell from "components/Shell";
import Route from "components/Route";

export default function UserPage({ user }) {
  return (
    <Shell>
      <Head>
        <title>{`${user.display_name} | Routes by You`}</title>
      </Head>
      <div className="max-w-xl mx-auto sm:py-4 sm:space-y-4">
        <div className="p-4 space-y-4 text-center">
          {user.avatar && (
            <img
              className="mx-auto w-24 h-24 rounded-full shadow-md"
              src={user.avatar}
            />
          )}
          <h1 className="text-xl font-bold">{user.display_name}</h1>
          <div className="flex items-center justify-center space-x-4">
            <Card className="flex items-center p-2 space-x-2 sm:p-4">
              <Flash className="h-4" />
              <p>
                Set {user.routes.length} route
                {user.routes.length === 1 ? "" : "s"}
              </p>
            </Card>
            <Card className="flex items-center p-2 space-x-2 sm:p-4">
              <Repeat className="h-4" />
              <p>
                Climbed {user.repeats.length} route
                {user.repeats.length === 1 ? "" : "s"}
              </p>
            </Card>
          </div>
        </div>
        {user.routes.map((route) => (
          <Route key={route.id} route={route} />
        ))}
      </div>
    </Shell>
  );
}

export async function getServerSideProps({ params }) {
  const { userId } = params;

  const { data, error } = await supabase
    .from("users")
    .select(
      `
        *,
        routes: routes!setter_id (
          *,
          setter: setter_id (*),
          repeats (*),
          location: location_id (*),
          location_string,
          comments: route_comments (*)
        ),
        repeats (id)
      `
    )
    .eq("id", userId)
    .order("created_at", { ascending: false, foreignTable: "routes" })
    .order("created_at", { ascending: false, foreignTable: "repeats" })
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { user: data } };
}
