import {
  Actions,
  Constants,
  MESSAGE_ERROR,
  MESSAGE_PUSH_ERROR,
  NOTIFICATION_SEND_REQUEST,
} from "../../Constants";
import {
  GetFriendRequests,
  GetFriendSent,
  GetDataUser,
} from "../services/FirebaseServices";
import { database } from "../services/FirebaseServices";
import { SearchUsers, CreatePals, DeletePal } from "../services/UserServices";
import { actionGetMyFriends, actionGetProfile } from "./ProfileActions";
import OneSignal from "react-native-onesignal";
import {
  actionMessage,
  actionDispatch,
  actionActiveLoading,
  actionDeactivateLoading,
} from "./SharedActions";
import { AddNotification } from "../services/NotificationServices";
import { NOTIFICATION_PAL_REQUEST } from "../../constants/Notifications";

/**
 * Function that takes pending requests
 *
 * @param {string} sUserKey Key identifier of the account node in the Firebase database
 *
 * @author Leandro Curbelo
 */
export const actionGetRequests = (sUserKey) => {
  return (dispatch) => {
    var aRequestSend = [];
    var aRequestRecived = [];
    GetFriendSent(sUserKey).then((aRequests) => {
      if (aRequests.exists())
        aRequests.forEach((oElement) => {
          if (oElement.val())
            GetDataUser(oElement.key, "name").then((sName) => {
              GetDataUser(oElement.key, "username").then((sUserName) => {
                GetDataUser(oElement.key, "image").then((sProfilePic) => {
                  GetDataUser(oElement.key, "id").then((nIdFitrec) => {
                    var oUser = {
                      key: oElement.key,
                      name: sName.val(),
                      username: sUserName.val(),
                      image: sProfilePic.val(),
                      id: nIdFitrec.val(),
                    };
                    aRequestSend.push(oUser);
                    dispatch(
                      actionDispatch(Actions.GET_REQUEST_SENT_SUCCESS, {
                        requestsSent: aRequestSend,
                      })
                    );
                  });
                });
              });
            });
        });
      else
        dispatch(
          actionDispatch(Actions.GET_REQUEST_SENT_SUCCESS, { requestsSent: [] })
        );
    });
    GetFriendRequests(sUserKey).then((aRequests) => {
      if (aRequests.exists())
        aRequests.forEach((oElement) => {
          if (oElement.exists())
            GetDataUser(oElement.key, "name").then((sName) => {
              GetDataUser(oElement.key, "username").then((sUserName) => {
                GetDataUser(oElement.key, "image").then((sProfilePic) => {
                  GetDataUser(oElement.key, "id").then((nIdFitrec) => {
                    var oUser = {
                      key: oElement.key,
                      name: sName.val(),
                      username: sUserName.val(),
                      image: sProfilePic.val(),
                      id: nIdFitrec.val(),
                    };
                    aRequestRecived.push(oUser);
                    dispatch(
                      actionDispatch(Actions.GET_REQUEST_RECIVED_SUCCESS, {
                        requestsRecived: aRequestRecived,
                      })
                    );
                  });
                });
              });
            });
        });
      else
        dispatch(
          actionDispatch(Actions.GET_REQUEST_RECIVED_SUCCESS, {
            requestsRecived: [],
          })
        );
    });
  };
};

export const actionGetRequestsSentSuccess = (data) => ({
  type: Actions.GET_REQUEST_SENT_SUCCESS,
  data: data,
});

export const actionGetRequestsRecivedSuccess = (data) => ({
  type: Actions.GET_REQUEST_RECIVED_SUCCESS,
  data: data,
});

export const actionGetPeople = (
  sFilter,
  nMinAge,
  nMaxAge,
  nLatitude,
  nLongitude,
  nDistance,
  nGymId,
  aActivities
) => {
  return (dispatch) => {
    if ("" !== sFilter && sFilter.length > 0) {
      dispatch(actionActiveLoading());
      SearchUsers(
        sFilter,
        nMinAge,
        nMaxAge,
        nLatitude,
        nLongitude,
        nDistance,
        nGymId,
        aActivities
      )
        .then((oSuccess) => {
          dispatch(
            actionDispatch(Actions.GET_PEOPLE_FITREC_SUCCESS, {
              peopleFitrec: oSuccess.data,
            })
          );
        })
        .catch((oError) => {
          dispatch(actionMessage(oError.response.data.message));
          dispatch(
            actionDispatch(Actions.GET_PEOPLE_FITREC_SUCCESS, {
              peopleFitrec: [],
            })
          );
        })
        .finally(() => {
          dispatch(actionDeactivateLoading());
        });
    } else {
      dispatch(
        actionDispatch(Actions.GET_PEOPLE_FITREC_SUCCESS, { peopleFitrec: [] })
      );
    }
  };
};

