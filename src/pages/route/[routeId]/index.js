import cx from "classnames";
import { formatDistanceToNow } from "date-fns";
import Router from "next/router";
import { api } from "utils/api";
import { supabase } from "utils/supabase";
import { pointsToFont, pointsToHsl } from "utils/grades";
import { copyTextToClipboard } from "utils/strings";

import { useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import Camera from "components/icons/Camera";
import Check from "components/icons/Check";
import Cross from "components/icons/Cross";
import Repeat from "components/icons/Repeat";
import Share from "components/icons/Share";
import StarRating from "components/StarRating";
import Button from "components/ui/Button";
import RouteImage from "components/RouteImage";
import RepeatThumb from "components/RepeatThumb";

export default function RepeatRoute({ auth, route }) {
  const [shared, setShared] = useState(false);
  useEffect(() => {
    if (shared) {
      const t = setTimeout(() => setShared(false), 1000);
      return () => clearTimeout(t);
    }
  }, [shared]);

  const repeated = route.repeats.some(
    (repeat) => repeat.user_id === auth?.user?.id
  );
  const repeatsWithGrade = route.repeats.filter((repeat) => repeat.grade);
  const avgGrade =
    repeatsWithGrade.reduce((acc, repeat) => acc + repeat.grade, route.grade) /
    (repeatsWithGrade.length + 1);
  const repeatsWithRating = route.repeats.filter((repeat) => repeat.rating);
  const avgRating = repeatsWithRating.length
    ? repeatsWithRating.reduce((acc, repeat) => acc + repeat.rating, 0) /
      repeatsWithRating.length
    : null;
  const repeatsWithVideo = route.repeats.filter((repeat) => repeat.video);

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
              {route.setter.avatar && (
                <Link href={`/user/${route.setter.id}`}>
                  <a>
                    <img
                      className="w-10 h-10 rounded-full"
                      src={route.setter.avatar}
                    />
                  </a>
                </Link>
              )}
              <div>
                <p className="font-bold">
                  <Link href={`/user/${route.setter.id}`}>
                    <a className="hover:underline">
                      {route.setter.display_name}
                    </a>
                  </Link>
                </p>
                {route.location ? (
                  <p className="text-sm text-blue-600 hover:underline">
                    <Link href={`/location/${route.location.id}`}>
                      <a>{route.location.name}</a>
                    </Link>
                  </p>
                ) : (
                  route.location_string && (
                    <p className="text-sm text-gray-500">
                      {route.location_string}
                    </p>
                  )
                )}
              </div>
            </div>
            <p
              className="text-xl font-black text-white rounded-full px-2"
              style={{ backgroundColor: pointsToHsl(avgGrade) }}
            >
              {pointsToFont(avgGrade)}
            </p>
          </div>
          <RouteImage route={route} />
          <div className="p-2 sm:px-4">
            <div className="flex items-start justify-between space-x-2">
              <div>
                <h2 className="text-2xl font-black">{route.name}</h2>
                {route.repeats.length > 0 ? (
                  <div className="flex space-x-2 items-center text-gray-500 text-sm">
                    <span>
                      {route.repeats.length} repeat
                      {route.repeats.length === 1 ? "" : "s"}
                    </span>
                    {repeatsWithRating.length > 0 && (
                      <StarRating value={avgRating} className="h-4" />
                    )}
                    {repeatsWithVideo.length > 0 && (
                      <span className="flex items-center space-x-1">
                        <Camera filled className="h-3" />
                        <span>
                          {repeatsWithVideo.length} video
                          {repeatsWithVideo.length === 1 ? "" : "s"}
                        </span>
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Not repeated yet</p>
                )}
              </div>
              <div className="my-1 flex items-center space-x-2">
                <Link href={`/route/${route.id}/repeat`}>
                  <a
                    className={cx(
                      "p-2",
                      repeated
                        ? "rounded-full bg-green-600 hover:bg-green-700 text-white font-bold"
                        : "rounded-md hover:bg-gray-100 text-gray-500"
                    )}
                  >
                    {repeated ? (
                      <Check className="h-6" />
                    ) : (
                      <Repeat className="h-6" />
                    )}
                  </a>
                </Link>
                <Button
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
                  onClick={async () => {
                    await copyTextToClipboard(
                      `${process.env.NEXT_PUBLIC_PUBLIC_URL}/route/${route.id}`
                    );
                    setShared(true);
                  }}
                  hint={shared ? "Link copied!" : "Share route"}
                >
                  <Share className="h-6" />
                </Button>
              </div>
            </div>
            {route.description && <p className="py-2">{route.description}</p>}
            <p className="text-xs text-gray-400 uppercase">
              {formatDistanceToNow(new Date(route.created_at))} ago
            </p>
          </div>
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
          <div className="p-4 sm:p-0">
            <Button
              bgColor="red"
              className="w-full px-4 py-2 rounded-md text-white font-bold"
              onClick={async () => {
                await api.delete("route", { body: { id: route.id } });
                Router.back();
              }}
            >
              Delete route
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

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
        location_string,
        comments: route_comments (*)
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
