import { Constants } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

const URL_SERVICES = Constants.URL_SERVICE + "reports";
/**
 * Function that sends a user profile image to the API to store it and get a URL.
 *
 * @param {string} sKeyUser Key de user
 * @param {string} sBase64Image Image based64
 *
 * @return {Promise} [status, url]
 */
/**
 *
 * @param {number} nId Identifier of the report that is reported, it can be User as Journey
 * @param {number} nType Type of report, report to User or report to Journey
 * @param {string} sReason Reason why it is reported
 * @param {string} sDescription DESCRIPTION, Optional, but required if the reason for the report is Other
 */
export const SendReport = (nId, nType, sReason, sDescription) => {
  return oAxiosInstance
    .post(URL_SERVICES, {
      id: nId,
      reason: sReason,
      description: sDescription,
      type: nType,
    })
    .then((oResult) => oResult.data);
};
