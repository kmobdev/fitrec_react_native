import { Platform } from "react-native";
import { Constants } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

const URL_JOURNEYS = Constants.URL_SERVICE + "journeys";

/**
 * Function that the system journeys ready using the API.
 *
 * @author Leandro Curbelo
 */
export const GetJourneyList = () => {
  return oAxiosInstance.get(URL_JOURNEYS).then((oResult) => oResult.data);
};
/**
 * Function that adds a like to a publication.
 *
 * @param {number} nJourneyId Post Journey Identifier
 *
 * @author Leandro Curbelo
 */
export const AddLike = (nJourneyId) => {
  return oAxiosInstance
    .post(URL_JOURNEYS + "/likes/" + nJourneyId)
    .then((oResult) => oResult.data);
};
/**
 * Function that removes an existing like of the user in a publication.
 *
 * @param {number} nJourneyId Post Journey Identifier
 *
 * @author Leandro Curbelo
 */
export const UnLike = (nJourneyId) => {
  return oAxiosInstance
    .delete(URL_JOURNEYS + "/likes/" + nJourneyId)
    .then((oResult) => oResult.data);
};
/**
 * Work in charge of sending the data to the API to create a new post journey
 *
 * @param {string} sDescription Post Description
 * @param {string} sImage Coded image on the basis64
 * @param {number | null} nLatitude Latitude that refers to the moment in which the post was made
 * @param {number | null} nLongitude Longitude that reference at the time the post was made
 * @param {Array | null} aTags Image tags array
 *
 * @author Leandro Curbelo
 */
export const CreateJourney = (sDescription, aFiles, nLatitude, nLongitude) => {
  return oAxiosInstance
    .post(URL_JOURNEYS, {
      description: sDescription,
      files: aFiles,
      latitude: nLatitude,
      longitude: nLongitude,
    })
    .then((oResult) => oResult.data);
};

const URL_JOURNEYS_VIDEO = URL_JOURNEYS + "/videos/";
/**
 * Function that sends a video to the API.
 *
 * @param {object} oVideo Video object containing {uri, name}
 *
 * @author Leandro Curbelo
 */
// !DELETE: This function must be deleted in case it is not used anymore
export const UploadVideo = (oVideo) => {
  const oFormData = new FormData();
  oFormData.append("file", {
    name: oVideo.name,
    uri:
      Platform.OS === "android"
        ? "file://" + oVideo.uri
        : oVideo.uri.replace("file://", ""),
    type: "video/mp4",
  });
  return oAxiosInstance
    .post(URL_JOURNEYS_VIDEO + "upload", oFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that sends to create a new Journey with the video name that was previously uploaded.
 *
 * @param {string} sDescription Post Description
 * @param {string} sName Video name, it will be corroborated before saving the post.
 * @param {number | null} nLatitude Latitude that refers to the moment in which the post was made
 * @param {number | null} nLongitude Longitude that refers to the moment in which the post was made
 *
 * @author Leandro Curbelo
 */
// DELETE: This function must be deleted in case it is not used anymore
export const CreateJourneyVideo = (
  sDescription,
  sName,
  nLatitude,
  nLongitude
) => {
  return oAxiosInstance
    .post(URL_JOURNEYS_VIDEO + "add", {
      description: sDescription,
      name: sName,
      latitude: nLatitude,
      longitude: nLongitude,
    })
    .then((oResult) => oResult.data);
};

const URL_JOURNEYS_TAGS = URL_JOURNEYS + "/tags";
/**
 * Function that adds a new tag to a post.
 *
 * @param {number} nJourneyId Journey Identifier
 * @param {number} nUserId User identifier that you want to tagged
 * @param {number} nX Coordinate in X of the Tag
 * @param {number} nY Coordinate in and tag
 * @param {number} nImageId Identifier of the image to which it is taggea
 *
 * @author Leandro Curbelo
 */
export const AddTagJourney = (nJourneyId, nUserId, nX, nY, nImageId) => {
  return oAxiosInstance
    .post(URL_JOURNEYS_TAGS, {
      id_journey: nJourneyId,
      id_user: nUserId,
      x: nX,
      y: nY,
      id_image: nImageId,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function that removes a tag from a post.
 *
 * @param {number} nTagId Tag identifier in the system
 *
 * @author Leandro Curbelo
 */
export const RemoveTagJourney = (nTagId) => {
  return oAxiosInstance
    .delete(URL_JOURNEYS_TAGS + "/" + nTagId)
    .then((oResult) => oResult.data);
};
/**
 * Function that removes an existing like of the user in a publication.
 *
 * @param {number} nJourneyId Post Journey Identifier
 *
 * @author Leandro Curbelo
 */
export const DeleteJourney = (nJourneyId) => {
  return oAxiosInstance
    .delete(URL_JOURNEYS + "/" + nJourneyId)
    .then((oResult) => oResult.data);
};
/**
 * Function that removes an existing like of the user in a publication.
 *
 * @param {number} nJourneyId Post Journey Identifier
 *
 * @author Leandro Curbelo
 */
export const GetLikes = (nJourneyId) => {
  return oAxiosInstance
    .get(URL_JOURNEYS + "/likes/" + nJourneyId)
    .then((oResult) => oResult.data);
};
/**
 * Journey's information in editing the information
 *
 * @param {number} nJourneyId Post identifier
 * @param {string | null} sDescription New description of the post, otherwise null
 * @param {string | null} sImage New image coded based64, otherwise null
 *
 * @author Leandro Curbelo
 */
export const EditJourney = (nJourneyId, sDescription, sImage) => {
  return oAxiosInstance
    .put(URL_JOURNEYS + "/" + nJourneyId, {
      description: sDescription,
      image: sImage,
    })
    .then((oResult) => oResult.data);
};
/**
 * Function in charge of taking a unique journey
 *
 * @param {number} nJourneyId Post identifier
 *
 * @author Leandro Curbelo
 */
export const GetJourney = (nJourneyId) => {
  return oAxiosInstance
    .get(URL_JOURNEYS + "/" + nJourneyId)
    .then((oResult) => oResult.data);
};
/**
 * Function that receives a file arrangement, stores them in a forming arrangement and sends them to the server for storage.
 *
 * @param {Array} aFiles Files array with all your data
 *
 * @author Leandro Curbelo
 */
export const UploadFiles = async (aFiles) => {
  const oFormData = new FormData();
  await aFiles.forEach((oFile) => {
    oFormData.append("file[]", {
      name: oFile.name,
      uri:
        Platform.OS === "android"
          ? "file://" + oFile.uri
          : oFile.uri.replace("file://", ""),
      type: oFile.mediaType,
    });
  });
  return oAxiosInstance
    .post(URL_JOURNEYS + "/files", oFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((oResult) => oResult.data);
};
