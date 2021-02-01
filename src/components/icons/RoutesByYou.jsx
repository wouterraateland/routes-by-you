import Icon from "./Icon";

export default function RoutesByYou({ filled, color = "black", ...props }) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <defs>
        <linearGradient
          x1="62.5%"
          y1="0%"
          x2="50%"
          y2="50%"
          id={`gr1-${color}`}
        >
          <stop stopColor="currentColor" stopOpacity={0} offset="0%" />
          <stop stopColor="currentColor" stopOpacity={0.75} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="37.5%"
          y1="0%"
          x2="50%"
          y2="50%"
          id={`gr2-${color}`}
        >
          <stop stopColor="currentColor" stopOpacity={0} offset="0%" />
          <stop stopColor="currentColor" stopOpacity={0.75} offset="100%" />
        </linearGradient>
      </defs>
      <path
        d="M12 15c4.418 0 9-1.582 9-6s-4.582-6-9-6-9 1.582-9 6 4.582 6 9 6z"
        strokeWidth={4}
        fill={filled ? undefined : "none"}
      />
      <path
        fill="none"
        stroke={`url(#gr1-${color})`}
        strokeWidth={3}
        d="M8 15l-4 8"
      />
      <path
        fill="none"
        stroke={`url(#gr2-${color})`}
        strokeWidth={3}
        d="M16 15l4 8"
      />
    </Icon>
  );
}
