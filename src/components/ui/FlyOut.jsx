import { between } from "utils/math";
import cx from "classnames";

import { useCallback, useEffect, useRef, useState } from "react";

import Modal from "containers/Modal";

const toRect = (el) =>
  el?.getBoundingClientRect() || {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };

export default function FlyOut({
  direction = "vertical",
  persistOnClick,
  originNode,
  originRef,
  isOpen,
  defaultOpen = false,
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
  const containerRef = useRef(null);

  const render = useCallback(() => {
    const originRect = toRect(origin);
    const container = containerRef.current;

    if (origin && originRect && container && typeof window !== "undefined") {
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      const _direction =
        direction === "vertical"
          ? originRect.top + originRect.height / 2 < wHeight / 2
            ? "bottom"
            : "top"
          : direction === "horizontal"
          ? originRect.left + originRect.width / 2 < wWidth / 2
            ? "right"
            : "left"
          : direction;

      const cTop =
        _direction === "bottom"
          ? originRect.bottom
          : _direction === "top"
          ? Math.max(0, originRect.top - height)
          : between(0, wHeight - height)(originRect.top);
      const cLeft =
        _direction === "left"
          ? Math.max(0, originRect.left - width)
          : _direction === "right"
          ? originRect.right
          : between(0, wWidth - width)(originRect.left);

      container.style.maxWidth = `${wWidth - 16}px`;
      container.style.top = `${cTop}px`;
      container.style.left = `${cLeft}px`;

      container.style.maxHeight = `${
        _direction === "top"
          ? originRect.top
          : _direction === "bottom"
          ? wHeight - originRect.bottom
          : wHeight
      }px`;
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
      <div ref={containerRef} className="fixed">
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
