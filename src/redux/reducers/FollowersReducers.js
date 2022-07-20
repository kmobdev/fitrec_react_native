import { Actions } from "../../Constants";

const aInitialState = {
  followers: [],
  following: [],
};

export const reducerFollower = (state = aInitialState, action) => {
  switch (action.type) {
    case Actions.FOLLOWERS:
      return { ...state, followers: action.data };
    case Actions.FOLLOWING:
      return { ...state, following: action.data };
    case Actions.CLEAN:
      return aInitialState;
    default:
      return state;
  }
};
