import { Actions, MESSAGE_ERROR } from "../../Constants";
import {
  GetJourneyList,
  AddLike,
  CreateJourney,
  AddTagJourney,
  RemoveTagJourney,
  DeleteJourney,
  UnLike,
  GetLikes,
  EditJourney,
  GetJourney,
  UploadFiles,
} from "../services/JourneyServices";
import OneSignal from "react-native-onesignal";
import { GetDataUser } from "../services/FirebaseServices";
import { actionGetProfile } from "./ProfileActions";
import {
  actionDeactivateLoading,
  actionActiveLoading,
  actionMessage,
  actionDispatch,
} from "./SharedActions";
import { actionSendPushNotification } from "./NotificationActions";
import { NOTIFICATION_JOURNEY_TAG } from "../../constants/Notifications";

export const actionGetJourneyList = () => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    GetJourneyList()
      .then((oSuccess) => {
        if (oSuccess.data !== undefined && oSuccess.data.length > 0) {
          let bIsFirst = true;
          oSuccess.data.forEach(async (oJourney) => {
            oJourney.paused = true;
            oJourney.nIndex = 0;
            if (bIsFirst) {
              oJourney.paused = false;
              bIsFirst = false;
            }
          });
        }
        dispatch(actionGetJourneyListSuccess({ journeys: oSuccess.data }));
      })
      .catch(() => {
        dispatch(actionGetJourneyListError({ messageError: MESSAGE_ERROR }));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};

export const actionGetJourneyListSuccess = (data) => ({
  type: Actions.GET_JOURNEY_LIST_SUCCESS,
  data: data,
});

export const actionGetJourneyListError = (data) => ({
  type: Actions.GET_JOURNEY_LIST_ERROR,
  data: data,
});

export const actionAddUnLike = (
  nJourneyId,
  bAddLike,
  oDataNotification = null,
  bShowJourney = false
) => {
  return (dispatch) => {
    var oResult = null;
    if (bAddLike) oResult = AddLike(nJourneyId);
    else oResult = UnLike(nJourneyId);
    oResult
      .then(() => {
        dispatch(actionAddUnLikeSuccess());
        dispatch(actionGetJourneyList());
        if (bShowJourney) dispatch(actionGetJourney(nJourneyId));
        if (
          bAddLike &&
          null !== oDataNotification &&
          null !== oDataNotification.sPushId
        )
          dispatch(
            actionSendPushNotification(
              oDataNotification.sHeader,
              oDataNotification.sDescription,
              oDataNotification.sPushId
            )
          );
      })
      .catch((oError) => {
        dispatch(
          actionAddUnLikeError({ messageError: oError.response.data.message })
        );
      });
  };
};

export const actionAddUnLikeSuccess = () => ({
  type: Actions.ADD_LIKE_SUCCESS,
});

export const actionAddUnLikeError = (data) => ({
  type: Actions.ADD_LIKE_ERROR,
  data: data,
});
/**
 * Function that creates a new Journey
 *
 * @param {number} nUserId User identifier, used to refresh your profile.
 * @param {string} sUsername Username of the user, used for the header of push notifications
 * @param {string} sDescription Journey Description
 * @param {string} sImage Base64 encoded image
 * @param {number} nLatitude Latitude in which the user is positioned at the time of creating the Journey
 * @param {number} nLongitude Longitud in which the user is positioned at the time of creating the Journey
 * @param {Array} aTags Array of users tagged in the image
 *
 * @author Leandro Curbelo
 */
export const actionCreateJourney = (
  nUserId,
  sUsername,
  sDescription,
  nLatitude,
  nLongitude,
  aFiles = null
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    UploadFiles(aFiles)
      .then((oSuccess) => {
        let nCount = 0;
        aFiles.forEach((oFile) => {
          oFile.name = oSuccess.data[nCount++].name;
        });
        CreateJourney(sDescription, aFiles, nLatitude, nLongitude)
          .then((oSuccessJourney) => {
            aFiles.forEach((oFile) => {
              oFile.tags.forEach((oTag) => {
                GetDataUser(oTag.key, "idPush").then((sIdPush) => {
                  if (sIdPush.exists()) {
                    var oDataNotification = {
                      headings: { en: oTag.name },
                      contents: {
                        en:
                          "You have been tagged, " + sUsername + " tagged you",
                      },
                      android_group: "0",
                      ios_badgeType: "Increase",
                      ios_badgeCount: 1,
                      data: {
                        type: NOTIFICATION_JOURNEY_TAG,
                        id: oSuccessJourney.data.id,
                      },
                      include_player_ids: [sIdPush.val()],
                    };
                    const jsonString = JSON.stringify(oDataNotification);

                    OneSignal.postNotification(
                      jsonString,
                      (success) => {
                        console.log("Success:", success);
                      },
                      (error) => {
                        console.log("Error:", error);
                      }
                    );
                  }
                });
              });
            });
            dispatch(actionCreateJourneySuccess());
            dispatch(actionGetJourneyList());
            dispatch(actionGetProfile(nUserId));
          })
          .catch((oError) => {
            dispatch(actionMessage(oError.response.data.message));
            dispatch(actionDispatch(Actions.CREATE_JOURNEY_ERROR));
          });
      })
      .catch((oError) => {
        dispatch(actionMessage(oError.response.data.message));
        dispatch(actionDispatch(Actions.CREATE_JOURNEY_ERROR));
      })
      .finally(() => dispatch(actionDeactivateLoading()));
  };
};

