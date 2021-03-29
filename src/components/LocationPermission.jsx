import { geoLocationResource } from "resources/GeoLocationResource";

import useResource from "hooks/useResource";

import Button from "components/ui/Button";
import Card from "components/ui/Card";

export default function LocationPermission() {
  const { permission } = useResource(geoLocationResource);

  return permission === "prompt" ? (
    <div className="absolute inset-0 p-4 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
      <Card className="w-64 m-auto p-4 text-black space-y-4">
        <p>
          We&apos;d like to use your location to automatically place your route
          on the map.
        </p>
        <div className="space-y-2">
          <Button
            onClick={() => geoLocationResource.grant()}
            className="w-full px-3 py-1 rounded-md font-bold text-white"
            bgColor="blue"
          >
            Allow location usage
          </Button>
          <Button
            onClick={() => geoLocationResource.deny()}
            className="w-full px-3 py-1 rounded-md font-bold border text-red-600"
            bgColor="white"
          >
            Dissallow
          </Button>
        </div>
      </Card>
    </div>
  ) : null;
}
