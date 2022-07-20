import { Actions, MESSAGE_ERROR } from "../../Constants";
import {
  actionActiveLoading,
  actionDeactivateLoading,
  actionDispatch,
  actionMessage,
} from "./SharedActions";
import {
  GetFollowers,
  GetFollowing,
  RemoveFollower,
  Follow,
  UnFollow,
} from "../services/FollowerServices";
import { actionGetProfile } from "./ProfileActions";
import { actionSendPushNotification } from "./NotificationActions";
import { NOTIFICATION_FOLLOW } from "../../constants/Notifications";

/**
 * Action used to grab the followers of the user's account
 *
 * @author Leandro Curbelo
 */
export const actionGetFollowers = () => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    GetFollowers()
      .then((oSuccess) => {
        dispatch(actionDispatch(Actions.FOLLOWERS, oSuccess.data));
      })
      .catch(() => {
        dispatch(actionDispatch(Actions.FOLLOWERS, []));
      })
      .finally(() => dispatch(actionDeactivateLoading()));
  };
};
/**
 * Action used to grab the users that the user's account follows
 *
 * @author Leandro Curbelo
 */
export const actionGetFollowing = () => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    GetFollowing()
      .then((oSuccess) => {
        dispatch(actionDispatch(Actions.FOLLOWING, oSuccess.data));
      })
      .catch(() => {
        dispatch(actionDispatch(Actions.FOLLOWING, []));
      })
      .finally(() => dispatch(actionDeactivateLoading()));
  };
};
/**
 * Function that creates a new user track
 *
 * @param {number} nFollowId User identifier to refresh the profile
 * @param {number} nUserId Active user identifier to refresh your profile
 *
 * @author Leandro Curbelo
 */
export const actionFollow = (nFollowId, nUserId, oDataNotification = null) => {
  return (dispatch) => {
    Follow(nFollowId)
      .then(() => {
        dispatch(actionGetProfile(nFollowId, true));
        dispatch(actionGetProfile(nUserId));
        if (null !== oDataNotification && null !== oDataNotification.sPushId)
          dispatch(
            actionSendPushNotification(
              oDataNotification.sHeader,
              oDataNotification.sDescription,
              oDataNotification.sPushId,
              { type: NOTIFICATION_FOLLOW }
            )
          );
      })
      .catch(() => {
        dispatch(actionMessage(MESSAGE_ERROR));
      });
  };
};
/**
 * Function that unfollows a user
 *
 * @param {number} nFollowId Trace log identifier
 * @param {number} nUserId User identifier currently logged in to update your profile
 * @param {boolean} bViewProfile Boolean that identifies if the user's profile is being viewed
 * @param {boolean} nUnserUnfollowId User identifier to refresh the profile in case the same is being viewed
 *
 * @author Leandro Curbelo
 */
export const actionUnFollow = (
  nFollowId,
  nUserId,
  bViewProfile = false,
  nUnserUnfollowId = null
) => {
  return (dispatch) => {
    UnFollow(nFollowId)
      .then(() => {
        bViewProfile
          ? dispatch(actionGetProfile(nUnserUnfollowId, true))
          : dispatch(actionGetFollowing());
        dispatch(actionGetProfile(nUserId));
      })
      .catch((oError) => {
        dispatch(actionMessage(MESSAGE_ERROR));
      });
  };
};
/**
 * Function that removes a follower from the user
 *
 * @param {number} nFollowId User identifier whom you want to stop following
 *
 * @author Leandro Curbelo
 */
export const actionRemoveFollower = (nFollowId, nUserId) => {
  return (dispatch) => {
    RemoveFollower(nFollowId)
      .then(() => {
        dispatch(actionGetFollowers());
        dispatch(actionGetProfile(nUserId));
      })
      .catch(() => {
        dispatch(actionMessage(MESSAGE_ERROR));
      });
  };
};
/**
 * Function that cleans the data to improve the load of the same while the application is used
 *
 * @author Leandro Curbelo
 */
export const actionCleanFollowers = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.CLEAN));
  };
};
