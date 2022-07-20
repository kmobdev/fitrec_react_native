import { Actions, POST_TYPE_VIDEO } from "../../Constants";
import {
  DeleteStory,
  GetStories,
  UploadStory,
  UploadStoryVideo,
  ViewStories,
} from "../services/StoryServices";
import {
  actionActiveLoading,
  actionCloseImage,
  actionDeactivateLoading,
  actionDispatch,
  actionMessage,
} from "./SharedActions";

/**
 * Function that sete in Redux a user story to expand, it receives the image,
 *  the username and date (hours that causes the story to be uploaded).
 *
 * @param {string} nStoryId History identifier that you want to expand
 * @param {string} sImage URL of the image to expand
 * @param {string} sProfileImage User's profile image URL
 * @param {string} sUsername Username that will be shown at the top of the story
 * @param {string} sDate Date that will be shown at the top of history
 * @param {string} sLevel User training level
 *
 * @author Leandro Curbelo
 */
export const actionExpandStory = (
  nStoryId,
  sImage,
  sProfileImage,
  sUsername,
  sDate,
  sLevel,
  bIsOwner,
  nType,
  nIndex,
  nTotalStories
) => {
  return (dispatch) => {
    dispatch(
      actionDispatch(Actions.EXPAND_STORY, {
        id: nStoryId,
        image: sImage,
        date: sDate,
        name: sUsername,
        profile: sProfileImage,
        level: sLevel,
        owner: bIsOwner,
        type: nType,
        index: nIndex,
        total: nTotalStories,
      })
    );
  };
};
/**
 * Function that is responsible for taking all the stories with their states for the active user from the API.
 *
 * @author Leandro Curbelo
 */
export const actionGetStories = () => {
  return (dispatch) => {
    GetStories()
      .then((oSuccess) => {
        dispatch(
          actionDispatch(Actions.GET_STORIES, { stories: oSuccess.data })
        );
      })
      .catch(() => {
        dispatch(actionDispatch(Actions.GET_STORIES, { stories: [] }));
      });
  };
};
/**
 * Function that marks like seen a story
 *
 * @param {string} nStoryId History identifier just visualized
 *
 * @author Leandro Curbelo
 */
export const actionViewStory = (nStoryId) => {
  return (dispatch) => {
    ViewStories(nStoryId)
      .then(() => {})
      .catch(() => {});
  };
};
/**
 * Function that seizes the progress of the publication that is being visualized.
 *
 * @param {number} nProgress Number that identifies the progress of visualization
 *
 * @author Leandro Curbelo
 */
export const actionUpdateProgressStory = (nProgress) => {
  return (dispatch) => {
    dispatch(
      actionDispatch(Actions.UPDATE_PROGRESS_STORY, { progress: nProgress })
    );
  };
};
/**
 * Function that adds an image for your preview in history.
 *
 * @param {string} sImage Image based64 that was recently selected
 *
 * @author Leandro Curbelo
 */
export const actionPreviewStory = (nType, sImage, sVideoName = null) => {
  return (dispatch) => {
    dispatch(
      actionDispatch(Actions.PREVIEW_STORY, {
        type: nType,
        image: sImage,
        name: sVideoName,
      })
    );
  };
};
/**
 * Function that uploads a new story to the user's account.
 *
 * @param {string} sImage Image based64 that was recently selected
 *
 * @author Leandro Curbelo
 */
export const actionUploadStory = (nType, sPath, sVideoName) => {
  return (dispatch) => {
    dispatch(actionCloseImage());
    dispatch(actionActiveLoading());
    if (nType == POST_TYPE_VIDEO)
      UploadStoryVideo(sVideoName, sPath)
        .then((oSuccess) => {
          UploadStory(nType, oSuccess.data.name)
            .then((oSuccess) => {
              dispatch(actionGetStories());
              dispatch(actionCloseImage());
            })
            .catch(() => {
              dispatch(
                actionMessage(
                  "There was an error uploading your story, please try again later"
                )
              );
            })
            .finally(() => {
              dispatch(actionDeactivateLoading());
            });
        })
        .catch(() => {
          dispatch(
            actionMessage(
              "There was an error uploading your story, please try again later"
            )
          );
        });
    else
      UploadStory(nType, sPath)
        .then(() => {
          dispatch(actionGetStories());
          dispatch(actionCloseImage());
        })
        .catch(() => {
          dispatch(
            actionMessage(
              "There was an error uploading your story, please try again later"
            )
          );
        })
        .finally(() => {
          dispatch(actionDeactivateLoading());
        });
  };
};
/**
 * Function in charge of advancing the visualization of the story.
 *
 * @author Leandro Curbelo
 */
export const actionNextStory = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.NEXT_STORY));
  };
};
/**
 * Function in charge of going back a place the visualization of the story.
 *
 * @author Leandro Curbelo
 */
export const actionPreviousStory = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.PREVIOUS_STORY));
  };
};
/**
 * Function in charge of pausing the visualization of history.
 *
 * @author Leandro Curbelo
 */
export const actionStopStory = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.STOP_STORY));
  };
};
/**
 * Function in charge of resetting the values of the management controls of the history visualization.
 *
 * @author Leandro Curbelo
 */
export const actionResetControlStory = (bIsStories = false) => {
  return (dispatch) => {
    bIsStories
      ? dispatch(actionDispatch(Actions.RESET_CONTROLS_STORIES))
      : dispatch(actionDispatch(Actions.RESET_CONTROLS));
  };
};
/**
 * Work in charge of eliminating a user profile story
 *
 * @param {number} nStoryId Identifier of the story to be eliminated.
 *
 * @author Leandro Curbelo
 */
export const actionDeleteStory = (nStoryId) => {
  return (dispatch) => {
    dispatch(actionNextStory());
    dispatch(actionActiveLoading());
    DeleteStory(nStoryId)
      .then(() => {
        dispatch(actionGetStories());
        dispatch(actionMessage("Story removed"));
      })
      .catch(() => {
        dispatch(
          actionMessage(
            "There was an error deleting your story, please try again later"
          )
        );
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};
/**
 * Function in charge of resetting the values of the controls for the toast of see and upload new user history.
 *
 * @author Leandro Curbelo
 */
export const actionResetActionsStory = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.STORY_ACTION_RESET));
  };
};
/**
 * Function in charge of setting the value to move to the Stories component the action of seeing the user history itself.
 *
 * @author Leandro Curbelo
 */
export const actionViewStoryAction = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.STORY_ACTION_VIEW));
  };
};
/**
 * Work in charge of setting the value to move to the Stories component the action of raising a new user story.
 *
 * @author Leandro Curbelo
 */
export const actionUploadStoryAction = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.STORY_ACTION_UPLOAD));
  };
};
