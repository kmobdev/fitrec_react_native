import { Constants } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

const URL_GROUPS = Constants.URL_SERVICE + "groups";
/**
 * Function that creates a new group in the API.
 *
 * @param {string} sKey groupNodeIdentifierEnFirebase
 * @param {string} sName Group name
 * @param {string | null} sDescription Group Description, can be empty
 * @param {array} aUsers Users who integrate the group
 * @param {number} nType Group type, it can be private: 1, public: 2
 * @param {number} nLatitude Latitude of the user when creating the group
 * @param {number} nLongitude Longitude of the user when creating the group
 *
 * @author Leandro Curbelo
 */
export const CreateGroup = (
  sKey,
  sName,
  sDescription,
  aUsers,
  sImage,
  nType,
  nLatitude,
  nLongitude
) => {
  return oAxiosInstance
    .post(URL_GROUPS, {
      key: sKey,
      name: sName,
      description: sDescription,
      users: aUsers,
      type: nType,
      latitude: nLatitude,
      longitude: nLongitude,
      image: sImage,
    })
    .then((oResult) => oResult.data);
};
/**
 *
 * @param {string} sFilter Text that will be used to filter by name and description of the groups
 * @param {number} nType Type of group, either private (1) or public (2)
 * @param {number | null} nDistance Mileage
 * @param {number | null} nLatitude Latitude of user
 * @param {number | null} nLongitude Longitude of user
 */
export const GetGroupsNearMe = (
  sFilter,
  nType,
  nDistance,
  nLatitude,
  nLongitude
) => {
  return oAxiosInstance
    .post(URL_GROUPS + "/near", {
      filter: sFilter,
      type: nType,
      distance: nDistance,
      latitude: nLatitude,
      longitude: nLongitude,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that removes the group currently logging from the group
 *
 * @param {number} nGroupId Group identifier from which you want to leave
 *
 * @author Leandro Curbelo
 */
export const LeaveGroup = (nGroupId) => {
  return oAxiosInstance
    .get(URL_GROUPS + "/leave/" + nGroupId)
    .then((oResult) => oResult.data);
};
/**
 * Function that logically eliminates a group
 *
 * @param {number} nGroupId Group identifier in the system
 *
 * @author Leandro Curbelo
 */
export const DeleteGroup = (nGroupId) => {
  return oAxiosInstance
    .delete(URL_GROUPS + "/" + nGroupId)
    .then((oResult) => oResult.data);
};
/**
 * Function that sends the data of a group to modify them, everyone can be null,
 *  of this way they will not be modified.
 *
 * @param {number} nGroupId Group identifier that you want to modify
 * @param {string | null} sName Group name
 * @param {string | null} sDescription Group description
 * @param {string | null} sImage Base64 Encoded Image of the Group
 *
 * @author Leandro Curbelo
 */
export const UpdateGroup = (nGroupId, sName, sDescription, sImage) => {
  return oAxiosInstance
    .put(URL_GROUPS, {
      id: nGroupId,
      name: sName,
      description: sDescription,
      image: sImage,
    })
    .then((oResult) => oResult.data);
};
const URL_GROUP_MEMBERS = URL_GROUPS + "/members/";
/**
 * Function adds a new user in a group through API services.
 *
 * @param {number} nGroupId Group Identifier who wants to add the user.
 * @param {number} nUserId User Identifier who wants to add.
 *
 * @author Leandro Curbelo
 */
export const AddToGroup = (nGroupId, nUserId) => {
  return oAxiosInstance
    .post(URL_GROUP_MEMBERS + "add", {
      id_group: nGroupId,
      id_user: nUserId,
      is_capitan: false,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that removes a user's link with a group through API services.
 *
 * @param {number} nGroupId Group Identifier who wants to add the user.
 * @param {number} nUserId User Identifier who wants to add.
 *
 * @author Leandro Curbelo
 */
export const RemoveToGroup = (nGroupId, nUserId) => {
  return oAxiosInstance
    .post(URL_GROUP_MEMBERS + "remove", {
      id_group: nGroupId,
      id_user: nUserId,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that modifies the captains of a group by API
 *
 * @param {number} nGroupId Group Identifier who wants to add the user.
 * @param {array} aCapitans Arrat of the new captains.
 *
 * @author Leandro Curbelo
 */
export const UpdateCapitans = (nGroupId, aCapitans) => {
  return oAxiosInstance
    .put(URL_GROUP_MEMBERS + "capitans", { id: nGroupId, capitans: aCapitans })
    .then((oResult) => oResult.data);
};
