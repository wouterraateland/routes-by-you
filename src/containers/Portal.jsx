import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }) {
  const [container, setContainer] = useState();

  useEffect(() => {
    if (!container) {
      const container = document.createElement("div");
      setContainer(container);
    }
  }, [container]);

  useEffect(() => {
    if (container) {
      document.body.appendChild(container);
      return () => {
        document.body.removeChild(container);
      };
    }
  }, [container]);

  return container ? createPortal(children, container) : null;
}
