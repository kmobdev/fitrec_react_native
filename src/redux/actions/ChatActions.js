import {
  database,
  GetConversationsUser,
  GetUserAccount,
  GetUsersConversation,
  GetMessagesConversation,
  GetConversationByFriend,
  GetUserFriends,
  GetIdPushUser,
  GetDataUser,
} from "../services/FirebaseServices";
import {
  Actions,
  Constants,
  MESSAGE_ERROR,
  NOTIFICATION_TYPE_GROUP_CHAT,
  SEND_MESSAGE_TYPES,
} from "../../Constants";
import moment from "moment/min/moment-with-locales";
import OneSignal from "react-native-onesignal";
import {
  actionDispatch,
  actionMessage,
  actionDeactivateLoading,
  actionActiveLoading,
} from "./SharedActions";
import { GetGifs, GetStickers } from "../services/ChatServices";
import { UploadImageConversation } from "../services/ImageServices";
import { AddNotification } from "../services/NotificationServices";
import { NOTIFICATION_MESSAGE } from "../../constants/Notifications";

/**
 * Function that sends a message to the chat one to one
 *
 * @param {key, name} oSender Information of the user who sends the message
 * @param {string} sMessage message text
 * @param {string} sType Type of message being sent
 * @param {string} sFriendKey Key of the user friend recipient of the message
 * @param {string || null} sConversationKey Information of the user who sends the message
 * @param {{height, width, giphyId, lat, lon} || null} oData Extra information of the message, if it is a gif or location type
 *
 */
export const actionSendMessage = (
  oSender,
  sMessage,
  sType,
  sFriendKey,
  sConversationKey = null,
  oData = null,
  bRefresh = false
) => {
  return (dispatch) => {
    let dNow = Date.now(),
      oMessage = {
        sender: oSender.key,
        message: sMessage,
        date: dNow,
        type: sType,
      };
    switch (sType) {
      case SEND_MESSAGE_TYPES.GIF:
        oMessage.height = oData ? oData.height : 200;
        oMessage.width = oData ? oData.width : 200;
        oMessage.giphyId = oData.giphyId;
        oMessage.isSticker = oData.isSticker;
        break;
      case SEND_MESSAGE_TYPES.LOCATION:
        oMessage.lat = oData.lat;
        oMessage.lon = oData.lon;
        break;
      default:
        break;
    }
    if (null === sConversationKey || undefined === sConversationKey) {
      sConversationKey = database
        .ref(Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB)
        .push({ dateCreated: Date() }).key;
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
            sConversationKey +
            "/users/" +
            oMessage.sender
        )
        .set(true);
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
            sConversationKey +
            "/users/" +
            sFriendKey
        )
        .set(true);
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
            sFriendKey +
            "/conversations/" +
            sConversationKey
        )
        .set({
          messagesRead: 0,
          friend: oMessage.sender,
        });
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
            oMessage.sender +
            "/conversations/" +
            sConversationKey
        )
        .set({
          messagesRead: 0,
          friend: sFriendKey,
        });
      dispatch(actionSetKeyConversation(sConversationKey));
      dispatch(actionGetMessages(sConversationKey, oSender.key));
    }
    if (sType === SEND_MESSAGE_TYPES.IMAGE) {
      dispatch(actionActiveLoading());
      UploadImageConversation(sConversationKey, oMessage.message)
        .then((oSuccess) => {
          oMessage.message = oSuccess.data;
          database
            .ref(
              Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
                sConversationKey +
                "/messages"
            )
            .push(oMessage);
          dispatch(
            actionDispatch(Actions.SEND_MESSAGE_SUCCESS, { sendImage: true })
          );
          dispatch(
            sendNotificationMessage(
              sConversationKey,
              oMessage,
              oSender.name,
              bRefresh,
              1
            )
          );
          dispatch(actionDeactivateLoading());
        })
        .catch(() => {
          dispatch(actionMessage(MESSAGE_ERROR));
        });
    } else {
      // If the conversation identifier comes by parameter, the message is set directly in the message list
      database
        .ref(
          Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
            sConversationKey +
            "/messages"
        )
        .push(oMessage);
      dispatch(actionDispatch(Actions.SEND_MESSAGE_SUCCESS));
      dispatch(
        sendNotificationMessage(
          sConversationKey,
          oMessage,
          oSender.name,
          bRefresh,
          1
        )
      );
    }
  };
};
/**
 * Function that sends the message to the group chat.
 *
 * @param {conversationId, message} data
 */
