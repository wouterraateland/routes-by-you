import { supabase } from "utils/supabase";
import { authResource } from "resources/AuthResource";

import { useEffect, useState } from "react";
import useResource from "hooks/useResource";

import Shell from "components/Shell";
import Button from "components/ui/Button";
import ImageInput from "components/ui/ImageInput";

export default function Profile() {
  const { user } = useResource(authResource);
  const [userData, setUserData] = useState();
  const [error, setError] = useState();
  const [pending, setPending] = useState(true);

  useEffect(() => {
    if (user) {
      supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .then(({ data }) => setUserData(data[0]))
        .catch((error) => setError(error.message))
        .finally(() => setPending(false));
    }
  }, [user]);

  const updateUserData = (event) => {
    event.preventDefault();
    supabase
      .from("users")
      .update({ display_name: userData.display_name, avatar: userData.avatar })
      .eq("id", user.id)
      .then(({ data }) => setUserData(data[0]))
      .catch((error) => setError(error.message));
  };

  return (
    <Shell>
      <div className="mx-auto max-w-xl p-4 space-y-4">
        {error ? (
          <p className="px-4 py-2 rounded-md bg-red-100 text-red-600">
            {error}
          </p>
        ) : pending ? (
          <p>...</p>
        ) : (
          <>
            <form
              className="w-full max-w-sm space-y-2"
              onSubmit={updateUserData}
            >
              <ImageInput
                className="w-48 h-48 object-cover rounded-full bg-gray-100"
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
              <label className="block">
                <span className="block text-xs">Display name</span>
                <input
                  required
                  className="w-full border border-gray-300 rounded-md flex-grow px-4 py-2 bg-gray-50"
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
              </label>
              {userData.touched && (
                <Button
                  className="w-full px-4 py-2 rounded-md text-white font-bold"
                  bgColor="blue"
                >
                  Save
                </Button>
              )}
            </form>
            <Button
              type="button"
              className="px-4 py-2 rounded-md text-white font-bold"
              bgColor="red"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </Button>
          </>
        )}
      </div>
    </Shell>
  );
}
