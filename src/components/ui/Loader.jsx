import cx from "classnames";

export default function Loader({ className, ...props }) {
  return (
    <div
      {...props}
      className={cx(
        "animate-pulse rounded-full m-auto w-4 h-4 bg-blue-600",
        className
      )}
    />
  );
}
