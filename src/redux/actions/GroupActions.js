import {
  Actions,
  Constants,
  NOTIFICATION_REQUEST_GROUP,
  NOTIFICATION_INVITATION_GROUP,
  NOTIFICATION_CAPITAN_MESSAGE_GROUP,
  MESSAGE_ERROR,
  SEND_MESSAGE_TYPES,
  NOTIFICATION_TYPE_NEW_CAPTAIN,
} from "../../Constants";
import {
  database,
  GetGroupsUser,
  GetUsersGroup,
  GetDataUser,
  GetGroupUser,
  GetDataGroup,
  GetIdPushUser,
  IsCaptain,
} from "../services/FirebaseServices";
import {
  CreateGroup,
  GetGroupsNearMe,
  AddToGroup,
  DeleteGroup,
  UpdateGroup,
  LeaveGroup,
  RemoveToGroup,
  UpdateCapitans,
} from "../../redux/services/GroupServices";
import OneSignal from "react-native-onesignal";
import moment from "moment/min/moment-with-locales";
import {
  actionDispatch,
  actionMessage,
  actionActiveLoading,
  actionDeactivateLoading,
} from "./SharedActions";
import { UploadImageGroupConversation } from "../../redux/services/ImageServices";
import {
  actionOpenGroupNotification,
  actionSendPushNotification,
} from "./NotificationActions";
import { AddNotification } from "../services/NotificationServices";
import { actionGetMyFriends } from "./ProfileActions";
import {
  NOTIFICATION_CAPTAIN,
  NOTIFICATION_GROUP_INVITATION,
  NOTIFICATION_MESSAGE_GROUP,
  NOTIFICATION_NEW_CAPTAIN_GROUP,
  NOTIFICATION_REQUEST_JOIN_GROUP,
} from "../../constants/Notifications";

/**
 * Function that takes the action of creating a group, inserts into Firebase the group into 'groups', the group into the user for its dependency, and
 * proceeds to send the data of the new group to the API for its insertion in the SQL database.
 * ! If the API returns status false or error the group will be removed from Firebase
 *
 * @param {string} sUserKey User data node identifier in Firebase
 * @param {string} sName Group name
 * @param {string | null} sDescription Group description
 * @param {array} aUsers Array of users that make up the group and if they are captains or not
 * @param {string | null} sImage Base64 encoded group profile image
 * @param {number} nType Group type, public (2) or private (1)
 * @param {number | null} nLatitude Latitude of the user at the time the group is created
 * @param {number | null} nLongitude Longitude of the user at the time the group is created
 *
 * @author Leandro Curbelo
 */
export const actionCreateGroup = (
  sUserKey,
  sName,
  sDescription,
  aUsers,
  sImage,
  nType,
  nLatitude,
  nLongitude
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    let oFirstMessage = {
        message: "Welcome to " + sName,
        sender: sUserKey,
        type: "text",
        date: Date.now(),
      },
      aUsersFirebase = [],
      aCapitans = [];
    aUsers.forEach((oUser) => {
      aUsersFirebase[oUser.key] = true;
      if (oUser.is_capitan) {
        aCapitans[oUser.key] = true;
        oUser.is_capitan = true;
      } else oUser.is_capitan = false;
    });
    let sKey = database.ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB).push({
      dateCreated: Date(),
      updated_at: Date.now(),
      description: sDescription,
      name: sName,
      type: nType,
      userCreated: sUserKey,
      users: aUsersFirebase,
      captains: aCapitans,
      captain: sUserKey,
      id: 0,
    }).key;
    CreateGroup(
      sKey,
      sName,
      sDescription,
      aUsers,
      sImage,
      nType,
      nLatitude,
      nLongitude
    )
      .then((oResponse) => {
        aUsers.forEach((oUser) => {
          database
            .ref(
              Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                oUser.key +
                "/groups/" +
                sKey
            )
            .set({ messagesRead: 1 });
        });
        database
          .ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB + sKey)
          .update({ id: oResponse.data.id, image: oResponse.data.image })
          .then(() => {
            database
              .ref(Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB)
              .push({ group: sKey })
              .then((oConversationSuccess) => {
                database
                  .ref(
                    Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB +
                      oConversationSuccess.key +
                      "/messages"
                  )
                  .push(oFirstMessage)
                  .then(() => {
                    database
                      .ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB + sKey)
                      .update({ conversation: oConversationSuccess.key })
                      .then(() => {
                        dispatch(
                          actionDispatch(Actions.CREATE_GROUP_SUCCESS, {
                            firebaseId: sKey,
                          })
                        );
                      });
                  });
              });
          });
      })
      .catch(() => {
        dispatch(actionMessage(MESSAGE_ERROR));
        dispatch(actionDispatch(Actions.CREATE_GROUP_ERROR));
        database.ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB + sKey).remove();
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};
/**
 * Function that cleans redux data
 */
export const actionCleanCreateGroup = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.CLEAN_CREATE_GROUP));
  };
};
/**
 * Function that lists the user's groups
 *
 * @param {accountKey, filter} data
 */
export const actionGetGroups = (sActualUserKey, sFilter = "") => {
  return (dispatch) => {
    GetGroupsUser(sActualUserKey)
      .then((aListGroupsSnap) => {
        if (aListGroupsSnap.exists()) {
          let aGroups = [],
            nCount = 0;
          aListGroupsSnap.forEach((oGroupNode) => {
            IsCaptain(oGroupNode.key, sActualUserKey).then((bIsCapitan) => {
              GetDataGroup(oGroupNode.key, "name").then((sSnapName) => {
                if (
                  sSnapName.exists() &&
                  ("" === sFilter ||
                    ("" !== sFilter && sSnapName.val().includes(sFilter)))
                ) {
                  GetDataGroup(oGroupNode.key, "image").then((sSnapImage) => {
                    GetDataGroup(oGroupNode.key, "dateCreated").then(
                      (sCreatedSnap) => {
                        GetDataGroup(oGroupNode.key, "id").then((nIdSnap) => {
                          GetDataGroup(oGroupNode.key, "updated_at").then(
                            (nUpdatedAtSnap) => {
                              GetDataGroup(oGroupNode.key, "usersRequest").then(
                                (aUsersRequestSnap) => {
                                  let aRequests = [];
                                  aUsersRequestSnap.forEach(
                                    (oUserRequestSnap) => {
                                      let oUserRequest = oUserRequestSnap.val();
                                      oUserRequest.key = oUserRequestSnap.key;
                                      aRequests.push(oUserRequest);
                                    }
                                  );
                                  let aNodoGroup = {
                                    key: oGroupNode.key,
                                    name: sSnapName.val(),
                                    image: sSnapImage.exists()
                                      ? sSnapImage.val()
                                      : null,
                                    dateCreated: moment(
                                      sCreatedSnap.val()
                                    ).format("MMM DD LT"),
                                    id: nIdSnap.val(),
                                    messagesRead: oGroupNode.val().messagesRead,
                                    updated_at: nUpdatedAtSnap.val(),
                                    isCapitan: bIsCapitan.exists(),
                                    usersRequest: aRequests,
                                  };
                                  aGroups.push(aNodoGroup);
                                  nCount++;
                                  if (
                                    nCount === aListGroupsSnap.numChildren()
                                  ) {
                                    aGroups.sort(function (a, b) {
                                      if (a.updated_at < b.updated_at) return 1;
                                      if (a.updated_at > b.updated_at)
                                        return -1;
                                      return 0;
                                    });
                                    dispatch(
                                      actionGetGroupsSuccess({
                                        listGroup: aGroups,
                                      })
                                    );
                                  }
                                }
                              );
                            }
                          );
                        });
                      }
                    );
                  });
                } else {
                  nCount++;
                  if (nCount === aListGroupsSnap.numChildren()) {
                    aGroups.sort(function (a, b) {
                      if (a.updated_at < b.updated_at) return 1;
                      if (a.updated_at > b.updated_at) return -1;
                      return 0;
                    });
                    dispatch(actionGetGroupsSuccess({ listGroup: aGroups }));
                  }
                }
              });
            });
          });
        } else dispatch(actionGetGroupsSuccess({ listGroup: [] }));
      })
      .catch(() => {
        dispatch(actionGetGroupsSuccess({ listGroup: [] }));
      });
  };
};

