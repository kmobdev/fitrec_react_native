import { Actions } from "../../Constants";

const aInitialState = {
  status: false,
  group: null,
  notifications: [],
  notificationsUnRead: 0,
  nNotificationId: null,
};

export const reducerNotification = (oState = aInitialState, oAction) => {
  switch (oAction.type) {
    case Actions.GET_GROUP_NOTIFICATION:
      if (oAction.data === null)
        return { ...oState, status: false, group: null };
      return { ...oState, status: true, group: oAction.data };
    case Actions.GET_NOTIFICATION_SUCCESS:
      return {
        ...oState,
        notifications: oAction.data.notifications,
        notificationsUnRead: oAction.data.notificationsUnRead,
      };
    case Actions.NAVIGATE_NOTIFICATIONS:
      return { ...oState, nNotificationId: oAction.data };
    case Actions.NAVIGATION_CLEAN:
      return { ...oState, nNotificationId: null };
    case Actions.USER_LOGOUT_SUCCESS:
      return aInitialState;
    default:
      return oState;
  }
};
