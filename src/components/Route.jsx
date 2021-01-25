import cx from "classnames";
import { formatDistanceToNow } from "date-fns";
import { pointsToFont, pointsToHsl } from "utils/grades";
import { copyTextToClipboard } from "utils/strings";

import { authResource } from "resources/AuthResource";

import { useEffect, useState } from "react";
import useResource from "hooks/useResource";

import Link from "next/link";
import Camera from "components/icons/Camera";
import Check from "components/icons/Check";
import Repeat from "components/icons/Repeat";
import Share from "components/icons/Share";
import Avatar from "components/ui/Avatar";
import Button from "components/ui/Button";
import StarRating from "components/StarRating";
import RouteImage from "components/RouteImage";

export default function Route({ route }) {
  const { user } = useResource(authResource);

  const [shared, setShared] = useState(false);
  useEffect(() => {
    if (shared) {
      const t = setTimeout(() => setShared(false), 1000);
      return () => clearTimeout(t);
    }
  }, [shared]);

  const repeated = route.repeats.some((repeat) => repeat.user_id === user?.id);
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
    <div className="pb-4 sm:pb-0 sm:rounded-md sm:shadow-md bg-white">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-4">
          {route.setter.avatar && (
            <Link href={`/user/${route.setter.id}`}>
              <a>
                <Avatar
                  className="w-10 h-10"
                  src={route.setter.avatar}
                  alt={route.setter.display_name}
                />
              </a>
            </Link>
          )}
          <div>
            <p className="font-bold">
              <Link href={`/user/${route.setter.id}`}>
                <a className="hover:underline">{route.setter.display_name}</a>
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
                <p className="text-sm text-gray-500">{route.location_string}</p>
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
      <Link href={`/route/${route.id}`}>
        <a className="block">
          <RouteImage route={route} />
        </a>
      </Link>
      <div className="p-2">
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
    </div>
  );
}
