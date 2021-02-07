import cx from "classnames";
import { forwardRef } from "react";

export default forwardRef(function Input(
  { className, prefix, suffix, ...props },
  ref
) {
  return (
    <div
      className={cx(
        "flex min-w-0 px-4 py-2 rounded-md border focus-within:border-blue-600 bg-white",
        className
      )}
    >
      {prefix && <span className="text-gray-500">{prefix}</span>}
      <input
        ref={ref}
        className="min-w-0 w-full flex-grow focus:outline-none"
        {...props}
      />
      {suffix && <span className="text-gray-500">{suffix}</span>}
    </div>
  );
});
