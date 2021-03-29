import Router from "next/router";

import { api } from "utils/api";
import { routesCache } from "utils/routes";

import useAuth from "hooks/useAuth";

import Button from "components/ui/Button";

export default function RouteSettingNavigation({
  step,
  setStep,
  route,
  setRoute,
}) {
  const auth = useAuth();

  return (
    <div className="sticky top-0 pt-safe z-10 border-b bg-white">
      <div className="max-w-xl mx-auto flex items-center justify-between p-2">
        {step === 0 && (
          <>
            <Button
              className="px-3 py-1 rounded-md font-bold"
              bgColor="white"
              onClick={() =>
                setRoute((route) => ({
                  ...route,
                  holds: [],
                  image: null,
                }))
              }
            >
              Back
            </Button>
            <p className="rounded-xl text-center bg-blue-500 text-white font-bold px-2">
              Select holds
            </p>
            <Button
              className="px-3 py-1 rounded-md font-bold"
              bgColor="white"
              onClick={() => setStep(1)}
              disabled={route.holds.length <= 1}
            >
              Next
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <Button
              className="px-3 py-1 rounded-md font-bold"
              bgColor="white"
              onClick={() => setStep(0)}
            >
              Back
            </Button>
            <p className="rounded-xl text-center bg-blue-500 text-white font-bold px-2">
              Select starting hold(s)
            </p>
            <Button
              className="px-3 py-1 rounded-md font-bold"
              bgColor="white"
              onClick={() => setStep(2)}
              disabled={!route.holds.some((hold) => hold.type === "start")}
            >
              Next
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button
              className="px-3 py-1 rounded-md font-bold"
              bgColor="white"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <p className="rounded-xl text-center bg-blue-500 text-white font-bold px-2">
              Select finishing hold
            </p>
            <Button
              className="px-3 py-1 rounded-md font-bold"
              bgColor="white"
              onClick={() => setStep(3)}
              disabled={!route.holds.some((hold) => hold.type === "finish")}
            >
              Done
            </Button>
          </>
        )}
        {step === 3 && (
          <>
            <Button
              className="px-3 py-1 rounded-md font-bold"
              bgColor="white"
              onClick={() => setStep(route.holds.length > 0 ? 2 : 0)}
            >
              Back
            </Button>
            <p>Set route info</p>
            <Button
              bgColor="blue"
              className="px-3 py-1 rounded-md font-bold text-white"
              onClick={async () => {
                const { url } = await api.post("upload", {
                  body: {
                    key: `${auth.user.id}/route-${Date.now()}.jpg`,
                    data: route.image,
                  },
                });
                const createdRoute = await api.post("route", {
                  body: { ...route, image: url },
                });
                routesCache.maxDate = new Date().toISOString();
                routesCache.clear();
                Router.replace(`/route/${createdRoute.id}`);
              }}
              disabled={
                !route.name || (!route.location_string && !route.location_id)
              }
            >
              Publish
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
