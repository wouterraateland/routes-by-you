import Icon from "./Icon";

export default function Flash({ filled, ...props }) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path d="M13 30V16H7L17 2v14h6z" fill={filled ? undefined : "none"} />
    </Icon>
  );
}
