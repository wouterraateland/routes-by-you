import useAuth from "hooks/useAuth";
import useResource from "hooks/useResource";

import InfiniteList from "components/ui/InfiniteList";
import Route from "components/Route";

const renderRoute = (route) => <Route key={route.id} route={route} />;

export default function FilteredRoutes({ routesResource, filters }) {
  const { user } = useAuth();
  const routes = useResource(routesResource);
  const visibleRoutes = routes.filter((route) =>
    route.repeats.some((repeat) => repeat.user_id === user.id)
      ? filters.show_repeated
      : filters.show_not_repeated
  );
  return (
    <>
      {visibleRoutes.length === 0 && !routesResource.hasNext && (
        <p className="text-center text-gray-500">No routes found</p>
      )}
      <InfiniteList
        items={visibleRoutes}
        renderItem={renderRoute}
        pageSize={10}
        loadPage={
          routesResource.hasNext
            ? () => routesResource.fetchNextPage()
            : undefined
        }
      />
    </>
  );
}
