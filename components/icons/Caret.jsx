import Icon from "./Icon";

const getTransform = (direction) => {
  switch (direction) {
    case "left":
      return `rotate(90deg)`;
    case "right":
      return `rotate(-90deg)`;
    case "up":
      return `rotate(180deg)`;
    default:
      return null;
  }
};

export default function Caret({ direction, style, ...props }) {
  return (
    <Icon
      viewBox="0 0 32 32"
      style={{ ...style, transform: getTransform(direction) }}
      {...props}
    >
      <path d="M28 10L16 22 4 10" fill="none" />
    </Icon>
  );
}
