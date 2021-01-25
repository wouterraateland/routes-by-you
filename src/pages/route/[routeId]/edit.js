import Router from "next/router";
import { api } from "utils/api";
import { fontByPoints } from "utils/grades";
import { notify } from "utils/notifications";
import { supabase } from "utils/supabase";
import { pointsToFont } from "utils/grades";
import { getUser } from "utils/authServer";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-use-form-state";

import Head from "next/head";
import Cross from "components/icons/Cross";
import Avatar from "components/ui/Avatar";
import Button from "components/ui/Button";
import Field from "components/ui/Field";
import Form from "components/ui/Form";
import FlyOut from "components/ui/FlyOut";
import Input from "components/ui/Input";
import Textarea from "components/ui/Textarea";

export default function EditRoute({ route }) {
  const [formState, { text, textarea, select }] = useFormState(route);

  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const location = suggestedLocations.find(
    (location) => location.id === formState.values.location_id
  );
  const suggestionsOriginRef = useRef();
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formState.values.location_id) {
        const { data } = await supabase
          .from("locations")
          .select("*")
          .eq("id", formState.values.location_id);
        setSuggestedLocations(data || []);
      } else if (formState.values.location_string) {
        const { data } = await supabase
          .from("locations")
          .select("*")
          .ilike("name", `%${formState.values.location_string}%`);
        setSuggestedLocations(data || []);
      } else {
        setSuggestedLocations([]);
      }
    };

    const t = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(t);
  }, [formState.values.location_id, formState.values.location_string]);

  return (
    <>
      <Head>
        <title>Edit route | Routes by You</title>
      </Head>
      <Form className="absolute inset-0 h-screen flex flex-col bg-gray-50">
        <div className="sticky top-0 pt-safe z-10 border-b bg-white">
          <div className="max-w-xl mx-auto flex items-center justify-between p-2">
            <Button
              type="button"
              className="px-3 py-1 rounded-md hover:bg-gray-100 font-bold"
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
                !formState.values.location_string ||
                !formState.values.grade
              }
            >
              Save
            </Button>
          </div>
        </div>
        <div className="w-full max-w-xl mx-auto space-y-4 p-4">
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
            <select
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:border-blue-600 text-2xl font-bold"
              required
              {...select("grade")}
            >
              {Object.keys(fontByPoints)
                .sort()
                .map((points) => (
                  <option key={points} value={points}>
                    {pointsToFont(points)}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Location">
            <div ref={suggestionsOriginRef}>
              {formState.values.location_id ? (
                location && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar
                        src={location.logo}
                        alt={location.name}
                        className="w-8 h-8 shadow-md"
                      />
                      <span>{location.name}</span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => formState.setField("location_id", null)}
                    >
                      <Cross className="h-4" />
                    </Button>
                  </div>
                )
              ) : (
                <Input
                  required
                  {...text("location_string")}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setTimeout(() => setFocus(false), 10)}
                />
              )}
            </div>
            <FlyOut
              persistOnClick
              originRef={suggestionsOriginRef}
              isOpen={
                !formState.values.location_id &&
                suggestedLocations.length > 0 &&
                focus
              }
              onClose={() => {}}
            >
              {suggestedLocations.map((location) => (
                <Button
                  type="button"
                  key={location.id}
                  className="flex w-full items-center space-x-2 p-2 text-left hover:bg-gray-100 truncate"
                  onClick={() => formState.setField("location_id", location.id)}
                >
                  <Avatar
                    className="w-6 h-6 rounded-full"
                    src={location.logo}
                    alt={location.name}
                  />
                  <span>{location.name}</span>
                </Button>
              ))}
            </FlyOut>
          </Field>
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
