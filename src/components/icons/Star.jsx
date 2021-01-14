import Icon from "./Icon";

export default function Star({ filled, ...props }) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="M16 4l-3 9H4l7 5.5L8 28l8-6 8 6-3-9.5 7-5.5h-9z"
        fill={filled ? undefined : "none"}
      />
    </Icon>
  );
}
