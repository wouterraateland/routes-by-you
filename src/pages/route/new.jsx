import { v4 as uuidv4 } from "uuid";
import cx from "classnames";
import Router from "next/router";
import { fetchRandomRouteName } from "utils/routes";
import { fontByPoints, pointsToFont } from "utils/grades";
import { supabase } from "utils/supabase";
import { api } from "utils/api";
import { between } from "utils/math";

import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import Cross from "components/icons/Cross";
import Random from "components/icons/Random";
import Avatar from "components/ui/Avatar";
import Button from "components/ui/Button";
import Field from "components/ui/Field";
import FlyOut from "components/ui/FlyOut";
import ImageInput from "components/ui/ImageInput";
import Input from "components/ui/Input";
import Textarea from "components/ui/Textarea";

function getPositionOnImage(event, { scale }) {
  const rect = event.target.getBoundingClientRect();
  return {
    x: (event.clientX - rect.x) / scale,
    y: (event.clientY - rect.y) / scale,
  };
}

export default function NewRoute({ auth }) {
  useEffect(() => import("pinch-zoom-element"), []);
  const pinchZoomRef = useRef();
  const imgRef = useRef();

  const [route, setRoute] = useState({
    image: null,
    holds: [],
    name: "",
    description: "",
    setter_id: auth.user.id,
    grade: 500,
    location_id: null,
    location_string: "",
  });
  const [step, setStep] = useState(0);

  const addHold = (hold) =>
    setRoute((route) => ({ ...route, holds: route.holds.concat(hold) }));

  const updateHold = (holdId, update) =>
    setRoute((route) => ({
      ...route,
      holds: route.holds.map((hold) =>
        hold.id === holdId ? { ...hold, ...update } : hold
      ),
    }));

  const deleteHold = (holdId) =>
    setRoute((route) => ({
      ...route,
      holds: route.holds.filter((hold) => hold.id !== holdId),
    }));

  useEffect(() => {
    const pinchZoom = pinchZoomRef.current;
    const img = imgRef.current;
    if (pinchZoom && img) {
      const resize = () => {
        const cW = pinchZoom.offsetWidth;
        const cH = pinchZoom.offsetHeight;
        const scale = Math.min(cW / img.naturalWidth, cH / img.naturalHeight);
        const iW = scale * img.naturalWidth;
        const iH = scale * img.naturalHeight;

        pinchZoom.setTransform({
          scale,
          x: (cW - iW) / 2,
          y: (cH - iH) / 2,
        });
      };
      resize();

      const fixBounds = () => {
        const cW = pinchZoom.offsetWidth;
        const cH = pinchZoom.offsetHeight;
        const iW = pinchZoom.scale * img.naturalWidth;
        const iH = pinchZoom.scale * img.naturalHeight;

        pinchZoom.setTransform({
          x: iW < cW ? (cW - iW) / 2 : between(cW - iW, 0)(pinchZoom.x),
          y: iH < cH ? (cH - iH) / 2 : between(cH - iH, 0)(pinchZoom.y),
        });
      };

      pinchZoom.addEventListener("change", fixBounds);
      window.addEventListener("resize", resize);
      return () => {
        pinchZoom.addEventListener("change", fixBounds);
        window.removeEventListener("resize", resize);
      };
    }
  }, [route.image, step]);

  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const location = suggestedLocations.find(
    (location) => location.id === route.location_id
  );
  const suggestionsOriginRef = useRef();
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (route.location_id) {
        const { data } = await supabase
          .from("locations")
          .select("*")
          .eq("id", route.location_id);
        setSuggestedLocations(data || []);
      } else if (route.location_string) {
        const { data } = await supabase
          .from("locations")
          .select("*")
          .ilike("name", `%${route.location_string}%`);
        setSuggestedLocations(data || []);
      } else {
        setSuggestedLocations([]);
      }
    };

    const t = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(t);
  }, [route.location_id, route.location_string]);

  return (
    <>
      <Head>
        <title>New route | Routes by You</title>
      </Head>
      {route.image ? (
        <div className="absolute inset-0 h-screen flex flex-col bg-gray-50">
          <div className="sticky top-0 pt-safe z-10 border-b bg-white">
            <div className="max-w-xl mx-auto flex items-center justify-between p-2">
              {step === 0 && (
                <>
                  <Button
                    className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
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
                    className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
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
                    className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
                    onClick={() => setStep(0)}
                  >
                    Back
                  </Button>
                  <p className="rounded-xl text-center bg-blue-500 text-white font-bold px-2">
                    Select starting hold(s)
                  </p>
                  <Button
                    className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
                    onClick={() => setStep(2)}
                    disabled={
                      !route.holds.some((hold) => hold.type === "start")
                    }
                  >
                    Next
                  </Button>
                </>
              )}
              {step === 2 && (
                <>
                  <Button
                    className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <p className="rounded-xl text-center bg-blue-500 text-white font-bold px-2">
                    Select finishing hold
                  </p>
                  <Button
                    className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
                    onClick={() => setStep(3)}
                    disabled={
                      !route.holds.some((hold) => hold.type === "finish")
                    }
                  >
                    Done
                  </Button>
                </>
              )}
              {step === 3 && (
                <>
                  <Button
                    className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
                    onClick={() => setStep(2)}
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
                        body: {
                          ...route,
                          image: url,
                        },
                      });
                      Router.replace(`/route/${createdRoute.id}`);
                    }}
                    disabled={
                      !route.name || !route.location_string || !route.grade
                    }
                  >
                    Publish
                  </Button>
                </>
              )}
            </div>
          </div>
          {step === 3 ? (
            <div className="w-full max-w-xl mx-auto space-y-4 p-4">
              <Field label="Route name">
                <div className="space-y-2 sm:flex sm:items-center sm:space-x-4 sm:space-y-0">
                  <Input
                    className="w-full flex-grow"
                    required
                    value={route.name}
                    onChange={(event) =>
                      setRoute((route) => ({
                        ...route,
                        name: event.target.value,
                      }))
                    }
                  />
                  <Button
                    className="flex space-x-2 items-center px-4 py-2 rounded-md border font-bold bg-white hover:bg-gray-100"
                    onClick={async () => {
                      const name = await fetchRandomRouteName();
                      setRoute((route) => ({ ...route, name }));
                    }}
                  >
                    <Random className="h-4" />
                    <span>Random</span>
                  </Button>
                </div>
              </Field>
              <Field label="Description">
                <Textarea
                  className="w-full rounded-md px-4 py-2 border focus:outline-none focus:border-blue-600"
                  rows={2}
                  extraHeight={2}
                  value={route.description}
                  onChange={(event) =>
                    setRoute((route) => ({
                      ...route,
                      description: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Grade">
                <select
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:border-blue-600 text-2xl font-bold"
                  required
                  value={route.grade}
                  onChange={(event) =>
                    setRoute((route) => ({
                      ...route,
                      grade: event.target.value,
                    }))
                  }
                >
                  {Object.keys(fontByPoints)
                    .sort()
                    .map((points) => (
                      <option key={points} value={points}>
                        {pointsToFont(points)}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Location">
                <div ref={suggestionsOriginRef}>
                  {route.location_id ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {location.logo && (
                          <img
                            src={location.logo}
                            className="w-8 h-8 rounded-full shadow-md"
                            alt={location.name}
                          />
                        )}
                        <span>{location.name}</span>
                      </div>
                      <Button
                        onClick={() =>
                          setRoute((route) => ({ ...route, location_id: null }))
                        }
                      >
                        <Cross className="h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Input
                      required
                      value={route.location_string}
                      onChange={(event) =>
                        setRoute((route) => ({
                          ...route,
                          location_string: event.target.value,
                        }))
                      }
                      onFocus={() => setFocus(true)}
                      onBlur={() => setTimeout(() => setFocus(false))}
                    />
                  )}
                </div>
                <FlyOut
                  originRef={suggestionsOriginRef}
                  isOpen={
                    !route.location_id && suggestedLocations.length > 0 && focus
                  }
                  onClose={() => {}}
                >
                  {suggestedLocations.map((location) => (
                    <Button
                      key={location.id}
                      className="flex w-full items-center space-x-2 p-2 text-left hover:bg-gray-100 truncate"
                      onClick={() =>
                        setRoute((route) => ({
                          ...route,
                          location_id: location.id,
                        }))
                      }
                    >
                      <Avatar
                        src={location.logo}
                        alt={location.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{location.name}</span>
                    </Button>
                  ))}
                </FlyOut>
              </Field>
            </div>
          ) : (
            <pinch-zoom ref={pinchZoomRef} class="flex flex-grow">
              <div className="relative">
                <img
                  ref={imgRef}
                  src={route.image}
                  className="max-w-none select-none"
                  onClick={
                    step === 0
                      ? (event) => {
                          const position = getPositionOnImage(
                            event,
                            pinchZoomRef.current
                          );
                          addHold({
                            position,
                            size: 48 / pinchZoomRef.current.scale,
                            type: null,
                            id: uuidv4(),
                          });
                        }
                      : undefined
                  }
                />
                {route.holds?.map((hold) => (
                  <div
                    key={hold.id}
                    className={cx(
                      "absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer border hold-marker",
                      hold.type === "finish"
                        ? "border-red-600"
                        : hold.type === "start"
                        ? "border-green-400"
                        : "border-white"
                    )}
                    style={{
                      top: hold.position.y,
                      left: hold.position.x,
                      width: `${hold.size}px`,
                      height: `${hold.size}px`,
                      borderWidth: `${Math.max(
                        2,
                        2 / pinchZoomRef.current?.scale,
                        hold.size / 16
                      )}px`,
                    }}
                    onClick={() =>
                      step === 0
                        ? deleteHold(hold.id)
                        : updateHold(hold.id, {
                            type:
                              step === 1
                                ? hold.type === "start"
                                  ? null
                                  : hold.type === null
                                  ? route.holds.filter(
                                      (hold) => hold.type === "start"
                                    ).length <= 1
                                    ? "start"
                                    : hold.type
                                  : hold.type
                                : hold.type === "finish"
                                ? null
                                : hold.type === null
                                ? route.holds.filter(
                                    (hold) => hold.type === "finish"
                                  ).length === 0
                                  ? "finish"
                                  : hold.type
                                : hold.type,
                          })
                    }
                  />
                ))}
              </div>
            </pinch-zoom>
          )}
        </div>
      ) : (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
          <Button
            className="px-4 py-2 rounded-md border hover:bg-gray-100 font-bold"
            onClick={() => Router.back()}
          >
            Cancel
          </Button>
          <ImageInput
            compression={{ maxArea: 640 * 1280 }}
            className="w-64 h-64 rounded-md border"
            value={route.image}
            onChange={({ data }) =>
              setRoute((route) => ({ ...route, image: data }))
            }
          />
        </div>
      )}
    </>
  );
}
NewRoute.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};
