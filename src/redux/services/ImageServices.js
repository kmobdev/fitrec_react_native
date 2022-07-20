import { Constants } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

/**
 * Function that sends a new image that is added to the chat to the API to store it.
 *
 * @param {string} sKeyConversation conversation key
 * @param {string} sBase64Image Image based64
 *
 * @return {Promise} [status, url]
 */
export const UploadImageConversation = (sKeyConversation, sBase64Image) => {
  return oAxiosInstance
    .post(Constants.URL_SERVICE + "images/conversations", {
      key: sKeyConversation,
      image: sBase64Image,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that sends a new image that is added to the chat of a group to the API to store it.
 *
 * @param {string} sKeyConversation conversation key
 * @param {string} sBase64Image Image based64
 *
 * @return {Promise} [status, url]
 */
export const UploadImageGroupConversation = (
  sKeyConversation,
  sBase64Image
) => {
  return oAxiosInstance
    .post(Constants.URL_SERVICE + "images/conversations/group", {
      key: sKeyConversation,
      image: sBase64Image,
    })
    .then((oResult) => oResult.data);
};
