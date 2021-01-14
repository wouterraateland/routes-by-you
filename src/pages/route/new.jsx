import Router from "next/router";

import { useState } from "react";
import usePanZoom from "hooks/usePanZoom";

import ImageInput from "components/ui/ImageInput";
import Button from "components/ui/Button";

export default function NewRoute() {
  const [route, setRoute] = useState({
    image: null,
  });
  const [step, setStep] = useState(0);

  const { transform, panZoomHandlers, setContainer } = usePanZoom({});

  return route.image ? (
    <div className="h-screen flex flex-col">
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
      <div
        className="overflow-hidden flex flex-grow touch-noscroll"
        ref={(node) => setContainer(node)}
        {...panZoomHandlers}
      >
        <div className="m-auto" style={{ transform }}>
          <img
            src={route.image}
            className="pointer-events-none max-w-full max-h-full"
          />
        </div>
      </div>
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
