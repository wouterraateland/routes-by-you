import { fetchRandomRouteName } from "utils/routes";

import { useCallback } from "react";

import SSRSuspense from "containers/SSRSuspense";

import Random from "components/icons/Random";

import Button from "components/ui/Button";
import Field from "components/ui/Field";
import Input from "components/ui/Input";
import Loader from "components/ui/Loader";
import Textarea from "components/ui/Textarea";

import GradeInput from "components/routes/GradeInput";
import LocationField from "./LocationField";
import MapInput from "./MapInput";

export default function RouteSettingInfoInput({ route, setRoute }) {
  const setField = useCallback(
    (field, value) => setRoute((route) => ({ ...route, [field]: value })),
    [setRoute]
  );

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 p-4">
      <Field label="Route name">
        <div className="space-y-2 sm:flex sm:items-center sm:space-x-4 sm:space-y-0">
          <Input
            className="w-full flex-grow"
            required
            value={route.name}
            onChange={(event) =>
              setRoute((route) => ({
                ...route,
                name: event.target.value,
              }))
            }
          />
          <Button
            className="flex space-x-2 items-center px-4 py-2 rounded-md border font-bold"
            bgColor="white"
            onClick={async () => {
              const name = await fetchRandomRouteName();
              setRoute((route) => ({ ...route, name }));
            }}
          >
            <Random className="h-4" />
            <span>Random</span>
          </Button>
        </div>
      </Field>
      <Field label="Description">
        <Textarea
          className="w-full rounded-md px-4 py-2 border focus:outline-none focus:border-blue-600"
          rows={2}
          extraHeight={2}
          value={route.description}
          onChange={(event) =>
            setRoute((route) => ({
              ...route,
              description: event.target.value,
            }))
          }
        />
      </Field>
      <Field label="Grade">
        <GradeInput
          value={route.grade}
          onChange={(grade) => setRoute((route) => ({ ...route, grade }))}
        />
      </Field>
      <SSRSuspense fallback={<Loader />}>
        <LocationField route={route} onChange={setField} />
        <div>
          <p className="text-gray-500">
            Exact location (click to add / remove)
          </p>
          <MapInput
            className="relative rounded-md h-64 md:h-96 overflow-hidden"
            route={route}
            setRoute={setField}
          />
        </div>
      </SSRSuspense>
    </div>
  );
}
