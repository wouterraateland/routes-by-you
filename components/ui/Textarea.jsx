import cx from "classnames";

import { forwardRef, useEffect, useRef } from "react";

const refreshEl = (el) => el.offsetHeight;

export default forwardRef(function Textarea(
  { className, rows = 1, extraHeight = 0, ...props },
  ref
) {
  const textAreaRef = useRef(null);
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "0px";
      const fontSizeProperty = window
        .getComputedStyle(textArea, null)
        .getPropertyValue("font-size");
      const fontSize =
        fontSizeProperty && !isNaN(fontSizeProperty)
          ? parseFloat(fontSizeProperty)
          : 14;

      refreshEl(textArea);
      textArea.style.height = `${
        Math.max((rows || 1) * fontSize, textArea.scrollHeight) + extraHeight
      }px`;
    }
  }, [ref, rows, props.value]);

  return (
    <textarea
      ref={(c) => {
        textAreaRef.current = c;
        if (ref) {
          ref.current = c;
        }
      }}
      className={cx("resize-none", className)}
      {...props}
    />
  );
});
