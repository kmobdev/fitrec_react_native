import { Actions } from "../../Constants";

const aInitialState = {
  status: null,
  blocks: [],
};

export const reducerBlock = (state = aInitialState, action) => {
  switch (action.type) {
    case Actions.BLOCK_USER:
      return { ...state, status: action.data.status };
    case Actions.BLOCKS:
      return { ...state, blocks: action.data };
    case Actions.CLEAN_BLOCK_USER:
      return { ...state, status: null, blocks: [] };
    default:
      return state;
  }
};