export const actionSendMessageChatGroup = (
  oSender,
  sMessage,
  sType,
  sConversationKey = null,
  oData = null
) => {
  return (dispatch) => {
    let dNow = Date.now(),
      oMessage = {
        sender: oSender.key,
        message: sMessage,
        date: dNow,
        type: sType,
      };
    switch (sType) {
      case SEND_MESSAGE_TYPES.GIF:
        oMessage.height = oData ? oData.height : 200;
        oMessage.width = oData ? oData.width : 200;
        oMessage.giphyId = oData.giphyId;
        oMessage.isSticker = oData.isSticker;
        break;
      case SEND_MESSAGE_TYPES.LOCATION:
        oMessage.lat = oData.lat;
        oMessage.lon = oData.lon;
        break;
      default:
        break;
    }
    if (sConversationKey) {
      if (sType === SEND_MESSAGE_TYPES.IMAGE) {
        UploadImageConversation(sConversationKey, oMessage.message)
          .then((oSuccess) => {
            oMessage.message = oSuccess.data;
            // If the conversation identifier comes by parameter, the message is set directly in the message list
            database
              .ref(
                Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
                  sConversationKey +
                  "/messages"
              )
              .push(oMessage);
            dispatch(
              sendNotificationMessage(
                sConversationKey,
                oMessage,
                oSender.name,
                false,
                2
              )
            );
            dispatch(actionDeactivateLoading());
          })
          .catch(() => {
            dispatch(actionMessage(MESSAGE_ERROR));
          });
      } else {
        // If the conversation identifier comes by parameter, the message is set directly in the message list
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
              sConversationKey +
              "/messages"
          )
          .push(oMessage);
        dispatch(
          sendNotificationMessage(
            sConversationKey,
            oMessage,
            oSender.name,
            false,
            2
          )
        );
        dispatch(actionDeactivateLoading());
      }
    } else dispatch(actionMessage(MESSAGE_ERROR));
  };
};
/**
 * Function in charge of sending push notifications to the users of a conversation
 *
 * @param {conversation key} sConversationId
 * @param {Message with its fields} oMessage
 * @param {Name that will appear in the push notification} sUserSendName
 * @param {Conversation type (1 common message, 2 group chat messages)} nTypeConversation
 */
