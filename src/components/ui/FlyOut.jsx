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

  const [visible, setVisibility] = useState(defaultOpen);
  const flyOutRef = useRef(null);

  const render = useCallback(() => {
    const origin = originRef?.current || originNode;
    const flyOut = flyOutRef.current;

    if (origin && flyOut && typeof window !== "undefined") {
      const rect = origin.getBoundingClientRect();
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;

      const isTop = rect.top + rect.height / 2 < wHeight / 2;
      const isLeft = rect.left + rect.width / 2 < wWidth / 2;

      const _direction =
        direction === "vertical"
          ? isTop
            ? "bottom"
            : "top"
          : direction === "horizontal"
          ? isLeft
            ? "right"
            : "left"
          : direction;

      switch (_direction) {
        case "top":
          setStyle(flyOut, {
            top: undefined,
            left: isLeft ? rect.x : undefined,
            bottom: wHeight - rect.y,
            right: isLeft ? undefined : wWidth - rect.right,
            maxWidth: wWidth,
            maxHeight: rect.top,
          });
          break;
        case "left":
          setStyle(flyOut, {
            top: rect.y,
            left: undefined,
            bottom: undefined,
            right: rect.x,
            maxWidth: rect.x,
            maxHeight: wHeight,
          });
          break;
        case "bottom":
          setStyle(flyOut, {
            top: rect.y + rect.height,
            left: isLeft ? rect.x : undefined,
            bottom: undefined,
            right: isLeft ? undefined : wWidth - rect.right,
            maxWidth: wWidth,
            maxHeight: wHeight - rect.bottom,
          });
          break;
        case "right":
          setStyle(flyOut, {
            top: rect.y,
            left: rect.x + rect.width,
            bottom: undefined,
            right: undefined,
            maxWidth: wWidth - (rect.x + rect.width),
            maxHeight: wHeight,
          });
          break;
        default:
          break;
      }
    }
  }, [originRef, originNode, direction]);

  useEffect(() => {
    const origin = originRef?.current || originNode;
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
  }, [controlled, originRef, originNode]);

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
      <div
        ref={flyOutRef}
        className={cx(
          "fixed rounded-md shadow-md bg-white overflow-y-auto",
          { "opacity-0": !visible },
          ["vertical", "top", "bottom"].includes(direction) ? "my-2" : "mx-2",
          className
        )}
        onClick={persistOnClick ? undefined : close}
      >
        {children}
      </div>
    </Modal>
  );
}
