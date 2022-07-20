import { Actions } from "../../Constants";

const lInitialState = {
  status: null,
  myFriends: [],
  messageError: "",
  bRequestNavigation: false,
  oListener: null,
};

export const reducerMyPals = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.GET_MY_FRIENDS_SUCCESS:
      return {
        ...state,
        status: true,
        myFriends: action.data.myFriends,
        messageError: "",
      };
    case Actions.GET_MY_FRIENDS_LISENER:
      if (state.oListener !== null) state.oListener.off();
      return { ...state, oListener: action.data.listener };
    case Actions.GET_MY_FRIENDS_ERROR:
      return {
        ...state,
        status: false,
        myFriends: [],
        messageError: action.data.messageError,
      };
    case Actions.NAVIGATE_NOTIFICATIONS_TO_PALS:
      return { ...state, bRequestNavigation: true };
    case Actions.NAVIGATION_CLEAN:
      return { ...state, bRequestNavigation: false };
    case Actions.USER_LOGOUT_SUCCESS:
      return lInitialState;
    default:
      return state;
  }
};

const lInitialStateRequests = {
  requestsRecived: [],
  requestsSent: [],
  peopleFitrec: [],
  statusSend: null,
  messageError: "",
  statusAccept: null,
  statusCancel: null,
  statusUnfollow: null,
  statusUnfollowHome: null,
  statusSendHome: null,
};

export const reducerRequests = (state = lInitialStateRequests, action) => {
  switch (action.type) {
    case Actions.GET_REQUEST_SENT_SUCCESS:
      return { ...state, requestsSent: action.data.requestsSent };
    case Actions.GET_REQUEST_RECIVED_SUCCESS:
      return { ...state, requestsRecived: action.data.requestsRecived };
    case Actions.GET_PEOPLE_FITREC_SUCCESS:
      return { ...state, peopleFitrec: action.data.peopleFitrec };
    case Actions.SEND_REQUEST_FRIEND_SUCCESS:
      return { ...state, statusSend: true, statusSendHome: true };
    case Actions.SEND_REQUEST_FRIEND_ERROR:
      return { ...state, statusSend: false, statusSendHome: false };
    case Actions.SEND_REQUEST_FRIEND_HOME_SUCCESS:
      return { ...state, statusSendHome: true };
    case Actions.SEND_REQUEST_FRIEND_HOME_ERROR:
      return { ...state, statusSendHome: false };
    case Actions.RESET_ACTION_STATE:
    case Actions.RESET_ACTION_STATE_HOME:
      return {
        ...state,
        statusSendHome: null,
        statusSend: null,
        messageError: "",
        statusAccept: null,
        statusCancel: null,
        statusUnfollowHome: null,
      };
    case Actions.ACCEPT_REQUEST_FRIEND_SUCCESS:
      return { ...state, statusAccept: true, messageError: "" };
    case Actions.ACCEPT_REQUEST_FRIEND_ERROR:
      return {
        ...state,
        statusAccept: false,
        messageError: action.data.messageError,
      };
    case Actions.CANCEL_REQUEST_FRIEND_SUCCESS:
      return { ...state, statusCancel: true, messageError: "" };
    case Actions.UNFOLLOW_PAL_SUCCESS:
      return { ...state, statusUnfollow: true, messageError: "" };
    case Actions.UNFOLLOW_PAL_ERROR:
      return {
        ...state,
        statusUnfollow: true,
        messageError: action.data.messageError,
      };
    case Actions.UNFOLLOW_PAL_HOME_SUCCESS:
      return { ...state, statusUnfollowHome: true, messageError: "" };
    case Actions.UNFOLLOW_PAL_HOME_ERROR:
      return {
        ...state,
        statusUnfollowHome: true,
        messageError: action.data.messageError,
      };
    case Actions.USER_LOGOUT_SUCCESS:
      return lInitialStateRequests;
    default:
      return state;
  }
};
