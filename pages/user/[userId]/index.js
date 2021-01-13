import { supabase } from "utils/supabase";

import Flash from "components/icons/Flash";
import Plus from "components/icons/Plus";
import Card from "components/ui/Card";
import Shell from "components/Shell";
import Route from "components/Route";

export default function UserPage({ user }) {
  return (
    <Shell>
      <div className="max-w-xl mx-auto sm:py-4 sm:space-y-4">
        <div className="p-4 space-y-4 text-center">
          <img
            className="mx-auto w-24 h-24 rounded-full shadow-md"
            src={user.avatar}
          />
          <h1 className="text-xl font-bold">{user.display_name}</h1>
          <div className="flex items-center justify-center space-x-4">
            <Card className="flex items-center space-x-2 p-4">
              <Plus className="h-4" />
              <p>
                Set {user.routes.length} route
                {user.routes.length === 1 ? "" : "s"}
              </p>
            </Card>
            <Card className="flex items-center space-x-2 p-4">
              <Flash filled className="h-4" />
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
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { user: data } };
}
