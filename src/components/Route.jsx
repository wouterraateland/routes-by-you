import { pointsToFont, pointsToHsl } from "utils/grades";

import Link from "next/link";
import RouteMeta from "components/RouteMeta";
import RouteImage from "components/RouteImage";
import RouteSummary from "components/RouteSummary";

export default function Route({ route }) {
  const repeatsWithGrade =
    route.repeats?.filter((repeat) => repeat.grade) ?? [];
  const avgGrade =
    repeatsWithGrade.reduce((acc, repeat) => acc + repeat.grade, route.grade) /
    (repeatsWithGrade.length + 1);

  return (
    <div className="pb-4 sm:pb-0 sm:rounded-md sm:shadow-md bg-white">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-4">
          <RouteMeta route={route} />
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
      <RouteSummary route={route} />
    </div>
  );
}
