import { supabase } from "utils/supabase";

import Head from "next/head";
import Link from "next/link";
import Repeat from "components/icons/Repeat";
import Flash from "components/icons/Flash";
import Avatar from "components/ui/Avatar";
import Username from "components/Username";
import Shell from "components/Shell";
import Route from "components/Route";

export default function UserRepeats({ user }) {
  return (
    <Shell>
      <Head>
        <title>{`${user.display_name} | Routes by You`}</title>
      </Head>
      <div className="max-w-xl mx-auto sm:py-4 sm:space-y-4">
        <div className="p-4 space-y-4 text-center">
          <Avatar
            className="mx-auto w-24 h-24 shadow-md"
            src={user.avatar}
            alt={user.display_name}
          />
          <h1 className="text-xl font-bold">
            <Username user={user} />
          </h1>
        </div>
        <div className="flex items-center">
          <Link href={`/user/${user.id}/routes`}>
            <a className="flex items-center justify-center space-x-2 flex-grow p-2 sm:p-4 border-b-2 border-transparent hover:bg-gray-100">
              <Flash className="h-4" />
              <p>
                Set {user.routes.length} route
                {user.routes.length === 1 ? "" : "s"}
              </p>
            </a>
          </Link>
          <Link href={`/user/${user.id}/repeats`}>
            <a className="flex items-center justify-center space-x-2 flex-grow p-2 sm:p-4 border-b-2 border-current text-blue-600 hover:bg-gray-100">
              <Repeat className="h-4" />
              <p>
                Climbed {user.repeats.length} route
                {user.repeats.length === 1 ? "" : "s"}
              </p>
            </a>
          </Link>
        </div>
        <div className="divide-y sm:space-y-2 sm:divide-y-0 border-t border-b sm:border-0">
          {user.repeats.map((repeat) => (
            <Route key={repeat.id} route={repeat.route} />
          ))}
        </div>
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
        routes: routes!setter_id (id),
        repeats (
          *,
          route: route_id (
            *,
            setter: setter_id (*),
            repeats (*),
            location: location_id (*),
            location_string,
            comments: route_comments (*),
            reports: route_reports (*)
          )
        )
      `
    )
    .eq("id", userId)
    .order("created_at", { ascending: false, foreignTable: "repeats" })
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { user: data } };
}
