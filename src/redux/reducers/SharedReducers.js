import { Actions } from "../../Constants";

const lInitialState = {
  loading: false,
  message: "",
  expandImage: false,
  image: null,
};

export const reducerShared = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.MESSAGE:
      return { loading: false, message: action.message };
    case Actions.ACTIVE_LOADING:
      return { loading: true, message: "" };
    case Actions.DEACTIVATE_LOADING:
      return { ...state, loading: false };
    case Actions.EXPAND_IMAGE:
      return { ...state, expandImage: true, image: action.data };
    case Actions.DISMISS_IMAGE:
      return { ...state, expandImage: false, image: null };
    default:
      return state;
  }
};
