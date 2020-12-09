import { supabase } from "utils/supabase";

import Shell from "components/Shell";
import Route from "components/Route";

export default function Dashboard({ routes, error }) {
  return (
    <Shell>
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
  const { data, error } = await supabase.from("routes").select(`
      id,
      image,
      name,
      description,
      grade,
      created_at,
      type,
      setter: setter_id (*),
      repeats (*),
      location: location_id (*),
      location_string,
      comments: route_comments (*)
    `);

  return { props: { error, routes: data } };
}
