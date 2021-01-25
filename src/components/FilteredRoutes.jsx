import { api } from "utils/api";

import AsyncResource from "resources/AsyncResource";

import Route from "components/Route";

export default function FilteredRoutes({
  cache,
  minGrade,
  maxGrade,
  setterId,
  locationId,
  q,
}) {
  const params = {
    min_grade: minGrade,
    max_grade: maxGrade,
    setter_id: setterId,
    location_id: locationId,
    page: 0,
    limit: 10,
    q,
  };
  const query = Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const routesResource = cache.read(
    "",
    () => new AsyncResource(api.get(`routes?${query}`))
  );
  const routes = routesResource.read();
  return routes.map((route) => <Route key={route.id} route={route} />);
}