export const actionGetPeopleGroup = (sFilter, aLastUsers = null) => {
  return (dispatch) => {
    dispatch(
      actionDispatch(Actions.GET_PEOPLE_FITREC_SUCCESS, {
        peopleFitrec: [],
      })
    );
    if ("" !== sFilter && sFilter.length > 0) {
      dispatch(actionActiveLoading());
      SearchUsers(sFilter)
        .then((oSuccess) => {
          var aUsers = [];
          if (oSuccess.data.length > 0)
            oSuccess.data.forEach((oUser) => {
              if (
                aLastUsers === null ||
                aLastUsers === undefined ||
                aLastUsers.indexOf(oUser.key) == -1
              ) {
                GetDataUser(oUser.key, "groupsInvitations").then(
                  (aListInvitations) => {
                    var aGroupsInvitations = [];
                    aListInvitations.exists() &&
                      aListInvitations.forEach((oInvitation) => {
                        aGroupsInvitations.push(oInvitation.key);
                      });
                    var aUser = {
                      key: oUser.key,
                      name: oUser.name,
                      username: oUser.username,
                      image: oUser.image,
                      id: oUser.id,
                      invitationsGroup: aGroupsInvitations,
                    };
                    aUsers.push(aUser);
                    dispatch(actionDeactivateLoading());
                    dispatch(
                      actionDispatch(Actions.GET_PEOPLE_FITREC_SUCCESS, {
                        peopleFitrec: aUsers,
                      })
                    );
                  }
                );
              }
            });
          else dispatch(actionDeactivateLoading());
        })
        .catch((oError) => {
          dispatch(actionDeactivateLoading());
          dispatch(
            actionDispatch(Actions.GET_PEOPLE_FITREC_SUCCESS, {
              peopleFitrec: [],
            })
          );
        });
    } else
      dispatch(
        actionDispatch(Actions.GET_PEOPLE_FITREC_SUCCESS, { peopleFitrec: [] })
      );
  };
};

export const actionSendRequest = (
  sUserPalKey,
  sUserKey,
  sUsername,
  bIsHome = false
) => {
  return (dispatch) => {
    database
      .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserPalKey)
      .once("value", function (oAccountSnap) {
        if (oAccountSnap.exists()) {
          var oAccount = oAccountSnap.val(),
            sIdPush = oAccount.idPush,
            sDescription = "Request sent you";
          AddNotification(
            oAccount.id,
            sDescription,
            NOTIFICATION_SEND_REQUEST,
            null
          )
            .then((oSuccess) => {
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                    sUserPalKey +
                    "/friendRequests/" +
                    sUserKey
                )
                .set(true);
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                    sUserKey +
                    "/requestsSent/" +
                    sUserPalKey
                )
                .set(true);
              //TODO: This console log is for checking the push ID value. need to fix the undefined push ID issue
              console.log("checking sIdPush ======>>>>> ", sIdPush);
              if (undefined !== sIdPush && null !== sIdPush) {
                var oDataNotification = {
                  headings: { en: sDescription },
                  contents: { en: sUsername + " sends you a pal request" },
                  android_group: "Request",
                  ios_badgeType: "Increase",
                  ios_badgeCount: 1,
                  data: {
                    type: NOTIFICATION_PAL_REQUEST,
                    id: oSuccess.data.id,
                  },
                  include_player_ids: [sIdPush],
                };
                const jsonString = JSON.stringify(oDataNotification);

                OneSignal.postNotification(
                  jsonString,
                  (success) => {
                    bIsHome
                      ? dispatch(
                          actionDispatch(
                            Actions.SEND_REQUEST_FRIEND_HOME_SUCCESS
                          )
                        )
                      : dispatch(
                          actionDispatch(Actions.SEND_REQUEST_FRIEND_SUCCESS)
                        );
                    dispatch(actionGetRequests(sUserKey));
                    dispatch(actionGetPeople({ text: "" }));
                  },
                  (error) => {
                    console.log("Error =================>>>>> :", error);
                  }
                );
              } else {
                dispatch(actionMessage(MESSAGE_PUSH_ERROR));
              }
            })
            .catch(() => {});
        } else if (bIsHome) dispatch(actionMessage(MESSAGE_ERROR));
        else dispatch(actionMessage(MESSAGE_ERROR));
      })
      .catch(() => {});
  };
};

export const actionResetStateRequest = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.RESET_ACTION_STATE));
  };
};

export const actionResetStateRequestHome = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.RESET_ACTION_STATE_HOME));
  };
};
/**
 * Function that occurs when the user accepts a new request, the function enters the user as a friend
 * in the API services, then add the link in the Firebase database.
 *
 * @param {number} nPalId User ID that sends the pal request
 * @param {string} sPalKey Identifier of the node in Firbease of the user that sends the pal request
 * @param {string} sUserKey Identifier of the Firebase node of the currently logged in user
 *
 * @author Leandro Curbelo
 */
