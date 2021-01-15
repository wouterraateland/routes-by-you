import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }) {
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
