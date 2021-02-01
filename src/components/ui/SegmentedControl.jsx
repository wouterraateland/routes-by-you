import cx from "classnames";

export function Container({ children }) {
  return (
    <div className="flex rounded-md border divide-x overflow-hidden border-blue-600 divide-blue-600">
      {children}
    </div>
  );
}

export function Item({ checked, onChange, label }) {
  return (
    <label
      className={cx(
        "flex-grow flex items-center justify-center space-x-2 p-1",
        checked ? "bg-blue-500 text-white" : ""
      )}
    >
      <span>{label}</span>
      <input
        className="hidden"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}

export default {
  Container,
  Item,
};
