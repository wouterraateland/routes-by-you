import Router from "next/router";

import { useEffect, useState } from "react";

import Head from "next/head";
import RouteSettingTutorial from "components/route-setting/Tutorial";
import RouteSettingNavigation from "components/route-setting/Navigation";
import RouteSettingHoldsInput from "components/route-setting/HoldsInput";
import RouteSettingInfoInput from "components/route-setting/InfoInput";
import CameraInput from "components/CameraInput";

export default function NewRoute({ auth }) {
  useEffect(() => import("web-components/pinch-zoom"), []);

  const [step, setStep] = useState(0);
  const [route, setRoute] = useState({
    image: null,
    holds: [],
    name: "",
    description: "",
    setter_id: auth.user.id,
    grade: 500,
    location_id: null,
    location_string: "",
    geometry: null,
    tags: [],
  });

  return (
    <>
      <Head>
        <title>New route | Routes by You</title>
      </Head>
      {route.image ? (
        <div className="absolute inset-0 h-available flex flex-col bg-gray-50">
          <RouteSettingNavigation
            step={step}
            setStep={setStep}
            route={route}
            setRoute={setRoute}
          />
          {step === 3 ? (
            <RouteSettingInfoInput route={route} setRoute={setRoute} />
          ) : (
            <RouteSettingHoldsInput
              route={route}
              setRoute={setRoute}
              step={step}
              setStep={setStep}
            />
          )}
        </div>
      ) : (
        <CameraInput
          onClose={() => Router.back()}
          onChange={(image) => setRoute((route) => ({ ...route, image }))}
        />
      )}
      <RouteSettingTutorial />
    </>
  );
}
NewRoute.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};