export const actionCreateJourneySuccess = () => ({
  type: Actions.CREATE_JOURNEY_SUCCESS,
});

export const actionCreateJourneyError = (data) => ({
  type: Actions.CREATE_JOURNEY_ERROR,
  data: data,
});

export const actionRemoveTagUser = (
  nTagId,
  nUserId,
  bShowJourney = false,
  nJourneyId = null
) => {
  return (dispatch) => {
    RemoveTagJourney(nTagId)
      .then((oSuccess) => {
        dispatch(actionRemoveTagUserSuccess());
        dispatch(actionGetProfile(nUserId));
        dispatch(actionGetJourneyList());
        if (bShowJourney) dispatch(actionGetJourney(nJourneyId));
      })
      .catch((oError) => {
        dispatch(
          actionRemoveTagUserError({
            messageError: oError.response.data.message,
          })
        );
      });
  };
};

export const actionRemoveTagUserSuccess = () => ({
  type: Actions.REMOVE_TAG_USER_SUCCESS,
});

export const actionRemoveTagUserError = (data) => ({
  type: Actions.REMOVE_TAG_USER_ERROR,
  data: data,
});
/**
 * Function that adds a new tag to a post.
 *
 * @param {number} nJourneyId Journey identifier.
 * @param {number} nUserTaggedId Tagged User identifier
 * @param {number} nX Tag x-coordinate
 * @param {number} nY Tag y-coordinate
 * @param {string} sUserKey Identifier of the tagged user data node
 * @param {number} nUserId User identifier that tags (logged user)
 * @param {string} sName Name of the user who tags (logged user)
 * @param {string} sUsername Username of the user who tags (logged in user)
 *
 * @author Leandro Curbelo
 */
export const actionAddTagUser = (
  nJourneyId,
  nUserTaggedId,
  nX,
  nY,
  sUserKey,
  nUserId,
  sName,
  sUsername,
  nImageId,
  bShowJourney = false
) => {
  return (dispatch) => {
    AddTagJourney(nJourneyId, nUserTaggedId, nX, nY, nImageId)
      .then((oSuccess) => {
        GetDataUser(sUserKey, "idPush").then((sIdPush) => {
          if (sIdPush.exists()) {
            var oDataNotification = {
              headings: { en: sName },
              contents: {
                en: "You have been tagged, " + sUsername + " tagged you",
              },
              android_group: "0",
              ios_badgeType: "Increase",
              ios_badgeCount: 1,
              data: { type: NOTIFICATION_JOURNEY_TAG, id: oSuccess.data.id },
              include_player_ids: [sIdPush.val()],
            };
            const jsonString = JSON.stringify(oDataNotification);

            OneSignal.postNotification(
              jsonString,
              (success) => {
                console.log("Success:", success);
              },
              (error) => {
                console.log("Error:", error);
              }
            );
          }
        });
        dispatch(actionAddTagUserSuccess());
        dispatch(actionGetProfile(nUserId));
        dispatch(actionGetJourneyList());
        if (bShowJourney) dispatch(actionGetJourney(nJourneyId));
      })
      .catch(() => {
        dispatch(
          actionAddTagUserError({
            messageError: MESSAGE_ERROR,
          })
        );
      });
  };
};

