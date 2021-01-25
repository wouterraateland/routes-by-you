import cx from "classnames";
import { useState } from "react";

import Cross from "components/icons/Cross";
import Button from "components/ui/Button";

const searchCategories = [
  { label: "Everything", value: null },
  { label: "Routes", value: "routes" },
  { label: "Locations", value: "locations" },
  { label: "Users", value: "users" },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="pt-safe sm:rounded-b-md sm:shadow-md bg-white">
          <div className="flex items-center sm:p-4 sm:space-x-4">
            <Button className="p-4 sm:p-2 sm:rounded-md hover:bg-gray-100">
              <Cross className="h-4 sm:h-6" />
            </Button>
            <input
              className="p-2 sm:p-0 flex-grow focus:outline-none sm:text-xl"
              autoFocus
              placeholder="Search for routes, users, locations"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          {searchCategories.map(({ label, value }) => (
            <Button
              key={label}
              className={cx(
                "px-3 py-1 rounded-md border border-blue-600",
                category === value ? "text-white" : "text-blue-600"
              )}
              bgColor={category === value ? "blue" : undefined}
              onClick={() => setCategory(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
