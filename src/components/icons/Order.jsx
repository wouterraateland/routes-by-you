import Icon from "./Icon";

export default function Order({ direction, ...props }) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path d="M20 11h7v16H3V11h7m11 5l-6 6-6-6m6 6V3" fill="none" />
    </Icon>
  );
}
