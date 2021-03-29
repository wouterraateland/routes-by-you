import { fontByPoints, pointsToFont, pointsToHsl } from "utils/grades";
import { forwardRef, useEffect, useRef } from "react";

function GradeMarker({ points, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full snap-align-center font-bold focus:outline-none"
      style={{ backgroundColor: pointsToHsl(points) }}
      onClick={onClick}
    >
      {points ? pointsToFont(points) : "?"}
    </button>
  );
}

const ForwardedGradeMarker = forwardRef(GradeMarker);

export default function GradeInput({ value, onChange }) {
  const timeoutRef = useRef();
  const markersRef = useRef({});
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const markers = markersRef.current;

    const flushScroll = () => {
      const scrollCenter = container.scrollLeft + container.offsetWidth / 2;
      const selectedPoints = Object.keys(markers).find(
        (points) =>
          markers[points].offsetLeft +
            markers[points].offsetWidth / 2 -
            scrollCenter ===
          0
      );
      if (selectedPoints) {
        onChange(selectedPoints === "null" ? null : selectedPoints);
      }
    };

    const onScroll = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(flushScroll, 100);
    };

    if (container && markers) {
      container.addEventListener("scroll", onScroll);
      return () => {
        container.removeEventListener("scroll", onScroll);
      };
    }
  }, [onChange]);

  useEffect(() => {
    const container = containerRef.current;
    const markers = markersRef.current;
    if (container && markers) {
      const selectedMarker = markers[value];

      const left =
        selectedMarker.offsetLeft +
        selectedMarker.offsetWidth / 2 -
        container.offsetWidth / 2;
      container.scrollTo({ left, behavior: "smooth" });
    }
  }, [value]);

  return (
    <div className="relative py-4 fade-mask-x">
      <div
        ref={containerRef}
        className="relative flex items-center space-x-4 overflow-x-auto overflow-y-hidden disable-scrollbars snap-x-mandatory"
      >
        <div className="w-1/2 h-px flex-shrink-0" />
        <ForwardedGradeMarker
          ref={(node) => {
            markersRef.current["null"] = node;
          }}
          points={null}
          onClick={() => onChange(null)}
        />
        {Object.keys(fontByPoints)
          .sort()
          .map((points) => (
            <ForwardedGradeMarker
              ref={(node) => {
                markersRef.current[points] = node;
              }}
              key={points}
              points={points}
              onClick={() => onChange(points)}
            />
          ))}
        <div className="w-1/2 h-px flex-shrink-0" />
      </div>
      <div className="absolute inset-0 m-auto w-16 h-16 border-4 border-blue-600 rounded-full pointer-events-none" />
    </div>
  );
}
