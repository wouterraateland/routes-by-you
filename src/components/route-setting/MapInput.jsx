import { useCallback, useContext, useEffect, useRef } from "react";

import { Layer, Feature, MapContext } from "react-mapbox-gl";
import MapboxMap from "components/MapboxMap";
import MapLocationCenterer from "components/MapLocationCenterer";
import ImagesLayer from "components/ImagesLayer";
import NamedLocationsLayer from "components/NamedLocationsLayer";

const symbolLayout = {
  "icon-image": "marker-blue",
  "icon-anchor": "bottom",
};

function InitialParams({ route }) {
  const initializedRef = useRef(false);
  const map = useContext(MapContext);

  useEffect(() => {
    if (route.geometry && !initializedRef.current) {
      initializedRef.current = true;
      map.setCenter(route.geometry);
      map.setZoom(16);
    }
  }, [map, route.geometry]);

  return null;
}

export default function LocationInput({ route, setRoute, ...props }) {
  const setGeometry = useCallback(
    (geometry) => setRoute((route) => ({ ...route, geometry: geometry })),
    [setRoute]
  );
  const handleCenter = useCallback(
    (map, position) =>
      setRoute((route) => {
        if (route.geometry === null) {
          map.setCenter([position.coords.longitude, position.coords.latitude]);
          map.setZoom(16);
          return {
            ...route,
            geometry: [position.coords.longitude, position.coords.latitude],
          };
        } else {
          return route;
        }
      }),
    [setRoute]
  );

  return (
    <div className="relative">
      <MapboxMap
        style="mapbox://styles/mapbox/outdoors-v11"
        {...props}
        onClick={(_, { lngLat }) => setGeometry([lngLat.lng, lngLat.lat])}
      >
        <InitialParams route={route} />
        <ImagesLayer>
          <Layer id="location" type="symbol" layout={symbolLayout}>
            {route.geometry && (
              <Feature
                coordinates={route.geometry}
                onDragEnd={({ lngLat }) =>
                  setGeometry([lngLat.lng, lngLat.lat])
                }
                onClick={() => setGeometry(null)}
                draggable
              />
            )}
          </Layer>
          <NamedLocationsLayer route={route} setRoute={setRoute} />
        </ImagesLayer>
        {!route.location_id && (
          <MapLocationCenterer watch={false} onCenter={handleCenter} />
        )}
      </MapboxMap>
    </div>
  );
}
