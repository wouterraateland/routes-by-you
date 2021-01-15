import { supabase, getSupabaseResource } from "utils/supabase";

import { useMemo, useState } from "react";
import useResource from "hooks/useResource";

import Head from "next/head";
import Shell from "components/Shell";
import Button from "components/ui/Button";
import ImageInput from "components/ui/ImageInput";
import Input from "components/ui/Input";
import Field from "components/ui/Field";
import Link from "next/link";

export default function Profile({ auth }) {
  const profileResource = useMemo(
    () =>
      getSupabaseResource(
        supabase.from("users").select("*").eq("id", auth.user.id),
        {
          single: true,
        }
      ),
    [auth.user.id]
  );
  const profile = useResource(profileResource);
  const [userData, setUserData] = useState(profile);

  const updateUserData = async (event) => {
    event.preventDefault();
    await profileResource.update({
      display_name: userData.display_name,
      avatar: userData.avatar,
    });
    setUserData((profile) => ({
      ...profile,
      display_name: userData.display_name,
      avatar: userData.avatar,
      touched: false,
    }));
  };

  return (
    <Shell>
      <Head>
        <title>My profile | Routes by You</title>
      </Head>
      <div className="max-w-xl mx-auto p-4 space-y-4">
        <form
          className="w-full max-w-sm space-y-2 mx-auto"
          onSubmit={updateUserData}
        >
          <ImageInput
            className="mx-auto w-48 h-48 object-cover rounded-full bg-gray-100"
            value={userData.avatar}
            onChange={(avatar) =>
              setUserData((prev) => ({ ...prev, avatar, touched: true }))
            }
            onDelete={() =>
              setUserData((prev) => ({
                ...prev,
                avatar: null,
                touched: true,
              }))
            }
          />
          <Field label="Display name">
            <Input
              required
              autoFocus={!userData.display_name}
              className="w-full"
              type="text"
              placeholder="Your name"
              value={userData.display_name}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  display_name: e.target.value,
                  touched: true,
                }))
              }
            />
          </Field>
          {userData.touched && (
            <Button
              className="w-full px-4 py-2 rounded-md text-white font-bold"
              bgColor="blue"
            >
              Save
            </Button>
          )}
        </form>
        <div className="text-center">
          <Link href="/auth/logout">
            <a className="px-4 py-2 rounded-md text-white font-bold bg-red-600 hover:bg-red-700">
              Sign out
            </a>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
Profile.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};
