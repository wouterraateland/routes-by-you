import Icon from "./Icon";

export default function Filter({ filled, ...props }) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="M8 8h21M1 8h3m-3 7h21m7 0h-3M1 22h9m19 0H14M6 10a2 2 0 100-4 2 2 0 000 4zm18 7a2 2 0 100-4 2 2 0 000 4zm-12 7a2 2 0 100-4 2 2 0 000 4z"
        fill={filled ? undefined : "none"}
      />
    </Icon>
  );
}
