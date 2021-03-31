import Link from "next/link";
import Avatar from "components/ui/Avatar";
import Username from "components/Username";

export default function RouteMeta({ route }) {
  return (
    <>
      {route.setter ? (
        <Link href={`/user/${route.setter.id}`}>
          <a>
            <Avatar
              className="w-10 h-10"
              src={route.setter.avatar}
              alt={route.setter.display_name}
            />
          </a>
        </Link>
      ) : (
        route.location && (
          <Link href={`/location/${route.location.id}`}>
            <a>
              <Avatar
                className="w-10 h-10"
                src={route.location.logo}
                alt={route.location.name}
              />
            </a>
          </Link>
        )
      )}
      <div>
        {route.setter ? (
          <>
            <p className="font-bold">
              <Link href={`/user/${route.setter.id}`}>
                <a className="hover:underline">
                  <Username user={route.setter} />
                </a>
              </Link>
            </p>
            {route.location ? (
              <p className="text-sm text-blue-600 hover:underline truncate">
                <Link href={`/location/${route.location.id}`}>
                  <a>{route.location.name}</a>
                </Link>
              </p>
            ) : (
              route.location_string && (
                <p className="text-sm text-gray-500 truncate">
                  {route.location_string}
                </p>
              )
            )}
          </>
        ) : (
          <p className="font-bold truncate">
            {route.location ? (
              <Link href={`/location/${route.location.id}`}>
                <a>{route.location.name}</a>
              </Link>
            ) : (
              route.location_string
            )}
          </p>
        )}
      </div>
    </>
  );
}
