import { supabase } from "utils/supabase";

import Head from "next/head";
import Repeat from "components/icons/Repeat";
import RoutesByYou from "components/icons/RoutesByYou";
import Avatar from "components/ui/Avatar";
import Tabs from "components/ui/Tabs";
import Username from "components/Username";
import Shell from "components/Shell";
import RouteList from "components/RouteList";

export default function UserRoutes({ user }) {
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
        <Tabs.Container>
          <Tabs.Tab
            href={`/user/${user.id}/routes`}
            Icon={RoutesByYou}
            label={`Set ${user.routes.length} route${
              user.routes.length === 1 ? "" : "s"
            }`}
          />
          <Tabs.Tab
            href={`/user/${user.id}/repeats`}
            Icon={Repeat}
            label={`Climbed ${user.repeats.length} route${
              user.repeats.length === 1 ? "" : "s"
            }`}
          />
        </Tabs.Container>
        <RouteList filters={{ setter_id: user.id }} />
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
        repeats: repeats!user_id (id)
      `
    )
    .eq("id", userId)
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { user: data } };
}
