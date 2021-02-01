import cx from "classnames";

import { useRouter } from "next/router";

import Link from "next/link";

export function Container({ children }) {
  return <div className="flex items-center">{children}</div>;
}

export function Tab({ href, label, Icon }) {
  const router = useRouter();
  const active = router.asPath === href;
  return (
    <Link href={href}>
      <a
        className={cx(
          "flex items-center justify-center space-x-2 flex-grow p-2 sm:p-4 border-b-2 hover:bg-gray-100",
          active ? "border-current text-blue-600" : "border-transparent"
        )}
      >
        {Icon && (
          <Icon
            className="h-4"
            filled={active}
            color={active ? "blue" : "black"}
          />
        )}
        <p>{label}</p>
      </a>
    </Link>
  );
}

export default {
  Container,
  Tab,
};
