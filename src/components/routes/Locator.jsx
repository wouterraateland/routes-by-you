import { pointsToHsl } from "utils/grades";

import { useContext, useEffect, useRef } from "react";

import MapboxMap from "components/MapboxMap";
import { Layer, Feature, MapContext } from "react-mapbox-gl";

const circleLayout = {
  visibility: "visible",
};

function InitialProps({ route }) {
  const initializedRef = useRef(false);
  const map = useContext(MapContext);
  useEffect(() => {
    if (map && !initializedRef.current) {
      initializedRef.current = true;
      map.setCenter(route.geometry.coordinates);
      map.setZoom(12);
    }
  }, [map, route.geometry.coordinates]);
  return null;
}

export default function RouteLocator({ route }) {
  return (
    <MapboxMap
      style="mapbox://styles/mapbox/outdoors-v11"
      className="h-64 relative"
    >
      <InitialProps route={route} />
      <Layer
        type="circle"
        layout={circleLayout}
        paint={{
          "circle-radius": 16,
          "circle-color": pointsToHsl(route.grade),
          "circle-opacity": 1,
        }}
      >
        <Feature coordinates={route.geometry.coordinates} />
      </Layer>
    </MapboxMap>
  );
}
