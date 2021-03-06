import { supabase } from "utils/supabase";

import { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import Input from "components/ui/Input";
import Field from "components/ui/Field";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const onSignUp = async (event) => {
    event.preventDefault();

    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setError(error ? error.message : null);
    setSubmitted(!error);
  };

  return (
    <div className="min-h-screen flex flex-col space-y-4 items-center justify-center bg-gray-100">
      <Head>
        <title>Sign up | Routes by You</title>
      </Head>
      <h1 className="text-4xl font-black">Routes by You</h1>
      <Card elevation="sm" className="w-full max-w-xs p-4">
        {submitted ? (
          <div>
            <h2>Your account is registered</h2>
            <p>
              We sent you an email to confirm your email address. Follow the
              instructions there to get started.
            </p>
          </div>
        ) : (
          <form onSubmit={onSignUp} className="space-y-4">
            <h2 className="text-xl font-bold">Sign up</h2>
            {error && (
              <p className="px-4 py-2 rounded-md bg-red-100 text-red-600">
                {error}
              </p>
            )}
            <Field label="Email">
              <Input
                required
                className="w-full bg-gray-50"
                type="email"
                name="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password">
              <Input
                required
                className="w-full bg-gray-50"
                type="password"
                name="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <div className="flex justify-end">
              <Button
                className="px-4 py-2 border rounded-md text-white font-bold"
                bgColor="blue"
                disabled={!email || !password}
              >
                Sign up
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <span>Already have an account?</span>
              <Link href="/auth/login">
                <a className="text-blue-600 hover:underline font-bold">
                  Sign in
                </a>
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
Register.authPolicy = {
  isAuthorized: (auth) => !auth.user,
  redirect: "/profile",
};
