import { Actions } from "../../Constants";

const lInitialState = {
  redirectConditions: null,
  messageError: "",
  status: null,
};

export const reducerRegister = (state = lInitialState, action) => {
  switch (action.type) {
    case Actions.USER_REGISTER_VALIDATE_SUCCESS:
      return {
        redirectConditions: action.data.redirectConditions,
        messageError: "",
      };
    case Actions.USER_REGISTER_VALIDATE_ERROR:
      return { redirectConditions: null };
    case Actions.USER_REGISTER_ERROR:
      return { status: false, messageError: action.data.messageError };
    default:
      return lInitialState;
  }
};
