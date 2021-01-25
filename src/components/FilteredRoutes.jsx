import useResource from "hooks/useResource";

import InfiniteList from "components/ui/InfiniteList";
import Route from "components/Route";

const renderRoute = (route) => <Route key={route.id} route={route} />;

export default function FilteredRoutes({ routesResource }) {
  const routes = useResource(routesResource);
  return (
    <InfiniteList
      items={routes}
      renderItem={renderRoute}
      pageSize={10}
      loadPage={
        routesResource.hasNext
          ? () => routesResource.fetchNextPage()
          : undefined
      }
    />
  );
}
