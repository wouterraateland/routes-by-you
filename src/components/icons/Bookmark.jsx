import Icon from "./Icon";

export default function Bookmark({ filled, ...props }) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path d="M26 2v28L16 20 6 30V2z" fill={filled ? undefined : "none"} />
    </Icon>
  );
}
