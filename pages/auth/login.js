import { supabase } from "utils/supabase";

import { useState } from "react";
import useAuthRedirect from "hooks/useAuthRedirect";

import Link from "next/link";
import Button from "components/ui/Button";
import Card from "components/ui/Card";

const isAuthenticated = ({ user }) => !!user;

export default function Login() {
  useAuthRedirect(isAuthenticated, "/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [sent, setSent] = useState(false);

  const onSignIn = async (event) => {
    event.preventDefault();
    const { error, user } = await supabase.auth.signIn({ email, password });
    if (error) {
      setError(error.message);
    } else if (!user) {
      setSent(true);
    }
  };

  async function forgotPassword() {
    const email = prompt("Please enter your email:");
    if (email === null || email === "")
      return alert("You must enter your email.");

    const { error } = await supabase.auth.api.resetPasswordForEmail(email);
    if (error) return alert(error.message);
    alert("Password recovery email has been sent.");
  }

  return (
    <div className="min-h-screen flex flex-col space-y-4 items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-black">Routes by You</h1>
      <Card elevation="sm" className="w-full max-w-xs p-4">
        {sent ? (
          <div>
            <h2>Magic link sent!</h2>
            <p>Check your inbox</p>
          </div>
        ) : (
          <form onSubmit={onSignIn} className="space-y-4">
            <h2 className="text-xl font-bold">Sign in</h2>
            {error && (
              <p className="px-4 py-2 rounded-md bg-red-100 text-red-600">
                {error}
              </p>
            )}
            <label className="block">
              <span className="block text-xs">Email</span>
              <input
                required
                className="w-full border border-gray-300 rounded-md flex-grow px-4 py-2 bg-gray-50"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <div>
              <label className="block">
                <span className="block text-xs">Password</span>
                <input
                  className="w-full border border-gray-300 rounded-md flex-grow px-4 py-2 bg-gray-50"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-blue-600 hover:underline text-sm"
                  onClick={forgotPassword}
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="px-4 py-2 border rounded-md bg-blue-600 hover:bg-blue-700 border-blue-900 text-white font-bold">
                {password.length ? "Sign in" : "Send magic link"}
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <span>No account yet?</span>
              <Link href="/auth/register">
                <a className="text-blue-600 hover:underline font-bold">
                  Sign up
                </a>
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
