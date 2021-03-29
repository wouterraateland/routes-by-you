import { geoLocationResource } from "resources/GeoLocationResource";

import { useContext, useEffect } from "react";
import { MapContext } from "react-mapbox-gl";

import useResource from "hooks/useResource";
import LocationPermission from "components/LocationPermission";

export default function MapLocationCenterer({ onCenter }) {
  const map = useContext(MapContext);
  const { position } = useResource(geoLocationResource);

  useEffect(() => {
    if (map && position !== null) {
      onCenter(map, position);
    }
  }, [position, map]);

  return <LocationPermission />;
}
