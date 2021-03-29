import { supabase, getSupabaseResource } from "utils/supabase";
import { MapContext, GeoJSONLayer } from "react-mapbox-gl";
import center from "@turf/center";
import contains from "@turf/boolean-contains";
import { point } from "@turf/helpers";

import { useContext, useEffect, useMemo, useRef } from "react";
import useResource from "hooks/useResource";

const fillLayout = { visibility: "visible" };
const fillPaint = {
  "fill-color": "#ef4444",
  "fill-opacity": 0.5,
};

const lineLayout = { visibility: "visible" };
const linePaint = {
  "line-color": "#ef4444",
};

const symbolLayout = {
  visibility: "visible",
  "icon-allow-overlap": true,
  "icon-image": "marker-red",
  "icon-anchor": "bottom",
  "text-field": ["get", "name"],
};
const symbolPaint = {};

function generateGeoJSON(locations) {
  return {
    type: "FeatureCollection",
    features: locations
      .filter(({ geometry }) => geometry)
      .map(({ geometry, ...location }) => ({
        type: "Feature",
        properties: location,
        geometry,
      })),
  };
}

export default function NamedLocationsLayer({ route, onChange }) {
  const prevSelectedRef = useRef();
  const map = useContext(MapContext);
  const namedLocationsResource = useMemo(
    () => getSupabaseResource(supabase.from("locations").select("*")),
    []
  );
  const namedLocations = useResource(namedLocationsResource);
  const namedLocationsWithCenter = useMemo(
    () =>
      namedLocations.map((location) => {
        const {
          geometry: { coordinates },
        } = center(location.geometry);
        return { ...location, center: coordinates };
      }),
    [namedLocations]
  );
  const geoJSON = useMemo(() => generateGeoJSON(namedLocations), [
    namedLocations,
  ]);

  const routeGeometry = route?.geometry;
  const routeLocationId = route?.location_id;

  useEffect(() => {
    if (route && onChange) {
      if (routeLocationId !== prevSelectedRef.current) {
        prevSelectedRef.current = routeLocationId;
        if (routeLocationId) {
          const selectedLocation = namedLocationsWithCenter.find(
            (location) => location.id === routeLocationId
          );
          if (selectedLocation) {
            map.flyTo({ center: selectedLocation.center, zoom: 16 });

            if (
              !routeGeometry ||
              !contains(selectedLocation.geometry, point(routeGeometry))
            ) {
              onChange("geometry", selectedLocation.center);
            }
          }
        }
      }

      if (routeGeometry) {
        const matchingLocation = namedLocationsWithCenter.find((location) =>
          contains(location.geometry, point(routeGeometry))
        );
        if (matchingLocation && matchingLocation.id !== routeLocationId) {
          onChange("location_id", matchingLocation.id);
        }
      }
    }
  }, [map, namedLocationsWithCenter, routeGeometry, routeLocationId, onChange]);

  return (
    <GeoJSONLayer
      before="location"
      data={geoJSON}
      symbolLayout={symbolLayout}
      symbolPaint={symbolPaint}
      lineLayout={lineLayout}
      linePaint={linePaint}
      fillLayout={fillLayout}
      fillPaint={fillPaint}
    />
  );
}
