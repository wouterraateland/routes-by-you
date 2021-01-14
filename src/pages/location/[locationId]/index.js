import { supabase } from "utils/supabase";
import { cleanUrl } from "utils/strings";

import Card from "components/ui/Card";
import Shell from "components/Shell";
import Route from "components/Route";

export default function LocationPage({ location }) {
  return (
    <Shell>
      <div className="max-w-xl mx-auto sm:py-4 sm:space-y-4">
        <div className="p-4 space-y-4 text-center">
          <img
            className="mx-auto w-24 h-24 rounded-full shadow-md"
            src={location.logo}
          />
          <div>
            <h1 className="text-xl font-bold">{location.name}</h1>
            {location.url && (
              <a
                href={location.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {cleanUrl(location.url)}
              </a>
            )}
          </div>
          <div className="flex justify-center">
            <Card className="flex items-center space-x-2 p-4">
              <p>
                {location.routes.length} active route
                {location.routes.length === 1 ? "" : "s"}
              </p>
            </Card>
          </div>
        </div>
        {location.routes.map((route) => (
          <Route key={route.id} route={route} />
        ))}
      </div>
    </Shell>
  );
}

export async function getServerSideProps({ params }) {
  const { locationId } = params;

  const { data, error } = await supabase
    .from("locations")
    .select(
      `
        *,
        routes: routes!location_id (
          *,
          setter: setter_id (*),
          repeats (*),
          location: location_id (*),
          location_string,
          comments: route_comments (*)
        )
      `
    )
    .eq("id", locationId)
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { location: data } };
}