export const actionAddTagUserSuccess = () => ({
  type: Actions.ADD_TAG_USER_SUCCESS,
});

export const actionAddTagUserError = (data) => ({
  type: Actions.ADD_TAG_USER_ERROR,
  data: data,
});

export const actionDeleteJourney = (nJourneyId, nUserId) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    DeleteJourney(nJourneyId)
      .then(() => {
        dispatch(actionDispatch(Actions.DELETE_JOURNEY_SUCCESS));
        dispatch(actionGetProfile(nUserId));
        dispatch(actionGetJourneyList());
      })
      .catch((oError) => {
        dispatch(
          actionDeleteJourneyError({
            messageError: oError.response.data.message,
          })
        );
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};

export const actionDeleteJourneyError = (data) => ({
  type: Actions.DELETE_JOURNEY_ERROR,
  data: data,
});

export const actionGetLikes = (nJourneyId) => {
  return (dispatch) => {
    dispatch(
      actionGetLikesSuccess({
        usersLiked: [],
        status: false,
      })
    );
    GetLikes(nJourneyId)
      .then((oSuccess) => {
        dispatch(
          actionGetLikesSuccess({
            usersLiked: oSuccess.data,
            status: true,
          })
        );
      })
      .catch(() => {
        dispatch(
          actionGetLikesSuccess({
            messageError: MESSAGE_ERROR,
            status: true,
          })
        );
      });
  };
};

export const actionGetLikesSuccess = (data) => ({
  type: Actions.GET_LIKES_SUCCESS,
  data: data,
});

export const actionGetLikesError = (data) => ({
  type: Actions.GET_LIKES_ERROR,
  data: data,
});
/**
 * Function that edits a Journey post
 *
 * @param {number} nJourneyId Journey Identifier
 * @param {number} nIdUser User identifier, used to update your profile
 * @param {string} sDescription Post Description
 * @param {string} sImage Base64 encoded image
 *
 * @author Leandro Curbelo
 */
export const actionEditJourney = (
  nJourneyId,
  nIdUser,
  sDescription = null,
  sImage = null,
  bShowJourney = false
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    EditJourney(nJourneyId, sDescription, sImage)
      .then((oSuccess) => {
        dispatch(actionMessage(oSuccess.message));
        if (bShowJourney) dispatch(actionGetJourney(nJourneyId));
        dispatch(actionGetJourneyList());
        dispatch(actionGetProfile(nIdUser));
      })
      .catch((oError) => {
        dispatch(actionMessage(oError.response.data.message));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};
/**
 * Function that takes a single post journey
 *
 * @param {number | null} nJourneyId Journey Identifier
 *
 * @author Leandro Curbelo
 */
export const actionGetJourney = (nJourneyId = null) => {
  return (dispatch) => {
    if (null !== nJourneyId) {
      dispatch(actionActiveLoading());
      GetJourney(nJourneyId)
        .then((oSuccess) => {
          dispatch(
            actionDispatch(Actions.GET_JOURNEY, {
              status: true,
              journey: oSuccess.data,
            })
          );
        })
        .catch((oError) => {
          dispatch(actionMessage(oError.response.data.message));
          dispatch(actionDispatch(Actions.GET_JOURNEY, { status: false }));
        })
        .finally(() => {
          dispatch(actionDeactivateLoading());
        });
    } else {
      dispatch(actionDispatch(Actions.CLEAN_JOURNEY));
    }
  };
};
