import { Actions } from "../../Constants";

const lInitialState = {
  status: false,
  messageError: "",
  messageRead: 0,
  statusSend: false,
  statusSendImage: false,
};

export const reducerChat = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.SEND_MESSAGE_SUCCESS:
      var bIsSendImage =
        null !== action.data && action.data.sendImage !== undefined
          ? action.data.sendImage
          : false;
      return {
        ...state,
        statusSend: true,
        messageError: "",
        statusSendImage: bIsSendImage,
      };
    case Actions.SEND_MESSAGE_ERROR:
      return {
        ...sate,
        statusSend: false,
        messageError: action.data.messageError,
      };
    case Actions.GET_COUNT_MESSAGES_READ_SUCCESS:
      return {
        ...state,
        statusSend: false,
        messageError: "",
        messageRead: action.data.messageRead,
      };
    case Actions.GET_COUNT_MESSAGES_READ_GROUP_SUCCESS:
      return {
        ...state,
        statusSend: false,
        messageError: "",
        messageReadGroup: action.data.messageReadGroup,
      };
    default:
      return state;
  }
};

const lInitialStateListMessages = {
  status: false,
  messageError: "",
  messages: [],
  sConversationKey: null,
};

export const reducerListMessages = (
  state = lInitialStateListMessages,
  action
) => {
  switch (action.type) {
    case Actions.GET_LIST_MESSAGES_SUCCESS:
      return {
        ...state,
        status: true,
        messages: action.data.messages,
        messageError: "",
      };
    case Actions.GET_LIST_MESSAGES_ERROR:
      return lInitialStateListMessages;
    case Actions.NAVIGATE_CONVERSATION_LIST_MESSAGE:
      return { ...state, sConversationKey: action.data };
    case Actions.NAVIGATION_CLEAN:
      return { ...state, sConversationKey: null };
    default:
      return state;
  }
};

const oInitialStateMessages = {
  oConversation: null,
  oListener: null,
  aMessages: null,
};
/**
 * Reduce that controls the messages and messages that are selected to visualize a talk
 */
export const reducerMessages = (oState = oInitialStateMessages, oAction) => {
  switch (oAction.type) {
    case Actions.SET_CONVERSATION:
      return { ...oState, oConversation: oAction.data };
    case Actions.SET_CONVERSATION_KEY:
      return {
        ...oState,
        oConversation: { ...oState.oConversation, key: oAction.data },
      };
    case Actions.GET_CONVERSATION:
      if (oState.oListener !== null && oAction.data.data === null)
        oState.oListener.off();
      return {
        ...oState,
        aMessages: oAction.data.data,
        oListener: oAction.data.listener,
      };
    default:
      return oState;
  }
};

const lInitialStateListFriend = {
  friends: [],
};

export const reducerListFriends = (state = lInitialStateListFriend, action) => {
  switch (action.type) {
    case Actions.GET_LIST_USER_FRIENDS_SUCCESS:
      return { friends: action.data };
    default:
      return state;
  }
};

const lInitialStateGiphy = {
  gifs: [],
  stickers: [],
};

export const reducerGiphy = (state = lInitialStateGiphy, action) => {
  switch (action.type) {
    case Actions.GIFS:
      return { ...state, gifs: action.data.gifs };
    case Actions.STICKERS:
      return { ...state, stickers: action.data.stickers };
    default:
      return state;
  }
};
