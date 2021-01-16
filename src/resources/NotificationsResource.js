import { v4 as uuidv4 } from "uuid";
import ObservableResource from "./ObservableResource";

export default class NotificationsResource extends ObservableResource {
  constructor() {
    super(new Promise((resolve) => resolve([])));
  }

  notify(content, options) {
    const action = options?.action;
    const notification = {
      id: uuidv4(),
      content,
      action,
      isClosing: false,
      key: options?.key,
    };
    this.onNext(this.data.concat(notification));

    if (!action || options?.timeout) {
      const timeout = options?.timeout || 3000;
      setTimeout(
        () => this.updateNotification(notification.id, { isClosing: true }),
        timeout - 200
      );
      setTimeout(() => this.closeNotification(notification.id), timeout);
    }
  }

  updateNotification(notificationId, update) {
    this.onNext(
      this.data.map((notification) =>
        notification.id === notificationId
          ? { ...notification, ...update }
          : notification
      )
    );
  }

  closeNotification(notificationId) {
    this.onNext(
      this.data.filter((notification) => notification.id !== notificationId)
    );
  }
}

export const notificationsResource = new NotificationsResource();
