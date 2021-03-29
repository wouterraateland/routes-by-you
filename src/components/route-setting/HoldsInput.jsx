import { v4 as uuidv4 } from "uuid";
import cx from "classnames";

import { between } from "utils/math";

import { useEffect, useRef } from "react";

import Button from "components/ui/Button";

function getPositionOnImage(event, { scale }) {
  const rect = event.target.getBoundingClientRect();
  return {
    x: (event.clientX - rect.x) / scale,
    y: (event.clientY - rect.y) / scale,
  };
}

export default function RouteSettingHoldsInput({
  step,
  setStep,
  route,
  setRoute,
}) {
  const pinchZoomRef = useRef();
  const imgRef = useRef();

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

  return (
    <>
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
                          ? route.holds.filter((hold) => hold.type === "finish")
                              .length === 0
                            ? "finish"
                            : hold.type
                          : hold.type,
                    })
              }
            />
          ))}
        </div>
      </pinch-zoom>
      {step === 0 && route.holds.length === 0 && (
        <div className="fixed bottom-0 right-0 m-4">
          <Button
            onClick={() => setStep(3)}
            className="rounded-md px-3 py-1 bg-white border"
          >
            Continue without holds
          </Button>
        </div>
      )}
    </>
  );
}
