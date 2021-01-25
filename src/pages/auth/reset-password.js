import Router from "next/router";
import { supabase } from "utils/supabase";

import { useState } from "react";

import Head from "next/head";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import Field from "components/ui/Field";
import Form from "components/ui/Form";
import Input from "components/ui/Input";

export default function ResetPassword({ auth }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const onSubmit = async (event) => {
    event.preventDefault();
    const { error } = await supabase.auth.api.updateUser(
      auth.session.access_token,
      {
        password,
      }
    );
    if (error) {
      setError(error.message);
    } else {
      Router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col space-y-4 items-center justify-center bg-gray-100">
      <Head>
        <title>Reset password | Routes by You</title>
      </Head>
      <h1 className="text-4xl font-black">Routes by You</h1>
      <Card elevation="sm" className="w-full max-w-xs p-4">
        <Form onSubmit={onSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">Reset password</h2>
          {error && (
            <p className="px-4 py-2 rounded-md bg-red-100 text-red-600">
              {error}
            </p>
          )}
          <Field label="New password">
            <Input
              autoFocus
              className="w-full bg-gray-50"
              type="password"
              placeholder="Your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <div className="flex justify-end">
            <Button
              className="px-4 py-2 border rounded-md text-white font-bold"
              bgColor="blue"
              disabled={!password}
            >
              Confirm
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
ResetPassword.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};