export const actionGetGroupsNearMe = (
  sFilter,
  nType,
  sDistance,
  nLatitude,
  nLongitude
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    GetGroupsNearMe(sFilter, nType, sDistance, nLatitude, nLongitude)
      .then((oSuccess) => {
        dispatch(actionGetGroupsSuccess({ listGroupNearMe: oSuccess.data }));
      })
      .catch(() => {
        dispatch(actionMessage(MESSAGE_ERROR));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};
/**
 * Function that adds a member to a group
 *
 * @param {groupKey, accountId, accountName} data
 */
export const actionJoinGroup = (
  sUserKey,
  sUserName,
  nUserId,
  sGroupKey,
  nGroupId
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    GetDataGroup(sGroupKey, "conversation").then((sConversationKey) => {
      // If the conversation exists, the group exists
      if (sConversationKey.exists())
        AddToGroup(nGroupId, nUserId)
          .then((oSuccess) => {
            database
              .ref(
                Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                  sUserKey +
                  "/" +
                  Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                  sGroupKey
              )
              .set({ messagesRead: 1 })
              .then(() => {
                database
                  .ref(
                    Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                      sGroupKey +
                      "/users/" +
                      sUserKey
                  )
                  .set(true)
                  .then(() => {
                    let oDataDispatch = {
                      accountId: sUserKey,
                      groupId: sGroupKey,
                      type: "text",
                      sender: sUserKey,
                      message: sUserName + " joined the group",
                    };
                    dispatch(actionSendMessageGroup(oDataDispatch));
                    dispatch(
                      actionDispatch(Actions.JOIN_GROUP_SUCCESS, {
                        firebaseId: sGroupKey,
                      })
                    );
                    dispatch(actionDeactivateLoading());
                  });
              });
          })
          .catch(() => {
            dispatch(actionMessage(MESSAGE_ERROR));
          });
      else dispatch(actionMessage(MESSAGE_ERROR));
    });
  };
};
/**
 * Function to perform the exit of a user from a group
 *
 * @param {accountId, groupKey} data
 */
export const actionLeaveGroup = (sUserKey, sGroupKey, nGroupId) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    database
      .ref(
        Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
          sUserKey +
          "/" +
          Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
          sGroupKey
      )
      .remove()
      .then(() => {
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
              sGroupKey +
              "/users/" +
              sUserKey
          )
          .remove()
          .then(() => {
            LeaveGroup(nGroupId)
              .then(() => {})
              .catch(() => {})
              .finally(() => {
                database
                  .ref(
                    Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                      sGroupKey +
                      "/users"
                  )
                  .limitToFirst(1)
                  .once("value")
                  .then((aListUsers) => {
                    GetDataGroup(sGroupKey, "conversation").then(
                      (sConversationKey) => {
                        if (aListUsers.exists()) {
                          aListUsers.forEach((oFirstUser) => {
                            database
                              .ref(
                                Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                                  sGroupKey +
                                  "/captains/" +
                                  sUserKey
                              )
                              .remove()
                              .then(() => {
                                GetDataGroup(sGroupKey, "captains").then(
                                  (aListCapitans) => {
                                    GetDataUser(sUserKey, "name").then(
                                      (sNameUserLeave) => {
                                        if (sNameUserLeave.exists()) {
                                          let oMessageLeave = {
                                            sender: sUserKey,
                                            message:
                                              sNameUserLeave.val() +
                                              " has left the group",
                                            date: Date.now(),
                                            type: "text",
                                          };
                                          database
                                            .ref(
                                              Constants.FIREBASE_CONFIG
                                                .NODE_CONVERSATIONS_GROUPS_DB +
                                                sConversationKey.val() +
                                                "/messages"
                                            )
                                            .push(oMessageLeave);
                                        }
                                      }
                                    );
                                    if (!aListCapitans.exists()) {
                                      GetDataUser(oFirstUser.key, "name").then(
                                        (sNameUserNewCapitan) => {
                                          if (sNameUserNewCapitan.exists()) {
                                            let oMessageNewCapitan = {
                                              sender: sUserKey,
                                              message:
                                                sNameUserNewCapitan.val() +
                                                " is the new captain",
                                              date: Date.now(),
                                              type: "text",
                                            };
                                            database
                                              .ref(
                                                Constants.FIREBASE_CONFIG
                                                  .NODE_CONVERSATIONS_GROUPS_DB +
                                                  sConversationKey.val() +
                                                  "/messages"
                                              )
                                              .push(oMessageNewCapitan);
                                          }
                                          database
                                            .ref(
                                              Constants.FIREBASE_CONFIG
                                                .NODE_GROUPS_DB +
                                                sGroupKey +
                                                "/captains/" +
                                                oFirstUser.key
                                            )
                                            .set(true);
                                        }
                                      );
                                    }
                                    dispatch(actionDeleteGroupSuccess());
                                    dispatch(actionGetGroups(sUserKey));
                                  }
                                );
                              });
                          });
                        } else {
                          GetDataGroup(sGroupKey, "id").then(
                            (nIdFitrecGroup) => {
                              DeleteGroup(nIdFitrecGroup.val())
                                .then(() => {
                                  database
                                    .ref(
                                      Constants.FIREBASE_CONFIG
                                        .NODE_CONVERSATIONS_GROUPS_DB +
                                        sConversationKey.val()
                                    )
                                    .remove()
                                    .then(() => {
                                      database
                                        .ref(
                                          Constants.FIREBASE_CONFIG
                                            .NODE_GROUPS_DB + sGroupKey
                                        )
                                        .remove();
                                      dispatch(actionDeleteGroupSuccess());
                                      dispatch(actionGetGroups(sUserKey));
                                    });
                                })
                                .catch(() => {
                                  dispatch(actionGetGroups(sUserKey));
                                });
                            }
                          );
                        }
                      }
                    );
                  });
              });
          });
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};
/**
 * Function that sends a request to enter the group to all the captains of the same.
 *
 * @param {string} sGroupKey Group identifier in Firebase
 * @param {string} sUserKey User identifier in Firebase
 * @param {number} nUserId User identifier in systemn
 * @param {string} sUserImage User image url
 * @param {string} sUserName Name of the user who wants to join the group
 * @param {string} sUserUsername Username of the user who wants to join the group
 * @param {number} nGroupId Group identifier in the system
 *
 * @author Leandro Curbelo
 */
export const actionRequestJoinGroup = (
  sGroupKey,
  nGroupId,
  sGroupName,
  sUserKey,
  nUserId,
  sUserImage,
  sUserName,
  sUserUsername
) => {
  return (dispatch) => {
    database
      .ref(
        Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
          sGroupKey +
          "/users/" +
          sUserKey
      )
      .once("value")
      .then((bIsUser) => {
        if (!bIsUser.exists()) {
          database
            .ref(
              Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                sGroupKey +
                "/usersRequest/" +
                sUserKey
            )
            .once("value")
            .then((bIsAlreadyRequest) => {
              if (!bIsAlreadyRequest.exists()) {
                let oRequest = {
                  image: sUserImage !== undefined ? sUserImage : null,
                  name: sUserName,
                  username: sUserUsername,
                  id: nUserId,
                };
                database
                  .ref(
                    Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                      sGroupKey +
                      "/usersRequest/" +
                      sUserKey
                  )
                  .set(oRequest)
                  .then((bIsAlreadyRequest) => {
                    GetDataGroup(sGroupKey, "name").then((sNameGroup) => {
                      GetDataGroup(sGroupKey, "captains").then(
                        (aListCapitans) => {
                          aListCapitans.forEach((sCapitanKey) => {
                            GetDataUser(sCapitanKey.key, "id").then(
                              (nCapitanId) => {
                                AddNotification(
                                  nCapitanId.val(),
                                  "Request sent join group: " + sGroupName,
                                  NOTIFICATION_REQUEST_GROUP,
                                  nGroupId
                                )
                                  .then((oSuccessRequest) => {
                                    GetIdPushUser(sCapitanKey.key).then(
                                      (sIdPush) => {
                                        if (sIdPush.exists()) {
                                          let oDataNotification = {
                                            headings: { en: sUserName },
                                            contents: {
                                              en:
                                                "Request in the group " +
                                                sNameGroup.val(),
                                            },
                                            android_group: "Request",
                                            ios_badgeType: "Increase",
                                            ios_badgeCount: 1,
                                            data: {
                                              type: NOTIFICATION_REQUEST_JOIN_GROUP,
                                              id: sGroupKey,
                                            },
                                            include_player_ids: [sIdPush.val()],
                                          };
                                          OneSignal.postNotification(
                                            {
                                              en:
                                                "Request in the group " +
                                                sNameGroup.val(),
                                            },
                                            {},
                                            [sIdPush.val()],
                                            oDataNotification
                                          );
                                        }
                                      }
                                    );
                                  })
                                  .catch((oError) => {
                                    dispatch(
                                      actionRequestJoinGroupResult({
                                        messageError:
                                          "Your request has been sent",
                                      })
                                    );
                                  });
                              }
                            );
                          });
                        }
                      );
                      dispatch(
                        actionRequestJoinGroupResult({
                          messageError:
                            "You have sent a notification to the captains of the group",
                        })
                      );
                    });
                  });
              } else
                dispatch(
                  actionRequestJoinGroupResult({
                    messageError: "You have already sent an entry request",
                  })
                );
            });
        } else
          dispatch(
            actionRequestJoinGroupResult({
              messageError: "You are already a member of the group",
            })
          );
      });
  };
};
/**
 * Function that adds a new member to the group
 *
 * @param {groupName, groupKey, groupImage, accountIdFitrec, members} data
 */
export const actionAddMember = (
  nGroupId,
  sGroupKey,
  sGroupName,
  sGroupImage,
  aMembers,
  sUserKey = null
) => {
  return (dispatch) => {
    let sDescription = "You have an invite for a group: " + sGroupName,
      nCountMembers = 0,
      sMessage = "The invitations have been sent",
      oInvitation = {
        pic: sGroupImage,
        name: sGroupName,
        description: sDescription,
        isCapitan: 0,
      };
    if (aMembers.length === 1) sMessage = "The invitation has been send";
    aMembers.forEach((oMember) => {
      GetDataUser(oMember.key, "id").then((nIdFitrec) => {
        if (nIdFitrec.exists()) {
          oInvitation.userReceived = nIdFitrec.val();
          AddNotification(
            nIdFitrec.val(),
            sDescription,
            NOTIFICATION_INVITATION_GROUP,
            nGroupId
          )
            .then((oNotificationSuccess) => {
              nCountMembers++;
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                    oMember.key +
                    "/groupsInvitations/" +
                    sGroupKey
                )
                .set(oInvitation)
                .then(() => {
                  GetIdPushUser(oMember.key).then((sPushId) => {
                    if (sPushId.exists()) {
                      let oDataNotification = {
                        headings: { en: "Group invitation" },
                        contents: { en: sDescription },
                        android_group: "0",
                        ios_badgeType: "Increase",
                        ios_badgeCount: 1,
                        data: { type: NOTIFICATION_GROUP_INVITATION },
                        include_player_ids: [sPushId.val()],
                      };
                      OneSignal.postNotification(
                        {
                          en:
                            "Group invitation: You have an invite for a group: " +
                            sGroupName,
                        },
                        {},
                        [sPushId.val()],
                        oDataNotification
                      );
                    }
                    if (aMembers.length === nCountMembers) {
                      if (sUserKey) dispatch(actionGetMyFriends(sUserKey));
                      dispatch(actionMessage(sMessage));
                    }
                  });
                });
            })
            .catch(() => {
              nCountMembers++;
              if (aMembers.length === nCountMembers)
                dispatch(actionMessage(sMessage));
            });
        }
      });
    });
  };
};
/**
 * Function that receives a user and a list of groups, for each group a request will be added to the user.
 *
 * @param {Object} data
 *
 * @return void
 */
