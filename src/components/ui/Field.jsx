import cx from "classnames";

export default function Field({ label, error, hint, children, className }) {
  return (
    <label className={cx("block", className)}>
      {label && <span className="block text-gray-500">{label}</span>}
      {children}
      {error ? (
        <span className="block text-xs text-red-600">{error}</span>
      ) : (
        hint && <span className="block text-xs text-gray-500">{hint}</span>
      )}
    </label>
  );
}