const sendNotificationMessage = (
  sConversationId,
  oMessage,
  sUserSendName,
  bIsRefresh,
  nTypeConversation
) => {
  return (dispatch) => {
    // The users of the conversation are taken
    GetUsersConversation(sConversationId).then((aListUsers) => {
      aListUsers.forEach((sUserKey) => {
        if (sUserKey.key !== oMessage.sender) {
          // In particular, the number of unread messages from the user's conversation is taken and one is added
          database
            .ref(
              Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                sUserKey.key +
                "/conversations/" +
                sConversationId +
                "/messagesRead"
            )
            .once("value")
            .then((oMessagesReadSnap) => {
              if (oMessagesReadSnap.exists())
                database
                  .ref(
                    Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                      sUserKey.key +
                      "/conversations/" +
                      sConversationId
                  )
                  .update({ messagesRead: oMessagesReadSnap.val() + 1 });
              GetIdPushUser(sUserKey.key).then((sPushId) => {
                var sMessage;
                switch (oMessage.type) {
                  case SEND_MESSAGE_TYPES.GIF:
                    sMessage = oMessage.isSticker
                      ? "Sent you a sticker"
                      : "Sent you a gif";
                    break;
                  case SEND_MESSAGE_TYPES.LOCATION:
                    sMessage = "Sent you a location";
                    break;
                  case SEND_MESSAGE_TYPES.IMAGE:
                    sMessage = "Sent you a image";
                    break;
                  case SEND_MESSAGE_TYPES.TEXT:
                    sMessage = oMessage.message;
                    break;
                  default:
                    sMessage = "Sent you a message";
                    break;
                }
                var sIdPushFriend = sPushId;
                if (undefined !== sIdPushFriend && null !== sIdPushFriend) {
                  var oDataNotification = {
                    headings: { en: sUserSendName },
                    contents: { en: sMessage },
                    android_group: "Request",
                    ios_badgeType: "Increase",
                    ios_badgeCount: 1,
                    data: { type: NOTIFICATION_MESSAGE, id: sConversationId },
                    include_player_ids: [sIdPushFriend],
                  };
                  const jsonString = JSON.stringify(oDataNotification);
                  console.log(" sIdPushFriend =====>>>>>> ", jsonString);
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
                // One-on-one type of conversation
                if (1 === nTypeConversation) {
                  if (bIsRefresh)
                    dispatch(
                      actionGetConversationFriend({
                        friendKey: sUserKey.key,
                        accountId: oMessage.sender,
                      })
                    );
                  else dispatch(actionListMessages(oMessage.sender));
                }
              });
            });
        } else
          dispatch(
            actionConfirmMessageRead({
              accountId: sUserKey.key,
              conversation: sConversationId,
            })
          );
      });
      // Group chat conversation type
      if (2 === nTypeConversation) {
        dispatch(actionMessage("Message Sent Succesfuly"));
        dispatch(actionListMessages(oMessage.sender));
      }
    });
  };
};
/**
 * Function that sends multiple messages
 *
 * @param {
 *          accountId: string,
 *          conversationId: string/null,
 *          message: string,
 *          type: string,
 *          name: string,
 *          participants: [key],
 * } data
 */
export const actionSendMessageAll = (data) => {
  return (dispatch) => {
    data.participants.forEach((sKeyParticipant) => {
      GetConversationByFriend(data.accountId, sKeyParticipant).then(
        (oConversationSnap) => {
          if (oConversationSnap.exists()) {
            oConversationSnap.forEach((oConversationElement) => {
              dispatch(
                actionSendMessage(
                  { key: data.accountId, name: data.name },
                  data.message,
                  data.type,
                  sKeyParticipant,
                  oConversationElement.key
                )
              );
            });
          } else {
            dispatch(
              actionSendMessage(
                { key: data.accountId, name: data.name },
                data.message,
                data.type,
                sKeyParticipant,
                null
              )
            );
          }
        }
      );
    });
  };
};

export const actionSendMessageSuccess = () => ({
  type: Actions.SEND_MESSAGE_SUCCESS,
});

export const actionSendMessageError = (data) => ({
  type: Actions.SEND_MESSAGE_ERROR,
  data: data,
});

export const actionListMessages = (sUserKey) => {
  return (dispatch) => {
    GetConversationsUser(sUserKey)
      .then((aListConversations) => {
        if (aListConversations.exists()) {
          let nCount = 0,
            aMessagesDispatch = [];
          aListConversations.forEach((oConversationKey) => {
            database
              .ref(
                Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
                  oConversationKey.key +
                  "/name"
              )
              .once("value")
              .then((sNameGroupSnap) => {
                database
                  .ref(
                    Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
                      oConversationKey.key +
                      "/messages"
                  )
                  .orderByChild("date")
                  .limitToLast(1)
                  .once("value")
                  .then((aLastMessage) => {
                    let oMessage = null,
                      nMessageRead =
                        aListConversations.val()[oConversationKey.key]
                          .messagesRead;
                    aLastMessage.forEach((oMessageSnap) => {
                      oMessage = oMessageSnap.val();
                    });
                    let sLastMessage = "";
                    if (oMessage) {
                      const sInitalMessage = sNameGroupSnap.exists()
                          ? "They sent"
                          : "Sent",
                        bIsSender = oMessage.sender === sUserKey;
                      switch (oMessage.type) {
                        case SEND_MESSAGE_TYPES.IMAGE:
                          sLastMessage = bIsSender
                            ? "You sent a photo message."
                            : sInitalMessage + " you sent a photo message.";
                          sLastMessage = "You sent a photo message.";
                          break;
                        case SEND_MESSAGE_TYPES.LOCATION:
                          sLastMessage = bIsSender
                            ? "You sent a location."
                            : sInitalMessage + " You sent a location.";
                          sLastMessage = "You sent a location.";
                          break;
                        case SEND_MESSAGE_TYPES.GIF:
                          let sTypeGif = oMessage.isSticker ? "sticker" : "gif";
                          sLastMessage = bIsSender
                            ? `You sent a ${sTypeGif}.`
                            : sInitalMessage + ` you sent a ${sTypeGif}.`;
                          break;
                        case SEND_MESSAGE_TYPES.TEXT:
                        default:
                          sLastMessage = bIsSender
                            ? "You: " + oMessage.message
                            : oMessage.message;
                          break;
                      }
                    }
                    if (sNameGroupSnap.exists()) {
                      GetUsersConversation(oConversationKey.key).then(
                        (aListUsersGroup) => {
                          var aUsers = [],
                            nCountUsers = 0;
                          aListUsersGroup.forEach((sUserKey) => {
                            aUsers.push(sUserKey.key);
                          });
                          var oConversationChat = {
                            key: oConversationKey.key,
                            type: 2,
                            messagesRead: nMessageRead,
                            name: sNameGroupSnap.val(),
                            users: [],
                            message: sLastMessage,
                            time: oMessage
                              ? moment(oMessage.date).format("LT")
                              : "",
                            date: oMessage
                              ? moment(oMessage.date).format("DD MMM")
                              : "",
                            order: oMessage ? moment(oMessage.date) : null,
                          };
                          aUsers.forEach((sKeyUser) => {
                            database
                              .ref(
                                Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                                  sKeyUser +
                                  "/name"
                              )
                              .once("value")
                              .then((sName) => {
                                database
                                  .ref(
                                    Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                                      sKeyUser +
                                      "/username"
                                  )
                                  .once("value")
                                  .then((sUserName) => {
                                    database
                                      .ref(
                                        Constants.FIREBASE_CONFIG
                                          .NODE_ACCOUNTS_DB +
                                          sKeyUser +
                                          "/image"
                                      )
                                      .once("value")
                                      .then((sProfilePic) => {
                                        database
                                          .ref(
                                            Constants.FIREBASE_CONFIG
                                              .NODE_ACCOUNTS_DB +
                                              sKeyUser +
                                              "/id"
                                          )
                                          .once("value")
                                          .then((sIdFitrec) => {
                                            nCountUsers++;
                                            var oUser = {
                                              key: sKeyUser,
                                              name: sName.val(),
                                              username: sUserName.val(),
                                              image: sProfilePic.exists()
                                                ? sProfilePic.val()
                                                : null,
                                              id: sIdFitrec.val(),
                                            };
                                            oConversationChat.users.push(oUser);
                                            if (
                                              aListUsersGroup.numChildren() ===
                                              nCountUsers
                                            ) {
                                              aMessagesDispatch.push(
                                                oConversationChat
                                              );
                                              aMessagesDispatch.sort(function (
                                                a,
                                                b
                                              ) {
                                                if (a.order < b.order) return 1;
                                                if (a.order > b.order)
                                                  return -1;
                                                return 0;
                                              });
                                              nCount++;
                                              if (
                                                nCount ===
                                                aListConversations.numChildren()
                                              )
                                                dispatch(
                                                  actionDispatch(
                                                    Actions.GET_LIST_MESSAGES_SUCCESS,
                                                    {
                                                      messages:
                                                        aMessagesDispatch,
                                                    }
                                                  )
                                                );
                                            }
                                          });
                                      });
                                  });
                              });
                          });
                        }
                      );
                    } else {
                      GetUsersConversation(oConversationKey.key).then(
                        (aUsers) => {
                          if (aUsers.exists()) {
                            aUsers.forEach((sKeyUser) => {
                              if (sKeyUser.key !== sUserKey) {
                                database
                                  .ref(
                                    Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                                      sKeyUser.key +
                                      "/name"
                                  )
                                  .once("value")
                                  .then((sName) => {
                                    database
                                      .ref(
                                        Constants.FIREBASE_CONFIG
                                          .NODE_ACCOUNTS_DB +
                                          sKeyUser.key +
                                          "/username"
                                      )
                                      .once("value")
                                      .then((sUserName) => {
                                        database
                                          .ref(
                                            Constants.FIREBASE_CONFIG
                                              .NODE_ACCOUNTS_DB +
                                              sKeyUser.key +
                                              "/image"
                                          )
                                          .once("value")
                                          .then((sProfilePic) => {
                                            database
                                              .ref(
                                                Constants.FIREBASE_CONFIG
                                                  .NODE_ACCOUNTS_DB +
                                                  sKeyUser.key +
                                                  "/id"
                                              )
                                              .once("value")
                                              .then((nIdFitrec) => {
                                                if (sName.exists()) {
                                                  if (oMessage) {
                                                    var oConversationData = {
                                                      key: oConversationKey.key,
                                                      type: 1,
                                                      name: sName.val(), // Nombre del chat
                                                      messagesRead:
                                                        nMessageRead, // Cantidad de mensajes no leidos
                                                      users: [
                                                        {
                                                          id: nIdFitrec.val(),
                                                          key: sKeyUser.key,
                                                          name: sName.val(),
                                                          username:
                                                            sUserName.val(),
                                                          image:
                                                            sProfilePic.exists()
                                                              ? sProfilePic.val()
                                                              : null,
                                                        },
                                                      ],
                                                      message: sLastMessage,
                                                      time: oMessage
                                                        ? moment(
                                                            oMessage.date
                                                          ).format("LT")
                                                        : "",
                                                      date: oMessage
                                                        ? moment(
                                                            oMessage.date
                                                          ).format("DD MMM")
                                                        : "",
                                                      image:
                                                        sProfilePic.exists()
                                                          ? sProfilePic.val()
                                                          : null,
                                                      order: oMessage
                                                        ? moment(oMessage.date)
                                                        : null,
                                                    };
                                                    aMessagesDispatch.push(
                                                      oConversationData
                                                    );
                                                  }
                                                  aMessagesDispatch.sort(
                                                    function (a, b) {
                                                      if (a.order < b.order)
                                                        return 1;
                                                      if (a.order > b.order)
                                                        return -1;
                                                      return 0;
                                                    }
                                                  );
                                                }
                                                nCount++;
                                                if (
                                                  nCount ===
                                                  aListConversations.numChildren()
                                                )
                                                  dispatch(
                                                    actionDispatch(
                                                      Actions.GET_LIST_MESSAGES_SUCCESS,
                                                      {
                                                        messages:
                                                          aMessagesDispatch,
                                                      }
                                                    )
                                                  );
                                              });
                                          });
                                      });
                                  });
                              }
                            });
                          } else {
                            database
                              .ref(
                                `${Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB}${sUserKey}/conversations/${oConversationKey.key}`
                              )
                              .remove();
                            nCount++;
                            if (nCount === aListConversations.numChildren())
                              dispatch(
                                actionDispatch(
                                  Actions.GET_LIST_MESSAGES_SUCCESS,
                                  { messages: aMessagesDispatch }
                                )
                              );
                          }
                        }
                      );
                    }
                  });
              });
          });
        } else
          dispatch(
            actionDispatch(Actions.GET_LIST_MESSAGES_SUCCESS, { messages: [] })
          );
      })
      .catch();
  };
};

export const actionCountMessageRead = (data) => {
  return (dispatch) => {
    GetConversationsUser(data.accountId).then((aListConversations) => {
      var nMessageRead = 0,
        nCount = 0;
      aListConversations.forEach((oConversation) => {
        nCount++;
        nMessageRead += oConversation.val().messagesRead;
        if (aListConversations.numChildren() === nCount) {
          dispatch(
            actionCountMessageReadSuccess({
              messageRead: nMessageRead,
            })
          );
          dispatch(actionListMessages(data.accountId));
        }
      });
    });
  };
};

export const actionCountMessageReadSuccess = (data) => ({
  type: Actions.GET_COUNT_MESSAGES_READ_SUCCESS,
  data: data,
});

export const actionConfirmMessageRead = (data) => {
  return (dispatch) => {
    database
      .ref(
        Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
          data.accountId +
          "/conversations/" +
          data.conversation
      )
      .update({
        messagesRead: 0,
      })
      .then((oSuccess) => {
        dispatch(actionCountMessageRead({ accountId: data.accountId }));
        dispatch(actionListMessages(data.accountId));
      });
  };
};

export const actionGetUserFriends = (data) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    GetUserFriends(data.accountId).then((aFriends) => {
      let nCount = 0,
        nLenght = aFriends.numChildren(),
        aFriendsDispatch = [];
      if (aFriends.exists()) {
        aFriends.forEach((sFriendKey) => {
          GetDataUser(sFriendKey.key, "id").then((nId) => {
            GetDataUser(sFriendKey.key, "name").then((sName) => {
              GetDataUser(sFriendKey.key, "username").then((sUsername) => {
                GetDataUser(sFriendKey.key, "image").then((sImage) => {
                  if (sName.exists())
                    GetConversationByFriend(
                      data.accountId,
                      sFriendKey.key
                    ).then((oConversationUserSnap) => {
                      let oConversationData = {
                        id: nId.val(),
                        key: sFriendKey.key,
                        name: sName.val(),
                        username: sUsername.val(),
                        image: sImage.exists() ? sImage.val() : null,
                        conversation: null,
                      };
                      if (
                        oConversationUserSnap.exists() &&
                        oConversationUserSnap.numChildren() > 0
                      ) {
                        oConversationUserSnap.forEach((oConversationSnap) => {
                          oConversationData.conversation =
                            oConversationSnap.key;
                          aFriendsDispatch.push(oConversationData);
                          nCount++;
                          if (nCount === nLenght) {
                            dispatch(actionDeactivateLoading());
                            dispatch(
                              actionDispatch(
                                Actions.GET_LIST_USER_FRIENDS_SUCCESS,
                                aFriendsDispatch
                              )
                            );
                          }
                        });
                      } else {
                        aFriendsDispatch.push(oConversationData);
                        nCount++;
                        if (nCount === nLenght) {
                          dispatch(actionDeactivateLoading());
                          dispatch(
                            actionDispatch(
                              Actions.GET_LIST_USER_FRIENDS_SUCCESS,
                              aFriendsDispatch
                            )
                          );
                        }
                      }
                    });
                  else {
                    nCount++;
                    if (nCount === nLenght) {
                      dispatch(actionDeactivateLoading());
                      dispatch(
                        actionDispatch(
                          Actions.GET_LIST_USER_FRIENDS_SUCCESS,
                          aFriendsDispatch
                        )
                      );
                    }
                  }
                });
              });
            });
          });
        });
      } else {
        dispatch(actionDeactivateLoading());
        dispatch(
          actionDispatch(
            Actions.GET_LIST_USER_FRIENDS_SUCCESS,
            aFriendsDispatch
          )
        );
      }
    });
  };
};

