import { v4 as uuidv4 } from "uuid";
import ObservableResource from "./ObservableResource";

const defaultOptions = {
  dismissable: false,
  timeout: 3000,
};

export default class NotificationsResource extends ObservableResource {
  constructor() {
    super(new Promise((resolve) => resolve([])));
  }

  notify(content, options) {
    const notification = {
      id: uuidv4(),
      content,
      closing: false,
      ...defaultOptions,
      ...options,
    };
    this.onNext(this.data.concat(notification));

    if (notification.timeout !== null) {
      setTimeout(
        () => this.updateNotification(notification.id, { isClosing: true }),
        notification.timeout - 200
      );
      setTimeout(
        () => this.closeNotification(notification.id),
        notification.timeout
      );
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
