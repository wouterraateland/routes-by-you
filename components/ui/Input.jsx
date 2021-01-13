import cx from "classnames";

export default function Input({ className, prefix, suffix, ...props }) {
  return (
    <div
      className={cx(
        "flex min-w-0 px-4 py-2 rounded-md border focus-within:border-blue-600 bg-white",
        className
      )}
    >
      {prefix && <span className="text-gray-500">{prefix}</span>}
      <input
        className="min-w-0 w-full flex-grow focus:outline-none"
        {...props}
      />
      {suffix && <span className="text-gray-500">{suffix}</span>}
    </div>
  );
}
