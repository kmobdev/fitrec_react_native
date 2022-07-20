import { Actions } from "../../Constants";

const lInitialState = {
  status: null,
  journeys: [],
  messageError: "",
  statusLiked: null,
  statusCreated: null,
  statusRemoved: null,
  statusAdd: null,
  journey: [],
  statusGet: null,
  statusGetLikes: null,
  usersLiked: [],
  statusGetLikesResponse: false,
  bNavigationJourney: false,
};

export const reducerJourney = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.GET_JOURNEY_LIST_SUCCESS:
      return {
        ...lInitialState,
        status: true,
        journeys: action.data.journeys,
        messageError: "",
      };
    case Actions.GET_JOURNEY_LIST_ERROR:
      return {
        ...lInitialState,
        status: false,
        journeys: [],
        messageError: action.data.messageError,
      };
    case Actions.ADD_LIKE_SUCCESS:
      return { ...state, statusLiked: true, messageError: "" };
    case Actions.ADD_LIKE_ERROR:
      return {
        ...state,
        statusLiked: false,
        messageError: action.data.messageError,
      };
    case Actions.CREATE_JOURNEY_SUCCESS:
      return { ...state, statusCreated: true };
    case Actions.CREATE_JOURNEY_ERROR:
      return { ...lInitialState, statusCreated: false };
    case Actions.REMOVE_TAG_USER_SUCCESS:
      return {
        ...lInitialState,
        statusRemoved: true,
        messageError: "",
        statusCreated: null,
        statusAdd: null,
      };
    case Actions.REMOVE_TAG_USER_ERROR:
      return {
        ...lInitialState,
        statusRemoved: false,
        messageError: action.data.messageError,
        statusCreated: null,
        statusAdd: null,
      };
    case Actions.ADD_TAG_USER_SUCCESS:
      return {
        ...lInitialState,
        statusAdd: true,
        messageError: "",
        statusCreated: null,
        statusRemoved: null,
      };
    case Actions.ADD_TAG_USER_ERROR:
      return {
        ...lInitialState,
        statusAdd: false,
        messageError: action.data.messageError,
        statusCreated: null,
        statusRemoved: null,
      };
    case Actions.DELETE_JOURNEY_SUCCESS:
      return { ...state, statusDelete: true };
    case Actions.DELETE_JOURNEY_ERROR:
      return {
        ...state,
        statusDelete: false,
        messageError: action.data.messageError,
      };
    case Actions.GET_ONE_JOURNEY_SUCCESS:
      return {
        ...state,
        statusGet: true,
        journey: action.data.journey,
        messageError: "",
      };
    case Actions.GET_ONE_JOURNEY_ERROR:
      return {
        ...state,
        statusGet: false,
        journey: [],
        messageError: action.data.messageError,
      };
    case Actions.GET_LIKES_SUCCESS:
      return {
        ...state,
        statusGetLikes: true,
        usersLiked: action.data.usersLiked,
        messageError: "",
        statusGetLikesResponse: action.data.status,
      };
    case Actions.GET_LIKES_ERROR:
      return {
        ...state,
        statusGetLikes: false,
        usersLiked: [],
        messageError: action.data.messageError,
      };
    case Actions.NAVIGATE_JOURNEYS:
      return { ...state, bNavigationJourney: true };
    case Actions.NAVIGATION_CLEAN:
      return { ...state, bNavigationJourney: false };
    case Actions.USER_LOGOUT_SUCCESS:
      return lInitialState;
    default:
      return state;
  }
};

export const reducerShowJourney = (
  state = { status: true, journey: null },
  action
) => {
  switch (action.type) {
    case Actions.GET_JOURNEY:
      return {
        status: action.data.status,
        journey: action.data.status ? action.data.journey : null,
      };
    case Actions.CLEAN_JOURNEY:
      return { journey: null, status: true };
    default:
      return state;
  }
};
