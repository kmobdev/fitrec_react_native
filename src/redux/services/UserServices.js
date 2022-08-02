import { Constants } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

const URL_USERS = Constants.URL_SERVICE + "users/";

export const UserLogin = (sUsername, sPassword) => {
  return oAxiosInstance
    .post(Constants.URL_SERVICE + "login", {
      username: sUsername,
      password: sPassword,
    })
    .then((oResult) => {
      console.log("oResult ====>>>> ", oResult);
      return oResult.data;
    });
};

export const LogOut = () => {
  return oAxiosInstance
    .get(Constants.URL_SERVICE + "logout")
    .then((oResult) => oResult.data);
};

export const UserLoginFB = (data) => {
  return oAxiosInstance
    .post(Constants.URL_SERVICE + "console/wsUser/loginFB/", {
      username: data.userId,
      password: data.password,
    })
    .then((oResult) => oResult.data);
};

export const SaveOneSignalCode = (sPushCode) => {
  return oAxiosInstance
    .post(`${Constants.URL_SERVICE}pushcode`, { id_push: sPushCode })
    .then((oResult) => oResult.data);
};
/**
 * Function that validates that there are no user with the email and/or the username received.
 *
 * @param {string} sEmail Email
 * @param {string} sUsername Username you want to modify
 *
 * @author Leandro Curbelo
 */
export const UserRegisterValidate = (sEmail, sUsername) => {
  return oAxiosInstance
    .post(Constants.URL_SERVICE + "register/validate", {
      email: sEmail,
      username: sUsername,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that sends the data from the registration to the API to process your registration.
 *
 * @param {array} oData Array with user data
 *
 * @author Leandro Curbelo
 */
export const UserRegister = (oData) => {
  return oAxiosInstance
    .post(Constants.URL_SERVICE + "register", {
      name: oData.name,
      email: oData.email,
      username: oData.username,
      password: oData.password,
      display_age: oData.displayAge,
      age: oData.age,
      sex: oData.sex,
      level: oData.level,
      height: oData.height,
      display_weight: oData.displayWeight,
      weight: oData.weight,
      goals: oData.goals,
      latitude: oData.latitude,
      longitude: oData.longitude,
      phone: null,
      id_gym: oData.gymId,
      gym_name: oData.gym,
      new_gym: oData.newGym,
      image: oData.image,
      background: oData.background,
      activities: oData.activities,
      personal_trainer: oData.personalTrainer,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that returns the necessary information to fill the Home Home.
 *
 * @param {array} data Array with filters and others
 *
 * @author Leandro Curbelo
 */
export const GetUserHome = (aActivities, sGarder, aGyms, sRange) => {
  let aFilters = {
    activities: aActivities,
    gyms: aGyms,
    sex: sGarder,
    distance: sRange,
  };
  return oAxiosInstance
    .post(URL_USERS + "home", aFilters)
    .then((oResult) => oResult.data);
};
/**
 * Function that filters the users of the system based on the filters chosen by the user.
 *
 * @param {string} sFilter Text filter to filter through the text fields of other users.
 * @param {number | null} nMinAge Minimum in years
 * @param {number | null} nMaxAge Maximum in years
 * @param {number | null} nLatitude User latitude at the time
 * @param {number | null} nLongitude Longitude of the user at the moment
 * @param {number | null} nGymId Gym ID by which it will leaked
 * @param {Array | null} aActivities Array of activities
 *
 * @author Leandro Curbelo
 */
export const SearchUsers = (
  sFilter,
  nMinAge = null,
  nMaxAge = null,
  nLatitude = null,
  nLongitude = null,
  nDistance = null,
  nGymId = null,
  aActivities = null
) => {
  return oAxiosInstance
    .post(URL_USERS + "search", {
      filter: sFilter,
      min_age: nMinAge,
      max_age: nMaxAge,
      latitude: nLatitude,
      longitude: nLongitude,
      distance: nDistance,
      id_gym: nGymId,
      activities: aActivities,
    })
    .then((oResult) => oResult.data);
};
const URL_USER_PALS = URL_USERS + "pals/";
/**
 * Function that creates a new link of friendship in the SQL database.
 *
 * @param {number} nPalId Identifier of the future friend
 *
 * @author Leandro Curbelo
 */
export const CreatePals = (nPalId) => {
  return oAxiosInstance
    .post(URL_USER_PALS + "accept", { id: nPalId })
    .then((oResult) => oResult.data);
};
/**
 * Function that removes the bond of friendship in the SQL database.
 *
 * @param {number} nPalId Friend identifier
 *
 * @author Leandro Curbelo
 */
export const DeletePal = (nPalId) => {
  return oAxiosInstance
    .post(URL_USER_PALS + "remove", { id: nPalId })
    .then((oResult) => oResult.data);
};
/**
 * Function that records a new blocking action
 *
 * @param {number} nUserId User identifier that you want to block
 *
 * @author Leandro Curbelo
 */
export const BlockUser = (nUserId) => {
  return oAxiosInstance
    .post(`${URL_USER_PALS}block`, { id: nUserId })
    .then((oResult) => oResult.data);
};
/**
 * Function that removes a blockade
 *
 * @param {number} nUserId User identifier that you want to block
 *
 * @author Leandro Curbelo
 */
export const UnblockUser = (nUserId) => {
  return oAxiosInstance
    .post(`${URL_USER_PALS}unblock`, { id: nUserId })
    .then((oResult) => oResult.data);
};

const URL_USERS_BLOCK = URL_USERS + "blocks";

/**
 * Function that takes all users blocked by the active user
 *
 * @author Leandro Curbelo
 */
export const GetBlocks = () => {
  return oAxiosInstance
    .get(`${URL_USERS_BLOCK}`)
    .then((oResult) => oResult.data);
};
// All: methods of blocking, unlocking and listing blocked waiting
/*
    export const GetBlockUsers = (data) => {
        return oAxiosInstance.post(Constants.URL_SERVICE + 'console/wsBlockedUser/getBlockUsers/', data)
            .then(oResult => oResult.data)
    }
    export const UnlockUser = (data) => {
        return oAxiosInstance.post(Constants.URL_SERVICE + 'console/wsBlockedUser/deleteBlockUser/', data)
            .then(oResult => oResult.data)
    }
*/
/**
 * Function that sends a message to the administration of Fitrec.
 *
 * @param {string} sMessage Message content
 *
 * @author Leandro Curbelo
 */
export const ContactusSend = (sMessage) => {
  return oAxiosInstance
    .post(Constants.URL_SERVICE + "contact", { message: sMessage })
    .then((oResult) => oResult.data);
};
/**
 * Function that according to an email, activates the restoration of password for it.
 *
 * @param {string} sEmail User email who wants to restore your password
 *
 * @author Leandro Curbelo
 */
export const ForgotPassword = (sEmail) => {
  return oAxiosInstance
    .post(Constants.URL_SERVICE + "reset_password", { email: sEmail })
    .then((oResult) => oResult.data);
};
/**
 * Function that in case of error sends to eliminate the account based on the email received
 *
 * @param {string} sEmail User email who wants to restore your password
 *
 * @author Leandro Curbelo
 */
export const DeleteAccount = (sEmail) => {
  return oAxiosInstance
    .post(Constants.URL_SERVICE + "register/delete", { email: sEmail })
    .then((oResult) => oResult.data);
};
/**
 * Function that all the user's friends take
 *
 * @param {string} sEmail User email who wants to restore your password
 *
 * @author Leandro Curbelo
 */
export const GetPals = () => {
  return oAxiosInstance.get(`${URL_USERS}pals`).then((oResult) => oResult.data);
};
