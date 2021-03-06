import cx from "classnames";
import { formatDistanceToNow } from "date-fns";
import { api } from "utils/api";
import { copyTextToClipboard } from "utils/strings";
import { notify } from "utils/notifications";

import { useRef, useState } from "react";
import useAuth from "hooks/useAuth";

import Link from "next/link";
import Camera from "components/icons/Camera";
import Check from "components/icons/Check";
import Comment from "components/icons/Comment";
import Dots from "components/icons/Dots";
import Location from "components/icons/Location";
import Repeat from "components/icons/Repeat";
import RoutesByYou from "components/icons/RoutesByYou";
import Share from "components/icons/Share";
import Warn from "components/icons/Warn";
import Button from "components/ui/Button";
import FlyOut from "components/ui/FlyOut";
import StarRating from "components/StarRating";

const DESCRIPTION_PREVIEW_LENGTH = 100;

export default function RouteSummary({ route, focused }) {
  const actionsOriginRef = useRef();
  const { user } = useAuth();

  const [expanded, setExpanded] = useState(false);
  const [reportedBy, setReportedBy] = useState(
    route.reports.map((report) => report.user_id)
  );

  const repeats = route.repeats ?? [];
  const repeatCount = repeats.length;
  const repeated = repeats.some((repeat) => repeat.user_id === user?.id);
  const repeatsWithRating = repeats.filter((repeat) => repeat.rating);
  const avgRating = repeatsWithRating.length
    ? repeatsWithRating.reduce((acc, repeat) => acc + repeat.rating, 0) /
      repeatsWithRating.length
    : null;
  const repeatsWithVideo = repeats.filter((repeat) => repeat.video);

  return (
    <div className="p-2">
      {!route.active && (
        <p className="px-2 mb-2 rounded-md bg-yellow-500 font-bold">
          Route cannot be climbed anymore
        </p>
      )}
      <div className="flex items-start justify-between space-x-2">
        <div>
          <div className="flex items-center space-x-2">
            {reportedBy.length > 0 && (
              <Button
                className="rounded-md text-yellow-500"
                hint={`Reported as broken by ${reportedBy.length} user${
                  reportedBy.length === 1 ? "" : "s"
                }`}
              >
                <Warn className="h-4" />
              </Button>
            )}
            <h2 className="text-2xl font-black">{route.name}</h2>
            {route.official && (
              <Button className="text-blue-600" hint="Official route">
                <RoutesByYou className="h-4" color="blue" />
              </Button>
            )}
          </div>
          {repeatCount > 0 ? (
            <div className="flex flex-wrap -mx-1 items-center text-gray-500 text-sm">
              <span className="mx-1">
                {repeatCount} repeat
                {repeatCount === 1 ? "" : "s"}
              </span>
              {repeatsWithRating.length > 0 && (
                <div className="mx-1">
                  <StarRating value={avgRating} className="h-4" />
                </div>
              )}
              {repeatsWithVideo.length > 0 && (
                <span className="flex items-center space-x-1 mx-1">
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
          {!focused && (
            <Link href={`/route/${route.id}/comments#comment`}>
              <a className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
                <Comment className="h-6" />
              </a>
            </Link>
          )}
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
            ref={actionsOriginRef}
            className="p-2 rounded-md text-gray-500"
            bgColor="white"
          >
            <Dots className="h-6" direction="vertical" />
          </Button>
        </div>
        <FlyOut originRef={actionsOriginRef}>
          <Button
            className="flex items-center space-x-4 w-full p-4"
            bgColor="white"
            onClick={async () => {
              await copyTextToClipboard(
                `${process.env.NEXT_PUBLIC_PUBLIC_URL}/route/${route.id}`
              );
              notify("Link copied!", { timeout: 1000 });
            }}
          >
            <Share className="h-4" />
            <span>Copy link</span>
          </Button>
          {reportedBy.includes(user?.id) ? (
            <Button
              className="flex items-center space-x-4 w-full p-4"
              bgColor="white"
              onClick={async () => {
                try {
                  await api.delete("report-route", {
                    body: { routeId: route.id },
                  });
                  setReportedBy((userIds) =>
                    userIds.filter((other) => other !== user.id)
                  );
                  notify("Thanks for reporting!", { timeout: 1000 });
                } catch (error) {
                  notify(error, { timeout: 1000 });
                }
              }}
            >
              <Warn className="h-4" />
              <span>Retract report</span>
            </Button>
          ) : (
            <Button
              className="flex items-center space-x-4 w-full p-4"
              bgColor="white"
              onClick={async () => {
                try {
                  await api.post("report-route", {
                    body: { routeId: route.id },
                  });
                  setReportedBy((userIds) => userIds.concat(user.id));
                  notify("Thanks for reporting!", { timeout: 1000 });
                } catch (error) {
                  notify(error, { timeout: 1000 });
                }
              }}
            >
              <Warn className="h-4" />
              <span>Report as broken</span>
            </Button>
          )}
        </FlyOut>
      </div>
      {route.geometry && !focused && (
        <Link href={`/route/${route.id}/location`}>
          <a className="flex items-center space-x-1 text-sm text-blue-600">
            <Location className="h-3" filled />
            <span>Locate on map</span>
          </a>
        </Link>
      )}

      <div className="py-2">
        {route.description &&
          (route.description.length > DESCRIPTION_PREVIEW_LENGTH ? (
            <p>
              {expanded
                ? route.description
                : `${route.description.slice(
                    0,
                    DESCRIPTION_PREVIEW_LENGTH
                  )}... `}
              {!expanded && (
                <Button
                  className="text-gray-500"
                  onClick={() => setExpanded(true)}
                >
                  More
                </Button>
              )}
            </p>
          ) : (
            <p>{route.description}</p>
          ))}
        {route.route_tags && (
          <div className="flex flex-wrap space-x-2">
            {route.route_tags.map((tag) => (
              <span
                key={tag.tag.id}
                className="text-blue-500 text-sm uppercase font-bold"
              >
                #{tag.tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 uppercase">
        {formatDistanceToNow(new Date(route.created_at))} ago
      </p>
    </div>
  );
}
