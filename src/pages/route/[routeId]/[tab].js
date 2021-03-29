import Router from "next/router";
import { api } from "utils/api";
import { supabase } from "utils/supabase";
import { pointsToFont, pointsToHsl } from "utils/grades";

import { useCallback, useEffect, useState } from "react";

import Head from "next/head";
import Cross from "components/icons/Cross";
import Button from "components/ui/Button";
import Tabs from "components/ui/Tabs";
import RouteMeta from "components/RouteMeta";
import RouteImage from "components/RouteImage";
import RepeatThumb from "components/RepeatThumb";
import RouteSummary from "components/RouteSummary";
import Comment from "components/Comment";
import CommentInput from "components/CommentInput";
import RouteLocator from "components/routes/Locator";

export default function ViewRoute({ auth, route: initialRoute }) {
  const [route, setRoute] = useState(initialRoute);
  const repeatsWithGrade = route.repeats.filter((repeat) => repeat.grade);
  const avgGrade =
    repeatsWithGrade.reduce((acc, repeat) => acc + repeat.grade, route.grade) /
    (repeatsWithGrade.length + 1);

  const refresh = useCallback(async () => {
    const freshRoute = await api.get(`route/${route.id}`);
    setRoute(freshRoute);
  }, [route.id]);

  useEffect(() => {
    const i = setInterval(refresh, 10000);
    return () => clearInterval(i);
  }, [refresh]);

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
                className="p-2 rounded-md"
                bgColor="white"
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
          <RouteSummary route={route} focused />
          <Tabs.Container>
            {route.geometry && (
              <Tabs.Tab
                href={`/route/${route.id}/location`}
                shallow
                scroll={false}
                replace
                label="Location"
              />
            )}
            <Tabs.Tab
              href={`/route/${route.id}/repeats`}
              shallow
              scroll={false}
              replace
              label={`${route.repeats.length} repeat${
                route.repeats.length === 1 ? "" : "s"
              }`}
            />
            <Tabs.Tab
              href={`/route/${route.id}/comments`}
              shallow
              scroll={false}
              replace
              label={`${route.comments.length} comment${
                route.comments.length === 1 ? "" : "s"
              }`}
            />
          </Tabs.Container>
          {Router.query.tab === "location" && route.geometry && (
            <RouteLocator route={route} />
          )}
          {Router.query.tab === "repeats" &&
            route.repeats.map((repeat) => (
              <RepeatThumb key={repeat.id} repeat={repeat} />
            ))}
          {Router.query.tab === "comments" && (
            <>
              <div className="p-2 space-y-2">
                {route.comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
              <CommentInput routeId={route.id} onSubmit={refresh} />
            </>
          )}
        </div>
        {route.setter_id === auth?.user?.id && (
          <div className="flex items-center space-x-4 p-4 sm:p-0">
            <Button
              className="w-full px-4 py-2 rounded-md text-red-600 font-bold border"
              bgColor="white"
              onClick={async () => {
                await api.delete("route", { body: { id: route.id } });
                Router.back();
              }}
            >
              Delete route
            </Button>
            <Button
              className="w-full px-4 py-2 rounded-md font-bold border"
              bgColor="white"
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
        repeats: repeats!route_id (
          *,
          user: user_id (*)
        ),
        location: location_id (*),
        comments: route_comments (
          *,
          user: user_id (*)
        ),
        reports: route_reports (*)
      `
    )
    .eq("id", routeId)
    .order("created_at", { ascending: false, foreignTable: "route_comments" })
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { route } };
}