export const actionAddMemberAllGroups = (data) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    data.groups.forEach((oGroup) => {
      let sDescription = "You have an invite for a group: " + oGroup.name;
      let oInvitation = {
        pic: oGroup.image,
        name: oGroup.name,
        description: sDescription,
        isCapitan: 0,
        userReceived: data.member.id,
      };
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
            data.member.key +
            "/groupsInvitations/" +
            oGroup.key
        )
        .set(oInvitation);
      AddNotification(
        data.member.id,
        sDescription,
        NOTIFICATION_INVITATION_GROUP,
        oGroup.id
      )
        .then(() => {})
        .catch(() => {});
    });
    let sHeader = "Groups invitations",
      sContent =
        data.sender.name +
        " has invited you to be part of " +
        data.groups.length +
        " groups",
      sMessageReturn = "The invitations were sent correctly";
    if (data.groups.length === 1) {
      sHeader = "Group invitation";
      sContent = "You have an invite for a group: " + data.groups[0].name;
      sMessageReturn = "The invitation were sent correctly";
    }
    GetDataUser(data.member.key, "idPush")
      .then((sPushId) => {
        if (sPushId.exists()) {
          let oDataNotification = {
            headings: { en: sHeader },
            contents: { en: sContent },
            android_group: "0",
            ios_badgeType: "Increase",
            ios_badgeCount: 1,
            data: { type: NOTIFICATION_GROUP_INVITATION },
            include_player_ids: [sPushId.val()],
          };
          OneSignal.postNotification(
            { en: sHeader + sContent },
            {},
            [sPushId.val()],
            oDataNotification
          );
        }
      })
      .finally(() => {
        dispatch(actionMessage(sMessageReturn));
      });
    dispatch(actionGetGroupInvitationsPals(data.member.key));
  };
};
/**
 * Function that takes the invitations to groups and the groups of a friend account
 * @param {accountId} data
 */
