import cx from "classnames";
import Button from "components/ui/Button";
import { useEffect, useState } from "react";

export default function Notification({ notification, isPrev, onClose }) {
  const [isInitial, setInitial] = useState(true);
  useEffect(() => setInitial(false), []);

  return (
    <div
      className={cx(
        "absolute left-0 right-0 bottom-0 rounded-md bg-blue-500 text-white p-4 flex items-center justify-between transform transition-all",
        { "scale-95 -translate-y-2 bg-blue-600": isPrev },
        { "translate-y-full": isInitial },
        { "opacity-0": notification.isClosing }
      )}
    >
      <p>{notification.content}</p>
      {notification.action && (
        <Button
          className="px-3 py-1 rounded-md border font-bold"
          bgColor="blue"
          onClick={async (event) => {
            await notification.action.onAct(event);
            onClose();
          }}
        >
          {notification.action.label}
        </Button>
      )}
    </div>
  );
}
