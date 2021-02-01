import cx from "classnames";

import { useCallback, useEffect, useRef, useState } from "react";
import useLocallyStoredState from "hooks/useLocallyStoredState";

import Cross from "components/icons/Cross";
import Upload from "components/icons/Upload";
import Rotate from "components/icons/Rotate";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import { HiddenImageInput } from "components/ui/ImageInput";

export default function CameraInput({ onClose, onChange }) {
  const canvasRef = useRef();
  const videoRef = useRef();

  const [orientation, setOrientation] = useState("portrait");
  const [cameraParams, setCameraParams] = useState({
    supported: undefined,
    number: 0,
    permission: undefined,
    stream: undefined,
    facingMode: "environment",
  });
  const [cameraEnabled, setCameraEnabled] = useLocallyStoredState({
    key: "routes-by-you_camera-enabled",
    initialValue: false,
  });

  useEffect(() => {
    const supported =
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    setCameraParams((params) => ({ ...params, supported }));
  }, []);

  useEffect(() => {
    const onResize = () =>
      setOrientation(
        window.innerWidth < window.innerHeight ? "portrait" : "landscape"
      );

    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (video) {
      video.srcObject = cameraParams.stream;
    }

    return () => {
      const video = videoRef.current;
      cameraParams.stream?.getTracks().forEach((track) => {
        track.stop();
      });
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [cameraParams.stream]);

  useEffect(() => {
    const video = videoRef.current;
    if (cameraParams.supported && cameraEnabled && video) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: cameraParams.facingMode } })
        .then((stream) => {
          setCameraParams((params) => ({
            ...params,
            stream,
            permission: "granted",
          }));
          navigator.mediaDevices.enumerateDevices().then((r) =>
            setCameraParams((params) => ({
              ...params,
              number: r.filter((i) => i.kind === "videoinput").length,
            }))
          );
        })
        .catch(() =>
          setCameraParams((params) => ({ ...params, permission: "denied" }))
        );
    }
  }, [cameraParams.facingMode, cameraParams.supported, cameraEnabled]);

  const switchCamera = useCallback(() => {
    setCameraParams((params) => ({
      ...params,
      facingMode: params.facingMode === "environment" ? "user" : "environment",
    }));
  }, []);

  const takePhoto = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const w = video.videoWidth;
      const h = video.videoHeight;

      canvas.width = w;
      canvas.height = h;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, w, h, 0, 0, w, h);
      }

      const imgData = canvas.toDataURL("image/jpeg");
      onChange(imgData);
    }
  }, [onChange]);

  return (
    <div
      className={cx(
        "pt-safe pl-safe pb-safe pr-safe flex items-stretch justify-center bg-black text-white",
        orientation === "portrait" ? "min-h-available flex-col" : ""
      )}
    >
      <Button
        className="absolute z-10 top-0 left-0 m-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75"
        onClick={onClose}
      >
        <Cross className="h-4" />
      </Button>
      <div className="flex flex-grow">
        {cameraParams.permission === "denied" ? (
          <p className="m-auto opacity-50">Camera permission denied</p>
        ) : cameraEnabled ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={cx("w-full object-contain", {
                "h-available": orientation === "landscape",
              })}
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        ) : cameraParams.supported ? (
          <Card className="w-64 m-auto p-4 text-black space-y-4">
            <p>We need your permission to take photos of routes.</p>
            <div className="flex justify-end">
              <Button
                onClick={() => setCameraEnabled(true)}
                className="w-full sm:w-auto px-3 py-1 rounded-md font-bold text-white"
                bgColor="blue"
              >
                Allow camera usage
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="w-64 m-auto p-4 text-black space-y-4">
            <p>Your browser does not support taking pictures.</p>
          </Card>
        )}
      </div>
      <div
        className={cx(
          "flex p-4 items-center justify-around",
          orientation === "portrait" ? "" : "flex-col"
        )}
      >
        <div
          className={cx("space-y-2 text-center", {
            "opacity-0 pointer-events-none": cameraParams.number <= 1,
          })}
        >
          <Button
            className="p-2 rounded-full bg-white bg-opacity-0 hover:bg-opacity-10 cursor-pointer"
            onClick={switchCamera}
          >
            <Rotate className="h-6" />
          </Button>
          <p className="text-xs opacity-50">Switch</p>
        </div>
        <Button
          className="w-16 h-16 rounded-full bg-white bg-opacity-50"
          disabled={!cameraEnabled}
          onClick={takePhoto}
        >
          <span className="block w-12 h-12 rounded-full m-2 bg-white" />
        </Button>
        <div className="space-y-2 text-center">
          <label className="relative block p-2 rounded-full bg-white bg-opacity-0 hover:bg-opacity-10 cursor-pointer">
            <Upload className="h-6" />
            <HiddenImageInput
              compression={{ maxArea: 640 * 1280 }}
              onChange={({ data }) => onChange(data)}
            />
          </label>
          <p className="text-xs opacity-50">Upload</p>
        </div>
      </div>
    </div>
  );
}
