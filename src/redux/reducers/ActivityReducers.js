import { Actions } from "../../Constants";

const lInitialState = {
  activities: [],
  gyms: [],
  messageError: "",
};

export const reducerActivity = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.GET_ALL_ACTIVITIES_SUCCESS:
      return { ...state, activities: action.data.activities, messageError: "" };
    case Actions.GET_ALL_ACTIVITIES_ERROR:
      return {
        ...state,
        activities: [],
        messageError: action.data.messageError,
      };
    case Actions.GET_GYMS:
      return { ...state, gyms: action.data.gyms };
    default:
      return state;
  }
};
