import cx from "classnames";
import { pointsToFont, pointsToHsl } from "utils/grades";
import { formatDistanceToNow } from "date-fns";

import { authResource } from "resources/AuthResource";

import useResource from "hooks/useResource";

import Link from "next/link";
import Repeat from "components/icons/Repeat";
import Camera from "components/icons/Camera";
import StarRating from "components/StarRating";

export default function Route({ route }) {
  const { user } = useResource(authResource);

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
    <Link href={`/route/${route.id}`}>
      <a className="block">
        <div className="pb-4 sm:pb-0 sm:rounded-md sm:shadow-md bg-white">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-4">
              <Link href={`/user/${route.setter.id}`}>
                <a>
                  <img
                    className="w-10 h-10 rounded-full"
                    src={route.setter.avatar}
                  />
                </a>
              </Link>
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
          <img className="w-full" src={route.image} />
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
              <Link href={`/route/${route.id}/repeat`}>
                <a
                  className={cx(
                    "my-1 p-2 rounded-md",
                    repeated
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "hover:bg-gray-100 text-gray-500"
                  )}
                >
                  <Repeat className="h-6" />
                </a>
              </Link>
            </div>
            {route.description && <p className="py-2">{route.description}</p>}
            <p className="text-xs text-gray-400 uppercase">
              {formatDistanceToNow(new Date(route.created_at))} ago
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
}