export const actionGetConversationFriend = (data) => {
  return (dispatch) => {
    GetDataUser(data.friendKey, "name")
      .then((sName) => {
        GetDataUser(data.friendKey, "username").then((sUserName) => {
          GetDataUser(data.friendKey, "image").then((sProfilePic) => {
            GetDataUser(data.accountId, "image").then((sMyProfilePicSnap) => {
              GetConversationByFriend(data.accountId, data.friendKey).then(
                (oConversationUserSnap) => {
                  if (sName.exists()) {
                    var oConversationData = {
                      userFriend: sName.val(),
                      image: sProfilePic.exists() ? sProfilePic.val() : null,
                      myProfilePic: sMyProfilePicSnap.exists()
                        ? sMyProfilePicSnap.val()
                        : null,
                      userFriendKey: data.friendKey,
                      accountId: data.accountId,
                      usernameFriend: sUserName.val(),
                    };
                    if (
                      oConversationUserSnap.exists() &&
                      oConversationUserSnap.numChildren() > 0
                    ) {
                      oConversationUserSnap.forEach((oConversationSnap) => {
                        GetMessagesConversation(oConversationSnap.key).then(
                          (aListMessages) => {
                            var aMessages = [];
                            if (aListMessages.exists())
                              aListMessages.forEach((oMessageSnap) => {
                                var oMessage = oMessageSnap.val();
                                aMessages.push(oMessage);
                              });
                            oConversationData = {
                              ...oConversationData,
                              conversations: aMessages,
                              conversation: oConversationSnap.key,
                            };
                            dispatch(
                              actionGetConversationFriendSuccess({
                                conversation: oConversationData,
                              })
                            );
                          }
                        );
                      });
                    } else {
                      oConversationData = {
                        ...oConversationData,
                        conversations: [],
                        conversation: null,
                      };
                      dispatch(
                        actionGetConversationFriendSuccess({
                          conversation: oConversationData,
                        })
                      );
                    }
                  } else {
                    dispatch(
                      actionGetConversationFriendSuccess({
                        conversation: null,
                      })
                    );
                  }
                }
              );
            });
          });
        });
      })
      .catch((oError) => {
        dispatch(
          actionGetConversationFriendSuccess({
            conversation: null,
          })
        );
      });
  };
};

