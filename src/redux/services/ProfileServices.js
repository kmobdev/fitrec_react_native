import { Constants } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

const URL_USERS = Constants.URL_SERVICE + "users/";
const URL_USER_ACCOUNT = URL_USERS + "account";

export const GetProfile = (nUserId) => {
  return oAxiosInstance
    .get(URL_USERS + "profile/" + nUserId)
    .then((oResult) => oResult.data);
};
/**
 * Function that modifies the user's profile, all values can be null.
 *
 * @param {string | null} sName User name
 * @param {boolean | null} bDisplayAge Value that allows the user's age to be visualized in your profile
 * @param {string | null} sAge Date of Birth
 * @param {string | null} sSex Gender values possible 'M' or 'F'
 * @param {string | null} sLevel Level with which the user identifies on the fitness
 * @param {string | null} sHeight User height in feets
 * @param {boolean | null} bDisplayWight Value that allows the user weight to be visualized
 * @param {string | null} sWeight User weight in lbs (pound)
 * @param {string | null} sGoals DESCRIPTION OF YOUR PROFILE
 * @param {number | null} nGymId Identifier of a gym with which he will be associated
 * @param {boolean | null} bNewGym Value that warns our API to generate a new gym
 * @param {string | null} sGymName Gymnasium name or in case of being a new one, name of the new gym
 * @param {array | null} aActivities Activity array that the user performs
 * @param {string | null} sImage Base64 encoded image
 * @param {string | null} sImageBackground Background image coded based64
 *
 * @author Leandro Curbelo
 */
export const UpdateProfile = (
  sName,
  bDisplayAge,
  sAge,
  sSex,
  sLevel,
  sHeight,
  bDisplayWight,
  sWeight,
  sGoals,
  nGymId,
  bNewGym,
  sGymName,
  bPersonalTrainer,
  aActivities,
  sImage,
  sImageBackground
) => {
  return oAxiosInstance
    .put(URL_USER_ACCOUNT, {
      name: sName,
      display_age: bDisplayAge,
      age: sAge,
      sex: sSex,
      level: sLevel,
      height: sHeight,
      display_weight: bDisplayWight,
      weight: sWeight,
      goals: sGoals,
      id_gym: nGymId,
      personal_trainer: bPersonalTrainer,
      new_gym: bNewGym,
      gym_name: sGymName,
      activities: aActivities,
      image: sImage,
      background: sImageBackground,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that edits and set a new Firebase key for the user currently logged in.
 *
 * @param {string} sKey User data identifier in Firebase
 *
 * @author Leandro Curbelo
 */
export const UpdateKeyProfile = (sKey) => {
  return oAxiosInstance
    .put(URL_USER_ACCOUNT + "/key", {
      key: sKey,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that deactivates the user account currently logged in.
 *
 * @author Leandro Curbelo
 */
export const DesactiveAccount = () => {
  return oAxiosInstance
    .delete(URL_USER_ACCOUNT + "/desactive")
    .then((oResult) => oResult.data);
};
/**
 * Function that sends a new user location to the API to update the position data.
 *
 * @param {number} nLongitude User longitude
 * @param {number} nLatitude latitude of user
 *
 * @author Leandro Curbelo
 */
export const SetLocation = (nLongitude, nLatitude) => {
  return oAxiosInstance
    .post(URL_USER_ACCOUNT + "/location", {
      longitude: nLongitude,
      latitude: nLatitude,
    })
    .then((oResult) => oResult.data);
};
