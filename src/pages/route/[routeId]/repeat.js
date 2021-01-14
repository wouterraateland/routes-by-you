import { api } from "utils/api";
import { redirectIfNotAuthenticated } from "utils/auth";
import { supabase } from "utils/supabase";
import { fontByPoints, pointsToFont } from "utils/grades";

import { useState } from "react";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";

import Head from "next/head";
import Cross from "components/icons/Cross";
import Button from "components/ui/Button";
import Field from "components/ui/Field";
import Input from "components/ui/Input";
import StarRating from "components/StarRating";

export default function RepeatRoute({ route }) {
  const router = useRouter();
  const { user } = useAuth(redirectIfNotAuthenticated);

  const { routeId } = router.query;
  const upstreamRepeat = user
    ? route.repeats.find((repeat) => repeat.user_id === user.id)
    : null;
  const [repeat, setRepeat] = useState(
    upstreamRepeat || {
      route_id: routeId,
      grade: null,
      rating: null,
      video: null,
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
              className="p-2 rounded-md hover:bg-gray-100"
              onClick={() => router.back()}
            >
              <Cross className="h-4" />
            </Button>
          </div>
          <h1 className="text-xl font-bold">{route.name}</h1>
          <div className="w-20 text-right">
            <Button
              disabled={!touched}
              bgColor="blue"
              className="px-3 py-1 rounded-md text-white font-bold"
              onClick={async () => {
                await api.post("repeat", {
                  body: repeat,
                });
                router.back();
              }}
            >
              Save
            </Button>
          </div>
        </header>
        <div className="my-auto space-y-4">
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
            <select
              className="w-48 px-4 py-2 rounded-md border focus:outline-none focus:border-blue-600 text-2xl font-bold"
              value={repeat.grade || ""}
              onChange={(event) =>
                setRepeat((repeat) => ({
                  ...repeat,
                  grade: event.target.value || null,
                }))
              }
            >
              <option value="">?</option>
              {Object.keys(fontByPoints)
                .sort()
                .map((points) => (
                  <option key={points} value={points}>
                    {pointsToFont(points)}
                  </option>
                ))}
            </select>
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
                className="px-4 py-2 rounded-md border text-red-600 hover:bg-gray-100"
                onClick={async () => {
                  await api.delete("repeat", {
                    body: { id: repeat.id },
                  });
                  router.back();
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

export async function getServerSideProps({ params }) {
  const { routeId } = params;

  const { data: route, error } = await supabase
    .from("routes")
    .select(
      `
        *,
        setter: setter_id (*),
        repeats (*),
        location: location_id (*),
        location_string,
        comments: route_comments (*)
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