export const actionDeleteConversation = (
  sAccountKey,
  sConversationKey,
  nType = 1
) => {
  return (dispatch) => {
    if (nType === 1) {
      database
        .ref(
          `${Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB}${sAccountKey}/conversations/${sConversationKey}`
        )
        .once("value")
        .then((oSuccess) => {
          if (oSuccess.exists()) {
            let oConversation = oSuccess.val();
            database
              .ref(
                `${Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB}${sAccountKey}/conversations/${sConversationKey}`
              )
              .remove();
            database
              .ref(
                `${Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB}${oConversation.friend}/conversations/${sConversationKey}`
              )
              .remove();
            database
              .ref(
                `${Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB}${sConversationKey}`
              )
              .remove();
            dispatch(actionListMessages(sAccountKey));
          }
        });
    } else {
      database
        .ref(
          `${Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB}${sConversationKey}/users`
        )
        .once("value")
        .then((aUsersList) => {
          if (aUsersList.exists()) {
            aUsersList.forEach((oUser) => {
              database
                .ref(
                  `${Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB}${oUser.key}/conversations/${sConversationKey}`
                )
                .remove();
            });
            database
              .ref(
                `${Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB}${sConversationKey}`
              )
              .remove();
            dispatch(actionListMessages(sAccountKey));
          }
        });
    }
  };
};

