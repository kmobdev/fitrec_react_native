import { Constants, POST_TYPE_VIDEO } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

const URL_STORIES = Constants.URL_SERVICE + "stories";
/**
 * Work in charge of listing all the stories for a user.
 *
 * @author Leandro Curbelo
 */
export const GetStories = () => {
  return oAxiosInstance.get(URL_STORIES).then((oResult) => oResult.data);
};
/**
 * It is in charge of marking a story of a user for the active user.
 *
 * @param {number} nStoryId History identifier just visualized
 *
 * @author Leandro Curbelo
 */
export const ViewStories = (nStoryId) => {
  return oAxiosInstance
    .put(URL_STORIES + "/" + nStoryId)
    .then((oResult) => oResult.data);
};
/**
 * Work in charge of uploading a new story of the user that is currently logged in.
 *
 * @author Leandro Curbelo
 */
export const UploadStory = (nType, sImage) => {
  return oAxiosInstance
    .post(URL_STORIES, { type: nType, image: sImage })
    .then((oResult) => oResult.data);
};
/**
 * Work in charge of uploading a new video story of the user that is currently logged in.
 *
 * @author Leandro Curbelo
 */
export const UploadStoryVideo = (sVideoName, sVideoUri) => {
  const oFormData = new FormData();
  oFormData.append("file", {
    name: sVideoName,
    uri:
      Platform.OS === "android"
        ? "file://" + sVideoUri
        : sVideoUri.replace("file://", ""),
    type: "video/mp4",
  });
  return oAxiosInstance
    .post(URL_STORIES + "/video", oFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((oResult) => oResult.data);
};
/**
 * It is in charge of marking a story of a user for the active user.
 *
 * @param {number} nStoryId Identifier of the story to be eliminated.
 *
 * @author Leandro Curbelo
 */
export const DeleteStory = (nStoryId) => {
  return oAxiosInstance
    .delete(URL_STORIES + "/" + nStoryId)
    .then((oResult) => oResult.data);
};