export const actionGetGroupInvitationsPals = (sUserKey) => {
  return (dispatch) => {
    let aInvitations = [],
      aGroups = [];
    GetDataUser(sUserKey, "groupsInvitations").then((aListInvitations) => {
      aListInvitations.exists() &&
        aListInvitations.forEach((oInvitationSnap) => {
          let oInvitation = oInvitationSnap.val();
          oInvitation.id = oInvitationSnap.key;
          aInvitations.push(oInvitation);
        });
      GetDataUser(sUserKey, "groups").then((aListGroups) => {
        aListGroups.exists() &&
          aListGroups.forEach((oGroupSnap) => {
            let oGroup = oGroupSnap.val();
            oGroup.group = oGroupSnap.key;
            aGroups.push(oGroup);
          });
        dispatch(
          actionDispatch(Actions.GET_GROUP_INVITATIONS_PALS_SUCCESS, {
            groupInvitationsPals: aInvitations,
            groupsPals: aGroups,
          })
        );
      });
    });
  };
};

export const setEmptyMessage = (data) => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.ADD_MEMBERS_GROUP, { message: "" }));
  };
};
/**
 * Function that rejects an invitation to a group
 *
 * @param {accountId, groupId} data
 */
export const actionRejectInvitationGroup = (
  data,
  bIsListNotification = false
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    database
      .ref(
        Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
          data.accountId +
          "/groupsInvitations/" +
          data.groupId
      )
      .remove()
      .then(() => {
        dispatch(actionGetGroupInvitations(data));
        dispatch(actionRejectInvitationGroupSuccess(data));
        if (bIsListNotification)
          dispatch(actionOpenGroupNotification(data.groupId, data.accountId));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};
/**
 * Function that accepts an invitation from a group and sends a message
 *
 * @param {accountId, groupId, accountName} data
 */
export const actionAcceptInvitationGroup = (
  nGroupId,
  sGroupKey,
  nUserId,
  sUserKey,
  sUserName,
  bIsListNotification = false
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    AddToGroup(nGroupId, nUserId)
      .then((oSuccessApi) => {
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
              sUserKey +
              "/groupsInvitations/" +
              sGroupKey
          )
          .once("value", (oInvitationSnap) => {
            if (oInvitationSnap.exists()) {
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                    sUserKey +
                    "/groupsInvitations/" +
                    sGroupKey
                )
                .remove()
                .then(() => {
                  database
                    .ref(
                      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                        sUserKey +
                        "/groups/" +
                        sGroupKey
                    )
                    .set({ messagesRead: 1 })
                    .then(() => {
                      database
                        .ref(
                          Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                            sGroupKey +
                            "/users/" +
                            sUserKey
                        )
                        .set(true)
                        .then(() => {
                          dispatch(
                            actionDispatch(
                              Actions.ACCEPT_INVITATION_GROUP_SUCCESS,
                              { groupId: sGroupKey }
                            )
                          );
                          dispatch(
                            actionGetGroupInvitations({ accountId: sUserKey })
                          );
                          dispatch(
                            actionSendMessageGroup({
                              accountId: sUserKey,
                              groupId: sGroupKey,
                              type: "text",
                              sender: sUserKey,
                              message: sUserName + " joined the group",
                            })
                          );
                          if (bIsListNotification)
                            dispatch(
                              actionOpenGroupNotification(sGroupKey, sUserKey)
                            );
                        });
                    });
                });
            } else
              dispatch(
                actionMessage(
                  "Apparently this request has already been accepted or rejected, please refresh your notification list."
                )
              );
          });
      })
      .catch((oError) => {
        dispatch(actionMessage(MESSAGE_ERROR));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};
/**
 * Function that rejects a request from a user to a group
 * @param {groupId, userId} data
 */
export const actionRejectRequest = (data) => {
  return (dispatch) => {
    database
      .ref(
        Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
          data.groupId +
          "/usersRequest/" +
          data.userId
      )
      .remove()
      .then(() => {
        dispatch(actionMessage("Request Denied"));
        dispatch(actionGetGroups(data.accountId));
      });
  };
};
/**
 * Function that accepts a request sent by a user to a group
 *
 * @param {accountId, groupId, memberId, memberName, } data
 */
export const actionAcceptRequest = (
  sGroupKey,
  sCapitanKey,
  sUserKey,
  sUserName
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    database
      .ref(
        Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
          sGroupKey +
          "/usersRequest/" +
          sUserKey
      )
      .remove()
      .then(() => {
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
              sGroupKey +
              "/users/" +
              sUserKey
          )
          .set(true)
          .then(() => {
            database
              .ref(
                Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                  sUserKey +
                  "/groups/" +
                  sGroupKey
              )
              .set({ messagesRead: 1 })
              .then(() => {
                dispatch(
                  actionSendMessageGroup({
                    accountId: sCapitanKey,
                    groupId: sGroupKey,
                    type: "text",
                    sender: sCapitanKey,
                    message: `Hi, I accepted ` + sUserName + `'s request`,
                  })
                );
                dispatch(actionMessage("Request accepted"));
                dispatch(actionGetGroups(sCapitanKey));
                dispatch(actionDeactivateLoading());
              });
          });
      });
  };
};
/*
 * Function that receives an array of users and sends a notification for each one
 *
 * @param {
 *          userSend: Captain's key that sends the notification,
 *          idGroupJoin: Group from which you send the notification,
 *          description: Description of the notification,
 *          groupName: Group name,
 *          username: Captain's name,
 *          [userReceived]: Array of users
 * } data
 */