export const actionGetConversationFriendSuccess = (data) => ({
  type: Actions.GET_CONVERSATION_WITH_FRIEND_SUCCESS,
  data: data,
});
/**
 * Function that adds a new group chat, it will first add the conversation to the user who creates it and continue to do so
 * the same for the other users of the group.
 *
 * @param {accountId, members} data
 *  - accountId: Key of the creator user account in Firebase
 *  - accountName: Group creator name
 *  - members: chat members
 *  - name: Group name
 */
export const actionCreateChatGroup = (
  sGroupName,
  sUserKey,
  sUserName,
  aMemebers
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    let dNow = Date.now();
    let oConversationNodo = {
        dateCreated: Date(),
        userCreated: sUserKey,
        name: sGroupName,
      },
      oConversationUser = {
        messagesRead: 1,
      };
    database
      .ref(Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB)
      .push(oConversationNodo)
      .then((oSuccess) => {
        let sNotificationDescription =
          sUserName +
          " has created a new group chat and added you: " +
          sGroupName;
        aMemebers.forEach((oMember) => {
          database
            .ref(
              Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
                oSuccess.key +
                "/users/" +
                oMember.key
            )
            .set(true);
          database
            .ref(
              Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                oMember.key +
                "/conversations/" +
                oSuccess.key
            )
            .set(oConversationUser);
          if (oMember.key !== sUserKey)
            AddNotification(
              oMember.id,
              sNotificationDescription,
              NOTIFICATION_TYPE_GROUP_CHAT,
              null
            )
              .then(() => {})
              .catch(() => {});
        });
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
              oSuccess.key +
              "/messages"
          )
          .push({
            date: dNow,
            message:
              sUserName + ' has created this group chat: "' + sGroupName + '"',
            sender: oSuccess.key,
            type: "text",
          });
        dispatch(actionListMessages(sUserKey));
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
 * Function that obtains GIFs.
 *
 * @param {sSearch} data
 */
export const actionGetGiphy = (sSearch) => {
  return (dispatch) => {
    try {
      sSearch = "" !== sSearch ? sSearch : Constants.GIPHY_CONFIG.searchDefault;
      GetGifs(sSearch)
        .then((oSuccess) => {
          var aGifs = [];
          oSuccess.data.forEach((oGif) => {
            aGifs.push({
              id: oGif.id,
              image: oGif.images.original.url,
              width: +oGif.images.original.width,
              height: +oGif.images.original.height,
            });
          });
          dispatch(actionDispatch(Actions.GIFS, { gifs: aGifs }));
        })
        .catch(() => {
          dispatch(
            actionMessage(
              "An error occurred when consulting the GIFs, please try again later"
            )
          );
        });
      GetStickers(sSearch)
        .then((oSuccess) => {
          var aStickers = [];
          oSuccess.data.forEach((oSticker) => {
            aStickers.push({
              id: oSticker.id,
              image: oSticker.images.original.url,
              width: +oSticker.images.original.width,
              height: +oSticker.images.original.height,
            });
          });
          dispatch(actionDispatch(Actions.STICKERS, { stickers: aStickers }));
        })
        .catch(() => {
          dispatch(
            actionMessage(
              "An error occurred when consulting the GIFs, please try again later"
            )
          );
        });
    } catch (error) {
      dispatch(actionDispatch(Actions.GIFS, { gifs: [] }));
    }
  };
};
/**
 * Function that inserts in redux the data of the conversation that is being visualized
 *
 * @param {object} oConversation conversation data
 *
 * @author Leandro Curbelo
 */
export const actionSetConversation = (oConversation) => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.SET_CONVERSATION, oConversation));
  };
};
/**
 * Function that inserts in redux the key of the new conversation
 *
 * @param {object} oConversation conversation data
 *
 * @author Leandro Curbelo
 */
