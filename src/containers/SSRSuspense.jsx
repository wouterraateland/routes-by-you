import { Suspense, useEffect, useState } from "react";

export default function SSRSuspense(props) {
  const [isServer, setIsServer] = useState(typeof window === "undefined");
  useEffect(() => {
    setIsServer(typeof window === "undefined");
  }, []);

  return isServer ? props.fallback : <Suspense {...props} />;
}
