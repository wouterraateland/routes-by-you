import cx from "classnames";

import Star from "components/icons/Star";

export default function StarRating({ rating }) {
  return (
    <div className="flex -space-x-1">
      {[0.5, 1.5, 2.5, 3.5, 4.5].map((i) => (
        <Star
          key={i}
          className={cx("w-4 h-4 fill-current", {
            "text-yellow-400": rating >= i,
          })}
        />
      ))}
    </div>
  );
}