export const actionSetKeyConversation = (sConversationKey) => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.SET_CONVERSATION_KEY, sConversationKey));
  };
};
/**
 * Function used to take a conversation and set it in the view, this function initializes
 * a listener that will wait for more messages while the user is still in view
 *
 * @param {string} sConversationKey Group talk node identifier
 * @param {string} sGroupKey Group identifier
 * @param {string} sUserKey User identifier
 *
 * @author Leandro Curbelo
 */
export const actionGetMessages = (sConversationKey = null, sUserKey = null) => {
  return (dispatch) => {
    let oListener = null;
    if (sConversationKey === null)
      return dispatch(
        actionDispatch(Actions.GET_CONVERSATION, {
          data: null,
          listener: oListener,
        })
      );
    dispatch(actionActiveLoading());
    oListener = database
      .ref(
        `${Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB}${sConversationKey}`
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
        actionDispatch(Actions.GET_CONVERSATION, {
          data: aMessages,
          listener: oListener,
        })
      );
      dispatch(actionDeactivateLoading());
      // This timeout prevents the time between sending the message and adding +1 to unread messages.
      setTimeout(() => {
        dispatch(
          actionConfirmMessageRead({
            accountId: sUserKey,
            conversation: sConversationKey,
          })
        );
      }, 1000);
    });
  };
};
/**
 * Action that occurs when getting a push notification of a new message, it sets the
 * conversation with the data to be able to be properly displayed on the message screen. This function is
 * generates to avoid the waiting period from when the push notification arrives, until it loads the
 * conversations and finally load the messages of it, the function skips the step of loading all
 * conversations and optimize that waiting time.
 *
 * @param {string} sConversationKey Key that identifies the node of the conversation
 *
 * @author Leandro Curbelo
 */
