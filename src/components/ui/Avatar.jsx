import cx from "classnames";
import { Cache } from "utils/caching";

import Image from "next/image";

const colors = ["green", "blue", "yellow", "red"];
const colorCache = new Cache();

export default function Avatar({ src, alt, className }) {
  const placeholder = alt?.charAt(0).toUpperCase() ?? "";
  const color = colorCache.read(
    alt,
    () =>
      colors[
        (alt || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
          colors.length
      ]
  );

  return (
    <span
      className={cx("relative flex rounded-full overflow-hidden", className)}
    >
      {src ? (
        <Image src={src} alt={alt} layout="fill" className="object-cover" />
      ) : (
        <span
          className={cx(
            "flex w-full h-full items-center justify-center font-bold text-white",
            `bg-${color}-600`
          )}
        >
          {placeholder}
        </span>
      )}
    </span>
  );
}
