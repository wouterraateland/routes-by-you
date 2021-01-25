import Link from "next/link";
import Flash from "components/icons/Flash";
import Repeat from "components/icons/Repeat";
import Avatar from "components/ui/Avatar";
import Username from "components/Username";

export default function User({ user }) {
  return (
    <Link href={`/user/${user.id}`}>
      <a className="flex items-center p-2 space-x-4 sm:rounded-md sm:shadow-sm bg-white hover:bg-gray-100">
        <Avatar
          className="w-10 h-10"
          src={user.avatar}
          alt={user.display_name}
        />
        <span className="block">
          <span className="font-bold">
            <Username user={user} />
          </span>
          <span className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="flex items-center space-x-1">
              <Flash className="h-3" />
              <span>
                Set {user.routes.length} route
                {user.routes.length === 1 ? "" : "s"}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <Repeat className="h-4" />
              <span>
                Climbed {user.repeats.length} route
                {user.repeats.length === 1 ? "" : "s"}
              </span>
            </span>
          </span>
        </span>
      </a>
    </Link>
  );
}
