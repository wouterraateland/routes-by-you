import Router from "next/router";

import { useEffect } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }) {
  useEffect(() => {
    if (error.name === "RedirectError") {
      Router.replace(error.to);
    }
  }, [error]);
  if (error.name === "RedirectError") {
    return null;
  }
  return (
    <div className="p-4 rounded-md bg-red-100 text-red-600">
      <p>{JSON.stringify(error)}</p>
    </div>
  );
}

export default function ErrorBoundary(props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      resetKeys={[props.children]}
      {...props}
    />
  );
}
