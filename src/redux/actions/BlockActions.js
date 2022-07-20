import { Actions, MESSAGE_ERROR } from "../../Constants";
import { BlockUser, GetBlocks, UnblockUser } from "../services/UserServices";
import { actionDeleteConversation } from "./ChatActions";
import { actionGetUserHome } from "./HomeActions";
import { actionGetJourneyList } from "./JourneyActions";
import { actionGetMyFriends } from "./ProfileActions";
import {
  actionDispatch,
  actionMessage,
  actionActiveLoading,
  actionDeactivateLoading,
} from "./SharedActions";
import { actionGetStories } from "./StoryActions";

/**
 * Function that takes the users that have been blocked by the active user.
 *
 * @author Leandro Curbelo
 */
export const actionGetBlocks = () => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    GetBlocks()
      .then((oSuccess) => {
        dispatch(actionDispatch(Actions.BLOCKS, oSuccess.data));
      })
      .catch(() => {
        dispatch(actionDispatch(Actions.BLOCK_USER, { status: false }));
        dispatch(actionMessage(MESSAGE_ERROR));
      })
      .finally(() => dispatch(actionDeactivateLoading()));
  };
};
/**
 * Function that creates a blocking record of the logged in user against the user received by parameter.
 *
 * @param {number} nUserId Identifier of the user to be blocked
 *
 * @author Leandro Curbelo
 */
export const actionBlockUser = (
  nUserId,
  sAccountKey = null,
  sConversationKey = null
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    BlockUser(nUserId)
      .then((oSuccess) => {
        dispatch(actionGetJourneyList());
        dispatch(actionGetStories());
        dispatch(actionGetUserHome());
        dispatch(actionGetMyFriends());
        if (sAccountKey && sConversationKey)
          dispatch(actionDeleteConversation(sAccountKey, sConversationKey));
        dispatch(actionDispatch(Actions.BLOCK_USER, { status: true }));
      })
      .catch((oError) => {
        dispatch(actionDispatch(Actions.BLOCK_USER, { status: false }));
        dispatch(actionMessage(MESSAGE_ERROR));
      })
      .finally(() => dispatch(actionDeactivateLoading()));
  };
};
/**
 * Function that removes a lock against the user with identifier nUserId
 *
 * @param {number} nUserId Identifier of the user to be blocked
 *
 * @author Leandro Curbelo
 */
export const actionUnblockUser = (nUserId) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    UnblockUser(nUserId)
      .then((oSuccess) => {
        dispatch(actionGetJourneyList());
        dispatch(actionGetStories());
        dispatch(actionGetUserHome());
        dispatch(actionGetMyFriends());
        dispatch(actionGetBlocks());
      })
      .catch((oError) => {
        dispatch(actionMessage(MESSAGE_ERROR));
      })
      .finally(() => dispatch(actionDeactivateLoading()));
  };
};
/**
 * Function that clears the user blocking reducer
 *
 * @author Leandro Curbelo
 */
export const actionCleanBlock = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.CLEAN_BLOCK_USER));
  };
};
