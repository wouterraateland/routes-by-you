import cx from "classnames";

import { useState } from "react";

import Star from "components/icons/Star";

export default function StarRating({ value, onChange, className }) {
  const [hoverValue, setHoverValue] = useState(null);

  return (
    <div className="flex" onMouseLeave={() => setHoverValue(null)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          className={onChange ? "focus:outline-none" : "pointer-events-none"}
          onClick={onChange ? () => onChange(i) : undefined}
          onMouseEnter={onChange ? () => setHoverValue(i) : undefined}
        >
          <Star
            filled
            className={cx(
              className,
              Math.round(hoverValue || value) >= i
                ? "text-yellow-400"
                : "text-gray-500"
            )}
          />
        </button>
      ))}
    </div>
  );
}