export const actionSendNotificationCapitan = (data) => {
  return (dispatch) => {
    let nCount = 0,
      nLengthUsers = data.userReceived.length;
    if (nLengthUsers > 0)
      for (let lElement of data.userReceived) {
        AddNotification(
          lElement.id,
          data.description,
          NOTIFICATION_CAPITAN_MESSAGE_GROUP,
          data.idGroupJoin
        )
          .then((oSuccess) => {
            GetIdPushUser(lElement.key).then((sIdPush) => {
              if (sIdPush.exists()) {
                let oDataNotification = {
                  headings: { en: "Group notification" },
                  contents: { en: data.description },
                  android_group: "Request",
                  ios_badgeType: "Increase",
                  ios_badgeCount: 1,
                  data: {
                    type: NOTIFICATION_CAPTAIN,
                    id: oSuccess.data.id,
                    text: data.description,
                    name: data.groupName,
                    capitanName: data.username,
                  },
                  include_player_ids: [sIdPush.val()],
                };
                OneSignal.postNotification(
                  { en: data.description },
                  {},
                  [sIdPush.val()],
                  oDataNotification
                );
              }
            });
          })
          .catch(() => {
            dispatch(
              actionDispatch(Actions.SEND_NOTIFICATION_CAPITAN_ERROR, {
                messageError: "",
              })
            );
            dispatch(actionMessage(MESSAGE_ERROR));
          })
          .finally(() => {
            nCount++;
            if (nCount === nLengthUsers) {
              dispatch(
                actionDispatch(Actions.SEND_NOTIFICATION_CAPITAN_SUCCESS)
              );
              dispatch(actionMessage("Notification sent successfully"));
            }
          });
      }
    else {
      dispatch(actionDispatch(Actions.SEND_NOTIFICATION_CAPITAN_SUCCESS));
      dispatch(
        actionMessage("There are no other users to send the notification to")
      );
    }
  };
};
/*
 *  Function that sends a message to a group
 *
 * @param {
 *          accountId: string,
 *          groupId: string,
 *          type: string,
 *          sender: string,
 *          message: string/{sender, message, date, type},
 *          lat: string/null,
 *          lon: string/null,
 * } data
 */
export const actionSendMessageGroup = (data) => {
  return (dispatch) => {
    let sNotificationMessage = "",
      nNow = Date.now(),
      oMessage = {
        sender: data.sender,
        message: data.message,
        date: nNow,
        type: data.type,
      };
    switch (data.type) {
      case SEND_MESSAGE_TYPES.TEXT:
        sNotificationMessage = oMessage.message;
        break;
      case "url":
        oMessage = {
          sender: data.sender,
          message: data.message,
          date: nNow,
          type: "url",
        };
        sNotificationMessage = oMessage.message;
        break;
      case SEND_MESSAGE_TYPES.GIF:
        oMessage.height = data.height;
        oMessage.width = data.width;
        oMessage.giphyId = data.giphyId;
        oMessage.isSticker = data.isSticker;
        sNotificationMessage = `They sent an ${
          !oMessage.isSticker ? "gif" : "sticker"
        }`;
        break;
      case SEND_MESSAGE_TYPES.IMAGE:
        sNotificationMessage = "They sent an image";
        break;
      case SEND_MESSAGE_TYPES.LOCATION:
        oMessage.lat = data.lat;
        oMessage.lon = data.lon;
        sNotificationMessage = "They sent an location";
        break;
    }
    GetDataGroup(data.groupId, "conversation")
      .then((sConversationKey) => {
        if (data.type === "image") {
          dispatch(actionActiveLoading());
          UploadImageGroupConversation(data.groupId, oMessage.message)
            .then((oSuccess) => {
              oMessage.message = oSuccess.data;
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB +
                    sConversationKey.val() +
                    "/messages"
                )
                .push(oMessage)
                .then(() => {
                  dispatch(
                    sendMessageUsersChat(
                      data.groupId,
                      oMessage.sender,
                      sNotificationMessage
                    )
                  );
                  database
                    .ref(
                      Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB +
                        data.groupId +
                        "/updated_at"
                    )
                    .set(Date.now())
                    .then(() => {});
                });
              dispatch(actionDeactivateLoading());
            })
            .catch(() => {
              dispatch(actionDeactivateLoading());
              dispatch(actionMessage(MESSAGE_ERROR));
            });
        } else
          database
            .ref(
              Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB +
                sConversationKey.val() +
                "/messages"
            )
            .push(oMessage)
            .then(() => {
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                    data.groupId +
                    "/updated_at"
                )
                .set(Date.now())
                .then(() => {});
              dispatch(
                sendMessageUsersChat(
                  data.groupId,
                  oMessage.sender,
                  sNotificationMessage
                )
              );
              dispatch(actionDeactivateLoading());
            });
      })
      .catch(() => {
        dispatch(actionMessage(MESSAGE_ERROR));
      });
  };
};
/**
 * Common function to send notification to users of a chat
 *
 * @param {string} sGroupKey Group key
 * @param {string} sAccountKey Account key
 */
const sendMessageUsersChat = (sGroupKey, sAccountKey, sNotificationMessage) => {
  return (dispatch) => {
    GetUsersGroup(sGroupKey).then((aListUsers) => {
      aListUsers.forEach((sUserKey) => {
        if (sUserKey.key !== sAccountKey) {
          GetGroupUser(sUserKey.key, sGroupKey).then((oGroupUser) => {
            if (oGroupUser.exists())
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                    sUserKey.key +
                    "/groups/" +
                    sGroupKey
                )
                .update({ messagesRead: oGroupUser.val().messagesRead + 1 });
            else
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                    sUserKey.key +
                    "/groups/" +
                    sGroupKey
                )
                .set({ messagesRead: 1 });
            GetDataUser(sUserKey.key, "idPush").then((sIdPush) => {
              if (sIdPush.exists()) {
                let oDataNotification = {
                  headings: { en: "Group message" },
                  contents: { en: sNotificationMessage },
                  android_group: "0",
                  ios_badgeType: "Increase",
                  ios_badgeCount: 1,
                  data: { type: NOTIFICATION_MESSAGE_GROUP, id: sGroupKey },
                  include_player_ids: [sIdPush.val()],
                };
                OneSignal.postNotification(
                  { en: "Group message: " + sNotificationMessage },
                  {},
                  [sIdPush.val()],
                  oDataNotification
                );
              }
            });
          });
        }
      });
      dispatch(actionDispatch(Actions.SEND_MESSAGE_GROUP_SUCCESS));
      dispatch(actionGetGroups(sAccountKey));
    });
  };
};
/**
 * Funcion que quita los mensajes no leidos del grupo
 *
 * @param {accountId, groupId} data
 */
export const actionCheckReadMessageGroup = (data) => {
  return (dispatch) => {
    database
      .ref(
        Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
          data.accountId +
          "/groups/" +
          data.groupId
      )
      .update({ messagesRead: 0 })
      .then(() => {
        dispatch(actionGetGroups(data.accountId));
      });
  };
};
/**
 * Function that takes pending group join invitations from the user
 *
 * @param {accountId} data
 */
