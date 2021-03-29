import { useEffect, useState } from "react";

import { Layer } from "react-mapbox-gl";

export default function ImagesLayer({ children }) {
  const [images, setImages] = useState(null);

  useEffect(() => {
    const markerBlue = new Image();
    const markerRed = new Image();

    Promise.all([
      new Promise((resolve) => (markerRed.onload = resolve)),
      new Promise((resolve) => (markerBlue.onload = resolve)),
    ]).then(() => {
      setImages({ markerRed, markerBlue });
    });

    markerBlue.src = `data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEyIDBjNi42MjcgMCAxMiA1LjM3MyAxMiAxMnMtNS4zNzMgMTItMTIgMjBDNS4zNzMgMjQgMCAxOC42MjcgMCAxMiAwIDUuMzczIDUuMzczIDAgMTIgMHptMCA2YTYgNiAwIDEwMCAxMiA2IDYgMCAwMDAtMTJ6IiBmaWxsPSIjMjU2M2ViIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+`;
    markerRed.src = `data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEyIDBjNi42MjcgMCAxMiA1LjM3MyAxMiAxMnMtNS4zNzMgMTItMTIgMjBDNS4zNzMgMjQgMCAxOC42MjcgMCAxMiAwIDUuMzczIDUuMzczIDAgMTIgMHptMCA2YTYgNiAwIDEwMCAxMiA2IDYgMCAwMDAtMTJ6IiBmaWxsPSIjZWY0NDQ0IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+`;
  }, []);

  return (
    images && (
      <>
        <Layer images={["marker-blue", images.markerBlue]} />
        <Layer images={["marker-red", images.markerRed]} />
        {children}
      </>
    )
  );
}
