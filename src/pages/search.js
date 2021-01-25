import cx from "classnames";
import Router from "next/router";

import { useState } from "react";
import useDebounce from "hooks/useDebounce";

import Head from "next/head";
import Cross from "components/icons/Cross";
import Button from "components/ui/Button";
import SearchResults from "components/SearchResults";

const searchCategories = [
  { label: "Everything", value: null },
  { label: "Routes", value: "routes" },
  { label: "Users", value: "users" },
  { label: "Locations", value: "locations" },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);

  const debouncedQuery = useDebounce(query);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Search | Routes by You</title>
      </Head>
      <div className="max-w-xl mx-auto space-y-2 pb-4">
        <div className="sticky top-0 z-50 pt-safe sm:rounded-b-md shadow-md bg-white">
          <div className="flex items-center sm:p-4 sm:space-x-4">
            <Button
              className="p-4 sm:p-2 sm:rounded-md hover:bg-gray-100"
              onClick={() => Router.back()}
            >
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
        <div className="flex overflow-x-auto disable-scrollbars">
          <div className="flex space-x-2 px-2 sm:px-0">
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
        <SearchResults query={debouncedQuery} category={category} />
      </div>
    </div>
  );
}
