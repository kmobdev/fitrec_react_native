import * as firebase from "firebase";
//import firebase from "firebase/app";
import { Constants } from "../../Constants";
import { UserProfile } from "./ImageServices";

!firebase.apps.length
  ? firebase.initializeApp(Constants.FIREBASE_CONFIG)
  : firebase.app();

export const authentication = firebase.auth();
export const oStorage = firebase.storage();
export const oFirebase = firebase;
export const database = firebase.database();

// Functions corresponding to the User Accounts Node

/* Function that returns all the friends of the user suslerkey */
export const GetUserFriends = (sUserKey) => {
  return database
    .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey + "/friends")
    .once("value");
};
/* Function that returns a certain friend of the User Suserkey, friend with the Key Sfriendkey */
export const GetUserFriend = (sUserKey, sFriendKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
        sUserKey +
        "/friends/" +
        sFriendKey
    )
    .once("value");
};
/* Function that returns a user account with key => suserkey */
export const GetUserAccount = (sUserKey) => {
  return database
    .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey)
    .once("value");
};
/* Function that returns the groups of the User Suserkey */
export const GetGroupsUser = (sUserKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
        sUserKey +
        "/" +
        Constants.FIREBASE_CONFIG.NODE_GROUPS_DB
    )
    .once("value");
};
/* Function that returns the groups of the User Suserkey */
export const GetGroupUser = (sUserKey, sGroupKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
        sUserKey +
        "/" +
        Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
        sGroupKey
    )
    .once("value");
};
/* Function that filters within all users by the name or username */
export const GetAllUsers = (sFilter) => {
  return database.ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB).once("value");
};
/* Function that returns friendship requests from the User Keep */
export const GetFriendRequests = (sUserKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey + "/friendRequests"
    )
    .once("value");
};
/* Function that returns friendship requests from the UserKey user */
export const GetFriendSent = (sUserKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey + "/requestsSent"
    )
    .once("value");
};
/* Function that returns the conversation with Key Conversation Key */
export const GetConversationUser = (sUserKey, sConversationKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
        sUserKey +
        "/conversations/" +
        sConversationKey
    )
    .once("value");
};
/* Function that returns user conversations sUserKey */
export const GetConversationsUser = (sUserKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey + "/conversations"
    )
    .once("value");
};
/* Function that returns the user's conversation with key sUserKey that his friend is sFriendKey */
export const GetConversationByFriend = (sUserKey, sFriendKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey + "/conversations"
    )
    .orderByChild("friend")
    .equalTo(sFriendKey)
    .limitToFirst(1)
    .once("value");
};
/* Function that returns the Push of an account with Key sUserKey */
export const GetIdPushUser = (sUserKey) => {
  return database
    .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey + "/idPush")
    .once("value");
};
/* Function that returns the field indicated in sData of an account with Key sUserKey */
export const GetDataUser = (sUserKey, sData) => {
  return database
    .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey + "/" + sData)
    .once("value");
};

// Functions corresponding to the node groups

/**
 * Function that returns the group with Key sGroupKey
 *
 * @param {string} sGroupKey Group key
 */
export const GetGroup = (sGroupKey) => {
  return database
    .ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB + sGroupKey)
    .once("value");
};
/**
 * Function that users of the group with Key sGroupKey returns
 *
 * @param {string} sGroupKey Group key
 */
export const GetUsersGroup = (sGroupKey) => {
  return database
    .ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB + sGroupKey + "/users")
    .once("value");
};
/** Function that returns the group with the Fitrec sIdFitrec ID in its idFitrec field
 *
 * @param {string} sGroupKey Group key
 */
export const GetGroupByIdFitrec = (sGroupKey) => {
  return database
    .ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB)
    .orderByChild("id")
    .equalTo(sGroupKey)
    .limitToFirst(1)
    .once("value");
};
/**
 * Function that returns the field indicated in sData of a group with Key sGroupKey
 *
 * @param {string} sGroupKey Group key
 * @param {string} sData Name of the field you want to consult
 */
export const GetDataGroup = (sGroupKey, sData) => {
  return database
    .ref(Constants.FIREBASE_CONFIG.NODE_GROUPS_DB + sGroupKey + "/" + sData)
    .once("value");
};
/**
 * Returning the sUserKey user of the NODE Capitan of the sGroupKey Group
 *
 * @param {string} sGroupKey
 * @param {string} sUserKey
 */
export const IsCaptain = (sGroupKey, sUserKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_GROUPS_DB +
        sGroupKey +
        "/captains/" +
        sUserKey
    )
    .once("value");
};

// Functions corresponding to the node group conversations

/* Function that returns the group with Key sConversationKey */
export const GetConversationGroup = (sConversationKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_GROUPS_DB + sConversationKey
    )
    .child("messages")
    .orderByChild("date")
    .limitToLast(Constants.LIMIT_MESSAGES)
    .once("value");
};

// Functions corresponding to the conversations node

/* Function that returns the conversation with Key sConversationKey */
export const GetConversation = (sConversationKey) => {
  return database
    .ref(Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB + sConversationKey)
    .once("value");
};
/* Function that returns the users of a conversation with Key sConversationKey */
export const GetUsersConversation = (sConversationKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
        sConversationKey +
        "/users"
    )
    .once("value");
};
/* Function that returns the messages of a conversation with Key sConversationKey */
export const GetMessagesConversation = (sConversationKey) => {
  return database
    .ref(
      Constants.FIREBASE_CONFIG.NODE_CONVERSATIONS_DB +
        sConversationKey +
        "/messages"
    )
    .orderByChild("date")
    .limitToLast(Constants.LIMIT_MESSAGES)
    .once("value");
};
