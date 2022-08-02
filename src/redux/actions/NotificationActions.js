import { Actions, MESSAGE_ERROR } from "../../Constants";
import {
  DeleteAllNotification,
  DeleteNotification,
} from "../services/NotificationServices";
import {
  actionDispatch,
  actionMessage,
  actionActiveLoading,
  actionDeactivateLoading,
} from "./SharedActions";
import {
  GetGroup,
  GetUsersGroup,
  GetDataUser,
  IsCaptain,
} from "../services/FirebaseServices";

import OneSignal from "react-native-onesignal";

/**
 *
 * @param {*} data
 */
export const actionDeleteNotification = (nNotificationId) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    DeleteNotification(nNotificationId)
      .then((oSuccess) => {
        var nCountNotificationUnRead = 0;
        oSuccess.data.forEach((oNotification) => {
          !oNotification.view && nCountNotificationUnRead++;
        });
        dispatch(
          actionDispatch(Actions.GET_NOTIFICATION_SUCCESS, {
            notifications: oSuccess.data,
            notificationsUnRead: nCountNotificationUnRead,
          })
        );
      })
      .catch(() => {
        dispatch(actionMessage(MESSAGE_ERROR));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};

export const actionDeleteAllNotification = () => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    DeleteAllNotification()
      .then((oSuccess) => {
        var nCountNotificationUnRead = 0;
        dispatch(
          actionDispatch(Actions.GET_NOTIFICATION_SUCCESS, {
            notifications: [],
            notificationsUnRead: nCountNotificationUnRead,
          })
        );
      })
      .catch((oError) => {
        dispatch(actionMessage(MESSAGE_ERROR));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};

export const actionOpenGroupNotification = (sGroupKey, sKeyUser) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    GetGroup(sGroupKey)
      .then(async (aGroupSnapshot) => {
        if (aGroupSnapshot.exists()) {
          var aGroup = aGroupSnapshot.val(),
            aNodoGroup = {
              key: aGroupSnapshot.key,
              name: aGroup.name,
              description: aGroup.description,
              image: aGroup.image === undefined ? null : aGroup.image,
              participants: aGroup.users,
              capitans: aGroup.capitans,
              type: aGroup.type,
              dateCreated: aGroup.dateCreated,
              id: aGroup.id,
            },
            aParticipants = [],
            aCapitans = [],
            aUsers = [],
            nCount = 0;
          GetUsersGroup(sGroupKey).then((aListUsers) => {
            if (aListUsers.exists())
              aListUsers.forEach((sKeyUserNode) => {
                GetDataUser(sKeyUserNode.key, "name").then((sName) => {
                  if (sName.exists())
                    GetDataUser(sKeyUserNode.key, "username").then(
                      (sUserName) => {
                        GetDataUser(sKeyUserNode.key, "image").then(
                          (sProfilePic) => {
                            GetDataUser(sKeyUserNode.key, "fitnesLevel").then(
                              (sFitnessLevel) => {
                                GetDataUser(sKeyUserNode.key, "email").then(
                                  (sEmail) => {
                                    GetDataUser(sKeyUserNode.key, "id").then(
                                      (nIdFitrec) => {
                                        nCount++;
                                        var aUser = {
                                          key: sKeyUserNode.key,
                                          name: sName.val(),
                                          username: sUserName.val(),
                                          image: sProfilePic.val(),
                                          fitnesLevel: sFitnessLevel.val(),
                                          email: sEmail.val(),
                                          id: nIdFitrec.val(),
                                        };
                                        aUsers.push(sKeyUserNode.key);
                                        aParticipants.push(aUser);
                                        IsCaptain(sGroupKey, aUser.key).then(
                                          (bIsCapitan) => {
                                            bIsCapitan.exists() &&
                                              aCapitans.push(aUser);
                                            if (
                                              nCount ===
                                              aListUsers.numChildren()
                                            ) {
                                              GetDataUser(
                                                sKeyUser,
                                                "groupsInvitations/" +
                                                  aNodoGroup.key
                                              ).then((bIsRequestPending) => {
                                                aNodoGroup.participants =
                                                  aParticipants;
                                                aNodoGroup.capitans = aCapitans;
                                                aNodoGroup.users = aUsers;
                                                aNodoGroup.requestPending =
                                                  bIsRequestPending.exists();
                                                dispatch(
                                                  actionDeactivateLoading()
                                                );
                                                dispatch(
                                                  actionDispatch(
                                                    Actions.GET_GROUP_NOTIFICATION,
                                                    aNodoGroup
                                                  )
                                                );
                                              });
                                            }
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  else if (nCount === aListUsers.numChildren()) {
                    GetDataUser(
                      sKeyUser,
                      "groupsInvitations/" + aNodoGroup.key
                    ).then((bIsRequestPending) => {
                      aNodoGroup.participants = aParticipants;
                      aNodoGroup.capitans = aCapitans;
                      aNodoGroup.requestPending = bIsRequestPending.exists();
                      dispatch(actionDeactivateLoading());
                      dispatch(
                        actionDispatch(
                          Actions.GET_GROUP_NOTIFICATION,
                          aNodoGroup
                        )
                      );
                    });
                  }
                });
              });
          });
        } else {
          dispatch(actionDeactivateLoading());
          dispatch(actionMessage("The group has been removed"));
        }
      })
      .catch(() => {
        dispatch(actionDeactivateLoading());
        dispatch(actionMessage(MESSAGE_ERROR));
      });
  };
};

export const actionCleanOpenGroup = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.GET_GROUP_NOTIFICATION));
  };
};

/**
 * Function that centralizes the shipments of Push notifications, from here you will try to send all the
 *  outgoing notifications of the application.
 *
 * @param {string} sHeader Main title of the notification
 * @param {string} sDescription DESCRIPTION OF THE NOTIFICATION
 * @param {string} sIdPushDestination OneSignal identifier of the recipient device
 * @param {array} aData Data arrangement that will be sent in the notification
 *
 * @author Leandro Curbelo
 */
export const actionSendPushNotification = (
  sHeader,
  sDescription,
  sIdPushDestination,
  aData = null
) => {
  return (dispatch) => {
    var oDataNotification = {
      headings: { en: sHeader },
      contents: { en: sDescription },
      android_group: "Request",
      ios_badgeType: "Increase",
      ios_badgeCount: 1,
      data: aData,
      include_player_ids: [sIdPushDestination],
    };
    const jsonString = JSON.stringify(oDataNotification);
    OneSignal.postNotification(
      jsonString,
      (success) => {},
      (error) => {
        console.log("Error :", error);
      }
    );
  };
};
