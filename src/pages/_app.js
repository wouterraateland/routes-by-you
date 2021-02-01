import "styles/index.css";
import Router from "next/router";

import { useEffect } from "react";
import useAuth from "hooks/useAuth";

import ErrorBoundary from "containers/ErrorBoundary";
import SSRSuspense from "containers/SSRSuspense";
import VisibleHeightObserver from "containers/VisibleHeightObserver";

import Head from "next/head";
import Notifications from "components/notifications";
import Loader from "components/ui/Loader";

function AuthBoundary({ Component, pageProps }) {
  const auth = useAuth();

  const { isAuthorized, redirect } = Component.authPolicy;
  const authorized = isAuthorized(auth);

  useEffect(() => {
    if (!authorized) {
      Router.replace(redirect);
    }
  }, [authorized]);

  return authorized ? <Component auth={auth} {...pageProps} /> : null;
}

export default function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </Head>
      <VisibleHeightObserver />
      <SSRSuspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader className="text-blue-600" />
          </div>
        }
      >
        {Component.authPolicy ? (
          typeof window !== "undefined" && (
            <AuthBoundary Component={Component} pageProps={pageProps} />
          )
        ) : (
          <Component {...pageProps} />
        )}
        <Notifications />
      </SSRSuspense>
    </ErrorBoundary>
  );
}
