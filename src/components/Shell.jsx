import cx from "classnames";
import { redirectIfNotAuthenticated } from "utils/auth";

import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";

import Link from "next/link";
import Home from "components/icons/Home";
import Person from "components/icons/Person";
import Flash from "components/icons/Flash";

const tabs = [
  { href: "/feed", Icon: Home, label: "Home" },
  { href: "/profile", Icon: Person, label: "Profile" },
  { href: "/route/new", Icon: Flash, label: "New" },
];

export default function Shell({ children }) {
  useAuth(redirectIfNotAuthenticated);

  const { pathname } = useRouter();

  return (
    <div className="flex flex-col min-h-screen sm:flex-col-reverse bg-gray-50">
      <div className="w-full flex-grow">{children}</div>
      <div className="sticky bottom-0 sm:top-0 sm:bottom-auto left-0 right-0">
        <nav className="max-w-2xl mx-auto pb-safe pl-safe pr-safe sm:rounded-b-md shadow-md bg-white border-t">
          <div className="flex items-center justify-around">
            {tabs.map(({ href, Icon, label }) => (
              <Link href={href} key={href}>
                <a
                  className={cx(
                    "flex-grow flex flex-col sm:flex-row items-center justify-center p-2 space-y-1 sm:space-y-0 sm:space-x-2 hover:bg-gray-100",
                    { "text-blue-600": pathname === href }
                  )}
                >
                  <Icon className="h-6" filled={pathname === href} />
                  <span className="text-xs opacity-75">{label}</span>
                </a>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
