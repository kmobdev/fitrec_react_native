import { Actions } from "../../Constants";

const lInitialState = {
  success: false,
  createAccount: false,
  account: null,
  messageError: "",
  redirectSignIn: false,
  userFBData: null,
  notifications: [],
  groupInvitations: [],
  observables: null,
  appleAccount: null,
};

export const reducerSession = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.USER_LOGIN_SUCCESS:
      return {
        ...state,
        success: action.data.success,
        account: action.data.account,
        redirectSignIn: false,
        userFBData: null,
      };
    case Actions.USER_LOGIN_ERROR:
      return {
        ...state,
        success: false,
        account: null,
        messageError: action.data.messageError,
        redirectSignIn: action.data.redirectSignIn,
        userFBData: action.data.userFBData,
      };
    case Actions.USER_LOGIN_CREATE_ACCOUNT:
      return { ...state, redirectSignIn: true, appleAccount: action.data };
    case Actions.USER_LOGOUT_SUCCESS:
      if (null !== state.observables && null !== state.observables) {
        state.observables.forEach((oObservable) => {
          oObservable.off();
        });
      }
      return lInitialState;
    case Actions.USER_IS_LOGGED_SUCCESS:
      return {
        ...state,
        success: action.data.success,
        account: action.data.account,
        redirectSignIn: false,
        userFBData: null,
      };
    case Actions.USER_IS_LOGGED_ERROR:
      return {
        ...state,
        success: false,
        account: null,
        messageError: null,
        redirectSignIn: null,
        userFBData: null,
      };
    case Actions.GET_GROUP_INVITATIONS_SUCCESS:
      return { ...state, groupInvitations: action.data.groupInvitations };
    case Actions.SET_OBSERVABLE_PROFILE:
      return { ...state, observables: action.data.observables };
    case Actions.CLEAN_MESSAGE_LOGIN:
      return { ...state, messageError: "" };
    default:
      return state;
  }
};

export const reducerForgotPassword = (
  state = { success: false, messageError: "" },
  action
) => {
  switch (action.type) {
    case Actions.USER_FORGOT_SUCCESS:
      return { ...state, success: true, messageError: "" };
    case Actions.USER_FORGOT_ERROR:
      return {
        ...state,
        success: false,
        messageError: action.data.messageError,
      };
    default:
      return state;
  }
};

export const reducerDesactivateAccount = (
  state = { statusDesactivate: null },
  action
) => {
  switch (action.type) {
    case Actions.DESACTIVATE_ACCOUNT_ERROR:
      return {
        ...state,
        statusDesactivate: false,
        messageError: action.data.messageError,
      };
    default:
      return state;
  }
};

export const reducerProfilePal = (
  state = { groupInvitations: [], groupsPals: [], message: "" },
  action
) => {
  switch (action.type) {
    case Actions.GET_GROUP_INVITATIONS_PALS_SUCCESS:
      return {
        groupInvitations: action.data.groupInvitationsPals,
        groupsPals: action.data.groupsPals,
      };
    default:
      return state;
  }
};
