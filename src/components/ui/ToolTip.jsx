import { appear } from "utils/transitions";
import { between } from "utils/math";
import cx from "classnames";

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
    const rect = originRef.current?.getClientRects()[0];
    const toolTip = toolTipRef.current;

    if (rect && toolTip && typeof window !== "undefined") {
      const position = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };

      toolTip.style.maxWidth = `${Math.min(maxWidth, window.innerWidth)}px`;

      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;
      const width = toolTip.offsetWidth;
      const height = toolTip.offsetHeight;

      const _direction =
        direction === "vertical"
          ? position.y < wHeight / 2
            ? "bottom"
            : "top"
          : direction === "horizontal"
          ? position.x < wWidth / 2
            ? "right"
            : "left"
          : direction;

      toolTip.style.left = `${
        _direction === "left"
          ? position.x - (width + rect.width / 2)
          : _direction === "right"
          ? position.x + rect.width / 2
          : between(0, wWidth - width)(position.x - width / 2)
      }px`;
      toolTip.style.top = `${
        _direction === "bottom"
          ? position.y + rect.height / 2
          : _direction === "top"
          ? position.y - (height + rect.height / 2)
          : between(0, wHeight - height)(position.y - height / 2)
      }px`;
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
      <span className="fixed pointer-events-none z-50" ref={toolTipRef}>
        <span
          className={cx(
            "block m-2 py-1 px-2 rounded-md text-sm text-left bg-gray-900 text-white",
            className
          )}
        >
          {children}
        </span>
      </span>
    </Portal>
  );
}
