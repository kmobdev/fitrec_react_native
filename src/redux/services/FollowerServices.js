import { Constants } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

const URL_FOLLOWERS = Constants.URL_SERVICE + "users/followers";
/**
 * Function that takes the list of user followers with the current session
 *
 * @author Leandro Curbelo
 */
export const GetFollowers = () => {
  return oAxiosInstance.get(URL_FOLLOWERS).then((oResult) => oResult.data);
};
/**
 * FUNC
 *
 * @param {number} nFollowId Trace log identifier
 *
 * @author Leandro Curbelo
 */
export const RemoveFollower = (nFollowId) => {
  return oAxiosInstance
    .delete(URL_FOLLOWERS + "/remove/" + nFollowId)
    .then((oResult) => oResult.data);
};

const URL_FOLLOWING = Constants.URL_SERVICE + "users/following";
/**
 * Function that takes the list of users to which the user follows with the current session
 *
 * @author Leandro Curbelo
 */
export const GetFollowing = () => {
  return oAxiosInstance.get(URL_FOLLOWING).then((oResult) => oResult.data);
};
/**
 * Function removes a user who follows the account
 *
 * @param {number} nFollowId Trace log identifier
 *
 * @author Leandro Curbelo
 */
export const UnFollow = (nFollowId) => {
  return oAxiosInstance
    .get(URL_FOLLOWING + "/unfollow/" + nFollowId)
    .then((oResult) => oResult.data);
};
/**
 * Function adds a new user tracking
 *
 * @param {number} nFollowId Trace log identifier
 *
 * @author Leandro Curbelo
 */
export const Follow = (nFollowId) => {
  return oAxiosInstance
    .get(URL_FOLLOWING + "/follow/" + nFollowId)
    .then((oResult) => oResult.data);
};
