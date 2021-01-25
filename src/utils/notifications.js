import { notificationsResource } from "resources/NotificationsResource";

export function notify(...args) {
  notificationsResource.notify(...args);
}

export function updateNotification(...args) {
  notificationsResource.updateNotification(...args);
}

export function closeNotification(...args) {
  notificationsResource.closeNotification(...args);
}
