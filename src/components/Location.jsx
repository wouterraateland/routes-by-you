import Link from "next/link";
import Avatar from "components/ui/Avatar";

export default function Location({ location }) {
  return (
    <Link href={`/location/${location.id}`}>
      <a className="flex items-center p-2 space-x-4 sm:rounded-md sm:shadow-sm bg-white hover:bg-gray-100">
        <Avatar className="w-10 h-10" src={location.logo} alt={location.name} />
        <span className="block">
          <span className="font-bold">{location.name}</span>
          <span className="flex text-xs text-gray-600">
            {location.routes.length} active route
            {location.routes.length === 1 ? "" : "s"}
          </span>
        </span>
      </a>
    </Link>
  );
}
