import useLocallyStoredState from "hooks/useLocallyStoredState";

import Portal from "containers/Portal";

import Button from "components/ui/Button";

export default function RouteSettingTutorial() {
  const [completed, setCompleted] = useLocallyStoredState({
    key: "routes-by-you_routesetting_tutorial_completed",
    initialState: false,
  });

  return completed ? null : (
    <Portal>
      <div className="fixed z-50 top-0 left-0 flex items-center justify-center w-screen h-available bg-black bg-opacity-75">
        <div className="flex flex-col justify-between w-full h-full m-auto max-w-sm sm:h-auto sm:rounded-md bg-blue-500 text-white">
          <div className="px-4 py-8 sm:px-8 space-y-8 overflow-auto">
            <h1 className="text-3xl font-bold">Routesetting 101</h1>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full bg-white text-black font-bold">
                  1.
                </div>
                <div className="py-1">
                  <p>Take or upload a photo of your route.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full bg-white text-black font-bold">
                  2.
                </div>
                <div className="py-1">
                  <p>
                    Touch to select holds.
                    <br />
                    Touch again to remove.
                    <br />
                    Zoom in for smaller holds, zoom out for larger holds.
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full bg-white text-black font-bold">
                  3.
                </div>
                <div className="py-1">
                  <p>Mark the starting and finishing holds.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full bg-white text-black font-bold">
                  4.
                </div>
                <div className="py-1">
                  <p>Name and describe your route.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full bg-white text-black font-bold">
                  5.
                </div>
                <div className="py-1">
                  <p>
                    That&apos;s it, you have just set your first route{" "}
                    <span role="image" aria-label="Party">
                      🎉
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end p-4">
            <Button
              className="px-4 py-2 rounded-md hover:bg-blue-600 font-bold"
              onClick={() => setCompleted(true)}
            >
              Got it!
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