export const actionGetGroupInvitations = (data) => {
  return (dispatch) => {
    let nCount = 0,
      aInvitationsDispatch = [];
    GetDataUser(data.accountId, "groupsInvitations")
      .then((aInvitations) => {
        if (aInvitations.exists())
          aInvitations.forEach((oInvitation) => {
            GetDataGroup(oInvitation.key, "name").then((sName) => {
              nCount++;
              if (sName.exists()) {
                GetDataGroup(oInvitation.key, "description").then(
                  (sDescription) => {
                    GetDataGroup(oInvitation.key, "image").then((sImage) => {
                      GetDataGroup(oInvitation.key, "id").then((nIdFitrec) => {
                        let oInvitationNode = {
                          group: {
                            name: sName.val(),
                            description: sDescription.val(),
                            image: sImage.val(),
                            id: nIdFitrec.val(),
                          },
                          id: oInvitation.key,
                        };
                        aInvitationsDispatch.push(oInvitationNode);
                        if (nCount === aInvitations.numChildren())
                          dispatch(
                            actionDispatch(
                              Actions.GET_GROUP_INVITATIONS_SUCCESS,
                              { groupInvitations: aInvitationsDispatch }
                            )
                          );
                      });
                    });
                  }
                );
              } else {
                // La unica forma de que no exista el Group name es que haya sido eliminado por lo que se remueve la invitacion
                database
                  .ref(
                    Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                      "groupsInvitations" +
                      oInvitation.key
                  )
                  .remove();
                if (nCount === aInvitations.numChildren())
                  dispatch(
                    actionDispatch(Actions.GET_GROUP_INVITATIONS_SUCCESS, {
                      groupInvitations: aInvitationsDispatch,
                    })
                  );
              }
            });
          });
        else
          dispatch(
            actionDispatch(Actions.GET_GROUP_INVITATIONS_SUCCESS, {
              groupInvitations: aInvitationsDispatch,
            })
          );
      })
      .catch(() => {
        dispatch(
          actionDispatch(Actions.GET_GROUP_INVITATIONS_SUCCESS, {
            groupInvitations: aInvitationsDispatch,
          })
        );
      });
  };
};
/**
 * Function that performs an update of the data of a group
 *
 * @param {string} sGroupKey Group identifier in Firebase
 * @param {string} sName Group name
 * @param {string} sDescription Group description
 * @param {string} sImage Base64 encoded group image
 *
 * @author Leandro Curbelo
 */
export const actionUpdateGroup = (sGroupKey, sName, sDescription, sImage) => {
  return (dispatch) => {
    GetDataGroup(sGroupKey, "id").then((nIdFitrec) => {
      dispatch(actionActiveLoading());
      let nGroupId = nIdFitrec.val();
      UpdateGroup(nGroupId, sName, sDescription, sImage)
        .then((oSuccess) => {
          let oUpdate = {};
          if (null !== sName) oUpdate.name = sName;
          if (null !== sDescription) oUpdate.description = sDescription;
          if (null !== sImage) oUpdate.image = oSuccess.url;
          database
            .ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB + sGroupKey)
            .update(oUpdate)
            .then(() => {})
            .catch(() => {
              dispatch(actionMessage(MESSAGE_ERROR));
            });
        })
        .catch(() => {
          dispatch(actionMessage(MESSAGE_ERROR));
        })
        .finally(() => {
          dispatch(actionDeactivateLoading());
        });
    });
  };
};
/**
 * Function that edits the captains of the group, receives the identifiers of the group and the new captains.
 *
 * @param {string} sGroupKey Group identifier en Firebase
 * @param {number} nGroupId Group identifier in the system
 * @param {array} aCapitans Array for new group captain users
 * @param {array} aLastCaptains Array of group captains before the change
 * @param {object} oNotification Object with the necessary data to send the push notification
 *
 * @author Leandro Curbelo
 */
export const actionUpdateCapitans = (
  sGroupKey,
  nGroupId,
  aCapitans,
  aLastCaptains = null,
  oNotification = null
) => {
  return (dispatch) => {
    UpdateCapitans(nGroupId, aCapitans)
      .then(() => {
        database
          .ref(
            `${Constants.FIREBASE_CONFIG.NODE_GROUPS_DB}${sGroupKey}/captains`
          )
          .remove()
          .then(() => {
            aCapitans.forEach((oCaptain) => {
              if (aLastCaptains && oNotification) {
                let oLastCaptain = aLastCaptains.filter(
                  (oParticipant) => oParticipant.key === oCaptain.key
                );
                if (oLastCaptain.length === 0) {
                  let sDescription = `${oNotification.sUserName} has assigned you as the new captain of the group ${oNotification.sGroupName}`;
                  AddNotification(
                    oCaptain.id,
                    sDescription,
                    NOTIFICATION_TYPE_NEW_CAPTAIN,
                    nGroupId
                  ).finally(() => {
                    dispatch(
                      actionSendPushNotification(
                        oNotification.sGroupName,
                        sDescription,
                        oCaptain.pushId,
                        { type: NOTIFICATION_NEW_CAPTAIN_GROUP, id: sGroupKey }
                      )
                    );
                  });
                }
              }
              database
                .ref(
                  `${Constants.FIREBASE_CONFIG.NODE_GROUPS_DB}${sGroupKey}/captains/${oCaptain.key}`
                )
                .set(true);
            });
            setTimeout(() => {
              database
                .ref(
                  `${Constants.FIREBASE_CONFIG.NODE_GROUPS_DB}${sGroupKey}/updated_at`
                )
                .set(Date.now());
            }, 150);
          });
      })
      .catch(() => {
        dispatch(actionMessage(MESSAGE_ERROR));
      });
  };
};
/**
 *
 * @param {number} nGroupId Group identifier in the system
 * @param {string} sGroupKey Group identifier en Firebase
 * @param {string} sUserName Name of the user who performs the action, used to send message in the group
 * @param {string} sUserKey User identifier that performs the action, used to send a message to the group
 * @param {array} aMembersToRemove Array of users that you want to delete, they must contain {key, id}
 *
 * @author Leandro Curbelo
 */
export const actionRemoveMembers = (
  nGroupId,
  sGroupKey,
  sUserName,
  sUserKey,
  aMembersToRemove
) => {
  return (dispatch) => {
    GetDataGroup(sGroupKey, "conversation").then((sConversationKey) => {
      if (sConversationKey.exists()) {
        aMembersToRemove.forEach((oMemberRemove) => {
          RemoveToGroup(nGroupId, oMemberRemove.id)
            .then(() => {})
            .catch((oError) => {})
            .finally(() => {
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                    sGroupKey +
                    "/users/" +
                    oMemberRemove.key
                )
                .remove();
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                    oMemberRemove.key +
                    "/" +
                    Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
                    sGroupKey
                )
                .remove();
              GetDataUser(oMemberRemove.key, "name").then((sName) => {
                if (sName.exists()) {
                  let oMessage = {
                    message:
                      sUserName +
                      " has remove to " +
                      sName.val() +
                      " this group.",
                    sender: sUserKey,
                    type: "text",
                    date: Date.now(),
                  };
                  database
                    .ref(
                      Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB +
                        sConversationKey.val() +
                        "/messages"
                    )
                    .push(oMessage);
                }
              });
            });
        });
      }
    });
  };
};
/**
 * @param {*} data
 */
export const actionResetCreateGroup = () => ({
  type: Actions.RESET_ACTION_STATE,
});

/**
 * @param {*} data
 */
export const actionGetGroupsSuccess = (data) => ({
  type: Actions.GET_GROUPS,
  data: data,
});

