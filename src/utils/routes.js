import { api } from "utils/api";
import { Cache } from "utils/caching";
import { capitalize } from "utils/strings";

export async function fetchRandomRouteName() {
  const [color, appliance] = await Promise.all([
    api.get("https://random-data-api.com/api/color/random_color"),
    api.get("https://random-data-api.com/api/appliance/random_appliance"),
  ]);

  return capitalize(`${color.color_name} ${appliance.equipment}`.toLowerCase());
}

export const routesCache = new Cache();
routesCache.maxDate = new Date().toISOString();
