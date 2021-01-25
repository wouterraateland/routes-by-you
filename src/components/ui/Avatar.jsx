import cx from "classnames";

import Image from "next/image";

export default function Avatar({ src, alt, className }) {
  const placeholder = alt?.charAt(0).toUpperCase() ?? "";

  return (
    <span
      className={cx("relative flex rounded-full overflow-hidden", className)}
    >
      {src ? (
        <Image src={src} alt={alt} layout="fill" className="object-cover" />
      ) : (
        <span className="flex w-full h-full items-center justify-center">
          {placeholder}
        </span>
      )}
    </span>
  );
}
