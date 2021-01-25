import { api } from "utils/api";
import { Cache } from "utils/caching";

import AsyncResource from "resources/AsyncResource";

import Route from "components/Route";

const cache = new Cache();

export default function FilteredRoutes({
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
