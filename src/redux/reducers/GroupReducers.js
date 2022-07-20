import { Actions } from "../../Constants";

const lInitialState = {
  status: false,
  activities: [],
  messageError: "",
  invitationAction: false,
  deleteGroup: false,
  firebaseId: null,
  listGroup: [],
  listGroupNearMe: [],
  sGroupKey: null,
};

export const reducerGroup = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.CREATE_GROUP_SUCCESS:
      return { ...state, status: true, firebaseId: action.data.firebaseId };
    case Actions.CREATE_GROUP_ERROR:
      return {
        status: false,
        friendRefresh: false,
        groupRefresh: false,
        deleteGroup: false,
      };
    case Actions.CLEAN_CREATE_GROUP:
      return { ...state, status: false, firebaseId: null };
    case Actions.RESET_ACTION_STATE:
      return {
        ...state,
        status: false,
        messageError: "",
        friendRefresh: false,
        groupRefresh: false,
        deleteGroup: false,
      };
    case Actions.JOIN_GROUP_SUCCESS:
    case Actions.LEAVE_GROUPS_SUCCESS:
      if (null !== action.data && undefined !== action.data.firebaseId)
        return {
          ...state,
          status: false,
          messageError: "",
          firebaseId: action.data.firebaseId,
          friendRefresh: false,
          groupRefresh: false,
          deleteGroup: false,
        };
      return {
        ...state,
        status: false,
        messageError: "",
        firebaseId: null,
        friendRefresh: false,
        groupRefresh: false,
        deleteGroup: false,
      };
    case Actions.GET_GROUPS:
      if (null !== action.data.listGroup && undefined !== action.data.listGroup)
        return {
          ...state,
          listGroup: action.data.listGroup,
          friendRefresh: false,
          groupRefresh: false,
          messageError: "",
          deleteGroup: false,
        };
      return {
        ...state,
        listGroupNearMe: action.data.listGroupNearMe,
        friendRefresh: false,
        groupRefresh: false,
        messageError: "",
        deleteGroup: false,
      };
    case Actions.REQUEST_JOIN_GROUP:
      return {
        ...state,
        status: false,
        messageError: action.data.messageError,
        friendRefresh: false,
        groupRefresh: false,
        deleteGroup: false,
      };
    case Actions.ACTION_MESSAGE:
      return {
        ...state,
        status: false,
        messageError: action.data.messageError,
        friendRefresh: true,
        groupRefresh: true,
        deleteGroup: false,
      };
    case Actions.ACTION_ACCEPT_REQUEST_SUCCESS:
      return {
        ...state,
        status: false,
        messageError: action.data.messageError,
        friendRefresh: true,
        groupRefresh: false,
        deleteGroup: false,
      };
    case Actions.JOIN_GROUP_SUCCESS:
      if (action.data.notificationNavigate === true)
        return {
          ...state,
          status: false,
          messageError: "",
          firebaseId: action.data.firebaseId,
          notificationNavigate: true,
          groupRefresh: true,
          deleteGroup: false,
        };
      return {
        ...state,
        status: false,
        messageError: "",
        firebaseId: action.data.firebaseId,
        groupRefresh: true,
        deleteGroup: false,
      };
    case Actions.RESET_OPEN_GROUP:
      return {
        ...state,
        status: false,
        messageError: "",
        firebaseId: null,
        notificationNavigate: false,
        deleteGroup: false,
      };
    case Actions.OPEN_GROUP_NOTIFICATION:
      return {
        ...state,
        firebaseId: action.data.firebaseId,
        notificationNavigate: true,
        deleteGroup: false,
      };
    case Actions.NAVIGATE_GROUP:
      return { ...state, sGroupKey: action.data };
    case Actions.NAVIGATION_CLEAN:
      return { ...state, sGroupKey: null };
    default:
      return {
        ...state,
        messageError: "",
        friendRefresh: false,
        groupRefresh: false,
        deleteGroup: false,
      };
  }
};

export const reducerSendNotification = (
  state = { status: null, messageError: "", statusSend: null },
  action
) => {
  switch (action.type) {
    case Actions.SEND_NOTIFICATION_CAPITAN_SUCCESS:
      return { ...state, status: true, messageError: "" };
    case Actions.SEND_NOTIFICATION_CAPITAN_ERROR:
      return {
        ...state,
        status: false,
        messageError: action.data.messageError,
      };
    case Actions.SEND_MESSAGE_GROUP_SUCCESS:
      return { status: null, messageError: "", statusSend: true };
    default:
      return state;
  }
};

export const reducerInvitationsGroup = (
  state = { invitationAction: null, groupId: null },
  action
) => {
  switch (action.type) {
    case Actions.REJECT_INVITATION_GROUP_SUCCESS:
      return { ...state, invitationAction: true, groupId: action.data.groupId };
    case Actions.ACCEPT_INVITATION_GROUP_SUCCESS:
      return { ...state, invitationAction: true, groupId: action.data.groupId };
    case Actions.ACCEPT_INVITATION_GROUP_ERROR:
      return { ...state, invitationAction: true, groupId: action.data.groupId };
    default:
      return state;
  }
};

export const reducerUpdateGroup = (
  state = { status: false, group: null, messageError: "" },
  action
) => {
  switch (action.type) {
    case Actions.UPDATE_GROUP_ERROR:
      return {
        ...state,
        messageError: action.data.messageError,
        status: false,
      };
    case Actions.RESET_UPDATE_GROUP:
      return { ...state, messageError: "", status: false, group: null };
    default:
      return state;
  }
};
/**
 * Reduce used to handle the data of the group currently selected to see their details
 */
const oInitialStateDetailsGroup = {
  oGroup: null,
  oListener: null,
  aMessages: null,
  oListenerMessages: null,
  bDeleted: false,
  bLeave: false,
};
export const reducerDetailsGroup = (
  oState = oInitialStateDetailsGroup,
  oAction
) => {
  switch (oAction.type) {
    case Actions.GET_GROUP_DETAILS:
      if (oState.oListener !== null && oAction.data.data === null)
        oState.oListener.off();
      return {
        ...oState,
        oGroup: oAction.data.data,
        oListener: oAction.data.listener,
        bDeleted: oAction.data.deleted,
      };
    case Actions.GET_GROUP_DETAILS_MESSAGES:
      if (oState.oListenerMessages !== null && oAction.data.data === null)
        oState.oListenerMessages.off();
      return {
        ...oState,
        aMessages: oAction.data.data,
        oListenerMessages: oAction.data.listener,
      };
    case Actions.GROUP_DETAILS_READ_MESSAGES:
      return { ...oState, oGroup: { ...oState.oGroup, messagesRead: 0 } };
    case Actions.LEAVE_GROUPS_SUCCESS:
      return { ...oState, bLeave: true };
    case Actions.NAVIGATION_CLEAN:
      return { ...oState, bLeave: false, bDeleted: false };
    default:
      return oState;
  }
};
