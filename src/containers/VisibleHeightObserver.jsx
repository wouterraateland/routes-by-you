import { useEffect } from "react";

export default function VisibleHeightObserver() {
  useEffect(() => {
    const resize = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight / 100}px`
      );
    };

    resize();

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  });
  return null;
}
