import cx from "classnames";

import { forwardRef, useRef } from "react";
import useAsyncCallback from "hooks/useAsyncCallback";

import ToolTip from "./ToolTip";

export default forwardRef(function Button(
  { children, onClick, bgColor, hint, disabled, className, ...props },
  ref
) {
  const innerRef = useRef();
  const [{ isPending, showPending }, asyncOnClick] = useAsyncCallback(onClick, [
    onClick,
  ]);

  return (
    <>
      <button
        ref={(node) => {
          innerRef.current = node;
          if (ref) {
            ref.current = node;
          }
        }}
        onClick={asyncOnClick}
        disabled={isPending || disabled}
        className={cx(
          "focus:outline-none focus:ring-2",
          { "opacity-50 pointer-events-none": disabled },
          className,
          bgColor && `bg-${bgColor}-600 hover:bg-${bgColor}-700`
        )}
        {...props}
      >
        {showPending ? <div className="loader loader--sm" /> : children}
      </button>
      {hint && <ToolTip originRef={innerRef}>{hint}</ToolTip>}
    </>
  );
});