/**
 * @param {*} data
 */
export const actionGetGroupsNearMeSuccess = (data) => ({
  type: Actions.GET_GROUPS,
  data: data,
});

/**
 * @param {*} data
 */
export const actionCreateGroupSuccess = (data) => ({
  type: Actions.CREATE_GROUP_SUCCESS,
  data: data,
});

/**
 * @param {*} data
 */
export const actionCreateGroupError = (data) => ({
  type: Actions.CREATE_GROUP_ERROR,
  data: data,
});

/**
 * @param {*} data
 */
export const actionRequestJoinGroupResult = (data) => ({
  type: Actions.REQUEST_JOIN_GROUP,
  data: data,
});

export const actionOpenGroup = (data) => ({
  type: Actions.OPEN_GROUP_NOTIFICATION,
  data: data,
});

export const actionResetOpenGroup = () => ({
  type: Actions.RESET_OPEN_GROUP,
});

export const actionRejectInvitationGroupSuccess = (data) => ({
  type: Actions.REJECT_INVITATION_GROUP_SUCCESS,
  data: data,
});

export const actionResetUpdateGroup = () => ({
  type: Actions.RESET_UPDATE_GROUP,
});
/**
 * Function that takes a group and inserts it in the properties to be able to see its data in the GroupDetails screen,
 * this function creates a listener that will be listening for any changes made to the group node, thus doing
 * an auto-refresh on that page.
 *
 * @param {string} sGroupKey Group node identifier
 *
 * @author Leandro Curbelo
 */
