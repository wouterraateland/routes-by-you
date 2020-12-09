import cx from "classnames";

import { forwardRef } from "react";
import useAsyncCallback from "hooks/useAsyncCallback";

export default forwardRef(function Button(
  { children, onClick, bgColor, disabled, className, ...props },
  ref
) {
  const [{ isPending, showPending }, asyncOnClick] = useAsyncCallback(onClick, [
    onClick,
  ]);

  return (
    <button
      ref={ref}
      onClick={asyncOnClick}
      disabled={isPending || disabled}
      className={cx(
        { "bg-gray-400 border-gray-500": disabled },
        className,
        bgColor &&
          !disabled &&
          `border bg-${bgColor}-600 hover:bg-${bgColor}-700 border-${bgColor}-900`
      )}
      {...props}
    >
      {showPending ? <div className="loader loader--sm" /> : children}
    </button>
  );
});
