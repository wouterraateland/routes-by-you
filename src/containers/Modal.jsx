import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, isOpen, onClose }) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (!container) {
      const container = document.createElement("div");
      container.className = "fixed inset-0 z-50";
      setContainer(container);
    }
  }, [container]);

  useEffect(() => {
    const prevent = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    if (container && typeof onClose === "function") {
      const tryClose = (event) => {
        if (event.target === event.currentTarget) {
          onClose(event);
        }
      };
      container.addEventListener("click", tryClose);
      container.addEventListener("wheel", prevent);
      return () => {
        container.removeEventListener("click", tryClose);
        container.removeEventListener("wheel", prevent);
      };
    }
  }, [container, onClose]);

  useEffect(() => {
    if (container) {
      if (isOpen) {
        document.body.appendChild(container);
      }
      container.classList.toggle("pointer-events-none", !isOpen);
    }
  }, [container, isOpen]);

  useEffect(() => {
    if (container) {
      return () => {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      };
    }
  }, [container]);

  return container ? createPortal(children, container) : null;
}
