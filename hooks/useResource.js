import { useEffect, useState } from "react";

export default function useResource(resource) {
  const [, forceUpdate] = useState();

  useEffect(() => resource.observe(forceUpdate), [resource]);

  return resource.read();
}
