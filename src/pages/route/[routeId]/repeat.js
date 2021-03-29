import Router from "next/router";

import { api } from "utils/api";
import { supabase } from "utils/supabase";

import { useState } from "react";

import Head from "next/head";
import Cross from "components/icons/Cross";
import Button from "components/ui/Button";
import Field from "components/ui/Field";
import Input from "components/ui/Input";
import Textarea from "components/ui/Textarea";
import StarRating from "components/StarRating";
import GradeInput from "components/routes/GradeInput";

export default function RepeatRoute({ auth, route }) {
  const { routeId } = Router.query;
  const upstreamRepeat = route.repeats.find(
    (repeat) => repeat.user_id === auth?.user?.id
  );
  const [repeat, setRepeat] = useState(
    upstreamRepeat || {
      route_id: routeId,
      grade: null,
      rating: null,
      video: null,
      comment: null,
      attempt: 1,
    }
  );
  const touched = repeat !== upstreamRepeat;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{`Repeat | ${route.name}`}</title>
      </Head>
      <div className="min-h-screen max-w-xl mx-auto flex flex-col">
        <header className="flex items-center justify-between p-2">
          <div className="w-20">
            <Button
              className="p-2 rounded-md"
              bgColor="white"
              onClick={() => Router.back()}
            >
              <Cross className="h-4" />
            </Button>
          </div>
          <h1 className="text-xl font-bold truncate">{route.name}</h1>
          <div className="w-20 text-right">
            <Button
              disabled={!touched}
              bgColor="blue"
              className="px-3 py-1 rounded-md text-white font-bold"
              onClick={async () => {
                await api.post("repeat", {
                  body: repeat,
                });
                Router.back();
              }}
            >
              Save
            </Button>
          </div>
        </header>
        <div className="my-auto py-4 space-y-4">
          <Field label="Attempt" className="text-center">
            <select
              className="w-48 px-4 py-2 rounded-md border focus:outline-none focus:border-blue-600 text-2xl font-bold"
              value={repeat.attempt}
              onChange={(event) =>
                setRepeat((repeat) => ({
                  ...repeat,
                  attempt: event.target.value,
                }))
              }
            >
              <option value={null}>-</option>
              <option value={1}>Flash</option>
              {Array(30)
                .fill()
                .map((_, i) => i + 2)
                .map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Grade" className="text-center">
            <GradeInput
              value={repeat.grade}
              onChange={(grade) =>
                setRepeat((repeat) => ({ ...repeat, grade }))
              }
            />
          </Field>
          <div className="text-center">
            <p className="text-gray-500">Rating</p>
            <div className="flex justify-center text-gray-500">
              <StarRating
                className="h-12"
                value={repeat.rating}
                onChange={(rating) =>
                  setRepeat((repeat) => ({ ...repeat, rating }))
                }
              />
            </div>
          </div>
          {!upstreamRepeat && (
            <Field label="Comment" className="max-w-sm mx-auto px-4">
              <Textarea
                className="flex w-full px-4 py-2 rounded-md border focus:outline-none focus:border-blue-600 bg-white"
                rows={4}
                extraHeight={2}
                value={repeat.comment || ""}
                onChange={(event) =>
                  setRepeat((repeat) => ({
                    ...repeat,
                    comment: event.target.value || null,
                  }))
                }
              />
            </Field>
          )}
          <Field
            label="Link to video"
            hint="Youtube, Instagram, etc."
            className="max-w-sm mx-auto px-4"
          >
            <Input
              value={repeat.video || ""}
              onChange={(event) =>
                setRepeat((repeat) => ({
                  ...repeat,
                  video: event.target.value || null,
                }))
              }
            />
          </Field>
          {repeat.id && (
            <div className="flex justify-center pt-4">
              <Button
                className="px-4 py-2 rounded-md border text-red-600"
                bgColor="white"
                onClick={async () => {
                  await api.delete("repeat", {
                    body: { id: repeat.id },
                  });
                  Router.back();
                }}
              >
                Delete repeat
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
RepeatRoute.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};

export async function getServerSideProps({ params }) {
  const { routeId } = params;

  const { data: route, error } = await supabase
    .from("routes")
    .select(
      `
        *,
        setter: setter_id (*),
        repeats: repeats!route_id (*),
        location: location_id (*),
        reports: route_reports (*)
      `
    )
    .eq("id", routeId)
    .order("created_at", { ascending: false, foreignTable: "repeats" })
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { route } };
}
