import { routesCache } from "utils/routes";
import { api } from "utils/api";

import useAuth from "hooks/useAuth";
import useResource from "hooks/useResource";

import PagedResource from "resources/PagedResource";

import InfiniteList from "components/ui/InfiniteList";
import Route from "components/Route";

const renderRoute = (route) => <Route key={route.id} route={route} />;

export default function RouteList({
  filters,
  limit = 10,
  maxLength = Infinity,
}) {
  const { user } = useAuth();
  const filter = Object.keys(filters)
    .filter((key) => Boolean(filters[key]))
    .map((key) => `${key}=${filters[key]}`)
    .join("&");
  const routesResource = routesCache.read(filter, () => {
    return new PagedResource(limit, (offset, limit) =>
      api
        .get(`routes?${filter}&offset=${offset}&limit=${limit}`)
        .then((data) => ({ data, hasNext: data.length > 0 }))
    );
  });

  const routes = useResource(routesResource);
  const visibleRoutes = routes
    .filter((route) =>
      route.repeats?.some((repeat) => repeat.user_id === user.id)
        ? filters.show_repeated !== false
        : filters.show_not_repeated !== false
    )
    .slice(0, maxLength);
  return (
    <div className="divide-y sm:space-y-2 sm:divide-y-0 border-t border-b sm:border-0">
      {visibleRoutes.length === 0 && !routesResource.hasNext && (
        <p className="text-center text-gray-500">No routes found</p>
      )}
      <InfiniteList
        items={visibleRoutes}
        renderItem={renderRoute}
        pageSize={limit}
        loadPage={
          routes.length < maxLength && routesResource.hasNext
            ? () => routesResource.fetchNextPage()
            : undefined
        }
      />
    </div>
  );
}
