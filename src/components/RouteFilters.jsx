import cx from "classnames";
import { fontByPoints, pointsToFont } from "utils/grades";

import { useState } from "react";

import Filter from "components/icons/Filter";
import Loop from "components/icons/Loop";
import Button from "components/ui/Button";

export default function RouteFilters({ filters, setFilters }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 sm:p-0 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Your feed</h2>
        <div className="flex items-center space-x-2">
          <Button className="p-1 rounded-md hover:bg-gray-100" hint="Search">
            <Loop className="h-4" />
          </Button>
          <Button
            className={cx("p-1 rounded-md hover:bg-gray-100", {
              "text-blue-600": expanded,
            })}
            onClick={() => setExpanded(!expanded)}
            hint="Filter"
          >
            <Filter className="h-4" filled={expanded} />
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="p-4 space-y-2 rounded-md shadow-md bg-white">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Grade</span>
            <select
              className="p-1 rounded-md border bg-gray-50 focus:outline-none focus:border-blue-600"
              value={filters.min_grade}
              onChange={(event) =>
                setFilters((filters) => ({
                  ...filters,
                  min_grade: event.target.value,
                }))
              }
            >
              <option value="">From</option>
              {Object.keys(fontByPoints)
                .sort()
                .map((points) => (
                  <option
                    key={points}
                    value={points}
                    disabled={points > filters.max_grade}
                  >
                    {pointsToFont(points)}
                  </option>
                ))}
            </select>
            <span>-</span>
            <select
              className="p-1 rounded-md border bg-gray-50 focus:outline-none focus:border-blue-600"
              value={filters.max_grade}
              onChange={(event) =>
                setFilters((filters) => ({
                  ...filters,
                  max_grade: event.target.value,
                }))
              }
            >
              <option value="">To</option>
              {Object.keys(fontByPoints)
                .sort()
                .map((points) => (
                  <option
                    key={points}
                    value={points}
                    disabled={points < filters.min_grade}
                  >
                    {pointsToFont(points)}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.show_repeated}
                onChange={(event) =>
                  setFilters((filters) => ({
                    ...filters,
                    show_repeated: event.target.checked,
                  }))
                }
              />
              <span>Repeated</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.show_not_repeated}
                onChange={(event) =>
                  setFilters((filters) => ({
                    ...filters,
                    show_not_repeated: event.target.checked,
                  }))
                }
              />
              <span>Not repeated</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