export const actionSetConversationToNotification = (sConversationKey) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    let oConversation = {
      key: sConversationKey,
      type: null,
      users: [],
    };
    database
      .ref(
        Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
          sConversationKey +
          "/name"
      )
      .once("value")
      .then((sNameGroupSnap) => {
        oConversation.type = sNameGroupSnap.exists() ? 2 : 1;
        GetUsersConversation(sConversationKey).then((aListUsersGroup) => {
          var aUsers = [],
            nCountUsers = 0;
          aListUsersGroup.forEach((sUserKey) => {
            aUsers.push(sUserKey.key);
          });
          aUsers.forEach((sKeyUser) => {
            database
              .ref(
                Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sKeyUser + "/name"
              )
              .once("value")
              .then((sName) => {
                database
                  .ref(
                    Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                      sKeyUser +
                      "/username"
                  )
                  .once("value")
                  .then((sUserName) => {
                    database
                      .ref(
                        Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                          sKeyUser +
                          "/image"
                      )
                      .once("value")
                      .then((sProfilePic) => {
                        database
                          .ref(
                            Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                              sKeyUser +
                              "/id"
                          )
                          .once("value")
                          .then((sIdFitrec) => {
                            nCountUsers++;
                            var oUser = {
                              key: sKeyUser,
                              name: sName.val(),
                              username: sUserName.val(),
                              image: sProfilePic.exists()
                                ? sProfilePic.val()
                                : null,
                              id: sIdFitrec.val(),
                            };
                            oConversation.users.push(oUser);
                            if (aListUsersGroup.numChildren() === nCountUsers) {
                              dispatch(actionDeactivateLoading());
                              dispatch(actionSetConversation(oConversation));
                            }
                          });
                      });
                  });
              });
          });
        });
      });
  };
};
