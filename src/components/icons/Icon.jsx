import cx from "classnames";

export default function Icon({ className, strokeWidth = 3, filled, ...props }) {
  return (
    <svg
      className={cx(
        "flex-shrink-0 stroke-round stroke-current fill-current",
        `stroke-${strokeWidth}`,
        className
      )}
      {...props}
    />
  );
}
