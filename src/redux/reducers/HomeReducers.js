import { Actions } from "../../Constants";

const lInitialState = {
  status: false,
  activities: [],
  messageError: "",
  bNavigationHome: false,
};

export const reducerHome = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.GET_USER_HOME_SUCCESS:
      return {
        status: true,
        messageError: "",
        activities: action.data.activities,
      };
    case Actions.GET_USER_HOME_ERROR:
      return {
        status: false,
        messageError: action.data.messageError,
        activities: [],
      };
    case Actions.NAVIGATE_HOME:
      return { ...state, bNavigationHome: true };
    case Actions.NAVIGATION_CLEAN:
      return { ...state, bNavigationHome: false };
    case Actions.USER_LOGOUT_SUCCESS:
      return lInitialState;
    default:
      return state;
  }
};
