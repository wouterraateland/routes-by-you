import Router from "next/router";
import { api } from "utils/api";
import { notify } from "utils/notifications";
import { supabase } from "utils/supabase";
import { getUser } from "utils/authServer";

import { useCallback } from "react";
import { useFormState } from "react-use-form-state";

import SSRSuspense from "containers/SSRSuspense";

import Head from "next/head";
import Button from "components/ui/Button";
import Field from "components/ui/Field";
import Form from "components/ui/Form";
import Input from "components/ui/Input";
import Loader from "components/ui/Loader";
import Textarea from "components/ui/Textarea";
import GradeInput from "components/routes/GradeInput";
import LocationField from "components/route-setting/LocationField";
import MapInput from "components/route-setting/MapInput";

export default function EditRoute({ route }) {
  const [formState, { text, textarea }] = useFormState({
    ...route,
    geometry: route.geometry ? route.geometry.coordinates : null,
  });

  const setField = useCallback(
    (field, value) => formState.setField(field, value),
    [formState.setField]
  );

  return (
    <>
      <Head>
        <title>Edit route | Routes by You</title>
      </Head>
      <Form className="min-h-screen flex flex-col bg-gray-50">
        <div className="sticky top-0 pt-safe z-10 border-b bg-white">
          <div className="max-w-xl mx-auto flex items-center justify-between p-2">
            <Button
              type="button"
              className="px-3 py-1 rounded-md font-bold"
              bgColor="white"
              onClick={() => Router.back()}
            >
              Cancel
            </Button>
            <p>Edit route</p>
            <Button
              bgColor="blue"
              className="px-3 py-1 rounded-md font-bold text-white"
              onClick={async () => {
                await api.post("route", {
                  body: {
                    ...formState.values,
                  },
                });
                Router.replace(`/route/${route.id}`);
                notify("Route updated!");
              }}
              disabled={
                !formState.values.name ||
                (!formState.values.location_string &&
                  !formState.values.location_id)
              }
            >
              Save
            </Button>
          </div>
        </div>
        <div className="w-screen max-w-xl mx-auto space-y-4 p-4">
          <Field label="Route name">
            <Input className="w-full" required {...text("name")} />
          </Field>
          <Field label="Description">
            <Textarea
              className="w-full rounded-md px-4 py-2 border focus:outline-none focus:border-blue-600"
              rows={2}
              extraHeight={2}
              {...textarea("description")}
            />
          </Field>
          <Field label="Grade">
            <div className="-mx-4">
              <GradeInput
                value={formState.values.grade}
                onChange={(points) => formState.setField("grade", points)}
              />
            </div>
          </Field>
          <SSRSuspense fallback={<Loader />}>
            <LocationField route={formState.values} onChange={setField} />
            <div>
              <p className="text-gray-500">
                Exact location (click to add / remove)
              </p>
              <MapInput
                className="relative rounded-md h-64 md:h-96 overflow-hidden"
                route={formState.values}
                onChange={setField}
              />
            </div>
          </SSRSuspense>
        </div>
      </Form>
    </>
  );
}
EditRoute.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};

export async function getServerSideProps({ req, params }) {
  const { user } = await getUser(req);
  const { routeId } = params;

  const { data: route, error } = await supabase
    .from("routes")
    .select(
      `
        *,
        location: location_id (*)
      `
    )
    .eq("id", routeId)
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  if (!user || route.setter_id !== user.id) {
    return { notFound: true };
  }

  return { props: { route } };
}
