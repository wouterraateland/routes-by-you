import cx from "classnames";
import { appear } from "utils/transitions";
import { setStyle } from "utils/dom";

import { useCallback, useEffect, useState } from "react";
import useCSSTransition from "hooks/useCSSTransition";

import Portal from "containers/Portal";

export default function ToolTip({
  originRef,
  direction = "vertical",
  maxWidth = Infinity,
  className,
  children,
}) {
  const [visible, setVisibility] = useState(false);
  const toolTipRef = useCSSTransition(visible, {
    timeout: 200,
    appear: true,
    classNames: appear,
  });

  const setPosition = useCallback(() => {
    const origin = originRef.current;
    const toolTip = toolTipRef.current;

    if (origin && toolTip && typeof window !== "undefined") {
      const rect = origin.getBoundingClientRect();

      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;

      const _direction =
        direction === "vertical"
          ? rect.y + rect.height / 2 < wHeight / 2
            ? "bottom"
            : "top"
          : direction === "horizontal"
          ? rect.x + rect.width / 2 < wWidth / 2
            ? "right"
            : "left"
          : direction;

      switch (_direction) {
        case "top":
          setStyle(toolTip, {
            top: undefined,
            left: rect.x + rect.width / 2,
            bottom: wHeight - rect.y,
            right: undefined,
            transform: `translate(-50%, 0)`,
            maxWidth: Math.min(maxWidth, wWidth),
          });
          break;
        case "left":
          setStyle(toolTip, {
            top: rect.y + rect.height / 2,
            left: undefined,
            bottom: undefined,
            right: rect.x,
            transform: `translate(0, -50%)`,
            maxWidth: Math.min(maxWidth, rect.x),
          });
          break;
        case "bottom":
          setStyle(toolTip, {
            top: rect.y + rect.height,
            left: rect.x + rect.width / 2,
            bottom: undefined,
            right: undefined,
            transform: `translate(-50%, 0)`,
            maxWidth: Math.min(maxWidth, wWidth),
          });
          break;
        case "right":
          setStyle(toolTip, {
            top: rect.y + rect.height / 2,
            left: rect.x + rect.width,
            bottom: undefined,
            right: undefined,
            transform: `translate(0, -50%)`,
            maxWidth: Math.min(maxWidth, wWidth - (rect.x + rect.width)),
          });
          break;
        default:
          break;
      }
    }
  }, [originRef, direction, maxWidth, toolTipRef]);

  useEffect(() => {
    const origin = originRef.current;

    if (origin) {
      const show = () => {
        setPosition();
        setVisibility(true);
      };

      const hide = () => setVisibility(false);

      origin.addEventListener("mouseenter", show);
      origin.addEventListener("mouseleave", hide);

      return () => {
        origin.removeEventListener("mouseenter", show);
        origin.removeEventListener("mouseleave", hide);
      };
    }
  }, [originRef, setPosition]);

  return (
    <Portal>
      <div className="fixed pointer-events-none z-50" ref={toolTipRef}>
        <p
          className={cx(
            "m-2 py-1 px-2 rounded-md text-sm text-left bg-gray-900 text-white",
            className
          )}
        >
          {children}
        </p>
      </div>
    </Portal>
  );
}
