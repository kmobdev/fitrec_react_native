import { Constants } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

const URL_NOTIFICATIONS = Constants.URL_SERVICE + "users/notifications";

/**
 * Function that adds a new notification to the database
 *
 * @param {number} nUserId User identifier who will come the notification
 * @param {string} sDescription DESCRIPTION OF THE NOTIFICATION
 * @param {number} nType NOTIFICATION TYPE
 * @param {number | null} nEntityId Identifier of the entity that is subject to notification, it can be a group, journey or be null
 *
 * @author Leandro Curbelo
 */
export const AddNotification = (nUserId, sDescription, nType, nEntityId) => {
  return oAxiosInstance
    .post(URL_NOTIFICATIONS, {
      id_recive: nUserId,
      description: sDescription,
      type: nType,
      id: nEntityId,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that returns all user notifications.
 *
 * @author Leandro Curbelo
 */
export const GetNotifications = () => {
  return oAxiosInstance.get(URL_NOTIFICATIONS).then((oResult) => oResult.data);
};

/**
 * Function that marks a notification as a view
 *
 * @param {number} nNotificationId Notification identifier
 *
 * @author Leandro Curbelo
 */
export const ViewNotification = (nNotificationId) => {
  return oAxiosInstance
    .put(URL_NOTIFICATIONS + "/" + nNotificationId)
    .then((oResult) => oResult.data);
};
/**
 * Function that eliminates an API notification
 *
 * @param {number} nNotificationId Notification identifier
 *
 * @author Leandro Curbelo
 */
export const DeleteNotification = (nNotificationId) => {
  return oAxiosInstance
    .delete(URL_NOTIFICATIONS + "/" + nNotificationId)
    .then((oResult) => oResult.data);
};
/**
 * Function that eliminates an API notification
 *
 * @param {number} nNotificationId Notification identifier
 *
 * @author Leandro Curbelo
 */
export const DeleteAllNotification = () => {
  return oAxiosInstance
    .delete(URL_NOTIFICATIONS)
    .then((oResult) => oResult.data);
};
