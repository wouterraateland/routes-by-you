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
import Repeat from "components/icons/Repeat";
import Dots from "components/icons/Dots";
import Warn from "components/icons/Warn";
import Share from "components/icons/Share";
import Button from "components/ui/Button";
import FlyOut from "components/ui/FlyOut";
import StarRating from "components/StarRating";

export default function RouteSummary({ route }) {
  const actionsOriginRef = useRef();
  const { user } = useAuth();

  const [reportedBy, setReportedBy] = useState(
    route.reports.map((report) => report.user_id)
  );

  const repeated = route.repeats.some((repeat) => repeat.user_id === user?.id);
  const repeatsWithRating = route.repeats.filter((repeat) => repeat.rating);
  const avgRating = repeatsWithRating.length
    ? repeatsWithRating.reduce((acc, repeat) => acc + repeat.rating, 0) /
      repeatsWithRating.length
    : null;
  const repeatsWithVideo = route.repeats.filter((repeat) => repeat.video);

  return (
    <div className="p-2">
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
          </div>
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
            ref={actionsOriginRef}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <Dots className="h-6" direction="vertical" />
          </Button>
        </div>
        <FlyOut originRef={actionsOriginRef}>
          <Button
            className="flex items-center space-x-4 w-full p-4 hover:bg-gray-100"
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
              className="flex items-center space-x-4 w-full p-4 hover:bg-gray-100"
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
              className="flex items-center space-x-4 w-full p-4 hover:bg-gray-100"
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
      {route.description && <p className="py-2">{route.description}</p>}
      <p className="text-xs text-gray-400 uppercase">
        {formatDistanceToNow(new Date(route.created_at))} ago
      </p>
    </div>
  );
}
