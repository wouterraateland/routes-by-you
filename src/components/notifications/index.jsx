import { notificationsResource } from "resources/NotificationsResource";
import useResource from "hooks/useResource";

import Portal from "containers/Portal";

import Notification from "./Notification";

export default function Notifications() {
  const notifications = useResource(notificationsResource);

  return (
    <Portal>
      <div className="fixed bottom-0 right-0 left-0 sm:left-auto pb-safe pr-safe pl-safe">
        <div className="p-2 space-y-2 max-w-full w-80 sm:w-96">
          <div className="relative">
            {notifications.map((notification, i) => (
              <Notification
                key={notification.id}
                notification={notification}
                isPrev={i < notifications.length - 1}
                onClose={() =>
                  notificationsResource.closeNotification(notification.id)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
}
