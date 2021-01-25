import { pointsToFont, pointsToHsl } from "utils/grades";

import Link from "next/link";
import Avatar from "components/ui/Avatar";
import Username from "components/Username";
import RouteImage from "components/RouteImage";
import RouteSummary from "components/RouteSummary";

export default function Route({ route }) {
  const repeatsWithGrade = route.repeats.filter((repeat) => repeat.grade);
  const avgGrade =
    repeatsWithGrade.reduce((acc, repeat) => acc + repeat.grade, route.grade) /
    (repeatsWithGrade.length + 1);

  return (
    <div className="pb-4 sm:pb-0 sm:rounded-md sm:shadow-md bg-white">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-4">
          <Link href={`/user/${route.setter.id}`}>
            <a>
              <Avatar
                className="w-10 h-10"
                src={route.setter.avatar}
                alt={route.setter.display_name}
              />
            </a>
          </Link>
          <div>
            <p className="font-bold">
              <Link href={`/user/${route.setter.id}`}>
                <a className="hover:underline">
                  <Username user={route.setter} />
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
      <RouteSummary route={route} />
    </div>
  );
}
