import cx from "classnames";
import { useRouter } from "next/router";
import useAuthRedirect from "hooks/useAuthRedirect";

import Link from "next/link";
import Calendar from "components/icons/Calendar";
import Home from "components/icons/Home";
import Person from "components/icons/Person";
import Plus from "components/icons/Plus";

const tabs = [
  { href: "/dashboard", Icon: Home, label: "Home" },
  { href: "/comps", Icon: Calendar, label: "Comps" },
  { href: "/profile", Icon: Person, label: "Profile" },
  { href: "/new", Icon: Plus, label: "New" },
];

const isNotAuthenticated = ({ user }) => !user;

export default function Shell({ children }) {
  useAuthRedirect(isNotAuthenticated, "/auth/login");

  const { pathname } = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <nav className="absolute bottom-0 left-0 right-0 pb-safe pl-safe pr-safe bg-white border-t border-gray-100">
        <div className="flex items-center justify-around">
          {tabs.map(({ href, Icon, label }) => (
            <Link href={href} key={href}>
              <a
                className={cx(
                  "flex-grow flex flex-col sm:flex-row items-center justify-center p-2 space-y-1 sm:space-y-0 sm:space-x-2",
                  { "text-blue-600": pathname === href }
                )}
              >
                <Icon className="h-6 stroke-current stroke-3" />
                <span className="text-xs opacity-75">{label}</span>
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
