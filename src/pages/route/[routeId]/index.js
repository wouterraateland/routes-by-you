import Router from "next/router";
import { api } from "utils/api";
import { supabase } from "utils/supabase";
import { pointsToFont, pointsToHsl } from "utils/grades";

import { useEffect, useState } from "react";

import Head from "next/head";
import Cross from "components/icons/Cross";
import Button from "components/ui/Button";
import RouteMeta from "components/RouteMeta";
import RouteImage from "components/RouteImage";
import RepeatThumb from "components/RepeatThumb";
import RouteSummary from "components/RouteSummary";

export default function ViewRoute({ auth, route }) {
  const [shared, setShared] = useState(false);
  useEffect(() => {
    if (shared) {
      const t = setTimeout(() => setShared(false), 1000);
      return () => clearTimeout(t);
    }
  }, [shared]);

  const repeatsWithGrade = route.repeats.filter((repeat) => repeat.grade);
  const avgGrade =
    repeatsWithGrade.reduce((acc, repeat) => acc + repeat.grade, route.grade) /
    (repeatsWithGrade.length + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{`${route.name} | Routes by You`}</title>
      </Head>
      <div className="sm:py-4 max-w-xl mx-auto sm:space-y-4">
        <div className="pb-4 sm:pb-0 sm:rounded-md sm:shadow-md bg-white">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-4">
              <Button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={() => Router.back()}
              >
                <Cross className="h-4" direction="left" />
              </Button>
              <RouteMeta route={route} />
            </div>
            <p
              className="text-xl font-black text-white rounded-full px-2"
              style={{ backgroundColor: pointsToHsl(avgGrade) }}
            >
              {pointsToFont(avgGrade)}
            </p>
          </div>
          <RouteImage route={route} />
          <RouteSummary route={route} />
          <div>
            {route.repeats.length > 0 && (
              <div className="pt-2 px-2 sm:px-4">
                <h2 className="text-lg font-bold">Repeats</h2>
              </div>
            )}
            {route.repeats.map((repeat) => (
              <RepeatThumb key={repeat.id} repeat={repeat} />
            ))}
          </div>
        </div>
        {route.setter_id === auth?.user?.id && (
          <div className="flex items-center space-x-4 p-4 sm:p-0">
            <Button
              className="w-full px-4 py-2 rounded-md text-red-600 font-bold border bg-white hover:bg-gray-100"
              onClick={async () => {
                await api.delete("route", { body: { id: route.id } });
                Router.back();
              }}
            >
              Delete route
            </Button>
            <Button
              className="w-full px-4 py-2 rounded-md font-bold border bg-white hover:bg-gray-100"
              onClick={() => Router.push(`/route/${route.id}/edit`)}
            >
              Edit route
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
ViewRoute.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};

export async function getServerSideProps({ params }) {
  const { routeId } = params;

  const { data: route, error } = await supabase
    .from("routes")
    .select(
      `
        *,
        setter: setter_id (*),
        repeats (
          *,
          user:user_id (*)
        ),
        location: location_id (*),
        comments: route_comments (*),
        reports: route_reports (*)
      `
    )
    .eq("id", routeId)
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { route } };
}
