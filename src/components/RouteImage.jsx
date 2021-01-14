import cx from "classnames";
import { useEffect, useRef, useState } from "react";

export default function RouteImage({ route }) {
  const imageRef = useRef();
  const [scale, setScale] = useState(null);
  useEffect(() => {
    const image = imageRef.current;
    if (image) {
      const resize = () => {
        setScale(image.width / image.naturalWidth);
      };
      resize();

      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, []);

  return (
    <div className="relative">
      <img ref={imageRef} className="w-full" src={route.image} />
      {scale &&
        route.holds?.map((hold) => (
          <div
            key={hold.id}
            className={cx(
              "absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer border opacity-75",
              hold.type === "finish"
                ? "border-red-600"
                : hold.type === "start"
                ? "border-green-400"
                : "border-white"
            )}
            style={{
              top: hold.position.y * scale,
              left: hold.position.x * scale,
              width: `${hold.size * scale}px`,
              height: `${hold.size * scale}px`,
              borderWidth: `${Math.max(2, (hold.size / 16) * scale)}px`,
            }}
          />
        ))}
    </div>
  );
}
