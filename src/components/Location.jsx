import Link from "next/link";
import Avatar from "components/ui/Avatar";

export default function Location({ location }) {
  const activeRoutes = location.routes.filter((route) => route.active).length;
  const archivedRoutes = location.routes.filter((route) => !route.active)
    .length;

  return (
    <Link href={`/location/${location.id}`}>
      <a className="flex items-center p-2 space-x-4 sm:rounded-md sm:shadow-sm bg-white hover:bg-gray-100">
        <Avatar className="w-10 h-10" src={location.logo} alt={location.name} />
        <span className="block">
          <span className="font-bold">{location.name}</span>
          <span className="flex items-center space-x-2 text-xs">
            <span className="text-gray-600">
              {activeRoutes} active route
              {activeRoutes === 1 ? "" : "s"}
            </span>
            <span className="text-gray-400">
              {archivedRoutes} archived route
              {archivedRoutes === 1 ? "" : "s"}
            </span>
          </span>
        </span>
      </a>
    </Link>
  );
}
