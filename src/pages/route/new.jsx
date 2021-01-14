import { v4 as uuidv4 } from "uuid";
import cx from "classnames";
import Router from "next/router";

import { useEffect, useRef, useState } from "react";

import ImageInput from "components/ui/ImageInput";
import Button from "components/ui/Button";

function getPositionOnImage(event, { scale }) {
  const rect = event.target.getBoundingClientRect();
  return {
    x: (event.clientX - rect.x) / scale,
    y: (event.clientY - rect.y) / scale,
  };
}

export default function NewRoute() {
  useEffect(() => import("pinch-zoom-element"));
  const pinchZoomRef = useRef();

  const [route, setRoute] = useState({
    image: null,
    holds: [],
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

  return route.image ? (
    <div className="absolute inset-0 h-screen flex flex-col">
      <div className="relative z-10 p-2 border-b bg-white">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {step === 0 && (
            <>
              <Button
                className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
                onClick={() => setRoute((route) => ({ ...route, image: null }))}
              >
                Back
              </Button>
              <p>Select holds</p>
              <Button
                className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
                onClick={() => setStep(1)}
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
              <p>Select starting hold(s)</p>
              <Button
                className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
                onClick={() => setStep(2)}
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
              <p>Select finishing hold</p>
              <Button
                className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
                onClick={() => setStep(3)}
              >
                Done
              </Button>
            </>
          )}
        </div>
      </div>
      <pinch-zoom ref={pinchZoomRef} class="flex flex-grow">
        <div className="m-auto">
          <div className="relative">
            <img
              src={route.image}
              className="max-w-full max-h-full select-none"
              onClick={(event) => {
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
              }}
            />
            {route.holds.map((hold) => (
              <div
                key={hold.id}
                className={cx(
                  "absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer border-2 opacity-75",
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
        </div>
      </pinch-zoom>
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
        className="w-64 h-64 rounded-md border"
        value={route.image}
        onChange={({ data }) =>
          setRoute((route) => ({ ...route, image: data }))
        }
      />
    </div>
  );
}
