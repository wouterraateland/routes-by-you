import "styles/index.css";

import ErrorBoundary from "containers/ErrorBoundary";
import SSRSuspense from "containers/SSRSuspense";
import Loader from "components/ui/Loader";

export default function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <SSRSuspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        }
      >
        <Component {...pageProps} />
      </SSRSuspense>
    </ErrorBoundary>
  );
}