export const actionAcceptRequest = (nPalId, sPalKey, sUserKey) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    CreatePals(nPalId)
      .then(() => {
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
              sPalKey +
              "/requestsSent/" +
              sUserKey
          )
          .set(false)
          .finally(() => {
            database
              .ref(
                Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                  sPalKey +
                  "/requestsSent/" +
                  sUserKey
              )
              .remove();
          });
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
              sUserKey +
              "/friendRequests/" +
              sPalKey
          )
          .remove();
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
              sPalKey +
              "/friends/" +
              sUserKey
          )
          .set(true);
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
              sUserKey +
              "/friends/" +
              sPalKey
          )
          .set(true);
        dispatch(actionDispatch(Actions.ACCEPT_REQUEST_FRIEND_SUCCESS));
        dispatch(actionGetRequests(sUserKey));
        dispatch(actionGetMyFriends(sUserKey));
        dispatch(actionGetMyFriends());
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
 * Function that rejects or cancels a friend request
 *
 * @param {friendKey, accountId} data
 */
export const actionCancelRequest = (data) => {
  return (dispatch) => {
    if (data.type === "reject") {
      // First, the value is changed to false in order to activate the friend's account modification listener and so the APP is refreshed.
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
            data.friendKey +
            "/requestsSent/" +
            data.accountId
        )
        .set(false)
        .finally(() => {
          // The request sent by the friend to the active user is removed
          database
            .ref(
              Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                data.friendKey +
                "/requestsSent/" +
                data.accountId
            )
            .remove();
        });
      // The friend request received on the account of the active user is deleted
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
            data.accountId +
            "/friendRequests/" +
            data.friendKey
        )
        .remove();
      if (data.hiddenMessage) dispatch(actionGetRequests(data.accountId));
      else {
        dispatch(actionDispatch(Actions.CANCEL_REQUEST_FRIEND_SUCCESS));
        dispatch(actionGetRequests(data.accountId));
      }
    } else if (data.type === "cancel") {
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
            data.accountId +
            "/requestsSent/" +
            data.friendKey
        )
        .remove();
      // First, the value is changed to false in order to activate the friend's account modification listener and so the APP is refreshed.
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
            data.friendKey +
            "/friendRequests/" +
            data.accountId
        )
        .set(false)
        .finally(() => {
          // The request received by the active user to the friend is removed
          database
            .ref(
              Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                data.friendKey +
                "/friendRequests/" +
                data.accountId
            )
            .remove();
        });
      dispatch(actionDispatch(Actions.CANCEL_REQUEST_FRIEND_SUCCESS));
      dispatch(actionGetRequests(data.accountId));
    }
  };
};

export const actionUnfollowPal = (
  nPalId,
  sPalKey,
  sUserKey,
  bIsHome = false
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    DeletePal(nPalId)
      .then((oSuccess) => {
        // First, the value is changed to false in order to activate the friend's account modification listener and so the APP is refreshed.
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
              sPalKey +
              "/friends/" +
              sUserKey
          )
          .set(false)
          .finally(() => {
            // Removed the user from the friends list and the friend of from the user's list
            database
              .ref(
                Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                  sPalKey +
                  "/friends/" +
                  sUserKey
              )
              .remove();
            database
              .ref(
                Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                  sUserKey +
                  "/friends/" +
                  sPalKey
              )
              .remove();
            bIsHome
              ? dispatch(actionUnfollowPalHomeSuccess())
              : dispatch(actionUnfollowPalSuccess());
            dispatch(actionGetProfile(nPalId, bIsHome));
            dispatch(actionGetMyFriends(sUserKey));
            dispatch(actionGetRequests(sUserKey));
          });
      })
      .catch(() => {
        bIsHome
          ? dispatch(
              actionUnfollowPalHomeError({
                messageError: MESSAGE_ERROR,
              })
            )
          : dispatch(
              actionUnfollowPalError({
                messageError: MESSAGE_ERROR,
              })
            );
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};

export const actionUnfollowPalSuccess = () => ({
  type: Actions.UNFOLLOW_PAL_HOME_SUCCESS,
});

export const actionUnfollowPalError = (data) => ({
  type: Actions.UNFOLLOW_PAL_HOME_ERROR,
  data: data,
});

export const actionUnfollowPalHomeSuccess = () => ({
  type: Actions.UNFOLLOW_PAL_HOME_SUCCESS,
});

export const actionUnfollowPalHomeError = (data) => ({
  type: Actions.UNFOLLOW_PAL_HOME_ERROR,
  data: data,
});
