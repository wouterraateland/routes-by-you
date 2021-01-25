import { api } from "utils/api";
import { Cache } from "utils/caching";

import useResource from "hooks/useResource";

import PagedResource from "resources/PagedResource";

import InfiniteList from "components/ui/InfiniteList";
import Location from "components/Location";

const locationsCache = new Cache();

const renderLocation = (location) => (
  <Location key={location.id} location={location} />
);

export default function LocationList({
  filters,
  limit = 10,
  maxLength = Infinity,
}) {
  const filter = Object.keys(filters)
    .filter((key) => Boolean(filters[key]))
    .map((key) => `${key}=${filters[key]}`)
    .join("&");
  const locationsResource = locationsCache.read(filter, () => {
    return new PagedResource((page) =>
      api
        .get(`locations?${filter}&page=${page}&limit=${limit}`)
        .then((data) => ({ data, hasNext: data.length > 0 }))
    );
  });

  const locations = useResource(locationsResource);
  const visibleLocations = locations.slice(0, maxLength);
  return (
    <div className="divide-y sm:space-y-2 sm:divide-y-0 border-t border-b sm:border-0">
      {visibleLocations.length === 0 && !locationsResource.hasNext && (
        <p className="text-center text-gray-500">No locations found</p>
      )}
      <InfiniteList
        items={visibleLocations}
        renderItem={renderLocation}
        pageSize={limit}
        loadPage={
          locations.length < maxLength && locationsResource.hasNext
            ? () => locationsResource.fetchNextPage()
            : undefined
        }
      />
    </div>
  );
}
