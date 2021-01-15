import cx from "classnames";
import { setStyle } from "utils/dom";

import { useCallback, useEffect, useRef, useState } from "react";

import Modal from "containers/Modal";

export default function FlyOut({
  direction = "vertical",
  persistOnClick,
  originNode,
  originRef,
  defaultOpen = false,
  isOpen,
  onClose,
  children,
  className,
}) {
  const controlled =
    typeof isOpen !== "undefined" && typeof onClose !== "undefined";
  if ((typeof isOpen === "undefined") !== (typeof onClose === "undefined")) {
    throw Error("Controlled component should specify onClose");
  }
  const origin = originRef?.current || originNode;

  const [visible, setVisibility] = useState(defaultOpen);
  const flyOutRef = useRef(null);

  const render = useCallback(() => {
    const flyOut = flyOutRef.current;

    if (origin && flyOut && typeof window !== "undefined") {
      const rect = origin.getBoundingClientRect();
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;

      const _direction =
        direction === "vertical"
          ? rect.top + rect.height / 2 < wHeight / 2
            ? "bottom"
            : "top"
          : direction === "horizontal"
          ? rect.left + rect.width / 2 < wWidth / 2
            ? "right"
            : "left"
          : direction;

      switch (_direction) {
        case "top":
          setStyle(flyOut, {
            top: undefined,
            left: rect.x + rect.width / 2,
            bottom: wHeight - rect.y,
            right: undefined,
            transform: `translate(-50%, 0)`,
            maxWidth: wWidth,
            maxHeight: rect.top,
          });
          break;
        case "left":
          setStyle(flyOut, {
            top: rect.y + rect.height / 2,
            left: undefined,
            bottom: undefined,
            right: rect.x,
            transform: `translate(0, -50%)`,
            maxWidth: rect.x,
            maxHeight: wHeight,
          });
          break;
        case "bottom":
          setStyle(flyOut, {
            top: rect.y + rect.height,
            left: rect.x + rect.width / 2,
            bottom: undefined,
            right: undefined,
            transform: `translate(-50%, 0)`,
            maxWidth: wWidth,
            maxHeight: wHeight - rect.bottom,
          });
          break;
        case "right":
          setStyle(flyOut, {
            top: rect.y + rect.height / 2,
            left: rect.x + rect.width,
            bottom: undefined,
            right: undefined,
            transform: `translate(0, -50%)`,
            maxWidth: wWidth - (rect.x + rect.width),
            maxHeight: wHeight,
          });
          break;
        default:
          break;
      }
    }
  }, [origin, direction]);

  useEffect(() => {
    if (origin && !controlled) {
      const show = () => {
        render();
        setVisibility(true);
      };
      origin.addEventListener("click", show);

      return () => {
        origin.removeEventListener("click", show);
      };
    }
  }, [controlled, origin]);

  useEffect(() => {
    render();
    if (controlled) {
      setVisibility(isOpen);
    }
  }, [controlled, isOpen, children, render]);

  const close = controlled
    ? onClose
    : (event) => {
        event.stopPropagation();
        setVisibility(false);
      };

  return (
    <Modal isOpen={isOpen || visible} onClose={close}>
      <div ref={flyOutRef} className="fixed">
        <div
          className={cx(
            "m-2 rounded-md shadow-md bg-white overflow-y-auto",
            { "opacity-0": !visible },
            className
          )}
          onClick={persistOnClick ? undefined : close}
        >
          {children}
        </div>
      </div>
    </Modal>
  );
}
