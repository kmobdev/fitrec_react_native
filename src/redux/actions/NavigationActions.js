import { Actions } from "../../Constants";
import { actionDispatch } from "./SharedActions";

// This action file will be used to handle all parameter shipments from one screen to another

/**
 * Function used to clean all reducers of navigation parameters
 */
export const actionCleanNavigation = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.NAVIGATION_CLEAN));
  };
};
/**
 * Function used to pass navigation parameters from the Notifications screen to the My Pals screen
 */
export const actionNavigateToMyPals = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.NAVIGATE_NOTIFICATIONS_TO_PALS));
  };
};
/**
 * Function used at the time of opening home from anywhere, this will set a variable that will automatically make the Swipe to Home
 */
export const actionNavigateToHome = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.NAVIGATE_HOME));
  };
};
/**
 * Function used at the time of opening journeys from anywhere, this will set a variable that will automatically make the swipe to Journeys
 */
export const actionNavigateToJourneys = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.NAVIGATE_JOURNEYS));
  };
};
/**
 * Function used to open a conversation from any part of the application
 *
 * @param {string} sConversationKey Conversation Data Key
 */
export const actionNavigateToConversationListMessage = (sConversationKey) => {
  return (dispatch) => {
    dispatch(
      actionDispatch(
        Actions.NAVIGATE_CONVERSATION_LIST_MESSAGE,
        sConversationKey
      )
    );
  };
};
/**
 * Function used to open a certain group from the group list
 *
 * @param {string} sGroupKey Conversation Data Key
 */
export const actionNavigateToGroup = (sGroupKey) => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.NAVIGATE_GROUP, sGroupKey));
  };
};
/**
 * Function used to open a certain notification from any part of the application
 *
 * @param {string} nNotificationId Conversation Data Key
 */
export const actionNavigateToNotifications = (nNotificationId) => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.NAVIGATE_NOTIFICATIONS, nNotificationId));
  };
};
