import RouteList from "components/RouteList";
import UserList from "components/UserList";
import LocationList from "components/LocationList";
import SSRSuspense from "containers/SSRSuspense";
import Loader from "./ui/Loader";

export default function SearchResults({ query, category }) {
  return (
    <SSRSuspense fallback={<Loader className="text-blue-600" />}>
      <div className="sm:space-y-2">
        {category === "routes" && <RouteList filters={{ q: query }} />}
        {category === "users" && <UserList filters={{ q: query }} />}
        {category === "locations" && <LocationList filters={{ q: query }} />}
        {!category && (
          <>
            <h2 className="mx-2 sm:mx-0 mt-4 text-gray-500 uppercase font-bold">
              Users
            </h2>
            <UserList filters={{ q: query }} maxLength={5} />
            <h2 className="mx-2 sm:mx-0 mt-4 text-gray-500 uppercase font-bold">
              Locations
            </h2>
            <LocationList filters={{ q: query }} maxLength={5} />
            <h2 className="mx-2 sm:mx-0 mt-4 text-gray-500 uppercase font-bold">
              Routes
            </h2>
            <RouteList filters={{ q: query }} />
          </>
        )}
      </div>
    </SSRSuspense>
  );
}