export const actionGetGroup = (sGroupKey = null, sUserLoginKey = null) => {
  return (dispatch) => {
    let oListener = null;
    // If the group key is null it means that you want to clean the reducer group data
    if (null === sGroupKey) {
      dispatch(
        actionDispatch(Actions.GET_GROUP_DETAILS, {
          data: null,
          listener: oListener,
          deleted: false,
        })
      );
      return;
    }
    // Get the parent node of the Firebase pool
    oListener = database.ref(
      `${Constants.FIREBASE_CONFIG.NODE_GROUPS_DB}${sGroupKey}`
    );
    dispatch(actionActiveLoading());
    oListener.on("value", (oGroupSnap) => {
      if (oGroupSnap.exists()) {
        GetDataGroup(sGroupKey, "usersRequest").then((oRequestsSnap) => {
          let aRequests = [];
          oRequestsSnap.forEach((oRequest) => {
            aRequests.push(oRequest.key);
          });
          /**
           * - oNodeGroup as a readable object of the group, object that will be returned to the view
           * - aParticipants array that will contain all participants
           * - aUsersKey array that will contain all the identifiers of its participants
           */
          let oGroup = oGroupSnap.val(),
            oNodoGroup = {
              id: oGroup.id,
              key: sGroupKey,
              name: oGroup.name,
              description: oGroup.description,
              image: oGroup.image !== undefined ? oGroup.image : null,
              type: oGroup.type,
              userCreated: oGroup.userCreated,
              captain: oGroup.captain,
              conversation: oGroup.conversation,
              dateCreated: moment(oGroup.dateCreated).format("MMM DD LT"),
              requests: aRequests,
            },
            aParticipants = [],
            aUsersKey = [];
          // group members are taken
          GetUsersGroup(sGroupKey).then((aListUsers) => {
            let nCountUsers = 0;
            if (aListUsers.exists())
              // It iterates over the members and fills each one with its data
              aListUsers.forEach((sUserKey) => {
                aUsersKey.push(sUserKey.key);
                GetDataUser(sUserKey.key, "name").then((sNameUser) => {
                  GetDataUser(sUserKey.key, "username").then(
                    (sUserNameUser) => {
                      GetDataUser(sUserKey.key, "image").then(
                        (sProfilePicUser) => {
                          GetDataUser(sUserKey.key, "fitnesLevel").then(
                            (sFitnessLevelUser) => {
                              GetDataUser(sUserKey.key, "email").then(
                                (sEmailUser) => {
                                  GetDataUser(sUserKey.key, "id").then(
                                    (oIdFitrecSnap) => {
                                      GetIdPushUser(sUserKey.key).then(
                                        (sPushId) => {
                                          let oUser = {
                                            id: oIdFitrecSnap.val(),
                                            key: sUserKey.key,
                                            name: sNameUser.val(),
                                            username: sUserNameUser.val(),
                                            image: sProfilePicUser.val(),
                                            fitnesLevel:
                                              sFitnessLevelUser.val(),
                                            email: sEmailUser.val(),
                                            isCaptain: false,
                                            pushId: sPushId.val(),
                                          };
                                          if (
                                            undefined !== oGroup.captains &&
                                            oGroup.captains[sUserKey.key] ===
                                              true
                                          )
                                            oUser.isCaptain = true;
                                          aParticipants.push(oUser);
                                          nCountUsers++;
                                          // Verify that the data of all users has been taken
                                          if (
                                            nCountUsers ===
                                            aListUsers.numChildren()
                                          ) {
                                            oNodoGroup.participants =
                                              aParticipants;
                                            oNodoGroup.users = aUsersKey;
                                            database
                                              .ref(
                                                `${Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB}${sUserLoginKey}/groups/${sGroupKey}`
                                              )
                                              .once("value")
                                              .then((oGroupMessagesSnap) => {
                                                let nMessagesRead = 0;
                                                if (oGroupMessagesSnap.exists())
                                                  nMessagesRead =
                                                    oGroupMessagesSnap.val()
                                                      .messagesRead;
                                                oNodoGroup.messagesRead =
                                                  nMessagesRead;
                                                // Returns the data of the group and the listener to unsubscribe later
                                                dispatch(
                                                  actionDispatch(
                                                    Actions.GET_GROUP_DETAILS,
                                                    {
                                                      data: oNodoGroup,
                                                      listener: oListener,
                                                      deleted: false,
                                                    }
                                                  )
                                                );
                                                dispatch(
                                                  actionDeactivateLoading()
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
                });
              });
            else {
              if (null !== oGroup.id)
                DeleteGroup(oGroup.id).finally(() => {
                  database
                    .ref(
                      Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB +
                        oGroup.conversation
                    )
                    .remove();
                  database
                    .ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB + sGroupKey)
                    .remove();
                  dispatch(actionDeactivateLoading());
                  dispatch(actionMessage("The group was eliminated"));
                  dispatch(
                    actionDispatch(Actions.GET_GROUP_DETAILS, {
                      data: null,
                      listener: oListener,
                      deleted: false,
                    })
                  );
                });
            }
          });
        });
      } else {
        dispatch(
          actionDispatch(Actions.GET_GROUP_DETAILS, {
            data: null,
            listener: null,
            deleted: true,
          })
        );
        dispatch(actionMessage("The group was eliminated"));
      }
    });
  };
};
/**
 * Function used to take a group conversation and set it on view, this function initializes
 * a listener that will wait for more messages while the user is still in view
 *
 * @param {string} sConversationKey Group talk node identifier
 * @param {string} sGroupKey Group identifier
 * @param {string} sUserKey User identifier
 *
 * @author Leandro Curbelo
 */
export const actionGetMessages = (
  sConversationKey = null,
  sGroupKey = null,
  sUserKey = null
) => {
  return (dispatch) => {
    let oListener = null;
    if (sConversationKey === null)
      return dispatch(
        actionDispatch(Actions.GET_GROUP_DETAILS_MESSAGES, {
          data: null,
          listener: oListener,
        })
      );
    dispatch(actionActiveLoading());
    oListener = database
      .ref(
        `${Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB}${sConversationKey}`
      )
      .child("messages")
      .orderByChild("date")
      .limitToLast(Constants.LIMIT_MESSAGES);
    oListener.on("value", (aMessagesSnap) => {
      let aMessages = [];
      if (aMessagesSnap.exists())
        aMessagesSnap.forEach((oMessageSnap) => {
          let oMessage = oMessageSnap.val();
          aMessages.push(oMessage);
        });
      dispatch(
        actionDispatch(Actions.GET_GROUP_DETAILS_MESSAGES, {
          data: aMessages,
          listener: oListener,
        })
      );
      dispatch(actionDeactivateLoading());
      // This timeout prevents the time between sending the message and adding +1 to unread messages.
      setTimeout(() => {
        dispatch(
          actionCheckReadMessageGroup({
            accountId: sUserKey,
            groupId: sGroupKey,
          })
        );
      }, 1000);
    });
  };
};
/**
 * Function used to assign another main captain, in this way the old main captain can be retired
 *
 * @param {string} sGroupKey Group identifier.
 * @param {number} nGroupId Primary identifier of the group in the system (API).
 * @param {string} sNewCaptainKey User identifier that will be the new main captain.
 * @param {string} sUserKey User identifier who wants to leave the group and is the main captain.
 *
 * @author Leandro Curbelo
 */
export const actionAssignAnotherCaptainToLeave = (
  sGroupKey,
  nGroupId,
  sNewCaptainKey,
  sUserKey,
  oNotification
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    // We retired the old captain of the group (API)
    LeaveGroup(nGroupId)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        // We retired the old captain of the group (Firebase)
        database
          .ref(
            `${Constants.FIREBASE_CONFIG.NODE_GROUPS_DB}${sGroupKey}/users/${sUserKey}`
          )
          .remove()
          .then(() => {
            // We retired the old captain of the captains of the group (Fireabase)
            database
              .ref(
                `${Constants.FIREBASE_CONFIG.NODE_GROUPS_DB}${sGroupKey}/captains/${sUserKey}`
              )
              .remove()
              .then(() => {});
            // The new main captain is incorporated into the captains (In case it wasn't)
            database
              .ref(
                `${Constants.FIREBASE_CONFIG.NODE_GROUPS_DB}${sGroupKey}/captains/${sNewCaptainKey}`
              )
              .set(true);
            // It is verified that the data is found to send the notification
            if (oNotification) {
              let sDescription = `You are the new principal captain of the group`;
              // We added the new internal notification of the application about the assignment of the captain
              AddNotification(
                oNotification.nUserId,
                sDescription,
                NOTIFICATION_TYPE_NEW_CAPTAIN,
                nGroupId
              ).finally(() => {
                // We send the push notification of the new main captain role
                dispatch(
                  actionSendPushNotification(
                    oNotification.sGroupName,
                    sDescription,
                    oNotification.sPushId,
                    { type: NOTIFICATION_NEW_CAPTAIN_GROUP, id: sGroupKey }
                  )
                );
              });
            }
            // The new main captain is set to the group
            database
              .ref(
                `${Constants.FIREBASE_CONFIG.NODE_GROUPS_DB}${sGroupKey}/captain`
              )
              .set(sNewCaptainKey);
            // The group is removed from the user's node
            database
              .ref(
                `${Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB}${sUserKey}/groups/${sGroupKey}`
              )
              .remove()
              .catch((oError) => {});
            // Group conversation is taken
            GetDataGroup(sGroupKey, "conversation").then((sConversationKey) => {
              // He takes the name of the old main captain
              GetDataUser(sUserKey, "username").then((sUsername) => {
                if (sUsername.exists()) {
                  // The message is sent indicating that the old captain has left the group
                  let oMessageLastCapitan = {
                    sender: sGroupKey,
                    message: sUsername.val() + " has left the group",
                    date: Date.now(),
                    type: "text",
                  };
                  database
                    .ref(
                      `${
                        Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB
                      }${sConversationKey.val()}/messages`
                    )
                    .push(oMessageLastCapitan);
                }
              });
              // The name of the new main captain is taken
              GetDataUser(sNewCaptainKey, "username").then((sUsername) => {
                if (sUsername.exists()) {
                  // The message is sent indicating the new main captain of the group
                  let oMessageNewCapitan = {
                    sender: sGroupKey,
                    message: sUsername.val() + " is the new main captain",
                    date: Date.now(),
                    type: "text",
                  };
                  database
                    .ref(
                      `${
                        Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB
                      }${sConversationKey.val()}/messages`
                    )
                    .push(oMessageNewCapitan);
                }
              });
              dispatch(actionGetGroups(sUserKey));
              dispatch(actionDispatch(Actions.LEAVE_GROUPS_SUCCESS));
              dispatch(actionDeactivateLoading());
            });
          });
      });
  };
};
/**
 * Function that eliminates a group, this functionality must be called by the main captain of the group that you want to eliminate.
 *
 * @param {string} sGroupKey Group identifier.
 * @param {number} nGroupId Primary identifier of the group in the system (API).
 * @param {string} sUserKey User identifier who wants to leave the group and is the main captain.
 *
 * @author Leandro Curbelo
 */
export const actionDeleteGroup = (sGroupKey, nGroupId, sUserKey) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    // The system group (API) is removed
    DeleteGroup(nGroupId)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        // The list of keys of users who are members of the group is taken
        GetDataGroup(sGroupKey, "users").then((oListUsersSnap) => {
          // We iterate within the users
          oListUsersSnap.forEach((oUser) => {
            // The group node within the user's groups is removed
            database
              .ref(
                `${Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB}${oUser.key}/groups/${sGroupKey}`
              )
              .remove()
              .catch((oError) => {});
          });
        });
        // the conversation is taken
        GetDataGroup(sGroupKey, "conversation").then((sConversationKey) => {
          // The group conversation is deleted
          database
            .ref(
              `${
                Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB
              }${sConversationKey.val()}`
            )
            .remove()
            .then(() => {})
            .catch(() => {});
        });
        // Firebase group is removed
        database
          .ref(`${Constants.FIREBASE_CONFIG.NODE_GROUPS_DB}${sGroupKey}`)
          .remove()
          .then(() => {})
          .catch(() => {});
        // Groups are removed
        dispatch(actionGetGroups(sUserKey));
        dispatch(actionDeactivateLoading());
      });
  };
};
/**
 * Function that marks the messages as read so that the update is carried out in the header properly
 *
 * @author Leandro Curbelo
 */
export const actionReadMessageActualGroup = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.GROUP_DETAILS_READ_MESSAGES));
  };
};
