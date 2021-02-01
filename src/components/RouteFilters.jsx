import cx from "classnames";
import Router from "next/router";

import { fontByPoints, pointsToFont } from "utils/grades";

import { useState } from "react";

import Filter from "components/icons/Filter";
import Loop from "components/icons/Loop";
import Button from "components/ui/Button";
import SegmentedControl from "components/ui/SegmentedControl";

export default function RouteFilters() {
  const [expanded, setExpanded] = useState(false);
  const status = (
    Router.query.status || "repeated,not_repeated,official,user_set,active"
  ).split(",");

  const setParam = (name, value) => {
    Router.replace({
      pathname: Router.pathname,
      query: { ...Router.query, [name]: value },
    });
  };

  const toggleStatus = (s, value) => {
    setParam(
      "status",
      (value ? status.concat(s) : status.filter((other) => other !== s)).join(
        ","
      )
    );
  };

  return (
    <div className="p-4 sm:p-0 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Your feed</h2>
        <div className="flex items-center space-x-2">
          <Button
            className="p-2 rounded-md hover:bg-gray-100"
            hint="Search"
            onClick={() => Router.push("/search")}
          >
            <Loop className="h-6" />
          </Button>
          <Button
            className={cx("p-2 rounded-md hover:bg-gray-100", {
              "text-blue-600": expanded,
            })}
            onClick={() => setExpanded(!expanded)}
            hint="Filter"
          >
            <Filter className="h-6" filled={expanded} />
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="p-4 space-y-2 rounded-md shadow-md bg-white">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Grade</span>
            <select
              className="p-1 rounded-md border bg-gray-50 focus:outline-none focus:border-blue-600"
              value={Router.query.min_grade}
              onChange={(event) => setParam("min_grade", event.target.value)}
            >
              <option value="">?</option>
              {Object.keys(fontByPoints)
                .sort()
                .map((points) => (
                  <option
                    key={points}
                    value={points}
                    disabled={points > Router.query.max_grade}
                  >
                    {pointsToFont(points)}
                  </option>
                ))}
            </select>
            <span>-</span>
            <select
              className="p-1 rounded-md border bg-gray-50 focus:outline-none focus:border-blue-600"
              value={Router.query.max_grade}
              onChange={(event) => setParam("max_grade", event.target.value)}
            >
              <option value="">?</option>
              {Object.keys(fontByPoints)
                .sort()
                .map((points) => (
                  <option
                    key={points}
                    value={points}
                    disabled={points < Router.query.min_grade}
                  >
                    {pointsToFont(points)}
                  </option>
                ))}
            </select>
          </div>
          <SegmentedControl.Container>
            <SegmentedControl.Item
              checked={status.includes("repeated")}
              onChange={(event) =>
                toggleStatus("repeated", event.target.checked)
              }
              label="Repeated"
            />
            <SegmentedControl.Item
              checked={status.includes("not_repeated")}
              onChange={(event) =>
                toggleStatus("not_repeated", event.target.checked)
              }
              label="Not repeated"
            />
          </SegmentedControl.Container>
          <SegmentedControl.Container>
            <SegmentedControl.Item
              checked={status.includes("official")}
              onChange={(event) =>
                toggleStatus("official", event.target.checked)
              }
              label="Official routes"
            />
            <SegmentedControl.Item
              checked={status.includes("user_set")}
              onChange={(event) =>
                toggleStatus("user_set", event.target.checked)
              }
              label="Set by users"
            />
          </SegmentedControl.Container>
          <SegmentedControl.Container>
            <SegmentedControl.Item
              checked={status.includes("active")}
              onChange={(event) => toggleStatus("active", event.target.checked)}
              label="Active"
            />
            <SegmentedControl.Item
              checked={status.includes("archived")}
              onChange={(event) =>
                toggleStatus("archived", event.target.checked)
              }
              label="Archived"
            />
          </SegmentedControl.Container>
        </div>
      )}
    </div>
  );
}
