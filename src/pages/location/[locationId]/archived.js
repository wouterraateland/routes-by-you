import { supabase } from "utils/supabase";
import { cleanUrl } from "utils/strings";

import Head from "next/head";
import Link from "next/link";
import Avatar from "components/ui/Avatar";
import Shell from "components/Shell";
import RouteList from "components/RouteList";

export default function LocationPage({ location }) {
  const activeRoutes = location.routes.filter((route) => route.active).length;
  const archivedRoutes = location.routes.filter((route) => !route.active)
    .length;

  return (
    <Shell>
      <Head>
        <title>{`${location.name} | Routes by You`}</title>
      </Head>
      <div className="max-w-xl mx-auto sm:py-4 sm:space-y-4">
        <div className="p-4 space-y-4 text-center">
          <Avatar
            className="mx-auto w-24 h-24 shadow-md"
            src={location.avatar}
            alt={location.name}
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
        </div>
        <div className="flex items-center w-full">
          <Link href={`/location/${location.id}/active`}>
            <a className="flex items-center justify-center space-x-2 flex-grow p-2 sm:p-4 border-b-2 border-transparent hover:bg-gray-100">
              {/* <Flash className="h-4" /> */}
              <p>
                {activeRoutes} active route
                {activeRoutes === 1 ? "" : "s"}
              </p>
            </a>
          </Link>
          <Link href={`/location/${location.id}/archived`}>
            <a className="flex items-center justify-center space-x-2 flex-grow p-2 sm:p-4 border-b-2 border-current text-blue-600 hover:bg-gray-100">
              {/* <Repeat className="h-4" /> */}
              <p>
                {archivedRoutes} archived route
                {archivedRoutes === 1 ? "" : "s"}
              </p>
            </a>
          </Link>
        </div>
        <RouteList filters={{ location_id: location.id, active: false }} />
      </div>
    </Shell>
  );
}

export async function getServerSideProps({ params }) {
  const { locationId } = params;

  const { data, error } = await supabase
    .from("locations")
    .select(`*, routes: routes!location_id (id, active)`)
    .eq("id", locationId)
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { location: data } };
}
