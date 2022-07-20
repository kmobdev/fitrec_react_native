import { Actions } from "../../Constants";

const lInitialState = {
  status: null,
  profile: null,
  messageError: "",
  statusUpdateProfile: null,
  messageErrorUpdate: "",
  getConversation: true,
  conversation: null,
  statusSend: null,
  messageErrorSend: "",
  statusHome: null,
  profileHome: null,
  error: false,
};

export const reducerProfile = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        status: true,
        profile: action.data.profile,
        messageError: "",
      };
    case Actions.GET_USER_PROFILE_ERROR:
      return {
        ...state,
        status: false,
        profile: null,
        messageError: action.data.messageError,
        error: true,
      };
    case Actions.GET_USER_PROFILE_HOME_SUCCESS:
      return {
        ...state,
        statusHome: true,
        profileHome: action.data.profile,
        messageError: "",
        getConversation: false,
      };
    case Actions.GET_USER_PROFILE_HOME_ERROR:
      return {
        ...state,
        statusHome: false,
        profileHome: null,
        messageError: action.data.messageError,
        getConversation: false,
      };
    case Actions.UPDATE_USER_PROFILE_SUCCESS:
      return { ...state, statusUpdateProfile: true, messageErrorUpdate: "" };
    case Actions.UPDATE_USER_PROFILE_ERROR:
      return {
        ...state,
        statusUpdateProfile: false,
        messageErrorUpdate: action.data.messageError,
      };
    case Actions.RESET_ACTION_STATE:
      return {
        ...state,
        statusUpdateProfile: null,
        messageErrorUpdate: "",
        messageErrorSend: "",
        statusSend: null,
        getConversation: false,
      };
    case Actions.GET_CONVERSATION_WITH_FRIEND_SUCCESS:
      return {
        ...state,
        conversation: action.data.conversation,
        getConversation: true,
      };
    case Actions.SEND_CONTACT_US_SUCCESS:
      return { ...state, statusSend: true, messageErrorSend: "" };
    case Actions.SEND_CONTACT_US_ERROR:
      return {
        ...state,
        statusSend: false,
        messageErrorSend: action.data.messageError,
      };
    case Actions.CLEAN_PROFILE:
      return { ...state, error: false };
    case Actions.USER_LOGOUT_SUCCESS:
      return lInitialState;
    default:
      return state;
  }
};
